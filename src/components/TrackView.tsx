import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileText,
  FlaskConical,
  ListChecks,
  Lock,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Unlock,
  XCircle,
} from 'lucide-react';
import { CHEMISTRY_TRACK } from '../data/chemistryTrack';
import { PHYSICS_TRACK } from '../data/physicsTrack';
import {
  getDiagnosticQuestions,
  getPracticeQuestions,
  selectAdaptiveEvaluationQuestions,
} from '../data/questionBank';
import { getMapsForStage } from '../data/pdfMaps';
import { aiTutorBridge } from '../store/useProgressStore';
import { Discipline, Question, StageContent, StudentProgressState } from '../types';
import { LightboxMapItem, MapLightboxModal } from './MapLightboxModal';
import { SVGDiagramViewer } from './SVGDiagramViewer';
import { ThreeDScienceViewer } from './ThreeDScienceViewer';

interface TrackViewProps {
  discipline: Discipline;
  state: StudentProgressState;
  initialStageNumber?: number;
  onMarkSubtopicStudied: (discipline: Discipline, stageNumber: number, subtopicId: string) => void;
  onCompleteDiagnostic: (discipline: Discipline, stageNumber: number, scorePercent: number) => void;
  onRecordAttempt: (attempt: {
    questionId: string;
    discipline: Discipline;
    stageNumber: number;
    subtopicId: string;
    subtopicTitle: string;
    selectedLetter: 'A' | 'B' | 'C' | 'D' | 'E';
    correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
    isCorrect: boolean;
    mode: 'diagnostico' | 'fixacao' | 'avaliacao' | 'banco' | 'formula';
  }) => void;
  onRegisterGenerated: (questionIds: string[], subtopicIds: string[]) => void;
  onSubmitEvaluation: (params: {
    discipline: Discipline;
    stageNumber: number;
    correctCount: number;
    totalQuestions: number;
    selfExplanation: string;
    weakSubtopics: string[];
  }) => { passed: boolean; scorePercent: number };
}

type StageSectionTab = 'all' | 'diagnostico' | 'teoria' | 'industria' | 'avaliacao';

export function TrackView({
  discipline,
  state,
  initialStageNumber,
  onMarkSubtopicStudied,
  onCompleteDiagnostic,
  onRecordAttempt,
  onRegisterGenerated,
  onSubmitEvaluation,
}: TrackViewProps) {
  const track: StageContent[] = discipline === 'quimica' ? CHEMISTRY_TRACK : PHYSICS_TRACK;
  const stageMap = discipline === 'quimica' ? state.chemistryStages : state.physicsStages;

  const isChem = discipline === 'quimica';
  const accentBtn = isChem ? 'btn-primary' : 'btn-physics';
  const accentText = isChem ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]';
  const accentSoft = isChem
    ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)]'
    : 'border-[var(--color-secondary-border)] bg-[var(--color-secondary-soft)]';

  const [activeStageNum, setActiveStageNum] = useState<number>(() => initialStageNumber ?? 1);
  const [sectionTab, setSectionTab] = useState<StageSectionTab>('diagnostico');

  useEffect(() => {
    if (initialStageNumber && stageMap[initialStageNumber]?.unlocked) {
      setActiveStageNum(initialStageNumber);
    }
  }, [initialStageNumber, stageMap]);

  const currentStage = useMemo(
    () => track.find((s) => s.stageNumber === activeStageNum) ?? track[0],
    [track, activeStageNum]
  );
  const currentProgress = stageMap[currentStage.stageNumber];

  const stageMaps = useMemo(
    () => getMapsForStage(discipline, currentStage.stageNumber),
    [discipline, currentStage.stageNumber]
  );
  const stageLightboxItems: LightboxMapItem[] = useMemo(
    () =>
      stageMaps.map((m) => ({
        id: `stage-map-${m.pageNumber}`,
        pageNumber: m.pageNumber,
        title: m.title,
        subtitle: m.subtitle,
        moduleLabel: `${m.moduleCode} · ${m.moduleTitle}`,
        imageUrl: m.imageUrl,
        downloadName: `petrolab-mapa-p${String(m.pageNumber).padStart(3, '0')}.jpg`,
        stageLinks: m.stageLinks,
      })),
    [stageMaps]
  );
  const [stageMapLightboxIdx, setStageMapLightboxIdx] = useState<number | null>(null);

  const diagnosticQuestions = useMemo(
    () => getDiagnosticQuestions(discipline, currentStage.stageNumber),
    [discipline, currentStage.stageNumber]
  );
  const [diagAnswers, setDiagAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});

  const practiceQuestions = useMemo(
    () => getPracticeQuestions(discipline, currentStage.stageNumber),
    [discipline, currentStage.stageNumber]
  );
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});

  const [evalSeedExclude, setEvalSeedExclude] = useState<string[]>([]);
  const [weakRetryIds, setWeakRetryIds] = useState<string[]>([]);
  const [evalQuestions, setEvalQuestions] = useState<Question[]>(() =>
    selectAdaptiveEvaluationQuestions(discipline, currentStage.stageNumber, { count: 5 })
  );
  const [evalAnswers, setEvalAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [selfExplanation, setSelfExplanation] = useState<string>(currentProgress?.selfExplanation || '');
  const [evalResult, setEvalResult] = useState<{
    passed: boolean;
    scorePercent: number;
    weakTitles: string[];
    feedbackText: string;
  } | null>(null);

  useEffect(() => {
    setDiagAnswers({});
    setPracticeAnswers({});
    setEvalAnswers({});
    setEvalSeedExclude([]);
    setWeakRetryIds([]);
    setEvalResult(null);
    setSelfExplanation(stageMap[currentStage.stageNumber]?.selfExplanation || '');
    const initialEval = selectAdaptiveEvaluationQuestions(discipline, currentStage.stageNumber, {
      count: 5,
    });
    setEvalQuestions(initialEval);
  }, [discipline, currentStage.stageNumber]);

  useEffect(() => {
    const allIds = [
      ...diagnosticQuestions.map((q) => q.id),
      ...practiceQuestions.map((q) => q.id),
      ...evalQuestions.map((q) => q.id),
    ];
    const subIds = [
      ...diagnosticQuestions.map((q) => q.subtopicId),
      ...practiceQuestions.map((q) => q.subtopicId),
      ...evalQuestions.map((q) => q.subtopicId),
    ];
    onRegisterGenerated(allIds, subIds);
  }, [diagnosticQuestions, practiceQuestions, evalQuestions, onRegisterGenerated]);

  const handleSelectDiagnostic = (q: Question, letter: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (diagAnswers[q.id]) return;
    const isCorrect = letter === q.correctLetter;
    const next = { ...diagAnswers, [q.id]: letter };
    setDiagAnswers(next);
    onRecordAttempt({
      questionId: q.id,
      discipline,
      stageNumber: currentStage.stageNumber,
      subtopicId: q.subtopicId,
      subtopicTitle: q.subtopicTitle,
      selectedLetter: letter,
      correctLetter: q.correctLetter,
      isCorrect,
      mode: 'diagnostico',
    });

    if (Object.keys(next).length === diagnosticQuestions.length) {
      const correctCount = diagnosticQuestions.filter((dq) => next[dq.id] === dq.correctLetter).length;
      const pct = Math.round((correctCount / diagnosticQuestions.length) * 100);
      onCompleteDiagnostic(discipline, currentStage.stageNumber, pct);
    }
  };

  const handleSelectPractice = (q: Question, letter: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (practiceAnswers[q.id]) return;
    const isCorrect = letter === q.correctLetter;
    setPracticeAnswers((prev) => ({ ...prev, [q.id]: letter }));
    onRecordAttempt({
      questionId: q.id,
      discipline,
      stageNumber: currentStage.stageNumber,
      subtopicId: q.subtopicId,
      subtopicTitle: q.subtopicTitle,
      selectedLetter: letter,
      correctLetter: q.correctLetter,
      isCorrect,
      mode: 'fixacao',
    });
  };

  const handleSelectEvalOption = (q: Question, letter: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (evalAnswers[q.id]) return;
    const isCorrect = letter === q.correctLetter;
    setEvalAnswers((prev) => ({ ...prev, [q.id]: letter }));
    onRecordAttempt({
      questionId: q.id,
      discipline,
      stageNumber: currentStage.stageNumber,
      subtopicId: q.subtopicId,
      subtopicTitle: q.subtopicTitle,
      selectedLetter: letter,
      correctLetter: q.correctLetter,
      isCorrect,
      mode: 'avaliacao',
    });
  };

  const allEvalAnswered = evalQuestions.every((q) => Boolean(evalAnswers[q.id]));

  const handleFinishEvaluation = async () => {
    if (!allEvalAnswered) return;
    const wrongQuestions = evalQuestions.filter((q) => evalAnswers[q.id] !== q.correctLetter);
    const correctCount = evalQuestions.length - wrongQuestions.length;
    const weakIds = Array.from(new Set(wrongQuestions.map((q) => q.subtopicId)));
    const weakTitles = Array.from(new Set(wrongQuestions.map((q) => q.subtopicTitle)));

    const res = onSubmitEvaluation({
      discipline,
      stageNumber: currentStage.stageNumber,
      correctCount,
      totalQuestions: evalQuestions.length,
      selfExplanation,
      weakSubtopics: weakTitles,
    });

    const feedbackText = await aiTutorBridge.generateTargetedFeedback({
      discipline,
      stageNumber: currentStage.stageNumber,
      weakSubtopics: weakTitles,
      studentExplanation: selfExplanation,
    });

    setWeakRetryIds(weakIds);
    setEvalResult({
      passed: res.passed,
      scorePercent: res.scorePercent,
      weakTitles,
      feedbackText,
    });
  };

  const handleGenerateNewEvaluation = () => {
    const usedIds = Array.from(new Set([...evalSeedExclude, ...evalQuestions.map((q) => q.id)]));
    setEvalSeedExclude(usedIds);
    const fresh = selectAdaptiveEvaluationQuestions(discipline, currentStage.stageNumber, {
      weakSubtopicIds: weakRetryIds,
      excludeIds: usedIds,
      count: 5,
    });
    setEvalQuestions(fresh);
    setEvalAnswers({});
    setEvalResult(null);
  };

  const showDiag = sectionTab === 'all' || sectionTab === 'diagnostico';
  const showTeoria = sectionTab === 'all' || sectionTab === 'teoria';
  const showIndustria = sectionTab === 'all' || sectionTab === 'industria';
  const showAvaliacao = sectionTab === 'all' || sectionTab === 'avaliacao';

  return (
    <div className="space-y-6">
      {/* Navegador de Etapas Progressivas */}
      <section className="surface-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
          <div>
            <h1 className="type-page-title">
              {isChem ? 'Trilha de Química (8 Etapas)' : 'Trilha de Física (9 Etapas)'}
            </h1>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Avanço bloqueado por padrão: atinja ≥ 80% na avaliação e escreva sua autoexplicação para liberar a próxima etapa.
            </p>
          </div>
          <span className={`font-mono text-xs font-semibold tabular-nums ${accentText}`}>
            {Object.values(stageMap).filter((s) => s.completed).length}/{track.length} concluídas
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {track.map((st) => {
            const prog = stageMap[st.stageNumber];
            const isUnlocked = prog?.unlocked ?? st.stageNumber === 1;
            const isCompleted = prog?.completed ?? false;
            const isActive = st.stageNumber === currentStage.stageNumber;

            return (
              <button
                key={st.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => isUnlocked && setActiveStageNum(st.stageNumber)}
                className={`flex min-h-16 flex-col justify-between rounded-lg border p-2.5 text-left transition ${
                  !isUnlocked
                    ? 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] cursor-not-allowed opacity-70'
                    : isActive
                      ? `${accentSoft} ring-1 ${
                          isChem ? 'ring-[var(--color-primary)]' : 'ring-[var(--color-secondary)]'
                        } cursor-pointer`
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    Etapa {st.stageNumber}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0" aria-label="Concluída" />
                  ) : isUnlocked ? (
                    <Unlock className={`h-4 w-4 shrink-0 ${accentText}`} aria-label="Desbloqueada" />
                  ) : (
                    <Lock className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" aria-label="Bloqueada" />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-[var(--color-text)]">
                  {st.title}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Cabeçalho da Etapa + Abas Internas de Navegação Guiada */}
      <section className="surface-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className={`text-xs font-semibold ${accentText}`}>
              {isChem ? 'Química' : 'Física'} · Etapa {currentStage.stageNumber} de {track.length}
            </p>
            <h2 className="type-page-title mt-1">{currentStage.title}</h2>
            <p className="type-body mt-1">{currentStage.subtitle}</p>
          </div>

          <div className="surface-inset p-3.5 text-xs text-[var(--color-text-secondary)] max-w-md">
            <p className="font-semibold text-[var(--color-text)]">Por que esta etapa vem agora?</p>
            <p className="mt-1 leading-relaxed">{currentStage.whyNow}</p>
          </div>
        </div>

        <div className="surface-inset p-3.5 text-xs text-[var(--color-text-secondary)] space-y-3">
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
              <FileText className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <span>Mapeamento no PDF base ({currentStage.pdfPages})</span>
            </div>
            <p className="mt-1 leading-relaxed">{currentStage.pdfComparisonNote}</p>
          </div>

          {stageMaps.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-semibold text-[var(--color-text)] mb-2">
                Mapas visuais do PDF vinculados a esta etapa (clique para ampliar):
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {stageMaps.map((m, idx) => (
                  <button
                    key={m.pageNumber}
                    type="button"
                    onClick={() => setStageMapLightboxIdx(idx)}
                    className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-left transition hover:border-[var(--color-primary)] cursor-pointer"
                  >
                    <div className="aspect-[1520/1075] w-full overflow-hidden bg-slate-100">
                      <img
                        src={m.imageUrl}
                        alt={`${m.title} — Página ${m.pageNumber}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-2">
                      <span className="font-mono text-xs font-semibold text-[var(--color-text-muted)] tabular-nums">
                        p. {m.pageNumber}
                      </span>
                      <p className="truncate text-xs font-semibold text-[var(--color-text)]">
                        {m.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {stageMapLightboxIdx !== null && (
          <MapLightboxModal
            items={stageLightboxItems}
            currentIndex={stageMapLightboxIdx}
            onChangeIndex={setStageMapLightboxIdx}
            onClose={() => setStageMapLightboxIdx(null)}
          />
        )}

        {/* Checklist de Subtópicos */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-text)] mb-2 flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
            <span>Subtópicos da etapa (toque para registrar estudo):</span>
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {currentStage.subtopics.map((sub) => {
              const stat = state.subtopicStats[sub.id];
              const isMastered = stat?.status === 'dominado';
              const isStudied =
                currentProgress?.studiedSubtopics.includes(sub.id) ||
                (stat && stat.status !== 'nao_iniciado');

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onMarkSubtopicStudied(discipline, currentStage.stageNumber, sub.id)}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-lg border px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                    isMastered
                      ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                      : isStudied
                        ? 'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                >
                  <span className="font-medium">{sub.title}</span>
                  <span className="font-mono text-xs font-semibold shrink-0">
                    {isMastered ? 'Dominado' : isStudied ? 'Estudado' : 'Marcar'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Abas do Roteiro de 10 Passos (evita sobrecarga cognitiva) */}
        <div className="border-t border-[var(--color-border)] pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Etapas da aula">
            {(
              [
                { id: 'diagnostico', label: '1. Diagnóstico' },
                { id: 'teoria', label: '2–4. Explicação & Exemplos' },
                { id: 'industria', label: '5–8. Indústria, 3D & Pegadinhas' },
                { id: 'avaliacao', label: '9–10. Fixação & Avaliação' },
                { id: 'all', label: 'Ver tudo (10 passos)' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={sectionTab === t.id}
                onClick={() => setSectionTab(t.id)}
                className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  sectionTab === t.id
                    ? isChem
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white'
                    : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PASSO 1: DIAGNÓSTICO INICIAL */}
      {showDiag && (
        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="type-section-title">1. Diagnóstico inicial da etapa</h3>
            <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
              {currentProgress?.diagnosticCompleted
                ? `Concluído (${currentProgress.diagnosticScorePercent ?? 0}%)`
                : `${Object.keys(diagAnswers).length}/${diagnosticQuestions.length} respondidas`}
            </span>
          </div>
          <p className="type-body mt-1">{currentStage.step1DiagnosticIntro}</p>

          <div className="mt-4 space-y-4">
            {diagnosticQuestions.map((q, idx) => (
              <InlineQuestionCard
                key={q.id}
                index={idx + 1}
                question={q}
                selectedLetter={diagAnswers[q.id]}
                onSelect={(letter) => handleSelectDiagnostic(q, letter)}
              />
            ))}
          </div>

          {sectionTab === 'diagnostico' && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSectionTab('teoria')}
                className={accentBtn}
              >
                <span>Ir para Explicação & Exemplos</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* PASSOS 2, 3 E 4: EXPLICAÇÃO SIMPLIFICADA, CONCEITO TÉCNICO E EXEMPLOS */}
      {showTeoria && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface-card p-5 sm:p-6">
              <h3 className="type-section-title flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <span>2. Explicação simplificada</span>
              </h3>
              <ul className="mt-3 space-y-3 type-body">
                {currentStage.step2SimpleExplanation.map((p, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className={`font-mono text-xs font-bold mt-1.5 ${accentText}`}>•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <h3 className="type-section-title flex items-center gap-2">
                <BookOpen className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <span>3. Conceito técnico de prova</span>
              </h3>
              <ul className="mt-3 space-y-3 type-body">
                {currentStage.step3TechnicalConcept.map((p, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="font-mono text-xs font-bold mt-1.5 text-[var(--color-text-muted)]">
                      {idx + 1}.
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h3 className="type-section-title">4. Exemplos práticos passo a passo</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {currentStage.step4WorkedExamples.map((ex, idx) => (
                <div key={idx} className="surface-inset p-4 space-y-2.5">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{ex.title}</p>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {ex.problem}
                  </p>
                  <ol className="space-y-1.5 text-xs sm:text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-2.5">
                    {ex.steps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="rounded-lg bg-[var(--color-surface)] px-3 py-2 font-mono text-xs font-semibold text-[var(--color-text)] border border-[var(--color-border)]">
                    Resposta: {ex.finalAnswer}
                  </p>
                </div>
              ))}
            </div>

            {sectionTab === 'teoria' && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSectionTab('industria')}
                  className={accentBtn}
                >
                  <span>Ir para Indústria, Modelo 3D & Pegadinhas</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* PASSOS 5, 6, 7 E 8: INDÚSTRIA, FÓRMULAS, MODELO 3D/SVG E PEGADINHAS */}
      {showIndustria && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface-card p-5 sm:p-6 space-y-3">
              <h3 className="type-section-title flex items-center gap-2">
                <Factory className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <span>5. Cotidiano e Petrobras / Transpetro</span>
              </h3>
              <div className="surface-inset p-3.5 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                <p className="font-semibold text-[var(--color-text)]">No cotidiano</p>
                <p className="mt-1 leading-relaxed">{currentStage.step5IndustryApplication.dailyLife}</p>
              </div>
              <div className={`rounded-xl border p-3.5 text-xs sm:text-sm ${accentSoft}`}>
                <p className={`font-semibold ${accentText}`}>
                  Aplicação em Dutos, Refino e Terminais
                </p>
                <p className="mt-1 text-[var(--color-text)] leading-relaxed">
                  {currentStage.step5IndustryApplication.petrobrasTranspetro}
                </p>
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6 space-y-3">
              <h3 className="type-section-title flex items-center gap-2">
                <FlaskConical className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <span>6. Fórmulas e unidades (SI e industriais)</span>
              </h3>
              <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                {currentStage.step6FormulasAndUnits.map((f, idx) => (
                  <div key={idx} className="p-3.5 space-y-1.5">
                    <p className="font-mono text-sm font-bold text-[var(--color-text)]">
                      {f.expression}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{f.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
                      {f.variables.map((v) => (
                        <span key={v.symbol}>
                          <strong className="font-mono text-[var(--color-text)]">{v.symbol}</strong>:{' '}
                          {v.meaning} ({v.unit})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h3 className="type-section-title mb-3">7. Modelo visual interativo (3D / Esquema)</h3>
            {currentStage.step7VisualModel.type === 'svg-diagram' ? (
              <SVGDiagramViewer
                preset={currentStage.step7VisualModel.preset}
                caption={currentStage.step7VisualModel.caption}
              />
            ) : (
              <ThreeDScienceViewer
                mode={
                  currentStage.step7VisualModel.type === '3d-atom'
                    ? 'atom'
                    : currentStage.step7VisualModel.type === '3d-molecule'
                      ? 'molecule'
                      : currentStage.step7VisualModel.type === '3d-inclined-plane'
                        ? 'inclined-plane'
                        : 'em-wave'
                }
                preset={currentStage.step7VisualModel.preset}
                caption={currentStage.step7VisualModel.caption}
              />
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] p-5 sm:p-6">
            <h3 className="type-section-title flex items-center gap-2 text-[var(--color-warning-text)]">
              <ShieldAlert className="h-4 w-4 text-[var(--color-warning)]" aria-hidden="true" />
              <span>8. Pegadinhas clássicas da CESGRANRIO</span>
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-warning-text)]">
              {currentStage.step8ExamTraps.map((trap, idx) => (
                <li key={idx} className="flex gap-2.5 leading-relaxed">
                  <span className="font-mono font-bold">!</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>

            {sectionTab === 'industria' && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSectionTab('avaliacao')}
                  className={accentBtn}
                >
                  <span>Ir para Fixação & Avaliação Final</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* PASSOS 9 E 10: EXERCÍCIOS DE FIXAÇÃO E AVALIAÇÃO DE DOMÍNIO */}
      {showAvaliacao && (
        <div className="space-y-6">
          <section className="surface-card p-5 sm:p-6">
            <h3 className="type-section-title">9. Exercícios guiados de fixação</h3>
            <p className="type-body mt-1">{currentStage.step9PracticePrompt}</p>
            <div className="mt-4 space-y-4">
              {practiceQuestions.map((q, idx) => (
                <InlineQuestionCard
                  key={q.id}
                  index={idx + 1}
                  question={q}
                  selectedLetter={practiceAnswers[q.id]}
                  onSelect={(letter) => handleSelectPractice(q, letter)}
                />
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="type-section-title flex items-center gap-2">
                  <ClipboardCheck className={`h-5 w-5 ${accentText}`} aria-hidden="true" />
                  <span>10. Avaliação de domínio e autoexplicação</span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)]">
                  Para desbloquear a próxima etapa, atinja pelo menos 80% de acerto nas 5 questões e escreva a explicação com suas próprias palavras.
                </p>
              </div>

              {currentProgress?.completed && (
                <span className="font-mono text-xs font-semibold text-[var(--color-success)] tabular-nums">
                  Etapa dominada (Melhor nota: {currentProgress.bestEvaluationPercent}%)
                </span>
              )}
            </div>

            <div className="surface-inset mt-4 p-4">
              <label className="block text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                Desafio de autoexplicação: {currentStage.step10SelfExplanationPrompt}
                <textarea
                  value={selfExplanation}
                  onChange={(e) => setSelfExplanation(e.target.value)}
                  rows={3}
                  placeholder="Escreva aqui com suas palavras (mínimo 25 caracteres)..."
                  className="input-control mt-2 min-h-24 py-2.5"
                />
              </label>
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)] tabular-nums">
                {selfExplanation.trim().length}/25 caracteres mínimos exigidos
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {evalQuestions.map((q, idx) => (
                <InlineQuestionCard
                  key={q.id}
                  index={idx + 1}
                  question={q}
                  selectedLetter={evalAnswers[q.id]}
                  onSelect={(letter) => handleSelectEvalOption(q, letter)}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
              <button
                type="button"
                disabled={!allEvalAnswered}
                onClick={handleFinishEvaluation}
                className={accentBtn}
              >
                <span>Finalizar avaliação da etapa</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleGenerateNewEvaluation}
                className="btn-secondary"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Gerar nova bateria (sem repetir)</span>
              </button>
            </div>

            {evalResult && (
              <div
                role="alert"
                className={`mt-4 rounded-xl border p-4 ${
                  evalResult.passed
                    ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                    : 'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold">
                      {evalResult.passed
                        ? `Etapa ${currentStage.stageNumber} dominada com ${evalResult.scorePercent}%`
                        : `Desempenho insuficiente: ${evalResult.scorePercent}% (mínimo 80% + autoexplicação)`}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed">{evalResult.feedbackText}</p>
                  </div>
                  <span className="font-mono text-lg font-bold tabular-nums">{evalResult.scorePercent}%</span>
                </div>

                {!evalResult.passed && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleGenerateNewEvaluation}
                      className="btn-primary bg-[var(--color-error)] hover:bg-red-800 text-xs"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      <span>Gerar questões inéditas focadas nos seus erros</span>
                    </button>
                  </div>
                )}

                {evalResult.passed && currentStage.stageNumber < track.length && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStageNum(currentStage.stageNumber + 1);
                        setSectionTab('diagnostico');
                      }}
                      className="btn-primary bg-[var(--color-success)] hover:bg-green-800 text-xs"
                    >
                      <span>Avançar para Etapa {currentStage.stageNumber + 1}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

interface InlineQuestionCardProps {
  index: number;
  question: Question;
  selectedLetter?: 'A' | 'B' | 'C' | 'D' | 'E';
  onSelect: (letter: 'A' | 'B' | 'C' | 'D' | 'E') => void;
}

function InlineQuestionCard({ index, question, selectedLetter, onSelect }: InlineQuestionCardProps) {
  const answered = Boolean(selectedLetter);
  const isCorrect = selectedLetter === question.correctLetter;

  return (
    <div className="surface-inset p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
        <span className="font-mono font-semibold text-[var(--color-text)]">
          Questão {index} · {question.subtopicTitle}
        </span>
        <span>
          Nível: {question.level} {question.pdfReference ? `· ${question.pdfReference}` : ''}
        </span>
      </div>

      <p className="mt-2 text-sm sm:text-[15px] font-medium text-[var(--color-text)] leading-relaxed">
        {question.prompt}
      </p>

      <div className="mt-3 space-y-2">
        {question.options.map((opt) => {
          const isChosen = selectedLetter === opt.letter;
          const isRightOption = opt.letter === question.correctLetter;

          let btnStyle =
            'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-slate-50';
          if (answered) {
            if (isRightOption) {
              btnStyle =
                'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]';
            } else if (isChosen) {
              btnStyle =
                'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]';
            } else {
              btnStyle =
                'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]';
            }
          }

          return (
            <button
              key={opt.letter}
              type="button"
              disabled={answered}
              onClick={() => onSelect(opt.letter)}
              className={`w-full min-h-11 rounded-lg border p-3 text-left text-xs sm:text-sm transition ${btnStyle} ${
                answered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono font-bold shrink-0">{opt.letter})</span>
                <div className="flex-1">
                  <p className="font-medium leading-snug">{opt.text}</p>
                  {answered && (
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {opt.justification}
                    </p>
                  )}
                </div>
                {answered && isRightOption && (
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" aria-hidden="true" />
                )}
                {answered && isChosen && !isRightOption && (
                  <XCircle className="h-4 w-4 text-[var(--color-error)] shrink-0 mt-0.5" aria-hidden="true" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3 space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-xs sm:text-sm">
          <p
            className={`font-bold ${
              isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
            }`}
          >
            {isCorrect
              ? `Correto! Alternativa ${question.correctLetter}.`
              : `Você marcou ${selectedLetter}, mas a correta é ${question.correctLetter}.`}
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {question.detailedExplanation}
          </p>
          <p className="flex items-start gap-2 rounded-md bg-[var(--color-warning-soft)] p-2.5 text-xs text-[var(--color-warning-text)]">
            <AlertTriangle className="h-4 w-4 text-[var(--color-warning)] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Pegadinha:</strong> {question.trapWarning}
            </span>
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            <strong>Conceito para revisar:</strong> {question.conceptToReview}
          </p>
        </div>
      )}
    </div>
  );
}
