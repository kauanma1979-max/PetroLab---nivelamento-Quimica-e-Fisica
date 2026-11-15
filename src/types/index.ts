export type Discipline = 'quimica' | 'fisica';

export type TabId =
  | 'dashboard'
  | 'chemistry'
  | 'physics'
  | 'periodic-table'
  | 'lab'
  | 'questions'
  | 'videos'
  | 'formulas'
  | 'maps'
  | 'correlations'
  | 'performance';

export type QuestionLevel = 'basico' | 'intermediario' | 'avancado' | 'cesgranrio';

export type MasteryStatus = 'nao_iniciado' | 'em_aprendizado' | 'em_revisao' | 'dominado';

export interface OptionItem {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  justification: string;
}

export interface Question {
  id: string;
  discipline: Discipline;
  stageNumber: number;
  subtopicId: string;
  subtopicTitle: string;
  level: QuestionLevel;
  isDiagnostic?: boolean;
  prompt: string;
  options: OptionItem[];
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  detailedExplanation: string;
  trapWarning: string;
  conceptToReview: string;
  pdfReference?: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  steps: string[];
  finalAnswer: string;
}

export interface FormulaSnippet {
  expression: string;
  description: string;
  variables: { symbol: string; meaning: string; unit: string }[];
}

export interface VisualModelConfig {
  type: '3d-atom' | '3d-molecule' | '3d-em-wave' | '3d-inclined-plane' | 'svg-diagram';
  preset: string;
  caption: string;
}

export interface StageContent {
  id: string;
  discipline: Discipline;
  stageNumber: number;
  title: string;
  subtitle: string;
  whyNow: string;
  pdfPages: string;
  pdfComparisonNote: string;
  subtopics: { id: string; title: string }[];
  // 10-step Intelligent Professor Methodology
  step1DiagnosticIntro: string;
  step2SimpleExplanation: string[];
  step3TechnicalConcept: string[];
  step4WorkedExamples: WorkedExample[];
  step5IndustryApplication: {
    dailyLife: string;
    petrobrasTranspetro: string;
  };
  step6FormulasAndUnits: FormulaSnippet[];
  step7VisualModel: VisualModelConfig;
  step8ExamTraps: string[];
  step9PracticePrompt: string;
  step10SelfExplanationPrompt: string;
}

export interface PeriodicElement {
  atomicNumber: number;
  symbol: string;
  namePt: string;
  atomicMass: string;
  atomicMassNumeric: number | null;
  isEstimatedMass: boolean;
  group: number | null; // 1-18, null for lanthanides/actinides in f-block display if needed, though IUPAC places them in group 3
  gridCol: number; // 1-18 for standard 18-col table
  gridRow: number; // 1-9 (rows 8 and 9 for La/Ac series)
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  category:
    | 'nao-metal'
    | 'gas-nobre'
    | 'metal-alcalino'
    | 'metal-alcalino-terroso'
    | 'semimetal'
    | 'halogenio'
    | 'metal-transicao'
    | 'metal-pos-transicao'
    | 'lantanideo'
    | 'actinideo';
  electronConfiguration: string;
  shells: number[];
  standardState: 'solido' | 'liquido' | 'gasoso' | 'desconhecido';
  electronegativity: number | null; // Pauling scale
  atomicRadiusPm: number | null; // Empirical/calculated covalent or van der Waals / metallic reference in pm
  ionizationEnergyEv: number | null; // First ionization energy in eV
  electronAffinityEv: number | null; // Electron affinity in eV
  commonOxidationStates: string;
  industrialApplications: string;
  discoveryAndCuriosity: string;
  dataSource: string;
}

export interface FormulaLibraryItem {
  id: string;
  discipline: Discipline;
  stageNumber: number;
  title: string;
  expression: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  whenToUse: string;
  solvedExample: {
    statement: string;
    steps: string[];
    result: string;
  };
  commonMistakes: string[];
  quickQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  pdfReference: string;
}

export interface VideoResource {
  id: string;
  discipline: Discipline;
  stageNumber: number;
  topic: string;
  title: string;
  channel: string;
  url: string;
  linkType: 'video' | 'busca' | 'curso';
  description: string;
}

export interface AttemptRecord {
  id: string;
  questionId: string;
  discipline: Discipline;
  stageNumber: number;
  subtopicId: string;
  subtopicTitle: string;
  selectedLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  timestamp: string;
  mode: 'diagnostico' | 'fixacao' | 'avaliacao' | 'banco' | 'formula';
}

export interface EvaluationRecord {
  id: string;
  discipline: Discipline;
  stageNumber: number;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  selfExplanation: string;
  weakSubtopics: string[];
  timestamp: string;
}

export interface StageProgress {
  diagnosticCompleted: boolean;
  diagnosticScorePercent: number | null;
  studiedSubtopics: string[];
  masteredSubtopics: string[];
  selfExplanation: string;
  evaluationCompleted: boolean;
  bestEvaluationPercent: number | null;
  unlocked: boolean;
  completed: boolean;
  lastStudiedAt: string | null;
}

export interface SubtopicStats {
  subtopicId: string;
  subtopicTitle: string;
  discipline: Discipline;
  stageNumber: number;
  generatedCount: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  attempts: number;
  lastReviewedAt: string | null;
  status: MasteryStatus;
}

export interface StudentProfile {
  name: string;
  targetExam: string;
  createdAt: string;
}

export interface LearningModeResult {
  challengeType: string;
  correct: boolean;
  timestamp: string;
  elementSymbol: string;
}

export interface StudentProgressState {
  profile: StudentProfile | null;
  chemistryStages: Record<number, StageProgress>;
  physicsStages: Record<number, StageProgress>;
  attempts: AttemptRecord[];
  evaluations: EvaluationRecord[];
  subtopicStats: Record<string, SubtopicStats>;
  generatedQuestionIds: string[];
  watchedVideoIds: string[];
  favoriteFormulaIds: string[];
  studySeconds: {
    quimica: number;
    fisica: number;
  };
  periodicLearningStats: LearningModeResult[];
  lastRecommended: {
    discipline: Discipline;
    stageNumber: number;
  };
}

// Prepared interface for future AI integration (Section 13)
export interface AITutorBridge {
  isConfigured: boolean;
  generateTargetedFeedback: (context: {
    discipline: Discipline;
    stageNumber: number;
    weakSubtopics: string[];
    studentExplanation: string;
  }) => Promise<string>;
}
