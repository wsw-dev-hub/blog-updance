/**
 * Worker do blog Up Dance.
 *
 * MEMBROS (login principal: e-mail + senha; alternativa: magic link):
 *   POST /api/member/register   → cria conta (email, senha, telefone? nome?) e envia confirmação
 *   GET  /api/member/confirm    → confirma a conta por e-mail
 *   POST /api/member/login      → login com e-mail e senha (cria sessão de MEMBRO)
 *   POST /api/member/logout     → encerra a sessão de membro
 *   POST /api/auth/request       → (alternativa) envia magic link
 *   GET  /api/auth/verify        → (alternativa) valida magic link e cria sessão de membro
 *   GET  /api/me                 → membro logado (ou 401)
 *
 * ADMIN (login SEPARADO: e-mail + senha):
 *   POST /api/admin/setup        → cria/redefine admin (exige ADMIN_SETUP_KEY)
 *   POST /api/admin/login        → login de admin (cria sessão de ADMIN)
 *   POST /api/admin/logout       → encerra a sessão de admin
 *   GET  /api/admin/data         → dados do painel (exige sessão de admin)
 *
 * NEWSLETTER (e-mail + telefone opcional, double opt-in):
 *   POST /api/newsletter/subscribe / GET /api/newsletter/confirm
 *
 * Páginas protegidas: /membros/* (sessão de membro), /admin/* (sessão de admin).
 * Sessões e cookies SEPARADOS: m_session (membro) e a_session (admin).
 *
 * Bindings: KV, DB (D1), ASSETS. Vars: GMAIL_USER. Secrets: GMAIL_APP_PASSWORD, ADMIN_SETUP_KEY.
 * ESTE ARQUIVO RODA NO SERVIDOR — não use document/window.
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
      // ---- MEMBROS ----
      if (pathname === '/api/member/register' && request.method === 'POST') return memberRegister(request, url, env);
      if (pathname === '/api/member/confirm')                               return memberConfirm(request, url, env);
      if (pathname === '/api/member/login'    && request.method === 'POST') return memberLogin(request, env);
      if (pathname === '/api/member/logout'   && request.method === 'POST') return logoutCookie('m_session', 'msess', request, env);
      if (pathname === '/api/auth/request'    && request.method === 'POST') return pedirLink(request, url, env);
      if (pathname === '/api/auth/verify')                                  return verificarLink(request, url, env);
      if (pathname === '/api/me')                                           return quemSouEu(request, env);

      // ---- ADMIN ----
      if (pathname === '/api/admin/setup'  && request.method === 'POST') return adminSetup(request, env);
      if (pathname === '/api/admin/login'  && request.method === 'POST') return adminLogin(request, env);
      if (pathname === '/api/admin/logout' && request.method === 'POST') return logoutCookie('a_session', 'asess', request, env);
      if (pathname === '/api/admin/data') {
        const a = await getAdmin(request, env);
        return a ? dadosAdmin(env) : json({ erro: 'não autorizado' }, 403);
      }

      // ---- NEWSLETTER ----
      if (pathname === '/api/newsletter/subscribe' && request.method === 'POST') return inscrever(request, url, env);
      if (pathname === '/api/newsletter/confirm')                                return confirmar(request, url, env);

      // ---- páginas protegidas ----
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        if (!await getAdmin(request, env)) return Response.redirect(url.origin + '/admin-login/', 302);
      }
      if (pathname === '/membros' || pathname.startsWith('/membros/')) {
        if (!await getMember(request, env)) return Response.redirect(url.origin + '/entrar/', 302);
      }
    } catch (err) {
      return new Response('Erro interno: ' + err.message, { status: 500 });
    }

    return env.ASSETS.fetch(request);
  },
};

/* ───────────────────────── utilidades ───────────────────────── */

function randomToken(bytes = 32) {
  const a = new Uint8Array(bytes); crypto.getRandomValues(a);
  return [...a].map(b => b.toString(16).padStart(2, '0')).join('');
}
function bytesToHex(b) { return [...b].map(x => x.toString(16).padStart(2, '0')).join(''); }
function hexToBytes(h) { const a = new Uint8Array(h.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
function timingSafeEqual(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
function cookie(name, value, maxAge) {
  const p = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'];
  if (maxAge !== undefined) p.push(`Max-Age=${maxAge}`);
  return p.join('; ');
}
function readCookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
function json(obj, status = 200, extraHeaders) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...(extraHeaders || {}) } });
}
function emailValido(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }

async function logEvent(env, email, type, detail) {
  try {
    await env.DB.prepare('INSERT INTO events (email, type, detail, created_at) VALUES (?, ?, ?, ?)')
      .bind(email || null, type, detail || null, new Date().toISOString()).run();
  } catch (e) { console.error('logEvent:', e.message); }
}

/* ───────────────────────── senhas (PBKDF2) ───────────────────────── */

async function derivar(password, saltBytes) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' }, km, 256);
  return bytesToHex(new Uint8Array(bits));
}
async function hashSenha(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { hash: await derivar(password, salt), salt: bytesToHex(salt) };
}
async function conferirSenha(password, saltHex, hashHex) {
  const h = await derivar(password, hexToBytes(saltHex));
  return timingSafeEqual(h, hashHex);
}

/* ───────────────────────── sessões (separadas) ───────────────────────── */

async function criarSessao(env, prefixo, dados) {
  const sid = randomToken(32);
  await env.KV.put(prefixo + ':' + sid, JSON.stringify(dados), { expirationTtl: SESSION_TTL });
  return sid;
}
async function lerSessao(env, prefixo, sid) {
  if (!sid) return null;
  const raw = await env.KV.get(prefixo + ':' + sid);
  return raw ? JSON.parse(raw) : null;
}
function getMember(request, env) { return lerSessao(env, 'msess', readCookie(request, 'm_session')); }
function getAdmin(request, env)  { return lerSessao(env, 'asess', readCookie(request, 'a_session')); }

async function logoutCookie(cookieName, prefixo, request, env) {
  const sid = readCookie(request, cookieName);
  if (sid) await env.KV.delete(prefixo + ':' + sid);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie(cookieName, '', 0) });
}
async function quemSouEu(request, env) {
  const m = await getMember(request, env);
  return m ? json(m) : json(null, 401);
}

/* ───────────────────────── membros: senha ───────────────────────── */

async function memberRegister(request, url, env) {
  let email = '', password = '', phone = '', name = '';
  try { const b = await request.json();
    email = (b.email || '').trim().toLowerCase(); password = b.password || '';
    phone = (b.phone || '').trim().slice(0, 30); name = (b.name || '').trim().slice(0, 80);
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);
  if (password.length < 8) return json({ ok: false, erro: 'A senha precisa ter ao menos 8 caracteres.' }, 400);

  const existe = await env.DB.prepare('SELECT status FROM members WHERE email = ?').bind(email).first();
  if (existe && existe.status === 'active') return json({ ok: false, erro: 'Este e-mail já tem conta. Faça login.' }, 409);

  const { hash, salt } = await hashSenha(password);
  const token = randomToken(24);
  const agora = new Date().toISOString();

  if (existe) {
    await env.DB.prepare('UPDATE members SET name=?, phone=?, pass_hash=?, pass_salt=?, confirm_token=?, created_at=? WHERE email=?')
      .bind(name, phone, hash, salt, token, agora, email).run();
  } else {
    await env.DB.prepare('INSERT INTO members (email, name, phone, pass_hash, pass_salt, status, confirm_token, created_at) VALUES (?,?,?,?,?,?,?,?)')
      .bind(email, name, phone, hash, salt, 'pending', token, agora).run();
    await logEvent(env, email, 'member_cadastro', name || null);
  }

  const res = await enviarEmail(env, email, 'Confirme sua conta — Up Dance Xperience',
    emailConfirmacaoConta(name, url.origin + '/api/member/confirm?token=' + token));
  await logEvent(env, email, res.ok ? 'member_confirma_enviado' : 'member_confirma_erro', res.error || null);
  return json({ ok: true });
}

async function memberConfirm(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/entrar/?status=invalido', 302);
  const m = await env.DB.prepare('SELECT email, status FROM members WHERE confirm_token = ?').bind(token).first();
  if (!m) return Response.redirect(url.origin + '/entrar/?status=invalido', 302);
  if (m.status !== 'active') {
    await env.DB.prepare('UPDATE members SET status=?, confirmed_at=?, confirm_token=NULL WHERE confirm_token=?')
      .bind('active', new Date().toISOString(), token).run();
    await logEvent(env, m.email, 'member_confirmado', null);
  }
  return Response.redirect(url.origin + '/entrar/?status=confirmado', 302);
}

async function memberLogin(request, env) {
  let email = '', password = '';
  try { const b = await request.json(); email = (b.email || '').trim().toLowerCase(); password = b.password || ''; }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const invalido = json({ ok: false, erro: 'E-mail ou senha incorretos.' }, 401);
  const m = await env.DB.prepare('SELECT email, pass_hash, pass_salt, status FROM members WHERE email = ?').bind(email).first();
  if (!m) return invalido;
  if (m.status !== 'active') return json({ ok: false, erro: 'Confirme seu e-mail antes de entrar.' }, 403);
  if (!await conferirSenha(password, m.pass_salt, m.pass_hash)) return invalido;

  const sid = await criarSessao(env, 'msess', { email: m.email, role: 'member' });
  await logEvent(env, m.email, 'member_login', null);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie('m_session', sid, SESSION_TTL) });
}

/* ───────────────────────── membros: magic link (alternativa) ───────────────────────── */

async function pedirLink(request, url, env) {
  let email = '';
  try { email = ((await request.json()).email || '').trim().toLowerCase(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  const generica = json({ ok: true });
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  // permite magic link para quem é membro ativo OU está na allowlist do KV
  const ehMembro = await env.DB.prepare("SELECT 1 FROM members WHERE email=? AND status='active'").bind(email).first();
  if (!ehMembro && !await env.KV.get('allow:' + email)) return generica;
  if (await env.KV.get('cd:' + email)) return generica;
  await env.KV.put('cd:' + email, '1', { expirationTtl: COOLDOWN_TTL });

  const token = randomToken(32);
  await env.KV.put('magic:' + token, email, { expirationTtl: MAGIC_TTL });
  const res = await enviarEmail(env, email, 'Seu link de acesso — Up Dance Xperience',
    emailLogin(url.origin + '/api/auth/verify?token=' + token));
  await logEvent(env, email, res.ok ? 'magic_enviado' : 'magic_erro', res.error || null);
  return generica;
}

async function verificarLink(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/entrar/?status=invalido', 302);
  const email = await env.KV.get('magic:' + token);
  if (!email) return Response.redirect(url.origin + '/entrar/?status=expirado', 302);
  await env.KV.delete('magic:' + token);
  const sid = await criarSessao(env, 'msess', { email, role: 'member' });
  await logEvent(env, email, 'magic_login_ok', null);
  return new Response(null, { status: 302, headers: { 'Location': url.origin + '/membros/', 'Set-Cookie': cookie('m_session', sid, SESSION_TTL) } });
}

/* ───────────────────────── admin: senha (login separado) ───────────────────────── */

async function adminSetup(request, env) {
  let key = '', email = '', password = '';
  try { const b = await request.json(); key = b.setup_key || ''; email = (b.email || '').trim().toLowerCase(); password = b.password || ''; }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  if (!env.ADMIN_SETUP_KEY || key !== env.ADMIN_SETUP_KEY) return json({ ok: false, erro: 'Chave de setup inválida.' }, 403);
  if (!emailValido(email)) return json({ ok: false, erro: 'E-mail inválido.' }, 400);
  if (password.length < 10) return json({ ok: false, erro: 'Senha de admin: mínimo 10 caracteres.' }, 400);

  const { hash, salt } = await hashSenha(password);
  const existe = await env.DB.prepare('SELECT id FROM admins WHERE email = ?').bind(email).first();
  if (existe) await env.DB.prepare('UPDATE admins SET pass_hash=?, pass_salt=? WHERE email=?').bind(hash, salt, email).run();
  else        await env.DB.prepare('INSERT INTO admins (email, pass_hash, pass_salt, created_at) VALUES (?,?,?,?)').bind(email, hash, salt, new Date().toISOString()).run();
  return json({ ok: true });
}

async function adminLogin(request, env) {
  let email = '', password = '';
  try { const b = await request.json(); email = (b.email || '').trim().toLowerCase(); password = b.password || ''; }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const invalido = json({ ok: false, erro: 'E-mail ou senha incorretos.' }, 401);
  const a = await env.DB.prepare('SELECT email, pass_hash, pass_salt FROM admins WHERE email = ?').bind(email).first();
  if (!a) return invalido;
  if (!await conferirSenha(password, a.pass_salt, a.pass_hash)) return invalido;

  const sid = await criarSessao(env, 'asess', { email: a.email, role: 'admin' });
  await logEvent(env, a.email, 'admin_login', null);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie('a_session', sid, SESSION_TTL) });
}

async function dadosAdmin(env) {
  const subs = await env.DB.prepare('SELECT email, name, phone, status, created_at, confirmed_at FROM subscribers ORDER BY id DESC LIMIT 200').all();
  const mem  = await env.DB.prepare('SELECT email, name, phone, status, created_at, confirmed_at FROM members ORDER BY id DESC LIMIT 200').all();
  const evs  = await env.DB.prepare('SELECT email, type, detail, created_at FROM events ORDER BY id DESC LIMIT 100').all();
  const stats = await env.DB.prepare(
    "SELECT (SELECT COUNT(*) FROM members) AS membros," +
    " (SELECT COUNT(*) FROM members WHERE status='active') AS membros_ativos," +
    " (SELECT COUNT(*) FROM subscribers WHERE status='confirmed') AS news_confirmados," +
    " (SELECT COUNT(*) FROM events WHERE type LIKE '%_erro') AS erros"
  ).first();
  return json({ stats, members: mem.results || [], subscribers: subs.results || [], events: evs.results || [] });
}

/* ───────────────────────── newsletter (e-mail + telefone opcional) ───────────────────────── */

async function inscrever(request, url, env) {
  let email = '', name = '', phone = '';
  try { const b = await request.json();
    email = (b.email || '').trim().toLowerCase(); name = (b.name || '').trim().slice(0, 80);
    phone = (b.phone || '').trim().slice(0, 30);
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  const agora = new Date().toISOString();
  const token = randomToken(24);
  const existente = await env.DB.prepare('SELECT status FROM subscribers WHERE email = ?').bind(email).first();
  if (existente && existente.status === 'confirmed') return json({ ok: true, jaInscrito: true });

  if (existente) {
    await env.DB.prepare('UPDATE subscribers SET confirm_token=?, name=?, phone=?, created_at=? WHERE email=?')
      .bind(token, name, phone, agora, email).run();
  } else {
    await env.DB.prepare('INSERT INTO subscribers (email, name, phone, status, confirm_token, created_at) VALUES (?,?,?,?,?,?)')
      .bind(email, name, phone, 'pending', token, agora).run();
    await logEvent(env, email, 'news_pendente', null);
  }
  const res = await enviarEmail(env, email, 'Confirme sua inscrição — Up Dance Xperience',
    emailConfirmacao(name, url.origin + '/api/newsletter/confirm?token=' + token));
  await logEvent(env, email, res.ok ? 'news_confirma_enviado' : 'news_confirma_erro', res.error || null);
  return json({ ok: true });
}

async function confirmar(request, url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);
  const row = await env.DB.prepare('SELECT email, status FROM subscribers WHERE confirm_token = ?').bind(token).first();
  if (!row) return Response.redirect(url.origin + '/cadastro/?status=invalido', 302);
  if (row.status !== 'confirmed') {
    await env.DB.prepare('UPDATE subscribers SET status=?, confirmed_at=?, confirm_token=NULL WHERE confirm_token=?')
      .bind('confirmed', new Date().toISOString(), token).run();
    await logEvent(env, row.email, 'news_confirmado', null);
  }
  return Response.redirect(url.origin + '/cadastro/?status=confirmado', 302);
}

/* ───────────────────────── e-mail (Gmail SMTP) ───────────────────────── */

async function enviarEmail(env, to, subject, html) {
  try {
    const mailer = await WorkerMailer.connect({
      host: 'smtp.gmail.com', port: 587, startTls: true, authType: 'login',
      credentials: { username: env.GMAIL_USER, password: env.GMAIL_APP_PASSWORD },
    });
    await mailer.send({ from: { name: 'Up Dance Xperience', email: env.GMAIL_USER }, to, subject, html });
    if (typeof mailer.close === 'function') { try { await mailer.close(); } catch (_) {} }
    return { ok: true };
  } catch (err) {
    console.error('Gmail SMTP falhou:', err.message);
    return { ok: false, error: String(err.message || err).slice(0, 200) };
  }
}
function moldura(html) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;background:#020118;color:#DFE0F2;border-radius:14px;overflow:hidden"><div style="padding:28px 28px 8px">${html}</div></div>`;
}
function botao(href, t) {
  return `<a href="${href}" style="display:inline-block;background:#BF0449;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:9px;font-size:15px">${t}</a>`;
}
function emailLogin(link) {
  return moldura(`<h2 style="margin:0 0 12px;font-size:18px;color:#fff">Seu acesso à Up Dance Xperience</h2>
    <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">Clique para entrar. O link vale 15 minutos e é de uso único.</p>
    ${botao(link, 'Entrar na área de membros')}
    <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Não pediu acesso? Ignore este e-mail.</p>`);
}
function emailConfirmacaoConta(name, link) {
  const ola = name ? ('Olá, ' + name + '!') : 'Olá!';
  return moldura(`<h2 style="margin:0 0 12px;font-size:18px;color:#fff">${ola}</h2>
    <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">Confirme seu e-mail para ativar sua conta de membro na Up Dance Xperience.</p>
    ${botao(link, 'Ativar minha conta')}
    <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Não criou conta? Ignore este e-mail.</p>`);
}
function emailConfirmacao(name, link) {
  const ola = name ? ('Olá, ' + name + '!') : 'Olá!';
  return moldura(`<h2 style="margin:0 0 12px;font-size:18px;color:#fff">${ola}</h2>
    <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">Confirme sua inscrição na newsletter da Up Dance Xperience.</p>
    ${botao(link, 'Confirmar inscrição')}
    <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Não fez este cadastro? Ignore este e-mail.</p>`);
}