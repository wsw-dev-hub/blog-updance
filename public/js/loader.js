/**
 * loader.js — tela de carregamento do blog Up Dance, com barra de progresso real.
 *
 * IMPORTANTE: rode CEDO, no início do <body>, SEM 'defer':
 *   <body>
 *     <script src="/js/loader.js"></script>
 *     ... resto da página ...
 *
 * A barra reflete o carregamento das IMAGENS da página (os itens mais pesados):
 * avança a cada imagem concluída e chega a 100% quando a página inteira termina
 * (window load). A web não expõe o "total de bytes" da página de antemão, então
 * as imagens são o sinal real e mensurável de progresso aqui.
 */
(function () {
  'use strict';

  var MIN_MS = 500;    // tempo mínimo visível (evita flicker)
  var MAX_MS = 12000;  // trava de segurança: conclui mesmo se 'load' não disparar
  var inicio = Date.now();

  if (!document.getElementById('udxl-fonts')) {
    var lk = document.createElement('link');
    lk.id = 'udxl-fonts';
    lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:ital@1&display=swap';
    document.head.appendChild(lk);
  }

  var css = `
  #udxl-overlay{position:fixed;inset:0;z-index:99999;display:flex;
    flex-direction:column;align-items:center;justify-content:center;gap:1.1rem;
    background:#020118;font-family:'Poppins',sans-serif;
    transition:opacity .5s ease,visibility .5s ease}
  #udxl-overlay.is-hidden{opacity:0;visibility:hidden}
  .udxl-logo{width:64px;height:64px;border-radius:25%;
    animation:udxl-pulse 1.6s ease-in-out infinite}
  .udxl-name{font-family:'Playfair Display',serif;font-style:italic;
    font-size:1.6rem;line-height:1;
    background:linear-gradient(to top,#fb8460 0%,#f13aa1 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .udxl-track{position:relative;width:240px;max-width:70vw;height:6px;
    background:rgba(191,4,73,.16);border-radius:99px;overflow:hidden}
  .udxl-fill{position:absolute;left:0;top:0;height:100%;width:0%;border-radius:99px;
    background:linear-gradient(to right,#F434A1 0%,#ff8442 100%)}
  .udxl-pct{color:#8a86b0;font-size:.78rem;letter-spacing:.14em;
    font-variant-numeric:tabular-nums}
  @keyframes udxl-pulse{0%,100%{transform:scale(1);opacity:1}
    50%{transform:scale(1.07);opacity:.8}}
  @media (prefers-reduced-motion:reduce){.udxl-logo{animation:none}
    #udxl-overlay{transition:opacity .2s ease}}
  `;

  var style = document.createElement('style');
  style.id = 'udxl-style';
  style.textContent = css;
  document.head.appendChild(style);

  var ov = document.createElement('div');
  ov.id = 'udxl-overlay';
  ov.setAttribute('role', 'progressbar');
  ov.setAttribute('aria-label', 'Carregando a página');
  ov.setAttribute('aria-valuemin', '0');
  ov.setAttribute('aria-valuemax', '100');
  ov.setAttribute('aria-valuenow', '0');
  ov.innerHTML =
    '<img class="udxl-logo" src="/images/icons/udx-icon.png" alt="">' +
    '<div class="udxl-name">Up Dance</div>' +
    '<div class="udxl-track"><div class="udxl-fill" id="udxl-fill"></div></div>' +
    '<div class="udxl-pct" id="udxl-pct">0%</div>';

  (document.body || document.documentElement).appendChild(ov);

  var fill = ov.querySelector('#udxl-fill');
  var pct  = ov.querySelector('#udxl-pct');

  var alvo = 0.04;     // fração-alvo real (começa com um leve avanço)
  var atual = 0.04;    // fração exibida (persegue o alvo suavemente)
  var concluido = false;

  // anima a barra suavemente em direção ao alvo
  function loop() {
    atual += (alvo - atual) * 0.12;
    if (alvo - atual < 0.001) atual = alvo;
    var p = Math.round(atual * 100);
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    ov.setAttribute('aria-valuenow', String(p));
    if (!concluido || atual < 0.999) requestAnimationFrame(loop);
    else finalizar();
  }
  requestAnimationFrame(loop);

  // calcula o alvo a partir das imagens já carregadas
  function recalc(total, prontas) {
    if (total === 0) { alvo = Math.max(alvo, 0.85); return; }
    // 4% de base + até 92% conforme as imagens concluem (4% final fica para o load)
    alvo = 0.04 + (prontas / total) * 0.92;
  }

  function rastrearImagens() {
    var imgs = Array.prototype.slice.call(document.images);
    var total = imgs.length;
    var prontas = 0;

    if (total === 0) { recalc(0, 0); return; }

    imgs.forEach(function (img) {
      if (img.complete) {
        prontas++;
      } else {
        var feito = function () { prontas++; recalc(total, prontas); };
        img.addEventListener('load', feito, { once: true });
        img.addEventListener('error', feito, { once: true });
      }
    });
    recalc(total, prontas);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rastrearImagens);
  } else {
    rastrearImagens();
  }

  // quando TUDO termina, completa a barra e esconde
  function terminar() { alvo = 1; concluido = true; }

  function finalizar() {
    var restante = Math.max(0, MIN_MS - (Date.now() - inicio));
    setTimeout(function () {
      ov.classList.add('is-hidden');
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
    }, restante);
  }

  if (document.readyState === 'complete') {
    terminar();
  } else {
    window.addEventListener('load', terminar);
    setTimeout(terminar, MAX_MS); // trava de segurança
  }
})();
