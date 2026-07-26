/**
 * UP DANCE EXPERIENCE — NÍVEL INTERMEDIÁRIO (v2) — 3 CARDS LADO A LADO
 * Card 1 Preparo (alongamentos, postura e warm-ups avançados).
 * Card 2 Cultura & Vocabulário (A Cultura Hip Hop, História e Vocabulário de
 *        Hip Hop Dance/Popping/Breaking-Top Rock, Sequências Coreográficas).
 * Card 3 Corpo & Improviso (Corporeidade, Groove e Improviso por linguagem,
 *        História/Vocabulário/Coreografia de Locking e Improviso livre).
 * Cada card é um PERFIL (coluna). Backend: perfil_id único 'intermediario'
 * (runtime.perfilId) — o split em colunas é só disposição visual. Cores por
 * card via .tt-tree[data-perfil="prep|cult|corp"] em niveis.css.
 * Vocabulário [ INTERMEDIÁRIO ] extraído do Catálogo de Passos (Danças Urbanas).
 * IDs prefixados 'i2-' para não colidir com o antigo card 'intermediario'
 * nem com as demais trilhas (talent_desafios.id é PRIMARY KEY global).
 * limiarXPE = soma de todo o XP (único) dos desafios (derivado; ver worker_trilhas.js).
 */
(function (global) {
  'use strict';
  var F = {
    "versao": "2.0.0",
    "temporada": {
      "id": "INTERMEDIARIO",
      "nome": "Intermediário",
      "nivelAlvo": "Intermediário",
      "promovePara": "Estagiário(a) (via banca)",
      "limiarXPE": 2430
    },
    "runtime": {
      "perfilId": "intermediario",
      "resource": "nivel-intermediario",
      "chaveLocal": "udx:intermediario:v2",
      "insigniaId": "int-insignia",
      "api": {
        "me": "/api/me",
        "estado": "/api/trilha/estado?perfil=intermediario",
        "desafio": "/api/trilha/desafio"
      }
    },
    "tiposComAcesso": [
      "Intermediário",
      "Estagiário(a)",
      "Assistente",
      "Monitor(a)",
      "Professor(a)",
      "Premium"
    ],
    "tiposDesafio": {
      "tarefa": {
        "label": "Tarefa",
        "icone": "mdi-checkbox-marked-circle-outline"
      },
      "atividade": {
        "label": "Atividade",
        "icone": "mdi-account-clock-outline"
      },
      "evento": {
        "label": "Evento",
        "icone": "mdi-calendar-star"
      }
    },
    "perfis": [
      {
        "id": "prep",
        "nome": "Preparo",
        "segmento": "Aquecer · Alinhar · Ativar",
        "icone": "mdi-yoga",
        "xpLabel": "Preparo",
        "tiers": [
          {
            "n": 1,
            "nome": "Ativação"
          },
          {
            "n": 2,
            "nome": "Mobilidade & Postura"
          },
          {
            "n": 3,
            "nome": "Warm-up Avançado"
          },
          {
            "n": 4,
            "nome": "Conclusão"
          }
        ],
        "habilidades": [
          {
            "id": "i2-prep-core",
            "tier": 1,
            "col": 1,
            "ranksMax": 4,
            "nome": "Ativação de Core",
            "icone": "mdi-yoga",
            "resumo": "Ativação de Core",
            "requer": [],
            "niveis": [
              "Respiração diafragmática em movimento",
              "Ativação de core em prancha dinâmica",
              "Core em transferência de peso",
              "Core sob rotação e nível baixo"
            ],
            "desafios": [
              {
                "id": "i2-prep-core-r01",
                "tipo": "tarefa",
                "xp": 14,
                "nome": "Ativação de Core · 1",
                "desc": "Enviar vídeo executando: Respiração diafragmática em movimento."
              },
              {
                "id": "i2-prep-core-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Ativação de Core · 2",
                "desc": "Enviar vídeo executando: Ativação de core em prancha dinâmica."
              },
              {
                "id": "i2-prep-core-r03",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Ativação de Core · 3",
                "desc": "Enviar vídeo executando: Core em transferência de peso."
              },
              {
                "id": "i2-prep-core-r04",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Ativação de Core · 4",
                "desc": "Enviar vídeo executando: Core sob rotação e nível baixo."
              }
            ]
          },
          {
            "id": "i2-prep-artic",
            "tier": 1,
            "col": 2,
            "ranksMax": 4,
            "nome": "Mobilidade Articular",
            "icone": "mdi-rotate-3d-variant",
            "resumo": "Mobilidade Articular",
            "requer": [],
            "niveis": [
              "Tornozelo e joelho",
              "Quadril (círculos e aberturas)",
              "Coluna torácica",
              "Ombros e escápulas"
            ],
            "desafios": [
              {
                "id": "i2-prep-artic-r01",
                "tipo": "tarefa",
                "xp": 14,
                "nome": "Mobilidade Articular · 1",
                "desc": "Enviar vídeo executando: Tornozelo e joelho."
              },
              {
                "id": "i2-prep-artic-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Mobilidade Articular · 2",
                "desc": "Enviar vídeo executando: Quadril (círculos e aberturas)."
              },
              {
                "id": "i2-prep-artic-r03",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Mobilidade Articular · 3",
                "desc": "Enviar vídeo executando: Coluna torácica."
              },
              {
                "id": "i2-prep-artic-r04",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Mobilidade Articular · 4",
                "desc": "Enviar vídeo executando: Ombros e escápulas."
              }
            ]
          },
          {
            "id": "i2-prep-cadeias",
            "tier": 1,
            "col": 3,
            "ranksMax": 3,
            "nome": "Cadeias Musculares",
            "icone": "mdi-human",
            "resumo": "Cadeias Musculares",
            "requer": [],
            "niveis": [
              "Cadeia posterior (ísquios e panturrilha)",
              "Cadeia anterior (flexores de quadril)",
              "Cadeia lateral e rotadores"
            ],
            "desafios": [
              {
                "id": "i2-prep-cadeias-r01",
                "tipo": "tarefa",
                "xp": 14,
                "nome": "Cadeias Musculares · 1",
                "desc": "Enviar vídeo executando: Cadeia posterior (ísquios e panturrilha)."
              },
              {
                "id": "i2-prep-cadeias-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Cadeias Musculares · 2",
                "desc": "Enviar vídeo executando: Cadeia anterior (flexores de quadril)."
              },
              {
                "id": "i2-prep-cadeias-r03",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Cadeias Musculares · 3",
                "desc": "Enviar vídeo executando: Cadeia lateral e rotadores."
              }
            ]
          },
          {
            "id": "i2-prep-postura",
            "tier": 2,
            "col": 1,
            "ranksMax": 4,
            "nome": "Alinhamento Postural",
            "icone": "mdi-human-male",
            "resumo": "Alinhamento Postural",
            "requer": [
              "i2-prep-core"
            ],
            "niveis": [
              "Alinhamento em pé (pés, joelhos, quadril)",
              "Alinhamento em nível médio (plié)",
              "Alinhamento sob deslocamento",
              "Alinhamento em apoio no chão"
            ],
            "desafios": [
              {
                "id": "i2-prep-postura-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Alinhamento Postural · 1",
                "desc": "Enviar vídeo executando: Alinhamento em pé (pés, joelhos, quadril)."
              },
              {
                "id": "i2-prep-postura-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Alinhamento Postural · 2",
                "desc": "Enviar vídeo executando: Alinhamento em nível médio (plié)."
              },
              {
                "id": "i2-prep-postura-r03",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Alinhamento Postural · 3",
                "desc": "Enviar vídeo executando: Alinhamento sob deslocamento."
              },
              {
                "id": "i2-prep-postura-r04",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Alinhamento Postural · 4",
                "desc": "Enviar vídeo executando: Alinhamento em apoio no chão."
              }
            ]
          },
          {
            "id": "i2-prep-quadril",
            "tier": 2,
            "col": 2,
            "ranksMax": 4,
            "nome": "Mobilidade de Quadril",
            "icone": "mdi-run",
            "resumo": "Mobilidade de Quadril",
            "requer": [
              "i2-prep-artic"
            ],
            "niveis": [
              "Amplitude de abertura e fechamento",
              "Dissociação quadril × tronco",
              "Isolamento nos três planos",
              "Quadril sob groove contínuo"
            ],
            "desafios": [
              {
                "id": "i2-prep-quadril-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Mobilidade de Quadril · 1",
                "desc": "Enviar vídeo executando: Amplitude de abertura e fechamento."
              },
              {
                "id": "i2-prep-quadril-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Mobilidade de Quadril · 2",
                "desc": "Enviar vídeo executando: Dissociação quadril × tronco."
              },
              {
                "id": "i2-prep-quadril-r03",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Mobilidade de Quadril · 3",
                "desc": "Enviar vídeo executando: Isolamento nos três planos."
              },
              {
                "id": "i2-prep-quadril-r04",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Mobilidade de Quadril · 4",
                "desc": "Enviar vídeo executando: Quadril sob groove contínuo."
              }
            ]
          },
          {
            "id": "i2-prep-coluna",
            "tier": 2,
            "col": 3,
            "ranksMax": 4,
            "nome": "Dissociação de Coluna",
            "icone": "mdi-spa",
            "resumo": "Dissociação de Coluna",
            "requer": [
              "i2-prep-cadeias"
            ],
            "niveis": [
              "Ondulação (crista a sacro)",
              "Dissociação cervical × torácica",
              "Contração e release",
              "Espiral e torção controlada"
            ],
            "desafios": [
              {
                "id": "i2-prep-coluna-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Dissociação de Coluna · 1",
                "desc": "Enviar vídeo executando: Ondulação (crista a sacro)."
              },
              {
                "id": "i2-prep-coluna-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Dissociação de Coluna · 2",
                "desc": "Enviar vídeo executando: Dissociação cervical × torácica."
              },
              {
                "id": "i2-prep-coluna-r03",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Dissociação de Coluna · 3",
                "desc": "Enviar vídeo executando: Contração e release."
              },
              {
                "id": "i2-prep-coluna-r04",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Dissociação de Coluna · 4",
                "desc": "Enviar vídeo executando: Espiral e torção controlada."
              }
            ]
          },
          {
            "id": "i2-prep-warmup",
            "tier": 3,
            "col": 2,
            "ranksMax": 4,
            "nome": "Warm-up Avançado",
            "icone": "mdi-fire",
            "resumo": "Warm-up Avançado",
            "requer": [
              "i2-prep-postura",
              "i2-prep-quadril",
              "i2-prep-coluna"
            ],
            "niveis": [
              "Warm-up rítmico de 8 tempos",
              "Warm-up com deslocamento e nível",
              "Warm-up coreografado curto",
              "Warm-up integrado à aula (autônomo)"
            ],
            "desafios": [
              {
                "id": "i2-prep-warmup-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Warm-up Avançado · 1",
                "desc": "Enviar vídeo executando: Warm-up rítmico de 8 tempos."
              },
              {
                "id": "i2-prep-warmup-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Warm-up Avançado · 2",
                "desc": "Enviar vídeo executando: Warm-up com deslocamento e nível."
              },
              {
                "id": "i2-prep-warmup-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Warm-up Avançado · 3",
                "desc": "Enviar vídeo executando: Warm-up coreografado curto."
              },
              {
                "id": "i2-prep-warmup-r04",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Warm-up Avançado · 4",
                "desc": "Enviar vídeo executando: Warm-up integrado à aula (autônomo)."
              }
            ]
          },
          {
            "id": "i2-prep-titulo",
            "tier": 4,
            "col": 2,
            "ranksMax": 1,
            "nome": "Corpo Preparado",
            "icone": "mdi-medal-outline",
            "resumo": "Conclusão do card de preparo: aquecimento, postura e mobilidade avançados.",
            "requer": [
              "i2-prep-warmup"
            ],
            "niveis": [
              "Conquista concluída — card dominado."
            ],
            "desafios": [],
            "tipo": "titulo"
          }
        ]
      },
      {
        "id": "corp",
        "nome": "Corpo & Improviso",
        "segmento": "Corporeidade · Groove · Flow",
        "icone": "mdi-human-handsup",
        "xpLabel": "Corpo & Improviso",
        "tiers": [
          {
            "n": 1,
            "nome": "Groove"
          },
          {
            "n": 2,
            "nome": "Corporeidade"
          },
          {
            "n": 3,
            "nome": "Improviso"
          },
          {
            "n": 4,
            "nome": "Introdução ao Locking"
          },
          {
            "n": 5,
            "nome": "Improviso Livre"
          },
          {
            "n": 6,
            "nome": "Conclusão"
          }
        ],
        "habilidades": [
          {
            "id": "i2-corp-groove-hhd",
            "tier": 1,
            "col": 1,
            "ranksMax": 3,
            "nome": "Groove do Hip Hop Dance",
            "icone": "mdi-sine-wave",
            "resumo": "Groove do Hip Hop Dance",
            "requer": [
              /*"i2-corp-corpo"*/
            ],
            "niveis": [
              "Bounce e rebote (down/up)",
              "Groove contínuo em 8 tempos",
              "Groove com deslocamento"
            ],
            "desafios": [
              {
                "id": "i2-corp-groove-hhd-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Groove do Hip Hop Dance · 1",
                "desc": "Enviar vídeo executando: Bounce e rebote (down/up)."
              },
              {
                "id": "i2-corp-groove-hhd-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Groove do Hip Hop Dance · 2",
                "desc": "Enviar vídeo executando: Groove contínuo em 8 tempos."
              },
              {
                "id": "i2-corp-groove-hhd-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Groove do Hip Hop Dance · 3",
                "desc": "Enviar vídeo executando: Groove com deslocamento."
              }
            ]
          },
          {
            "id": "i2-corp-groove-pop",
            "tier": 1,
            "col": 2,
            "ranksMax": 3,
            "nome": "Groove do Popping",
            "icone": "mdi-sine-wave",
            "resumo": "Groove do Popping",
            "requer": [
              /*"i2-corp-corpo"*/
            ],
            "niveis": [
              "Fresno e o pulso do pop",
              "Groove com hits no tempo",
              "Groove com camadas"
            ],
            "desafios": [
              {
                "id": "i2-corp-groove-pop-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Groove do Popping · 1",
                "desc": "Enviar vídeo executando: Fresno e o pulso do pop."
              },
              {
                "id": "i2-corp-groove-pop-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Groove do Popping · 2",
                "desc": "Enviar vídeo executando: Groove com hits no tempo."
              },
              {
                "id": "i2-corp-groove-pop-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Groove do Popping · 3",
                "desc": "Enviar vídeo executando: Groove com camadas."
              }
            ]
          },
          {
            "id": "i2-corp-groove-brk",
            "tier": 1,
            "col": 3,
            "ranksMax": 3,
            "nome": "Groove do Breaking",
            "icone": "mdi-sine-wave",
            "resumo": "Groove do Breaking",
            "requer": [
              /*"i2-corp-corpo"*/
            ],
            "niveis": [
              "Bounce de toprock",
              "Groove com troca de apoio",
              "Groove com intenção de battle"
            ],
            "desafios": [
              {
                "id": "i2-corp-groove-brk-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Groove do Breaking · 1",
                "desc": "Enviar vídeo executando: Bounce de toprock."
              },
              {
                "id": "i2-corp-groove-brk-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Groove do Breaking · 2",
                "desc": "Enviar vídeo executando: Groove com troca de apoio."
              },
              {
                "id": "i2-corp-groove-brk-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Groove do Breaking · 3",
                "desc": "Enviar vídeo executando: Groove com intenção de battle."
              }
            ]
          },
          {
            "id": "i2-corp-corpo",
            "tier": 2,
            "col": 2,
            "ranksMax": 3,
            "nome": "Corporeidade",
            "icone": "mdi-human-handsup",
            "resumo": "Corporeidade",
            "requer": ["i2-corp-groove-brk", "i2-corp-groove-pop","i2-corp-groove-hhd"],
            "niveis": [
              "Peso, apoio e eixo",
              "Qualidades de movimento (peso, tempo, fluência)",
              "Corporeidade aplicada a uma linguagem"
            ],
            "desafios": [
              {
                "id": "i2-corp-corpo-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "Corporeidade · 1",
                "desc": "Enviar vídeo executando: Peso, apoio e eixo."
              },
              {
                "id": "i2-corp-corpo-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Corporeidade · 2",
                "desc": "Enviar vídeo executando: Qualidades de movimento (peso, tempo, fluência)."
              },
              {
                "id": "i2-corp-corpo-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Corporeidade · 3",
                "desc": "Enviar vídeo executando: Corporeidade aplicada a uma linguagem."
              }
            ]
          },
          {
            "id": "i2-corp-improv-hhd",
            "tier": 3,
            "col": 1,
            "ranksMax": 3,
            "nome": "Improviso Hip Hop Dance",
            "icone": "mdi-shuffle-variant",
            "resumo": "Improviso Hip Hop Dance",
            "requer": [
              /*"i2-corp-groove-hhd"*/
              "i2-corp-corpo"
            ],
            "niveis": [
              "8 tempos de freestyle sem repetir passo",
              "Improviso reagindo à música",
              "Improviso com deslocamento e nível"
            ],
            "desafios": [
              {
                "id": "i2-corp-improv-hhd-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Hip Hop Dance · 1",
                "desc": "Enviar vídeo de improviso: 8 tempos de freestyle sem repetir passo."
              },
              {
                "id": "i2-corp-improv-hhd-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Hip Hop Dance · 2",
                "desc": "Enviar vídeo de improviso: Improviso reagindo à música."
              },
              {
                "id": "i2-corp-improv-hhd-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Improviso Hip Hop Dance · 3",
                "desc": "Enviar vídeo de improviso: Improviso com deslocamento e nível."
              }
            ]
          },
          {
            "id": "i2-corp-improv-pop",
            "tier": 3,
            "col": 2,
            "ranksMax": 3,
            "nome": "Improviso Popping",
            "icone": "mdi-shuffle-variant",
            "resumo": "Improviso Popping",
            "requer": [
              /*"i2-corp-groove-pop"*/
              "i2-corp-corpo"
            ],
            "niveis": [
              "Improviso com técnica de popping",
              "Improviso reagindo a hits",
              "Improviso com transições limpas"
            ],
            "desafios": [
              {
                "id": "i2-corp-improv-pop-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Popping · 1",
                "desc": "Enviar vídeo de improviso: Improviso com técnica de popping."
              },
              {
                "id": "i2-corp-improv-pop-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Popping · 2",
                "desc": "Enviar vídeo de improviso: Improviso reagindo a hits."
              },
              {
                "id": "i2-corp-improv-pop-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Improviso Popping · 3",
                "desc": "Enviar vídeo de improviso: Improviso com transições limpas."
              }
            ]
          },
          {
            "id": "i2-corp-improv-brk",
            "tier": 3,
            "col": 3,
            "ranksMax": 3,
            "nome": "Improviso Breaking",
            "icone": "mdi-shuffle-variant",
            "resumo": "Improviso Breaking",
            "requer": [
              /*"i2-corp-groove-brk"*/
              "i2-corp-corpo"
            ],
            "niveis": [
              "Toprock livre por 8 tempos",
              "Improviso com entrada ao chão",
              "Round improvisado (toprock + footwork)"
            ],
            "desafios": [
              {
                "id": "i2-corp-improv-brk-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Breaking · 1",
                "desc": "Enviar vídeo de improviso: Toprock livre por 8 tempos."
              },
              {
                "id": "i2-corp-improv-brk-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Improviso Breaking · 2",
                "desc": "Enviar vídeo de improviso: Improviso com entrada ao chão."
              },
              {
                "id": "i2-corp-improv-brk-r03",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Improviso Breaking · 3",
                "desc": "Enviar vídeo de improviso: Round improvisado (toprock + footwork)."
              }
            ]
          },
          {
            "id": "i2-corp-lock-hist",
            "tier": 4,
            "col": 1,
            "ranksMax": 2,
            "nome": "História do Locking",
            "icone": "mdi-history",
            "resumo": "História do Locking",
            "requer": [
              /*"i2-corp-corpo"*/
              "i2-corp-improv-hhd",
              "i2-corp-improv-pop",
              "i2-corp-improv-brk"
            ],
            "niveis": [
              "Don Campbell e a origem do locking",
              "Vocabulário-base e a atitude do estilo"
            ],
            "desafios": [
              {
                "id": "i2-corp-lock-hist-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "História do Locking · 1",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Don Campbell e a origem do locking."
              },
              {
                "id": "i2-corp-lock-hist-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "História do Locking · 2",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Vocabulário-base e a atitude do estilo."
              }
            ]
          },
          {
            "id": "i2-corp-lock-voc-c1",
            "tier": 4,
            "col": 1,
            "ranksMax": 8,
            "nome": "Vocabulário Locking 1",
            "icone": "mdi-lock-outline",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Locking (parte 1).",
            "requer": [
              "i2-corp-lock-hist"
            ],
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
                "id": "i2-corp-lock-voc-c1-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Scoobot Hop Kick com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Scoobot Drop Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Scoobot Air Point com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Rock Steady com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Double Lock com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Wich A Way com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Wolks Wagon / Iron Hourse com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c1-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 1 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Funky Broadway com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-corp-lock-voc-c2",
            "tier": 4,
            "col": 2,
            "ranksMax": 8,
            "nome": "Vocabulário Locking 2",
            "icone": "mdi-lock-outline",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Locking (parte 2).",
            "requer": [
              "i2-corp-lock-voc-c1"
            ],
            "niveis": [
              "Funky Chicken",
              "6 Steps",
              "Point IN The Air / Air Point",
              "Scoobot",
              "Skeeter Rabbit",
              "Knee Drop",
              "Jazz Split",
              "Alpha Kick"
            ],
            "desafios": [
              {
                "id": "i2-corp-lock-voc-c2-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Funky Chicken com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 2",
                "desc": "Enviar vídeo executando 8 tempos de 6 Steps com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Point IN The Air / Air Point com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Scoobot com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Skeeter Rabbit com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Knee Drop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Jazz Split com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-corp-lock-voc-c2-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Locking 2 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Alpha Kick com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-corp-lock-coreo",
            "tier": 5,
            "col": 1,
            "ranksMax": 3,
            "nome": "Seq. Coreográfica Locking",
            "icone": "mdi-music-note-eighth",
            "resumo": "Seq. Coreográfica Locking",
            "requer": [
              "i2-corp-lock-voc-c2"
            ],
            "niveis": [
              "Frase A com vocabulário de locking",
              "Frase B com locks e pointers",
              "A+B no tempo, com atitude"
            ],
            "desafios": [
              {
                "id": "i2-corp-lock-coreo-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Seq. Coreográfica Locking · 1",
                "desc": "Enviar vídeo da sequência coreográfica: Frase A com vocabulário de locking."
              },
              {
                "id": "i2-corp-lock-coreo-r02",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Seq. Coreográfica Locking · 2",
                "desc": "Enviar vídeo da sequência coreográfica: Frase B com locks e pointers."
              },
              {
                "id": "i2-corp-lock-coreo-r03",
                "tipo": "tarefa",
                "xp": 22,
                "nome": "Seq. Coreográfica Locking · 3",
                "desc": "Enviar vídeo da sequência coreográfica: A+B no tempo, com atitude."
              }
            ]
          },
          {
            "id": "i2-corp-improviso",
            "tier": 5,
            "col": 3,
            "ranksMax": 3,
            "nome": "Improviso",
            "icone": "mdi-star-four-points",
            "resumo": "Improviso",
            "requer": [
              "i2-corp-lock-coreo",
              "i2-corp-improv-hhd",
              "i2-corp-improv-pop",
              "i2-corp-improv-brk"
            ],
            "niveis": [
              "Improviso livre integrando 2 linguagens",
              "Improviso em cypher (interação)",
              "Improviso reagindo a faixa surpresa"
            ],
            "desafios": [
              {
                "id": "i2-corp-improviso-r01",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Improviso · 1",
                "desc": "Enviar vídeo de improviso: Improviso livre integrando 2 linguagens."
              },
              {
                "id": "i2-corp-improviso-r02",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Improviso · 2",
                "desc": "Enviar vídeo de improviso: Improviso em cypher (interação)."
              },
              {
                "id": "i2-corp-improviso-r03",
                "tipo": "tarefa",
                "xp": 22,
                "nome": "Improviso · 3",
                "desc": "Enviar vídeo de improviso: Improviso reagindo a faixa surpresa."
              }
            ]
          },
          {
            "id": "i2-corp-titulo",
            "tier": 6,
            "col": 2,
            "ranksMax": 1,
            "nome": "Corpo & Improviso",
            "icone": "mdi-medal-outline",
            "resumo": "Conclusão do card de corporeidade, groove, improviso e locking.",
            "requer": [
              "i2-corp-improviso"
            ],
            "niveis": [
              "Conquista concluída — card dominado."
            ],
            "desafios": [],
            "tipo": "titulo"
          }
        ]
      },
      {
        "id": "cult",
        "nome": "Cultura & Vocabulário",
        "segmento": "Saber · Nomear · Dançar",
        "icone": "mdi-account-group-outline",
        "xpLabel": "Cultura & Vocabulário",
        "tiers": [
          {
            "n": 1,
            "nome": "A Cultura"
          },
          {
            "n": 2,
            "nome": "História & Origens"
          },
          {
            "n": 3,
            "nome": "Hip Hop Dance"
          },
          {
            "n": 4,
            "nome": "Popping"
          },
          {
            "n": 5,
            "nome": "Breaking · Top Rock"
          },
          {
            "n": 6,
            "nome": "Conclusão"
          }
        ],
        "habilidades": [
          {
            "id": "i2-cult-cultura",
            "tier": 1,
            "col": 2,
            "ranksMax": 3,
            "nome": "A Cultura Hip Hop",
            "icone": "mdi-account-group-outline",
            "resumo": "A Cultura Hip Hop",
            "requer": [],
            "niveis": [
              "Os 4 elementos (+ o 5º: conhecimento)",
              "Origem no Bronx e o contexto social",
              "Valores: paz, amor, união e diversão"
            ],
            "desafios": [
              {
                "id": "i2-cult-cultura-r01",
                "tipo": "tarefa",
                "xp": 14,
                "nome": "A Cultura Hip Hop · 1",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Os 4 elementos (+ o 5º: conhecimento)."
              },
              {
                "id": "i2-cult-cultura-r02",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "A Cultura Hip Hop · 2",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Origem no Bronx e o contexto social."
              },
              {
                "id": "i2-cult-cultura-r03",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "A Cultura Hip Hop · 3",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Valores: paz, amor, união e diversão."
              }
            ]
          },
          {
            "id": "i2-cult-hist-hhd",
            "tier": 2,
            "col": 1,
            "ranksMax": 2,
            "nome": "História do Hip Hop Dance",
            "icone": "mdi-history",
            "resumo": "História do Hip Hop Dance",
            "requer": [
              "i2-cult-cultura"
            ],
            "niveis": [
              "Party/social dances (anos 70–80)",
              "Do freestyle às companhias e à cena atual"
            ],
            "desafios": [
              {
                "id": "i2-cult-hist-hhd-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "História do Hip Hop Dance · 1",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Party/social dances (anos 70–80)."
              },
              {
                "id": "i2-cult-hist-hhd-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "História do Hip Hop Dance · 2",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Do freestyle às companhias e à cena atual."
              }
            ]
          },
          {
            "id": "i2-cult-hist-pop",
            "tier": 2,
            "col": 2,
            "ranksMax": 2,
            "nome": "História do Popping",
            "icone": "mdi-history",
            "resumo": "História do Popping",
            "requer": [
              "i2-cult-cultura"
            ],
            "niveis": [
              "Funk styles da Costa Oeste e o boogaloo",
              "Vertentes: tutting, waving, animation"
            ],
            "desafios": [
              {
                "id": "i2-cult-hist-pop-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "História do Popping · 1",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Funk styles da Costa Oeste e o boogaloo."
              },
              {
                "id": "i2-cult-hist-pop-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "História do Popping · 2",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Vertentes: tutting, waving, animation."
              }
            ]
          },
          {
            "id": "i2-cult-hist-brk",
            "tier": 2,
            "col": 3,
            "ranksMax": 2,
            "nome": "História do Breaking",
            "icone": "mdi-history",
            "resumo": "História do Breaking",
            "requer": [
              "i2-cult-cultura"
            ],
            "niveis": [
              "B-boying/b-girling: origem e domínios",
              "Toprock, footwork, freeze e power moves"
            ],
            "desafios": [
              {
                "id": "i2-cult-hist-brk-r01",
                "tipo": "tarefa",
                "xp": 16,
                "nome": "História do Breaking · 1",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: B-boying/b-girling: origem e domínios."
              },
              {
                "id": "i2-cult-hist-brk-r02",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "História do Breaking · 2",
                "desc": "Entregar registro (texto ou vídeo curto) sobre: Toprock, footwork, freeze e power moves."
              }
            ]
          },
          {
            "id": "i2-cult-voc-hhd-c1",
            "tier": 3,
            "col": 1,
            "ranksMax": 8,
            "nome": "Vocabulário Hip Hop Dance 1",
            "icone": "mdi-shoe-sneaker",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Hip Hop Dance (parte 1).",
            "requer": [
              "i2-cult-hist-hhd"
            ],
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
                "id": "i2-cult-voc-hhd-c1-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Smeeze com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Harlem Shake com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Steve Martin com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Kick Ball Change / Kick Step com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 5",
                "desc": "Enviar vídeo executando 8 tempos de C-wlak com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Jerk com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Jacking / Humpty Hump com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c1-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 1 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Fly Girl com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-hhd-c2",
            "tier": 3,
            "col": 2,
            "ranksMax": 8,
            "nome": "Vocabulário Hip Hop Dance 2",
            "icone": "mdi-shoe-sneaker",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Hip Hop Dance (parte 2).",
            "requer": [
              "i2-cult-voc-hhd-c1"
            ],
            "niveis": [
              "Salsa Hop",
              "Woobble",
              "Party Machine",
              "Alf",
              "Reject",
              "Brooklin Bounce / BK Bounce",
              "Happy Feet",
              "Mickey Tyson"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-hhd-c2-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Salsa Hop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Woobble com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Party Machine com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Alf com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Reject com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Brooklin Bounce / BK Bounce com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Happy Feet com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c2-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 2 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Mickey Tyson com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-hhd-c3",
            "tier": 3,
            "col": 3,
            "ranksMax": 8,
            "nome": "Vocabulário Hip Hop Dance 3",
            "icone": "mdi-shoe-sneaker",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Hip Hop Dance (parte 3).",
            "requer": [
              "i2-cult-voc-hhd-c2"
            ],
            "niveis": [
              "James Brown / Soul",
              "Rogger Rabbit",
              "Running Man",
              "Shamrock",
              "Walk IT Out",
              "Heel Toe / Samba",
              "Cat Daddy",
              "Flinstone"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-hhd-c3-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 1",
                "desc": "Enviar vídeo executando 8 tempos de James Brown / Soul com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Rogger Rabbit com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Running Man com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Shamrock com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Walk IT Out com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Heel Toe / Samba com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Cat Daddy com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c3-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 3 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Flinstone com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-hhd-c4",
            "tier": 3,
            "col": 1,
            "ranksMax": 7,
            "nome": "Vocabulário Hip Hop Dance 4",
            "icone": "mdi-shoe-sneaker",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Hip Hop Dance (parte 4).",
            "requer": [
              "i2-cult-voc-hhd-c3"
            ],
            "niveis": [
              "Karate Kid",
              "Horse Move",
              "Spongebob",
              "Pin Drop",
              "Gallop / All BE",
              "Whip",
              "Lock IT Down"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-hhd-c4-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Karate Kid com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Horse Move com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Spongebob com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Pin Drop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Gallop / All BE com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Whip com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-hhd-c4-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Hip Hop Dance 4 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Lock IT Down com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-pop-c1",
            "tier": 4,
            "col": 1,
            "ranksMax": 8,
            "nome": "Vocabulário Popping 1",
            "icone": "mdi-robot-outline",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Popping (parte 1).",
            "requer": [
              "i2-cult-hist-pop"
            ],
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
                "id": "i2-cult-voc-pop-c1-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Phillmore com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Air Pause com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Dime Stop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Tic / Struble com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Creep com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Puppet com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Toy Man com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c1-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 1 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Scare Crow com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-pop-c2",
            "tier": 4,
            "col": 2,
            "ranksMax": 8,
            "nome": "Vocabulário Popping 2",
            "icone": "mdi-robot-outline",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Popping (parte 2).",
            "requer": [
              "i2-cult-voc-pop-c1"
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
                "id": "i2-cult-voc-pop-c2-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Sleepy com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Shoot Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Senthapeed com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Wave com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Snake com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 6",
                "desc": "Enviar vídeo executando 8 tempos de King Cobra com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 7",
                "desc": "Enviar vídeo executando 8 tempos de King Tut com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c2-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 2 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Robot com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-pop-c3",
            "tier": 4,
            "col": 3,
            "ranksMax": 6,
            "nome": "Vocabulário Popping 3",
            "icone": "mdi-robot-outline",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Popping (parte 3).",
            "requer": [
              "i2-cult-voc-pop-c2"
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
                "id": "i2-cult-voc-pop-c3-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Animation com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c3-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Connection com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c3-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Follow The Leader com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c3-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Robot Walk 1 com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c3-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Robot Walk 2 com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-pop-c3-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Popping 3 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Crazy Legs com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-top-c1",
            "tier": 5,
            "col": 1,
            "ranksMax": 8,
            "nome": "Vocabulário Breaking · Top Rock 1",
            "icone": "mdi-account-tie-hat",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Breaking · Top Rock (parte 1).",
            "requer": [
              "i2-cult-hist-brk"
            ],
            "niveis": [
              "Front Back And Down",
              "Step Front-step Back And Down",
              "Side TO Side-front-back And Down",
              "Arm Punch-front-back And Down",
              "Arm Punch-roll And Down",
              "Arm Punch-kick And Down",
              "Jump TO Side-back Knee And Down",
              "Jump TO Side-back Knee Turn And Down"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-top-c1-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Front Back And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Step Front-step Back And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Side TO Side-front-back And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Arm Punch-front-back And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Arm Punch-roll And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Arm Punch-kick And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Jump TO Side-back Knee And Down com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c1-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 1 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Jump TO Side-back Knee Turn And Down com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-top-c2",
            "tier": 5,
            "col": 2,
            "ranksMax": 8,
            "nome": "Vocabulário Breaking · Top Rock 2",
            "icone": "mdi-account-tie-hat",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Breaking · Top Rock (parte 2).",
            "requer": [
              "i2-cult-voc-top-c1"
            ],
            "niveis": [
              "Drop Knee TO Front",
              "Drop TO Side",
              "Dolphin Drop",
              "Suicide",
              "Ground Drop",
              "Shift",
              "Double Shift",
              "Worm"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-top-c2-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Drop Knee TO Front com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Drop TO Side com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Dolphin Drop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Suicide com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Ground Drop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Shift com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Double Shift com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c2-r08",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 2 · 8",
                "desc": "Enviar vídeo executando 8 tempos de Worm com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-voc-top-c3",
            "tier": 5,
            "col": 3,
            "ranksMax": 7,
            "nome": "Vocabulário Breaking · Top Rock 3",
            "icone": "mdi-account-tie-hat",
            "resumo": "Passos [ INTERMEDIÁRIO ] do Catálogo — Vocabulário Breaking · Top Rock (parte 3).",
            "requer": [
              "i2-cult-voc-top-c2"
            ],
            "niveis": [
              "Donkey",
              "Macaco",
              "Neck Srping",
              "Neck Spring Half Twist",
              "Hand Hop",
              "Ninja",
              "Coin Drop"
            ],
            "desafios": [
              {
                "id": "i2-cult-voc-top-c3-r01",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 1",
                "desc": "Enviar vídeo executando 8 tempos de Donkey com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r02",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 2",
                "desc": "Enviar vídeo executando 8 tempos de Macaco com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r03",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 3",
                "desc": "Enviar vídeo executando 8 tempos de Neck Srping com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r04",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 4",
                "desc": "Enviar vídeo executando 8 tempos de Neck Spring Half Twist com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r05",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 5",
                "desc": "Enviar vídeo executando 8 tempos de Hand Hop com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r06",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 6",
                "desc": "Enviar vídeo executando 8 tempos de Ninja com controle, dinâmica e musicalidade."
              },
              {
                "id": "i2-cult-voc-top-c3-r07",
                "tipo": "tarefa",
                "xp": 12,
                "nome": "Vocabulário Breaking · Top Rock 3 · 7",
                "desc": "Enviar vídeo executando 8 tempos de Coin Drop com controle, dinâmica e musicalidade."
              }
            ]
          },
          {
            "id": "i2-cult-coreo-hhd",
            "tier": 3,
            "col": 1,
            "ranksMax": 3,
            "nome": "Seq. Coreográfica Hip Hop Dance",
            "icone": "mdi-music-note-eighth",
            "resumo": "Seq. Coreográfica Hip Hop Dance",
            "requer": [
              "i2-cult-voc-hhd-c4"
            ],
            "niveis": [
              "Frase A com vocabulário HHD",
              "Frase B com dinâmica e level change",
              "A+B no tempo, com feeling"
            ],
            "desafios": [
              {
                "id": "i2-cult-coreo-hhd-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Seq. Coreográfica Hip Hop Dance · 1",
                "desc": "Enviar vídeo da sequência coreográfica: Frase A com vocabulário HHD."
              },
              {
                "id": "i2-cult-coreo-hhd-r02",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Seq. Coreográfica Hip Hop Dance · 2",
                "desc": "Enviar vídeo da sequência coreográfica: Frase B com dinâmica e level change."
              },
              {
                "id": "i2-cult-coreo-hhd-r03",
                "tipo": "tarefa",
                "xp": 22,
                "nome": "Seq. Coreográfica Hip Hop Dance · 3",
                "desc": "Enviar vídeo da sequência coreográfica: A+B no tempo, com feeling."
              }
            ]
          },
          {
            "id": "i2-cult-coreo-pop",
            "tier": 4,
            "col": 1,
            "ranksMax": 3,
            "nome": "Seq. Coreográfica Popping",
            "icone": "mdi-music-note-eighth",
            "resumo": "Seq. Coreográfica Popping",
            "requer": [
              "i2-cult-voc-pop-c3"
            ],
            "niveis": [
              "Frase A com técnica de popping",
              "Frase B com pausas e hits",
              "A+B musicalizada"
            ],
            "desafios": [
              {
                "id": "i2-cult-coreo-pop-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Seq. Coreográfica Popping · 1",
                "desc": "Enviar vídeo da sequência coreográfica: Frase A com técnica de popping."
              },
              {
                "id": "i2-cult-coreo-pop-r02",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Seq. Coreográfica Popping · 2",
                "desc": "Enviar vídeo da sequência coreográfica: Frase B com pausas e hits."
              },
              {
                "id": "i2-cult-coreo-pop-r03",
                "tipo": "tarefa",
                "xp": 22,
                "nome": "Seq. Coreográfica Popping · 3",
                "desc": "Enviar vídeo da sequência coreográfica: A+B musicalizada."
              }
            ]
          },
          {
            "id": "i2-cult-coreo-top",
            "tier": 5,
            "col": 1,
            "ranksMax": 3,
            "nome": "Seq. Coreográfica Breaking",
            "icone": "mdi-music-note-eighth",
            "resumo": "Seq. Coreográfica Breaking",
            "requer": [
              "i2-cult-voc-top-c3"
            ],
            "niveis": [
              "Toprock encadeado (8 tempos)",
              "Transição toprock → go down",
              "Round completo (toprock + entrada)"
            ],
            "desafios": [
              {
                "id": "i2-cult-coreo-top-r01",
                "tipo": "tarefa",
                "xp": 18,
                "nome": "Seq. Coreográfica Breaking · 1",
                "desc": "Enviar vídeo da sequência coreográfica: Toprock encadeado (8 tempos)."
              },
              {
                "id": "i2-cult-coreo-top-r02",
                "tipo": "tarefa",
                "xp": 20,
                "nome": "Seq. Coreográfica Breaking · 2",
                "desc": "Enviar vídeo da sequência coreográfica: Transição toprock → go down."
              },
              {
                "id": "i2-cult-coreo-top-r03",
                "tipo": "tarefa",
                "xp": 22,
                "nome": "Seq. Coreográfica Breaking · 3",
                "desc": "Enviar vídeo da sequência coreográfica: Round completo (toprock + entrada)."
              }
            ]
          },
          {
            "id": "i2-cult-titulo",
            "tier": 6,
            "col": 2,
            "ranksMax": 1,
            "nome": "Vocabulário & Cultura",
            "icone": "mdi-medal-outline",
            "resumo": "Conclusão do card de cultura, história, vocabulário e coreografia.",
            "requer": [
              "i2-cult-coreo-top"
              /*"i2-cult-coreo-hhd",
              "i2-cult-coreo-pop",
              "i2-cult-coreo-top"*/
            ],
            "niveis": [
              "Conquista concluída — card dominado."
            ],
            "desafios": [],
            "tipo": "titulo"
          }
        ]
      }
    ]
  };
  F.indice = (function () { var m={}; F.perfis.forEach(function (p) { p.habilidades.forEach(function (h) {
    h.perfilId=p.id; h.requer=h.requer||[]; h.tipo=h.tipo||'habilidade'; h.desafios=h.desafios||[]; m[h.id]=h; }); }); return m; }());
  global.UDX_TRILHA = F;
  global.UDX_INTERMEDIARIO = F;
}(typeof window !== 'undefined' ? window : this));