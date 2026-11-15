import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../utils/pwa';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (!showIOSGuide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowIOSGuide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showIOSGuide]);

  if (isInstalled) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            void promptInstall();
          } else if (isIOS) {
            setShowIOSGuide(true);
          }
        }}
        className="btn-secondary min-h-10 px-3 text-xs"
        title="Instalar PetroLab no dispositivo"
      >
        <Download className="h-4 w-4 text-[var(--color-primary)]" />
        <span>Instalar app</span>
      </button>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
        >
          <div className="surface-card w-full max-w-sm p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="ios-install-title" className="type-section-title">
                  Instalar PetroLab no iOS
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Adicione à tela inicial para estudar mesmo sem internet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] cursor-pointer"
                aria-label="Fechar instruções"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[var(--color-primary)]">1.</span>
                <span>
                  Toque em <Share className="inline h-4 w-4 text-[var(--color-text)]" /> Compartilhar no Safari.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[var(--color-primary)]">2.</span>
                <span>Escolha &ldquo;Adicionar à Tela de Início&rdquo;.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[var(--color-primary)]">3.</span>
                <span>Toque em &ldquo;Adicionar&rdquo; no canto superior direito.</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
