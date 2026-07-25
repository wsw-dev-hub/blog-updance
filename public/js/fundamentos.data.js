/**
 * ================================================================
 *  UP DANCE EXPERIENCE — TEMPORADA FREE · FUNDAMENTOS
 *  /js/fundamentos.data.js
 * ----------------------------------------------------------------
 *  MODELO DE DADOS (somente conteúdo — sem lógica).
 *  Espelha o formato de talentTree.data.js, mas com uma diferença
 *  central de ECONOMIA: o nível Free NÃO aloca pontos.
 *
 *  ECONOMIA (Free)
 *  ------------
 *  - Não há xpPorPonto nem Pontos de Talento: o RANK de um nó é o
 *    número de desafios APROVADOS daquele nó (teto = ranksMax).
 *  - Por isso, para todo nó vale a invariante:  desafios.length === ranksMax.
 *  - O XP de Ecossistema (XPE) é a soma dos desafios aprovados.
 *  - Concluir a temporada (todos os nós no máximo) concede a INSÍGNIA
 *    e torna o membro elegível à promoção a Iniciante (checkpoint humano).
 *
 *  ISOLAMENTO
 *  ------------
 *  Este arquivo é independente de UDX_TALENTOS. O Free enxerga
 *  apenas esta trilha — nunca as três árvores de carreira.
 * ================================================================
 */
(function (global) {
  'use strict';

  var F = {

    versao: '1.0.0',

    /* Temporada vigente. A disponibilidade rotaciona; o histórico não. */
    temporada: {
      id: 'S1',
      nome: 'Temporada 1 — Fundamentos',
      nivelAlvo: 'Free',
      promovePara: 'Iniciante',
      /* limiarXPE é DERIVADO da soma dos desafios (ver teste de consistência).
         Preenchido aqui com o valor validado para evitar número mágico. */
      limiarXPE: 342
    },

    /* Consumido pelo motor genérico (trilha.js). */
    runtime: {
      perfilId: 'fundamentos',
      resource: 'temporada-free',
      chaveLocal: 'udx:temporada:v1',
      insigniaId: 'fund-insignia',
      api: { me: '/api/me', estado: '/api/trilha/estado?perfil=fundamentos', desafio: '/api/trilha/desafio' }
    },

    /* Free é o piso — os níveis acima herdam o acesso à temporada. */
    tiposComAcesso: ['Free', 'Iniciante', 'Básico', 'Intermediário',
                     'Estagiário(a)', 'Monitor(a)', 'Assistente', 'Professor(a)', 'Premium'],

    tiposDesafio: {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    },

    perfis: [
      {
        id: 'fundamentos',
        nome: 'Fundamentos',
        segmento: 'Temporada Free',
        icone: 'mdi-seed-outline',
        xpLabel: 'XPE de Fundamentos',
        resumo: 'A porta de entrada: os cinco eixos do movimento e os primeiros ' +
                '15 passos de Hip Hop Dance e Popping. Sem alocar pontos — cada ' +
                'desafio concluído faz o nó evoluir.',
        tiers: [
          { n: 1, nome: 'Eixos do Movimento', requisito: 0 },
          { n: 2, nome: 'Primeiros Passos',   requisito: 0 }
        ],
        habilidades: [

          /* ---------------- FAIXA 1 · EIXOS ---------------- */
          {
            id: 'fund-pulso', tier: 1, col: 1, ranksMax: 4,
            nome: 'Pulso', icone: 'mdi-pulse',
            resumo: 'A pulsação do corpo no tempo da música — antes de qualquer passo.',
            niveis: [
              'Pulsa em diferentes velocidades musicais, mantendo o tempo.',
              'Alterna pulsos pequenos e amplos sem perder o pulso.',
              'Isola o pulso por segmento: joelhos, quadris, peito e corpo inteiro.',
              'Silêncio corporal e retorno ao pulso — sente a pulsação antes de contar.'
            ],
            desafios: [
              { id: 'fund-pulso-d1', tipo: 'tarefa',    xp: 8,
                nome: 'Três velocidades',
                desc: 'Enviar vídeo pulsando em 3 andamentos musicais diferentes.' },
              { id: 'fund-pulso-d2', tipo: 'tarefa',    xp: 10,
                nome: 'Pequeno e amplo',
                desc: 'Registrar um trecho alternando pulso pequeno e pulso amplo.' },
              { id: 'fund-pulso-d3', tipo: 'atividade', xp: 12,
                nome: 'Pulso por partes',
                desc: 'Isolar o pulso em joelhos, depois quadris, peito e corpo inteiro.' },
              { id: 'fund-pulso-d4', tipo: 'atividade', xp: 14,
                nome: 'Silêncio e retorno',
                desc: 'Manter silêncio corporal e retornar ao pulso no tempo, sem contagem.' }
            ]
          },
          {
            id: 'fund-balancos', tier: 1, col: 2, ranksMax: 4,
            nome: 'Balanços', icone: 'mdi-swap-horizontal-bold',
            resumo: 'Transferência de peso legível de uma base para a outra.',
            niveis: [
              'Balança lateralmente percebendo a troca real de peso.',
              'Balança para frente/trás e explora diagonais.',
              'Varia amplitude e velocidade sem perder a base.',
              'Balança com quatro intenções: suave, explosivo, contínuo e interrompido.'
            ],
            desafios: [
              { id: 'fund-bal-d1', tipo: 'tarefa',    xp: 8,
                nome: 'Lateral com peso',
                desc: 'Enviar vídeo balançando lateralmente com a troca de peso visível.' },
              { id: 'fund-bal-d2', tipo: 'tarefa',    xp: 10,
                nome: 'Frente, trás, diagonal',
                desc: 'Registrar balanços para frente/trás e em diagonais.' },
              { id: 'fund-bal-d3', tipo: 'atividade', xp: 12,
                nome: 'Amplitude e velocidade',
                desc: 'Variar amplitude e velocidade do balanço no mesmo trecho.' },
              { id: 'fund-bal-d4', tipo: 'atividade', xp: 14,
                nome: 'Quatro intenções',
                desc: 'Executar o balanço nas 4 intenções: suave, explosivo, contínuo, interrompido.' }
            ]
          },
          {
            id: 'fund-caminhadas', tier: 1, col: 3, ranksMax: 4,
            nome: 'Caminhadas', icone: 'mdi-walk',
            resumo: 'Deslocar com intenção: cada passo diz alguma coisa.',
            niveis: [
              'Caminha em diferentes direções mantendo o eixo.',
              'Varia velocidade e tamanho do passo.',
              'Aplica mudanças repentinas de direção sem tropeçar no tempo.',
              'Adapta a qualidade do deslocamento a três estilos musicais.'
            ],
            desafios: [
              { id: 'fund-cam-d1', tipo: 'tarefa',    xp: 8,
                nome: 'Todas as direções',
                desc: 'Enviar vídeo caminhando em ao menos 4 direções distintas.' },
              { id: 'fund-cam-d2', tipo: 'tarefa',    xp: 10,
                nome: 'Velocidade e tamanho',
                desc: 'Registrar caminhadas variando velocidade e tamanho do passo.' },
              { id: 'fund-cam-d3', tipo: 'atividade', xp: 12,
                nome: 'Mudança de direção',
                desc: 'Executar caminhada com mudanças repentinas de direção no tempo.' },
              { id: 'fund-cam-d4', tipo: 'atividade', xp: 14,
                nome: 'Três músicas',
                desc: 'Caminhar sobre 3 estilos musicais, deixando a música mudar a qualidade.' }
            ]
          },
          {
            id: 'fund-circulares', tier: 1, col: 1, ranksMax: 5,
            nome: 'Movimentos Circulares', icone: 'mdi-rotate-3d-variant',
            resumo: 'Círculos por articulação — a base da isolação.',
            requer: ['fund-pulso'],
            niveis: [
              'Círculos de cabeça, ombros e braços.',
              'Círculos de caixa torácica e quadris.',
              'Círculos de joelhos e tornozelos.',
              'Conecta dois círculos de regiões diferentes.',
              'Altera tamanho, velocidade, direção e plano na mesma sequência.'
            ],
            desafios: [
              { id: 'fund-circ-d1', tipo: 'tarefa',    xp: 8,
                nome: 'Alto do corpo',
                desc: 'Enviar círculos de cabeça, ombros e braços.' },
              { id: 'fund-circ-d2', tipo: 'tarefa',    xp: 10,
                nome: 'Centro do corpo',
                desc: 'Registrar círculos de caixa torácica e quadris.' },
              { id: 'fund-circ-d3', tipo: 'tarefa',    xp: 12,
                nome: 'Base do corpo',
                desc: 'Executar círculos de joelhos e tornozelos.' },
              { id: 'fund-circ-d4', tipo: 'atividade', xp: 14,
                nome: 'Conectar círculos',
                desc: 'Conectar dois círculos de regiões diferentes numa sequência.' },
              { id: 'fund-circ-d5', tipo: 'atividade', xp: 16,
                nome: 'Quatro variáveis',
                desc: 'Alterar tamanho, velocidade, direção e plano na mesma sequência.' }
            ]
          },
          {
            id: 'fund-ondulacoes', tier: 1, col: 2, ranksMax: 5,
            nome: 'Ondulações', icone: 'mdi-wave',
            resumo: 'A continuidade entre segmentos: o movimento viaja pelo corpo.',
            requer: ['fund-circulares'],
            niveis: [
              'Inicia a onda pelo peito, com controle da sequência.',
              'Inicia a onda pela cabeça e ombros.',
              'Inicia a onda pelo quadril e pelos braços.',
              'Faz o caminho inverso da onda.',
              'Onda extremamente lenta, com controle segmento a segmento.'
            ],
            desafios: [
              { id: 'fund-ond-d1', tipo: 'tarefa',    xp: 8,
                nome: 'Onda pelo peito',
                desc: 'Enviar uma ondulação iniciada pelo peito.' },
              { id: 'fund-ond-d2', tipo: 'tarefa',    xp: 10,
                nome: 'Onda pelo alto',
                desc: 'Registrar ondulação iniciada pela cabeça e ombros.' },
              { id: 'fund-ond-d3', tipo: 'tarefa',    xp: 12,
                nome: 'Onda pela base',
                desc: 'Executar ondulação iniciada pelo quadril e pelos braços.' },
              { id: 'fund-ond-d4', tipo: 'atividade', xp: 14,
                nome: 'Caminho inverso',
                desc: 'Fazer a onda percorrer o corpo no sentido inverso.' },
              { id: 'fund-ond-d5', tipo: 'atividade', xp: 16,
                nome: 'Onda lenta',
                desc: 'Sustentar uma onda extremamente lenta, controlando cada segmento.' }
            ]
          },

          /* ---------------- FAIXA 2 · PRIMEIROS PASSOS ---------------- */
          {
            id: 'fund-vocab-hiphop', tier: 2, col: 1, ranksMax: 8,
            nome: 'Vocabulário Hip Hop', icone: 'mdi-shoe-sneaker',
            resumo: 'Os 8 primeiros passos [ BÁSICO ] de Hip Hop Dance do catálogo.',
            requer: ['fund-pulso', 'fund-caminhadas'],
            niveis: [
              '2 Steps — deslocamento base no tempo.',
              '4 Steps — extensão do 2 Steps em quatro apoios.',
              'March Step — marcha no lugar com bounce.',
              'Monastery — troca de apoio com giro de tronco.',
              'Bart Simpson — bounce com projeção de ombro.',
              'Pepper Seed — quique com abertura de joelhos.',
              'Bernie — inclinação de tronco no groove.',
              'Cammel Walk — deslize alternando os pés.'
            ],
            desafios: [
              { id: 'fund-hh-d1', tipo: 'tarefa', xp: 6, nome: '2 Steps',      desc: 'Enviar vídeo executando 8 tempos de 2 Steps no ritmo.' },
              { id: 'fund-hh-d2', tipo: 'tarefa', xp: 6, nome: '4 Steps',      desc: 'Enviar vídeo executando 8 tempos de 4 Steps no ritmo.' },
              { id: 'fund-hh-d3', tipo: 'tarefa', xp: 6, nome: 'March Step',   desc: 'Enviar vídeo executando 8 tempos de March Step com bounce.' },
              { id: 'fund-hh-d4', tipo: 'tarefa', xp: 6, nome: 'Monastery',    desc: 'Enviar vídeo executando 8 tempos de Monastery.' },
              { id: 'fund-hh-d5', tipo: 'tarefa', xp: 6, nome: 'Bart Simpson', desc: 'Enviar vídeo executando 8 tempos de Bart Simpson.' },
              { id: 'fund-hh-d6', tipo: 'tarefa', xp: 6, nome: 'Pepper Seed',  desc: 'Enviar vídeo executando 8 tempos de Pepper Seed.' },
              { id: 'fund-hh-d7', tipo: 'tarefa', xp: 6, nome: 'Bernie',       desc: 'Enviar vídeo executando 8 tempos de Bernie.' },
              { id: 'fund-hh-d8', tipo: 'tarefa', xp: 6, nome: 'Cammel Walk',  desc: 'Enviar vídeo executando 8 tempos de Cammel Walk.' }
            ]
          },
          {
            id: 'fund-vocab-popping', tier: 2, col: 3, ranksMax: 7,
            nome: 'Vocabulário Popping', icone: 'mdi-flash-outline',
            resumo: 'Os 7 primeiros passos [ BÁSICO ] de Popping do catálogo.',
            requer: ['fund-circulares'],
            niveis: [
              'Hit / Pop — contração e relaxamento no tempo.',
              'Roll — rolamento contínuo de articulação.',
              'Lift — elevação isolada de segmento.',
              'Boogaloo — circularidade solta pelo corpo.',
              'Fresno — hit alternado com deslocamento lateral.',
              'Walk Out — abertura dos pés com hit.',
              'Walk Out Boogaloo — Walk Out com circularidade.'
            ],
            desafios: [
              { id: 'fund-pop-d1', tipo: 'tarefa', xp: 6, nome: 'Hit / Pop',          desc: 'Enviar vídeo executando 8 tempos de Hit/Pop no ritmo.' },
              { id: 'fund-pop-d2', tipo: 'tarefa', xp: 6, nome: 'Roll',               desc: 'Enviar vídeo executando 8 tempos de Roll.' },
              { id: 'fund-pop-d3', tipo: 'tarefa', xp: 6, nome: 'Lift',               desc: 'Enviar vídeo executando 8 tempos de Lift.' },
              { id: 'fund-pop-d4', tipo: 'tarefa', xp: 6, nome: 'Boogaloo',           desc: 'Enviar vídeo executando 8 tempos de Boogaloo.' },
              { id: 'fund-pop-d5', tipo: 'tarefa', xp: 6, nome: 'Fresno',             desc: 'Enviar vídeo executando 8 tempos de Fresno.' },
              { id: 'fund-pop-d6', tipo: 'tarefa', xp: 6, nome: 'Walk Out',           desc: 'Enviar vídeo executando 8 tempos de Walk Out.' },
              { id: 'fund-pop-d7', tipo: 'tarefa', xp: 6, nome: 'Walk Out Boogaloo',  desc: 'Enviar vídeo executando 8 tempos de Walk Out Boogaloo.' }
            ]
          },

          /* ---------------- INSÍGNIA (não é título) ---------------- */
          {
            id: 'fund-insignia', tier: 2, col: 2, tipo: 'insignia', ranksMax: 1,
            nome: 'Fundamentos Concluídos', icone: 'mdi-medal-outline',
            resumo: 'Insígnia permanente e cumulativa. Registra a conclusão da ' +
                    'Temporada 1 e torna o membro elegível à promoção para Iniciante. ' +
                    'Não habilita nada fora da plataforma — não é um título de carreira.',
            requer: ['fund-pulso', 'fund-balancos', 'fund-caminhadas',
                     'fund-circulares', 'fund-ondulacoes',
                     'fund-vocab-hiphop', 'fund-vocab-popping'],
            niveis: ['Insígnia conquistada — elegível à banca de promoção para Iniciante.'],
            desafios: []
          }
        ]
      }
    ]
  };

  /* Índice auxiliar por id (mesmo padrão de UDX_TALENTOS). */
  F.indice = (function () {
    var mapa = {};
    F.perfis.forEach(function (p) {
      p.habilidades.forEach(function (h) {
        h.perfilId = p.id;
        h.requer   = h.requer || [];
        h.tipo     = h.tipo   || 'habilidade';
        h.desafios = h.desafios || [];
        mapa[h.id] = h;
      });
    });
    return mapa;
  }());

  global.UDX_TRILHA = F;
  global.UDX_FUNDAMENTOS = F;

}(typeof window !== 'undefined' ? window : this));
