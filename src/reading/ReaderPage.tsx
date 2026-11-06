import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudOff,
  LoaderCircle,
  Save,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ErrorState, Loading } from './States';
import type { ChapterData, Navigate, SeriesData } from './types';
import { useRemote } from './useRemote';

export function ReaderPage({
  chapterId,
  resumePage,
  navigate,
  onProgress,
}: {
  chapterId: string;
  resumePage?: number;
  navigate: Navigate;
  onProgress: (
    seriesId: string,
    chapterId: string,
    pageIndex: number,
  ) => Promise<void>;
}) {
  const remote = useRemote<ChapterData>(
    `/chapters/${encodeURIComponent(chapterId)}`,
  );
  const seriesRemote = useRemote<SeriesData>(
    remote.data ? `/series/${remote.data.series.slug}` : null,
  );
  const [width, setWidth] = useState(() => {
    try {
      return localStorage.getItem('yv-reader-width') || 'comfortable';
    } catch {
      return 'comfortable';
    }
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>(
    'saving',
  );
  const pages = useRef<(HTMLElement | null)[]>([]);
  const latestPage = useRef(-1);
  const chapter = remote.data;

  useEffect(() => {
    try {
      localStorage.setItem('yv-reader-width', width);
    } catch {
      /* Reading still works when storage is unavailable. */
    }
  }, [width]);
  useEffect(() => {
    if (!chapter) return;
    let active = true;
    latestPage.current = -1;
    const ratios = new Map<number, number>();
    const queueSave = (index: number) => {
      if (index === latestPage.current) return;
      latestPage.current = index;
      setPageIndex(index);
      setSaveStatus('saving');
      void onProgress(chapter.series.id, chapter.chapter.id, index).then(
        () => {
          if (active && latestPage.current === index) setSaveStatus('saved');
        },
        () => {
          if (active && latestPage.current === index) setSaveStatus('error');
        },
      );
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!active) return;
        for (const entry of entries)
          ratios.set(
            Number((entry.target as HTMLElement).dataset.page),
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        const visible = [...ratios.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1] || b[0] - a[0]);
        if (visible.length) queueSave(visible[0][0]);
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );
    const frame = requestAnimationFrame(() => {
      const start = Math.max(
        0,
        Math.min(resumePage ?? 0, chapter.pages.length - 1),
      );
      if (start > 0) pages.current[start]?.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
      pages.current.forEach((element) => {
        if (element) observer.observe(element);
      });
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [chapter, resumePage, onProgress]);
  useEffect(() => {
    if (!chapter) return;
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input,select,textarea'))
        return;
      if (event.key === 'ArrowRight' && chapter.nextChapterId) {
        event.preventDefault();
        navigate({ view: 'read', chapterId: chapter.nextChapterId });
      }
      if (event.key === 'ArrowLeft' && chapter.previousChapterId) {
        event.preventDefault();
        navigate({ view: 'read', chapterId: chapter.previousChapterId });
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [chapter, navigate]);
  if (remote.loading) return <Loading label="Preparando tu capítulo…" />;
  if (remote.error || !chapter)
    return (
      <ErrorState
        error={remote.error}
        navigate={navigate}
        retry={remote.retry}
      />
    );
  const previous = () => {
    if (chapter.previousChapterId)
      navigate({ view: 'read', chapterId: chapter.previousChapterId });
  };
  const next = () => {
    if (chapter.nextChapterId)
      navigate({ view: 'read', chapterId: chapter.nextChapterId });
  };
  async function saveCurrentPage() {
    setSaveStatus('saving');
    try {
      await onProgress(chapter!.series.id, chapter!.chapter.id, pageIndex);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }
  return (
    <div className={`reader-view reader-width-${width}`}>
      <header className="reader-topbar">
        <button
          className="reader-back"
          aria-label="Volver a la serie"
          onClick={() =>
            navigate({ view: 'series', slug: chapter.series.slug })
          }
        >
          <ArrowLeft size={18} />
          <span>{chapter.series.title}</span>
        </button>
        <div className="reader-chapter-controls">
          <button
            className="icon-button"
            aria-label="Capítulo anterior"
            disabled={!chapter.previousChapterId}
            onClick={previous}
          >
            <ChevronLeft size={21} />
          </button>
          <select
            aria-label="Seleccionar capítulo"
            value={chapter.chapter.id}
            onChange={(event) =>
              navigate({ view: 'read', chapterId: event.target.value })
            }
          >
            {(seriesRemote.data?.chapters || [chapter.chapter]).map((item) => (
              <option key={item.id} value={item.id}>
                Capítulo {item.number}
              </option>
            ))}
          </select>
          <button
            className="icon-button"
            aria-label="Siguiente capítulo"
            disabled={!chapter.nextChapterId}
            onClick={next}
          >
            <ChevronRight size={21} />
          </button>
        </div>
        <button
          className="reader-library-link"
          onClick={() => navigate({ view: 'library' })}
        >
          <BookOpen size={17} />
          <span>Mi biblioteca</span>
        </button>
      </header>
      <div className="reader-intro">
        <span className="overline">{chapter.series.title}</span>
        <h1>Capítulo {chapter.chapter.number}</h1>
        <p>{chapter.chapter.title}</p>
        <span className="reader-sample">Historia original de muestra</span>
      </div>
      <div className="reader-options">
        <span>
          {chapter.pages.length} páginas <span>·</span> Lectura vertical
        </span>
        <label>
          Ancho de lectura
          <select
            aria-label="Ancho de lectura"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
          >
            <option value="comfortable">Cómodo</option>
            <option value="wide">Amplio</option>
            <option value="full">Completo</option>
          </select>
        </label>
      </div>
      <div className="comic-pages">
        {chapter.pages.map((page, index) => (
          <section
            key={page.url}
            ref={(element) => {
              pages.current[index] = element;
            }}
            className="comic-page"
            data-testid="reader-page"
            data-page={index}
            aria-label={`Página ${index + 1}`}
          >
            <img
              src={page.url}
              alt={page.alt}
              width={page.width}
              height={page.height}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </section>
        ))}
      </div>
      <div className="reader-end">
        <span className="chapter-end-symbol">✦</span>
        <span className="overline">HASTA AQUÍ, ESTE CAPÍTULO</span>
        <h2>
          {chapter.nextChapterId
            ? '¿Solo un capítulo más?'
            : 'La historia continúa en tu imaginación.'}
        </h2>
        <p>
          {chapter.nextChapterId
            ? 'Todavía queda mucho por descubrir al otro lado.'
            : 'Has llegado al último capítulo disponible de esta historia de muestra.'}
        </p>
        <div>
          <button
            className="button button-outline"
            disabled={!chapter.previousChapterId}
            onClick={previous}
          >
            <ArrowLeft size={16} />
            Anterior
          </button>
          {chapter.nextChapterId ? (
            <button className="button button-primary" onClick={next}>
              Leer siguiente capítulo <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="button button-primary"
              onClick={() =>
                navigate({ view: 'series', slug: chapter.series.slug })
              }
            >
              Volver a la historia <ArrowRight size={16} />
            </button>
          )}
        </div>
        <button className="text-button" onClick={saveCurrentPage}>
          <Save size={14} />
          Guardar este punto de lectura
        </button>
      </div>
      <div className={`reader-progress-bar save-${saveStatus}`}>
        <span>
          Página {pageIndex + 1} de {chapter.pages.length}
        </span>
        <span>
          {saveStatus === 'saving' ? (
            <>
              <LoaderCircle size={12} className="spin" />
              Guardando lectura…
            </>
          ) : saveStatus === 'error' ? (
            <>
              <CloudOff size={13} />
              No se pudo guardar
            </>
          ) : (
            <>
              <Check size={13} />
              Lectura guardada
            </>
          )}
        </span>
      </div>
    </div>
  );
}
