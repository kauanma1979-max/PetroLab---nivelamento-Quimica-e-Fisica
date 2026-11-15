interface SVGDiagramViewerProps {
  preset: string;
  caption?: string;
}

export function SVGDiagramViewer({ preset, caption }: SVGDiagramViewerProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="p-4">
        {preset === 'ph-and-dispersions' && (
          <svg viewBox="0 0 640 210" className="w-full h-auto" aria-label="Escala de pH e Dispersões">
            <rect x="10" y="10" width="620" height="190" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Escala de pH (25 °C) — Ácidos, Neutro e Bases</text>
            <defs>
              <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="75%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
            <rect x="30" y="54" width="580" height="24" rx="6" fill="url(#phGrad)" />
            {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((val) => {
              const x = 30 + (val / 14) * 580;
              return (
                <g key={val}>
                  <line x1={x} y1="54" x2={x} y2="85" stroke="#0F172A" strokeWidth={val === 7 ? 2.5 : 1} />
                  <text x={x} y="101" textAnchor="middle" fontSize="11" fontWeight={val === 7 ? '700' : '500'} fill="#334155">
                    {val}
                  </text>
                </g>
              );
            })}
            <text x="120" y="124" textAnchor="middle" fontSize="11" fontWeight="600" fill="#DC2626">Meio Ácido (H⁺ &gt; OH⁻)</text>
            <text x="320" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Neutro (pH = 7)</text>
            <text x="510" y="124" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4338CA">Meio Básico (OH⁻ &gt; H⁺)</text>

            <rect x="30" y="140" width="180" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="120" y="158" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">Solução (&lt; 1 nm)</text>
            <text x="120" y="174" textAnchor="middle" fontSize="10" fill="#475569">Homogênea · Não sedimenta</text>

            <rect x="230" y="140" width="180" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="320" y="158" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">Coloide (1 – 1.000 nm)</text>
            <text x="320" y="174" textAnchor="middle" fontSize="10" fill="#475569">Efeito Tyndall · Emulsões</text>

            <rect x="430" y="140" width="180" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="520" y="158" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">Suspensão (&gt; 1.000 nm)</text>
            <text x="520" y="174" textAnchor="middle" fontSize="10" fill="#475569">Heterogênea · Decanta/Filtra</text>
          </svg>
        )}

        {preset === 'balanced-reaction' && (
          <svg viewBox="0 0 640 190" className="w-full h-auto" aria-label="Reação Balanceada e Lei de Lavoisier">
            <rect x="10" y="10" width="620" height="170" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Combustão Completa do Metano · Lei de Lavoisier</text>
            <rect x="30" y="54" width="230" height="72" rx="8" fill="#ECFEFF" stroke="#0D9488" />
            <text x="145" y="76" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F766E">REAGENTES</text>
            <text x="145" y="100" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">1 CH₄ + 2 O₂</text>
            <text x="145" y="118" textAnchor="middle" fontSize="11" fill="#334155">16 g + 64 g = 80 g</text>

            <path d="M 275 90 L 355 90" stroke="#0F172A" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill="#0F172A" />
              </marker>
            </defs>
            <text x="315" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">Reação</text>

            <rect x="370" y="54" width="240" height="72" rx="8" fill="#F0FDF4" stroke="#059669" />
            <text x="490" y="76" textAnchor="middle" fontSize="11" fontWeight="600" fill="#047857">PRODUTOS</text>
            <text x="490" y="100" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">1 CO₂ + 2 H₂O</text>
            <text x="490" y="118" textAnchor="middle" fontSize="11" fill="#334155">44 g + 36 g = 80 g</text>

            <text x="320" y="156" textAnchor="middle" fontSize="12" fontWeight="600" fill="#0F172A">
              Átomos conservados: C (1 = 1) · H (4 = 4) · O (4 = 4) · Massa Total (80 g = 80 g)
            </text>
          </svg>
        )}

        {preset === 'stoichiometry-gas-laws' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Ponte do Mol e Estequiometria">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Mapa Central da Estequiometria — A Ponte do Mol</text>
            <rect x="26" y="60" width="130" height="60" rx="8" fill="#FFFFFF" stroke="#94A3B8" />
            <text x="91" y="85" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">Massa (g)</text>
            <text x="91" y="104" textAnchor="middle" fontSize="11" fill="#475569">n = m / M</text>

            <rect x="225" y="54" width="190" height="72" rx="8" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
            <text x="320" y="82" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F766E">MOL (n)</text>
            <text x="320" y="100" textAnchor="middle" fontSize="11" fill="#134E4A">6,02 × 10²³ entidades</text>
            <text x="320" y="116" textAnchor="middle" fontSize="10" fill="#134E4A">Proporção dos coeficientes</text>

            <rect x="484" y="60" width="130" height="60" rx="8" fill="#FFFFFF" stroke="#94A3B8" />
            <text x="549" y="85" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">Gás Ideal</text>
            <text x="549" y="104" textAnchor="middle" fontSize="11" fill="#475569">PV = nRT (T em K)</text>

            <line x1="156" y1="90" x2="225" y2="90" stroke="#0F172A" strokeWidth="2" />
            <line x1="415" y1="90" x2="484" y2="90" stroke="#0F172A" strokeWidth="2" />
            <text x="320" y="162" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
              CNTP (0 °C, 1 atm): 1 mol de gás ideal ≈ 22,4 L · Nunca faça regra de três direta em gramas sem a razão molar!
            </text>
          </svg>
        )}

        {preset === 'enthalpy-redox-equilibrium' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Termoquímica e Equilíbrio">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Diagrama de Entalpia (Exotérmica vs Endotérmica) e Redox</text>
            {/* Exo */}
            <line x1="40" y1="155" x2="280" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <line x1="40" y1="55" x2="40" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <path d="M 55 85 L 110 85 Q 150 50 185 130 L 250 130" fill="none" stroke="#EF4444" strokeWidth="2.5" />
            <text x="78" y="78" fontSize="11" fontWeight="700" fill="#0F172A">H_reag</text>
            <text x="215" y="123" fontSize="11" fontWeight="700" fill="#0F172A">H_prod</text>
            <text x="155" y="174" textAnchor="middle" fontSize="11" fontWeight="600" fill="#DC2626">Exotérmica: ΔH &lt; 0 (libera calor)</text>

            {/* Endo */}
            <line x1="350" y1="155" x2="590" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <line x1="350" y1="55" x2="350" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <path d="M 365 130 L 420 130 Q 470 52 510 85 L 570 85" fill="none" stroke="#0D9488" strokeWidth="2.5" />
            <text x="388" y="123" fontSize="11" fontWeight="700" fill="#0F172A">H_reag</text>
            <text x="535" y="78" fontSize="11" fontWeight="700" fill="#0F172A">H_prod</text>
            <text x="470" y="174" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F766E">Endotérmica: ΔH &gt; 0 (absorve calor)</text>
          </svg>
        )}

        {preset === 'si-vectors' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Sistema Internacional e Decomposição Vetorial">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Decomposição Vetorial Ortogonal e Base do SI</text>
            <line x1="60" y1="160" x2="260" y2="160" stroke="#64748B" strokeWidth="1.5" />
            <line x1="60" y1="160" x2="60" y2="50" stroke="#64748B" strokeWidth="1.5" />
            <line x1="60" y1="160" x2="220" y2="75" stroke="#4F46E5" strokeWidth="3" />
            <line x1="60" y1="160" x2="220" y2="160" stroke="#0EA5E9" strokeWidth="3" />
            <line x1="60" y1="160" x2="60" y2="75" stroke="#10B981" strokeWidth="3" />
            <line x1="220" y1="75" x2="220" y2="160" stroke="#94A3B8" strokeDasharray="4 3" />
            <line x1="60" y1="75" x2="220" y2="75" stroke="#94A3B8" strokeDasharray="4 3" />
            <text x="150" y="102" fontSize="12" fontWeight="700" fill="#4338CA">F = √(Fₓ² + Fᵧ²)</text>
            <text x="140" y="176" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0284C7">Fₓ = F · cos θ</text>
            <text x="22" y="110" fontSize="11" fontWeight="600" fill="#059669">Fᵧ</text>
            <text x="100" y="150" fontSize="11" fill="#334155">θ</text>

            <rect x="305" y="54" width="305" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="320" y="76" fontSize="12" fontWeight="700" fill="#0F172A">Conversões essenciais (PDF p. 54)</text>
            <text x="320" y="98" fontSize="11" fill="#334155">• Massa: 1 t = 1.000 kg · Volume: 1 m³ = 1.000 L</text>
            <text x="320" y="118" fontSize="11" fill="#334155">• Velocidade: m/s × 3,6 = km/h</text>
            <text x="320" y="138" fontSize="11" fill="#334155">• Pressão: 1 bar = 10⁵ Pa · 1 MPa = 10 bar</text>
            <text x="320" y="156" fontSize="11" fill="#334155">• Energia: 1 kWh = 3,6 MJ</text>
          </svg>
        )}

        {preset === 'kinematics-graphs' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Gráficos de Cinemática MU e MUV">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Leitura de Gráficos: Posição (x×t) e Velocidade (v×t)</text>
            {/* x vs t */}
            <line x1="50" y1="155" x2="270" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <line x1="50" y1="155" x2="50" y2="55" stroke="#64748B" strokeWidth="1.5" />
            <line x1="50" y1="145" x2="250" y2="85" stroke="#0EA5E9" strokeWidth="2.5" />
            <path d="M 50 145 Q 160 140 250 60" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
            <text x="38" y="65" fontSize="11" fontWeight="700" fill="#334155">x</text>
            <text x="260" y="169" fontSize="11" fill="#334155">t</text>
            <text x="155" y="176" textAnchor="middle" fontSize="11" fill="#334155">Reta = MU · Parábola = MUV</text>

            {/* v vs t */}
            <line x1="350" y1="155" x2="590" y2="155" stroke="#64748B" strokeWidth="1.5" />
            <line x1="350" y1="155" x2="350" y2="55" stroke="#64748B" strokeWidth="1.5" />
            <polygon points="350,155 350,120 550,65 550,155" fill="#E0E7FF" />
            <line x1="350" y1="120" x2="550" y2="65" stroke="#4F46E5" strokeWidth="2.5" />
            <text x="336" y="65" fontSize="11" fontWeight="700" fill="#334155">v</text>
            <text x="580" y="169" fontSize="11" fill="#334155">t</text>
            <text x="455" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3730A3">Área = Δx</text>
            <text x="470" y="176" textAnchor="middle" fontSize="11" fill="#334155">Inclinação da reta = Aceleração (a)</text>
          </svg>
        )}

        {preset === 'energy-conservation' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Conservação da Energia Mecânica">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Conservação da Energia Mecânica (E_m = E_c + E_p = constante)</text>
            <path d="M 45 62 Q 160 165 300 160" fill="none" stroke="#334155" strokeWidth="3" />
            <circle cx="62" cy="68" r="10" fill="#4F46E5" />
            <circle cx="282" cy="150" r="10" fill="#0D9488" />
            <text x="85" y="68" fontSize="11" fontWeight="700" fill="#3730A3">Topo: E_p = mgh · E_c = 0</text>
            <text x="195" y="178" fontSize="11" fontWeight="700" fill="#0F766E">Base (h=0): E_p = 0 · E_c = ½mv²</text>

            <rect x="355" y="55" width="250" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="372" y="78" fontSize="12" fontWeight="700" fill="#0F172A">Sem atrito: v = √(2gh)</text>
            <text x="372" y="100" fontSize="11" fill="#334155">• Trabalho: W = F·d·cosθ (J)</text>
            <text x="372" y="120" fontSize="11" fill="#334155">• Potência: P = W / Δt (W = J/s)</text>
            <text x="372" y="140" fontSize="11" fill="#334155">• Com atrito: E_mf = E_mi - |W_atrito|</text>
          </svg>
        )}

        {preset === 'hydrostatic-tank-pascal' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Stevin e Prensa de Pascal">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Teorema de Stevin (Tanque) e Prensa Hidráulica de Pascal</text>
            {/* Tanque */}
            <rect x="40" y="55" width="140" height="115" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <line x1="40" y1="68" x2="180" y2="68" stroke="#0369A1" strokeDasharray="3 3" />
            <text x="110" y="50" textAnchor="middle" fontSize="10" fill="#334155">p_atm</text>
            <line x1="110" y1="68" x2="110" y2="170" stroke="#0F172A" strokeWidth="1.5" />
            <text x="118" y="118" fontSize="11" fontWeight="700" fill="#0F172A">h</text>
            <text x="110" y="185" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0369A1">p_abs = p_atm + ρ·g·h</text>

            {/* Prensa Pascal */}
            <path d="M 270 85 L 270 165 L 550 165 L 550 75 L 440 75 L 440 135 L 330 135 L 330 85 Z" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
            <rect x="272" y="80" width="56" height="10" fill="#334155" />
            <rect x="442" y="70" width="106" height="12" fill="#334155" />
            <text x="300" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">F₁ ↓ (A₁)</text>
            <text x="495" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">F₂ ↑ (A₂)</text>
            <text x="410" y="185" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F766E">Pascal: F₁ / A₁ = F₂ / A₂ · Arquimedes: E = ρ_fluido·V_sub·g</text>
          </svg>
        )}

        {preset === 'heat-transfer-modes' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Modos de Transferência de Calor">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Transferência de Calor: Condução, Convecção e Radiação (PDF p. 69–71)</text>
            <rect x="26" y="54" width="184" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="118" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">1. Condução</text>
            <rect x="48" y="92" width="140" height="24" rx="4" fill="#F97316" opacity="0.25" stroke="#EA580C" />
            <text x="118" y="108" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9A3412">T₁ ━━▶ T₂ (L)</text>
            <text x="118" y="138" textAnchor="middle" fontSize="10" fill="#475569">Contato em sólidos</text>
            <text x="118" y="156" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0F172A">q&quot; = k·ΔT / L</text>

            <rect x="228" y="54" width="184" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="320" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">2. Convecção</text>
            <path d="M 285 122 C 285 90, 355 90, 355 122 C 355 135, 285 135, 285 122" fill="none" stroke="#0EA5E9" strokeWidth="2.5" />
            <text x="320" y="114" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0369A1">Fluido ↑ quente / ↓ frio</text>
            <text x="320" y="156" textAnchor="middle" fontSize="10" fill="#475569">Líquidos e gases (natural/forçada)</text>

            <rect x="430" y="54" width="184" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="522" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">3. Radiação</text>
            <path d="M 455 108 Q 470 92 485 108 T 515 108 T 545 108 T 575 108" fill="none" stroke="#EF4444" strokeWidth="2.5" />
            <text x="522" y="138" textAnchor="middle" fontSize="10" fill="#475569">Ondas EM · Propaga no VÁCUO</text>
            <text x="522" y="156" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0F172A">q = ε·σ·T⁴ (T em K)</text>
          </svg>
        )}

        {preset === 'thermodynamic-cycle' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Máquina Térmica e Ciclo Termodinâmico">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Máquina Térmica (1ª e 2ª Leis da Termodinâmica — PDF p. 72 e 79)</text>
            <rect x="70" y="52" width="180" height="34" rx="6" fill="#FEE2E2" stroke="#EF4444" />
            <text x="160" y="73" textAnchor="middle" fontSize="12" fontWeight="700" fill="#991B1B">Fonte Quente (T_h)</text>

            <line x1="160" y1="86" x2="160" y2="108" stroke="#EF4444" strokeWidth="3" />
            <text x="172" y="101" fontSize="11" fontWeight="700" fill="#B91C1C">Q_h</text>

            <circle cx="160" cy="126" r="22" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
            <text x="160" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="#312E81">Ciclo</text>

            <line x1="182" y1="126" x2="290" y2="126" stroke="#4F46E5" strokeWidth="3" />
            <text x="236" y="118" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3730A3">W = Q_h - Q_c</text>

            <line x1="160" y1="148" x2="160" y2="164" stroke="#0EA5E9" strokeWidth="3" />
            <rect x="70" y="164" width="180" height="22" rx="4" fill="#E0F2FE" stroke="#0284C7" />
            <text x="160" y="179" textAnchor="middle" fontSize="11" fontWeight="700" fill="#075985">Fonte Fria (T_c) recebe Q_c</text>

            <rect x="330" y="60" width="280" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="346" y="84" fontSize="12" fontWeight="700" fill="#0F172A">Equações de prova:</text>
            <text x="346" y="106" fontSize="11" fill="#334155">• 1ª Lei: ΔU = Q - W</text>
            <text x="346" y="126" fontSize="11" fill="#334155">• Rendimento real: η = W / Q_h = 1 - Q_c/Q_h</text>
            <text x="346" y="146" fontSize="11" fontWeight="600" fill="#4338CA">• Carnot (máximo): η_max = 1 - T_c / T_h (em K!)</text>
          </svg>
        )}

        {preset === 'circuits-faraday' && (
          <svg viewBox="0 0 640 200" className="w-full h-auto" aria-label="Circuitos Série vs Paralelo e Lei de Faraday">
            <rect x="10" y="10" width="620" height="180" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="26" y="34" fontSize="13" fontWeight="700" fill="#0F172A">Circuitos Série vs Paralelo e Lei de Ohm (PDF p. 114 e 117)</text>
            {/* Série */}
            <rect x="30" y="54" width="275" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="167" y="74" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">Ligação em SÉRIE</text>
            <rect x="70" y="92" width="195" height="44" fill="none" stroke="#334155" strokeWidth="2" />
            <rect x="105" y="85" width="42" height="14" rx="2" fill="#4F46E5" />
            <rect x="180" y="85" width="42" height="14" rx="2" fill="#4F46E5" />
            <text x="126" y="95" textAnchor="middle" fontSize="9" fill="#FFFFFF">R₁</text>
            <text x="201" y="95" textAnchor="middle" fontSize="9" fill="#FFFFFF">R₂</text>
            <text x="167" y="156" textAnchor="middle" fontSize="10" fill="#334155">Mesma corrente I · R_eq = R₁ + R₂</text>

            {/* Paralelo */}
            <rect x="330" y="54" width="280" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="470" y="74" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">Ligação em PARALELO</text>
            <rect x="370" y="88" width="200" height="52" fill="none" stroke="#334155" strokeWidth="2" />
            <line x1="370" y1="114" x2="570" y2="114" stroke="#334155" strokeWidth="2" />
            <rect x="445" y="81" width="46" height="14" rx="2" fill="#0D9488" />
            <rect x="445" y="107" width="46" height="14" rx="2" fill="#0D9488" />
            <text x="468" y="91" textAnchor="middle" fontSize="9" fill="#FFFFFF">R₁</text>
            <text x="468" y="117" textAnchor="middle" fontSize="9" fill="#FFFFFF">R₂</text>
            <text x="470" y="156" textAnchor="middle" fontSize="10" fill="#334155">Mesma tensão V · R_eq = (R₁·R₂)/(R₁+R₂)</text>
          </svg>
        )}
      </div>

      {caption && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-text-secondary)]">
          {caption}
        </div>
      )}
    </div>
  );
}
