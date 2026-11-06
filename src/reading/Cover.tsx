import { ArrowUpRight, Bookmark, Check, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Series } from './types';

export function coverStyle(series: Series): CSSProperties {
  return {
    backgroundImage: 'url(/art/covers.png)',
    backgroundSize: '300% 200%',
    backgroundPosition: `${(series.coverIndex % 3) * 50}% ${Math.floor(series.coverIndex / 3) * 100}%`,
  };
}
export function Cover({
  series,
  className = '',
}: {
  series: Series;
  className?: string;
}) {
  return (
    <div
      className={`cover-art ${className}`}
      style={coverStyle(series)}
      role="img"
      aria-label={`Portada de ${series.title}`}
    />
  );
}
export function SeriesCard({
  series,
  saved,
  pending,
  onOpen,
  onToggle,
}: {
  series: Series;
  saved: boolean;
  pending: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <article className="series-card" data-testid="series-card">
      <div className="series-art-wrap">
        <button
          className="cover-open"
          onClick={onOpen}
          aria-label={`Ver ${series.title}`}
        >
          <Cover series={series} />
          <span className="cover-shade" />
          <span className="cover-read">
            <ArrowUpRight size={24} />
          </span>
        </button>
        <span className="type-badge">{series.type}</span>
        <span className="cover-rating" title="Puntuación editorial">
          <Star size={11} fill="currentColor" />
          {series.rating.toFixed(1)}
        </span>
        <button
          className={`save-cover ${saved ? 'is-saved' : ''}`}
          disabled={pending}
          onClick={onToggle}
          aria-label={
            saved
              ? `Quitar ${series.title} de mi biblioteca`
              : `Guardar ${series.title} en mi biblioteca`
          }
        >
          {saved ? <Check size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
      <button className="series-title" onClick={onOpen}>
        <h3>{series.title}</h3>
      </button>
      <p className="series-genres">{series.genres.join(' · ')}</p>
      <div className="series-card-bottom">
        <span
          className={`publication-dot ${series.status === 'Completado' ? 'finished' : ''}`}
        />
        {series.status}
        <span>Cap. {series.latestChapter}</span>
      </div>
    </article>
  );
}
