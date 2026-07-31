/**
 * UP DANCE EXPERIENCE — REPUTAÇÃO & DESEMPENHO (metadados de exibição)
 * /js/reputacao.data.js  ·  Fase 1
 * ----------------------------------------------------------------
 * Espelha o catálogo do backend (worker_reputacao.js) SÓ para
 * exibição — nomes, ícones, cores (paleta oficial), descrições e
 * helpers puros. A AUTORIDADE de concessão/revogação é do servidor;
 * este módulo apenas reflete.
 *
 * ─── ATUALIZAÇÃO DE ESTRATÉGIA (Fase 1) ───────────────────────────
 * • titulosReputacao (rep-*) e titulosDesempenho (des-*) foram
 *   CONGELADOS. Ficam expostos para o front renderizar registros
 *   HISTÓRICOS já concedidos (sem barra de "próximo título",
 *   sem gatilho novo).
 * • titulosTransversais (trans-*) é o eixo IMPLEMENTADO nesta fase:
 *   quatro títulos concedidos por reconciliação declarativa a partir
 *   de critérios verificáveis no schema atual.
 * • As bandas de PD (Consistente/Destaque/Excelência/Elite) seguem
 *   como REFERÊNCIA VISUAL da nota corrente (pill sobre a nota).
 *   Não são mais concedidas como títulos. A escada por ESTILO virá
 *   na Fase 2.
 *
 * Paleta oficial usada: Marinho #110273 · Azul Médio #430ABF ·
 *                       Roxo #8C0783 · Rosa/Choque #FA33A1 ·
 *                       Laranja #F27405
 */
(function (global) {
  'use strict';

  var REP = {
    notaMin: 0,
    notaMax: 100,
    desempenhoJanela: 10,
    escopoTitulos: 'perfil',

    /* Ranking sazonal (rep-*) — SUSPENSO até a temporada existir.
       Nada é concedido a partir daqui na Fase 1; a listagem serve
       apenas para renderizar registros históricos. */
    titulosReputacao: [
      { id: 'rep-1', nome: 'Reconhecido(a)', min: 500,  icone: 'mdi-shield-star-outline', cor: '#430ABF', legado: true },
      { id: 'rep-2', nome: 'Referência',     min: 1500, icone: 'mdi-shield-star',         cor: '#8C0783', legado: true },
      { id: 'rep-3', nome: 'Autoridade',     min: 4000, icone: 'mdi-crown-outline',       cor: '#BF0449', legado: true },
      { id: 'rep-4', nome: 'Lenda',          min: 8000, icone: 'mdi-crown',               cor: '#FA33A1', legado: true },
    ],
    /* Bandas de PD (des-*) — SUSPENSAS como títulos. Continuam
       existindo como REFERÊNCIA VISUAL: bandaDesempenho() calcula
       a banda atual (pill sobre a nota) e o front pinta o card
       de PD com o gradiente correspondente. */
    titulosDesempenho: [
      { id: 'des-1', nome: 'Consistente', min: 60, icone: 'mdi-medal-outline',          cor: '#110273', legado: true },
      { id: 'des-2', nome: 'Destaque',    min: 75, icone: 'mdi-medal',                  cor: '#430ABF', legado: true },
      { id: 'des-3', nome: 'Excelência',  min: 88, icone: 'mdi-trophy-variant-outline', cor: '#8C0783', legado: true },
      { id: 'des-4', nome: 'Elite',       min: 95, icone: 'mdi-trophy',                 cor: '#FA33A1', legado: true },
    ],

    /* Títulos transversais IMPLEMENTADOS na Fase 1. O escopo aqui
       reflete o perfil onde o critério é medido. O motor concede e
       revoga automaticamente via reconciliação. */
    titulosTransversais: [
      { id: 'trans-forjador',   nome: 'Forjador do Movimento',
        icone: 'mdi-hammer', cor: '#F27405', escopo: 'bailarino',
        descricao: 'Não executa passos, os funde. Cada dinâmica sai de sua bigorna com peso, brilho e propósito.',
        criterio: 'Três avaliações consecutivas de bailarino com nota superior a 90.' },
      { id: 'trans-pilar',      nome: 'Pilar da Presença',
        icone: 'mdi-pillar', cor: '#FA33A1', escopo: 'performer',
        descricao: 'Ocupa o espaço antes mesmo de se mover. Quando entra na roda, o ar muda de densidade.',
        criterio: 'Três avaliações consecutivas de performer com nota superior a 90.' },
      { id: 'trans-semeador',   nome: 'Semeador da Essência',
        icone: 'mdi-sprout', cor: '#8C0783', escopo: 'professor',
        descricao: 'Planta em cada aula, cada cypher, cada ensaio, aquilo que germinará em outros corpos por muito tempo depois de sua saída.',
        criterio: 'Trilha de professor concluída (banca de certificação aprovada).' },
      { id: 'trans-inspirador', nome: 'Inspirador de Símbolos',
        icone: 'mdi-star-shooting', cor: '#5708A6', escopo: 'professor',
        descricao: 'Seu movimento vira referência. Um gesto seu hoje é vocabulário de outro dançarino amanhã.',
        criterio: 'Critério provisório: trilha de professor concluída. Será atualizado quando a trilha específica de formação existir.' },
    ],

    /* Títulos transversais RESERVADOS para a Fase 2 (dependem de
       tabelas ainda inexistentes de habilidade↔estilo e ↔quesito).
       Mantidos aqui apenas para documentação:
         • Guardião do Estilo    (estilo qualquer)
         • Intérprete da Jornada (quesito freestyle)
         • Arquiteto do Flow     (estilo popping + coreografia)
         • Escultor de Atmosferas (quesito solo em performer)     */

    perfis: {
      bailarino: 'Bailarino(a)', professor: 'Professor(a)', performer: 'Performer',
      fundamentos: 'Fundamentos', iniciante: 'Iniciante', intermediario: 'Intermediário',
      _global: 'Geral',
    },
  };

  REP.perfilLabel = function (id) { return REP.perfis[id] || id; };

  /* título ATUAL numa escada (maior limiar já alcançado) — ou null */
  REP.tituloAtual = function (valor, lista) {
    var atual = null;
    for (var i = 0; i < lista.length; i++) if (valor >= lista[i].min) atual = lista[i];
    return atual;
  };

  /* Mantido para o histórico rep-*: NA FASE 1 O FRONT NÃO RENDERIZA
     progresso ao próximo (o eixo está congelado). Deixado aqui para
     não quebrar consumidores externos que ainda chamem a função. */
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

  /* banda de desempenho (referência visual sobre a nota atual) */
  REP.bandaDesempenho = function (pd) {
    return REP.tituloAtual(pd, REP.titulosDesempenho);
  };

  /* Resolve metadados de um titulo_id qualquer (rep/des/trans).
     Útil para o front pintar título vindo do servidor sem precisar
     saber de qual eixo veio. */
  REP.metaTitulo = function (id) {
    var todos = REP.titulosReputacao
      .concat(REP.titulosDesempenho)
      .concat(REP.titulosTransversais);
    for (var i = 0; i < todos.length; i++) if (todos[i].id === id) return todos[i];
    return { id: id, nome: id, icone: 'mdi-medal-outline' };
  };

  global.UDX_REP = REP;
  if (typeof module !== 'undefined' && module.exports) module.exports = REP;
}(typeof window !== 'undefined' ? window : this));