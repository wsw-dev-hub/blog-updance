/* ================================================================
   TRILHAS DE NÍVEL (Free / Iniciante / Intermediário) — backend
   GENERALIZADO. Substitui os endpoints /api/temporada/* por
   /api/trilha/*, distinguindo o nível por 'perfil'.
   Reusa as tabelas talent_* com perfil_id = <perfil>.
================================================================ */

/* Config por trilha. O limiar é DERIVADO da soma dos desafios (únicos) de
   cada data module (validado por teste). fundamentos = 608 = soma dos 59
   desafios ÚNICOS dos 2 cards (Alongamentos + Fundamentos), já com os IDs
   do nó fund-coreo renomeados para fund-coreo-d1..d3 (sem colisão com a
   trilha Iniciante). intermediario = 2430 = soma dos 166 desafios ÚNICOS dos
   3 cards (Preparo + Cultura & Vocabulário + Corpo & Improviso), IDs 'i2-*'. */
const TRILHAS = {
  fundamentos:   { resource: 'nivel-free',            limiar: 608,  insignia: 'fund-insignia' },
  iniciante:     { resource: 'nivel-iniciante',       limiar: 1634, insignia: 'ini-insignia'  },
  intermediario: { resource: 'nivel-intermediario',   limiar: 2430, insignia: 'int-insignia'  },
  tecnico:       { resource: 'nivel-tecnico',         limiar: 3300, categoria:'tec-insignia' },
  /* Aguardando arquivos (1 linha cada quando chegarem):
       
       estagio:    { classe:'page-estagio',     limiar: 000, categoria:'est-insignia', },
       habilidade: { classe:'page-habilidade',  limiar: 000, categoria:'hab-insignia', },
       titulos:    { classe:'page-reputacao',   limiar: 000, categoria:'tit-insignia' },
       maestria:   { classe:'page-maestria',    limiar: 000, categoria:'maes-insignia', } */
};

function trilhaConfig(perfil) {
  return Object.prototype.hasOwnProperty.call(TRILHAS, perfil) ? TRILHAS[perfil] : null;
}

/* Portaria por trilha: membro com acesso ao resource daquele nível. */
async function trilhaGuard(request, env, perfil) {
  const cfg = trilhaConfig(perfil);
  if (!cfg) return { erro: json({ erro: 'Trilha desconhecida.' }, 400) };
  const m = await getMember(request, env);
  if (!m) return { erro: json(null, 401) };
  const types = Array.isArray(m.types) && m.types.length ? m.types : [m.type || 'Free'];
  const ok = await podeAcessar(env, types, cfg.resource);
  if (!ok) return { erro: json({ erro: 'sem acesso' }, 403) };
  return { email: m.email, types, cfg };
}

/* XPE = soma dos desafios aprovados do perfil. */
async function recalcularXPETrilha(env, email, perfil) {
  const row = await env.DB.prepare(
    "SELECT COALESCE(SUM(xp),0) AS xpe FROM talent_progresso " +
    "WHERE email = ? AND perfil_id = ? AND status = 'aprovado'"
  ).bind(email, perfil).first();
  return row ? row.xpe : 0;
}

/* GET /api/trilha/estado?perfil=<perfil> */
async function trilhaEstado(request, env, url) {
  url = url || new URL(request.url);
  try{
    const perfil = (url.searchParams.get('perfil') || '').trim();
    const g = await trilhaGuard(request, env, perfil);
    if (g.erro) return g.erro;

    const [aprovados, insignias] = await env.DB.batch([
      env.DB.prepare(
        "SELECT desafio_id FROM talent_progresso " +
        "WHERE email = ? AND perfil_id = ? AND status = 'aprovado'"
      ).bind(g.email, perfil),
      env.DB.prepare(
        "SELECT titulo_id FROM talent_titulos WHERE email = ? AND perfil_id = ?"
      ).bind(g.email, perfil),
    ]);

    const xpe = await recalcularXPETrilha(env, g.email, perfil);
    return json({
      perfil,
      xpe,
      desafios:  (aprovados.results || []).map(r => r.desafio_id),
      insignias: (insignias.results || []).map(r => r.titulo_id),
      elegivel:  xpe >= g.cfg.limiar,
    });
 } catch (e) {
   return json({ erro: 'debug', message: String((e && e.message) || e), stack: String((e && e.stack) || '') }, 500);
 }
}

/* POST /api/trilha/desafio  Body: { perfil, desafio, comprovacao? }
   Toda aprovação passa por revisão humana → entra como 'pendente'
   (auto_aprovar é ignorado aqui de propósito; ver decisão de produto). */
async function trilhaEnviarDesafio(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const perfil    = String(body.perfil  || '').trim();
  const desafioId = String(body.desafio || '').slice(0, 60);
  const g = await trilhaGuard(request, env, perfil);
  if (g.erro) return g.erro;
  if (!desafioId) return json({ ok: false, erro: 'Desafio não informado.' }, 400);

  /* Só aceita desafios REALMENTE do perfil desta trilha. */
  const d = await env.DB.prepare(
    "SELECT id, perfil_id, xp FROM talent_desafios WHERE id = ? AND ativo = 1 AND perfil_id = ?"
  ).bind(desafioId, perfil).first();
  if (!d) {
    await logEvent(env, g.email, 'trilha_desafio_erro', `${perfil}: ${desafioId}`);
    return json({ ok: false, erro: 'Desafio inexistente ou fora da trilha.' }, 404);
  }

  const jaTem = await env.DB.prepare(
    'SELECT status FROM talent_progresso WHERE email = ? AND desafio_id = ?'
  ).bind(g.email, desafioId).first();
  if (jaTem) return json({ ok: true, status: jaTem.status, duplicado: true });

  const comprovacao = String(body.comprovacao || '').slice(0, 500);

  /* Revisão obrigatória: sempre 'pendente'. */
  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO talent_progresso (email, desafio_id, perfil_id, xp, status, comprovacao) ' +
      "VALUES (?, ?, ?, ?, 'pendente', ?)"
    ).bind(g.email, desafioId, perfil, d.xp, comprovacao),
    contador(env, CNT_PENDENTES, 1),
  ]);
  await logEvent(env, g.email, 'trilha_desafio_pendente', `${perfil}: ${desafioId}`);
  return json({ ok: true, status: 'pendente' });
}

/* Concessão da insígnia + elegibilidade acontece na APROVAÇÃO (fila de revisão).
   Ganchar no fluxo de aprovação existente (talentosAvaliar): após marcar
   'aprovado', se o perfil for uma trilha e o XPE cruzar o limiar, gravar a
   insígnia da trilha. Ver inserção apontada no texto. */
async function trilhaAoAprovar(env, email, perfil) {
  const cfg = trilhaConfig(perfil);
  if (!cfg) return;
  const xpe = await recalcularXPETrilha(env, email, perfil);
  if (xpe >= cfg.limiar) {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO talent_titulos (email, titulo_id, perfil_id) VALUES (?, ?, ?)'
    ).bind(email, cfg.insignia, perfil).run();
  }
}