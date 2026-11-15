import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Download,
  FileImage,
  FileUp,
  Images,
  Loader2,
  Maximize2,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { CHEMISTRY_TRACK } from '../data/chemistryTrack';
import { PDF_MAP_PAGES, PDF_MODULES, PdfModuleId } from '../data/pdfMaps';
import { PHYSICS_TRACK } from '../data/physicsTrack';
import { Discipline } from '../types';
import { LightboxMapItem, MapLightboxModal } from './MapLightboxModal';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface VisualMapsViewProps {
  onOpenStage: (discipline: Discipline, stageNumber: number) => void;
}

type ViewMode = 'catalog' | 'extractor';
type DisciplineFilter = 'all' | 'quimica' | 'fisica' | 'misto' | 'geral';

interface ExtractedLocalPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
  format: 'jpeg' | 'png';
  downloadName: string;
}

function parsePageRange(input: string, maxPages: number): number[] {
  const clean = input.trim().toLowerCase();
  if (!clean || clean === 'todas' || clean === 'all') {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  }
  const result = new Set<number>();
  for (const part of clean.split(',')) {
    const token = part.trim();
    if (!token) continue;
    if (token.includes('-')) {
      const [aRaw, bRaw] = token.split('-').map((n) => Number(n.trim()));
      if (!Number.isNaN(aRaw) && !Number.isNaN(bRaw)) {
        const start = Math.max(1, Math.min(aRaw, bRaw));
        const end = Math.min(maxPages, Math.max(aRaw, bRaw));
        for (let p = start; p <= end; p++) result.add(p);
      }
    } else {
      const n = Number(token);
      if (!Number.isNaN(n) && n >= 1 && n <= maxPages) {
        result.add(n);
      }
    }
  }
  const sorted = Array.from(result).sort((a, b) => a - b);
  return sorted.length > 0 ? sorted : Array.from({ length: Math.min(maxPages, 20) }, (_, i) => i + 1);
}

export function VisualMapsView({ onOpenStage }: VisualMapsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');

  // Filtros do acervo já extraído (119 páginas)
  const [discFilter, setDiscFilter] = useState<DisciplineFilter>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | PdfModuleId>('all');
  const [stageFilter, setStageFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Estado do extrator local de PDF -> Imagens (pdfjs-dist no navegador)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState<string>('1-15');
  const [extractScale, setExtractScale] = useState<1.5 | 2>(1.5);
  const [extractFormat, setExtractFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractProgress, setExtractProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractedPages, setExtractedPages] = useState<ExtractedLocalPage[]>([]);
  const [localLightboxIdx, setLocalLightboxIdx] = useState<number | null>(null);

  const cancelExtractRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Limpa URLs de blob quando páginas extraídas são substituídas ou componente desmonta
  const extractedRef = useRef<ExtractedLocalPage[]>([]);
  extractedRef.current = extractedPages;
  useEffect(() => {
    return () => {
      extractedRef.current.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    };
  }, []);

  const filteredMaps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PDF_MAP_PAGES.filter((page) => {
      if (moduleFilter !== 'all' && page.moduleId !== moduleFilter) return false;
      if (discFilter !== 'all') {
        if (discFilter === 'quimica') {
          const isChem =
            page.disciplineFocus === 'quimica' ||
            page.disciplineFocus === 'misto' ||
            page.stageLinks.some((l) => l.discipline === 'quimica');
          if (!isChem) return false;
        } else if (discFilter === 'fisica') {
          const isPhys =
            page.disciplineFocus === 'fisica' ||
            page.disciplineFocus === 'misto' ||
            page.stageLinks.some((l) => l.discipline === 'fisica');
          if (!isPhys) return false;
        } else if (page.disciplineFocus !== discFilter) {
          return false;
        }
      }
      if (stageFilter !== 'all') {
        const targetDisc: Discipline | null =
          discFilter === 'quimica' ? 'quimica' : discFilter === 'fisica' ? 'fisica' : null;
        const matchesStage = page.stageLinks.some(
          (l) => l.stageNumber === stageFilter && (!targetDisc || l.discipline === targetDisc)
        );
        if (!matchesStage) return false;
      }
      if (q) {
        const pageStr = String(page.pageNumber);
        const hay = `${pageStr} ${page.title} ${page.subtitle} ${page.moduleCode} ${page.moduleTitle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [discFilter, moduleFilter, stageFilter, searchQuery]);

  const lightboxItems: LightboxMapItem[] = useMemo(
    () =>
      filteredMaps.map((m) => ({
        id: `pdf-page-${m.pageNumber}`,
        pageNumber: m.pageNumber,
        title: m.title,
        subtitle: m.subtitle,
        moduleLabel: `${m.moduleCode} · ${m.moduleTitle}`,
        imageUrl: m.imageUrl,
        downloadName: `petrolab-mapa-p${String(m.pageNumber).padStart(3, '0')}.jpg`,
        stageLinks: m.stageLinks,
      })),
    [filteredMaps]
  );

  const localLightboxItems: LightboxMapItem[] = useMemo(
    () =>
      extractedPages.map((p) => ({
        id: p.id,
        pageNumber: p.pageNumber,
        title: `${selectedFile?.name ?? 'Documento PDF'} — Página ${p.pageNumber}`,
        subtitle: `Extraída localmente no navegador (${p.width} × ${p.height} px · ${p.format.toUpperCase()})`,
        moduleLabel: 'Extração local de PDF',
        imageUrl: p.imageUrl,
        downloadName: p.downloadName,
      })),
    [extractedPages, selectedFile]
  );

  const handleSelectPdfFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractError(null);
    extractedPages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    setExtractedPages([]);
    setSelectedFile(file);
    setPdfPageCount(null);

    try {
      const buf = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buf });
      const doc = await loadingTask.promise;
      setPdfPageCount(doc.numPages);
      setRangeInput(doc.numPages <= 20 ? `1-${doc.numPages}` : '1-15');
      await loadingTask.destroy();
    } catch {
      setExtractError('Não foi possível ler este arquivo PDF. Verifique se não está corrompido ou protegido por senha.');
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedFile || isExtracting) return;
    setExtractError(null);
    cancelExtractRef.current = false;
    extractedPages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    setExtractedPages([]);
    setIsExtracting(true);

    try {
      const buf = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buf });
      const doc = await loadingTask.promise;
      const pagesToRender = parsePageRange(rangeInput, doc.numPages);
      setPdfPageCount(doc.numPages);
      setExtractProgress({ done: 0, total: pagesToRender.length });

      const baseName = selectedFile.name.replace(/\.pdf$/i, '').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'documento';
      const mimeType = extractFormat === 'png' ? 'image/png' : 'image/jpeg';

      for (let i = 0; i < pagesToRender.length; i++) {
        if (cancelExtractRef.current) break;
        const pageNum = pagesToRender[i];
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: extractScale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), mimeType, extractFormat === 'jpeg' ? 0.86 : undefined)
        );
        if (blob) {
          const url = URL.createObjectURL(blob);
          const padded = String(pageNum).padStart(3, '0');
          setExtractedPages((prev) => [
            ...prev,
            {
              id: `local-${pageNum}-${Date.now()}`,
              pageNumber: pageNum,
              imageUrl: url,
              width: canvas.width,
              height: canvas.height,
              format: extractFormat,
              downloadName: `${baseName}-pagina-${padded}.${extractFormat === 'png' ? 'png' : 'jpg'}`,
            },
          ]);
        }

        page.cleanup();
        setExtractProgress({ done: i + 1, total: pagesToRender.length });
      }

      await doc.cleanup();
      await loadingTask.destroy();
    } catch {
      setExtractError('Falha ao converter as páginas do PDF em imagens.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClearLocal = () => {
    cancelExtractRef.current = true;
    extractedPages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    setExtractedPages([]);
    setSelectedFile(null);
    setPdfPageCount(null);
    setExtractError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadAllExtracted = () => {
    extractedPages.forEach((page, idx) => {
      window.setTimeout(() => {
        const a = document.createElement('a');
        a.href = page.imageUrl;
        a.download = page.downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 140);
    });
  };

  return (
    <div className="space-y-6 animate-view-enter">
      {/* Cabeçalho e seletor de modo */}
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              Leitura Visual & Extração de Imagens
            </p>
            <h2 className="type-page-title mt-1">
              Mapas Visuais do PDF ({PDF_MAP_PAGES.length} páginas) & Extrator Local
            </h2>
            <p className="type-body mt-1.5">
              As {PDF_MAP_PAGES.length} páginas técnicas e de revisão do arquivo enviado (
              <em>mapas-completo.pdf</em>) — mantendo Introdução, Módulos 03 a 10 e Revisão Final — já
              estão em imagens nítidas para consulta com zoom, download e vínculo direto com Química e
              Física. Você também pode abrir outro PDF localmente para extrair novas imagens.
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1 shrink-0"
            role="tablist"
            aria-label="Modo dos Mapas Visuais"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'catalog'}
              onClick={() => setViewMode('catalog')}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'catalog'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Images className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Acervo do PDF ({PDF_MAP_PAGES.length} mapas)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'extractor'}
              onClick={() => setViewMode('extractor')}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'extractor'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <FileUp className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
              <span>Extrair outro PDF</span>
            </button>
          </div>
        </div>
      </section>

      {viewMode === 'catalog' ? (
        <>
          {/* Barra de filtros e busca */}
          <section className="surface-card p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-5 relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por página (ex: 89) ou tema (ex: Refino, Estequiometria, Fluidos)..."
                  className="input-control pl-9"
                  aria-label="Buscar mapas visuais por página ou assunto"
                />
              </div>

              <div className="lg:col-span-4 flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: 'Todos' },
                    { id: 'quimica', label: 'Química' },
                    { id: 'fisica', label: 'Física' },
                    { id: 'misto', label: 'Interdisciplinares' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDiscFilter(d.id);
                      setStageFilter('all');
                      if (d.id !== 'all') setModuleFilter('all');
                    }}
                    className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      discFilter === d.id
                        ? d.id === 'fisica'
                          ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white'
                          : 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="lg:col-span-3 flex items-center gap-2">
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value as 'all' | PdfModuleId)}
                  className="input-control"
                  aria-label="Filtrar por módulo do PDF"
                >
                  <option value="all">Todos os módulos (p. 1–3 e 42–119)</option>
                  {PDF_MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code}: {m.title} ({m.pageRange})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(discFilter === 'quimica' || discFilter === 'fisica') && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--color-border)] pt-3">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] mr-1">
                  Filtrar por etapa da trilha:
                </span>
                <button
                  type="button"
                  onClick={() => setStageFilter('all')}
                  className={`min-h-8 rounded-md border px-2.5 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    stageFilter === 'all'
                      ? 'border-[var(--color-text)] bg-[var(--color-text)] text-white'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  Todas
                </button>
                {(discFilter === 'quimica' ? CHEMISTRY_TRACK : PHYSICS_TRACK).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStageFilter(st.stageNumber)}
                    className={`min-h-8 rounded-md border px-2.5 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      stageFilter === st.stageNumber
                        ? discFilter === 'quimica'
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    Etapa {st.stageNumber}: {st.title}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3">
              <span className="tabular-nums">
                Exibindo <strong className="text-[var(--color-text)]">{filteredMaps.length}</strong>{' '}
                de {PDF_MAP_PAGES.length} mapas extraídos
              </span>
              {(discFilter !== 'all' || moduleFilter !== 'all' || stageFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setDiscFilter('all');
                    setModuleFilter('all');
                    setStageFilter('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Limpar filtros</span>
                </button>
              )}
            </div>
          </section>

          {/* Grade de imagens */}
          {filteredMaps.length === 0 ? (
            <section className="surface-card p-10 text-center space-y-2">
              <p className="font-display text-base font-semibold text-[var(--color-text)]">
                Nenhum mapa encontrado para o filtro atual
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Tente buscar por outro termo ou número de página (1–3 ou 42–119).
              </p>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMaps.map((map, idx) => (
                <article
                  key={map.pageNumber}
                  className="surface-card overflow-hidden flex flex-col justify-between transition hover:border-[var(--color-border-strong)]"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(idx)}
                    className="group relative block w-full bg-slate-100 text-left cursor-pointer focus-visible:outline-offset-[-2px]"
                    aria-label={`Ampliar página ${map.pageNumber}: ${map.title}`}
                  >
                    <div className="aspect-[1520/1075] w-full overflow-hidden bg-slate-100">
                      <img
                        src={map.imageUrl}
                        alt={`${map.title} — Página ${map.pageNumber}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white opacity-95 group-hover:bg-slate-900">
                      <Maximize2 className="h-3 w-3" aria-hidden="true" />
                      <span>Ampliar</span>
                    </div>
                  </button>

                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] tabular-nums">
                        <span className="font-mono font-semibold text-[var(--color-text)]">
                          p. {String(map.pageNumber).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{map.moduleCode} · {map.moduleTitle}</span>
                      </div>
                      <h3 className="mt-1 font-display text-sm font-semibold text-[var(--color-text)] leading-snug">
                        {map.title}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                        {map.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {map.stageLinks.map((link) => (
                          <button
                            key={`${link.discipline}-${link.stageNumber}`}
                            type="button"
                            onClick={() => onOpenStage(link.discipline, link.stageNumber)}
                            className={`inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer ${
                              link.discipline === 'quimica'
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-secondary)]'
                            }`}
                          >
                            <span>
                              {link.discipline === 'quimica' ? 'Química' : 'Física'} E{link.stageNumber}
                            </span>
                            <ArrowRight className="h-3 w-3" aria-hidden="true" />
                          </button>
                        ))}
                      </div>

                      <a
                        href={map.imageUrl}
                        download={`petrolab-mapa-p${String(map.pageNumber).padStart(3, '0')}.jpg`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] ml-auto"
                        title={`Baixar página ${map.pageNumber} em JPEG`}
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>JPG</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      ) : (
        /* Modo 2: Leitor / Extrator de qualquer PDF localmente no navegador */
        <section className="space-y-5">
          <div className="surface-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="type-section-title flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>Converter qualquer PDF em imagens direto no navegador</span>
                </h3>
                <p className="type-body mt-1">
                  Selecione um arquivo PDF do seu computador (como uma apostila, prova CESGRANRIO ou
                  novo caderno de mapas). A leitura acontece 100% no seu dispositivo e retorna as
                  páginas em imagem para visualização com zoom e download.
                </p>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClearLocal}
                  className="btn-secondary"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>Limpar arquivo</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] p-4 text-center transition hover:border-[var(--color-secondary)]">
                  <FileUp className="h-7 w-7 text-[var(--color-secondary)] mb-2" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {selectedFile ? selectedFile.name : 'Clique para escolher um PDF'}
                  </span>
                  <span className="mt-1 text-xs text-[var(--color-text-muted)] tabular-nums">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · ${
                          pdfPageCount ? `${pdfPageCount} páginas detectadas` : 'lendo estrutura...'
                        }`
                      : 'Processamento local e privado (sem envio externo)'}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleSelectPdfFile}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="lg:col-span-7 surface-inset p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="block text-xs">
                    <span className="font-semibold text-[var(--color-text-secondary)]">
                      Páginas (ex: 1-10, 53, 89)
                    </span>
                    <input
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="1-15 ou todas"
                      className="input-control mt-1"
                      disabled={isExtracting}
                    />
                  </label>

                  <label className="block text-xs">
                    <span className="font-semibold text-[var(--color-text-secondary)]">
                      Nitidez da imagem
                    </span>
                    <select
                      value={extractScale}
                      onChange={(e) => setExtractScale(Number(e.target.value) as 1.5 | 2)}
                      className="input-control mt-1"
                      disabled={isExtracting}
                    >
                      <option value={1.5}>1,5× Padrão (rápido)</option>
                      <option value={2}>2,0× Alta nitidez</option>
                    </select>
                  </label>

                  <label className="block text-xs">
                    <span className="font-semibold text-[var(--color-text-secondary)]">
                      Formato de saída
                    </span>
                    <select
                      value={extractFormat}
                      onChange={(e) => setExtractFormat(e.target.value as 'jpeg' | 'png')}
                      className="input-control mt-1"
                      disabled={isExtracting}
                    >
                      <option value="jpeg">JPEG (leve para mapas)</option>
                      <option value="png">PNG (sem perdas)</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStartExtraction}
                      disabled={!selectedFile || isExtracting}
                      className="btn-physics"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span className="tabular-nums">
                            Extraindo {extractProgress.done}/{extractProgress.total}...
                          </span>
                        </>
                      ) : (
                        <>
                          <Images className="h-4 w-4" aria-hidden="true" />
                          <span>Gerar imagens das páginas</span>
                        </>
                      )}
                    </button>

                    {isExtracting && (
                      <button
                        type="button"
                        onClick={() => {
                          cancelExtractRef.current = true;
                        }}
                        className="btn-secondary"
                      >
                        Interromper
                      </button>
                    )}
                  </div>

                  {extractedPages.length > 0 && !isExtracting && (
                    <button
                      type="button"
                      onClick={handleDownloadAllExtracted}
                      className="btn-secondary"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span>Baixar todas ({extractedPages.length})</span>
                    </button>
                  )}
                </div>

                {extractError && (
                  <p className="text-xs font-medium text-[var(--color-error)]">{extractError}</p>
                )}
              </div>
            </div>
          </div>

          {extractedPages.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {extractedPages.map((p, idx) => (
                <article key={p.id} className="surface-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLocalLightboxIdx(idx)}
                    className="group relative block w-full bg-slate-100 cursor-pointer"
                    aria-label={`Ampliar página ${p.pageNumber}`}
                  >
                    <div className="aspect-[1520/1075] w-full overflow-hidden bg-slate-100">
                      <img
                        src={p.imageUrl}
                        alt={`Página ${p.pageNumber} extraída do PDF`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain bg-white transition duration-200 group-hover:scale-[1.02]"
                      />
                    </div>
                  </button>
                  <div className="flex items-center justify-between gap-2 p-3 text-xs">
                    <span className="font-mono font-semibold text-[var(--color-text)] tabular-nums">
                      Página {p.pageNumber} · {p.width}×{p.height}
                    </span>
                    <a
                      href={p.imageUrl}
                      download={p.downloadName}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--color-secondary)] hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Baixar</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Lightbox com zoom para o acervo de 119 mapas */}
      {lightboxIdx !== null && (
        <MapLightboxModal
          items={lightboxItems}
          currentIndex={lightboxIdx}
          onChangeIndex={setLightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onOpenStage={onOpenStage}
        />
      )}

      {/* Lightbox com zoom para páginas extraídas localmente */}
      {localLightboxIdx !== null && (
        <MapLightboxModal
          items={localLightboxItems}
          currentIndex={localLightboxIdx}
          onChangeIndex={setLocalLightboxIdx}
          onClose={() => setLocalLightboxIdx(null)}
        />
      )}
    </div>
  );
}
