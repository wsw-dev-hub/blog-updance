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
 *  ESTRUTURA (v2 — 2 CARDS LADO A LADO, no modelo da página Iniciante)
 *  ------------
 *  Card 1 · ALONGAMENTOS  — trilha simples de aquecimento/alongamento,
 *          foco em QUEM NUNCA PRATICOU dança. Conteúdo genérico de
 *          preparo corporal (não usa o catálogo de passos). IDs com
 *          prefixo próprio 'fund-along-*' para não colidir com o card
 *          'along' do nível Iniciante (o worker deduplica progresso por
 *          desafio_id sem filtrar perfil).
 *  Card 2 · FUNDAMENTOS   — os cinco eixos do movimento + os 15 primeiros
 *          passos [ BÁSICO ] de Hip Hop Dance (8) e Popping (7) do catálogo.
 *          Reorganizado: removido o antigo nó 'fund-combinacoes', que era
 *          uma DUPLICATA de 'fund-vocab-popping' (mesmos IDs fund-pop-d1..d7),
 *          e faixas reagrupadas para leitura em colunas.
 *
 *  Para o BACKEND os dois cards são um só perfil (runtime.perfilId =
 *  'fundamentos'): o split em colunas é apenas disposição visual. O XPE é
 *  o total do nível. Cada card tem um nó de conclusão (tipo 'titulo' /
 *  'insignia'); a elegibilidade exige TODAS as conquistas prontas.
 *
 *  ISOLAMENTO
 *  ------------
 *  Este arquivo é independente de UDX_TALENTOS. O Free enxerga
 *  apenas esta trilha — nunca as três árvores de carreira.
 *
 *  limiarXPE = soma de TODO o XP (único) dos desafios dos dois cards
 *  (derivado; validado por test_fundamentos.js). Deve casar com o
 *  'limiar' de worker_trilhas.js para o perfil 'fundamentos'.
 * ================================================================
 */
(function (global) {
  'use strict';

  var F = {

    versao: '2.0.0',

    /* Temporada vigente. A disponibilidade rotaciona; o histórico não. */
    temporada: {
      id: 'S1',
      nome: 'Temporada 1 — Fundamentos',
      nivelAlvo: 'Free',
      promovePara: 'Iniciante',
      /* limiarXPE é DERIVADO da soma dos desafios ÚNICOS (ver test_fundamentos.js).
         608 = soma dos 59 desafios dos 2 cards, com o nó fund-coreo já
         usando os IDs fund-coreo-d1..d3 (sem colisão com a trilha Iniciante). */
      limiarXPE: 608
    },

    /* Consumido pelo motor genérico (trilha.js). */
    runtime: {
      perfilId: 'fundamentos',
      resource: 'nivel-free',
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

      /* ============================================================
         CARD 1 · ALONGAMENTOS  (simples — para quem nunca dançou)
         ============================================================ */
      {
        id: 'alongamentos',
        nome: 'Alongamentos',
        segmento: 'Nunca dancei? Comece aqui',
        icone: 'mdi-yoga',
        xpLabel: 'XPE de Alongamentos',
        resumo: 'Trilha de preparo para o corpo que está começando do zero: ' +
                'respirar, aquecer e soltar as articulações — sempre no seu ' +
                'tempo e sem forçar. Cada desafio concluído faz o nó evoluir.',
        tiers: [
          { n: 1, nome: 'Respirar & Aquecer' },
          { n: 2, nome: 'Soltar o Corpo' },
          { n: 3, nome: 'Conclusão' }
        ],
        habilidades: [

          /* -------- FAIXA 1 · RESPIRAR & AQUECER (sem pré-requisito) -------- */
          {
            id: 'fund-along-respiracao', tier: 1, col: 1, ranksMax: 3,
            nome: 'Respiração & Postura', icone: 'mdi-meditation',
            resumo: 'Respira, encontra o eixo e prepara o corpo antes de tudo.',
            requer: [],
            niveis: [
              'Respiração diafragmática, sentindo o abdômen.',
              'Alinhamento cabeça–quadril–pés em pé.',
              'Respiração aplicada a um movimento bem lento.'
            ],
            desafios: [
              { id: 'fund-along-resp-d1', tipo: 'tarefa', xp: 8,
                nome: 'Respiração · 1',
                desc: 'Respiração diafragmática, 5 ciclos calmos.' },
              { id: 'fund-along-resp-d2', tipo: 'tarefa', xp: 10,
                nome: 'Respiração · 2',
                desc: 'Alinhamento em pé: cabeça, quadril e pés no mesmo eixo.' },
              { id: 'fund-along-resp-d3', tipo: 'tarefa', xp: 12,
                nome: 'Respiração · 3',
                desc: 'Respiração aplicada a um movimento lento de braços.' }
            ]
          },
          {
            id: 'fund-along-mobilidade', tier: 1, col: 2, ranksMax: 4,
            nome: 'Mobilidade Articular', icone: 'mdi-rotate-3d-variant',
            resumo: 'Solta as articulações antes de qualquer esforço.',
            requer: [],
            niveis: [
              'Círculos de pescoço e ombros, sem forçar.',
              'Círculos de punhos e cotovelos.',
              'Círculos de quadril e joelhos.',
              'Tornozelos e mobilização suave da coluna.'
            ],
            desafios: [
              { id: 'fund-along-mob-d1', tipo: 'tarefa', xp: 8,
                nome: 'Mobilidade · 1', desc: 'Círculos de pescoço e ombros.' },
              { id: 'fund-along-mob-d2', tipo: 'tarefa', xp: 10,
                nome: 'Mobilidade · 2', desc: 'Círculos de punhos e cotovelos.' },
              { id: 'fund-along-mob-d3', tipo: 'tarefa', xp: 12,
                nome: 'Mobilidade · 3', desc: 'Círculos de quadril e joelhos.' },
              { id: 'fund-along-mob-d4', tipo: 'tarefa', xp: 14,
                nome: 'Mobilidade · 4', desc: 'Tornozelos e mobilização suave da coluna.' }
            ]
          },
          {
            id: 'fund-along-aquece', tier: 1, col: 3, ranksMax: 3,
            nome: 'Aquecimento Leve', icone: 'mdi-heart-pulse',
            resumo: 'Eleva a temperatura do corpo em ritmo confortável.',
            requer: [],
            niveis: [
              'Marcha no lugar, sem pressa.',
              'Elevação de joelhos leve.',
              'Balanço de braços integrado à marcha.'
            ],
            desafios: [
              { id: 'fund-along-aq-d1', tipo: 'tarefa', xp: 8,
                nome: 'Aquecimento · 1', desc: 'Marcha no lugar por 2 minutos.' },
              { id: 'fund-along-aq-d2', tipo: 'tarefa', xp: 10,
                nome: 'Aquecimento · 2', desc: 'Elevação de joelhos em ritmo confortável.' },
              { id: 'fund-along-aq-d3', tipo: 'tarefa', xp: 12,
                nome: 'Aquecimento · 3', desc: 'Balanço de braços junto com a marcha.' }
            ]
          },

          /* -------- FAIXA 2 · SOLTAR O CORPO -------- */
          {
            id: 'fund-along-pernas', tier: 2, col: 1, ranksMax: 3,
            nome: 'Pernas & Panturrilhas', icone: 'mdi-human-handsdown',
            resumo: 'Alonga a parte de trás das pernas — o ponto fraco de quem começa.',
            requer: ['fund-along-respiracao'],
            niveis: [
              'Panturrilha na parede, sem dor.',
              'Isquiotibiais sentado, joelho levemente dobrado.',
              'Inclinação em pé com apoio das mãos.'
            ],
            desafios: [
              { id: 'fund-along-per-d1', tipo: 'tarefa', xp: 10,
                nome: 'Pernas · 1', desc: 'Alongamento de panturrilha na parede.' },
              { id: 'fund-along-per-d2', tipo: 'tarefa', xp: 12,
                nome: 'Pernas · 2', desc: 'Isquiotibiais sentado, joelho levemente flexionado.' },
              { id: 'fund-along-per-d3', tipo: 'tarefa', xp: 14,
                nome: 'Pernas · 3', desc: 'Inclinação em pé com apoio, respirando.' }
            ]
          },
          {
            id: 'fund-along-quadril', tier: 2, col: 2, ranksMax: 3,
            nome: 'Quadril Suave', icone: 'mdi-human-handsup',
            resumo: 'Abre o quadril com apoios e sem forçar amplitude.',
            requer: ['fund-along-mobilidade'],
            niveis: [
              'Borboleta assistida, cotovelos nos joelhos.',
              'Figura-4 deitado, uma perna de cada vez.',
              'Afundo baixo com apoio das mãos no chão.'
            ],
            desafios: [
              { id: 'fund-along-qua-d1', tipo: 'tarefa', xp: 10,
                nome: 'Quadril · 1', desc: 'Borboleta assistida, cotovelos nos joelhos.' },
              { id: 'fund-along-qua-d2', tipo: 'tarefa', xp: 12,
                nome: 'Quadril · 2', desc: 'Figura-4 deitado, uma perna de cada vez.' },
              { id: 'fund-along-qua-d3', tipo: 'tarefa', xp: 14,
                nome: 'Quadril · 3', desc: 'Afundo baixo com apoio, sem forçar.' }
            ]
          },
          {
            id: 'fund-along-tronco', tier: 2, col: 3, ranksMax: 3,
            nome: 'Coluna & Tronco', icone: 'mdi-spa-outline',
            resumo: 'Mobiliza a coluna e alonga o tronco com controle.',
            requer: ['fund-along-aquece'],
            niveis: [
              'Gato-camelo, movimento lento.',
              'Rotação de tronco sentado, ambos os lados.',
              'Alongamento lateral em pé, braço acima da cabeça.'
            ],
            desafios: [
              { id: 'fund-along-tro-d1', tipo: 'tarefa', xp: 10,
                nome: 'Tronco · 1', desc: 'Gato-camelo, 8 repetições lentas.' },
              { id: 'fund-along-tro-d2', tipo: 'tarefa', xp: 12,
                nome: 'Tronco · 2', desc: 'Rotação de tronco sentado, ambos os lados.' },
              { id: 'fund-along-tro-d3', tipo: 'tarefa', xp: 14,
                nome: 'Tronco · 3', desc: 'Alongamento lateral em pé, sem forçar a lombar.' }
            ]
          },

          /* -------- FAIXA 3 · CONCLUSÃO (título do card) -------- */
          {
            id: 'fund-along-titulo', tier: 3, col: 2, tipo: 'titulo', ranksMax: 1,
            nome: 'Alongamentos ✓', icone: 'mdi-medal-outline',
            resumo: 'Conclusão do card Alongamentos — corpo aquecido e mais solto, ' +
                    'pronto para começar os fundamentos.',
            requer: ['fund-along-pernas', 'fund-along-quadril', 'fund-along-tronco'],
            niveis: ['Card concluído — corpo pronto para os fundamentos.'],
            desafios: []
          }
        ]
      },

      /* ============================================================
         CARD 2 · FUNDAMENTOS  (reorganizado — sem o nó duplicado)
         ============================================================ */
      {
        id: 'fundamentos',
        nome: 'Fundamentos',
        segmento: 'Temporada Free',
        icone: 'mdi-seed-outline',
        xpLabel: 'XPE de Fundamentos',
        resumo: 'A porta de entrada: os cinco eixos do movimento e os primeiros ' +
                '15 passos [ BÁSICO ] de Hip Hop Dance e Popping. Sem alocar pontos — ' +
                'cada desafio concluído faz o nó evoluir.',
        tiers: [
          { n: 1, nome: 'Eixos do Movimento' },
          { n: 2, nome: 'Fluxo de Movimentos' },
          { n: 3, nome: 'Primeiros Passos' },
          { n: 4, nome: 'Combinações' },
          { n: 5, nome: 'Conclusão' }
        ],
        habilidades: [

          /* ---------------- FAIXA 1 · EIXOS BASE (sem pré-requisito) ---------------- */
          {
            id: 'fund-pulso', tier: 1, col: 1, ranksMax: 4,
            nome: 'Pulso', icone: 'mdi-pulse',
            resumo: 'A pulsação do corpo no tempo da música — antes de qualquer passo.',
            requer: [],
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
            requer: [],
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
            requer: [],
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

          /* ---------------- FAIXA 2 · ISOLAÇÃO & FLUXO ---------------- */
          {
            id: 'fund-circulares', tier: 2, col: 1, ranksMax: 5,
            nome: 'Movimentos Circulares', icone: 'mdi-rotate-3d-variant',
            resumo: 'Círculos por articulação — a base da isolação.',
            requer: ['fund-pulso', 'fund-balancos'],
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
            id: 'fund-ondulacoes', tier: 2, col: 3, ranksMax: 5,
            nome: 'Ondulações', icone: 'mdi-wave',
            resumo: 'A continuidade entre segmentos: o movimento viaja pelo corpo.',
            requer: ['fund-balancos', 'fund-caminhadas'],
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

          /* ---------------- FAIXA 3 · PRIMEIROS PASSOS (catálogo [ BÁSICO ]) ---------------- */
          {
            id: 'fund-vocab-hiphop', tier: 3, col: 1, ranksMax: 8,
            nome: 'Vocabulário Hip Hop', icone: 'mdi-shoe-sneaker',
            resumo: 'Os 8 primeiros passos [ BÁSICO ] de Hip Hop Dance do catálogo.',
            requer: ['fund-circulares', 'fund-ondulacoes'],
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
            id: 'fund-vocab-popping', tier: 3, col: 3, ranksMax: 7,
            nome: 'Vocabulário Popping', icone: 'mdi-flash-outline',
            resumo: 'Os 7 primeiros passos [ BÁSICO ] de Popping do catálogo.',
            requer: ['fund-circulares', 'fund-ondulacoes'],
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


          /* ---------------- FAIXA 4  COMBINAÇÕES E SEQUÊNCIA COREOGRÁFICA ---------------*/
          {
            "id": "fund-coreo",
            "tier": 4,
            "col": 2,
            "ranksMax": 3,
            "nome": "Sequência Coreográfica",
            "icone": "mdi-music-note-eighth",
            "resumo": "Frase curta com o vocabulário desta rodada.",
            "requer": [
                'fund-vocab-hiphop',
                'fund-vocab-popping'
            ],
            "niveis": [
                "Parte A.",
                "Parte B.",
                "A+B no tempo, com feeling."
            ],
            "desafios": [
                {
                    "id": "fund-coreo-d1",
                    "tipo": "tarefa",
                    "xp": 16,
                    "nome": "Sequência Coreográfica · 1",
                    "desc": "Parte A."
                },
                {
                    "id": "fund-coreo-d2",
                    "tipo": "tarefa",
                    "xp": 18,
                    "nome": "Sequência Coreográfica · 2",
                    "desc": "Parte B."
                },
                {
                    "id": "fund-coreo-d3",
                    "tipo": "tarefa",
                    "xp": 20,
                    "nome": "Sequência Coreográfica · 3",
                    "desc": "A+B no tempo, com feeling."
                }
              ]
            },
          
          /* ---------------- FAIXA 5 · INSÍGNIA (conclusão da temporada) ---------------- */
          {
            id: 'fund-insignia', tier: 5, col: 2, tipo: 'insignia', ranksMax: 1,
            nome: 'Fundamentos Concluídos', icone: 'mdi-medal-outline',
            resumo: 'Insígnia permanente e cumulativa. Registra a conclusão da ' +
                    'Temporada 1 e torna o membro elegível à promoção para Iniciante. ' +
                    'Não habilita nada fora da plataforma — não é um título de carreira.',
            requer: ['fund-coreo'],
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