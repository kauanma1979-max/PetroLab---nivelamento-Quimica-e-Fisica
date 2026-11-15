import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpen,
  Clock,
  FlaskConical,
  HelpCircle,
  PlaySquare,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { CHEMISTRY_TRACK } from '../data/chemistryTrack';
import { FORMULA_LIBRARY } from '../data/formulas';
import { PHYSICS_TRACK } from '../data/physicsTrack';
import { ALL_QUESTIONS } from '../data/questionBank';
import { VIDEO_RESOURCES } from '../data/videos';
import { AttemptRecord, Discipline, QuestionLevel, StudentProgressState, TabId } from '../types';

interface CorrelationsDashboardViewProps {
  state: StudentProgressState;
  onNavigate: (tab: TabId) => void;
  onOpenStage: (discipline: Discipline, stageNumber: number) => void;
}

type DiscFilter = 'all' | Discipline;
type TimeWindow = 'all' | '7d' | '24h' | 'last20';

function computePearsonR(xs: number[], ys: number[]): number | null {
  if (xs.length < 3 || xs.length !== ys.length) return null;
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const denom = Math.sqrt(denX * denY);
  if (denom === 0) return null;
  return num / denom;
}

function describePearson(r: number | null): { label: string; tone: string } {
  if (r === null) return { label: 'Amostra em formação', tone: 'text-[var(--color-text-muted)]' };
  const abs = Math.abs(r);
  const dir = r >= 0 ? 'positiva' : 'inversa';
  if (abs >= 0.7) {
    return {
      label: `Correlação ${dir} forte`,
      tone: r >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]',
    };
  }
  if (abs >= 0.4) {
    return {
      label: `Correlação ${dir} moderada`,
      tone: 'text-[var(--color-primary)]',
    };
  }
  return {
    label: `Correlação ${dir} inicial`,
    tone: 'text-[var(--color-text-secondary)]',
  };
}

function formatDurationShort(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 min';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m} min`;
  return `${totalSeconds} s`;
}

const MODE_LABELS: Record<AttemptRecord['mode'], string> = {
  diagnostico: 'Diagnóstico',
  fixacao: 'Fixação (Trilha)',
  avaliacao: 'Avaliação Final',
  banco: 'Banco de Questões',
  formula: 'Fórmulas',
};

const LEVEL_LABELS: Record<QuestionLevel, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  cesgranrio: 'Estilo CESGRANRIO',
};

export function CorrelationsDashboardView({
  state,
  onNavigate,
  onOpenStage,
}: CorrelationsDashboardViewProps) {
  const [discFilter, setDiscFilter] = useState<DiscFilter>('all');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [selectedTimelineIdx, setSelectedTimelineIdx] = useState<number | null>(null);
  const [hoveredStageKey, setHoveredStageKey] = useState<string | null>(null);

  const questionLevelMap = useMemo(() => {
    const map: Record<string, QuestionLevel> = {};
    ALL_QUESTIONS.forEach((q) => {
      map[q.id] = q.level;
    });
    return map;
  }, []);

  const filteredAttempts = useMemo(() => {
    const now = Date.now();
    let list = state.attempts.filter((a) =>
      discFilter === 'all' ? true : a.discipline === discFilter
    );
    if (timeWindow === '7d') {
      list = list.filter((a) => now - new Date(a.timestamp).getTime() <= 7 * 24 * 3600 * 1000);
    } else if (timeWindow === '24h') {
      list = list.filter((a) => now - new Date(a.timestamp).getTime() <= 24 * 3600 * 1000);
    } else if (timeWindow === 'last20') {
      list = list.slice(-20);
    }
    return list;
  }, [state.attempts, discFilter, timeWindow]);

  const filteredEvaluations = useMemo(() => {
    const now = Date.now();
    return state.evaluations
      .filter((e) => (discFilter === 'all' ? true : e.discipline === discFilter))
      .filter((e) => {
        if (timeWindow === '7d') return now - new Date(e.timestamp).getTime() <= 7 * 24 * 3600 * 1000;
        if (timeWindow === '24h') return now - new Date(e.timestamp).getTime() <= 24 * 3600 * 1000;
        return true;
      });
  }, [state.evaluations, discFilter, timeWindow]);

  // Matriz completa por etapa cruzando Trilha + Questões + Vídeos + Fórmulas
  const stageMatrix = useMemo(() => {
    const allStages = [...CHEMISTRY_TRACK, ...PHYSICS_TRACK].filter((s) =>
      discFilter === 'all' ? true : s.discipline === discFilter
    );

    return allStages.map((stage) => {
      const progressMap =
        stage.discipline === 'quimica' ? state.chemistryStages : state.physicsStages;
      const prog = progressMap[stage.stageNumber];
      const stageAttempts = filteredAttempts.filter(
        (a) => a.discipline === stage.discipline && a.stageNumber === stage.stageNumber
      );
      const correct = stageAttempts.filter((a) => a.isCorrect).length;
      const accuracyPct =
        stageAttempts.length > 0 ? Math.round((correct / stageAttempts.length) * 100) : null;

      const stageVideos = VIDEO_RESOURCES.filter(
        (v) => v.discipline === stage.discipline && v.stageNumber === stage.stageNumber
      );
      const watchedVideos = stageVideos.filter((v) => state.watchedVideoIds.includes(v.id)).length;

      const stageFormulas = FORMULA_LIBRARY.filter(
        (f) => f.discipline === stage.discipline && f.stageNumber === stage.stageNumber
      );
      const favFormulas = stageFormulas.filter((f) => state.favoriteFormulaIds.includes(f.id)).length;

      const studiedPct =
        stage.subtopics.length > 0
          ? Math.round(((prog?.studiedSubtopics.length ?? 0) / stage.subtopics.length) * 100)
          : 0;

      const currentPerformancePct =
        prog?.bestEvaluationPercent !== null && prog?.bestEvaluationPercent !== undefined
          ? prog.bestEvaluationPercent
          : accuracyPct;

      return {
        key: `${stage.discipline}-${stage.stageNumber}`,
        shortCode: `${stage.discipline === 'quimica' ? 'Q' : 'F'}${stage.stageNumber}`,
        discipline: stage.discipline,
        stageNumber: stage.stageNumber,
        title: stage.title,
        unlocked: Boolean(prog?.unlocked),
        completed: Boolean(prog?.completed),
        diagnosticPct: prog?.diagnosticScorePercent ?? null,
        bestEvalPct: prog?.bestEvaluationPercent ?? null,
        currentPerformancePct,
        attemptsCount: stageAttempts.length,
        accuracyPct,
        videosTotal: stageVideos.length,
        videosWatched: watchedVideos,
        formulasTotal: stageFormulas.length,
        formulasFav: favFormulas,
        studiedPct,
        selfExplanationLength: prog?.selfExplanation?.trim().length ?? 0,
      };
    });
  }, [
    discFilter,
    state.chemistryStages,
    state.physicsStages,
    state.watchedVideoIds,
    state.favoriteFormulaIds,
    filteredAttempts,
  ]);

  // KPIs de correlação cruzada
  const kpis = useMemo(() => {
    const relevantStagesCount =
      discFilter === 'quimica'
        ? CHEMISTRY_TRACK.length
        : discFilter === 'fisica'
          ? PHYSICS_TRACK.length
          : CHEMISTRY_TRACK.length + PHYSICS_TRACK.length;

    const completedStages = stageMatrix.filter((s) => s.completed).length;
    const stageCompletionPct = (completedStages / relevantStagesCount) * 100;

    const totalAnswered = filteredAttempts.length;
    const totalCorrect = filteredAttempts.filter((a) => a.isCorrect).length;
    const accuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const relevantVideos = VIDEO_RESOURCES.filter((v) =>
      discFilter === 'all' ? true : v.discipline === discFilter
    );
    const watchedVideosCount = relevantVideos.filter((v) =>
      state.watchedVideoIds.includes(v.id)
    ).length;
    const videoCoveragePct =
      relevantVideos.length > 0 ? (watchedVideosCount / relevantVideos.length) * 100 : 0;

    const periodicTotal = state.periodicLearningStats.length;
    const periodicCorrect = state.periodicLearningStats.filter((p) => p.correct).length;
    const periodicAccPct =
      periodicTotal > 0 ? Math.round((periodicCorrect / periodicTotal) * 100) : 0;

    const readinessScore = Math.round(
      stageCompletionPct * 0.4 +
        accuracyPct * 0.35 +
        videoCoveragePct * 0.15 +
        (discFilter === 'fisica' ? accuracyPct : periodicAccPct) * 0.1
    );

    // Ganho Diagnóstico -> Avaliação
    const diagAndEvalStages = stageMatrix.filter(
      (s) => s.diagnosticPct !== null && s.bestEvalPct !== null
    );
    const avgGain =
      diagAndEvalStages.length > 0
        ? Math.round(
            diagAndEvalStages.reduce(
              (sum, s) => sum + ((s.bestEvalPct ?? 0) - (s.diagnosticPct ?? 0)),
              0
            ) / diagAndEvalStages.length
          )
        : null;

    // Correlação Videoaulas assistidas x Acurácia na etapa
    const stagesWithVideoAndAttempts = stageMatrix.filter(
      (s) => s.videosWatched > 0 && s.accuracyPct !== null
    );
    const stagesWithoutVideoWithAttempts = stageMatrix.filter(
      (s) => s.videosWatched === 0 && s.accuracyPct !== null
    );
    const accWithVideo =
      stagesWithVideoAndAttempts.length > 0
        ? Math.round(
            stagesWithVideoAndAttempts.reduce((acc, s) => acc + (s.accuracyPct ?? 0), 0) /
              stagesWithVideoAndAttempts.length
          )
        : null;
    const accWithoutVideo =
      stagesWithoutVideoWithAttempts.length > 0
        ? Math.round(
            stagesWithoutVideoWithAttempts.reduce((acc, s) => acc + (s.accuracyPct ?? 0), 0) /
              stagesWithoutVideoWithAttempts.length
          )
        : null;

    // Prática média em etapas aprovadas vs não aprovadas
    const passedStages = stageMatrix.filter((s) => s.completed);
    const openActiveStages = stageMatrix.filter((s) => !s.completed && s.attemptsCount > 0);
    const avgAttemptsPassed =
      passedStages.length > 0
        ? +(passedStages.reduce((a, s) => a + s.attemptsCount, 0) / passedStages.length).toFixed(1)
        : null;
    const avgAttemptsOpen =
      openActiveStages.length > 0
        ? +(
            openActiveStages.reduce((a, s) => a + s.attemptsCount, 0) / openActiveStages.length
          ).toFixed(1)
        : null;

    return {
      readinessScore,
      completedStages,
      relevantStagesCount,
      totalAnswered,
      accuracyPct,
      watchedVideosCount,
      relevantVideosCount: relevantVideos.length,
      periodicTotal,
      periodicAccPct,
      avgGain,
      diagAndEvalCount: diagAndEvalStages.length,
      accWithVideo,
      accWithoutVideo,
      avgAttemptsPassed,
      avgAttemptsOpen,
    };
  }, [discFilter, stageMatrix, filteredAttempts, state.watchedVideoIds, state.periodicLearningStats]);

  // Série temporal para Curva de Evolução (média acumulada + janela móvel de até 5)
  const timelinePoints = useMemo(() => {
    if (filteredAttempts.length === 0) return [];
    const maxPoints = 18;
    const step = Math.max(1, Math.ceil(filteredAttempts.length / maxPoints));
    const points: {
      idx: number;
      label: string;
      cumulativePct: number;
      rollingPct: number;
      modeLabel: string;
      stageLabel: string;
      isCorrect: boolean;
      dateStr: string;
    }[] = [];

    let totalRight = 0;
    filteredAttempts.forEach((att, i) => {
      if (att.isCorrect) totalRight += 1;
      const isSampled = i % step === 0 || i === filteredAttempts.length - 1;
      if (isSampled) {
        const windowSlice = filteredAttempts.slice(Math.max(0, i - 4), i + 1);
        const rollingRight = windowSlice.filter((w) => w.isCorrect).length;
        points.push({
          idx: i + 1,
          label: `#${i + 1}`,
          cumulativePct: Math.round((totalRight / (i + 1)) * 100),
          rollingPct: Math.round((rollingRight / windowSlice.length) * 100),
          modeLabel: MODE_LABELS[att.mode],
          stageLabel: `${att.discipline === 'quimica' ? 'Química' : 'Física'} · E${att.stageNumber}`,
          isCorrect: att.isCorrect,
          dateStr: new Date(att.timestamp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }
    });
    return points;
  }, [filteredAttempts]);

  // Radar 6D Química vs Física entre todas as abas
  const radarData = useMemo(() => {
    const computeDisciplineProfile = (disc: Discipline) => {
      const stages = disc === 'quimica' ? CHEMISTRY_TRACK : PHYSICS_TRACK;
      const stageProg = disc === 'quimica' ? state.chemistryStages : state.physicsStages;
      const completedPct = Math.round(
        (Object.values(stageProg).filter((s) => s.completed).length / stages.length) * 100
      );

      const evals = state.evaluations.filter((e) => e.discipline === disc);
      const evalAvgPct =
        evals.length > 0
          ? Math.round(evals.reduce((a, b) => a + b.scorePercent, 0) / evals.length)
          : 0;

      const discAttempts = state.attempts.filter((a) => a.discipline === disc);
      const accPct =
        discAttempts.length > 0
          ? Math.round(
              (discAttempts.filter((a) => a.isCorrect).length / discAttempts.length) * 100
            )
          : 0;

      const discVideos = VIDEO_RESOURCES.filter((v) => v.discipline === disc);
      const vidPct =
        discVideos.length > 0
          ? Math.round(
              (discVideos.filter((v) => state.watchedVideoIds.includes(v.id)).length /
                discVideos.length) *
                100
            )
          : 0;

      const discFormulas = FORMULA_LIBRARY.filter((f) => f.discipline === disc);
      const discSubs = Object.values(state.subtopicStats).filter((s) => s.discipline === disc);
      const domSubPct =
        discSubs.length > 0
          ? Math.round((discSubs.filter((s) => s.status === 'dominado').length / discSubs.length) * 100)
          : 0;
      const formPct =
        discFormulas.length > 0
          ? Math.round(
              (discFormulas.filter((f) => state.favoriteFormulaIds.includes(f.id)).length /
                discFormulas.length) *
                100
            )
          : 0;
      const formulaAndMasteryPct = Math.round(domSubPct * 0.7 + formPct * 0.3);

      // Engajamento: tempo (meta 60 min = 100%) + tabela periódica para química
      const timePct = Math.min(100, Math.round((state.studySeconds[disc] / 3600) * 100));
      const periodicPct =
        state.periodicLearningStats.length > 0
          ? Math.round(
              (state.periodicLearningStats.filter((p) => p.correct).length /
                state.periodicLearningStats.length) *
                100
            )
          : 0;
      const engagementPct =
        disc === 'quimica' && state.periodicLearningStats.length > 0
          ? Math.round(timePct * 0.5 + periodicPct * 0.5)
          : timePct;

      return [completedPct, evalAvgPct, accPct, vidPct, formulaAndMasteryPct, engagementPct];
    };

    return {
      axes: [
        'Trilhas Concluídas',
        'Avaliações',
        'Acurácia Questões',
        'Videoaulas',
        'Domínio & Fórmulas',
        'Dedicação / Tabela 118',
      ],
      quimica: computeDisciplineProfile('quimica'),
      fisica: computeDisciplineProfile('fisica'),
    };
  }, [state]);

  // Quebra por Modo & Nível CESGRANRIO
  const modeAndLevelBreakdown = useMemo(() => {
    const modes: AttemptRecord['mode'][] = ['diagnostico', 'fixacao', 'avaliacao', 'banco'];
    const byMode = modes.map((mode) => {
      const items = filteredAttempts.filter((a) => a.mode === mode);
      const right = items.filter((a) => a.isCorrect).length;
      return {
        mode,
        label: MODE_LABELS[mode],
        total: items.length,
        correct: right,
        pct: items.length > 0 ? Math.round((right / items.length) * 100) : null,
      };
    });

    const levels: QuestionLevel[] = ['basico', 'intermediario', 'avancado', 'cesgranrio'];
    const byLevel = levels.map((lvl) => {
      const items = filteredAttempts.filter((a) => questionLevelMap[a.questionId] === lvl);
      const right = items.filter((a) => a.isCorrect).length;
      return {
        level: lvl,
        label: LEVEL_LABELS[lvl],
        total: items.length,
        correct: right,
        pct: items.length > 0 ? Math.round((right / items.length) * 100) : null,
      };
    });

    return { byMode, byLevel };
  }, [filteredAttempts, questionLevelMap]);

  // Coeficientes de Correlação de Pearson (r) entre abas
  const pearsonCorrelations = useMemo(() => {
    const activeStages = stageMatrix.filter((s) => s.attemptsCount > 0 && s.accuracyPct !== null);
    const rPracticeAcc = computePearsonR(
      activeStages.map((s) => s.attemptsCount),
      activeStages.map((s) => s.accuracyPct ?? 0)
    );
    const rVideoAcc = computePearsonR(
      activeStages.map((s) => (s.videosTotal > 0 ? s.videosWatched / s.videosTotal : 0)),
      activeStages.map((s) => s.accuracyPct ?? 0)
    );
    const rStudiedAcc = computePearsonR(
      activeStages.map((s) => s.studiedPct),
      activeStages.map((s) => s.accuracyPct ?? 0)
    );

    return [
      {
        id: 'practice-acc',
        title: 'Volume de Questões × Taxa de Acerto',
        subtitle: 'Relação entre prática nas abas Trilha/Banco e precisão por etapa',
        r: rPracticeAcc,
        sampleSize: activeStages.length,
      },
      {
        id: 'video-acc',
        title: 'Videoaulas Assistidas × Desempenho na Etapa',
        subtitle: 'Impacto de assistir às aulas recomendadas antes das questões',
        r: rVideoAcc,
        sampleSize: activeStages.length,
      },
      {
        id: 'study-acc',
        title: 'Subtópicos Estudados × Acurácia Final',
        subtitle: 'Relação entre leitura dos 10 passos pedagógicos e rendimento',
        r: rStudiedAcc,
        sampleSize: activeStages.length,
      },
    ];
  }, [stageMatrix]);

  // Insights acionáveis gerados exclusivamente pelos dados reais
  const actionableInsights = useMemo(() => {
    const insights: {
      title: string;
      description: string;
      ctaLabel: string;
      action: () => void;
    }[] = [];

    const weakStageNoVideo = stageMatrix.find(
      (s) => s.accuracyPct !== null && s.accuracyPct < 80 && s.videosTotal > 0 && s.videosWatched === 0
    );
    if (weakStageNoVideo) {
      insights.push({
        title: `Reforce ${weakStageNoVideo.shortCode} com videoaulas`,
        description: `Em "${weakStageNoVideo.title}", sua acurácia está em ${weakStageNoVideo.accuracyPct}% e ainda há ${weakStageNoVideo.videosTotal} videoaula(s) não marcada(s) como assistida(s).`,
        ctaLabel: 'Abrir Videoaulas',
        action: () => onNavigate('videos'),
      });
    }

    const unlockedReadyForEval = stageMatrix.find(
      (s) => s.unlocked && !s.completed && s.studiedPct >= 50 && s.bestEvalPct === null
    );
    if (unlockedReadyForEval) {
      insights.push({
        title: `Etapa ${unlockedReadyForEval.shortCode} pronta para avaliação final`,
        description: `Você já estudou ${unlockedReadyForEval.studiedPct}% de "${unlockedReadyForEval.title}". Faça a avaliação com autoexplicação (≥80%) para liberar a próxima etapa.`,
        ctaLabel: `Ir para ${unlockedReadyForEval.shortCode}`,
        action: () => onOpenStage(unlockedReadyForEval.discipline, unlockedReadyForEval.stageNumber),
      });
    }

    if (discFilter !== 'fisica' && state.periodicLearningStats.length < 5) {
      insights.push({
        title: 'Correlacione Química com a Tabela Periódica 118',
        description: `Você registrou ${state.periodicLearningStats.length} desafio(s) no Modo Aprendizagem. Praticar os 7 desafios consolida valência, íons e tendências das Etapas 2 e 3.`,
        ctaLabel: 'Abrir Tabela 118',
        action: () => onNavigate('periodic-table'),
      });
    }

    if (filteredAttempts.length === 0) {
      insights.push({
        title: 'Gere seus primeiros pontos de correlação',
        description:
          'Responda ao Diagnóstico da Etapa 1 de Química ou Física e assista a uma videoaula para ver a curva temporal e os coeficientes de correlação ganharem forma.',
        ctaLabel: 'Iniciar Química Etapa 1',
        action: () => onOpenStage('quimica', 1),
      });
    }

    return insights.slice(0, 3);
  }, [stageMatrix, discFilter, state.periodicLearningStats.length, filteredAttempts.length, onNavigate, onOpenStage]);

  const activeTimelinePoint =
    selectedTimelineIdx !== null && timelinePoints[selectedTimelineIdx]
      ? timelinePoints[selectedTimelineIdx]
      : timelinePoints[timelinePoints.length - 1] ?? null;

  const activeStageDetail =
    hoveredStageKey !== null
      ? stageMatrix.find((s) => s.key === hoveredStageKey) ?? null
      : null;

  const totalStudySec = state.studySeconds.quimica + state.studySeconds.fisica;
  const chemTimePct = totalStudySec > 0 ? Math.round((state.studySeconds.quimica / totalStudySec) * 100) : 50;

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Inteligência Cruzada entre Todas as Abas do PetroLab
            </p>
            <h2 className="type-page-title mt-0.5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
              <span>Dashboard de Correlações e Evolução</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Cruza em tempo real seu avanço nas Trilhas, Banco de Questões, Videoaulas, Fórmulas, Tabela Periódica e Avaliações.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'quimica', label: 'Química' },
                  { id: 'fisica', label: 'Física' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDiscFilter(item.id)}
                  className={`min-h-9 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    discFilter === item.id
                      ? item.id === 'fisica'
                        ? 'bg-[var(--color-secondary)] text-white'
                        : 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Filtrar janela temporal"
              value={timeWindow}
              onChange={(e) => {
                setTimeWindow(e.target.value as TimeWindow);
                setSelectedTimelineIdx(null);
              }}
              className="input-control !w-auto !min-h-11 text-xs font-semibold"
            >
              <option value="all">Todo o histórico</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="last20">Últimas 20 tentativas</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4 KPIs Executivos de Correlação */}
      <section className="surface-card overflow-hidden" aria-label="Indicadores compostos de evolução">
        <div className="grid grid-cols-1 divide-y divide-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-muted)]">
              <span>Índice de Prontidão</span>
              <Target className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--color-text)] tabular-nums">
              {kpis.readinessScore}%
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {kpis.completedStages}/{kpis.relevantStagesCount} etapas · {kpis.totalAnswered} questões
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-muted)]">
              <span>Ganho Diagnóstico → Avaliação</span>
              <Activity className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--color-secondary)] tabular-nums">
              {kpis.avgGain !== null ? `${kpis.avgGain >= 0 ? '+' : ''}${kpis.avgGain} p.p.` : '—'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {kpis.diagAndEvalCount > 0
                ? `Média em ${kpis.diagAndEvalCount} etapa(s) avaliada(s)`
                : 'Conclua Diagnóstico + Avaliação'}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-muted)]">
              <span>Vídeos × Acerto na Etapa</span>
              <PlaySquare className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-xl font-bold text-[var(--color-text)] tabular-nums">
              {kpis.accWithVideo !== null ? `${kpis.accWithVideo}%` : '—'}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                {' '}
                vs {kpis.accWithoutVideo !== null ? `${kpis.accWithoutVideo}%` : '—'}
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Com vídeo assistido ({kpis.watchedVideosCount}/{kpis.relevantVideosCount}) vs sem
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-muted)]">
              <span>Prática × Aprovação</span>
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-xl font-bold text-[var(--color-text)] tabular-nums">
              {kpis.avgAttemptsPassed !== null ? `${kpis.avgAttemptsPassed} q.` : '—'}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                {' '}
                / etapa aprovada
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {kpis.avgAttemptsOpen !== null
                ? `Em aberto: média de ${kpis.avgAttemptsOpen} questões`
                : `Acurácia global atual: ${kpis.accuracyPct}%`}
            </p>
          </div>
        </div>
      </section>

      {/* Linha 1 de Gráficos: Curva Temporal + Radar 6D */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Gráfico 1: Curva de Evolução Temporal */}
        <div className="surface-card p-5 sm:p-6 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="type-section-title">Curva de Evolução &amp; Média Móvel</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Acurácia acumulada vs janela móvel (últimas 5 questões) com linha de corte CESGRANRIO (80%).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  Móvel
                </span>
                <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-secondary)]" />
                  Acumulada
                </span>
              </div>
            </div>

            {timelinePoints.length === 0 ? (
              <div className="surface-inset mt-5 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Sem tentativas neste recorte para traçar a curva temporal.
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Responda questões nas Trilhas ou no Banco de Questões para acompanhar sua evolução em tempo real.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenStage('quimica', 1)}
                    className="btn-primary !min-h-10 text-xs"
                  >
                    Química Etapa 1
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('questions')}
                    className="btn-secondary !min-h-10 text-xs"
                  >
                    Banco de Questões
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <svg
                  viewBox="0 0 600 220"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Gráfico de evolução temporal da taxa de acerto"
                >
                  <defs>
                    <linearGradient id="corrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F766E" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#0F766E" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Grade horizontal */}
                  {[0, 25, 50, 80, 100].map((val) => {
                    const y = 190 - (val / 100) * 165;
                    const isTarget = val === 80;
                    return (
                      <g key={val}>
                        <line
                          x1="40"
                          y1={y}
                          x2="582"
                          y2={y}
                          stroke={isTarget ? '#B45309' : '#E2E8F0'}
                          strokeWidth={isTarget ? 1.5 : 1}
                          strokeDasharray={isTarget ? '5 4' : undefined}
                        />
                        <text
                          x="34"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fontWeight={isTarget ? '700' : '500'}
                          fill={isTarget ? '#B45309' : '#475569'}
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  <text x="580" y="54" textAnchor="end" fontSize="9.5" fontWeight="700" fill="#B45309">
                    Meta 80%
                  </text>

                  {(() => {
                    const w = 530;
                    const x0 = 46;
                    const getX = (i: number) =>
                      timelinePoints.length === 1
                        ? x0 + w / 2
                        : x0 + (i / (timelinePoints.length - 1)) * w;
                    const getY = (pct: number) => 190 - (pct / 100) * 165;

                    const rollingCoords = timelinePoints.map((pt, i) => `${getX(i)},${getY(pt.rollingPct)}`);
                    const cumCoords = timelinePoints.map((pt, i) => `${getX(i)},${getY(pt.cumulativePct)}`);

                    const areaPath =
                      timelinePoints.length > 1
                        ? `M ${getX(0)},190 L ${rollingCoords.join(' L ')} L ${getX(
                            timelinePoints.length - 1
                          )},190 Z`
                        : '';

                    return (
                      <>
                        {areaPath && <path d={areaPath} fill="url(#corrAreaGrad)" />}
                        {timelinePoints.length > 1 && (
                          <>
                            <polyline
                              fill="none"
                              stroke="#4338CA"
                              strokeWidth="2"
                              strokeDasharray="4 3"
                              points={cumCoords.join(' ')}
                            />
                            <polyline
                              fill="none"
                              stroke="#0F766E"
                              strokeWidth="2.8"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              points={rollingCoords.join(' ')}
                            />
                          </>
                        )}
                        {timelinePoints.map((pt, i) => {
                          const cx = getX(i);
                          const cy = getY(pt.rollingPct);
                          const isSelected = activeTimelinePoint?.idx === pt.idx;
                          return (
                            <g key={pt.idx}>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isSelected ? 6.5 : 4.5}
                                fill={pt.isCorrect ? '#0F766E' : '#B91C1C'}
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                className="cursor-pointer"
                                onMouseEnter={() => setSelectedTimelineIdx(i)}
                                onClick={() => setSelectedTimelineIdx(i)}
                              />
                              {(i === 0 ||
                                i === timelinePoints.length - 1 ||
                                i === Math.floor(timelinePoints.length / 2)) && (
                                <text
                                  x={cx}
                                  y="209"
                                  textAnchor="middle"
                                  fontSize="10"
                                  fill="#475569"
                                >
                                  {pt.label}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                {activeTimelinePoint && (
                  <div className="surface-inset mt-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-xs">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono font-bold text-[var(--color-text)]">
                        Tentativa {activeTimelinePoint.label}
                      </span>
                      <span className="font-semibold text-[var(--color-primary)]">
                        {activeTimelinePoint.stageLabel}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {activeTimelinePoint.modeLabel}
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        {activeTimelinePoint.dateStr}
                      </span>
                    </div>
                    <div className="font-mono font-semibold tabular-nums text-[var(--color-text)]">
                      Móvel: {activeTimelinePoint.rollingPct}% · Acumulada: {activeTimelinePoint.cumulativePct}%
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 2: Radar 6D entre Abas (Química vs Física) */}
        <div className="surface-card p-5 sm:p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="type-section-title flex items-center gap-2">
                  <Radar className="h-4.5 w-4.5 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>Radar 6D entre Abas</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Equilíbrio entre Trilhas, Questões, Vídeos, Fórmulas e Tabela 118.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  Química
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--color-secondary)] font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-secondary)]" />
                  Física
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <svg
                viewBox="0 0 340 270"
                className="w-full max-w-[340px] h-auto"
                role="img"
                aria-label="Gráfico radar de competências entre abas para Química e Física"
              >
                {(() => {
                  const cx = 170;
                  const cy = 135;
                  const maxR = 88;
                  const count = radarData.axes.length;

                  const pointFor = (axisIdx: number, pct: number) => {
                    const angle = -Math.PI / 2 + (axisIdx * 2 * Math.PI) / count;
                    const r = (Math.max(4, pct) / 100) * maxR;
                    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
                  };

                  const polygonPoints = (values: number[]) =>
                    values.map((v, i) => pointFor(i, v).join(',')).join(' ');

                  return (
                    <>
                      {[25, 50, 75, 100].map((ring) => {
                        const pts = Array.from({ length: count }, (_, i) =>
                          pointFor(i, ring).join(',')
                        ).join(' ');
                        return (
                          <polygon
                            key={ring}
                            points={pts}
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {radarData.axes.map((label, i) => {
                        const [x2, y2] = pointFor(i, 100);
                        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
                        const lx = cx + Math.cos(angle) * (maxR + 22);
                        const ly = cy + Math.sin(angle) * (maxR + 18);
                        const anchor =
                          Math.abs(Math.cos(angle)) < 0.2
                            ? 'middle'
                            : Math.cos(angle) > 0
                              ? 'start'
                              : 'end';
                        return (
                          <g key={label}>
                            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#CBD5E1" strokeWidth="1" />
                            <text
                              x={lx}
                              y={ly + 3}
                              textAnchor={anchor}
                              fontSize="9.5"
                              fontWeight="600"
                              fill="#334155"
                            >
                              {label}
                            </text>
                          </g>
                        );
                      })}

                      {discFilter !== 'fisica' && (
                        <polygon
                          points={polygonPoints(radarData.quimica)}
                          fill="#0F766E"
                          fillOpacity="0.20"
                          stroke="#0F766E"
                          strokeWidth="2.2"
                        />
                      )}

                      {discFilter !== 'quimica' && (
                        <polygon
                          points={polygonPoints(radarData.fisica)}
                          fill="#4338CA"
                          fillOpacity="0.18"
                          stroke="#4338CA"
                          strokeWidth="2.2"
                        />
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          <div className="surface-inset grid grid-cols-3 gap-2 p-3 text-center text-xs">
            <div>
              <p className="text-[var(--color-text-muted)]">Tempo Química</p>
              <p className="font-mono font-bold text-[var(--color-primary)] tabular-nums">
                {formatDurationShort(state.studySeconds.quimica)} ({chemTimePct}%)
              </p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Tempo Física</p>
              <p className="font-mono font-bold text-[var(--color-secondary)] tabular-nums">
                {formatDurationShort(state.studySeconds.fisica)} ({100 - chemTimePct}%)
              </p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Tabela 118</p>
              <p className="font-mono font-bold text-[var(--color-text)] tabular-nums">
                {kpis.periodicTotal > 0 ? `${kpis.periodicAccPct}% (${kpis.periodicTotal})` : '0 desafios'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gráfico 3: Matriz Comparativa por Etapa (Diagnóstico vs Evolução + Recursos) */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="type-section-title">
              Evolução por Etapa: Diagnóstico Inicial × Desempenho Atual e Recursos
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Passe o cursor ou clique em uma etapa (Q1–Q8 / F1–F9) para inspecionar vídeoaulas, fórmulas favoritadas e abrir o conteúdo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />
              Diagnóstico
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-primary)]" />
              Desempenho Química
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-secondary)]" />
              Desempenho Física
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="min-w-[680px]">
            <svg
              viewBox={`0 0 ${Math.max(680, stageMatrix.length * 46 + 50)} 210`}
              className="w-full h-auto"
              role="img"
              aria-label="Comparação por etapa entre diagnóstico inicial e desempenho atual"
            >
              {[0, 40, 80, 100].map((v) => {
                const y = 165 - (v / 100) * 135;
                return (
                  <g key={v}>
                    <line
                      x1="38"
                      y1={y}
                      x2={Math.max(670, stageMatrix.length * 46 + 40)}
                      y2={y}
                      stroke={v === 80 ? '#B45309' : '#E2E8F0'}
                      strokeDasharray={v === 80 ? '5 4' : undefined}
                    />
                    <text x="32" y={y + 3} textAnchor="end" fontSize="9.5" fill={v === 80 ? '#B45309' : '#475569'}>
                      {v}%
                    </text>
                  </g>
                );
              })}

              {stageMatrix.map((st, idx) => {
                const gx = 52 + idx * 44;
                const diagH = st.diagnosticPct !== null ? Math.max(4, (st.diagnosticPct / 100) * 135) : 0;
                const perfH =
                  st.currentPerformancePct !== null
                    ? Math.max(4, (st.currentPerformancePct / 100) * 135)
                    : 0;
                const perfColor = st.discipline === 'quimica' ? '#0F766E' : '#4338CA';
                const isSelected = hoveredStageKey === st.key;

                return (
                  <g
                    key={st.key}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredStageKey(st.key)}
                    onClick={() => onOpenStage(st.discipline, st.stageNumber)}
                  >
                    {isSelected && (
                      <rect
                        x={gx - 6}
                        y="22"
                        width="38"
                        height="168"
                        rx="6"
                        fill="#F1F5F9"
                      />
                    )}
                    {/* Barra Diagnóstico */}
                    <rect
                      x={gx}
                      y={diagH > 0 ? 165 - diagH : 161}
                      width="11"
                      height={diagH > 0 ? diagH : 4}
                      rx="2"
                      fill={diagH > 0 ? '#94A3B8' : '#E2E8F0'}
                    />
                    {/* Barra Desempenho Atual */}
                    <rect
                      x={gx + 14}
                      y={perfH > 0 ? 165 - perfH : 161}
                      width="11"
                      height={perfH > 0 ? perfH : 4}
                      rx="2"
                      fill={perfH > 0 ? perfColor : '#E2E8F0'}
                    />
                    {/* Indicador de vídeo assistido */}
                    {st.videosWatched > 0 && (
                      <circle cx={gx + 12} cy="198" r="3" fill="#0F766E" />
                    )}
                    <text
                      x={gx + 12}
                      y="182"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight={st.completed ? '700' : '500'}
                      fill={st.unlocked ? '#0F172A' : '#64748B'}
                    >
                      {st.shortCode}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {activeStageDetail && (
          <div className="surface-inset mt-3 flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs">
            <div>
              <p className="font-semibold text-[var(--color-text)]">
                {activeStageDetail.shortCode} — {activeStageDetail.title}
              </p>
              <p className="mt-0.5 text-[var(--color-text-muted)] tabular-nums">
                Diagnóstico: {activeStageDetail.diagnosticPct !== null ? `${activeStageDetail.diagnosticPct}%` : 'Não realizado'} ·{' '}
                Avaliação/Acurácia: {activeStageDetail.currentPerformancePct !== null ? `${activeStageDetail.currentPerformancePct}%` : 'Sem tentativas'} ·{' '}
                Questões: {activeStageDetail.attemptsCount} · Vídeos: {activeStageDetail.videosWatched}/{activeStageDetail.videosTotal} ·{' '}
                Fórmulas fav.: {activeStageDetail.formulasFav}/{activeStageDetail.formulasTotal}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenStage(activeStageDetail.discipline, activeStageDetail.stageNumber)}
              className="btn-secondary !min-h-10"
            >
              <span>Abrir etapa</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {/* Linha 2: Desempenho por Modo/Nível CESGRANRIO + Correlações Estatísticas (Pearson r) */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="surface-card p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="type-section-title">Acurácia por Modo de Estudo e Nível</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Compare seu rendimento entre diagnóstico, fixação, avaliação final, banco e dificuldade CESGRANRIO.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Por modo de prática</p>
            {modeAndLevelBreakdown.byMode.map((row) => (
              <div key={row.mode} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--color-text)]">{row.label}</span>
                  <span className="font-mono text-[var(--color-text-muted)] tabular-nums">
                    {row.pct !== null ? `${row.pct}% (${row.correct}/${row.total})` : 'Sem dados'}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
                    style={{ width: `${row.pct ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Por nível de complexidade (Questões catalogadas)
            </p>
            {modeAndLevelBreakdown.byLevel.map((row) => (
              <div key={row.level} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--color-text)]">{row.label}</span>
                  <span className="font-mono text-[var(--color-text-muted)] tabular-nums">
                    {row.pct !== null ? `${row.pct}% (${row.correct}/${row.total})` : 'Sem dados'}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[var(--color-secondary)] transition-[width] duration-300"
                    style={{ width: `${row.pct ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Correlações Estatísticas (Pearson r) + Ações Recomendadas */}
        <div className="surface-card p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="type-section-title">Correlações Estatísticas (Pearson r) &amp; Ações</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Mede como seus hábitos entre abas influenciam sua nota real conforme você avança pelas etapas.
            </p>
          </div>

          <div className="space-y-2.5">
            {pearsonCorrelations.map((item) => {
              const info = describePearson(item.r);
              return (
                <div key={item.id} className="surface-inset p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{item.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {item.r !== null ? `${item.r >= 0 ? '+' : ''}${item.r.toFixed(2)}` : '—'}
                    </p>
                    <p className={`text-xs font-semibold ${info.tone}`}>
                      {item.r !== null ? info.label : `${item.sampleSize}/3 etapas`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-2.5">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Próximas ações de maior impacto
            </p>
            {actionableInsights.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)]">
                Excelente consistência! Continue alternando estudos guiados, videoaulas e questões para manter todos os indicadores acima de 80%.
              </p>
            ) : (
              <div className="space-y-2.5">
                {actionableInsights.map((ins, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] p-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{ins.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {ins.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={ins.action}
                      className="btn-primary !min-h-10 text-xs shrink-0"
                    >
                      <span>{ins.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Atalhos de Cobertura por Aba */}
      <section className="surface-card p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('chemistry')}
            className="surface-inset p-3 text-left hover:border-[var(--color-primary-border)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              <span>Química</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {Object.values(state.chemistryStages).filter((s) => s.completed).length}/8 etapas
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('physics')}
            className="surface-inset p-3 text-left hover:border-[var(--color-secondary-border)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-secondary)]">
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Física</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {Object.values(state.physicsStages).filter((s) => s.completed).length}/9 etapas
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('periodic-table')}
            className="surface-inset p-3 text-left hover:border-[var(--color-primary-border)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
              <Atom className="h-4 w-4" aria-hidden="true" />
              <span>Tabela 118</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {state.periodicLearningStats.filter((p) => p.correct).length}/
              {state.periodicLearningStats.length} acertos
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('questions')}
            className="surface-inset p-3 text-left hover:border-[var(--color-border-strong)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
              <HelpCircle className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <span>Questões</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {state.attempts.length} respondidas
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('videos')}
            className="surface-inset p-3 text-left hover:border-[var(--color-border-strong)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
              <PlaySquare className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <span>Videoaulas</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {state.watchedVideoIds.length}/{VIDEO_RESOURCES.length} assistidas
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('formulas')}
            className="surface-inset p-3 text-left hover:border-[var(--color-border-strong)] transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
              <BookOpen className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <span>Fórmulas</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
              {state.favoriteFormulaIds.length}/{FORMULA_LIBRARY.length} fav.
            </p>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Tempo total monitorado:{' '}
            <strong className="font-mono text-[var(--color-text)] tabular-nums">
              {formatDurationShort(totalStudySec)}
            </strong>
          </span>
          <span>Avaliações finais registradas: {filteredEvaluations.length}</span>
        </div>
      </section>
    </div>
  );
}
