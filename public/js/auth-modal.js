/**
 * auth-modal.js — modal de Acessar / Solicitar acesso / Newsletter do blog Up Dance.
 * Versão MAGIC LINK, com a paleta e a tipografia oficiais do projeto.
 *
 * ESTE ARQUIVO RODA NO NAVEGADOR. Vai em public/js/auth-modal.js
 * Inclua em cada página, no fim do <body>:
 *   <script src="/js/auth-modal.js" defer></script>
 *
 * Liga-se sozinho aos botões existentes:
 *   #btnAcessar / #btnMobilAcess → abre na aba "Entrar"
 *   #btnCadastrar                → abre na aba "Solicitar acesso"
 * Também expõe window.openAuthModal('entrar' | 'acesso' | 'newsletter').
 */
(function () {
  'use strict';

  // garante as fontes do projeto (inócuo se a página já as carrega)
  if (!document.getElementById('udxa-fonts')) {
    var f = document.createElement('link');
    f.id = 'udxa-fonts';
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital@1&display=swap';
    document.head.appendChild(f);
  }

  // paleta oficial Up Dance (extraída do CSS do blog)
  var css = `
  .udxa-overlay{position:fixed;inset:0;background:rgba(2,1,24,.78);
    backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;
    z-index:9999;opacity:0;transition:opacity .25s ease;
    font-family:'Poppins',sans-serif}
  .udxa-overlay.is-open{display:flex;opacity:1}
  .udxa-card{width:min(92vw,420px);background:#0c0b22;color:#DFE0F2;
    border:1px solid #2a2748;border-radius:16px;overflow:hidden;
    box-shadow:0 24px 60px rgba(0,0,0,.6);transform:translateY(12px) scale(.98);
    transition:transform .25s ease}
  .udxa-overlay.is-open .udxa-card{transform:translateY(0) scale(1)}
  .udxa-head{display:flex;align-items:center;gap:.7rem;padding:1.1rem 1.25rem;
    border-bottom:1px solid #221f3e}
  .udxa-head img{width:36px;height:36px}
  .udxa-head h3{margin:0;font-size:1.25rem;font-weight:400;font-style:italic;
    font-family:'Playfair Display',serif;
    background:linear-gradient(to top,#fb8460 0%,#f13aa1 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .udxa-close{margin-left:auto;background:none;border:0;color:#8a86b0;
    font-size:1.5rem;line-height:1;cursor:pointer;padding:.2rem .4rem;border-radius:8px}
  .udxa-close:hover{color:#fff;background:#221f3e}
  .udxa-tabs{display:flex;border-bottom:1px solid #221f3e}
  .udxa-tab{flex:1;background:none;border:0;color:#8a86b0;padding:.85rem .4rem;
    font-size:.8rem;font-weight:600;font-family:'Poppins',sans-serif;cursor:pointer;
    border-bottom:2px solid transparent;transition:color .2s}
  .udxa-tab:hover{color:#DFE0F2}
  .udxa-tab.is-active{color:#fff;border-bottom-color:#eb2f5b}
  .udxa-panel{display:none;padding:1.4rem 1.25rem 1.6rem}
  .udxa-panel.is-active{display:block}
  .udxa-panel p{margin:0 0 1rem;color:#b9bad6;font-size:.9rem;line-height:1.55}
  .udxa-input{width:100%;padding:.8rem .9rem;border-radius:9px;border:1px solid #2f2c52;
    background:#020118;color:#fff;font-size:.95rem;margin-bottom:.8rem;
    font-family:'Poppins',sans-serif}
  .udxa-input::placeholder{color:#6f6c94}
  .udxa-input:focus{outline:none;border-color:#BF0449}
  .udxa-btn{width:100%;padding:.8rem;border-radius:9px;border:0;cursor:pointer;
    background:#BF0449;color:#fff;font-weight:600;font-size:.95rem;
    font-family:'Poppins',sans-serif;transition:background-image .25s ease,filter .2s ease}
  .udxa-btn:hover{background-image:linear-gradient(to right,#F434A1 0%,#ff8442 100%)}
  .udxa-btn:disabled{opacity:.6;cursor:default;background-image:none}
  .udxa-msg{margin-top:.9rem;font-size:.85rem;min-height:1.1em;line-height:1.4}
  .udxa-msg.ok{color:#5fe0a4}.udxa-msg.err{color:#ff7591}
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

  // botões existentes (desktop e mobile)
  bind('#btnAcessar',    function (e) { e.preventDefault(); show('entrar'); });
  bind('#btnMobilAcess', function (e) { e.preventDefault(); show('entrar'); });
  bind('#btnCadastrar',  function (e) { e.preventDefault(); show('acesso'); });
  function bind(sel, fn) {
    document.querySelectorAll(sel).forEach(function (el) { el.addEventListener('click', fn); });
  }

  // login por magic link → POST /api/auth/request
  postForm('udxaLoginEmail', 'udxaLoginBtn', 'udxaLoginMsg', '/api/auth/request',
           'Pronto! Verifique seu e-mail e clique no link de acesso.');
  // solicitar acesso e newsletter → POST /api/newsletter
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

  var p = new URLSearchParams(location.search);
  var avisos = {
    required: 'Faça login para acessar a área de membros.',
    expirado: 'Seu link expirou. Peça um novo abaixo.',
    invalido: 'Link inválido. Peça um novo abaixo.',
    negado:   'Este e-mail não tem acesso liberado.',
  };
  if (avisos[p.get('login')]) {
    show('entrar');
    var m = document.getElementById('udxaLoginMsg');
    m.className = 'udxa-msg err';
    m.textContent = avisos[p.get('login')];
  }
})();
