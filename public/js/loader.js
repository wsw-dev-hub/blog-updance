/**
 * loader.js — tela de carregamento do blog Up Dance.
 *
 * IMPORTANTE: este script deve rodar CEDO, logo no início do <body>,
 * SEM 'defer', para cobrir a página desde o primeiro instante:
 *
 *   <body>
 *     <script src="/js/loader.js"></script>
 *     ... resto da página ...
 *
 * A tela some sozinha quando a página termina de carregar (window load),
 * com um tempo mínimo de exibição para não "piscar" e um limite de
 * segurança caso o load demore demais.
 */
(function () {
  'use strict';

  var MIN_MS = 500;    // tempo mínimo visível (evita flicker)
  var MAX_MS = 8000;   // trava de segurança: esconde mesmo se 'load' não disparar
  var inicio = Date.now();

  // fontes do projeto (inócuo se a página já as carrega)
  if (!document.getElementById('udxl-fonts')) {
    var f = document.createElement('link');
    f.id = 'udxl-fonts';
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:ital@1&display=swap';
    document.head.appendChild(f);
  }

  var css = `
  #udxl-overlay{position:fixed;inset:0;z-index:99999;display:flex;
    flex-direction:column;align-items:center;justify-content:center;gap:1.4rem;
    background:#020118;font-family:'Poppins',sans-serif;
    transition:opacity .5s ease,visibility .5s ease}
  #udxl-overlay.is-hidden{opacity:0;visibility:hidden}
  .udxl-stage{position:relative;width:96px;height:96px;display:flex;
    align-items:center;justify-content:center}
  .udxl-ring{position:absolute;inset:0;border-radius:50%;
    border:3px solid rgba(191,4,73,.18);
    border-top-color:#BF0449;border-right-color:#eb2f5b;
    animation:udxl-spin 1s linear infinite}
  .udxl-logo{width:54px;height:54px;border-radius:50%;
    animation:udxl-pulse 1.6s ease-in-out infinite}
  .udxl-name{font-family:'Playfair Display',serif;font-style:italic;
    font-size:1.5rem;line-height:1;
    background:linear-gradient(to top,#fb8460 0%,#f13aa1 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .udxl-sub{color:#8a86b0;font-size:.78rem;letter-spacing:.18em;
    text-transform:uppercase;margin-top:-.4rem}
  @keyframes udxl-spin{to{transform:rotate(360deg)}}
  @keyframes udxl-pulse{0%,100%{transform:scale(1);opacity:1}
    50%{transform:scale(1.08);opacity:.78}}
  @media (prefers-reduced-motion:reduce){
    .udxl-ring,.udxl-logo{animation:none}
    #udxl-overlay{transition:opacity .2s ease}}
  `;

  var style = document.createElement('style');
  style.id = 'udxl-style';
  style.textContent = css;
  document.head.appendChild(style);

  // injeta a tela imediatamente (o script roda antes do resto do body)
  var ov = document.createElement('div');
  ov.id = 'udxl-overlay';
  ov.setAttribute('role', 'status');
  ov.setAttribute('aria-label', 'Carregando');
  ov.innerHTML =
    '<div class="udxl-stage">' +
      '<div class="udxl-ring"></div>' +
      '<img class="udxl-logo" src="/images/icons/udx-icon.png" alt="">' +
    '</div>' +
    '<div class="udxl-name">Up Dance</div>' +
    '<div class="udxl-sub">carregando</div>';

  (document.body || document.documentElement).appendChild(ov);

  function esconder() {
    var restante = Math.max(0, MIN_MS - (Date.now() - inicio));
    setTimeout(function () {
      ov.classList.add('is-hidden');
      // remove do DOM depois da transição
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
    }, restante);
  }

  if (document.readyState === 'complete') {
    esconder();
  } else {
    window.addEventListener('load', esconder);
    setTimeout(esconder, MAX_MS); // trava de segurança
  }
})();
