/**
 * Worker do blog Up Dance — login (magic link) + cadastro (D1, double opt-in)
 * + envio via Gmail SMTP + log próprio de eventos + área de admin.
 *
 * Rotas públicas:
 *   POST /api/auth/request          → envia link de acesso (login de membro)
 *   GET  /api/auth/verify           → valida o link e cria a sessão
 *   GET  /api/auth/logout           → encerra a sessão
 *   GET  /api/me                    → usuário logado (ou 401)
 *   POST /api/newsletter/subscribe  → cadastro com confirmação por e-mail
 *   GET  /api/newsletter/confirm    → confirma a inscrição (double opt-in)
 *   POST /api/newsletter            → inscrição simples antiga (KV, usada pelo modal)
 *
 * Rotas protegidas:
 *   /membros/*        → exige sessão
 *   /admin/*          → exige sessão E ser admin (KV: admin:<email> = "1")
 *   GET /api/admin/data → JSON com assinantes, eventos e estatísticas (admin)
 *
 * Bindings: KV, DB (D1), ASSETS.
 * Vars:     GMAIL_USER ("Up Dance" envia desse endereço Gmail)
 * Secret:   GMAIL_APP_PASSWORD (senha de app de 16 dígitos do Google)
 *
 * ESTE ARQUIVO RODA NO SERVIDOR — não use `document`/`window`.
 */

import { WorkerMailer } from 'worker-mailer';

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

      // API de admin (JSON) — protegida
      if (pathname === '/api/admin/data') {
        const admin = await getAdmin(request, env);
        if (!admin) return json({ erro: 'não autorizado' }, 403);
        return dadosAdmin(env);
      }

      // página de admin — exige sessão + ser admin
      if (pathname.startsWith('/admin')) {
        const admin = await getAdmin(request, env);
        if (!admin) return Response.redirect(url.origin + '/?login=required', 302);
      }

      // área de membros — exige sessão
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
  const p = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'];
  if (maxAge !== undefined) p.push(`Max-Age=${maxAge}`);
  return p.join('; ');
}
function readCookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
function emailValido(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }

// grava um evento no log (nunca derruba o fluxo se falhar)
async function logEvent(env, email, type, detail) {
  try {
    await env.DB.prepare(
      'INSERT INTO events (email, type, detail, created_at) VALUES (?, ?, ?, ?)'
    ).bind(email || null, type, detail || null, new Date().toISOString()).run();
  } catch (e) { console.error('logEvent falhou:', e.message); }
}

/* ───────────────────────── sessão / admin ───────────────────────── */

async function getSession(request, env) {
  const sid = readCookie(request, 'session');
  if (!sid) return null;
  const raw = await env.KV.get('sess:' + sid);
  return raw ? JSON.parse(raw) : null;
}
async function getAdmin(request, env) {
  const user = await getSession(request, env);
  if (!user) return null;
  return (await env.KV.get('admin:' + user.email)) ? user : null;
}
async function fazerLogout(request, env) {
  const sid = readCookie(request, 'session');
  if (sid) await env.KV.delete('sess:' + sid);
  return new Response(null, { status: 302, headers: { 'Location': '/', 'Set-Cookie': cookie('session', '', 0) } });
}
async function quemSouEu(request, env) {
  const user = await getSession(request, env);
  return user ? json(user) : json(null, 401);
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

  const res = await enviarEmail(env, email, 'Seu link de acesso — Up Dance',
    emailLogin(url.origin + '/api/auth/verify?token=' + token));
  await logEvent(env, email, res.ok ? 'login_email_enviado' : 'login_email_erro', res.error || null);
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
  await logEvent(env, email, 'login_ok', null);
  return new Response(null, {
    status: 302,
    headers: { 'Location': url.origin + '/membros/', 'Set-Cookie': cookie('session', sid, SESSION_TTL) },
  });
}

/* ───────────────────────── cadastro (D1, double opt-in) ───────────────────────── */

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
  const existente = await env.DB.prepare('SELECT status FROM subscribers WHERE email = ?').bind(email).first();

  if (existente && existente.status === 'confirmed') return json({ ok: true, jaInscrito: true });

  if (existente) {
    await env.DB.prepare('UPDATE subscribers SET confirm_token = ?, name = ?, created_at = ? WHERE email = ?')
      .bind(token, name, agora, email).run();
  } else {
    await env.DB.prepare('INSERT INTO subscribers (email, name, status, confirm_token, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(email, name, 'pending', token, agora).run();
    await logEvent(env, email, 'cadastro_pendente', name || null);
  }

  const res = await enviarEmail(env, email, 'Confirme sua inscrição — Up Dance',
    emailConfirmacao(name, url.origin + '/api/newsletter/confirm?token=' + token));
  await logEvent(env, email, res.ok ? 'confirma_email_enviado' : 'confirma_email_erro', res.error || null);
  return json({ ok: true });
}

async function confirmar(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);
  const row = await env.DB.prepare('SELECT email, status FROM subscribers WHERE confirm_token = ?').bind(token).first();
  if (!row) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);

  if (row.status !== 'confirmed') {
    await env.DB.prepare('UPDATE subscribers SET status = ?, confirmed_at = ?, confirm_token = NULL WHERE confirm_token = ?')
      .bind('confirmed', new Date().toISOString(), token).run();
    await logEvent(env, row.email, 'cadastro_confirmado', null);
  }
  return Response.redirect(url.origin + '/cadastro/?status=confirmado', 302);
}

async function assinarNewsletterSimples(request, env) {
  let email = '';
  try { email = ((await request.json()).email || '').trim().toLowerCase(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);
  await env.KV.put('news:' + email, JSON.stringify({ em: Date.now() }));
  return json({ ok: true });
}

/* ───────────────────────── admin: dados em JSON ───────────────────────── */

async function dadosAdmin(env) {
  const subs = await env.DB.prepare(
    'SELECT email, name, status, created_at, confirmed_at FROM subscribers ORDER BY id DESC LIMIT 200'
  ).all();
  const evs = await env.DB.prepare(
    'SELECT email, type, detail, created_at FROM events ORDER BY id DESC LIMIT 100'
  ).all();
  const stats = await env.DB.prepare(
    "SELECT (SELECT COUNT(*) FROM subscribers) AS total," +
    " (SELECT COUNT(*) FROM subscribers WHERE status='confirmed') AS confirmados," +
    " (SELECT COUNT(*) FROM subscribers WHERE status='pending') AS pendentes," +
    " (SELECT COUNT(*) FROM events WHERE type LIKE '%_erro') AS erros"
  ).first();

  return json({
    stats,
    subscribers: subs.results || [],
    events: evs.results || [],
  });
}

/* ───────────────────────── envio via Gmail SMTP ───────────────────────── */

async function enviarEmail(env, to, subject, html) {
  try {
    const mailer = await WorkerMailer.connect({
      host: 'smtp.gmail.com',
      port: 587,
      startTls: true,
      authType: 'login',
      credentials: { username: env.GMAIL_USER, password: env.GMAIL_APP_PASSWORD },
    });
    await mailer.send({
      from: { name: 'Up Dance', email: env.GMAIL_USER },
      to,
      subject,
      html,
    });
    if (typeof mailer.close === 'function') { try { await mailer.close(); } catch (_) {} }
    return { ok: true };
  } catch (err) {
    console.error('Gmail SMTP falhou:', err.message);
    return { ok: false, error: String(err.message || err).slice(0, 200) };
  }
}

function moldura(html) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;
            background:#020118;color:#DFE0F2;border-radius:14px;overflow:hidden">
            <div style="padding:28px 28px 8px">${html}</div></div>`;
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
       Clique para entrar na área de membros. O link vale 15 minutos e é de uso único.</p>
     ${botao(link, 'Entrar na área de membros')}
     <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Não pediu acesso? Ignore este e-mail.</p>`);
}
function emailConfirmacao(name, link) {
  const ola = name ? ('Olá, ' + name + '!') : 'Olá!';
  return moldura(
    `<h2 style="margin:0 0 12px;font-size:18px;color:#fff">${ola}</h2>
     <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">
       Falta um passo para concluir sua inscrição na newsletter da Up Dance. Confirme abaixo:</p>
     ${botao(link, 'Confirmar inscrição')}
     <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Não fez este cadastro? Ignore este e-mail.</p>`);
}