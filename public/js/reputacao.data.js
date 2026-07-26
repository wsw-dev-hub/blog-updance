/**
 * UP DANCE EXPERIENCE — REPUTAÇÃO & DESEMPENHO (metadados de exibição)
 * /js/reputacao.data.js
 * ----------------------------------------------------------------
 * Espelha o catálogo de títulos e a escala do backend (worker_reputacao.js)
 * SÓ para exibição: nomes, ícones, cores (paleta oficial) e helpers puros
 * (banda de desempenho, progresso até o próximo título, rótulos de perfil).
 * A AUTORIDADE de concessão é do servidor; este módulo apenas reflete.
 * Um teste de consistência garante que ids/limiares batem com o worker.
 *
 * Paleta oficial usada: Marinho #110273 · Azul Médio #430ABF ·
 *                       Roxo #8C0783 · Rosa/Choque #FA33A1
 */
(function (global) {
  'use strict';

  var REP = {
    notaMin: 0,
    notaMax: 100,
    desempenhoJanela: 10,
    escopoTitulos: 'perfil',

    /* Reputação (PR, acumulada) — degraus de prestígio (roxo → rosa/choque) */
    titulosReputacao: [
      { id: 'rep-1', nome: 'Reconhecido(a)', min: 500,  icone: 'mdi-shield-star-outline', cor: '#430ABF' },
      { id: 'rep-2', nome: 'Referência',      min: 1500, icone: 'mdi-shield-star',         cor: '#8C0783' },
      { id: 'rep-3', nome: 'Autoridade',      min: 4000, icone: 'mdi-crown-outline',       cor: '#BF0449' },
      { id: 'rep-4', nome: 'Lenda',           min: 8000, icone: 'mdi-crown',               cor: '#FA33A1' },
    ],
    /* Desempenho (PD, 0..100) — bandas na paleta oficial (marinho → rosa/choque) */
    titulosDesempenho: [
      { id: 'des-1', nome: 'Consistente', min: 60, icone: 'mdi-medal-outline',          cor: '#110273' },
      { id: 'des-2', nome: 'Destaque',    min: 75, icone: 'mdi-medal',                  cor: '#430ABF' },
      { id: 'des-3', nome: 'Excelência',  min: 88, icone: 'mdi-trophy-variant-outline', cor: '#8C0783' },
      { id: 'des-4', nome: 'Elite',       min: 95, icone: 'mdi-trophy',                 cor: '#FA33A1' },
    ],

    perfis: {
      bailarino: 'Bailarino(a)', professor: 'Professor(a)', performer: 'Performer',
      fundamentos: 'Fundamentos', iniciante: 'Iniciante', intermediario: 'Intermediário',
      _global: 'Geral',
    },
  };

  /* rótulo amigável de um perfil */
  REP.perfilLabel = function (id) {
    return REP.perfis[id] || id;
  };

  /* título ATUAL numa escada (maior limiar já alcançado) — ou null */
  REP.tituloAtual = function (valor, lista) {
    var atual = null;
    for (var i = 0; i < lista.length; i++) if (valor >= lista[i].min) atual = lista[i];
    return atual;
  };

  /* próximo título e progresso (0..1) do valor atual até ele — ou null se no topo */
  REP.proximoTitulo = function (valor, lista) {
    for (var i = 0; i < lista.length; i++) {
      if (valor < lista[i].min) {
        var base = i === 0 ? 0 : lista[i - 1].min;
        var frac = (valor - base) / (lista[i].min - base);
        return { titulo: lista[i], progresso: Math.max(0, Math.min(1, frac)) };
      }
    }
    return null; // já no topo
  };

  /* banda de desempenho para um PD (usa a escada de desempenho) */
  REP.bandaDesempenho = function (pd) {
    return REP.tituloAtual(pd, REP.titulosDesempenho);
  };

  global.UDX_REP = REP;
  if (typeof module !== 'undefined' && module.exports) module.exports = REP;
}(typeof window !== 'undefined' ? window : this));
