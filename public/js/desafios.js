/**
 * ================================================================
 *  UP DANCE EXPERIENCE — CENTRAL DE DESAFIOS
 *  /js/desafios.js   ·   motor da página (somente leitura)
 * ----------------------------------------------------------------
 *  Requisitos:
 *    - UM data module carregado ANTES (Árvore de Talentos OU Trilha):
 *        talentTree.data.js  → window.UDX_TALENTOS
 *        {fundamentos|iniciante|intermediario}.data.js → window.UDX_TRILHA
 *    - reputacao.data.js  → window.UDX_REP   (títulos/escadas)
 *    - Reusa as classes .tt-* de /css/talentTree.css e os componentes
 *      novos de /css/desafios.css.
 *
 *  O QUE ESTA PÁGINA FAZ
 *  ---------------------
 *   1. Lê o estado do MEMBRO no Worker (autoridade do servidor) e
 *      degrada para localStorage; nada é gravado aqui.
 *   2. Renderiza o MAPA da árvore com DESTAQUE ao nó selecionado e
 *      aos nós DESBLOQUEADOS (bloqueados recuam).
 *   3. CONTABILIZA o grupo de desafios/atividades/eventos: do nó
 *      selecionado e agregado dos nós desbloqueados (por tipo,
 *      feitos/pendentes, XP e % de conclusão).
 *   4. Reputação como TÍTULOS/ESCADAS (somente leitura).
 *   5. Maestria: referência (evolução da Reputação — a construir).
 *
 *  CONTRATO DE URL
 *  ---------------
 *   ?perfil=<perfilId>&hab=<noId>   ou   #<noId>   selecionam o nó.
 *   Sem parâmetro, seleciona o 1º nó de passo do 1º card.
 * ================================================================ */
(function (win, doc) {
  'use strict';

  /* ---- adaptador de dados: aceita Talentos OU Trilha ---- */
  var DADOS = win.UDX_TALENTOS || win.UDX_TRILHA ||
              win.UDX_FUNDAMENTOS || win.UDX_INICIANTE || win.UDX_INTERMEDIARIO;
  if (!DADOS) { return; }

  var IS_TAL = (DADOS === win.UDX_TALENTOS);
  var RT     = DADOS.runtime || {};
  var API = {
    me:        '/api/me',
    estado:    IS_TAL ? '/api/talentos/estado'
                      : ((RT.api && RT.api.estado) || '/api/trilha/estado'),
    reputacao: '/api/reputacao/estado'
  };
  var CHAVE_LOCAL = IS_TAL ? 'udx:talentos:v1' : (RT.chaveLocal || 'udx:temporada:v1');

  var PERFIS = DADOS.perfis || [];
  var IDX    = DADOS.indice  || {};
  var TIPOS  = DADOS.tiposDesafio || {
    tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
    atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
    evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
  };
  var ORDEM_TIPO = ['tarefa', 'atividade', 'evento'];

  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  function el(t, cls, html) { var n = doc.createElement(t); if (cls) { n.className = cls; } if (html != null) { n.innerHTML = html; } return n; }
  function escapar(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function perfilPorId(id) { for (var i = 0; i < PERFIS.length; i++) { if (PERFIS[i].id === id) { return PERFIS[i]; } } return null; }
  function ehConquista(h) { return !!h && (h.tipo === 'titulo' || h.tipo === 'insignia'); }
  function todosNos() { var a = []; PERFIS.forEach(function (p) { p.habilidades.forEach(function (h) { a.push(h); }); }); return a; }

  /* garante perfilId em cada nó (índice já faz isso nos módulos; reforço defensivo) */
  PERFIS.forEach(function (p) { p.habilidades.forEach(function (h) { if (h.perfilId == null) { h.perfilId = p.id; } h.requer = h.requer || []; h.desafios = h.desafios || []; }); });

  /* Modelo de TALENTOS (pontos): requisito por faixa + conversão XP→ponto.
     Nas TRILHAS este bloco é inócuo (rank = desafios aprovados). */
  var XP_POR_PONTO = DADOS.xpPorPonto || 100;
  function tierDe(perfil, n) {
    var ts = (perfil && perfil.tiers) || [];
    for (var i = 0; i < ts.length; i++) { if (ts[i].n === n) { return ts[i]; } }
    return { n: n, requisito: 0 };
  }

  /* ============================================================
     ESTADO — reflete o servidor; degrada para localStorage
  ============================================================ */
  var Estado = {
    aprovados: [], xpe: null, titulos: [], xpPerfil: {}, alocacao: {},
    online: false, repronto: false,
    reputacao: { global: { pr: 0, pd: 0, n: 0 }, porPerfil: {}, titulos: [] },

    /* Talentos: fixa XP por perfil e a alocação da página ativa */
    aplicarPlano: function (j) {
      Estado.xpPerfil = j.xp || {};
      var pgs = Array.isArray(j.paginas) ? j.paginas : [];
      var pg = pgs.filter(function (p) { return p.id === j.paginaAtual; })[0] || pgs[0];
      Estado.alocacao = (pg && pg.alocacao) ? pg.alocacao : {};
    },

    lerLocal: function () {
      try {
        var raw = win.localStorage.getItem(CHAVE_LOCAL);
        if (!raw) { return; }
        var j = JSON.parse(raw);
        Estado.aprovados = Array.isArray(j.desafios) ? j.desafios.slice() : [];
        if (typeof j.xpe === 'number') { Estado.xpe = j.xpe; }
        Estado.titulos = Array.isArray(j.titulos) ? j.titulos.slice()
                       : (Array.isArray(j.insignias) ? j.insignias.slice() : []);
        if (IS_TAL) { Estado.aplicarPlano(j); }
      } catch (e) { /* storage bloqueado — segue vazio */ }
    },

    carregar: function () {
      return fetch(API.estado, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j) { throw new Error('sem estado remoto'); }
          Estado.online   = true;
          Estado.aprovados = Array.isArray(j.desafios) ? j.desafios.slice() : [];
          Estado.xpe      = (typeof j.xpe === 'number') ? j.xpe : null;
          Estado.titulos  = Array.isArray(j.titulos) ? j.titulos.slice()
                          : (Array.isArray(j.insignias) ? j.insignias.slice() : []);
          if (IS_TAL) { Estado.aplicarPlano(j); }
        })
        .catch(function () { Estado.online = false; Estado.lerLocal(); });
    },

    carregarReputacao: function () {
      if (!win.UDX_REP) { return Promise.resolve(); }
      return fetch(API.reputacao, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && j.reputacao) { Estado.reputacao = j.reputacao; Estado.repronto = true; }
        })
        .catch(function () { /* offline: escadas vazias */ });
    }
  };

  /* ============================================================
     REGRAS — puras, alinhadas ao motor de trilha (aprovações)
  ============================================================ */
  var Regras = {
    /* "feito" (contabilização) é IGUAL nas duas árvores: desafio aprovado. */
    aprovado: function (id) { return Estado.aprovados.indexOf(id) !== -1; },

    /* ---- rank do nó (o que ramifica entre as árvores) ----
       TRILHA  : nº de desafios aprovados (teto ranksMax) — cada nó tem
                 desafios suficientes para dominar (validado nos testes).
       TALENTO : pontos investidos no nó (alocação da página ativa);
                 os desafios são a FONTE de XP, não o rank.               */
    rank: function (h) {
      if (ehConquista(h)) { return Regras.conquistaOk(h) ? 1 : 0; }
      if (IS_TAL) { return Estado.alocacao[h.id] || 0; }
      var n = h.desafios.reduce(function (a, d) { return a + (Regras.aprovado(d.id) ? 1 : 0); }, 0);
      return Math.min(n, h.ranksMax);
    },

    /* pontos — só fazem sentido no modelo de talentos */
    pontosTotais: function (pid) { return Math.floor((Estado.xpPerfil[pid] || 0) / XP_POR_PONTO); },
    pontosGastos: function (pid) {
      var t = 0;
      Object.keys(Estado.alocacao).forEach(function (id) {
        var h = IDX[id];
        if (h && h.perfilId === pid && h.tipo !== 'titulo') { t += Estado.alocacao[id]; }
      });
      return t;
    },
    tierLiberado: function (perfil, n) { return Regras.pontosGastos(perfil.id) >= tierDe(perfil, n).requisito; },

    prereqsOk: function (h) {
      if (IS_TAL) {
        return h.requer.every(function (id) { var p = IDX[id]; return p && (Estado.alocacao[id] || 0) >= p.ranksMax; });
      }
      return h.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
    },

    conquistaOk: function (h) {
      if (IS_TAL) {
        var perfil = perfilPorId(h.perfilId);
        return Regras.tierLiberado(perfil, h.tier) && Regras.prereqsOk(h);
      }
      return h.requer.length
        ? h.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; })
        : false;
    },

    estadoDoNo: function (h) {
      if (ehConquista(h)) { return Regras.conquistaOk(h) ? 'maxed' : 'locked'; }
      var r = Regras.rank(h);
      if (r >= h.ranksMax) { return 'maxed'; }
      if (r > 0)           { return 'ranked'; }
      if (IS_TAL) {
        var perfil = perfilPorId(h.perfilId);
        return (Regras.tierLiberado(perfil, h.tier) && Regras.prereqsOk(h)) ? 'available' : 'locked';
      }
      return Regras.prereqsOk(h) ? 'available' : 'locked';
    },
    desbloqueado: function (h) { return Regras.estadoDoNo(h) !== 'locked'; },

    pendencias: function (h) {
      var lista = [];
      if (IS_TAL) {
        var perfil = perfilPorId(h.perfilId);
        var gastos = Regras.pontosGastos(perfil.id);
        var req = tierDe(perfil, h.tier).requisito;
        if (gastos < req) { lista.push('Invista ' + (req - gastos) + ' ponto(s) em ' + perfil.nome + ' para abrir esta faixa.'); }
        h.requer.forEach(function (id) {
          var p = IDX[id];
          if (p && (Estado.alocacao[id] || 0) < p.ranksMax) { lista.push('Requer ' + p.nome + ' no nível ' + p.ranksMax + '.'); }
        });
        return lista;
      }
      h.requer.forEach(function (id) {
        var p = IDX[id];
        if (p && Regras.rank(p) < p.ranksMax) { lista.push('Conclua ' + p.nome + ' para desbloquear.'); }
      });
      return lista;
    },

    /* contabilização do grupo de desafios/atividades/eventos */
    contabilizar: function (nos) {
      var t = {
        total: 0, feitos: 0, pendentes: 0, xpTotal: 0, xpFeito: 0,
        tipos: { tarefa: { t: 0, f: 0 }, atividade: { t: 0, f: 0 }, evento: { t: 0, f: 0 } }
      };
      nos.forEach(function (h) {
        if (ehConquista(h)) { return; }              // conquistas contam à parte
        h.desafios.forEach(function (d) {
          var feito = Regras.aprovado(d.id);
          t.total++; t.xpTotal += (d.xp || 0);
          if (feito) { t.feitos++; t.xpFeito += (d.xp || 0); }
          var tp = t.tipos[d.tipo];
          if (tp) { tp.t++; if (feito) { tp.f++; } }
        });
      });
      t.pendentes = t.total - t.feitos;
      t.pct = t.total ? Math.round((t.feitos / t.total) * 100) : 0;
      return t;
    }
  };

  /* ============================================================
     UI
  ============================================================ */
  var UI = {
    refs: {}, selecionado: null, perfilVisivel: null,

    montar: function () {
      UI.refs.app       = $('#dxApp');
      UI.refs.tally     = $('#dxTally');
      UI.refs.tabs      = $('#dxTabs');
      UI.refs.board     = $('#dxBoard');
      UI.refs.nodePanel = $('#dxNode');
      UI.refs.rep       = $('#dxRep');
      if (!UI.perfilVisivel && PERFIS[0]) { UI.perfilVisivel = PERFIS[0].id; }
    },

    /* ---------- resolução do nó-alvo pela URL ---------- */
    resolverAlvo: function () {
      var qs = null;
      try { qs = new win.URLSearchParams(win.location.search); } catch (e) { qs = null; }
      var hab = qs && qs.get('hab');
      if (!hab) {
        var h = (win.location.hash || '').replace(/^#/, '');
        if (h && h !== 'desafios' && IDX[h]) { hab = h; }
      }
      var perfil = qs && qs.get('perfil');
      if (perfil && perfilPorId(perfil)) { UI.perfilVisivel = perfil; }
      if (hab && IDX[hab]) { return hab; }
      /* padrão: 1º nó de passo (não-conquista) */
      for (var i = 0; i < PERFIS.length; i++) {
        for (var j = 0; j < PERFIS[i].habilidades.length; j++) {
          if (!ehConquista(PERFIS[i].habilidades[j])) {
            UI.perfilVisivel = PERFIS[i].id;
            return PERFIS[i].habilidades[j].id;
          }
        }
      }
      return null;
    },

    /* ---------- PANORAMA (contadores agregados) ---------- */
    renderTally: function () {
      var c = UI.refs.tally; if (!c) { return; }
      var passos = todosNos().filter(function (h) { return !ehConquista(h); });
      var desbloq = passos.filter(function (h) { return Regras.desbloqueado(h); });
      var agg = Regras.contabilizar(desbloq);

      var conquistas = todosNos().filter(ehConquista);
      var conquistado = conquistas.filter(function (h) { return Regras.conquistaOk(h); }).length;

      var xpSub = 'XP confirmado nos nós desbloqueados' +
        (Estado.xpe != null ? ' · ' + Estado.xpe + ' XPE no nível' : '');

      c.innerHTML =
        UI.metric('mdi-lock-open-variant-outline', 'Nós desbloqueados',
          desbloq.length, '/ ' + passos.length, Math.round(desbloq.length / (passos.length || 1) * 100),
          desbloq.length + ' de ' + passos.length + ' nós liberados' ) +

        UI.metric('mdi-flag-checkered', 'Desafios concluídos',
          agg.feitos, '/ ' + agg.total, agg.pct,
          agg.pendentes + ' pendente(s) · ' + agg.pct + '% concluído' ) +

        UI.metric('mdi-lightning-bolt', 'Experiência dos desafios',
          agg.xpFeito, '/ ' + agg.xpTotal + ' XP',
          agg.xpTotal ? Math.round(agg.xpFeito / agg.xpTotal * 100) : 0,
          xpSub ) +

        UI.metric('mdi-medal-outline', 'Conquistas',
          conquistado, '/ ' + conquistas.length,
          Math.round(conquistado / (conquistas.length || 1) * 100),
          'Insígnias/títulos deste nível' );

      /* faixa de tipos (agregado) logo abaixo dos cartões */
      var row = el('div', 'dx-typerow');
      ORDEM_TIPO.forEach(function (k) {
        var m = TIPOS[k] || {}; var tp = agg.tipos[k];
        row.appendChild(el('span', 'tt-chip',
          '<span class="mdi ' + (m.icone || 'mdi-circle-small') + '"></span>' +
          escapar(m.label || k) + ': <b style="margin-left:4px">' + tp.f + '/' + tp.t + '</b>'));
      });
      c.appendChild(row);
    },

    metric: function (icone, label, valor, resto, pct, sub) {
      return '' +
        '<div class="dx-metric">' +
          '<span class="dx-metric__label"><span class="mdi ' + icone + '"></span>' + escapar(label) + '</span>' +
          '<div class="dx-metric__value"><b>' + valor + '</b> <small>' + escapar(resto) + '</small></div>' +
          '<div class="dx-metric__bar"><span class="dx-metric__fill" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>' +
          '<div class="dx-metric__sub">' + sub + '</div>' +
        '</div>';
    },

    /* ---------- abas de card (mobile/tablet) ---------- */
    renderTabs: function () {
      var c = UI.refs.tabs; if (!c) { return; }
      if (PERFIS.length < 2) { c.hidden = true; c.innerHTML = ''; return; }
      c.hidden = false; c.innerHTML = '';
      PERFIS.forEach(function (p) {
        var b = el('button', 'tt-profile-tab',
          '<span class="mdi ' + p.icone + '"></span><span>' + escapar(p.nome) + '</span>');
        b.type = 'button'; b.setAttribute('role', 'tab');
        b.setAttribute('data-perfil', p.id);
        b.setAttribute('aria-selected', p.id === UI.perfilVisivel ? 'true' : 'false');
        var cor = UI.corDoPerfil(p.id);
        b.style.setProperty('--tab-grad', cor.grad);
        b.style.setProperty('--tab-glow', cor.glow);
        b.addEventListener('click', function () {
          UI.perfilVisivel = p.id; UI.renderTabs(); UI.aplicarVisibilidade();
        });
        c.appendChild(b);
      });
    },

    corDoPerfil: function (perfilId) {
      var grad = 'var(--seg-grad)', glow = 'var(--seg-glow)';
      var tree = UI.refs.board && $('.tt-tree[data-perfil="' + perfilId + '"]', UI.refs.board);
      if (tree && win.getComputedStyle) {
        var cs = win.getComputedStyle(tree);
        var g = (cs.getPropertyValue('--p-grad') || '').trim();
        var w = (cs.getPropertyValue('--p-glow') || '').trim();
        if (g) { grad = g; } if (w) { glow = w; }
      }
      return { grad: grad, glow: glow };
    },

    aplicarVisibilidade: function () {
      if (!UI.refs.board) { return; }
      var trees = $$('.tt-tree', UI.refs.board);
      if (PERFIS.length < 2) { trees.forEach(function (t) { t.classList.remove('is-hidden'); }); }
      else {
        trees.forEach(function (t) {
          t.classList.toggle('is-hidden', t.getAttribute('data-perfil') !== UI.perfilVisivel);
        });
      }
      UI.desenharConectores();
    },

    /* ---------- MAPA da árvore (somente leitura) ---------- */
    renderBoard: function () {
      var b = UI.refs.board; if (!b) { return; }
      b.classList.add('dx-focus');
      b.innerHTML = '';
      PERFIS.forEach(function (p) { b.appendChild(UI.renderTree(p)); });
      UI.aplicarVisibilidade();
    },

    renderTree: function (perfil) {
      var tree = el('section', 'tt-tree');
      tree.setAttribute('data-perfil', perfil.id);
      tree.setAttribute('aria-label', 'Card — ' + perfil.nome);

      var passos = perfil.habilidades.filter(function (h) { return !ehConquista(h); });
      var maxed  = passos.filter(function (h) { return Regras.rank(h) >= h.ranksMax; }).length;

      var head = el('div', 'tt-tree__head');
      head.innerHTML =
        '<span class="tt-tree__icon"><span class="mdi ' + perfil.icone + '"></span></span>' +
        '<div class="tt-tree__title"><span>' + escapar(perfil.segmento || '') + '</span>' +
          '<h3>' + escapar(perfil.nome) + '</h3></div>' +
        '<span class="tt-tree__count"><b>' + maxed + '</b> / ' + passos.length + '</span>';
      tree.appendChild(head);

      var canvas = el('div', 'tt-tree__canvas');
      var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'tt-links'); svg.setAttribute('aria-hidden', 'true');
      canvas.appendChild(svg);

      perfil.tiers.forEach(function (t) {
        var habs = perfil.habilidades.filter(function (h) { return h.tier === t.n; });
        if (!habs.length) { return; }
        var faixa = el('div', 'tt-tier is-open');
        faixa.setAttribute('data-tier', t.n);
        faixa.innerHTML =
          '<div class="tt-tier__head">' +
            '<span class="tt-tier__n">' + t.n + '</span>' +
            '<span class="tt-tier__name">' + escapar(t.nome) + '</span>' +
          '</div>';
        var row = el('div', 'tt-tier__row');
        habs.forEach(function (h) { row.appendChild(UI.renderNode(h)); });
        faixa.appendChild(row);
        canvas.appendChild(faixa);
      });

      tree.appendChild(canvas);
      return tree;
    },

    renderNode: function (hab) {
      var wrap = el('div');
      wrap.style.gridColumn = String(hab.col || 1);
      wrap.style.position = 'relative';
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';

      var conquista = ehConquista(hab);
      var est  = Regras.estadoDoNo(hab);
      var rank = Regras.rank(hab);
      var sel  = hab.id === UI.selecionado;

      var btn = el('button', 'tt-node is-' + est + (conquista ? ' tt-node--titulo' : '') + (sel ? ' is-selected' : ''));
      btn.type = 'button';
      btn.setAttribute('data-hab', hab.id);
      btn.setAttribute('aria-label', hab.nome + (conquista ? '' : ' — ' + rank + ' de ' + hab.ranksMax + ' desafio(s)'));
      btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
      btn.innerHTML = '<span class="mdi ' + hab.icone + '"></span>' +
        (conquista ? '' : '<span class="tt-node__rank">' + rank + '/' + hab.ranksMax + '</span>');
      btn.addEventListener('click', function () { UI.selecionar(hab.id, true); });

      var label = el('span', 'tt-node__label', escapar(hab.nome));
      wrap.appendChild(btn); wrap.appendChild(label);
      return wrap;
    },

    /* ---------- seleção ---------- */
    selecionar: function (habId, viaClique) {
      if (!IDX[habId]) { return; }
      UI.selecionado = habId;

      /* se o nó pertence a um card oculto, revela esse card */
      var alvo = IDX[habId];
      if (PERFIS.length > 1 && alvo.perfilId !== UI.perfilVisivel) {
        UI.perfilVisivel = alvo.perfilId; UI.renderTabs(); UI.aplicarVisibilidade();
      }

      $$('.tt-node', UI.refs.board).forEach(function (n) {
        var on = n.getAttribute('data-hab') === habId;
        n.classList.toggle('is-selected', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $$('.tt-tree', UI.refs.board).forEach(function (t) {
        t.classList.toggle('dx-has-sel', t.getAttribute('data-perfil') === alvo.perfilId);
      });

      /* URL compartilhável, sem empilhar histórico */
      try {
        var novo = win.location.pathname + '?perfil=' + encodeURIComponent(alvo.perfilId) +
                   '&hab=' + encodeURIComponent(habId);
        win.history.replaceState(null, '', novo);
      } catch (e) { /* ambientes sem history API */ }

      UI.renderNodePanel();
      if (viaClique) { UI.irParaDesafios(); }
    },

    /* ---------- NÓ SELECIONADO: cabeçalho + contadores + lista ---------- */
    renderNodePanel: function () {
      var p = UI.refs.nodePanel; if (!p) { return; }
      var hab = IDX[UI.selecionado];
      if (!hab) { p.innerHTML = '<div class="tt-panel__empty">Selecione um nó no mapa para ver os desafios.</div>'; return; }

      var perfil = perfilPorId(hab.perfilId);
      var est = Regras.estadoDoNo(hab);
      var conquista = ehConquista(hab);
      var rotuloEstado = { available: 'Disponível', ranked: 'Em desenvolvimento', maxed: conquista ? 'Conquistado' : 'Dominado', locked: 'Bloqueado' }[est];
      var pillMod = est === 'locked' ? ' dx-state-pill--locked' : (est === 'maxed' ? ' dx-state-pill--done' : '');

      var html =
        '<div class="tt-panel__head">' +
          '<span class="tt-panel__icon"><span class="mdi ' + hab.icone + '"></span></span>' +
          '<div class="tt-panel__title">' +
            '<span>' + escapar(perfil ? perfil.nome : '') + '</span>' +
            '<h3>' + escapar(hab.nome) + '</h3>' +
          '</div>' +
          '<span class="dx-state-pill' + pillMod + '">' +
            '<span class="mdi ' + (est === 'locked' ? 'mdi-lock-outline' : 'mdi-check-circle-outline') + '"></span>' +
            rotuloEstado + '</span>' +
        '</div>';

      if (hab.resumo) { html += '<p class="tt-tip__resumo" style="margin:0 0 12px">' + escapar(hab.resumo) + '</p>'; }

      var pend = Regras.pendencias(hab);
      if (pend.length) { html += '<div class="dx-node-tally"><span class="dx-state-pill dx-state-pill--locked"><span class="mdi mdi-lock-outline"></span>' + escapar(pend[0]) + '</span></div>'; }

      /* mini-contadores do nó (grupo de desafios) */
      if (!conquista) {
        var t = Regras.contabilizar([hab]);
        var chips = '<div class="dx-node-tally">' +
          '<span class="tt-chip"><span class="mdi mdi-flag-checkered"></span>Concluídos <b style="margin-left:4px">' + t.feitos + '/' + t.total + '</b></span>' +
          '<span class="tt-chip tt-chip--xp"><span class="mdi mdi-lightning-bolt"></span>' + t.xpFeito + '/' + t.xpTotal + ' XP</span>';
        ORDEM_TIPO.forEach(function (k) {
          var tp = t.tipos[k]; if (!tp.t) { return; }
          var m = TIPOS[k] || {};
          chips += '<span class="tt-chip"><span class="mdi ' + (m.icone || 'mdi-circle-small') + '"></span>' +
                   escapar(m.label || k) + ' <b style="margin-left:4px">' + tp.f + '/' + tp.t + '</b></span>';
        });
        chips += '</div>';
        html += chips;
      }

      if (!hab.desafios.length) {
        html += '<div class="tt-panel__empty">' +
          (conquista
            ? (Regras.conquistaOk(hab) ? 'Conquista concluída.' : 'Conclua todos os nós exigidos para desbloquear.')
            : 'Nenhum desafio cadastrado para este nó.') + '</div>';
        p.innerHTML = html; return;
      }

      html += '<ul class="tt-challenges">';
      hab.desafios.forEach(function (d) {
        var feito = Regras.aprovado(d.id);
        var meta  = TIPOS[d.tipo] || TIPOS.tarefa || {};
        html +=
          '<li class="tt-challenge' + (feito ? ' is-done' : '') + '">' +
            '<span class="tt-challenge__mark"><span class="mdi ' + (feito ? 'mdi-check-bold' : (meta.icone || 'mdi-circle-small')) + '"></span></span>' +
            '<div class="tt-challenge__body">' +
              '<span class="tt-challenge__name">' + escapar(d.nome) + '</span>' +
              '<p class="tt-challenge__desc">' + escapar(d.desc || '') + '</p>' +
              '<div class="tt-challenge__meta">' +
                '<span class="tt-chip"><span class="mdi ' + (meta.icone || 'mdi-circle-small') + '"></span>' + escapar(meta.label || d.tipo) + '</span>' +
                (d.xp > 0 ? '<span class="tt-chip tt-chip--xp"><span class="mdi mdi-lightning-bolt"></span>+' + d.xp + ' XP</span>' : '') +
              '</div>' +
            '</div>' +
            '<span class="dx-status' + (feito ? ' dx-status--done' : '') + '">' +
              '<span class="mdi ' + (feito ? 'mdi-check-circle-outline' : 'mdi-clock-outline') + '"></span>' +
              (feito ? 'Concluído' : 'Pendente') + '</span>' +
          '</li>';
      });
      html += '</ul>';
      p.innerHTML = html;
    },

    /* ---------- REPUTAÇÃO — títulos / escadas ---------- */
    renderReputacao: function () {
      var c = UI.refs.rep; if (!c || !win.UDX_REP) { return; }
      var REP = win.UDX_REP;
      var rep = Estado.reputacao || { global: { pr: 0, pd: 0, n: 0 }, porPerfil: {} };

      var escopos = [{ id: '_global', nome: REP.perfilLabel('_global'), pr: rep.global.pr || 0, pd: rep.global.pd || 0, n: rep.global.n || 0 }];
      Object.keys(rep.porPerfil || {}).forEach(function (pid) {
        var e = rep.porPerfil[pid];
        escopos.push({ id: pid, nome: REP.perfilLabel(pid), pr: e.pr || 0, pd: e.pd || 0, n: e.n || 0 });
      });

      c.innerHTML = '';
      escopos.forEach(function (e) {
        c.appendChild(UI.repCard(REP, e));
      });

      if (!Estado.repronto) {
        var nota = el('p', 'lead');
        nota.style.cssText = 'font-size:13px;margin-top:10px;color:var(--udx-text-muted)';
        nota.textContent = Estado.online
          ? 'Ainda sem avaliações registradas — as escadas preenchem conforme a coordenação avalia seus desafios.'
          : 'Reputação indisponível offline. Reconecte para ver PR/PD e títulos.';
        c.appendChild(nota);
      }
    },

    repCard: function (REP, e) {
      var card = el('div', 'dx-rep-card');
      var head =
        '<div class="dx-rep-card__head">' +
          '<span class="dx-rep-card__icon"><span class="mdi mdi-shield-star-outline"></span></span>' +
          '<div><div class="dx-rep-card__scope">' + escapar(e.nome) + '</div>' +
          '<div class="dx-rep-card__n">' + e.n + ' avaliação(ões)</div></div>' +
        '</div>';

      card.innerHTML = head +
        UI.repAxis(REP, 'Reputação (PR)', e.pr, REP.titulosReputacao, false) +
        UI.repAxis(REP, 'Desempenho (PD)', e.pd, REP.titulosDesempenho, true);
      return card;
    },

    repAxis: function (REP, titulo, valor, lista, escala100) {
      var atual = REP.tituloAtual(valor, lista);
      var prox  = REP.proximoTitulo(valor, lista);
      var cor   = atual ? atual.cor : '#5708A6';
      var badge = atual
        ? '<span class="dx-rep-badge" style="background:' + cor + '"><span class="mdi ' + atual.icone + '"></span>' + escapar(atual.nome) + '</span>'
        : '<span class="dx-rep-badge dx-rep-badge--muted"><span class="mdi mdi-circle-outline"></span>Sem título</span>';

      var pct, proxTxt;
      if (prox) {
        pct = Math.round(prox.progresso * 100);
        proxTxt = 'Faltam <b>' + (prox.titulo.min - valor) + '</b> para <b>' + escapar(prox.titulo.nome) + '</b>';
      } else {
        pct = 100;
        proxTxt = 'Topo da escada alcançado.';
      }
      var corBar = prox ? prox.titulo.cor : cor;

      /* legenda dos degraus (oficiais) */
      var ladder = '<div class="dx-ladder">';
      lista.forEach(function (t) {
        var reached = valor >= t.min;
        ladder += '<span class="dx-ladder__step' + (reached ? ' is-reached' : '') + '"' +
          (reached ? ' style="background:' + t.cor + '"' : '') + '>' +
          '<span class="mdi ' + t.icone + '"></span>' + escapar(t.nome) +
          ' · ' + t.min + (escala100 ? '' : ' PR') + '</span>';
      });
      ladder += '</div>';

      return '' +
        '<div class="dx-rep-axis">' +
          '<div class="dx-rep-axis__top"><span>' + titulo + ' · <b>' + valor + (escala100 ? '/100' : '') + '</b></span>' + badge + '</div>' +
          '<div class="dx-rep-bar"><span class="dx-rep-bar__fill" style="width:' + pct + '%;background:' + corBar + '"></span></div>' +
          '<div class="dx-rep-axis__next">' + proxTxt + '</div>' +
          ladder +
        '</div>';
    },

    /* ---------- conectores SVG (idêntico ao motor das árvores) ---------- */
    desenharConectores: function () {
      $$('.tt-tree', UI.refs.board).forEach(function (tree) {
        var canvas = $('.tt-tree__canvas', tree);
        var svg = $('.tt-links', tree);
        if (!canvas || !svg) { return; }
        var box = canvas.getBoundingClientRect();
        if (!box.width) { return; }
        svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
        svg.setAttribute('width', box.width); svg.setAttribute('height', box.height);
        while (svg.firstChild) { svg.removeChild(svg.firstChild); }

        var perfil = perfilPorId(tree.getAttribute('data-perfil'));
        if (!perfil) { return; }
        perfil.habilidades.forEach(function (hab) {
          if (!hab.requer.length) { return; }
          var alvo = $('[data-hab="' + hab.id + '"]', tree);
          if (!alvo) { return; }
          var bAlvo = alvo.getBoundingClientRect();
          hab.requer.forEach(function (reqId) {
            var origem = $('[data-hab="' + reqId + '"]', tree);
            if (!origem) { return; }
            var bOrig = origem.getBoundingClientRect();
            var x1 = bOrig.left - box.left + bOrig.width / 2;
            var y1 = bOrig.top - box.top + bOrig.height;
            var x2 = bAlvo.left - box.left + bAlvo.width / 2;
            var y2 = bAlvo.top - box.top;
            var mid = y1 + (y2 - y1) / 2;
            var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + mid + ', ' + x2 + ' ' + mid + ', ' + x2 + ' ' + y2);
            var pr = IDX[reqId];
            var ativo = pr && Regras.rank(pr) >= pr.ranksMax;
            path.setAttribute('class', 'tt-link' + (ativo ? ' is-active' : ''));
            svg.appendChild(path);
          });
        });
      });
    },

    irParaDesafios: function () {
      var alvo = doc.getElementById('desafios');
      if (!alvo) { return; }
      var bar = doc.querySelector('.members-topbar');
      var off = (bar ? bar.getBoundingClientRect().height : 60) + 12;
      var y = alvo.getBoundingClientRect().top + (win.pageYOffset || 0) - off;
      if (y < 0) { y = 0; }
      if (win.scrollTo) { win.scrollTo({ top: y, behavior: 'smooth' }); }
      else { win.scroll(0, y); }
    },

    renderTudo: function () {
      UI.renderTally();
      UI.renderBoard();
      UI.renderTabs();
      UI.renderReputacao();
      /* aplica a seleção depois do board existir */
      $$('.tt-node', UI.refs.board).forEach(function (n) {
        var on = n.getAttribute('data-hab') === UI.selecionado;
        n.classList.toggle('is-selected', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var alvo = IDX[UI.selecionado];
      if (alvo) {
        $$('.tt-tree', UI.refs.board).forEach(function (t) {
          t.classList.toggle('dx-has-sel', t.getAttribute('data-perfil') === alvo.perfilId);
        });
      }
      UI.renderNodePanel();
      if (win.requestAnimationFrame) { win.requestAnimationFrame(UI.desenharConectores); }
      else { win.setTimeout(UI.desenharConectores, 60); }
    }
  };

  /* ============================================================
     BOOT
  ============================================================ */
  function boot() {
    UI.montar();
    if (!UI.refs.board) { return; }

    fetch(API.me, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u || !u.email) { win.location.href = '/entrar/'; return null; }
        var email = $('#userEmail'); if (email) { email.textContent = u.email; }
        var chip = $('#userChip'); if (chip) { chip.hidden = false; }
        return Promise.all([Estado.carregar(), Estado.carregarReputacao()]);
      })
      .catch(function () { return Promise.all([Estado.carregar(), Estado.carregarReputacao()]); })
      .then(function () {
        UI.selecionado = UI.resolverAlvo();
        if (UI.refs.app) { UI.refs.app.hidden = false; }
        UI.renderTudo();
      });

    var tRedraw;
    win.addEventListener('resize', function () {
      win.clearTimeout(tRedraw);
      tRedraw = win.setTimeout(UI.desenharConectores, 140);
    });
    win.addEventListener('hashchange', function () {
      var h = (win.location.hash || '').replace(/^#/, '');
      if (h && h !== 'desafios' && IDX[h]) { UI.selecionar(h, false); }
    });
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

  win.UDX_DESAFIOS = { estado: Estado, regras: Regras, ui: UI };

}(window, document));
