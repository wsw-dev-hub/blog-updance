/* ================================================================
   ECONOMIA DE REPUTAÇÃO & DESEMPENHO — backend
   Duas moedas DISTINTAS derivadas de notas ABSOLUTAS de avaliação:
     • PR (Reputação): acumulada — soma das notas ATUAIS. Reconhecimento
       do corpo de trabalho; cresce com volume × qualidade.
     • PD (Desempenho): atual — média das últimas N notas (recência).
       Reflete a "forma" corrente; sobe e desce; escala 0..100.
   Notas são REAVALIÁVEIS: cada avaliação é uma linha em talent_avaliacoes;
   a nota atual de um progresso é a de maior id. PR/PD são materializados em
   talent_reputacao (por perfil e no rollup '_global'), no mesmo padrão de
   recalcularXP. Reusa helpers globais do index.js (json, logEvent, getMember,
   getAdmin, contador). Ganchado em talentosAvaliar (ver index.js).
================================================================ */

const REP = {
  notaMin: 0,
  notaMax: 100,          // escala da nota absoluta (ajustável)
  desempenhoJanela: 10,  // N últimas avaliações que compõem o Desempenho (recência)

  /* Escopo dos TÍTULOS — DECISÃO EM ABERTO (perfil vs global).
     'perfil'  → títulos por perfil real (bailarino/professor/performer/trilhas)
     'global'  → um único título agregando todos os perfis ('_global') */
  escopoTitulos: 'perfil',

  /* Catálogo PROVISÓRIO de títulos (limiares ajustáveis). */
  titulosReputacao: [   // sobre PR (acumulada)
    { id: 'rep-1', nome: 'Reconhecido(a)', min: 500  },
    { id: 'rep-2', nome: 'Referência',     min: 1500 },
    { id: 'rep-3', nome: 'Autoridade',     min: 4000 },
    { id: 'rep-4', nome: 'Lenda',          min: 8000 },
  ],
  titulosDesempenho: [  // sobre PD (0..100)
    { id: 'des-1', nome: 'Consistente', min: 60 },
    { id: 'des-2', nome: 'Destaque',    min: 75 },
    { id: 'des-3', nome: 'Excelência',  min: 88 },
    { id: 'des-4', nome: 'Elite',       min: 95 },
  ],
};

const GLOBAL = '_global';

function notaValida(x) {
  const n = Math.round(Number(x));
  if (!Number.isFinite(n)) return null;
  if (n < REP.notaMin || n > REP.notaMax) return null;
  return n;
}

/* Registra uma nota (1ª avaliação OU reavaliação) e recomputa PR/PD. */
async function registrarNota(env, { progressoId, email, perfil, desafioId, nota, avaliador, parecer }) {
  await env.DB.prepare(
    'INSERT INTO talent_avaliacoes (progresso_id, email, perfil_id, desafio_id, nota, avaliador, parecer) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(progressoId, email, perfil, desafioId, nota, avaliador || null, parecer || null).run();
  await env.DB.prepare(
    "INSERT INTO counters (name, value) VALUES ('reputacao_avaliacoes', 1) " +
    "ON CONFLICT(name) DO UPDATE SET value = value + 1"
  ).run();
  return recalcularReputacao(env, email);
}

/* Recomputa PR e PD por perfil e no rollup global, a partir das notas ATUAIS
   (última avaliação de cada progresso). Materializa em talent_reputacao. */
async function recalcularReputacao(env, email) {
  const cur = (await env.DB.prepare(
    'SELECT a.perfil_id AS perfil, a.nota AS nota, a.id AS aid ' +
    'FROM talent_avaliacoes a ' +
    'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes WHERE email = ? GROUP BY progresso_id) L ' +
    '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
    'WHERE a.email = ? ORDER BY a.id DESC'
  ).bind(email, email).all()).results || [];

  const grupos = {};                                  // perfil -> [notas em ordem de recência]
  const push = (k, nota) => { (grupos[k] = grupos[k] || []).push(nota); };
  cur.forEach(r => { push(r.perfil, r.nota); push(GLOBAL, r.nota); });

  const escopos = [];
  for (const [perfil, notas] of Object.entries(grupos)) {
    const pr = notas.reduce((a, n) => a + n, 0);                       // acumulada
    const jan = notas.slice(0, REP.desempenhoJanela);                 // N mais recentes
    const pd = jan.length ? Math.round(jan.reduce((a, n) => a + n, 0) / jan.length) : 0;
    await env.DB.prepare(
      'INSERT INTO talent_reputacao (email, perfil_id, pr, pd, n_avaliacoes, updated_at) ' +
      "VALUES (?, ?, ?, ?, ?, datetime('now')) " +
      'ON CONFLICT(email, perfil_id) DO UPDATE SET ' +
      "pr = excluded.pr, pd = excluded.pd, n_avaliacoes = excluded.n_avaliacoes, updated_at = datetime('now')"
    ).bind(email, perfil, pr, pd, notas.length).run();
    escopos.push({ perfil, pr, pd, n: notas.length });
  }
  await concederRepTitulos(env, email, escopos);
  return escopos;
}

async function concederRepTitulos(env, email, escopos) {
  for (const e of escopos) {
    const isGlobal = e.perfil === GLOBAL;
    if (REP.escopoTitulos === 'perfil' && isGlobal) continue;
    if (REP.escopoTitulos === 'global' && !isGlobal) continue;
    for (const t of REP.titulosReputacao)  if (e.pr >= t.min) await grantRepTitulo(env, email, t.id, 'reputacao',  e.perfil);
    for (const t of REP.titulosDesempenho) if (e.pd >= t.min) await grantRepTitulo(env, email, t.id, 'desempenho', e.perfil);
  }
  await env.DB.prepare(
    "INSERT INTO counters (name, value) VALUES ('reputacao_titulos', (SELECT COUNT(*) FROM talent_rep_titulos)) " +
    "ON CONFLICT(name) DO UPDATE SET value = excluded.value"
  ).run();
}

async function grantRepTitulo(env, email, tituloId, eixo, escopo) {
  await env.DB.prepare(
    'INSERT OR IGNORE INTO talent_rep_titulos (email, titulo_id, eixo, escopo) VALUES (?, ?, ?, ?)'
  ).bind(email, tituloId, eixo, escopo).run();
}

/* ------------------------- HANDLERS HTTP ------------------------- */

/* POST /api/admin/talentos/reavaliar  Body: { id, nota, parecer? }
   Reavalia um progresso JÁ APROVADO (não mexe em status/XP; só nota/PR/PD). */
async function talentosReavaliar(request, env, admin) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const id = Math.floor(body.id || 0);
  const nota = notaValida(body.nota);
  const parecer = String(body.parecer || '').slice(0, 500);
  if (!id) return json({ ok: false, erro: 'Registro não informado.' }, 400);
  if (nota === null) return json({ ok: false, erro: `Nota inválida (use ${REP.notaMin}..${REP.notaMax}).` }, 400);

  const reg = await env.DB.prepare(
    'SELECT email, perfil_id, status, desafio_id FROM talent_progresso WHERE id = ?'
  ).bind(id).first();
  if (!reg) return json({ ok: false, erro: 'Registro inexistente.' }, 404);
  if (reg.status !== 'aprovado') return json({ ok: false, erro: 'Só é possível avaliar itens aprovados.' }, 409);

  await registrarNota(env, {
    progressoId: id, email: reg.email, perfil: reg.perfil_id, desafioId: reg.desafio_id,
    nota, avaliador: admin.email || 'admin', parecer,
  });
  await logEvent(env, reg.email, 'reputacao_reavaliar', `${reg.desafio_id} nota=${nota} por ${admin.email || 'admin'}`);
  const estado = await lerReputacao(env, reg.email);
  return json({ ok: true, nota, reputacao: estado });
}

/* GET /api/reputacao/estado — PR/PD e títulos do membro logado. */
async function reputacaoEstado(request, env) {
  const m = await getMember(request, env);
  if (!m) return json(null, 401);
  return json({ ok: true, reputacao: await lerReputacao(env, m.email) });
}

async function lerReputacao(env, email) {
  const [rep, tit] = await env.DB.batch([
    env.DB.prepare('SELECT perfil_id, pr, pd, n_avaliacoes FROM talent_reputacao WHERE email = ?').bind(email),
    env.DB.prepare('SELECT titulo_id, eixo, escopo FROM talent_rep_titulos WHERE email = ?').bind(email),
  ]);
  const porPerfil = {}; let global = { pr: 0, pd: 0, n: 0 };
  for (const r of (rep.results || [])) {
    if (r.perfil_id === GLOBAL) global = { pr: r.pr, pd: r.pd, n: r.n_avaliacoes };
    else porPerfil[r.perfil_id] = { pr: r.pr, pd: r.pd, n: r.n_avaliacoes };
  }
  return { global, porPerfil, titulos: (tit.results || []) };
}
