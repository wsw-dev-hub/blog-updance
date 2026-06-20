/**
 * Worker do blog Up Dance — autenticação por MAGIC LINK (link mágico por e-mail).
 *
 * Rotas:
 *   POST /api/auth/request   → recebe um e-mail e envia o link de acesso
 *   GET  /api/auth/verify    → valida o token do link e cria a sessão
 *   GET  /api/auth/logout    → encerra a sessão
 *   GET  /api/me             → retorna o usuário logado (ou 401)
 *   POST /api/newsletter     → registra um e-mail na newsletter
 *   /membros/*               → área protegida (exige sessão)
 *   resto                    → arquivos estáticos do dist/ (env.ASSETS)
 *
 * ESTE ARQUIVO RODA NO SERVIDOR (Cloudflare Worker).
 * NÃO use `document`, `window` nem nada de navegador aqui.
 */

const RESEND_API   = 'https://api.resend.com/emails';
const SESSION_TTL  = 60 * 60 * 24 * 7; // sessão dura 7 dias
const MAGIC_TTL    = 60 * 15;          // link de acesso vale 15 minutos
const COOLDOWN_TTL = 60;               // espera 60s entre pedidos do mesmo e-mail

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/auth/request' && request.method === 'POST')
                                          return pedirLink(request, url, env);
      if (pathname === '/api/auth/verify') return verificarLink(request, url, env);
      if (pathname === '/api/auth/logout') return fazerLogout(request, env);
      if (pathname === '/api/me')          return quemSouEu(request, env);
      if (pathname === '/api/newsletter' && request.method === 'POST')
                                          return assinarNewsletter(request, env);

      // Área protegida — só passa quem tem sessão válida
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
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function emailValido(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

/* ───────────────────────── magic link ───────────────────────── */

async function pedirLink(request, url, env) {
  let email = '';
  try {
    const body = await request.json();
    email = (body.email || '').trim().toLowerCase();
  } catch {
    return json({ ok: false, erro: 'Requisição inválida.' }, 400);
  }

  // Resposta SEMPRE genérica: não revelamos se o e-mail existe/está autorizado.
  const respostaGenerica = json({ ok: true });

  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  // só e-mails da allowlist recebem link (grupo restrito)
  const permitido = await env.KV.get('allow:' + email);
  if (!permitido) return respostaGenerica;

  // anti-flood: 1 pedido por e-mail a cada 60s
  const emCooldown = await env.KV.get('cd:' + email);
  if (emCooldown) return respostaGenerica;
  await env.KV.put('cd:' + email, '1', { expirationTtl: COOLDOWN_TTL });

  // gera o token de uso único e guarda apontando para o e-mail
  const token = randomToken(32);
  await env.KV.put('magic:' + token, email, { expirationTtl: MAGIC_TTL });

  const link = url.origin + '/api/auth/verify?token=' + token;
  await enviarEmailLogin(env, email, link);

  return respostaGenerica;
}

async function verificarLink(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/?login=invalido', 302);

  const email = await env.KV.get('magic:' + token);
  if (!email) return Response.redirect(url.origin + '/?login=expirado', 302);

  // token é de uso único: apaga assim que consumido
  await env.KV.delete('magic:' + token);

  // cria a sessão
  const sid = randomToken(32);
  await env.KV.put('sess:' + sid, JSON.stringify({ email }), { expirationTtl: SESSION_TTL });

  return new Response(null, {
    status: 302,
    headers: {
      'Location': url.origin + '/membros/',
      'Set-Cookie': cookie('session', sid, SESSION_TTL),
    },
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
    status: 302,
    headers: { 'Location': '/', 'Set-Cookie': cookie('session', '', 0) },
  });
}

async function quemSouEu(request, env) {
  const user = await getSession(request, env);
  if (!user) return json(null, 401);
  return json(user);
}

/* ───────────────────────── envio de e-mail (Resend) ───────────────────────── */

async function enviarEmailLogin(env, email, link) {
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;
                background:#020118;color:#DFE0F2;border-radius:14px;overflow:hidden">
      <div style="padding:28px 28px 8px">
        <h2 style="margin:0 0 12px;font-size:18px;color:#fff">Seu acesso à Up Dance</h2>
        <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">
          Clique no botão abaixo para entrar na área de membros. O link vale por 15 minutos
          e só pode ser usado uma vez.</p>
        <a href="${link}"
           style="display:inline-block;background:#BF0449;color:#fff;text-decoration:none;
                  font-weight:bold;padding:12px 22px;border-radius:9px;font-size:15px">
          Entrar na área de membros</a>
        <p style="color:#6f6c94;font-size:12px;line-height:1.6;margin:24px 0 0">
          Se você não pediu este acesso, pode ignorar este e-mail com segurança.</p>
      </div>
    </div>`;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: email,
      subject: 'Seu link de acesso — Up Dance',
      html,
    }),
  });

  if (!res.ok) console.error('Resend falhou:', res.status, await res.text());
}

/* ───────────────────────── newsletter ───────────────────────── */

async function assinarNewsletter(request, env) {
  let email = '';
  try {
    const body = await request.json();
    email = (body.email || '').trim().toLowerCase();
  } catch {
    return json({ ok: false, erro: 'Requisição inválida.' }, 400);
  }

  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  await env.KV.put('news:' + email, JSON.stringify({ em: Date.now() }));
  return json({ ok: true });
}
