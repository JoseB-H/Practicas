import { ArrowRight, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { SeriesCard } from './Cover';
import { EmptyState } from './States';
import { normalize, type PortalProps } from './types';

type Filters = { query: string; genre: string; status: string; sort: string };
export function CatalogPage({
  series,
  reader,
  pendingIds,
  navigate,
  toggleSave,
  genres,
  filters,
  setFilters,
}: PortalProps & {
  genres: string[];
  filters: Filters;
  setFilters: (value: Filters) => void;
}) {
  const filtered = series
    .filter(
      (item) =>
        (!filters.query.trim() ||
          normalize(
            `${item.title} ${item.alternativeTitle} ${item.description}`,
          ).includes(normalize(filters.query.trim()))) &&
        (filters.genre === 'Todos' || item.genres.includes(filters.genre)) &&
        (filters.status === 'Todos' || item.status === filters.status),
    )
    .sort((a, b) =>
      filters.sort === 'rating'
        ? b.rating - a.rating
        : filters.sort === 'title'
          ? a.title.localeCompare(b.title, 'es')
          : b.updatedAt.localeCompare(a.updatedAt),
    );
  return (
    <section className="catalog-page">
      <div className="page-intro">
        <span className="overline">ENCUENTRA TU PRÓXIMA OBSESIÓN</span>
        <h1>
          Todo un universo por descubrir<span>.</span>
        </h1>
        <p>
          Del primer encuentro al último giro. Hay una historia esperando por
          ti.
        </p>
      </div>
      <div className="catalog-tools">
        <div>
          <SlidersHorizontal size={16} />
          <span>Explora a tu manera</span>
        </div>
        <div className="catalog-selects">
          <label>
            Estado
            <select
              aria-label="Estado de publicación"
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value })
              }
            >
              <option>Todos</option>
              <option>En emisión</option>
              <option>Completado</option>
            </select>
          </label>
          <label>
            Ordenar por
            <select
              aria-label="Ordenar por"
              value={filters.sort}
              onChange={(event) =>
                setFilters({ ...filters, sort: event.target.value })
              }
            >
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor puntuación</option>
              <option value="title">Nombre A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <div className="genre-filter" aria-label="Filtrar por género">
        {['Todos', ...genres].map((genre) => (
          <button
            key={genre}
            className={filters.genre === genre ? 'selected' : ''}
            aria-pressed={filters.genre === genre}
            onClick={() => setFilters({ ...filters, genre })}
          >
            {genre === 'Todos' && <Filter size={12} />} {genre}
          </button>
        ))}
      </div>
      <div className="results-caption">
        <span>
          <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'historia' : 'historias'} por descubrir
        </span>
        {filters.query && <span>Resultados para “{filters.query}”</span>}
      </div>
      {filtered.length ? (
        <div className="series-grid catalog-series-grid">
          {filtered.map((item) => (
            <SeriesCard
              key={item.id}
              series={item}
              saved={reader.savedIds.includes(item.id)}
              pending={pendingIds.includes(item.id)}
              onOpen={() => navigate({ view: 'series', slug: item.slug })}
              onToggle={() => {
                void toggleSave(item);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Esa historia todavía está por llegar"
          description="No hay resultados con estos filtros. Prueba otro género o una nueva búsqueda."
        >
          <button
            className="button button-primary"
            onClick={() =>
              setFilters({
                query: '',
                genre: 'Todos',
                status: 'Todos',
                sort: 'recent',
              })
            }
          >
            Limpiar filtros <ArrowRight size={16} />
          </button>
        </EmptyState>
      )}
    </section>
  );
}
