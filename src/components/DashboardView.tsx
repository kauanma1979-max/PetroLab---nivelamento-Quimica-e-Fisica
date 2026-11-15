import { useMemo } from 'react';
import {
  ArrowRight,
  Atom,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  Target,
  Zap,
} from 'lucide-react';
import { CHEMISTRY_TRACK } from '../data/chemistryTrack';
import { PHYSICS_TRACK } from '../data/physicsTrack';
import { Discipline, StudentProgressState, TabId } from '../types';

interface DashboardViewProps {
  state: StudentProgressState;
  onNavigate: (tab: TabId) => void;
  onOpenStage: (discipline: Discipline, stageNumber: number) => void;
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 min';
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}min`;
  if (mins > 0) return `${mins} min`;
  return `${totalSeconds} s`;
}

export function DashboardView({ state, onNavigate, onOpenStage }: DashboardViewProps) {
  const analytics = useMemo(() => {
    const chemCompleted = Object.values(state.chemistryStages).filter((s) => s.completed).length;
    const physCompleted = Object.values(state.physicsStages).filter((s) => s.completed).length;
    const chemInProgress = Object.values(state.chemistryStages).filter(
      (s) => s.unlocked && !s.completed && (s.studiedSubtopics.length > 0 || s.diagnosticCompleted)
    ).length;
    const physInProgress = Object.values(state.physicsStages).filter(
      (s) => s.unlocked && !s.completed && (s.studiedSubtopics.length > 0 || s.diagnosticCompleted)
    ).length;

    const allSubtopics = Object.values(state.subtopicStats);
    const totalSubtopics = allSubtopics.length;
    const studiedCount = allSubtopics.filter((s) => s.status !== 'nao_iniciado').length;
    const masteredCount = allSubtopics.filter((s) => s.status === 'dominado').length;
    const pendingReviewList = allSubtopics.filter((s) => s.status === 'em_revisao');

    const answeredCount = state.attempts.length;
    const correctCount = state.attempts.filter((a) => a.isCorrect).length;
    const wrongCount = state.attempts.filter((a) => !a.isCorrect).length;
    const accuracyPercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const hotspots = allSubtopics
      .filter((s) => s.answeredCount > 0 && (s.wrongCount > 0 || s.correctCount / s.answeredCount < 0.8))
      .sort((a, b) => {
        const rateA = a.correctCount / a.answeredCount;
        const rateB = b.correctCount / b.answeredCount;
        if (rateA !== rateB) return rateA - rateB;
        return b.wrongCount - a.wrongCount;
      })
      .slice(0, 5);

    const nextChem = CHEMISTRY_TRACK.find((st) => !state.chemistryStages[st.stageNumber]?.completed);
    const nextPhys = PHYSICS_TRACK.find((st) => !state.physicsStages[st.stageNumber]?.completed);

    const recentAttempts = [...state.attempts].reverse().slice(0, 6);

    const nowMs = Date.now();
    const reviewReminders = allSubtopics
      .filter((s) => {
        if (s.status === 'em_revisao') return true;
        if (!s.lastReviewedAt) return false;
        const ageHours = (nowMs - new Date(s.lastReviewedAt).getTime()) / (1000 * 60 * 60);
        return ageHours >= 24 && s.status !== 'nao_iniciado';
      })
      .slice(0, 4);

    return {
      chemCompleted,
      physCompleted,
      chemInProgress,
      physInProgress,
      chemPct: Math.round((chemCompleted / CHEMISTRY_TRACK.length) * 100),
      physPct: Math.round((physCompleted / PHYSICS_TRACK.length) * 100),
      totalSubtopics,
      studiedCount,
      masteredCount,
      pendingReviewList,
      answeredCount,
      correctCount,
      wrongCount,
      accuracyPercent,
      hotspots,
      nextChem,
      nextPhys,
      recentAttempts,
      reviewReminders,
    };
  }, [state]);

  const recommended =
    state.lastRecommended.discipline === 'fisica' && analytics.nextPhys
      ? { discipline: 'fisica' as const, stage: analytics.nextPhys }
      : analytics.nextChem
        ? { discipline: 'quimica' as const, stage: analytics.nextChem }
        : analytics.nextPhys
          ? { discipline: 'fisica' as const, stage: analytics.nextPhys }
          : null;

  return (
    <div className="space-y-6">
      {/* Cabeçalho Principal + Próxima Aula Recomendada */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              Nivelamento Progressivo · Petrobras e Transpetro (CESGRANRIO)
            </p>
            <h1 className="type-page-title mt-1">
              {state.profile?.name
                ? `Painel de estudos de ${state.profile.name}`
                : 'Painel inteligente de nivelamento'}
            </h1>
            <p className="type-body mt-2">
              Cada etapa exige diagnóstico, estudo guiado, autoexplicação e desempenho mínimo de{' '}
              <strong className="font-semibold text-[var(--color-text)] tabular-nums">80%</strong> para desbloquear o próximo nível.
            </p>
          </div>

          {recommended && (
            <div className="surface-inset flex flex-col gap-2.5 p-4 lg:min-w-80">
              <div className="flex items-center justify-between gap-2 text-xs font-medium text-[var(--color-text-muted)]">
                <span>Próxima aula recomendada</span>
                <span
                  className={
                    recommended.discipline === 'quimica'
                      ? 'font-semibold text-[var(--color-primary)]'
                      : 'font-semibold text-[var(--color-secondary)]'
                  }
                >
                  {recommended.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa{' '}
                  {recommended.stage.stageNumber}
                </span>
              </div>
              <p className="font-display text-base font-semibold text-[var(--color-text)]">
                {recommended.stage.title}
              </p>
              <button
                type="button"
                onClick={() => onOpenStage(recommended.discipline, recommended.stage.stageNumber)}
                className={recommended.discipline === 'quimica' ? 'btn-primary w-full' : 'btn-physics w-full'}
              >
                <span>Estudar etapa agora</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Progresso das Trilhas (Química vs Física) */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Progresso por disciplina">
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] shrink-0">
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="type-section-title">Trilha de Química</h2>
                <p className="text-xs text-[var(--color-text-muted)] tabular-nums">
                  {analytics.chemCompleted} de {CHEMISTRY_TRACK.length} etapas concluídas ·{' '}
                  {analytics.chemInProgress} em andamento
                </p>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-[var(--color-primary)] tabular-nums">
              {analytics.chemPct}%
            </span>
          </div>

          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={analytics.chemPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso em Química"
          >
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
              style={{ width: `${analytics.chemPct}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
              Tempo dedicado:{' '}
              <strong className="font-mono text-[var(--color-text)] tabular-nums">
                {formatDuration(state.studySeconds.quimica)}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('chemistry')}
              className="font-semibold text-[var(--color-primary)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
            >
              Abrir trilha →
            </button>
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-secondary-soft)] text-[var(--color-secondary)] shrink-0">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="type-section-title">Trilha de Física</h2>
                <p className="text-xs text-[var(--color-text-muted)] tabular-nums">
                  {analytics.physCompleted} de {PHYSICS_TRACK.length} etapas concluídas ·{' '}
                  {analytics.physInProgress} em andamento
                </p>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-[var(--color-secondary)] tabular-nums">
              {analytics.physPct}%
            </span>
          </div>

          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={analytics.physPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso em Física"
          >
            <div
              className="h-full rounded-full bg-[var(--color-secondary)] transition-[width] duration-300"
              style={{ width: `${analytics.physPct}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
              Tempo dedicado:{' '}
              <strong className="font-mono text-[var(--color-text)] tabular-nums">
                {formatDuration(state.studySeconds.fisica)}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('physics')}
              className="font-semibold text-[var(--color-secondary)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
            >
              Abrir trilha →
            </button>
          </div>
        </div>
      </section>

      {/* Painel Unificado de Indicadores Reais (Sem cartões fragmentados) */}
      <section className="surface-card overflow-hidden" aria-label="Indicadores de estudo">
        <div className="grid grid-cols-2 divide-y divide-x divide-[var(--color-border)] sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Conteúdo estudado</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-text)] tabular-nums">
              {analytics.studiedCount}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                /{analytics.totalSubtopics}
              </span>
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Efetivamente dominado</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-success)] tabular-nums">
              {analytics.masteredCount}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                /{analytics.totalSubtopics}
              </span>
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Questões respondidas</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-text)] tabular-nums">
              {analytics.answeredCount}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Questões acertadas</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-success)] tabular-nums">
              {analytics.correctCount}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Questões erradas</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-error)] tabular-nums">
              {analytics.wrongCount}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Taxa de acertos</p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--color-text)] tabular-nums">
              {analytics.answeredCount > 0 ? `${analytics.accuracyPercent}%` : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Dificuldades, Revisão e Histórico Real */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Flame className="h-4 w-4 text-[var(--color-error)]" aria-hidden="true" />
              <span>Maior dificuldade</span>
            </h2>
            <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
              {analytics.hotspots.length}
            </span>
          </div>

          {analytics.hotspots.length === 0 ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Nenhuma lacuna registrada ainda. Conforme responder às questões, seus pontos fracos aparecerão aqui.
              </p>
              <button
                type="button"
                onClick={() => onOpenStage('quimica', 1)}
                className="btn-secondary w-full text-xs"
              >
                Iniciar diagnóstico de Química
              </button>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--color-border)]">
              {analytics.hotspots.map((item) => {
                const pct = Math.round((item.correctCount / item.answeredCount) * 100);
                return (
                  <li key={item.subtopicId} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--color-text)]">
                        {item.subtopicTitle}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {item.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {item.stageNumber} ·{' '}
                        {item.wrongCount} erro(s)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenStage(item.discipline, item.stageNumber)}
                      className="font-mono text-xs font-semibold text-[var(--color-error)] hover:underline shrink-0 cursor-pointer tabular-nums"
                    >
                      {pct}% · Revisar
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-[var(--color-warning)]" aria-hidden="true" />
              <span>Pendentes de revisão (24h / 7d / 15d)</span>
            </h2>
            <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
              {analytics.pendingReviewList.length}
            </span>
          </div>

          {analytics.reviewReminders.length === 0 ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Nenhum tópico pendente de revisão neste momento. Tópicos com erros ou estudados há mais de 24h entram aqui.
              </p>
              <button
                type="button"
                onClick={() => onOpenStage('fisica', 1)}
                className="btn-secondary w-full text-xs"
              >
                Iniciar diagnóstico de Física
              </button>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--color-border)]">
              {analytics.reviewReminders.map((item) => (
                <li key={item.subtopicId} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[var(--color-text)]">
                      {item.subtopicTitle}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {item.stageNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStage(item.discipline, item.stageNumber)}
                    className="text-xs font-semibold text-[var(--color-warning)] hover:underline shrink-0 cursor-pointer"
                  >
                    Revisar →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Histórico recente</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('performance')}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Ver tudo
            </button>
          </div>

          {analytics.recentAttempts.length === 0 ? (
            <p className="mt-4 text-xs text-[var(--color-text-muted)] leading-relaxed">
              Seu histórico está zerado porque nenhuma questão foi respondida ainda. Comece pela Etapa 1 para construir seu registro real.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--color-border)]">
              {analytics.recentAttempts.map((att) => (
                <li key={att.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[var(--color-text)]">
                      {att.subtopicTitle}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {att.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {att.stageNumber} ·{' '}
                      {att.mode}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold shrink-0 ${
                      att.isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                    }`}
                  >
                    {att.isCorrect ? 'Acertou' : 'Errou'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Atalhos para Ferramentas Científicas */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Atalhos das ferramentas">
        <button
          type="button"
          onClick={() => onNavigate('periodic-table')}
          className="surface-card flex items-center gap-3 p-4 text-left transition hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)] cursor-pointer min-h-16"
        >
          <Atom className="h-5 w-5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Tabela Periódica 118</p>
            <p className="text-xs text-[var(--color-text-muted)]">Tendências, íons e 7 desafios</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('lab')}
          className="surface-card flex items-center gap-3 p-4 text-left transition hover:border-[var(--color-secondary-border)] hover:bg-[var(--color-secondary-soft)] cursor-pointer min-h-16"
        >
          <FlaskConical className="h-5 w-5 text-[var(--color-secondary)] shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Laboratório Virtual</p>
            <p className="text-xs text-[var(--color-text-muted)]">Simulações e modelos 3D</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('questions')}
          className="surface-card flex items-center gap-3 p-4 text-left transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] cursor-pointer min-h-16"
        >
          <HelpCircle className="h-5 w-5 text-[var(--color-text-secondary)] shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Banco de Questões</p>
            <p className="text-xs text-[var(--color-text-muted)]">Básico até nível CESGRANRIO</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('formulas')}
          className="surface-card flex items-center gap-3 p-4 text-left transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] cursor-pointer min-h-16"
        >
          <BookOpen className="h-5 w-5 text-[var(--color-text-secondary)] shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Fórmulas e Resumos</p>
            <p className="text-xs text-[var(--color-text-muted)]">Unidades SI, erros e exemplos</p>
          </div>
        </button>
      </section>

      <div className="surface-inset flex items-start gap-2.5 px-4 py-3 text-xs text-[var(--color-text-secondary)]">
        <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          Todos os indicadores refletem exclusivamente suas ações registradas neste aplicativo. Questões geradas e não respondidas não contam como erro.
        </p>
      </div>
    </div>
  );
}
