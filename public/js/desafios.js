/**
 * ================================================================
 *  UP DANCE EXPERIENCE — CENTRAL DE DESAFIOS  (v3)
 *  /js/desafios.js
 * ----------------------------------------------------------------
 *  Entrada: /membros/desafios/?arvore=<chave>&hab=<idDoNo>
 *  (gerada pelo botão "Ir para os desafios" dos tooltips).
 *
 *  A página renderiza:
 *   1) DESAFIOS do nó da ÁRVORE ORIGINÁRIA (tt-panel), na paleta da
 *      origem — foco da página.
 *   2) DADOS INFORMATIVOS (visão da 1ª versão; detalhamento depois),
 *      contabilizando só o que há de dado hoje, cada família na sua
 *      paleta:
 *        · Pontos de experiência   (origem)      — XP/XPE/pontos
 *        · Habilidades             (origem)      — nós dominados
 *        · Reputação               (page-reputacao) — PR/PD, escadas
 *        · Títulos                 (page-reputacao) — títulos + insígnias
 *        · Maestrias               (referência)  — a construir
 *
 *  Somente leitura. Estado vem do Worker; degrada p/ localStorage.
 * ================================================================ */
(function (win, doc) {
  'use strict';

  /* origem → { paleta (page-class) , data module , categoria , rótulos } */
  var ROTAS = {
    fundamentos:   { classe: 'page-temporada',     data: '/js/fundamentos.data.js',   rotulo: 'Nível Free',          categoria: 'habilidades', catLabel: 'Habilidades', catIcone: 'mdi-star-four-points-outline' },
    iniciante:     { classe: 'page-iniciante',     data: '/js/iniciante.data.js',     rotulo: 'Nível Iniciante',     categoria: 'habilidades', catLabel: 'Habilidades', catIcone: 'mdi-star-four-points-outline' },
    intermediario: { classe: 'page-intermediario', data: '/js/intermediario.data.js', rotulo: 'Nível Intermediário', categoria: 'habilidades', catLabel: 'Habilidades', catIcone: 'mdi-star-four-points-outline' },
    talentos:      { classe: 'page-talentos',      data: '/js/talentTree.data.js',    rotulo: 'Árvore de Talentos',  categoria: 'talentos',    catLabel: 'Talentos',    catIcone: 'mdi-family-tree' }
    /* Aguardando arquivos (1 linha cada quando chegarem):
       tecnico:   { classe:'page-tecnico',  data:'/js/tecnico.data.js', categoria:'habilidades', ... },
       estagio:   { classe:'page-estagio',  data:'/js/tecnico.data.js', categoria:'habilidades', ... },
       titulos:   { classe:'page-reputacao',data:'/js/titulos.data.js', categoria:'titulos',     ... },
       maestria:  { classe:'page-maestria', data:'/js/maestria.data.js',categoria:'maestrias',   ... } */
  };

  var $ = function (s, c) { return (c || doc).querySelector(s); };
  function el(t, cls, html) { var n = doc.createElement(t); if (cls) { n.className = cls; } if (html != null) { n.innerHTML = html; } return n; }
  function escapar(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var qs = null; try { qs = new win.URLSearchParams(win.location.search); } catch (e) { qs = null; }
  var ARV = qs && qs.get('arvore');
  var HAB = qs && qs.get('hab');
  var PERFIL = qs && qs.get('perfil');   // ← NOVO: cartão de origem (só Árvore de Talentos)
  if (!HAB) { var hh = (win.location.hash || '').replace(/^#/, ''); if (hh && hh !== 'desafios') { HAB = hh; } }
  var CFG = ARV && ROTAS[ARV];

  function falhar(msg) {
    var app = $('#dxApp'); if (app) { app.hidden = false; }
    var alvo = $('#dxNode'); if (alvo) { alvo.innerHTML = '<div class="tt-panel__empty">' + escapar(msg) + '</div>'; }
    var tally = $('#dxTally'); if (tally) { tally.innerHTML = ''; }
    var info = $('#dxInfoWrap'); if (info) { info.hidden = true; }
  }

  function injetar(src, cb) {
    var s = doc.createElement('script'); s.src = src;
    s.onload = cb; s.onerror = function () { cb(); };   // segue mesmo sem o opcional
    doc.head.appendChild(s);
  }

  /* ============================================================ BOOT */
  function boot() {
    var sair = $('#sair');
    if (sair) {
      sair.addEventListener('click', function () {
        fetch('/api/member/logout', { method: 'POST', credentials: 'same-origin' })
          .catch(function () {}).finally(function () { win.location.href = '/'; });
      });
    }
    if (!CFG) { falhar('Origem não reconhecida. Abra um nó a partir de uma das árvores.'); return; }
    if (!HAB) { falhar('Nenhum nó informado. Volte à árvore e clique em "Ir para os desafios".'); return; }

    doc.body.classList.add('page-membros', CFG.classe); // paleta da origem (compound .page-membros.page-*)          // paleta da origem
    doc.body.setAttribute('data-categoria', CFG.categoria);
    /* Paleta POR CARTÃO: só na Árvore de Talentos. Os Níveis (trilhas)
       permanecem sem captura/migração de paleta de cartão. */
    if (ARV === 'talentos' && PERFIL) {
      doc.body.setAttribute('data-perfil', PERFIL);
    }
    var t1 = $('#dxTreeName'); if (t1) { t1.textContent = CFG.rotulo; }
    var t2 = $('#dxKicker');   if (t2) { t2.textContent = CFG.rotulo; }
    var t3 = $('#dxCat');      if (t3) { t3.textContent = CFG.catLabel; }
    var t4 = $('#dxCatIcon');  if (t4) { t4.className = 'mdi ' + CFG.catIcone; }

    /* injeta o data module da origem e, em seguida, o de reputação (informativo) */
    injetar(CFG.data, function () { injetar('/js/reputacao.data.js', init); });
  }

  /* ============================================================ INIT */
  function init() {
    var DADOS = win.UDX_TALENTOS || win.UDX_TRILHA;
    if (!DADOS) { falhar('Dados da árvore indisponíveis.'); return; }

    var IS_TAL = !!win.UDX_TALENTOS;
    var RT  = DADOS.runtime || {};
    var IDX = DADOS.indice || {};
    var NIVEL = DADOS.temporada || {};
    var TIPOS = DADOS.tiposDesafio || {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    };
    var ORDEM_TIPO = ['tarefa', 'atividade', 'evento'];
    var XP_POR_PONTO = DADOS.xpPorPonto || 100;
    var API = {
      me: '/api/me',
      estado: IS_TAL ? '/api/talentos/estado' : ((RT.api && RT.api.estado) || '/api/trilha/estado'),
      reputacao: '/api/reputacao/estado'
    };
    var CHAVE_LOCAL = IS_TAL ? 'udx:talentos:v1' : (RT.chaveLocal || 'udx:temporada:v1');

    function ehConquista(h) { return !!h && (h.tipo === 'titulo' || h.tipo === 'insignia'); }
    function perfilPorId(id) { var P = DADOS.perfis || []; for (var i = 0; i < P.length; i++) { if (P[i].id === id) { return P[i]; } } return null; }
    function tierDe(perfil, n) { var ts = (perfil && perfil.tiers) || []; for (var i = 0; i < ts.length; i++) { if (ts[i].n === n) { return ts[i]; } } return { n: n, requisito: 0 }; }

    /* ---- ESTADO ---- */
    var Estado = {
      aprovados: [], xpe: null, xpPerfil: {}, alocacao: {}, online: false,
      reputacao: { global: { pr: 0, pd: 0, n: 0 }, porPerfil: {} }, repronto: false,
      aplicarPlano: function (j) {
        Estado.xpPerfil = j.xp || {};
        var pgs = Array.isArray(j.paginas) ? j.paginas : [];
        var pg = pgs.filter(function (p) { return p.id === j.paginaAtual; })[0] || pgs[0];
        Estado.alocacao = (pg && pg.alocacao) ? pg.alocacao : {};
      },
      lerLocal: function () {
        try {
          var raw = win.localStorage.getItem(CHAVE_LOCAL); if (!raw) { return; }
          var j = JSON.parse(raw);
          Estado.aprovados = Array.isArray(j.desafios) ? j.desafios.slice() : [];
          if (typeof j.xpe === 'number') { Estado.xpe = j.xpe; }
          if (IS_TAL) { Estado.aplicarPlano(j); }
        } catch (e) { /* storage bloqueado */ }
      },
      carregar: function () {
        return fetch(API.estado, { credentials: 'same-origin' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) {
            if (!j) { throw new Error('sem estado'); }
            Estado.online = true;
            Estado.aprovados = Array.isArray(j.desafios) ? j.desafios.slice() : [];
            Estado.xpe = (typeof j.xpe === 'number') ? j.xpe : null;
            if (IS_TAL) { Estado.aplicarPlano(j); }
          })
          .catch(function () { Estado.online = false; Estado.lerLocal(); });
      },
      carregarReputacao: function () {
        if (!win.UDX_REP) { return Promise.resolve(); }
        return fetch(API.reputacao, { credentials: 'same-origin' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) { if (j && j.reputacao) { Estado.reputacao = j.reputacao; Estado.repronto = true; } })
          .catch(function () {});
      }
    };

    /* ---- REGRAS (ramo por árvore — validadas) ---- */
    var Regras = {
      aprovado: function (id) { return Estado.aprovados.indexOf(id) !== -1; },
      rank: function (h) {
        if (ehConquista(h)) { return Regras.conquistaOk(h) ? 1 : 0; }
        if (IS_TAL) { return Estado.alocacao[h.id] || 0; }
        var n = h.desafios.reduce(function (a, d) { return a + (Regras.aprovado(d.id) ? 1 : 0); }, 0);
        return Math.min(n, h.ranksMax);
      },
      pontosTotais: function (pid) { return Math.floor((Estado.xpPerfil[pid] || 0) / XP_POR_PONTO); },
      pontosGastos: function (pid) {
        var t = 0; Object.keys(Estado.alocacao).forEach(function (id) { var x = IDX[id]; if (x && x.perfilId === pid && x.tipo !== 'titulo') { t += Estado.alocacao[id]; } }); return t;
      },
      tierLiberado: function (perfil, n) { return Regras.pontosGastos(perfil.id) >= tierDe(perfil, n).requisito; },
      prereqsOk: function (h) {
        if (IS_TAL) { return (h.requer || []).every(function (id) { var p = IDX[id]; return p && (Estado.alocacao[id] || 0) >= p.ranksMax; }); }
        return (h.requer || []).every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
      },
      conquistaOk: function (h) {
        if (IS_TAL) { var perfil = perfilPorId(h.perfilId); return Regras.tierLiberado(perfil, h.tier) && Regras.prereqsOk(h); }
        return (h.requer || []).length ? (h.requer).every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; }) : false;
      },
      estadoDoNo: function (h) {
        if (ehConquista(h)) { return Regras.conquistaOk(h) ? 'maxed' : 'locked'; }
        var r = Regras.rank(h);
        if (r >= h.ranksMax) { return 'maxed'; }
        if (r > 0) { return 'ranked'; }
        if (IS_TAL) { var perfil = perfilPorId(h.perfilId); return (Regras.tierLiberado(perfil, h.tier) && Regras.prereqsOk(h)) ? 'available' : 'locked'; }
        return Regras.prereqsOk(h) ? 'available' : 'locked';
      },
      pendencias: function (h) {
        var lista = [];
        if (IS_TAL) {
          var perfil = perfilPorId(h.perfilId); var g = Regras.pontosGastos(perfil.id); var req = tierDe(perfil, h.tier).requisito;
          if (g < req) { lista.push('Invista ' + (req - g) + ' ponto(s) em ' + perfil.nome + ' para abrir esta faixa.'); }
          (h.requer || []).forEach(function (id) { var p = IDX[id]; if (p && (Estado.alocacao[id] || 0) < p.ranksMax) { lista.push('Requer ' + p.nome + ' no nível ' + p.ranksMax + '.'); } });
          return lista;
        }
        (h.requer || []).forEach(function (id) { var p = IDX[id]; if (p && Regras.rank(p) < p.ranksMax) { lista.push('Conclua ' + p.nome + ' para desbloquear.'); } });
        return lista;
      },
      contabilizar: function (h) {
        var t = { total: 0, feitos: 0, pendentes: 0, xpTotal: 0, xpFeito: 0, tipos: { tarefa: { t: 0, f: 0 }, atividade: { t: 0, f: 0 }, evento: { t: 0, f: 0 } } };
        (h.desafios || []).forEach(function (d) {
          var f = Regras.aprovado(d.id);
          t.total++; t.xpTotal += (d.xp || 0);
          if (f) { t.feitos++; t.xpFeito += (d.xp || 0); }
          var tp = t.tipos[d.tipo]; if (tp) { tp.t++; if (f) { tp.f++; } }
        });
        t.pendentes = t.total - t.feitos; t.pct = t.total ? Math.round((t.feitos / t.total) * 100) : 0;
        return t;
      }
    };

    /* ---------- helpers de UI ---------- */
    function metric(icone, label, valor, resto, pct, sub) {
      return '<div class="dx-metric">' +
        '<span class="dx-metric__label"><span class="mdi ' + icone + '"></span>' + escapar(label) + '</span>' +
        '<div class="dx-metric__value"><b>' + valor + '</b> <small>' + escapar(resto) + '</small></div>' +
        '<div class="dx-metric__bar"><span class="dx-metric__fill" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>' +
        '<div class="dx-metric__sub">' + escapar(sub) + '</div></div>';
    }
    function cabec(icone, titulo, sub) {
      return '<div class="dx-info-head"><span class="mdi ' + icone + '"></span>' +
             '<div><h3>' + escapar(titulo) + '</h3>' + (sub ? '<p>' + escapar(sub) + '</p>' : '') + '</div></div>';
    }

    /* ---------- 1) DESAFIOS DO NÓ (origem) ---------- */
    function renderTally(hab) {
      var c = $('#dxTally'); if (!c) { return; }
      if (ehConquista(hab) || !hab.desafios.length) { c.innerHTML = ''; return; }
      var t = Regras.contabilizar(hab);
      c.innerHTML =
        metric('mdi-flag-checkered', 'Desafios concluídos', t.feitos, '/ ' + t.total, t.pct, t.pendentes + ' pendente(s) · ' + t.pct + '%') +
        metric('mdi-lightning-bolt', 'Experiência do nó', t.xpFeito, '/ ' + t.xpTotal + ' XP', t.xpTotal ? Math.round(t.xpFeito / t.xpTotal * 100) : 0, 'XP validado neste nó');
      var row = el('div', 'dx-typerow');
      ORDEM_TIPO.forEach(function (k) {
        var tp = t.tipos[k]; if (!tp.t) { return; } var m = TIPOS[k] || {};
        row.appendChild(el('span', 'tt-chip', '<span class="mdi ' + (m.icone || 'mdi-circle-small') + '"></span>' + escapar(m.label || k) + ': <b style="margin-left:4px">' + tp.f + '/' + tp.t + '</b>'));
      });
      c.appendChild(row);
    }
    function renderNode(hab) {
      var p = $('#dxNode'); if (!p) { return; }
      var perfil = perfilPorId(hab.perfilId);
      var est = Regras.estadoDoNo(hab); var conquista = ehConquista(hab);
      var rot = { available: 'Disponível', ranked: 'Em desenvolvimento', maxed: conquista ? 'Conquistado' : 'Dominado', locked: 'Bloqueado' }[est];
      var pillMod = est === 'locked' ? ' dx-state-pill--locked' : (est === 'maxed' ? ' dx-state-pill--done' : '');
      var html = '<div class="tt-panel__head">' +
          '<span class="tt-panel__icon"><span class="mdi ' + hab.icone + '"></span></span>' +
          '<div class="tt-panel__title"><span>' + escapar(perfil ? perfil.nome : '') + '</span><h3>' + escapar(hab.nome) + '</h3></div>' +
          '<span class="dx-state-pill' + pillMod + '"><span class="mdi ' + (est === 'locked' ? 'mdi-lock-outline' : 'mdi-check-circle-outline') + '"></span>' + rot + '</span></div>';
      if (hab.resumo) { html += '<p class="tt-tip__resumo" style="margin:0 0 12px">' + escapar(hab.resumo) + '</p>'; }
      var pend = Regras.pendencias(hab);
      if (pend.length) { html += '<div class="dx-node-tally"><span class="dx-state-pill dx-state-pill--locked"><span class="mdi mdi-lock-outline"></span>' + escapar(pend[0]) + '</span></div>'; }
      if (!hab.desafios.length) {
        html += '<div class="tt-panel__empty">' + (conquista ? (Regras.conquistaOk(hab) ? 'Conquista concluída.' : 'Conclua os nós exigidos para desbloquear.') : 'Nenhum desafio cadastrado para este nó.') + '</div>';
        p.innerHTML = html; return;
      }
      html += '<ul class="tt-challenges">';
      hab.desafios.forEach(function (d) {
        var feito = Regras.aprovado(d.id); var meta = TIPOS[d.tipo] || TIPOS.tarefa || {};
        html += '<li class="tt-challenge' + (feito ? ' is-done' : '') + '">' +
            '<span class="tt-challenge__mark"><span class="mdi ' + (feito ? 'mdi-check-bold' : (meta.icone || 'mdi-circle-small')) + '"></span></span>' +
            '<div class="tt-challenge__body"><span class="tt-challenge__name">' + escapar(d.nome) + '</span>' +
              '<p class="tt-challenge__desc">' + escapar(d.desc || '') + '</p>' +
              '<div class="tt-challenge__meta"><span class="tt-chip"><span class="mdi ' + (meta.icone || 'mdi-circle-small') + '"></span>' + escapar(meta.label || d.tipo) + '</span>' +
                (d.xp > 0 ? '<span class="tt-chip tt-chip--xp"><span class="mdi mdi-lightning-bolt"></span>+' + d.xp + ' XP</span>' : '') + '</div></div>' +
            '<span class="dx-status' + (feito ? ' dx-status--done' : '') + '"><span class="mdi ' + (feito ? 'mdi-check-circle-outline' : 'mdi-clock-outline') + '"></span>' + (feito ? 'Concluído' : 'Pendente') + '</span></li>';
      });
      html += '</ul>'; p.innerHTML = html;
    }

    /* ---------- 2) INFORMATIVOS ---------- */
    function renderPontos() {
      var c = $('#dxPontos'); if (!c) { return; }
      var body = '<div class="dx-tally dx-tally--1">';
      if (IS_TAL) {
        (DADOS.perfis || []).forEach(function (p) {
          var xp = Estado.xpPerfil[p.id] || 0; var pts = Regras.pontosTotais(p.id); var gastos = Regras.pontosGastos(p.id);
          body += metric(p.icone || 'mdi-lightning-bolt', p.nome, pts, 'pts', 0, xp + ' XP · ' + gastos + ' investidos');
        });
      } else {
        var xpe = Estado.xpe || 0; var lim = NIVEL.limiarXPE || 0;
        var falta = lim ? (lim - xpe) : 0;
        body += metric('mdi-lightning-bolt', 'Experiência do nível', xpe, lim ? ('/ ' + lim + ' XPE') : 'XPE',
                       lim ? Math.round(xpe / lim * 100) : 0, lim ? (falta > 0 ? falta + ' para concluir' : 'nível concluído') : '');
      }
      body += '</div>';
      c.innerHTML = cabec('mdi-lightning-bolt', 'Pontos de experiência', IS_TAL ? 'XP e Pontos de Talento por perfil' : 'XPE acumulado no nível') + body;
    }

    function renderHabilidades() {
      var c = $('#dxHabilidades'); if (!c) { return; }
      var perfis = DADOS.perfis || []; var totalNos = 0, dom = 0; var chips = '';
      perfis.forEach(function (p) {
        var passos = p.habilidades.filter(function (h) { return !ehConquista(h); });
        var d = passos.filter(function (h) { return Regras.rank(h) >= h.ranksMax; }).length;
        totalNos += passos.length; dom += d;
        chips += '<span class="tt-chip"><span class="mdi ' + p.icone + '"></span>' + escapar(p.nome) + ' <b style="margin-left:4px">' + d + '/' + passos.length + '</b></span>';
      });
      c.innerHTML = cabec('mdi-star-four-points-outline', 'Habilidades', 'Nós dominados nesta árvore') +
        '<div class="dx-tally dx-tally--1">' + metric('mdi-star-four-points-outline', 'Dominados', dom, '/ ' + totalNos, totalNos ? Math.round(dom / totalNos * 100) : 0, 'nós no nível de domínio') + '</div>' +
        '<div class="dx-typerow">' + chips + '</div>';
    }

    function repChip(t) {
      return '<span class="dx-ladder__step is-reached" style="background:' + t.cor + '"><span class="mdi ' + t.icone + '"></span>' + escapar(t.nome) + '</span>';
    }
    function repAxis(REP, titulo, valor, lista, escala100) {
      var atual = REP.tituloAtual(valor, lista); var prox = REP.proximoTitulo(valor, lista);
      var badge = atual
        ? '<span class="dx-rep-badge" style="background:' + atual.cor + '"><span class="mdi ' + atual.icone + '"></span>' + escapar(atual.nome) + '</span>'
        : '<span class="dx-rep-badge dx-rep-badge--muted"><span class="mdi mdi-circle-outline"></span>Sem título</span>';
      var pct, txt, corBar;
      if (prox) { pct = Math.round(prox.progresso * 100); txt = 'Faltam <b>' + (prox.titulo.min - valor) + '</b> para <b>' + escapar(prox.titulo.nome) + '</b>'; corBar = prox.titulo.cor; }
      else { pct = 100; txt = 'Topo da escada.'; corBar = atual ? atual.cor : 'var(--seg-accent)'; }
      return '<div class="dx-rep-axis"><div class="dx-rep-axis__top"><span>' + titulo + ' · <b>' + valor + (escala100 ? '/100' : '') + '</b></span>' + badge + '</div>' +
             '<div class="dx-rep-bar"><span class="dx-rep-bar__fill" style="width:' + pct + '%;background:' + corBar + '"></span></div>' +
             '<div class="dx-rep-axis__next">' + txt + '</div></div>';
    }
    function renderReputacao() {
      var c = $('#dxReputacao'); if (!c) { return; }
      var REP = win.UDX_REP;
      if (!REP) { c.innerHTML = cabec('mdi-shield-star-outline', 'Reputação', '') + '<p class="dx-note">Indisponível.</p>'; return; }
      var rep = Estado.reputacao || { global: { pr: 0, pd: 0, n: 0 }, porPerfil: {} };
      var g = rep.global || { pr: 0, pd: 0, n: 0 };
      var html = cabec('mdi-shield-star-outline', 'Reputação', 'PR acumulada e PD (forma recente)') +
        '<div class="dx-rep-card">' +
          repAxis(REP, 'Reputação (PR)', g.pr || 0, REP.titulosReputacao, false) +
          repAxis(REP, 'Desempenho (PD)', g.pd || 0, REP.titulosDesempenho, true) +
        '</div>';
      if (!Estado.repronto) { html += '<p class="dx-note">' + (Estado.online ? 'Ainda sem avaliações registradas.' : 'Reputação indisponível offline.') + '</p>'; }
      c.innerHTML = html;
    }
    function renderTitulos() {
      var c = $('#dxTitulos'); if (!c) { return; }
      var REP = win.UDX_REP; var chips = '';
      if (REP && Estado.repronto) {
        var g = Estado.reputacao.global || { pr: 0, pd: 0 };
        var tPR = REP.tituloAtual(g.pr || 0, REP.titulosReputacao); if (tPR) { chips += repChip(tPR); }
        var tPD = REP.tituloAtual(g.pd || 0, REP.titulosDesempenho); if (tPD) { chips += repChip(tPD); }
      }
      var conq = [];
      (DADOS.perfis || []).forEach(function (p) { p.habilidades.forEach(function (h) { if (ehConquista(h) && Regras.conquistaOk(h)) { conq.push(h); } }); });
      conq.forEach(function (h) { chips += '<span class="dx-ladder__step is-reached" style="background:var(--seg-accent)"><span class="mdi ' + h.icone + '"></span>' + escapar(h.nome) + '</span>'; });
      var body = chips ? ('<div class="dx-ladder">' + chips + '</div>') : '<p class="dx-note">Sem títulos ainda — conclua conquistas e acumule reputação.</p>';
      c.innerHTML = cabec('mdi-crown-outline', 'Títulos', 'Degraus de reputação e insígnias conquistadas') + body;
    }

    /* ---------- fluxo ---------- */
    var hab = IDX[HAB];
    if (!hab) { falhar('Nó não encontrado nesta árvore.'); return; }
    var nn = $('#dxNodeName'); if (nn) { nn.textContent = hab.nome; }

    fetch(API.me, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u || !u.email) { win.location.href = '/entrar/'; return null; }
        var em = $('#userEmail'); if (em) { em.textContent = u.email; }
        var ch = $('#userChip'); if (ch) { ch.hidden = false; }
        return Promise.all([Estado.carregar(), Estado.carregarReputacao()]);
      })
      .catch(function () { return Promise.all([Estado.carregar(), Estado.carregarReputacao()]); })
      .then(function () {
        var app = $('#dxApp'); if (app) { app.hidden = false; }
        renderTally(hab); renderNode(hab);
        renderPontos(); renderHabilidades(); renderReputacao(); renderTitulos();
      });

    win.UDX_DESAFIOS = { estado: Estado, regras: Regras, no: hab, arvore: ARV, categoria: CFG.categoria };
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

}(window, document));
