import { DatabaseSync } from 'node:sqlite';
import { randomBytes } from 'node:crypto';
import { HttpError } from './validation.mjs';
import { sampleSeries, sampleChapters } from './manhwa-content.mjs';

const COOKIE_AGE = 31_536_000;

function cookieToken(header) {
  if (typeof header !== 'string') return null;
  const values = [];
  for (const segment of header.split(';')) {
    const separator = segment.indexOf('=');
    const name = (
      separator === -1 ? segment : segment.slice(0, separator)
    ).trim();
    if (name === 'yv_reader')
      values.push(separator === -1 ? '' : segment.slice(separator + 1).trim());
  }
  return values.length === 1 && /^[a-f0-9]{64}$/.test(values[0])
    ? values[0]
    : null;
}

function progressFields(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw new HttpError(400, 'El cuerpo debe ser un objeto JSON.');
  const keys = Object.keys(body);
  if (
    keys.length !== 2 ||
    !Object.hasOwn(body, 'chapterId') ||
    !Object.hasOwn(body, 'pageIndex')
  ) {
    throw new HttpError(400, 'Incluye únicamente chapterId y pageIndex.');
  }
  if (
    typeof body.chapterId !== 'string' ||
    !body.chapterId ||
    !Number.isInteger(body.pageIndex)
  ) {
    throw new HttpError(
      400,
      'El capítulo y el índice entero de página son obligatorios.',
    );
  }
  return body;
}

function openStore(dbPath) {
  const db = new DatabaseSync(dbPath);
  try {
    db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS manhwa_series (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, position INTEGER NOT NULL, data TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS manhwa_chapters (
        id TEXT PRIMARY KEY, seriesId TEXT NOT NULL REFERENCES manhwa_series(id),
        number INTEGER NOT NULL, pageCount INTEGER NOT NULL CHECK(pageCount > 0), data TEXT NOT NULL,
        UNIQUE(id,seriesId), UNIQUE(seriesId,number)
      );
      CREATE TABLE IF NOT EXISTS manhwa_readers (
        id TEXT PRIMARY KEY, createdAt TEXT NOT NULL, expiresAt INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS manhwa_library (
        readerId TEXT NOT NULL REFERENCES manhwa_readers(id) ON DELETE CASCADE,
        seriesId TEXT NOT NULL REFERENCES manhwa_series(id), createdAt TEXT NOT NULL,
        PRIMARY KEY(readerId,seriesId)
      );
      CREATE TABLE IF NOT EXISTS manhwa_progress (
        readerId TEXT NOT NULL REFERENCES manhwa_readers(id) ON DELETE CASCADE,
        seriesId TEXT NOT NULL REFERENCES manhwa_series(id), chapterId TEXT NOT NULL,
        pageIndex INTEGER NOT NULL CHECK(pageIndex >= 0), updatedAt TEXT NOT NULL,
        PRIMARY KEY(readerId,seriesId),
        FOREIGN KEY(chapterId,seriesId) REFERENCES manhwa_chapters(id,seriesId)
      );
      BEGIN IMMEDIATE;
    `);
    const insertSeries = db.prepare(
      'INSERT OR IGNORE INTO manhwa_series (id,slug,position,data) VALUES (?,?,?,?)',
    );
    const insertChapter = db.prepare(
      'INSERT OR IGNORE INTO manhwa_chapters (id,seriesId,number,pageCount,data) VALUES (?,?,?,?,?)',
    );
    for (const series of sampleSeries)
      insertSeries.run(
        series.id,
        series.slug,
        series.coverIndex,
        JSON.stringify(series),
      );
    for (const chapter of sampleChapters)
      insertChapter.run(
        chapter.id,
        chapter.seriesId,
        chapter.number,
        chapter.pageCount,
        JSON.stringify(chapter),
      );
    db.exec('COMMIT');
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch {
      /* Initialization may fail before the transaction starts. */
    }
    db.close();
    throw error;
  }

  function seriesBy(field, value) {
    const row = db
      .prepare(`SELECT data FROM manhwa_series WHERE ${field} = ?`)
      .get(value);
    if (!row) throw new HttpError(404, 'No se encontró la serie.');
    return JSON.parse(row.data);
  }

  function chapterById(id) {
    const row = db
      .prepare('SELECT data FROM manhwa_chapters WHERE id = ?')
      .get(id);
    if (!row) throw new HttpError(404, 'No se encontró el capítulo.');
    return JSON.parse(row.data);
  }

  function chaptersFor(seriesId) {
    return db
      .prepare(
        'SELECT data FROM manhwa_chapters WHERE seriesId = ? ORDER BY number',
      )
      .all(seriesId)
      .map((row) => JSON.parse(row.data));
  }

  return {
    catalog() {
      const series = db
        .prepare('SELECT data FROM manhwa_series ORDER BY position')
        .all()
        .map((row) => JSON.parse(row.data));
      return {
        series,
        genres: [...new Set(series.flatMap((item) => item.genres))],
      };
    },
    detail(slug) {
      const series = seriesBy('slug', slug);
      return { series, chapters: chaptersFor(series.id) };
    },
    chapter(id) {
      const chapter = chapterById(id);
      const series = seriesBy('id', chapter.seriesId);
      const chapters = chaptersFor(series.id);
      const position = chapters.findIndex((item) => item.id === chapter.id);
      return {
        series,
        chapter,
        pages: Array.from({ length: chapter.pageCount }, (_, page) => ({
          url: `/art/chapters/${chapter.id}-${page + 1}.svg`,
          alt: `${series.title}. Capítulo ${chapter.number}: ${chapter.title}. Página ${page + 1}.`,
          width: 800,
          height: 1200,
        })),
        previousChapterId: chapters[position - 1]?.id ?? null,
        nextChapterId: chapters[position + 1]?.id ?? null,
      };
    },
    requireSeries(id) {
      return seriesBy('id', id);
    },
    session(request, response) {
      const token = cookieToken(request.headers.cookie);
      const now = Date.now();
      if (
        token &&
        db
          .prepare(
            'SELECT id FROM manhwa_readers WHERE id = ? AND expiresAt > ?',
          )
          .get(token, now)
      )
        return token;
      const id = randomBytes(32).toString('hex');
      db.prepare(
        'INSERT INTO manhwa_readers (id,createdAt,expiresAt) VALUES (?,?,?)',
      ).run(id, new Date(now).toISOString(), now + COOKIE_AGE * 1000);
      response.setHeader(
        'set-cookie',
        `yv_reader=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_AGE}`,
      );
      return id;
    },
    reader(id) {
      return {
        savedIds: db
          .prepare(
            'SELECT seriesId FROM manhwa_library WHERE readerId = ? ORDER BY rowid',
          )
          .all(id)
          .map((row) => row.seriesId),
        progress: db
          .prepare(
            'SELECT seriesId,chapterId,pageIndex,updatedAt FROM manhwa_progress WHERE readerId = ? ORDER BY updatedAt DESC,rowid DESC',
          )
          .all(id),
      };
    },
    save(readerId, seriesId) {
      db.prepare(
        'INSERT OR IGNORE INTO manhwa_library (readerId,seriesId,createdAt) VALUES (?,?,?)',
      ).run(readerId, seriesId, new Date().toISOString());
    },
    remove(readerId, seriesId) {
      db.prepare(
        'DELETE FROM manhwa_library WHERE readerId = ? AND seriesId = ?',
      ).run(readerId, seriesId);
    },
    progress(readerId, seriesId, body) {
      const { chapterId, pageIndex } = progressFields(body);
      const chapter = chapterById(chapterId);
      if (chapter.seriesId !== seriesId)
        throw new HttpError(400, 'El capítulo no pertenece a esta serie.');
      if (pageIndex < 0 || pageIndex >= chapter.pageCount)
        throw new HttpError(400, 'El índice de página está fuera de rango.');
      const updatedAt = new Date().toISOString();
      db.prepare(
        `INSERT INTO manhwa_progress (readerId,seriesId,chapterId,pageIndex,updatedAt) VALUES (?,?,?,?,?)
        ON CONFLICT(readerId,seriesId) DO UPDATE SET chapterId=excluded.chapterId,pageIndex=excluded.pageIndex,updatedAt=excluded.updatedAt`,
      ).run(readerId, seriesId, chapterId, pageIndex, updatedAt);
      return { seriesId, chapterId, pageIndex, updatedAt };
    },
    close() {
      db.close();
    },
  };
}

export function createManhwaApi({ dbPath, json, readJson, allow }) {
  const store = openStore(dbPath);
  return {
    async handle(request, response, pathname) {
      if (pathname === '/api/catalog') {
        allow(request.method, ['GET']);
        json(response, 200, store.catalog());
        return true;
      }
      const seriesRoute = /^\/api\/series\/([^/]+)$/.exec(pathname);
      if (seriesRoute) {
        allow(request.method, ['GET']);
        json(response, 200, store.detail(seriesRoute[1]));
        return true;
      }
      const chapterRoute = /^\/api\/chapters\/([^/]+)$/.exec(pathname);
      if (chapterRoute) {
        allow(request.method, ['GET']);
        json(response, 200, store.chapter(chapterRoute[1]));
        return true;
      }
      if (pathname === '/api/reader') {
        allow(request.method, ['GET']);
        json(response, 200, store.reader(store.session(request, response)));
        return true;
      }
      const libraryRoute = /^\/api\/reader\/library\/([^/]+)$/.exec(pathname);
      if (libraryRoute) {
        allow(request.method, ['PUT', 'DELETE']);
        const seriesId = libraryRoute[1];
        store.requireSeries(seriesId);
        const readerId = store.session(request, response);
        request.resume();
        if (request.method === 'DELETE') {
          store.remove(readerId, seriesId);
          response.writeHead(204, { 'cache-control': 'no-store' });
          response.end();
        } else {
          store.save(readerId, seriesId);
          json(response, 200, { seriesId });
        }
        return true;
      }
      const progressRoute = /^\/api\/reader\/progress\/([^/]+)$/.exec(pathname);
      if (progressRoute) {
        allow(request.method, ['PATCH']);
        const seriesId = progressRoute[1];
        store.requireSeries(seriesId);
        const readerId = store.session(request, response);
        const body = await readJson(request);
        json(response, 200, store.progress(readerId, seriesId, body));
        return true;
      }
      return false;
    },
    close() {
      store.close();
    },
  };
}
