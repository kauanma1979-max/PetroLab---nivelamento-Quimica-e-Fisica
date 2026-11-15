import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/pwa';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] px-4 py-2 text-xs font-medium text-[var(--color-warning-text)]"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Modo offline ativo — todo o seu progresso continua salvo neste dispositivo.</span>
    </div>
  );
}
