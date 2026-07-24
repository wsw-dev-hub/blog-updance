/**
 * ================================================================
 *  UP DANCE EXPERIENCE — ÁRVORE DE TALENTOS
 *  /js/talentTree.data.js
 * ----------------------------------------------------------------
 *  MODELO DE DADOS (somente conteúdo — sem lógica).
 *  Este arquivo é a "fonte da verdade" das três árvores.
 *  Em produção pode ser servido por /api/talentos/arvore (D1),
 *  mantendo exatamente este formato de objeto.
 *
 *  CONVENÇÕES
 *  ----------
 *  perfil.id .............. slug estável (usado em CSS e no banco)
 *  perfil.tiers[].requisito pontos investidos NO PERFIL para liberar a faixa
 *  habilidade.col ......... coluna 1..3 dentro da faixa (grid da árvore)
 *  habilidade.ranksMax .... quantos pontos cabem na habilidade
 *  habilidade.requer ...... ids que precisam estar no rank MÁXIMO
 *  habilidade.tipo ........ 'habilidade' (padrão) | 'titulo'
 *  desafio.tipo ........... 'tarefa' | 'atividade' | 'evento'
 *  desafio.xp ............. experiência ESPECÍFICA do perfil
 *
 *  ECONOMIA
 *  --------
 *  xpPorPonto = 100  →  a cada 100 XP do perfil, 1 Ponto de Talento.
 *  Os pontos são do MEMBRO, não da página: as "Páginas de Plano"
 *  são distribuições alternativas do mesmo saldo (igual ao print).
 * ================================================================
 */
(function (global) {
  'use strict';

  var T = {

    versao:      '1.0.0',
    xpPorPonto:  100,

    /* Acesso: tipos de membro autorizados a ver a árvore.
       'Estagiário(a)' é o piso — os níveis acima herdam o acesso. */
    tiposComAcesso: ['Estagiário(a)', 'Monitor(a)', 'Assistente', 'Professor(a)', 'Premium'],

    /* ============================================================
       LEGENDA DE DESAFIOS
    ============================================================ */
    tiposDesafio: {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    },

    perfis: [

      /* ==========================================================
         01 — BAILARINO(A)  ·  Cia de Dança
         Gradiente: fogo → roxo   (#F20505 → #8C0783)
      ========================================================== */
      {
        id: 'bailarino',
        nome: 'Bailarino(a)',
        segmento: 'Cia de Dança',
        icone: 'mdi-human-handsup',
        xpLabel: 'XP de Repertório',
        resumo: 'Trilha de quem quer integrar o elenco de uma companhia: ' +
                'corpo confiável, repertório amplo e leitura de direção.',
        tiers: [
          { n: 1, nome: 'Fundamentos do Corpo',  requisito: 0  },
          { n: 2, nome: 'Repertório & Técnica',  requisito: 5  },
          { n: 3, nome: 'Ensaio & Coletivo',     requisito: 12 },
          { n: 4, nome: 'Maestria',              requisito: 20 },
          { n: 5, nome: 'Título',                requisito: 30 }
        ],
        habilidades: [

          /* ---------------- FAIXA 1 ---------------- */
          {
            id: 'bal-eixo', tier: 1, col: 1, ranksMax: 3,
            nome: 'Consciência Corporal', icone: 'mdi-meditation',
            resumo: 'Eixo, alinhamento e respiração — a base que sustenta todo o resto.',
            niveis: [
              'Reconhece o próprio eixo em pé e identifica o apoio de cada pé.',
              'Mantém alinhamento em transferências de peso e mudanças de nível.',
              'Sustenta o eixo em rotações e quedas controladas, com respiração aplicada ao movimento.'
            ],
            desafios: [
              { id: 'bal-eixo-d1', tipo: 'tarefa',    xp: 50,
                nome: 'Diário de eixo',
                desc: 'Registrar 5 sessões de 10 min de trabalho de apoio, alinhamento e respiração.' },
              { id: 'bal-eixo-d2', tipo: 'atividade', xp: 100,
                nome: 'Aula de preparação corporal',
                desc: 'Concluir 4 aulas de preparação corporal com presença confirmada pelo(a) mentor(a).' },
              { id: 'bal-eixo-d3', tipo: 'tarefa',    xp: 150,
                nome: 'Vídeo de avaliação postural',
                desc: 'Enviar vídeo frontal e de perfil executando 8 tempos de marcação lenta para análise.' }
            ]
          },
          {
            id: 'bal-vocab', tier: 1, col: 2, ranksMax: 5,
            nome: 'Vocabulário de Base', icone: 'mdi-shoe-sneaker',
            resumo: 'Passos [ BÁSICO ] do Catálogo de Movimentos, nas quatro linguagens.',
            niveis: [
              'Hip Hop Dance: 2 Steps, 4 Steps, March Step, Monastery, Bounce.',
              'Popping: Hit/Pop, Roll, Lift, Fresno, Walk Out.',
              'House Dance: Knock, Popcorn, Toe Touch, Heel Touch, Stomping.',
              'Locking: Neck Groove, Up Lock, Down Lock, Scooby Doo, Wrist Roll.',
              'Breaking (Top Rock): March Step, Walk, Cross Walk, X-Step, Side to Side.'
            ],
            desafios: [
              { id: 'bal-vocab-d1', tipo: 'tarefa',    xp: 60,
                nome: 'Checklist do catálogo',
                desc: 'Marcar como executáveis 10 passos do nível [ BÁSICO ] e enviar vídeo de 3 deles.' },
              { id: 'bal-vocab-d2', tipo: 'atividade', xp: 120,
                nome: 'Rodada de fundamentos',
                desc: 'Participar de 3 rodas de fundamentos e apresentar 8 tempos de cada linguagem.' },
              { id: 'bal-vocab-d3', tipo: 'evento',    xp: 180,
                nome: 'Mostra de fundamentos',
                desc: 'Executar uma sequência de 32 tempos com passos básicos na mostra interna.' }
            ]
          },
          {
            id: 'bal-music', tier: 1, col: 3, ranksMax: 3,
            nome: 'Musicalidade & Contagem', icone: 'mdi-metronome',
            resumo: 'Ouvir a música e caber dentro dela — tempo, contratempo e frase de 8.',
            niveis: [
              'Conta 8 tempos em andamentos entre 90 e 110 BPM sem perder o pulso.',
              'Marca contratempo e sincopa; identifica quebra e virada da frase.',
              'Escolhe camadas (grave, caixa, melodia) e troca de camada dentro do mesmo trecho.'
            ],
            desafios: [
              { id: 'bal-music-d1', tipo: 'tarefa',    xp: 60,
                nome: 'Mapa da música',
                desc: 'Mapear intro, frases e viradas de 2 faixas indicadas pela plataforma.' },
              { id: 'bal-music-d2', tipo: 'atividade', xp: 110,
                nome: 'Treino com metrônomo',
                desc: 'Registrar 6 treinos com metrônomo em 3 andamentos diferentes.' },
              { id: 'bal-music-d3', tipo: 'evento',    xp: 170,
                nome: 'Roda de musicalidade',
                desc: 'Participar de uma roda em que a faixa muda de andamento sem aviso.' }
            ]
          },

          /* ---------------- FAIXA 2 ---------------- */
          {
            id: 'bal-memoria', tier: 2, col: 1, ranksMax: 3,
            nome: 'Memória Coreográfica', icone: 'mdi-brain',
            resumo: 'Reter, reproduzir e devolver sequências no tempo do ensaio.',
            requer: ['bal-eixo'],
            niveis: [
              'Reproduz 16 tempos após 3 repetições do(a) professor(a).',
              'Reproduz 32 tempos com marcações de direção e nível.',
              'Retém uma coreografia inteira entre um ensaio e o seguinte, sem revisão.'
            ],
            desafios: [
              { id: 'bal-memoria-d1', tipo: 'atividade', xp: 120,
                nome: 'Sequência-relâmpago',
                desc: 'Aprender e devolver 32 tempos em uma única sessão, gravado para avaliação.' },
              { id: 'bal-memoria-d2', tipo: 'atividade', xp: 150,
                nome: 'Retenção de uma semana',
                desc: 'Reapresentar coreografia da semana anterior sem material de apoio.' }
            ]
          },
          {
            id: 'bal-repertorio', tier: 2, col: 2, ranksMax: 5,
            nome: 'Repertório Intermediário', icone: 'mdi-dance-ballroom',
            resumo: 'Passos [ INTERMEDIÁRIO ] do Catálogo — onde o corpo começa a ter assinatura.',
            requer: ['bal-vocab'],
            niveis: [
              'Hip Hop: Running Man, Reject, BK Bounce, Roger Rabbit.',
              'Popping: Dime Stop, Tic, Waving, King Tut.',
              'House: Pas de Bourrée, Farmer, Loose Legs, Scribble Foot.',
              'Locking: Scoobot, Skeeter Rabbit, Funky Chicken, Rock Steady.',
              'Breaking: Six Steps, Sweep, Coin Drop, Chair Freeze.'
            ],
            desafios: [
              { id: 'bal-rep-d1', tipo: 'tarefa',    xp: 80,
                nome: 'Dez intermediários',
                desc: 'Enviar vídeo com 10 passos do nível [ INTERMEDIÁRIO ], em pelo menos 2 linguagens.' },
              { id: 'bal-rep-d2', tipo: 'atividade', xp: 140,
                nome: 'Combo autoral',
                desc: 'Criar um combo de 16 tempos combinando 4 passos intermediários.' },
              { id: 'bal-rep-d3', tipo: 'evento',    xp: 220,
                nome: 'Battle interna',
                desc: 'Participar de uma battle interna 1x1 com no mínimo 2 rounds.' }
            ]
          },
          {
            id: 'bal-espaco', tier: 2, col: 3, ranksMax: 3,
            nome: 'Uso do Espaço', icone: 'mdi-vector-square',
            resumo: 'Deslocamento, níveis e formação — o palco como material de trabalho.',
            requer: ['bal-music'],
            niveis: [
              'Executa a mesma sequência em três direções sem perder a marcação.',
              'Transita entre níveis alto, médio e baixo mantendo a contagem.',
              'Mantém a própria posição em formações que mudam a cada 8 tempos.'
            ],
            desafios: [
              { id: 'bal-espaco-d1', tipo: 'tarefa',    xp: 70,
                nome: 'Mapa de palco',
                desc: 'Desenhar o mapa de deslocamento de uma coreografia de 64 tempos.' },
              { id: 'bal-espaco-d2', tipo: 'atividade', xp: 130,
                nome: 'Ensaio de formação',
                desc: 'Participar de 3 ensaios de formação com trocas de posição a cada 8 tempos.' }
            ]
          },

          /* ---------------- FAIXA 3 ---------------- */
          {
            id: 'bal-fisico', tier: 3, col: 1, ranksMax: 3,
            nome: 'Resistência & Preparo', icone: 'mdi-heart-pulse',
            resumo: 'Aguentar o ensaio inteiro — e a terceira passada do dia.',
            requer: ['bal-memoria'],
            niveis: [
              'Sustenta 3 passadas completas de uma coreografia com intervalo curto.',
              'Sustenta 5 passadas mantendo qualidade de execução na última.',
              'Sustenta um ensaio corrido de 2h com aquecimento e volta à calma próprios.'
            ],
            desafios: [
              { id: 'bal-fisico-d1', tipo: 'tarefa',    xp: 90,
                nome: 'Rotina de preparo',
                desc: 'Cumprir 8 sessões de preparo físico registradas no diário de treino.' },
              { id: 'bal-fisico-d2', tipo: 'atividade', xp: 160,
                nome: 'Ensaio corrido',
                desc: 'Concluir um ensaio corrido de 2h com avaliação do(a) diretor(a) de ensaio.' }
            ]
          },
          {
            id: 'bal-sincronia', tier: 3, col: 2, ranksMax: 3,
            nome: 'Sincronia de Grupo', icone: 'mdi-account-group',
            resumo: 'Uníssono: mesma amplitude, mesma intenção, mesmo tempo.',
            requer: ['bal-repertorio'],
            niveis: [
              'Mantém uníssono em dupla ao longo de 16 tempos.',
              'Mantém uníssono em grupo de 4 a 6 pessoas em coreografia completa.',
              'Ajusta a própria amplitude em tempo real para casar com a linha do grupo.'
            ],
            desafios: [
              { id: 'bal-sinc-d1', tipo: 'atividade', xp: 140,
                nome: 'Espelho em dupla',
                desc: 'Gravar 16 tempos em uníssono com um(a) colega e enviar para análise quadro a quadro.' },
              { id: 'bal-sinc-d2', tipo: 'evento',    xp: 240,
                nome: 'Número de grupo',
                desc: 'Apresentar um número de grupo em evento da plataforma.' }
            ]
          },
          {
            id: 'bal-direcao', tier: 3, col: 3, ranksMax: 2,
            nome: 'Leitura de Direção', icone: 'mdi-eye-outline',
            resumo: 'Receber correção sem travar e aplicar na passada seguinte.',
            requer: ['bal-espaco'],
            niveis: [
              'Aplica uma correção pontual já na repetição seguinte.',
              'Traduz indicações de qualidade ("mais peso", "mais seco") em ajuste concreto.'
            ],
            desafios: [
              { id: 'bal-dir-d1', tipo: 'atividade', xp: 130,
                nome: 'Ciclo de correção',
                desc: 'Registrar 5 correções recebidas e o antes/depois de cada uma.' },
              { id: 'bal-dir-d2', tipo: 'evento',    xp: 200,
                nome: 'Ensaio com direção convidada',
                desc: 'Participar de um ensaio conduzido por direção convidada.' }
            ]
          },

          /* ---------------- FAIXA 4 ---------------- */
          {
            id: 'bal-cena', tier: 4, col: 1, ranksMax: 3,
            nome: 'Interpretação Cênica', icone: 'mdi-drama-masks',
            resumo: 'O passo certo já não basta: é preciso dizer alguma coisa com ele.',
            requer: ['bal-fisico', 'bal-sincronia'],
            niveis: [
              'Sustenta uma intenção única do início ao fim do número.',
              'Alterna intenções entre trechos sem quebrar a unidade da obra.',
              'Constrói personagem/atmosfera e mantém em apresentação ao vivo.'
            ],
            desafios: [
              { id: 'bal-cena-d1', tipo: 'atividade', xp: 170,
                nome: 'Mesma coreografia, três intenções',
                desc: 'Apresentar o mesmo trecho com três qualidades expressivas distintas.' },
              { id: 'bal-cena-d2', tipo: 'evento',    xp: 260,
                nome: 'Peça curta',
                desc: 'Integrar o elenco de uma peça curta da temporada.' }
            ]
          },
          {
            id: 'bal-solo', tier: 4, col: 3, ranksMax: 2,
            nome: 'Solo de Companhia', icone: 'mdi-star-four-points',
            resumo: 'Sustentar sozinho(a) um trecho da obra, com o grupo parado.',
            requer: ['bal-sincronia', 'bal-direcao'],
            niveis: [
              'Sustenta um solo de 16 tempos dentro de um número de grupo.',
              'Sustenta um solo de 32 tempos com material próprio aprovado pela direção.'
            ],
            desafios: [
              { id: 'bal-solo-d1', tipo: 'evento',    xp: 280,
                nome: 'Solo em temporada',
                desc: 'Executar um solo dentro de um número apresentado ao público.' },
              { id: 'bal-solo-d2', tipo: 'atividade', xp: 180,
                nome: 'Material próprio',
                desc: 'Levar 32 tempos de material autoral para aprovação da direção.' }
            ]
          },

          /* ---------------- TÍTULO ---------------- */
          {
            id: 'bal-titulo', tier: 5, col: 2, tipo: 'titulo', ranksMax: 1,
            nome: 'Bailarino(a) de Companhia', icone: 'mdi-trophy-variant',
            resumo: 'Título concedido a quem domina corpo, repertório, coletivo e cena. ' +
                    'Habilita audição interna para o elenco fixo da Up Dance.',
            requer: ['bal-cena', 'bal-solo'],
            niveis: ['Título conquistado — audição para elenco fixo liberada.'],
            desafios: [
              { id: 'bal-tit-d1', tipo: 'evento', xp: 0,
                nome: 'Audição de elenco',
                desc: 'Agendar a audição interna. Não consome pontos — é a porta de saída da trilha.' }
            ]
          }
        ]
      },

      /* ==========================================================
         02 — PROFESSOR(A)
         Gradiente: roxo médio → azul médio   (#5708A6 → #430ABF)
      ========================================================== */
      {
        id: 'professor',
        nome: 'Professor(a)',
        segmento: 'Formação & Sala de Aula',
        icone: 'mdi-human-male-board',
        xpLabel: 'XP de Docência',
        resumo: 'Trilha de quem vai conduzir turmas: decompor movimento, ' +
                'planejar aula, gerir sala e avaliar aprendizado.',
        tiers: [
          { n: 1, nome: 'Base Didática',      requisito: 0  },
          { n: 2, nome: 'Condução de Turma',  requisito: 5  },
          { n: 3, nome: 'Metodologia',        requisito: 12 },
          { n: 4, nome: 'Maestria',           requisito: 20 },
          { n: 5, nome: 'Título',             requisito: 30 }
        ],
        habilidades: [

          /* ---------------- FAIXA 1 ---------------- */
          {
            id: 'prof-aquecimento', tier: 1, col: 1, ranksMax: 3,
            nome: 'Didática do Aquecimento', icone: 'mdi-run-fast',
            resumo: 'A primeira coisa que se conduz sozinho(a) numa sala.',
            niveis: [
              'Conduz aquecimento articular de 10 min com comando claro.',
              'Conduz aquecimento de 20 min com progressão de intensidade.',
              'Adapta o aquecimento ao conteúdo do dia e ao nível da turma.'
            ],
            desafios: [
              { id: 'prof-aq-d1', tipo: 'tarefa',    xp: 50,
                nome: 'Roteiro de aquecimento',
                desc: 'Enviar roteiro escrito de um aquecimento de 20 min com justificativa de cada bloco.' },
              { id: 'prof-aq-d2', tipo: 'atividade', xp: 120,
                nome: 'Conduzir o aquecimento',
                desc: 'Conduzir o aquecimento de 4 aulas sob supervisão do(a) professor(a) titular.' },
              { id: 'prof-aq-d3', tipo: 'atividade', xp: 140,
                nome: 'Aquecimento sob medida',
                desc: 'Conduzir aquecimentos distintos para turma infantil, adulta e avançada.' }
            ]
          },
          {
            id: 'prof-decompor', tier: 1, col: 2, ranksMax: 5,
            nome: 'Decomposição de Passo', icone: 'mdi-call-split',
            resumo: 'Quebrar qualquer passo do catálogo em partes ensináveis.',
            niveis: [
              'Divide um passo básico em 2 a 3 partes e nomeia cada uma.',
              'Explica apoio, peso e direção de cada parte.',
              'Constrói exercício preparatório para a parte mais difícil.',
              'Decompõe passo intermediário mantendo a musicalidade original.',
              'Decompõe passo de outra linguagem que não é a sua principal.'
            ],
            desafios: [
              { id: 'prof-dec-d1', tipo: 'tarefa',    xp: 60,
                nome: 'Ficha de decomposição',
                desc: 'Produzir 5 fichas de decomposição de passos [ BÁSICO ] do catálogo.' },
              { id: 'prof-dec-d2', tipo: 'tarefa',    xp: 90,
                nome: 'Ficha intermediária',
                desc: 'Produzir 3 fichas de passos [ INTERMEDIÁRIO ], com exercício preparatório.' },
              { id: 'prof-dec-d3', tipo: 'atividade', xp: 150,
                nome: 'Ensinar em 5 minutos',
                desc: 'Ensinar um passo desconhecido para um(a) colega em 5 min, gravado.' }
            ]
          },
          {
            id: 'prof-comando', tier: 1, col: 3, ranksMax: 3,
            nome: 'Comando & Contagem', icone: 'mdi-bullhorn-outline',
            resumo: 'Voz, projeção e contagem audível — sem gritar e sem sumir.',
            niveis: [
              'Conta 8 tempos em voz alta acima do som da sala.',
              'Alterna contagem, marcação verbal e silêncio conforme a etapa.',
              'Mantém comando claro por uma aula inteira sem forçar a voz.'
            ],
            desafios: [
              { id: 'prof-cmd-d1', tipo: 'tarefa',    xp: 50,
                nome: 'Áudio de comando',
                desc: 'Gravar 2 min conduzindo contagem e marcação verbal com música de fundo.' },
              { id: 'prof-cmd-d2', tipo: 'atividade', xp: 110,
                nome: 'Aula sem espelho',
                desc: 'Conduzir 20 min de aula guiando apenas pela voz, sem demonstração.' },
              { id: 'prof-cmd-d3', tipo: 'tarefa',    xp: 130,
                nome: 'Saúde vocal',
                desc: 'Concluir o módulo de aquecimento e preservação da voz e aplicar por 2 semanas.' }
            ]
          },

          /* ---------------- FAIXA 2 ---------------- */
          {
            id: 'prof-plano', tier: 2, col: 1, ranksMax: 3,
            nome: 'Plano de Aula', icone: 'mdi-clipboard-text-outline',
            resumo: 'Objetivo, tempo e material — antes de entrar na sala.',
            requer: ['prof-aquecimento'],
            niveis: [
              'Escreve plano de aula única com objetivo e divisão de tempo.',
              'Escreve plano de ciclo de 4 aulas com objetivo acumulado.',
              'Ajusta o plano em tempo real quando a turma não acompanha.'
            ],
            desafios: [
              { id: 'prof-plano-d1', tipo: 'tarefa',    xp: 70,
                nome: 'Plano de ciclo',
                desc: 'Entregar plano de 4 aulas com objetivos, passos do catálogo e avaliação.' },
              { id: 'prof-plano-d2', tipo: 'atividade', xp: 140,
                nome: 'Executar o ciclo',
                desc: 'Executar o ciclo planejado e entregar relatório do que precisou mudar.' },
              { id: 'prof-plano-d3', tipo: 'tarefa',    xp: 120,
                nome: 'Plano B',
                desc: 'Escrever o plano alternativo para sala cheia, sala vazia e som quebrado.' }
            ]
          },
          {
            id: 'prof-turma', tier: 2, col: 2, ranksMax: 3,
            nome: 'Gestão de Turma', icone: 'mdi-account-supervisor-outline',
            resumo: 'Ritmo, atenção e convivência — inclusive quando a sala dispersa.',
            requer: ['prof-decompor'],
            niveis: [
              'Mantém a turma em atividade sem intervalos mortos.',
              'Redireciona dispersão sem quebrar o clima da aula.',
              'Conduz turma heterogênea (níveis e idades diferentes) na mesma sala.'
            ],
            desafios: [
              { id: 'prof-turma-d1', tipo: 'atividade', xp: 130,
                nome: 'Aula assistida',
                desc: 'Conduzir uma aula completa com observação e devolutiva do(a) mentor(a).' },
              { id: 'prof-turma-d2', tipo: 'atividade', xp: 160,
                nome: 'Turma mista',
                desc: 'Conduzir uma aula com dois níveis na mesma sala e relatar as adaptações.' },
              { id: 'prof-turma-d3', tipo: 'evento',    xp: 190,
                nome: 'Aula aberta',
                desc: 'Conduzir uma aula aberta ao público, com visitantes e experimentadores.' }
            ]
          },
          {
            id: 'prof-correcao', tier: 2, col: 3, ranksMax: 3,
            nome: 'Correção Individualizada', icone: 'mdi-tune-vertical',
            resumo: 'Ver o erro, escolher a palavra e não desmontar o aluno.',
            requer: ['prof-comando'],
            niveis: [
              'Identifica o erro principal e corrige um item por vez.',
              'Escolhe entre correção verbal, tátil (com consentimento) ou por imagem.',
              'Corrige em grupo sem expor individualmente ninguém.'
            ],
            desafios: [
              { id: 'prof-corr-d1', tipo: 'tarefa',    xp: 80,
                nome: 'Banco de correções',
                desc: 'Catalogar 10 erros recorrentes do catálogo e a correção indicada para cada um.' },
              { id: 'prof-corr-d2', tipo: 'atividade', xp: 150,
                nome: 'Rodada de devolutivas',
                desc: 'Dar devolutiva individual para 8 alunos e registrar a evolução em 2 semanas.' }
            ]
          },

          /* ---------------- FAIXA 3 ---------------- */
          {
            id: 'prof-progressao', tier: 3, col: 1, ranksMax: 3,
            nome: 'Progressão Pedagógica', icone: 'mdi-stairs-up',
            resumo: 'Conduzir a turma de [ BÁSICO ] a [ INTERMEDIÁRIO ] sem pular degrau.',
            requer: ['prof-plano'],
            niveis: [
              'Sequencia passos do catálogo por complexidade de execução.',
              'Monta ponte entre um passo básico e seu correspondente intermediário.',
              'Desenha um semestre inteiro com marcos de avaliação.'
            ],
            desafios: [
              { id: 'prof-prog-d1', tipo: 'tarefa',    xp: 100,
                nome: 'Mapa de progressão',
                desc: 'Construir o mapa de progressão de uma linguagem, do básico ao intermediário.' },
              { id: 'prof-prog-d2', tipo: 'atividade', xp: 180,
                nome: 'Semestre-piloto',
                desc: 'Aplicar 8 semanas do mapa em turma real e entregar relatório de resultados.' }
            ]
          },
          {
            id: 'prof-adaptar', tier: 3, col: 2, ranksMax: 3,
            nome: 'Adaptação por Nível e Corpo', icone: 'mdi-arrow-decision-outline',
            resumo: 'A mesma aula servindo a corpos, idades e limitações diferentes.',
            requer: ['prof-turma'],
            niveis: [
              'Oferece versão facilitada e versão avançada do mesmo exercício.',
              'Adapta para restrição física temporária sem tirar o aluno da aula.',
              'Adapta para turmas infantis e para turmas 50+ mantendo o conteúdo.'
            ],
            desafios: [
              { id: 'prof-adap-d1', tipo: 'tarefa',    xp: 90,
                nome: 'Três versões',
                desc: 'Escrever três versões do mesmo exercício para níveis distintos.' },
              { id: 'prof-adap-d2', tipo: 'atividade', xp: 170,
                nome: 'Aula inclusiva',
                desc: 'Conduzir aula com pelo menos uma adaptação individual documentada.' }
            ]
          },
          {
            id: 'prof-avaliar', tier: 3, col: 3, ranksMax: 2,
            nome: 'Avaliação de Aluno', icone: 'mdi-clipboard-check-outline',
            resumo: 'Critério explícito, devolutiva registrada, evolução comprovável.',
            requer: ['prof-correcao'],
            niveis: [
              'Aplica ficha de avaliação com critérios objetivos.',
              'Traduz a avaliação em plano individual para o ciclo seguinte.'
            ],
            desafios: [
              { id: 'prof-aval-d1', tipo: 'tarefa',    xp: 90,
                nome: 'Ficha de avaliação',
                desc: 'Criar a ficha de avaliação da sua turma, com critérios e escala.' },
              { id: 'prof-aval-d2', tipo: 'evento',    xp: 200,
                nome: 'Banca de avaliação',
                desc: 'Compor a banca de avaliação de fim de ciclo ao lado da coordenação.' }
            ]
          },

          /* ---------------- FAIXA 4 ---------------- */
          {
            id: 'prof-turma-propria', tier: 4, col: 1, ranksMax: 3,
            nome: 'Turma Própria', icone: 'mdi-school-outline',
            resumo: 'Assumir uma turma do começo ao fim do ciclo — inclusive a evasão.',
            requer: ['prof-progressao', 'prof-adaptar'],
            niveis: [
              'Assume uma turma por 4 semanas com acompanhamento próximo.',
              'Assume uma turma por um ciclo completo com autonomia de plano.',
              'Sustenta a turma com retenção acima da meta da coordenação.'
            ],
            desafios: [
              { id: 'prof-tp-d1', tipo: 'atividade', xp: 200,
                nome: 'Ciclo completo',
                desc: 'Conduzir uma turma por um ciclo inteiro com relatório final entregue.' },
              { id: 'prof-tp-d2', tipo: 'tarefa',    xp: 120,
                nome: 'Relatório de retenção',
                desc: 'Apresentar dados de presença e as ações tomadas para reduzir evasão.' }
            ]
          },
          {
            id: 'prof-workshop', tier: 4, col: 3, ranksMax: 2,
            nome: 'Workshop Autoral', icone: 'mdi-presentation',
            resumo: 'Conteúdo próprio, com recorte e método assinados por você.',
            requer: ['prof-adaptar', 'prof-avaliar'],
            niveis: [
              'Ministra workshop de 2h com material de apoio próprio.',
              'Ministra workshop aberto ao público externo com inscrições.'
            ],
            desafios: [
              { id: 'prof-ws-d1', tipo: 'evento', xp: 260,
                nome: 'Workshop na grade',
                desc: 'Ter um workshop autoral aprovado e realizado na grade da plataforma.' },
              { id: 'prof-ws-d2', tipo: 'tarefa', xp: 150,
                nome: 'Apostila do workshop',
                desc: 'Entregar o material de apoio distribuído aos participantes.' }
            ]
          },

          /* ---------------- TÍTULO ---------------- */
          {
            id: 'prof-titulo', tier: 5, col: 2, tipo: 'titulo', ranksMax: 1,
            nome: 'Professor(a) Certificado(a)', icone: 'mdi-certificate-outline',
            resumo: 'Título concedido a quem planeja, conduz, adapta e avalia com autonomia. ' +
                    'Habilita a solicitação do tipo de membro Professor(a).',
            requer: ['prof-turma-propria', 'prof-workshop'],
            niveis: ['Título conquistado — solicitação de credencial liberada.'],
            desafios: [
              { id: 'prof-tit-d1', tipo: 'evento', xp: 0,
                nome: 'Banca de certificação',
                desc: 'Agendar a banca final com a coordenação pedagógica.' }
            ]
          }
        ]
      },

      /* ==========================================================
         03 — PERFORMER
         Gradiente: rosa/choque → laranja   (#FA33A1 → #F27405)
      ========================================================== */
      {
        id: 'performer',
        nome: 'Performer',
        segmento: 'Shows & Eventos',
        icone: 'mdi-lightbulb-on-outline',
        xpLabel: 'XP de Palco',
        resumo: 'Trilha de quem vive de palco: presença, versatilidade, ' +
                'câmera e postura profissional em equipes de show.',
        tiers: [
          { n: 1, nome: 'Presença',   requisito: 0  },
          { n: 2, nome: 'Show',       requisito: 5  },
          { n: 3, nome: 'Mercado',    requisito: 12 },
          { n: 4, nome: 'Maestria',   requisito: 20 },
          { n: 5, nome: 'Título',     requisito: 30 }
        ],
        habilidades: [

          /* ---------------- FAIXA 1 ---------------- */
          {
            id: 'perf-presenca', tier: 1, col: 1, ranksMax: 3,
            nome: 'Presença de Palco', icone: 'mdi-spotlight-beam',
            resumo: 'Ocupar o espaço antes mesmo do primeiro passo.',
            niveis: [
              'Entra, se posiciona e sustenta o olhar sem se encolher.',
              'Mantém energia constante do primeiro ao último tempo.',
              'Sustenta a presença mesmo com erro técnico no meio do número.'
            ],
            desafios: [
              { id: 'perf-pres-d1', tipo: 'tarefa',    xp: 50,
                nome: 'Entrada e saída',
                desc: 'Gravar 5 entradas e saídas de palco diferentes para análise.' },
              { id: 'perf-pres-d2', tipo: 'atividade', xp: 120,
                nome: 'Passagem de som',
                desc: 'Participar de 3 passagens de som ocupando a marcação completa.' },
              { id: 'perf-pres-d3', tipo: 'evento',    xp: 180,
                nome: 'Primeiro palco',
                desc: 'Subir em um palco da plataforma com público presente.' }
            ]
          },
          {
            id: 'perf-freestyle', tier: 1, col: 2, ranksMax: 5,
            nome: 'Freestyle', icone: 'mdi-shuffle-variant',
            resumo: 'Improvisar com o que se tem no corpo — a rede de segurança do palco.',
            niveis: [
              'Sustenta 8 tempos de freestyle sem repetir passo.',
              'Sustenta 32 tempos alternando linguagens.',
              'Improvisa dentro de um estilo definido pela produção.',
              'Improvisa reagindo a mudança inesperada da música.',
              'Improvisa em interação direta com o público.'
            ],
            desafios: [
              { id: 'perf-free-d1', tipo: 'tarefa',    xp: 60,
                nome: 'Um minuto de cypher',
                desc: 'Enviar 1 min de freestyle contínuo, sem corte.' },
              { id: 'perf-free-d2', tipo: 'evento',    xp: 190,
                nome: 'Cypher aberta',
                desc: 'Participar de uma cypher aberta promovida pela plataforma.' },
              { id: 'perf-free-d3', tipo: 'atividade', xp: 140,
                nome: 'Faixa surpresa',
                desc: 'Improvisar sobre 3 faixas reveladas apenas no momento da gravação.' }
            ]
          },
          {
            id: 'perf-expressao', tier: 1, col: 3, ranksMax: 2,
            nome: 'Expressão Facial', icone: 'mdi-emoticon-outline',
            resumo: 'O rosto também dança — e é o que a câmera pega primeiro.',
            niveis: [
              'Mantém expressão coerente com a proposta do número.',
              'Varia a expressão por trecho sem perder naturalidade.'
            ],
            desafios: [
              { id: 'perf-exp-d1', tipo: 'tarefa',    xp: 60,
                nome: 'Close de 30 segundos',
                desc: 'Gravar 30 s em close executando o mesmo trecho com duas intenções.' },
              { id: 'perf-exp-d2', tipo: 'atividade', xp: 130,
                nome: 'Oficina de expressão',
                desc: 'Concluir a oficina de expressão cênica e aplicar em um número.' }
            ]
          },

          /* ---------------- FAIXA 2 ---------------- */
          {
            id: 'perf-comercial', tier: 2, col: 1, ranksMax: 3,
            nome: 'Repertório Comercial', icone: 'mdi-music-note-eighth',
            resumo: 'Entregar o que o cliente contratou — sertanejo, pop, funk, axé.',
            requer: ['perf-presenca'],
            niveis: [
              'Executa coreografia comercial simples com clareza de marcação.',
              'Transita entre 3 gêneros musicais distintos no mesmo show.',
              'Adapta o próprio estilo à identidade visual do contratante.'
            ],
            desafios: [
              { id: 'perf-com-d1', tipo: 'atividade', xp: 130,
                nome: 'Três gêneros',
                desc: 'Montar e gravar 16 tempos em três gêneros comerciais distintos.' },
              { id: 'perf-com-d2', tipo: 'evento',    xp: 200,
                nome: 'Show contratado',
                desc: 'Integrar o corpo de baile de um show da agenda da plataforma.' },
              { id: 'perf-com-d3', tipo: 'tarefa',    xp: 110,
                nome: 'Repertório de bolso',
                desc: 'Manter 5 coreografias comerciais prontas para chamada de última hora.' }
            ]
          },
          {
            id: 'perf-camera', tier: 2, col: 2, ranksMax: 3,
            nome: 'Marcação de Palco e Câmera', icone: 'mdi-video-outline',
            resumo: 'Saber onde ficar, para onde olhar e o que a lente está enxergando.',
            requer: ['perf-freestyle'],
            niveis: [
              'Acerta a marcação de piso em palco de dimensões variáveis.',
              'Encontra a câmera principal sem quebrar a coreografia.',
              'Ajusta amplitude conforme enquadramento (aberto, médio, close).'
            ],
            desafios: [
              { id: 'perf-cam-d1', tipo: 'tarefa',    xp: 80,
                nome: 'Mesma coreo, três enquadramentos',
                desc: 'Gravar o mesmo trecho em plano aberto, médio e close.' },
              { id: 'perf-cam-d2', tipo: 'atividade', xp: 160,
                nome: 'Gravação multicâmera',
                desc: 'Participar de uma gravação com marcação de duas ou mais câmeras.' }
            ]
          },
          {
            id: 'perf-troca', tier: 2, col: 3, ranksMax: 2,
            nome: 'Troca Rápida e Figurino', icone: 'mdi-tshirt-crew-outline',
            resumo: 'Bastidor também é performance: 40 segundos e você volta.',
            requer: ['perf-expressao'],
            niveis: [
              'Executa troca completa de figurino em até 60 s.',
              'Executa troca em até 30 s mantendo cabelo, maquiagem e adereço.'
            ],
            desafios: [
              { id: 'perf-troca-d1', tipo: 'atividade', xp: 110,
                nome: 'Ensaio de bastidor',
                desc: 'Cronometrar e registrar 5 trocas rápidas em ensaio geral.' },
              { id: 'perf-troca-d2', tipo: 'tarefa',    xp: 90,
                nome: 'Kit de camarim',
                desc: 'Montar e fotografar o próprio kit de camarim completo.' }
            ]
          },

          /* ---------------- FAIXA 3 ---------------- */
          {
            id: 'perf-negocio', tier: 3, col: 1, ranksMax: 3,
            nome: 'Cachê, Contrato e Postura', icone: 'mdi-file-document-edit-outline',
            resumo: 'A parte que ninguém ensaia — e que define se você é chamado de novo.',
            requer: ['perf-comercial'],
            niveis: [
              'Monta orçamento com cachê, deslocamento e horas de ensaio.',
              'Lê um contrato de prestação e identifica cláusulas críticas.',
              'Negocia prazo, escopo e cancelamento sem queimar a relação.'
            ],
            desafios: [
              { id: 'perf-neg-d1', tipo: 'tarefa',    xp: 90,
                nome: 'Sua tabela de cachê',
                desc: 'Construir a própria tabela de cachê com memória de cálculo.' },
              { id: 'perf-neg-d2', tipo: 'atividade', xp: 150,
                nome: 'Simulação de negociação',
                desc: 'Participar de uma simulação de negociação com a produção da plataforma.' }
            ]
          },
          {
            id: 'perf-elenco', tier: 3, col: 2, ranksMax: 3,
            nome: 'Trabalho com Elenco', icone: 'mdi-account-multiple-outline',
            resumo: 'Equipe de show é convivência sob pressão, viagem e horário ruim.',
            requer: ['perf-camera'],
            niveis: [
              'Cumpre call time, marcação e comunicação de ausência.',
              'Cobre a posição de um colega ausente com pouco aviso.',
              'Assume a referência do grupo em ensaios de reposição.'
            ],
            desafios: [
              { id: 'perf-ele-d1', tipo: 'atividade', xp: 140,
                nome: 'Reposição de elenco',
                desc: 'Aprender e cobrir a marcação de outra posição do número.' },
              { id: 'perf-ele-d2', tipo: 'evento',    xp: 210,
                nome: 'Temporada em equipe',
                desc: 'Cumprir uma sequência de 3 apresentações com o mesmo elenco.' }
            ]
          },
          {
            id: 'perf-portfolio', tier: 3, col: 3, ranksMax: 3,
            nome: 'Portfólio e Reels', icone: 'mdi-play-box-outline',
            resumo: 'O material que trabalha por você quando você não está na sala.',
            requer: ['perf-troca'],
            niveis: [
              'Mantém reel de 60 s atualizado com trabalhos recentes.',
              'Mantém portfólio com ficha técnica, foto e release.',
              'Produz conteúdo próprio com constância definida em calendário.'
            ],
            desafios: [
              { id: 'perf-port-d1', tipo: 'tarefa',    xp: 80,
                nome: 'Reel de 60 segundos',
                desc: 'Entregar reel editado com no mínimo 4 trabalhos distintos.' },
              { id: 'perf-port-d2', tipo: 'tarefa',    xp: 100,
                nome: 'Kit de apresentação',
                desc: 'Montar PDF com release, foto, ficha técnica e tabela de cachê.' }
            ]
          },

          /* ---------------- FAIXA 4 ---------------- */
          {
            id: 'perf-direcao', tier: 4, col: 1, ranksMax: 3,
            nome: 'Direção de Número', icone: 'mdi-movie-open-outline',
            resumo: 'Sair da execução e assumir a concepção do que vai ao palco.',
            requer: ['perf-negocio', 'perf-elenco'],
            niveis: [
              'Concebe e monta um número de até 3 min para 4 pessoas.',
              'Dirige ensaios do próprio número até a estreia.',
              'Entrega o número com roteiro técnico de luz, som e figurino.'
            ],
            desafios: [
              { id: 'perf-dir-d1', tipo: 'atividade', xp: 190,
                nome: 'Número autoral',
                desc: 'Conceber, montar e ensaiar um número autoral com elenco da plataforma.' },
              { id: 'perf-dir-d2', tipo: 'tarefa',    xp: 130,
                nome: 'Roteiro técnico',
                desc: 'Entregar o rider técnico completo do número dirigido.' }
            ]
          },
          {
            id: 'perf-headliner', tier: 4, col: 3, ranksMax: 2,
            nome: 'Headliner', icone: 'mdi-microphone-variant',
            resumo: 'Sustentar o nome no line-up e o público que vem por causa dele.',
            requer: ['perf-elenco', 'perf-portfolio'],
            niveis: [
              'Encabeça um número dentro de um evento da plataforma.',
              'Encabeça um evento externo com contrato assinado.'
            ],
            desafios: [
              { id: 'perf-head-d1', tipo: 'evento',    xp: 280,
                nome: 'Nome no line-up',
                desc: 'Constar como atração nomeada na divulgação de um evento.' },
              { id: 'perf-head-d2', tipo: 'atividade', xp: 190,
                nome: 'Release de divulgação',
                desc: 'Entregar release, foto e ficha técnica usados na peça de divulgação.' }
            ]
          },

          /* ---------------- TÍTULO ---------------- */
          {
            id: 'perf-titulo', tier: 5, col: 2, tipo: 'titulo', ranksMax: 1,
            nome: 'Performer Profissional', icone: 'mdi-crown-outline',
            resumo: 'Título concedido a quem domina palco, câmera, mercado e direção. ' +
                    'Habilita entrada no casting de shows e eventos da Up Dance.',
            requer: ['perf-direcao', 'perf-headliner'],
            niveis: ['Título conquistado — casting de shows e eventos liberado.'],
            desafios: [
              { id: 'perf-tit-d1', tipo: 'evento', xp: 0,
                nome: 'Entrada no casting',
                desc: 'Enviar material completo para o casting oficial da plataforma.' }
            ]
          }
        ]
      }
    ]
  };

  /* Índice auxiliar: habilidade por id (montado uma vez, usado pelo motor) */
  T.indice = (function () {
    var mapa = {};
    T.perfis.forEach(function (p) {
      p.habilidades.forEach(function (h) {
        h.perfilId = p.id;
        h.requer   = h.requer || [];
        h.tipo     = h.tipo   || 'habilidade';
        h.desafios = h.desafios || [];
        mapa[h.id]  = h;
      });
    });
    return mapa;
  }());

  global.UDX_TALENTOS = T;

}(typeof window !== 'undefined' ? window : this));
