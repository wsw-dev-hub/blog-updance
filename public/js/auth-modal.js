/**
 * auth-modal.js — modal de Acessar / Solicitar acesso / Newsletter do blog Up Dance.
 * Versão MAGIC LINK (login por link enviado ao e-mail).
 *
 * Inclua em cada página, no fim do <body>:
 *   <script src="/js/auth-modal.js" defer></script>
 *
 * Liga-se sozinho aos botões existentes:
 *   #btnAcessar    → abre na aba "Entrar"
 *   #btnCadastrar  → abre na aba "Solicitar acesso"
 * Também expõe window.openAuthModal('entrar' | 'acesso' | 'newsletter').
 */
(function () {
  'use strict';

  var css = `
  .udxa-overlay{position:fixed;inset:0;background:rgba(8,8,12,.72);
    backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;
    z-index:9999;opacity:0;transition:opacity .25s ease}
  .udxa-overlay.is-open{display:flex;opacity:1}
  .udxa-card{width:min(92vw,420px);background:#15151c;color:#f4f4f6;
    border:1px solid #2a2a35;border-radius:16px;overflow:hidden;
    box-shadow:0 24px 60px rgba(0,0,0,.55);transform:translateY(12px) scale(.98);
    transition:transform .25s ease}
  .udxa-overlay.is-open .udxa-card{transform:translateY(0) scale(1)}
  .udxa-head{display:flex;align-items:center;gap:.6rem;padding:1.1rem 1.25rem;
    border-bottom:1px solid #23232e}
  .udxa-head img{width:34px;height:34px}
  .udxa-head h3{margin:0;font-size:1.05rem;font-weight:600;letter-spacing:.2px}
  .udxa-close{margin-left:auto;background:none;border:0;color:#9a9aa8;
    font-size:1.5rem;line-height:1;cursor:pointer;padding:.2rem .4rem;border-radius:8px}
  .udxa-close:hover{color:#fff;background:#23232e}
  .udxa-tabs{display:flex;border-bottom:1px solid #23232e}
  .udxa-tab{flex:1;background:none;border:0;color:#9a9aa8;padding:.85rem .5rem;
    font-size:.82rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent}
  .udxa-tab.is-active{color:#fff;border-bottom-color:#e23b6d}
  .udxa-panel{display:none;padding:1.4rem 1.25rem 1.6rem}
  .udxa-panel.is-active{display:block}
  .udxa-panel p{margin:0 0 1rem;color:#c2c2cc;font-size:.9rem;line-height:1.5}
  .udxa-input{width:100%;padding:.8rem .9rem;border-radius:10px;border:1px solid #2f2f3b;
    background:#0f0f15;color:#f4f4f6;font-size:.95rem;margin-bottom:.8rem}
  .udxa-input:focus{outline:none;border-color:#e23b6d}
  .udxa-btn{width:100%;padding:.8rem;border-radius:10px;border:0;cursor:pointer;
    background:#e23b6d;color:#fff;font-weight:600;font-size:.95rem;transition:filter .2s ease}
  .udxa-btn:hover{filter:brightness(1.07)}
  .udxa-btn:disabled{opacity:.6;cursor:default}
  .udxa-msg{margin-top:.9rem;font-size:.85rem;min-height:1.1em}
  .udxa-msg.ok{color:#46d18a}.udxa-msg.err{color:#ff6b81}
  @media (prefers-reduced-motion:reduce){.udxa-overlay,.udxa-card{transition:none}}
  `;

  var html = `
  <div class="udxa-overlay" id="udxaOverlay" role="dialog" aria-modal="true" aria-labelledby="udxaTitle">
    <div class="udxa-card">
      <div class="udxa-head">
        <img src="/images/icons/udx-icon.png" alt="">
        <h3 id="udxaTitle">Up Dance</h3>
        <button class="udxa-close" id="udxaClose" aria-label="Fechar">&times;</button>
      </div>
      <div class="udxa-tabs">
        <button class="udxa-tab" data-tab="entrar">Entrar</button>
        <button class="udxa-tab" data-tab="acesso">Solicitar acesso</button>
        <button class="udxa-tab" data-tab="newsletter">Newsletter</button>
      </div>

      <div class="udxa-panel" data-panel="entrar">
        <p>Informe seu e-mail de membro. Enviaremos um link de acesso válido por 15 minutos.</p>
        <input class="udxa-input" type="email" id="udxaLoginEmail" placeholder="seu@email.com" autocomplete="email">
        <button class="udxa-btn" id="udxaLoginBtn">Receber link de acesso</button>
        <div class="udxa-msg" id="udxaLoginMsg" role="status"></div>
      </div>

      <div class="udxa-panel" data-panel="acesso">
        <p>A área de membros é exclusiva para alunos e clientes. Deixe seu e-mail
           que avisamos assim que seu acesso for liberado.</p>
        <input class="udxa-input" type="email" id="udxaAcessoEmail" placeholder="seu@email.com" autocomplete="email">
        <button class="udxa-btn" id="udxaAcessoBtn">Solicitar acesso</button>
        <div class="udxa-msg" id="udxaAcessoMsg" role="status"></div>
      </div>

      <div class="udxa-panel" data-panel="newsletter">
        <p>Receba nossas matérias exclusivas toda semana.</p>
        <input class="udxa-input" type="email" id="udxaNewsEmail" placeholder="seu@email.com" autocomplete="email">
        <button class="udxa-btn" id="udxaNewsBtn">Quero receber</button>
        <div class="udxa-msg" id="udxaNewsMsg" role="status"></div>
      </div>
    </div>
  </div>`;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', html);

  var overlay = document.getElementById('udxaOverlay');

  function show(tab) { setTab(tab || 'entrar'); overlay.classList.add('is-open'); }
  function hide() { overlay.classList.remove('is-open'); }
  function setTab(name) {
    overlay.querySelectorAll('.udxa-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.dataset.tab === name);
    });
    overlay.querySelectorAll('.udxa-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.panel === name);
    });
  }
  window.openAuthModal = show;

  overlay.querySelectorAll('.udxa-tab').forEach(function (t) {
    t.addEventListener('click', function () { setTab(t.dataset.tab); });
  });
  document.getElementById('udxaClose').addEventListener('click', hide);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) hide(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) hide();
  });

  bind('#btnAcessar',   function (e) { e.preventDefault(); show('entrar'); });
  bind('#btnMobilAcess',  function (e) { e.preventDefault(); show('entrar'); });
  bind('#btnCadastrar', function (e) { e.preventDefault(); show('acesso'); });
  function bind(sel, fn) {
    document.querySelectorAll(sel).forEach(function (el) { el.addEventListener('click', fn); });
  }

  // login por magic link → POST /api/auth/request
  postForm('udxaLoginEmail', 'udxaLoginBtn', 'udxaLoginMsg', '/api/auth/request',
           'Pronto! Verifique seu e-mail e clique no link de acesso.');

  // ambos abaixo gravam via /api/newsletter
  postForm('udxaAcessoEmail', 'udxaAcessoBtn', 'udxaAcessoMsg', '/api/newsletter',
           'Pedido registrado. Avisaremos quando seu acesso for liberado.');
  postForm('udxaNewsEmail', 'udxaNewsBtn', 'udxaNewsMsg', '/api/newsletter',
           'Inscrição feita! Você receberá nossas novidades.');

  function postForm(inputId, btnId, msgId, endpoint, sucesso) {
    var input = document.getElementById(inputId);
    var btn   = document.getElementById(btnId);
    var msg   = document.getElementById(msgId);
    if (!input || !btn) return;

    btn.addEventListener('click', function () {
      var email = (input.value || '').trim();
      msg.className = 'udxa-msg';
      msg.textContent = '';
      btn.disabled = true;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) { msg.className = 'udxa-msg ok'; msg.textContent = sucesso; input.value = ''; }
          else      { msg.className = 'udxa-msg err'; msg.textContent = d.erro || 'Algo deu errado.'; }
        })
        .catch(function () { msg.className = 'udxa-msg err'; msg.textContent = 'Falha de conexão.'; })
        .finally(function () { btn.disabled = false; });
    });
  }

  // mensagens de retorno do Worker via querystring
  var p = new URLSearchParams(location.search);
  var avisos = {
    required: 'Faça login para acessar a área de membros.',
    expirado: 'Seu link expirou. Peça um novo abaixo.',
    invalido: 'Link inválido. Peça um novo abaixo.',
  };
  if (avisos[p.get('login')]) {
    show('entrar');
    var m = document.getElementById('udxaLoginMsg');
    m.className = 'udxa-msg err';
    m.textContent = avisos[p.get('login')];
  }
})();
