import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Download,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import { Discipline, MasteryStatus, StudentProgressState } from '../types';

interface PerformanceViewProps {
  state: StudentProgressState;
  onOpenStage: (discipline: Discipline, stageNumber: number) => void;
  onExportJSON: () => string;
  onImportJSON: (json: string) => boolean;
  onResetProgress: () => void;
}

const STATUS_LABELS: Record<MasteryStatus, { label: string; color: string }> = {
  nao_iniciado: { label: 'Não iniciado', color: 'text-[var(--color-text-muted)]' },
  em_aprendizado: { label: 'Em aprendizado', color: 'text-[var(--color-info-text)] font-medium' },
  em_revisao: { label: 'Em revisão', color: 'text-[var(--color-warning)] font-semibold' },
  dominado: { label: 'Dominado', color: 'text-[var(--color-success)] font-semibold' },
};

export function PerformanceView({
  state,
  onOpenStage,
  onExportJSON,
  onImportJSON,
  onResetProgress,
}: PerformanceViewProps) {
  const [discTab, setDiscTab] = useState<'all' | Discipline>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MasteryStatus>('all');
  const [importFeedback, setImportFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const subtopicList = useMemo(() => {
    return Object.values(state.subtopicStats)
      .filter((s) => (discTab === 'all' ? true : s.discipline === discTab))
      .filter((s) => (statusFilter === 'all' ? true : s.status === statusFilter))
      .sort((a, b) => {
        if (a.discipline !== b.discipline) return a.discipline.localeCompare(b.discipline);
        return a.stageNumber - b.stageNumber;
      });
  }, [state.subtopicStats, discTab, statusFilter]);

  const errorHotspots = useMemo(() => {
    return Object.values(state.subtopicStats)
      .filter((s) => s.wrongCount > 0)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 6);
  }, [state.subtopicStats]);

  const handleDownloadBackup = () => {
    const json = onExportJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petrolab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportFeedback({ ok: true, text: 'Arquivo de backup JSON baixado com sucesso.' });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportJSON(String(reader.result || ''));
      setImportFeedback({
        ok,
        text: ok
          ? 'Backup restaurado com sucesso!'
          : 'Arquivo JSON inválido. Selecione um backup válido do PetroLab.',
      });
    };
    reader.onerror = () => {
      setImportFeedback({
        ok: false,
        text: 'Não foi possível ler o arquivo selecionado.',
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho + Backup JSON */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Registro Permanente · Histórico Nunca Apagado Automaticamente
            </p>
            <h2 className="type-page-title mt-0.5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
              <span>Meu Desempenho e Ciclo de Revisão</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Acompanhamento real por disciplina, etapa e subtópico. Questões não respondidas não contam como erro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="btn-secondary !min-h-11"
            >
              <Download className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Backup JSON</span>
            </button>

            <label className="btn-secondary !min-h-11">
              <Upload className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
              <span>Restaurar JSON</span>
              <input type="file" accept=".json,application/json" onChange={handleFileImport} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[var(--color-error-border)] bg-[var(--color-error-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--color-error-text)] hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>Zerar progresso</span>
            </button>
          </div>
        </div>

        {importFeedback && (
          <p
            role="status"
            className={`mt-4 rounded-lg border px-4 py-2.5 text-sm font-medium ${
              importFeedback.ok
                ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                : 'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]'
            }`}
          >
            {importFeedback.text}
          </p>
        )}

        {confirmResetOpen && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-error-border)] bg-[var(--color-error-soft)] p-4 text-sm text-[var(--color-error-text)]">
            <span className="font-medium">
              Tem certeza? Isso apagará todo o histórico salvo neste navegador.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="btn-secondary !min-h-10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmResetOpen(false);
                  setImportFeedback({ ok: true, text: 'Histórico reiniciado do zero.' });
                }}
                className="min-h-10 rounded-lg bg-[var(--color-error)] px-4 py-2 text-xs font-semibold text-white cursor-pointer hover:opacity-95"
              >
                Confirmar exclusão
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Pontos Críticos & Avaliações */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="surface-card p-5 sm:p-6">
          <h3 className="type-section-title flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[var(--color-error)]" aria-hidden="true" />
            <span>Pontos Críticos (Onde você errou mais)</span>
          </h3>
          {errorHotspots.length === 0 ? (
            <div className="surface-inset mt-3 p-4 text-sm text-[var(--color-text-muted)]">
              <p>Nenhum erro registrado até o momento.</p>
              <button
                type="button"
                onClick={() => onOpenStage('quimica', 1)}
                className="btn-secondary !min-h-10 mt-3"
              >
                Praticar Química — Etapa 1 →
              </button>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--color-border)] text-sm">
              {errorHotspots.map((s) => (
                <li key={s.subtopicId} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{s.subtopicTitle}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {s.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {s.stageNumber} ·{' '}
                      {s.wrongCount} erro(s) em {s.answeredCount} respondidas
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStage(s.discipline, s.stageNumber)}
                    className="btn-secondary !min-h-10 !text-[var(--color-error)]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Revisar</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-5 sm:p-6">
          <h3 className="type-section-title flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" aria-hidden="true" />
            <span>Avaliações de Domínio ({state.evaluations.length})</span>
          </h3>
          {state.evaluations.length === 0 ? (
            <div className="surface-inset mt-3 p-4 text-sm text-[var(--color-text-muted)]">
              <p>
                Nenhuma avaliação final de etapa enviada ainda. Conclua a Etapa 1 de Química ou Física para registrar seu domínio.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenStage('quimica', 1)}
                  className="btn-primary !min-h-10"
                >
                  Ir para Química 1
                </button>
                <button
                  type="button"
                  onClick={() => onOpenStage('fisica', 1)}
                  className="btn-physics !min-h-10"
                >
                  Ir para Física 1
                </button>
              </div>
            </div>
          ) : (
            <ul className="mt-3 space-y-2.5 text-sm max-h-72 overflow-y-auto pr-1">
              {[...state.evaluations].reverse().map((ev) => (
                <li key={ev.id} className="surface-inset p-3.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-[var(--color-text)]">
                      {ev.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {ev.stageNumber}
                    </span>
                    <span
                      className={`font-mono tabular-nums ${
                        ev.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                      }`}
                    >
                      {ev.scorePercent}% ({ev.passed ? 'Aprovado' : 'Reforço necessário'})
                    </span>
                  </div>
                  {ev.selfExplanation && (
                    <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] italic">
                      &ldquo;{ev.selfExplanation}&rdquo;
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Matriz Completa de Subtópicos */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
          <h3 className="type-section-title">
            Matriz Completa de Subtópicos ({subtopicList.length})
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              aria-label="Filtrar disciplina na matriz"
              value={discTab}
              onChange={(e) => setDiscTab(e.target.value as 'all' | Discipline)}
              className="input-control !w-auto"
            >
              <option value="all">Todas as disciplinas</option>
              <option value="quimica">Química</option>
              <option value="fisica">Física</option>
            </select>
            <select
              aria-label="Filtrar status na matriz"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | MasteryStatus)}
              className="input-control !w-auto"
            >
              <option value="all">Todos os status</option>
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_aprendizado">Em aprendizado</option>
              <option value="em_revisao">Em revisão</option>
              <option value="dominado">Dominado</option>
            </select>
          </div>
        </div>

        {subtopicList.length === 0 ? (
          <div className="surface-inset mt-4 p-6 text-center text-sm text-[var(--color-text-muted)]">
            <p>Nenhum subtópico corresponde ao filtro selecionado.</p>
            <button
              type="button"
              onClick={() => {
                setDiscTab('all');
                setStatusFilter('all');
              }}
              className="btn-secondary !min-h-10 mt-3"
            >
              Mostrar todos os subtópicos
            </button>
          </div>
        ) : (
          <>
            {/* Visão Mobile em cartões limpos */}
            <div className="mt-4 space-y-2.5 md:hidden">
              {subtopicList.map((s) => {
                const st = STATUS_LABELS[s.status];
                return (
                  <div key={s.subtopicId} className="surface-inset p-3.5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          s.discipline === 'quimica'
                            ? 'text-[var(--color-primary)]'
                            : 'text-[var(--color-secondary)]'
                        }`}
                      >
                        {s.discipline === 'quimica' ? 'Química' : 'Física'} · Etapa {s.stageNumber}
                      </span>
                      <span className={`text-xs ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="mt-1 font-semibold text-[var(--color-text)]">{s.subtopicTitle}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
                        Resp: {s.answeredCount} · Acertos: {s.correctCount} · Erros: {s.wrongCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenStage(s.discipline, s.stageNumber)}
                        className="btn-secondary !min-h-10 !px-3"
                      >
                        Abrir →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabela para Tablet/Desktop */}
            <div className="mt-3 hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    <th className="py-2.5 pr-3 font-semibold">Disciplina / Etapa</th>
                    <th className="py-2.5 px-3 font-semibold">Subtópico</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Respondidas</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Acertos</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Erros</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 pl-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {subtopicList.map((s) => {
                    const st = STATUS_LABELS[s.status];
                    return (
                      <tr key={s.subtopicId} className="hover:bg-[var(--color-surface-muted)]">
                        <td className="py-3 pr-3 whitespace-nowrap text-xs">
                          <span
                            className={`font-semibold ${
                              s.discipline === 'quimica'
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-secondary)]'
                            }`}
                          >
                            {s.discipline === 'quimica' ? 'Química' : 'Física'}
                          </span>{' '}
                          · E{s.stageNumber}
                        </td>
                        <td className="py-3 px-3 font-medium text-[var(--color-text)]">{s.subtopicTitle}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{s.answeredCount}</td>
                        <td className="py-3 px-3 text-right font-mono text-[var(--color-success)] tabular-nums">
                          {s.correctCount}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[var(--color-error)] tabular-nums">
                          {s.wrongCount}
                        </td>
                        <td className={`py-3 px-3 whitespace-nowrap text-xs ${st.color}`}>{st.label}</td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onOpenStage(s.discipline, s.stageNumber)}
                            className="btn-secondary !min-h-10 !px-3"
                          >
                            Abrir →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
