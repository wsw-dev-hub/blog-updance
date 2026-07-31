/**
 * UP DANCE EXPERIENCE — REPUTAÇÃO & DESEMPENHO (metadados de exibição)
 * /js/reputacao.data.js  ·  Fase 2
 * ----------------------------------------------------------------
 * Espelha o catálogo do backend (worker_reputacao.js). Autoridade
 * de concessão/revogação é do servidor; este módulo é só exibição.
 *
 * NOVIDADES DA FASE 2:
 *  • titulosPorEstilo: 5 estilos × 7 marcos escalonados (35 títulos).
 *  • titulosTransversais: 4 novos com gate intermediário (Interprete,
 *    Arquiteto, Escultor, Guardião — Guardião com escopoPorEstilo).
 *  • Helpers: proximoMarcoEstilo(pd, n), marcoAtualEstilo(pd, n),
 *    metaEstilo(estilo), nomeMarco(estilo, marco).
 *
 * PALETA POR ESTILO — combinações da paleta oficial UDX:
 *  • HHD    → Fogo/Choque   (#F27405 → #FA33A1)
 *  • Popping → Marinho/Azul (#110273 → #430ABF)
 *  • Locking → Amarelo/Roxo (#F2B807 → #8C0783)
 *  • Breaking→ Cinza/Marrom (#5C4A3F → #A08672)
 *  • House   → Azul/Rosa    (#030BA6 → #FA33A1)
 */
(function (global) {
  'use strict';

  var REP = {
    notaMin: 0,
    notaMax: 100,
    desempenhoJanela: 10,
    escopoTitulos: 'perfil',

    // Legado congelado (mantido para renderizar histórico apenas)
    titulosReputacao: [
      { id: 'rep-1', nome: 'Reconhecido(a)', min: 500,  icone: 'mdi-shield-star-outline', cor: '#430ABF', legado: true },
      { id: 'rep-2', nome: 'Referência',     min: 1500, icone: 'mdi-shield-star',         cor: '#8C0783', legado: true },
      { id: 'rep-3', nome: 'Autoridade',     min: 4000, icone: 'mdi-crown-outline',       cor: '#BF0449', legado: true },
      { id: 'rep-4', nome: 'Lenda',          min: 8000, icone: 'mdi-crown',               cor: '#FA33A1', legado: true },
    ],
    titulosDesempenho: [
      { id: 'des-1', nome: 'Consistente', min: 60, icone: 'mdi-medal-outline',          cor: '#110273', legado: true },
      { id: 'des-2', nome: 'Destaque',    min: 75, icone: 'mdi-medal',                  cor: '#430ABF', legado: true },
      { id: 'des-3', nome: 'Excelência',  min: 88, icone: 'mdi-trophy-variant-outline', cor: '#8C0783', legado: true },
      { id: 'des-4', nome: 'Elite',       min: 95, icone: 'mdi-trophy',                 cor: '#FA33A1', legado: true },
    ],

    // Escala escalonada, espelha o worker.
    escalaEstilo: [
      { marco: 1, minPD: 55, minN: 3  },
      { marco: 2, minPD: 65, minN: 6  },
      { marco: 3, minPD: 72, minN: 10 },
      { marco: 4, minPD: 80, minN: 15 },
      { marco: 5, minPD: 86, minN: 20 },
      { marco: 6, minPD: 91, minN: 28 },
      { marco: 7, minPD: 95, minN: 40 },
    ],

    // Metadados por estilo (nome, ícone, cores da faixa).
    estilos: {
      hhd:   { nome: 'Hip Hop Dance', icone: 'mdi-run',            cor: '#F27405', corAlt: '#FA33A1' },
      pop:   { nome: 'Popping',       icone: 'mdi-flash',          cor: '#110273', corAlt: '#430ABF' },
      lock:  { nome: 'Locking',       icone: 'mdi-lock',           cor: '#F2B807', corAlt: '#8C0783' },
      break: { nome: 'Breaking',      icone: 'mdi-rotate-360',     cor: '#5C4A3F', corAlt: '#A08672' },
      house: { nome: 'House Dance',   icone: 'mdi-home-heart',     cor: '#030BA6', corAlt: '#FA33A1' },
    },

    // Nomes dos 7 marcos por estilo (do 1 ao 7).
    nomesPorEstilo: {
      hhd: [
        'Herói do Step Preciso', 'Navegador do Bounce', 'Semeador do Bounce Infinito',
        'Andarilho do Bounce Infinito', 'Tecelão do Groove',
        'Portador da Chama do Hip-Hop', 'Mensageiro do Flow Ancestral',
      ],
      pop: [
        'Amante dos Hits Eternos', 'Engenheiro da Isolação', 'Escultor do Robot',
        'Restaurador das Ondas Invisíveis', 'Navegador das Transições Geométricas',
        'Portador do Tutting Ancestral', 'Alquimista da Precisão',
      ],
      lock: [
        'Apontador das Verdades', 'Herdeiro do Campbellock', 'Portador do Lock Místico',
        'Corredor das Pernas Alegres', 'Artífice do Ritmo',
        'Palhaço Real da Roda', 'Mestre do Flava',
      ],
      break: [
        'Guia do Toprock Lendário', 'Forjador de Legados no Asfalto',
        'Alfaiate de Histórias no Chão', 'Explorador do Espaço Negativo',
        'Contador de Segundos Suspensos', 'Guardião do Cipher',
        'Domador do Eixo Invertido',
      ],
      house: [
        'Guia do Círculo Contínuo', 'Cartógrafo dos Pés Falantes',
        'Emissário do Sacred Groove', 'Explorador do Feeling',
        'Mago do Swing Suave', 'Domador da Queda Livre',
        'Condutor da Liberdade Criativa',
      ],
    },

    // Ícones sugeridos por marco (do 1 ao 7): crescendo em prestígio.
    iconesPorMarco: [
      'mdi-medal-outline', 'mdi-medal',
      'mdi-trophy-variant-outline', 'mdi-trophy-variant',
      'mdi-trophy-outline', 'mdi-trophy',
      'mdi-crown',
    ],

    // Transversais completos (Fase 1 + Fase 2 com gate).
    titulosTransversais: [
      // ---- Fase 1 ----
      { id: 'trans-forjador',   nome: 'Forjador do Movimento',  escopo: 'bailarino',
        icone: 'mdi-hammer',        cor: '#F27405', gate: false,
        descricao: 'Não executa passos, os funde. Cada dinâmica sai de sua bigorna com peso, brilho e propósito.',
        criterio: 'Três avaliações consecutivas de bailarino com nota superior a 90.' },
      { id: 'trans-pilar',      nome: 'Pilar da Presença',      escopo: 'performer',
        icone: 'mdi-pillar',        cor: '#FA33A1', gate: false,
        descricao: 'Ocupa o espaço antes mesmo de se mover. Quando entra na roda, o ar muda de densidade.',
        criterio: 'Três avaliações consecutivas de performer com nota superior a 90.' },
      { id: 'trans-semeador',   nome: 'Semeador da Essência',   escopo: 'professor',
        icone: 'mdi-sprout',        cor: '#8C0783', gate: false,
        descricao: 'Planta em cada aula, cada cypher, cada ensaio, aquilo que germinará em outros corpos por muito tempo depois de sua saída.',
        criterio: 'Trilha de professor concluída (banca de certificação aprovada).' },
      { id: 'trans-inspirador', nome: 'Inspirador de Símbolos', escopo: 'professor',
        icone: 'mdi-star-shooting', cor: '#5708A6', gate: false,
        descricao: 'Seu movimento vira referência. Um gesto seu hoje é vocabulário de outro dançarino amanhã.',
        criterio: 'Critério provisório: trilha de professor concluída. Será atualizado quando a trilha específica de formação existir.' },
      // ---- Fase 2 (com gate intermediário) ----
      { id: 'trans-interprete', nome: 'Intérprete da Jornada', escopo: 'improviso',
        icone: 'mdi-shuffle-variant', cor: '#F27405', gate: true,
        descricao: 'Traduz em movimento aquilo que a palavra não alcança — cada coreografia é um capítulo aberto da própria história.',
        criterio: 'Três avaliações consecutivas em habilidades de improviso (freestyle/improviso) com nota superior a 90.' },
      { id: 'trans-arquiteto',  nome: 'Arquiteto do Flow',     escopo: 'pop',
        icone: 'mdi-vector-polyline', cor: '#430ABF', gate: true,
        descricao: 'Projeta rotas invisíveis por onde o movimento corre sem esbarrar em si mesmo — cada transição é uma ponte que só ele desenhou.',
        criterio: 'Três avaliações consecutivas em habilidades de popping E de coreografia, com nota superior a 90.' },
      { id: 'trans-escultor',   nome: 'Escultor de Atmosferas', escopo: 'performer',
        icone: 'mdi-weather-hazy', cor: '#FA33A1', gate: true,
        descricao: 'Não muda apenas o próprio corpo, muda o clima do ambiente. Onde entra, a plateia esquece de piscar.',
        criterio: 'Três avaliações consecutivas em habilidades de solo do performer, com nota superior a 90. (Título dormente enquanto não houver habilidades de solo no perfil performer.)' },
      { id: 'trans-guardiao',   nome: 'Guardião do Estilo',     escopo: '(por estilo)',
        icone: 'mdi-shield-crown', cor: '#F2B807', gate: true, escopoPorEstilo: true,
        descricao: 'Protege a assinatura pessoal como quem guarda um nome de família: o estilo aqui não se copia, se herda.',
        criterio: 'Três avaliações consecutivas em habilidades de UM estilo específico com nota superior a 90. Pode ser conquistado em vários estilos independentemente.' },
    ],

    perfis: {
      bailarino: 'Bailarino(a)', professor: 'Professor(a)', performer: 'Performer',
      fundamentos: 'Fundamentos', iniciante: 'Iniciante', intermediario: 'Intermediário',
      _global: 'Geral',
    },
  };

  REP.perfilLabel = function (id) { return REP.perfis[id] || id; };
  REP.estiloLabel = function (id) { return (REP.estilos[id] && REP.estilos[id].nome) || id; };

  REP.tituloAtual = function (valor, lista) {
    var atual = null;
    for (var i = 0; i < lista.length; i++) if (valor >= lista[i].min) atual = lista[i];
    return atual;
  };
  REP.proximoTitulo = function (valor, lista) {
    for (var i = 0; i < lista.length; i++) {
      if (valor < lista[i].min) {
        var base = i === 0 ? 0 : lista[i - 1].min;
        var frac = (valor - base) / (lista[i].min - base);
        return { titulo: lista[i], progresso: Math.max(0, Math.min(1, frac)) };
      }
    }
    return null;
  };
  REP.bandaDesempenho = function (pd) {
    return REP.tituloAtual(pd, REP.titulosDesempenho);
  };

  /* Marco ATUAL do usuário num estilo: maior marco k em que
     PD_estilo >= escala[k].minPD E N_estilo >= escala[k].minN. */
  REP.marcoAtualEstilo = function (pd, n) {
    var atual = null;
    for (var i = 0; i < REP.escalaEstilo.length; i++) {
      var e = REP.escalaEstilo[i];
      if (pd >= e.minPD && n >= e.minN) atual = e;
    }
    return atual;
  };

  /* Próximo marco de um estilo: primeiro marco não alcançado.
     Retorna { marco, gapPD, gapN } — ambos gaps podem ser 0. */
  REP.proximoMarcoEstilo = function (pd, n) {
    for (var i = 0; i < REP.escalaEstilo.length; i++) {
      var e = REP.escalaEstilo[i];
      if (pd < e.minPD || n < e.minN) {
        return {
          marco: e,
          gapPD: Math.max(0, e.minPD - pd),
          gapN:  Math.max(0, e.minN  - n),
        };
      }
    }
    return null;
  };

  /* Nome do marco k (1..7) no estilo. */
  REP.nomeMarco = function (estilo, marco) {
    var arr = REP.nomesPorEstilo[estilo];
    if (!arr || marco < 1 || marco > 7) return `Marco ${marco}`;
    return arr[marco - 1];
  };

  /* Ícone do marco k. */
  REP.iconeMarco = function (marco) {
    return REP.iconesPorMarco[Math.max(0, Math.min(6, marco - 1))];
  };

  /* Resolve metadata de qualquer titulo_id (rep-*, des-*, est-*, trans-*). */
  REP.metaTitulo = function (id) {
    // est-{estilo}-{marco}
    var m = id.match(/^est-([a-z]+)-([1-7])$/);
    if (m) {
      var estilo = m[1], marco = Number(m[2]);
      return {
        id: id,
        nome: REP.nomeMarco(estilo, marco),
        icone: REP.iconeMarco(marco),
        cor: (REP.estilos[estilo] || {}).cor || '#8C0783',
        estilo: estilo,
        marco: marco,
      };
    }
    // Demais: procurar nos catálogos
    var todos = REP.titulosReputacao
      .concat(REP.titulosDesempenho)
      .concat(REP.titulosTransversais);
    for (var i = 0; i < todos.length; i++) if (todos[i].id === id) return todos[i];
    return { id: id, nome: id, icone: 'mdi-medal-outline' };
  };

  /* Lista canônica dos ids de um estilo (est-hhd-1 .. est-hhd-7). */
  REP.idsDoEstilo = function (estilo) {
    return [1,2,3,4,5,6,7].map(function(k){ return 'est-' + estilo + '-' + k; });
  };

  global.UDX_REP = REP;
  if (typeof module !== 'undefined' && module.exports) module.exports = REP;
}(typeof window !== 'undefined' ? window : this));