import { StageContent } from '../types';

export const PHYSICS_TRACK: StageContent[] = [
  {
    id: 'phys-1',
    discipline: 'fisica',
    stageNumber: 1,
    title: 'Linguagem da Física',
    subtitle: 'Grandezas físicas, SI, conversão de unidades, escalares vs vetores, notação científica e ordem de grandeza',
    whyNow: 'Antes de estudar movimento ou forças, precisamos saber exatamente o que está sendo medido, em qual unidade padrão e se tem direção/sentido.',
    pdfPages: 'PDF p. 43, 54 e 60 (Módulos 03 e 04: Metrologia, Sistema Internacional e Vetores)',
    pdfComparisonNote:
      'No PDF, Sistema Internacional de Unidades (p. 54) e Metrologia (p. 43) aparecem no Módulo 03 (Instrumentação), enquanto Vetores aparece em Estática (p. 60). Aqui consolidamos tudo na Etapa 1 como alicerce obrigatório da Física.',
    subtopics: [
      { id: 'f1-grandezas', title: 'Grandezas físicas e unidades do SI' },
      { id: 'f1-conversao', title: 'Conversão de unidades e prefixos (k, M, m, μ)' },
      { id: 'f1-vetores', title: 'Grandezas escalares e grandezas vetoriais' },
      { id: 'f1-notacao', title: 'Notação científica e ordem de grandeza' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 1: verifique seu domínio em unidades do SI, prefixos métricos, notação científica e diferença entre escalar e vetor.',
    step2SimpleExplanation: [
      'Grandeza física é tudo o que pode ser medido e comparado com um padrão: comprimento, massa, tempo, temperatura, pressão, vazão.',
      'Para evitar confusões no mundo inteiro, usa-se o Sistema Internacional (SI): metro (m), quilograma (kg), segundo (s), ampere (A), kelvin (K), mol (mol) e candela (cd).',
      'Algumas grandezas ficam totalmente descritas apenas com um número e uma unidade — são as ESCALARES (ex.: massa = 50 kg, temperatura = 300 K, tempo = 10 s). Outras precisam também de direção e sentido para fazer sentido — são as VETORIAIS (ex.: força de 100 N para cima, velocidade de 80 km/h para o norte).',
      'Para escrever números gigantes ou minúsculos sem errar zeros, usamos Notação Científica (a × 10ⁿ, com 1 ≤ a < 10).',
    ],
    step3TechnicalConcept: [
      'As 7 unidades de base do SI (PDF p. 54): Comprimento (m), Massa (kg), Tempo (s), Corrente elétrica (A), Temperatura termodinâmica (K), Quantidade de matéria (mol), Intensidade luminosa (cd). Unidades derivadas importantes: força (N = kg·m/s²), pressão (Pa = N/m²), energia/trabalho (J = N·m), potência (W = J/s), frequência (Hz = 1/s).',
      'Prefixos do SI (PDF p. 54): Tera (T = 10¹²), Giga (G = 10⁹), Mega (M = 10⁶), Quilo (k = 10³), Mili (m = 10⁻³), Micro (μ = 10⁻⁶), Nano (n = 10⁻⁹).',
      'Conversões práticas em dutos e terminais (PDF p. 54): 1 km = 1.000 m; 1 m³ = 1.000 L; 1 h = 3.600 s; para velocidade: m/s × 3,6 = km/h (e km/h ÷ 3,6 = m/s); para pressão: 1 bar = 100.000 Pa = 10⁵ Pa; 1 MPa = 10 bar; 1 atm = 101.325 Pa.',
      'Ordem de grandeza: potência de 10 mais próxima do valor em notação científica (ponto de corte tradicional √10 ≈ 3,16: se a < 3,16, mantém 10ⁿ; se a ≥ 3,16, arredonda para 10ⁿ⁺¹).',
    ],
    step4WorkedExamples: [
      {
        title: 'Conversão de pressão e vazão em um oleoduto (PDF p. 54)',
        problem:
          'Um duto opera a 5 MPa de pressão com vazão de 1.080 m³/h. Expresse a pressão em bar e a vazão em L/s.',
        steps: [
          '1º passo (Pressão): 1 MPa = 10⁶ Pa = 10 bar (pois 1 bar = 10⁵ Pa). Logo, 5 MPa = 5 × 10 = 50 bar.',
          '2º passo (Vazão): Converter m³ para Litros (1 m³ = 1.000 L) e horas para segundos (1 h = 3.600 s).',
          '3º passo: Q = (1.080 × 1.000 L) / 3.600 s = 1.080.000 / 3.600 = 300 L/s.',
        ],
        finalAnswer: 'Pressão = 50 bar · Vazão = 300 L/s.',
      },
      {
        title: 'Soma vetorial de duas forças perpendiculares',
        problem: 'Duas forças perpendiculares (90° entre si) de 6 N e 8 N atuam sobre um bloco. Qual o módulo da força resultante?',
        steps: [
          '1º passo: Como são vetores a 90°, não somamos simplesmente 6 + 8 = 14! Aplicamos o Teorema de Pitágoras.',
          '2º passo: R² = 6² + 8² = 36 + 64 = 100.',
          '3º passo: R = √100 = 10 N.',
        ],
        finalAnswer: 'Módulo da força resultante = 10 N.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Ler velocidade no velocímetro (km/h), potência do chuveiro (W) e capacidade da caixa d’água (L ou m³).',
      petrobrasTranspetro:
        'Em projetos e operação da Transpetro (PDF p. 43 e 54), o mesmo duto usa polegadas para diâmetro nominal (DN 300 ≈ 12 in), bar ou kgf/cm² para pressão em campo, Pa para cálculos de perda de carga no SI, e m³/h ou bbl/d (barris por dia) para vazão de transferência. Erros de conversão geram falhas operacionais graves.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'v(km/h) = v(m/s) × 3,6',
        description: 'Conversão direta de velocidade entre SI (m/s) e uso comum (km/h).',
        variables: [
          { symbol: 'v', meaning: 'Velocidade', unit: 'm/s (SI) ou km/h' },
        ],
      },
      {
        expression: '1 m³ = 1.000 L  |  1 bar = 10⁵ Pa',
        description: 'Equivalências essenciais de volume e pressão.',
        variables: [
          { symbol: 'Pa', meaning: 'Pascal (N/m²)', unit: 'unidade SI de pressão' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'si-vectors',
      caption: 'Base do SI, escala de prefixos e decomposição vetorial ortogonal Fₓ = F·cosθ, Fᵧ = F·senθ (PDF p. 54 e 60).',
    },
    step8ExamTraps: [
      'Velocidade é GRANDEZA VETORIAL; rapidez/módulo da velocidade ou massa ou temperatura são ESCALARES.',
      'A unidade SI de massa é QUILOGRAMA (kg), e NÃO grama (g)! E a unidade SI de temperatura é KELVIN (K), não °C.',
      'Ao converter área (m² → cm²) ou volume (m³ → cm³), a potência acompanha o expoente: 1 m² = 10⁴ cm² e 1 m³ = 10⁶ cm³.',
    ],
    step9PracticePrompt:
      'Pratique conversões de unidades do SI, prefixos, vetores e notação científica antes da avaliação.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre uma grandeza escalar e uma vetorial, e por que 1 m³ equivale a 1.000 litros?',
  },
  {
    id: 'phys-2',
    discipline: 'fisica',
    stageNumber: 2,
    title: 'Movimento (Cinemática)',
    subtitle: 'Referencial, posição, deslocamento, distância, velocidade, aceleração, MU, MUV e gráficos',
    whyNow: 'Primeiro descrevemos como os corpos se movem no espaço e no tempo antes de investigar as forças que causam esse movimento.',
    pdfPages: 'PDF p. 61 (Módulo 04: Cinemática)',
    pdfComparisonNote:
      'Corresponde integralmente ao Mapa 61 (Cinemática: posição, Δx, distância percorrida, velocidade média, aceleração, MU, MUV e gráficos x×t e v×t).',
    subtopics: [
      { id: 'f2-referencial', title: 'Referencial, posição, deslocamento (Δx) e distância percorrida' },
      { id: 'f2-velocidade', title: 'Velocidade média e aceleração' },
      { id: 'f2-mu', title: 'Movimento Uniforme (MU)' },
      { id: 'f2-muv', title: 'Movimento Uniformemente Variado (MUV) e Torricelli' },
      { id: 'f2-graficos', title: 'Interpretação de gráficos x×t e v×t' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 2: verifique sua compreensão sobre deslocamento vs distância e velocidade média.',
    step2SimpleExplanation: [
      'Um objeto está parado ou em movimento dependendo do REFERENCIAL escolhido: um operador sentado dentro de um navio petroleiro está parado em relação ao convés, mas em movimento em relação ao píer.',
      'Distância percorrida (d) é tudo o que o odômetro marca ao longo da curva; já o DESLOCAMENTO (Δx = x_final - x_inicial) é a linha reta entre o ponto de saída e o de chegada. Se você dá uma volta completa numa pista e volta ao ponto de partida, d > 0, mas Δx = 0!',
      'No Movimento Uniforme (MU), a velocidade é constante (a = 0). No Movimento Uniformemente Variado (MUV), a velocidade muda no mesmo ritmo (aceleração a constante ≠ 0).',
      'Dica de ouro nos gráficos: no gráfico Velocidade × Tempo (v × t), a ÁREA embaixo da curva é igual ao deslocamento Δx, e a inclinação da reta é a aceleração!',
    ],
    step3TechnicalConcept: [
      'Velocidade escalar/vetorial média: v_m = Δx / Δt (m/s). Aceleração média: a = Δv / Δt (m/s²).',
      'Movimento Uniforme (a = 0): x = x₀ + v · t (gráfico x×t é uma reta inclinada; v×t é reta horizontal).',
      'Movimento Uniformemente Variado (a = constante ≠ 0): (1) v = v₀ + a·t; (2) x = x₀ + v₀·t + ½·a·t² (gráfico x×t é parábola); (3) Equação de Torricelli (sem o tempo t): v² = v₀² + 2·a·Δx.',
      'Movimento acelerado vs retardado: acelerado quando velocidade e aceleração têm o MESMO sinal (módulo de v aumenta); retardado quando têm sinais OPOSTOS (módulo de v diminui).',
    ],
    step4WorkedExamples: [
      {
        title: 'Velocidade média de deslocamento de fluido em duto',
        problem:
          'Um "pig" (equipamento de inspeção interna de dutos) percorre 18 km de um oleoduto com velocidade média constante de 2,5 m/s. Quanto tempo leva o trajeto em horas?',
        steps: [
          '1º passo: Colocar na mesma unidade. Distância Δx = 18 km = 18.000 m.',
          '2º passo: Como v = Δx / Δt → Δt = Δx / v = 18.000 m / 2,5 m/s = 7.200 s.',
          '3º passo: Converter segundos para horas: 7.200 s ÷ 3.600 s/h = 2 horas.',
        ],
        finalAnswer: 'O trajeto dura 7.200 s (2,0 horas).',
      },
      {
        title: 'Frenagem usando a Equação de Torricelli (sem tempo)',
        problem:
          'Um caminhão-tanque desloca-se a 20 m/s (72 km/h) e freia com desaceleração constante de módulo 4 m/s² até parar. Qual a distância percorrida na frenagem?',
        steps: [
          '1º passo: Dados: v₀ = 20 m/s; v = 0 (parou); a = -4 m/s² (sinal negativo pois freia contra o movimento).',
          '2º passo: Usar Torricelli (não foi dado o tempo): v² = v₀² + 2 · a · Δx.',
          '3º passo: 0² = 20² + 2 · (-4) · Δx → 0 = 400 - 8 · Δx.',
          '4º passo: 8 · Δx = 400 → Δx = 400 / 8 = 50 m.',
        ],
        finalAnswer: 'Distância de frenagem = 50 m.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Calcular o tempo de viagem, a distância mínima de frenagem na rodovia e a leitura de velocidade média em trechos.',
      petrobrasTranspetro:
        'A passagem de PIGs instrumentados dentro de dutos exige controle preciso de velocidade de escoamento (geralmente 1 a 5 m/s) para que sensores magnéticos e ultrassônicos registrem a espessura da parede sem falhas. Além disso, manobras de atracação de navios petroleiros monitoram velocidade de aproximação e desaceleração.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'v_m = Δx / Δt  |  x = x₀ + v·t',
        description: 'Velocidade média e função horária do Movimento Uniforme.',
        variables: [
          { symbol: 'Δx', meaning: 'Deslocamento', unit: 'm' },
          { symbol: 'Δt', meaning: 'Intervalo de tempo', unit: 's' },
          { symbol: 'v', meaning: 'Velocidade', unit: 'm/s' },
        ],
      },
      {
        expression: 'v = v₀ + a·t  |  x = x₀ + v₀·t + ½a·t²  |  v² = v₀² + 2a·Δx',
        description: 'Equações do Movimento Uniformemente Variado (MUV).',
        variables: [
          { symbol: 'a', meaning: 'Aceleração escalar', unit: 'm/s²' },
          { symbol: 'v₀, v', meaning: 'Velocidade inicial e final', unit: 'm/s' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'kinematics-graphs',
      caption: 'Comparação gráfica x×t e v×t entre Movimento Uniforme (MU) e Uniformemente Acelerado (MUV) (PDF p. 61).',
    },
    step8ExamTraps: [
      'A velocidade média em dois trechos de MESMA DISTÂNCIA com velocidades v₁ e v₂ NÃO é a média aritmética (v₁+v₂)/2! É a média harmônica: 2·v₁·v₂ / (v₁+v₂).',
      'Aceleração negativa NÃO significa automaticamente que o objeto está freando: se v < 0 e a < 0, ele está acelerando no sentido negativo!',
      'Não misture km/h com m/s² ou metros na mesma conta. Sempre converta para SI antes de substituir na fórmula.',
    ],
    step9PracticePrompt:
      'Pratique cálculo de velocidade média, Torricelli e leitura de áreas/inclinações em gráficos.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre distância percorrida e deslocamento, e o que representa a área sob a curva de um gráfico v × t?',
  },
  {
    id: 'phys-3',
    discipline: 'fisica',
    stageNumber: 3,
    title: 'Forças e Equilíbrio',
    subtitle: 'Força, massa e peso, Leis de Newton, atrito, plano inclinado, estática e dinâmica',
    whyNow: 'Agora explicamos a causa do movimento ou do repouso: como forças empurram, puxam, equilibram estruturas ou geram aceleração.',
    pdfPages: 'PDF p. 60 e 62 (Módulo 04: Estática e Dinâmica)',
    pdfComparisonNote:
      'Combina os Mapas 60 (Estática: Diagrama de Corpo Livre, ΣF=0, Momento M=F·d, ΣM=0) e 62 (Dinâmica: 3 Leis de Newton, F=m·a, Peso, Normal, Atrito e Plano Inclinado).',
    subtopics: [
      { id: 'f3-leis-newton', title: 'Leis de Newton (Inércia, F=m·a, Ação e Reação)' },
      { id: 'f3-peso-normal', title: 'Massa vs Peso e Força Normal' },
      { id: 'f3-atrito', title: 'Força de atrito (estático e cinético) e plano inclinado' },
      { id: 'f3-estatica', title: 'Estática, equilíbrio de corpos e momento de força (torque)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 3: avalie seus conhecimentos sobre Leis de Newton, diferença entre massa e peso e equilíbrio.',
    step2SimpleExplanation: [
      'Força é um empurrão ou puxão capaz de mudar a velocidade de um corpo ou deformá-lo. Sua unidade no SI é o Newton (N).',
      '1ª Lei de Newton (Inércia): se a soma das forças (resultante) for zero, quem está parado continua parado e quem está em movimento continua em linha reta com velocidade constante.',
      '2ª Lei de Newton (F = m·a): quanto maior a força resultante, maior a aceleração; quanto maior a massa (inércia), mais difícil acelerar.',
      '3ª Lei de Newton (Ação e Reação): toda força vem aos pares em corpos DIFERENTES, com mesma intensidade, mesma direção e sentidos opostos.',
      'Na Estática (estruturas paradas como suportes de tubulação e pontes), não basta a soma das forças ser zero (ΣF = 0, sem translação) — a soma dos giros/momentos também tem que ser zero (ΣM = 0, sem rotação)!',
    ],
    step3TechnicalConcept: [
      'Massa (kg) é escalar e mede a quantidade de matéria/inércia (constante em qualquer lugar). Peso (P = m·g, em N) é a força gravitacional vetorial (depende de g ≈ 9,8 m/s² ou 10 m/s²).',
      'Atrito (PDF p. 62): opõe-se ao movimento relativo ou tendência. Estático: F_at ≤ μ_e · N (até o máximo de iminência); Cinético (em movimento): F_at = μ_c · N.',
      'Plano inclinado de ângulo θ (PDF p. 62): decompõe-se o Peso em P_x = P·senθ (paralela ao plano, puxa para baixo) e P_y = P·cosθ (perpendicular ao plano, equilibrada pela Normal N = P·cosθ). Sem atrito, a = g·senθ.',
      'Estática de corpo rígido (PDF p. 60): Momento (torque) M = F · d (em N·m), onde d é o braço perpendicular até o ponto de apoio. Condições de equilíbrio: ΣFₓ = 0, ΣFᵧ = 0 e ΣM = 0.',
    ],
    step4WorkedExamples: [
      {
        title: 'Dinâmica com atrito em plano horizontal (PDF p. 62)',
        problem:
          'Um bloco de massa 10 kg sobre piso horizontal (g = 10 m/s², μ_c = 0,2) é puxado por uma força horizontal de 50 N. Qual a aceleração adquirida?',
        steps: [
          '1º passo: Calcular Peso e Normal: P = m · g = 10 × 10 = 100 N. Como não há movimento vertical, N = P = 100 N.',
          '2º passo: Calcular força de atrito cinético: F_at = μ_c · N = 0,2 × 100 = 20 N (oposta ao movimento).',
          '3º passo: Força resultante horizontal: F_R = F - F_at = 50 - 20 = 30 N.',
          '4º passo: 2ª Lei de Newton: a = F_R / m = 30 N / 10 kg = 3,0 m/s².',
        ],
        finalAnswer: 'Aceleração a = 3,0 m/s².',
      },
      {
        title: 'Reações de apoio numa viga de suporte (PDF p. 60)',
        problem:
          'Uma barra uniforme leve de 4 m apoiada nas extremidades A e B sustenta uma válvula de 600 N colocada a 1 m de A (e 3 m de B). Calcule as forças de reação nos apoios R_A e R_B.',
        steps: [
          '1º passo: Equilíbrio de momentos em torno de A (ΣM_A = 0): R_B · 4 - 600 · 1 = 0.',
          '2º passo: 4 · R_B = 600 → R_B = 150 N (para cima).',
          '3º passo: Equilíbrio vertical (ΣFᵧ = 0): R_A + R_B - 600 = 0 → R_A = 600 - 150 = 450 N.',
        ],
        finalAnswer: 'R_A = 450 N e R_B = 150 N.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Usar cinto de segurança (1ª Lei: inércia), empurrar um móvel pesado vencendo o atrito estático inicial e usar uma chave de boca longa para soltar um parafuso (maior braço d = maior torque M = F·d).',
      petrobrasTranspetro:
        'Projeto de suportes ("pipe racks") de tubulações pesadas usando estática (ΣF=0 e ΣM=0), cálculos de torque de aperto em flanges para evitar vazamentos e atrito em movimentação de cargas com guindastes em terminais.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'F_R = m · a  |  P = m · g',
        description: 'Equação fundamental da Dinâmica e força Peso.',
        variables: [
          { symbol: 'F_R', meaning: 'Força resultante', unit: 'N' },
          { symbol: 'm', meaning: 'Massa', unit: 'kg' },
          { symbol: 'a, g', meaning: 'Aceleração / gravidade (~9,8 ou 10)', unit: 'm/s²' },
        ],
      },
      {
        expression: 'F_at = μ · N  |  M = F · d',
        description: 'Força de atrito e momento (torque) de uma força.',
        variables: [
          { symbol: 'μ', meaning: 'Coeficiente de atrito', unit: 'adimensional' },
          { symbol: 'M', meaning: 'Momento de força', unit: 'N·m' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-inclined-plane',
      preset: 'forces-inclined',
      caption: 'Simulação 3D de forças no Plano Inclinado: altere o ângulo θ e veja vetores P, Pₓ, Pᵧ, Normal e Atrito.',
    },
    step8ExamTraps: [
      'Peso (P) e Normal (N) NÃO formam par ação-reação! Ambos atuam no MESMO corpo. A reação ao Peso da caixa está no centro da Terra; a reação à Normal está na superfície da mesa.',
      'A força Normal NEM sempre é igual ao Peso: em um plano inclinado, N = P·cosθ (menor que P); dentro de um elevador acelerando para cima, N > P.',
      'Na 1ª Lei, velocidade constante em linha reta (MRU) também tem força resultante NULA (não é só quando o corpo está parado!).',
    ],
    step9PracticePrompt:
      'Resolva as questões de Leis de Newton, plano inclinado, atrito e momento de força.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que Peso e Normal não são um par ação-reação, e o que acontece com a força Normal quando inclinamos uma rampa?',
  },
  {
    id: 'phys-4',
    discipline: 'fisica',
    stageNumber: 4,
    title: 'Energia Mecânica',
    subtitle: 'Trabalho, potência, energia cinética, potencial gravitacional e elástica, conservação da energia',
    whyNow: 'Conecta movimento, força e altura em uma única ideia poderosa: a energia não se cria nem se perde, apenas se transforma.',
    pdfPages: 'PDF p. 54 e 63 (Módulos 03 e 04: Potência e Conservação da Energia Mecânica)',
    pdfComparisonNote:
      'O Mapa 63 do PDF aborda Trabalho, Energia Cinética, Energia Potencial Gravitacional e Conservação da Energia Mecânica. A trilha inclui também Potência (PDF p. 54) e Energia Potencial Elástica (½kx²), muito cobradas na CESGRANRIO.',
    subtopics: [
      { id: 'f4-trabalho', title: 'Trabalho de uma força (W = F·d·cosθ) e Potência' },
      { id: 'f4-cinetica', title: 'Energia cinética e Teorema Trabalho-Energia' },
      { id: 'f4-potencial', title: 'Energia potencial gravitacional e elástica' },
      { id: 'f4-conservacao', title: 'Conservação da energia mecânica' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 4: teste seus conceitos sobre trabalho mecânico, potência e energia de movimento e altura.',
    step2SimpleExplanation: [
      'Em Física, uma força só realiza TRABALHO (W) quando provoca deslocamento na direção em que atua. Se você segura uma caixa pesada parado no lugar, faz esforço biológico, mas o trabalho físico é ZERO (d = 0). Se a força é perpendicular ao deslocamento (cos 90° = 0), o trabalho também é zero.',
      'Potência (P = W / Δt) mede a rapidez com que o trabalho é feito — uma bomba mais potente realiza o mesmo bombeamento em menos tempo.',
      'Energia Cinética (E_c) é a energia do movimento (depende da massa e do quadrado da velocidade!). Energia Potencial Gravitacional (E_pg) é a energia armazenada pela altura (m·g·h). Energia Potencial Elástica (E_pe) é a energia de uma mola esticada ou comprimida (½·k·x²).',
      'Sem atrito ou resistência do ar (sistema conservativo), a Energia Mecânica total (E_m = E_c + E_p) fica exatamente constante do início ao fim!',
    ],
    step3TechnicalConcept: [
      'Trabalho de força constante: W = F · d · cosθ (unidade SI: Joule, J = N·m). Teorema da Energia Cinética: W_resultante = ΔE_c = ½mv_f² - ½mv_i².',
      'Potência média: P = W / Δt = E / Δt (unidade SI: Watt, W = J/s; conversões do PDF p. 54: 1 CV ≈ 735,5 W; 1 kWh = 3,6 × 10⁶ J). Potência instantânea: P = F · v.',
      'Energia Cinética: E_c = ½ · m · v². Energia Potencial Gravitacional: E_pg = m · g · h. Energia Potencial Elástica: E_pe = ½ · k · x² (Lei de Hooke: F_el = k·x).',
      'Conservação da Energia Mecânica (apenas forças conservativas): E_mi = E_mf. Com forças dissipativas (atrito): E_mf = E_mi - |W_atrito|.',
    ],
    step4WorkedExamples: [
      {
        title: 'Velocidade na base de uma rampa sem atrito (PDF p. 63)',
        problem:
          'Um bloco de 2,0 kg parte do repouso do topo de uma rampa a 5,0 m de altura. Desprezando o atrito (g = 10 m/s²), qual a velocidade ao atingir a base (h = 0)?',
        steps: [
          '1º passo: No topo (inicial): v_i = 0 → E_ci = 0; h_i = 5,0 m → E_pi = m·g·h = 2 × 10 × 5 = 100 J. Logo E_mi = 100 J.',
          '2º passo: Na base (final): h_f = 0 → E_pf = 0. Pela conservação, E_mf = E_mi = 100 J.',
          '3º passo: E_cf = ½ · m · v_f² = 100 → ½ · 2 · v_f² = 100 → v_f² = 100.',
          '4º passo: v_f = √100 = 10 m/s. (Note que a massa m se cancela na equação: v = √(2gh)!).',
        ],
        finalAnswer: 'Velocidade na base: v_f = 10 m/s (ou ≈ 9,9 m/s usando g = 9,8 m/s² como no PDF p. 63).',
      },
      {
        title: 'Potência útil de bombeamento',
        problem:
          'Uma bomba eleva 600 kg de água por minuto até um reservatório a 20 m de altura (g = 10 m/s²). Qual a potência útil mínima fornecida?',
        steps: [
          '1º passo: Trabalho para elevar a água: W = ΔE_p = m · g · h = 600 × 10 × 20 = 120.000 J.',
          '2º passo: Tempo em segundos: Δt = 1 min = 60 s.',
          '3º passo: Potência: P = W / Δt = 120.000 J / 60 s = 2.000 W = 2,0 kW.',
        ],
        finalAnswer: 'Potência útil = 2.000 W (2,0 kW).',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Montanha-russa (troca contínua de altura por velocidade), arco e flecha (energia elástica virando cinética) e potência em Watts de eletrodomésticos.',
      petrobrasTranspetro:
        'Bombas centrífugas (PDF p. 80–81) convertem potência mecânica do eixo do motor em energia de pressão e altura manométrica para vencer desníveis topográficos em oleodutos. Se há perda de carga por atrito (PDF p. 67), parte da energia mecânica vira calor e exige maior potência da estação de bombeamento.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'W = F · d · cosθ  |  P = W / Δt',
        description: 'Trabalho mecânico e Potência.',
        variables: [
          { symbol: 'W', meaning: 'Trabalho', unit: 'J (Joule)' },
          { symbol: 'P', meaning: 'Potência', unit: 'W (Watt = J/s)' },
        ],
      },
      {
        expression: 'E_c = ½mv²  |  E_pg = mgh  |  E_pe = ½kx²',
        description: 'Formas de energia mecânica.',
        variables: [
          { symbol: 'k', meaning: 'Constante elástica da mola', unit: 'N/m' },
          { symbol: 'x', meaning: 'Deformação da mola', unit: 'm' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'energy-conservation',
      caption: 'Conversão entre Energia Potencial Gravitacional (E_p) e Energia Cinética (E_c) ao longo de um perfil inclinado (PDF p. 63).',
    },
    step8ExamTraps: [
      'A força Normal e a força centrípeta são sempre perpendiculares ao deslocamento (θ = 90°, cos 90° = 0), portanto NÃO realizam trabalho em superfícies rígidas!',
      'Se a velocidade de um veículo DOBRA (2v), sua energia cinética QUADRUPLICA (4 E_c), pois depende de v²!',
      'kWh (quilowatt-hora) NÃO é unidade de potência — é unidade de ENERGIA (Potência × Tempo)!',
    ],
    step9PracticePrompt:
      'Pratique cálculo de trabalho, potência e conservação da energia mecânica.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que o trabalho da força Normal num piso horizontal é zero, e por que dobrar a velocidade quadruplica a energia cinética?',
  },
  {
    id: 'phys-5',
    discipline: 'fisica',
    stageNumber: 5,
    title: 'Fluidos',
    subtitle: 'Densidade, massa específica, pressão, pressão atmosférica e hidrostática, Pascal e Arquimedes (empuxo)',
    whyNow: 'Aplicamos os conceitos de força e área a líquidos e gases em repouso ou em dutos — tópico central da Transpetro.',
    pdfPages: 'PDF p. 51, 53 e 64–67 (Módulos 03 e 04: Pressão, Densidade, Fluidos, Hidrostática, Escoamento e Perda de Carga)',
    pdfComparisonNote:
      'O PDF traz Propriedades dos Fluidos (p. 64), Hidrostática/Pascal/Manometria (p. 65), Escoamento/Continuidade Q=A·v (p. 66) e Perda de Carga (p. 67). A trilha adiciona também o Princípio de Arquimedes e Empuxo (E = ρ·V_sub·g), essencial para navios petroleiros e provas CESGRANRIO.',
    subtopics: [
      { id: 'f5-densidade', title: 'Densidade, massa específica e pressão (p = F/A)' },
      { id: 'f5-hidrostatica', title: 'Pressão atmosférica e hidrostática (Teorema de Stevin: p = ρgh)' },
      { id: 'f5-pascal', title: 'Princípio de Pascal e prensas hidráulicas' },
      { id: 'f5-arquimedes', title: 'Princípio de Arquimedes, empuxo e flutuabilidade' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 5: verifique sua base em pressão, densidade e comportamento de líquidos em tanques e recipientes.',
    step2SimpleExplanation: [
      'Pressão é a força distribuída sobre uma área (p = F / A). Uma agulha fura fácil porque concentra força numa área minúscula; uma sapata larga distribui o peso na lama.',
      'Dentro de um tanque cheio de líquido parado, quanto mais fundo você mergulha, mais peso de líquido há acima de você — por isso a pressão aumenta com a profundidade (p_hidrostática = ρ·g·h). A forma do tanque NÃO altera a pressão no fundo, só a altura h da coluna e a densidade ρ do fluido!',
      'Pelo Princípio de Pascal, se você apertar um líquido confinado em um ponto, essa pressão extra se espalha igualmente para todo o líquido — é assim que um macaco hidráulico multiplica forças.',
      'Pelo Princípio de Arquimedes, todo corpo mergulhado num fluido recebe uma força de baixo para cima chamada EMPUXO, igual ao peso do volume de fluido que ele deslocou. É o empuxo que faz um navio petroleiro de milhares de toneladas flutuar!',
    ],
    step3TechnicalConcept: [
      'Massa específica (ρ = m/V, em kg/m³ ou g/cm³) é propriedade da substância; densidade relativa (dr = ρ_subst / ρ_água). Pressão: p = F / A (unidade SI: Pascal, 1 Pa = 1 N/m²).',
      'Teorema de Stevin / Pressão Hidrostática (PDF p. 65): Δp = ρ · g · h. Pressão absoluta no fundo de tanque aberto: p_abs = p_atm + ρ·g·h (PDF p. 51). Manômetro em U: Δp = ρ_m · g · Δh.',
      'Princípio de Pascal (PDF p. 65): Δp₁ = Δp₂ → F₁ / A₁ = F₂ / A₂.',
      'Princípio de Arquimedes (Empuxo): E = ρ_fluido · V_submerso · g. Se E > P (ρ_corpo < ρ_fluido), o corpo sobe/flutua; se flutuando em equilíbrio, E = P_corpo.',
      'Complemento do PDF (p. 66): Equação da Continuidade para fluidos incompressíveis em dutos: Q = A · v = constante (se a área diminui, a velocidade aumenta!).',
    ],
    step4WorkedExamples: [
      {
        title: 'Pressão manométrica e absoluta no fundo de um tanque de óleo (PDF p. 51 e 65)',
        problem:
          'Um tanque aberto à atmosfera (p_atm = 100 kPa) contém óleo diesel de densidade ρ = 850 kg/m³ até a altura h = 10 m. Adote g = 10 m/s². Calcule a pressão hidrostática (manométrica) e a pressão absoluta no fundo.',
        steps: [
          '1º passo: Pressão hidrostática (manométrica): p_man = ρ · g · h = 850 × 10 × 10 = 85.000 Pa = 85 kPa.',
          '2º passo: Pressão absoluta (soma com a atmosférica, PDF p. 51): p_abs = p_atm + p_man = 100 kPa + 85 kPa = 185 kPa.',
        ],
        finalAnswer: 'Pressão manométrica = 85 kPa · Pressão absoluta = 185 kPa.',
      },
      {
        title: 'Prensa hidráulica (Princípio de Pascal — PDF p. 65)',
        problem:
          'Num elevador hidráulico, aplica-se uma força F₁ = 200 N no êmbolo menor de área A₁ = 0,02 m². Qual força máxima F₂ é obtida no êmbolo maior de área A₂ = 0,50 m²?',
        steps: [
          '1º passo: Pelo Princípio de Pascal: F₁ / A₁ = F₂ / A₂.',
          '2º passo: 200 / 0,02 = F₂ / 0,50 → 10.000 = F₂ / 0,50.',
          '3º passo: F₂ = 10.000 × 0,50 = 5.000 N (a área é 25× maior, logo a força é multiplicada por 25!).',
        ],
        finalAnswer: 'Força obtida F₂ = 5.000 N.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Sentir pressão no ouvido ao mergulhar fundo na piscina, freio hidráulico do carro (Pascal) e boiar mais fácil na água salgada do mar do que na piscina (maior densidade → maior empuxo).',
      petrobrasTranspetro:
        'Medição de nível em tanques por transmissores hidrostáticos/pressão diferencial (PDF p. 52 e 56: medem p = ρ·g·h na base do tanque), vasos comunicantes em visores de nível (sight glass), calado e flutuação de navios petroleiros (Arquimedes) e escoamento em dutos com redução de diâmetro (PDF p. 66–67).',
    },
    step6FormulasAndUnits: [
      {
        expression: 'p = F / A  |  p_hid = ρ · g · h',
        description: 'Definição de pressão e Teorema de Stevin.',
        variables: [
          { symbol: 'p', meaning: 'Pressão', unit: 'Pa (N/m²)' },
          { symbol: 'ρ', meaning: 'Massa específica do fluido', unit: 'kg/m³' },
          { symbol: 'h', meaning: 'Profundidade abaixo da superfície', unit: 'm' },
        ],
      },
      {
        expression: 'F₁ / A₁ = F₂ / A₂  |  E = ρ_fluido · V_sub · g',
        description: 'Princípio de Pascal e Empuxo (Arquimedes).',
        variables: [
          { symbol: 'E', meaning: 'Força de empuxo', unit: 'N' },
          { symbol: 'V_sub', meaning: 'Volume do fluido deslocado (submerso)', unit: 'm³' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'hydrostatic-tank-pascal',
      caption: 'Pressão hidrostática por profundidade em tanque, Prensa de Pascal e Vasos Comunicantes (PDF p. 65).',
    },
    step8ExamTraps: [
      'Pressão hidrostática NÃO depende do volume total do tanque nem da largura — um cano fino de 10 m de altura gera a MESMA pressão na base que um reservatório gigante de 10 m de altura!',
      'No Empuxo E = ρ_fluido · V_sub · g, usa-se a densidade do FLUIDO (e o volume SUBMERSO), e NÃO a densidade do objeto!',
      'Pressão manométrica = p_abs - p_atm. Sempre verifique se a questão pede pressão manométrica (relativa) ou absoluta!',
    ],
    step9PracticePrompt:
      'Pratique cálculos de Stevin, Pascal, Arquimedes e leitura de manômetros.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que um navio feito de aço (mais denso que a água) consegue flutuar pelo Princípio de Arquimedes?',
  },
  {
    id: 'phys-6',
    discipline: 'fisica',
    stageNumber: 6,
    title: 'Temperatura e Calor',
    subtitle: 'Temperatura, escalas (°C, °F, K), calor específico, sensível, latente, condução, convecção e radiação',
    whyNow: 'Prepara a base térmica para entender trocadores de calor, isolamento de dutos e máquinas térmicas.',
    pdfPages: 'PDF p. 51 e 69–71 (Módulos 03 e 05: Escalas Térmicas, Condução, Convecção e Radiação)',
    pdfComparisonNote:
      'Os Mapas 51 e 69–71 cobrem Escalas (°C, °F, K), Condução (Lei de Fourier), Convecção (natural e forçada) e Radiação (Stefan-Boltzmann). A trilha completa a base com Calorimetria (Calor Sensível Q=mcΔT e Calor Latente Q=mL).',
    subtopics: [
      { id: 'f6-escalas', title: 'Temperatura e conversão entre Celsius, Fahrenheit e Kelvin' },
      { id: 'f6-calorimetria', title: 'Calor específico, capacidade térmica, calor sensível e latente' },
      { id: 'f6-propagacao', title: 'Transferência de calor: condução, convecção e radiação' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 6: avalie sua base sobre temperatura vs calor, escalas termométricas e modos de troca térmica.',
    step2SimpleExplanation: [
      'Temperatura mede o grau de agitação das moléculas de um corpo (quente ou frio). Já CALOR é energia térmica em trânsito — ou seja, energia que passa espontaneamente do corpo mais quente para o mais frio.',
      'Calor SENSÍVEL (Q = m·c·ΔT) muda a temperatura sem mudar o estado físico (esquentar água de 20 °C para 80 °C). Calor LATENTE (Q = m·L) muda o estado físico mantendo a temperatura constante (derreter gelo a 0 °C ou ferver água a 100 °C).',
      'O calor viaja de 3 jeitos: CONDUÇÃO (molécula empurrando molécula em sólidos, ex.: barra metálica esquentando), CONVECÇÃO (movimento de fluidos líquidos/gases, ex.: ar quente subindo) e RADIAÇÃO (ondas eletromagnéticas infravermelhas, única que viaja até no vácuo, como a luz do Sol!).',
    ],
    step3TechnicalConcept: [
      'Escalas termométricas (PDF p. 51): T(K) = T(°C) + 273,15 (zero absoluto = 0 K = -273,15 °C). T(°F) = 1,8·T(°C) + 32. Atenção para VARIAÇÃO de temperatura: ΔT(K) = ΔT(°C) (um degrau de 1 K tem o mesmo tamanho de 1 °C!), enquanto ΔT(°F) = 1,8·ΔT(°C).',
      'Calorimetria: Capacidade térmica C = Q/ΔT = m·c (J/°C ou cal/°C). Calor sensível: Q = m · c · ΔT (água: c ≈ 1 cal/(g·°C) ≈ 4.184 J/(kg·K)). Calor latente: Q = m · L.',
      'Propagação de calor (PDF p. 69–71): (1) Condução — Lei de Fourier em parede plana: q" = k·(T₁ - T₂)/L (k é condutividade térmica: alta em metais como cobre ~400 W/m·K, baixíssima em isolantes como lã de rocha ~0,04 W/m·K); (2) Convecção — q = h·A·ΔT; (3) Radiação — Lei de Stefan-Boltzmann: q = ε·σ·T⁴ (T em Kelvin!).',
    ],
    step4WorkedExamples: [
      {
        title: 'Conversão entre Celsius, Fahrenheit e Kelvin (PDF p. 51)',
        problem: 'Um processo opera a 60 °C. Converta essa temperatura para °F e para K.',
        steps: [
          '1º passo (°F): °F = (60 × 9/5) + 32 = 108 + 32 = 140 °F.',
          '2º passo (K): K = 60 + 273,15 = 333,15 K.',
        ],
        finalAnswer: '60 °C = 140 °F = 333,15 K.',
      },
      {
        title: 'Aquecimento de óleo com Calor Sensível',
        problem:
          'Quantos joules são necessários para aquecer 500 kg de um óleo térmico (c = 2.000 J/(kg·°C)) de 25 °C até 125 °C?',
        steps: [
          '1º passo: Calcular ΔT = 125 - 25 = 100 °C (ou 100 K).',
          '2º passo: Aplicar Q = m · c · ΔT = 500 kg × 2.000 J/(kg·°C) × 100 °C.',
          '3º passo: Q = 100.000.000 J = 100 MJ (10⁸ J).',
        ],
        finalAnswer: 'Calor necessário Q = 100 MJ.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Usar colher de madeira na panela (mau condutor), instalar ar-condicionado no alto da parede (ar frio desce por convecção) e garrafa térmica espelhada por dentro (bloqueia radiação).',
      petrobrasTranspetro:
        'Trocadores de calor casco-e-tubo (PDF p. 84) usam tubos metálicos de alta condutividade térmica (condução + convecção forçada) para resfriar ou aquecer derivados; dutos de óleo pesado aquecido recebem isolamento térmico com lã de rocha ou poliuretano (baixo k) e chapas externas claras/polidas (baixa emissividade ε) para reduzir perdas por condução e radiação.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'T(K) = T(°C) + 273,15  |  T(°F) = 1,8·T(°C) + 32',
        description: 'Conversão entre escalas de temperatura.',
        variables: [
          { symbol: 'K', meaning: 'Kelvin (unidade SI)', unit: 'K' },
          { symbol: '°C, °F', meaning: 'Grau Celsius e Fahrenheit', unit: '°C / °F' },
        ],
      },
      {
        expression: 'Q = m · c · ΔT  |  Q = m · L  |  q" = k · ΔT / L',
        description: 'Calor sensível, calor latente e fluxo por condução (Lei de Fourier).',
        variables: [
          { symbol: 'c', meaning: 'Calor específico', unit: 'J/(kg·K) ou cal/(g·°C)' },
          { symbol: 'L', meaning: 'Calor latente (ou espessura na condução)', unit: 'J/kg (ou m)' },
          { symbol: 'k', meaning: 'Condutividade térmica', unit: 'W/(m·K)' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'heat-transfer-modes',
      caption: 'Comparativo visual entre Condução (Lei de Fourier), Convecção e Radiação Térmica (PDF p. 69–71).',
    },
    step8ExamTraps: [
      'A variação ΔT em Celsius e em Kelvin é IGUAL (se subiu 20 °C, subiu 20 K — NÃO some 273 na variação!).',
      'Um objeto "não tem calor", ele tem ENERGIA INTERNA/térmica. Calor é exclusivamente energia em trânsito por diferença de temperatura.',
      'Durante uma mudança de fase de substância pura (fusão/ebulição), continua entrando calor (latente), mas a temperatura fica CONSTANTE!',
    ],
    step9PracticePrompt:
      'Pratique conversões de temperatura, cálculos de calor sensível/latente e propagação de calor.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre calor sensível e calor latente, e qual o único modo de transferência de calor que funciona no vácuo?',
  },
  {
    id: 'phys-7',
    discipline: 'fisica',
    stageNumber: 7,
    title: 'Termodinâmica e Gases',
    subtitle: 'Transformações gasosas, gases ideais, 1ª Lei, 2ª Lei, máquinas térmicas e rendimento',
    whyNow: 'Etapa avançada que une calor, trabalho mecânico e gases para explicar motores, turbinas e compressores.',
    pdfPages: 'PDF p. 72, 77–79 e 93 (Módulos 05 e 08: Máquinas Térmicas, Propriedades, 1ª e 2ª Leis e Gases)',
    pdfComparisonNote:
      'Integra Máquinas Térmicas (p. 72), Propriedades Termodinâmicas (p. 77), Primeira Lei (p. 78), Segunda Lei (p. 79) e Estudo dos Gases (p. 93).',
    subtopics: [
      { id: 'f7-gases', title: 'Transformações gasosas (Boyle, Charles, Gay-Lussac) e PV = nRT' },
      { id: 'f7-primeira-lei', title: 'Primeira Lei da Termodinâmica (ΔU = Q - W)' },
      { id: 'f7-segunda-lei', title: 'Segunda Lei da Termodinâmica e entropia' },
      { id: 'f7-maquinas', title: 'Máquinas térmicas, ciclo de Carnot e rendimento (η)' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 7: avalie seu entendimento sobre gases, energia interna, trabalho e limites das máquinas térmicas.',
    step2SimpleExplanation: [
      'A 1ª Lei da Termodinâmica (ΔU = Q - W) é a conservação de energia com outra roupa: o calor (Q) que entra num gás pode aumentar sua energia interna (ΔU, ligada à temperatura) OU ser usado pelo gás para empurrar um pistão e fazer trabalho (W).',
      'A 2ª Lei da Termodinâmica explica o sentido natural das coisas: o calor flui sozinho do quente para o frio (nunca do frio para o quente sem gastar energia, como na geladeira), e NENHUMA máquina térmica consegue transformar 100% do calor recebido em trabalho útil — sempre precisa jogar parte do calor fora para uma fonte fria!',
      'O rendimento máximo teórico possível entre duas temperaturas T_h (quente) e T_c (fria) é o de Carnot: η_max = 1 - T_c / T_h (com T em Kelvin!).',
    ],
    step3TechnicalConcept: [
      'Transformações particulares em gás ideal (n cte): Isotérmica (T cte → ΔU = 0 → Q = W; P₁V₁ = P₂V₂); Isobárica (P cte → W = P·ΔV; V₁/T₁ = V₂/T₂); Isocórica/Isométrica (V cte → W = 0 → ΔU = Q; P₁/T₁ = P₂/T₂); Adiabática (sem troca de calor Q = 0 → ΔU = -W).',
      '1ª Lei (PDF p. 78): ΔU = Q - W (convenção física: Q > 0 entra no sistema; W > 0 sistema realiza trabalho ao expandir).',
      '2ª Lei (PDF p. 79): Em sistema isolado, a entropia (dispersão da energia) não diminui (ΔS ≥ 0). Máquinas térmicas (PDF p. 72): Q_h = W + Q_c; rendimento η = W / Q_h = 1 - Q_c / Q_h. Limite de Carnot: η_Carnot = 1 - T_c / T_h (0 < η < 1).',
    ],
    step4WorkedExamples: [
      {
        title: 'Aplicando a Primeira Lei da Termodinâmica (PDF p. 78)',
        problem:
          'Um gás recebe 500 J de calor de uma fonte térmica e, ao expandir-se, realiza 320 J de trabalho sobre o êmbolo. Qual foi a variação da sua energia interna (ΔU)?',
        steps: [
          '1º passo: Identificar sinais: calor recebido Q = +500 J; trabalho realizado pelo gás W = +320 J.',
          '2º passo: Aplicar ΔU = Q - W = 500 - 320 = +180 J.',
          '3º passo: Como ΔU > 0, a energia interna (e a temperatura do gás) aumentou em 180 J.',
        ],
        finalAnswer: 'Variação de energia interna ΔU = +180 J.',
      },
      {
        title: 'Rendimento de máquina térmica e limite de Carnot (PDF p. 72 e 79)',
        problem:
          'Uma turbina térmica opera entre uma fonte quente a 627 °C e uma fonte fria a 27 °C, absorvendo 2.000 J por ciclo e rejeitando 1.200 J para a fonte fria. Calcule o rendimento real e o rendimento máximo de Carnot.',
        steps: [
          '1º passo (Rendimento real): Trabalho W = Q_h - Q_c = 2.000 - 1.200 = 800 J. Logo η_real = W / Q_h = 800 / 2.000 = 0,40 (40%).',
          '2º passo (Converter temperaturas para Kelvin): T_h = 627 + 273 = 900 K; T_c = 27 + 273 = 300 K.',
          '3º passo (Carnot): η_Carnot = 1 - (T_c / T_h) = 1 - (300 / 900) = 1 - 1/3 ≈ 0,667 (66,7%).',
        ],
        finalAnswer: 'Rendimento real = 40% · Limite teórico de Carnot ≈ 66,7%.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Motor a combustão de automóveis, geladeira (máquina frigorífica que exige trabalho elétrico para tirar calor de dentro) e panela de pressão.',
      petrobrasTranspetro:
        'Turbinas a gás e a vapor que acionam compressores centrífugos em estações de compressão de gasodutos e geração elétrica em plataformas/refinarias operam em ciclos termodinâmicos reais limitados pela 2ª Lei (PDF p. 72 e 83). Ao comprimir gás natural, a temperatura sobe significativamente — exigindo resfriadores (intercoolers/aftercoolers).',
    },
    step6FormulasAndUnits: [
      {
        expression: 'ΔU = Q - W  |  W_isobárico = P · ΔV',
        description: 'Primeira Lei da Termodinâmica e trabalho a pressão constante.',
        variables: [
          { symbol: 'ΔU', meaning: 'Variação da energia interna', unit: 'J' },
          { symbol: 'Q', meaning: 'Calor trocado', unit: 'J' },
          { symbol: 'W', meaning: 'Trabalho', unit: 'J' },
        ],
      },
      {
        expression: 'η = W / Q_h = 1 - Q_c / Q_h  |  η_Carnot = 1 - T_c / T_h',
        description: 'Rendimento térmico real e máximo de Carnot.',
        variables: [
          { symbol: 'η', meaning: 'Rendimento (0 < η < 1)', unit: 'adimensional ou %' },
          { symbol: 'T_h, T_c', meaning: 'Temperaturas absoluta quente e fria', unit: 'K' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'thermodynamic-cycle',
      caption: 'Fluxo de energia na Máquina Térmica (Fonte Quente Q_h → Trabalho W + Rejeição Q_c) e 1ª/2ª Leis (PDF p. 72, 78–79).',
    },
    step8ExamTraps: [
      'No rendimento de Carnot (1 - T_c/T_h), usar °C em vez de Kelvin é o erro clássico número 1! Sempre some 273 às temperaturas.',
      'Em uma transformação ISOTÉRMICA de gás ideal, ΔU = 0 (temperatura não muda), logo todo calor recebido vira trabalho (Q = W).',
      'Em uma transformação ISOCÓRICA (volume constante, recipiente rígido), W = 0, logo ΔU = Q.',
    ],
    step9PracticePrompt:
      'Pratique a 1ª Lei, transformações gasosas e cálculos de rendimento térmico real e de Carnot.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: por que uma máquina térmica não pode ter rendimento de 100%, mesmo sem atrito?',
  },
  {
    id: 'phys-8',
    discipline: 'fisica',
    stageNumber: 8,
    title: 'Eletricidade e Magnetismo',
    subtitle: 'Eletrostática, Coulomb, corrente, resistência, Lei de Ohm, potência, circuitos, eletromagnetismo e eletrônica',
    whyNow: 'Começamos com cargas paradas, avançamos para cargas em movimento nos circuitos e chegamos aos campos magnéticos que movem motores e transformadores.',
    pdfPages: 'PDF p. 106 e 112–118 (Módulos 08 e 10: Natureza Elétrica, Eletrostática, Cargas em Movimento, Eletromagnetismo, Eletricidade e Eletrônica)',
    pdfComparisonNote:
      'No PDF, Natureza Elétrica da Matéria aparece no fim do Módulo 08 (p. 106), enquanto Eletrostática, Cargas em Movimento, Eletromagnetismo, Fundamentos de Eletricidade e Eletrônica formam o Módulo 10 (p. 112–118). Na trilha de Física, unimos tudo em sequência lógica.',
    subtopics: [
      { id: 'f8-eletrostatica', title: 'Natureza elétrica, eletrização, Lei de Coulomb, campo e potencial' },
      { id: 'f8-ohm', title: 'Corrente elétrica, tensão, resistência e Lei de Ohm (V = R·I)' },
      { id: 'f8-circuitos', title: 'Potência elétrica, energia e circuitos em série e paralelo' },
      { id: 'f8-eletromagnetismo', title: 'Magnetismo, eletromagnetismo, Lei de Faraday e noções de eletrônica' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 8: avalie sua base sobre cargas elétricas, Lei de Ohm e diferença entre ligação série e paralelo.',
    step2SimpleExplanation: [
      'Cargas iguais se repelem e cargas opostas se atraem (PDF p. 106 e 113). Corpos ficam eletrizados quando perdem ou ganham elétrons por atrito, contato ou indução.',
      'Quando ligamos uma bateria (tensão V em Volts) num fio fechado, os elétrons entram em movimento ordenado formando a CORRENTE ELÉTRICA (I em Amperes). A dificuldade que o material oferece à passagem dessa corrente é a RESISTÊNCIA (R em Ohms, Ω). A Lei de Ohm diz: V = R · I.',
      'Num circuito em SÉRIE (um componente atrás do outro), a corrente I é igual em todos e a tensão se divide; se uma lâmpada queimar, apaga tudo! Num circuito em PARALELO (ramos separados), a tensão V é igual em todos e a corrente se divide; se uma falhar, as outras continuam funcionando!',
      'Eletricidade e magnetismo são irmãos gêmeos: corrente elétrica cria campo magnético ao redor do fio (eletroímã/motor), e variar um campo magnético perto de uma bobina gera tensão elétrica (Lei de Faraday — princípio dos geradores e transformadores!).',
    ],
    step3TechnicalConcept: [
      'Eletrostática (PDF p. 113): Carga quantizada Q = n·e (e = 1,6×10⁻¹⁹ C). Lei de Coulomb: F = k·|q₁·q₂|/r². Campo elétrico: E = F/q. Potencial: V = k·Q/r.',
      'Eletrodinâmica (PDF p. 114 e 117): Lei de Ohm: V = R · I. Potência elétrica: P = V · I = R · I² = V² / R (Watt). Energia: E = P · t (J ou kWh). Associação em série: R_eq = R₁ + R₂ + ...; em paralelo: 1/R_eq = 1/R₁ + 1/R₂ + ... (para dois resistores: R_eq = R₁·R₂ / (R₁ + R₂)).',
      'Eletromagnetismo (PDF p. 115): Oersted (corrente gera campo magnético), Força magnética em condutor no campo B, Indução de Faraday-Lenz: ε = -dΦ/dt (variação do fluxo magnético gera f.e.m. induzida).',
      'Eletrônica básica (PDF p. 118): Resistor (limita corrente), Capacitor (armazena carga/campo elétrico), Indutor (armazena energia em campo magnético), Diodo (conduz num único sentido — retificação CA→CC), Transistor (amplificação e chaveamento digital).',
    ],
    step4WorkedExamples: [
      {
        title: 'Circuito misto/paralelo com Lei de Ohm e Potência (PDF p. 117)',
        problem:
          'Dois resistores de R₁ = 6 Ω e R₂ = 12 Ω são ligados em PARALELO a uma fonte de 12 V. Calcule a resistência equivalente R_eq, a corrente total e a potência dissipada.',
        steps: [
          '1º passo (R_eq em paralelo): R_eq = (R₁ · R₂) / (R₁ + R₂) = (6 × 12) / (6 + 12) = 72 / 18 = 4 Ω.',
          '2º passo (Corrente total pela Lei de Ohm): I = V / R_eq = 12 V / 4 Ω = 3 A. (Note: no ramo de 6 Ω passa 2 A e no de 12 Ω passa 1 A).',
          '3º passo (Potência total): P = V · I = 12 V × 3 A = 36 W.',
        ],
        finalAnswer: 'R_eq = 4 Ω · Corrente total = 3 A · Potência = 36 W.',
      },
      {
        title: 'Energia consumida por um motor de bombeamento (PDF p. 54 e 117)',
        problem:
          'Um motor elétrico trifásico de 50 kW opera continuamente por 8 horas. Qual a energia consumida em kWh e em MJ?',
        steps: [
          '1º passo (kWh): E = P · t = 50 kW × 8 h = 400 kWh.',
          '2º passo (MJ): Como 1 kWh = 3,6 MJ (PDF p. 54), E = 400 × 3,6 = 1.440 MJ.',
        ],
        finalAnswer: 'Energia consumida = 400 kWh (1.440 MJ).',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Tomadas residenciais ligadas em paralelo (todas recebem 127 V ou 220 V independentes), disjuntores de proteção e carregador de celular (retificação de CA para CC via diodos).',
      petrobrasTranspetro:
        'Aterramento elétrico e equipotencialização em tanques e dutos (PDF p. 106 e 113) evitam faíscas por eletricidade estática gerada pelo atrito do escoamento de combustíveis! Na instrumentação industrial (PDF p. 45 e 118), transmissores usam malhas de corrente 4–20 mA (série) e medidores eletromagnéticos de vazão (PDF p. 58) aplicam diretamente a Lei de Faraday.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'V = R · I  |  P = V · I  |  E = P · t',
        description: 'Lei de Ohm, Potência e Energia elétrica.',
        variables: [
          { symbol: 'V', meaning: 'Tensão (ddp)', unit: 'V (volt)' },
          { symbol: 'I', meaning: 'Corrente elétrica', unit: 'A (ampere)' },
          { symbol: 'R', meaning: 'Resistência elétrica', unit: 'Ω (ohm)' },
        ],
      },
      {
        expression: 'F = k·|q₁·q₂|/r²  |  ε = -dΦ/dt',
        description: 'Lei de Coulomb e Lei da Indução de Faraday.',
        variables: [
          { symbol: 'q', meaning: 'Carga elétrica', unit: 'C (coulomb)' },
          { symbol: 'Φ', meaning: 'Fluxo magnético', unit: 'Wb (weber)' },
        ],
      },
    ],
    step7VisualModel: {
      type: 'svg-diagram',
      preset: 'circuits-faraday',
      caption: 'Circuitos Série vs Paralelo (PDF p. 117), Lei de Ohm (p. 114) e Indução Eletromagnética (p. 115).',
    },
    step8ExamTraps: [
      'Em resistores em PARALELO, a resistência equivalente é sempre MENOR que o menor resistor individual! Se deu maior, você aplicou a fórmula de série por engano.',
      'O sentido convencional da corrente é do polo (+) para o (-), mas os elétrons reais (carga negativa) se movem do polo (-) para o (+) (PDF p. 114).',
      'Um transformador SÓ funciona com corrente alternada (CA), porque precisa de variação contínua de fluxo magnético (dΦ/dt ≠ 0); em corrente contínua estacionária ele não induz tensão!',
    ],
    step9PracticePrompt:
      'Pratique cálculos com Lei de Ohm, associação de resistores, potência e indução eletromagnética.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre um circuito em série e um em paralelo, e por que um transformador precisa de variação de fluxo magnético?',
  },
  {
    id: 'phys-9',
    discipline: 'fisica',
    stageNumber: 9,
    title: 'Radiação Eletromagnética',
    subtitle: 'Ondas eletromagnéticas, frequência, comprimento de onda, período, espectro e propagação',
    whyNow: 'Fecha a trilha conectando eletricidade e magnetismo: campos elétricos e magnéticos oscilantes que transportam energia até no vácuo.',
    pdfPages: 'PDF p. 54, 71 e 116 (Módulos 03, 05 e 10: Frequência, Radiação e Radiações Eletromagnéticas)',
    pdfComparisonNote:
      'Alinhado diretamente ao Mapa 116 (Radiações Eletromagnéticas: onda E×B, v=λ·f, espectro do Rádio aos Raios Gama e aplicações industriais) e integrado ao Mapa 71 (Radiação Térmica).',
    subtopics: [
      { id: 'f9-ondas', title: 'Onda eletromagnética e propagação no vácuo (c = 3×10⁸ m/s)' },
      { id: 'f9-grandezas', title: 'Frequência (f), período (T) e comprimento de onda (λ)' },
      { id: 'f9-espectro', title: 'Espectro eletromagnético e aplicações industriais' },
    ],
    step1DiagnosticIntro:
      'Diagnóstico da Etapa 9: verifique seu domínio sobre frequência, período, comprimento de onda e faixas do espectro.',
    step2SimpleExplanation: [
      'Uma onda eletromagnética nasce quando cargas elétricas oscilam, criando um campo elétrico (E) e um campo magnético (B) perpendiculares entre si que vão se empurrando pelo espaço afora.',
      'Diferente do som (que é onda mecânica e precisa do ar ou da água para viajar), a onda eletromagnética NÃO precisa de meio material: ela viaja no vácuo à velocidade da luz (c ≈ 3,0 × 10⁸ m/s)!',
      'A equação fundamental v = λ · f mostra que, no vácuo (onde v = c é fixo), frequência (f) e comprimento de onda (λ) são INVERSAMENTE proporcionais: quanto maior a frequência (ex.: raios X e gama), menor o comprimento de onda e MAIOR a energia!',
    ],
    step3TechnicalConcept: [
      'Grandezas da onda (PDF p. 54 e 116): Período T (tempo de 1 oscilação, em s); Frequência f = 1/T (oscilações por segundo, em Hz). Comprimento de onda λ (distância entre duas cristas consecutivas, em m).',
      'Equação fundamental da ondulatória: v = λ · f. No vácuo: c ≈ 3,0 × 10⁸ m/s.',
      'Ordem do Espectro Eletromagnético (PDF p. 116) — da MENOR frequência / MAIOR λ para a MAIOR frequência / MENOR λ / MAIOR energia: Rádio → Micro-ondas → Infravermelho (radiação térmica) → Luz Visível (700 nm vermelho até 400 nm violeta) → Ultravioleta (UV) → Raios X → Raios Gama (γ).',
    ],
    step4WorkedExamples: [
      {
        title: 'Calculando comprimento de onda de um medidor de nível por Radar (PDF p. 56 e 116)',
        problem:
          'Um transmissor de nível tipo radar em um tanque opera na faixa de micro-ondas com frequência f = 10 GHz (10 × 10⁹ Hz = 10¹⁰ Hz). Considerando c = 3,0 × 10⁸ m/s, qual o comprimento de onda λ?',
        steps: [
          '1º passo: Usar a equação fundamental c = λ · f → λ = c / f.',
          '2º passo: λ = (3,0 × 10⁸ m/s) / (1,0 × 10¹⁰ s⁻¹) = 3,0 × 10⁻² m = 0,03 m.',
          '3º passo: Converter para centímetros: 0,03 m = 3,0 cm.',
        ],
        finalAnswer: 'Comprimento de onda λ = 0,03 m (3,0 cm).',
      },
      {
        title: 'Comparando energia e frequência no espectro',
        problem: 'Entre radiação infravermelha (termografia), luz verde e raios gama (gamagrafia), ordene em ordem crescente de frequência e comprimento de onda.',
        steps: [
          '1º passo: Na sequência do espectro (PDF p. 116), a frequência cresce de Rádio para Gama.',
          '2º passo: Frequência crescente (menor → maior): Infravermelho < Luz verde < Raios Gama.',
          '3º passo: Comprimento de onda λ é inverso da frequência: Gama < Luz verde < Infravermelho.',
        ],
        finalAnswer: 'Frequência crescente: IV < Verde < Gama · Comprimento de onda crescente: Gama < Verde < IV.',
      },
    ],
    step5IndustryApplication: {
      dailyLife:
        'Rádio FM, forno de micro-ondas, controle remoto infravermelho, iluminação visível e exames de raios X.',
      petrobrasTranspetro:
        'Aplicações diretas do PDF (p. 56, 57, 116): Radares de micro-ondas medem nível de tanques sem contato; câmeras termográficas infravermelhas detectam pontos quentes e falhas de isolamento em dutos e painéis elétricos; ensaios não destrutivos com Raios X e Raios Gama (Ir-192) inspecionam soldas de oleodutos e gasodutos; comunicação via rádio e fibra óptica suporta telemetria SCADA.',
    },
    step6FormulasAndUnits: [
      {
        expression: 'v = λ · f  |  f = 1 / T',
        description: 'Equação fundamental das ondas e relação frequência-período.',
        variables: [
          { symbol: 'v (ou c)', meaning: 'Velocidade de propagação (~3×10⁸ no vácuo)', unit: 'm/s' },
          { symbol: 'λ', meaning: 'Comprimento de onda', unit: 'm' },
          { symbol: 'f', meaning: 'Frequência', unit: 'Hz (s⁻¹)' },
          { symbol: 'T', meaning: 'Período', unit: 's' },
        ],
      },
    ],
    step7VisualModel: {
      type: '3d-em-wave',
      preset: 'em-wave-spectrum',
      caption: 'Onda Eletromagnética 3D manipulável: observe o Campo Elétrico (E) e o Campo Magnético (B) oscilando perpendicularmente à propagação.',
    },
    step8ExamTraps: [
      'Som NÃO é onda eletromagnética! Medidores de nível ultrassônicos (PDF p. 56) usam ondas mecânicas (som de alta frequência), enquanto medidores por Radar usam ondas eletromagnéticas (micro-ondas) — por isso radar funciona até no vácuo e o som não.',
      'Todas as ondas eletromagnéticas têm a MESMA velocidade no vácuo (c ≈ 3×10⁸ m/s): raios gama não viajam mais rápido que ondas de rádio no vácuo, eles apenas têm maior frequência!',
      'Na luz visível, o VERMELHO tem maior comprimento de onda (~700 nm) e menor frequência; o VIOLETA tem menor λ (~400 nm) e maior frequência.',
    ],
    step9PracticePrompt:
      'Pratique cálculos com v = λ·f, período/frequência e leitura do espectro eletromagnético.',
    step10SelfExplanationPrompt:
      'Explique com suas palavras: qual a diferença entre um medidor de nível ultrassônico e um por radar quanto à natureza da onda, e por que raios X são mais energéticos que ondas de rádio?',
  },
];
