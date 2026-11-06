import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  ListFilter,
  Search,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { Cover, coverStyle } from './Cover';
import { ErrorState, Loading } from './States';
import {
  displayDate,
  normalize,
  type PortalProps,
  type SeriesData,
} from './types';
import { useRemote } from './useRemote';

export function SeriesPage({
  slug,
  reader,
  pendingIds,
  navigate,
  toggleSave,
}: Omit<PortalProps, 'series'> & { slug: string }) {
  const remote = useRemote<SeriesData>(`/series/${encodeURIComponent(slug)}`);
  const [ascending, setAscending] = useState(false);
  const [query, setQuery] = useState('');
  if (remote.loading)
    return <Loading label="Abriendo la ficha de la historia…" />;
  if (remote.error || !remote.data)
    return (
      <ErrorState
        error={remote.error}
        navigate={navigate}
        retry={remote.retry}
      />
    );
  const { series, chapters } = remote.data;
  const saved = reader.savedIds.includes(series.id);
  const progress = reader.progress.find((item) => item.seriesId === series.id);
  const displayed = [...chapters]
    .sort((a, b) => (ascending ? a.number - b.number : b.number - a.number))
    .filter((chapter) =>
      normalize(`${chapter.number} ${chapter.title}`).includes(
        normalize(query.trim()),
      ),
    );
  return (
    <article className="series-page">
      <div className="detail-breadcrumb">
        <button onClick={() => navigate({ view: 'catalog' })}>Explorar</button>
        <ChevronRight size={12} />
        <span>{series.title}</span>
      </div>
      <section className="series-detail">
        <div className="detail-backdrop" style={coverStyle(series)} />
        <div className="detail-backdrop-shade" />
        <Cover series={series} className="detail-cover" />
        <div className="detail-main">
          <div className="detail-genres">
            <span className="detail-type">MANHWA</span>
            <span className="detail-status">
              <span
                className={`publication-dot ${series.status === 'Completado' ? 'finished' : ''}`}
              />
              {series.status}
            </span>
          </div>
          <h1>{series.title}</h1>
          <span className="alternative-title">{series.alternativeTitle}</span>
          <div className="detail-rating">
            <span>
              <Star size={17} fill="currentColor" />
              {series.rating.toFixed(1)}
            </span>
            <span>Puntuación editorial</span>
            <i />
            <span>{series.chapterCount} capítulos disponibles</span>
          </div>
          <div className="detail-genres">
            {series.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
          <p className="detail-synopsis">{series.description}</p>
          <div className="detail-metadata">
            <span>
              Historia<strong>{series.author}</strong>
            </span>
            <span>
              Ilustración<strong>{series.artist}</strong>
            </span>
            <span>
              Año<strong>{series.year}</strong>
            </span>
          </div>
          <div className="detail-actions">
            <button
              className="button button-primary"
              onClick={() =>
                navigate({ view: 'read', chapterId: chapters[0].id })
              }
            >
              <BookOpen size={17} />
              Leer primer capítulo
            </button>
            <button
              className={`button button-outline ${saved ? 'saved-button' : ''}`}
              disabled={pendingIds.includes(series.id)}
              onClick={() => {
                void toggleSave(series);
              }}
            >
              {saved ? <Check size={16} /> : <Bookmark size={16} />}{' '}
              {saved ? 'En mi biblioteca' : 'Guardar en mi biblioteca'}
            </button>
            {progress && (
              <button
                className="text-button"
                onClick={() =>
                  navigate({
                    view: 'read',
                    chapterId: progress.chapterId,
                    pageIndex: progress.pageIndex,
                  })
                }
              >
                Continuar leyendo <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="chapters-section">
        <div className="section-heading">
          <div>
            <span className="overline">
              <BookOpen size={12} />
              ELIGE TU PRÓXIMO CAPÍTULO
            </span>
            <h2>
              Capítulos <span className="count-badge">{chapters.length}</span>
            </h2>
          </div>
          <div className="chapter-tools">
            <div className="chapter-search">
              <Search size={14} />
              <input
                aria-label="Buscar capítulo"
                placeholder="Buscar capítulo..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              className="chapter-order"
              onClick={() => setAscending((current) => !current)}
            >
              <ListFilter size={15} />
              {ascending ? 'Desde el inicio' : 'Más recientes'}
            </button>
          </div>
        </div>
        <div className="chapter-list">
          {displayed.map((chapter) => (
            <button
              className={`chapter-row ${progress?.chapterId === chapter.id ? 'chapter-in-progress' : ''}`}
              data-testid="chapter-row"
              key={chapter.id}
              onClick={() => navigate({ view: 'read', chapterId: chapter.id })}
            >
              <span className="chapter-number">
                {String(chapter.number).padStart(2, '0')}
              </span>
              <span className="chapter-row-copy">
                <strong>
                  Capítulo {chapter.number}
                  <span>{chapter.title}</span>
                </strong>
                <small>
                  {chapter.pageCount} páginas{' '}
                  {progress?.chapterId === chapter.id && (
                    <span>· Tu última lectura</span>
                  )}
                </small>
              </span>
              {chapter.number === series.latestChapter && (
                <span className="new-label">NUEVO</span>
              )}
              <span className="chapter-date">
                <Clock3 size={12} />
                {displayDate(chapter.publishedAt)}
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
          {!displayed.length && (
            <p className="no-chapters">
              No encontramos ese capítulo. Prueba otro número o título.
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
