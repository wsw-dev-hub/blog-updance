/* ================================================================
   AVALIAÇÕES — CRUD admin + visualização por aluno.
   Tabelas: avaliacao_alunos, avaliacoes_tecnicas, avaliacoes_performaticas,
   e todas as filhas cascadeadas. Ver sql/avaliacoes.sql.
   Integração ESM: importado por src/index.js.
================================================================ */

const NOTA_MIN = 0;
const NOTA_MAX = 10;
const STATUS_VALIDOS = new Set(['draft', 'published', 'archived']);
const TIPOS_FUND = new Set(['fundamento', 'complementar']);

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function logSeguro(env, email, type, detail) {
  try {
    await env.DB.prepare(
      'INSERT INTO events (type, email, detail, created_at) VALUES (?, ?, ?, ?)'
    ).bind(type, email || null, detail || null, new Date().toISOString()).run();
  } catch { /* silencioso */ }
}

/* Normaliza email para minúsculas + trim. Não valida formato aqui — cabe ao
   chamador rejeitar antes; aluno_email pode não estar em members. */
function normEmail(v) { return String(v || '').trim().toLowerCase(); }

/* Normaliza nota: null se vazio, número entre 0 e 10, senão null. */
function normNota(v) {
  if (v === null || v === undefined || v === '' ) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(NOTA_MIN, Math.min(NOTA_MAX, n));
}

function normStatus(v, def) {
  const s = String(v || def || 'draft').toLowerCase();
  return STATUS_VALIDOS.has(s) ? s : def || 'draft';
}

function sanearFicha(body) {
  if (!body || typeof body !== 'object') return { ok: false, erro: 'Corpo inválido.' };
  const aluno_email = normEmail(body.aluno_email);
  const aluno_nome  = String(body.aluno_nome || '').trim();
  if (!aluno_email) return { ok: false, erro: 'aluno_email é obrigatório.' };
  if (!aluno_nome)  return { ok: false, erro: 'aluno_nome é obrigatório.' };
  return {
    ok: true,
    val: {
      id:                    body.id != null && body.id !== '' ? Number(body.id) : null,
      aluno_email,
      aluno_nome,
      professor_nome:        body.professor_nome ? String(body.professor_nome).trim() : null,
      semestre:              body.semestre ? String(body.semestre).trim() : null,
      turma_organizacional:  body.turma_organizacional ? String(body.turma_organizacional).trim() : null,
      modalidade_turma:      body.modalidade_turma ? String(body.modalidade_turma).trim() : null,
      logo_src:              body.logo_src ? String(body.logo_src) : null,
      disciplina_perf_label: body.disciplina_perf_label ? String(body.disciplina_perf_label).trim() : null,
      disciplina_perf_texto: body.disciplina_perf_texto ? String(body.disciplina_perf_texto) : null,
      paginas_fixas:         (body.paginas_fixas && typeof body.paginas_fixas === 'object') ? body.paginas_fixas : {},
      ordem_paginas:         Array.isArray(body.ordem_paginas) ? body.ordem_paginas : [],
      status:                normStatus(body.status, 'draft'),
      fundamentos:                Array.isArray(body.fundamentos)                ? body.fundamentos                : [],
      observacoes:                Array.isArray(body.observacoes)                ? body.observacoes                : [],
      dicas:                      Array.isArray(body.dicas)                      ? body.dicas                      : [],
      tags:                       Array.isArray(body.tags)                       ? body.tags                       : [],
      insights:                   Array.isArray(body.insights)                   ? body.insights                   : [],
      habitos:                    Array.isArray(body.habitos)                    ? body.habitos                    : [],
      paginas_extras:             Array.isArray(body.paginas_extras)             ? body.paginas_extras             : [],
    },
  };
}

function sanearFichaPerf(body) {
  if (!body || typeof body !== 'object') return { ok: false, erro: 'Corpo inválido.' };
  const aluno_email = normEmail(body.aluno_email);
  const aluno_nome  = String(body.aluno_nome || '').trim();
  if (!aluno_email) return { ok: false, erro: 'aluno_email é obrigatório.' };
  if (!aluno_nome)  return { ok: false, erro: 'aluno_nome é obrigatório.' };
  return {
    ok: true,
    val: {
      id:                   body.id != null && body.id !== '' ? Number(body.id) : null,
      aluno_email,
      aluno_nome,
      tecnica_id:           body.tecnica_id != null && body.tecnica_id !== '' ? Number(body.tecnica_id) : null,
      professor_nome:       body.professor_nome ? String(body.professor_nome).trim() : null,
      semestre:             body.semestre ? String(body.semestre).trim() : null,
      turma_organizacional: body.turma_organizacional ? String(body.turma_organizacional).trim() : null,
      modalidade_turma:     body.modalidade_turma ? String(body.modalidade_turma).trim() : null,
      disciplina_label:     body.disciplina_label ? String(body.disciplina_label).trim() : null,
      disciplina_texto:     body.disciplina_texto ? String(body.disciplina_texto) : null,
      status:               normStatus(body.status, 'draft'),
      criterios:   Array.isArray(body.criterios)   ? body.criterios   : [],
      observacoes: Array.isArray(body.observacoes) ? body.observacoes : [],
      insights:    Array.isArray(body.insights)    ? body.insights    : [],
      dicas:       Array.isArray(body.dicas)       ? body.dicas       : [],
    },
  };
}

/* Descobre a próxima versão do aluno em UMA das tabelas (tec ou perf).
   Consulta ambas para manter a numeração global crescente por aluno. */
async function proximaVersao(env, aluno_email) {
  const [t, p] = await env.DB.batch([
    env.DB.prepare('SELECT COALESCE(MAX(versao),0) AS v FROM avaliacoes_tecnicas      WHERE aluno_email=?').bind(aluno_email),
    env.DB.prepare('SELECT COALESCE(MAX(versao),0) AS v FROM avaliacoes_performaticas WHERE aluno_email=?').bind(aluno_email),
  ]);
  const vt = (t.results && t.results[0] && t.results[0].v) || 0;
  const vp = (p.results && p.results[0] && p.results[0].v) || 0;
  return Math.max(vt, vp) + 1;
}

async function upsertAluno(env, email, nome, turmaOrg, modalidade) {
  const now = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO avaliacao_alunos (aluno_email, nome, turma_org, modalidade, created_at, updated_at) ' +
    'VALUES (?, ?, ?, ?, ?, ?) ' +
    'ON CONFLICT(aluno_email) DO UPDATE SET ' +
    '  nome=excluded.nome, turma_org=excluded.turma_org, modalidade=excluded.modalidade, updated_at=excluded.updated_at'
  ).bind(email, nome, turmaOrg || null, modalidade || null, now, now).run();
}

/* --------------------------------------------------------------------------
   GET /api/admin/avaliacoes/list  → lista de fichas (técnicas + perf.),
   agregadas por aluno para exibição no painel.
-------------------------------------------------------------------------- */
async function avaliacoesList(request, env) {
  try {
    const [tec, perf, alunos] = await env.DB.batch([
      env.DB.prepare(
        'SELECT id, aluno_email, aluno_nome, semestre, modalidade_turma, versao, status, ' +
        '       created_at, updated_at, published_at ' +
        'FROM avaliacoes_tecnicas ORDER BY updated_at DESC LIMIT 500'
      ),
      env.DB.prepare(
        'SELECT id, aluno_email, aluno_nome, tecnica_id, semestre, modalidade_turma, versao, status, ' +
        '       created_at, updated_at, published_at ' +
        'FROM avaliacoes_performaticas ORDER BY updated_at DESC LIMIT 500'
      ),
      env.DB.prepare('SELECT aluno_email, nome, turma_org, modalidade FROM avaliacao_alunos ORDER BY nome COLLATE NOCASE'),
    ]);
    return json({
      ok: true,
      tecnicas:      tec.results     || [],
      performaticas: perf.results    || [],
      alunos:        alunos.results  || [],
    });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao listar avaliações.', message: String((e && e.message) || e) }, 500);
  }
}

/* --------------------------------------------------------------------------
   GET /api/admin/avaliacoes/get?id=NN&tipo=tecnica|performatica
   Devolve ficha completa (cabeçalho + todas as filhas).
-------------------------------------------------------------------------- */
async function avaliacoesGet(request, env) {
  const url = new URL(request.url);
  const id  = Number(url.searchParams.get('id'));
  const tipo = String(url.searchParams.get('tipo') || 'tecnica');
  if (!Number.isFinite(id)) return json({ ok: false, erro: 'id inválido.' }, 400);

  try {
    if (tipo === 'performatica') return getPerformatica(env, id);
    return getTecnica(env, id);
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao carregar ficha.', message: String((e && e.message) || e) }, 500);
  }
}

async function getTecnica(env, id) {
  const [ficha, notas, obs, dicas, tags, hab, ins, pgext] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM avaliacoes_tecnicas       WHERE id=?').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_notas           WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_observacoes     WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_dicas           WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_tags            WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_habitos         WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_insights        WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_paginas_extras  WHERE avaliacao_id=? ORDER BY posicao, id').bind(id),
  ]);
  const f = ficha.results && ficha.results[0];
  if (!f) return json({ ok: false, erro: 'Ficha técnica não encontrada.' }, 404);
  return json({
    ok: true,
    tipo: 'tecnica',
    ficha: {
      ...f,
      paginas_fixas: safeJson(f.paginas_fixas_json, {}),
      ordem_paginas: safeJson(f.ordem_paginas_json, []),
      fundamentos:    notas.results  || [],
      observacoes:    obs.results    || [],
      dicas:          dicas.results  || [],
      tags:           tags.results   || [],
      habitos:        hab.results    || [],
      insights:       ins.results    || [],
      paginas_extras: pgext.results  || [],
    },
  });
}

async function getPerformatica(env, id) {
  const [ficha, crit, obs, ins, dicas] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM avaliacoes_performaticas       WHERE id=?').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_perf_criterios       WHERE avaliacao_perf_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_perf_observacoes     WHERE avaliacao_perf_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_perf_insights        WHERE avaliacao_perf_id=? ORDER BY posicao, id').bind(id),
    env.DB.prepare('SELECT * FROM avaliacao_perf_dicas           WHERE avaliacao_perf_id=? ORDER BY posicao, id').bind(id),
  ]);
  const f = ficha.results && ficha.results[0];
  if (!f) return json({ ok: false, erro: 'Ficha performática não encontrada.' }, 404);
  return json({
    ok: true,
    tipo: 'performatica',
    ficha: {
      ...f,
      criterios:   crit.results  || [],
      observacoes: obs.results   || [],
      insights:    ins.results   || [],
      dicas:       dicas.results || [],
    },
  });
}

function safeJson(s, def) { try { return JSON.parse(s); } catch { return def; } }

/* --------------------------------------------------------------------------
   POST /api/admin/avaliacoes/save  (técnica)
   Cria (id ausente) ou atualiza (id presente). Reescreve todas as filhas
   em batch atômico. Publicação define published_at.
-------------------------------------------------------------------------- */
async function avaliacoesSave(request, env, admin) {
  let body; try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const s = sanearFicha(body);
  if (!s.ok) return json({ ok: false, erro: s.erro }, 400);
  const v = s.val;
  const now = new Date().toISOString();

  try {
    await upsertAluno(env, v.aluno_email, v.aluno_nome, v.turma_organizacional, v.modalidade_turma);

    let fichaId = v.id;
    let criado  = false;

    if (fichaId != null) {
      const existe = await env.DB.prepare('SELECT id, status, published_at FROM avaliacoes_tecnicas WHERE id=?').bind(fichaId).first();
      if (!existe) return json({ ok: false, erro: 'Ficha não encontrada.' }, 404);
      const pubAt = v.status === 'published' ? (existe.published_at || now) : existe.published_at;
      await env.DB.prepare(
        'UPDATE avaliacoes_tecnicas SET aluno_email=?, aluno_nome=?, professor_nome=?, semestre=?, ' +
        'turma_organizacional=?, modalidade_turma=?, logo_src=?, disciplina_perf_label=?, ' +
        'disciplina_perf_texto=?, paginas_fixas_json=?, ordem_paginas_json=?, status=?, ' +
        'updated_at=?, published_at=? WHERE id=?'
      ).bind(
        v.aluno_email, v.aluno_nome, v.professor_nome, v.semestre,
        v.turma_organizacional, v.modalidade_turma, v.logo_src,
        v.disciplina_perf_label, v.disciplina_perf_texto,
        JSON.stringify(v.paginas_fixas), JSON.stringify(v.ordem_paginas),
        v.status, now, pubAt, fichaId
      ).run();
    } else {
      const versao = await proximaVersao(env, v.aluno_email);
      const pubAt  = v.status === 'published' ? now : null;
      const ins = await env.DB.prepare(
        'INSERT INTO avaliacoes_tecnicas (aluno_email, aluno_nome, professor_nome, semestre, ' +
        'turma_organizacional, modalidade_turma, logo_src, disciplina_perf_label, disciplina_perf_texto, ' +
        'paginas_fixas_json, ordem_paginas_json, versao, status, created_at, updated_at, published_at, created_by) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        v.aluno_email, v.aluno_nome, v.professor_nome, v.semestre,
        v.turma_organizacional, v.modalidade_turma, v.logo_src,
        v.disciplina_perf_label, v.disciplina_perf_texto,
        JSON.stringify(v.paginas_fixas), JSON.stringify(v.ordem_paginas),
        versao, v.status, now, now, pubAt, (admin && admin.email) || null
      ).run();
      fichaId = ins.meta && ins.meta.last_row_id;
      criado = true;
    }

    /* Filhas: delete-then-insert atômico. Ordem preservada pela posicao. */
    const ops = [
      env.DB.prepare('DELETE FROM avaliacao_notas          WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_observacoes    WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_dicas          WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_tags           WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_habitos        WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_insights       WHERE avaliacao_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_paginas_extras WHERE avaliacao_id=?').bind(fichaId),
    ];
    v.fundamentos.forEach((f, i) => {
      const fid = String(f.fund_id || f.id || '').trim();
      if (!fid) return;
      const tipo = TIPOS_FUND.has(f.tipo) ? f.tipo : 'fundamento';
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_notas (avaliacao_id, fund_id, nome, tipo, nota, posicao) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(fichaId, fid, String(f.nome || fid), tipo, normNota(f.nota), i));
    });
    v.observacoes.forEach((o, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_observacoes (avaliacao_id, lead, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(o.lead || ''), String(o.texto || ''), i));
    });
    v.dicas.forEach((d, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_dicas (avaliacao_id, titulo, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(d.titulo || ''), String(d.texto || ''), i));
    });
    v.tags.forEach((t, i) => {
      const tag = String(t || '').trim();
      if (!tag) return;
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_tags (avaliacao_id, tag, posicao) VALUES (?, ?, ?)'
      ).bind(fichaId, tag, i));
    });
    v.habitos.forEach((h, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_habitos (avaliacao_id, label, texto, recorrente, posicao) VALUES (?, ?, ?, ?, ?)'
      ).bind(fichaId, String(h.label || 'Hábito a cuidar'), String(h.texto || ''), h.recorrente ? 1 : 0, i));
    });
    v.insights.forEach((ins, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_insights (avaliacao_id, label, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(ins.label || ''), String(ins.texto || ''), i));
    });
    v.paginas_extras.forEach((p, i) => {
      const slug = String(p.slug || p.id || ('pg-' + Date.now() + '-' + i)).trim();
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_paginas_extras (avaliacao_id, slug, titulo, conteudo, posicao) VALUES (?, ?, ?, ?, ?)'
      ).bind(fichaId, slug, String(p.titulo || ''), String(p.conteudo || ''), i));
    });

    await env.DB.batch(ops);
    await logSeguro(env, v.aluno_email, criado ? 'aval_tecnica_criada' : 'aval_tecnica_atualizada',
                    'id=' + fichaId + ' status=' + v.status);
    return json({ ok: true, id: fichaId, criado, status: v.status });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao salvar ficha.', message: String((e && e.message) || e) }, 500);
  }
}

/* --------------------------------------------------------------------------
   POST /api/admin/avaliacoes/perf/save  (performática)
-------------------------------------------------------------------------- */
async function avaliacoesPerfSave(request, env, admin) {
  let body; try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const s = sanearFichaPerf(body);
  if (!s.ok) return json({ ok: false, erro: s.erro }, 400);
  const v = s.val;
  const now = new Date().toISOString();

  try {
    if (v.tecnica_id != null) {
      const t = await env.DB.prepare('SELECT id, aluno_email FROM avaliacoes_tecnicas WHERE id=?').bind(v.tecnica_id).first();
      if (!t) return json({ ok: false, erro: 'tecnica_id inexistente.' }, 400);
      if (t.aluno_email !== v.aluno_email)
        return json({ ok: false, erro: 'tecnica_id pertence a outro aluno.' }, 400);
    }

    await upsertAluno(env, v.aluno_email, v.aluno_nome, v.turma_organizacional, v.modalidade_turma);

    let fichaId = v.id;
    let criado = false;

    if (fichaId != null) {
      const existe = await env.DB.prepare('SELECT id, published_at FROM avaliacoes_performaticas WHERE id=?').bind(fichaId).first();
      if (!existe) return json({ ok: false, erro: 'Ficha performática não encontrada.' }, 404);
      const pubAt = v.status === 'published' ? (existe.published_at || now) : existe.published_at;
      await env.DB.prepare(
        'UPDATE avaliacoes_performaticas SET aluno_email=?, aluno_nome=?, tecnica_id=?, professor_nome=?, ' +
        'semestre=?, turma_organizacional=?, modalidade_turma=?, disciplina_label=?, disciplina_texto=?, ' +
        'status=?, updated_at=?, published_at=? WHERE id=?'
      ).bind(
        v.aluno_email, v.aluno_nome, v.tecnica_id, v.professor_nome,
        v.semestre, v.turma_organizacional, v.modalidade_turma, v.disciplina_label, v.disciplina_texto,
        v.status, now, pubAt, fichaId
      ).run();
    } else {
      const versao = await proximaVersao(env, v.aluno_email);
      const pubAt  = v.status === 'published' ? now : null;
      const ins = await env.DB.prepare(
        'INSERT INTO avaliacoes_performaticas (aluno_email, aluno_nome, tecnica_id, professor_nome, ' +
        'semestre, turma_organizacional, modalidade_turma, versao, status, disciplina_label, disciplina_texto, ' +
        'created_at, updated_at, published_at, created_by) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        v.aluno_email, v.aluno_nome, v.tecnica_id, v.professor_nome,
        v.semestre, v.turma_organizacional, v.modalidade_turma, versao, v.status,
        v.disciplina_label, v.disciplina_texto, now, now, pubAt, (admin && admin.email) || null
      ).run();
      fichaId = ins.meta && ins.meta.last_row_id;
      criado = true;
    }

    const ops = [
      env.DB.prepare('DELETE FROM avaliacao_perf_criterios   WHERE avaliacao_perf_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_perf_observacoes WHERE avaliacao_perf_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_perf_insights    WHERE avaliacao_perf_id=?').bind(fichaId),
      env.DB.prepare('DELETE FROM avaliacao_perf_dicas       WHERE avaliacao_perf_id=?').bind(fichaId),
    ];
    v.criterios.forEach((c, i) => {
      const cid = String(c.criterio_id || c.id || '').trim();
      if (!cid) return;
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_perf_criterios (avaliacao_perf_id, criterio_id, nome, nota, posicao) VALUES (?, ?, ?, ?, ?)'
      ).bind(fichaId, cid, String(c.nome || cid), normNota(c.nota), i));
    });
    v.observacoes.forEach((o, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_perf_observacoes (avaliacao_perf_id, lead, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(o.lead || ''), String(o.texto || ''), i));
    });
    v.insights.forEach((ins, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_perf_insights (avaliacao_perf_id, label, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(ins.label || ''), String(ins.texto || ''), i));
    });
    v.dicas.forEach((d, i) => {
      ops.push(env.DB.prepare(
        'INSERT INTO avaliacao_perf_dicas (avaliacao_perf_id, titulo, texto, posicao) VALUES (?, ?, ?, ?)'
      ).bind(fichaId, String(d.titulo || ''), String(d.texto || ''), i));
    });

    await env.DB.batch(ops);
    await logSeguro(env, v.aluno_email, criado ? 'aval_perf_criada' : 'aval_perf_atualizada',
                    'id=' + fichaId + ' status=' + v.status);
    return json({ ok: true, id: fichaId, criado, status: v.status });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao salvar ficha performática.', message: String((e && e.message) || e) }, 500);
  }
}

/* --------------------------------------------------------------------------
   POST /api/admin/avaliacoes/delete   Body: { id, tipo }
-------------------------------------------------------------------------- */
async function avaliacoesDelete(request, env, admin) {
  let body; try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  const id = Number(body.id);
  const tipo = String(body.tipo || 'tecnica');
  if (!Number.isFinite(id)) return json({ ok: false, erro: 'id inválido.' }, 400);
  try {
    if (tipo === 'performatica') {
      const r = await env.DB.prepare('DELETE FROM avaliacoes_performaticas WHERE id=?').bind(id).run();
      if (!r.meta || r.meta.changes === 0) return json({ ok: false, erro: 'Ficha não encontrada.' }, 404);
    } else {
      const r = await env.DB.prepare('DELETE FROM avaliacoes_tecnicas WHERE id=?').bind(id).run();
      if (!r.meta || r.meta.changes === 0) return json({ ok: false, erro: 'Ficha não encontrada.' }, 404);
    }
    await logSeguro(env, (admin && admin.email) || null, 'aval_' + tipo + '_excluida', 'id=' + id);
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao excluir.', message: String((e && e.message) || e) }, 500);
  }
}

/* --------------------------------------------------------------------------
   GET /api/me/avaliacoes  (aluno logado — só published, ordem cronológica).
-------------------------------------------------------------------------- */
async function minhasAvaliacoes(env, memberEmail) {
  const email = normEmail(memberEmail);
  const [tec, perf] = await env.DB.batch([
    env.DB.prepare(
      "SELECT id, semestre, modalidade_turma, versao, published_at " +
      "FROM avaliacoes_tecnicas WHERE aluno_email=? AND status='published' " +
      "ORDER BY versao DESC"
    ).bind(email),
    env.DB.prepare(
      "SELECT id, tecnica_id, semestre, modalidade_turma, versao, published_at " +
      "FROM avaliacoes_performaticas WHERE aluno_email=? AND status='published' " +
      "ORDER BY versao DESC"
    ).bind(email),
  ]);
  return json({
    ok: true,
    tecnicas:      tec.results  || [],
    performaticas: perf.results || [],
  });
}

/* --------------------------------------------------------------------------
   GET /api/me/avaliacoes/get?id=NN&tipo=...  (aluno vê SÓ suas fichas publicadas)
-------------------------------------------------------------------------- */
async function minhaAvaliacaoGet(request, env, memberEmail) {
  const url = new URL(request.url);
  const id  = Number(url.searchParams.get('id'));
  const tipo = String(url.searchParams.get('tipo') || 'tecnica');
  if (!Number.isFinite(id)) return json({ ok: false, erro: 'id inválido.' }, 400);
  const email = normEmail(memberEmail);

  const tabela = tipo === 'performatica' ? 'avaliacoes_performaticas' : 'avaliacoes_tecnicas';
  const dono = await env.DB.prepare(
    "SELECT id FROM " + tabela + " WHERE id=? AND aluno_email=? AND status='published'"
  ).bind(id, email).first();
  if (!dono) return json({ ok: false, erro: 'Ficha não disponível.' }, 404);

  return tipo === 'performatica' ? getPerformatica(env, id) : getTecnica(env, id);
}

export {
  avaliacoesList,
  avaliacoesGet,
  avaliacoesSave,
  avaliacoesPerfSave,
  avaliacoesDelete,
  minhasAvaliacoes,
  minhaAvaliacaoGet,
};