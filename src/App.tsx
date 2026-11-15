import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Atom,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  FlaskConical,
  HelpCircle,
  Images,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlaySquare,
  TestTube2,
  TrendingUp,
  Upload,
  User,
  X,
  Zap,
} from 'lucide-react';
import { CorrelationsDashboardView } from './components/CorrelationsDashboardView';
import { DashboardView } from './components/DashboardView';
import { FormulasView } from './components/FormulasView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PerformanceView } from './components/PerformanceView';
import { PeriodicTableView } from './components/PeriodicTableView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { QuestionBankView } from './components/QuestionBankView';
import { TrackView } from './components/TrackView';
import { VideosView } from './components/VideosView';
import { VirtualLabView } from './components/VirtualLabView';
import { VisualMapsView } from './components/VisualMapsView';
import { CHEMISTRY_TRACK } from './data/chemistryTrack';
import { PHYSICS_TRACK } from './data/physicsTrack';
import { useProgressStore } from './store/useProgressStore';
import { Discipline, TabId } from './types';

const NAV_ITEMS: {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
  accent?: 'chem' | 'phys';
}[] = [
  { id: 'dashboard', label: 'Painel de estudos', shortLabel: 'Painel', icon: LayoutDashboard },
  { id: 'chemistry', label: 'Trilha de Química', shortLabel: 'Química', icon: FlaskConical, accent: 'chem' },
  { id: 'physics', label: 'Trilha de Física', shortLabel: 'Física', icon: Zap, accent: 'phys' },
  { id: 'periodic-table', label: 'Tabela Periódica Interativa', shortLabel: 'Tabela 118', icon: Atom, accent: 'chem' },
  { id: 'lab', label: 'Laboratório Virtual', shortLabel: 'Laboratório', icon: TestTube2 },
  { id: 'questions', label: 'Banco de Questões', shortLabel: 'Questões', icon: HelpCircle },
  { id: 'videos', label: 'Videoaulas', shortLabel: 'Vídeos', icon: PlaySquare },
  { id: 'formulas', label: 'Fórmulas e Resumos', shortLabel: 'Fórmulas', icon: BookOpen },
  { id: 'maps', label: 'Mapas Visuais (PDF)', shortLabel: 'Mapas PDF', icon: Images, accent: 'chem' },
  { id: 'correlations', label: 'Correlações & Evolução', shortLabel: 'Correlações', icon: TrendingUp, accent: 'chem' },
  { id: 'performance', label: 'Meu Desempenho', shortLabel: 'Desempenho', icon: BarChart3 },
];

export default function App() {
  const {
    state,
    setProfile,
    addStudySeconds,
    registerGeneratedQuestions,
    markSubtopicStudied,
    recordQuestionAttempt,
    completeDiagnostic,
    submitStageEvaluation,
    toggleVideoWatched,
    toggleFavoriteFormula,
    recordPeriodicLearning,
    exportBackupJSON,
    importBackupJSON,
    restoreSnapshot,
    resetProgressWithConfirm,
  } = useProgressStore();

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [chemStageJump, setChemStageJump] = useState<number>(1);
  const [physStageJump, setPhysStageJump] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileName, setProfileName] = useState(state.profile?.name ?? '');
  const [profileTarget, setProfileTarget] = useState(
    state.profile?.targetExam ?? 'Petrobras / Transpetro — CESGRANRIO'
  );

  // Toast global de feedback imediato com opção de desfazer quando aplicável
  const [toast, setToast] = useState<{ message: string; undoLabel?: string; onUndo?: () => void } | null>(
    null
  );
  const toastTimerRef = useRef<number | null>(null);
  const restoreInputRef = useRef<HTMLInputElement | null>(null);

  const notify = useCallback(
    (message: string, undo?: { label: string; action: () => void }) => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      setToast({ message, undoLabel: undo?.label, onUndo: undo?.action });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 4500);
    },
    []
  );

  const handleGlobalBackupDownload = useCallback(() => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petrolab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Backup JSON baixado com sucesso.');
  }, [exportBackupJSON, notify]);

  const handleGlobalRestoreFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      const previousSnapshot = state;
      const reader = new FileReader();
      reader.onload = () => {
        const ok = importBackupJSON(String(reader.result || ''));
        if (ok) {
          setMobileMenuOpen(false);
          notify('Progresso restaurado a partir do backup JSON.', {
            label: 'Desfazer',
            action: () => restoreSnapshot(previousSnapshot),
          });
        } else {
          notify('Arquivo inválido. Use um backup JSON válido do PetroLab.');
        }
      };
      reader.onerror = () => {
        notify('Não foi possível ler o arquivo selecionado.');
      };
      reader.readAsText(file);
    },
    [importBackupJSON, notify, restoreSnapshot, state]
  );

  useEffect(() => {
    setProfileName(state.profile?.name ?? '');
    setProfileTarget(state.profile?.targetExam ?? 'Petrobras / Transpetro — CESGRANRIO');
  }, [state.profile]);

  // Fechar modais/drawer com Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowPdfModal(false);
        setShowProfileModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Cronômetro real de dedicação por disciplina
  useEffect(() => {
    const activeDisc: Discipline | null =
      activeTab === 'chemistry' || activeTab === 'periodic-table'
        ? 'quimica'
        : activeTab === 'physics'
          ? 'fisica'
          : null;
    if (!activeDisc) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        addStudySeconds(activeDisc, 5);
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeTab, addStudySeconds]);

  const handleNavigate = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStage = (discipline: Discipline, stageNumber: number) => {
    if (discipline === 'quimica') {
      setChemStageJump(stageNumber);
      setActiveTab('chemistry');
    } else {
      setPhysStageJump(stageNumber);
      setActiveTab('physics');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setProfile(null);
      notify('Perfil removido.');
    } else {
      setProfile({
        name: profileName.trim(),
        targetExam: profileTarget.trim() || 'Petrobras / Transpetro (CESGRANRIO)',
        createdAt: state.profile?.createdAt ?? new Date().toISOString(),
      });
      notify('Perfil local atualizado.');
    }
    setShowProfileModal(false);
  };

  const handleToggleVideoWithFeedback = (videoId: string) => {
    const wasWatched = state.watchedVideoIds.includes(videoId);
    toggleVideoWatched(videoId);
    notify(wasWatched ? 'Aula removida das concluídas.' : 'Aula marcada como assistida.', {
      label: 'Desfazer',
      action: () => toggleVideoWatched(videoId),
    });
  };

  const handleToggleFavoriteWithFeedback = (formulaId: string) => {
    const wasFav = state.favoriteFormulaIds.includes(formulaId);
    toggleFavoriteFormula(formulaId);
    notify(wasFav ? 'Fórmula removida das favoritas.' : 'Fórmula salva nas favoritas.', {
      label: 'Desfazer',
      action: () => toggleFavoriteFormula(formulaId),
    });
  };

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo principal
      </a>

      <OfflineIndicator />

      {/* Top Bar organizada em linha única */}
      <header className="sticky top-0 z-30 h-14 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 sm:px-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] lg:hidden cursor-pointer shrink-0"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] cursor-pointer shrink-0"
            aria-label={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer min-w-0 rounded-lg py-1"
          >
            <img src="/icon.svg" alt="PetroLab" className="h-7 w-7 rounded-md shrink-0" />
            <span className="font-display text-base font-bold tracking-tight text-[var(--color-text)] whitespace-nowrap shrink-0">
              PetroLab
            </span>
          </button>

          <span className="hidden sm:inline text-[var(--color-border-strong)]" aria-hidden="true">
            /
          </span>
          <span className="hidden sm:inline text-sm font-medium text-[var(--color-text-muted)] truncate">
            {currentNav.label}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={restoreInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleGlobalRestoreFile}
            className="hidden"
            aria-label="Selecionar arquivo JSON para restaurar progresso"
          />

          <button
            type="button"
            onClick={handleGlobalBackupDownload}
            className="hidden sm:inline-flex btn-secondary min-h-10 px-3 text-xs"
            aria-label="Fazer backup do progresso em JSON"
            title="Baixar backup JSON do progresso"
          >
            <Download className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="hidden lg:inline">Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={() => restoreInputRef.current?.click()}
            className="hidden sm:inline-flex btn-secondary min-h-10 px-3 text-xs"
            aria-label="Restaurar progresso a partir de backup JSON"
            title="Restaurar backup JSON"
          >
            <Upload className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
            <span className="hidden lg:inline">Restaurar</span>
          </button>

          <PWAInstallButton />

          <button
            type="button"
            onClick={() => setShowPdfModal(true)}
            className="btn-secondary min-h-10 px-3 text-xs"
            aria-label="Abrir mapa de páginas do PDF"
          >
            <FileText className="h-4 w-4 text-[var(--color-text-muted)]" />
            <span className="hidden md:inline">Mapa do PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="btn-secondary min-h-10 px-3 text-xs"
            aria-label="Configurar perfil do estudante"
          >
            <User className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="max-w-28 truncate">{state.profile?.name || 'Estudante'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Menu Lateral Recolhível (Desktop) */}
        <aside
          className={`hidden lg:flex lg:flex-col lg:border-r lg:border-[var(--color-border)] lg:bg-[var(--color-surface)] lg:shrink-0 transition-[width] duration-200 ${
            sidebarCollapsed ? 'lg:w-[74px]' : 'lg:w-64'
          }`}
        >
          <nav className="flex-1 space-y-1 p-2.5" aria-label="Menu principal">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const activeCls =
                item.accent === 'chem'
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary-border)] font-semibold'
                  : item.accent === 'phys'
                    ? 'bg-[var(--color-secondary-soft)] text-[var(--color-secondary)] border-[var(--color-secondary-border)] font-semibold'
                    : 'bg-slate-100 text-[var(--color-text)] border-[var(--color-border-strong)] font-semibold';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex w-full min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition cursor-pointer ${
                    sidebarCollapsed ? 'justify-center px-2' : ''
                  } ${
                    isActive
                      ? activeCls
                      : 'border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      isActive && item.accent === 'chem'
                        ? 'text-[var(--color-primary)]'
                        : isActive && item.accent === 'phys'
                          ? 'text-[var(--color-secondary)]'
                          : 'text-[var(--color-text-muted)]'
                    }`}
                    aria-hidden="true"
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="border-t border-[var(--color-border)] p-4 text-xs text-[var(--color-text-muted)]">
              <p className="font-semibold text-[var(--color-text)]">Regra de Nivelamento</p>
              <p className="mt-1 leading-relaxed">
                Domínio mínimo de <strong className="tabular-nums">80%</strong> + autoexplicação para liberar cada próxima etapa.
              </p>
            </div>
          )}
        </aside>

        {/* Drawer Mobile com alvos de toque >= 44px */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
            <div
              className="fixed inset-0 bg-slate-900/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-[var(--color-surface)] shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <img src="/icon.svg" alt="PetroLab" className="h-6 w-6 rounded" />
                  <span className="font-display text-base font-bold text-[var(--color-text)]">PetroLab</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu móvel">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-[var(--color-border)] p-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleGlobalBackupDownload();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary !min-h-11 !px-2.5 text-xs"
                >
                  <Download className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>Backup JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => restoreInputRef.current?.click()}
                  className="btn-secondary !min-h-11 !px-2.5 text-xs"
                >
                  <Upload className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>Restaurar</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Área Principal + Rodapé Organizado */}
        <div className="flex flex-1 flex-col min-w-0">
          <main id="conteudo-principal" className="flex-1 p-4 sm:p-6 lg:p-8">
            <div key={activeTab} className="mx-auto max-w-6xl animate-view-enter">
              {activeTab === 'dashboard' && (
                <DashboardView
                  state={state}
                  onNavigate={handleNavigate}
                  onOpenStage={handleOpenStage}
                />
              )}

              {activeTab === 'chemistry' && (
                <TrackView
                  discipline="quimica"
                  state={state}
                  initialStageNumber={chemStageJump}
                  onMarkSubtopicStudied={(d, s, sub) => {
                    markSubtopicStudied(d, s, sub);
                    notify('Subtópico marcado como estudado.');
                  }}
                  onCompleteDiagnostic={completeDiagnostic}
                  onRecordAttempt={recordQuestionAttempt}
                  onRegisterGenerated={registerGeneratedQuestions}
                  onSubmitEvaluation={submitStageEvaluation}
                />
              )}

              {activeTab === 'physics' && (
                <TrackView
                  discipline="fisica"
                  state={state}
                  initialStageNumber={physStageJump}
                  onMarkSubtopicStudied={(d, s, sub) => {
                    markSubtopicStudied(d, s, sub);
                    notify('Subtópico marcado como estudado.');
                  }}
                  onCompleteDiagnostic={completeDiagnostic}
                  onRecordAttempt={recordQuestionAttempt}
                  onRegisterGenerated={registerGeneratedQuestions}
                  onSubmitEvaluation={submitStageEvaluation}
                />
              )}

              {activeTab === 'periodic-table' && (
                <PeriodicTableView
                  learningStats={state.periodicLearningStats}
                  onRecordPeriodicLearning={recordPeriodicLearning}
                />
              )}

              {activeTab === 'lab' && <VirtualLabView />}

              {activeTab === 'questions' && (
                <QuestionBankView state={state} onRecordAttempt={recordQuestionAttempt} />
              )}

              {activeTab === 'videos' && (
                <VideosView
                  watchedVideoIds={state.watchedVideoIds}
                  onToggleWatched={handleToggleVideoWithFeedback}
                />
              )}

              {activeTab === 'formulas' && (
                <FormulasView
                  favoriteFormulaIds={state.favoriteFormulaIds}
                  onToggleFavorite={handleToggleFavoriteWithFeedback}
                />
              )}

              {activeTab === 'maps' && (
                <VisualMapsView onOpenStage={handleOpenStage} />
              )}

              {activeTab === 'correlations' && (
                <CorrelationsDashboardView
                  state={state}
                  onNavigate={handleNavigate}
                  onOpenStage={handleOpenStage}
                />
              )}

              {activeTab === 'performance' && (
                <PerformanceView
                  state={state}
                  onOpenStage={handleOpenStage}
                  onExportJSON={() => {
                    const json = exportBackupJSON();
                    notify('Backup JSON gerado e baixado.');
                    return json;
                  }}
                  onImportJSON={(json) => {
                    const ok = importBackupJSON(json);
                    if (ok) notify('Backup restaurado com sucesso.');
                    return ok;
                  }}
                  onResetProgress={() => {
                    resetProgressWithConfirm();
                    notify('Progresso reiniciado.');
                  }}
                />
              )}
            </div>
          </main>

          <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong className="font-semibold text-[var(--color-text)]">PetroLab</strong> · Nivelamento em Química e Física (Petrobras / Transpetro — CESGRANRIO)
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                  className="hover:text-[var(--color-text)] underline-offset-4 hover:underline cursor-pointer"
                >
                  Painel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(true)}
                  className="hover:text-[var(--color-text)] underline-offset-4 hover:underline cursor-pointer"
                >
                  Mapa do PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('performance')}
                  className="hover:text-[var(--color-text)] underline-offset-4 hover:underline cursor-pointer"
                >
                  Backup de progresso
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Toast de feedback imediato + desfazer */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-slate-700 bg-[var(--color-surface-dark)] px-4 py-3 text-xs font-medium text-white shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
          <span>{toast.message}</span>
          {toast.undoLabel && toast.onUndo && (
            <button
              type="button"
              onClick={() => {
                toast.onUndo?.();
                setToast(null);
              }}
              className="rounded-md bg-slate-800 px-2.5 py-1 font-semibold text-teal-300 hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
            >
              {toast.undoLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-300 hover:text-white cursor-pointer"
            aria-label="Fechar aviso"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Modal de Rastreabilidade do PDF Base */}
      {showPdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
        >
          <div className="surface-card max-h-[88vh] w-full max-w-3xl overflow-y-auto p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-primary)]">
                  Rastreabilidade Pedagógica
                </p>
                <h3 id="pdf-modal-title" className="type-section-title mt-0.5">
                  Mapeamento do PDF &ldquo;Mapas Transpetro Reta Final 2026&rdquo; (119 páginas)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] cursor-pointer"
                aria-label="Fechar mapa do PDF"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] p-3.5 text-xs">
              <p className="text-[var(--color-text)] font-medium">
                As 81 páginas técnicas e de revisão (Módulos 03–10) estão extraídas para consulta rápida com zoom.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPdfModal(false);
                  handleNavigate('maps');
                }}
                className="btn-primary"
              >
                <Images className="h-4 w-4" aria-hidden="true" />
                <span>Abrir Galeria dos 81 Mapas</span>
              </button>
            </div>

            <div className="mt-4 space-y-5 text-sm text-[var(--color-text-secondary)]">
              <div>
                <h4 className="font-display text-sm font-bold text-[var(--color-primary)] mb-2">
                  Trilha de Química (8 Etapas vs PDF p. 88–106 e Refino p. 108–111)
                </h4>
                <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  {CHEMISTRY_TRACK.map((s) => (
                    <li key={s.id} className="p-3 text-xs">
                      <p className="font-semibold text-[var(--color-text)]">
                        Etapa {s.stageNumber}: {s.title} ·{' '}
                        <span className="font-mono text-[var(--color-primary)]">{s.pdfPages}</span>
                      </p>
                      <p className="mt-1 text-[var(--color-text-muted)] leading-relaxed">
                        {s.pdfComparisonNote}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-[var(--color-secondary)] mb-2">
                  Trilha de Física (9 Etapas vs PDF Módulos 03, 04, 05, 08 e 10)
                </h4>
                <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  {PHYSICS_TRACK.map((s) => (
                    <li key={s.id} className="p-3 text-xs">
                      <p className="font-semibold text-[var(--color-text)]">
                        Etapa {s.stageNumber}: {s.title} ·{' '}
                        <span className="font-mono text-[var(--color-secondary)]">{s.pdfPages}</span>
                      </p>
                      <p className="mt-1 text-[var(--color-text-muted)] leading-relaxed">
                        {s.pdfComparisonNote}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Perfil Local do Estudante */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <form
            onSubmit={handleSaveProfile}
            className="surface-card w-full max-w-md p-6 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 id="profile-modal-title" className="type-section-title">
                  Perfil Local do Estudante
                </h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  Opcional. Personaliza o painel e permanece salvo apenas no seu dispositivo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] cursor-pointer"
                aria-label="Fechar perfil"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block">
                <span className="font-semibold text-[var(--color-text-secondary)]">
                  Seu nome (opcional)
                </span>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Ex.: Carlos Silva"
                  className="input-control mt-1.5"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-[var(--color-text-secondary)]">
                  Objetivo / Concurso
                </span>
                <input
                  type="text"
                  value={profileTarget}
                  onChange={(e) => setProfileTarget(e.target.value)}
                  className="input-control mt-1.5"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar perfil
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
