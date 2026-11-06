import { ArrowLeft, BookOpen, LoaderCircle, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Navigate } from './types';

export function Loading({
  label = 'Abriendo un nuevo universo…',
}: {
  label?: string;
}) {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="spin" size={30} />
      <p>{label}</p>
    </div>
  );
}
export function ErrorState({
  error,
  navigate,
  retry,
}: {
  error: string;
  navigate: Navigate;
  retry?: () => void;
}) {
  return (
    <section className="error-state" role="alert">
      <span>
        <BookOpen size={34} />
      </span>
      <h1>Esta historia tomó otro camino</h1>
      <p>{error}</p>
      <div>
        {retry && (
          <button className="button button-outline" onClick={retry}>
            Reintentar
          </button>
        )}
        <button
          className="button button-primary"
          onClick={() => navigate({ view: 'catalog' })}
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>
      </div>
    </section>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <SearchX size={35} strokeWidth={1.3} />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
