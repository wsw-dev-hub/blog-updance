/**
 * ================================================================
 *  UP DANCE EXPERIENCE — TEMPORADA FREE · MOTOR
 *  /js/fundamentos.js   ·   motor da página da temporada
 * ----------------------------------------------------------------
 *  Requisitos:
 *    - Um data module de trilha carregado ANTES (expõe window.UDX_TRILHA):
 *      fundamentos.data.js | iniciante.data.js | intermediario.data.js
 *    - Reusa as classes .tt-* de /css/talentTree.css (aparência idêntica)
 *
 *  DIFERENÇA CENTRAL vs. talentTree.js:
 *    Não há alocação de pontos. O RANK de um nó é o número de desafios
 *    APROVADOS daquele nó. Logo não há carteira, páginas de plano,
 *    "Salvar", "Reverter" nem orçamento de pontos.
 *
 *  O saldo é AUTORIDADE DO SERVIDOR: o cliente só reflete /api/temporada/estado.
 * ================================================================ */
(function (win, doc) {
  'use strict';

  var DADOS = win.UDX_TRILHA || win.UDX_FUNDAMENTOS;
  if (!DADOS) { return; }

  var RT  = (DADOS && DADOS.runtime) || {};
  var API = RT.api || {
    me:      '/api/me',
    estado:  '/api/temporada/estado',
    desafio: '/api/temporada/desafio'
  };
  var CHAVE_LOCAL = RT.chaveLocal || 'udx:temporada:v1';

  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  function el(t, cls, html){ var n=doc.createElement(t); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; }
  function escapar(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  var PERFIL = DADOS.perfis[0];
  var IDX = DADOS.indice;
  var INSIGNIA = PERFIL.habilidades.filter(function (h) { return h.tipo === 'insignia'; })[0] || null;
  var INSIGNIA_ID = INSIGNIA ? INSIGNIA.id : (RT.insigniaId || null);

  /* ============================================================
     ESTADO — reflete o servidor; degrada para localStorage
  ============================================================ */
  var Estado = {
    dados: { xpe: 0, desafios: [], insignias: [] },

    lerLocal: function () {
      try { var r = win.localStorage.getItem(CHAVE_LOCAL); if (r) Estado.dados = JSON.parse(r); }
      catch (e) {}
    },
    gravarLocal: function () {
      try { win.localStorage.setItem(CHAVE_LOCAL, JSON.stringify(Estado.dados)); } catch (e) {}
    },
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
        .then(function (j) {
          if (j) { Estado.dados = Estado.normalizar(j); Estado.gravarLocal(); }
          else   { Estado.lerLocal(); }
        })
        .catch(function () { Estado.lerLocal(); });
    }
  };

  /* ============================================================
     REGRAS — funções PURAS (testáveis fora do DOM)
  ============================================================ */
  var Regras = {
    aprovado: function (desafioId) { return Estado.dados.desafios.indexOf(desafioId) !== -1; },

    /* rank = quantos desafios do nó estão aprovados (teto ranksMax) */
    rank: function (hab) {
      if (hab.tipo === 'insignia') { return Regras.insigniaOk(hab) ? 1 : 0; }
      var n = hab.desafios.reduce(function (a, d) { return a + (Regras.aprovado(d.id) ? 1 : 0); }, 0);
      return Math.min(n, hab.ranksMax);
    },

    prereqsOk: function (hab) {
      return hab.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
    },

    insigniaOk: function (hab) {
      return hab.requer.every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
    },

    estadoDoNo: function (hab) {
      if (hab.tipo === 'insignia') { return Regras.insigniaOk(hab) ? 'maxed' : 'locked'; }
      var r = Regras.rank(hab);
      if (r >= hab.ranksMax) { return 'maxed'; }
      if (r > 0)             { return 'ranked'; }
      return Regras.prereqsOk(hab) ? 'available' : 'locked';
    },

    /* pode enviar comprovação deste desafio? (nó liberado e ainda não aprovado) */
    podeEnviar: function (desafio) {
      var hab = IDX[desafio.habId];
      if (!hab) { return false; }
      if (Regras.aprovado(desafio.id)) { return false; }
      return Regras.prereqsOk(hab);
    },

    xpe: function () { return Estado.dados.xpe; },
    limiar: function () { return DADOS.temporada.limiarXPE; },
    progresso: function () { return Math.min(1, Regras.xpe() / Regras.limiar()); },
    elegivelPromocao: function () { return INSIGNIA ? Regras.insigniaOk(INSIGNIA) : false; },

    pendencias: function (hab) {
      var lista = [];
      hab.requer.forEach(function (id) {
        var p = IDX[id];
        if (p && Regras.rank(p) < p.ranksMax) { lista.push('Conclua ' + p.nome + ' para liberar.'); }
      });
      return lista;
    }
  };

  /* anexa habId em cada desafio (uma vez) para lookup reverso */
  PERFIL.habilidades.forEach(function (h) { h.desafios.forEach(function (d) { d.habId = h.id; }); });

  /* ============================================================
     UI — reusa .tt-* de talentTree.css
  ============================================================ */
  var UI = {
    refs: {},
    selecionado: null,

    montar: function () {
      UI.refs.board   = $('#tfBoard');
      UI.refs.panel   = $('#tfPanel');
      UI.refs.badges  = $('#tfBadges');
      UI.refs.progress= $('#tfProgress');
    },

    renderProgresso: function () {
      if (!UI.refs.progress) { return; }
      var xpe = Regras.xpe(), lim = Regras.limiar(), pct = Math.round(Regras.progresso() * 100);
      var falta = Math.max(0, lim - xpe);
      UI.refs.progress.innerHTML =
        '<div class="tt-wallet__item" style="--w-grad:var(--seg-grad)">' +
          '<span class="tt-wallet__icon"><span class="mdi ' + PERFIL.icone + '"></span></span>' +
          '<div class="tt-wallet__info">' +
            '<span class="tt-wallet__name">' + escapar(PERFIL.xpLabel) + '</span>' +
            '<span class="tt-wallet__value"><b>' + xpe + '</b> / ' + lim + ' XPE ' +
              '<span style="color:var(--udx-text-muted)">· ' +
              (Regras.elegivelPromocao() ? 'temporada concluída — elegível a Iniciante'
                                         : 'faltam ' + falta + ' XPE para Iniciante') + '</span></span>' +
            '<span class="tt-wallet__bar"><span class="tt-wallet__fill" style="width:' + pct + '%"></span></span>' +
          '</div>' +
        '</div>';
    },

    renderBoard: function () {
      var b = UI.refs.board; b.innerHTML = '';
      var tree = el('section', 'tt-tree');
      tree.setAttribute('data-perfil', PERFIL.id);
      tree.setAttribute('aria-label', 'Trilha — ' + PERFIL.nome);

      var maxed = PERFIL.habilidades.filter(function (h) {
        return h.tipo !== 'insignia' && Regras.rank(h) >= h.ranksMax;
      }).length;
      var totalNos = PERFIL.habilidades.filter(function (h) { return h.tipo !== 'insignia'; }).length;

      var head = el('div', 'tt-tree__head');
      head.innerHTML =
        '<span class="tt-tree__icon"><span class="mdi ' + PERFIL.icone + '"></span></span>' +
        '<div class="tt-tree__title"><span>' + escapar(PERFIL.segmento) + '</span>' +
          '<h3>' + escapar(PERFIL.nome) + '</h3></div>' +
        '<span class="tt-tree__count"><b>' + maxed + '</b> / ' + totalNos + '</span>';
      tree.appendChild(head);

      var canvas = el('div', 'tt-tree__canvas');
      PERFIL.tiers.forEach(function (t) {
        var habs = PERFIL.habilidades.filter(function (h) { return h.tier === t.n; });
        if (!habs.length) { return; }
        var faixa = el('div', 'tt-tier is-open');
        faixa.setAttribute('data-tier', t.n);
        faixa.innerHTML =
          '<div class="tt-tier__head">' +
            '<span class="tt-tier__n">' + t.n + '</span>' +
            '<span class="tt-tier__name">' + escapar(t.nome) + '</span>' +
            '<span class="tt-tier__req"><span class="mdi mdi-gesture-tap"></span>sem custo</span>' +
          '</div>';
        var row = el('div', 'tt-tier__row');
        habs.forEach(function (h) { row.appendChild(UI.renderNode(h)); });
        faixa.appendChild(row);
        canvas.appendChild(faixa);
      });
      tree.appendChild(canvas);
      b.appendChild(tree);
    },

    renderNode: function (hab) {
      var wrap = el('div');
      wrap.style.gridColumn = String(hab.col || 1);
      wrap.style.position = 'relative';
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';

      var est = Regras.estadoDoNo(hab);
      var rank = Regras.rank(hab);
      var btn = el('button', 'tt-node is-' + est + (hab.tipo === 'insignia' ? ' tt-node--titulo' : ''));
      btn.type = 'button';
      btn.setAttribute('data-hab', hab.id);
      btn.setAttribute('aria-label', hab.nome + ' — nível ' + rank + ' de ' + hab.ranksMax);
      btn.innerHTML = '<span class="mdi ' + hab.icone + '"></span>' +
        (hab.tipo !== 'insignia' ? '<span class="tt-node__rank">' + rank + '/' + hab.ranksMax + '</span>' : '');
      btn.addEventListener('click', function () { UI.selecionar(hab.id); });

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
                 '<div><h3>' + escapar(hab.nome) + '</h3><p>' + escapar(hab.resumo) + '</p></div></div>';

      var pend = Regras.pendencias(hab);
      if (pend.length) {
        html += '<div class="tt-panel__lock">' + pend.map(escapar).join(' ') + '</div>';
      }

      if (!hab.desafios.length) {
        html += '<div class="tt-panel__empty">' +
          (hab.tipo === 'insignia'
            ? (Regras.insigniaOk(hab) ? 'Insígnia conquistada.' : 'Conclua todos os nós para desbloquear.')
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
      var insig = INSIGNIA; if (!insig) { c.innerHTML=''; return; }
      var li = el('li', 'tt-title' + (Regras.insigniaOk(insig) ? ' is-earned' : ''));
      li.innerHTML = '<span class="mdi ' + insig.icone + '"></span>' +
                     '<div><b>' + escapar(insig.nome) + '</b><p>' + escapar(insig.resumo) + '</p></div>';
      c.appendChild(li);
    },

    renderTudo: function () {
      UI.renderProgresso(); UI.renderBoard(); UI.renderBadges();
      if (!UI.selecionado) { UI.selecionar(PERFIL.habilidades[0].id); } else { UI.renderPanel(); }
    },

    toast: function (msg) {
      var t = $('#tfToast'); if (!t) { return; }
      t.textContent = msg; t.classList.add('is-visible');
      win.setTimeout(function () { t.classList.remove('is-visible'); }, 3200);
    }
  };

  /* ============================================================
     AÇÕES — envio de comprovação
  ============================================================ */
  var Acoes = {
    enviar: function (desafioId) {
      var hab = null, desafio = null;
      PERFIL.habilidades.some(function (h) {
        return h.desafios.some(function (d) { if (d.id === desafioId) { hab = h; desafio = d; return true; } });
      });
      if (!hab || !desafio || Regras.aprovado(desafioId)) { return; }
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
            } else {
              UI.toast('Comprovação enviada — aguardando validação.');
            }
          } else {
            /* modo local (sem Worker) */
            Estado.dados.desafios.push(desafioId);
            Estado.dados.xpe += desafio.xp;
            UI.toast('Registrado localmente: +' + desafio.xp + ' XPE.');
          }
          Estado.gravarLocal();
          UI.renderTudo();
        })
        .catch(function () {
          Estado.dados.desafios.push(desafioId);
          Estado.dados.xpe += desafio.xp;
          Estado.gravarLocal();
          UI.renderTudo();
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
  }

  /* ============================================================
     PORTARIA + BOOT — Free entra; só bloqueia deslogado
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
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

  /* exposto para depuração e para o teste de consistência */
  win.UDX_TEMPORADA = { estado: Estado, regras: Regras, ui: UI, acoes: Acoes };

}(window, document));
