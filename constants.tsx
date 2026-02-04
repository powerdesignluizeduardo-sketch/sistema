
import { PillarType, Pillar, Recipe } from './types';

export const INITIAL_PILLARS: Pillar[] = [
  {
    type: PillarType.PHARMACY,
    description: "Navegue pela dor ou sintoma. A solução exata para quando seu corpo pede socorro.",
    subcategories: [
      {
        id: 'desinflama',
        name: 'Protocolo Desinflamação Express',
        description: 'Foco em reduzir inchaço e retenção hídrica.',
        recipes: [
          {
            id: 'd1',
            name: 'Suco "Adeus Inchaço" de Abacaxi e Hortelã',
            time: '5',
            difficulty: 'Fácil',
            functionalAction: 'A bromélia do abacaxi atua como um anti-inflamatório natural potente, reduzindo a retenção hídrica rapidamente.',
            ingredients: ['2 fatias de abacaxi', '1 punhado de hortelã fresca', '200ml de água de coco', '1 rodela de gengibre'],
            steps: ['Bata tudo no liquidificador até ficar homogêneo.', 'Beba sem coar para aproveitar as fibras.'],
            chefTip: 'Use abacaxi bem maduro para evitar a necessidade de adoçar.',
            category: 'desinflama',
            isFeatured: true
          },
          {
            id: 'd2',
            name: 'Chá de Cúrcuma e Limão Ativador',
            time: '8',
            difficulty: 'Fácil',
            functionalAction: 'A curcumina é o agente desinflamante mais potente da natureza quando combinada com a piperina ou gorduras boas.',
            ingredients: ['1 colher de café de cúrcuma pura', 'Suco de 1/2 limão', '1 pitada de pimenta preta', '300ml de água quente'],
            steps: ['Aqueça a água sem ferver.', 'Misture a cúrcuma e a pimenta.', 'Adicione o limão ao final para preservar a Vitamina C.'],
            chefTip: 'Beba em jejum para um efeito de "limpeza" matinal.',
            category: 'desinflama'
          },
          {
            id: 'd3',
            name: 'Salada de Repolho Roxo Detox',
            time: '12',
            difficulty: 'Fácil',
            functionalAction: 'O repolho roxo é rico em antocianinas que auxiliam o fígado no processo de detoxificação celular.',
            ingredients: ['2 xícaras de repolho roxo fatiado fino', '1 maçã verde em cubos', 'Azeite de oliva extra virgem', 'Sementes de girassol'],
            steps: ['Misture o repolho e a maçã.', 'Tempere com azeite e limão.', 'Finalize com as sementes para crocância.'],
            category: 'desinflama'
          }
        ]
      },
      {
        id: 'dor',
        name: 'Alívio da Dor (Cabeça/Articulações)',
        description: 'Ingredientes analgésicos e anti-inflamatórios.',
        recipes: [
          {
            id: 'dr1',
            name: 'Shot de Gengibre e Magnésio',
            time: '3',
            difficulty: 'Fácil',
            functionalAction: 'O gingerol tem estrutura química similar aos anti-inflamatórios não esteroides, aliviando dores de cabeça tensionais.',
            ingredients: ['50ml de água', '1 colher de sopa de suco de gengibre fresco', '1 pitada de sal integral'],
            steps: ['Extraia o suco do gengibre ralando e espremendo.', 'Misture com água e sal e tome de uma vez.'],
            category: 'dor',
            isFeatured: true
          },
          {
            id: 'dr2',
            name: 'Caldo de Ossos de 20 Minutos (Atalho)',
            time: '20',
            difficulty: 'Médio',
            functionalAction: 'Rico em colágeno e aminoácidos que reconstroem as mucosas e auxiliam nas articulações.',
            ingredients: ['Carcaça de frango ou ossos bovinos', 'Vinagre de maçã', 'Cebola, alho e louro'],
            steps: ['Use panela de pressão para extração rápida.', 'Cozinhe com temperos por 20 min após pegar pressão.', 'Coe e consuma o líquido.'],
            category: 'dor'
          },
          {
            id: 'dr3',
            name: 'Infusão de Garra-do-Diabo e Camomila',
            time: '10',
            difficulty: 'Fácil',
            functionalAction: 'A garra-do-diabo é amplamente reconhecida para alívio de dores osteoarticulares.',
            ingredients: ['1 colher de chá de garra-do-diabo (seca)', '1 sachê de camomila', '400ml de água'],
            steps: ['Faça uma decocção da garra-do-diabo por 5 min.', 'Desligue e adicione a camomila.', 'Abafe por mais 5 min.'],
            category: 'dor'
          }
        ]
      }
    ]
  },
  {
    type: PillarType.CHRONOMETER,
    description: "Tempo é saúde. Receitas para quem não tem tempo a perder.",
    subcategories: [
      {
        id: 'jato',
        name: 'Receitas Jato (Até 5 minutos)',
        description: 'Soluções ultrarrápidas para o dia a dia corrido.',
        recipes: [
          {
            id: 'j1',
            name: 'Bowl de Chia e Frutas "Acorde Pronto"',
            time: '2',
            difficulty: 'Fácil',
            functionalAction: 'Fibras e ômega-3 que garantem saciedade imediata e foco cerebral.',
            ingredients: ['2 colheres de chia', '100ml de leite vegetal', 'Morangos picados'],
            steps: ['Misture a chia no leite.', 'Espere 1 min para hidratar.', 'Adicione as frutas e coma.'],
            category: 'jato',
            isFeatured: true
          },
          {
            id: 'j2',
            name: 'Tartine de Abacate e Ovo Estalado',
            time: '5',
            difficulty: 'Fácil',
            functionalAction: 'Gorduras boas e proteína de alto valor biológico para energia sustentada.',
            ingredients: ['1 fatia de pão de fermentação natural', '1/2 abacate', '1 ovo'],
            steps: ['Toste o pão.', 'Esmague o abacate com sal.', 'Frite o ovo rapidamente e coloque por cima.'],
            category: 'jato'
          }
        ]
      }
    ]
  },
  {
    type: PillarType.ECONOMIST,
    description: "Saúde com economia. Use o que você já tem em mãos.",
    subcategories: [
      {
        id: 'ovos',
        name: 'O que fazer com Ovos',
        description: 'Maximize o potencial da proteína mais versátil.',
        recipes: [
          {
            id: 'o1',
            name: 'Omelete de Ervas do Mediterrâneo',
            time: '7',
            difficulty: 'Fácil',
            functionalAction: 'Rico em colina para a memória e fitoquímicos das ervas para imunidade.',
            ingredients: ['2 ovos', 'Orégano fresco', 'Manjericão', 'Pitada de azeite'],
            steps: ['Bata os ovos com as ervas picadas.', 'Cozinhe em fogo baixo com tampa.'],
            category: 'ovos'
          }
        ]
      }
    ]
  }
];

export const PANTRY_CHECKLIST = [
  "Cúrcuma em pó (Pura)",
  "Gengibre fresco",
  "Azeite de Oliva Extra Virgem (Vidro escuro)",
  "Vinagre de Maçã Orgânico",
  "Ovos caipiras",
  "Sementes de Chia/Linhaça",
  "Canela em pau e pó",
  "Alho e Cebola (Base de tudo)",
  "Limão (Ouro da BioCozinha)",
  "Aveia em flocos grossos",
  "Sal Integral ou de Himalaia",
  "Castanhas do Pará/Amêndoas",
  "Mel cru ou Stévia pura",
  "Chá verde de boa qualidade",
  "Batata Doce",
  "Abóbora Cabotiá",
  "Espinafre ou Couve",
  "Óleo de Coco (Prensado a frio)",
  "Sardinha ou Atum em conserva (Azeite)",
  "Pimenta Preta (Potencializador)"
];
