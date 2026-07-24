/* ================================================================
   TEMPORADA FREE · Fundamentos  (backend aditivo)
   Reusa as tabelas talent_* com perfil_id = 'fundamentos'.
   Isolado das três árvores: guard próprio (resource 'temporada_free').
================================================================ */

const FUND_RESOURCE   = 'temporada_free';
const FUND_PERFIL     = 'fundamentos';
const FUND_LIMIAR_XPE = 342;   // === UDX_FUNDAMENTOS.temporada.limiarXPE (validado)

/* Portaria própria: Free+ com acesso a 'temporada_free'. */
async function temporadaGuard(request, env) {
  const m = await getMember(request, env);
  if (!m) return { erro: json(null, 401) };
  const types = Array.isArray(m.types) && m.types.length ? m.types : [m.type || 'Free'];
  const ok = await podeAcessar(env, types, FUND_RESOURCE);
  if (!ok) return { erro: json({ erro: 'sem acesso' }, 403) };
  return { email: m.email, types };
}

/* XPE = soma dos desafios aprovados do perfil 'fundamentos'. */
async function recalcularXPE(env, email) {
  const row = await env.DB.prepare(
    "SELECT COALESCE(SUM(xp),0) AS xpe FROM talent_progresso " +
    "WHERE email = ? AND perfil_id = ? AND status = 'aprovado'"
  ).bind(email, FUND_PERFIL).first();
  return row ? row.xpe : 0;
}

/* GET /api/temporada/estado → { xpe, desafios[], insignias[], elegivel } */
async function temporadaEstado(request, env) {
  const g = await temporadaGuard(request, env);
  if (g.erro) return g.erro;

  const [aprovados, insignias] = await env.DB.batch([
    env.DB.prepare(
      "SELECT desafio_id FROM talent_progresso " +
      "WHERE email = ? AND perfil_id = ? AND status = 'aprovado'"
    ).bind(g.email, FUND_PERFIL),
    env.DB.prepare(
      "SELECT titulo_id FROM talent_titulos WHERE email = ? AND perfil_id = ?"
    ).bind(g.email, FUND_PERFIL),
  ]);

  const xpe = await recalcularXPE(env, g.email);
  return json({
    xpe,
    desafios:  (aprovados.results || []).map(r => r.desafio_id),
    insignias: (insignias.results || []).map(r => r.titulo_id),
    elegivel:  xpe >= FUND_LIMIAR_XPE,
  });
}

/* POST /api/temporada/desafio  Body: { desafio, comprovacao? }
   O cliente informa QUAL desafio — nunca quanto vale (igual à árvore). */
async function temporadaEnviarDesafio(request, env) {
  const g = await temporadaGuard(request, env);
  if (g.erro) return g.erro;

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const desafioId = String(body.desafio || '').slice(0, 60);
  if (!desafioId) return json({ ok: false, erro: 'Desafio não informado.' }, 400);

  /* Só aceita desafios REALMENTE do perfil 'fundamentos' (blinda contra
     tentativa de creditar XP de outra árvore por este endpoint). */
  const d = await env.DB.prepare(
    "SELECT id, perfil_id, xp, auto_aprovar FROM talent_desafios " +
    "WHERE id = ? AND ativo = 1 AND perfil_id = ?"
  ).bind(desafioId, FUND_PERFIL).first();
  if (!d) {
    await logEvent(env, g.email, 'temporada_desafio_erro', `inexistente/fora do perfil: ${desafioId}`);
    return json({ ok: false, erro: 'Desafio inexistente ou fora da temporada.' }, 404);
  }

  const jaTem = await env.DB.prepare(
    'SELECT status FROM talent_progresso WHERE email = ? AND desafio_id = ?'
  ).bind(g.email, desafioId).first();
  if (jaTem) return json({ ok: true, status: jaTem.status, duplicado: true });

  const comprovacao = String(body.comprovacao || '').slice(0, 500);
  const status = d.auto_aprovar === 1 ? 'aprovado' : 'pendente';

  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO talent_progresso (email, desafio_id, perfil_id, xp, status, comprovacao, reviewed_at) ' +
      "VALUES (?, ?, ?, ?, ?, ?, CASE WHEN ? = 'aprovado' THEN datetime('now') ELSE NULL END)"
    ).bind(g.email, desafioId, FUND_PERFIL, d.xp, status, comprovacao, status),
    contador(env, status === 'aprovado' ? CNT_APROVADOS : CNT_PENDENTES, 1),
  ]);
  await logEvent(env, g.email, 'temporada_desafio_' + status, desafioId);

  if (status !== 'aprovado') return json({ ok: true, status: 'pendente' });

  const xpe = await recalcularXPE(env, g.email);
  /* Concede a insígnia e sinaliza elegibilidade ao cruzar o limiar. */
  const elegivel = xpe >= FUND_LIMIAR_XPE;
  if (elegivel) {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO talent_titulos (email, titulo_id, perfil_id) VALUES (?, ?, ?)'
    ).bind(g.email, 'fund-insignia', FUND_PERFIL).run();
  }
  return json({ ok: true, status: 'aprovado', xpe, elegivel });
}
