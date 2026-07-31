/* ================================================================
   ECONOMIA DE REPUTAÇÃO & DESEMPENHO — backend  (Fase 2)
   -----------------------------------------------------------------
   Duas MOEDAS estatísticas:
     • PR (Reputação): acumulada — soma das notas ATUAIS.        [congelada]
     • PD (Desempenho): média das últimas N notas (recência).     [ativa]
       ⤷ na Fase 2 ganha uma dimensão adicional: PD POR ESTILO,
         materializada em talent_reputacao_estilo.

   ─── EIXOS DE TÍTULOS ──────────────────────────────────────────────
     'reputacao'   (rep-*)   → CONGELADO. Substituído por ranking
                               sazonal (a implementar).
     'estilo'      (est-*)   → 5 estilos × 7 marcos = 35 títulos.
                               Escala validada: PD ≥ {55,65,72,80,86,91,95}
                               com N ≥ {3,6,10,15,20,28,40}.
                               Escopo = estilo (hhd|pop|house|lock|break).
                               Sem gate intermediário.
     'transversal' (trans-*) → 8 títulos. Os 4 primeiros (Forjador,
                               Pilar, Semeador, Inspirador) já vinham
                               da Fase 1. Os 4 adicionais desta fase
                               têm GATE intermediário obrigatório:
                                 possuir ini-insignia em talent_titulos
                                 E ter >= 3 desafios perfil_id='intermediario'
                                 aprovados em talent_progresso.

   ─── VOCABULÁRIO CANÔNICO DE QUESITOS ──────────────────────────────
     solo, coreografia, improviso  (freestyle absorvido em improviso).

   ─── ESCOPO EM talent_rep_titulos ──────────────────────────────────
     • Fase 1 (perfil):     bailarino / performer / professor
     • Fase 2 (estilo):     hhd / pop / house / lock / break
     • Guardião do Estilo:  UMA linha por estilo elegível
                            (permite exibir "Guardião do Estilo · Popping"
                            e coexistir com outros).
     • Demais transversais: escopo = perfil onde o critério é medido.

   ─── HOUSE DANCE DORMENTE ──────────────────────────────────────────
     Os 7 títulos de House Dance estão semeados no catálogo mas nunca
     disparam enquanto não houver desafios com habilidade↔estilo='house'.
     Igual comportamento vale para Escultor de Atmosferas (quesito 'solo'
     em performer) — nenhuma habilidade performer tem quesito 'solo' hoje;
     o título fica pronto e dormente.

   ─── COMPATIBILIDADE ───────────────────────────────────────────────
     Aditivo. worker_trilhas.js NÃO é alterado — a insígnia 'ini-insignia'
     já é gravada em talent_titulos pelo hook trilhaAoAprovar existente
     quando xpe do perfil 'iniciante' atinge o limiar.
================================================================ */

const REP = {
  notaMin: 0,
  notaMax: 100,
  desempenhoJanela: 10,
  escopoTitulos: 'perfil',

  /* Legado (congelado). Nenhuma concessão nova. */
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

  /* Escala escalonada dos 7 marcos por estilo. */
  escalaEstilo: [
    { marco: 1, minPD: 55, minN: 3  },
    { marco: 2, minPD: 65, minN: 6  },
    { marco: 3, minPD: 72, minN: 10 },
    { marco: 4, minPD: 80, minN: 15 },
    { marco: 5, minPD: 86, minN: 20 },
    { marco: 6, minPD: 91, minN: 28 },
    { marco: 7, minPD: 95, minN: 40 },
  ],

  /* Nomes dos 7 marcos por estilo. Ordem: marco 1 → 7. */
  nomesPorEstilo: {
    hhd: [
      'Herói do Step Preciso', 'Navegador do Bounce', 'Semeador do Bounce Infinito',
      'Andarilho do Bounce Infinito', 'Tecelão do Groove',
      'Portador da Chama do Hip-Hop', 'Mensageiro do Flow Ancestral',
    ],
    pop: [
      'Amante dos Hits Eternos', 'Engenheiro da Isolação', 'Escultor do Robot',
      'Restaurador das Ondas Invisíveis', 'Navegador das Transições Geométricas',
      'Portador do Tutting Ancestral', 'Alquimista da Precisão',
    ],
    lock: [
      'Apontador das Verdades', 'Herdeiro do Campbellock', 'Portador do Lock Místico',
      'Corredor das Pernas Alegres', 'Artífice do Ritmo',
      'Palhaço Real da Roda', 'Mestre do Flava',
    ],
    break: [
      'Guia do Toprock Lendário', 'Forjador de Legados no Asfalto',
      'Alfaiate de Histórias no Chão', 'Explorador do Espaço Negativo',
      'Contador de Segundos Suspensos', 'Guardião do Cipher',
      'Domador do Eixo Invertido',
    ],
    house: [
      'Guia do Círculo Contínuo', 'Cartógrafo dos Pés Falantes',
      'Emissário do Sacred Groove', 'Explorador do Feeling',
      'Mago do Swing Suave', 'Domador da Queda Livre',
      'Condutor da Liberdade Criativa',
    ],
  },

  /* Transversais IMPLEMENTADOS (4 da Fase 1 + 4 desta fase, com gate). */
  titulosTransversais: [
    // ---- Fase 1 (sem gate) ----
    { id: 'trans-forjador',   nome: 'Forjador do Movimento',  escopo: 'bailarino',
      criterio: { tipo: 'consecutivas_perfil', perfil: 'bailarino', n: 3, minNota: 91 } },
    { id: 'trans-pilar',      nome: 'Pilar da Presença',      escopo: 'performer',
      criterio: { tipo: 'consecutivas_perfil', perfil: 'performer', n: 3, minNota: 91 } },
    { id: 'trans-semeador',   nome: 'Semeador da Essência',   escopo: 'professor',
      criterio: { tipo: 'desafio_aprovado', desafioId: 'prof-tit-d1' } },
    { id: 'trans-inspirador', nome: 'Inspirador de Símbolos', escopo: 'professor',
      criterio: { tipo: 'desafio_aprovado', desafioId: 'prof-tit-d1' } },

    // ---- Fase 2 (gate intermediário obrigatório) ----
    // Intérprete da Jornada: quesito improviso (unificado freestyle+improviso).
    { id: 'trans-interprete', nome: 'Intérprete da Jornada', escopo: 'improviso',
      criterio: { tipo: 'consecutivas_quesito', quesito: 'improviso', n: 3, minNota: 91, gateIntermediario: true } },

    // Arquiteto do Flow: interseção estilo=popping AND quesito=coreografia.
    { id: 'trans-arquiteto', nome: 'Arquiteto do Flow', escopo: 'pop',
      criterio: { tipo: 'consecutivas_estilo_quesito', estilo: 'pop', quesito: 'coreografia', n: 3, minNota: 91, gateIntermediario: true } },

    // Escultor de Atmosferas: quesito=solo em perfil=performer.
    // Dormente enquanto nenhuma habilidade performer tiver quesito 'solo'.
    { id: 'trans-escultor', nome: 'Escultor de Atmosferas', escopo: 'performer',
      criterio: { tipo: 'consecutivas_perfil_quesito', perfil: 'performer', quesito: 'solo', n: 3, minNota: 91, gateIntermediario: true } },

    // Guardião do Estilo: escopoPorEstilo=true → o motor avalia para
    // CADA estilo e emite UMA linha por estilo elegível (escopo=estilo).
    { id: 'trans-guardiao', nome: 'Guardião do Estilo', escopoPorEstilo: true,
      criterio: { tipo: 'consecutivas_estilo', n: 3, minNota: 91, gateIntermediario: true } },
  ],
};

const GLOBAL = '_global';
const EIXO_TRANSVERSAL = 'transversal';
const EIXO_ESTILO      = 'estilo';
const ESTILOS_CANONICOS = ['hhd', 'pop', 'house', 'lock', 'break'];

function notaValida(x) {
  const n = Math.round(Number(x));
  if (!Number.isFinite(n)) return null;
  if (n < REP.notaMin || n > REP.notaMax) return null;
  return n;
}

/* Ids dos 35 títulos escalonados. est-{estilo}-{marco 1..7}. */
function idsEstilo(estilo) {
  return REP.escalaEstilo.map(e => `est-${estilo}-${e.marco}`);
}
function todosIdsEstilo() {
  return ESTILOS_CANONICOS.flatMap(idsEstilo);
}

/* Registra nota e recomputa. */
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

/* Recomputa PR/PD por perfil, PD por estilo, e reconcilia
   títulos (por estilo + transversais). */
async function recalcularReputacao(env, email) {
  // ---- PR/PD por perfil (código já existente da Fase 1) ----
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

  // ---- PD por estilo (materialização Fase 2) ----
  await recalcularPDPorEstilo(env, email);

  // ---- Reconciliação de títulos ----
  await reconciliarTitulosEstilo(env, email);
  await reconciliarTransversais(env, email);

  return escopos;
}

/* Materializa PD por estilo em talent_reputacao_estilo.
   PD_estilo = média das N=10 últimas NOTAS ATUAIS do membro em
   avaliações cujo desafio_id resolve para uma habilidade que possui
   aquele estilo em talent_habilidade_estilo. Também materializa o
   total N_estilo (usado como gate dos 7 marcos). */
async function recalcularPDPorEstilo(env, email) {
  for (const estilo of ESTILOS_CANONICOS) {
    // Todas as notas atuais do membro naquele estilo, em ordem desc.
    const rows = (await env.DB.prepare(
      'SELECT a.nota AS nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'JOIN talent_desafios d ON d.id = a.desafio_id ' +
      'JOIN talent_habilidade_estilo he ON he.habilidade_id = d.habilidade_id ' +
      'WHERE a.email = ? AND he.estilo = ? ' +
      'ORDER BY a.id DESC'
    ).bind(email, email, estilo).all()).results || [];

    const n = rows.length;
    const jan = rows.slice(0, REP.desempenhoJanela);
    const pd = jan.length ? Math.round(jan.reduce((a, r) => a + Number(r.nota), 0) / jan.length) : 0;

    if (n === 0) {
      // Se já havia registro, zera; se não havia, não polui a tabela.
      await env.DB.prepare(
        'DELETE FROM talent_reputacao_estilo WHERE email = ? AND estilo = ?'
      ).bind(email, estilo).run();
      continue;
    }
    await env.DB.prepare(
      'INSERT INTO talent_reputacao_estilo (email, estilo, pd, n_avaliacoes, updated_at) ' +
      "VALUES (?, ?, ?, ?, datetime('now')) " +
      'ON CONFLICT(email, estilo) DO UPDATE SET ' +
      "pd = excluded.pd, n_avaliacoes = excluded.n_avaliacoes, updated_at = datetime('now')"
    ).bind(email, estilo, pd, n).run();
  }
}

/* --------------------- RECONCILIAÇÃO POR ESTILO ------------------
   Para cada estilo, calcula os marcos elegíveis (marco k é elegível
   se PD_estilo >= escala[k].minPD E N_estilo >= escala[k].minN).
   Aplica INSERT nos ganhos e DELETE nos perdidos. Escopo=estilo. */
async function reconciliarTitulosEstilo(env, email) {
  const alvo = new Set();
  for (const estilo of ESTILOS_CANONICOS) {
    const row = await env.DB.prepare(
      'SELECT pd, n_avaliacoes FROM talent_reputacao_estilo WHERE email = ? AND estilo = ?'
    ).bind(email, estilo).first();
    if (!row) continue;
    for (const e of REP.escalaEstilo) {
      if (row.pd >= e.minPD && row.n_avaliacoes >= e.minN) {
        alvo.add(`est-${estilo}-${e.marco}`);
      }
    }
  }

  const atuais = (await env.DB.prepare(
    "SELECT titulo_id, escopo FROM talent_rep_titulos WHERE email = ? AND eixo = ?"
  ).bind(email, EIXO_ESTILO).all()).results || [];
  const atuaisMap = new Map(atuais.map(r => [r.titulo_id, r.escopo]));

  // INSERT nos novos
  for (const id of alvo) {
    if (!atuaisMap.has(id)) {
      const estilo = id.split('-')[1]; // est-{estilo}-{marco}
      await env.DB.prepare(
        'INSERT OR IGNORE INTO talent_rep_titulos (email, titulo_id, eixo, escopo) VALUES (?, ?, ?, ?)'
      ).bind(email, id, EIXO_ESTILO, estilo).run();
    }
  }
  // DELETE nos perdidos
  for (const [id, escopo] of atuaisMap) {
    if (!alvo.has(id)) {
      await env.DB.prepare(
        'DELETE FROM talent_rep_titulos WHERE email = ? AND titulo_id = ? AND eixo = ? AND escopo = ?'
      ).bind(email, id, EIXO_ESTILO, escopo).run();
    }
  }
}

/* --------------------- RECONCILIAÇÃO TRANSVERSAL -----------------
   Como na Fase 1, mas agora suporta escopoPorEstilo (Guardião) e o
   gate intermediário. Cada critério define seu próprio escopo — para
   Guardião, gera múltiplas linhas (uma por estilo elegível). */
async function reconciliarTransversais(env, email) {
  // alvo: Map<titulo_id, Set<escopo>>
  const alvo = new Map();
  const setAlvo = (id, escopo) => {
    if (!alvo.has(id)) alvo.set(id, new Set());
    alvo.get(id).add(escopo);
  };

  const gateOK = await avaliarGateIntermediario(env, email);

  for (const t of REP.titulosTransversais) {
    if (t.criterio.gateIntermediario && !gateOK) continue;

    if (t.escopoPorEstilo) {
      // Guardião: para cada estilo, avalia critério com estilo injetado.
      for (const estilo of ESTILOS_CANONICOS) {
        const crit = Object.assign({}, t.criterio, { estilo });
        const ok = await avaliarCriterioTransversal(env, email, crit);
        if (ok) setAlvo(t.id, estilo);
      }
    } else {
      const ok = await avaliarCriterioTransversal(env, email, t.criterio);
      if (ok) setAlvo(t.id, t.escopo);
    }
  }

  const atuais = (await env.DB.prepare(
    "SELECT titulo_id, escopo FROM talent_rep_titulos WHERE email = ? AND eixo = ?"
  ).bind(email, EIXO_TRANSVERSAL).all()).results || [];

  // Chave composta titulo|escopo — coexistência de escopos para Guardião.
  const atuaisSet = new Set(atuais.map(r => `${r.titulo_id}|${r.escopo}`));
  const alvoSet   = new Set();
  for (const [id, escopos] of alvo) for (const s of escopos) alvoSet.add(`${id}|${s}`);

  // INSERT
  for (const key of alvoSet) {
    if (!atuaisSet.has(key)) {
      const [id, escopo] = key.split('|');
      await env.DB.prepare(
        'INSERT OR IGNORE INTO talent_rep_titulos (email, titulo_id, eixo, escopo) VALUES (?, ?, ?, ?)'
      ).bind(email, id, EIXO_TRANSVERSAL, escopo).run();
    }
  }
  // DELETE
  for (const r of atuais) {
    if (!alvoSet.has(`${r.titulo_id}|${r.escopo}`)) {
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

/* Gate "a partir do intermediário":
     possui 'ini-insignia' em talent_titulos
     E tem >= 3 desafios com perfil_id='intermediario' e status='aprovado'
   Interpretação semântica: os 3 desafios devem ser DO intermediário
   (perfil_id='intermediario'), não 3 quaisquer. Consistente com a
   ideia de "a partir do nível intermediário". */
async function avaliarGateIntermediario(env, email) {
  const ins = await env.DB.prepare(
    "SELECT 1 AS ok FROM talent_titulos WHERE email = ? AND titulo_id = 'ini-insignia' LIMIT 1"
  ).bind(email).first();
  if (!ins || !ins.ok) return false;
  const cnt = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM talent_progresso " +
    "WHERE email = ? AND perfil_id = 'intermediario' AND status = 'aprovado'"
  ).bind(email).first();
  return !!(cnt && cnt.c >= 3);
}

/* Avalia critério declarativo. Todos os tipos rodam sobre notas
   ATUAIS (última avaliação de cada progresso). */
async function avaliarCriterioTransversal(env, email, c) {
  if (!c || !c.tipo) return false;

  if (c.tipo === 'desafio_aprovado') {
    const r = await env.DB.prepare(
      "SELECT 1 AS ok FROM talent_progresso WHERE email = ? AND desafio_id = ? AND status = 'aprovado' LIMIT 1"
    ).bind(email, c.desafioId).first();
    return !!(r && r.ok);
  }

  if (c.tipo === 'consecutivas_perfil') {
    const rows = (await env.DB.prepare(
      'SELECT a.nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? AND perfil_id = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'WHERE a.email = ? AND a.perfil_id = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, c.perfil, email, c.perfil, c.n).all()).results || [];
    return rows.length >= c.n && rows.every(r => Number(r.nota) >= c.minNota);
  }

  if (c.tipo === 'consecutivas_estilo') {
    const rows = (await env.DB.prepare(
      'SELECT a.nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'JOIN talent_desafios d  ON d.id = a.desafio_id ' +
      'JOIN talent_habilidade_estilo he ON he.habilidade_id = d.habilidade_id ' +
      'WHERE a.email = ? AND he.estilo = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, email, c.estilo, c.n).all()).results || [];
    return rows.length >= c.n && rows.every(r => Number(r.nota) >= c.minNota);
  }

  if (c.tipo === 'consecutivas_quesito') {
    const rows = (await env.DB.prepare(
      'SELECT a.nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'JOIN talent_desafios d  ON d.id = a.desafio_id ' +
      'JOIN talent_habilidade_quesito hq ON hq.habilidade_id = d.habilidade_id ' +
      'WHERE a.email = ? AND hq.quesito = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, email, c.quesito, c.n).all()).results || [];
    return rows.length >= c.n && rows.every(r => Number(r.nota) >= c.minNota);
  }

  if (c.tipo === 'consecutivas_estilo_quesito') {
    const rows = (await env.DB.prepare(
      'SELECT a.nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'JOIN talent_desafios d  ON d.id = a.desafio_id ' +
      'JOIN talent_habilidade_estilo  he ON he.habilidade_id = d.habilidade_id ' +
      'JOIN talent_habilidade_quesito hq ON hq.habilidade_id = d.habilidade_id ' +
      'WHERE a.email = ? AND he.estilo = ? AND hq.quesito = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, email, c.estilo, c.quesito, c.n).all()).results || [];
    return rows.length >= c.n && rows.every(r => Number(r.nota) >= c.minNota);
  }

  if (c.tipo === 'consecutivas_perfil_quesito') {
    const rows = (await env.DB.prepare(
      'SELECT a.nota FROM talent_avaliacoes a ' +
      'JOIN (SELECT progresso_id, MAX(id) AS mid FROM talent_avaliacoes ' +
      '      WHERE email = ? AND perfil_id = ? GROUP BY progresso_id) L ' +
      '  ON L.progresso_id = a.progresso_id AND L.mid = a.id ' +
      'JOIN talent_desafios d  ON d.id = a.desafio_id ' +
      'JOIN talent_habilidade_quesito hq ON hq.habilidade_id = d.habilidade_id ' +
      'WHERE a.email = ? AND a.perfil_id = ? AND hq.quesito = ? ' +
      'ORDER BY a.id DESC LIMIT ?'
    ).bind(email, c.perfil, email, c.perfil, c.quesito, c.n).all()).results || [];
    return rows.length >= c.n && rows.every(r => Number(r.nota) >= c.minNota);
  }

  return false;
}

/* ------------------------- HANDLERS HTTP ------------------------- */

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

  // Diff detalhado (chave titulo_id|escopo para captar coexistência).
  const chave = t => `${t.titulo_id}|${t.escopo}`;
  const antesSet  = new Set((antes.titulos  || []).filter(t => t.eixo === EIXO_TRANSVERSAL || t.eixo === EIXO_ESTILO).map(chave));
  const depoisSet = new Set((depois.titulos || []).filter(t => t.eixo === EIXO_TRANSVERSAL || t.eixo === EIXO_ESTILO).map(chave));
  const revogados  = [...antesSet].filter(k => !depoisSet.has(k));
  const concedidos = [...depoisSet].filter(k => !antesSet.has(k));
  if (revogados.length)  await logEvent(env, reg.email, 'reputacao_titulo_revogado',  revogados.join(','));
  if (concedidos.length) await logEvent(env, reg.email, 'reputacao_titulo_concedido', concedidos.join(','));

  return json({ ok: true, nota, reputacao: depois, revogados, concedidos });
}

async function reputacaoEstado(request, env) {
  const m = await getMember(request, env);
  if (!m) return json(null, 401);
  return json({ ok: true, reputacao: await lerReputacao(env, m.email) });
}

async function lerReputacao(env, email) {
  const [rep, tit, est] = await env.DB.batch([
    env.DB.prepare('SELECT perfil_id, pr, pd, n_avaliacoes FROM talent_reputacao WHERE email = ?').bind(email),
    env.DB.prepare('SELECT titulo_id, eixo, escopo FROM talent_rep_titulos WHERE email = ?').bind(email),
    env.DB.prepare('SELECT estilo, pd, n_avaliacoes FROM talent_reputacao_estilo WHERE email = ?').bind(email),
  ]);
  const porPerfil = {}; let global = { pr: 0, pd: 0, n: 0 };
  for (const r of (rep.results || [])) {
    if (r.perfil_id === GLOBAL) global = { pr: r.pr, pd: r.pd, n: r.n_avaliacoes };
    else porPerfil[r.perfil_id] = { pr: r.pr, pd: r.pd, n: r.n_avaliacoes };
  }
  const porEstilo = {};
  for (const r of (est.results || [])) porEstilo[r.estilo] = { pd: r.pd, n: r.n_avaliacoes };

  return { global, porPerfil, porEstilo, titulos: (tit.results || []) };
}