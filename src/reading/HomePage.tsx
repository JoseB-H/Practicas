import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Cpu,
  Flame,
  Heart,
  Moon,
  Sparkles,
  Star,
  TrendingUp,
  Swords,
} from 'lucide-react';
import { useState } from 'react';
import { Cover, SeriesCard, coverStyle } from './Cover';
import type { PortalProps } from './types';
import { displayDate } from './types';

export function HomePage({
  series,
  reader,
  pendingIds,
  navigate,
  toggleSave,
  chooseGenre,
}: PortalProps & { chooseGenre: (genre: string) => void }) {
  const [featureIndex, setFeatureIndex] = useState(0);
  const featured = series[featureIndex % series.length];
  const ranked = [...series].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <div className="welcome-strip">
        <span>
          <span className="live-dot" />
          TU PRÓXIMO CAPÍTULO EMPIEZA AQUÍ
        </span>
        <span>
          Historias que te llevan a otro mundo <Sparkles size={12} />
        </span>
      </div>
      <section
        className={`feature-hero ${featureIndex ? 'alternate-feature' : ''}`}
      >
        {featureIndex === 0 ? (
          <img
            className="feature-art"
            src="/art/hero.png"
            alt="Kael, heredero del eclipse, con su espada entre ruinas violetas"
          />
        ) : (
          <div className="alternate-feature-art" style={coverStyle(featured)} />
        )}
        <div className="feature-overlay" />
        <div className="feature-content">
          <span className="feature-kicker">
            <span />
            DESTACADO DE LA SEMANA
          </span>
          <div className="feature-tags">
            <span>{featured.type.toUpperCase()}</span>
            {featured.genres.map((genre) => (
              <button key={genre} onClick={() => chooseGenre(genre)}>
                {genre}
              </button>
            ))}
          </div>
          <h1>
            {featured.id === 'heredero-del-eclipse' ? (
              <>
                El heredero <br />
                <span>del eclipse</span>
              </>
            ) : (
              featured.title
            )}
          </h1>
          <p>{featured.description}</p>
          <div className="feature-meta">
            <span className="feature-rating">
              <Star size={14} fill="currentColor" />
              {featured.rating.toFixed(1)}
            </span>
            <span>Puntuación editorial</span>
            <i />
            <span>{featured.chapterCount} capítulos</span>
            <i />
            <span className="emission">
              <span />
              {featured.status}
            </span>
          </div>
          <div className="feature-actions">
            <button
              className="button button-primary"
              onClick={() =>
                navigate({ view: 'read', chapterId: `${featured.id}-1` })
              }
            >
              <BookOpen size={17} />
              Comenzar a leer
            </button>
            <button
              className="button button-glass"
              onClick={() => navigate({ view: 'series', slug: featured.slug })}
            >
              Ver detalles <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
        <span className="feature-new">
          <span />
          CAPÍTULO {featured.latestChapter} DISPONIBLE
        </span>
        <div className="feature-pagination">
          <div className="feature-dots">
            {series.map((item, index) => (
              <button
                key={item.id}
                className={index === featureIndex ? 'selected' : ''}
                aria-label={`Destacar ${item.title}`}
                aria-pressed={index === featureIndex}
                onClick={() => setFeatureIndex(index)}
              />
            ))}
          </div>
          <div className="feature-arrows">
            <span>
              0{featureIndex + 1}
              <small>/0{series.length}</small>
            </span>
            <button
              className="icon-button"
              aria-label="Historia anterior"
              onClick={() =>
                setFeatureIndex(
                  (index) => (index + series.length - 1) % series.length,
                )
              }
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Historia siguiente"
              onClick={() =>
                setFeatureIndex((index) => (index + 1) % series.length)
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <div className="discovery-strip">
        <div>
          <span className="discovery-icon">
            <CompassIcon />
          </span>
          <span>
            Un género.
            <br />
            <strong>Mil posibilidades.</strong>
          </span>
        </div>
        <div className="quick-genres">
          {[
            'Acción',
            'Fantasía',
            'Romance',
            'Sistema',
            'Aventura',
            'Drama',
          ].map((genre, index) => {
            const GenreIcon = [Swords, Sparkles, Heart, Cpu, Compass, Moon][
              index
            ];
            return (
              <button key={genre} onClick={() => chooseGenre(genre)}>
                <span>
                  <GenreIcon size={17} />
                </span>
                {genre}
                <ChevronRight size={12} />
              </button>
            );
          })}
        </div>
      </div>

      <section className="popular-section">
        <div className="section-heading">
          <div>
            <span className="overline">
              <Flame size={12} />
              NO TE LAS PUEDES PERDER
            </span>
            <h2>
              Historias que no puedes soltar
              <span className="purple-period">.</span>
            </h2>
          </div>
          <button
            className="text-button"
            onClick={() => navigate({ view: 'catalog' })}
          >
            Explorar catálogo <ArrowRight size={15} />
          </button>
        </div>
        <div className="series-grid home-series-grid">
          {ranked.map((item) => (
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
      </section>

      <div className="home-lower-grid">
        <section className="latest-section">
          <div className="section-heading">
            <div>
              <span className="overline">
                <Clock3 size={12} />
                SIEMPRE HAY ALGO NUEVO
              </span>
              <h2>Recién actualizados</h2>
            </div>
            <span className="subtle-tag">Últimos capítulos</span>
          </div>
          <div className="update-grid">
            {[...series]
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((item) => (
                <article className="update-card" key={item.id}>
                  <button
                    className="update-cover"
                    onClick={() =>
                      navigate({ view: 'series', slug: item.slug })
                    }
                    aria-label={`Ver ficha de ${item.title}`}
                  >
                    <Cover series={item} />
                  </button>
                  <div className="update-information">
                    <button
                      className="update-title"
                      onClick={() =>
                        navigate({ view: 'series', slug: item.slug })
                      }
                    >
                      <h3>{item.title}</h3>
                    </button>
                    <span className="update-genre">
                      {item.genres[0]} <span>·</span> {item.type}
                    </span>
                    {[item.latestChapter, item.latestChapter - 1]
                      .filter((number) => number > 0)
                      .map((number, index) => (
                        <button
                          key={number}
                          className="chapter-shortcut"
                          onClick={() =>
                            navigate({
                              view: 'read',
                              chapterId: `${item.id}-${number}`,
                            })
                          }
                        >
                          <span>
                            Capítulo {number}{' '}
                            {index === 0 && <small>NUEVO</small>}
                          </span>
                          <span>
                            {displayDate(item.updatedAt)}
                            <ChevronRight size={12} />
                          </span>
                        </button>
                      ))}
                  </div>
                </article>
              ))}
          </div>
          <button
            className="show-more"
            onClick={() => navigate({ view: 'catalog' })}
          >
            Todas las historias, en un solo lugar <ArrowRight size={15} />
          </button>
        </section>
        <aside className="ranking-section">
          <div className="section-heading">
            <div>
              <span className="overline">
                <TrendingUp size={12} />
                PARA TU PRÓXIMO MARATÓN
              </span>
              <h2>En nuestra lista</h2>
            </div>
            <Sparkles size={19} />
          </div>
          <div className="ranking-panel">
            <span className="ranking-label">SELECCIÓN EDITORIAL</span>
            {ranked.slice(0, 5).map((item, index) => (
              <button
                key={item.id}
                className="ranking-row"
                onClick={() => navigate({ view: 'series', slug: item.slug })}
              >
                <span className={`rank-number rank-${index}`}>
                  0{index + 1}
                </span>
                <Cover series={item} />
                <span className="ranking-copy">
                  <strong>{item.title}</strong>
                  <small>{item.genres[0]}</small>
                  <span>
                    <Star size={10} fill="currentColor" />
                    {item.rating.toFixed(1)}
                  </span>
                </span>
              </button>
            ))}
            <p>Buenas historias. A un capítulo de distancia.</p>
          </div>
        </aside>
      </div>

      <section className="discovery-banner">
        <span className="banner-book">
          <BookOpen size={42} strokeWidth={1.3} />
        </span>
        <div>
          <span className="overline">SOLO UN CAPÍTULO MÁS…</span>
          <h2>
            El mundo puede esperar.
            <br />
            Tu próxima historia, no.
          </h2>
        </div>
        <button
          className="button button-primary"
          onClick={() => navigate({ view: 'catalog' })}
        >
          Descubrir mi próxima lectura <ArrowRight size={16} />
        </button>
        <span className="banner-orbit" />
      </section>
    </>
  );
}
function CompassIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
