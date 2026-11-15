import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, PlaySquare, RotateCcw, Search, Video } from 'lucide-react';
import { VIDEO_RESOURCES } from '../data/videos';
import { Discipline } from '../types';

interface VideosViewProps {
  watchedVideoIds: string[];
  onToggleWatched: (videoId: string) => void;
}

export function VideosView({ watchedVideoIds, onToggleWatched }: VideosViewProps) {
  const [discFilter, setDiscFilter] = useState<'all' | Discipline>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      VIDEO_RESOURCES.filter((v) => {
        if (discFilter !== 'all' && v.discipline !== discFilter) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const hit =
            v.title.toLowerCase().includes(q) ||
            v.topic.toLowerCase().includes(q) ||
            v.channel.toLowerCase().includes(q);
          if (!hit) return false;
        }
        return true;
      }),
    [discFilter, search]
  );

  const chemCount = VIDEO_RESOURCES.filter((v) => v.discipline === 'quimica').length;
  const physCount = VIDEO_RESOURCES.filter((v) => v.discipline === 'fisica').length;
  const watchedTotal = VIDEO_RESOURCES.filter((v) => watchedVideoIds.includes(v.id)).length;

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Links Diretos YouTube, Khan Academy Brasil e Curso de Física
            </p>
            <h2 className="type-page-title mt-0.5 flex items-center gap-2">
              <PlaySquare className="h-5 w-5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
              <span>Videoaulas Organizadas por Etapa</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Assista diretamente na fonte recomendada (YouTube / Khan Academy / Prof. Douglas Gomes) e marque as aulas concluídas.
            </p>
          </div>
          <div className="font-mono text-sm font-semibold text-[var(--color-text-secondary)] tabular-nums shrink-0">
            Assistidas: {watchedTotal}/{VIDEO_RESOURCES.length}
          </div>
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
              placeholder="Buscar videoaula, tópico ou canal..."
              aria-label="Buscar videoaula por título, tópico ou canal"
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
            Todas ({VIDEO_RESOURCES.length})
          </button>
          <button
            type="button"
            onClick={() => setDiscFilter('quimica')}
            className={discFilter === 'quimica' ? 'btn-primary' : 'btn-secondary !min-h-11'}
          >
            Química ({chemCount})
          </button>
          <button
            type="button"
            onClick={() => setDiscFilter('fisica')}
            className={discFilter === 'fisica' ? 'btn-physics' : 'btn-secondary !min-h-11'}
          >
            Física ({physCount})
          </button>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-base font-semibold text-[var(--color-text)]">
            Nenhuma videoaula corresponde à sua busca.
          </p>
          <button
            type="button"
            onClick={() => {
              setDiscFilter('all');
              setSearch('');
            }}
            className="btn-primary mt-4"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Mostrar todas as videoaulas</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((vid) => {
            const watched = watchedVideoIds.includes(vid.id);
            const isChem = vid.discipline === 'quimica';

            return (
              <article
                key={vid.id}
                className={`surface-card flex flex-col justify-between p-5 transition ${
                  watched ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)]/50' : ''
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        isChem ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
                      }`}
                    >
                      {isChem ? 'Química' : 'Física'} · Etapa {vid.stageNumber} · {vid.topic}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      {vid.linkType === 'video'
                        ? 'Vídeo YouTube'
                        : vid.linkType === 'curso'
                          ? 'Curso Externo'
                          : 'Busca YouTube'}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-base font-bold text-[var(--color-text)] flex items-start gap-2">
                    <Video
                      className={`h-4 w-4 shrink-0 mt-1 ${
                        isChem ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{vid.title}</span>
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                    Canal / Fonte: {vid.channel}
                  </p>
                  <p className="mt-2.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3.5">
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={isChem ? 'btn-primary' : 'btn-physics'}
                  >
                    <span>Abrir aula</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onToggleWatched(vid.id)}
                    aria-pressed={watched}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      watched
                        ? 'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    {watched ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
                        <span>Assistida</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <span>Marcar como assistida</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
