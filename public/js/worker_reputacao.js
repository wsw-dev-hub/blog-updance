/* ================================================================
   ECONOMIA DE REPUTAÇÃO & DESEMPENHO — backend  (Fase 1)
   -----------------------------------------------------------------
   Duas MOEDAS estatísticas derivadas de notas ABSOLUTAS de avaliação:
     • PR (Reputação): acumulada — soma das notas ATUAIS.
     • PD (Desempenho): média das últimas N notas (recência), 0..100.

   ─── ATUALIZAÇÃO DE ESTRATÉGIA (Fase 1) ───────────────────────────
   Os TÍTULOS foram reorganizados em três eixos:
     • 'reputacao' (rep-*)  → CONGELADO. Será substituído por um
       ranking SAZONAL (temporada de atividades exclusivas) numa
       fase futura. Nenhuma concessão automática nesta fase; os
       registros pré-existentes são preservados como legado.
     • 'desempenho' (des-*) → CONGELADO. As bandas antigas
       (Consistente / Destaque / Excelência / Elite) dão lugar, na
       Fase 2, aos 7 títulos escalonados POR ESTILO (dependem de
       tabelas ainda inexistentes de habilidade↔estilo e ↔quesito).
       Nenhuma concessão nesta fase.
     • 'transversal' (trans-*) → IMPLEMENTADO NESTA FASE. Concessão
       DECLARATIVA por reconciliação: a cada avaliação, o motor
       recomputa o CONJUNTO de transversais elegíveis do membro e
       aplica INSERT nos ganhos e DELETE nos perdidos. Isso concede
       a REVOGAÇÃO automática exigida quando uma reavaliação para
       baixo quebra o critério.

   ─── CRITÉRIOS DOS TRANSVERSAIS DA FASE 1 ─────────────────────────
   Todos verificáveis com o schema atual (talent_progresso /
   talent_avaliacoes). Nenhum depende das tabelas suspensas.
     • trans-forjador   Forjador do Movimento    perfil=bailarino,
                         3 avaliações mais recentes com nota > 90
                         (nota ATUAL de cada progresso).
     • trans-pilar      Pilar da Presença        perfil=performer,
                         mesma regra.
     • trans-semeador   Semeador da Essência     desafio prof-tit-d1
                         aprovado (trilha professor concluída).
     • trans-inspirador Inspirador de Símbolos   critério provisório
                         idêntico ao Semeador; será atualizado
                         quando a trilha específica existir.

   ─── SUSPENSOS PARA FASE 2 (exigem tabelas novas) ─────────────────
     • Guardião do Estilo   (habilidade↔estilo)
     • Intérprete da Jornada (habilidade↔quesito 'freestyle')
     • Arquiteto do Flow     (interseção: estilo popping + coreografia)
     • Escultor de Atmosferas (habilidade↔quesito 'solo' + performer)
     • Os 35 títulos escalonados por estilo (PD por estilo)

   ─── COMPATIBILIDADE ───────────────────────────────────────────────
   Aditivo. Nenhuma mudança em schema. Coluna 'eixo' em
   talent_rep_titulos passa a admitir também o valor 'transversal'
   (é TEXT, sem CHECK — nada quebra). Coluna 'escopo' segue como
   perfil_id ('bailarino'/'professor'/'performer') para os
   transversais desta fase — a heterogeneidade de escopo por estilo/
   quesito entra só na Fase 2.
================================================================ */

const REP = {
  notaMin: 0,
  notaMax: 100,
  desempenhoJanela: 10,

  /* Escopo dos títulos REP/DES: mantido como 'perfil' para preservar
     a semântica dos registros históricos. Sem efeito prático nesta
     fase, já que rep-* e des-* estão congelados. */
  escopoTitulos: 'perfil',

  /* Catálogo LEGADO — apenas referência para o front (via
     reputacao.data.js) desenhar histórico. NADA é concedido a
     partir destas listas na Fase 1. */
  titulosReputacao: [
    { id: 'rep-1', nome: 'Reconhecido(a)', min: 500  },
    { id: 'rep-2', nome: 'Referência',     min: 1500 },
    { id: 'rep-3', nome: 'Autoridade',     min: 4000 },
    { id: 'rep-4', nome: 'Lenda',          min: 8000 },
  ],
  titulosDesempenho: [
    { id: 'des-1', nome: 'Consistente', min: 60 },
    { id: 'des-2', nome: 'Destaque',    min: 75 },
    { id: 'des-3', nome: 'Excelência',  min: 88 },
    { id: 'des-4', nome: 'Elite',       min: 95 },
  ],

  /* Catálogo dos transversais implementados na Fase 1. Cada entrada
     traz o critério em forma DECLARATIVA — o motor consome esta lista
     em reconciliarTransversais(). Ordem preservada para exibição.  */
  titulosTransversais: [
    { id: 'trans-forjador',   nome: 'Forjador do Movimento',  escopo: 'bailarino',
      criterio: { tipo: 'consecutivas_perfil', perfil: 'bailarino', n: 3, minNota: 91 } },
    { id: 'trans-pilar',      nome: 'Pilar da Presença',      escopo: 'performer',
      criterio: { tipo: 'consecutivas_perfil', perfil: 'performer', n: 3, minNota: 91 } },
    { id: 'trans-semeador',   nome: 'Semeador da Essência',   escopo: 'professor',
      criterio: { tipo: 'desafio_aprovado', desafioId: 'prof-tit-d1' } },
    { id: 'trans-inspirador', nome: 'Inspirador de Símbolos', escopo: 'professor',
      criterio: { tipo: 'desafio_aprovado', desafioId: 'prof-tit-d1' } },
  ],
};

const GLOBAL = '_global';
const EIXO_TRANSVERSAL = 'transversal';

function notaValida(x) {
  const n = Math.round(Number(x));
  if (!Number.isFinite(n)) return null;
  if (n < REP.notaMin || n > REP.notaMax) return null;
  return n;
}

/* Registra uma nota (1ª avaliação OU reavaliação) e recomputa PR/PD
   + reconcilia transversais. */
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

/* Recomputa PR e PD por perfil e no rollup global.  Rep/Des ficam
   apenas materializados como estatística — não geram títulos na
   Fase 1.  Em seguida, reconcilia os títulos transversais. */
async function recalcularReputacao(env, email) {
  const cur = (await env.DB.prepare(
    'SELECT a.perfil_id AS perfil, a.nota AS nota, a.id AS aid ' +
    'FROM talent_avaliacoes a ' +
    'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes WHERE email = ? GROUP BY progresso_id) L ' +
    '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
    'WHERE a.email = ? ORDER BY a.id DESC'
  ).bind(email, email).all()).results || [];

  const grupos = {};
  const push = (k, nota) => { (grupos[k] = grupos[k] || []).push(nota); };
  cur.forEach(r => { push(r.perfil, r.nota); push(GLOBAL, r.nota); });

  const escopos = [];
  for (const [perfil, notas] of Object.entries(grupos)) {
    const pr = notas.reduce((a, n) => a + n, 0);
    const jan = notas.slice(0, REP.desempenhoJanela);
    const pd = jan.length ? Math.round(jan.reduce((a, n) => a + n, 0) / jan.length) : 0;
    await env.DB.prepare(
      'INSERT INTO talent_reputacao (email, perfil_id, pr, pd, n_avaliacoes, updated_at) ' +
      "VALUES (?, ?, ?, ?, ?, datetime('now')) " +
      'ON CONFLICT(email, perfil_id) DO UPDATE SET ' +
      "pr = excluded.pr, pd = excluded.pd, n_avaliacoes = excluded.n_avaliacoes, updated_at = datetime('now')"
    ).bind(email, perfil, pr, pd, notas.length).run();
    escopos.push({ perfil, pr, pd, n: notas.length });
  }
  await reconciliarTransversais(env, email);
  return escopos;
}

/* --------------------- RECONCILIAÇÃO TRANSVERSAL -----------------
   Calcula o CONJUNTO de transversais que o membro DEVE ter agora
   (à luz das notas atuais e dos desafios aprovados) e:
     • INSERE em talent_rep_titulos os que ele ainda não tem,
     • REMOVE de talent_rep_titulos os que ele tinha e perdeu.
   Isso concede tanto a concessão automática quanto a REVOGAÇÃO em
   caso de reavaliação para baixo.
   Escopo do DELETE limitado a eixo='transversal' — não toca rep-* /
   des-* legados nem qualquer título vindo de outra fonte. */
async function reconciliarTransversais(env, email) {
  const alvo = new Set();
  const escoposPorId = {};
  for (const t of REP.titulosTransversais) {
    const ok = await avaliarCriterioTransversal(env, email, t.criterio);
    if (ok) { alvo.add(t.id); escoposPorId[t.id] = t.escopo; }
  }
  const atuais = (await env.DB.prepare(
    "SELECT titulo_id, escopo FROM talent_rep_titulos WHERE email = ? AND eixo = ?"
  ).bind(email, EIXO_TRANSVERSAL).all()).results || [];
  const atuaisSet = new Set(atuais.map(r => r.titulo_id));

  for (const id of alvo) {
    if (!atuaisSet.has(id)) {
      await env.DB.prepare(
        'INSERT OR IGNORE INTO talent_rep_titulos (email, titulo_id, eixo, escopo) VALUES (?, ?, ?, ?)'
      ).bind(email, id, EIXO_TRANSVERSAL, escoposPorId[id]).run();
    }
  }
  for (const r of atuais) {
    if (!alvo.has(r.titulo_id)) {
      await env.DB.prepare(
        'DELETE FROM talent_rep_titulos WHERE email = ? AND titulo_id = ? AND eixo = ? AND escopo = ?'
      ).bind(email, r.titulo_id, EIXO_TRANSVERSAL, r.escopo).run();
    }
  }
  await env.DB.prepare(
    "INSERT INTO counters (name, value) VALUES ('reputacao_titulos', (SELECT COUNT(*) FROM talent_rep_titulos)) " +
    "ON CONFLICT(name) DO UPDATE SET value = excluded.value"
  ).run();
}

/* Avalia um critério declarativo do catálogo de transversais.
   Retorna true/false. Todo critério aqui é verificável no schema
   atual — nada de habilidade↔estilo, ↔quesito, insígnias ou
   elegibilidade (esses ficam para a Fase 2). */
async function avaliarCriterioTransversal(env, email, criterio) {
  if (!criterio || !criterio.tipo) return false;
  if (criterio.tipo === 'desafio_aprovado') {
    const r = await env.DB.prepare(
      "SELECT 1 AS ok FROM talent_progresso WHERE email = ? AND desafio_id = ? AND status = 'aprovado' LIMIT 1"
    ).bind(email, criterio.desafioId).first();
    return !!(r && r.ok);
  }
  if (criterio.tipo === 'consecutivas_perfil') {
    // As N avaliações mais recentes daquele perfil (nota ATUAL de
    // cada progresso — MAX(id) por progresso) devem TODAS satisfazer
    // nota >= criterio.minNota. Se houver menos de N avaliações, não
    // atende (evita gatilho por notas isoladas).
    const rows = (await env.DB.prepare(
      'SELECT a.nota AS nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? AND perfil_id = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'WHERE a.email = ? AND a.perfil_id = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, criterio.perfil, email, criterio.perfil, criterio.n).all()).results || [];
    if (rows.length < criterio.n) return false;
    return rows.every(r => Number(r.nota) >= criterio.minNota);
  }
  return false;
}

/* ------------------------- HANDLERS HTTP ------------------------- */

/* POST /api/admin/talentos/reavaliar  Body: { id, nota, parecer? }
   Reavalia um progresso JÁ APROVADO (não mexe em status/XP). A
   reconciliação pode CONCEDER ou REVOGAR títulos transversais em
   consequência — o front (avaliacao.html) já alerta a coordenação
   sobre isso antes de confirmar a reavaliação. */
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

  const antes = await lerReputacao(env, reg.email);
  await registrarNota(env, {
    progressoId: id, email: reg.email, perfil: reg.perfil_id, desafioId: reg.desafio_id,
    nota, avaliador: admin.email || 'admin', parecer,
  });
  await logEvent(env, reg.email, 'reputacao_reavaliar', `${reg.desafio_id} nota=${nota} por ${admin.email || 'admin'}`);
  const depois = await lerReputacao(env, reg.email);

  // Log de auditoria de revogação, se houver.
  const idsAntes  = new Set((antes.titulos  || []).filter(t => t.eixo === EIXO_TRANSVERSAL).map(t => t.titulo_id));
  const idsDepois = new Set((depois.titulos || []).filter(t => t.eixo === EIXO_TRANSVERSAL).map(t => t.titulo_id));
  const revogados = [...idsAntes].filter(t => !idsDepois.has(t));
  const concedidos = [...idsDepois].filter(t => !idsAntes.has(t));
  if (revogados.length)  await logEvent(env, reg.email, 'reputacao_titulo_revogado',  revogados.join(','));
  if (concedidos.length) await logEvent(env, reg.email, 'reputacao_titulo_concedido', concedidos.join(','));

  return json({ ok: true, nota, reputacao: depois, revogados, concedidos });
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