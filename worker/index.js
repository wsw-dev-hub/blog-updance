/**
 * Worker do blog Up Dance — autenticação (magic link) + cadastro com D1 (double opt-in).
 *
 * Rotas:
 *   POST /api/auth/request          → envia o link de acesso (login de membro)
 *   GET  /api/auth/verify           → valida o token e cria a sessão
 *   GET  /api/auth/logout           → encerra a sessão
 *   GET  /api/me                    → usuário logado (ou 401)
 *   POST /api/newsletter/subscribe  → cadastro com confirmação (grava no D1, envia e-mail)
 *   GET  /api/newsletter/confirm    → confirma a inscrição (double opt-in)
 *   POST /api/newsletter            → inscrição simples antiga (KV) — usada pelo modal
 *   /membros/*                      → área protegida (exige sessão)
 *   resto                           → arquivos estáticos do dist/ (env.ASSETS)
 *
 * Bindings necessários: KV, DB (D1), ASSETS, vars MAIL_FROM, secret RESEND_API_KEY.
 * ESTE ARQUIVO RODA NO SERVIDOR — não use `document`/`window` aqui.
 */

const RESEND_API   = 'https://api.resend.com/emails';
const SESSION_TTL  = 60 * 60 * 24 * 7;
const MAGIC_TTL    = 60 * 15;
const COOLDOWN_TTL = 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/auth/request' && request.method === 'POST')
                                                  return pedirLink(request, url, env);
      if (pathname === '/api/auth/verify')         return verificarLink(request, url, env);
      if (pathname === '/api/auth/logout')         return fazerLogout(request, env);
      if (pathname === '/api/me')                  return quemSouEu(request, env);

      if (pathname === '/api/newsletter/subscribe' && request.method === 'POST')
                                                  return inscrever(request, url, env);
      if (pathname === '/api/newsletter/confirm')  return confirmar(request, url, env);

      if (pathname === '/api/newsletter' && request.method === 'POST')
                                                  return assinarNewsletterSimples(request, env);

      if (pathname.startsWith('/membros')) {
        const user = await getSession(request, env);
        if (!user) return Response.redirect(url.origin + '/?login=required', 302);
      }
    } catch (err) {
      return new Response('Erro interno: ' + err.message, { status: 500 });
    }

    return env.ASSETS.fetch(request);
  },
};

/* ───────────────────────── helpers ───────────────────────── */

function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map(b => b.toString(16).padStart(2, '0')).join('');
}

function cookie(name, value, maxAge) {
  const parts = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'];
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  return parts.join('; ');
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const m = header.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function emailValido(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

/* ───────────────────────── login (magic link) ───────────────────────── */

async function pedirLink(request, url, env) {
  let email = '';
  try { email = ((await request.json()).email || '').trim().toLowerCase(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const generica = json({ ok: true });
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  if (!await env.KV.get('allow:' + email)) return generica;
  if (await env.KV.get('cd:' + email)) return generica;
  await env.KV.put('cd:' + email, '1', { expirationTtl: COOLDOWN_TTL });

  const token = randomToken(32);
  await env.KV.put('magic:' + token, email, { expirationTtl: MAGIC_TTL });
  await enviarEmail(env, email, 'Seu link de acesso — Up Dance',
    emailLogin(url.origin + '/api/auth/verify?token=' + token));
  return generica;
}

async function verificarLink(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/?login=invalido', 302);
  const email = await env.KV.get('magic:' + token);
  if (!email) return Response.redirect(url.origin + '/?login=expirado', 302);
  await env.KV.delete('magic:' + token);

  const sid = randomToken(32);
  await env.KV.put('sess:' + sid, JSON.stringify({ email }), { expirationTtl: SESSION_TTL });
  return new Response(null, {
    status: 302,
    headers: { 'Location': url.origin + '/membros/', 'Set-Cookie': cookie('session', sid, SESSION_TTL) },
  });
}

async function getSession(request, env) {
  const sid = readCookie(request, 'session');
  if (!sid) return null;
  const raw = await env.KV.get('sess:' + sid);
  return raw ? JSON.parse(raw) : null;
}

async function fazerLogout(request, env) {
  const sid = readCookie(request, 'session');
  if (sid) await env.KV.delete('sess:' + sid);
  return new Response(null, {
    status: 302, headers: { 'Location': '/', 'Set-Cookie': cookie('session', '', 0) },
  });
}

async function quemSouEu(request, env) {
  const user = await getSession(request, env);
  return user ? json(user) : json(null, 401);
}

/* ───────────────────────── cadastro com D1 (double opt-in) ───────────────────────── */

async function inscrever(request, url, env) {
  let email = '', name = '';
  try {
    const b = await request.json();
    email = (b.email || '').trim().toLowerCase();
    name  = (b.name || '').trim().slice(0, 80);
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  const agora = new Date().toISOString();
  const token = randomToken(24);

  // já existe esse e-mail?
  const existente = await env.DB
    .prepare('SELECT status FROM subscribers WHERE email = ?').bind(email).first();

  if (existente && existente.status === 'confirmed') {
    return json({ ok: true, jaInscrito: true });
  }

  if (existente) {
    // reenvia: atualiza token e dados
    await env.DB.prepare(
      'UPDATE subscribers SET confirm_token = ?, name = ?, created_at = ? WHERE email = ?'
    ).bind(token, name, agora, email).run();
  } else {
    await env.DB.prepare(
      'INSERT INTO subscribers (email, name, status, confirm_token, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(email, name, 'pending', token, agora).run();
  }

  await enviarEmail(env, email, 'Confirme sua inscrição — Up Dance',
    emailConfirmacao(name, url.origin + '/api/newsletter/confirm?token=' + token));
  return json({ ok: true });
}

async function confirmar(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);

  const row = await env.DB
    .prepare('SELECT status FROM subscribers WHERE confirm_token = ?').bind(token).first();
  if (!row) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);

  if (row.status !== 'confirmed') {
    await env.DB.prepare(
      'UPDATE subscribers SET status = ?, confirmed_at = ?, confirm_token = NULL WHERE confirm_token = ?'
    ).bind('confirmed', new Date().toISOString(), token).run();
  }
  return Response.redirect(url.origin + '/cadastro/?status=confirmado', 302);
}

/* newsletter simples antiga (KV) — ainda usada pelo modal */
async function assinarNewsletterSimples(request, env) {
  let email = '';
  try { email = ((await request.json()).email || '').trim().toLowerCase(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);
  await env.KV.put('news:' + email, JSON.stringify({ em: Date.now() }));
  return json({ ok: true });
}

/* ───────────────────────── e-mail (Resend) ───────────────────────── */

async function enviarEmail(env, to, subject, html) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to, subject, html }),
  });
  if (!res.ok) console.error('Resend falhou:', res.status, await res.text());
}

function moldura(corpoHtml) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;
            background:#020118;color:#DFE0F2;border-radius:14px;overflow:hidden">
            <div style="padding:28px 28px 8px">${corpoHtml}</div></div>`;
}

function botao(href, texto) {
  return `<a href="${href}" style="display:inline-block;background:#BF0449;color:#fff;
          text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:9px;
          font-size:15px">${texto}</a>`;
}

function emailLogin(link) {
  return moldura(
    `<h2 style="margin:0 0 12px;font-size:18px;color:#fff">Seu acesso à Up Dance</h2>
     <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">
       Clique para entrar na área de membros. O link vale por 15 minutos e é de uso único.</p>
     ${botao(link, 'Entrar na área de membros')}
     <p style="color:#6f6c94;font-size:12px;line-height:1.6;margin:24px 0 0">
       Se você não pediu este acesso, ignore este e-mail.</p>`);
}

function emailConfirmacao(name, link) {
  const ola = name ? ('Olá, ' + name + '!') : 'Olá!';
  return moldura(
    `<h2 style="margin:0 0 12px;font-size:18px;color:#fff">${ola}</h2>
     <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">
       Falta só um passo para concluir sua inscrição na newsletter da Up Dance.
       Confirme que este e-mail é seu:</p>
     ${botao(link, 'Confirmar inscrição')}
     <p style="color:#6f6c94;font-size:12px;line-height:1.6;margin:24px 0 0">
       Se você não fez este cadastro, basta ignorar este e-mail — nada será enviado.</p>`);
}
