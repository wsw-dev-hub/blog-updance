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
const RESET_TTL    = 60 * 30;   // 30 minutos para o link de redefinição
const MEMBER_TYPES = ['Premium','Professor(a)','Monitor(a)','Assistente','Estagiário(a)','Aluno','Free'];

// ============================ [ Para Implementar - Cursos & Treinamentos ] ===================================== //
// [ 'Cursos & Treinamentos', 'Aprimoramento Técnico', 'Os Sgredos da Arte Performática' ]

// chave de cache KV para o mapa de regras de acesso
const ACCESS_CACHE_KEY = 'access:rules';
const ACCESS_CACHE_TTL = 300; // 5 min

// Carrega o mapa { resource_key: Set<type> } com cache no KV
async function carregarRegrasAcesso(env) {
  const cached = await env.KV.get(ACCESS_CACHE_KEY, 'json');
  if (cached) {
    // reconstrói Sets a partir do JSON
    const map = {};
    for (const k of Object.keys(cached)) map[k] = new Set(cached[k]);
    return map;
  }
  const rows = await env.DB.prepare(
    'SELECT resource_key, member_type FROM access_rules'
  ).all();
  const map = {};
  for (const r of (rows.results || [])) {
    (map[r.resource_key] ||= new Set()).add(r.member_type);
  }
  // grava versão serializável
  const serial = {};
  for (const k of Object.keys(map)) serial[k] = [...map[k]];
  await env.KV.put(ACCESS_CACHE_KEY, JSON.stringify(serial), { expirationTtl: ACCESS_CACHE_TTL });
  return map;
}

// membro tem acesso a um recurso?
// carrega TODOS os tipos de um membro (retorna array; sempre inclui algo)
async function tiposDoMembro(env, email) {
  const rows = await env.DB.prepare(
    'SELECT type FROM member_types WHERE email = ?'
  ).bind(email).all();
  const tipos = (rows.results || []).map(r => r.type);
  return tipos.length ? tipos : ['Free'];  // fallback defensivo
}

// membro tem acesso a um recurso? aceita UM tipo OU um array de tipos.
async function podeAcessar(env, memberTypes, resourceKey) {
  const map = await carregarRegrasAcesso(env);
  const set = map[resourceKey];
  if (!set) return false;
  const arr = Array.isArray(memberTypes) ? memberTypes : [memberTypes];
  return arr.some(t => set.has(t));  // acesso cumulativo: basta 1 tipo autorizar
}

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
      if (pathname === '/api/member/forgot'   && request.method === 'POST') return memberForgot(request, url, env);
      if (pathname === '/api/member/reset'    && request.method === 'POST') return memberReset(request, env);
      if (pathname === '/reset-senha'         || pathname === '/reset-senha/') return paginaReset(request, url, env);
      if (pathname === '/api/auth/request'    && request.method === 'POST') return pedirLink(request, url, env);
      if (pathname === '/api/auth/verify')                                  return verificarLink(request, url, env);
      if (pathname === '/api/me')                                           return quemSouEu(request, env);
      if (pathname === '/api/me/access')                                    return meusAcessos(request, env);

      // ---- ADMIN ----
      if (pathname === '/api/admin/setup'  && request.method === 'POST') return adminSetup(request, env);
      if (pathname === '/api/admin/login'  && request.method === 'POST') return adminLogin(request, env);
      if (pathname === '/api/admin/logout' && request.method === 'POST') return logoutCookie('a_session', 'asess', request, env);
      /* DEPOIS */
      if (pathname === '/api/admin/data') {
        const a = await getAdmin(request, env);
        return a ? dadosAdmin(env) : json({ erro: 'não autorizado' }, 403);
      }
      if (pathname === '/api/admin/events') {                       // <-- nova rota
        const a = await getAdmin(request, env);
        return a ? dadosAdminEventos(env) : json({ erro: 'não autorizado' }, 403);
      }

      // ---- ADMIN: gestão de "type" do membro ----
      if (pathname === '/api/admin/member/update-type' && request.method === 'POST') {
        const a = await getAdmin(request, env);
        return a ? adminMemberUpdateType(request, env, a) : json({ erro: 'não autorizado' }, 403);
      }

      if (pathname === '/api/admin/access/list') {
        const a = await getAdmin(request, env);
        return a ? adminAccessList(env) : json({ erro: 'não autorizado' }, 403);
      }
      if (pathname === '/api/admin/access/save' && request.method === 'POST') {
        const a = await getAdmin(request, env);
        return a ? adminAccessSave(request, env, a) : json({ erro: 'não autorizado' }, 403);
      }
      if (pathname === '/api/admin/resources/save' && request.method === 'POST') {
        const a = await getAdmin(request, env);
        return a ? adminResourceSave(request, env, a) : json({ erro: 'não autorizado' }, 403);
      }

      // ---- NEWSLETTER ----
      if (pathname === '/api/newsletter/subscribe' && request.method === 'POST') return inscrever(request, url, env);
      if (pathname === '/api/newsletter/confirm')                                return confirmar(request, url, env);

      // ---- páginas protegidas ----
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        if (!await getAdmin(request, env)) return Response.redirect(url.origin + '/admin-login/', 302);
      }

      if (pathname === '/membros' || pathname.startsWith('/membros/')) {
        const m = await getMember(request, env);
        if (!m) return Response.redirect(url.origin + '/entrar/', 302);

        const recurso = await env.DB.prepare(
          'SELECT key FROM resources WHERE ? LIKE path_prefix || \'%\' ORDER BY length(path_prefix) DESC LIMIT 1'
        ).bind(pathname).first();

        if (recurso) {
          // usa o array completo de tipos da sessão (fallback para sessões antigas)
          const types = Array.isArray(m.types) && m.types.length
            ? m.types
            : [m.type || 'Free'];
          const ok = await podeAcessar(env, types, recurso.key);
          if (!ok) return Response.redirect(url.origin + '/membros/?erro=sem_acesso', 302);
        }
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

/* DEPOIS */
const ERR_TYPES = new Set([
  'member_confirma_erro', 'magic_erro', 'news_confirma_erro', 'reset_erro'
]);

async function logEvent(env, email, type, detail) {
  try {
    const stmts = [
      env.DB.prepare('INSERT INTO events (email, type, detail, created_at) VALUES (?, ?, ?, ?)')
        .bind(email || null, type, detail || null, new Date().toISOString())
    ];
    if (ERR_TYPES.has(type)) {
      stmts.push(env.DB.prepare("UPDATE counters SET value = value + 1 WHERE name = 'erros'"));
    }
    await env.DB.batch(stmts);   // 1 round-trip para as 1–2 escritas
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
async function meusAcessos(request, env) {
  const m = await getMember(request, env);
  if (!m) return json(null, 401);

  // aceita tanto sessões novas (m.types: array) quanto antigas (m.type: string)
  const types = Array.isArray(m.types) && m.types.length
    ? m.types
    : [m.type || 'Free'];

  // WHERE member_type IN (?,?,?…) — placeholders dinâmicos
  const placeholders = types.map(() => '?').join(',');
  const [recursos, rules] = await env.DB.batch([
    env.DB.prepare(
      'SELECT key, label, path_prefix, icon, description FROM resources ORDER BY label'
    ),
    env.DB.prepare(
      'SELECT DISTINCT resource_key FROM access_rules WHERE member_type IN (' + placeholders + ')'
    ).bind(...types),
  ]);

  const liberados = new Set((rules.results || []).map(r => r.resource_key));
  const resources = (recursos.results || []).map(r => ({
    ...r,
    allowed: liberados.has(r.key),
  }));

  return json({ types, type: types[0], resources });
}

/* ───────────────────────── membros: senha ───────────────────────── */

async function memberRegister(request, url, env) {
  let email = '', password = '', phone = '', name = '', type = 'Free';
  try { const b = await request.json();
    email = (b.email || '').trim().toLowerCase(); password = b.password || '';
    phone = (b.phone || '').trim().slice(0, 30); name = (b.name || '').trim().slice(0, 80);
    type  = (b.type  || 'Free').trim();
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!MEMBER_TYPES.includes(type)) type = 'Free';   //<-- MODIFICAR APÓS TODOS OS ALUNOS SE CADASTRAREM -->
  //if (!MEMBER_TYPES.includes(type)) type = 'Aluno(a)';

  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);
  if (password.length < 8) return json({ ok: false, erro: 'A senha precisa ter ao menos 8 caracteres.' }, 400);

  const existe = await env.DB.prepare('SELECT status FROM members WHERE email = ?').bind(email).first();
  if (existe && existe.status === 'active') return json({ ok: false, erro: 'Este e-mail já tem conta. Faça login.' }, 409);

  const { hash, salt } = await hashSenha(password);
  const token = randomToken(24);
  const agora = new Date().toISOString();

  /* DEPOIS */
  if (existe) {
    await env.DB.prepare('UPDATE members SET name=?, phone=?, pass_hash=?, pass_salt=?, type=?, confirm_token=?, created_at=? WHERE email=?')
      .bind(name, phone, hash, salt, type, token, agora, email).run();
  } else {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO members (email, name, phone, pass_hash, pass_salt, status, type, confirm_token, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
        .bind(email, name, phone, hash, salt, 'pending', type, token, agora),
      env.DB.prepare('INSERT OR IGNORE INTO member_types (email, type, created_at) VALUES (?,?,?)')
        .bind(email, type, agora),
      env.DB.prepare("UPDATE counters SET value = value + 1 WHERE name = 'membros'"),
    ]);
    await env.KV.delete(ADMIN_CACHE_KEY);
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
  /* DEPOIS */
  if (m.status !== 'active') {
    await env.DB.prepare('UPDATE members SET status=?, confirmed_at=?, confirm_token=NULL WHERE confirm_token=?')
      .bind('active', new Date().toISOString(), token).run();
    await env.DB.prepare("UPDATE counters SET value = value + 1 WHERE name = 'membros_ativos'").run();
    await env.KV.delete(ADMIN_CACHE_KEY);                                    // <-- adicionar
    await logEvent(env, m.email, 'member_confirmado', null);
  }
  return Response.redirect(url.origin + '/entrar/?status=confirmado', 302);
}

async function memberLogin(request, env) {
  let email = '', password = '';
  try { const b = await request.json(); email = (b.email || '').trim().toLowerCase(); password = b.password || ''; }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const invalido = json({ ok: false, erro: 'E-mail ou senha incorretos.' }, 401);
  const m = await env.DB.prepare('SELECT email, pass_hash, pass_salt, status, type FROM members WHERE email = ?').bind(email).first();
  if (!m) return invalido;
  if (m.status !== 'active') return json({ ok: false, erro: 'Confirme seu e-mail antes de entrar.' }, 403);
  if (!await conferirSenha(password, m.pass_salt, m.pass_hash)) return invalido;

  const types = await tiposDoMembro(env, m.email);
  const sid = await criarSessao(env, 'msess', {
    email: m.email,
    role: 'member',
    types,                    // ← array, novo campo
    type: types[0] || 'Free', // ← mantido por compatibilidade (badge principal)
  });
  await logEvent(env, m.email, 'member_login', null);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie('m_session', sid, SESSION_TTL) });
}

/* ─────────── membros: recuperação de senha ─────────── */

async function memberForgot(request, url, env) {
  let email = '';
  try { email = ((await request.json()).email || '').trim().toLowerCase(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  // resposta genérica: nunca revelamos se o e-mail existe
  const generica = json({ ok: true });
  if (!emailValido(email)) return json({ ok: false, erro: 'Informe um e-mail válido.' }, 400);

  // cooldown reutilizando a chave já existente
  if (await env.KV.get('cd:' + email)) return generica;
  await env.KV.put('cd:' + email, '1', { expirationTtl: COOLDOWN_TTL });

  const m = await env.DB.prepare("SELECT email FROM members WHERE email=? AND status='active'").bind(email).first();
  if (!m) { await logEvent(env, email, 'reset_ignorado', 'sem_conta_ativa'); return generica; }

  const token   = randomToken(32);
  const expires = new Date(Date.now() + RESET_TTL * 1000).toISOString();
  await env.DB.prepare('UPDATE members SET reset_token=?, reset_expires=? WHERE email=?')
    .bind(token, expires, email).run();

  const link = url.origin + '/reset-senha/?token=' + token;
  const res  = await enviarEmail(env, email, 'Redefinir sua senha — Up Dance Xperience', emailReset(link));
  await logEvent(env, email, res.ok ? 'reset_enviado' : 'reset_erro', res.error || null);
  return generica;
}

async function memberReset(request, env) {
  let token = '', password = '';
  try { const b = await request.json(); token = (b.token || '').trim(); password = b.password || ''; }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!token) return json({ ok: false, erro: 'Token ausente.' }, 400);
  if (password.length < 8) return json({ ok: false, erro: 'A nova senha precisa ter ao menos 8 caracteres.' }, 400);

  const m = await env.DB.prepare('SELECT email, reset_expires FROM members WHERE reset_token=?').bind(token).first();
  if (!m) return json({ ok: false, erro: 'Link inválido.' }, 400);
  if (!m.reset_expires || new Date(m.reset_expires).getTime() < Date.now()) {
    await env.DB.prepare('UPDATE members SET reset_token=NULL, reset_expires=NULL WHERE email=?').bind(m.email).run();
    return json({ ok: false, erro: 'Link expirado. Solicite outro.' }, 400);
  }

  const { hash, salt } = await hashSenha(password);
  await env.DB.prepare('UPDATE members SET pass_hash=?, pass_salt=?, reset_token=NULL, reset_expires=NULL WHERE email=?')
    .bind(hash, salt, m.email).run();

  // invalida todas as sessões ativas desse e-mail (varre por prefixo)
  try {
    let cursor;
    do {
      const list = await env.KV.list({ prefix: 'msess:', cursor });
      for (const k of list.keys) {
        const raw = await env.KV.get(k.name);
        if (raw) { try { const s = JSON.parse(raw); if (s.email === m.email) await env.KV.delete(k.name); } catch {} }
      }
      cursor = list.list_complete ? undefined : list.cursor;
    } while (cursor);
  } catch (e) { console.error('purge sessions:', e.message); }

  await logEvent(env, m.email, 'reset_concluido', null);
  return json({ ok: true });
}

async function paginaReset(request, url, env) {
  // Redireciona para a página estática se ela existir nos ASSETS;
  // caso o worker precise servir inline, troque isto por um HTML simples.
  return env.ASSETS.fetch(request);
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
  //const sid = await criarSessao(env, 'msess', { email, role: 'member' });
  const types = await tiposDoMembro(env, email);
  const sid = await criarSessao(env, 'msess', {
    email,
    role: 'member',
    types,
    type: types[0] || 'Free',
  }); //<-- ALTERAR APÓS TODOS OS ALUNOS SE CADASTRAREM -->
  //const sid = await criarSessao(env, 'msess', { email, role: 'member', type: (t && t.type) || 'Aluno(a)' });
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

/*async function dadosAdmin(env) {
  const subs = await env.DB.prepare('SELECT email, name, phone, status, created_at, confirmed_at FROM subscribers ORDER BY id DESC LIMIT 100').all();
  const mem  = await env.DB.prepare('SELECT email, name, phone, status, type, created_at, confirmed_at FROM members ORDER BY id DESC LIMIT 100').all();
  const evs  = await env.DB.prepare('SELECT email, type, detail, created_at FROM events ORDER BY id DESC LIMIT 100').all();
  //const types = await env.DB.prepare('SELECT email, name, phone, status, type, created_at, confirmed_at FROM members ORDER BY id DESC LIMIT 100').all();
  const stats = await env.DB.prepare(
    "SELECT (SELECT COUNT(*) FROM members) AS membros," +
    " (SELECT COUNT(*) FROM members WHERE status='active') AS membros_ativos," +
    " (SELECT COUNT(*) FROM subscribers WHERE status='confirmed') AS news_confirmados," +
    " (SELECT COUNT(*) FROM events WHERE type LIKE '%_erro') AS erros"
  ).first();
  return json({ stats, members: mem.results || [], subscribers: subs.results || [], events: evs.results || [], memberTypes: MEMBER_TYPES, });
}*/

/* DEPOIS */
const ADMIN_CACHE_KEY = 'admin:data';
const ADMIN_CACHE_TTL = 60; // segundos

async function dadosAdmin(env) {
  // 1) tenta cache
  const cached = await env.KV.get(ADMIN_CACHE_KEY);
  if (cached) {
    return new Response(cached, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
    });
  }

  // 2) miss: dispara as queries em batch (1 round-trip só)
  const [subs, mem, memTypes, stats] = await env.DB.batch([
    env.DB.prepare('SELECT email, name, phone, status, created_at, confirmed_at FROM subscribers ORDER BY id DESC LIMIT 50'),
    env.DB.prepare('SELECT email, name, phone, status, type, created_at, confirmed_at FROM members ORDER BY id DESC LIMIT 50'),
    env.DB.prepare(
      'SELECT mt.email, mt.type FROM member_types mt ' +
      'JOIN (SELECT email FROM members ORDER BY id DESC LIMIT 50) top50 ' +
      'ON top50.email = mt.email'
    ),
    env.DB.prepare(
      "SELECT " +
      "  MAX(CASE WHEN name='membros'          THEN value END) AS membros," +
      "  MAX(CASE WHEN name='membros_ativos'   THEN value END) AS membros_ativos," +
      "  MAX(CASE WHEN name='news_confirmados' THEN value END) AS news_confirmados," +
      "  MAX(CASE WHEN name='erros'            THEN value END) AS erros " +
      "FROM counters"
    )
  ]);

  // agrupa tipos por email
  const typesByEmail = {};
  for (const r of (memTypes.results || [])) {
    (typesByEmail[r.email] ||= []).push(r.type);
  }
  const membersEnriched = (mem.results || []).map(m => ({
    ...m,
    types: typesByEmail[m.email] || (m.type ? [m.type] : []),
  }));

  const payload = JSON.stringify({
    stats: stats.results?.[0] || {},
    members:     membersEnriched,
    subscribers: subs.results || [],
    memberTypes: MEMBER_TYPES,
  });

  // 3) grava no cache (fire-and-forget não é necessário aqui; é rápido)
  await env.KV.put(ADMIN_CACHE_KEY, payload, { expirationTtl: ADMIN_CACHE_TTL });

  return new Response(payload, {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
  });
}

async function dadosAdminEventos(env) {
    const CACHE_KEY = 'admin:events';
    const cached = await env.KV.get(CACHE_KEY);
    if (cached) return new Response(cached, { status: 200, headers: { 'Content-Type': 'application/json' } });

    const evs = await env.DB.prepare(
      'SELECT email, type, detail, created_at FROM events ORDER BY id DESC LIMIT 50'
    ).all();
    const payload = JSON.stringify({ events: evs.results || [] });
    await env.KV.put(CACHE_KEY, payload, { expirationTtl: ADMIN_CACHE_TTL });
    return new Response(payload, { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

/* ─────────────────── admin: gestão de "type" de um membro ─────────────────── */

async function adminMemberLookup(request, env) {
  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  if (!emailValido(email)) return json({ ok: false, erro: 'E-mail inválido.' }, 400);

  const m = await env.DB.prepare(
    'SELECT email, name, phone, status, type, created_at, confirmed_at FROM members WHERE email = ?'
  ).bind(email).first();

  if (!m) return json({ ok: false, erro: 'Membro não encontrado.' }, 404);
  return json({ ok: true, member: m, types: MEMBER_TYPES });
}

/* ─────────── admin: atualizar "type" de um membro ─────────── */
async function adminMemberUpdateType(request, env, admin) {
  let email = '', types = [];
  try {
    const b = await request.json();
    email = (b.email || '').trim().toLowerCase();
    // Aceita { types: [...] } (novo) ou { type: '...' } (compat retro)
    if (Array.isArray(b.types)) types = b.types.map(t => String(t || '').trim());
    else if (b.type)            types = [String(b.type).trim()];
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!emailValido(email)) return json({ ok: false, erro: 'E-mail inválido.' }, 400);
  if (!types.length)       return json({ ok: false, erro: 'Informe ao menos 1 tipo.' }, 400);

  const invalidos = types.filter(t => !MEMBER_TYPES.includes(t));
  if (invalidos.length) return json({ ok: false, erro: 'Tipos inválidos: ' + invalidos.join(', ') }, 400);

  const m = await env.DB.prepare('SELECT email FROM members WHERE email = ?').bind(email).first();
  if (!m) return json({ ok: false, erro: 'Membro não encontrado.' }, 404);

  const anteriores = await tiposDoMembro(env, email);
  const agora = new Date().toISOString();

  // Reescreve o conjunto em 1 batch: apaga todos os pares antigos, insere os novos,
  // e atualiza members.type para refletir o "tipo principal" (o primeiro do array).
  const stmts = [
    env.DB.prepare('DELETE FROM member_types WHERE email = ?').bind(email),
  ];
  for (const t of types) {
    stmts.push(env.DB.prepare(
      'INSERT INTO member_types (email, type, created_at) VALUES (?,?,?)'
    ).bind(email, t, agora));
  }
  stmts.push(env.DB.prepare('UPDATE members SET type = ? WHERE email = ?').bind(types[0], email));
  await env.DB.batch(stmts);

  await env.KV.delete(ADMIN_CACHE_KEY);
  await logEvent(
    env, email, 'admin_update_types',
    `[${anteriores.join(',')}] → [${types.join(',')}] por ${admin.email}`
  );
  return json({ ok: true, alterado: true, types, anteriores });
}

async function adminAccessList(env) {
  const [resources, rules] = await env.DB.batch([
    env.DB.prepare('SELECT key, label, path_prefix, icon, description FROM resources ORDER BY label'),
    env.DB.prepare('SELECT resource_key, member_type FROM access_rules'),
  ]);
  const map = {};
  for (const r of (rules.results || [])) (map[r.resource_key] ||= []).push(r.member_type);
  return json({
    ok: true,
    memberTypes: MEMBER_TYPES,
    resources: (resources.results || []).map(r => ({ ...r, allowed: map[r.key] || [] })),
  });
}

async function adminResourceSave(request, env, admin) {
  let key = '', label = '', path_prefix = '', icon = '', description = '';
  try { const b = await request.json();
    key         = (b.key         || '').trim().toLowerCase();
    label       = (b.label       || '').trim().slice(0, 120);
    path_prefix = (b.path_prefix || '').trim();
    icon        = (b.icon        || '').trim().slice(0, 60);   // ex.: 'star-four-points-outline'
    description = (b.description || '').trim().slice(0, 240);
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  if (!/^[a-z0-9\-]{2,60}$/.test(key)) return json({ ok: false, erro: 'Chave inválida (use a-z, 0-9, hífen).' }, 400);
  if (!label) return json({ ok: false, erro: 'Rótulo obrigatório.' }, 400);
  // sanidade: nome de ícone MDI segue o padrão "coisa-coisa-coisa"
  if (icon && !/^[a-z0-9\-]{2,60}$/.test(icon)) return json({ ok: false, erro: 'Ícone inválido (use nome MDI sem prefixo "mdi-").' }, 400);

  await env.DB.prepare(
    'INSERT INTO resources (key, label, path_prefix, icon, description, created_at) ' +
    'VALUES (?,?,?,?,?,?) ' +
    'ON CONFLICT(key) DO UPDATE SET ' +
    '  label       = excluded.label, ' +
    '  path_prefix = excluded.path_prefix, ' +
    '  icon        = excluded.icon, ' +
    '  description = excluded.description'
  ).bind(key, label, path_prefix || null, icon || null, description || null, new Date().toISOString()).run();

  await env.KV.delete(ACCESS_CACHE_KEY);
  await logEvent(env, admin.email, 'admin_resource_save', key);
  return json({ ok: true });
}

async function adminAccessSave(request, env, admin) {
  // body: { resource_key, types: ['Premium','Professor(a)', ...] }
  let key = '', tipos = [];
  try { const b = await request.json();
    key = (b.resource_key || '').trim();
    tipos = Array.isArray(b.types) ? b.types : [];
  } catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const invalidos = tipos.filter(t => !MEMBER_TYPES.includes(t));
  if (invalidos.length) return json({ ok: false, erro: 'Tipos inválidos: ' + invalidos.join(', ') }, 400);

  const existe = await env.DB.prepare('SELECT key FROM resources WHERE key=?').bind(key).first();
  if (!existe) return json({ ok: false, erro: 'Recurso não cadastrado.' }, 404);

  const now = new Date().toISOString();
  const stmts = [ env.DB.prepare('DELETE FROM access_rules WHERE resource_key=?').bind(key) ];
  for (const t of tipos) {
    stmts.push(env.DB.prepare(
      'INSERT INTO access_rules (resource_key, member_type, created_at) VALUES (?,?,?)'
    ).bind(key, t, now));
  }
  await env.DB.batch(stmts);
  await env.KV.delete(ACCESS_CACHE_KEY);
  await logEvent(env, admin.email, 'admin_access_save', key + ': ' + tipos.join(','));
  return json({ ok: true });
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

  /* DEPOIS */
  if (existente) {
    await env.DB.prepare('UPDATE subscribers SET confirm_token=?, name=?, phone=?, created_at=? WHERE email=?')
      .bind(token, name, phone, agora, email).run();
  } else {
    await env.DB.prepare('INSERT INTO subscribers (email, name, phone, status, confirm_token, created_at) VALUES (?,?,?,?,?,?)')
      .bind(email, name, phone, 'pending', token, agora).run();
    await env.KV.delete(ADMIN_CACHE_KEY);                                    // <-- adicionar
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
  /* DEPOIS */
  if (row.status !== 'confirmed') {
    await env.DB.prepare('UPDATE subscribers SET status=?, confirmed_at=?, confirm_token=NULL WHERE confirm_token=?')
      .bind('confirmed', new Date().toISOString(), token).run();
    await env.DB.prepare("UPDATE counters SET value = value + 1 WHERE name = 'news_confirmados'").run();
    await env.KV.delete(ADMIN_CACHE_KEY);                                    // <-- adicionar
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

function emailReset(link) {
  return moldura(`<h2 style="margin:0 0 12px;font-size:18px;color:#fff">Redefinir sua senha</h2>
    <p style="color:#b9bad6;font-size:14px;line-height:1.6;margin:0 0 22px">Recebemos um pedido para redefinir sua senha. O link abaixo vale 30 minutos e é de uso único.</p>
    ${botao(link, 'Criar nova senha')}
    <p style="color:#6f6c94;font-size:12px;margin:24px 0 0">Se não foi você, ignore este e-mail — sua senha atual continua válida.</p>`);
}

