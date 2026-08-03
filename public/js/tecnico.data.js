/**
 * UP DANCE EXPERIENCE — NÍVEL TÉCNICO — 3 CARDS LADO A LADO
 * Card 1 · Preparo Motor           (aquecimento, alongamento, guias do movimento, coordenação motora)
 * Card 2 · House Dance & Up Rock I  (introdução, história, musicalidade, improviso, composição,
 *                                    forma-variações-estado, Up Rock: fundação e ataques-drops)
 * Card 3 · House Dance & Up Rock II (sequência, formas, geometrias, fluxo, níveis, complexidade,
 *                                    personagens, coreografia autoral, Up Rock: solo e virtuosismo)
 * Backend: perfil_id 'tecnico' (runtime.perfilId) — o split em colunas é só disposição visual.
 * Prefixo global de IDs: 'tec-*' (evita colisão com fund-* / iniciante / intermediario / arvore).
 * Up Rock: 4 nós × 5 desafios = 20 desafios cobrindo os 23 movimentos catalogados
 *          (aba BREAKING STEPS · col E — 3 pares afins agrupados no último desafio de 3 nós).
 * limiarXPE = soma de TODO o XP dos desafios (derivado; ver worker_trilhas.js).
 *   Cálculo:  Card1 =  5 nós × 100 + 30      =  530
 *             Card2 =  8 nós × 175 + 40      = 1440   (era 6 nós = 1090; +2 nós Up Rock)
 *             Card3 = 11 nós × 190 + 60      = 2150   (era 9 nós = 1770; +2 nós Up Rock)
 *             TOTAL                          = 4120
 */
(function (global) {
  'use strict';
  var F = {
    versao: '1.0.0',
    temporada: {
      id: 'TECNICO',
      nome: 'Técnico',
      nivelAlvo: 'Técnico',
      promovePara: 'Estagiário(a)',
      limiarXPE: 4120
    },
    runtime: {
      perfilId:   'tecnico',
      resource:   'nivel-tecnico',
      chaveLocal: 'udx:tecnico:v1',
      insigniaId: 'tec-insignia',
      api: { me: '/api/me', estado: '/api/trilha/estado?perfil=tecnico', desafio: '/api/trilha/desafio' }
    },
    tiposComAcesso: ['Técnico', 'Estagiário(a)', 'Monitor(a)', 'Assistente', 'Professor(a)', 'Premium'],
    tiposDesafio: {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    },
    perfis: [

      /* ============================================================
         CARD 1 · PREPARO MOTOR
         ============================================================ */
      {
        id: 'prep-tec',
        nome: 'Preparo Motor',
        segmento: 'Aquecer, alongar, coordenar',
        icone: 'mdi-run-fast',
        xpLabel: 'Preparo',
        tiers: [
          { n: 1, nome: 'Ativação' },
          { n: 2, nome: 'Vocabulário do Corpo' },
          { n: 3, nome: 'Conclusão' }
        ],
        habilidades: [
          {
            id: 'tec-prep-aquec',
            tier: 1, col: 1, ranksMax: 5,
            nome: 'Aquecimento Dinâmico', icone: 'mdi-heart-pulse',
            resumo: 'Eleva a temperatura corporal em ritmo progressivo.',
            requer: [],
            niveis: ['Marcha e balanço.', 'Elevação de joelhos.', 'Skip em ritmo.', 'Deslocamentos leves.', 'Aquecimento em música.'],
            desafios: [
              { id: 'tec-prep-aquec-d1', tipo: 'tarefa', xp: 16, nome: 'Aquecimento · 1', desc: 'Marcha e balanço por 3 minutos.' },
              { id: 'tec-prep-aquec-d2', tipo: 'tarefa', xp: 18, nome: 'Aquecimento · 2', desc: 'Elevação de joelhos + braços coordenados.' },
              { id: 'tec-prep-aquec-d3', tipo: 'tarefa', xp: 20, nome: 'Aquecimento · 3', desc: 'Skip alternado, 3 séries.' },
              { id: 'tec-prep-aquec-d4', tipo: 'tarefa', xp: 22, nome: 'Aquecimento · 4', desc: 'Deslocamentos laterais e frontais.' },
              { id: 'tec-prep-aquec-d5', tipo: 'tarefa', xp: 24, nome: 'Aquecimento · 5', desc: 'Sequência de aquecimento em música (5 min).' }
            ]
          },
          {
            id: 'tec-prep-mobil',
            tier: 1, col: 2, ranksMax: 5,
            nome: 'Mobilidade Dinâmica', icone: 'mdi-rotate-3d-variant',
            resumo: 'Ganho de amplitude com movimento — sem paradas.',
            requer: [],
            niveis: ['Coluna e ombros.', 'Quadril e joelhos.', 'Punhos, cotovelos, tornozelos.', 'Cadeias diagonais.', 'Sequência integrada.'],
            desafios: [
              { id: 'tec-prep-mobil-d1', tipo: 'tarefa', xp: 16, nome: 'Mobilidade · 1', desc: 'Círculos amplos de ombros e coluna.' },
              { id: 'tec-prep-mobil-d2', tipo: 'tarefa', xp: 18, nome: 'Mobilidade · 2', desc: 'Círculos de quadril e joelhos em base larga.' },
              { id: 'tec-prep-mobil-d3', tipo: 'tarefa', xp: 20, nome: 'Mobilidade · 3', desc: 'Extremidades: punhos, cotovelos, tornozelos.' },
              { id: 'tec-prep-mobil-d4', tipo: 'tarefa', xp: 22, nome: 'Mobilidade · 4', desc: 'Cadeias diagonais braço-quadril-perna.' },
              { id: 'tec-prep-mobil-d5', tipo: 'tarefa', xp: 24, nome: 'Mobilidade · 5', desc: 'Sequência integrada de 8 movimentos.' }
            ]
          },
          {
            id: 'tec-prep-along',
            tier: 2, col: 1, ranksMax: 5,
            nome: 'Alongamento Ativo', icone: 'mdi-yoga',
            resumo: 'Alongamento com sustentação de posturas.',
            requer: ['tec-prep-aquec', 'tec-prep-mobil'],
            niveis: ['Cadeia posterior.', 'Cadeia anterior.', 'Rotadores de quadril.', 'Coluna lateral.', 'Fluxo completo.'],
            desafios: [
              { id: 'tec-prep-along-d1', tipo: 'tarefa', xp: 16, nome: 'Alongamento · 1', desc: 'Panturrilhas e isquiotibiais em pé.' },
              { id: 'tec-prep-along-d2', tipo: 'tarefa', xp: 18, nome: 'Alongamento · 2', desc: 'Quadríceps e flexores do quadril.' },
              { id: 'tec-prep-along-d3', tipo: 'tarefa', xp: 20, nome: 'Alongamento · 3', desc: 'Rotadores externos e internos.' },
              { id: 'tec-prep-along-d4', tipo: 'tarefa', xp: 22, nome: 'Alongamento · 4', desc: 'Coluna lateral e torácica.' },
              { id: 'tec-prep-along-d5', tipo: 'tarefa', xp: 24, nome: 'Alongamento · 5', desc: 'Fluxo alongamento completo (6 min).' }
            ]
          },
          {
            id: 'tec-prep-guias',
            tier: 2, col: 2, ranksMax: 5,
            nome: 'Guias do Movimento', icone: 'mdi-compass-outline',
            resumo: 'Eixos, planos e direções que orientam o corpo.',
            requer: ['tec-prep-aquec', 'tec-prep-mobil'],
            niveis: ['Três eixos.', 'Três planos.', 'Direções cardinais.', 'Rotações combinadas.', 'Trajetórias no espaço.'],
            desafios: [
              { id: 'tec-prep-guias-d1', tipo: 'tarefa', xp: 16, nome: 'Guias · 1', desc: 'Marcar os três eixos do corpo.' },
              { id: 'tec-prep-guias-d2', tipo: 'tarefa', xp: 18, nome: 'Guias · 2', desc: 'Explorar planos sagital, frontal, transverso.' },
              { id: 'tec-prep-guias-d3', tipo: 'tarefa', xp: 20, nome: 'Guias · 3', desc: 'Deslocamento em 8 direções cardinais.' },
              { id: 'tec-prep-guias-d4', tipo: 'tarefa', xp: 22, nome: 'Guias · 4', desc: 'Rotações combinadas em duas partes do corpo.' },
              { id: 'tec-prep-guias-d5', tipo: 'tarefa', xp: 24, nome: 'Guias · 5', desc: 'Trajetória complexa no espaço com música.' }
            ]
          },
          {
            id: 'tec-prep-coord',
            tier: 2, col: 3, ranksMax: 5,
            nome: 'Coordenação Motora', icone: 'mdi-hand-back-right-outline',
            resumo: 'Dissociar e sincronizar partes distintas do corpo.',
            requer: ['tec-prep-aquec', 'tec-prep-mobil'],
            niveis: ['Braço vs perna.', 'Alto vs baixo.', 'Ritmo diferente por lado.', 'Poliritmia simples.', 'Sequência coordenada.'],
            desafios: [
              { id: 'tec-prep-coord-d1', tipo: 'tarefa', xp: 16, nome: 'Coordenação · 1', desc: 'Braço direito e perna esquerda em ritmos distintos.' },
              { id: 'tec-prep-coord-d2', tipo: 'tarefa', xp: 18, nome: 'Coordenação · 2', desc: 'Alto do corpo mantendo pulso; base fazendo passo.' },
              { id: 'tec-prep-coord-d3', tipo: 'tarefa', xp: 20, nome: 'Coordenação · 3', desc: 'Lado direito em 2 tempos; esquerdo em 3.' },
              { id: 'tec-prep-coord-d4', tipo: 'tarefa', xp: 22, nome: 'Coordenação · 4', desc: 'Poliritmia braço + perna + cabeça.' },
              { id: 'tec-prep-coord-d5', tipo: 'tarefa', xp: 24, nome: 'Coordenação · 5', desc: 'Sequência de 8 tempos com coordenação plena.' }
            ]
          },
          {
            id: 'tec-prep-titulo',
            tier: 3, col: 1, ranksMax: 1,
            nome: 'Preparo Motor ✓', icone: 'mdi-medal-outline',
            resumo: 'Conclusão do card de Preparo Motor.',
            tipo: 'titulo',
            requer: ['tec-prep-along', 'tec-prep-guias', 'tec-prep-coord'],
            niveis: ['Card concluído.'],
            desafios: [
              { id: 'tec-prep-titulo-d1', tipo: 'atividade', xp: 30, nome: 'Selo · Preparo Motor', desc: 'Marcado pela coordenação após revisão dos 5 nós.' }
            ]
          }
        ]
      },

      /* ============================================================
         CARD 2 · HOUSE DANCE I
         ============================================================ */
      {
        id: 'hdi-tec',
        nome: 'House Dance & Up Rock I',
        segmento: 'House Dance e Up Rock: introdução, escuta, criação, vocabulário',
        icone: 'mdi-music-circle-outline',
        xpLabel: 'HD & UR I',
        tiers: [
          { n: 1, nome: 'Introdução & Contexto' },
          { n: 2, nome: 'Escuta, criação & vocabulário' },
          { n: 3, nome: 'Composição' },
          { n: 4, nome: 'Conclusão' }
        ],
        habilidades: [
          {
            id: 'tec-hdi-intro',
            tier: 1, col: 1, ranksMax: 5,
            nome: 'Introdução ao House Dance', icone: 'mdi-account-music-outline',
            resumo: 'O que é House Dance como linguagem — cinco camadas.',
            requer: [],
            niveis: ['Jack.', 'Footwork.', 'Lofting.', 'Fluidez.', 'Groove próprio.'],
            desafios: [
              { id: 'tec-hdi-intro-d1', tipo: 'tarefa', xp: 25, nome: 'Introdução · 1', desc: 'Explorar Jack em três velocidades.' },
              { id: 'tec-hdi-intro-d2', tipo: 'tarefa', xp: 30, nome: 'Introdução · 2', desc: 'Footwork básico em base 4/4.' },
              { id: 'tec-hdi-intro-d3', tipo: 'tarefa', xp: 35, nome: 'Introdução · 3', desc: 'Ida ao chão — lofting elementar.' },
              { id: 'tec-hdi-intro-d4', tipo: 'tarefa', xp: 40, nome: 'Introdução · 4', desc: 'Fluidez de tronco integrada ao Jack.' },
              { id: 'tec-hdi-intro-d5', tipo: 'atividade', xp: 45, nome: 'Introdução · 5', desc: 'Vídeo curto (30s) demonstrando as 4 camadas.' }
            ]
          },
          {
            id: 'tec-hdi-hist',
            tier: 1, col: 2, ranksMax: 5,
            nome: 'História do House Dance', icone: 'mdi-timeline-outline',
            resumo: 'Chicago, Nova York, França: origens e disseminação.',
            requer: [],
            niveis: ['Chicago.', 'Nova York.', 'Loft & club culture.', 'França e Europa.', 'Cena atual.'],
            desafios: [
              { id: 'tec-hdi-hist-d1', tipo: 'tarefa', xp: 25, nome: 'História · 1', desc: 'Resumo de 1 parágrafo: Chicago e o Warehouse.' },
              { id: 'tec-hdi-hist-d2', tipo: 'tarefa', xp: 30, nome: 'História · 2', desc: 'Resumo de 1 parágrafo: NY e o Paradise Garage.' },
              { id: 'tec-hdi-hist-d3', tipo: 'tarefa', xp: 35, nome: 'História · 3', desc: 'Loft & club culture — o vocabulário se forma.' },
              { id: 'tec-hdi-hist-d4', tipo: 'tarefa', xp: 40, nome: 'História · 4', desc: 'Chegada à França e à Europa.' },
              { id: 'tec-hdi-hist-d5', tipo: 'atividade', xp: 45, nome: 'História · 5', desc: 'Apontar 3 referências vivas na cena atual.' }
            ]
          },
          {
            id: 'tec-uprock-fund',
            tier: 1, col: 3, ranksMax: 5,
            nome: 'Up Rock — Fundação', icone: 'mdi-boxing-glove',
            resumo: 'Rocks básicos e arm punches — o vocabulário-fundação do Up Rock.',
            requer: [],
            niveis: ['Front-back-down.', 'Step-front step-back.', 'Side-to-side.', 'Arm punch base.', 'Combinações.'],
            desafios: [
              { id: 'tec-uprock-fund-d1', tipo: 'tarefa',    xp: 25, nome: 'Fundação · 1', desc: 'Front Back and Down em base 4/4.' },
              { id: 'tec-uprock-fund-d2', tipo: 'tarefa',    xp: 30, nome: 'Fundação · 2', desc: 'Step Front–Step Back and Down.' },
              { id: 'tec-uprock-fund-d3', tipo: 'tarefa',    xp: 35, nome: 'Fundação · 3', desc: 'Side to Side–Front–Back and Down.' },
              { id: 'tec-uprock-fund-d4', tipo: 'tarefa',    xp: 40, nome: 'Fundação · 4', desc: 'Arm Punch–Front–Back and Down.' },
              { id: 'tec-uprock-fund-d5', tipo: 'atividade', xp: 45, nome: 'Fundação · 5', desc: 'Combinar Arm Punch–Roll e Arm Punch–Kick em 8 tempos.' }
            ]
          },
          {
            id: 'tec-hdi-music',
            tier: 2, col: 1, ranksMax: 5,
            nome: 'Musicalidade', icone: 'mdi-metronome',
            resumo: 'Escutar antes de dançar: batida, contratempo, camadas.',
            requer: ['tec-hdi-intro', 'tec-hdi-hist'],
            niveis: ['Batida forte.', 'Contratempo.', 'Camada rítmica.', 'Camada melódica.', 'Diálogo com a música.'],
            desafios: [
              { id: 'tec-hdi-music-d1', tipo: 'tarefa', xp: 25, nome: 'Musicalidade · 1', desc: 'Marcar batida forte com pés.' },
              { id: 'tec-hdi-music-d2', tipo: 'tarefa', xp: 30, nome: 'Musicalidade · 2', desc: 'Marcar contratempo com o corpo.' },
              { id: 'tec-hdi-music-d3', tipo: 'tarefa', xp: 35, nome: 'Musicalidade · 3', desc: 'Escolher uma camada rítmica para dançar.' },
              { id: 'tec-hdi-music-d4', tipo: 'tarefa', xp: 40, nome: 'Musicalidade · 4', desc: 'Escolher uma camada melódica para dançar.' },
              { id: 'tec-hdi-music-d5', tipo: 'atividade', xp: 45, nome: 'Musicalidade · 5', desc: 'Vídeo (45s) dialogando com 3 camadas distintas.' }
            ]
          },
          {
            id: 'tec-hdi-improv',
            tier: 2, col: 2, ranksMax: 5,
            nome: 'Improviso', icone: 'mdi-shuffle-variant',
            resumo: 'Dançar sem sequência pronta — freestyle guiado.',
            requer: ['tec-hdi-intro', 'tec-hdi-hist'],
            niveis: ['30 segundos.', '1 minuto.', '2 minutos.', 'Com restrição.', 'Cypher.'],
            desafios: [
              { id: 'tec-hdi-improv-d1', tipo: 'tarefa', xp: 25, nome: 'Improviso · 1', desc: 'Freestyle de 30s em uma música só.' },
              { id: 'tec-hdi-improv-d2', tipo: 'tarefa', xp: 30, nome: 'Improviso · 2', desc: 'Freestyle de 1 min mudando de música no meio.' },
              { id: 'tec-hdi-improv-d3', tipo: 'tarefa', xp: 35, nome: 'Improviso · 3', desc: 'Freestyle de 2 min com câmera parada.' },
              { id: 'tec-hdi-improv-d4', tipo: 'tarefa', xp: 40, nome: 'Improviso · 4', desc: 'Freestyle com restrição (ex.: só Jack).' },
              { id: 'tec-hdi-improv-d5', tipo: 'evento',  xp: 45, nome: 'Improviso · 5', desc: 'Participar de 1 cypher da comunidade.' }
            ]
          },
          {
            id: 'tec-uprock-atq',
            tier: 2, col: 3, ranksMax: 5,
            nome: 'Up Rock — Ataques & Drops', icone: 'mdi-arrow-down-bold-circle-outline',
            resumo: 'Jumps, drops e finalizações teatrais que marcam o gesto.',
            requer: ['tec-uprock-fund'],
            niveis: ['Jump to side.', 'Jump with turn.', 'Drop de joelho.', 'Drop lateral.', 'Dolphin drop.'],
            desafios: [
              { id: 'tec-uprock-atq-d1', tipo: 'tarefa',    xp: 25, nome: 'Ataques · 1', desc: 'Jump to Side–Back Knee and Down.' },
              { id: 'tec-uprock-atq-d2', tipo: 'tarefa',    xp: 30, nome: 'Ataques · 2', desc: 'Jump to Side–Back Knee Turn and Down.' },
              { id: 'tec-uprock-atq-d3', tipo: 'tarefa',    xp: 35, nome: 'Ataques · 3', desc: 'Drop Knee to Front.' },
              { id: 'tec-uprock-atq-d4', tipo: 'tarefa',    xp: 40, nome: 'Ataques · 4', desc: 'Drop to Side.' },
              { id: 'tec-uprock-atq-d5', tipo: 'atividade', xp: 45, nome: 'Ataques · 5', desc: 'Dolphin Drop com aterrissagem controlada.' }
            ]
          },
          {
            id: 'tec-hdi-comp',
            tier: 3, col: 1, ranksMax: 5,
            nome: 'Composição Coreográfica', icone: 'mdi-pencil-ruler',
            resumo: 'Escolher, ordenar e conectar movimentos.',
            requer: ['tec-hdi-music', 'tec-hdi-improv'],
            niveis: ['Escolher 4 movimentos.', 'Ordenar em música.', 'Adicionar transições.', 'Loop de 8 tempos.', 'Frase de 16 tempos.'],
            desafios: [
              { id: 'tec-hdi-comp-d1', tipo: 'tarefa', xp: 25, nome: 'Composição · 1', desc: 'Escolher 4 movimentos da aula.' },
              { id: 'tec-hdi-comp-d2', tipo: 'tarefa', xp: 30, nome: 'Composição · 2', desc: 'Ordená-los em uma música específica.' },
              { id: 'tec-hdi-comp-d3', tipo: 'tarefa', xp: 35, nome: 'Composição · 3', desc: 'Adicionar transições entre os 4.' },
              { id: 'tec-hdi-comp-d4', tipo: 'tarefa', xp: 40, nome: 'Composição · 4', desc: 'Loop coerente de 8 tempos.' },
              { id: 'tec-hdi-comp-d5', tipo: 'atividade', xp: 45, nome: 'Composição · 5', desc: 'Frase autoral de 16 tempos.' }
            ]
          },
          {
            id: 'tec-hdi-mfv',
            tier: 3, col: 2, ranksMax: 5,
            nome: 'Movimento • Forma • Variações • Estado', icone: 'mdi-shape-outline',
            resumo: 'Um movimento gera muitos — variações e estado.',
            requer: ['tec-hdi-music', 'tec-hdi-improv', 'tec-uprock-atq'],
            niveis: ['Um movimento.', 'Duas formas.', 'Quatro variações.', 'Estado neutro.', 'Estado presente.'],
            desafios: [
              { id: 'tec-hdi-mfv-d1', tipo: 'tarefa', xp: 25, nome: 'MFV · 1', desc: 'Escolher 1 movimento-base.' },
              { id: 'tec-hdi-mfv-d2', tipo: 'tarefa', xp: 30, nome: 'MFV · 2', desc: 'Extrair 2 formas dele.' },
              { id: 'tec-hdi-mfv-d3', tipo: 'tarefa', xp: 35, nome: 'MFV · 3', desc: 'Gerar 4 variações (velocidade, amplitude, direção, textura).' },
              { id: 'tec-hdi-mfv-d4', tipo: 'tarefa', xp: 40, nome: 'MFV · 4', desc: 'Executar em estado neutro (sem dramatização).' },
              { id: 'tec-hdi-mfv-d5', tipo: 'atividade', xp: 45, nome: 'MFV · 5', desc: 'Executar em estado presente, escolhendo intenção.' }
            ]
          },
          {
            id: 'tec-hdi-titulo',
            tier: 4, col: 2, ranksMax: 1,
            nome: 'House Dance & Up Rock I ✓', icone: 'mdi-medal-outline',
            resumo: 'Conclusão do card House Dance & Up Rock I.',
            tipo: 'titulo',
            requer: ['tec-hdi-comp', 'tec-hdi-mfv'],
            niveis: ['Card concluído.'],
            desafios: [
              { id: 'tec-hdi-titulo-d1', tipo: 'atividade', xp: 40, nome: 'Selo · House Dance & Up Rock I', desc: 'Marcado pela coordenação após revisão dos 8 nós.' }
            ]
          }
        ]
      },

      /* ============================================================
         CARD 3 · HOUSE DANCE II
         ============================================================ */
      {
        id: 'hdii-tec',
        nome: 'House Dance & Up Rock II',
        segmento: 'House Dance e Up Rock: sequência, palco, autoria, virtuosismo',
        icone: 'mdi-drama-masks',
        xpLabel: 'HD & UR II',
        tiers: [
          { n: 1, nome: 'Vocabulário Avançado' },
          { n: 2, nome: 'Bases avançadas' },
          { n: 3, nome: 'Espaço cênico' },
          { n: 4, nome: 'Vocabulário expandido' },
          { n: 5, nome: 'Autoria' },
          { n: 6, nome: 'Conclusão' }
        ],
        habilidades: [
          {
            id: 'tec-hdii-hd2',
            tier: 1, col: 2, ranksMax: 5,
            nome: 'House Dance II', icone: 'mdi-account-music',
            resumo: 'Vocabulário avançado do estilo — a fundação de tudo que vem depois.',
            requer: [],
            niveis: ['Skate & Farmer.', 'Loose legs & Heel toe.', 'Salsa & Pas-de-bourrée.', 'Tres pontos & Chariot.', 'Combinações do vocabulário.'],
            desafios: [
              { id: 'tec-hdii-hd2-d1', tipo: 'tarefa', xp: 30, nome: 'HD II · 1', desc: 'Executar Skate e Farmer em base 4/4.' },
              { id: 'tec-hdii-hd2-d2', tipo: 'tarefa', xp: 34, nome: 'HD II · 2', desc: 'Loose legs e Heel toe em fluxo contínuo.' },
              { id: 'tec-hdii-hd2-d3', tipo: 'tarefa', xp: 38, nome: 'HD II · 3', desc: 'Salsa e Pas-de-bourrée alternados.' },
              { id: 'tec-hdii-hd2-d4', tipo: 'tarefa', xp: 42, nome: 'HD II · 4', desc: 'Tres pontos e Chariot com deslocamento.' },
              { id: 'tec-hdii-hd2-d5', tipo: 'atividade', xp: 46, nome: 'HD II · 5', desc: 'Combinar 4 elementos em 16 tempos.' }
            ]
          },
          {
            id: 'tec-hdii-seq',
            tier: 2, col: 1, ranksMax: 5,
            nome: 'Sequência Coreográfica', icone: 'mdi-format-list-numbered',
            resumo: 'Sequência longa: memorizar, refinar, entregar.',
            requer: ['tec-hdii-hd2'],
            niveis: ['16 tempos.', '32 tempos.', 'Com transições.', 'Com dinâmica.', 'Com intenção.'],
            desafios: [
              { id: 'tec-hdii-seq-d1', tipo: 'tarefa', xp: 30, nome: 'Sequência · 1', desc: 'Sequência de 16 tempos memorizada.' },
              { id: 'tec-hdii-seq-d2', tipo: 'tarefa', xp: 34, nome: 'Sequência · 2', desc: 'Extensão para 32 tempos.' },
              { id: 'tec-hdii-seq-d3', tipo: 'tarefa', xp: 38, nome: 'Sequência · 3', desc: 'Adicionar transições coreografadas.' },
              { id: 'tec-hdii-seq-d4', tipo: 'tarefa', xp: 42, nome: 'Sequência · 4', desc: 'Dinâmica de energia (crescendo, pausa).' },
              { id: 'tec-hdii-seq-d5', tipo: 'atividade', xp: 46, nome: 'Sequência · 5', desc: 'Entrega com intenção definida.' }
            ]
          },
          {
            id: 'tec-hdii-form',
            tier: 2, col: 2, ranksMax: 5,
            nome: 'Formas Coreográficas', icone: 'mdi-shape-plus',
            resumo: 'Repetição, canon, unísono, contraste — arquitetura da dança.',
            requer: ['tec-hdii-hd2'],
            niveis: ['Repetição.', 'Unísono.', 'Canon.', 'Contraste.', 'Combinação livre.'],
            desafios: [
              { id: 'tec-hdii-form-d1', tipo: 'tarefa', xp: 30, nome: 'Formas · 1', desc: 'Trabalhar com repetição direta.' },
              { id: 'tec-hdii-form-d2', tipo: 'tarefa', xp: 34, nome: 'Formas · 2', desc: 'Unísono com par ou grupo.' },
              { id: 'tec-hdii-form-d3', tipo: 'tarefa', xp: 38, nome: 'Formas · 3', desc: 'Canon (defasagem coreográfica).' },
              { id: 'tec-hdii-form-d4', tipo: 'tarefa', xp: 42, nome: 'Formas · 4', desc: 'Contraste — dois materiais opostos.' },
              { id: 'tec-hdii-form-d5', tipo: 'atividade', xp: 46, nome: 'Formas · 5', desc: 'Combinação livre com 3 formas.' }
            ]
          },
          {
            id: 'tec-uprock-solo',
            tier: 2, col: 3, ranksMax: 5,
            nome: 'Up Rock — Solo & Deslocamentos', icone: 'mdi-run',
            resumo: 'Solos de chão, shifts e deslocamentos que costuram o palco.',
            requer: ['tec-hdii-hd2'],
            niveis: ['Suicide.', 'Ground drop.', 'Shift.', 'Double shift.', 'Worm.'],
            desafios: [
              { id: 'tec-uprock-solo-d1', tipo: 'tarefa',    xp: 30, nome: 'Solo · 1', desc: 'Suicide com aterrissagem controlada.' },
              { id: 'tec-uprock-solo-d2', tipo: 'tarefa',    xp: 34, nome: 'Solo · 2', desc: 'Ground Drop com transição para o próximo passo.' },
              { id: 'tec-uprock-solo-d3', tipo: 'tarefa',    xp: 38, nome: 'Solo · 3', desc: 'Shift com deslocamento no espaço.' },
              { id: 'tec-uprock-solo-d4', tipo: 'tarefa',    xp: 42, nome: 'Solo · 4', desc: 'Double Shift em par ou dueto.' },
              { id: 'tec-uprock-solo-d5', tipo: 'atividade', xp: 46, nome: 'Solo · 5', desc: 'Worm executado em 8 tempos com fluidez.' }
            ]
          },
          {
            id: 'tec-hdii-geo',
            tier: 3, col: 1, ranksMax: 5,
            nome: 'Geometrias & Transições no Palco', icone: 'mdi-vector-square',
            resumo: 'Ocupar o espaço com desenho e transições visíveis.',
            requer: ['tec-hdii-seq', 'tec-hdii-form'],
            niveis: ['Ponto central.', 'Diagonal.', 'Círculo.', 'Formação e desformação.', 'Trajetórias sobrepostas.'],
            desafios: [
              { id: 'tec-hdii-geo-d1', tipo: 'tarefa', xp: 30, nome: 'Geometria · 1', desc: 'Ocupar o centro do palco.' },
              { id: 'tec-hdii-geo-d2', tipo: 'tarefa', xp: 34, nome: 'Geometria · 2', desc: 'Deslocar na diagonal (upstage-downstage).' },
              { id: 'tec-hdii-geo-d3', tipo: 'tarefa', xp: 38, nome: 'Geometria · 3', desc: 'Trajetória circular no palco.' },
              { id: 'tec-hdii-geo-d4', tipo: 'tarefa', xp: 42, nome: 'Geometria · 4', desc: 'Formação e desformação em par/grupo.' },
              { id: 'tec-hdii-geo-d5', tipo: 'atividade', xp: 46, nome: 'Geometria · 5', desc: 'Trajetórias sobrepostas com par.' }
            ]
          },
          {
            id: 'tec-hdii-flux',
            tier: 3, col: 2, ranksMax: 5,
            nome: 'Fluxo e Contra-Fluxo', icone: 'mdi-swap-horizontal-bold',
            resumo: 'Ir com e ir contra a energia da música e do grupo.',
            requer: ['tec-hdii-seq', 'tec-hdii-form'],
            niveis: ['Fluxo com música.', 'Contra-fluxo pontual.', 'Fluxo com par.', 'Contra-fluxo com par.', 'Alternância consciente.'],
            desafios: [
              { id: 'tec-hdii-flux-d1', tipo: 'tarefa', xp: 30, nome: 'Fluxo · 1', desc: 'Ir com a batida — 16 tempos.' },
              { id: 'tec-hdii-flux-d2', tipo: 'tarefa', xp: 34, nome: 'Fluxo · 2', desc: 'Ir contra a batida em 4 tempos escolhidos.' },
              { id: 'tec-hdii-flux-d3', tipo: 'tarefa', xp: 38, nome: 'Fluxo · 3', desc: 'Fluxo em unísono com par.' },
              { id: 'tec-hdii-flux-d4', tipo: 'tarefa', xp: 42, nome: 'Fluxo · 4', desc: 'Contra-fluxo em par (chamado e resposta).' },
              { id: 'tec-hdii-flux-d5', tipo: 'atividade', xp: 46, nome: 'Fluxo · 5', desc: 'Alternância consciente em coreografia.' }
            ]
          },
          {
            id: 'tec-uprock-virt',
            tier: 3, col: 3, ranksMax: 5,
            nome: 'Up Rock — Virtuosismo', icone: 'mdi-star-four-points',
            resumo: 'Acrobacias autorais que assinam o gesto no palco.',
            requer: ['tec-uprock-solo'],
            niveis: ['Donkey.', 'Macaco.', 'Neck spring.', 'Hand hop.', 'Combinação teatral.'],
            desafios: [
              { id: 'tec-uprock-virt-d1', tipo: 'tarefa',    xp: 30, nome: 'Virtuosismo · 1', desc: 'Donkey com aterrissagem em pé.' },
              { id: 'tec-uprock-virt-d2', tipo: 'tarefa',    xp: 34, nome: 'Virtuosismo · 2', desc: 'Macaco com controle de amplitude.' },
              { id: 'tec-uprock-virt-d3', tipo: 'tarefa',    xp: 38, nome: 'Virtuosismo · 3', desc: 'Neck Spring — base e variação Half Twist.' },
              { id: 'tec-uprock-virt-d4', tipo: 'tarefa',    xp: 42, nome: 'Virtuosismo · 4', desc: 'Hand Hop em 3 repetições contínuas.' },
              { id: 'tec-uprock-virt-d5', tipo: 'atividade', xp: 46, nome: 'Virtuosismo · 5', desc: 'Combinar Ninja e Coin Drop em finalização teatral.' }
            ]
          },
          {
            id: 'tec-hdii-niv',
            tier: 4, col: 1, ranksMax: 5,
            nome: 'Níveis', icone: 'mdi-format-vertical-align-center',
            resumo: 'Alto, médio, baixo — usar as três camadas verticais.',
            requer: ['tec-hdii-geo', 'tec-hdii-flux'],
            niveis: ['Alto.', 'Médio.', 'Baixo.', 'Transições verticais.', 'Composição em 3 níveis.'],
            desafios: [
              { id: 'tec-hdii-niv-d1', tipo: 'tarefa', xp: 30, nome: 'Níveis · 1', desc: '16 tempos em nível alto.' },
              { id: 'tec-hdii-niv-d2', tipo: 'tarefa', xp: 34, nome: 'Níveis · 2', desc: '16 tempos em nível médio.' },
              { id: 'tec-hdii-niv-d3', tipo: 'tarefa', xp: 38, nome: 'Níveis · 3', desc: '16 tempos em nível baixo.' },
              { id: 'tec-hdii-niv-d4', tipo: 'tarefa', xp: 42, nome: 'Níveis · 4', desc: 'Transições verticais coreografadas.' },
              { id: 'tec-hdii-niv-d5', tipo: 'atividade', xp: 46, nome: 'Níveis · 5', desc: 'Composição integrando 3 níveis em 32 tempos.' }
            ]
          },
          {
            id: 'tec-hdii-comp',
            tier: 4, col: 2, ranksMax: 5,
            nome: 'Complexidade de Movimentos', icone: 'mdi-graph-outline',
            resumo: 'Sobrepor camadas: partes distintas em ritmos distintos.',
            requer: ['tec-hdii-geo', 'tec-hdii-flux'],
            niveis: ['Duas camadas.', 'Três camadas.', 'Contratempo em uma camada.', 'Dissociação total.', 'Retorno à síntese.'],
            desafios: [
              { id: 'tec-hdii-comp-d1', tipo: 'tarefa', xp: 30, nome: 'Complexidade · 1', desc: 'Alto e baixo do corpo em ritmos distintos.' },
              { id: 'tec-hdii-comp-d2', tipo: 'tarefa', xp: 34, nome: 'Complexidade · 2', desc: 'Três camadas simultâneas.' },
              { id: 'tec-hdii-comp-d3', tipo: 'tarefa', xp: 38, nome: 'Complexidade · 3', desc: 'Contratempo em uma camada isolada.' },
              { id: 'tec-hdii-comp-d4', tipo: 'tarefa', xp: 42, nome: 'Complexidade · 4', desc: 'Dissociação total (4 elementos).' },
              { id: 'tec-hdii-comp-d5', tipo: 'atividade', xp: 46, nome: 'Complexidade · 5', desc: 'Retorno à síntese em 16 tempos.' }
            ]
          },
          {
            id: 'tec-hdii-pers',
            tier: 5, col: 1, ranksMax: 5,
            nome: 'Construção de Personagens', icone: 'mdi-drama-masks',
            resumo: 'A dança como narrativa — quem está dançando?',
            requer: ['tec-hdii-niv', 'tec-hdii-comp'],
            niveis: ['Atitude.', 'Ritmo próprio.', 'Postura assinada.', 'Arco emocional.', 'Personagem completo.'],
            desafios: [
              { id: 'tec-hdii-pers-d1', tipo: 'tarefa', xp: 30, nome: 'Personagem · 1', desc: 'Escolher uma atitude e sustentá-la 16 tempos.' },
              { id: 'tec-hdii-pers-d2', tipo: 'tarefa', xp: 34, nome: 'Personagem · 2', desc: 'Ritmo próprio (diferente da música).' },
              { id: 'tec-hdii-pers-d3', tipo: 'tarefa', xp: 38, nome: 'Personagem · 3', desc: 'Postura assinada (marca corporal).' },
              { id: 'tec-hdii-pers-d4', tipo: 'tarefa', xp: 42, nome: 'Personagem · 4', desc: 'Arco emocional em 32 tempos.' },
              { id: 'tec-hdii-pers-d5', tipo: 'atividade', xp: 46, nome: 'Personagem · 5', desc: 'Personagem completo em coreografia.' }
            ]
          },
          {
            id: 'tec-hdii-auto',
            tier: 5, col: 2, ranksMax: 5,
            nome: 'Coreografia Autoral', icone: 'mdi-fountain-pen-tip',
            resumo: 'Autor de si — criar, editar, entregar coreografia própria.',
            requer: ['tec-hdii-niv', 'tec-hdii-comp', 'tec-uprock-virt' ],
            niveis: ['Intenção.', 'Rascunho de 16 tempos.', 'Extensão para 32.', 'Edição e refinamento.', 'Entrega em vídeo.'],
            desafios: [
              { id: 'tec-hdii-auto-d1', tipo: 'tarefa', xp: 30, nome: 'Autoral · 1', desc: 'Definir intenção e música.' },
              { id: 'tec-hdii-auto-d2', tipo: 'tarefa', xp: 34, nome: 'Autoral · 2', desc: 'Rascunho de 16 tempos.' },
              { id: 'tec-hdii-auto-d3', tipo: 'tarefa', xp: 38, nome: 'Autoral · 3', desc: 'Extensão para 32 tempos.' },
              { id: 'tec-hdii-auto-d4', tipo: 'tarefa', xp: 42, nome: 'Autoral · 4', desc: 'Edição e refinamento (revisão gravada).' },
              { id: 'tec-hdii-auto-d5', tipo: 'evento',  xp: 46, nome: 'Autoral · 5', desc: 'Entrega em vídeo final para banca.' }
            ]
          },
          {
            id: 'tec-hdii-titulo',
            tier: 6, col: 2, ranksMax: 1,
            nome: 'House Dance & Up Rock II ✓', icone: 'mdi-medal-outline',
            resumo: 'Conclusão do card House Dance & Up Rock II.',
            tipo: 'titulo',
            requer: ['tec-hdii-pers', 'tec-hdii-auto'],
            niveis: ['Card concluído.'],
            desafios: [
              { id: 'tec-hdii-titulo-d1', tipo: 'atividade', xp: 60, nome: 'Selo · House Dance & Up Rock II', desc: 'Marcado pela coordenação após revisão dos 10 nós.' }
            ]
          }
        ]
      }

    ],

    /* Insígnia final (concedida pelo backend ao cruzar limiarXPE). */
    insignia: {
      id: 'tec-insignia',
      nome: 'Insígnia do Nível Técnico',
      icone: 'mdi-medal',
      resumo: 'Concedida ao atingir 4120 XPE somando os três cards. Habilita elegibilidade ao Programa de Estágio.'
    }
  };

  F.indice = (function () {
    var mapa = {};
    F.perfis.forEach(function (p) {
      p.habilidades.forEach(function (h) {
        h.perfilId = p.id;
        h.requer   = h.requer   || [];
        h.tipo     = h.tipo     || 'habilidade';
        h.desafios = h.desafios || [];
        mapa[h.id] = h;
      });
    });
    return mapa;
  }());

  global.UDX_TRILHA  = F;
  global.UDX_TECNICO = F;
})(window); 