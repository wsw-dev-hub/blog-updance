/**
 * ================================================================
 *  UP DANCE EXPERIENCE — MOTOR DE TRILHAS (multi-perfil)
 *  /js/trilha.js
 * ----------------------------------------------------------------
 *  Requisitos:
 *    - Um data module carregado ANTES (expõe window.UDX_TRILHA):
 *      fundamentos.data.js | iniciante.data.js | intermediario.data.js
 *    - Reusa as classes .tt-* de /css/talentTree.css (aparência idêntica)
 *
 *  MODELO (igual à Árvore de Talentos, sem alocação de pontos):
 *    - DADOS.perfis pode ter VÁRIAS colunas (cards) lado a lado. Cada
 *      coluna tem faixas internas empilhadas e conectores SVG entre elas.
 *    - O RANK de um nó = nº de desafios APROVADOS daquele nó (teto ranksMax).
 *    - Nós de conquista (tipo 'titulo'/'insignia') não têm desafios: ficam
 *      prontos quando todos os seus 'requer' estão no máximo (fan-in).
 *    - Para o BACKEND os cards são um só perfil (runtime.perfilId): o split
 *      em colunas é apenas disposição visual. O XPE é o total do nível.
 * ================================================================ */
(function (win, doc) {
  'use strict';

  var DADOS = win.UDX_TRILHA || win.UDX_FUNDAMENTOS;
  if (!DADOS) { return; }

  var RT  = (DADOS && DADOS.runtime) || {};
  var API = RT.api || { me: '/api/me', estado: '/api/temporada/estado', desafio: '/api/temporada/desafio' };
  var CHAVE_LOCAL = RT.chaveLocal || 'udx:temporada:v1';
  /* Chave da árvore p/ desafios.js (ROTAS): fundamentos | iniciante | intermediario.
     É o mesmo perfil do backend (RT.perfilId, usado no envio de desafio). */
  var ARVORE = RT.arvore || RT.perfilId || '';

  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  function el(t, cls, html){ var n=doc.createElement(t); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; }
  function escapar(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  var PERFIS = DADOS.perfis;
  var IDX = DADOS.indice;
  var NIVEL = DADOS.temporada || {};
  function ehConquista(h) { return !!h && (h.tipo === 'titulo' || h.tipo === 'insignia'); }
  function perfilPorId(id) { for (var i=0;i<PERFIS.length;i++){ if (PERFIS[i].id===id) return PERFIS[i]; } return null; }
  function conquistas() {
    var a=[]; PERFIS.forEach(function(p){ p.habilidades.forEach(function(h){ if (ehConquista(h)) a.push(h); }); }); return a;
  }
  function todosNos() {
    var a=[]; PERFIS.forEach(function(p){ p.habilidades.forEach(function(h){ a.push(h); }); }); return a;
  }
  function tierPorN(perfil, n) {
    if (!perfil || !perfil.tiers) { return null; }
    for (var i=0;i<perfil.tiers.length;i++){ if (perfil.tiers[i].n===n) return perfil.tiers[i]; }
    return null;
  }

  /* ============================================================
     ESTADO — reflete o servidor; degrada para localStorage
  ============================================================ */
  var Estado = {
    dados: { xpe: 0, desafios: [], insignias: [] },
    lerLocal: function () { try { var r = win.localStorage.getItem(CHAVE_LOCAL); if (r) Estado.dados = JSON.parse(r); } catch (e) {} },
    gravarLocal: function () { try { win.localStorage.setItem(CHAVE_LOCAL, JSON.stringify(Estado.dados)); } catch (e) {} },
    normalizar: function (b) {
      return {
        xpe:       (b && typeof b.xpe === 'number' && b.xpe >= 0) ? Math.floor(b.xpe) : 0,
        desafios:  (b && Array.isArray(b.desafios))  ? b.desafios.slice()  : [],
        insignias: (b && Array.isArray(b.insignias)) ? b.insignias.slice() : []
      };
    },
    carregar: function () {
      return fetch(API.estado, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { if (j) { Estado.dados = Estado.normalizar(j); Estado.gravarLocal(); } else { Estado.lerLocal(); } })
        .catch(function () { Estado.lerLocal(); });
    }
  };

  /* ============================================================
     REGRAS — funções PURAS (testáveis fora do DOM)
  ============================================================ */
  var Regras = {
    aprovado: function (desafioId) { return Estado.dados.desafios.indexOf(desafioId) !== -1; },

    rank: function (hab) {
      if (ehConquista(hab)) { return Regras.conquistaOk(hab) ? 1 : 0; }
      var n = hab.desafios.reduce(function (a, d) { return a + (Regras.aprovado(d.id) ? 1 : 0); }, 0);
      return Math.min(n, hab.ranksMax);
    },
    prereqsOk: function (hab) {
      return hab.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
    },
    conquistaOk: function (hab) {
      return hab.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
    },
    insigniaOk: function (hab) { return Regras.conquistaOk(hab); },

    estadoDoNo: function (hab) {
      if (ehConquista(hab)) { return Regras.conquistaOk(hab) ? 'maxed' : 'locked'; }
      var r = Regras.rank(hab);
      if (r >= hab.ranksMax) { return 'maxed'; }
      if (r > 0)             { return 'ranked'; }
      return Regras.prereqsOk(hab) ? 'available' : 'locked';
    },
    podeEnviar: function (desafio) {
      var hab = IDX[desafio.habId];
      if (!hab) { return false; }
      if (Regras.aprovado(desafio.id)) { return false; }
      return Regras.prereqsOk(hab);
    },

    xpe: function () { return Estado.dados.xpe; },
    limiar: function () { return NIVEL.limiarXPE || 0; },
    progresso: function () { var l = Regras.limiar(); return l ? Math.min(1, Regras.xpe() / l) : 0; },
    /* elegível quando TODAS as conquistas (títulos dos 3 cards) estão prontas */
    elegivelPromocao: function () {
      var cs = conquistas();
      return cs.length ? cs.every(function (h) { return Regras.conquistaOk(h); }) : (Regras.xpe() >= Regras.limiar());
    },

    pendencias: function (hab) {
      var lista = [];
      hab.requer.forEach(function (id) { var p = IDX[id]; if (p && Regras.rank(p) < p.ranksMax) { lista.push('Conclua ' + p.nome + ' para liberar.'); } });
      return lista;
    }
  };

  /* anexa habId em cada desafio (uma vez) para lookup reverso */
  PERFIS.forEach(function (p) { p.habilidades.forEach(function (h) { if (h.perfilId == null) { h.perfilId = p.id; } h.desafios.forEach(function (d) { d.habId = h.id; }); }); });

  /* ============================================================
     UI — reusa .tt-* de talentTree.css (múltiplas colunas)
  ============================================================ */
  var UI = {
    refs: {},
    selecionado: null,
    perfilVisivel: null,
    tipFixo: false,        // tooltip "preso" após clique no nó (popover)

    montar: function () {
      UI.refs.board    = $('#tfBoard');
      UI.refs.panel    = $('#tfPanel');
      UI.refs.badges   = $('#tfBadges');
      UI.refs.progress = $('#tfProgress');
      UI.refs.tip      = $('#tfTip');
      UI.refs.tabs     = $('#tfProfileTabs');
      if (!UI.perfilVisivel && PERFIS[0]) { UI.perfilVisivel = PERFIS[0].id; }
    },

    renderProgresso: function () {
      if (!UI.refs.progress) { return; }
      var xpe = Regras.xpe(), lim = Regras.limiar(), pct = Math.round(Regras.progresso() * 100);
      var falta = Math.max(0, lim - xpe);
      var proximo = NIVEL.promovePara || 'o próximo nível';
      UI.refs.progress.innerHTML =
        '<div class="tt-wallet__item" style="--w-grad:var(--seg-grad)">' +
          '<span class="tt-wallet__icon"><span class="mdi mdi-lightning-bolt"></span></span>' +
          '<div class="tt-wallet__info">' +
            '<span class="tt-wallet__name">XPE de ' + escapar(NIVEL.nome || 'nível') + '</span>' +
            '<span class="tt-wallet__value"><b>' + xpe + '</b> / ' + lim + ' XPE ' +
              '<span style="color:var(--udx-text-muted)">· ' +
              (Regras.elegivelPromocao() ? 'nível concluído — elegível a ' + escapar(proximo)
                                         : 'faltam ' + falta + ' XPE para ' + escapar(proximo)) + '</span></span>' +
            '<span class="tt-wallet__bar"><span class="tt-wallet__fill" style="width:' + pct + '%"></span></span>' +
          '</div>' +
        '</div>';
    },

    /* ---------- board: uma coluna por perfil (card) ---------- */
    renderBoard: function () {
      var b = UI.refs.board; b.innerHTML = '';
      PERFIS.forEach(function (p) { b.appendChild(UI.renderTree(p)); });
      UI.aplicarVisibilidade();
    },

    /* ---------- seletor de cartoes (abas — mobile/tablet) ----------
       Espelha o comportamento de #ttProfileTabs da Arvore de Talentos:
       abaixo de 1024px mostra um card por vez; em >=1024px o CSS oculta as
       abas e o board volta a exibir todas as colunas lado a lado. */
    gradDoPerfil: function (perfilId) {
      var grad = 'var(--seg-grad)', glow = 'var(--seg-glow)';
      var tree = UI.refs.board && $('.tt-tree[data-perfil="' + perfilId + '"]', UI.refs.board);
      if (tree && win.getComputedStyle) {
        var cs = win.getComputedStyle(tree);
        var g = (cs.getPropertyValue('--p-grad') || '').trim();
        var w = (cs.getPropertyValue('--p-glow') || '').trim();
        if (g) { grad = g; }
        if (w) { glow = w; }
      }
      return { grad: grad, glow: glow };
    },

    renderTabs: function () {
      var c = UI.refs.tabs;
      if (!c) { return; }
      if (!PERFIS || PERFIS.length < 2) { c.hidden = true; c.innerHTML = ''; return; }
      c.hidden = false;
      c.innerHTML = '';
      PERFIS.forEach(function (p) {
        var cor = UI.gradDoPerfil(p.id);
        var b = el('button', 'tt-profile-tab',
          '<span class="mdi ' + p.icone + '"></span><span>' + escapar(p.nome) + '</span>');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('data-perfil', p.id);
        b.setAttribute('aria-selected', p.id === UI.perfilVisivel ? 'true' : 'false');
        b.style.setProperty('--tab-grad', cor.grad);
        b.style.setProperty('--tab-glow', cor.glow);
        b.addEventListener('click', function () {
          UI.perfilVisivel = p.id;
          UI.renderTabs();
          UI.aplicarVisibilidade();
        });
        c.appendChild(b);
      });
    },

    aplicarVisibilidade: function () {
      if (!UI.refs.board) { return; }
      var trees = $$('.tt-tree', UI.refs.board);
      if (!PERFIS || PERFIS.length < 2) {
        trees.forEach(function (t) { t.classList.remove('is-hidden'); });
      } else {
        trees.forEach(function (t) {
          t.classList.toggle('is-hidden', t.getAttribute('data-perfil') !== UI.perfilVisivel);
        });
      }
      UI.desenharConectores();
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
      svg.setAttribute('class', 'tt-links');
      svg.setAttribute('aria-hidden', 'true');
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
      var est = Regras.estadoDoNo(hab);
      var rank = Regras.rank(hab);
      var btn = el('button', 'tt-node is-' + est + (conquista ? ' tt-node--titulo' : ''));
      btn.type = 'button';
      btn.setAttribute('data-hab', hab.id);
      btn.setAttribute('aria-label', hab.nome + (conquista ? '' : ' — nível ' + rank + ' de ' + hab.ranksMax));
      btn.innerHTML = '<span class="mdi ' + hab.icone + '"></span>' +
        (conquista ? '' : '<span class="tt-node__rank">' + rank + '/' + hab.ranksMax + '</span>');
      /* O nó apenas ABRE (e FIXA) o tooltip; quem seleciona + navega é o botão. */
      btn.addEventListener('click', function () { UI.tipFixo = true; UI.mostrarTip(hab, btn); });

      var label = el('span', 'tt-node__label', escapar(hab.nome));
      wrap.appendChild(btn);
      wrap.appendChild(label);
      return wrap;
    },

    selecionar: function (habId) {
      UI.selecionado = habId;
      $$('.tt-node', UI.refs.board).forEach(function (n) {
        n.classList.toggle('is-selected', n.getAttribute('data-hab') === habId);
      });
      UI.renderPanel();
    },

    renderPanel: function () {
      var p = UI.refs.panel; if (!p) { return; }
      var hab = IDX[UI.selecionado];
      if (!hab) { p.innerHTML = '<div class="tt-panel__empty">Selecione um nó para ver os desafios.</div>'; return; }

      var html = '<div class="tt-panel__head"><span class="mdi ' + hab.icone + '"></span>' +
                 '<div><h3>' + escapar(hab.nome) + '</h3><p>' + escapar(hab.resumo || '') + '</p></div></div>';

      var pend = Regras.pendencias(hab);
      if (pend.length) { html += '<div class="tt-panel__lock">' + pend.map(escapar).join(' ') + '</div>'; }

      if (!hab.desafios.length) {
        html += '<div class="tt-panel__empty">' +
          (ehConquista(hab)
            ? (Regras.conquistaOk(hab) ? 'Conquista concluída.' : 'Conclua todos os nós deste card para desbloquear.')
            : 'Sem desafios cadastrados.') + '</div>';
      }

      hab.desafios.forEach(function (d) {
        var feito = Regras.aprovado(d.id);
        var pode  = Regras.podeEnviar(d);
        var tp = DADOS.tiposDesafio[d.tipo] || { label: d.tipo, icone: 'mdi-flag' };
        html +=
          '<div class="tt-challenge' + (feito ? ' is-done' : '') + '">' +
            '<span class="tt-challenge__icon"><span class="mdi ' + tp.icone + '"></span></span>' +
            '<div class="tt-challenge__body">' +
              '<span class="tt-challenge__name">' + escapar(d.nome) + '</span>' +
              '<span class="tt-challenge__desc">' + escapar(d.desc) + '</span>' +
              '<span class="tt-chip tt-chip--xp"><span class="mdi mdi-lightning-bolt"></span>+' + d.xp + ' XPE</span>' +
            '</div>' +
            (feito
              ? '<span class="tt-challenge__ok"><span class="mdi mdi-check-bold"></span></span>'
              : '<button type="button" class="tt-challenge__cta" data-desafio="' + escapar(d.id) + '"' +
                (pode ? '' : ' disabled') + '>Enviar</button>') +
          '</div>';
      });
      p.innerHTML = html;
    },

    renderBadges: function () {
      var c = UI.refs.badges; if (!c) { return; }
      c.innerHTML = '';
      conquistas().forEach(function (insig) {
        var li = el('li', 'tt-title' + (Regras.conquistaOk(insig) ? ' is-earned' : ''));
        li.innerHTML = '<span class="mdi ' + insig.icone + '"></span>' +
                       '<div><b>' + escapar(insig.nome) + '</b><p>' + escapar(insig.resumo || '') + '</p></div>';
        c.appendChild(li);
      });
    },

    /* ---------- conectores SVG (por coluna) ---------- */
    desenharConectores: function () {
      $$('.tt-tree', UI.refs.board).forEach(function (tree) {
        var canvas = $('.tt-tree__canvas', tree);
        var svg    = $('.tt-links', tree);
        if (!canvas || !svg) { return; }
        var perfil = perfilPorId(tree.getAttribute('data-perfil'));
        if (!perfil) { return; }

        var box = canvas.getBoundingClientRect();
        if (!box.width) { return; }
        svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
        svg.setAttribute('width', box.width);
        svg.setAttribute('height', box.height);
        while (svg.firstChild) { svg.removeChild(svg.firstChild); }

        perfil.habilidades.forEach(function (hab) {
          if (!hab.requer || !hab.requer.length) { return; }
          var alvo = $('[data-hab="' + hab.id + '"]', tree);
          if (!alvo) { return; }
          var bAlvo = alvo.getBoundingClientRect();

          hab.requer.forEach(function (reqId) {
            var origem = $('[data-hab="' + reqId + '"]', tree);
            if (!origem) { return; }
            var bOrig = origem.getBoundingClientRect();

            var x1 = bOrig.left - box.left + bOrig.width / 2;
            var y1 = bOrig.top  - box.top  + bOrig.height;
            var x2 = bAlvo.left - box.left + bAlvo.width / 2;
            var y2 = bAlvo.top  - box.top;
            var mid = y1 + (y2 - y1) / 2;

            var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + mid + ', ' + x2 + ' ' + mid + ', ' + x2 + ' ' + y2);

            var pr    = IDX[reqId];
            var ativo = pr && Regras.rank(pr) >= pr.ranksMax;
            path.setAttribute('class', 'tt-link' + (ativo ? ' is-active' : ''));
            if (ativo && win.getComputedStyle) {
              var cs   = win.getComputedStyle(alvo);
              var acc  = (cs.getPropertyValue('--p-accent') || '').trim();
              var glow = (cs.getPropertyValue('--p-glow') || '').trim();
              if (acc)  { path.style.stroke = acc; }
              if (glow) { path.style.filter = 'drop-shadow(0 0 5px ' + glow + ')'; }
            }
            svg.appendChild(path);
          });
        });
      });
    },

    /* ---------- tooltip (hover / foco / toque) ---------- */
    corDoCartao: function (alvo) {
      var grad = 'var(--seg-grad)', accent = 'var(--seg-accent)';
      if (alvo && win.getComputedStyle) {
        var cs = win.getComputedStyle(alvo);
        var g = (cs.getPropertyValue('--p-grad')   || '').trim();
        var a = (cs.getPropertyValue('--p-accent') || '').trim();
        if (g) { grad = g; }
        if (a) { accent = a; }
      }
      return { grad: grad, accent: accent };
    },

    mostrarTip: function (hab, alvo) {
      var tip = UI.refs.tip; if (!tip || !hab) { return; }
      win.clearTimeout(UI.tipTimer);
      var perfil    = perfilPorId(hab.perfilId);
      var rank      = Regras.rank(hab);
      var pend      = Regras.pendencias(hab);
      var tier      = tierPorN(perfil, hab.tier);
      var conquista = ehConquista(hab);
      var cor       = UI.corDoCartao(alvo);

      tip.style.setProperty('--tip-grad',   cor.grad);
      tip.style.setProperty('--tip-accent', cor.accent);

      var html =
        '<div class="tt-tip__head">' +
          '<span class="tt-tip__icon"><span class="mdi ' + hab.icone + '"></span></span>' +
          '<div>' +
            '<h4 class="tt-tip__name">' + escapar(hab.nome) + '</h4>' +
            '<span class="tt-tip__tier">' + escapar(perfil ? perfil.nome : '') +
              (tier ? ' &middot; ' + escapar(tier.nome) : '') + '</span>' +
          '</div>' +
          (conquista
            ? '<span class="tt-tip__rank">INSÍGNIA</span>'
            : '<span class="tt-tip__rank">' + rank + '/' + hab.ranksMax + '</span>') +
        '</div>' +
        '<p class="tt-tip__resumo">' + escapar(hab.resumo || '') + '</p>';

      if (!conquista) {
        if (rank > 0 && hab.niveis[rank - 1]) {
          html += '<p class="tt-tip__nivel"><b>Nível ' + rank + ' — atual</b>' +
                  escapar(hab.niveis[rank - 1]) + '</p>';
        }
        if (rank < hab.ranksMax && hab.niveis[rank]) {
          html += '<p class="tt-tip__nivel tt-tip__nivel--next"><b>Nível ' + (rank + 1) +
                  ' — próximo</b>' + escapar(hab.niveis[rank]) + '</p>';
        }
      }
      pend.forEach(function (p) {
        html += '<p class="tt-tip__req"><span class="mdi mdi-lock-outline"></span>' +
                escapar(p) + '</p>';
      });
      if (!conquista && hab.desafios.length) {
        html += '<p class="tt-tip__hint">' + hab.desafios.length + ' desafio(s) geram ' +
                escapar((perfil && perfil.xpLabel) || 'XPE') +
                '. Clique no nó para abrir a lista.</p>';
      }
      if (conquista) {
        html += '<p class="tt-tip__hint">' + (Regras.conquistaOk(hab)
                  ? 'Insígnia conquistada.'
                  : 'Conclua todos os nós deste card para desbloquear.') + '</p>';
      }

      var destinoDesafios = '/membros/desafios/?arvore=' + encodeURIComponent(ARVORE) +
                            '&hab=' + encodeURIComponent(hab.id);
      html += '<a class="tt-tip__go" href="' + escapar(destinoDesafios) + '" data-hab="' + escapar(hab.id) + '">' +
                '<span class="mdi mdi-flag-checkered" aria-hidden="true"></span>' +
                (conquista ? 'Ver atividades do card' : 'Ir para os desafios') + '</a>';

      tip.innerHTML = html;
      tip.classList.add('is-open');
      tip.setAttribute('aria-hidden', 'false');
      UI.posicionarTip(alvo);
    },

    posicionarTip: function (alvo) {
      var tip = UI.refs.tip; if (!tip || !alvo) { return; }
      var b = alvo.getBoundingClientRect();
      var t = tip.getBoundingClientRect();
      var m = 12;
      var left = b.left + b.width / 2 - t.width / 2;
      left = Math.max(m, Math.min(left, win.innerWidth - t.width - m));
      var top = b.bottom + 10;
      if (top + t.height > win.innerHeight - m) { top = b.top - t.height - 10; }
      top = Math.max(m, top);
      tip.style.left = left + 'px';
      tip.style.top  = top + 'px';
    },

    esconderTip: function () {
      var tip = UI.refs.tip; if (!tip) { return; }
      win.clearTimeout(UI.tipTimer);
      UI.tipFixo = false;
      var ae = doc.activeElement;                 // nunca ocultar (aria-hidden) um descendente focado
      if (ae && tip.contains(ae) && ae.blur) { ae.blur(); }
      tip.classList.remove('is-open');
      tip.setAttribute('aria-hidden', 'true');
    },

    /* Rola até a âncora #desafios compensando a altura REAL da topbar fixa
       (no mobile ela quebra em 2 linhas e fica bem mais alta que no desktop). */
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

    pedirEsconderTip: function () {
      if (UI.tipFixo) { return; }                 // popover fixado não fecha por mouseout
      win.clearTimeout(UI.tipTimer);
      UI.tipTimer = win.setTimeout(function () { UI.esconderTip(); }, 260);
    },

    renderTudo: function () {
      UI.renderProgresso(); UI.renderBoard(); UI.renderTabs(); UI.renderBadges();
      if (!UI.selecionado && PERFIS[0] && PERFIS[0].habilidades[0]) { UI.selecionar(PERFIS[0].habilidades[0].id); }
      else { UI.renderPanel(); }
      if (win.requestAnimationFrame) { win.requestAnimationFrame(UI.desenharConectores); }
      else { win.setTimeout(UI.desenharConectores, 60); }
    },

    toast: function (msg) {
      var t = $('#tfToast'); if (!t) { return; }
      t.innerHTML = '<span class="mdi mdi-check-circle-outline"></span><span>' + escapar(msg) + '</span>';
      t.classList.add('is-open');                 // classe correta (CSS estiliza .tt-toast.is-open)
      win.clearTimeout(UI.toastTimer);
      UI.toastTimer = win.setTimeout(function () { t.classList.remove('is-open'); }, 3200);
    }
  };

  /* ============================================================
     AÇÕES — envio de comprovação
  ============================================================ */
  var Acoes = {
    enviar: function (desafioId) {
      var desafio = null;
      todosNos().some(function (h) { return h.desafios.some(function (d) { if (d.id === desafioId) { desafio = d; return true; } }); });
      if (!desafio || Regras.aprovado(desafioId)) { return; }
      if (!Regras.podeEnviar(desafio)) { UI.toast('Conclua os pré-requisitos primeiro.'); return; }

      fetch(API.desafio, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil: RT.perfilId, desafio: desafioId })
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && (j.status === 'aprovado' || j.status === 'pendente')) {
            if (j.status === 'aprovado') {
              if (Estado.dados.desafios.indexOf(desafioId) === -1) { Estado.dados.desafios.push(desafioId); }
              if (typeof j.xpe === 'number') { Estado.dados.xpe = j.xpe; }
              UI.toast('Desafio validado: +' + desafio.xp + ' XPE.');
            } else { UI.toast('Comprovação enviada — aguardando validação.'); }
          } else {
            Estado.dados.desafios.push(desafioId); Estado.dados.xpe += desafio.xp;
            UI.toast('Registrado localmente: +' + desafio.xp + ' XPE.');
          }
          Estado.gravarLocal(); UI.renderTudo();
        })
        .catch(function () {
          Estado.dados.desafios.push(desafioId); Estado.dados.xpe += desafio.xp;
          Estado.gravarLocal(); UI.renderTudo();
        });
    }
  };

  function ligarEventos() {
    if (UI.refs.panel) {
      UI.refs.panel.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-desafio]');
        if (!b || b.disabled) { return; }
        b.disabled = true;
        Acoes.enviar(b.getAttribute('data-desafio'));
      });
    }

    /* --- pop-up de informações: hover (mouse), foco (teclado) e toque --- */
    if (UI.refs.board) {
      UI.refs.board.addEventListener('mouseover', function (ev) {
        var btn = ev.target.closest('.tt-node'); if (!btn) { return; }
        var hab = IDX[btn.getAttribute('data-hab')];
        if (hab) { UI.mostrarTip(hab, btn); }
      });
      UI.refs.board.addEventListener('mouseout', function (ev) {
        if (ev.target.closest('.tt-node')) { UI.pedirEsconderTip(); }
      });
      UI.refs.board.addEventListener('focusin', function (ev) {
        var btn = ev.target.closest('.tt-node'); if (!btn) { return; }
        var hab = IDX[btn.getAttribute('data-hab')];
        if (hab) { UI.mostrarTip(hab, btn); }
      });
      UI.refs.board.addEventListener('focusout', function () { UI.esconderTip(); });

      /* pop-up permanece aberto enquanto o ponteiro esta sobre ele
         (permite clicar no link "Ir para os desafios") */
      if (UI.refs.tip) {
        UI.refs.tip.addEventListener('mouseenter', function () { win.clearTimeout(UI.tipTimer); });
        UI.refs.tip.addEventListener('mouseleave', function () { if (!UI.tipFixo) { UI.esconderTip(); } });
        /* "Ir para os desafios" agora é link real p/ /membros/desafios/?arvore=&hab=.
           Sem preventDefault: preserva navegação nativa (inclui abrir em nova aba); só fecha o tip. */
        UI.refs.tip.addEventListener('click', function (ev) {
          if (!ev.target.closest('.tt-tip__go')) { return; }
          UI.esconderTip();
        });
      }

      /* toque: fecha o pop-up ao rolar ou tocar fora de um nó */
      win.addEventListener('scroll', function () { UI.esconderTip(); }, { passive: true });
      doc.addEventListener('pointerdown', function (ev) {
        if (!ev.target.closest('.tt-node') && !ev.target.closest('.tt-tip')) { UI.esconderTip(); }
      }, true);
    }
  }

  /* ============================================================
     PORTARIA + BOOT
  ============================================================ */
  function boot() {
    UI.montar();
    if (!UI.refs.board) { return; }

    fetch(API.me, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u || !u.email) { win.location.href = '/entrar/'; return null; }
        var email = $('#userEmail'); if (email) { email.textContent = u.email; }
        var chip  = $('#userChip');  if (chip)  { chip.hidden = false; }
        return Estado.carregar();
      })
      .catch(function () { return Estado.carregar(); })
      .then(function () {
        var app = $('#tfApp'); if (app) { app.hidden = false; }
        UI.renderTudo();
        ligarEventos();
      });

    var tRedraw;
    win.addEventListener('resize', function () {
      win.clearTimeout(tRedraw);
      tRedraw = win.setTimeout(UI.desenharConectores, 140);
    });
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

  win.UDX_TEMPORADA = { estado: Estado, regras: Regras, ui: UI, acoes: Acoes };

}(window, document));