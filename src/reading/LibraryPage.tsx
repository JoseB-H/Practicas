import { ArrowRight, BookOpen, Bookmark, History, Play } from 'lucide-react';
import { Cover, SeriesCard } from './Cover';
import { EmptyState } from './States';
import type { PortalProps } from './types';

export function LibraryPage({
  series,
  reader,
  pendingIds,
  navigate,
  toggleSave,
}: PortalProps) {
  const saved = reader.savedIds
    .map((id) => series.find((item) => item.id === id))
    .filter((item) => !!item);
  const progress = [...reader.progress].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  return (
    <section className="library-page">
      <div className="page-intro">
        <span className="overline">
          <Bookmark size={12} />
          HISTORIAS QUE YA SON PARTE DE TI
        </span>
        <h1>
          Mi biblioteca<span>.</span>
        </h1>
        <p>
          Tu próxima lectura y ese capítulo que dejaste a medias. Todo, aquí.
        </p>
      </div>
      {progress.length > 0 && (
        <section className="continue-section">
          <div className="section-heading">
            <div>
              <span className="overline">
                <History size={12} />
                JUSTO DONDE LO DEJASTE
              </span>
              <h2>Continúa tu historia</h2>
            </div>
          </div>
          <div className="continue-grid">
            {progress.map((item) => {
              const story = series.find((story) => story.id === item.seriesId);
              if (!story) return null;
              return (
                <article key={item.seriesId} className="continue-card">
                  <Cover series={story} />
                  <div>
                    <span className="overline">TU LECTURA EN CURSO</span>
                    <h3>{story.title}</h3>
                    <p>
                      Capítulo {item.chapterId.split('-').at(-1)} <span>·</span>{' '}
                      Página {item.pageIndex + 1}
                    </p>
                    <div className="reading-track">
                      <span
                        style={{
                          width: `${((item.pageIndex + 1) / 3) * 100}%`,
                        }}
                      />
                    </div>
                    <button
                      className="text-button"
                      aria-label={`Continuar leyendo ${story.title}`}
                      onClick={() =>
                        navigate({
                          view: 'read',
                          chapterId: item.chapterId,
                          pageIndex: item.pageIndex,
                        })
                      }
                    >
                      <Play size={12} fill="currentColor" />
                      Continuar leyendo <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <div className="section-heading library-heading">
        <div>
          <span className="overline">PARA LEER UNA Y OTRA VEZ</span>
          <h2>
            Historias guardadas{' '}
            <span className="count-badge">{saved.length}</span>
          </h2>
        </div>
      </div>
      {saved.length ? (
        <div className="series-grid catalog-series-grid">
          {saved.map((story) => (
            <SeriesCard
              key={story.id}
              series={story}
              saved
              pending={pendingIds.includes(story.id)}
              onOpen={() => navigate({ view: 'series', slug: story.slug })}
              onToggle={() => {
                void toggleSave(story);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tu biblioteca empieza con una historia"
          description="Guarda tus manhwas favoritos y vuelve a ellos cuando quieras."
        >
          <button
            className="button button-primary"
            onClick={() => navigate({ view: 'catalog' })}
          >
            <BookOpen size={16} />
            Encuentra tu próxima lectura
          </button>
        </EmptyState>
      )}
      <p className="library-note">
        Tu biblioteca y tu punto de lectura se conservan en este navegador.
      </p>
    </section>
  );
}
