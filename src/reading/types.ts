export type Series = {
  id: string;
  slug: string;
  title: string;
  alternativeTitle: string;
  description: string;
  author: string;
  artist: string;
  year: number;
  type: string;
  genres: string[];
  status: 'En emisión' | 'Completado';
  coverIndex: number;
  rating: number;
  chapterCount: number;
  latestChapter: number;
  updatedAt: string;
};
export type Chapter = {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  publishedAt: string;
  pageCount: number;
};
export type ComicPage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};
export type ReadingProgress = {
  seriesId: string;
  chapterId: string;
  pageIndex: number;
  updatedAt: string;
};
export type ReaderState = { savedIds: string[]; progress: ReadingProgress[] };
export type Catalog = { series: Series[]; genres: string[] };
export type SeriesData = { series: Series; chapters: Chapter[] };
export type ChapterData = {
  series: Series;
  chapter: Chapter;
  pages: ComicPage[];
  previousChapterId: string | null;
  nextChapterId: string | null;
};
export type Route =
  | { view: 'home' }
  | { view: 'catalog' }
  | { view: 'library' }
  | { view: 'series'; slug: string }
  | { view: 'read'; chapterId: string; pageIndex?: number };
export type Navigate = (route: Route) => void;
export type PortalProps = {
  series: Series[];
  reader: ReaderState;
  pendingIds: string[];
  navigate: Navigate;
  toggleSave: (series: Series) => Promise<void>;
};
export const normalize = (text: string) =>
  text
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
export const displayDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Bogota',
  });
