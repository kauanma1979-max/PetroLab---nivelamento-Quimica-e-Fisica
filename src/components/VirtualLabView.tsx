import { useMemo, useState } from 'react';
import { Atom, FlaskConical, Gauge, Waves, Zap } from 'lucide-react';
import { ThreeDScienceViewer } from './ThreeDScienceViewer';

type LabDiscipline = 'quimica' | 'fisica';
type ChemLabId = 'atom-ion' | 'molecules' | 'distillation' | 'stoichiometry' | 'solutions' | 'ph-scale';
type PhysLabId = 'kinematics' | 'inclined-plane' | 'energy' | 'fluids' | 'thermal' | 'circuits' | 'em-wave';

export function VirtualLabView() {
  const [disc, setDisc] = useState<LabDiscipline>('quimica');
  const [chemLab, setChemLab] = useState<ChemLabId>('atom-ion');
  const [physLab, setPhysLab] = useState<PhysLabId>('inclined-plane');

  // ===== Estados Química =====
  const [labZ, setLabZ] = useState<number>(11);
  const [labElectronDelta, setLabElectronDelta] = useState<number>(0);
  const [labMol, setLabMol] = useState<'H2O' | 'CO2' | 'CH4' | 'NaCl' | 'C2H4' | 'C6H6'>('H2O');
  const [towerTemp, setTowerTemp] = useState<number>(180);
  const [molsCH4, setMolsCH4] = useState<number>(2);
  const [molsO2, setMolsO2] = useState<number>(5);
  const [solMassG, setSolMassG] = useState<number>(40);
  const [solVol1L, setSolVol1L] = useState<number>(1.0);
  const [solAddWaterL, setSolAddWaterL] = useState<number>(1.0);
  const [phVal, setPhVal] = useState<number>(7.0);

  // ===== Estados Física =====
  const [kinV0, setKinV0] = useState<number>(4);
  const [kinA, setKinA] = useState<number>(2);
  const [kinT, setKinT] = useState<number>(6);
  const [rampAngle, setRampAngle] = useState<number>(30);
  const [rampMass, setRampMass] = useState<number>(10);
  const [rampMu, setRampMu] = useState<number>(0.2);
  const [enMass, setEnMass] = useState<number>(4);
  const [enHeight, setEnHeight] = useState<number>(15);
  const [enLossPct, setEnLossPct] = useState<number>(0);
  const [fluidRho, setFluidRho] = useState<number>(850);
  const [fluidDepth, setFluidDepth] = useState<number>(10);
  const [pascalRatio, setPascalRatio] = useState<number>(20);
  const [bodyRho, setBodyRho] = useState<number>(700);
  const [thHotC, setThHotC] = useState<number>(527);
  const [thColdC, setThColdC] = useState<number>(27);
  const [thK, setThK] = useState<number>(0.04);
  const [circMode, setCircMode] = useState<'serie' | 'paralelo'>('paralelo');
  const [circV, setCircV] = useState<number>(12);
  const [circR1, setCircR1] = useState<number>(6);
  const [circR2, setCircR2] = useState<number>(12);
  const [emExp, setEmExp] = useState<number>(10);

  // Derivados Química
  const atomPresets: Record<number, { sym: string; name: string; shells: number[] }> = {
    1: { sym: 'H', name: 'Hidrogênio', shells: [1] },
    6: { sym: 'C', name: 'Carbono', shells: [2, 4] },
    8: { sym: 'O', name: 'Oxigênio', shells: [2, 6] },
    11: { sym: 'Na', name: 'Sódio', shells: [2, 8, 1] },
    17: { sym: 'Cl', name: 'Cloro', shells: [2, 8, 7] },
    26: { sym: 'Fe', name: 'Ferro', shells: [2, 8, 14, 2] },
  };
  const currentAtomInfo = atomPresets[labZ] || atomPresets[11];
  const simulatedShells = useMemo(() => {
    const totalE = Math.max(0, labZ + labElectronDelta);
    if (labElectronDelta === 0) return currentAtomInfo.shells;
    const caps = [2, 8, 18, 32];
    let rem = totalE;
    const out: number[] = [];
    for (let i = 0; i < caps.length && rem > 0; i++) {
      const n = Math.min(rem, caps[i]);
      out.push(n);
      rem -= n;
    }
    return out.length > 0 ? out : [0];
  }, [labZ, labElectronDelta, currentAtomInfo]);

  const stoichResult = useMemo(() => {
    const neededO2ForAllCH4 = molsCH4 * 2;
    const limiting =
      molsO2 < neededO2ForAllCH4
        ? 'O₂'
        : molsO2 > neededO2ForAllCH4
          ? 'CH₄'
          : 'Estequiométrica (sem excesso)';
    const reactedCH4 = Math.min(molsCH4, molsO2 / 2);
    const reactedO2 = reactedCH4 * 2;
    return {
      limiting,
      reactedCH4,
      reactedO2,
      excessCH4: +(molsCH4 - reactedCH4).toFixed(2),
      excessO2: +(molsO2 - reactedO2).toFixed(2),
      co2Mols: +reactedCH4.toFixed(2),
      co2MassG: +(reactedCH4 * 44).toFixed(1),
      h2oMols: +(reactedCH4 * 2).toFixed(2),
    };
  }, [molsCH4, molsO2]);

  // Derivados Física
  const inclinedResults = useMemo(() => {
    const g = 10;
    const rad = (rampAngle * Math.PI) / 180;
    const P = rampMass * g;
    const Px = P * Math.sin(rad);
    const Py = P * Math.cos(rad);
    const N = Py;
    const FatMax = rampMu * N;
    const slides = Px > FatMax;
    const a = slides ? (Px - FatMax) / rampMass : 0;
    return { P, Px, Py, N, FatMax, slides, a };
  }, [rampAngle, rampMass, rampMu]);

  const circuitResults = useMemo(() => {
    const rEq =
      circMode === 'serie' ? circR1 + circR2 : (circR1 * circR2) / (circR1 + circR2);
    const iTot = circV / rEq;
    const i1 = circMode === 'serie' ? iTot : circV / circR1;
    const i2 = circMode === 'serie' ? iTot : circV / circR2;
    const power = circV * iTot;
    return { rEq, iTot, i1, i2, power };
  }, [circMode, circV, circR1, circR2]);

  const emBandInfo = useMemo(() => {
    const f = Math.pow(10, emExp);
    const lambda = 3e8 / f;
    let band = 'Rádio / Telemetria';
    let app = 'Comunicação SCADA em dutos';
    if (emExp >= 9 && emExp < 12) {
      band = 'Micro-ondas';
      app = 'Medidor de nível por Radar em tanques (PDF p. 56)';
    } else if (emExp >= 12 && emExp < 14.5) {
      band = 'Infravermelho';
      app = 'Termografia para detectar pontos quentes em painéis e dutos';
    } else if (emExp >= 14.5 && emExp < 15.2) {
      band = 'Luz Visível';
      app = 'Inspeção visual e espectrofotometria';
    } else if (emExp >= 15.2 && emExp < 17) {
      band = 'Ultravioleta (UV)';
      app = 'Sensores de chama UV em fornos/caldeiras';
    } else if (emExp >= 17 && emExp < 19) {
      band = 'Raios X';
      app = 'Radiografia industrial de soldas e chapas';
    } else if (emExp >= 19) {
      band = 'Raios Gama (γ)';
      app = 'Gamagrafia (Ir-192) de juntas soldadas em oleodutos (PDF p. 116)';
    }
    return {
      f,
      lambda,
      band,
      app,
      freqScale: Math.min(2.6, Math.max(0.5, (emExp - 5) / 6)),
    };
  }, [emExp]);

  // Cálculos extras para visualizações SVG reativas
  const distillationFractions = [
    { name: 'GLP (C₁–C₄)', bp: 40, desc: 'Gás liquefeito · Topo', color: '#0F766E' },
    { name: 'Gasolina / Nafta (C₅–C₁₀)', bp: 150, desc: 'Combustível e petroquímica', color: '#0D9488' },
    { name: 'Querosene (C₁₁–C₁₄)', bp: 230, desc: 'QAV (Aviação)', color: '#0284C7' },
    { name: 'Óleo Diesel (C₁₅–C₁₈)', bp: 320, desc: 'Transporte pesado', color: '#B45309' },
    { name: 'Óleo Combustível / Asfalto', bp: 380, desc: 'Fundo da torre (>350 °C)', color: '#475569' },
  ];

  const phColorHex =
    phVal < 3
      ? '#EF4444'
      : phVal < 6
        ? '#F59E0B'
        : phVal <= 7.5
          ? '#10B981'
          : phVal < 11
            ? '#0EA5E9'
            : '#4338CA';

  const kinDeltaX = kinV0 * kinT + 0.5 * kinA * kinT * kinT;
  const kinVf = kinV0 + kinA * kinT;

  const enEpi = enMass * 10 * enHeight;
  const enLoss = enEpi * (enLossPct / 100);
  const enEcf = enEpi - enLoss;
  const enVf = Math.sqrt((2 * enEcf) / enMass);

  const carnotEta = (1 - (thColdC + 273) / (thHotC + 273)) * 100;
  const fourierFlux = (thK * (thHotC - thColdC)) / 0.05;

  return (
    <div className="space-y-6">
      {/* Seletor de Disciplina e Bancada */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Experimentação Científica Interativa
            </p>
            <h2 className="type-page-title mt-0.5">
              Laboratório Virtual de Química e Física
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDisc('quimica')}
              className={disc === 'quimica' ? 'btn-primary' : 'btn-secondary !min-h-11'}
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              <span>Bancada de Química (6)</span>
            </button>
            <button
              type="button"
              onClick={() => setDisc('fisica')}
              className={disc === 'fisica' ? 'btn-physics' : 'btn-secondary !min-h-11'}
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Bancada de Física (7)</span>
            </button>
          </div>
        </div>

        {/* Seletor das simulações */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
          {disc === 'quimica'
            ? (
                [
                  { id: 'atom-ion', label: '1. Átomo e Íons 3D' },
                  { id: 'molecules', label: '2. Moléculas e Polaridade 3D' },
                  { id: 'distillation', label: '3. Torre de Destilação' },
                  { id: 'stoichiometry', label: '4. Estequiometria & Limitante' },
                  { id: 'solutions', label: '5. Concentração & Diluição' },
                  { id: 'ph-scale', label: '6. pH e Indicadores' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChemLab(item.id)}
                  className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    chemLab === item.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]'
                      : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                >
                  {item.label}
                </button>
              ))
            : (
                [
                  { id: 'kinematics', label: '1. Cinemática MU/MUV' },
                  { id: 'inclined-plane', label: '2. Plano Inclinado 3D' },
                  { id: 'energy', label: '3. Energia Mecânica' },
                  { id: 'fluids', label: '4. Fluidos (Stevin/Pascal/Empuxo)' },
                  { id: 'thermal', label: '5. Calor & Carnot' },
                  { id: 'circuits', label: '6. Circuitos (Lei de Ohm)' },
                  { id: 'em-wave', label: '7. Onda Eletromagnética 3D' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPhysLab(item.id)}
                  className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    physLab === item.id
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary-hover)]'
                      : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
        </div>
      </section>

      {/* ================= BANCADA DE QUÍMICA ================= */}
      {disc === 'quimica' && (
        <section className="surface-card p-5 sm:p-6">
          {chemLab === 'atom-ion' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ThreeDScienceViewer
                mode="atom"
                atomicNumber={labZ}
                shells={simulatedShells}
                heightClass="h-80"
                hideDock
              />
              <div className="space-y-4">
                <h3 className="type-section-title flex items-center gap-2">
                  <Atom className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>Construtor 3D de Átomo e Íons</span>
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Escolha o elemento (número de prótons Z fixo) e adicione ou remova elétrons para observar a formação de cátions e ânions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(atomPresets).map(([zKey, info]) => (
                    <button
                      key={zKey}
                      type="button"
                      onClick={() => {
                        setLabZ(Number(zKey));
                        setLabElectronDelta(0);
                      }}
                      className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        labZ === Number(zKey)
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      {info.sym} (Z={zKey})
                    </button>
                  ))}
                </div>
                <label className="surface-inset block p-3.5 text-sm font-medium text-[var(--color-text-secondary)]">
                  <span>
                    Variação de elétrons:{' '}
                    <strong className="font-mono text-[var(--color-text)]">
                      {labElectronDelta >= 0 ? `+${labElectronDelta}` : labElectronDelta} e⁻
                    </strong>
                  </span>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    value={labElectronDelta}
                    onChange={(e) => setLabElectronDelta(Number(e.target.value))}
                    className="mt-2 w-full accent-teal-700"
                  />
                </label>
                <div className="surface-inset grid grid-cols-3 gap-2 p-3.5 text-center text-sm">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Prótons</p>
                    <p className="font-mono text-lg font-bold text-[var(--color-error)] tabular-nums">{labZ}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Elétrons</p>
                    <p className="font-mono text-lg font-bold text-[var(--color-primary)] tabular-nums">
                      {Math.max(0, labZ + labElectronDelta)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Carga líquida</p>
                    <p className="font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {labZ - Math.max(0, labZ + labElectronDelta) === 0
                        ? '0 (Neutro)'
                        : labZ - Math.max(0, labZ + labElectronDelta) > 0
                          ? `+${labZ - Math.max(0, labZ + labElectronDelta)} (Cátion)`
                          : `${labZ - Math.max(0, labZ + labElectronDelta)} (Ânion)`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chemLab === 'molecules' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ThreeDScienceViewer mode="molecule" moleculeKey={labMol} heightClass="h-80" hideDock />
              <div className="space-y-4">
                <h3 className="type-section-title">
                  Geometria Molecular e Polaridade 3D
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Compare geometrias covalentes, retículo iônico e hidrocarbonetos aromáticos/insaturados.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['H2O', 'CO2', 'CH4', 'NaCl', 'C2H4', 'C6H6'] as const).map((mk) => (
                    <button
                      key={mk}
                      type="button"
                      onClick={() => setLabMol(mk)}
                      className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold transition cursor-pointer ${
                        labMol === mk
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      {mk}
                    </button>
                  ))}
                </div>
                <div className="surface-inset p-4 text-sm space-y-2 text-[var(--color-text-secondary)]">
                  {labMol === 'H2O' && (
                    <>
                      <p><strong>Geometria:</strong> Angular (104,5°) devido aos 2 pares de elétrons não ligantes no Oxigênio.</p>
                      <p><strong>Polaridade:</strong> Polar · Faz ligações de hidrogênio (PE = 100 °C).</p>
                    </>
                  )}
                  {labMol === 'CO2' && (
                    <>
                      <p><strong>Geometria:</strong> Linear (180°).</p>
                      <p><strong>Polaridade:</strong> Apolar! Embora C=O seja polar, os vetores opostos se cancelam.</p>
                    </>
                  )}
                  {labMol === 'CH4' && (
                    <>
                      <p><strong>Geometria:</strong> Tetraédrica simétrica (109,5°).</p>
                      <p><strong>Polaridade:</strong> Apolar (Dipolo induzido / London) · Gás natural (PE = -161,5 °C).</p>
                    </>
                  )}
                  {labMol === 'NaCl' && (
                    <>
                      <p><strong>Estrutura:</strong> Retículo cristalino cúbico iônico (não forma molécula isolada).</p>
                      <p><strong>Propriedade:</strong> Elevado PF (801 °C); conduz corrente elétrica quando fundido ou dissolvido.</p>
                    </>
                  )}
                  {labMol === 'C2H4' && (
                    <>
                      <p><strong>Geometria:</strong> Trigonal plana (120°) ao redor de cada carbono (ligação dupla C=C).</p>
                      <p><strong>Indústria:</strong> Monômero base para polimerização do polietileno (PEAD/PEBD).</p>
                    </>
                  )}
                  {labMol === 'C6H6' && (
                    <>
                      <p><strong>Estrutura:</strong> Anel aromático planar com elétrons π ressonantes.</p>
                      <p><strong>Indústria:</strong> Matéria-prima petroquímica BTX (Benzeno, Tolueno, Xilenos).</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {chemLab === 'distillation' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex flex-col items-center justify-center">
                <svg viewBox="0 0 300 280" className="w-full max-w-[300px] h-auto" aria-label="Coluna de destilação fracionada">
                  <rect x="75" y="18" width="110" height="244" rx="18" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
                  <text x="130" y="12" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                    Torre Fracionada ({towerTemp} °C)
                  </text>
                  {distillationFractions.map((frac, idx) => {
                    const y = 32 + idx * 44;
                    const active = towerTemp >= frac.bp;
                    return (
                      <g key={frac.name}>
                        <rect
                          x="84"
                          y={y}
                          width="92"
                          height="34"
                          rx="6"
                          fill={active ? '#CCFBF1' : '#F1F5F9'}
                          stroke={active ? '#0F766E' : '#CBD5E1'}
                          strokeWidth="1.5"
                        />
                        <text x="130" y={y + 15} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">
                          {frac.name.split(' ')[0]} ({frac.bp} °C)
                        </text>
                        <text x="130" y={y + 28} textAnchor="middle" fontSize="9" fill={active ? '#0F766E' : '#475569'}>
                          {active ? 'Vapor coletado' : 'Fase líquida'}
                        </text>
                        <line x1="176" y1={y + 17} x2="215" y2={y + 17} stroke={active ? frac.color : '#CBD5E1'} strokeWidth="3" />
                        <circle cx="220" cy={y + 17} r="5" fill={active ? frac.color : '#CBD5E1'} />
                        <text x="230" y={y + 20} fontSize="9" fontWeight="600" fill={active ? '#0F172A' : '#475569'}>
                          {active ? 'Sai' : 'Retida'}
                        </text>
                      </g>
                    );
                  })}
                  <rect x="20" y="218" width="46" height="36" rx="6" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
                  <text x="43" y="235" textAnchor="middle" fontSize="9" fontWeight="700" fill="#78350F">Forno</text>
                  <text x="43" y="247" textAnchor="middle" fontSize="9" fontWeight="700" fill="#B45309">{towerTemp} °C</text>
                  <line x1="66" y1="236" x2="75" y2="236" stroke="#B45309" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="type-section-title">
                      Torre de Destilação Fracionada do Petróleo (PDF p. 110)
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Ajuste a temperatura do forno para observar quais frações vaporizam pelo ponto de ebulição.
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-[var(--color-primary)] tabular-nums">
                    T = {towerTemp} °C
                  </span>
                </div>

                <label className="surface-inset block p-3.5 text-sm font-medium text-[var(--color-text-secondary)]">
                  <span>Temperatura da base da torre: <strong className="font-mono">{towerTemp} °C</strong> (20 °C – 400 °C)</span>
                  <input
                    type="range"
                    min={20}
                    max={400}
                    step={10}
                    value={towerTemp}
                    onChange={(e) => setTowerTemp(Number(e.target.value))}
                    className="mt-2 w-full accent-teal-700"
                  />
                </label>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                  {distillationFractions.map((frac) => {
                    const vaporized = towerTemp >= frac.bp;
                    return (
                      <div
                        key={frac.name}
                        className={`rounded-lg border p-3 transition ${
                          vaporized
                            ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-text)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm">{frac.name}</p>
                          <span className="font-mono font-semibold">~{frac.bp} °C</span>
                        </div>
                        <p className="mt-0.5">{frac.desc}</p>
                        <p className="mt-1.5 font-mono font-semibold text-[var(--color-primary)]">
                          {vaporized ? 'Estado: Vaporizou / Coletada' : 'Estado: Permanece líquida'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {chemLab === 'stoichiometry' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex flex-col justify-center">
                <svg viewBox="0 0 320 210" className="w-full h-auto" aria-label="Balanço molar de reagentes e produtos">
                  <text x="160" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                    Proporção Molar (1 CH₄ : 2 O₂ → 1 CO₂ : 2 H₂O)
                  </text>
                  {[
                    { label: 'CH₄ inicial', val: molsCH4, max: 14, color: '#0F766E', y: 42 },
                    { label: 'O₂ inicial', val: molsO2, max: 14, color: '#0369A1', y: 80 },
                    { label: 'CO₂ gerado', val: stoichResult.co2Mols, max: 14, color: '#475569', y: 122 },
                    { label: 'H₂O gerada', val: stoichResult.h2oMols, max: 14, color: '#4338CA', y: 160 },
                  ].map((bar) => (
                    <g key={bar.label}>
                      <text x="14" y={bar.y + 14} fontSize="10" fontWeight="600" fill="#334155">
                        {bar.label}
                      </text>
                      <rect x="92" y={bar.y} width="175" height="20" rx="4" fill="#E2E8F0" />
                      <rect
                        x="92"
                        y={bar.y}
                        width={Math.min(175, (bar.val / bar.max) * 175)}
                        height="20"
                        rx="4"
                        fill={bar.color}
                      />
                      <text x="275" y={bar.y + 14} fontSize="10" fontWeight="700" fill="#0F172A">
                        {bar.val} mol
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title">
                  Simulador de Estequiometria e Reagente Limitante
                </h3>
                <p className="font-mono text-sm font-bold text-[var(--color-primary-hover)] bg-[var(--color-primary-soft)] border border-[var(--color-primary-border)] rounded-lg px-3.5 py-2.5">
                  1 CH₄ (16 g/mol) + 2 O₂ (32 g/mol) ──▶ 1 CO₂ (44 g/mol) + 2 H₂O (18 g/mol)
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="surface-inset p-3.5 text-sm font-medium text-[var(--color-text-secondary)]">
                    <span>Metano inicial (CH₄): <strong className="font-mono">{molsCH4} mol</strong></span>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={0.5}
                      value={molsCH4}
                      onChange={(e) => setMolsCH4(Number(e.target.value))}
                      className="mt-2 w-full accent-teal-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5 text-sm font-medium text-[var(--color-text-secondary)]">
                    <span>Oxigênio inicial (O₂): <strong className="font-mono">{molsO2} mol</strong></span>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      step={0.5}
                      value={molsO2}
                      onChange={(e) => setMolsO2(Number(e.target.value))}
                      className="mt-2 w-full accent-teal-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Reagente limitante</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-error)]">{stoichResult.limiting}</p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">CO₂ formado</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-primary)] tabular-nums">
                      {stoichResult.co2Mols} mol ({stoichResult.co2MassG} g)
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">H₂O formada</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-text)] tabular-nums">
                      {stoichResult.h2oMols} mol
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Excesso restante</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[var(--color-text-secondary)] tabular-nums">
                      CH₄: {stoichResult.excessCH4} · O₂: {stoichResult.excessO2} mol
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chemLab === 'solutions' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4 surface-inset p-4 flex items-center justify-center">
                {(() => {
                  const v2 = solVol1L + solAddWaterL;
                  const m2 = solMassG / 40 / v2;
                  const fillRatio = Math.min(1, v2 / 7);
                  const fillH = Math.round(fillRatio * 125);
                  const opacity = Math.min(0.9, 0.18 + (m2 / 8) * 0.72);
                  return (
                    <svg viewBox="0 0 220 220" className="w-full max-w-[220px] h-auto" aria-label="Béquer de diluição">
                      <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                        Béquer Final: V₂ = {v2.toFixed(1)} L
                      </text>
                      <path d="M 55 42 L 55 186 Q 55 196 65 196 L 155 196 Q 165 196 165 186 L 165 42" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
                      <rect
                        x="58"
                        y={193 - fillH}
                        width="104"
                        height={fillH}
                        rx="4"
                        fill="#0F766E"
                        fillOpacity={opacity}
                      />
                      <text x="110" y="130" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">
                        M₂ = {m2.toFixed(2)} M
                      </text>
                      <text x="110" y="148" textAnchor="middle" fontSize="10" fill="#334155">
                        n = {(solMassG / 40).toFixed(2)} mol NaOH
                      </text>
                    </svg>
                  );
                })()}
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h3 className="type-section-title">
                  Concentração Molar e Diluição (C₁·V₁ = C₂·V₂) — Soluto NaOH (M = 40 g/mol)
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Massa de NaOH: <strong className="font-mono">{solMassG} g</strong></span>
                    <input
                      type="range"
                      min={10}
                      max={160}
                      step={10}
                      value={solMassG}
                      onChange={(e) => setSolMassG(Number(e.target.value))}
                      className="mt-2 w-full accent-teal-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Volume inicial V₁: <strong className="font-mono">{solVol1L.toFixed(1)} L</strong></span>
                    <input
                      type="range"
                      min={0.5}
                      max={3.0}
                      step={0.5}
                      value={solVol1L}
                      onChange={(e) => setSolVol1L(Number(e.target.value))}
                      className="mt-2 w-full accent-teal-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Água adicionada ΔV: <strong className="font-mono">{solAddWaterL.toFixed(1)} L</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={4.0}
                      step={0.5}
                      value={solAddWaterL}
                      onChange={(e) => setSolAddWaterL(Number(e.target.value))}
                      className="mt-2 w-full accent-teal-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Mols de NaOH (n)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {(solMassG / 40).toFixed(2)} mol
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Molaridade inicial (M₁)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-primary)] tabular-nums">
                      {(solMassG / 40 / solVol1L).toFixed(2)} mol/L
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Volume final (V₂)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {(solVol1L + solAddWaterL).toFixed(1)} L
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] p-3">
                    <p className="text-xs font-semibold text-[var(--color-primary-hover)]">Molaridade final (M₂)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {(solMassG / 40 / (solVol1L + solAddWaterL)).toFixed(2)} mol/L
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chemLab === 'ph-scale' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                <svg viewBox="0 0 300 180" className="w-full h-auto" aria-label="Indicador visual de pH">
                  <defs>
                    <linearGradient id="labPhGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="30%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="75%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#4338CA" />
                    </linearGradient>
                  </defs>
                  <text x="150" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">
                    Indicador Universal: pH = {phVal.toFixed(1)}
                  </text>
                  <rect x="20" y="42" width="260" height="22" rx="6" fill="url(#labPhGrad)" />
                  <circle cx={20 + (phVal / 14) * 260} cy="53" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
                  <rect x="95" y="88" width="110" height="72" rx="10" fill={phColorHex} fillOpacity="0.22" stroke={phColorHex} strokeWidth="2.5" />
                  <text x="150" y="122" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">
                    {phVal < 7 ? 'Meio Ácido' : phVal > 7 ? 'Meio Básico' : 'Meio Neutro'}
                  </text>
                  <text x="150" y="142" textAnchor="middle" fontSize="10" fill="#334155">
                    pOH = {(14 - phVal).toFixed(1)}
                  </text>
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title">
                  Laboratório de pH, pOH e Indicadores Ácido-Base (25 °C)
                </h3>
                <label className="surface-inset block p-3.5 text-sm">
                  <span>
                    Ajuste o pH da solução aquosa:{' '}
                    <strong className="font-mono text-base">{phVal.toFixed(1)}</strong> (0,0 – 14,0)
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={14}
                    step={0.5}
                    value={phVal}
                    onChange={(e) => setPhVal(Number(e.target.value))}
                    className="mt-2 w-full accent-teal-700"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Caráter do meio</p>
                    <p className="mt-1 font-bold text-[var(--color-text)]">
                      {phVal < 7 ? 'Ácido (H⁺ > OH⁻)' : phVal > 7 ? 'Básico (OH⁻ > H⁺)' : 'Neutro (H⁺ = OH⁻)'}
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">pOH (14 − pH)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {(14 - phVal).toFixed(1)}
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Fenolftaleína</p>
                    <p className="mt-1 font-bold text-pink-700">
                      {phVal >= 8.2 ? 'Rosa / Magenta' : 'Incolor'}
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Azul de Bromotimol</p>
                    <p className="mt-1 font-bold text-[var(--color-text)]">
                      {phVal < 6.0 ? 'Amarelo' : phVal > 7.6 ? 'Azul' : 'Verde (transição)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= BANCADA DE FÍSICA ================= */}
      {disc === 'fisica' && (
        <section className="surface-card p-5 sm:p-6">
          {physLab === 'kinematics' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                {(() => {
                  const posPct = Math.max(0, Math.min(1, kinDeltaX / 350));
                  const blockX = 24 + posPct * 235;
                  return (
                    <svg viewBox="0 0 300 180" className="w-full h-auto" aria-label="Pista de cinemática">
                      <text x="150" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                        Pista Unidimensional (t = {kinT} s)
                      </text>
                      <line x1="20" y1="115" x2="280" y2="115" stroke="#334155" strokeWidth="3" />
                      <line x1="24" y1="108" x2="24" y2="122" stroke="#0F172A" strokeWidth="2" />
                      <text x="24" y="136" textAnchor="middle" fontSize="9" fill="#475569">0 m</text>
                      <text x="276" y="136" textAnchor="end" fontSize="9" fill="#475569">350+ m</text>
                      <rect x={blockX} y="82" width="28" height="28" rx="5" fill="#4338CA" />
                      <text x={blockX + 14} y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4338CA">
                        Δx = {kinDeltaX.toFixed(1)} m
                      </text>
                      <text x="150" y="162" textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155">
                        v(t) = {kinVf.toFixed(1)} m/s ({(kinVf * 3.6).toFixed(1)} km/h)
                      </text>
                    </svg>
                  );
                })()}
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title">
                  Simulador de Cinemática (MU e MUV)
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Velocidade inicial v₀: <strong className="font-mono">{kinV0} m/s</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={kinV0}
                      onChange={(e) => setKinV0(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Aceleração a: <strong className="font-mono">{kinA} m/s²</strong></span>
                    <input
                      type="range"
                      min={-4}
                      max={6}
                      step={0.5}
                      value={kinA}
                      onChange={(e) => setKinA(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Instante t: <strong className="font-mono">{kinT} s</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={1}
                      value={kinT}
                      onChange={(e) => setKinT(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <div className="surface-inset p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)]">Deslocamento Δx = v₀t + ½at²</p>
                    <p className="mt-1 font-mono text-lg font-bold text-[var(--color-secondary)] tabular-nums">
                      {kinDeltaX.toFixed(1)} m
                    </p>
                  </div>
                  <div className="surface-inset p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)]">Velocidade final v = v₀ + at</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {kinVf.toFixed(1)} m/s ({(kinVf * 3.6).toFixed(1)} km/h)
                    </p>
                  </div>
                  <div className="surface-inset p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)]">Regime</p>
                    <p className="mt-1 font-bold text-[var(--color-text)]">
                      {kinA === 0 ? 'MU (velocidade constante)' : 'MUV (aceleração constante)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'inclined-plane' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ThreeDScienceViewer
                mode="inclined-plane"
                angleDeg={rampAngle}
                heightClass="h-80"
                hideDock
              />
              <div className="space-y-4">
                <h3 className="type-section-title">
                  Plano Inclinado 3D — Leis de Newton e Atrito
                </h3>
                <div className="space-y-3 text-sm">
                  <label className="surface-inset block p-3.5">
                    <span>Ângulo da rampa θ: <strong className="font-mono">{rampAngle}°</strong> (10° – 50°)</span>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={rampAngle}
                      onChange={(e) => setRampAngle(Number(e.target.value))}
                      className="mt-1.5 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset block p-3.5">
                    <span>Massa do bloco m: <strong className="font-mono">{rampMass} kg</strong> (g = 10 m/s²)</span>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      value={rampMass}
                      onChange={(e) => setRampMass(Number(e.target.value))}
                      className="mt-1.5 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset block p-3.5">
                    <span>Coeficiente de atrito μ: <strong className="font-mono">{rampMu.toFixed(2)}</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={0.7}
                      step={0.05}
                      value={rampMu}
                      onChange={(e) => setRampMu(Number(e.target.value))}
                      className="mt-1.5 w-full accent-indigo-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Peso (P) / Normal (N)</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-text)] tabular-nums">
                      {inclinedResults.P.toFixed(0)} N / {inclinedResults.N.toFixed(1)} N
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Pₓ vs Atrito máx.</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-text)] tabular-nums">
                      {inclinedResults.Px.toFixed(1)} N vs {inclinedResults.FatMax.toFixed(1)} N
                    </p>
                  </div>
                  <div className="col-span-2 rounded-lg border border-[var(--color-secondary-border)] bg-[var(--color-secondary-soft)] p-3.5">
                    <p className="font-semibold text-[var(--color-secondary-hover)]">
                      {inclinedResults.slides
                        ? `O bloco desliza! Aceleração a = ${inclinedResults.a.toFixed(2)} m/s²`
                        : 'Em repouso (Equilíbrio estático: Pₓ ≤ μ·N)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'energy' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                <svg viewBox="0 0 300 190" className="w-full h-auto" aria-label="Balanço de energia mecânica">
                  <text x="150" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                    Transformação de Energia (Total = {enEpi.toFixed(0)} J)
                  </text>
                  <text x="16" y="64" fontSize="10" fontWeight="600" fill="#334155">E_pg topo</text>
                  <rect x="92" y="50" width="185" height="22" rx="4" fill="#4338CA" />
                  <text x="184" y="65" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">{enEpi.toFixed(0)} J</text>

                  <text x="16" y="108" fontSize="10" fontWeight="600" fill="#334155">E_c base</text>
                  <rect x="92" y="94" width={Math.max(4, ((100 - enLossPct) / 100) * 185)} height="22" rx="4" fill="#0F766E" />
                  <text x="184" y="109" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">
                    {enEcf.toFixed(0)} J ({100 - enLossPct}%)
                  </text>

                  <text x="16" y="152" fontSize="10" fontWeight="600" fill="#334155">Atrito</text>
                  <rect x="92" y="138" width={Math.max(0, (enLossPct / 100) * 185)} height="22" rx="4" fill="#B91C1C" />
                  <text x="184" y="153" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">
                    {enLoss.toFixed(0)} J ({enLossPct}%)
                  </text>
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title">
                  Conservação da Energia Mecânica e Dissipação
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Massa m: <strong className="font-mono">{enMass} kg</strong></span>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={enMass}
                      onChange={(e) => setEnMass(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Altura inicial h: <strong className="font-mono">{enHeight} m</strong></span>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      value={enHeight}
                      onChange={(e) => setEnHeight(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Perda por atrito: <strong className="font-mono">{enLossPct}%</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={5}
                      value={enLossPct}
                      onChange={(e) => setEnLossPct(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">E_pg inicial (mgh)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">{enEpi.toFixed(0)} J</p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Dissipada (atrito)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-error)] tabular-nums">{enLoss.toFixed(0)} J</p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">E_c na base</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-secondary)] tabular-nums">{enEcf.toFixed(0)} J</p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-secondary-border)] bg-[var(--color-secondary-soft)] p-3">
                    <p className="text-xs font-semibold text-[var(--color-secondary-hover)]">Velocidade final</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">{enVf.toFixed(2)} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'fluids' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                {(() => {
                  const floats = bodyRho <= fluidRho;
                  const subPct = floats ? Math.round((bodyRho / fluidRho) * 100) : 100;
                  const blockY = floats ? 56 + (subPct / 100) * 32 - 32 : 126;
                  return (
                    <svg viewBox="0 0 300 190" className="w-full h-auto" aria-label="Tanque hidrostático e flutuabilidade">
                      <text x="150" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                        Tanque (ρ = {fluidRho} kg/m³ · h = {fluidDepth} m)
                      </text>
                      <rect x="40" y="34" width="220" height="132" rx="6" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
                      <rect x="42" y="64" width="216" height="100" fill="#DBEAFE" />
                      <rect x="122" y={blockY} width="56" height="36" rx="4" fill="#4338CA" />
                      <text x="150" y={blockY + 22} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
                        {bodyRho}
                      </text>
                      <text x="150" y="182" textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155">
                        {floats ? `Flutua (${subPct}% submerso)` : 'Afunda até o fundo (ρ_bloco > ρ_fluido)'}
                      </text>
                    </svg>
                  );
                })()}
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>Simulador de Hidrostática (Stevin), Pascal e Arquimedes</span>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Fluido (ρ):</span>
                    <select
                      value={fluidRho}
                      onChange={(e) => setFluidRho(Number(e.target.value))}
                      className="input-control mt-1.5"
                    >
                      <option value={750}>Gasolina (750 kg/m³)</option>
                      <option value={850}>Óleo Diesel (850 kg/m³)</option>
                      <option value={1000}>Água doce (1.000 kg/m³)</option>
                      <option value={13600}>Mercúrio (13.600 kg/m³)</option>
                    </select>
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Profundidade h: <strong className="font-mono">{fluidDepth} m</strong></span>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      value={fluidDepth}
                      onChange={(e) => setFluidDepth(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Razão prensa A₂/A₁: <strong className="font-mono">{pascalRatio}×</strong></span>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={pascalRatio}
                      onChange={(e) => setPascalRatio(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Densidade do bloco: <strong className="font-mono">{bodyRho} kg/m³</strong></span>
                    <input
                      type="range"
                      min={300}
                      max={2000}
                      step={50}
                      value={bodyRho}
                      onChange={(e) => setBodyRho(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Stevin (p_atm = 100 kPa)</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[var(--color-text)] tabular-nums">
                      p_man = {((fluidRho * 10 * fluidDepth) / 1000).toFixed(1)} kPa · p_abs ={' '}
                      {(100 + (fluidRho * 10 * fluidDepth) / 1000).toFixed(1)} kPa
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Pascal (F₁ = 100 N)</p>
                    <p className="mt-1 font-mono font-bold text-[var(--color-secondary)] tabular-nums">
                      F₂ = {(100 * pascalRatio).toLocaleString('pt-BR')} N
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Arquimedes</p>
                    <p className="mt-1 font-bold text-[var(--color-text)]">
                      {bodyRho <= fluidRho
                        ? `Flutua (${Math.round((bodyRho / fluidRho) * 100)}% submerso)`
                        : 'Afunda (ρ_bloco > ρ_fluido)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'thermal' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                <svg viewBox="0 0 300 185" className="w-full h-auto" aria-label="Parede térmica e Carnot">
                  <rect x="20" y="34" width="70" height="106" rx="6" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="2" />
                  <text x="55" y="82" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7F1D1D">T_h</text>
                  <text x="55" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7F1D1D">{thHotC} °C</text>

                  <rect x="110" y="34" width="80" height="106" rx="4" fill={thK < 1 ? '#FEF3C7' : thK > 100 ? '#FED7AA' : '#E2E8F0'} stroke="#475569" strokeWidth="2" />
                  <text x="150" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">Parede L=5cm</text>
                  <text x="150" y="98" textAnchor="middle" fontSize="10" fill="#334155">k = {thK}</text>

                  <rect x="210" y="34" width="70" height="106" rx="6" fill="#E0F2FE" stroke="#0369A1" strokeWidth="2" />
                  <text x="245" y="82" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0C4A6E">T_c</text>
                  <text x="245" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0C4A6E">{thColdC} °C</text>

                  <text x="150" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4338CA">
                    Carnot η_max = {carnotEta.toFixed(1)}% · q&quot; = {fourierFlux.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} W/m²
                  </text>
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="type-section-title">
                  Simulador Térmico: Condução (Fourier) e Máquina de Carnot
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Fonte Quente T_h: <strong className="font-mono">{thHotC} °C ({thHotC + 273} K)</strong></span>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={10}
                      value={thHotC}
                      onChange={(e) => setThHotC(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Fonte Fria T_c: <strong className="font-mono">{thColdC} °C ({thColdC + 273} K)</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, thHotC - 20)}
                      step={5}
                      value={thColdC}
                      onChange={(e) => setThColdC(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Material (parede L = 0,05 m):</span>
                    <select
                      value={thK}
                      onChange={(e) => setThK(Number(e.target.value))}
                      className="input-control mt-1.5"
                    >
                      <option value={0.04}>Lã de Rocha (isolante, k=0,04)</option>
                      <option value={50}>Aço Carbono (k=50 W/m·K)</option>
                      <option value={380}>Cobre (condutor, k=380 W/m·K)</option>
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <div className="surface-inset p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)]">Fluxo por Condução (Fourier q&quot; = k·ΔT/L)</p>
                    <p className="mt-1 font-mono text-lg font-bold text-[var(--color-text)] tabular-nums">
                      {fourierFlux.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} W/m²
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-secondary-border)] bg-[var(--color-secondary-soft)] p-3.5">
                    <p className="text-xs font-semibold text-[var(--color-secondary-hover)]">
                      Rendimento Máximo de Carnot (1 − T_c/T_h em Kelvin)
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-[var(--color-text)] tabular-nums">
                      {carnotEta.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'circuits' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 surface-inset p-4 flex items-center justify-center">
                <svg viewBox="0 0 300 180" className="w-full h-auto" aria-label="Diagrama dinâmico do circuito">
                  <text x="150" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                    Circuito em {circMode === 'serie' ? 'Série' : 'Paralelo'} · V = {circV} V
                  </text>
                  {circMode === 'serie' ? (
                    <>
                      <rect x="45" y="42" width="210" height="96" fill="none" stroke="#334155" strokeWidth="2.5" />
                      <rect x="25" y="72" width="40" height="34" rx="4" fill="#0F172A" />
                      <text x="45" y="93" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">{circV}V</text>
                      <rect x="95" y="31" width="52" height="22" rx="4" fill="#4338CA" />
                      <text x="121" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">R₁={circR1}Ω</text>
                      <rect x="175" y="31" width="52" height="22" rx="4" fill="#0F766E" />
                      <text x="201" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">R₂={circR2}Ω</text>
                    </>
                  ) : (
                    <>
                      <rect x="45" y="42" width="210" height="96" fill="none" stroke="#334155" strokeWidth="2.5" />
                      <line x1="100" y1="90" x2="255" y2="90" stroke="#334155" strokeWidth="2.5" />
                      <rect x="25" y="72" width="40" height="34" rx="4" fill="#0F172A" />
                      <text x="45" y="93" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">{circV}V</text>
                      <rect x="148" y="31" width="60" height="22" rx="4" fill="#4338CA" />
                      <text x="178" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">R₁={circR1}Ω</text>
                      <rect x="148" y="79" width="60" height="22" rx="4" fill="#0F766E" />
                      <text x="178" y="94" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">R₂={circR2}Ω</text>
                    </>
                  )}
                  <text x="150" y="164" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4338CA">
                    I_total = {circuitResults.iTot.toFixed(2)} A · P = {circuitResults.power.toFixed(1)} W
                  </text>
                </svg>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="type-section-title">
                    Simulador de Circuitos — Lei de Ohm e Potência
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCircMode('serie')}
                      className={circMode === 'serie' ? 'btn-physics !min-h-10' : 'btn-secondary !min-h-10'}
                    >
                      Série
                    </button>
                    <button
                      type="button"
                      onClick={() => setCircMode('paralelo')}
                      className={circMode === 'paralelo' ? 'btn-physics !min-h-10' : 'btn-secondary !min-h-10'}
                    >
                      Paralelo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <label className="surface-inset p-3.5">
                    <span>Tensão da fonte V: <strong className="font-mono">{circV} V</strong></span>
                    <input
                      type="range"
                      min={5}
                      max={220}
                      step={1}
                      value={circV}
                      onChange={(e) => setCircV(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Resistor R₁: <strong className="font-mono">{circR1} Ω</strong></span>
                    <input
                      type="range"
                      min={2}
                      max={100}
                      step={2}
                      value={circR1}
                      onChange={(e) => setCircR1(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                  <label className="surface-inset p-3.5">
                    <span>Resistor R₂: <strong className="font-mono">{circR2} Ω</strong></span>
                    <input
                      type="range"
                      min={2}
                      max={100}
                      step={2}
                      value={circR2}
                      onChange={(e) => setCircR2(Number(e.target.value))}
                      className="mt-2 w-full accent-indigo-700"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Resistência Equiv. (R_eq)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {circuitResults.rEq.toFixed(2)} Ω
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Corrente Total (I)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-secondary)] tabular-nums">
                      {circuitResults.iTot.toFixed(2)} A
                    </p>
                  </div>
                  <div className="surface-inset p-3">
                    <p className="text-xs text-[var(--color-text-muted)]">Correntes I₁ / I₂</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[var(--color-text)] tabular-nums">
                      {circuitResults.i1.toFixed(2)} A / {circuitResults.i2.toFixed(2)} A
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--color-secondary-border)] bg-[var(--color-secondary-soft)] p-3">
                    <p className="text-xs font-semibold text-[var(--color-secondary-hover)]">Potência Total (P = V·I)</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--color-text)] tabular-nums">
                      {circuitResults.power.toFixed(1)} W
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {physLab === 'em-wave' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ThreeDScienceViewer
                mode="em-wave"
                frequencyScale={emBandInfo.freqScale}
                heightClass="h-80"
                hideDock
              />
              <div className="space-y-4">
                <h3 className="type-section-title flex items-center gap-2">
                  <Waves className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>Onda Eletromagnética 3D e Espectro</span>
                </h3>
                <label className="surface-inset block p-3.5 text-sm">
                  <span>Frequência: <strong className="font-mono">10^{emExp} Hz</strong> (10⁶ – 10²⁰ Hz)</span>
                  <input
                    type="range"
                    min={6}
                    max={20}
                    step={0.5}
                    value={emExp}
                    onChange={(e) => setEmExp(Number(e.target.value))}
                    className="mt-2 w-full accent-indigo-700"
                  />
                </label>
                <div className="surface-inset space-y-2 p-4 text-sm text-[var(--color-text-secondary)]">
                  <p>
                    <strong>Faixa do Espectro:</strong>{' '}
                    <span className="font-semibold text-[var(--color-secondary)]">{emBandInfo.band}</span>
                  </p>
                  <p>
                    <strong>Comprimento de onda no vácuo (λ = c/f):</strong>{' '}
                    <span className="font-mono text-[var(--color-text)]">{emBandInfo.lambda.toExponential(2)} m</span>
                  </p>
                  <p>
                    <strong>Aplicação Petrobras / Transpetro:</strong> {emBandInfo.app}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
