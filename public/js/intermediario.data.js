/**
 * UP DANCE EXPERIENCE — NÍVEL INTERMEDIÁRIO (conteúdo [ INTERMEDIÁRIO ] do catálogo).
 * /js/intermediario.data.js — mesmo formato de fundamentos.data.js.
 */
(function (global) {
  'use strict';
  var F = {
    versao: "1.0.0",
    temporada: {
      id: "INTERMEDIARIO",
      nome: "Intermediário",
      nivelAlvo: "Intermediário",
      promovePara: "Estagiário(a) (via banca)",
      limiarXPE: 1472
    },
    runtime: {
      perfilId: "intermediario",
      resource: "nivel-intermediario",
      chaveLocal: "udx:intermediario:v1",
      insigniaId: "int-insignia",
      api: { me: '/api/me', estado: '/api/trilha/estado?perfil=' + "intermediario", desafio: '/api/trilha/desafio' }
    },
    tiposComAcesso: ["Intermediário", "Estagiário(a)", "Assistente", "Monitor(a)", "Professor(a)", "Premium"],
    tiposDesafio: {
      tarefa:    { label: 'Tarefa',    icone: 'mdi-checkbox-marked-circle-outline' },
      atividade: { label: 'Atividade', icone: 'mdi-account-clock-outline' },
      evento:    { label: 'Evento',    icone: 'mdi-calendar-star' }
    },
    perfis: [
      {
            "id": "intermediario",
            "nome": "Intermediário",
            "segmento": "Nível Intermediário",
            "icone": "mdi-numeric-2-box-outline",
            "xpLabel": "XPE de Intermediário",
            "resumo": "Intermediário: vocabulário de nível intermediário do catálogo, em nós encadeados por modalidade. Sem alocar pontos — cada desafio concluído faz o nó evoluir.",
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
                        "id": "int-hiphop-c1",
                        "tier": 1,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 1",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 1 de 4.",
                        "requer": [],
                        "niveis": [
                              "Smeeze",
                              "Harlem Shake",
                              "Steve Martin",
                              "Kick Ball Change / Kick Step",
                              "C-wlak",
                              "Jerk",
                              "Jacking / Humpty Hump",
                              "Fly Girl"
                        ],
                        "desafios": [
                              {
                                    "id": "int-hiphop-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Smeeze",
                                    "desc": "Enviar vídeo executando 8 tempos de Smeeze no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Harlem Shake",
                                    "desc": "Enviar vídeo executando 8 tempos de Harlem Shake no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Steve Martin",
                                    "desc": "Enviar vídeo executando 8 tempos de Steve Martin no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Kick Ball Change / Kick Step",
                                    "desc": "Enviar vídeo executando 8 tempos de Kick Ball Change / Kick Step no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "C-wlak",
                                    "desc": "Enviar vídeo executando 8 tempos de C-wlak no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Jerk",
                                    "desc": "Enviar vídeo executando 8 tempos de Jerk no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Jacking / Humpty Hump",
                                    "desc": "Enviar vídeo executando 8 tempos de Jacking / Humpty Hump no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Fly Girl",
                                    "desc": "Enviar vídeo executando 8 tempos de Fly Girl no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-hiphop-c2",
                        "tier": 1,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 2",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 2 de 4.",
                        "requer": [
                              "int-hiphop-c1"
                        ],
                        "niveis": [
                              "Salsa Hop",
                              "Woobble",
                              "Party Machine",
                              "Alf",
                              "Reject",
                              "Brooklin Bounce / Bk Bounce",
                              "Happy Feet",
                              "Mickey Tyson"
                        ],
                        "desafios": [
                              {
                                    "id": "int-hiphop-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Salsa Hop",
                                    "desc": "Enviar vídeo executando 8 tempos de Salsa Hop no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Woobble",
                                    "desc": "Enviar vídeo executando 8 tempos de Woobble no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Party Machine",
                                    "desc": "Enviar vídeo executando 8 tempos de Party Machine no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Alf",
                                    "desc": "Enviar vídeo executando 8 tempos de Alf no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Reject",
                                    "desc": "Enviar vídeo executando 8 tempos de Reject no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Brooklin Bounce / Bk Bounce",
                                    "desc": "Enviar vídeo executando 8 tempos de Brooklin Bounce / Bk Bounce no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Happy Feet",
                                    "desc": "Enviar vídeo executando 8 tempos de Happy Feet no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Mickey Tyson",
                                    "desc": "Enviar vídeo executando 8 tempos de Mickey Tyson no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-hiphop-c3",
                        "tier": 1,
                        "col": 3,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 3",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 3 de 4.",
                        "requer": [
                              "int-hiphop-c2"
                        ],
                        "niveis": [
                              "James Brown / Soul",
                              "Rogger Rabbit",
                              "Running Man",
                              "Shamrock",
                              "Reject",
                              "Walk It Out",
                              "Heel Toe / Samba",
                              "Cat Daddy"
                        ],
                        "desafios": [
                              {
                                    "id": "int-hiphop-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "James Brown / Soul",
                                    "desc": "Enviar vídeo executando 8 tempos de James Brown / Soul no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Rogger Rabbit",
                                    "desc": "Enviar vídeo executando 8 tempos de Rogger Rabbit no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Running Man",
                                    "desc": "Enviar vídeo executando 8 tempos de Running Man no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Shamrock",
                                    "desc": "Enviar vídeo executando 8 tempos de Shamrock no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Reject",
                                    "desc": "Enviar vídeo executando 8 tempos de Reject no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r06",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Walk It Out",
                                    "desc": "Enviar vídeo executando 8 tempos de Walk It Out no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r07",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Heel Toe / Samba",
                                    "desc": "Enviar vídeo executando 8 tempos de Heel Toe / Samba no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c3-r08",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Cat Daddy",
                                    "desc": "Enviar vídeo executando 8 tempos de Cat Daddy no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-hiphop-c4",
                        "tier": 1,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Hip Hop Dance 4",
                        "icone": "mdi-shoe-sneaker",
                        "resumo": "Passos Hip Hop Dance — bloco 4 de 4.",
                        "requer": [
                              "int-hiphop-c3"
                        ],
                        "niveis": [
                              "Flinstone",
                              "Karate Kid",
                              "Horse Move",
                              "Spongebob",
                              "Pin Drop",
                              "Gallop / All Be",
                              "Whip",
                              "Lock It Down"
                        ],
                        "desafios": [
                              {
                                    "id": "int-hiphop-c4-r01",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Flinstone",
                                    "desc": "Enviar vídeo executando 8 tempos de Flinstone no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r02",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Karate Kid",
                                    "desc": "Enviar vídeo executando 8 tempos de Karate Kid no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r03",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Horse Move",
                                    "desc": "Enviar vídeo executando 8 tempos de Horse Move no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r04",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Spongebob",
                                    "desc": "Enviar vídeo executando 8 tempos de Spongebob no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r05",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Pin Drop",
                                    "desc": "Enviar vídeo executando 8 tempos de Pin Drop no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r06",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Gallop / All Be",
                                    "desc": "Enviar vídeo executando 8 tempos de Gallop / All Be no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r07",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Whip",
                                    "desc": "Enviar vídeo executando 8 tempos de Whip no ritmo."
                              },
                              {
                                    "id": "int-hiphop-c4-r08",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Lock It Down",
                                    "desc": "Enviar vídeo executando 8 tempos de Lock It Down no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-popping-c1",
                        "tier": 2,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Popping 1",
                        "icone": "mdi-flash-outline",
                        "resumo": "Passos Popping — bloco 1 de 3.",
                        "requer": [],
                        "niveis": [
                              "Phillmore",
                              "Air Pause",
                              "Dime Stop",
                              "Tic / Struble",
                              "Creep",
                              "Puppet",
                              "Toy Man",
                              "Scare Crow"
                        ],
                        "desafios": [
                              {
                                    "id": "int-popping-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Phillmore",
                                    "desc": "Enviar vídeo executando 8 tempos de Phillmore no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Air Pause",
                                    "desc": "Enviar vídeo executando 8 tempos de Air Pause no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Dime Stop",
                                    "desc": "Enviar vídeo executando 8 tempos de Dime Stop no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Tic / Struble",
                                    "desc": "Enviar vídeo executando 8 tempos de Tic / Struble no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Creep",
                                    "desc": "Enviar vídeo executando 8 tempos de Creep no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Puppet",
                                    "desc": "Enviar vídeo executando 8 tempos de Puppet no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Toy Man",
                                    "desc": "Enviar vídeo executando 8 tempos de Toy Man no ritmo."
                              },
                              {
                                    "id": "int-popping-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scare Crow",
                                    "desc": "Enviar vídeo executando 8 tempos de Scare Crow no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-popping-c2",
                        "tier": 2,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "Popping 2",
                        "icone": "mdi-flash-outline",
                        "resumo": "Passos Popping — bloco 2 de 3.",
                        "requer": [
                              "int-popping-c1"
                        ],
                        "niveis": [
                              "Sleepy",
                              "Shoot Down",
                              "Senthapeed",
                              "Wave",
                              "Snake",
                              "King Cobra",
                              "King Tut",
                              "Robot"
                        ],
                        "desafios": [
                              {
                                    "id": "int-popping-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Sleepy",
                                    "desc": "Enviar vídeo executando 8 tempos de Sleepy no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Shoot Down",
                                    "desc": "Enviar vídeo executando 8 tempos de Shoot Down no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Senthapeed",
                                    "desc": "Enviar vídeo executando 8 tempos de Senthapeed no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Wave",
                                    "desc": "Enviar vídeo executando 8 tempos de Wave no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Snake",
                                    "desc": "Enviar vídeo executando 8 tempos de Snake no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "King Cobra",
                                    "desc": "Enviar vídeo executando 8 tempos de King Cobra no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "King Tut",
                                    "desc": "Enviar vídeo executando 8 tempos de King Tut no ritmo."
                              },
                              {
                                    "id": "int-popping-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Robot",
                                    "desc": "Enviar vídeo executando 8 tempos de Robot no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-popping-c3",
                        "tier": 2,
                        "col": 3,
                        "ranksMax": 6,
                        "nome": "Popping 3",
                        "icone": "mdi-flash-outline",
                        "resumo": "Passos Popping — bloco 3 de 3.",
                        "requer": [
                              "int-popping-c2"
                        ],
                        "niveis": [
                              "Animation",
                              "Connection",
                              "Follow The Leader",
                              "Robot Walk 1",
                              "Robot Walk 2",
                              "Crazy Legs"
                        ],
                        "desafios": [
                              {
                                    "id": "int-popping-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Animation",
                                    "desc": "Enviar vídeo executando 8 tempos de Animation no ritmo."
                              },
                              {
                                    "id": "int-popping-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Connection",
                                    "desc": "Enviar vídeo executando 8 tempos de Connection no ritmo."
                              },
                              {
                                    "id": "int-popping-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Follow The Leader",
                                    "desc": "Enviar vídeo executando 8 tempos de Follow The Leader no ritmo."
                              },
                              {
                                    "id": "int-popping-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Robot Walk 1",
                                    "desc": "Enviar vídeo executando 8 tempos de Robot Walk 1 no ritmo."
                              },
                              {
                                    "id": "int-popping-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Robot Walk 2",
                                    "desc": "Enviar vídeo executando 8 tempos de Robot Walk 2 no ritmo."
                              },
                              {
                                    "id": "int-popping-c3-r06",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Crazy Legs",
                                    "desc": "Enviar vídeo executando 8 tempos de Crazy Legs no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-house-c1",
                        "tier": 3,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "House Dance 1",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 1 de 4.",
                        "requer": [],
                        "niveis": [
                              "Around The World",
                              "African Step",
                              "Pivo Pas De Bourrée",
                              "Pivo Move",
                              "Float",
                              "The Loose Legs Floating",
                              "Toe Shuffle",
                              "Scribble Foot"
                        ],
                        "desafios": [
                              {
                                    "id": "int-house-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Around The World",
                                    "desc": "Enviar vídeo executando 8 tempos de Around The World no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "African Step",
                                    "desc": "Enviar vídeo executando 8 tempos de African Step no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Pivo Pas De Bourrée",
                                    "desc": "Enviar vídeo executando 8 tempos de Pivo Pas De Bourrée no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Pivo Move",
                                    "desc": "Enviar vídeo executando 8 tempos de Pivo Move no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Float",
                                    "desc": "Enviar vídeo executando 8 tempos de Float no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "The Loose Legs Floating",
                                    "desc": "Enviar vídeo executando 8 tempos de The Loose Legs Floating no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Toe Shuffle",
                                    "desc": "Enviar vídeo executando 8 tempos de Toe Shuffle no ritmo."
                              },
                              {
                                    "id": "int-house-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scribble Foot",
                                    "desc": "Enviar vídeo executando 8 tempos de Scribble Foot no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-house-c2",
                        "tier": 3,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "House Dance 2",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 2 de 4.",
                        "requer": [
                              "int-house-c1"
                        ],
                        "niveis": [
                              "Screibble Foot Reverse",
                              "Side Walk Turn",
                              "Can Opener",
                              "Heel Toe Hiphop / Salsa Hop",
                              "Heel Toe",
                              "Gallop Shuffle",
                              "Criss Cross Chicago Style",
                              "T-step"
                        ],
                        "desafios": [
                              {
                                    "id": "int-house-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Screibble Foot Reverse",
                                    "desc": "Enviar vídeo executando 8 tempos de Screibble Foot Reverse no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Side Walk Turn",
                                    "desc": "Enviar vídeo executando 8 tempos de Side Walk Turn no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Can Opener",
                                    "desc": "Enviar vídeo executando 8 tempos de Can Opener no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Heel Toe Hiphop / Salsa Hop",
                                    "desc": "Enviar vídeo executando 8 tempos de Heel Toe Hiphop / Salsa Hop no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Heel Toe",
                                    "desc": "Enviar vídeo executando 8 tempos de Heel Toe no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Gallop Shuffle",
                                    "desc": "Enviar vídeo executando 8 tempos de Gallop Shuffle no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Criss Cross Chicago Style",
                                    "desc": "Enviar vídeo executando 8 tempos de Criss Cross Chicago Style no ritmo."
                              },
                              {
                                    "id": "int-house-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "T-step",
                                    "desc": "Enviar vídeo executando 8 tempos de T-step no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-house-c3",
                        "tier": 3,
                        "col": 3,
                        "ranksMax": 8,
                        "nome": "House Dance 3",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 3 de 4.",
                        "requer": [
                              "int-house-c2"
                        ],
                        "niveis": [
                              "Snake Walk",
                              "Pivot Groove",
                              "Time Step",
                              "Side Hop",
                              "Knee Drop / Pin Dorop",
                              "Slide Terry Style",
                              "Tick Tack",
                              "Pivot Spin"
                        ],
                        "desafios": [
                              {
                                    "id": "int-house-c3-r01",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Snake Walk",
                                    "desc": "Enviar vídeo executando 8 tempos de Snake Walk no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r02",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Pivot Groove",
                                    "desc": "Enviar vídeo executando 8 tempos de Pivot Groove no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r03",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Time Step",
                                    "desc": "Enviar vídeo executando 8 tempos de Time Step no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r04",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Side Hop",
                                    "desc": "Enviar vídeo executando 8 tempos de Side Hop no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r05",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Knee Drop / Pin Dorop",
                                    "desc": "Enviar vídeo executando 8 tempos de Knee Drop / Pin Dorop no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r06",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Slide Terry Style",
                                    "desc": "Enviar vídeo executando 8 tempos de Slide Terry Style no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r07",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Tick Tack",
                                    "desc": "Enviar vídeo executando 8 tempos de Tick Tack no ritmo."
                              },
                              {
                                    "id": "int-house-c3-r08",
                                    "tipo": "tarefa",
                                    "xp": 16,
                                    "nome": "Pivot Spin",
                                    "desc": "Enviar vídeo executando 8 tempos de Pivot Spin no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-house-c4",
                        "tier": 3,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "House Dance 4",
                        "icone": "mdi-home-variant-outline",
                        "resumo": "Passos House Dance — bloco 4 de 4.",
                        "requer": [
                              "int-house-c3"
                        ],
                        "niveis": [
                              "Entrechant",
                              "Dolphing",
                              "Rollback Dolphin",
                              "Double Dolphin",
                              "Pin Drop",
                              "Galope / All Be",
                              "Whip",
                              "Lock It Down"
                        ],
                        "desafios": [
                              {
                                    "id": "int-house-c4-r01",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Entrechant",
                                    "desc": "Enviar vídeo executando 8 tempos de Entrechant no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r02",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Dolphing",
                                    "desc": "Enviar vídeo executando 8 tempos de Dolphing no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r03",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Rollback Dolphin",
                                    "desc": "Enviar vídeo executando 8 tempos de Rollback Dolphin no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r04",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Double Dolphin",
                                    "desc": "Enviar vídeo executando 8 tempos de Double Dolphin no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r05",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Pin Drop",
                                    "desc": "Enviar vídeo executando 8 tempos de Pin Drop no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r06",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Galope / All Be",
                                    "desc": "Enviar vídeo executando 8 tempos de Galope / All Be no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r07",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Whip",
                                    "desc": "Enviar vídeo executando 8 tempos de Whip no ritmo."
                              },
                              {
                                    "id": "int-house-c4-r08",
                                    "tipo": "tarefa",
                                    "xp": 18,
                                    "nome": "Lock It Down",
                                    "desc": "Enviar vídeo executando 8 tempos de Lock It Down no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-locking-c1",
                        "tier": 4,
                        "col": 1,
                        "ranksMax": 8,
                        "nome": "Locking 1",
                        "icone": "mdi-lock-outline",
                        "resumo": "Passos Locking — bloco 1 de 2.",
                        "requer": [],
                        "niveis": [
                              "Scoobot Hop Kick",
                              "Scoobot Drop Down",
                              "Scoobot Air Point",
                              "Rock Steady",
                              "Double Lock",
                              "Wich A Way",
                              "Wolks Wagon / Iron Hourse",
                              "Funky Broadway"
                        ],
                        "desafios": [
                              {
                                    "id": "int-locking-c1-r01",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scoobot Hop Kick",
                                    "desc": "Enviar vídeo executando 8 tempos de Scoobot Hop Kick no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r02",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scoobot Drop Down",
                                    "desc": "Enviar vídeo executando 8 tempos de Scoobot Drop Down no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r03",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Scoobot Air Point",
                                    "desc": "Enviar vídeo executando 8 tempos de Scoobot Air Point no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r04",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Rock Steady",
                                    "desc": "Enviar vídeo executando 8 tempos de Rock Steady no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r05",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Double Lock",
                                    "desc": "Enviar vídeo executando 8 tempos de Double Lock no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r06",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Wich A Way",
                                    "desc": "Enviar vídeo executando 8 tempos de Wich A Way no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r07",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Wolks Wagon / Iron Hourse",
                                    "desc": "Enviar vídeo executando 8 tempos de Wolks Wagon / Iron Hourse no ritmo."
                              },
                              {
                                    "id": "int-locking-c1-r08",
                                    "tipo": "tarefa",
                                    "xp": 12,
                                    "nome": "Funky Broadway",
                                    "desc": "Enviar vídeo executando 8 tempos de Funky Broadway no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-locking-c2",
                        "tier": 4,
                        "col": 2,
                        "ranksMax": 8,
                        "nome": "Locking 2",
                        "icone": "mdi-lock-outline",
                        "resumo": "Passos Locking — bloco 2 de 2.",
                        "requer": [
                              "int-locking-c1"
                        ],
                        "niveis": [
                              "Funky Chicken",
                              "6 Steps",
                              "Point In The Air / Air Point",
                              "Scoobot",
                              "Skeeter Rabbit",
                              "Knee Drop",
                              "Jazz Split",
                              "Alpha Kick"
                        ],
                        "desafios": [
                              {
                                    "id": "int-locking-c2-r01",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Funky Chicken",
                                    "desc": "Enviar vídeo executando 8 tempos de Funky Chicken no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r02",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "6 Steps",
                                    "desc": "Enviar vídeo executando 8 tempos de 6 Steps no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r03",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Point In The Air / Air Point",
                                    "desc": "Enviar vídeo executando 8 tempos de Point In The Air / Air Point no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r04",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Scoobot",
                                    "desc": "Enviar vídeo executando 8 tempos de Scoobot no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r05",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Skeeter Rabbit",
                                    "desc": "Enviar vídeo executando 8 tempos de Skeeter Rabbit no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r06",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Knee Drop",
                                    "desc": "Enviar vídeo executando 8 tempos de Knee Drop no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r07",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Jazz Split",
                                    "desc": "Enviar vídeo executando 8 tempos de Jazz Split no ritmo."
                              },
                              {
                                    "id": "int-locking-c2-r08",
                                    "tipo": "tarefa",
                                    "xp": 14,
                                    "nome": "Alpha Kick",
                                    "desc": "Enviar vídeo executando 8 tempos de Alpha Kick no ritmo."
                              }
                        ]
                  },
                  {
                        "id": "int-insignia",
                        "tier": 4,
                        "col": 2,
                        "tipo": "insignia",
                        "ranksMax": 1,
                        "nome": "Intermediário Concluído",
                        "icone": "mdi-medal-outline",
                        "resumo": "Insígnia permanente de conclusão do nível Intermediário. Concede a PRÉVIA de Pontos de Talento (apresentação do conceito), sem alocação — a alocação livre só existe na Árvore de Talentos.",
                        "requer": [
                              "int-hiphop-c1",
                              "int-hiphop-c2",
                              "int-hiphop-c3",
                              "int-hiphop-c4",
                              "int-popping-c1",
                              "int-popping-c2",
                              "int-popping-c3",
                              "int-house-c1",
                              "int-house-c2",
                              "int-house-c3",
                              "int-house-c4",
                              "int-locking-c1",
                              "int-locking-c2"
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
  global.UDX_INTERMEDIARIO = F;
}(typeof window !== 'undefined' ? window : this));
