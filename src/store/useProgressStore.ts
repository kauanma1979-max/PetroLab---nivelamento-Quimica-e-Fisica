import { useCallback, useEffect, useState } from 'react';
import {
  AITutorBridge,
  AttemptRecord,
  Discipline,
  EvaluationRecord,
  LearningModeResult,
  MasteryStatus,
  StageProgress,
  StudentProfile,
  StudentProgressState,
  SubtopicStats,
} from '../types';
import { CHEMISTRY_TRACK } from '../data/chemistryTrack';
import { PHYSICS_TRACK } from '../data/physicsTrack';

const STORAGE_KEY = 'petrolab_nivelamento_v1';
const LEGACY_STORAGE_KEY = 'petralab_nivelamento_v1';
const IDB_NAME = 'petrolab_db';
const IDB_STORE = 'progress_backup';
const IDB_KEY = 'state_v1';

function createInitialStageProgress(unlocked: boolean): StageProgress {
  return {
    diagnosticCompleted: false,
    diagnosticScorePercent: null,
    studiedSubtopics: [],
    masteredSubtopics: [],
    selfExplanation: '',
    evaluationCompleted: false,
    bestEvaluationPercent: null,
    unlocked,
    completed: false,
    lastStudiedAt: null,
  };
}

export function createDefaultState(): StudentProgressState {
  const chemistryStages: Record<number, StageProgress> = {};
  CHEMISTRY_TRACK.forEach((stage) => {
    chemistryStages[stage.stageNumber] = createInitialStageProgress(stage.stageNumber === 1);
  });

  const physicsStages: Record<number, StageProgress> = {};
  PHYSICS_TRACK.forEach((stage) => {
    physicsStages[stage.stageNumber] = createInitialStageProgress(stage.stageNumber === 1);
  });

  const subtopicStats: Record<string, SubtopicStats> = {};
  [...CHEMISTRY_TRACK, ...PHYSICS_TRACK].forEach((stage) => {
    stage.subtopics.forEach((sub) => {
      subtopicStats[sub.id] = {
        subtopicId: sub.id,
        subtopicTitle: sub.title,
        discipline: stage.discipline,
        stageNumber: stage.stageNumber,
        generatedCount: 0,
        answeredCount: 0,
        correctCount: 0,
        wrongCount: 0,
        attempts: 0,
        lastReviewedAt: null,
        status: 'nao_iniciado',
      };
    });
  });

  return {
    profile: null,
    chemistryStages,
    physicsStages,
    attempts: [],
    evaluations: [],
    subtopicStats,
    generatedQuestionIds: [],
    watchedVideoIds: [],
    favoriteFormulaIds: [],
    studySeconds: {
      quimica: 0,
      fisica: 0,
    },
    periodicLearningStats: [],
    lastRecommended: {
      discipline: 'quimica',
      stageNumber: 1,
    },
  };
}

function normalizeLoadedState(raw: Partial<StudentProgressState> | null): StudentProgressState {
  const defaults = createDefaultState();
  if (!raw) return defaults;

  const mergedChem: Record<number, StageProgress> = { ...defaults.chemistryStages };
  if (raw.chemistryStages) {
    Object.keys(defaults.chemistryStages).forEach((k) => {
      const num = Number(k);
      if (raw.chemistryStages?.[num]) {
        mergedChem[num] = {
          ...defaults.chemistryStages[num],
          ...raw.chemistryStages[num],
        };
      }
    });
  }
  mergedChem[1].unlocked = true;

  const mergedPhys: Record<number, StageProgress> = { ...defaults.physicsStages };
  if (raw.physicsStages) {
    Object.keys(defaults.physicsStages).forEach((k) => {
      const num = Number(k);
      if (raw.physicsStages?.[num]) {
        mergedPhys[num] = {
          ...defaults.physicsStages[num],
          ...raw.physicsStages[num],
        };
      }
    });
  }
  mergedPhys[1].unlocked = true;

  const mergedSubtopics: Record<string, SubtopicStats> = { ...defaults.subtopicStats };
  if (raw.subtopicStats) {
    Object.keys(defaults.subtopicStats).forEach((subId) => {
      if (raw.subtopicStats?.[subId]) {
        mergedSubtopics[subId] = {
          ...defaults.subtopicStats[subId],
          ...raw.subtopicStats[subId],
        };
      }
    });
  }

  return {
    profile: raw.profile ?? null,
    chemistryStages: mergedChem,
    physicsStages: mergedPhys,
    attempts: Array.isArray(raw.attempts) ? raw.attempts : [],
    evaluations: Array.isArray(raw.evaluations) ? raw.evaluations : [],
    subtopicStats: mergedSubtopics,
    generatedQuestionIds: Array.isArray(raw.generatedQuestionIds) ? raw.generatedQuestionIds : [],
    watchedVideoIds: Array.isArray(raw.watchedVideoIds) ? raw.watchedVideoIds : [],
    favoriteFormulaIds: Array.isArray(raw.favoriteFormulaIds) ? raw.favoriteFormulaIds : [],
    studySeconds: raw.studySeconds ?? { quimica: 0, fisica: 0 },
    periodicLearningStats: Array.isArray(raw.periodicLearningStats) ? raw.periodicLearningStats : [],
    lastRecommended: raw.lastRecommended ?? { discipline: 'quimica', stageNumber: 1 },
  };
}

function loadFromLocalStorage(): StudentProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return createDefaultState();
    return normalizeLoadedState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

async function saveToIndexedDB(state: StudentProgressState) {
  if (typeof indexedDB === 'undefined') return;
  try {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(state, IDB_KEY);
    };
  } catch {
    // IndexedDB opcional (localStorage já persiste)
  }
}

async function loadFromIndexedDB(): Promise<StudentProgressState | null> {
  if (typeof indexedDB === 'undefined') return null;
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const getReq = tx.objectStore(IDB_STORE).get(IDB_KEY);
        getReq.onsuccess = () => {
          resolve(getReq.result ? normalizeLoadedState(getReq.result) : null);
        };
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function computeStatus(stats: SubtopicStats): MasteryStatus {
  if (stats.answeredCount === 0) {
    return stats.generatedCount > 0 ? 'em_aprendizado' : 'nao_iniciado';
  }
  const accuracy = stats.correctCount / stats.answeredCount;
  if (accuracy >= 0.8 && stats.correctCount >= 1) {
    return 'dominado';
  }
  if (stats.wrongCount > 0) {
    return 'em_revisao';
  }
  return 'em_aprendizado';
}

// Ponte preparada para futura conexão com tutor inteligente em nuvem
export const aiTutorBridge: AITutorBridge = {
  isConfigured: false,
  async generateTargetedFeedback({ discipline, stageNumber, weakSubtopics, studentExplanation }) {
    const discName = discipline === 'quimica' ? 'Química' : 'Física';
    const weakText =
      weakSubtopics.length > 0
        ? `Subtópicos prioritários para revisão imediata: ${weakSubtopics.join(', ')}.`
        : 'Revise os exemplos passo a passo e as pegadinhas da etapa.';
    const explHint =
      studentExplanation.trim().length < 25
        ? 'Sua autoexplicação ficou muito curta — tente reescrever com causa, conceito e exemplo prático.'
        : 'Sua autoexplicação foi registrada no histórico pedagógico.';
    return `Diagnóstico do Tutor Local (${discName} · Etapa ${stageNumber}): ${weakText} ${explHint}`;
  },
};

export function useProgressStore() {
  const [state, setState] = useState<StudentProgressState>(() => loadFromLocalStorage());

  // Hidrata do IndexedDB caso localStorage esteja vazio (ex.: cache limpo parcialmente)
  useEffect(() => {
    let mounted = true;
    if (!localStorage.getItem(STORAGE_KEY) && !localStorage.getItem(LEGACY_STORAGE_KEY)) {
      loadFromIndexedDB().then((idbState) => {
        if (mounted && idbState) {
          setState(idbState);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignora erro de quota
    }
    saveToIndexedDB(state);
  }, [state]);

  const setProfile = useCallback((profile: StudentProfile | null) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const addStudySeconds = useCallback((discipline: Discipline, seconds: number) => {
    setState((prev) => ({
      ...prev,
      studySeconds: {
        ...prev.studySeconds,
        [discipline]: prev.studySeconds[discipline] + seconds,
      },
    }));
  }, []);

  const registerGeneratedQuestions = useCallback((questionIds: string[], subtopicIds: string[]) => {
    setState((prev) => {
      const idSet = new Set(prev.generatedQuestionIds);
      let changed = false;
      questionIds.forEach((id) => {
        if (!idSet.has(id)) {
          idSet.add(id);
          changed = true;
        }
      });

      const nextSubtopics = { ...prev.subtopicStats };
      subtopicIds.forEach((subId) => {
        const cur = nextSubtopics[subId];
        if (cur && cur.generatedCount === 0) {
          nextSubtopics[subId] = {
            ...cur,
            generatedCount: cur.generatedCount + 1,
          };
          changed = true;
        }
      });

      if (!changed) return prev;
      return {
        ...prev,
        generatedQuestionIds: Array.from(idSet),
        subtopicStats: nextSubtopics,
      };
    });
  }, []);

  const markSubtopicStudied = useCallback(
    (discipline: Discipline, stageNumber: number, subtopicId: string) => {
      setState((prev) => {
        const key = discipline === 'quimica' ? 'chemistryStages' : 'physicsStages';
        const stages = prev[key];
        const stage = stages[stageNumber];
        if (!stage) return prev;

        const studied = stage.studiedSubtopics.includes(subtopicId)
          ? stage.studiedSubtopics
          : [...stage.studiedSubtopics, subtopicId];

        const curStat = prev.subtopicStats[subtopicId];
        const nextSubtopics = { ...prev.subtopicStats };
        if (curStat && curStat.status === 'nao_iniciado') {
          nextSubtopics[subtopicId] = {
            ...curStat,
            status: 'em_aprendizado',
            lastReviewedAt: new Date().toISOString(),
          };
        }

        return {
          ...prev,
          [key]: {
            ...stages,
            [stageNumber]: {
              ...stage,
              studiedSubtopics: studied,
              lastStudiedAt: new Date().toISOString(),
            },
          },
          subtopicStats: nextSubtopics,
          lastRecommended: { discipline, stageNumber },
        };
      });
    },
    []
  );

  const recordQuestionAttempt = useCallback(
    (attempt: Omit<AttemptRecord, 'id' | 'timestamp'>) => {
      const now = new Date().toISOString();
      const newAttempt: AttemptRecord = {
        ...attempt,
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: now,
      };

      setState((prev) => {
        const nextSubtopics = { ...prev.subtopicStats };
        const existing = nextSubtopics[attempt.subtopicId];
        if (existing) {
          const updated: SubtopicStats = {
            ...existing,
            answeredCount: existing.answeredCount + 1,
            correctCount: existing.correctCount + (attempt.isCorrect ? 1 : 0),
            wrongCount: existing.wrongCount + (attempt.isCorrect ? 0 : 1),
            attempts: existing.attempts + 1,
            lastReviewedAt: now,
            status: existing.status,
          };
          updated.status = computeStatus(updated);
          nextSubtopics[attempt.subtopicId] = updated;
        }

        const key = attempt.discipline === 'quimica' ? 'chemistryStages' : 'physicsStages';
        const stages = { ...prev[key] };
        const stage = stages[attempt.stageNumber];
        if (stage) {
          const studied = stage.studiedSubtopics.includes(attempt.subtopicId)
            ? stage.studiedSubtopics
            : [...stage.studiedSubtopics, attempt.subtopicId];
          const mastered =
            attempt.isCorrect && !stage.masteredSubtopics.includes(attempt.subtopicId)
              ? [...stage.masteredSubtopics, attempt.subtopicId]
              : stage.masteredSubtopics;
          stages[attempt.stageNumber] = {
            ...stage,
            studiedSubtopics: studied,
            masteredSubtopics: mastered,
            lastStudiedAt: now,
          };
        }

        const genIds = prev.generatedQuestionIds.includes(attempt.questionId)
          ? prev.generatedQuestionIds
          : [...prev.generatedQuestionIds, attempt.questionId];

        return {
          ...prev,
          attempts: [...prev.attempts, newAttempt],
          subtopicStats: nextSubtopics,
          [key]: stages,
          generatedQuestionIds: genIds,
        };
      });
    },
    []
  );

  const completeDiagnostic = useCallback(
    (discipline: Discipline, stageNumber: number, scorePercent: number) => {
      setState((prev) => {
        const key = discipline === 'quimica' ? 'chemistryStages' : 'physicsStages';
        const stages = prev[key];
        const stage = stages[stageNumber];
        if (!stage) return prev;
        return {
          ...prev,
          [key]: {
            ...stages,
            [stageNumber]: {
              ...stage,
              diagnosticCompleted: true,
              diagnosticScorePercent: scorePercent,
              lastStudiedAt: new Date().toISOString(),
            },
          },
          lastRecommended: { discipline, stageNumber },
        };
      });
    },
    []
  );

  const submitStageEvaluation = useCallback(
    (params: {
      discipline: Discipline;
      stageNumber: number;
      correctCount: number;
      totalQuestions: number;
      selfExplanation: string;
      weakSubtopics: string[];
    }): { passed: boolean; scorePercent: number } => {
      const { discipline, stageNumber, correctCount, totalQuestions, selfExplanation, weakSubtopics } =
        params;
      const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const hasValidExplanation = selfExplanation.trim().length >= 25;
      const passed = scorePercent >= 80 && hasValidExplanation;
      const now = new Date().toISOString();

      const evalRecord: EvaluationRecord = {
        id: `eval-${Date.now()}`,
        discipline,
        stageNumber,
        scorePercent,
        totalQuestions,
        correctCount,
        passed,
        selfExplanation: selfExplanation.trim(),
        weakSubtopics,
        timestamp: now,
      };

      setState((prev) => {
        const key = discipline === 'quimica' ? 'chemistryStages' : 'physicsStages';
        const stages = { ...prev[key] };
        const currentStage = stages[stageNumber];
        const maxStage = discipline === 'quimica' ? CHEMISTRY_TRACK.length : PHYSICS_TRACK.length;

        if (currentStage) {
          const prevBest = currentStage.bestEvaluationPercent ?? 0;
          const track = discipline === 'quimica' ? CHEMISTRY_TRACK : PHYSICS_TRACK;
          const trackStage = track.find((s) => s.stageNumber === stageNumber);
          const allStageSubtopics = trackStage ? trackStage.subtopics.map((s) => s.id) : [];

          stages[stageNumber] = {
            ...currentStage,
            selfExplanation: selfExplanation.trim() || currentStage.selfExplanation,
            evaluationCompleted: currentStage.evaluationCompleted || passed,
            bestEvaluationPercent: Math.max(prevBest, scorePercent),
            completed: currentStage.completed || passed,
            studiedSubtopics: Array.from(
              new Set([...currentStage.studiedSubtopics, ...allStageSubtopics])
            ),
            masteredSubtopics: passed
              ? Array.from(new Set([...currentStage.masteredSubtopics, ...allStageSubtopics]))
              : currentStage.masteredSubtopics,
            lastStudiedAt: now,
          };
        }

        if (passed && stageNumber < maxStage && stages[stageNumber + 1]) {
          stages[stageNumber + 1] = {
            ...stages[stageNumber + 1],
            unlocked: true,
          };
        }

        // Atualiza status dos subtópicos avaliados
        const nextSubtopics = { ...prev.subtopicStats };
        if (passed) {
          Object.values(nextSubtopics).forEach((stat) => {
            if (stat.discipline === discipline && stat.stageNumber === stageNumber) {
              nextSubtopics[stat.subtopicId] = {
                ...stat,
                status: 'dominado',
                lastReviewedAt: now,
              };
            }
          });
        }

        const nextStageNum = passed && stageNumber < maxStage ? stageNumber + 1 : stageNumber;

        return {
          ...prev,
          [key]: stages,
          evaluations: [...prev.evaluations, evalRecord],
          subtopicStats: nextSubtopics,
          lastRecommended: {
            discipline,
            stageNumber: nextStageNum,
          },
        };
      });

      return { passed, scorePercent };
    },
    []
  );

  const toggleVideoWatched = useCallback((videoId: string) => {
    setState((prev) => {
      const exists = prev.watchedVideoIds.includes(videoId);
      return {
        ...prev,
        watchedVideoIds: exists
          ? prev.watchedVideoIds.filter((id) => id !== videoId)
          : [...prev.watchedVideoIds, videoId],
      };
    });
  }, []);

  const toggleFavoriteFormula = useCallback((formulaId: string) => {
    setState((prev) => {
      const exists = prev.favoriteFormulaIds.includes(formulaId);
      return {
        ...prev,
        favoriteFormulaIds: exists
          ? prev.favoriteFormulaIds.filter((id) => id !== formulaId)
          : [...prev.favoriteFormulaIds, formulaId],
      };
    });
  }, []);

  const recordPeriodicLearning = useCallback((result: Omit<LearningModeResult, 'timestamp'>) => {
    setState((prev) => ({
      ...prev,
      periodicLearningStats: [
        ...prev.periodicLearningStats,
        { ...result, timestamp: new Date().toISOString() },
      ],
    }));
  }, []);

  const exportBackupJSON = useCallback(() => {
    return JSON.stringify(
      {
        app: 'PetroLab',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        data: state,
      },
      null,
      2
    );
  }, [state]);

  const importBackupJSON = useCallback((jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText) as Record<string, unknown> | null;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;

      const isWrappedPetroLab =
        (parsed.app === 'PetroLab' || parsed.app === 'PetraLab') &&
        parsed.data &&
        typeof parsed.data === 'object';

      const candidate = isWrappedPetroLab
        ? (parsed.data as Partial<StudentProgressState>)
        : (parsed as Partial<StudentProgressState>);

      const hasValidDomainKeys =
        Boolean(candidate.chemistryStages && typeof candidate.chemistryStages === 'object') &&
        Boolean(candidate.physicsStages && typeof candidate.physicsStages === 'object') &&
        Boolean(candidate.subtopicStats && typeof candidate.subtopicStats === 'object');

      if (!hasValidDomainKeys) return false;

      const normalized = normalizeLoadedState(candidate);
      setState(normalized);
      return true;
    } catch {
      return false;
    }
  }, []);

  const restoreSnapshot = useCallback((snapshot: StudentProgressState) => {
    setState(normalizeLoadedState(snapshot));
  }, []);

  const resetProgressWithConfirm = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
  }, []);

  return {
    state,
    setProfile,
    addStudySeconds,
    registerGeneratedQuestions,
    markSubtopicStudied,
    recordQuestionAttempt,
    completeDiagnostic,
    submitStageEvaluation,
    toggleVideoWatched,
    toggleFavoriteFormula,
    recordPeriodicLearning,
    exportBackupJSON,
    importBackupJSON,
    restoreSnapshot,
    resetProgressWithConfirm,
  };
}
