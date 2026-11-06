import { useRef } from 'react';
import { Bookmark, ChevronRight, Menu, Search, X } from 'lucide-react';
import type { Navigate, Route } from './types';

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <svg
          width="23"
          height="25"
          viewBox="0 0 32 34"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 3H12L21 18H11L2 3Z" fill="currentColor" />
          <path d="M23 3H32L22 20V32H12V20L23 3Z" fill="currentColor" />
        </svg>
      </span>
      <span>
        yitverse<span className="brand-period">.</span>
        <small>UN UNIVERSO POR LEER</small>
      </span>
    </span>
  );
}
export function Header({
  route,
  navigate,
  query,
  setQuery,
}: {
  route: Route;
  navigate: Navigate;
  query: string;
  setQuery: (value: string) => void;
}) {
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const links = [
    { view: 'home' as const, label: 'Inicio' },
    { view: 'catalog' as const, label: 'Explorar' },
    { view: 'library' as const, label: 'Mi biblioteca' },
  ];
  const go = (view: 'home' | 'catalog' | 'library') => {
    menu.current?.close();
    navigate({ view });
  };
  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="brand-button"
          aria-label="YitVerse, inicio"
          onClick={() => go('home')}
        >
          <Brand />
        </button>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map((link) => (
            <button
              key={link.view}
              className={route.view === link.view ? 'active' : ''}
              aria-current={route.view === link.view ? 'page' : undefined}
              onClick={() => go(link.view)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <form
          className="header-search"
          role="search"
          onClick={() => search.current?.focus()}
          onSubmit={(event) => {
            event.preventDefault();
            go('catalog');
          }}
        >
          <Search size={17} />
          <input
            ref={search}
            type="search"
            aria-label="Buscar historias"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca tu próxima historia..."
          />
          <kbd>↵</kbd>
        </form>
        <button
          className="header-library"
          aria-label="Abrir mi biblioteca"
          onClick={() => go('library')}
        >
          <Bookmark size={18} />
        </button>
        <button
          className="mobile-menu-button"
          aria-label="Abrir menú"
          onClick={() => menu.current?.showModal()}
        >
          <Menu size={23} />
        </button>
      </div>
      <dialog
        ref={menu}
        className="mobile-nav"
        aria-label="Navegación"
        onClick={(event) => {
          if (event.target === event.currentTarget) menu.current?.close();
        }}
      >
        <div className="mobile-nav-header">
          <Brand />
          <button
            className="icon-button"
            aria-label="Cerrar menú"
            onClick={() => menu.current?.close()}
          >
            <X size={21} />
          </button>
        </div>
        <nav>
          {links.map((link) => (
            <button key={link.view} onClick={() => go(link.view)}>
              {link.label}
              <ChevronRight size={18} />
            </button>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
