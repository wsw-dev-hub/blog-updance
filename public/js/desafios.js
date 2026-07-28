/**
 * ================================================================
 *  UP DANCE EXPERIENCE — CENTRAL DE DESAFIOS  (v2 — foco no nó)
 *  /js/desafios.js
 * ----------------------------------------------------------------
 *  A página NÃO renderiza mais árvores. Ela recebe, por URL, a
 *  árvore de origem e o nó clicado, e mostra SOMENTE o grupo de
 *  desafios/atividades/eventos daquele nó — com a MESMA paleta da
 *  árvore de origem.
 *
 *  Contrato de URL (gerado pelo botão "Ir para os desafios" dos
 *  tooltips de trilha.js / talentTree.js):
 *      /membros/desafios/?arvore=<chave>&hab=<idDoNo>
 *
 *  <chave> ∈ { fundamentos | iniciante | intermediario | talentos }
 *  (técnico e árvore-de-títulos entram aqui quando seus arquivos
 *   forem enviados — basta acrescentar uma linha em ROTAS).
 *
 *  A cor casa porque o motor aplica no <body> a MESMA page-class da
 *  origem (os tokens --seg-* vêm de fundamentos.css / niveis.css /
 *  talentTree.css, todos linkados na página).
 *
 *  Somente leitura: nada é gravado. O estado do membro vem do Worker
 *  e degrada para localStorage.
 * ================================================================ */
(function (win, doc) {
  'use strict';

  /* origem → { page-class (paleta) , data module a injetar } */
  var ROTAS = {
    fundamentos:   { classe: 'page-temporada',     data: '/js/fundamentos.data.js',  rotulo: 'Temporada Free' },
    iniciante:     { classe: 'page-iniciante',     data: '/js/iniciante.data.js',    rotulo: 'Nível Iniciante' },
    intermediario: { classe: 'page-intermediario', data: '/js/intermediario.data.js',rotulo: 'Nível Intermediário' },
    talentos:      { classe: 'page-talentos',      data: '/js/talentTree.data.js',   rotulo: 'Árvore de Talentos' }
    /* tecnico:   { classe: 'page-tecnico',   data: '/js/tecnico.data.js',   rotulo: 'Nível Técnico' },      // aguardando arquivos
       titulos:   { classe: 'page-reputacao', data: '/js/titulos.data.js',   rotulo: 'Árvore de Títulos' },  // aguardando arquivos */
  };

  var $ = function (s, c) { return (c || doc).querySelector(s); };
  function el(t, cls, html) { var n = doc.createElement(t); if (cls) { n.className = cls; } if (html != null) { n.innerHTML = html; } return n; }
  function escapar(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- leitura da URL ---- */
  var qs = null; try { qs = new win.URLSearchParams(win.location.search); } catch (e) { qs = null; }
  var ARV = qs && qs.get('arvore');
  var HAB = qs && qs.get('hab');
  if (!HAB) { var h = (win.location.hash || '').replace(/^#/, ''); if (h && h !== 'desafios') { HAB = h; } }
  var CFG = ARV && ROTAS[ARV];

  function falhar(msg) {
    var app = $('#dxApp'); if (app) { app.hidden = false; }
    var alvo = $('#dxNode');
    if (alvo) { alvo.innerHTML = '<div class="tt-panel__empty">' + escapar(msg) + '</div>'; }
    var tally = $('#dxTally'); if (tally) { tally.innerHTML = ''; }
  }

  /* ============================================================
     BOOT — aplica paleta, injeta o data module e inicia
  ============================================================ */
  function boot() {
    /* botão sair (mesmo padrão das outras páginas) */
    var sair = $('#sair');
    if (sair) {
      sair.addEventListener('click', function () {
        fetch('/api/member/logout', { method: 'POST', credentials: 'same-origin' })
          .catch(function () {}).finally(function () { win.location.href = '/'; });
      });
    }

    if (!CFG) {
      falhar('Origem não reconhecida. Abra um nó a partir de uma das árvores para ver seus desafios.');
      return;
    }
    if (!HAB) {
      falhar('Nenhum nó informado. Volte à árvore e clique em "Ir para os desafios".');
      return;
    }

    /* paleta: aplica a MESMA page-class da árvore de origem */
    doc.body.classList.add(CFG.classe);

    /* rótulo da origem no topo/hero */
    var badge = $('#dxTreeName'); if (badge) { badge.textContent = CFG.rotulo; }
    var kick  = $('#dxKicker');   if (kick)  { kick.textContent  = CFG.rotulo; }

    /* injeta o data module e então inicia o motor */
    var s = doc.createElement('script');
    s.src = CFG.data;
    s.onload = init;
    s.onerror = function () { falhar('Não foi possível carregar os dados desta árvore.'); };
    doc.head.appendChild(s);
  }

  /* ============================================================
     INIT — tudo o que depende do data module injetado
  ============================================================ */
  function init() {
    var DADOS = win.UDX_TALENTOS || win.UDX_TRILHA;
    if (!DADOS) { falhar('Dados da árvore indisponíveis.'); return; }

    var IS_TAL = !!win.UDX_TALENTOS;
    var RT  = DADOS.runtime || {};
    var IDX = DADOS.indice || {};
    var TIPOS = DADOS.tiposDesafio || {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    };
    var ORDEM_TIPO = ['tarefa', 'atividade', 'evento'];
    var XP_POR_PONTO = DADOS.xpPorPonto || 100;
    var API = {
      me: '/api/me',
      estado: IS_TAL ? '/api/talentos/estado' : ((RT.api && RT.api.estado) || '/api/trilha/estado')
    };
    var CHAVE_LOCAL = IS_TAL ? 'udx:talentos:v1' : (RT.chaveLocal || 'udx:temporada:v1');

    function ehConquista(h) { return !!h && (h.tipo === 'titulo' || h.tipo === 'insignia'); }
    function perfilPorId(id) { var P = DADOS.perfis || []; for (var i = 0; i < P.length; i++) { if (P[i].id === id) { return P[i]; } } return null; }
    function tierDe(perfil, n) { var ts = (perfil && perfil.tiers) || []; for (var i = 0; i < ts.length; i++) { if (ts[i].n === n) { return ts[i]; } } return { n: n, requisito: 0 }; }

    /* ---- ESTADO (servidor → localStorage) ---- */
    var Estado = {
      aprovados: [], xpPerfil: {}, alocacao: {}, online: false,
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
            if (IS_TAL) { Estado.aplicarPlano(j); }
          })
          .catch(function () { Estado.online = false; Estado.lerLocal(); });
      }
    };

    /* ---- REGRAS (ramo por árvore — idênticas às já validadas) ---- */
    var Regras = {
      aprovado: function (id) { return Estado.aprovados.indexOf(id) !== -1; },
      rank: function (hh) {
        if (ehConquista(hh)) { return Regras.conquistaOk(hh) ? 1 : 0; }
        if (IS_TAL) { return Estado.alocacao[hh.id] || 0; }
        var n = hh.desafios.reduce(function (a, d) { return a + (Regras.aprovado(d.id) ? 1 : 0); }, 0);
        return Math.min(n, hh.ranksMax);
      },
      pontosGastos: function (pid) {
        var t = 0;
        Object.keys(Estado.alocacao).forEach(function (id) {
          var x = IDX[id]; if (x && x.perfilId === pid && x.tipo !== 'titulo') { t += Estado.alocacao[id]; }
        });
        return t;
      },
      tierLiberado: function (perfil, n) { return Regras.pontosGastos(perfil.id) >= tierDe(perfil, n).requisito; },
      prereqsOk: function (hh) {
        if (IS_TAL) { return (hh.requer || []).every(function (id) { var p = IDX[id]; return p && (Estado.alocacao[id] || 0) >= p.ranksMax; }); }
        return (hh.requer || []).every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; });
      },
      conquistaOk: function (hh) {
        if (IS_TAL) { var perfil = perfilPorId(hh.perfilId); return Regras.tierLiberado(perfil, hh.tier) && Regras.prereqsOk(hh); }
        return (hh.requer || []).length ? (hh.requer).every(function (id) { var p = IDX[id]; return p && Regras.rank(p) >= p.ranksMax; }) : false;
      },
      estadoDoNo: function (hh) {
        if (ehConquista(hh)) { return Regras.conquistaOk(hh) ? 'maxed' : 'locked'; }
        var r = Regras.rank(hh);
        if (r >= hh.ranksMax) { return 'maxed'; }
        if (r > 0) { return 'ranked'; }
        if (IS_TAL) { var perfil = perfilPorId(hh.perfilId); return (Regras.tierLiberado(perfil, hh.tier) && Regras.prereqsOk(hh)) ? 'available' : 'locked'; }
        return Regras.prereqsOk(hh) ? 'available' : 'locked';
      },
      pendencias: function (hh) {
        var lista = [];
        if (IS_TAL) {
          var perfil = perfilPorId(hh.perfilId); var g = Regras.pontosGastos(perfil.id); var req = tierDe(perfil, hh.tier).requisito;
          if (g < req) { lista.push('Invista ' + (req - g) + ' ponto(s) em ' + perfil.nome + ' para abrir esta faixa.'); }
          (hh.requer || []).forEach(function (id) { var p = IDX[id]; if (p && (Estado.alocacao[id] || 0) < p.ranksMax) { lista.push('Requer ' + p.nome + ' no nível ' + p.ranksMax + '.'); } });
          return lista;
        }
        (hh.requer || []).forEach(function (id) { var p = IDX[id]; if (p && Regras.rank(p) < p.ranksMax) { lista.push('Conclua ' + p.nome + ' para desbloquear.'); } });
        return lista;
      },
      contabilizar: function (hh) {
        var t = { total: 0, feitos: 0, pendentes: 0, xpTotal: 0, xpFeito: 0,
                  tipos: { tarefa: { t: 0, f: 0 }, atividade: { t: 0, f: 0 }, evento: { t: 0, f: 0 } } };
        (hh.desafios || []).forEach(function (d) {
          var feito = Regras.aprovado(d.id);
          t.total++; t.xpTotal += (d.xp || 0);
          if (feito) { t.feitos++; t.xpFeito += (d.xp || 0); }
          var tp = t.tipos[d.tipo]; if (tp) { tp.t++; if (feito) { tp.f++; } }
        });
        t.pendentes = t.total - t.feitos;
        t.pct = t.total ? Math.round((t.feitos / t.total) * 100) : 0;
        return t;
      }
    };

    /* ---------- render: contadores do nó ---------- */
    function metric(icone, label, valor, resto, pct, sub) {
      return '' +
        '<div class="dx-metric">' +
          '<span class="dx-metric__label"><span class="mdi ' + icone + '"></span>' + escapar(label) + '</span>' +
          '<div class="dx-metric__value"><b>' + valor + '</b> <small>' + escapar(resto) + '</small></div>' +
          '<div class="dx-metric__bar"><span class="dx-metric__fill" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>' +
          '<div class="dx-metric__sub">' + escapar(sub) + '</div>' +
        '</div>';
    }

    function renderTally(hab) {
      var c = $('#dxTally'); if (!c) { return; }
      if (ehConquista(hab) || !hab.desafios.length) { c.innerHTML = ''; return; }
      var t = Regras.contabilizar(hab);
      c.innerHTML =
        metric('mdi-flag-checkered', 'Desafios concluídos', t.feitos, '/ ' + t.total, t.pct,
               t.pendentes + ' pendente(s) · ' + t.pct + '% concluído') +
        metric('mdi-lightning-bolt', 'Experiência confirmada', t.xpFeito, '/ ' + t.xpTotal + ' XP',
               t.xpTotal ? Math.round(t.xpFeito / t.xpTotal * 100) : 0, 'XP validado neste nó');

      var row = el('div', 'dx-typerow');
      ORDEM_TIPO.forEach(function (k) {
        var tp = t.tipos[k]; if (!tp.t) { return; }
        var m = TIPOS[k] || {};
        row.appendChild(el('span', 'tt-chip',
          '<span class="mdi ' + (m.icone || 'mdi-circle-small') + '"></span>' +
          escapar(m.label || k) + ': <b style="margin-left:4px">' + tp.f + '/' + tp.t + '</b>'));
      });
      c.appendChild(row);
    }

    /* ---------- render: cabeçalho + lista de desafios ---------- */
    function renderNode(hab) {
      var p = $('#dxNode'); if (!p) { return; }
      var perfil = perfilPorId(hab.perfilId);
      var est = Regras.estadoDoNo(hab);
      var conquista = ehConquista(hab);
      var rot = { available: 'Disponível', ranked: 'Em desenvolvimento',
                  maxed: conquista ? 'Conquistado' : 'Dominado', locked: 'Bloqueado' }[est];
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
            rot + '</span>' +
        '</div>';

      if (hab.resumo) { html += '<p class="tt-tip__resumo" style="margin:0 0 12px">' + escapar(hab.resumo) + '</p>'; }

      var pend = Regras.pendencias(hab);
      if (pend.length) {
        html += '<div class="dx-node-tally"><span class="dx-state-pill dx-state-pill--locked">' +
                '<span class="mdi mdi-lock-outline"></span>' + escapar(pend[0]) + '</span></div>';
      }

      if (!hab.desafios.length) {
        html += '<div class="tt-panel__empty">' +
          (conquista
            ? (Regras.conquistaOk(hab) ? 'Conquista concluída.' : 'Conclua os nós exigidos para desbloquear.')
            : 'Nenhum desafio cadastrado para este nó.') + '</div>';
        p.innerHTML = html; return;
      }

      html += '<ul class="tt-challenges">';
      hab.desafios.forEach(function (d) {
        var feito = Regras.aprovado(d.id);
        var meta = TIPOS[d.tipo] || TIPOS.tarefa || {};
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
    }

    /* ---------- fluxo ---------- */
    var hab = IDX[HAB];
    if (!hab) { falhar('Nó não encontrado nesta árvore. Volte e selecione um nó válido.'); return; }

    /* título do nó no hero */
    var alvoNome = $('#dxNodeName'); if (alvoNome) { alvoNome.textContent = hab.nome; }

    fetch(API.me, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u || !u.email) { win.location.href = '/entrar/'; return null; }
        var email = $('#userEmail'); if (email) { email.textContent = u.email; }
        var chip = $('#userChip'); if (chip) { chip.hidden = false; }
        return Estado.carregar();
      })
      .catch(function () { return Estado.carregar(); })
      .then(function () {
        var app = $('#dxApp'); if (app) { app.hidden = false; }
        renderTally(hab);
        renderNode(hab);
      });

    win.UDX_DESAFIOS = { estado: Estado, regras: Regras, no: hab, arvore: ARV };
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

}(window, document));
