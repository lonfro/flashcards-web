import { NodeData } from '../types/flashcard';

const STORAGE_KEY = 'flashcards_web_nodes_v2';

export const INITIAL_SAMPLE_NODES: NodeData[] = [
  {
    "id": "node-deck-1787011798772-cd6h8",
    "name": "Economics",
    "type": "divider",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-ae3em",
      "nodeId": "node-deck-1787011798772-cd6h8",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-dc885",
    "name": "Behavioural economics",
    "type": "divider",
    "parentId": "node-deck-1787011798772-cd6h8",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-zzw8k",
      "nodeId": "node-deck-1787011798772-dc885",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-mvzre",
    "name": "Biases",
    "type": "divider",
    "parentId": "node-deck-1787011798772-dc885",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-th3ll",
      "nodeId": "node-deck-1787011798772-mvzre",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-xt04p",
    "name": "Anchoring effect bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ds8d9",
      "nodeId": "node-card-1787011798772-xt04p",
      "front": "Anchoring effect bias",
      "back": "Consumer judgement are affected by an arbitrary starting value or point of reference",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ca9vp",
    "name": "Overconfidence bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-g5bxb",
      "nodeId": "node-card-1787011798772-ca9vp",
      "front": "Overconfidence bias",
      "back": "Overestimate ability to make good decisions\rDon't acknowledge the limits of their knowledge/understanding",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-tnutj",
    "name": "Status quo bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-cwzpj",
      "nodeId": "node-card-1787011798772-tnutj",
      "front": "Status quo bias",
      "back": "Consumers stick to a particular choice even when it's not in their best self-interest anymore",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-mqyl7",
    "name": "Herd behaviour bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-23asu",
      "nodeId": "node-card-1787011798772-mqyl7",
      "front": "Herd behaviour bias",
      "back": "Consumers often follow the crowd when faced with decisions with highly unpredictable outcomes",
      "weight": 16,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-yniov",
    "name": "Framing effect bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-8ig79",
      "nodeId": "node-card-1787011798772-yniov",
      "front": "Framing effect bias",
      "back": "The way that options or choices are presented can influence consumer decision making\r*e.g. 99% success rate instead of 1% failure rate*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-0q2jg",
    "name": "Availability bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-budi8",
      "nodeId": "node-card-1787011798772-0q2jg",
      "front": "Availability bias",
      "back": "Consumers tend to rely on information that is the most convenient and accessible when making decisions \r*e.g. First search result on Google*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-zuw8l",
    "name": "Vividness bias",
    "type": "card",
    "parentId": "node-deck-1787011798772-mvzre",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-mmegb",
      "nodeId": "node-card-1787011798772-zuw8l",
      "front": "Vividness bias",
      "back": "Consumers often rely on a few observations that stand out",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-vxowp",
    "name": "Economic issues and living standards",
    "type": "divider",
    "parentId": "node-deck-1787011798772-cd6h8",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-kvb3i",
      "nodeId": "node-deck-1787011798772-vxowp",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-ig1h3",
    "name": "Aggregate demand",
    "type": "divider",
    "parentId": "node-deck-1787011798772-vxowp",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-ds51i",
      "nodeId": "node-deck-1787011798772-ig1h3",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-3dnbc",
    "name": "Aggregate Demand (AD)",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-awtkh",
      "nodeId": "node-card-1787011798772-3dnbc",
      "front": "Aggregate Demand (AD)",
      "back": "The total spending on final goods and services within a country during a given period.\r\rAD is what is demanded, while GDP is what is produced.\r",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-1hpho",
    "name": "Business confidence",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-eb6rf",
      "nodeId": "node-card-1787011798772-1hpho",
      "front": "Business confidence",
      "back": "Level of optimism/pessimism of firms about **future profits**",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-8m371",
    "name": "Consumer confidence",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-jh0n6",
      "nodeId": "node-card-1787011798772-8m371",
      "front": "Consumer confidence",
      "back": "The level of optimism (or pessimism) of households, about future incomes and employment prospects",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-6woue",
    "name": "Discretionary income",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-sdlsw",
      "nodeId": "node-card-1787011798772-6woue",
      "front": "Discretionary income",
      "back": "Disposable income (wage - direct tax + welfare), minus essential living expenses \r(needs, such as rent/mortgage, food, water, utilities, transport)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-n3o51",
    "name": "Disposable income",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-pspj8",
      "nodeId": "node-card-1787011798772-n3o51",
      "front": "Disposable income",
      "back": "Money earned from selling factors of production (labour), minus direct tax, and plus welfare",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-u5a60",
    "name": "How would rising AD affect inflatio",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-qzi0p",
      "nodeId": "node-card-1787011798772-u5a60",
      "front": "How would rising AD affect inflation?",
      "back": "Rising AD means rising inflation, as demand outstripping supply results in consumers bidding up prices, weakening the price of the AUD as AD covers all final G/S",
      "weight": 13,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-bik2b",
    "name": "What component(s) of AD do rising i",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-qqf9k",
      "nodeId": "node-card-1787011798772-bik2b",
      "front": "What component(s) of AD do rising interest rates affect? ( reasons)",
      "back": "It affects:\r **Private consumption spending (C)**\r- More incentive to save\r- Less incentive to spend on wants (credit repayments are higher)\r- Variable loans on houses more painful\r\r**Private investment spending (I)**\r- Effective cost of buying capital using credit (debt) rises, reducing ROI",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-5w3sg",
    "name": "What is C, I, G1, G2, X and M?",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ju0td",
      "nodeId": "node-card-1787011798772-5w3sg",
      "front": "What is C, I, G1, G2, X and M?",
      "back": "C - Consumption spending \rI - Investment (private) spending\rG1 - Government current (consumption) spending\rG2 - Government capital (investment) spending\rX - E*x*port spending\rM - I*m*port spending",
      "weight": 28,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-1iier",
    "name": "What is the formula of AD?",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-bmpjb",
      "nodeId": "node-card-1787011798772-1iier",
      "front": "What is the formula of AD?",
      "back": "AD = C + I + G1 + G2 + X - M\r",
      "weight": 13,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-qj8fy",
    "name": "What is the problem of high AD?",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-t9pqx",
      "nodeId": "node-card-1787011798772-qj8fy",
      "front": "What is the problem of high AD?",
      "back": "High AD can cause inflation, because the value of money is less powerful due to the abundance of all goods and services",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-y8kvj",
    "name": "What is the problem of low AD?",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-rylb3",
      "nodeId": "node-card-1787011798772-y8kvj",
      "front": "What is the problem of low AD?",
      "back": "Low AD can lead to high unemployment, as labourers are needed to produce goods and services",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-11pd3",
    "name": "Why is AD important?",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ny60e",
      "nodeId": "node-card-1787011798772-11pd3",
      "front": "Why is AD important?",
      "back": "Fluctuations in AD are the main factor behind the change in phases of the business cycle, which is the level of economic activity",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ktlza",
    "name": "What are 6 factors affecting AD and",
    "type": "card",
    "parentId": "node-deck-1787011798772-ig1h3",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-66k7e",
      "nodeId": "node-card-1787011798772-ktlza",
      "front": "What are 6 factors affecting AD and which components do they affect?",
      "back": "1. Disposable income -> C\r2. Interest rates -> C, I\r3. Consumer confidence -> C\r4. Business confidence -> I\r5. Change in exchange rate -> X, M\r6. Economic growth overseas -> X (as that country imports more)",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-hhsbz",
    "name": "Aggregate supply",
    "type": "divider",
    "parentId": "node-deck-1787011798772-vxowp",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-vfyvm",
      "nodeId": "node-deck-1787011798772-hhsbz",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-j3bl0",
    "name": "Aggregate supply",
    "type": "card",
    "parentId": "node-deck-1787011798772-hhsbz",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-nt4ej",
      "nodeId": "node-card-1787011798772-j3bl0",
      "front": "Aggregate supply",
      "back": "Aggregate Supply is the planned amount of goods and services that firms are **willing and able** over a period of time.\r\r",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-v1prp",
    "name": "Productive capacity",
    "type": "card",
    "parentId": "node-deck-1787011798772-hhsbz",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-m3xcp",
      "nodeId": "node-card-1787011798772-v1prp",
      "front": "Productive capacity",
      "back": "The maximum amount of goods & services an economy can produce sustainably, using its available resources and technology.\r\r*i.e. when all resources are being employed to maximum efficiency*",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-8euae",
    "name": "Why is AS important? (2 reasons)",
    "type": "card",
    "parentId": "node-deck-1787011798772-hhsbz",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-oydl7",
      "nodeId": "node-card-1787011798772-8euae",
      "front": "Why is AS important? (2 reasons)",
      "back": "1. Businesses need to increase production (Aggregate Supply) to meet higher AD in order for economic growth to occur.\r\r2. Further economic growth (AS) is not possible when an economy reaches productive capacity. Instead, shortages will occur, leading to inflation",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-v9xbn",
    "name": "Macroeconomic supply factor",
    "type": "card",
    "parentId": "node-deck-1787011798772-hhsbz",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-2y1wp",
      "nodeId": "node-card-1787011798772-v9xbn",
      "front": "Macroeconomic supply factor",
      "back": "A factor that influences the **willingness and/or ability** of producers to offer goods/services for sale, impacting the level of Aggregate Supply (AS)",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ee649",
    "name": "What are 3 macroeconomic supply fac",
    "type": "card",
    "parentId": "node-deck-1787011798772-hhsbz",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-xrg10",
      "nodeId": "node-card-1787011798772-ee649",
      "front": "What are 3 macroeconomic supply factors",
      "back": "1. Quantity of the factors of production \re.g. land, labour\r2. Cost of production\re.g. Wage, electricity, fuel, exchange rate\r3. Productivity growth (efficiency, output per unit of input)\re.g. Labour productivity growth",
      "weight": 27,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-a00kx",
    "name": "GDP",
    "type": "divider",
    "parentId": "node-deck-1787011798772-vxowp",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-0unnu",
      "nodeId": "node-deck-1787011798772-a00kx",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-aovxh",
    "name": "Boom",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-gbqtz",
      "nodeId": "node-card-1787011798772-aovxh",
      "front": "Boom",
      "back": "A severe peak characterised by very high inflation",
      "weight": 28,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-qxb9y",
    "name": "Business cycle",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-fc2ey",
      "nodeId": "node-card-1787011798772-qxb9y",
      "front": "Business cycle",
      "back": "The pattern of Aggregate Demand (AD) and GDP over time, signalled by the four distinct phases of the business cycle",
      "weight": 30,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-a5xr6",
    "name": "Chain volume measures",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-s46mp",
      "nodeId": "node-card-1787011798772-a5xr6",
      "front": "Chain volume measures",
      "back": "Chain volume measures (Real GDP) adjust for price changes, showing how much more or less was actually produced",
      "weight": 27,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-30els",
    "name": "CPI (definition)",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-d5z7x",
      "nodeId": "node-card-1787011798772-30els",
      "front": "CPI (definition)",
      "back": "Consumer price index\r\rMeasure of average change in prices of a fixed basket of goods and services purchased by households over time",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-xn3r5",
    "name": "Depression",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-9jm4p",
      "nodeId": "node-card-1787011798772-xn3r5",
      "front": "Depression",
      "back": "An extreme and prolonged trough (downturn in AD and GDP), characterised by very high levels of unemployment",
      "weight": 30,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-lhhdu",
    "name": "GDP",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-0o8ev",
      "nodeId": "node-card-1787011798772-lhhdu",
      "front": "GDP",
      "back": "The actual, total market value of all **final** goods and services produced within a country during a given period.\r\rIt doesn't include intermediate prices! Also, it is the actual value, not the planned value, unlike AS.",
      "weight": 23,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-bmuon",
    "name": "Inflation rate",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-mixz4",
      "nodeId": "node-card-1787011798772-bmuon",
      "front": "Inflation rate",
      "back": "% change in CPI (Consumer Price Index)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-bgz3r",
    "name": "Rate of economic growth",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-d7vjw",
      "nodeId": "node-card-1787011798772-bgz3r",
      "front": "Rate of economic growth",
      "back": "Percentage % change in production (GDP)",
      "weight": 16,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-pz3oy",
    "name": "Recession",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-yeldo",
      "nodeId": "node-card-1787011798772-pz3oy",
      "front": "Recession",
      "back": "Two consecutive quarters of negative GDP growth\r\re.g. Q3 is $130B, and Q4 is $100B. Negative GDP growth",
      "weight": 19,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-q3xsl",
    "name": "What are the four phases of the bus",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-thqn0",
      "nodeId": "node-card-1787011798772-q3xsl",
      "front": "What are the four phases of the business cycle, and what are the levels of GDP at each?",
      "back": "1. Expansion (Rising GDP)\r2. Peak (Very high GDP)\r3. Contraction (Falling GDP)\r4. Trough (Very low GDP)",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-egngp",
    "name": "What is the difference between nomi",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-t8m0l",
      "nodeId": "node-card-1787011798772-egngp",
      "front": "What is the difference between nominal and real GDP?",
      "back": "Nominal GDP is measured using the current prices at the time.\r\rReal GDP is Nominal GDP adjusted for inflation.",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ojph6",
    "name": "2 flaws excluded from GDP",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-t3qhn",
      "nodeId": "node-card-1787011798772-ojph6",
      "front": "2 flaws excluded from GDP",
      "back": "1. Doesn't include non-market activities\r2. Susceptible to replacements\r*(e.g. a clock that came broken + a replacement clock = 2 clocks)*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-eblxk",
    "name": "4 types of final G/S",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-76zee",
      "nodeId": "node-card-1787011798772-eblxk",
      "front": "4 types of final G/S",
      "back": "1. Consumer goods and services\r2. Business goods and services\r3. Government goods and services\r4. Net exports (exports - imports)",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-03l7v",
    "name": "Capital goods + one property",
    "type": "card",
    "parentId": "node-deck-1787011798772-a00kx",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-lj1n2",
      "nodeId": "node-card-1787011798772-03l7v",
      "front": "Capital goods + one property",
      "back": "Goods used to make other goods.\r\rProperty: They also count as final goods\r\r*e.g. a chainsaw bought by a gardener is a capital (and final) good*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-kwg3v",
    "name": "Living standards",
    "type": "divider",
    "parentId": "node-deck-1787011798772-vxowp",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-oq63s",
      "nodeId": "node-deck-1787011798772-kwg3v",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-46y3l",
    "name": "Material living standards",
    "type": "card",
    "parentId": "node-deck-1787011798772-kwg3v",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-d8ezn",
      "nodeId": "node-card-1787011798772-46y3l",
      "front": "Material living standards",
      "back": "Level of access to goods and services",
      "weight": 10,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-xxzil",
    "name": "Name 3 indicators of material livin",
    "type": "card",
    "parentId": "node-deck-1787011798772-kwg3v",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-arjwn",
      "nodeId": "node-card-1787011798772-xxzil",
      "front": "Name 3 indicators of material living standards",
      "back": "- Real GDP per capita\r- Houshold disposable income\r- Availability of goods and services\r",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-gn000",
    "name": "Name 3 indicators of non-material l",
    "type": "card",
    "parentId": "node-deck-1787011798772-kwg3v",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-wnykc",
      "nodeId": "node-card-1787011798772-gn000",
      "front": "Name 3 indicators of non-material living standards",
      "back": "- Life expectancy\r- Access to healthcare\r- Access to social services",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-s2g2f",
    "name": "Non-material living standards",
    "type": "card",
    "parentId": "node-deck-1787011798772-kwg3v",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-wp5u6",
      "nodeId": "node-card-1787011798772-s2g2f",
      "front": "Non-material living standards",
      "back": "The Quality of Life (QoL)",
      "weight": 11,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-8z806",
    "name": "Local, national, and international economic issues",
    "type": "divider",
    "parentId": "node-deck-1787011798772-cd6h8",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-x0dpu",
      "nodeId": "node-deck-1787011798772-8z806",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-8wtzy",
    "name": "Equity",
    "type": "card",
    "parentId": "node-deck-1787011798772-8z806",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-1u89q",
      "nodeId": "node-card-1787011798772-8wtzy",
      "front": "Equity",
      "back": "Ownership in an asset or company",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-qcjwi",
    "name": "ODA (meaning + definition)",
    "type": "card",
    "parentId": "node-deck-1787011798772-8z806",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-0ua63",
      "nodeId": "node-card-1787011798772-qcjwi",
      "front": "ODA (meaning + definition)",
      "back": "Official Development Assistance \r\rAid given overseas from the government, businesses, not-for-profits, and households",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-an0i5",
    "name": "External sector",
    "type": "card",
    "parentId": "node-deck-1787011798772-8z806",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ohguw",
      "nodeId": "node-card-1787011798772-an0i5",
      "front": "External sector",
      "back": "Involves economic transactions between Australia and overseas countries.\r\rPrimarily involves exports and imports.",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-q9jf9",
    "name": "Human capital",
    "type": "card",
    "parentId": "node-deck-1787011798772-8z806",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-g3le9",
      "nodeId": "node-card-1787011798772-q9jf9",
      "front": "Human capital",
      "back": "Things that people possess that make them a productive worker.\r\r*e.g. education, qualifications, job training*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-528fw",
    "name": "EngLang",
    "type": "divider",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-8iyf8",
      "nodeId": "node-deck-1787011798772-528fw",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-kxdm5",
    "name": "8 - History of EL",
    "type": "divider",
    "parentId": "node-deck-1787011798772-528fw",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-2god4",
      "nodeId": "node-deck-1787011798772-kxdm5",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-2fhxi",
    "name": "What are cognates used for?",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-kmiil",
      "nodeId": "node-card-1787011798772-2fhxi",
      "front": "What are cognates used for?",
      "back": "Cognates help indicate how close the family link is across languages",
      "weight": 13,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-jmay8",
    "name": "What are important factors when loo",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-6wa1d",
      "nodeId": "node-card-1787011798772-jmay8",
      "front": "What are important factors when looking for cognates?",
      "back": "- Changes to phonology\r*Latin \"octo\" to Italian \"otto\"*\r- Lexical borrowings (words adopted from other languages)\r*\"ballet\" - borrowed from French by English*\r- Geographic connections (close countries share vocab.)\r*English and Dutch are close. They share \"water\"*",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-gulxy",
    "name": "What are the four main historical p",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-1nfmi",
      "nodeId": "node-card-1787011798772-gulxy",
      "front": "What are the four main historical periods of English",
      "back": "1. Old English (longest)\r2. Middle English\r3. Early Modern English (shortest)\r4. Modern English",
      "weight": 9,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-9gv30",
    "name": "What are the three common daughter ",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ilfgl",
      "nodeId": "node-card-1787011798772-9gv30",
      "front": "What are the three common daughter branches to PIE?",
      "back": "1 - Germanic\r2 - Italic\r3 - Indo-Iranian",
      "weight": 8,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-fs9h6",
    "name": "What does PIE stand for",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-8i218",
      "nodeId": "node-card-1787011798772-fs9h6",
      "front": "What does PIE stand for",
      "back": "Proto-Indo-European",
      "weight": 8,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-nfclc",
    "name": "What is a cognate?",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-qv2eg",
      "nodeId": "node-card-1787011798772-nfclc",
      "front": "What is a cognate?",
      "back": "Lexemes that are similar across languages. They have a common linguistic ancestor",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-3n1rk",
    "name": "What is etymology?",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-q9oj0",
      "nodeId": "node-card-1787011798772-3n1rk",
      "front": "What is etymology?",
      "back": "A word's history\r\r|Proto-Germanic|Old English|Modern English|\r|------------------|--------------|------------------|\r|brōþēr|brōþor|brother|\r\r\t\t\r\t",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-y885v",
    "name": "What is the route from PIE to Moder",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-prn10",
      "nodeId": "node-card-1787011798772-y885v",
      "front": "What is the route from PIE to Modern English?",
      "back": "[Proto-Indo-Germanic] -> Germanic (branch) -> [*West* Germanic] -> [Old English] -> [Modern English]",
      "weight": 1,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-t1rpq",
    "name": "Where did Old English come from?",
    "type": "card",
    "parentId": "node-deck-1787011798772-kxdm5",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-svso1",
      "nodeId": "node-card-1787011798772-t1rpq",
      "front": "Where did Old English come from?",
      "back": "From the Germanic tribes (Angles, Saxons, Jutes, and Frisians) merging with the Celtic Britons in the British Isles\rGermanic languages helped for easy communication",
      "weight": 28,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-1cf94",
    "name": "9 - Changes to EL",
    "type": "divider",
    "parentId": "node-deck-1787011798772-528fw",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-y61sz",
      "nodeId": "node-deck-1787011798772-1cf94",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-2bzts",
    "name": "Changes to morphology",
    "type": "divider",
    "parentId": "node-deck-1787011798772-1cf94",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-0nx7g",
      "nodeId": "node-deck-1787011798772-2bzts",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-zbsi3",
    "name": "Abbreviation",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-i057n",
      "nodeId": "node-card-1787011798772-zbsi3",
      "front": "Abbreviation",
      "back": "Formed by shortening a word or phrase.\r\rAbbreviation is a large family, consisting of smaller morphological processes.\r\r*e.g. electronic mail -> email*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-3rypv",
    "name": "Acronym",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ed2v1",
      "nodeId": "node-card-1787011798772-3rypv",
      "front": "Acronym",
      "back": "Formed by taking the first letter of a string of words.\r\rPronounced as a whole, not letter by letter.\r\r*e.g. doing too much -> dtm*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-xshbr",
    "name": "Affixation",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-kjdm5",
      "nodeId": "node-card-1787011798772-xshbr",
      "front": "Affixation",
      "back": "Adding affixes (prefix/infix/suffix) to words to create new words.\r\r*e.g. govern + -ment -> government*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-s16cp",
    "name": "Backformation",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-bwcgl",
      "nodeId": "node-card-1787011798772-s16cp",
      "front": "Backformation",
      "back": "Removing what is mistakenly thought to be affixes, to alter its meaning or convert it to a different part of speech.\r\r*e.g. television -> televise\rtelevise came 20 years after television*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-h0npg",
    "name": "Blending",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-nisgc",
      "nodeId": "node-card-1787011798772-h0npg",
      "front": "Blending",
      "back": "Adding **parts** of two different words to form a single word.\r\rRarer than the other morphological processes.\r\r*e.g. modulator + **dem**odulator -> mo**dem**)*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-sombt",
    "name": "Compounding",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-vt122",
      "nodeId": "node-card-1787011798772-sombt",
      "front": "Compounding",
      "back": "Addition of two or more words into a single word.\r\r*e.g. swim + suit -> swimsuit*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-2aplv",
    "name": "Contraction",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-fwpoc",
      "nodeId": "node-card-1787011798772-2aplv",
      "front": "Contraction",
      "back": "Formed by removing some letters of a phrase, and marking the missing gap with an apostrophe.\r\rMore informal.\r\r*e.g. do not -> don't*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-fr07s",
    "name": "Conversion",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-xa4s3",
      "nodeId": "node-card-1787011798772-fr07s",
      "front": "Conversion",
      "back": "Process of using a word in a role of a different part of speech\r\r_e.g. changing word class:_\r_text (noun) -> text (verb)_\r*\"Can you __text__ me?\"*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-eyu4s",
    "name": "Initialism",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-qrvbr",
      "nodeId": "node-card-1787011798772-eyu4s",
      "front": "Initialism",
      "back": "Formed by taking the first letter of a string of words.\r\r**However**, they are pronounced letter-by-letter, unlike acronyms\r\r*e.g. Victorian Certificate of Education -> VCE*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ytz6q",
    "name": "Shortening",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-1ryq8",
      "nodeId": "node-card-1787011798772-ytz6q",
      "front": "Shortening",
      "back": "Constructed by cutting words down to smaller forms.\r\r*e.g. perambulator -> pram*\r*e.g. capitals -> caps*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ckl0y",
    "name": "10 morphological processes",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-yguxn",
      "nodeId": "node-card-1787011798772-ckl0y",
      "front": "10 morphological processes",
      "back": "1. abbreviation\r2. acronym\r3. affixation\r4. backformation\r5. blending\r6. compounding\r7. contraction\r8. conversion \r9. initialism\r10. shortenings",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-noqsm",
    "name": "neologism",
    "type": "card",
    "parentId": "node-deck-1787011798772-2bzts",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-w6xm7",
      "nodeId": "node-card-1787011798772-noqsm",
      "front": "neologism",
      "back": "a newly created word or expression\r\r*e.g. doomscrolling*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798772-fwqr4",
    "name": "SoftDev",
    "type": "divider",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-oay9z",
      "nodeId": "node-deck-1787011798772-fwqr4",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-w0rl4",
    "name": "Programming",
    "type": "divider",
    "parentId": "node-deck-1787011798772-fwqr4",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-x35fb",
      "nodeId": "node-deck-1787011798772-w0rl4",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798772-gu2pb",
    "name": "Chapter 2",
    "type": "divider",
    "parentId": "node-deck-1787011798772-w0rl4",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "divider": {
      "id": "div-1787011798772-mezfm",
      "nodeId": "node-deck-1787011798772-gu2pb",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798772-4rjqe",
    "name": "abstraction",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-88h6x",
      "nodeId": "node-card-1787011798772-4rjqe",
      "front": "abstraction",
      "back": "an object-oriented programming language principle that allows programmers to manage complexity by hiding implementation details and exposing only the essential features of an object",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-rlqpc",
    "name": "alternative execution",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-p8jfa",
      "nodeId": "node-card-1787011798772-rlqpc",
      "front": "alternative execution",
      "back": "code that is run if a condition is not met",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-rb5v5",
    "name": "arguments",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ediwz",
      "nodeId": "node-card-1787011798772-rb5v5",
      "front": "arguments",
      "back": "specific inputs passed into a function that act as local, temporary variables",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-gbfma",
    "name": "arithmetic operator",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-jw0fv",
      "nodeId": "node-card-1787011798772-gbfma",
      "front": "arithmetic operator",
      "back": "a symbol in programming that performs basic mathematical operations such as addition, subtraction, multiplication and division",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-0zhvx",
    "name": "automated debugging and testing of ",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-3c8rm",
      "nodeId": "node-card-1787011798772-0zhvx",
      "front": "automated debugging and testing of modules",
      "back": "using software tools and scripts to automatically identify, diagnose and fix errors",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-bo769",
    "name": "average case",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-y428a",
      "nodeId": "node-card-1787011798772-bo769",
      "front": "average case",
      "back": "the time it takes to run an algorithm, on average",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-bimi3",
    "name": "best case",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-el4fv",
      "nodeId": "node-card-1787011798772-bimi3",
      "front": "best case",
      "back": "the best time it can take to run an algorithm",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-86ssy",
    "name": "binary search",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-olhoa",
      "nodeId": "node-card-1787011798772-86ssy",
      "front": "binary search",
      "back": "a decrease and conquer algorithm that repeatedly halves a sorted search space until an element is found or not found",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-mrmlv",
    "name": "Boolean",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-7jijq",
      "nodeId": "node-card-1787011798772-mrmlv",
      "front": "Boolean",
      "back": "a data type that holds the values of true or false",
      "weight": 15,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-ioevz",
    "name": "boundary values",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ksu2e",
      "nodeId": "node-card-1787011798772-ioevz",
      "front": "boundary values",
      "back": "the maximum and minimum edge values possible for a given input",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-gcrdx",
    "name": "breakpoint",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-sub9f",
      "nodeId": "node-card-1787011798772-gcrdx",
      "front": "breakpoint",
      "back": "a debugging tool that allows the execution of a program to be paused at a specific point to allow a programmer to inspect the current state of the program and diagnose any issues",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-wnrb5",
    "name": "built-in functions",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-ltvj2",
      "nodeId": "node-card-1787011798772-wnrb5",
      "front": "built-in functions",
      "back": "functions that have been written by the creators of the programming language to execute common sequences of code",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-zxt6v",
    "name": "casting",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-qx2q5",
      "nodeId": "node-card-1787011798772-zxt6v",
      "front": "casting",
      "back": "converting a variable from one data type to another, such as converting a string to an integer",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-coy5t",
    "name": "chained selection",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-xnznp",
      "nodeId": "node-card-1787011798772-coy5t",
      "front": "chained selection",
      "back": "a selection statement that handles more than one possible conditional outcome",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-29ukr",
    "name": "class",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.772Z",
    "updatedAt": "2026-08-18T00:09:58.772Z",
    "card": {
      "id": "card-1787011798772-m3q78",
      "nodeId": "node-card-1787011798772-29ukr",
      "front": "class",
      "back": "a program code template for creating objects in object-oriented programming languages",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798772-7ilvv",
    "name": "code optimisation",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-195x9",
      "nodeId": "node-card-1787011798772-7ilvv",
      "front": "code optimisation",
      "back": "the process of refining code to improve the efficiency and/or performance of a program without altering its functionality",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-z5gxu",
    "name": "compiler",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-pe75g",
      "nodeId": "node-card-1787011798773-z5gxu",
      "front": "compiler",
      "back": "a program that turns source code into machine language that can be executed by a computer processor",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-th8yk",
    "name": "conditional operator",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-fzbmr",
      "nodeId": "node-card-1787011798773-th8yk",
      "front": "conditional operator",
      "back": "a programming concept that evaluates a condition and returns one of two values based on whether the condition is true or false",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-zakaa",
    "name": "constant",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-iu00c",
      "nodeId": "node-card-1787011798773-zakaa",
      "front": "constant",
      "back": "a fixed value that, once defined, cannot be altered during the execution of a program",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-7pqez",
    "name": "debugging",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-7k35b",
      "nodeId": "node-card-1787011798773-7pqez",
      "front": "debugging",
      "back": "identifying and removing errors from computer software",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-1y2zs",
    "name": "debugging statement",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-x6868",
      "nodeId": "node-card-1787011798773-1y2zs",
      "front": "debugging statement",
      "back": "a line of code inserted into a program to output information about the program's execution",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-3uins",
    "name": "decrease and conquer",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-c60s3",
      "nodeId": "node-card-1787011798773-3uins",
      "front": "decrease and conquer",
      "back": "to recursively reduce a problem to two or more smaller instances of the same problem until the problem can be solved",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-dcimk",
    "name": "desk checking",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-lw8cy",
      "nodeId": "node-card-1787011798773-dcimk",
      "front": "desk checking",
      "back": "a manual process where a programmer reviews and traces through their code to verify its correctness and logic",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-5lo77",
    "name": "divide and conquer",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-e7dy9",
      "nodeId": "node-card-1787011798773-5lo77",
      "front": "divide and conquer",
      "back": "to recursively break down a problem into two or more sub-problems of the same type until the problem is simple enough to solve on their own; the solved problems are then combined to provide a final solution",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-7gdk9",
    "name": "divide by zero error",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-9z106",
      "nodeId": "node-card-1787011798773-7gdk9",
      "front": "divide by zero error",
      "back": "an error occurring when an arithmetic equation is attempting to divide by 0",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-pk9d1",
    "name": "DO/WHILE",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-gsr0b",
      "nodeId": "node-card-1787011798773-pk9d1",
      "front": "DO/WHILE",
      "back": "an iteration over a set of instructions, conditions and/or iterations that is repeated for as long as a condition is met; it is always run at least once",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-kqct7",
    "name": "encapsulation",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hdkoc",
      "nodeId": "node-card-1787011798773-kqct7",
      "front": "encapsulation",
      "back": "an object-oriented programming principle that involves bundling the data and methods that operate on the data into a single unit or class",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-o4oso",
    "name": "event",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-4hr3j",
      "nodeId": "node-card-1787011798773-o4oso",
      "front": "event",
      "back": "a special type of method that is called when an object's state changes",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-rsrya",
    "name": "existence check",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-7433k",
      "nodeId": "node-card-1787011798773-rsrya",
      "front": "existence check",
      "back": "test to see if a value has been entered as input or not",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-vzzky",
    "name": "expected results",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-tv26j",
      "nodeId": "node-card-1787011798773-vzzky",
      "front": "expected results",
      "back": "the output expected from an algorithm, assuming it is logically correct",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-j4vkh",
    "name": "flow of execution",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-amsxm",
      "nodeId": "node-card-1787011798773-j4vkh",
      "front": "flow of execution",
      "back": "the order in which instructions, conditions and iterations are executed or evaluated",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-le9sk",
    "name": "FOR",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xnmqe",
      "nodeId": "node-card-1787011798773-le9sk",
      "front": "FOR",
      "back": "an iteration over a set of instructions that is repeated a predefined number of times",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-mpqkp",
    "name": "function",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-0z6r0",
      "nodeId": "node-card-1787011798773-mpqkp",
      "front": "function",
      "back": "a sequence of related code that has been given a name that can be called from other points in the source code",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-apras",
    "name": "function call",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-7q4cg",
      "nodeId": "node-card-1787011798773-apras",
      "front": "function call",
      "back": "to execute the contents of a function",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bf06y",
    "name": "function declaration",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-q2585",
      "nodeId": "node-card-1787011798773-bf06y",
      "front": "function declaration",
      "back": "to name a function and its arguments",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-b7f86",
    "name": "function definition",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-si9oc",
      "nodeId": "node-card-1787011798773-b7f86",
      "front": "function definition",
      "back": "to define (write) the contents of a function",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-wz59l",
    "name": "generalisation",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-y4rp2",
      "nodeId": "node-card-1787011798773-wz59l",
      "front": "generalisation",
      "back": "the process of defining a general class (superclass) that encapsulates common attributes and behaviours of more specific classes (subclasses)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-h9hpb",
    "name": "global variables",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-rbrfw",
      "nodeId": "node-card-1787011798773-h9hpb",
      "front": "global variables",
      "back": "variables that are defined outside any function and can be accessed by all functions throughout the source code",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hykmz",
    "name": "graphical user interface (GUI)",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-8soq9",
      "nodeId": "node-card-1787011798773-hykmz",
      "front": "graphical user interface (GUI)",
      "back": "a type of user interface that allows users to interact through visual elements such as windows, icons and buttons",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-d4sp3",
    "name": "hard-coding",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-u77qn",
      "nodeId": "node-card-1787011798773-d4sp3",
      "front": "hard-coding",
      "back": "to include fixed data in a program that cannot be changed during runtime and can only be changed by modifying the program source code",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-haiwd",
    "name": "index out of range",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ifb6f",
      "nodeId": "node-card-1787011798773-haiwd",
      "front": "index out of range",
      "back": "an error that occurs when attempting to access an element of an array using an index that is outside the valid range of indices for that array",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xygd9",
    "name": "infinite loop",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-pyrxr",
      "nodeId": "node-card-1787011798773-xygd9",
      "front": "infinite loop",
      "back": "an iteration that will never reach the condition upon which it can terminate",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-4ijau",
    "name": "inheritance",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hc4un",
      "nodeId": "node-card-1787011798773-4ijau",
      "front": "inheritance",
      "back": "a method of basing an object or class on another object or class, taking on its attributes and methods and potentially extending upon them",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-0eda8",
    "name": "instantiation",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wlusa",
      "nodeId": "node-card-1787011798773-0eda8",
      "front": "instantiation",
      "back": "in object-oriented programming, the process by which an object is created from a class",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-73hgw",
    "name": "instruction",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-1rw3j",
      "nodeId": "node-card-1787011798773-73hgw",
      "front": "instruction",
      "back": "a unit of code that can be executed by a compiler or interpreter",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-npil5",
    "name": "integrated developer environment (I",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-k0yxw",
      "nodeId": "node-card-1787011798773-npil5",
      "front": "integrated developer environment (IDE)",
      "back": "software that provides tools to aid in programming, such as source code editing, syntax highlighting, code completion, debugging aids, or tools to help construct a user interface",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ariqj",
    "name": "interpreter",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zwgx7",
      "nodeId": "node-card-1787011798773-ariqj",
      "front": "interpreter",
      "back": "a computer program that directly executes source code without needing to have it compiled beforehand",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-6uy6f",
    "name": "linear search",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3iytm",
      "nodeId": "node-card-1787011798773-6uy6f",
      "front": "linear search",
      "back": "a search that checks every element in a list, from first to last, when searching for a particular element",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-pz7r7",
    "name": "local variables",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-r9osg",
      "nodeId": "node-card-1787011798773-pz7r7",
      "front": "local variables",
      "back": "variables that are defined inside a function that can only be accessed by that function",
      "weight": 25,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-3n5ew",
    "name": "logic error",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xgued",
      "nodeId": "node-card-1787011798773-3n5ew",
      "front": "logic error",
      "back": "when source code is syntactically correct but contains an error resulting in unintended, undesirable or incorrect output",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-s3afj",
    "name": "logical operator",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-9xnnk",
      "nodeId": "node-card-1787011798773-s3afj",
      "front": "logical operator",
      "back": "a Boolean operator used to combine expressions, such as AND, OR",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-zz99j",
    "name": "memory leak",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-x78us",
      "nodeId": "node-card-1787011798773-zz99j",
      "front": "memory leak",
      "back": "a failure of a program to release memory that is no longer needed, causing impaired performance, application failure and/or system failure",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-snulo",
    "name": "method",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-brdcv",
      "nodeId": "node-card-1787011798773-snulo",
      "front": "method",
      "back": "an action an object can carry out (e.g. window.refresh, golfClub.swing)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ja0kv",
    "name": "nested selection",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-48lv1",
      "nodeId": "node-card-1787011798773-ja0kv",
      "front": "nested selection",
      "back": "when a selection contains one or more additional conditions within its structure",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-fzp1a",
    "name": "object",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-a0q4s",
      "nodeId": "node-card-1787011798773-fzp1a",
      "front": "object",
      "back": "any instantiated class that a program can inspect and/or change, in terms of appearance, behaviour or data",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-2l0wk",
    "name": "object-oriented programming (OOP)",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-af99f",
      "nodeId": "node-card-1787011798773-2l0wk",
      "front": "object-oriented programming (OOP)",
      "back": "a programming language based on the concept of objects that contain data in the form of fields or attributes and code in the form of methods",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-71lob",
    "name": "overflow error",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-icqqx",
      "nodeId": "node-card-1787011798773-71lob",
      "front": "overflow error",
      "back": "an error that occurs when a calculation exceeds the maximum limit that a data type can represent",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-8fw6f",
    "name": "pass by reference",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-8y0nn",
      "nodeId": "node-card-1787011798773-8fw6f",
      "front": "pass by reference",
      "back": "to pass data into a function as an argument so that it can be modified without needing to be returned",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-creon",
    "name": "pass by value",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-2pdn6",
      "nodeId": "node-card-1787011798773-creon",
      "front": "pass by value",
      "back": "to pass data into a function as an argument so that it cannot be modified without needing to be returned",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-3jido",
    "name": "patches",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xxeu4",
      "nodeId": "node-card-1787011798773-3jido",
      "front": "patches",
      "back": "sets of changes to a software application designed to update or fix it",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-fyxzc",
    "name": "pointer",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-bbozz",
      "nodeId": "node-card-1787011798773-fyxzc",
      "front": "pointer",
      "back": "a variable that stores the memory position of another variable's value",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-sx7if",
    "name": "prompt",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-sp2m0",
      "nodeId": "node-card-1787011798773-sx7if",
      "front": "prompt",
      "back": "the input text or query given to an AI model to generate a response",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hvt5h",
    "name": "quick sort",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zbbzm",
      "nodeId": "node-card-1787011798773-hvt5h",
      "front": "quick sort",
      "back": "a divide and conquer algorithm that sorts a set of data by recursively partitioning and sorting smaller and smaller sets of that data",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-fvcpu",
    "name": "RAM",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-7nwqy",
      "nodeId": "node-card-1787011798773-fvcpu",
      "front": "RAM",
      "back": "random access memory; a type of computer memory that can be accessed randomly; it is most often volatile memory that is lost if power is removed",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-w2hbd",
    "name": "range check",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ebdc6",
      "nodeId": "node-card-1787011798773-w2hbd",
      "front": "range check",
      "back": "tests to see if a value is within a given range of acceptable values",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-8zze5",
    "name": "recursive algorithm",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-26cda",
      "nodeId": "node-card-1787011798773-8zze5",
      "front": "recursive algorithm",
      "back": "an algorithm that calls itself with smaller or simpler sets of values until a solution can be found",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-o82ez",
    "name": "REPEAT/UNTIL",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qlu3l",
      "nodeId": "node-card-1787011798773-o82ez",
      "front": "REPEAT/UNTIL",
      "back": "an iteration over a set of instructions that is repeated for as long as a condition is not met; it will always execute at least once",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-7d9d3",
    "name": "responsible and ethical use of AI",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wnhap",
      "nodeId": "node-card-1787011798773-7d9d3",
      "front": "responsible and ethical use of AI",
      "back": "developing and deploying AI in a manner that ensures fairness, accountability, transparency, privacy and respect for human rights",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xk530",
    "name": "return value",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-md4dn",
      "nodeId": "node-card-1787011798773-xk530",
      "front": "return value",
      "back": "a value or set of values that is passed back to the origin of a calling function, often to be assigned to a variable, used in an equation, or tested within a conditional statement",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-srhzb",
    "name": "runtime error",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-5hqdq",
      "nodeId": "node-card-1787011798773-srhzb",
      "front": "runtime error",
      "back": "an error that occurs while a program is running, including overflow, index out of range, type mismatch and divide by zero",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-se7g7",
    "name": "selection sort",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-aujrb",
      "nodeId": "node-card-1787011798773-se7g7",
      "front": "selection sort",
      "back": "the process of selecting and swapping elements within a list until the entire list is sorted",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ji2sh",
    "name": "selection statement",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-yuq4i",
      "nodeId": "node-card-1787011798773-ji2sh",
      "front": "selection statement",
      "back": "a control structure that allows a programmer to write lines of code that are only run when a particular requirement is met",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-963eg",
    "name": "sequence",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-lhtw0",
      "nodeId": "node-card-1787011798773-963eg",
      "front": "sequence",
      "back": "a set of instructions that executes line by line in the order that it is written",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-jgrx7",
    "name": "switch/case",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-kwq9j",
      "nodeId": "node-card-1787011798773-jgrx7",
      "front": "switch/case",
      "back": "a conditional statement that handles more than one possible conditional outcome",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-enyrn",
    "name": "syntax error",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-mjij0",
      "nodeId": "node-card-1787011798773-enyrn",
      "front": "syntax error",
      "back": "often a typographical error in source code that violates the set of rules that define a programming language",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-nls86",
    "name": "test case",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xoqbi",
      "nodeId": "node-card-1787011798773-nls86",
      "front": "test case",
      "back": "a set of steps that a tester uses to determine if the element being tested works correctly, often outlining test data, testing procedures and expected results",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-6u3ct",
    "name": "test data",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-fmerp",
      "nodeId": "node-card-1787011798773-6u3ct",
      "front": "test data",
      "back": "data that has been specifically identified to be used in a test case",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-qzysv",
    "name": "trace table",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-plwsz",
      "nodeId": "node-card-1787011798773-qzysv",
      "front": "trace table",
      "back": "a tool used in programming and algorithm analysis to track the values of variables at each step of the execution of a program or algorithm",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-10a4e",
    "name": "truth table",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-cbig3",
      "nodeId": "node-card-1787011798773-10a4e",
      "front": "truth table",
      "back": "a table used to represent all of the combinations of values for inputs and their outputs, typically used to test conditional statements",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-nsddn",
    "name": "type check",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-cdgbh",
      "nodeId": "node-card-1787011798773-nsddn",
      "front": "type check",
      "back": "tests to see if a value is of the specified data type or structure",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-19gr8",
    "name": "type mismatch",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qah2v",
      "nodeId": "node-card-1787011798773-19gr8",
      "front": "type mismatch",
      "back": "when a function or method receives an argument of an unexpected data type leading to errors or unintended behaviour",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-sp22e",
    "name": "WHILE",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-20ac9",
      "nodeId": "node-card-1787011798773-sp22e",
      "front": "WHILE",
      "back": "an iteration over a set of instructions that is repeated for as long as a condition is met",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-l9qzm",
    "name": "worst case",
    "type": "card",
    "parentId": "node-deck-1787011798772-gu2pb",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-lvudf",
      "nodeId": "node-card-1787011798773-l9qzm",
      "front": "worst case",
      "back": "the longest amount of time it can take to run an algorithm",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798773-jthe8",
    "name": "SAT",
    "type": "divider",
    "parentId": "node-deck-1787011798772-fwqr4",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-z3zo5",
      "nodeId": "node-deck-1787011798773-jthe8",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798773-2x0eh",
    "name": "Analysis",
    "type": "divider",
    "parentId": "node-deck-1787011798773-jthe8",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-jq1h5",
      "nodeId": "node-deck-1787011798773-2x0eh",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798773-p3uyy",
    "name": "Chapter 3",
    "type": "divider",
    "parentId": "node-deck-1787011798773-2x0eh",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-j1o92",
      "nodeId": "node-deck-1787011798773-p3uyy",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798773-xw9b7",
    "name": "actor",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-i196y",
      "nodeId": "node-card-1787011798773-xw9b7",
      "front": "actor",
      "back": "an entity that can interact with the software solution as shown in a use case diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-x66wd",
    "name": "analysis stage",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-0l3hw",
      "nodeId": "node-card-1787011798773-x66wd",
      "front": "analysis stage",
      "back": "the stage of the problem-solving methodology where solution requirements, constraints and scope are determined",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9yib0",
    "name": "association",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xcs1f",
      "nodeId": "node-card-1787011798773-9yib0",
      "front": "association",
      "back": "a relationship between two elements in a use case diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-gxpfw",
    "name": "clarity",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-er5r0",
      "nodeId": "node-card-1787011798773-gxpfw",
      "front": "clarity",
      "back": "the extent to which a product is coherent and intelligible",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-jzqsw",
    "name": "close-ended questions",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-39wvq",
      "nodeId": "node-card-1787011798773-jzqsw",
      "front": "close-ended questions",
      "back": "questions that can be answered with a finite set of responses",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9a9h4",
    "name": "concepts (project management)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-4cvhl",
      "nodeId": "node-card-1787011798773-9a9h4",
      "front": "concepts (project management)",
      "back": "the milestones and dependencies within a project timeline",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ithb2",
    "name": "concurrently",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wbtgp",
      "nodeId": "node-card-1787011798773-ithb2",
      "front": "concurrently",
      "back": "when a task is carried out at the same time as another task",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-8lukr",
    "name": "constraints",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-vgkgb",
      "nodeId": "node-card-1787011798773-8lukr",
      "front": "constraints",
      "back": "factors that may limit or restrict solution requirements",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ee3xf",
    "name": "context diagram",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3thvx",
      "nodeId": "node-card-1787011798773-ee3xf",
      "front": "context diagram",
      "back": "a visualisation of a system in its entirety that indicates the data that is passed into and out of the system",
      "weight": 27,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-d0xg2",
    "name": "critical path",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hcbhu",
      "nodeId": "node-card-1787011798773-d0xg2",
      "front": "critical path",
      "back": "the shortest possible time in which a project can be completed",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xftqe",
    "name": "data",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-a7jcc",
      "nodeId": "node-card-1787011798773-xftqe",
      "front": "data",
      "back": "raw, unprocessed facts and figures",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-6clet",
    "name": "data flow",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-bxdx5",
      "nodeId": "node-card-1787011798773-6clet",
      "front": "data flow",
      "back": "the movement of a piece or collection of data within an information system, as shown in context diagrams and data flow diagrams (DFDs)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ncb1c",
    "name": "data flow diagram (DFD)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-u6gl9",
      "nodeId": "node-card-1787011798773-ncb1c",
      "front": "data flow diagram (DFD)",
      "back": "a graphical visualisation of the flow of information within a system, including data provided by external entities",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-jlv92",
    "name": "data store",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-0n2bg",
      "nodeId": "node-card-1787011798773-jlv92",
      "front": "data store",
      "back": "a representation of a collection of data that is stored in some way within a system",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-1eb7f",
    "name": "design stage",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-6vwhr",
      "nodeId": "node-card-1787011798773-1eb7f",
      "front": "design stage",
      "back": "the stage of the problem-solving methodology where the function and appearance of a solution are planned, and evaluation criteria created",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9gilk",
    "name": "economic constraints",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-2z2va",
      "nodeId": "node-card-1787011798773-9gilk",
      "front": "economic constraints",
      "back": "the limitations on a project or decision imposed by financial factors",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-yahdq",
    "name": "entity",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-yiz03",
      "nodeId": "node-card-1787011798773-yahdq",
      "front": "entity",
      "back": "the users or external systems that interact with the system being created",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-po0og",
    "name": "event",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3aj45",
      "nodeId": "node-card-1787011798773-po0og",
      "front": "event",
      "back": "a special type of method that is called when an object's state changes",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-b664j",
    "name": "extend",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-pkwh0",
      "nodeId": "node-card-1787011798773-b664j",
      "front": "extend",
      "back": "a relationship between use cases where one use case has optional or additional functionality, which is represented in a use case diagram as a second use case",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-0dyba",
    "name": "fit for purpose",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-sizxh",
      "nodeId": "node-card-1787011798773-0dyba",
      "front": "fit for purpose",
      "back": "to be well suited for a role or purpose",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ypb68",
    "name": "functional requirements",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-1wlur",
      "nodeId": "node-card-1787011798773-ypb68",
      "front": "functional requirements",
      "back": "the desired operations of a program that have specified inputs, behaviours and outputs",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-rskge",
    "name": "functionality",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-xajch",
      "nodeId": "node-card-1787011798773-rskge",
      "front": "functionality",
      "back": "the extent to which a solution is suited to its purpose",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-v21mr",
    "name": "Gantt chart",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-5xjjm",
      "nodeId": "node-card-1787011798773-v21mr",
      "front": "Gantt chart",
      "back": "a type of bar chart or graphic timeline that shows the progress of a project by placing tasks on a timeline, often with comments or annotations",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-fptqv",
    "name": "generalisation",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-oftv0",
      "nodeId": "node-card-1787011798773-fptqv",
      "front": "generalisation",
      "back": "a parent–child relationship between two elements in a use case diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bwfba",
    "name": "include",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-duotf",
      "nodeId": "node-card-1787011798773-bwfba",
      "front": "include",
      "back": "a relationship between use cases where one use case is tied to, or relies upon, the functionality contained within another use case",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-cdfkr",
    "name": "interview",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ishc2",
      "nodeId": "node-card-1787011798773-cdfkr",
      "front": "interview",
      "back": "a face-to-face meeting between people for consultative purposes",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-u9o9s",
    "name": "legal constraints",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-gzkan",
      "nodeId": "node-card-1787011798773-u9o9s",
      "front": "legal constraints",
      "back": "the limitations and requirements imposed on a project or decision by laws, regulations and legal standards",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-pg0qe",
    "name": "maintainability",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-6mzz6",
      "nodeId": "node-card-1787011798773-pg0qe",
      "front": "maintainability",
      "back": "how easy a solution is to look after once it has been put in place",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-zupqe",
    "name": "non-functional requirements",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-o34f1",
      "nodeId": "node-card-1787011798773-zupqe",
      "front": "non-functional requirements",
      "back": "qualitative requirements of a solution, often tied to solution constraints",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-lqo79",
    "name": "observation",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-358ld",
      "nodeId": "node-card-1787011798773-lqo79",
      "front": "observation",
      "back": "a method of data collection that involves physically observing how a system operates and how it is used",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hx1tt",
    "name": "open-ended questions",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-606sn",
      "nodeId": "node-card-1787011798773-hx1tt",
      "front": "open-ended questions",
      "back": "questions where the number of potential answers is infinite",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ajkeh",
    "name": "portability",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ekm3n",
      "nodeId": "node-card-1787011798773-ajkeh",
      "front": "portability",
      "back": "how easily a solution is able to be used in different operating environments",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bvk7x",
    "name": "predecessor",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zak9z",
      "nodeId": "node-card-1787011798773-bvk7x",
      "front": "predecessor",
      "back": "a task that must be completed before another one can be performed",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-wlpww",
    "name": "problem-solving methodology (PSM)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-b170p",
      "nodeId": "node-card-1787011798773-wlpww",
      "front": "problem-solving methodology (PSM)",
      "back": "an approach that develops the stages involved in solving a problem",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-lzq7n",
    "name": "process (context diagram)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ekxcr",
      "nodeId": "node-card-1787011798773-lzq7n",
      "front": "process (context diagram)",
      "back": "an abstract representation of the whole system being created",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-wcvwg",
    "name": "process (data flow diagram)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-266ng",
      "nodeId": "node-card-1787011798773-wcvwg",
      "front": "process (data flow diagram)",
      "back": "an abstract representation of a function within a system",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-m21pr",
    "name": "processes (project management)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wit87",
      "nodeId": "node-card-1787011798773-m21pr",
      "front": "processes (project management)",
      "back": "task identification, sequencing and allocation of time and resources within a project timeline",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-okx14",
    "name": "project management",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-7q0o6",
      "nodeId": "node-card-1787011798773-okx14",
      "front": "project management",
      "back": "a method of recording the progress of a project and managing resources to operate within time, resource and cost availability",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ndd4d",
    "name": "qualitative data",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hv4uk",
      "nodeId": "node-card-1787011798773-ndd4d",
      "front": "qualitative data",
      "back": "data that consists of descriptive details, usually gathered via surveys or interviews",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-5n202",
    "name": "quantitative data",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3bi10",
      "nodeId": "node-card-1787011798773-5n202",
      "front": "quantitative data",
      "back": "data that can be easily processed in a statistical manner, usually composed of definite numbers",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-61gwx",
    "name": "relationship",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-fb8da",
      "nodeId": "node-card-1787011798773-61gwx",
      "front": "relationship",
      "back": "the connections between elements within a use case diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-z0pcu",
    "name": "reliability",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-pr805",
      "nodeId": "node-card-1787011798773-z0pcu",
      "front": "reliability",
      "back": "how much a solution can be depended upon to function as designed, and for how long",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xtl4i",
    "name": "report",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-8uda3",
      "nodeId": "node-card-1787011798773-xtl4i",
      "front": "report",
      "back": "a written document providing a summary or finding in relation to the context or system being analysed",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-md7en",
    "name": "robustness",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-y8y1a",
      "nodeId": "node-card-1787011798773-md7en",
      "front": "robustness",
      "back": "how well a software solution responds to errors that occur when the software is being used",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-4wjxy",
    "name": "slack time",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-v69jj",
      "nodeId": "node-card-1787011798773-4wjxy",
      "front": "slack time",
      "back": "the length of time that a task can run overtime before affecting other tasks",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-2orj0",
    "name": "social constraints",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-p1lsj",
      "nodeId": "node-card-1787011798773-2orj0",
      "front": "social constraints",
      "back": "the limitations imposed on a project or decision by societal norms, values and expectations",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-oqzxv",
    "name": "software",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-aixb6",
      "nodeId": "node-card-1787011798773-oqzxv",
      "front": "software",
      "back": "programs used by a computer",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-oo2dm",
    "name": "software developer",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-tyty2",
      "nodeId": "node-card-1787011798773-oo2dm",
      "front": "software developer",
      "back": "a human who participates in design and creation of software programs, typically by writing programming code",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-p9doc",
    "name": "software requirements specification",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-84qxd",
      "nodeId": "node-card-1787011798773-p9doc",
      "front": "software requirements specification (SRS)",
      "back": "a single document that contains the outcomes of the analysis stage of the problem-solving methodology, including scope, constraints, functional requirements and non-functional requirements",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-nu16v",
    "name": "solution boundaries",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-nmxaq",
      "nodeId": "node-card-1787011798773-nu16v",
      "front": "solution boundaries",
      "back": "the limits or edges of what a project or solution will encompass",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-dcjo7",
    "name": "successor",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-vdlgm",
      "nodeId": "node-card-1787011798773-dcjo7",
      "front": "successor",
      "back": "a task that must be completed after another task",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-cow0b",
    "name": "survey",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-8ytta",
      "nodeId": "node-card-1787011798773-cow0b",
      "front": "survey",
      "back": "a set of questions that ask for a response to be selected from a list of alternatives",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-21yls",
    "name": "system boundary",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-t1hx2",
      "nodeId": "node-card-1787011798773-21yls",
      "front": "system boundary",
      "back": "a rectangle around relevant use cases that indicates the use cases that are within the scope of the solution",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bs6ty",
    "name": "technical constraints",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qr6ho",
      "nodeId": "node-card-1787011798773-bs6ty",
      "front": "technical constraints",
      "back": "the limitations and restrictions related to the technology used in a project",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bjtcv",
    "name": "Unified Modeling Language (UML)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hbfb2",
      "nodeId": "node-card-1787011798773-bjtcv",
      "front": "Unified Modeling Language (UML)",
      "back": "a general-purpose visual modelling language",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-t5iow",
    "name": "uptime",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-r8glc",
      "nodeId": "node-card-1787011798773-t5iow",
      "front": "uptime",
      "back": "the time during which a machine, solution or application is operational",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-homra",
    "name": "usability",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-v274r",
      "nodeId": "node-card-1787011798773-homra",
      "front": "usability",
      "back": "the extent to which a system is easy to learn and use",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-u91ai",
    "name": "use case",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qfbg6",
      "nodeId": "node-card-1787011798773-u91ai",
      "front": "use case",
      "back": "a representation of the transactions or functions a user (actor) can complete in a system, as shown in a use case diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-559q5",
    "name": "use case diagram (UCD)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ehnp9",
      "nodeId": "node-card-1787011798773-559q5",
      "front": "use case diagram (UCD)",
      "back": "a method of describing how a user interacts with a system, using Unified Modeling Language (UML)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-vyfx7",
    "name": "version",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-4a01y",
      "nodeId": "node-card-1787011798773-vyfx7",
      "front": "version",
      "back": "a specific state or release of a software product, used to track and manage changes, improvements and updates made to the software over time",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-lg6qq",
    "name": "work breakdown structure (WBS)",
    "type": "card",
    "parentId": "node-deck-1787011798773-p3uyy",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-j2nie",
      "nodeId": "node-card-1787011798773-lg6qq",
      "front": "work breakdown structure (WBS)",
      "back": "an often hierarchical breakdown of a project that organises the work to be done into manageable sections, often displayed as a visual outline or map",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798773-y9fle",
    "name": "Design",
    "type": "divider",
    "parentId": "node-deck-1787011798773-jthe8",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-osnhq",
      "nodeId": "node-deck-1787011798773-y9fle",
      "description": ""
    }
  },
  {
    "id": "node-deck-1787011798773-zv7v6",
    "name": "Chapter 4",
    "type": "divider",
    "parentId": "node-deck-1787011798773-y9fle",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-pxb4m",
      "nodeId": "node-deck-1787011798773-zv7v6",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798773-k2rb0",
    "name": "accessibility",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-yqq84",
      "nodeId": "node-card-1787011798773-k2rb0",
      "front": "accessibility",
      "back": "how easily the software can be used by those who experience disabilities",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-pmpoy",
    "name": "accuracy",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-nh8zq",
      "nodeId": "node-card-1787011798773-pmpoy",
      "front": "accuracy",
      "back": "the absence of mistakes or errors",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xpab3",
    "name": "annotate",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-b9lnd",
      "nodeId": "node-card-1787011798773-xpab3",
      "front": "annotate",
      "back": "add comments to a document or diagram",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-dtxni",
    "name": "assistive technology",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-lwyp6",
      "nodeId": "node-card-1787011798773-dtxni",
      "front": "assistive technology",
      "back": "any device or system that is designed for individuals who would otherwise find the task difficult or impossible",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-kkye9",
    "name": "asymmetric key encryption",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-m39e9",
      "nodeId": "node-card-1787011798773-kkye9",
      "front": "asymmetric key encryption",
      "back": "a cryptographic system that uses a pair of keys – a public key and a private key – for secure data encryption and decryption",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-v0g2r",
    "name": "attractiveness",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-8back",
      "nodeId": "node-card-1787011798773-v0g2r",
      "front": "attractiveness",
      "back": "how pleasing something is to the viewer",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-axa42",
    "name": "biometric data",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-inubh",
      "nodeId": "node-card-1787011798773-axa42",
      "front": "biometric data",
      "back": "information derived from the unique physical characteristics of an individual, such as fingerprints, facial recognition or iris patterns, used for identification and authentication",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9lwg0",
    "name": "cipher text data",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-o3y21",
      "nodeId": "node-card-1787011798773-9lwg0",
      "front": "cipher text data",
      "back": "data that has been transformed from plain text into an unreadable format using encryption",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-h045v",
    "name": "clarity",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-yxxbh",
      "nodeId": "node-card-1787011798773-h045v",
      "front": "clarity",
      "back": "ease of understanding",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-v69rf",
    "name": "communication of message",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-i36gd",
      "nodeId": "node-card-1787011798773-v69rf",
      "front": "communication of message",
      "back": "the process through which meaning is transferred",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-nnw02",
    "name": "completeness",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-coge4",
      "nodeId": "node-card-1787011798773-nnw02",
      "front": "completeness",
      "back": "nothing left out",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-13ch2",
    "name": "convergent thinking",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3l6yd",
      "nodeId": "node-card-1787011798773-13ch2",
      "front": "convergent thinking",
      "back": "involves coming up with a single, well-established answer to a problem",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bknba",
    "name": "data",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-06nss",
      "nodeId": "node-card-1787011798773-bknba",
      "front": "data",
      "back": "raw, unorganised facts, figures and symbols fed to a computer during the input process; data can also refer to ideas or concepts before they have been refined",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-blgkm",
    "name": "data dictionary (software design)",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-gzvp9",
      "nodeId": "node-card-1787011798773-blgkm",
      "front": "data dictionary (software design)",
      "back": "used to plan storage structure; provides specifications of variables, arrays and GUI objects",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-2jizx",
    "name": "decrypt",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-sd16y",
      "nodeId": "node-card-1787011798773-2jizx",
      "front": "decrypt",
      "back": "the process of converting encrypted data back into its original, readable form using a decryption key",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ydpkp",
    "name": "design ideas",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-sihto",
      "nodeId": "node-card-1787011798773-ydpkp",
      "front": "design ideas",
      "back": "conceptual solutions or creative approaches intended to address a specific problem or requirement in a design process",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-b3ghr",
    "name": "differential backup",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wn3hi",
      "nodeId": "node-card-1787011798773-b3ghr",
      "front": "differential backup",
      "back": "a type of backup that saves only the data that has changed since the last full backup",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-w38m5",
    "name": "divergent thinking",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-2a3st",
      "nodeId": "node-card-1787011798773-w38m5",
      "front": "divergent thinking",
      "back": "involves exploring many possible solutions using spontaneous, free-flowing techniques",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-om9jc",
    "name": "effectiveness",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-mff8t",
      "nodeId": "node-card-1787011798773-om9jc",
      "front": "effectiveness",
      "back": "produces the expected result",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-376pr",
    "name": "effectiveness of a solution",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-apbqr",
      "nodeId": "node-card-1787011798773-376pr",
      "front": "effectiveness of a solution",
      "back": "how well the software works to produce the desired result",
      "weight": 27,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-6bfll",
    "name": "efficiency",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-5rswi",
      "nodeId": "node-card-1787011798773-6bfll",
      "front": "efficiency",
      "back": "economic use of resources with minimum waste",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-rn9j6",
    "name": "efficiency of a solution",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qadlm",
      "nodeId": "node-card-1787011798773-rn9j6",
      "front": "efficiency of a solution",
      "back": "whether the result is produced quickly and simply",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-v8lno",
    "name": "encrypt",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ii4kv",
      "nodeId": "node-card-1787011798773-v8lno",
      "front": "encrypt",
      "back": "to convert data into a coded format to prevent unauthorised access",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-oiyhp",
    "name": "encryption",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-9tsq3",
      "nodeId": "node-card-1787011798773-oiyhp",
      "front": "encryption",
      "back": "the process of converting plain text data into an unreadable format to protect it from unauthorised access",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-uhnpi",
    "name": "evaluation",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-bxxle",
      "nodeId": "node-card-1787011798773-uhnpi",
      "front": "evaluation",
      "back": "an assessment of whether a solution achieves the goals for which it was originally designed; not the same as testing",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-qzp7z",
    "name": "evaluation criteria",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-56ars",
      "nodeId": "node-card-1787011798773-qzp7z",
      "front": "evaluation criteria",
      "back": "rules set out during design that include effectiveness and efficiency criteria; based on the solution's requirements, which were defined during analysis",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-l5hky",
    "name": "file management plan",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-3mdjt",
      "nodeId": "node-card-1787011798773-l5hky",
      "front": "file management plan",
      "back": "a plan that includes all aspects of handling documents, including storage, retrieval, backups, archiving and security",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-478lt",
    "name": "full access",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-b3kdy",
      "nodeId": "node-card-1787011798773-478lt",
      "front": "full access",
      "back": "unrestricted permission to view, modify and manage all resources and information in a system",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hu5o0",
    "name": "full backup",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-mq7a3",
      "nodeId": "node-card-1787011798773-hu5o0",
      "front": "full backup",
      "back": "a complete copy of all data in a system at a given point in time",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-2eg7j",
    "name": "HDD",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-t1squ",
      "nodeId": "node-card-1787011798773-2eg7j",
      "front": "HDD",
      "back": "hard disk drive; a data storage device that uses spinning disks to read and write data",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-sd099",
    "name": "incremental backup",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-phl31",
      "nodeId": "node-card-1787011798773-sd099",
      "front": "incremental backup",
      "back": "a backup that saves only the data that has changed since the last backup of any type",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-0gzfd",
    "name": "information",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-d7ksh",
      "nodeId": "node-card-1787011798773-0gzfd",
      "front": "information",
      "back": "knowledge about a person, place, event or thing",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-azxal",
    "name": "maintainability",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-sx4ye",
      "nodeId": "node-card-1787011798773-azxal",
      "front": "maintainability",
      "back": "the ease with which a system or component can be maintained to correct defects, improve performance or adapt to a changed environment",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-qn8ks",
    "name": "off-site storage",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-s138g",
      "nodeId": "node-card-1787011798773-qn8ks",
      "front": "off-site storage",
      "back": "physical or cloud-based storage of data and backups located outside an organisation's premises",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-96s08",
    "name": "on-site storage",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-9oowj",
      "nodeId": "node-card-1787011798773-96s08",
      "front": "on-site storage",
      "back": "physical storage of data and backups located within the premises of an organisation",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-pkgyk",
    "name": "plain text data",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-oj277",
      "nodeId": "node-card-1787011798773-pkgyk",
      "front": "plain text data",
      "back": "data in its original, readable form, without encryption",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-e95fa",
    "name": "private key",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wkcrf",
      "nodeId": "node-card-1787011798773-e95fa",
      "front": "private key",
      "back": "a secret key used in asymmetric encryption that is kept confidential and used for decrypting data encrypted with the corresponding public key",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ij5xu",
    "name": "pseudocode",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qy513",
      "nodeId": "node-card-1787011798773-ij5xu",
      "front": "pseudocode",
      "back": "code that designs algorithms in a clear, human-readable, language-independent format",
      "weight": 18,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-konl3",
    "name": "public key",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-oyavh",
      "nodeId": "node-card-1787011798773-konl3",
      "front": "public key",
      "back": "a key used in asymmetric encryption that is publicly available and used to encrypt data or verify a digital signature",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-6y97w",
    "name": "public key encryption",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-n7m24",
      "nodeId": "node-card-1787011798773-6y97w",
      "front": "public key encryption",
      "back": "an encryption method that uses a pair of keys: a public key for encryption and a private key for decryption",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-13byl",
    "name": "readability",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ylu82",
      "nodeId": "node-card-1787011798773-13byl",
      "front": "readability",
      "back": "the ease of understanding the text",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-gastm",
    "name": "relevance",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-h0kb3",
      "nodeId": "node-card-1787011798773-gastm",
      "front": "relevance",
      "back": "appropriate meaning in the context of the discussion",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-ckb9u",
    "name": "restricted access",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-f1ewp",
      "nodeId": "node-card-1787011798773-ckb9u",
      "front": "restricted access",
      "back": "limited permission to view, modify or manage resources and information in a system",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-z8n9f",
    "name": "Secure Sockets Layer (SSL)",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-9wc16",
      "nodeId": "node-card-1787011798773-z8n9f",
      "front": "Secure Sockets Layer (SSL)",
      "back": "a protocol for establishing secure, encrypted connections over the internet",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-68lo0",
    "name": "SSD",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-j05qj",
      "nodeId": "node-card-1787011798773-68lo0",
      "front": "SSD",
      "back": "solid state drive; a data storage device that uses flash memory to store data, offering faster access speeds than HDDs",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-wh5yi",
    "name": "symmetric key encryption",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-tbqw4",
      "nodeId": "node-card-1787011798773-wh5yi",
      "front": "symmetric key encryption",
      "back": "a cryptographic system that uses the same key for both encryption and decryption",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-dvilu",
    "name": "timeliness",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-0zw7u",
      "nodeId": "node-card-1787011798773-dvilu",
      "front": "timeliness",
      "back": "occurring at the right time",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-5dxca",
    "name": "Transport Layer Security (TLS)",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-qhhky",
      "nodeId": "node-card-1787011798773-5dxca",
      "front": "Transport Layer Security (TLS)",
      "back": "a protocol that provides secure communication over a computer network, succeeding SSL",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-gzde9",
    "name": "two-factor authentication",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-pxds9",
      "nodeId": "node-card-1787011798773-gzde9",
      "front": "two-factor authentication",
      "back": "a security process that requires two forms of identification before granting access",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9spdp",
    "name": "universal design",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zwjuv",
      "nodeId": "node-card-1787011798773-9spdp",
      "front": "universal design",
      "back": "designing products that can be used by people with a wide range of abilities and disabilities",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-w6sv8",
    "name": "usability",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-f2rhu",
      "nodeId": "node-card-1787011798773-w6sv8",
      "front": "usability",
      "back": "ease of use to achieve specified goals in terms of efficiency, effectiveness and satisfaction",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-cun2a",
    "name": "username and password",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-agvgq",
      "nodeId": "node-card-1787011798773-cun2a",
      "front": "username and password",
      "back": "a combination of a user identifier and a secret set of characters used to authenticate and grant access to a system or service",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-lwnxr",
    "name": "version control",
    "type": "card",
    "parentId": "node-deck-1787011798773-zv7v6",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-d55kf",
      "nodeId": "node-card-1787011798773-lwnxr",
      "front": "version control",
      "back": "a system for managing changes to files, tracking modifications and maintaining a history of versions",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798773-thne9",
    "name": "Legal",
    "type": "divider",
    "parentId": "node-deck-1787011798772-fwqr4",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-chsg3",
      "nodeId": "node-deck-1787011798773-thne9",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798773-51rfc",
    "name": "Important acts (4) (name, date, lev",
    "type": "card",
    "parentId": "node-deck-1787011798773-thne9",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-wdozd",
      "nodeId": "node-card-1787011798773-51rfc",
      "front": "Important acts (4) (name, date, level)",
      "back": "1. Copyright Act 1968 (Cth) (Federal)\r2. Privacy Act 1988 (Cth) (Federal)\r3. Health Records Act 2001 (Vic)\r4. Privacy and Data Protection Act 2014 (Vic)\r\r",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798773-kcptu",
    "name": "Privacy Act 1988",
    "type": "divider",
    "parentId": "node-deck-1787011798773-thne9",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-gwbmp",
      "nodeId": "node-deck-1787011798773-kcptu",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798773-1fte6",
    "name": "APP 1 - Open and transparent manage",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zw5x9",
      "nodeId": "node-card-1787011798773-1fte6",
      "front": "APP 1 - Open and transparent management of personal information (2)",
      "back": "- Organisations must have a **clearly articulated** and **accessible** privacy policy\r- Privacy policy must explain:\r   - how and why the organisation collects, holds, uses, and discloses personal information (PI)\r   - how an individual can access and correct their personal information (PI) held by the organisation",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-p7b3l",
    "name": "APP 3 - Collection of solicited per",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-zd909",
      "nodeId": "node-card-1787011798773-p7b3l",
      "front": "APP 3 - Collection of solicited personal information (3)",
      "back": "- Organisations can only collect personal information (PI) that is **reasonably necessary** for their functions or activities.\r- Organisations must also notify individuals about the purpose of data collection and other relevant details\r- Individuals must be aware of why their information is being collected and how it will be used",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-isl6t",
    "name": "APP 6 - Use or disclosure of person",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-yz33v",
      "nodeId": "node-card-1787011798773-isl6t",
      "front": "APP 6 - Use or disclosure of personal information (2)",
      "back": "- Organisations are allowed to use or disclose personal information (PI) for the **primary** reason it was collected\r- Organisations may also use/disclose PI for secondary purposes (ads) if the individual has consented, or permitted by law",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-jbp9f",
    "name": "APP 8 - Cross-border disclosure of ",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-fky0s",
      "nodeId": "node-card-1787011798773-jbp9f",
      "front": "APP 8 - Cross-border disclosure of personal information (2)",
      "back": "- Before disclosing PI to an overseas recipient, organisations must ensure that recipient will protect PI consistent with the Australian Privacy Principles (APP) \r- Individuals should be informed about the likelihood of their PI being sent overseas and those recipient countries and regions",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hjt6n",
    "name": "APP 9 - Adoption, use, or disclosur",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-v3pcx",
      "nodeId": "node-card-1787011798773-hjt6n",
      "front": "APP 9 - Adoption, use, or disclosure of government related identifiers (1)",
      "back": "Organisations are generally prohibited from adopting, using, or disclosing government-related identifiers as their own.\r\rA government-related identifier is a unique ID assigned by a government agency, *e.g. TFN/driver's license no.)*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-0bp2s",
    "name": "APP 11 - Security of personal infor",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-10lw4",
      "nodeId": "node-card-1787011798773-0bp2s",
      "front": "APP 11 - Security of personal information (2)",
      "back": "Organisations must take reasonable steps to ensure PI they hold is safe from:\r- misuse\r- interference\r- loss\r- unauthorised access\r- modification\r- disclosure\r\r\rOrganisations must also have processes in place to **detect** and **respond to** data breaches, including:\r- notifying affected individuals\r- notifying relevant authorities",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-if577",
    "name": "Personal information (PI)",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-d9syd",
      "nodeId": "node-card-1787011798773-if577",
      "front": "Personal information (PI)",
      "back": "- information or an opinion about an identified individual (or an individual that is reasonably identifiable)\r- whether the information or opinion is true or not\r- whether the information is recorded in a material form or not \r*non-material - only in someone's mind or communicated verbally*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-qxyv0",
    "name": "What APPs are relevant in Privacy A",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-0ynqg",
      "nodeId": "node-card-1787011798773-qxyv0",
      "front": "What APPs are relevant in Privacy Act 1988 (6)",
      "back": "1, 3, 6, 8, 9, and 11",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-bjcha",
    "name": "What forms of data it applies to",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-anv9c",
      "nodeId": "node-card-1787011798773-bjcha",
      "front": "What forms of data it applies to",
      "back": "Applies to both **electronic** and **manual** or **conventional** forms of data gathering and handling by private organisations",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-m25zl",
    "name": "Who is subject to the Federal Priva",
    "type": "card",
    "parentId": "node-deck-1787011798773-kcptu",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-exhwg",
      "nodeId": "node-card-1787011798773-m25zl",
      "front": "Who is subject to the Federal Privacy Act?",
      "back": "- Any federal government department\r- Any private organisation which\r   - Turns over $3 million+ annually\r   - Profits from trading in personal information\r   - Holds health information about people",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-deck-1787011798773-1pm26",
    "name": "Copyright Act 1968",
    "type": "divider",
    "parentId": "node-deck-1787011798773-thne9",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "divider": {
      "id": "div-1787011798773-km7mi",
      "nodeId": "node-deck-1787011798773-1pm26",
      "description": ""
    }
  },
  {
    "id": "node-card-1787011798773-4z4dy",
    "name": "When is Copyright given to the crea",
    "type": "card",
    "parentId": "node-deck-1787011798773-1pm26",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-hmyrg",
      "nodeId": "node-card-1787011798773-4z4dy",
      "front": "When is Copyright given to the creator of Intellectual Property (IP)?",
      "back": "As soon as the Intellectual Property (IP) is expressed in a tangible form. \r\r*e.g. written, recorded, filmed, or put online*",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-r260o",
    "name": "What primary unauthorised actions d",
    "type": "card",
    "parentId": "node-deck-1787011798773-1pm26",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-73foi",
      "nodeId": "node-card-1787011798773-r260o",
      "front": "What primary unauthorised actions does Copyright prevent?",
      "back": "- reproduction (copy)\r- conversion (convert)\r- adaptation (refine)\r- transmission (move/send)\r- publication (publish)",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hym17",
    "name": "What IPs are included in the copyri",
    "type": "card",
    "parentId": "node-deck-1787011798773-1pm26",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-odkzk",
      "nodeId": "node-card-1787011798773-hym17",
      "front": "What IPs are included in the copyright act? (4, 9 expanded)",
      "back": "- original: literary, dramatic, musical, and artistic: works\r- websites\r- software\r- electronically **recorded**: music, films, and books",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-m09en",
    "name": "Common illegal actions (6)",
    "type": "card",
    "parentId": "node-deck-1787011798773-1pm26",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-r0d44",
      "nodeId": "node-card-1787011798773-m09en",
      "front": "Common illegal actions (6)",
      "back": "1. Converting a physical work into a digital form\r2. Make/import devices or software that bypass copy protections\r3. Remove/tamper a copyright notice\r4. Share copyrighted material online\r5. Keep or share programmes recorded from TV\r6. Publish unauthorised screenshots",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-9eey0",
    "name": "a remote card",
    "type": "card",
    "parentId": "node-deck-1787011798772-fwqr4",
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ywp5c",
      "nodeId": "node-card-1787011798773-9eey0",
      "front": "a remote card",
      "back": "lka jdslk",
      "weight": 1,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-hm3h7",
    "name": "test a ",
    "type": "card",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-lpd7j",
      "nodeId": "node-card-1787011798773-hm3h7",
      "front": "test a ",
      "back": "testkj laskd flkaj ",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-txa49",
    "name": "test b lk",
    "type": "card",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-5ncpk",
      "nodeId": "node-card-1787011798773-txa49",
      "front": "test b lk",
      "back": "j lkjl",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-80gqy",
    "name": "test c",
    "type": "card",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-oihsa",
      "nodeId": "node-card-1787011798773-80gqy",
      "front": "test c",
      "back": "",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-xq893",
    "name": "test b",
    "type": "card",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-ezv77",
      "nodeId": "node-card-1787011798773-xq893",
      "front": "test b",
      "back": "",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  },
  {
    "id": "node-card-1787011798773-3rj8w",
    "name": "teslk ",
    "type": "card",
    "parentId": null,
    "createdAt": "2026-08-18T00:09:58.773Z",
    "updatedAt": "2026-08-18T00:09:58.773Z",
    "card": {
      "id": "card-1787011798773-84ue8",
      "nodeId": "node-card-1787011798773-3rj8w",
      "front": "teslk ",
      "back": "lkjlkjlk",
      "weight": 20,
      "easeFactor": 2.5,
      "interval": 1,
      "reviewCount": 0
    }
  }
];

export function getStoredNodes(): NodeData[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_NODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_NODES));
      return INITIAL_SAMPLE_NODES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored nodes:', e);
    return INITIAL_SAMPLE_NODES;
  }
}

export function saveStoredNodes(nodes: NodeData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  } catch (e) {
    console.error('Failed to save nodes to localStorage:', e);
  }
}

export function resetToSampleNodes(): NodeData[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_NODES));
  }
  return INITIAL_SAMPLE_NODES;
}

// Tree helpers
export interface TreeNode extends NodeData {
  childrenNodes: TreeNode[];
  cardCount: number;
}

export function buildTree(nodes: NodeData[], parentId: string | null = null): TreeNode[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .map((n) => {
      const childrenNodes = buildTree(nodes, n.id);
      const childCardCount = childrenNodes.reduce((sum, child) => sum + child.cardCount, 0);
      const cardCount = (n.type === 'card' ? 1 : 0) + childCardCount;
      return {
        ...n,
        childrenNodes,
        cardCount,
      };
    });
}

export function getAllCardsInDeck(nodes: NodeData[], deckNodeId: string | null): NodeData[] {
  if (!deckNodeId) {
    return nodes.filter((n) => n.type === 'card' && !!n.card);
  }

  const result: NodeData[] = [];

  function collect(currentId: string) {
    const current = nodes.find((n) => n.id === currentId);
    if (!current) return;

    if (current.type === 'card') {
      result.push(current);
    } else {
      const children = nodes.filter((n) => n.parentId === currentId);
      children.forEach((child) => collect(child.id));
    }
  }

  collect(deckNodeId);
  return result;
}
