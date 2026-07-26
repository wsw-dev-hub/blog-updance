/**
 * UP DANCE EXPERIENCE — NÍVEL INICIANTE (v5) — 3 CARDS LADO A LADO
 * Card 1 Alongamentos (aquecimento + alongamentos básicos, foco em pouca flexibilidade),
 * Card 2 Segunda Rodada (Fundamentos ++, Níveis, Combinações, Vocabulário, Sequência Coreográfica),
 * Card 3 Boost a Groove (feeling/flow/flava, três cinturas, básicos por estilo, Combinações,
 *        Combos e Sequência Coreográfica em caminhos distintos).
 * Cada card é um PERFIL (coluna) com faixas internas e conectores SVG, no modelo da Árvore
 * de Talentos. Backend: perfil_id único 'iniciante' (runtime.perfilId) — o split em colunas
 * é só disposição visual. Cores por card via .tt-tree[data-perfil] em niveis.css.
 * limiarXPE = soma de todo o XP dos desafios (derivado; ver worker_trilhas.js).
 */
(function (global) {
  'use strict';
  var F = {
    versao: '5.0.0',
    temporada: { id: 'INICIANTE', nome: 'Iniciante', nivelAlvo: 'Iniciante', promovePara: 'Intermediário', limiarXPE: 1634 },
    runtime: {
      perfilId: 'iniciante', resource: 'nivel-iniciante', chaveLocal: 'udx:iniciante:v1', insigniaId: 'ini-insignia',
      api: { me: '/api/me', estado: '/api/trilha/estado?perfil=iniciante', desafio: '/api/trilha/desafio' }
    },
    tiposComAcesso: ["Iniciante", "Intermediário", "Estagiário(a)", "Assistente", "Monitor(a)", "Professor(a)", "Premium"],
    tiposDesafio: { tarefa:{label:'Tarefa',icone:'mdi-checkbox-marked-circle-outline'}, atividade:{label:'Atividade',icone:'mdi-account-clock-outline'}, evento:{label:'Evento',icone:'mdi-calendar-star'} },
    perfis: [
        {
            "id": "along",
            "nome": "Alongamentos",
            "segmento": "Aquecer & soltar",
            "icone": "mdi-yoga",
            "xpLabel": "Alongamentos",
            "tiers": [
                {
                    "n": 1,
                    "nome": "Aquecimento"
                },
                {
                    "n": 2,
                    "nome": "Alongamento Base"
                },
                {
                    "n": 3,
                    "nome": "Conclusão"
                }
            ],
            "habilidades": [
                {
                    "id": "along-mobilidade",
                    "tier": 1,
                    "col": 1,
                    "ranksMax": 4,
                    "nome": "Mobilidade Articular",
                    "icone": "mdi-rotate-3d-variant",
                    "resumo": "Solta as articulações antes de qualquer esforço.",
                    "requer": [],
                    "niveis": [
                        "Pescoço e ombros.",
                        "Punhos e cotovelos.",
                        "Quadril e joelhos.",
                        "Tornozelos e coluna."
                    ],
                    "desafios": [
                        {
                            "id": "along-mobilidade-d1",
                            "tipo": "tarefa",
                            "xp": 8,
                            "nome": "Mobilidade · 1",
                            "desc": "Círculos de pescoço e ombros, sem forçar."
                        },
                        {
                            "id": "along-mobilidade-d2",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Mobilidade · 2",
                            "desc": "Círculos de punhos e cotovelos."
                        },
                        {
                            "id": "along-mobilidade-d3",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Mobilidade · 3",
                            "desc": "Círculos de quadril e joelhos."
                        },
                        {
                            "id": "along-mobilidade-d4",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Mobilidade · 4",
                            "desc": "Tornozelos e mobilização suave da coluna."
                        }
                    ]
                },
                {
                    "id": "along-cardio",
                    "tier": 1,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Ativação Cardio Leve",
                    "icone": "mdi-heart-pulse",
                    "resumo": "Eleva a temperatura do corpo em ritmo suave.",
                    "requer": [],
                    "niveis": [
                        "Marcha no lugar.",
                        "Elevação de joelhos leve.",
                        "Polichinelo adaptado."
                    ],
                    "desafios": [
                        {
                            "id": "along-cardio-d1",
                            "tipo": "tarefa",
                            "xp": 8,
                            "nome": "Cardio Leve · 1",
                            "desc": "Marcha no lugar por 2 minutos."
                        },
                        {
                            "id": "along-cardio-d2",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Cardio Leve · 2",
                            "desc": "Elevação de joelhos em ritmo confortável."
                        },
                        {
                            "id": "along-cardio-d3",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cardio Leve · 3",
                            "desc": "Polichinelo adaptado, sem impacto."
                        }
                    ]
                },
                {
                    "id": "along-respiracao",
                    "tier": 1,
                    "col": 3,
                    "ranksMax": 3,
                    "nome": "Respiração & Postura",
                    "icone": "mdi-meditation",
                    "resumo": "Respira, alinha o eixo e prepara o corpo.",
                    "requer": [],
                    "niveis": [
                        "Respiração diafragmática.",
                        "Alinhamento em pé.",
                        "Respiração em movimento lento."
                    ],
                    "desafios": [
                        {
                            "id": "along-respiracao-d1",
                            "tipo": "tarefa",
                            "xp": 8,
                            "nome": "Respiração · 1",
                            "desc": "Respiração diafragmática, 5 ciclos."
                        },
                        {
                            "id": "along-respiracao-d2",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Respiração · 2",
                            "desc": "Alinhamento cabeça–quadril–pés em pé."
                        },
                        {
                            "id": "along-respiracao-d3",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Respiração · 3",
                            "desc": "Respiração aplicada a um movimento lento."
                        }
                    ]
                },
                {
                    "id": "along-posterior",
                    "tier": 2,
                    "col": 1,
                    "ranksMax": 4,
                    "nome": "Cadeia Posterior",
                    "icone": "mdi-human-handsdown",
                    "resumo": "Isquiotibiais e panturrilhas — o ponto fraco de quem tem pouca flexibilidade.",
                    "requer": [
                        "along-mobilidade"
                    ],
                    "niveis": [
                        "Panturrilha na parede.",
                        "Isquiotibiais com joelho leve.",
                        "Inclinação com apoio.",
                        "Cadeia posterior, 30s."
                    ],
                    "desafios": [
                        {
                            "id": "along-posterior-d1",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Cadeia Posterior · 1",
                            "desc": "Alongamento de panturrilha na parede."
                        },
                        {
                            "id": "along-posterior-d2",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cadeia Posterior · 2",
                            "desc": "Isquiotibiais sentado, joelho levemente flexionado."
                        },
                        {
                            "id": "along-posterior-d3",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Cadeia Posterior · 3",
                            "desc": "Inclinação em pé com apoio das mãos."
                        },
                        {
                            "id": "along-posterior-d4",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Cadeia Posterior · 4",
                            "desc": "Cadeia posterior completa, sustentar 30s respirando."
                        }
                    ]
                },
                {
                    "id": "along-quadril",
                    "tier": 2,
                    "col": 2,
                    "ranksMax": 4,
                    "nome": "Quadril & Glúteos",
                    "icone": "mdi-human-handsup",
                    "resumo": "Abre o quadril com apoios e sem forçar.",
                    "requer": [
                        "along-cardio"
                    ],
                    "niveis": [
                        "Borboleta assistida.",
                        "Figura-4 deitado.",
                        "Afundo baixo com apoio.",
                        "Quadril completo com respiração."
                    ],
                    "desafios": [
                        {
                            "id": "along-quadril-d1",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Quadril & Glúteos · 1",
                            "desc": "Borboleta assistida, cotovelos nos joelhos."
                        },
                        {
                            "id": "along-quadril-d2",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Quadril & Glúteos · 2",
                            "desc": "Figura-4 deitado, uma perna de cada vez."
                        },
                        {
                            "id": "along-quadril-d3",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Quadril & Glúteos · 3",
                            "desc": "Afundo baixo com apoio das mãos no chão."
                        },
                        {
                            "id": "along-quadril-d4",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Quadril & Glúteos · 4",
                            "desc": "Sequência de quadril completa com respiração aplicada."
                        }
                    ]
                },
                {
                    "id": "along-coluna",
                    "tier": 2,
                    "col": 3,
                    "ranksMax": 4,
                    "nome": "Coluna & Tronco",
                    "icone": "mdi-yoga",
                    "resumo": "Mobiliza a coluna e alonga o tronco.",
                    "requer": [
                        "along-respiracao"
                    ],
                    "niveis": [
                        "Gato-camelo.",
                        "Rotação de tronco sentado.",
                        "Alongamento lateral.",
                        "Extensão suave da coluna."
                    ],
                    "desafios": [
                        {
                            "id": "along-coluna-d1",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Coluna & Tronco · 1",
                            "desc": "Gato-camelo, 8 repetições lentas."
                        },
                        {
                            "id": "along-coluna-d2",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Coluna & Tronco · 2",
                            "desc": "Rotação de tronco sentado, ambos os lados."
                        },
                        {
                            "id": "along-coluna-d3",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Coluna & Tronco · 3",
                            "desc": "Alongamento lateral em pé, braço acima da cabeça."
                        },
                        {
                            "id": "along-coluna-d4",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Coluna & Tronco · 4",
                            "desc": "Extensão suave da coluna, sem forçar a lombar."
                        }
                    ]
                },
                {
                    "id": "along-titulo",
                    "tier": 3,
                    "col": 2,
                    "tipo": "titulo",
                    "ranksMax": 1,
                    "nome": "Alongamentos ✓",
                    "icone": "mdi-medal-outline",
                    "resumo": "Conclusão do card Alongamentos — corpo aquecido e mais móvel.",
                    "requer": [
                        "along-posterior",
                        "along-quadril",
                        "along-coluna"
                    ],
                    "niveis": [
                        "Card concluído."
                    ],
                    "desafios": []
                }
            ]
        },
        {
            "id": "seg",
            "nome": "Segunda Rodada",
            "segmento": "Mais complexo",
            "icone": "mdi-numeric-2-circle-outline",
            "xpLabel": "Segunda Rodada",
            "tiers": [
                {
                    "n": 1,
                    "nome": "Fundamentos +"
                },
                {
                    "n": 2,
                    "nome": "Fundamentos ++"
                },
                {
                    "n": 3,
                    "nome": "Combinações"
                },
                {
                    "n": 4,
                    "nome": "Vocabulário"
                },
                {
                    "n": 5,
                    "nome": "Aplicação"
                },
                {
                    "n": 6,
                    "nome": "Conclusão"
                }
            ],
            "habilidades": [
                {
                    "id": "seg-pulso",
                    "tier": 1,
                    "col": 1,
                    "ranksMax": 4,
                    "nome": "Pulso II",
                    "icone": "mdi-pulse",
                    "resumo": "Pulso em contratempo e polirritmia.",
                    "requer": [],
                    "niveis": [
                        "Contratempo.",
                        "Duas camadas rítmicas.",
                        "Pulso no deslocamento.",
                        "Pulso durante isolação."
                    ],
                    "desafios": [
                        {
                            "id": "seg-pulso-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Pulso II · 1",
                            "desc": "Contratempo."
                        },
                        {
                            "id": "seg-pulso-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Pulso II · 2",
                            "desc": "Duas camadas rítmicas."
                        },
                        {
                            "id": "seg-pulso-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Pulso II · 3",
                            "desc": "Pulso no deslocamento."
                        },
                        {
                            "id": "seg-pulso-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Pulso II · 4",
                            "desc": "Pulso durante isolação."
                        }
                    ]
                },
                {
                    "id": "seg-balancos",
                    "tier": 1,
                    "col": 2,
                    "ranksMax": 4,
                    "nome": "Balanços II",
                    "icone": "mdi-swap-horizontal-bold",
                    "resumo": "Balanços com quebra de nível e giro.",
                    "requer": [],
                    "niveis": [
                        "Quebra de nível.",
                        "Giro parcial.",
                        "Pausa suspensa.",
                        "Combina os três."
                    ],
                    "desafios": [
                        {
                            "id": "seg-balancos-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Balanços II · 1",
                            "desc": "Quebra de nível."
                        },
                        {
                            "id": "seg-balancos-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Balanços II · 2",
                            "desc": "Giro parcial."
                        },
                        {
                            "id": "seg-balancos-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Balanços II · 3",
                            "desc": "Pausa suspensa."
                        },
                        {
                            "id": "seg-balancos-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Balanços II · 4",
                            "desc": "Combina os três."
                        }
                    ]
                },
                {
                    "id": "seg-caminhadas",
                    "tier": 1,
                    "col": 3,
                    "ranksMax": 4,
                    "nome": "Caminhadas II",
                    "icone": "mdi-walk",
                    "resumo": "Caminhadas sincopadas.",
                    "requer": [],
                    "niveis": [
                        "Sincopada.",
                        "Muda nível e direção.",
                        "Parada seca.",
                        "Frase de 8 tempos."
                    ],
                    "desafios": [
                        {
                            "id": "seg-caminhadas-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Caminhadas II · 1",
                            "desc": "Sincopada."
                        },
                        {
                            "id": "seg-caminhadas-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Caminhadas II · 2",
                            "desc": "Muda nível e direção."
                        },
                        {
                            "id": "seg-caminhadas-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Caminhadas II · 3",
                            "desc": "Parada seca."
                        },
                        {
                            "id": "seg-caminhadas-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Caminhadas II · 4",
                            "desc": "Frase de 8 tempos."
                        }
                    ]
                },
                {
                    "id": "seg-circulares",
                    "tier": 2,
                    "col": 1,
                    "ranksMax": 4,
                    "nome": "Circulares II",
                    "icone": "mdi-rotate-3d-variant",
                    "resumo": "Círculos simultâneos e em contratempo.",
                    "requer": [
                        "seg-pulso"
                    ],
                    "niveis": [
                        "Dois círculos simultâneos.",
                        "Contratempo.",
                        "Muda de plano.",
                        "Sequência de quatro regiões."
                    ],
                    "desafios": [
                        {
                            "id": "seg-circulares-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Circulares II · 1",
                            "desc": "Dois círculos simultâneos."
                        },
                        {
                            "id": "seg-circulares-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Circulares II · 2",
                            "desc": "Contratempo."
                        },
                        {
                            "id": "seg-circulares-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Circulares II · 3",
                            "desc": "Muda de plano."
                        },
                        {
                            "id": "seg-circulares-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Circulares II · 4",
                            "desc": "Sequência de quatro regiões."
                        }
                    ]
                },
                {
                    "id": "seg-niveis",
                    "tier": 2,
                    "col": 2,
                    "ranksMax": 4,
                    "nome": "Níveis",
                    "icone": "mdi-stairs",
                    "resumo": "Dançar em alturas diferentes: alto, médio e baixo.",
                    "requer": [
                        "seg-balancos"
                    ],
                    "niveis": [
                        "Nível alto (em pé).",
                        "Nível médio (semi-flexão).",
                        "Nível baixo (perto do chão).",
                        "Transições entre os três."
                    ],
                    "desafios": [
                        {
                            "id": "seg-niveis-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Níveis · 1",
                            "desc": "Marcação no nível alto, em pé."
                        },
                        {
                            "id": "seg-niveis-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Níveis · 2",
                            "desc": "Mesma marcação em semi-flexão (nível médio)."
                        },
                        {
                            "id": "seg-niveis-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Níveis · 3",
                            "desc": "Marcação no nível baixo, perto do chão."
                        },
                        {
                            "id": "seg-niveis-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Níveis · 4",
                            "desc": "Transição fluida entre alto, médio e baixo."
                        }
                    ]
                },
                {
                    "id": "seg-ondulacoes",
                    "tier": 2,
                    "col": 3,
                    "ranksMax": 4,
                    "nome": "Ondulações II",
                    "icone": "mdi-wave",
                    "resumo": "Ondas multidirecionais e com isolação.",
                    "requer": [
                        "seg-caminhadas"
                    ],
                    "niveis": [
                        "Multidirecional.",
                        "Com isolação.",
                        "No deslocamento.",
                        "Início e fim distintos."
                    ],
                    "desafios": [
                        {
                            "id": "seg-ondulacoes-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Ondulações II · 1",
                            "desc": "Multidirecional."
                        },
                        {
                            "id": "seg-ondulacoes-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Ondulações II · 2",
                            "desc": "Com isolação."
                        },
                        {
                            "id": "seg-ondulacoes-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Ondulações II · 3",
                            "desc": "No deslocamento."
                        },
                        {
                            "id": "seg-ondulacoes-d4",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Ondulações II · 4",
                            "desc": "Início e fim distintos."
                        }
                    ]
                },
                {
                    "id": "seg-combinacoes",
                    "tier": 3,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Combinações",
                    "icone": "mdi-vector-combine",
                    "resumo": "Combina os fundamentos desta rodada em frases curtas.",
                    "requer": [
                        "seg-circulares",
                        "seg-niveis",
                        "seg-ondulacoes"
                    ],
                    "niveis": [
                        "Combina dois fundamentos.",
                        "Combina três, mudando de nível.",
                        "Frase de 8 tempos com contratempo."
                    ],
                    "desafios": [
                        {
                            "id": "seg-combinacoes-d1",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Combinações · 1",
                            "desc": "Combina dois fundamentos numa frase curta."
                        },
                        {
                            "id": "seg-combinacoes-d2",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Combinações · 2",
                            "desc": "Combina três fundamentos mudando de nível."
                        },
                        {
                            "id": "seg-combinacoes-d3",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Combinações · 3",
                            "desc": "Frase de 8 tempos com níveis e contratempo."
                        }
                    ]
                },
                {
                    "id": "seg-hiphop",
                    "tier": 4,
                    "col": 1,
                    "ranksMax": 8,
                    "nome": "HipHop · Rodada 2",
                    "icone": "mdi-shoe-sneaker",
                    "resumo": "Nova rodada de básicos de HipHop.",
                    "requer": [
                        "seg-combinacoes"
                    ],
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
                            "id": "seg-hiphop-r01",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Buterfly",
                            "desc": "Enviar vídeo executando 8 tempos de Buterfly no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r02",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Garbage Path",
                            "desc": "Enviar vídeo executando 8 tempos de Garbage Path no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r03",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Prep",
                            "desc": "Enviar vídeo executando 8 tempos de Prep no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r04",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "The Woop",
                            "desc": "Enviar vídeo executando 8 tempos de The Woop no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r05",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Criss Cross",
                            "desc": "Enviar vídeo executando 8 tempos de Criss Cross no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r06",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Smurf",
                            "desc": "Enviar vídeo executando 8 tempos de Smurf no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r07",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Bankhead Bounce",
                            "desc": "Enviar vídeo executando 8 tempos de Bankhead Bounce no ritmo."
                        },
                        {
                            "id": "seg-hiphop-r08",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Bounce",
                            "desc": "Enviar vídeo executando 8 tempos de Bounce no ritmo."
                        }
                    ]
                },
                {
                    "id": "seg-popping",
                    "tier": 4,
                    "col": 3,
                    "ranksMax": 7,
                    "nome": "Popping · Rodada 2",
                    "icone": "mdi-flash-outline",
                    "resumo": "Nova rodada de básicos de Popping.",
                    "requer": [
                        "seg-combinacoes"
                    ],
                    "niveis": [
                        "Old Man",
                        "Sac Walk",
                        "Egyption Twist",
                        "Romeo Twist",
                        "Back Slide",
                        "Side Slide",
                        "Moon Wlak"
                    ],
                    "desafios": [
                        {
                            "id": "seg-popping-r01",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Old Man",
                            "desc": "Enviar vídeo executando 8 tempos de Old Man no ritmo."
                        },
                        {
                            "id": "seg-popping-r02",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Sac Walk",
                            "desc": "Enviar vídeo executando 8 tempos de Sac Walk no ritmo."
                        },
                        {
                            "id": "seg-popping-r03",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Egyption Twist",
                            "desc": "Enviar vídeo executando 8 tempos de Egyption Twist no ritmo."
                        },
                        {
                            "id": "seg-popping-r04",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Romeo Twist",
                            "desc": "Enviar vídeo executando 8 tempos de Romeo Twist no ritmo."
                        },
                        {
                            "id": "seg-popping-r05",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Back Slide",
                            "desc": "Enviar vídeo executando 8 tempos de Back Slide no ritmo."
                        },
                        {
                            "id": "seg-popping-r06",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Side Slide",
                            "desc": "Enviar vídeo executando 8 tempos de Side Slide no ritmo."
                        },
                        {
                            "id": "seg-popping-r07",
                            "tipo": "tarefa",
                            "xp": 10,
                            "nome": "Moon Wlak",
                            "desc": "Enviar vídeo executando 8 tempos de Moon Wlak no ritmo."
                        }
                    ]
                },
                {
                    "id": "seg-coreo",
                    "tier": 5,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Sequência Coreográfica",
                    "icone": "mdi-music-note-eighth",
                    "resumo": "Frase curta com o vocabulário desta rodada.",
                    "requer": [
                        "seg-hiphop",
                        "seg-popping"
                    ],
                    "niveis": [
                        "Parte A.",
                        "Parte B.",
                        "A+B no tempo, com feeling."
                    ],
                    "desafios": [
                        {
                            "id": "seg-coreo-d1",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Sequência Coreográfica · 1",
                            "desc": "Parte A."
                        },
                        {
                            "id": "seg-coreo-d2",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Sequência Coreográfica · 2",
                            "desc": "Parte B."
                        },
                        {
                            "id": "seg-coreo-d3",
                            "tipo": "tarefa",
                            "xp": 20,
                            "nome": "Sequência Coreográfica · 3",
                            "desc": "A+B no tempo, com feeling."
                        }
                    ]
                },
                {
                    "id": "seg-titulo",
                    "tier": 6,
                    "col": 2,
                    "tipo": "titulo",
                    "ranksMax": 1,
                    "nome": "Segunda Rodada ✓",
                    "icone": "mdi-medal-outline",
                    "resumo": "Conclusão do card Segunda Rodada.",
                    "requer": [
                        "seg-coreo"
                    ],
                    "niveis": [
                        "Card concluído."
                    ],
                    "desafios": []
                }
            ]
        },
        {
            "id": "boost",
            "nome": "Boost a Groove",
            "segmento": "Feeling · Flow · Flava",
            "icone": "mdi-fire",
            "xpLabel": "Boost a Groove",
            "tiers": [
                {
                    "n": 1,
                    "nome": "Consicência Corporal"
                },
                {
                    "n": 2,
                    "nome": "Coisnciência do Movimento"
                },
                {
                    "n": 3,
                    "nome": "Progressão do Movimento"
                },
                {
                    "n": 4,
                    "nome": "Combinações"
                },
                {
                    "n": 5,
                    "nome": "Vocabulário"
                },
                {
                    "n": 6,
                    "nome": "Aplicação"
                },
                {
                    "n": 7,
                    "nome": "Conclusão"
                }
            ],
            "habilidades": [
                {
                    "id": "boost-cervical",
                    "tier": 1,
                    "col": 1,
                    "ranksMax": 3,
                    "nome": "Cintura Cervical",
                    "icone": "mdi-account-outline",
                    "resumo": "Isolação de cabeça e pescoço.",
                    "requer": [],
                    "niveis": [
                        "Isola a cabeça.",
                        "Círculos de cabeça.",
                        "No tempo da música."
                    ],
                    "desafios": [
                        {
                            "id": "boost-cervical-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cintura Cervical · 1",
                            "desc": "Isola a cabeça."
                        },
                        {
                            "id": "boost-cervical-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Cintura Cervical · 2",
                            "desc": "Círculos de cabeça."
                        },
                        {
                            "id": "boost-cervical-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Cintura Cervical · 3",
                            "desc": "No tempo da música."
                        }
                    ]
                },
                {
                    "id": "boost-feeling",
                    "tier": 1,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Feeling",
                    "icone": "mdi-heart-pulse",
                    "resumo": "Musicalidade: sentir e tocar os acentos.",
                    "requer": [],
                    "niveis": [
                        "Toca os acentos.",
                        "Duas camadas rítmicas.",
                        "Dá dinâmica ao passo."
                    ],
                    "desafios": [
                        {
                            "id": "boost-feeling-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Feeling · 1",
                            "desc": "Toca os acentos."
                        },
                        {
                            "id": "boost-feeling-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Feeling · 2",
                            "desc": "Duas camadas rítmicas."
                        },
                        {
                            "id": "boost-feeling-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Feeling · 3",
                            "desc": "Dá dinâmica ao passo."
                        }
                    ]
                },
                {
                    "id": "boost-ritmo",
                    "tier": 1,
                    "col": 3,
                    "ranksMax": 3,
                    "nome": "Ritmo",
                    "icone": "mdi-metronome",
                    "resumo": "Introdução ao ritmo: pulso, tempo e contagem de 8.",
                    "requer": [],
                    "niveis": [
                        "Contar 8 tempos.",
                        "Marcar o pulso.",
                        "Dançar no tempo."
                    ],
                    "desafios": [
                        {
                            "id": "boost-ritmo-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Ritmo · 1",
                            "desc": "Contar 8 tempos ouvindo a música."
                        },
                        {
                            "id": "boost-ritmo-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Ritmo · 2",
                            "desc": "Marcar o pulso da música com palmas."
                        },
                        {
                            "id": "boost-ritmo-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Ritmo · 3",
                            "desc": "Executar uma marcação simples exatamente no tempo."
                        }
                    ]
                },
                {
                    "id": "boost-escapular",
                    "tier": 2,
                    "col": 1,
                    "ranksMax": 3,
                    "nome": "Cintura Escapular",
                    "icone": "mdi-arm-flex-outline",
                    "resumo": "Isolação de ombros, escápulas e tórax.",
                    "requer": [
                        "boost-cervical"
                    ],
                    "niveis": [
                        "Isola os ombros.",
                        "Rolls de ombro.",
                        "Isolação torácica."
                    ],
                    "desafios": [
                        {
                            "id": "boost-escapular-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cintura Escapular · 1",
                            "desc": "Isola os ombros."
                        },
                        {
                            "id": "boost-escapular-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Cintura Escapular · 2",
                            "desc": "Rolls de ombro."
                        },
                        {
                            "id": "boost-escapular-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Cintura Escapular · 3",
                            "desc": "Isolação torácica."
                        }
                    ]
                },
                {
                    "id": "boost-flow",
                    "tier": 2,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Flow",
                    "icone": "mdi-transit-connection-variant",
                    "resumo": "Continuidade: ligar sem cortes.",
                    "requer": [
                        "boost-feeling"
                    ],
                    "niveis": [
                        "Liga dois passos.",
                        "Transições entre níveis.",
                        "Frase contínua de 8 tempos."
                    ],
                    "desafios": [
                        {
                            "id": "boost-flow-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Flow · 1",
                            "desc": "Liga dois passos."
                        },
                        {
                            "id": "boost-flow-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Flow · 2",
                            "desc": "Transições entre níveis."
                        },
                        {
                            "id": "boost-flow-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Flow · 3",
                            "desc": "Frase contínua de 8 tempos."
                        }
                    ]
                },
                {
                    "id": "boost-musicalidade",
                    "tier": 2,
                    "col": 3,
                    "ranksMax": 3,
                    "nome": "Musicalidade",
                    "icone": "mdi-music-note-eighth",
                    "resumo": "Introdução à musicalidade: acentos, camadas e pausas.",
                    "requer": [
                        "boost-ritmo"
                    ],
                    "niveis": [
                        "Acentuar o tempo forte.",
                        "Alternar entre camadas.",
                        "Interpretar pausas e breaks."
                    ],
                    "desafios": [
                        {
                            "id": "boost-musicalidade-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Musicalidade · 1",
                            "desc": "Dançar acentuando o tempo forte."
                        },
                        {
                            "id": "boost-musicalidade-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Musicalidade · 2",
                            "desc": "Alternar o movimento entre batida e melodia."
                        },
                        {
                            "id": "boost-musicalidade-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Musicalidade · 3",
                            "desc": "Interpretar uma pausa e um break da música."
                        }
                    ]
                },
                {
                    "id": "boost-pelvica",
                    "tier": 3,
                    "col": 1,
                    "ranksMax": 3,
                    "nome": "Cintura Pélvica",
                    "icone": "mdi-human-handsdown",
                    "resumo": "Isolação do quadril.",
                    "requer": [
                        "boost-escapular"
                    ],
                    "niveis": [
                        "Isola o quadril.",
                        "Círculos de quadril.",
                        "Isolação pélvica."
                    ],
                    "desafios": [
                        {
                            "id": "boost-pelvica-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cintura Pélvica · 1",
                            "desc": "Isola o quadril."
                        },
                        {
                            "id": "boost-pelvica-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Cintura Pélvica · 2",
                            "desc": "Círculos de quadril."
                        },
                        {
                            "id": "boost-pelvica-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Cintura Pélvica · 3",
                            "desc": "Isolação pélvica."
                        }
                    ]
                },
                {
                    "id": "boost-flava",
                    "tier": 3,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Flava",
                    "icone": "mdi-star-shooting",
                    "resumo": "Estilo pessoal: atitude e textura.",
                    "requer": [
                        "boost-flow", 
                        "boost-musicalidade"
                    ],
                    "niveis": [
                        "Assinatura pessoal.",
                        "Varia a textura.",
                        "Frase com atitude própria."
                    ],
                    "desafios": [
                        {
                            "id": "boost-flava-d1",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Flava · 1",
                            "desc": "Assinatura pessoal."
                        },
                        {
                            "id": "boost-flava-d2",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Flava · 2",
                            "desc": "Varia a textura."
                        },
                        {
                            "id": "boost-flava-d3",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Flava · 3",
                            "desc": "Frase com atitude própria."
                        }
                    ]
                },
                {
                    "id": "boost-combinacoes",
                    "tier": 4,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Combinações",
                    "icone": "mdi-vector-combine",
                    "resumo": "Combina feeling, flow, flava, as cinturas e a musicalidade em frases.",
                    "requer": [
                        "boost-flava",
                        "boost-pelvica"
                    ],
                    "niveis": [
                        "Combina fundamento + uma cintura.",
                        "Combina três cinturas.",
                        "Frase com feeling, flow e flava."
                    ],
                    "desafios": [
                        {
                            "id": "boost-combinacoes-d1",
                            "tipo": "tarefa",
                            "xp": 14,
                            "nome": "Combinações · 1",
                            "desc": "Combina um fundamento com uma cintura."
                        },
                        {
                            "id": "boost-combinacoes-d2",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Combinações · 2",
                            "desc": "Encadeia as três cinturas numa frase."
                        },
                        {
                            "id": "boost-combinacoes-d3",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Combinações · 3",
                            "desc": "Frase própria com feeling, flow, flava e musicalidade."
                        }
                    ]
                },
                {
                    "id": "boost-hiphop",
                    "tier": 5,
                    "col": 1,
                    "ranksMax": 9,
                    "nome": "Básicos · HipHop",
                    "icone": "mdi-shoe-cleat",
                    "resumo": "Básicos de HipHop Dance (catálogo).",
                    "requer": [
                        "boost-combinacoes"
                    ],
                    "niveis": [
                        "Rebook/ Gucci",
                        "Stomp",
                        "Atl Stomp",
                        "Bart Simpson",
                        "Pepper Seed",
                        "Bernie",
                        "Cammel Wlak",
                        "Patty Duke",
                        "Kid-N-Play"
                    ],
                    "desafios": [
                        {
                            "id": "boost-hiphop-r01",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Rebook/ Gucci",
                            "desc": "Enviar vídeo executando 8 tempos de Rebook/ Gucci no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r02",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Stomp",
                            "desc": "Enviar vídeo executando 8 tempos de Stomp no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r03",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Atl Stomp",
                            "desc": "Enviar vídeo executando 8 tempos de Atl Stomp no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r04",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Bart Simpson",
                            "desc": "Enviar vídeo executando 8 tempos de Bart Simpson no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r05",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Pepper Seed",
                            "desc": "Enviar vídeo executando 8 tempos de Pepper Seed no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r06",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Bernie",
                            "desc": "Enviar vídeo executando 8 tempos de Bernie no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r07",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Cammel Wlak",
                            "desc": "Enviar vídeo executando 8 tempos de Cammel Wlak no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r08",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Patty Duke",
                            "desc": "Enviar vídeo executando 8 tempos de Patty Duke no ritmo."
                        },
                        {
                            "id": "boost-hiphop-r09",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kid-N-Play",
                            "desc": "Enviar vídeo executando 8 tempos de Kid-N-Play no ritmo."
                        }
                    ]
                },
                {
                    "id": "boost-popping",
                    "tier": 5,
                    "col": 2,
                    "ranksMax": 9,
                    "nome": "Básicos · Popping",
                    "icone": "mdi-flash-outline",
                    "resumo": "Básicos de Popping (catálogo).",
                    "requer": [
                        "boost-combinacoes"
                    ],
                    "niveis": [
                        "Boogaloo",
                        "Walk Out Boogaloo",
                        "Neck-o-flex",
                        "Twist-o-flex",
                        "Master Flex",
                        "Flex Walk",
                        "Bottom First",
                        "Bottom Boogaloo First",
                        "Robot Walk"
                    ],
                    "desafios": [
                        {
                            "id": "boost-popping-r01",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Boogaloo",
                            "desc": "Enviar vídeo executando 8 tempos de Boogaloo no ritmo."
                        },
                        {
                            "id": "boost-popping-r02",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Walk Out Boogaloo",
                            "desc": "Enviar vídeo executando 8 tempos de Walk Out Boogaloo no ritmo."
                        },
                        {
                            "id": "boost-popping-r03",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Neck-o-flex",
                            "desc": "Enviar vídeo executando 8 tempos de Neck-o-flex no ritmo."
                        },
                        {
                            "id": "boost-popping-r04",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Twist-o-flex",
                            "desc": "Enviar vídeo executando 8 tempos de Twist-o-flex no ritmo."
                        },
                        {
                            "id": "boost-popping-r05",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Master Flex",
                            "desc": "Enviar vídeo executando 8 tempos de Master Flex no ritmo."
                        },
                        {
                            "id": "boost-popping-r06",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Flex Walk",
                            "desc": "Enviar vídeo executando 8 tempos de Flex Walk no ritmo."
                        },
                        {
                            "id": "boost-popping-r07",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Bottom First",
                            "desc": "Enviar vídeo executando 8 tempos de Bottom First no ritmo."
                        },
                        {
                            "id": "boost-popping-r08",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Bottom Boogaloo First",
                            "desc": "Enviar vídeo executando 8 tempos de Bottom Boogaloo First no ritmo."
                        },
                        {
                            "id": "boost-popping-r09",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Robot Walk",
                            "desc": "Enviar vídeo executando 8 tempos de Robot Walk no ritmo."
                        }
                    ]
                },
                {
                    "id": "boost-toprock",
                    "tier": 5,
                    "col": 3,
                    "ranksMax": 9,
                    "nome": "Básicos · Top Rock",
                    "icone": "mdi-walk",
                    "resumo": "Introdução ao Breaking — Top Rock (catálogo).",
                    "requer": [
                        "boost-combinacoes"
                    ],
                    "niveis": [
                        "One Leg Top Rock",
                        "Front-Side-Pas de Bourré",
                        "Kriss Kross",
                        "Kick Out",
                        "Kick Ball Change",
                        "Kick Ball Side",
                        "Kick Ball Back",
                        "Salsa",
                        "Indian Step"
                    ],
                    "desafios": [
                        {
                            "id": "boost-toprock-d01",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "One Leg Top Rock",
                            "desc": "Enviar vídeo executando 8 tempos de One Leg Top Rock no ritmo."
                        },
                        {
                            "id": "boost-toprock-d02",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Front-Side-Pas de Bourré",
                            "desc": "Enviar vídeo executando 8 tempos de Front-Side-Pas de Bourré no ritmo."
                        },
                        {
                            "id": "boost-toprock-d03",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kriss Kross",
                            "desc": "Enviar vídeo executando 8 tempos de Kriss Kross no ritmo."
                        },
                        {
                            "id": "boost-toprock-d04",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kick Out",
                            "desc": "Enviar vídeo executando 8 tempos de Kick Out no ritmo."
                        },
                        {
                            "id": "boost-toprock-d05",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kick Ball Change",
                            "desc": "Enviar vídeo executando 8 tempos de Kick Ball Change no ritmo."
                        },
                        {
                            "id": "boost-toprock-d06",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kick Ball Side",
                            "desc": "Enviar vídeo executando 8 tempos de Kick Ball Side no ritmo."
                        },
                        {
                            "id": "boost-toprock-d07",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Kick Ball Back",
                            "desc": "Enviar vídeo executando 8 tempos de Kick Ball Back no ritmo."
                        },
                        {
                            "id": "boost-toprock-d08",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Salsa",
                            "desc": "Enviar vídeo executando 8 tempos de Salsa no ritmo."
                        },
                        {
                            "id": "boost-toprock-d09",
                            "tipo": "tarefa",
                            "xp": 12,
                            "nome": "Indian Step",
                            "desc": "Enviar vídeo executando 8 tempos de Indian Step no ritmo."
                        }
                    ]
                },
                {
                    "id": "boost-coreo",
                    "tier": 6,
                    "col": 2,
                    "ranksMax": 3,
                    "nome": "Sequência Coreográfica",
                    "icone": "mdi-music-note-eighth",
                    "resumo": "Integra feeling, flow, flava, cinturas e combos.",
                    "requer": [
                        "boost-hiphop",
                        "boost-popping",
                        "boost-toprock"
                    ],
                    "niveis": [
                        "Aprende a frase (16 tempos).",
                        "No tempo com as cinturas.",
                        "Com feeling, flow e flava."
                    ],
                    "desafios": [
                        {
                            "id": "boost-coreo-d1",
                            "tipo": "tarefa",
                            "xp": 16,
                            "nome": "Sequência Coreográfica · 1",
                            "desc": "Aprende a frase (16 tempos)."
                        },
                        {
                            "id": "boost-coreo-d2",
                            "tipo": "tarefa",
                            "xp": 18,
                            "nome": "Sequência Coreográfica · 2",
                            "desc": "No tempo com as cinturas."
                        },
                        {
                            "id": "boost-coreo-d3",
                            "tipo": "tarefa",
                            "xp": 20,
                            "nome": "Sequência Coreográfica · 3",
                            "desc": "Com feeling, flow e flava."
                        }
                    ]
                },
                {
                    "id": "boost-titulo",
                    "tier": 7,
                    "col": 2,
                    "tipo": "titulo",
                    "ranksMax": 1,
                    "nome": "Boost a Groove ✓",
                    "icone": "mdi-medal-outline",
                    "resumo": "Conclusão do card Boost a Groove.",
                    "requer": [
                        "boost-coreo"
                    ],
                    "niveis": [
                        "Card concluído."
                    ],
                    "desafios": []
                }
            ]
        }
    ]
  };
  F.indice = (function () { var m={}; F.perfis.forEach(function (p) { p.habilidades.forEach(function (h) {
    h.perfilId=p.id; h.requer=h.requer||[]; h.tipo=h.tipo||'habilidade'; h.desafios=h.desafios||[]; m[h.id]=h; }); }); return m; }());
  global.UDX_TRILHA = F;
  global.UDX_INICIANTE = F;
}(typeof window !== 'undefined' ? window : this));
