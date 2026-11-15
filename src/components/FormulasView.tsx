import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Search, Star, XCircle } from 'lucide-react';
import { FORMULA_LIBRARY } from '../data/formulas';
import { Discipline } from '../types';

interface FormulasViewProps {
  favoriteFormulaIds: string[];
  onToggleFavorite: (formulaId: string) => void;
}

export function FormulasView({ favoriteFormulaIds, onToggleFavorite }: FormulasViewProps) {
  const [discFilter, setDiscFilter] = useState<'all' | Discipline>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [quickAnswers, setQuickAnswers] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return FORMULA_LIBRARY.filter((f) => {
      if (discFilter !== 'all' && f.discipline !== discFilter) return false;
      if (onlyFavorites && !favoriteFormulaIds.includes(f.id)) return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        const hit =
          f.title.toLowerCase().includes(s) ||
          f.expression.toLowerCase().includes(s) ||
          f.whenToUse.toLowerCase().includes(s);
        if (!hit) return false;
      }
      return true;
    });
  }, [discFilter, onlyFavorites, search, favoriteFormulaIds]);

  const resetFilters = () => {
    setDiscFilter('all');
    setOnlyFavorites(false);
    setSearch('');
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-secondary)]">
              Consulta Rápida de Unidades SI, Exemplos e Erros Comuns
            </p>
            <h2 className="type-page-title mt-0.5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--color-secondary)] shrink-0" aria-hidden="true" />
              <span>Biblioteca de Fórmulas e Resumos</span>
            </h2>
          </div>
          <span className="font-mono text-sm font-semibold text-[var(--color-text-secondary)] tabular-nums shrink-0">
            Favoritas: {favoriteFormulaIds.length} · Exibindo {filtered.length}/{FORMULA_LIBRARY.length}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-[var(--color-border)] pt-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar fórmula (densidade, Ohm, Carnot, gases...)"
              aria-label="Buscar fórmula"
              className="input-control pl-9"
            />
          </div>

          <button
            type="button"
            onClick={() => setDiscFilter('all')}
            className={`min-h-11 rounded-lg border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              discFilter === 'all'
                ? 'border-[var(--color-text)] bg-[var(--color-text)] text-white'
                : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setDiscFilter('quimica')}
            className={discFilter === 'quimica' ? 'btn-primary' : 'btn-secondary !min-h-11'}
          >
            Química
          </button>
          <button
            type="button"
            onClick={() => setDiscFilter('fisica')}
            className={discFilter === 'fisica' ? 'btn-physics' : 'btn-secondary !min-h-11'}
          >
            Física
          </button>
          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            aria-pressed={onlyFavorites}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              onlyFavorites
                ? 'border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]'
                : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <Star
              className={`h-4 w-4 ${onlyFavorites ? 'fill-amber-500 text-amber-600' : ''}`}
              aria-hidden="true"
            />
            <span>Favoritas</span>
          </button>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-base font-semibold text-[var(--color-text)]">
            {onlyFavorites && favoriteFormulaIds.length === 0
              ? 'Você ainda não marcou nenhuma fórmula como favorita.'
              : 'Nenhuma fórmula encontrada para os filtros atuais.'}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Clique na estrela de qualquer fórmula para fixá-la aqui ou restaure a visualização completa.
          </p>
          <button type="button" onClick={resetFilters} className="btn-primary mt-4">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Mostrar todas as fórmulas</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((item) => {
            const isFav = favoriteFormulaIds.includes(item.id);
            const isChem = item.discipline === 'quimica';
            const chosenQuick = quickAnswers[item.id];

            return (
              <article key={item.id} className="surface-card p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        isChem ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
                      }`}
                    >
                      {isChem ? 'Química' : 'Física'} · Etapa {item.stageNumber} · {item.pdfReference}
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-[var(--color-text)]">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    aria-pressed={isFav}
                    aria-label={isFav ? `Remover ${item.title} das favoritas` : `Favoritar ${item.title}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] cursor-pointer shrink-0"
                  >
                    <Star
                      className={`h-5 w-5 ${isFav ? 'fill-amber-400 text-amber-600' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="rounded-lg bg-[var(--color-surface-dark)] px-4 py-3 font-mono text-base font-bold text-white">
                  {item.expression}
                </div>

                <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  {item.variables.map((v) => (
                    <p key={v.symbol}>
                      <strong className="font-mono text-[var(--color-text)]">{v.symbol}</strong> — {v.meaning} ({v.unit})
                    </p>
                  ))}
                </div>

                <div className="text-sm text-[var(--color-text-secondary)]">
                  <p className="font-semibold text-[var(--color-text)]">Quando usar:</p>
                  <p className="mt-0.5 leading-relaxed">{item.whenToUse}</p>
                </div>

                <div className="surface-inset p-3.5 text-sm">
                  <p className="font-semibold text-[var(--color-text)]">Exemplo resolvido:</p>
                  <p className="mt-1 text-[var(--color-text-secondary)]">{item.solvedExample.statement}</p>
                  <ul className="mt-1.5 space-y-0.5 text-[var(--color-text-secondary)]">
                    {item.solvedExample.steps.map((st, idx) => (
                      <li key={idx}>{st}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-mono font-semibold text-[var(--color-text)]">
                    Resultado: {item.solvedExample.result}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] p-3.5 text-sm text-[var(--color-warning-text)]">
                  <p className="font-semibold">Erros comuns a evitar:</p>
                  <ul className="mt-1 space-y-1">
                    {item.commonMistakes.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>

                {/* Checagem rápida interativa */}
                <div className="border-t border-[var(--color-border)] pt-3.5 text-sm">
                  <p className="font-semibold text-[var(--color-text)]">Teste rápido de aplicação:</p>
                  <p className="mt-1 text-[var(--color-text-secondary)]">{item.quickQuestion.prompt}</p>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {item.quickQuestion.options.map((opt, idx) => {
                      const answered = chosenQuick !== undefined;
                      const isRight = idx === item.quickQuestion.correctIndex;
                      const isPicked = idx === chosenQuick;

                      let cls =
                        'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]';
                      if (answered) {
                        if (isRight) {
                          cls =
                            'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)] font-semibold';
                        } else if (isPicked) {
                          cls =
                            'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={answered}
                          onClick={() => setQuickAnswers((prev) => ({ ...prev, [item.id]: idx }))}
                          className={`flex min-h-11 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${cls} ${
                            answered ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <span>{opt}</span>
                          {answered && isRight && (
                            <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0" aria-hidden="true" />
                          )}
                          {answered && isPicked && !isRight && (
                            <XCircle className="h-4 w-4 text-[var(--color-error)] shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {chosenQuick !== undefined && (
                    <p className="surface-inset mt-2.5 p-3 text-xs text-[var(--color-text-secondary)]">
                      {item.quickQuestion.explanation}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
