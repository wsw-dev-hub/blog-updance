/**
 * UP DANCE EXPERIENCE — NÍVEL INICIANTE (conteúdo [ BÁSICO ] do catálogo,
 * menos os 15 passos já usados na Temporada Free).
 * /js/iniciante.data.js — mesmo formato de fundamentos.data.js (rank = desafios aprovados).
 */
(function (global) {
  'use strict';
  var F = {
    versao: "1.0.0",
    temporada: {
      id: "INICIANTE",
      nome: "Iniciante",
      nivelAlvo: "Iniciante",
      promovePara: "Intermediário",
      limiarXPE: 1160
    },
    runtime: {
      perfilId: "iniciante",
      resource: "nivel-iniciante",
      chaveLocal: "udx:iniciante:v1",
      insigniaId: "ini-insignia",
      api: { me: '/api/me', estado: '/api/trilha/estado?perfil=' + "iniciante", desafio: '/api/trilha/desafio' }
    },
    tiposComAcesso: ["Iniciante", "Intermediário", "Estagiário(a)", "Assistente", "Monitor(a)", "Professor(a)", "Premium"],
    tiposDesafio: {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    },
    perfis: [
      {
            "id": "iniciante",
            "nome": "Iniciante",
            "segmento": "Nível Iniciante · Básico",
            "icone": "mdi-numeric-1-box-outline",
            "xpLabel": "XPE de Iniciante",
            "resumo": "Iniciante: vocabulário de nível iniciante · básico do catálogo, em nós encadeados por modalidade. Sem alocar pontos — cada desafio concluído faz o nó evoluir.",
            "tiers": [
                  {
                        "n": 1,
                        "nome": "Hip Hop Dance"
                  },
                  {
                        "n": 2,
                        "nome": "Popping"
                  },
                  {
                        "n": 3,
                        "nome": "House Dance"
                  },
                  {
                        "n": 4,
                        "nome": "Locking"
                  }
            ],
            "habilidades": [
                  {
                        "id": "ini-hiphop-c1",
                        "tier": 1,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 1",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 1 de 4.",
                        "requer": [],
                        "niveis": [
                              "Buterfly",
                              "Garbage Path",
                              "Prep",
                              "The Woop",
                              "Criss Cross",
                              "Smurf",
                              "Bankhead Bounce",
                              "Bounce"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-hiphop-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Buterfly",
                                    "desc": "Enviar vídeo executando 8 tempos de Buterfly no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Garbage Path",
                                    "desc": "Enviar vídeo executando 8 tempos de Garbage Path no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Prep",
                                    "desc": "Enviar vídeo executando 8 tempos de Prep no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "The Woop",
                                    "desc": "Enviar vídeo executando 8 tempos de The Woop no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Criss Cross",
                                    "desc": "Enviar vídeo executando 8 tempos de Criss Cross no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Smurf",
                                    "desc": "Enviar vídeo executando 8 tempos de Smurf no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Bankhead Bounce",
                                    "desc": "Enviar vídeo executando 8 tempos de Bankhead Bounce no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Bounce",
                                    "desc": "Enviar vídeo executando 8 tempos de Bounce no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-hiphop-c2",
                        "tier": 1,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 2",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 2 de 4.",
                        "requer": [
                              "ini-hiphop-c1"
                        ],
                        "niveis": [
                              "Rebook/ Gucci",
                              "Stomp",
                              "Atl Stomp",
                              "Slide",
                              "Patty Duke",
                              "Kid-n-play",
                              "Cleanned Shoulder",
                              "Janet Jakson"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-hiphop-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Rebook/ Gucci",
                                    "desc": "Enviar vídeo executando 8 tempos de Rebook/ Gucci no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Stomp",
                                    "desc": "Enviar vídeo executando 8 tempos de Stomp no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Atl Stomp",
                                    "desc": "Enviar vídeo executando 8 tempos de Atl Stomp no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Slide",
                                    "desc": "Enviar vídeo executando 8 tempos de Slide no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Patty Duke",
                                    "desc": "Enviar vídeo executando 8 tempos de Patty Duke no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Kid-n-play",
                                    "desc": "Enviar vídeo executando 8 tempos de Kid-n-play no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Cleanned Shoulder",
                                    "desc": "Enviar vídeo executando 8 tempos de Cleanned Shoulder no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Janet Jakson",
                                    "desc": "Enviar vídeo executando 8 tempos de Janet Jakson no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-hiphop-c3",
                        "tier": 1,
                        "col": 3,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 3",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 3 de 4.",
                        "requer": [
                              "ini-hiphop-c2"
                        ],
                        "niveis": [
                              "Tic Tac Toe",
                              "Dougie",
                              "Robocop",
                              "Tone Wop / Run It",
                              "The Fila / Rambo",
                              "Biz Markie",
                              "Stick'n Roll",
                              "Sprinkler"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-hiphop-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Tic Tac Toe",
                                    "desc": "Enviar vídeo executando 8 tempos de Tic Tac Toe no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Dougie",
                                    "desc": "Enviar vídeo executando 8 tempos de Dougie no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Robocop",
                                    "desc": "Enviar vídeo executando 8 tempos de Robocop no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Tone Wop / Run It",
                                    "desc": "Enviar vídeo executando 8 tempos de Tone Wop / Run It no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "The Fila / Rambo",
                                    "desc": "Enviar vídeo executando 8 tempos de The Fila / Rambo no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Biz Markie",
                                    "desc": "Enviar vídeo executando 8 tempos de Biz Markie no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Stick'n Roll",
                                    "desc": "Enviar vídeo executando 8 tempos de Stick'n Roll no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c3-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Sprinkler",
                                    "desc": "Enviar vídeo executando 8 tempos de Sprinkler no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-hiphop-c4",
                        "tier": 1,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 4",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 4 de 4.",
                        "requer": [
                              "ini-hiphop-c3"
                        ],
                        "niveis": [
                              "Mary J",
                              "Pack Man",
                              "Real Love",
                              "Roof Stop / Bus Stop",
                              "Rope",
                              "Skate",
                              "Barbie",
                              "Chicken Had"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-hiphop-c4-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Mary J",
                                    "desc": "Enviar vídeo executando 8 tempos de Mary J no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Pack Man",
                                    "desc": "Enviar vídeo executando 8 tempos de Pack Man no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Real Love",
                                    "desc": "Enviar vídeo executando 8 tempos de Real Love no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Roof Stop / Bus Stop",
                                    "desc": "Enviar vídeo executando 8 tempos de Roof Stop / Bus Stop no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Rope",
                                    "desc": "Enviar vídeo executando 8 tempos de Rope no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Skate",
                                    "desc": "Enviar vídeo executando 8 tempos de Skate no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Barbie",
                                    "desc": "Enviar vídeo executando 8 tempos de Barbie no ritmo."
                              },
                              {
                                    "id": "ini-hiphop-c4-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Chicken Had",
                                    "desc": "Enviar vídeo executando 8 tempos de Chicken Had no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-popping-c1",
                        "tier": 2,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Popping 1",
                        "icone": "mdi-flash-outline",
                        "resumo": "Passos Popping — bloco 1 de 2.",
                        "requer": [],
                        "niveis": [
                              "Old Man",
                              "Sac Walk",
                              "Egyption Twist",
                              "Romeo Twist",
                              "Back Slide",
                              "Side Slide",
                              "Moon Wlak",
                              "Neck-o-flex"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-popping-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Old Man",
                                    "desc": "Enviar vídeo executando 8 tempos de Old Man no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Sac Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Sac Walk no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Egyption Twist",
                                    "desc": "Enviar vídeo executando 8 tempos de Egyption Twist no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Romeo Twist",
                                    "desc": "Enviar vídeo executando 8 tempos de Romeo Twist no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Back Slide",
                                    "desc": "Enviar vídeo executando 8 tempos de Back Slide no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Side Slide",
                                    "desc": "Enviar vídeo executando 8 tempos de Side Slide no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Moon Wlak",
                                    "desc": "Enviar vídeo executando 8 tempos de Moon Wlak no ritmo."
                              },
                              {
                                    "id": "ini-popping-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Neck-o-flex",
                                    "desc": "Enviar vídeo executando 8 tempos de Neck-o-flex no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-popping-c2",
                        "tier": 2,
                        "col": 2,
                        "ranksMax": 6,
                        "nome": "Popping 2",
                        "icone": "mdi-flash-outline",
                        "resumo": "Passos Popping — bloco 2 de 2.",
                        "requer": [
                              "ini-popping-c1"
                        ],
                        "niveis": [
                              "Twist-o-flex",
                              "Master Flex",
                              "Flex Walk",
                              "Bottom First",
                              "Bottom Boogaloo First",
                              "Robot Walk"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-popping-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Twist-o-flex",
                                    "desc": "Enviar vídeo executando 8 tempos de Twist-o-flex no ritmo."
                              },
                              {
                                    "id": "ini-popping-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Master Flex",
                                    "desc": "Enviar vídeo executando 8 tempos de Master Flex no ritmo."
                              },
                              {
                                    "id": "ini-popping-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Flex Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Flex Walk no ritmo."
                              },
                              {
                                    "id": "ini-popping-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Bottom First",
                                    "desc": "Enviar vídeo executando 8 tempos de Bottom First no ritmo."
                              },
                              {
                                    "id": "ini-popping-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Bottom Boogaloo First",
                                    "desc": "Enviar vídeo executando 8 tempos de Bottom Boogaloo First no ritmo."
                              },
                              {
                                    "id": "ini-popping-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Robot Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Robot Walk no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-house-c1",
                        "tier": 3,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "House Dance 1",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 1 de 5.",
                        "requer": [],
                        "niveis": [
                              "Knock",
                              "Popcorn",
                              "Toe Touch",
                              "Heel Touch",
                              "Stomping",
                              "2 Steps",
                              "Cross Step",
                              "The Loose Leg"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-house-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Knock",
                                    "desc": "Enviar vídeo executando 8 tempos de Knock no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Popcorn",
                                    "desc": "Enviar vídeo executando 8 tempos de Popcorn no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Toe Touch",
                                    "desc": "Enviar vídeo executando 8 tempos de Toe Touch no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Heel Touch",
                                    "desc": "Enviar vídeo executando 8 tempos de Heel Touch no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Stomping",
                                    "desc": "Enviar vídeo executando 8 tempos de Stomping no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "2 Steps",
                                    "desc": "Enviar vídeo executando 8 tempos de 2 Steps no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Cross Step",
                                    "desc": "Enviar vídeo executando 8 tempos de Cross Step no ritmo."
                              },
                              {
                                    "id": "ini-house-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "The Loose Leg",
                                    "desc": "Enviar vídeo executando 8 tempos de The Loose Leg no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-house-c2",
                        "tier": 3,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "House Dance 2",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 2 de 5.",
                        "requer": [
                              "ini-house-c1"
                        ],
                        "niveis": [
                              "Pas De Bourrée",
                              "Chase",
                              "Shuffle",
                              "Side Walk",
                              "Salsa Step",
                              "Salsa Hop",
                              "Cross Roads",
                              "Side Swing"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-house-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Pas De Bourrée",
                                    "desc": "Enviar vídeo executando 8 tempos de Pas De Bourrée no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Chase",
                                    "desc": "Enviar vídeo executando 8 tempos de Chase no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Shuffle",
                                    "desc": "Enviar vídeo executando 8 tempos de Shuffle no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Side Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Side Walk no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Salsa Step",
                                    "desc": "Enviar vídeo executando 8 tempos de Salsa Step no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Salsa Hop",
                                    "desc": "Enviar vídeo executando 8 tempos de Salsa Hop no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Cross Roads",
                                    "desc": "Enviar vídeo executando 8 tempos de Cross Roads no ritmo."
                              },
                              {
                                    "id": "ini-house-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Side Swing",
                                    "desc": "Enviar vídeo executando 8 tempos de Side Swing no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-house-c3",
                        "tier": 3,
                        "col": 3,
                        "ranksMax": 8,
                        "nome": "House Dance 3",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 3 de 5.",
                        "requer": [
                              "ini-house-c2"
                        ],
                        "niveis": [
                              "Tip Tap Toe",
                              "Compass Turn",
                              "Lotus",
                              "Criss Cross",
                              "The Train",
                              "Swril",
                              "Skate",
                              "Roller Skate"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-house-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Tip Tap Toe",
                                    "desc": "Enviar vídeo executando 8 tempos de Tip Tap Toe no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Compass Turn",
                                    "desc": "Enviar vídeo executando 8 tempos de Compass Turn no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Lotus",
                                    "desc": "Enviar vídeo executando 8 tempos de Lotus no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Criss Cross",
                                    "desc": "Enviar vídeo executando 8 tempos de Criss Cross no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "The Train",
                                    "desc": "Enviar vídeo executando 8 tempos de The Train no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Swril",
                                    "desc": "Enviar vídeo executando 8 tempos de Swril no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Skate",
                                    "desc": "Enviar vídeo executando 8 tempos de Skate no ritmo."
                              },
                              {
                                    "id": "ini-house-c3-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Roller Skate",
                                    "desc": "Enviar vídeo executando 8 tempos de Roller Skate no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-house-c4",
                        "tier": 3,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "House Dance 4",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 4 de 5.",
                        "requer": [
                              "ini-house-c3"
                        ],
                        "niveis": [
                              "Farmer",
                              "Farmer Run",
                              "Cross Walk",
                              "Jacking",
                              "Peter Paul",
                              "Paw Wow",
                              "Triangle",
                              "Triangle Back"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-house-c4-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Farmer",
                                    "desc": "Enviar vídeo executando 8 tempos de Farmer no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Farmer Run",
                                    "desc": "Enviar vídeo executando 8 tempos de Farmer Run no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Cross Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Cross Walk no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Jacking",
                                    "desc": "Enviar vídeo executando 8 tempos de Jacking no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Peter Paul",
                                    "desc": "Enviar vídeo executando 8 tempos de Peter Paul no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Paw Wow",
                                    "desc": "Enviar vídeo executando 8 tempos de Paw Wow no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Triangle",
                                    "desc": "Enviar vídeo executando 8 tempos de Triangle no ritmo."
                              },
                              {
                                    "id": "ini-house-c4-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Triangle Back",
                                    "desc": "Enviar vídeo executando 8 tempos de Triangle Back no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-house-c5",
                        "tier": 3,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "House Dance 5",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 5 de 5.",
                        "requer": [
                              "ini-house-c4"
                        ],
                        "niveis": [
                              "Dinamond",
                              "Dinamond Back",
                              "Pas De Bourrée Turn",
                              "The Set Up",
                              "Salsa Step Twist",
                              "Roger Rabbit",
                              "Happy Feet",
                              "Heel Toe Roll"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-house-c5-r01",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Dinamond",
                                    "desc": "Enviar vídeo executando 8 tempos de Dinamond no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r02",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Dinamond Back",
                                    "desc": "Enviar vídeo executando 8 tempos de Dinamond Back no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r03",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Pas De Bourrée Turn",
                                    "desc": "Enviar vídeo executando 8 tempos de Pas De Bourrée Turn no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r04",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "The Set Up",
                                    "desc": "Enviar vídeo executando 8 tempos de The Set Up no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r05",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Salsa Step Twist",
                                    "desc": "Enviar vídeo executando 8 tempos de Salsa Step Twist no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r06",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Roger Rabbit",
                                    "desc": "Enviar vídeo executando 8 tempos de Roger Rabbit no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r07",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Happy Feet",
                                    "desc": "Enviar vídeo executando 8 tempos de Happy Feet no ritmo."
                              },
                              {
                                    "id": "ini-house-c5-r08",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Heel Toe Roll",
                                    "desc": "Enviar vídeo executando 8 tempos de Heel Toe Roll no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-locking-c1",
                        "tier": 4,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Locking 1",
                        "icone": "mdi-lock-outline",
                        "resumo": "Passos Locking — bloco 1 de 3.",
                        "requer": [],
                        "niveis": [
                              "Neck Groove",
                              "March Step",
                              "Back Step / Tow Step",
                              "4 Steps",
                              "Stp & Go",
                              "Up Lock / Muscle Man",
                              "Down Lock / Lock",
                              "Up & Down Lock / Dead Lock"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-locking-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Neck Groove",
                                    "desc": "Enviar vídeo executando 8 tempos de Neck Groove no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "March Step",
                                    "desc": "Enviar vídeo executando 8 tempos de March Step no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Back Step / Tow Step",
                                    "desc": "Enviar vídeo executando 8 tempos de Back Step / Tow Step no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "4 Steps",
                                    "desc": "Enviar vídeo executando 8 tempos de 4 Steps no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Stp & Go",
                                    "desc": "Enviar vídeo executando 8 tempos de Stp & Go no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Up Lock / Muscle Man",
                                    "desc": "Enviar vídeo executando 8 tempos de Up Lock / Muscle Man no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Down Lock / Lock",
                                    "desc": "Enviar vídeo executando 8 tempos de Down Lock / Lock no ritmo."
                              },
                              {
                                    "id": "ini-locking-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 8,
                                    "nome": "Up & Down Lock / Dead Lock",
                                    "desc": "Enviar vídeo executando 8 tempos de Up & Down Lock / Dead Lock no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-locking-c2",
                        "tier": 4,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "Locking 2",
                        "icone": "mdi-lock-outline",
                        "resumo": "Passos Locking — bloco 2 de 3.",
                        "requer": [
                              "ini-locking-c1"
                        ],
                        "niveis": [
                              "Scooby Doo",
                              "Wrist Rill / Rolling",
                              "Double Wrist Rill",
                              "Unce Sam Point",
                              "Double Uncle Sam Point",
                              "Pacing",
                              "Double Pacing",
                              "Arm Swing"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-locking-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Scooby Doo",
                                    "desc": "Enviar vídeo executando 8 tempos de Scooby Doo no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Wrist Rill / Rolling",
                                    "desc": "Enviar vídeo executando 8 tempos de Wrist Rill / Rolling no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Double Wrist Rill",
                                    "desc": "Enviar vídeo executando 8 tempos de Double Wrist Rill no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Unce Sam Point",
                                    "desc": "Enviar vídeo executando 8 tempos de Unce Sam Point no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Double Uncle Sam Point",
                                    "desc": "Enviar vídeo executando 8 tempos de Double Uncle Sam Point no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Pacing",
                                    "desc": "Enviar vídeo executando 8 tempos de Pacing no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Double Pacing",
                                    "desc": "Enviar vídeo executando 8 tempos de Double Pacing no ritmo."
                              },
                              {
                                    "id": "ini-locking-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 10,
                                    "nome": "Arm Swing",
                                    "desc": "Enviar vídeo executando 8 tempos de Arm Swing no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-locking-c3",
                        "tier": 4,
                        "col": 3,
                        "ranksMax": 5,
                        "nome": "Locking 3",
                        "icone": "mdi-lock-outline",
                        "resumo": "Passos Locking — bloco 3 de 3.",
                        "requer": [
                              "ini-locking-c2"
                        ],
                        "niveis": [
                              "Leo Walk",
                              "Scooby Walk",
                              "Snap",
                              "Clap",
                              "Give Me A Five"
                        ],
                        "desafios": [
                              {
                                    "id": "ini-locking-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Leo Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Leo Walk no ritmo."
                              },
                              {
                                    "id": "ini-locking-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scooby Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Scooby Walk no ritmo."
                              },
                              {
                                    "id": "ini-locking-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Snap",
                                    "desc": "Enviar vídeo executando 8 tempos de Snap no ritmo."
                              },
                              {
                                    "id": "ini-locking-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Clap",
                                    "desc": "Enviar vídeo executando 8 tempos de Clap no ritmo."
                              },
                              {
                                    "id": "ini-locking-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Give Me A Five",
                                    "desc": "Enviar vídeo executando 8 tempos de Give Me A Five no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "ini-insignia",
                        "tier": 4,
                        "col": 2,
                        "tipo": "insignia",
                        "ranksMax": 1,
                        "nome": "Iniciante Concluído",
                        "icone": "mdi-medal-outline",
                        "resumo": "Insígnia permanente de conclusão do nível Iniciante. Registro, sem efeito externo. Elegível à promoção para Intermediário.",
                        "requer": [
                              "ini-hiphop-c1",
                              "ini-hiphop-c2",
                              "ini-hiphop-c3",
                              "ini-hiphop-c4",
                              "ini-popping-c1",
                              "ini-popping-c2",
                              "ini-house-c1",
                              "ini-house-c2",
                              "ini-house-c3",
                              "ini-house-c4",
                              "ini-house-c5",
                              "ini-locking-c1",
                              "ini-locking-c2",
                              "ini-locking-c3"
                        ],
                        "niveis": [
                              "Insígnia conquistada."
                        ],
                        "desafios": []
                  }
            ]
      }
    ]
  };
  F.indice = (function () {
    var mapa = {};
    F.perfis.forEach(function (p) {
      p.habilidades.forEach(function (h) {
        h.perfilId = p.id; h.requer = h.requer || []; h.tipo = h.tipo || 'habilidade'; h.desafios = h.desafios || [];
        mapa[h.id] = h;
      });
    });
    return mapa;
  }());
  global.UDX_TRILHA = F;
  global.UDX_INICIANTE = F;
}(typeof window !== 'undefined' ? window : this));
