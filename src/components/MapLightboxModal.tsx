import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Discipline } from '../types';

export interface LightboxMapItem {
  id: string;
  pageNumber: number;
  title: string;
  subtitle: string;
  moduleLabel: string;
  imageUrl: string;
  downloadName: string;
  stageLinks?: { discipline: Discipline; stageNumber: number }[];
}

interface MapLightboxModalProps {
  items: LightboxMapItem[];
  currentIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  onClose: () => void;
  onOpenStage?: (discipline: Discipline, stageNumber: number) => void;
}

export function MapLightboxModal({
  items,
  currentIndex,
  onChangeIndex,
  onClose,
  onOpenStage,
}: MapLightboxModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const item = items[currentIndex];

  useEffect(() => {
    setZoom(100);
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onChangeIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        onChangeIndex(currentIndex + 1);
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(250, z + 25));
      } else if (e.key === '-') {
        setZoom((z) => Math.max(75, z - 25));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, items.length, onChangeIndex, onClose]);

  if (!item) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-map-title"
    >
      {/* Barra superior de controle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-4 py-3 text-slate-100">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono font-semibold text-teal-300 tabular-nums">
              Página {item.pageNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{item.moduleLabel}</span>
          </div>
          <h3
            id="lightbox-map-title"
            className="truncate font-display text-sm sm:text-base font-bold text-white mt-0.5"
          >
            {item.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(75, z - 25))}
            disabled={zoom <= 75}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            aria-label="Reduzir zoom"
            title="Reduzir zoom (-)"
          >
            <ZoomOut className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="min-w-14 text-center font-mono text-xs font-semibold text-slate-200 tabular-nums">
            {zoom}%
          </span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(250, z + 25))}
            disabled={zoom >= 250}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            aria-label="Aumentar zoom"
            title="Aumentar zoom (+)"
          >
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </button>

          {zoom !== 100 && (
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 cursor-pointer"
              title="Restaurar 100%"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">100%</span>
            </button>
          )}

          <a
            href={item.imageUrl}
            download={item.downloadName}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-teal-700 bg-teal-700 px-3 text-xs font-semibold text-white hover:bg-teal-600 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Baixar imagem</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer ml-1"
            aria-label="Fechar visualizador"
            title="Fechar (Esc)"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Área de exibição com scroll para zoom */}
      <div className="relative flex-1 overflow-auto p-3 sm:p-6">
        <div className="mx-auto flex min-h-full items-center justify-center">
          <img
            src={item.imageUrl}
            alt={`${item.title} — Página ${item.pageNumber}`}
            referrerPolicy="no-referrer"
            style={{ width: `${zoom}%`, maxWidth: zoom === 100 ? '1180px' : 'none' }}
            className="h-auto rounded-lg border border-slate-700 bg-white shadow-2xl transition-[width] duration-150"
          />
        </div>
      </div>

      {/* Rodapé com navegação e vínculo com trilhas */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/95 px-4 py-2.5 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-slate-400 truncate max-w-xl">{item.subtitle}</span>
          {onOpenStage &&
            item.stageLinks?.map((link) => (
              <button
                key={`${link.discipline}-${link.stageNumber}`}
                type="button"
                onClick={() => {
                  onOpenStage(link.discipline, link.stageNumber);
                  onClose();
                }}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-teal-300 hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  Estudar {link.discipline === 'quimica' ? 'Química' : 'Física'} Etapa{' '}
                  {link.stageNumber}
                </span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="font-mono text-xs text-slate-400 tabular-nums">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => hasPrev && onChangeIndex(currentIndex - 1)}
            disabled={!hasPrev}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Anterior</span>
          </button>
          <button
            type="button"
            onClick={() => hasNext && onChangeIndex(currentIndex + 1)}
            disabled={!hasNext}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
