import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Atom,
  Award,
  CheckCircle2,
  Eye,
  Filter,
  Flame,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../data/periodicElements';
import { LearningModeResult, PeriodicElement } from '../types';
import { ThreeDScienceViewer } from './ThreeDScienceViewer';

interface PeriodicTableViewProps {
  learningStats: LearningModeResult[];
  onRecordPeriodicLearning: (result: Omit<LearningModeResult, 'timestamp'>) => void;
}

const CATEGORY_META: Record<
  PeriodicElement['category'],
  { label: string; cellBg: string; text: string; border: string }
> = {
  'nao-metal': {
    label: 'Não metal',
    cellBg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-950',
    border: 'border-emerald-300',
  },
  'gas-nobre': {
    label: 'Gás nobre',
    cellBg: 'bg-cyan-50 hover:bg-cyan-100',
    text: 'text-cyan-950',
    border: 'border-cyan-300',
  },
  'metal-alcalino': {
    label: 'Metal alcalino',
    cellBg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-950',
    border: 'border-rose-300',
  },
  'metal-alcalino-terroso': {
    label: 'Alcalino-terroso',
    cellBg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-950',
    border: 'border-amber-300',
  },
  semimetal: {
    label: 'Semimetal',
    cellBg: 'bg-teal-50 hover:bg-teal-100',
    text: 'text-teal-950',
    border: 'border-teal-300',
  },
  halogenio: {
    label: 'Halogênio',
    cellBg: 'bg-sky-50 hover:bg-sky-100',
    text: 'text-sky-950',
    border: 'border-sky-300',
  },
  'metal-transicao': {
    label: 'Metal de transição',
    cellBg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-950',
    border: 'border-indigo-300',
  },
  'metal-pos-transicao': {
    label: 'Metal pós-transição',
    cellBg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-900',
    border: 'border-slate-300',
  },
  lantanideo: {
    label: 'Lantanídeo',
    cellBg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-950',
    border: 'border-purple-300',
  },
  actinideo: {
    label: 'Actinídeo',
    cellBg: 'bg-fuchsia-50 hover:bg-fuchsia-100',
    text: 'text-fuchsia-950',
    border: 'border-fuchsia-300',
  },
};

const STATE_LABELS: Record<PeriodicElement['standardState'], string> = {
  solido: 'Sólido',
  liquido: 'Líquido',
  gasoso: 'Gasoso',
  desconhecido: 'Desconhecido (estimado)',
};

type ViewMode = 'explore' | 'trends' | 'compare' | 'learning';
type TrendProperty = 'atomicRadiusPm' | 'electronegativity' | 'ionizationEnergyEv';

interface ChallengeQuestion {
  typeId: string;
  typeLabel: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  elementSymbol: string;
}

function buildChallenge(typeIndex: number): ChallengeQuestion {
  const byZ = (z: number) => PERIODIC_ELEMENTS.find((e) => e.atomicNumber === z)!;

  switch (typeIndex % 7) {
    case 0: {
      const pool = [byZ(6), byZ(11), byZ(16), byZ(17), byZ(26), byZ(29), byZ(47), byZ(79), byZ(80), byZ(82)];
      const target = pool[Math.floor(Math.random() * pool.length)];
      const distractors = pool.filter((e) => e.atomicNumber !== target.atomicNumber).slice(0, 3);
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        typeId: 'find-symbol',
        typeLabel: '1. Símbolo e Nome',
        prompt: `Qual elemento químico possui o símbolo "${target.symbol}" (Z = ${target.atomicNumber})?`,
        options: opts.map((e) => e.namePt),
        correctIndex: opts.findIndex((e) => e.atomicNumber === target.atomicNumber),
        explanation: `${target.symbol} é o ${target.namePt} (número atômico ${target.atomicNumber}).`,
        elementSymbol: target.symbol,
      };
    }
    case 1: {
      const targetPool = [byZ(11), byZ(17), byZ(14), byZ(18), byZ(26), byZ(8)];
      const target = targetPool[Math.floor(Math.random() * targetPool.length)];
      const correctLabel = CATEGORY_META[target.category].label;
      const allLabels = ['Metal alcalino', 'Halogênio', 'Semimetal', 'Gás nobre', 'Metal de transição', 'Não metal'];
      const distractors = allLabels.filter((l) => l !== correctLabel).slice(0, 3);
      const opts = [correctLabel, ...distractors].sort(() => Math.random() - 0.5);
      return {
        typeId: 'classify',
        typeLabel: '2. Classificação Periódica',
        prompt: `Como é classificado o elemento ${target.namePt} (${target.symbol}, Z = ${target.atomicNumber}) na Tabela Periódica?`,
        options: opts,
        correctIndex: opts.indexOf(correctLabel),
        explanation: `${target.namePt} (${target.symbol}) pertence à categoria "${correctLabel}" no grupo ${target.group ?? 'f'} e período ${target.period}.`,
        elementSymbol: target.symbol,
      };
    }
    case 2: {
      const pool = [byZ(12), byZ(16), byZ(17), byZ(20), byZ(13), byZ(7)];
      const target = pool[Math.floor(Math.random() * pool.length)];
      const correct = `Grupo ${target.group} · ${target.period}º período`;
      const opts = [
        correct,
        `Grupo ${((target.group ?? 1) % 18) + 1} · ${target.period}º período`,
        `Grupo ${target.group} · ${target.period + 1}º período`,
        `Grupo ${target.period} · ${target.group}º período`,
      ].sort(() => Math.random() - 0.5);
      return {
        typeId: 'group-period',
        typeLabel: '3. Grupo e Período',
        prompt: `Localize ${target.namePt} (${target.symbol}) considerando sua configuração (${target.electronConfiguration}) e camadas (${target.shells.join('-')}):`,
        options: opts,
        correctIndex: opts.indexOf(correct),
        explanation: `Possui ${target.shells.length} camadas eletrônicas (${target.period}º período) e está no Grupo ${target.group}.`,
        elementSymbol: target.symbol,
      };
    }
    case 3: {
      const pool = [byZ(6), byZ(7), byZ(8), byZ(11), byZ(12), byZ(16), byZ(17)];
      const target = pool[Math.floor(Math.random() * pool.length)];
      const valence = target.shells[target.shells.length - 1];
      const correct = `${valence} elétron(s) na camada de valência`;
      const candidates = [1, 2, 4, 5, 6, 7, 8].filter((v) => v !== valence).slice(0, 3);
      const opts = [correct, ...candidates.map((v) => `${v} elétron(s) na camada de valência`)].sort(
        () => Math.random() - 0.5
      );
      return {
        typeId: 'valence',
        typeLabel: '4. Camada de Valência',
        prompt: `Quantos elétrons na camada de valência (última camada) possui um átomo neutro de ${target.namePt} (${target.symbol}, distribuição ${target.shells.join('-')})?`,
        options: opts,
        correctIndex: opts.indexOf(correct),
        explanation: `Na distribuição por camadas (${target.shells.join('-')}), a camada mais externa contém ${valence} elétron(s).`,
        elementSymbol: target.symbol,
      };
    }
    case 4: {
      const scenarios = [
        { el: byZ(11), ans: '+1 (cátion monovalente Na⁺)', exp: 'O Sódio tem 1 elétron na valência (2-8-1); perde 1 e⁻ formando Na⁺.' },
        { el: byZ(12), ans: '+2 (cátion bivalente Mg²⁺)', exp: 'O Magnésio tem 2 elétrons na valência (2-8-2); perde 2 e⁻ formando Mg²⁺.' },
        { el: byZ(13), ans: '+3 (cátion trivalente Al³⁺)', exp: 'O Alumínio tem 3 elétrons na valência (2-8-3); perde 3 e⁻ formando Al³⁺.' },
        { el: byZ(17), ans: '-1 (ânion monovalente Cl⁻)', exp: 'O Cloro tem 7 elétrons na valência (2-8-7); ganha 1 e⁻ formando Cl⁻.' },
        { el: byZ(8), ans: '-2 (ânion bivalente O²⁻)', exp: 'O Oxigênio tem 6 elétrons na valência (2-6); ganha 2 e⁻ formando O²⁻.' },
      ];
      const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
      const opts = [
        pick.ans,
        ...scenarios.filter((s) => s.el.symbol !== pick.el.symbol).slice(0, 3).map((s) => s.ans),
      ].sort(() => Math.random() - 0.5);
      return {
        typeId: 'ion-charge',
        typeLabel: '5. Previsão de Íon',
        prompt: `Ao buscar estabilidade (regra do octeto), qual íon tende a formar o ${pick.el.namePt} (${pick.el.symbol}, camadas ${pick.el.shells.join('-')})?`,
        options: opts,
        correctIndex: opts.indexOf(pick.ans),
        explanation: pick.exp,
        elementSymbol: pick.el.symbol,
      };
    }
    case 5: {
      const comparisons = [
        {
          prompt: 'Entre Lítio (Li, Z=3), Carbono (C, Z=6) e Flúor (F, Z=9) — todos no 2º período — qual possui MAIOR eletronegatividade?',
          opts: ['Flúor (F, 3,98)', 'Lítio (Li, 0,98)', 'Carbono (C, 2,55)', 'Todos têm a mesma eletronegatividade'],
          ans: 'Flúor (F, 3,98)',
          exp: 'No mesmo período, a eletronegatividade cresce da esquerda para a direita. O Flúor (3,98) é o elemento mais eletronegativo da Tabela.',
          sym: 'F',
        },
        {
          prompt: 'Entre Lítio (Li, 2º período), Sódio (Na, 3º período) e Potássio (K, 4º período) — todos do Grupo 1 — qual possui MAIOR raio atômico?',
          opts: ['Potássio (K, 243 pm)', 'Sódio (Na, 190 pm)', 'Lítio (Li, 167 pm)', 'Lítio e Potássio têm o mesmo raio'],
          ans: 'Potássio (K, 243 pm)',
          exp: 'No mesmo grupo, o raio atômico cresce de cima para baixo porque aumentam as camadas eletrônicas (K tem 4 camadas).',
          sym: 'K',
        },
        {
          prompt: 'Entre Sódio (Na, Z=11), Silício (Si, Z=14) e Argônio (Ar, Z=18) no 3º período, qual exige MAIOR energia de primeira ionização para arrancar um elétron?',
          opts: ['Argônio (Ar, 15,76 eV)', 'Sódio (Na, 5,14 eV)', 'Silício (Si, 8,15 eV)', 'Sódio exige mais por ser metal'],
          ans: 'Argônio (Ar, 15,76 eV)',
          exp: 'Gases nobres possuem camada de valência completa e altíssima estabilidade, exigindo a maior energia de ionização do período.',
          sym: 'Ar',
        },
      ];
      const pick = comparisons[Math.floor(Math.random() * comparisons.length)];
      const opts = [...pick.opts].sort(() => Math.random() - 0.5);
      return {
        typeId: 'periodic-trend',
        typeLabel: '6. Tendência Periódica',
        prompt: pick.prompt,
        options: opts,
        correctIndex: opts.indexOf(pick.ans),
        explanation: pick.exp,
        elementSymbol: pick.sym,
      };
    }
    default: {
      const scenarios = [
        {
          el: byZ(16),
          prompt: 'Qual elemento presente no petróleo cru (em compostos como H₂S e mercaptanas) precisa ser removido no hidrotratamento para evitar chuva ácida e corrosão?',
          ans: 'Enxofre (S)',
          opts: ['Enxofre (S)', 'Argônio (Ar)', 'Magnésio (Mg)', 'Neônio (Ne)'],
          exp: 'O Enxofre (S) forma H₂S tóxico e corrosivo e SO₂ na combustão; a dessulfurização (com H₂ e catalisadores Co-Mo/Ni-Mo) o remove do diesel e gasolina.',
        },
        {
          el: byZ(12),
          prompt: 'Qual metal alcalino-terroso é amplamente usado como ânodo de sacrifício na proteção catódica de dutos enterrados e cascos de navios?',
          ans: 'Magnésio (Mg)',
          opts: ['Magnésio (Mg)', 'Hélio (He)', 'Cloro (Cl)', 'Mercúrio (Hg)'],
          exp: 'O Magnésio (Mg) oxida-se preferencialmente no lugar do aço-carbono do duto, protegendo a tubulação contra corrosão galvânica.',
        },
        {
          el: byZ(7),
          prompt: 'Qual gás abundante na atmosfera (78%) é injetado na purga e inertização de tanques de combustíveis na Transpetro para eliminar risco de explosão?',
          ans: 'Nitrogênio (N)',
          opts: ['Nitrogênio (N)', 'Oxigênio (O)', 'Flúor (F)', 'Hidrogênio (H)'],
          exp: 'O Nitrogênio gasoso (N₂) é quimicamente pouco reativo nas condições ambientes e desloca o oxigênio, evitando atmosferas inflamáveis.',
        },
      ];
      const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
      const opts = [...pick.opts].sort(() => Math.random() - 0.5);
      return {
        typeId: 'industry-og',
        typeLabel: '7. Química e Indústria O&G',
        prompt: pick.prompt,
        options: opts,
        correctIndex: opts.indexOf(pick.ans),
        explanation: pick.exp,
        elementSymbol: pick.el.symbol,
      };
    }
  }
}

export function PeriodicTableView({
  learningStats,
  onRecordPeriodicLearning,
}: PeriodicTableViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [quickHighlight, setQuickHighlight] = useState<'none' | 'metais' | 'ametais' | 'nobres'>('none');

  const [trendProp, setTrendProp] = useState<TrendProperty>('electronegativity');
  const [hoveredEl, setHoveredEl] = useState<PeriodicElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<PeriodicElement | null>(null);
  const [ionDelta, setIonDelta] = useState<number>(0);
  const [compareIds, setCompareIds] = useState<number[]>([6, 16, 26]);

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challenge, setChallenge] = useState<ChallengeQuestion>(() => buildChallenge(0));
  const [challengeChosen, setChallengeChosen] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedEl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEl]);

  const trendBounds = useMemo(() => {
    const vals = PERIODIC_ELEMENTS.map((e) => e[trendProp]).filter(
      (v): v is number => v !== null
    );
    return {
      min: Math.min(...vals),
      max: Math.max(...vals),
    };
  }, [trendProp]);

  const matchesFilter = (el: PeriodicElement): boolean => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = el.namePt.toLowerCase().includes(q);
      const matchSym = el.symbol.toLowerCase().includes(q);
      const matchZ = String(el.atomicNumber) === q;
      if (!matchName && !matchSym && !matchZ) return false;
    }
    if (filterCategory !== 'all' && el.category !== filterCategory) return false;
    if (filterGroup !== 'all' && String(el.group) !== filterGroup) return false;
    if (filterPeriod !== 'all' && String(el.period) !== filterPeriod) return false;
    if (filterBlock !== 'all' && el.block !== filterBlock) return false;
    if (filterState !== 'all' && el.standardState !== filterState) return false;

    if (quickHighlight === 'metais') {
      return [
        'metal-alcalino',
        'metal-alcalino-terroso',
        'metal-transicao',
        'metal-pos-transicao',
        'lantanideo',
        'actinideo',
      ].includes(el.category);
    }
    if (quickHighlight === 'ametais') {
      return ['nao-metal', 'halogenio'].includes(el.category);
    }
    if (quickHighlight === 'nobres') {
      return el.category === 'gas-nobre';
    }
    return true;
  };

  const matchedCount = useMemo(
    () => PERIODIC_ELEMENTS.filter(matchesFilter).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, filterCategory, filterGroup, filterPeriod, filterBlock, filterState, quickHighlight]
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterCategory !== 'all' ||
    filterGroup !== 'all' ||
    filterPeriod !== 'all' ||
    filterBlock !== 'all' ||
    filterState !== 'all' ||
    quickHighlight !== 'none';

  const handleElementClick = (el: PeriodicElement) => {
    if (viewMode === 'compare') {
      setCompareIds((prev) => {
        if (prev.includes(el.atomicNumber)) {
          return prev.filter((id) => id !== el.atomicNumber);
        }
        if (prev.length >= 3) {
          return [...prev.slice(1), el.atomicNumber];
        }
        return [...prev, el.atomicNumber];
      });
      return;
    }
    setSelectedEl(el);
    setIonDelta(0);
  };

  const getHeatmapStyle = (el: PeriodicElement) => {
    const val = el[trendProp];
    if (val === null) {
      return { backgroundColor: '#F1F5F9', color: '#475569', borderColor: '#CBD5E1' };
    }
    const ratio = (val - trendBounds.min) / Math.max(0.0001, trendBounds.max - trendBounds.min);
    const lightness = Math.round(95 - ratio * 56);
    const textColor = ratio > 0.56 ? '#FFFFFF' : '#0F172A';
    return {
      backgroundColor: `hsl(173, 72%, ${lightness}%)`,
      color: textColor,
      borderColor: `hsl(173, 60%, ${Math.max(28, lightness - 14)}%)`,
    };
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterGroup('all');
    setFilterPeriod('all');
    setFilterBlock('all');
    setFilterState('all');
    setQuickHighlight('none');
  };

  const handleNextChallenge = (nextType?: number) => {
    const idx = nextType ?? challengeIdx + 1;
    setChallengeIdx(idx);
    setChallenge(buildChallenge(idx));
    setChallengeChosen(null);
  };

  const handleAnswerChallenge = (optIndex: number) => {
    if (challengeChosen !== null) return;
    setChallengeChosen(optIndex);
    onRecordPeriodicLearning({
      challengeType: challenge.typeLabel,
      correct: optIndex === challenge.correctIndex,
      elementSymbol: challenge.elementSymbol,
    });
  };

  const comparedElements = useMemo(
    () =>
      compareIds
        .map((id) => PERIODIC_ELEMENTS.find((e) => e.atomicNumber === id))
        .filter(Boolean) as PeriodicElement[],
    [compareIds]
  );

  const simulatedIonData = useMemo(() => {
    if (!selectedEl) return null;
    const electrons = Math.max(0, selectedEl.atomicNumber + ionDelta);
    const charge = selectedEl.atomicNumber - electrons;
    const chargeLabel =
      charge === 0
        ? 'Átomo neutro'
        : charge > 0
          ? `Cátion (${selectedEl.symbol}${charge === 1 ? '⁺' : `${charge}⁺`})`
          : `Ânion (${selectedEl.symbol}${Math.abs(charge) === 1 ? '⁻' : `${Math.abs(charge)}⁻`})`;

    const capacities = [2, 8, 18, 32, 32, 18, 8];
    let shells: number[];
    if (ionDelta === 0) {
      shells = selectedEl.shells;
    } else {
      let rem = electrons;
      shells = [];
      for (let i = 0; i < capacities.length && rem > 0; i++) {
        const put = Math.min(rem, capacities[i]);
        shells.push(put);
        rem -= put;
      }
      if (shells.length === 0) shells = [0];
    }
    return { electrons, charge, chargeLabel, shells };
  }, [selectedEl, ionDelta]);

  const learningCorrect = learningStats.filter((s) => s.correct).length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Modos */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              118 Elementos IUPAC · Dados NIST / CRC Handbook
            </p>
            <h2 className="type-page-title mt-0.5">
              Tabela Periódica Interativa
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Explore camadas, modelo 3D, formação de íons, tendências periódicas, comparação lado a lado e 7 desafios práticos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Modos da Tabela Periódica">
            {(
              [
                { id: 'explore', label: 'Explorar 118', icon: Eye },
                { id: 'trends', label: 'Tendências (Mapa de Calor)', icon: Flame },
                { id: 'compare', label: `Comparar (${compareIds.length}/3)`, icon: ArrowLeftRight },
                { id: 'learning', label: 'Modo Aprendizagem (7)', icon: Award },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setViewMode(tab.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        {viewMode !== 'learning' && (
          <div className="mt-5 space-y-3 border-t border-[var(--color-border)] pt-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
              <div className="relative lg:col-span-2">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome, símbolo (Fe) ou nº atômico (26)..."
                  aria-label="Buscar elemento por nome, símbolo ou número atômico"
                  className="input-control pl-9"
                />
              </div>

              <select
                aria-label="Filtrar por família ou categoria"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-control"
              >
                <option value="all">Todas as categorias</option>
                {Object.entries(CATEGORY_META).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filtrar por grupo"
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="input-control"
              >
                <option value="all">Todos os grupos (1–18)</option>
                {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={String(g)}>
                    Grupo {g}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filtrar por período"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="input-control"
              >
                <option value="all">Todos os períodos (1–7)</option>
                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                  <option key={p} value={String(p)}>
                    {p}º Período
                  </option>
                ))}
              </select>

              <select
                aria-label="Filtrar por estado físico"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="input-control"
              >
                <option value="all">Todos os estados (25 °C)</option>
                <option value="solido">Sólido</option>
                <option value="liquido">Líquido</option>
                <option value="gasoso">Gasoso</option>
                <option value="desconhecido">Desconhecido</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] mr-1">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  <span>Destaques:</span>
                </span>
                {(
                  [
                    { id: 'none', label: 'Todos' },
                    { id: 'metais', label: 'Metais' },
                    { id: 'ametais', label: 'Ametais / Halogênios' },
                    { id: 'nobres', label: 'Gases Nobres' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuickHighlight(item.id)}
                    className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      quickHighlight === item.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)] font-semibold'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <select
                  aria-label="Filtrar por bloco s p d f"
                  value={filterBlock}
                  onChange={(e) => setFilterBlock(e.target.value)}
                  className="min-h-10 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-[var(--color-text)]"
                >
                  <option value="all">Bloco: Todos</option>
                  <option value="s">Bloco s</option>
                  <option value="p">Bloco p</option>
                  <option value="d">Bloco d</option>
                  <option value="f">Bloco f</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
                  {matchedCount} de 118 destacados
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn-secondary !min-h-10 !px-3"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Limpar filtros</span>
                  </button>
                )}
              </div>
            </div>

            {matchedCount === 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] px-4 py-3 text-sm text-[var(--color-warning-text)]">
                <span>Nenhum elemento químico corresponde à combinação atual de filtros.</span>
                <button type="button" onClick={resetFilters} className="btn-secondary !min-h-10">
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Controles do Modo Tendências */}
        {viewMode === 'trends' && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Propriedade no mapa de calor:
              </span>
              {(
                [
                  { id: 'electronegativity', label: 'Eletronegatividade (Pauling)' },
                  { id: 'atomicRadiusPm', label: 'Raio Atômico (pm)' },
                  { id: 'ionizationEnergyEv', label: '1ª Energia de Ionização (eV)' },
                ] as const
              ).map((prop) => (
                <button
                  key={prop.id}
                  type="button"
                  onClick={() => setTrendProp(prop.id)}
                  className={`min-h-10 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    trendProp === prop.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                >
                  {prop.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              Cinza = Não disponível / variável
            </span>
          </div>
        )}
      </section>

      {/* ================= MODO APRENDIZAGEM (7 TIPOS DE DESAFIO) ================= */}
      {viewMode === 'learning' && (
        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{challenge.typeLabel}</p>
              <h3 className="type-section-title mt-0.5">
                Modo Aprendizagem — 7 Desafios da Tabela Periódica
              </h3>
            </div>
            <div className="font-mono text-sm text-[var(--color-text-secondary)] tabular-nums">
              Desempenho registrado: <strong>{learningCorrect}/{learningStats.length}</strong> acertos
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '1. Símbolo/Nome',
              '2. Classificação',
              '3. Grupo/Período',
              '4. Valência',
              '5. Carga de Íon',
              '6. Tendências',
              '7. Indústria O&G',
            ].map((lbl, idx) => (
              <button
                key={lbl}
                type="button"
                onClick={() => handleNextChallenge(idx)}
                className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  challengeIdx % 7 === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]'
                    : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="surface-inset mt-5 p-5">
            <p className="text-[15px] font-semibold text-[var(--color-text)] leading-relaxed">
              {challenge.prompt}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {challenge.options.map((opt, idx) => {
                const answered = challengeChosen !== null;
                const isRight = idx === challenge.correctIndex;
                const isPicked = idx === challengeChosen;

                let cls =
                  'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]';
                if (answered) {
                  if (isRight) {
                    cls =
                      'border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success-text)] font-semibold';
                  } else if (isPicked) {
                    cls =
                      'border-[var(--color-error-border)] bg-[var(--color-error-soft)] text-[var(--color-error-text)]';
                  } else {
                    cls =
                      'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleAnswerChallenge(idx)}
                    className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm transition ${cls} ${
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

            {challengeChosen !== null && (
              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {challenge.explanation}
                </p>
                <button
                  type="button"
                  onClick={() => handleNextChallenge()}
                  className="btn-primary shrink-0"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>Próximo desafio</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= COMPARAÇÃO LADO A LADO ================= */}
      {viewMode === 'compare' && (
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="type-section-title">
                Comparação Lado a Lado ({comparedElements.length}/3 selecionados)
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Clique em qualquer elemento na grade abaixo para adicionar ou remover da comparação.
              </p>
            </div>
            {comparedElements.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="btn-secondary !min-h-10"
              >
                Limpar seleção
              </button>
            )}
          </div>

          {comparedElements.length === 0 ? (
            <div className="surface-inset p-4 text-sm text-[var(--color-text-muted)] flex flex-wrap items-center justify-between gap-2">
              <span>Nenhum elemento selecionado para comparar. Selecione até 3 elementos na tabela abaixo.</span>
              <button
                type="button"
                onClick={() => setCompareIds([6, 16, 26])}
                className="btn-secondary !min-h-10"
              >
                Carregar exemplo (C, S, Fe)
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <th className="py-2.5 pr-4 font-semibold">Propriedade</th>
                    {comparedElements.map((el) => (
                      <th key={el.atomicNumber} className="py-2.5 px-3 font-bold text-[var(--color-text)]">
                        {el.symbol} — {el.namePt} (Z={el.atomicNumber})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Categoria</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3">
                        {CATEGORY_META[el.category].label}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Massa atômica</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 font-mono tabular-nums">
                        {el.atomicMass} u {el.isEstimatedMass ? '(est.)' : ''}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Camadas / Config.</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 font-mono text-xs">
                        {el.shells.join('-')} · {el.electronConfiguration}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Eletronegatividade</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 font-mono tabular-nums">
                        {el.electronegativity ?? 'Não disponível'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Raio atômico</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 font-mono tabular-nums">
                        {el.atomicRadiusPm ? `${el.atomicRadiusPm} pm` : 'Não disponível'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">1ª Ionização</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 font-mono tabular-nums">
                        {el.ionizationEnergyEv ? `${el.ionizationEnergyEv} eV` : 'Não disponível'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-muted)]">Aplicação O&amp;G / Indústria</td>
                    {comparedElements.map((el) => (
                      <td key={el.atomicNumber} className="py-2.5 px-3 leading-relaxed max-w-xs text-xs">
                        {el.industrialApplications}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ================= GRADE COMPLETA DE 18 COLUNAS (118 ELEMENTOS) ================= */}
      {viewMode !== 'learning' && (
        <section className="surface-card p-4 sm:p-5">
          {/* Barra de inspeção rápida */}
          <div className="surface-inset mb-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-sm">
            {hoveredEl ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-mono font-bold text-[var(--color-text)]">
                  {hoveredEl.atomicNumber} · {hoveredEl.symbol} — {hoveredEl.namePt}
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  {CATEGORY_META[hoveredEl.category].label}
                </span>
                <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                  Massa: {hoveredEl.atomicMass} u
                </span>
                <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                  Camadas: {hoveredEl.shells.join('-')}
                </span>
                <span className="font-semibold text-[var(--color-primary)] text-xs">
                  EN: {hoveredEl.electronegativity ?? 'N/D'} · Estado: {STATE_LABELS[hoveredEl.standardState]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Passe o cursor ou clique em qualquer um dos 118 elementos para abrir ficha científica, modelo 3D e simulador de íons.
                </span>
              </div>
            )}
          </div>

          <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)] sm:hidden">
            Deslize horizontalmente para visualizar todas as 18 colunas da Tabela Periódica.
          </p>

          <div className="overflow-x-auto pb-2">
            <div
              className="grid gap-1 min-w-[920px]"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
            >
              {PERIODIC_ELEMENTS.map((el) => {
                const matched = matchesFilter(el);
                const catStyle = CATEGORY_META[el.category];
                const isCompared = viewMode === 'compare' && compareIds.includes(el.atomicNumber);
                const trendStyle = viewMode === 'trends' ? getHeatmapStyle(el) : undefined;

                const trendValueText =
                  viewMode === 'trends'
                    ? el[trendProp] !== null
                      ? String(el[trendProp])
                      : 'N/D'
                    : el.atomicMass;

                return (
                  <button
                    key={el.atomicNumber}
                    type="button"
                    onMouseEnter={() => setHoveredEl(el)}
                    onFocus={() => setHoveredEl(el)}
                    onClick={() => handleElementClick(el)}
                    aria-label={`${el.namePt}, símbolo ${el.symbol}, número atômico ${el.atomicNumber}`}
                    style={{
                      gridColumnStart: el.gridCol,
                      gridRowStart: el.gridRow,
                      ...(trendStyle ?? {}),
                    }}
                    className={`relative flex flex-col justify-between rounded-md border p-1 text-left transition cursor-pointer ${
                      viewMode === 'trends'
                        ? ''
                        : `${catStyle.cellBg} ${catStyle.text} ${catStyle.border}`
                    } ${matched ? 'opacity-100' : 'opacity-20'} ${
                      isCompared ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className="tabular-nums">{el.atomicNumber}</span>
                    </div>
                    <div className="my-0.5 text-center font-display text-sm font-bold leading-tight">
                      {el.symbol}
                    </div>
                    <div className="truncate text-center text-[8.5px] leading-tight">
                      {el.namePt}
                    </div>
                    <div className="truncate text-center font-mono text-[8px] opacity-85 tabular-nums">
                      {trendValueText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {viewMode !== 'trends' && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-secondary)]">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterCategory(filterCategory === key ? 'all' : key)}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded px-1.5 transition hover:text-[var(--color-text)] cursor-pointer ${
                    filterCategory === key ? 'font-bold underline text-[var(--color-primary)]' : ''
                  }`}
                >
                  <span className={`inline-block h-3 w-3 rounded-sm border ${meta.cellBg} ${meta.border}`} />
                  <span>{meta.label}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= MODAL DETALHADO DO ELEMENTO ================= */}
      {selectedEl && simulatedIonData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="elemento-modal-titulo"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEl(null);
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-modal)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl border font-display ${CATEGORY_META[selectedEl.category].cellBg} ${CATEGORY_META[selectedEl.category].border} ${CATEGORY_META[selectedEl.category].text}`}
                >
                  <span className="font-mono text-[10px] leading-none">{selectedEl.atomicNumber}</span>
                  <span className="text-lg font-bold leading-tight">{selectedEl.symbol}</span>
                </div>
                <div>
                  <h3 id="elemento-modal-titulo" className="font-display text-xl font-bold text-[var(--color-text)]">
                    {selectedEl.namePt} ({selectedEl.symbol})
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {CATEGORY_META[selectedEl.category].label} · Grupo {selectedEl.group ?? 'f'} · {selectedEl.period}º Período · Bloco {selectedEl.block}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEl(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] cursor-pointer"
                aria-label="Fechar ficha do elemento (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
              {/* Coluna Esquerda: Modelo 3D + Simulador de Íons */}
              <div className="space-y-4">
                <ThreeDScienceViewer
                  mode="atom"
                  atomicNumber={selectedEl.atomicNumber}
                  shells={simulatedIonData.shells}
                  heightClass="h-64"
                  hideDock
                />

                <div className="surface-inset p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                      <Atom className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                      <span>Simulador de Íon e Partículas</span>
                    </h4>
                    <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                      {simulatedIonData.chargeLabel}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5">
                      <p className="text-xs text-[var(--color-text-muted)]">Prótons (Z)</p>
                      <p className="font-mono text-base font-bold text-[var(--color-error)] tabular-nums">
                        {selectedEl.atomicNumber}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5">
                      <p className="text-xs text-[var(--color-text-muted)]">Nêutrons (~A-Z)</p>
                      <p className="font-mono text-base font-bold text-[var(--color-text-secondary)] tabular-nums">
                        {selectedEl.atomicMassNumeric
                          ? Math.max(0, Math.round(selectedEl.atomicMassNumeric) - selectedEl.atomicNumber)
                          : 'Variável'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5">
                      <p className="text-xs text-[var(--color-text-muted)]">Elétrons (e⁻)</p>
                      <p className="font-mono text-base font-bold text-[var(--color-primary)] tabular-nums">
                        {simulatedIonData.electrons}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIonDelta((d) => Math.max(-4, d - 1))}
                        className="btn-secondary !min-h-11"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Remover e⁻ (Cátion)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIonDelta((d) => Math.min(4, d + 1))}
                        className="btn-secondary !min-h-11"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Adicionar e⁻ (Ânion)</span>
                      </button>
                    </div>
                    {ionDelta !== 0 && (
                      <button
                        type="button"
                        onClick={() => setIonDelta(0)}
                        className="min-h-10 px-2 text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                      >
                        Voltar ao neutro
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Ficha Científica */}
              <div className="space-y-3.5 text-sm">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Massa Atômica</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
                      {selectedEl.atomicMass} u {selectedEl.isEstimatedMass ? '(estimada)' : ''}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Estado Físico (25 °C)</p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--color-text)]">
                      {STATE_LABELS[selectedEl.standardState]}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Configuração Eletrônica</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)]">
                      {selectedEl.electronConfiguration}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Camadas (K, L, M...)</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)]">
                      {selectedEl.shells.join(' - ')}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Eletronegatividade (Pauling)</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
                      {selectedEl.electronegativity ?? 'N/D / variável'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Raio Atômico</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
                      {selectedEl.atomicRadiusPm ? `${selectedEl.atomicRadiusPm} pm` : 'N/D / variável'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">1ª Energia de Ionização</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
                      {selectedEl.ionizationEnergyEv ? `${selectedEl.ionizationEnergyEv} eV` : 'N/D / variável'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Afinidade Eletrônica</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[var(--color-text)] tabular-nums">
                      {selectedEl.electronAffinityEv !== null ? `${selectedEl.electronAffinityEv} eV` : 'N/D / variável'}
                    </p>
                  </div>
                </div>

                <div className="surface-inset p-3.5">
                  <p className="font-semibold text-[var(--color-text)]">Estados de oxidação comuns (NOX)</p>
                  <p className="mt-1 font-mono text-xs text-[var(--color-text-secondary)]">
                    {selectedEl.commonOxidationStates}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] p-3.5">
                  <p className="font-semibold text-[var(--color-text)]">
                    Aplicações Industriais e Petrobras / Transpetro
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {selectedEl.industrialApplications}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--color-border)] p-3.5">
                  <p className="font-semibold text-[var(--color-text)]">Descoberta e Curiosidade</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {selectedEl.discoveryAndCuriosity}
                  </p>
                  <p className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">
                    Fonte científica: {selectedEl.dataSource}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
