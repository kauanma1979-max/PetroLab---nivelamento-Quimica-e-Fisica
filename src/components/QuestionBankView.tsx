import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  HelpCircle,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { ALL_QUESTIONS } from '../data/questionBank';
import { Discipline, Question, QuestionLevel, StudentProgressState } from '../types';

interface QuestionBankViewProps {
  state: StudentProgressState;
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
}

const LEVEL_LABELS: Record<QuestionLevel, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  cesgranrio: 'Estilo CESGRANRIO',
};

export function QuestionBankView({ state, onRecordAttempt }: QuestionBankViewProps) {
  const [disciplineFilter, setDisciplineFilter] = useState<'all' | Discipline>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | QuestionLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'wrong' | 'correct'>('all');
  const [search, setSearch] = useState('');
  const [sessionAnswers, setSessionAnswers] = useState<
    Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>
  >({});

  const latestAttemptByQuestion = useMemo(() => {
    const map: Record<string, { selectedLetter: 'A' | 'B' | 'C' | 'D' | 'E'; isCorrect: boolean }> = {};
    state.attempts.forEach((a) => {
      map[a.questionId] = { selectedLetter: a.selectedLetter, isCorrect: a.isCorrect };
    });
    return map;
  }, [state.attempts]);

  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      if (disciplineFilter !== 'all' && q.discipline !== disciplineFilter) return false;
      if (stageFilter !== 'all' && String(q.stageNumber) !== stageFilter) return false;
      if (levelFilter !== 'all' && q.level !== levelFilter) return false;

      const lastAtt = latestAttemptByQuestion[q.id];
      if (statusFilter === 'unanswered' && lastAtt) return false;
      if (statusFilter === 'wrong' && (!lastAtt || lastAtt.isCorrect)) return false;
      if (statusFilter === 'correct' && (!lastAtt || !lastAtt.isCorrect)) return false;

      if (search.trim()) {
        const s = search.trim().toLowerCase();
        const hit =
          q.prompt.toLowerCase().includes(s) ||
          q.subtopicTitle.toLowerCase().includes(s) ||
          q.conceptToReview.toLowerCase().includes(s);
        if (!hit) return false;
      }
      return true;
    });
  }, [disciplineFilter, stageFilter, levelFilter, statusFilter, search, latestAttemptByQuestion]);

  const hasFilters =
    disciplineFilter !== 'all' ||
    stageFilter !== 'all' ||
    levelFilter !== 'all' ||
    statusFilter !== 'all' ||
    search.trim() !== '';

  const resetAllFilters = () => {
    setDisciplineFilter('all');
    setStageFilter('all');
    setLevelFilter('all');
    setStatusFilter('all');
    setSearch('');
  };

  const handleSelectOption = (q: Question, letter: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (sessionAnswers[q.id]) return;
    setSessionAnswers((prev) => ({ ...prev, [q.id]: letter }));
    onRecordAttempt({
      questionId: q.id,
      discipline: q.discipline,
      stageNumber: q.stageNumber,
      subtopicId: q.subtopicId,
      subtopicTitle: q.subtopicTitle,
      selectedLetter: letter,
      correctLetter: q.correctLetter,
      isCorrect: letter === q.correctLetter,
      mode: 'banco',
    });
  };

  const retryQuestion = (questionId: string) => {
    setSessionAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Treino Direcionado · {ALL_QUESTIONS.length} Questões de 5 Alternativas (A–E)
            </p>
            <h2 className="type-page-title mt-0.5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
              <span>Banco de Questões Comentadas</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              A resposta nunca é revelada antes da sua tentativa. Após responder, confira a justificativa das 5 alternativas, a pegadinha e o conceito para revisar.
            </p>
          </div>
          <span className="font-mono text-sm font-semibold text-[var(--color-text-secondary)] tabular-nums shrink-0">
            Exibindo {filteredQuestions.length} de {ALL_QUESTIONS.length}
          </span>
        </div>

        {/* Filtros */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-[var(--color-border)] pt-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar assunto ou termo..."
              aria-label="Buscar questões por assunto ou termo"
              className="input-control pl-9"
            />
          </div>

          <select
            aria-label="Filtrar por disciplina"
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value as 'all' | Discipline)}
            className="input-control"
          >
            <option value="all">Todas as disciplinas</option>
            <option value="quimica">Química (8 etapas)</option>
            <option value="fisica">Física (9 etapas)</option>
          </select>

          <select
            aria-label="Filtrar por etapa"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="input-control"
          >
            <option value="all">Todas as etapas</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={String(n)}>
                Etapa {n}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por nível"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as 'all' | QuestionLevel)}
            className="input-control"
          >
            <option value="all">Todos os níveis</option>
            <option value="basico">Básico</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
            <option value="cesgranrio">Estilo CESGRANRIO</option>
          </select>

          <select
            aria-label="Filtrar por histórico"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unanswered' | 'wrong' | 'correct')}
            className="input-control"
          >
            <option value="all">Qualquer status</option>
            <option value="unanswered">Ainda não respondidas</option>
            <option value="wrong">Erradas (refazer)</option>
            <option value="correct">Acertadas</option>
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>Filtros ativos</span>
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="btn-secondary !min-h-10"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Limpar filtros</span>
            </button>
          </div>
        )}
      </section>

      {/* Lista de Questões */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <p className="text-base font-semibold text-[var(--color-text)]">
              Nenhuma questão encontrada para os filtros selecionados.
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Tente limpar a busca ou escolher outra etapa e nível de dificuldade.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="btn-primary mt-4"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Mostrar todas as questões</span>
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const chosen = sessionAnswers[q.id];
            const answered = Boolean(chosen);
            const pastAttempt = latestAttemptByQuestion[q.id];

            return (
              <article key={q.id} className="surface-card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold ${
                        q.discipline === 'quimica'
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-secondary)]'
                      }`}
                    >
                      {q.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {q.stageNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[var(--color-text)]">{q.subtopicTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{LEVEL_LABELS[q.level]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {q.pdfReference && <span className="font-mono text-xs">{q.pdfReference}</span>}
                    {pastAttempt && !answered && (
                      <span
                        className={`font-mono text-xs font-semibold ${
                          pastAttempt.isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                        }`}
                      >
                        Histórico: {pastAttempt.isCorrect ? 'Acertou antes' : 'Errou antes'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[15px] font-medium text-[var(--color-text)] leading-relaxed">
                  {q.prompt}
                </p>

                <div className="mt-4 space-y-2.5">
                  {q.options.map((opt) => {
                    const isPicked = chosen === opt.letter;
                    const isRight = opt.letter === q.correctLetter;

                    let style =
                      'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-surface)]';
                    if (answered) {
                      if (isRight) {
                        style =
                          'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]';
                      } else if (isPicked) {
                        style =
                          'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]';
                      } else {
                        style =
                          'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]';
                      }
                    }

                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        disabled={answered}
                        onClick={() => handleSelectOption(q, opt.letter)}
                        className={`w-full min-h-12 rounded-lg border p-3.5 text-left text-sm transition ${style} ${
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
                          {answered && isRight && (
                            <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                          {answered && isPicked && !isRight && (
                            <XCircle className="h-4 w-4 text-[var(--color-error)] shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="surface-inset mt-4 space-y-2.5 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={`font-bold ${
                          chosen === q.correctLetter
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-error)]'
                        }`}
                      >
                        {chosen === q.correctLetter
                          ? `Excelente! Resposta correta: alternativa ${q.correctLetter}.`
                          : `Você escolheu ${chosen}, mas o gabarito é ${q.correctLetter}.`}
                      </p>
                      <button
                        type="button"
                        onClick={() => retryQuestion(q.id)}
                        className="btn-secondary !min-h-10"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Refazer</span>
                      </button>
                    </div>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {q.detailedExplanation}
                    </p>
                    <p className="flex items-start gap-2 rounded-lg border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] p-3 text-xs text-[var(--color-warning-text)]">
                      <AlertTriangle className="h-4 w-4 text-[var(--color-warning)] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>Pegadinha:</strong> {q.trapWarning}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      <strong>Conceito para revisar:</strong> {q.conceptToReview}
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
