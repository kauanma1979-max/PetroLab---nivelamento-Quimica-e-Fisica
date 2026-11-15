import { Discipline } from '../types';

export type PdfModuleId =
  | 'intro'
  | 'm03'
  | 'm04'
  | 'm05'
  | 'm06'
  | 'm07'
  | 'm08'
  | 'm09'
  | 'm10'
  | 'revisao';

export interface PdfMapStageLink {
  discipline: Discipline;
  stageNumber: number;
}

export interface PdfMapPage {
  pageNumber: number;
  imageUrl: string;
  moduleId: PdfModuleId;
  moduleCode: string;
  moduleTitle: string;
  title: string;
  subtitle: string;
  disciplineFocus: 'quimica' | 'fisica' | 'misto' | 'geral';
  stageLinks: PdfMapStageLink[];
}

export interface PdfModuleGroup {
  id: PdfModuleId;
  code: string;
  title: string;
  pageRange: string;
  disciplineFocus: 'quimica' | 'fisica' | 'misto' | 'geral';
}

export const PDF_MODULES: PdfModuleGroup[] = [
  { id: 'intro', code: 'Intro', title: 'Capa, Sumário e Orientação', pageRange: 'p. 1–3', disciplineFocus: 'geral' },
  { id: 'm03', code: 'Mód. 03', title: 'Instrumentação e Controle', pageRange: 'p. 42–58', disciplineFocus: 'misto' },
  { id: 'm04', code: 'Mód. 04', title: 'Mecânica e Mecânica dos Fluidos', pageRange: 'p. 59–67', disciplineFocus: 'fisica' },
  { id: 'm05', code: 'Mód. 05', title: 'Calor, Resistência e Termodinâmica', pageRange: 'p. 68–79', disciplineFocus: 'fisica' },
  { id: 'm06', code: 'Mód. 06', title: 'Equipamentos Industriais', pageRange: 'p. 80–84', disciplineFocus: 'geral' },
  { id: 'm07', code: 'Mód. 07', title: 'Segurança, Meio Ambiente e Saúde', pageRange: 'p. 85–87', disciplineFocus: 'geral' },
  { id: 'm08', code: 'Mód. 08', title: 'Química Fundamental e Industrial', pageRange: 'p. 88–106', disciplineFocus: 'quimica' },
  { id: 'm09', code: 'Mód. 09', title: 'Operações, Refino e Processos', pageRange: 'p. 107–111', disciplineFocus: 'quimica' },
  { id: 'm10', code: 'Mód. 10', title: 'Eletricidade e Eletrônica', pageRange: 'p. 112–118', disciplineFocus: 'fisica' },
  { id: 'revisao', code: 'Final', title: 'Revisão Final: Dutos e Terminais', pageRange: 'p. 119', disciplineFocus: 'geral' },
];

interface CustomPageMeta {
  title: string;
  subtitle: string;
  disciplineFocus?: 'quimica' | 'fisica' | 'misto' | 'geral';
  stageLinks?: PdfMapStageLink[];
}

const CUSTOM_PAGE_META: Record<number, CustomPageMeta> = {
  1: {
    title: 'Capa — Mapas Transpetro Reta Final 2026',
    subtitle: 'Dutos e Terminais · Acervo técnico selecionado (81 páginas: Módulos 03–10 e Revisão).',
  },
  2: {
    title: 'Sumário Oficial dos Módulos',
    subtitle: 'Índice geral do material original (no app: Introdução p. 1–3 e Módulos 03–10 p. 42–119).',
  },
  3: {
    title: 'Orientação de Estudo',
    subtitle: 'Como utilizar os mapas visuais para revisão objetiva.',
  },
  42: {
    title: 'Abertura — Módulo 03: Instrumentação e Controle',
    subtitle: 'Instrumentos de processo, malhas de controle, medição e automação.',
    disciplineFocus: 'misto',
  },
  43: {
    title: 'Metrologia: Conceitos Fundamentais',
    subtitle: 'Medição, grandezas, unidades do SI, erro, calibração, exatidão e precisão.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 1 }],
  },
  51: {
    title: 'Pressão e Temperatura',
    subtitle: 'Pressão absoluta, manométrica, diferencial, escalas térmicas e conversões.',
    disciplineFocus: 'fisica',
    stageLinks: [
      { discipline: 'fisica', stageNumber: 5 },
      { discipline: 'fisica', stageNumber: 6 },
    ],
  },
  53: {
    title: 'Massa e Densidade',
    subtitle: 'Relação ρ = m/V, massa específica, tabela de fluidos e influência da temperatura.',
    disciplineFocus: 'misto',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 1 },
      { discipline: 'fisica', stageNumber: 5 },
    ],
  },
  54: {
    title: 'Sistema Internacional de Unidades (SI)',
    subtitle: '7 unidades de base, grandezas derivadas, prefixos e conversões práticas em dutos.',
    disciplineFocus: 'fisica',
    stageLinks: [
      { discipline: 'fisica', stageNumber: 1 },
      { discipline: 'fisica', stageNumber: 4 },
      { discipline: 'fisica', stageNumber: 9 },
    ],
  },
  57: {
    title: 'Instrumentos de Medição de Temperatura',
    subtitle: 'Termopar, RTD (Pt100/Pt1000), termistor, bimetálico e pirômetro infravermelho.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 6 }],
  },
  59: {
    title: 'Abertura — Módulo 04: Mecânica e Mecânica dos Fluidos',
    subtitle: 'Estática, dinâmica, hidrostática, perda de carga e escoamento em dutos.',
    disciplineFocus: 'fisica',
  },
  60: {
    title: 'Estática',
    subtitle: 'Força, vetor, resultante, momento (torque), DCL e equilíbrio de corpos.',
    disciplineFocus: 'fisica',
    stageLinks: [
      { discipline: 'fisica', stageNumber: 1 },
      { discipline: 'fisica', stageNumber: 3 },
    ],
  },
  61: {
    title: 'Cinemática',
    subtitle: 'Posição, deslocamento, distância percorrida, velocidade, aceleração, MU, MUA e gráficos.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 2 }],
  },
  62: {
    title: 'Dinâmica',
    subtitle: 'Leis de Newton, força (F = m·a), peso, normal, atrito e plano inclinado.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 3 }],
  },
  63: {
    title: 'Conservação da Energia Mecânica',
    subtitle: 'Energia cinética, potencial gravitacional, trabalho e transformação de energia.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 4 }],
  },
  64: {
    title: 'Propriedades dos Fluidos',
    subtitle: 'Massa específica, peso específico, densidade relativa, pressão e viscosidade.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 5 }],
  },
  65: {
    title: 'Hidrostática',
    subtitle: 'Pressão hidrostática (p = ρgh), Princípio de Pascal, vasos comunicantes e manometria.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 5 }],
  },
  66: {
    title: 'Escoamento em Tubulações e Dutos',
    subtitle: 'Vazão, equação da continuidade (Q = A·v) e regimes laminar, transicional e turbulento.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 5 }],
  },
  67: {
    title: 'Perda de Carga',
    subtitle: 'Perda distribuída e localizada, equação de Darcy-Weisbach e queda de pressão.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 5 }],
  },
  68: {
    title: 'Abertura — Módulo 05: Calor, Resistência e Termodinâmica',
    subtitle: 'Transferência de calor, resistência dos materiais, máquinas térmicas e leis.',
    disciplineFocus: 'fisica',
  },
  69: {
    title: 'Transferência de Calor por Condução',
    subtitle: 'Lei de Fourier, parede plana, tubo cilíndrico, condutores e isolantes térmicos.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 6 }],
  },
  70: {
    title: 'Transferência de Calor por Convecção',
    subtitle: 'Convecção natural e forçada, coeficiente convectivo (q = h·A·ΔT) e trocadores.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 6 }],
  },
  71: {
    title: 'Transferência de Calor por Radiação',
    subtitle: 'Ondas eletromagnéticas, espectro, emissividade e Lei de Stefan-Boltzmann.',
    disciplineFocus: 'fisica',
    stageLinks: [
      { discipline: 'fisica', stageNumber: 6 },
      { discipline: 'fisica', stageNumber: 9 },
    ],
  },
  72: {
    title: 'Máquinas Térmicas',
    subtitle: 'Fonte quente/fria, trabalho útil, eficiência (η = W/Qh) e aplicações industriais.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 7 }],
  },
  73: {
    title: 'Tensões Normais e Cisalhantes',
    subtitle: 'Tração, compressão, cisalhamento e solicitações básicas em estruturas.',
    disciplineFocus: 'fisica',
  },
  74: {
    title: 'Solicitações Axiais',
    subtitle: 'Tensão normal (σ = F/A), deformação (ε = ΔL/L₀) e alongamento/encurtamento.',
    disciplineFocus: 'fisica',
  },
  75: {
    title: 'Flexão',
    subtitle: 'Carga transversal, momento fletor, linha neutra e tensão normal em vigas.',
    disciplineFocus: 'fisica',
  },
  76: {
    title: 'Torção',
    subtitle: 'Torque, tensão de cisalhamento na torção e ângulo de torção em eixos.',
    disciplineFocus: 'fisica',
  },
  77: {
    title: 'Propriedades Termodinâmicas',
    subtitle: 'Sistema fechado vs volume de controle, pressão, volume específico, energia interna e entalpia.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 7 }],
  },
  78: {
    title: 'Primeira Lei da Termodinâmica',
    subtitle: 'Conservação de energia, calor, trabalho, ΔU = Q − W e balanço em volume de controle.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 7 }],
  },
  79: {
    title: 'Segunda Lei da Termodinâmica',
    subtitle: 'Direção natural dos processos, irreversibilidade, entropia e limite de Carnot.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 7 }],
  },
  80: {
    title: 'Abertura — Módulo 06: Equipamentos Industriais',
    subtitle: 'Bombas, compressores, turbinas, trocadores de calor, vasos e tanques.',
  },
  85: {
    title: 'Abertura — Módulo 07: Segurança, Meio Ambiente e Saúde (SMS)',
    subtitle: 'Normas, procedimentos, meio ambiente e saúde ocupacional.',
  },
  88: {
    title: 'Abertura — Módulo 08: Química Fundamental e Industrial',
    subtitle: 'Estrutura da matéria, transformações químicas e aplicações em óleo, gás e terminais.',
    disciplineFocus: 'quimica',
  },
  89: {
    title: 'Modelos Atômicos',
    subtitle: 'Evolução de Dalton, Thomson, Rutherford, Bohr e Modelo Quântico + partículas subatômicas.',
    disciplineFocus: 'quimica',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 1 },
      { discipline: 'quimica', stageNumber: 2 },
    ],
  },
  90: {
    title: 'Classificação Periódica dos Elementos',
    subtitle: 'Grupos, períodos, metais/ametais e propriedades periódicas (raio, EN, EI).',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 2 }],
  },
  91: {
    title: 'Ligações Químicas',
    subtitle: 'Ligação iônica, covalente e metálica, propriedades dos compostos e tabela comparativa.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 3 }],
  },
  92: {
    title: 'Cálculo Estequiométrico',
    subtitle: 'Equação balanceada, mol, massa molar, proporções e reagente limitante.',
    disciplineFocus: 'quimica',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 5 },
      { discipline: 'quimica', stageNumber: 6 },
    ],
  },
  93: {
    title: 'Estudo dos Gases',
    subtitle: 'Variáveis P, V, T, n, Leis de Boyle, Charles, Gay-Lussac e equação PV = nRT.',
    disciplineFocus: 'misto',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 6 },
      { discipline: 'fisica', stageNumber: 7 },
    ],
  },
  94: {
    title: 'Oxidação e Redução',
    subtitle: 'NOX, transferência de elétrons, agentes oxidante/redutor, corrosão e pilhas.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 7 }],
  },
  95: {
    title: 'Ácidos e Bases',
    subtitle: 'Escala de pH, indicadores (tornassol, fenolftaleína), neutralização e aplicações.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 4 }],
  },
  96: {
    title: 'Sais e Óxidos',
    subtitle: 'Formação, classificação, nomenclatura e exemplos no setor de petróleo.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 4 }],
  },
  97: {
    title: 'Hidrocarbonetos',
    subtitle: 'Alcanos, alcenos, alcinos e aromáticos, cadeias carbônicas e frações do petróleo.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 8 }],
  },
  98: {
    title: 'Polímeros',
    subtitle: 'Monômeros, adição/condensação, termoplásticos, termofixos, elastômeros e dutos.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 8 }],
  },
  99: {
    title: 'Concentração em Massa e Volume',
    subtitle: 'Concentração comum (C = m/V), % m/m, % m/v, % v/v e diluição visual.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 4 }],
  },
  100: {
    title: 'Concentração em Quantidade de Matéria',
    subtitle: 'Mol, molaridade (M = n/V), massa molar e preparo passo a passo de soluções.',
    disciplineFocus: 'quimica',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 4 },
      { discipline: 'quimica', stageNumber: 6 },
    ],
  },
  101: {
    title: 'Transformações Químicas',
    subtitle: 'Reagentes, produtos, evidências de reação, equações e conservação da massa.',
    disciplineFocus: 'quimica',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 1 },
      { discipline: 'quimica', stageNumber: 5 },
    ],
  },
  102: {
    title: 'Equilíbrio Químico',
    subtitle: 'Reações reversíveis, equilíbrio dinâmico, Haber-Bosch e Princípio de Le Chatelier.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 7 }],
  },
  103: {
    title: 'Termoquímica',
    subtitle: 'Processos exotérmicos/endotérmicos, entalpia (ΔH), diagramas e Lei de Hess.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 7 }],
  },
  104: {
    title: 'Soluções Aquosas',
    subtitle: 'Soluto/solvente, insaturada, saturada, supersaturada e curvas de solubilidade.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 4 }],
  },
  105: {
    title: 'Dispersões',
    subtitle: 'Soluções, coloides e suspensões, tamanho de partículas e Efeito Tyndall.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 4 }],
  },
  106: {
    title: 'Natureza Elétrica da Matéria',
    subtitle: 'Cargas elétricas, eletrização, condutores/isolantes e aterramento em tanques.',
    disciplineFocus: 'misto',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  107: {
    title: 'Abertura — Módulo 09: Operações, Refino e Processos',
    subtitle: 'Operações unitárias, separação de misturas, destilação e refino de petróleo.',
    disciplineFocus: 'quimica',
  },
  108: {
    title: 'Operações Unitárias: Princípios e Classificação',
    subtitle: 'Transporte de momento, calor e massa, separação e mistura na indústria.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 1 }],
  },
  109: {
    title: 'Separação e Transferência em Processos',
    subtitle: 'Filtração, decantação, destilação, absorção, extração, secagem e troca térmica.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 1 }],
  },
  110: {
    title: 'Refino de Petróleo: Visão Geral e Destilação',
    subtitle: 'Pré-tratamento, torre atmosférica, frações (GLP, nafta, QAV, diesel) e vácuo.',
    disciplineFocus: 'quimica',
    stageLinks: [
      { discipline: 'quimica', stageNumber: 1 },
      { discipline: 'quimica', stageNumber: 8 },
    ],
  },
  111: {
    title: 'Refino: Conversão, Tratamento e Produtos',
    subtitle: 'Craqueamento (FCC), reforma catalítica, hidrotratamento e dessulfurização.',
    disciplineFocus: 'quimica',
    stageLinks: [{ discipline: 'quimica', stageNumber: 8 }],
  },
  112: {
    title: 'Abertura — Módulo 10: Eletricidade e Eletrônica',
    subtitle: 'Cargas elétricas, circuitos, motores, comandos, proteção e eletrônica.',
    disciplineFocus: 'fisica',
  },
  113: {
    title: 'Eletrostática',
    subtitle: 'Atração/repulsão, eletrização, Lei de Coulomb, campo elétrico e potencial.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  114: {
    title: 'Cargas Elétricas em Movimento',
    subtitle: 'Corrente elétrica, tensão, resistência, Lei de Ohm e sentido convencional/real.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  115: {
    title: 'Eletromagnetismo',
    subtitle: 'Campo magnético em condutores e bobinas, eletroímã, Lei de Faraday e força magnética.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  116: {
    title: 'Radiações Eletromagnéticas',
    subtitle: 'Onda eletromagnética (v = λ·f), espectro de rádio a gama e aplicações industriais.',
    disciplineFocus: 'fisica',
    stageLinks: [
      { discipline: 'fisica', stageNumber: 8 },
      { discipline: 'fisica', stageNumber: 9 },
    ],
  },
  117: {
    title: 'Fundamentos de Eletricidade',
    subtitle: 'Amperímetro, voltímetro, Lei de Ohm, potência (P = V·I) e circuitos série/paralelo.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  118: {
    title: 'Fundamentos de Eletrônica',
    subtitle: 'Resistor, capacitor, indutor, diodo, LED, transistor, sinais analógicos e digitais.',
    disciplineFocus: 'fisica',
    stageLinks: [{ discipline: 'fisica', stageNumber: 8 }],
  },
  119: {
    title: 'Revisão Final: Dutos e Terminais',
    subtitle: 'Painel de conferência dos 10 módulos e checklist de revisão antes da prova.',
  },
};

function resolveModule(page: number): PdfModuleGroup {
  if (page <= 3) return PDF_MODULES[0];
  if (page <= 58) return PDF_MODULES[1];
  if (page <= 67) return PDF_MODULES[2];
  if (page <= 79) return PDF_MODULES[3];
  if (page <= 84) return PDF_MODULES[4];
  if (page <= 87) return PDF_MODULES[5];
  if (page <= 106) return PDF_MODULES[6];
  if (page <= 111) return PDF_MODULES[7];
  if (page <= 118) return PDF_MODULES[8];
  return PDF_MODULES[9];
}

const INCLUDED_PAGE_NUMBERS: number[] = [
  1,
  2,
  3,
  ...Array.from({ length: 119 - 42 + 1 }, (_, idx) => idx + 42),
];

export const PDF_MAP_PAGES: PdfMapPage[] = INCLUDED_PAGE_NUMBERS.map((pageNumber) => {
  const padded = String(pageNumber).padStart(3, '0');
  const mod = resolveModule(pageNumber);
  const custom = CUSTOM_PAGE_META[pageNumber];

  return {
    pageNumber,
    imageUrl: `/maps/page-${padded}.jpg`,
    moduleId: mod.id,
    moduleCode: mod.code,
    moduleTitle: mod.title,
    title: custom?.title ?? `${mod.title} — Mapa Visual p. ${pageNumber}`,
    subtitle: custom?.subtitle ?? `${mod.code} (${mod.pageRange}) · Apostila Mapas Transpetro Reta Final 2026.`,
    disciplineFocus: custom?.disciplineFocus ?? mod.disciplineFocus,
    stageLinks: custom?.stageLinks ?? [],
  };
});

export function getMapsForStage(discipline: Discipline, stageNumber: number): PdfMapPage[] {
  return PDF_MAP_PAGES.filter((p) =>
    p.stageLinks.some((l) => l.discipline === discipline && l.stageNumber === stageNumber)
  );
}
