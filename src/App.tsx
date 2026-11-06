import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CircleAlert, X } from 'lucide-react';
import { request } from './api';
import { Brand, Header } from './reading/Header';
import { HomePage } from './reading/HomePage';
import { CatalogPage } from './reading/CatalogPage';
import { LibraryPage } from './reading/LibraryPage';
import { SeriesPage } from './reading/SeriesPage';
import { ReaderPage } from './reading/ReaderPage';
import { ErrorState, Loading } from './reading/States';
import type {
  Catalog,
  ReaderState,
  ReadingProgress,
  Route,
  Series,
} from './reading/types';

function readRoute(): Route {
  try {
    const [path, query] = window.location.hash.replace(/^#\/?/, '').split('?');
    const [view, parameter] = path.split('/');
    const value = parameter ? decodeURIComponent(parameter) : '';
    if (view === 'serie' && /^[a-z0-9-]+$/.test(value))
      return { view: 'series', slug: value };
    if (view === 'leer' && /^[a-z0-9-]+$/.test(value)) {
      const page = Number(new URLSearchParams(query).get('pagina') || '1');
      return {
        view: 'read',
        chapterId: value,
        pageIndex: Number.isInteger(page) && page > 0 ? page - 1 : 0,
      };
    }
    if (view === 'catalogo') return { view: 'catalog' };
    if (view === 'biblioteca') return { view: 'library' };
  } catch {
    /* A malformed external link falls back to the home page. */
  }
  return { view: 'home' };
}
let readerInitialization: Promise<ReaderState> | undefined;
function initializeReader() {
  // Share the first cookie-setting request across React's development remount.
  if (!readerInitialization)
    readerInitialization = request<ReaderState>('/reader').finally(() => {
      readerInitialization = undefined;
    });
  return readerInitialization;
}

export function App() {
  const [route, setRoute] = useState<Route>(readRoute);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [reader, setReader] = useState<ReaderState>({
    savedIds: [],
    progress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState({
    query: '',
    genre: 'Todos',
    status: 'Todos',
    sort: 'recent',
  });
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const pending = useRef(new Set<string>());
  const progressWrites = useRef<Promise<void>>(Promise.resolve());
  const [toast, setToast] = useState<{
    message: string;
    error?: boolean;
  } | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([request<Catalog>('/catalog'), initializeReader()])
      .then(([nextCatalog, nextReader]) => {
        if (active) {
          setCatalog(nextCatalog);
          setReader(nextReader);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (active) {
          setError(error.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const selected =
      route.view === 'series'
        ? catalog?.series.find((item) => item.slug === route.slug)
        : null;
    document.title = selected
      ? `${selected.title} — YitVerse`
      : 'YitVerse — Tu universo de manhwas';
  }, [route, catalog]);
  const navigate = useCallback((next: Route) => {
    const path =
      next.view === 'series'
        ? `serie/${encodeURIComponent(next.slug)}`
        : next.view === 'read'
          ? `leer/${encodeURIComponent(next.chapterId)}${next.pageIndex ? `?pagina=${next.pageIndex + 1}` : ''}`
          : next.view === 'catalog'
            ? 'catalogo'
            : next.view === 'library'
              ? 'biblioteca'
              : 'inicio';
    setRoute(next);
    window.location.hash = `/${path}`;
    window.scrollTo(0, 0);
  }, []);
  async function toggleSave(story: Series) {
    if (pending.current.has(story.id)) return;
    const wasSaved = reader.savedIds.includes(story.id);
    pending.current.add(story.id);
    setPendingIds([...pending.current]);
    try {
      await request(`/reader/library/${story.id}`, wasSaved ? 'DELETE' : 'PUT');
      setReader((current) => ({
        ...current,
        savedIds: wasSaved
          ? current.savedIds.filter((id) => id !== story.id)
          : [...new Set([...current.savedIds, story.id])],
      }));
      setToast({
        message: wasSaved
          ? 'Historia retirada de tu biblioteca'
          : 'Una nueva historia en tu biblioteca',
      });
    } catch (error) {
      setToast({ message: (error as Error).message, error: true });
    } finally {
      pending.current.delete(story.id);
      setPendingIds([...pending.current]);
    }
  }
  const saveProgress = useCallback(
    (seriesId: string, chapterId: string, pageIndex: number): Promise<void> => {
      const write = progressWrites.current
        .catch(() => {})
        .then(async () => {
          try {
            const progress = await request<ReadingProgress>(
              `/reader/progress/${seriesId}`,
              'PATCH',
              { chapterId, pageIndex },
            );
            setReader((current) => ({
              ...current,
              progress: [
                ...current.progress.filter(
                  (item) => item.seriesId !== seriesId,
                ),
                progress,
              ],
            }));
          } catch (error) {
            setToast({ message: (error as Error).message, error: true });
            throw error;
          }
        });
      progressWrites.current = write;
      return write;
    },
    [],
  );
  const chooseGenre = (genre: string) => {
    setFilters({ query: '', genre, status: 'Todos', sort: 'recent' });
    navigate({ view: 'catalog' });
  };
  const portal = {
    series: catalog?.series || [],
    reader,
    pendingIds,
    navigate,
    toggleSave,
  };
  const isReading = route.view === 'read';
  return (
    <div className={`portal ${isReading ? 'reading-mode' : ''}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      {!isReading && (
        <Header
          route={route}
          navigate={navigate}
          query={filters.query}
          setQuery={(query) => setFilters((current) => ({ ...current, query }))}
        />
      )}
      <main
        id="main-content"
        tabIndex={-1}
        className={isReading ? 'reader-main' : 'site-main'}
      >
        {loading ? (
          <Loading />
        ) : error || !catalog ? (
          <ErrorState
            error={error}
            navigate={navigate}
            retry={() => setAttempt((current) => current + 1)}
          />
        ) : route.view === 'home' ? (
          <HomePage {...portal} chooseGenre={chooseGenre} />
        ) : route.view === 'catalog' ? (
          <CatalogPage
            {...portal}
            genres={catalog.genres}
            filters={filters}
            setFilters={setFilters}
          />
        ) : route.view === 'library' ? (
          <LibraryPage {...portal} />
        ) : route.view === 'series' ? (
          <SeriesPage slug={route.slug} {...portal} />
        ) : (
          <ReaderPage
            chapterId={route.chapterId}
            resumePage={route.pageIndex}
            navigate={navigate}
            onProgress={saveProgress}
          />
        )}
      </main>
      {!isReading && (
        <footer className="site-footer">
          <div className="footer-main">
            <button
              className="brand-button"
              aria-label="YitVerse, volver al inicio"
              onClick={() => navigate({ view: 'home' })}
            >
              <Brand />
            </button>
            <p>
              Historias nuevas. Mundos infinitos.
              <br />
              Tu próximo capítulo te está esperando.
            </p>
            <div>
              <a href="#/inicio">Inicio</a>
              <a href="#/catalogo">Catálogo</a>
              <a href="#/biblioteca">
                Mi biblioteca <ArrowRight size={12} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} YitVerse. Un universo por leer.
            </span>
            <span>Historias e ilustraciones originales de muestra.</span>
            <span>
              Hecho para quienes aman las buenas historias <span>✦</span>
            </span>
          </div>
        </footer>
      )}
      {toast && (
        <div
          className={`toast ${toast.error ? 'toast-error' : ''}`}
          role={toast.error ? 'alert' : 'status'}
        >
          {toast.error ? <CircleAlert size={18} /> : <Check size={18} />}
          <span>{toast.message}</span>
          <button
            className="icon-button"
            aria-label="Cerrar aviso"
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
