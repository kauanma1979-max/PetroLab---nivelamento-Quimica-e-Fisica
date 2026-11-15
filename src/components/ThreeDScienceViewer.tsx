import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw } from 'lucide-react';

export type ThreeDMode = 'atom' | 'molecule' | 'inclined-plane' | 'em-wave';

interface ThreeDScienceViewerProps {
  mode: ThreeDMode;
  preset?: string;
  atomicNumber?: number;
  shells?: number[];
  moleculeKey?: 'H2O' | 'CO2' | 'CH4' | 'NaCl' | 'C2H4' | 'C6H6';
  angleDeg?: number;
  frequencyScale?: number;
  heightClass?: string;
  caption?: string;
  hideDock?: boolean;
}

const ATOM_PRESETS: Record<string, { label: string; Z: number; shells: number[] }> = {
  C: { label: 'Carbono (C, Z=6)', Z: 6, shells: [2, 4] },
  O: { label: 'Oxigênio (O, Z=8)', Z: 8, shells: [2, 6] },
  Na: { label: 'Sódio neutro (Na, Z=11)', Z: 11, shells: [2, 8, 1] },
  'Na+': { label: 'Cátion Sódio (Na⁺, 10 e⁻)', Z: 11, shells: [2, 8] },
  Cl: { label: 'Cloro neutro (Cl, Z=17)', Z: 17, shells: [2, 8, 7] },
};

const MOLECULE_INFO: Record<
  'H2O' | 'CO2' | 'CH4' | 'NaCl' | 'C2H4' | 'C6H6',
  { title: string; geometry: string; polarity: string }
> = {
  H2O: { title: 'Água (H₂O)', geometry: 'Angular (104,5°)', polarity: 'Polar · Ligação de Hidrogênio' },
  CO2: { title: 'Dióxido de Carbono (CO₂)', geometry: 'Linear (180°)', polarity: 'Apolar (dipolos se anulam)' },
  CH4: { title: 'Metano (CH₄)', geometry: 'Tetraédrica (109,5°)', polarity: 'Apolar · Principal componente do Gás Natural' },
  NaCl: { title: 'Cloreto de Sódio (NaCl)', geometry: 'Retículo cristalino cúbico iônico', polarity: 'Ligação Iônica (Na⁺ / Cl⁻)' },
  C2H4: { title: 'Eteno / Etileno (C₂H₄)', geometry: 'Trigonal plana (120°) · Dupla C=C', polarity: 'Apolar · Monômero do Polietileno' },
  C6H6: { title: 'Benzeno (C₆H₆)', geometry: 'Hexágono planar aromático', polarity: 'Apolar · Anel benzênico ressonante' },
};

function createCylinderBetween(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  material: THREE.Material
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, 14);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

function addVectorArrow(
  group: THREE.Group,
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  length: number,
  color: number
) {
  if (length <= 0.05) return;
  const arrow = new THREE.ArrowHelper(
    dir.clone().normalize(),
    origin,
    length,
    color,
    Math.min(0.28, length * 0.25),
    0.14
  );
  group.add(arrow);
}

export function ThreeDScienceViewer({
  mode,
  preset,
  atomicNumber,
  shells,
  moleculeKey,
  angleDeg = 30,
  frequencyScale = 1.2,
  heightClass = 'h-72 sm:h-80',
  caption,
  hideDock = false,
}: ThreeDScienceViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedAtomKey, setSelectedAtomKey] = useState<string>(() =>
    preset === 'sodium-ion' ? 'Na' : 'C'
  );
  const [selectedMol, setSelectedMol] = useState<'H2O' | 'CO2' | 'CH4' | 'NaCl' | 'C2H4' | 'C6H6'>(
    () => {
      if (moleculeKey) return moleculeKey;
      if (preset === 'hydrocarbons-benzene') return 'C6H6';
      return 'H2O';
    }
  );
  const [rampAngle, setRampAngle] = useState<number>(angleDeg);
  const [freq, setFreq] = useState<number>(frequencyScale);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [dockOpen, setDockOpen] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);

  const activeMol = moleculeKey ?? selectedMol;
  const activeAtom = useMemo(() => {
    if (atomicNumber && shells && shells.length > 0) {
      return {
        label: `Z = ${atomicNumber}`,
        Z: atomicNumber,
        shells,
      };
    }
    return ATOM_PRESETS[selectedAtomKey] || ATOM_PRESETS.C;
  }, [atomicNumber, shells, selectedAtomKey]);

  const effectiveAngle = angleDeg !== 30 && hideDock ? angleDeg : rampAngle;
  const effectiveFreq = frequencyScale !== 1.2 && hideDock ? frequencyScale : freq;

  useEffect(() => {
    setRampAngle(angleDeg);
  }, [angleDeg]);

  useEffect(() => {
    setFreq(frequencyScale);
  }, [frequencyScale]);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglError(true);
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const glRendererName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(glRendererName);

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 220);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(
      mode === 'inclined-plane' ? 5.2 : mode === 'em-wave' ? 6.2 : 4.8,
      mode === 'inclined-plane' ? 3.2 : 3.2,
      mode === 'em-wave' ? 6.4 : 5.4
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.4;
    controls.maxDistance = 14;

    // Iluminação 3-point
    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 0.85);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.45);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const electronRefs: { mesh: THREE.Mesh; radius: number; speed: number; offset: number; planeGroup: THREE.Group }[] = [];
    const emEPoints: THREE.Mesh[] = [];
    const emBPoints: THREE.Mesh[] = [];

    // ===== CONSTRUÇÃO POR MODO =====
    if (mode === 'atom') {
      const nucleusGroup = new THREE.Group();
      const protonMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
        metalness: 0.25,
      });
      const neutronMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.2,
      });

      const nucleonCount = Math.min(activeAtom.Z * 2, 28);
      const nucleonGeo = new THREE.SphereGeometry(0.14, 16, 16);
      for (let i = 0; i < nucleonCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / nucleonCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = nucleonCount === 1 ? 0 : 0.22 * Math.cbrt(i / nucleonCount + 0.2);
        const mesh = new THREE.Mesh(nucleonGeo, i % 2 === 0 ? protonMat : neutronMat);
        mesh.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
        nucleusGroup.add(mesh);
      }
      rootGroup.add(nucleusGroup);

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        emissive: 0x0d9488,
        emissiveIntensity: 0.5,
        roughness: 0.2,
      });
      const electronGeo = new THREE.SphereGeometry(0.085, 14, 14);

      activeAtom.shells.forEach((eCount, shellIdx) => {
        const radius = 0.85 + shellIdx * 0.45;
        const planeGroup = new THREE.Group();
        planeGroup.rotation.x = (shellIdx % 2 === 0 ? 1 : -1) * 0.32 * (shellIdx + 0.4);
        planeGroup.rotation.y = shellIdx * 0.55;

        const torusGeo = new THREE.TorusGeometry(radius, 0.014, 8, 64);
        const ring = new THREE.Mesh(torusGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        planeGroup.add(ring);

        for (let e = 0; e < eCount; e++) {
          const elMesh = new THREE.Mesh(electronGeo, electronMat);
          const offset = (e / eCount) * Math.PI * 2;
          elMesh.position.set(Math.cos(offset) * radius, 0, Math.sin(offset) * radius);
          planeGroup.add(elMesh);
          electronRefs.push({
            mesh: elMesh,
            radius,
            speed: 1.5 / (shellIdx + 1),
            offset,
            planeGroup,
          });
        }
        rootGroup.add(planeGroup);
      });
    } else if (mode === 'molecule') {
      const matC = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.2 });
      const matH = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
      const matO = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const matNa = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.35, metalness: 0.2 });
      const matCl = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
      const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.3 });

      const addAtom = (pos: THREE.Vector3, r: number, mat: THREE.Material) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), mat);
        mesh.position.copy(pos);
        rootGroup.add(mesh);
      };

      if (activeMol === 'H2O') {
        const oPos = new THREE.Vector3(0, 0.25, 0);
        const angle = (104.5 * Math.PI) / 180 / 2;
        const dist = 1.25;
        const h1 = new THREE.Vector3(-Math.sin(angle) * dist, 0.25 - Math.cos(angle) * dist, 0);
        const h2 = new THREE.Vector3(Math.sin(angle) * dist, 0.25 - Math.cos(angle) * dist, 0);
        addAtom(oPos, 0.46, matO);
        addAtom(h1, 0.28, matH);
        addAtom(h2, 0.28, matH);
        rootGroup.add(createCylinderBetween(oPos, h1, 0.08, bondMat));
        rootGroup.add(createCylinderBetween(oPos, h2, 0.08, bondMat));
      } else if (activeMol === 'CO2') {
        const cPos = new THREE.Vector3(0, 0, 0);
        const o1 = new THREE.Vector3(-1.45, 0, 0);
        const o2 = new THREE.Vector3(1.45, 0, 0);
        addAtom(cPos, 0.42, matC);
        addAtom(o1, 0.44, matO);
        addAtom(o2, 0.44, matO);
        // Duplas ligações
        [-0.09, 0.09].forEach((offset) => {
          rootGroup.add(
            createCylinderBetween(
              new THREE.Vector3(0, offset, 0),
              new THREE.Vector3(-1.45, offset, 0),
              0.05,
              bondMat
            )
          );
          rootGroup.add(
            createCylinderBetween(
              new THREE.Vector3(0, offset, 0),
              new THREE.Vector3(1.45, offset, 0),
              0.05,
              bondMat
            )
          );
        });
      } else if (activeMol === 'CH4') {
        const cPos = new THREE.Vector3(0, 0, 0);
        const d = 1.28;
        const dirs = [
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(Math.sqrt(8 / 9), -1 / 3, 0),
          new THREE.Vector3(-Math.sqrt(2 / 9), -1 / 3, Math.sqrt(2 / 3)),
          new THREE.Vector3(-Math.sqrt(2 / 9), -1 / 3, -Math.sqrt(2 / 3)),
        ];
        addAtom(cPos, 0.42, matC);
        dirs.forEach((dir) => {
          const p = dir.clone().multiplyScalar(d);
          addAtom(p, 0.27, matH);
          rootGroup.add(createCylinderBetween(cPos, p, 0.075, bondMat));
        });
      } else if (activeMol === 'NaCl') {
        const spacing = 0.95;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              const isNa = (x + y + z + 6) % 2 === 0;
              const p = new THREE.Vector3(x * spacing, y * spacing, z * spacing);
              addAtom(p, isNa ? 0.26 : 0.36, isNa ? matNa : matCl);
            }
          }
        }
      } else if (activeMol === 'C2H4') {
        const c1 = new THREE.Vector3(-0.75, 0, 0);
        const c2 = new THREE.Vector3(0.75, 0, 0);
        addAtom(c1, 0.4, matC);
        addAtom(c2, 0.4, matC);
        rootGroup.add(createCylinderBetween(new THREE.Vector3(-0.75, 0.09, 0), new THREE.Vector3(0.75, 0.09, 0), 0.055, bondMat));
        rootGroup.add(createCylinderBetween(new THREE.Vector3(-0.75, -0.09, 0), new THREE.Vector3(0.75, -0.09, 0), 0.055, bondMat));
        const hs = [
          { from: c1, to: new THREE.Vector3(-1.45, 0.85, 0) },
          { from: c1, to: new THREE.Vector3(-1.45, -0.85, 0) },
          { from: c2, to: new THREE.Vector3(1.45, 0.85, 0) },
          { from: c2, to: new THREE.Vector3(1.45, -0.85, 0) },
        ];
        hs.forEach(({ from, to }) => {
          addAtom(to, 0.26, matH);
          rootGroup.add(createCylinderBetween(from, to, 0.07, bondMat));
        });
      } else if (activeMol === 'C6H6') {
        const rC = 1.25;
        const rH = 2.05;
        const cPositions: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const cp = new THREE.Vector3(Math.cos(a) * rC, 0, Math.sin(a) * rC);
          const hp = new THREE.Vector3(Math.cos(a) * rH, 0, Math.sin(a) * rH);
          cPositions.push(cp);
          addAtom(cp, 0.34, matC);
          addAtom(hp, 0.22, matH);
          rootGroup.add(createCylinderBetween(cp, hp, 0.06, bondMat));
        }
        for (let i = 0; i < 6; i++) {
          const next = (i + 1) % 6;
          rootGroup.add(createCylinderBetween(cPositions[i], cPositions[next], 0.07, bondMat));
        }
        const aromaticRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.95, 0.035, 10, 48),
          new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x0f766e, emissiveIntensity: 0.4 })
        );
        aromaticRing.rotation.x = Math.PI / 2;
        rootGroup.add(aromaticRing);
      }
    } else if (mode === 'inclined-plane') {
      const theta = (effectiveAngle * Math.PI) / 180;
      const baseLen = 4.2;
      const heightY = baseLen * Math.tan(Math.min(theta, 0.95));

      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 0.14, 3.0),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
      );
      floor.position.set(0, -1.2, 0);
      rootGroup.add(floor);

      // Rampa inclinada formada por prisma triangular via ExtrudeGeometry
      const shape = new THREE.Shape();
      shape.moveTo(-2.1, 0);
      shape.lineTo(2.1, 0);
      shape.lineTo(-2.1, Math.max(0.35, Math.min(heightY, 2.8)));
      shape.closePath();

      const rampGeo = new THREE.ExtrudeGeometry(shape, { depth: 1.6, bevelEnabled: false });
      rampGeo.translate(0, -1.13, -0.8);
      const rampMesh = new THREE.Mesh(
        rampGeo,
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.2 })
      );
      rootGroup.add(rampMesh);

      // Bloco sobre a rampa
      const slopeLen = Math.hypot(4.2, Math.max(0.35, Math.min(heightY, 2.8)));
      const actualTheta = Math.atan2(Math.max(0.35, Math.min(heightY, 2.8)), 4.2);
      const midX = 0;
      const midY = -1.13 + (Math.max(0.35, Math.min(heightY, 2.8)) / 2);

      const blockGroup = new THREE.Group();
      blockGroup.position.set(midX, midY, 0);
      blockGroup.rotation.z = -actualTheta;

      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.55, 0.85),
        new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3, metalness: 0.2 })
      );
      block.position.set(0, 0.28, 0);
      blockGroup.add(block);
      rootGroup.add(blockGroup);

      // Vetores físicos aplicados no centro do bloco
      const blockCenter = new THREE.Vector3(
        midX + Math.sin(actualTheta) * 0.28,
        midY + Math.cos(actualTheta) * 0.28,
        0
      );
      const scaleP = 1.6;
      // Peso (vermelho) para baixo
      addVectorArrow(rootGroup, blockCenter, new THREE.Vector3(0, -1, 0), scaleP, 0xef4444);
      // Normal (ciano) perpendicular à rampa
      addVectorArrow(
        rootGroup,
        blockCenter,
        new THREE.Vector3(Math.sin(actualTheta), Math.cos(actualTheta), 0),
        scaleP * Math.cos(actualTheta),
        0x22d3ee
      );
      // Componente Px descendo a rampa (âmbar)
      addVectorArrow(
        rootGroup,
        blockCenter,
        new THREE.Vector3(Math.cos(actualTheta), -Math.sin(actualTheta), 0),
        scaleP * Math.sin(actualTheta),
        0xf59e0b
      );
      // Atrito opondo-se (verde)
      addVectorArrow(
        rootGroup,
        blockCenter,
        new THREE.Vector3(-Math.cos(actualTheta), Math.sin(actualTheta), 0),
        Math.min(0.6, scaleP * Math.sin(actualTheta) * 0.65),
        0x10b981
      );
      void slopeLen;
    } else if (mode === 'em-wave') {
      // Eixo de propagação
      const axis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 7.2, 10),
        new THREE.MeshBasicMaterial({ color: 0x64748b })
      );
      axis.rotation.z = Math.PI / 2;
      rootGroup.add(axis);

      const count = 42;
      const eGeo = new THREE.SphereGeometry(0.065, 10, 10);
      const bGeo = new THREE.SphereGeometry(0.065, 10, 10);
      const eMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 });
      const bMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.4 });

      for (let i = 0; i < count; i++) {
        const x = -3.4 + (i / (count - 1)) * 6.8;
        const eDot = new THREE.Mesh(eGeo, eMat);
        eDot.position.set(x, 0, 0);
        rootGroup.add(eDot);
        emEPoints.push(eDot);

        const bDot = new THREE.Mesh(bGeo, bMat);
        bDot.position.set(x, 0, 0);
        rootGroup.add(bDot);
        emBPoints.push(bDot);
      }
    }

    let animId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let needsRender = true;

    const handleControlChange = () => {
      needsRender = true;
    };
    controls.addEventListener('change', handleControlChange);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      needsRender = true;
    });
    resizeObserver.observe(container);

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlayingRef.current) {
        elapsed += dt;
        if (mode === 'atom') {
          electronRefs.forEach((el) => {
            const ang = el.offset + elapsed * el.speed;
            el.mesh.position.set(Math.cos(ang) * el.radius, 0, Math.sin(ang) * el.radius);
          });
          rootGroup.rotation.y += dt * 0.16;
          needsRender = true;
        } else if (mode === 'molecule') {
          rootGroup.rotation.y += dt * 0.35;
          needsRender = true;
        } else if (mode === 'em-wave') {
          const k = effectiveFreq * 1.4;
          const omega = effectiveFreq * 2.4;
          for (let i = 0; i < emEPoints.length; i++) {
            const x = emEPoints[i].position.x;
            const amp = Math.sin(k * x - omega * elapsed) * 1.15;
            emEPoints[i].position.y = amp;
            emBPoints[i].position.z = amp;
          }
          needsRender = true;
        }
      }

      controls.update();
      if (needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      envTarget.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [mode, activeAtom, activeMol, effectiveAngle, effectiveFreq]);

  const molDetails = MOLECULE_INFO[activeMol];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      <div className="relative">
        {webglError ? (
          <div className={`flex flex-col items-center justify-center p-6 text-center text-slate-200 ${heightClass}`}>
            <p className="text-sm font-medium">Visualização 3D indisponível neste navegador.</p>
            <p className="mt-1 text-xs text-slate-300">
              {mode === 'atom'
                ? `${activeAtom.label} · Camadas: ${activeAtom.shells.join(' - ')}`
                : mode === 'molecule'
                  ? `${molDetails.title} · ${molDetails.geometry}`
                  : mode === 'inclined-plane'
                    ? `Plano inclinado θ = ${effectiveAngle}°`
                    : 'Onda Eletromagnética E ⊥ B'}
            </p>
          </div>
        ) : (
          <div ref={containerRef} className={`w-full ${heightClass}`} />
        )}

        {/* Etiqueta contextual limpa sem pill ou backdrop-blur sobre canvas */}
        <div className="pointer-events-none absolute top-3 left-3 rounded-md bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-slate-100 border border-slate-700/80">
          {mode === 'atom' && (
            <span>
              {activeAtom.label} · Camadas: <span className="font-mono text-teal-300">{activeAtom.shells.join('-')}</span>
            </span>
          )}
          {mode === 'molecule' && (
            <span>
              {molDetails.title} · {molDetails.geometry}
            </span>
          )}
          {mode === 'inclined-plane' && (
            <span>
              θ = <span className="font-mono text-indigo-300">{effectiveAngle}°</span> · Vermelho: Peso · Ciano: Normal · Âmbar: Pₓ · Verde: Atrito
            </span>
          )}
          {mode === 'em-wave' && (
            <span>
              Azul: Campo Elétrico (E) · Vermelho: Campo Magnético (B) · E ⊥ B
            </span>
          )}
        </div>
      </div>

      {/* Dock colapsável inferior sem poluir o viewport */}
      {!hideDock && (
        <div className="border-t border-slate-800 bg-slate-900 px-3 py-2 text-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{isPlaying ? 'Pausar' : 'Animar'}</span>
              </button>
              <span className="text-xs text-slate-300">Arraste para girar · Scroll para zoom</span>
            </div>

            <button
              type="button"
              onClick={() => setDockOpen((o) => !o)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 cursor-pointer"
            >
              <span>Controles 3D</span>
              {dockOpen ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          </div>

          {dockOpen && (
            <div className="mt-2.5 border-t border-slate-800 pt-2.5">
              {mode === 'atom' && !atomicNumber && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {Object.entries(ATOM_PRESETS).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedAtomKey(key)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        selectedAtomKey === key
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {mode === 'molecule' && !moleculeKey && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(['H2O', 'CO2', 'CH4', 'NaCl', 'C2H4', 'C6H6'] as const).map((mk) => (
                      <button
                        key={mk}
                        type="button"
                        onClick={() => setSelectedMol(mk)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                          activeMol === mk
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {mk}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-teal-300">{molDetails.polarity}</span>
                </div>
              )}

              {mode === 'inclined-plane' && (
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Ângulo θ: <strong className="font-mono text-white">{effectiveAngle}°</strong></span>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={effectiveAngle}
                      onChange={(e) => setRampAngle(Number(e.target.value))}
                      className="accent-indigo-500"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setRampAngle(30)}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>30°</span>
                  </button>
                </div>
              )}

              {mode === 'em-wave' && (
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Frequência relativa: <strong className="font-mono text-white">{effectiveFreq.toFixed(1)}×</strong></span>
                    <input
                      type="range"
                      min={0.5}
                      max={2.6}
                      step={0.1}
                      value={effectiveFreq}
                      onChange={(e) => setFreq(Number(e.target.value))}
                      className="accent-indigo-500"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {caption && (
        <div className="border-t border-slate-800 bg-slate-900/95 px-3 py-2 text-xs text-slate-300">
          {caption}
        </div>
      )}
    </div>
  );
}
