import { Discipline, Question, QuestionLevel } from '../types';
import { CHEMISTRY_QUESTIONS } from './chemistryQuestions';
import { PHYSICS_QUESTIONS } from './physicsQuestions';

export const ALL_QUESTIONS: Question[] = [
  ...CHEMISTRY_QUESTIONS,
  ...PHYSICS_QUESTIONS,
];

export function getQuestionsByDiscipline(discipline: Discipline): Question[] {
  return ALL_QUESTIONS.filter((q) => q.discipline === discipline);
}

export function getQuestionsByStage(discipline: Discipline, stageNumber: number): Question[] {
  return ALL_QUESTIONS.filter(
    (q) => q.discipline === discipline && q.stageNumber === stageNumber
  );
}

export function getDiagnosticQuestions(discipline: Discipline, stageNumber: number): Question[] {
  const stageQuestions = getQuestionsByStage(discipline, stageNumber);
  const diagnostics = stageQuestions.filter((q) => q.isDiagnostic);
  return diagnostics.length >= 2 ? diagnostics : stageQuestions.slice(0, 2);
}

export function getPracticeQuestions(discipline: Discipline, stageNumber: number): Question[] {
  return getQuestionsByStage(discipline, stageNumber).filter((q) => !q.isDiagnostic);
}

/**
 * Selects evaluation or retry questions prioritizing:
 * 1) Weak subtopics (when retrying after failure),
 * 2) Unanswered / least recently seen questions to avoid repeating identical tests.
 */
export function selectAdaptiveEvaluationQuestions(
  discipline: Discipline,
  stageNumber: number,
  options: {
    weakSubtopicIds?: string[];
    excludeIds?: string[];
    count?: number;
  } = {}
): Question[] {
  const { weakSubtopicIds = [], excludeIds = [], count = 5 } = options;
  const stagePool = getQuestionsByStage(discipline, stageNumber);
  const crossPool = getQuestionsByDiscipline(discipline).filter(
    (q) => q.stageNumber <= stageNumber
  );

  const sortPriority = (list: Question[]) =>
    [...list].sort((a, b) => {
      const aExcluded = excludeIds.includes(a.id) ? 1 : 0;
      const bExcluded = excludeIds.includes(b.id) ? 1 : 0;
      if (aExcluded !== bExcluded) return aExcluded - bExcluded;

      const aWeak = weakSubtopicIds.includes(a.subtopicId) ? 0 : 1;
      const bWeak = weakSubtopicIds.includes(b.subtopicId) ? 0 : 1;
      if (aWeak !== bWeak) return aWeak - bWeak;

      const levelOrder: Record<QuestionLevel, number> = {
        basico: 0,
        intermediario: 1,
        avancado: 2,
        cesgranrio: 3,
      };
      return levelOrder[b.level] - levelOrder[a.level];
    });

  const prioritizedStage = sortPriority(stagePool);
  const selected = prioritizedStage.slice(0, count);

  if (selected.length < count) {
    const usedIds = new Set(selected.map((q) => q.id));
    for (const q of sortPriority(crossPool)) {
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
      }
      if (selected.length >= count) break;
    }
  }

  return selected;
}
