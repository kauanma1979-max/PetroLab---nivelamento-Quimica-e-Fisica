import { StageContent } from '../types';

export const CHEMISTRY_TRACK: StageContent[] = [
  {
    id: 'chem-1',
    discipline: 'quimica',
    stageNumber: 1,
    title: 'Primeiros Conceitos',
    subtitle: 'Matéria, propriedades, estados físicos, substâncias, misturas, separação e modelos atômicos',
    whyNow: 'Primeiro entendemos do que as coisas são feitas antes de estudar partículas, ligações e reações.',
    pdfPages: 'PDF p. 53, 89, 101, 108–110 (Módulos 03, 08 e 09)',
    pdfComparisonNote:
      'No PDF, Modelos Atômicos abre o Módulo 08 (p. 89), enquanto Separação de Misturas está detalhada em Operações Unitárias e Refino (p. 108–110) e Densidade no Módulo 03 (p. 53). Na trilha de nivelamento, reunimos matéria, misturas e introdução atômica logo na Etapa 1 para construir a base do zero.',
    subtopics: [
      { id: 'q1-materia', title: 'Matéria e propriedades da matéria' },
      { id: 'q1-estados', title: 'Estados físicos e mudanças de estado' },
      { id: 'q1-substancias', title: 'Substâncias puras (simples e compostas)' },
      { id: 'q1-misturas', title: 'Misturas homogêneas, heterogêneas e separação' },
      { id: 'q1-atomos', title: 'Átomos e introdução aos modelos atômicos' },
    ],
    step1DiagnosticIntro:
      'Antes de começar a Etapa 1, responda às questões diagnósticas para verificar sua base sobre matéria, substâncias, misturas e a evolução histórica do átomo.',
    step2SimpleExplanation: [
      'Tudo o que tem massa e ocupa espaço ao seu redor é matéria: o aço do duto, o petróleo bruto, o gás natural e o ar que respiramos.',
      'Uma substância pura tem um único tipo de componente (como água pura H₂O ou gás oxigênio O₂). Já uma mistura junta duas ou mais substâncias: se você vê uma única fase uniforme (água + sal totalmente dissolvido), é homogênea; se você enxerga camadas diferentes (água + óleo), é heterogênea.',
      'Para separar misturas sem destruir as substâncias, usamos processos físicos como filtração (sólido + líquido), decantação (líquidos que não se misturam, como água e petróleo) e destilação (separa líquidos com pontos de ebulição diferentes).',
      'Por fim, toda matéria é formada por átomos. Ao longo da história, os cientistas foram aperfeiçoando a imagem do átomo: de uma esfera maciça (Dalton), passando pelo "pudim de passas" com elétrons (Thomson), pelo núcleo pequeno e denso (Rutherford), pelas órbitas com níveis de energia (Bohr), até a nuvem eletrônica de probabilidade (Modelo Quântico atual).',
    ],
    step3TechnicalConcept: [
      'Propriedades gerais da matéria (massa, volume, impenetrabilidade, divisibilidade) pertencem a qualquer corpo; propriedades específicas (densidade ρ = m/V, ponto de fusão PF, ponto de ebulição PE, solubilidade) permitem identificar uma substância.',
      'Substância simples é formada por um único elemento químico (ex.: O₂, N₂, Fe). Substância composta é formada por dois ou mais elementos diferentes (ex.: H₂O, NaCl, CH₄).',
      'Na mudança de estado físico (fusão, vaporização, condensação, solidificação, sublimação), não há alteração da composição química da substância — diferentemente de uma transformação química (combustão, corrosão).',
      'Evolução dos modelos atômicos (PDF p. 89): Dalton (1803, esfera maciça indivisível) → Thomson (1897, descoberta do elétron, esfera positiva com elétrons) → Rutherford (1911, experimento da lâmina de ouro, núcleo positivo denso + grande espaço vazio) → Bohr (1913, elétrons em níveis quantizados de energia) → Modelo Quântico (1926+, orbitais como regiões de probabilidade).',
    ],
    step4WorkedExamples: [
      {
        title: 'Identificando misturas e escolhendo o método de separação',
        problem:
          'Em um terminal, uma amostra contém água salgada misturada com óleo cru e grãos de areia. Qual a sequência correta para separar areia, óleo e sal?',
        steps: [
          '1º passo: Identificar as fases. A areia é sólida insolúvel; óleo e água salgada são dois líquidos imiscíveis (não se misturam). Temos 3 fases (mistura heterogênea).',
          '2º passo: Filtração para reter a areia sólida no meio poroso, deixando passar água salgada + óleo (PDF p. 109).',
          '3º passo: Decantação para separar o óleo (fase menos densa, fica em cima) da água salgada (fase mais densa, fica embaixo).',
          '4º passo: Destilação simples para separar a água pura (evapora a 100 °C e condensa) do sal dissolvido (sólido que fica no balão).',
        ],
        finalAnswer: 'Sequência: Filtração → Decantação → Destilação simples.',
      },
      {
        title: 'Cálculo de densidade para identificar um combustível (PDF p. 53)',
        problem:
          'Uma amostra líquida de 500 mL (0,5 L) retirada de um tanque possui massa de 370 g. Qual é sua densidade em g/cm³ e em kg/m³?',
        steps: [
          '1º passo: Converter o volume para cm³. Lembrar que 1 mL = 1 cm³, portanto V = 500 cm³.',
          '2º passo: Aplicar a fórmula ρ = m / V = 370 g / 500 cm³ = 0,74 g/cm³.',
          '3º passo: Converter para kg/m³ multiplicando por 1.000 (PDF p. 53: 1 g/cm³ = 1.000 kg/m³). Logo, 0,74 × 1.000 = 740 kg/m³.',
          '4º passo: Comparar com a tabela do PDF p. 53: gasolina tem densidade entre 720 e 760 kg/m³.',
        ],
        finalAnswer: 'ρ = 0,74 g/cm³ (740 kg/m³) — compatível com gasolina.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Separar o pó de café com filtro de papel (filtração), ferver água na panela (ebulição) ou observar o gelo derreter (fusão).',
      petrobrasTranspetro:
        'No pré-tratamento e refino do petróleo (PDF p. 109–110), o óleo bruto passa por dessalgação e decantação (separação de água e sais por diferença de densidade) e depois segue para a torre de destilação atmosférica, onde frações como GLP, nafta, querosene e diesel são separadas pelos pontos de ebulição.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'ρ = m / V',
        description: 'Densidade (massa específica): razão entre massa e volume.',
        variables: [
          { symbol: 'ρ', meaning: 'Densidade', unit: 'kg/m³ (SI) ou g/cm³' },
          { symbol: 'm', meaning: 'Massa', unit: 'kg ou g' },
          { symbol: 'V', meaning: 'Volume', unit: 'm³ ou cm³ (1 mL = 1 cm³)' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-atom',
      preset: 'bohr-evolution',
      caption: 'Modelo 3D manipulável: gire e explore o átomo de Bohr (núcleo com prótons/nêutrons e eletrosfera em camadas).',
    },
    step8ExamTraps: [
      'Água + gelo (H₂O sólida + H₂O líquida) é uma SUBSTÂNCIA PURA com 2 fases (sistema heterogêneo), não uma mistura de substâncias!',
      'A destilação fracionada separa misturas homogêneas de líquidos miscíveis com diferentes pontos de ebulição (como frações do petróleo), e NÃO líquidos imiscíveis.',
      'No experimento de Rutherford (lâmina de ouro), a maioria das partículas alfa atravessou sem desviar porque o átomo é majoritariamente espaço vazio, e não porque o núcleo é grande.',
    ],
    step9PracticePrompt:
      'Resolva os exercícios de fixação abaixo sobre separação de misturas, substâncias puras e modelos atômicos antes da avaliação final da etapa.',
    step10SelfExplanationPrompt:
      'Explique com suas próprias palavras: qual a diferença entre substância pura e mistura, e como o modelo atômico de Rutherford corrigiu o modelo de Thomson?',
  },
  {
    id: 'chem-2',
    discipline: 'quimica',
    stageNumber: 2,
    title: 'Átomos e Tabela Periódica',
    subtitle: 'Partículas subatômicas, Z, A, íons, distribuição eletrônica e propriedades periódicas',
    whyNow: 'A posição na Tabela Periódica permite prever o tamanho do átomo, se ele ganha ou perde elétrons e como os elementos se comportam.',
    pdfPages: 'PDF p. 89–90 (Módulo 08: Modelos Atômicos e Classificação Periódica)',
    pdfComparisonNote:
      'Alinhado diretamente com os Mapas 89 (partículas subatômicas) e 90 (Classificação Periódica dos Elementos), adicionando a prática guiada de distribuição eletrônica por subníveis (diagrama de Pauling) e isótopos/isóbaros/isótonos.',
    subtopics: [
      { id: 'q2-particulas', title: 'Prótons, nêutrons e elétrons (Z e A)' },
      { id: 'q2-isotopos', title: 'Isótopos, isóbaros, isótonos e íons' },
      { id: 'q2-distribuicao', title: 'Distribuição eletrônica e camada de valência' },
      { id: 'q2-tabela', title: 'Famílias, períodos e classificação (metais/ametais/gases nobres)' },
      { id: 'q2-propriedades', title: 'Propriedades periódicas (raio, eletronegatividade e EI)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico de Etapa 2: verifique se você já domina número atômico, massa e leitura básica da Tabela Periódica.',
    step2SimpleExplanation: [
      'O átomo tem um centro minúsculo chamado núcleo, onde ficam os prótons (carga +1) e os nêutrons (carga 0). Ao redor gira a eletrosfera com os elétrons (carga -1).',
      'O número de prótons (Z) é o "RG" do elemento: se tem 6 prótons, é sempre Carbono; se tem 26, é sempre Ferro.',
      'Quando um átomo neutro perde elétrons, fica positivo (cátion, como Na⁺). Quando ganha elétrons, fica negativo (ânion, como Cl⁻).',
      'Na Tabela Periódica, as linhas horizontais (períodos) indicam quantas camadas eletrônicas o átomo tem, e as colunas verticais (grupos/famílias) reúnem elementos com comportamento químico parecido.',
    ],
    step3TechnicalConcept: [
      'Número atômico (Z) = nº de prótons (p). Número de massa (A) = prótons + nêutrons (A = Z + N). Em átomo neutro: nº de elétrons (e⁻) = Z.',
      'Isótopos: mesmo Z, diferente A (ex.: ¹²C e ¹⁴C). Isóbaros: mesmo A, diferente Z. Isótonos: mesmo N (nêutrons), diferente Z e A.',
      'Distribuição eletrônica (Diagrama de Linus Pauling): ordem crescente de energia 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶... A camada de valência é a camada mais externa (maior número principal n).',
      'Tendências periódicas (PDF p. 90): Raio atômico cresce de cima para baixo no grupo (mais camadas) e da direita para a esquerda no período (menor carga nuclear efetiva). Eletronegatividade e Energia de Ionização crescem de baixo para cima e da esquerda para a direita (excluindo gases nobres para eletronegatividade).',
    ],
    step4WorkedExamples: [
      {
        title: 'Contagem de partículas em íons e átomos neutros',
        problem: 'Considere o íon Ferro III (²⁶Fe⁵⁶ com carga 3+, ou seja, ⁵⁶₂₆Fe³⁺). Determine prótons, nêutrons e elétrons.',
        steps: [
          '1º passo: O número inferior esquerdo é Z = 26. Portanto, prótons p = 26.',
          '2º passo: O número superior é A = 56. Como A = Z + N, temos N = 56 - 26 = 30 nêutrons.',
          '3º passo: Carga 3+ significa que o átomo neutro (que tinha 26 elétrons) PERDEU 3 elétrons.',
          '4º passo: Logo, e⁻ = 26 - 3 = 23 elétrons.',
        ],
        finalAnswer: '26 prótons, 30 nêutrons e 23 elétrons.',
      },
      {
        title: 'Distribuição eletrônica do Sódio (Z = 11) e posição na tabela',
        problem: 'Faça a distribuição eletrônica do ₁₁Na e indique período, camada de valência e tendência a formar íon.',
        steps: [
          '1º passo: Preencher os subníveis somando 11 elétrons: 1s² 2s² 2p⁶ 3s¹.',
          '2º passo: Camadas: K (n=1) = 2; L (n=2) = 8; M (n=3) = 1. Camada de valência = 3s¹ (1 elétron).',
          '3º passo: Como tem 3 camadas, está no 3º período. Por terminar em s¹, pertence ao Grupo 1 (metal alcalino).',
          '4º passo: Tende a perder esse 1 elétron de valência para ficar com 8 na camada anterior, formando o cátion Na⁺.',
        ],
        finalAnswer: '1s² 2s² 2p⁶ 3s¹ · 3º período · Grupo 1 · forma Na⁺.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'O flúor (halogênio muito eletronegativo) nos cremes dentais e o lítio (metal alcalino leve) nas baterias de celulares.',
      petrobrasTranspetro:
        'Aços para dutos (normas API) combinam ferro (Fe) com carbono (C), manganês (Mn) e nióbio (Nb, grupo 5). Na proteção catódica contra corrosão em tanques e dutos enterrados, usam-se metais com baixa energia de ionização que perdem elétrons facilmente (ânodos de sacrifício de Mg e Zn).',
    },
    step6FormulasAndUnits: [
      {
        expression: 'A = Z + N',
        description: 'Relação fundamental do número de massa nuclear.',
        variables: [
          { symbol: 'A', meaning: 'Número de massa', unit: 'adimensional (inteiro)' },
          { symbol: 'Z', meaning: 'Número atômico (prótons)', unit: 'adimensional (inteiro)' },
          { symbol: 'N', meaning: 'Número de nêutrons', unit: 'adimensional (inteiro)' },
        ],
      },
      {
        expression: 'q = Z - e⁻',
        description: 'Carga líquida do íon (em unidades da carga elementar).',
        variables: [
          { symbol: 'q', meaning: 'Carga iônica (+ cátion, - ânion)', unit: 'carga elementar' },
          { symbol: 'e⁻', meaning: 'Quantidade de elétrons', unit: 'partículas' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-atom',
      preset: 'sodium-ion',
      caption: 'Visualização 3D das camadas eletrônicas — compare a eletrosfera com a Tabela Periódica Interativa na aba dedicada.',
    },
    step8ExamTraps: [
      'Cátion (+) significa que PERDEU elétrons; ânion (-) significa que GANHOU elétrons. Nunca confunda o sinal positivo com ganho de partículas!',
      'Ao retirar elétrons de metais de transição (ex.: Fe → Fe²⁺), retiram-se primeiro os elétrons da camada mais externa (4s), e NÃO do subnível 3d.',
      'Gases nobres (Grupo 18) possuem altíssima energia de ionização e estabilidade, mas em provas de eletronegatividade normalmente não são incluídos no crescimento até o Flúor (F).',
    ],
    step9PracticePrompt:
      'Pratique contagem de partículas, distribuição eletrônica e tendências periódicas. Você também pode treinar na aba Tabela Periódica Interativa (Modo Aprendizagem).',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que o raio atômico aumenta de cima para baixo na família, e por que um átomo ao perder elétrons vira um cátion positivo?',
  },
  {
    id: 'chem-3',
    discipline: 'quimica',
    stageNumber: 3,
    title: 'Ligações Químicas',
    subtitle: 'Ligações iônicas, covalentes e metálicas, octeto, polaridade, geometria e forças intermoleculares',
    whyNow: 'Explica como os átomos se unem para formar sais, moléculas e metais — determinando ponto de ebulição, solubilidade e condutividade.',
    pdfPages: 'PDF p. 91 (Módulo 08: Ligações Químicas)',
    pdfComparisonNote:
      'O Mapa 91 do PDF apresenta ligação iônica, covalente e metálica com propriedades comparativas. A trilha aprofunda também Regra do Octeto, Polaridade, Geometria Molecular e Forças Intermoleculares.',
    subtopics: [
      { id: 'q3-ionica', title: 'Ligação iônica e compostos cristalinos' },
      { id: 'q3-covalente', title: 'Ligação covalente e regra do octeto' },
      { id: 'q3-metalica', title: 'Ligação metálica e propriedades dos metais' },
      { id: 'q3-geometria', title: 'Polaridade e geometria molecular' },
      { id: 'q3-intermoleculares', title: 'Forças intermoleculares (London, dipolo-dipolo, ligação de H)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 3: verifique sua compreensão sobre elétrons de valência e formação de moléculas e cristais.',
    step2SimpleExplanation: [
      'Átomos isolados (exceto gases nobres) costumam ser instáveis e buscam completar a camada de valência (em geral 8 elétrons, ou 2 no caso do H — Regra do Octeto).',
      'Na ligação IÔNICA, um metal doa elétrons e um ametal recebe (como Na + Cl virando Na⁺Cl⁻, o sal de cozinha). Cargas opostas se atraem formando cristais duros.',
      'Na ligação COVALENTE, dois ametais compartilham pares de elétrons porque ambos querem ganhar elétrons (ex.: H₂O, CO₂, CH₄).',
      'Na ligação METÁLICA, átomos de metais liberam elétrons de valência formando um "mar de elétrons" móveis em volta de cátions fixos — é por isso que o cobre e o aço conduzem eletricidade e podem ser moldados em chapas e fios.',
    ],
    step3TechnicalConcept: [
      'Ligação iônica: transferência definitiva de elétrons entre espécies de alta diferença de eletronegatividade (ΔEN elevada, metal + ametal). Forma retículo cristalino iônico; sólidos não conduzem corrente elétrica, mas fundidos ou em solução aquosa conduzem (íons livres).',
      'Ligação covalente: compartilhamento de 1, 2 ou 3 pares de elétrons (simples, dupla, tripla). Polaridade da ligação depende de ΔEN; polaridade da molécula depende do vetor momento dipolar resultante (μ), ligado à geometria molecular (VSEPR): linear (CO₂, apolar), angular (H₂O, polar), trigonal plana (BF₃, apolar), piramidal (NH₃, polar), tetraédrica (CH₄, apolar).',
      'Forças intermoleculares (entre moléculas covalentes): Dipolo induzido / Dispersão de London (todas as moléculas, única em apolares como alcanos do petróleo), Dipolo-dipolo (moléculas polares sem H-F/O/N), Ligação de Hidrogênio (H ligado a F, O ou N — força muito intensa, explica o alto PE da água).',
    ],
    step4WorkedExamples: [
      {
        title: 'Prevendo fórmula iônica entre Cálcio (Grupo 2) e Cloro (Grupo 17)',
        problem: 'Qual é a fórmula do composto formado por Cálcio (Ca) e Cloro (Cl)?',
        steps: [
          '1º passo: Ca está no Grupo 2 (2 elétrons de valência) → tende a perder 2 elétrons, formando Ca²⁺.',
          '2º passo: Cl está no Grupo 17 (7 elétrons de valência) → tende a ganhar 1 elétron, formando Cl⁻.',
          '3º passo: Para a soma das cargas ser zero (+2 + 2×(-1) = 0), precisamos de 2 íons Cl⁻ para cada 1 íon Ca²⁺.',
        ],
        finalAnswer: 'Fórmula: CaCl₂ (cloreto de cálcio, composto iônico).',
      },
      {
        title: 'Por que CO₂ é apolar e H₂O é polar, se ambos têm 3 átomos?',
        problem: 'Compare a geometria e polaridade de CO₂ e H₂O.',
        steps: [
          '1º passo: No CO₂ (O=C=O), o carbono central não possui pares de elétrons livres. Os dois oxigênios ficam a 180° (geometria linear). Os vetores dipolo têm mesma intensidade e sentidos opostos, anulando-se (μ = 0).',
          '2º passo: Na H₂O, o oxigênio central tem 2 pares de elétrons não ligantes que empurram as ligações O–H formando ângulo de ~104,5° (geometria angular). Os vetores não se anulam (μ ≠ 0).',
        ],
        finalAnswer: 'CO₂ é linear e apolar; H₂O é angular e polar (faz ligações de hidrogênio).',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Água e óleo não se misturam porque água é polar (ligações de H) e óleo é apolar (forças de London): "semelhante dissolve semelhante".',
      petrobrasTranspetro:
        'Hidrocarbonetos do petróleo (CH₄, octano C₈H₁₈) são covalentes apolares unidos apenas por forças de London — por isso cadeias maiores têm maior massa molar, mais interações de London e ponto de ebulição mais alto (base da destilação fracionada na torre do Mapa p. 110). Já os sais dissolvidos na água de formação do petróleo (NaCl, CaCl₂) causam corrosão eletroquímica e incrustações nos dutos se não forem removidos na dessalgação.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'μ⃗_resultante = Σ μ⃗_ligação',
        description: 'Soma vetorial dos momentos dipolares determina se a molécula é polar (μ ≠ 0) ou apolar (μ = 0).',
        variables: [
          { symbol: 'μ', meaning: 'Momento dipolar elétrico', unit: 'Debye (D) ou C·m' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-molecule',
      preset: 'h2o-ch4-co2-nacl',
      caption: 'Visualização 3D interativa: compare H₂O (angular), CO₂ (linear), CH₄ (tetraédrica) e rede cristalina de NaCl.',
    },
    step8ExamTraps: [
      'Compostos iônicos conduzem eletricidade quando FUNDIDOS ou DISSOLVIDOS em água, mas NÃO no estado sólido (pois os íons estão presos no retículo).',
      'Não confunda ligação covalente (intramolecular, muito forte, dentro da molécula) com força intermolecular (entre moléculas diferentes, que é rompida na fervura/ebulição).',
      'Água e amônia possuem ligações de H porque H está ligado diretamente a O ou N; o metano (CH₄) tem H, mas ligado a Carbono — logo NÃO faz ligação de hidrogênio!',
    ],
    step9PracticePrompt:
      'Complete os exercícios de fixação identificando o tipo de ligação, geometria e forças intermoleculares.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre ligação iônica, covalente e metálica, e por que compostos iônicos não conduzem corrente quando sólidos?',
  },
  {
    id: 'chem-4',
    discipline: 'quimica',
    stageNumber: 4,
    title: 'Substâncias e Soluções',
    subtitle: 'Ácidos, bases, sais, óxidos, soluções aquosas, dispersões e concentração',
    whyNow: 'Passamos a reconhecer as grandes funções inorgânicas (ácidos, bases, sais, óxidos) e quantificar o quanto de soluto está dissolvido em uma mistura.',
    pdfPages: 'PDF p. 95–96, 99–100, 104–105 (Módulo 08)',
    pdfComparisonNote:
      'Integra 6 mapas do Módulo 08 do PDF: Ácidos e Bases (p. 95), Sais e Óxidos (p. 96), Concentração em Massa/Volume (p. 99), Concentração em Quantidade de Matéria / Molaridade (p. 100), Soluções Aquosas (p. 104) e Dispersões (p. 105).',
    subtopics: [
      { id: 'q4-acidos-bases', title: 'Ácidos, bases e escala de pH' },
      { id: 'q4-sais-oxidos', title: 'Sais, óxidos e reações de neutralização' },
      { id: 'q4-solucoes', title: 'Soluções aquosas, solubilidade e dispersões' },
      { id: 'q4-concentracao', title: 'Concentração comum (g/L), porcentagens e molaridade (mol/L)' },
      { id: 'q4-diluicao', title: 'Diluição de soluções' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 4: teste seu conhecimento sobre pH, funções inorgânicas e cálculos de concentração.',
    step2SimpleExplanation: [
      'Na água, ácidos liberam íons H⁺ (deixam o pH abaixo de 7, como ácido clorídrico HCl e vinagre). Bases liberam íons OH⁻ (deixam o pH acima de 7, como soda cáustica NaOH). Quando um ácido reage com uma base, eles se neutralizam formando Sal + Água.',
      'Óxidos são compostos binários onde o oxigênio é o elemento mais eletronegativo (ex.: CO₂, Fe₂O₃, CaO).',
      'Quando dissolvemos sal (soluto) em água (solvente), formamos uma solução aquosa. Se o tamanho das partículas for menor que 1 nm, é solução verdadeira (não sedimenta, não mostra feixe de luz); entre 1 nm e 1 µm é coloide (apresenta efeito Tyndall); maior que 1 µm é suspensão (areia em água, sedimenta).',
      'Concentração mede quanto soluto há em um certo volume de solução: pode ser em gramas por litro (C = m/V) ou em mols por litro (M = n/V). Na diluição, adicionamos apenas água: a massa de soluto não muda, apenas o volume aumenta e a concentração cai!',
    ],
    step3TechnicalConcept: [
      'Teoria de Arrhenius (PDF p. 95): Ácidos ionizam em água produzindo H⁺ (H₃O⁺); Bases dissociam produzindo OH⁻. Escala de pH a 25 °C: pH < 7 (ácido), pH = 7 (neutro), pH > 7 (básico). Indicadores: fenolftaleína (incolor em meio ácido/neutro, rosa em pH > 8,2) e papel tornassol (vermelho em ácido, azul em base).',
      'Óxidos (PDF p. 96): básicos (formados por metais, reagem com água formando base ou com ácido formando sal + água, ex.: CaO), ácidos (formados por ametais, ex.: CO₂, SO₂), anfóteros (Al₂O₃, ZnO) e neutros (CO, N₂O, NO).',
      'Solubilidade e curvas (PDF p. 104): Insaturada (abaixo do limite), Saturada (no limite, pode ter corpo de fundo em equilíbrio), Supersaturada (instável acima do limite).',
      'Dispersões (PDF p. 105): Solução (< 1 nm, homogênea), Coloide (1 nm – 1 µm, efeito Tyndall, estável), Suspensão (> 1 µm, heterogênea, sedimenta e é retida por filtro comum).',
    ],
    step4WorkedExamples: [
      {
        title: 'Cálculo de Concentração Comum e Molaridade (PDF p. 99–100)',
        problem:
          'Dissolveu-se 11,7 g de NaCl (massa molar Mₘ = 58,5 g/mol) em água suficiente para 250 mL de solução. Calcule a concentração comum (g/L) e a molaridade (mol/L).',
        steps: [
          '1º passo: Converter o volume de mL para Litros: V = 250 mL = 0,250 L.',
          '2º passo: Concentração comum: C = m / V = 11,7 g / 0,250 L = 46,8 g/L.',
          '3º passo: Calcular o número de mols: n = m / Mₘ = 11,7 g / 58,5 g/mol = 0,20 mol.',
          '4º passo: Molaridade: M = n / V = 0,20 mol / 0,250 L = 0,80 mol/L.',
        ],
        finalAnswer: 'C = 46,8 g/L e Molaridade M = 0,80 mol/L.',
      },
      {
        title: 'Diluição de uma solução industrial (PDF p. 99)',
        problem:
          'Temos 500 mL (0,5 L) de uma solução a 40 g/L e adicionamos 500 mL de água pura, dobrando o volume para 1,0 L. Qual a nova concentração?',
        steps: [
          '1º passo: Na diluição, a quantidade de soluto se conserva: C₁ · V₁ = C₂ · V₂.',
          '2º passo: Substituir valores: 40 g/L · 0,5 L = C₂ · 1,0 L.',
          '3º passo: C₂ = 20 / 1,0 = 20 g/L (como o volume dobrou, a concentração caiu pela metade).',
        ],
        finalAnswer: 'Nova concentração C₂ = 20 g/L.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Preparar suco concentrado adicionando água (diluição), usar bicarbonato de sódio (base fraca) para acidez estomacal ou ver um feixe de luz na neblina (efeito Tyndall em coloide).',
      petrobrasTranspetro:
        'O controle rigoroso de pH em torres de destilação, tratamento de efluentes e caldeiras evita corrosão ácida (ex.: HCl gerado por hidrólise de sais no petróleo). Usa-se NaOH (soda cáustica) e CaO (cal virgem) para neutralização ácida e ajuste de pH; emulsões água-óleo em tanques são dispersões coloidais que exigem desemulsificantes antes da transferência por dutos.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'C = m / V',
        description: 'Concentração comum em massa por volume de solução.',
        variables: [
          { symbol: 'C', meaning: 'Concentração comum', unit: 'g/L' },
          { symbol: 'm', meaning: 'Massa do soluto', unit: 'g' },
          { symbol: 'V', meaning: 'Volume da solução', unit: 'L' },
        ],
      },
      {
        expression: 'M = n / V = m / (Mₘ · V)',
        description: 'Concentração em quantidade de matéria (Molaridade).',
        variables: [
          { symbol: 'M', meaning: 'Molaridade', unit: 'mol/L' },
          { symbol: 'n', meaning: 'Quantidade de matéria', unit: 'mol' },
          { symbol: 'Mₘ', meaning: 'Massa molar do soluto', unit: 'g/mol' },
        ],
      },
      {
        expression: 'C₁ · V₁ = C₂ · V₂  |  M₁ · V₁ = M₂ · V₂',
        description: 'Equação de diluição (conservação da massa ou de mols do soluto).',
        variables: [
          { symbol: 'V₁, V₂', meaning: 'Volume inicial e final (após adição de solvente)', unit: 'L ou mL' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'ph-and-dispersions',
      caption: 'Escala de pH (0–14) e comportamento comparativo de Solução, Coloide (Efeito Tyndall) e Suspensão (PDF p. 95 e 105).',
    },
    step8ExamTraps: [
      'Atenção às unidades: para molaridade (mol/L) e concentração comum (g/L), o volume V precisa estar em LITROS! Esquecer de dividir mL por 1.000 é o erro mais comum.',
      'Na fórmula de diluição C₁·V₁ = C₂·V₂, V₂ é o VOLUME FINAL TOTAL (V₁ + V_água adicionada), e NÃO apenas o volume de água adicionado!',
      'Nem todo óxido é básico: óxidos de ametais (CO₂, SO₃) são ácidos e produzem chuvas/soluções ácidas ao reagir com água.',
    ],
    step9PracticePrompt:
      'Teste seus conhecimentos de pH, classificação de dispersões, óxidos e cálculos de diluição.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: o que muda e o que permanece constante quando diluímos uma solução, e como diferenciar uma solução verdadeira de um coloide?',
  },
  {
    id: 'chem-5',
    discipline: 'quimica',
    stageNumber: 5,
    title: 'Reações Químicas',
    subtitle: 'Reagentes, produtos, equações químicas, classificação, balanceamento e Lei de Lavoisier',
    whyNow: 'Antes de fazer qualquer cálculo estequiométrico, precisamos saber representar a transformação química corretamente e balancear os átomos.',
    pdfPages: 'PDF p. 92 e 101 (Módulo 08: Transformações Químicas e Equação Balanceada)',
    pdfComparisonNote:
      'Baseado diretamente nos Mapas 101 (Transformações Químicas, evidências e Conservação da Massa) e 92 (Equação Balanceada).',
    subtopics: [
      { id: 'q5-transformacoes', title: 'Reagentes, produtos e evidências de reação' },
      { id: 'q5-classificacao', title: 'Classificação das reações (síntese, decomposição, simples e dupla troca)' },
      { id: 'q5-lavoisier', title: 'Lei de conservação das massas (Lavoisier)' },
      { id: 'q5-balanceamento', title: 'Balanceamento de equações químicas (tentativas)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 5: verifique se você diferencia mudança física de química e sabe contar átomos em fórmulas.',
    step2SimpleExplanation: [
      'Uma reação química acontece quando substâncias iniciais (reagentes) se reorganizam formando novas substâncias com propriedades diferentes (produtos). Sinais comuns são: mudança de cor, formação de gás (bolhas), precipitado sólido, liberação de calor/luz ou novo cheiro.',
      'Pela Lei de Lavoisier ("na natureza nada se cria, nada se perde, tudo se transforma"), em sistema fechado a massa total antes e depois da reação é exatamente igual, porque os átomos não desaparecem — apenas trocam de parceiros!',
      'Balancear uma equação é colocar números na frente das fórmulas (coeficientes estequiométricos) para garantir a mesma quantidade de cada átomo nos dois lados, sem NUNCA mexer nos números pequenos de baixo (índices da fórmula).',
    ],
    step3TechnicalConcept: [
      'Notação da equação química (PDF p. 101): reagentes à esquerda → produtos à direita; estados físicos (s) sólido, (l) líquido, (g) gasoso, (aq) aquoso; ⇄ indica reação reversível.',
      'Tipos clássicos de reação: Síntese/Adição (A + B → AB, ex.: 2 H₂ + O₂ → 2 H₂O); Análise/Decomposição (AB → A + B, ex.: CaCO₃ → CaO + CO₂); Simples Troca/Deslocamento (A + BC → AC + B, ex.: Zn + CuSO₄ → ZnSO₄ + Cu); Dupla Troca (AB + CD → AD + CB, ex.: AgNO₃ + NaCl → AgCl↓ + NaNO₃).',
      'Regra prática de balanceamento por tentativas (MACHO): balanceie primeiro Metais, depois Ametais, depois Carbono, Hidrogênio e por último Oxigênio.',
    ],
    step4WorkedExamples: [
      {
        title: 'Balanceando a combustão completa do propano (GLP)',
        problem: 'Balanceie a equação da queima do propano: C₃H₈ + O₂ → CO₂ + H₂O.',
        steps: [
          '1º passo (Carbono): Há 3 carbonos à esquerda (C₃H₈). Colocamos coeficiente 3 antes do CO₂: C₃H₈ + O₂ → 3 CO₂ + H₂O.',
          '2º passo (Hidrogênio): Há 8 hidrogênios à esquerda. Como cada H₂O tem 2 H, colocamos 4 antes da H₂O: C₃H₈ + O₂ → 3 CO₂ + 4 H₂O.',
          '3º passo (Oxigênio): Contamos os O à direita: (3 × 2) + (4 × 1) = 6 + 4 = 10 átomos de O.',
          '4º passo: Como cada O₂ tem 2 átomos, colocamos 10 ÷ 2 = 5 antes do O₂.',
        ],
        finalAnswer: '1 C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
      },
      {
        title: 'Verificando a Lei de Conservação da Massa (PDF p. 101)',
        problem:
          'Na reação AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq), reagiram exatamente 170 g de AgNO₃ com 58,5 g de NaCl, formando 143,5 g de precipitado AgCl. Qual a massa de NaNO₃ formada?',
        steps: [
          '1º passo: Massa total dos reagentes = 170 g + 58,5 g = 228,5 g.',
          '2º passo: Pela Lei de Lavoisier, massa total dos produtos = 228,5 g.',
          '3º passo: Massa de NaNO₃ = 228,5 g - 143,5 g = 85,0 g.',
        ],
        finalAnswer: 'Foram formados 85,0 g de NaNO₃.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Ferrugem em portões (oxidação do ferro), bicarbonato com vinagre soltando bolhas de CO₂ e queima do gás de cozinha.',
      petrobrasTranspetro:
        'Combustão controlada em fornos de pré-aquecimento das refinarias (PDF p. 110), neutralização de efluentes ácidos com bases e remoção de contaminantes por precipitação química dependem de equações perfeitamente balanceadas para dosagem exata.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'Σ m_reagentes = Σ m_produtos (sistema fechado)',
        description: 'Lei de Conservação das Massas (Lavoisier).',
        variables: [
          { symbol: 'm', meaning: 'Massa das substâncias envolvidas', unit: 'g ou kg' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'balanced-reaction',
      caption: 'Conservação de átomos na reação balanceada 2 H₂ + O₂ → 2 H₂O (PDF p. 92).',
    },
    step8ExamTraps: [
      'NUNCA altere o índice subscrito de uma fórmula para balancear (ex.: transformar H₂O em H₂O₂ muda a substância de água para água oxigenada!). Altere somente o coeficiente à esquerda.',
      'Se uma reação libera gás em um recipiente ABERTO (como queimar carvão ou efervescer um comprimido), a massa medida na balança diminui porque o gás escapou para o ar — isso NÃO viola a Lei de Lavoisier!',
    ],
    step9PracticePrompt:
      'Pratique balanceamento de equações químicas e classificação das reações nos exercícios de fixação.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que não podemos mudar os números pequenos (subscritos) das fórmulas químicas ao balancear uma equação?',
  },
  {
    id: 'chem-6',
    discipline: 'quimica',
    stageNumber: 6,
    title: 'Cálculos Químicos e Gases',
    subtitle: 'Mol, massa molar, Avogadro, estequiometria, reagente limitante, rendimento, pureza e gases',
    whyNow: 'Temas que exigem domínio de proporções, conversões de unidades e equações químicas já balanceadas.',
    pdfPages: 'PDF p. 92–93 e 100 (Módulo 08: Cálculo Estequiométrico e Estudo dos Gases)',
    pdfComparisonNote:
      'Integra os Mapas 92 (Estequiometria e Reagente Limitante), 100 (Mol e Massa Molar) e 93 (Estudo dos Gases, Boyle, Charles, Gay-Lussac e PV=nRT). A trilha inclui também cálculos de Pureza e Rendimento, frequentes em provas da CESGRANRIO.',
    subtopics: [
      { id: 'q6-mol', title: 'Mol, massa molar e Número de Avogadro' },
      { id: 'q6-estequiometria', title: 'Estequiometria e proporção molar' },
      { id: 'q6-limitante', title: 'Reagente limitante, pureza e rendimento' },
      { id: 'q6-gases', title: 'Estudo dos gases e Equação Geral (PV = nRT)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 6: avalie sua habilidade com proporções, conversão massa-mol e variáveis de gases.',
    step2SimpleExplanation: [
      'Como átomos e moléculas são minúsculos demais para contar um a um, os químicos usam um "pacote" padrão chamado MOL. Assim como 1 dúzia tem 12 unidades, 1 mol tem 6,022 × 10²³ partículas (Número de Avogadro).',
      'A massa molar (Mₘ, em g/mol) diz quanto pesa 1 mol da substância. Por exemplo, H₂O tem massa molar 18 g/mol (2×1 + 16).',
      'Na estequiometria, os coeficientes da equação balanceada são uma "receita em mols". Se colocarmos ingredientes fora da proporção, um deles acaba primeiro (reagente limitante) e trava a produção; o outro sobra (excesso).',
      'Para gases, pressão (P), volume (V), temperatura absoluta em Kelvin (T) e mols (n) obedecem à equação PV = nRT.',
    ],
    step3TechnicalConcept: [
      'Relação massa-mol: n = m / Mₘ. Constante de Avogadro: N_A ≈ 6,022 × 10²³ mol⁻¹.',
      'Passo a passo estequiométrico (PDF p. 92): (1) Balancear a equação; (2) Converter massas dadas em mols (descontando % de pureza, se houver); (3) Identificar reagente limitante dividindo n pela respectiva proporção estequiométrica; (4) Calcular mols de produto pela proporção; (5) Aplicar % de rendimento real/teórico e converter para a unidade pedida.',
      'Gases Ideais (PDF p. 93): Transformações com n constante: P₁V₁/T₁ = P₂V₂/T₂. Isotérmica (Boyle, T cte): P₁V₁ = P₂V₂; Isobárica (Charles, P cte): V₁/T₁ = V₂/T₂; Isocórica (Gay-Lussac, V cte): P₁/T₁ = P₂/T₂. Equação de Clapeyron: PV = nRT, com T obrigatoriamente em Kelvin: T(K) = T(°C) + 273,15 (ou +273 em provas).',
    ],
    step4WorkedExamples: [
      {
        title: 'Estequiometria com reagente limitante (PDF p. 92)',
        problem:
          'Misturamos 4 g de H₂ (Mₘ = 2 g/mol) com 40 g de O₂ (Mₘ = 32 g/mol) para formar água (2 H₂ + O₂ → 2 H₂O). Qual o reagente limitante e qual a massa de água produzida?',
        steps: [
          '1º passo: Converter massas em mols: n(H₂) = 4 / 2 = 2 mol; n(O₂) = 40 / 32 = 1,25 mol.',
          '2º passo: A receita pede 2 mol de H₂ para cada 1 mol de O₂. Para 2 mol de H₂, precisamos de apenas 1 mol de O₂.',
          '3º passo: Como temos 1,25 mol de O₂, o O₂ está em EXCESSO (sobra 0,25 mol) e o H₂ é o REAGENTE LIMITANTE.',
          '4º passo: Pela proporção 2 H₂ : 2 H₂O (1:1), 2 mol de H₂ formam 2 mol de H₂O.',
          '5º passo: Converter mol de H₂O em massa (Mₘ = 18 g/mol): m = 2 mol × 18 g/mol = 36 g.',
        ],
        finalAnswer: 'Limitante: H₂ · Excesso: 0,25 mol (8 g) de O₂ · Produto: 36 g de H₂O.',
      },
      {
        title: 'Aplicando PV = nRT em cilindro de gás',
        problem:
          'Um cilindro de 0,041 m³ (41 L) contém 5 mols de gás nitrogênio a 27 °C. Considerando R = 0,082 atm·L/(mol·K), qual a pressão em atm?',
        steps: [
          '1º passo: Converter temperatura para Kelvin: T = 27 + 273 = 300 K.',
          '2º passo: Usar V em litros (41 L) para compatibilizar com R = 0,082 atm·L/(mol·K).',
          '3º passo: P = (n · R · T) / V = (5 × 0,082 × 300) / 41.',
          '4º passo: Numerador: 5 × 24,6 = 123. Dividindo por 41: P = 3,0 atm.',
        ],
        finalAnswer: 'Pressão no cilindro: P = 3,0 atm.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Aumentar a pressão da calibragem de um pneu quando ele esquenta após rodar no asfalto (Lei de Gay-Lussac: volume quase constante, temperatura sobe → pressão sobe).',
      petrobrasTranspetro:
        'Na movimentação de gás natural (GN) e GLP em gasodutos e esferas pressurizadas, correções de volume de gás entre condições operacionais e condições padrão (CNTP/20 °C, 1 atm) usam P₁V₁/T₁ = P₂V₂/T₂. Na dessulfurização (remoção de H₂S), calcula-se estequiometricamente a quantidade exata de H₂ ou reagente sequestrante.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'n = m / Mₘ = N / N_A',
        description: 'Conversão entre massa, número de partículas e mols.',
        variables: [
          { symbol: 'n', meaning: 'Quantidade de matéria', unit: 'mol' },
          { symbol: 'm', meaning: 'Massa', unit: 'g' },
          { symbol: 'Mₘ', meaning: 'Massa molar', unit: 'g/mol' },
          { symbol: 'N_A', meaning: '6,022 × 10²³', unit: 'mol⁻¹' },
        ],
      },
      {
        expression: 'P · V = n · R · T',
        description: 'Equação geral dos gases ideais (Clapeyron).',
        variables: [
          { symbol: 'P', meaning: 'Pressão absoluta', unit: 'Pa (SI) ou atm' },
          { symbol: 'V', meaning: 'Volume', unit: 'm³ (SI) ou L' },
          { symbol: 'R', meaning: '8,314 J/(mol·K) ou 0,082 atm·L/(mol·K)', unit: 'constante' },
          { symbol: 'T', meaning: 'Temperatura absoluta', unit: 'K (sempre Kelvin!)' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'stoichiometry-gas-laws',
      caption: 'Fluxograma estequiométrico (PDF p. 92) e curvas P×V / V×T das leis dos gases (PDF p. 93).',
    },
    step8ExamTraps: [
      'NUNCA use temperatura em °C nas leis dos gases ou em PV = nRT! Se a temperatura dobra de 20 °C para 40 °C, a temperatura absoluta em Kelvin NÃO dobrou (foi de 293 K para 313 K).',
      'Em cálculos de pureza, só a fração PURA do reagente reage (multiplique a massa pela fração de pureza antes de calcular os mols).',
      'O rendimento (< 100%) reduz a massa de PRODUTO realmente obtida em relação ao cálculo teórico.',
    ],
    step9PracticePrompt:
      'Pratique cálculo de mol, estequiometria com reagente limitante/pureza e transformação gasosa.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: como identificar quem é o reagente limitante em uma reação e por que a temperatura em cálculos de gases deve sempre estar em Kelvin?',
  },
  {
    id: 'chem-7',
    discipline: 'quimica',
    stageNumber: 7,
    title: 'Energia e Equilíbrio',
    subtitle: 'Termoquímica, entalpia, oxidação-redução (NOX), equilíbrio químico e Le Chatelier',
    whyNow: 'Assuntos mais abstratos que conectam energia das reações, transferência de elétrons e reações reversíveis após dominar estequiometria.',
    pdfPages: 'PDF p. 94, 102–103 (Módulo 08: Oxidação/Redução, Equilíbrio Químico e Termoquímica)',
    pdfComparisonNote:
      'Reúne os Mapas 103 (Termoquímica e Lei de Hess), 94 (Oxidação e Redução / NOX) e 102 (Equilíbrio Químico e Princípio de Le Chatelier).',
    subtopics: [
      { id: 'q7-termoquimica', title: 'Termoquímica, entalpia (ΔH) e Lei de Hess' },
      { id: 'q7-redox', title: 'Oxidação, redução e número de oxidação (NOX)' },
      { id: 'q7-equilibrio', title: 'Equilíbrio químico (v_d = v_i)' },
      { id: 'q7-lechatelier', title: 'Princípio de Le Chatelier' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 7: avalie seu entendimento sobre calor de reação, perda/ganho de elétrons e reversibilidade.',
    step2SimpleExplanation: [
      'Toda reação química troca energia com o ambiente. Se libera calor e esquenta o meio (como queima de combustível), é EXOTÉRMICA (ΔH < 0). Se absorve calor e esfria o meio (como bolsa térmica fria ou craqueamento térmico), é ENDOTÉRMICA (ΔH > 0).',
      'Nas reações de oxidação-redução (redox), um átomo perde elétrons (oxida, seu NOX sobe) e outro ganha elétrons (reduz, seu NOX desce). É exatamente o que ocorre na corrosão de um duto de aço e dentro de pilhas e baterias.',
      'Muitas reações são reversíveis: acontecem nos dois sentidos ao mesmo tempo. Quando a velocidade da reação direta fica igual à da inversa (v_d = v_i), atinge-se o Equilíbrio Químico — as concentrações ficam constantes, embora a reação continue nos dois sentidos.',
      'Pelo Princípio de Le Chatelier, se você perturbar um equilíbrio (mexendo em concentração, pressão ou temperatura), o sistema "se defende" deslocando-se para o lado que minimiza aquela perturbação.',
    ],
    step3TechnicalConcept: [
      'Entalpia (H): ΔH = H_produtos - H_reagentes. Exotérmica: ΔH < 0 (produtos têm menor entalpia). Endotérmica: ΔH > 0. Lei de Hess (PDF p. 103): ΔH depende apenas dos estados inicial e final, não do caminho.',
      'Regras de NOX (PDF p. 94): substância simples = 0; íon monoatômico = sua carga; O geralmente -2; H geralmente +1; soma dos NOX em espécie neutra = 0. Agente redutor é quem sofre oxidação (doa e⁻); agente oxidante é quem sofre redução (recebe e⁻).',
      'Equilíbrio Químico e Le Chatelier (PDF p. 102): (1) Aumentar concentração de um componente desloca para o lado oposto; (2) Aumentar pressão (diminuir volume) em gases desloca para o lado com MENOR nº de mols gasosos; (3) Aumentar temperatura favorece a reação ENDOTÉRMICA (ΔH > 0); (4) Catalisador acelera v_d e v_i igualmente, atingindo o equilíbrio mais rápido, mas NÃO desloca o equilíbrio!',
    ],
    step4WorkedExamples: [
      {
        title: 'Identificando oxidação e redução na reação Zn + CuSO₄ (PDF p. 94)',
        problem: 'Na reação Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), quem oxida, quem reduz e quem é o agente oxidante?',
        steps: [
          '1º passo: Determinar os NOX: Zn(s) = 0 → Zn²⁺ = +2 (NOX aumentou → perdeu 2 elétrons → OXIDOU).',
          '2º passo: Cu²⁺ = +2 → Cu(s) = 0 (NOX diminuiu → ganhou 2 elétrons → REDUZIU).',
          '3º passo: Quem sofre oxidação provoca a redução do outro, sendo o Agente Redutor (Zn). Quem sofre redução provoca a oxidação do outro, sendo o Agente Oxidante (Cu²⁺).',
        ],
        finalAnswer: 'Zn oxida (agente redutor); Cu²⁺ reduz (agente oxidante).',
      },
      {
        title: 'Deslocamento de equilíbrio na síntese da amônia (PDF p. 102)',
        problem: 'Considere N₂(g) + 3 H₂(g) ⇄ 2 NH₃(g) com ΔH < 0 (exotérmica). Para onde o equilíbrio se desloca se aumentarmos a pressão e se aumentarmos a temperatura?',
        steps: [
          '1º passo (Pressão): Contar mols gasosos. Reagentes: 1 + 3 = 4 mols; Produtos: 2 mols. Aumentar pressão desloca para o lado com MENOR nº de mols → Direita (forma mais NH₃).',
          '2º passo (Temperatura): A reação direta é exotérmica (ΔH < 0), logo a inversa é endotérmica. Aumentar a temperatura favorece o sentido endotérmico → Esquerda (consome NH₃).',
        ],
        finalAnswer: 'Maior pressão → direita; maior temperatura → esquerda.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Combustão do gás natural no fogão (exotérmica), ferrugem no ferro exposto à umidade (oxidação) e gás dissolvido no refrigerante sob pressão (equilíbrio de CO₂).',
      petrobrasTranspetro:
        'A corrosão eletroquímica de tanques e dutos metálicos é uma reação redox indesejada (oxidação do Fe a Fe₂O₃); a proteção catódica força um metal mais reativo (Mg/Zn) ou corrente impressa a atuar como ânodo. No refino (reforma catalítica, hidrogenação e síntese de amônia), pressão e temperatura são controladas via Le Chatelier e catalisadores reduzem o tempo de reação.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'ΔH = Σ H_produtos - Σ H_reagentes',
        description: 'Variação de entalpia da reação (Lei de Hess).',
        variables: [
          { symbol: 'ΔH', meaning: 'Entalpia de reação (<0 exo, >0 endo)', unit: 'kJ ou kJ/mol' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'enthalpy-redox-equilibrium',
      caption: 'Diagramas de energia exo/endotérmico (PDF p. 103), transferência de elétrons redox (p. 94) e Le Chatelier (p. 102).',
    },
    step8ExamTraps: [
      'Agente OXIDANTE é a espécie que SOFRE REDUÇÃO (não a que oxida!). Os nomes são inversos porque se referem ao efeito causado no outro reagente.',
      'Adicionar um CATALISADOR ou um gás inerte (a volume constante) NÃO desloca o equilíbrio químico e NÃO altera o rendimento final de equilíbrio — catalisador apenas reduz a energia de ativação e chega ao equilíbrio mais depressa.',
      'Em equilíbrio, as concentrações dos reagentes e produtos ficam CONSTANTES, mas NÃO necessariamente iguais entre si!',
    ],
    step9PracticePrompt:
      'Resolva questões de NOX, termoquímica (ΔH) e deslocamento de equilíbrio estilo CESGRANRIO.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que o catalisador não desloca o equilíbrio químico, e qual a diferença entre processo exotérmico e endotérmico?',
  },
  {
    id: 'chem-8',
    discipline: 'quimica',
    stageNumber: 8,
    title: 'Química Orgânica',
    subtitle: 'Hidrocarbonetos (alcanos, alcenos, alcinos, aromáticos), funções orgânicas, polímeros e petróleo',
    whyNow: 'Fecha a trilha de Química aplicando todo o conhecimento de ligações do carbono aos combustíveis, polímeros e refino de petróleo.',
    pdfPages: 'PDF p. 97–98 e 110–111 (Módulos 08 e 09: Hidrocarbonetos, Polímeros e Refino de Petróleo)',
    pdfComparisonNote:
      'Integra os Mapas 97 (Hidrocarbonetos e relação com o petróleo) e 98 (Polímeros) aos Mapas 110–111 (Refino de Petróleo: Destilação, Craqueamento, Reforma, Hidrotratamento e Dessulfurização). Inclui também revisão das principais funções orgânicas.',
    subtopics: [
      { id: 'q8-hidrocarbonetos', title: 'Hidrocarbonetos: alcanos, alcenos, alcinos e aromáticos' },
      { id: 'q8-funcoes', title: 'Principais funções orgânicas oxigenadas e nitrogenadas' },
      { id: 'q8-polimeros', title: 'Polímeros: adição, condensação, termoplásticos, termofixos e elastômeros' },
      { id: 'q8-petroleo', title: 'Aplicações industriais e refino de petróleo' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 8: verifique o que você conhece sobre cadeias de carbono, funções orgânicas e frações do petróleo.',
    step2SimpleExplanation: [
      'O carbono é tetravalente (faz 4 ligações covalentes) e consegue formar longas cadeias, anéis e ligações duplas ou triplas.',
      'Hidrocarbonetos têm APENAS Carbono e Hidrogênio. São o principal ingrediente do petróleo e do gás natural! Alcanos só têm ligações simples (saturados, ex.: metano CH₄, propano C₃H₈, octano C₈H₁₈); alcenos têm ligação dupla (C=C, ex.: eteno C₂H₄); alcinos têm ligação tripla (C≡C, ex.: etino); aromáticos têm o anel benzênico (ex.: benzeno C₆H₆, tolueno).',
      'Polímeros são macromoléculas feitas pela repetição de moléculas pequenas (monômeros), como juntar vários elos de uma corrente: o eteno forma o polietileno (PE) de tubos e embalagens.',
      'Os plásticos que amolecem com calor e podem ser reciclados são Termoplásticos (PE, PP, PVC); os que NÃO amolecem após a cura são Termofixos (resina epóxi, baquelite); os elásticos de vedação são Elastômeros (borracha, silicone).',
    ],
    step3TechnicalConcept: [
      'Séries de hidrocarbonetos (PDF p. 97): Alcanos (CₙH₂ₙ₊₂, ligações σ, saturados), Alcenos (CₙH₂ₙ, 1 ligação dupla = 1σ + 1π, insaturados), Alcinos (CₙH₂ₙ₋₂, 1 tripla = 1σ + 2π), Aromáticos (anel benzênico com ressonância/elétrons π deslocalizados).',
      'Principais funções orgânicas: Álcool (–OH ligado a C saturado, ex.: etanol), Fenol (–OH ligado a anel aromático), Aldeído (–CHO), Cetona (C=O entre carbonos), Ácido carboxílico (–COOH), Éster (–COO–), Éter (–O–), Amina (derivada de NH₃), Amida (–CONH₂).',
      'Polimerização (PDF p. 98): Por adição (monômeros insaturados abrem a dupla ligação sem formar subproduto, ex.: eteno → PE) e por condensação (monômeros com grupos funcionais reagem eliminando molécula pequena como H₂O, ex.: Nylon).',
      'Refino do Petróleo (PDF p. 110–111): Destilação atmosférica (separa por ponto de ebulição: C₁–C₄ GLP no topo, C₅–C₁₀ Nafta/Gasolina, C₁₀–C₁₆ Querosene, C₁₄–C₂₀ Diesel, >C₂₀ Resíduo para destilação a vácuo). Craqueamento/FCC (quebra moléculas pesadas em leves de maior valor); Reforma catalítica (aumenta octanagem da gasolina); Hidrotratamento/Dessulfurização (remove S, N, O e metais).',
    ],
    step4WorkedExamples: [
      {
        title: 'Classificando fórmula molecular de hidrocarbonetos (PDF p. 97)',
        problem: 'Classifique os hidrocarbonetos C₄H₁₀, C₃H₆ e C₂H₂ e dê seus nomes.',
        steps: [
          '1º passo: C₄H₁₀ segue CₙH₂ₙ₊₂ (2×4 + 2 = 10) → é um ALCANO saturado de 4 carbonos: butano (componente do GLP).',
          '2º passo: C₃H₆ segue CₙH₂ₙ (2×3 = 6) → pode ser ALCENOS (propeno, com 1 dupla) ou cicloalcano (ciclopropano). Na série aberta, é o propeno.',
          '3º passo: C₂H₂ segue CₙH₂ₙ₋₂ (2×2 - 2 = 2) → é um ALCINO de 2 carbonos: etino (acetileno, usado em solda).',
        ],
        finalAnswer: 'C₄H₁₀ = butano (alcano); C₃H₆ = propeno (alceno); C₂H₂ = etino (alcino).',
      },
      {
        title: 'Relação entre cadeia carbônica e ponto de ebulição na torre de destilação',
        problem: 'Por que o GLP (C₃–C₄) sai no topo da torre (< 30 °C) enquanto o Diesel (C₁₄–C₂₀) sai bem mais abaixo (250–350 °C)?',
        steps: [
          '1º passo: Todos são hidrocarbonetos apolares mantidos unidos no líquido por forças intermoleculares de dispersão de London.',
          '2º passo: Quanto maior a cadeia carbônica e a massa molar, maior a superfície de contato e mais intensas são as forças de London.',
          '3º passo: Logo, moléculas maiores (Diesel) exigem muito mais energia térmica para passar ao estado gasoso (maior ponto de ebulição), condensando nas bandejas mais baixas e quentes da torre.',
        ],
        finalAnswer: 'Cadeia maior → maior massa molar → forças de London mais fortes → maior ponto de ebulição.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Gasolina, gás de cozinha (GLP = propano + butano), álcool hidratado (etanol) e tubos de PVC ou juntas de borracha.',
      petrobrasTranspetro:
        'Todo o negócio da Transpetro e Petrobras gira em torno de hidrocarbonetos e derivados: transporte de óleo cru, GLP, nafta petroquímica, QAV (querosene de aviação) e diesel S-10 (baixo enxofre obtido por hidrodessulfurização). Polímeros são aplicados em dutos de PEAD, revestimentos anticorrosivos de epóxi (termofixo) e selos/O-rings de elastômeros.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'Alcanos: CₙH₂ₙ₊₂  |  Alcenos: CₙH₂ₙ  |  Alcinos: CₙH₂ₙ₋₂',
        description: 'Fórmulas gerais dos hidrocarbonetos de cadeia aberta (acíclicos).',
        variables: [
          { symbol: 'n', meaning: 'Número de átomos de carbono na cadeia', unit: 'inteiro ≥ 1 (≥ 2 p/ alcenos/alcinos)' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-molecule',
      preset: 'hydrocarbons-benzene',
      caption: 'Visualização 3D de hidrocarbonetos (Metano CH₄ tetraédrico e Etano/Eteno) e frações da torre de destilação.',
    },
    step8ExamTraps: [
      'Cuidado: alcenos acíclicos e cicloalcanos possuem a MESMA fórmula geral (CₙH₂ₙ)! Por exemplo, C₃H₆ pode ser propeno (insaturado) ou ciclopropano (saturado fechado).',
      'Polímeros termofixos (ex.: resina epóxi, baquelite) NÃO derretem ao aquecer novamente — eles degradam/carbonizam e NÃO são recicláveis por refundição como os termoplásticos.',
      'Na torre de destilação atmosférica (PDF p. 110), o topo é mais FRIO (onde saem os gases leves) e o fundo é mais QUENTE (onde fica o resíduo atmosférico pesado).',
    ],
    step9PracticePrompt:
      'Pratique hidrocarbonetos, funções orgânicas, polímeros e processos de refino antes da avaliação final.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que frações mais pesadas do petróleo têm ponto de ebulição maior e qual a diferença prática entre um polímero termoplástico e um termofixo?',
  },
];
