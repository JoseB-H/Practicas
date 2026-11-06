import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createApp } from '../server/app.mjs';

const slugs = [
  'heredero-del-eclipse',
  'jardin-de-sombras',
  'nivel-cero',
  'ultima-hechicera',
  'contrato-de-medianoche',
  'academia-del-vacio',
];

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'yitverse-manhwa-'));
  const dbPath = join(directory, 'reader.sqlite');
  let app;
  let origin;
  t.after(async () => {
    await app?.close();
    await rm(directory, { recursive: true, force: true });
  });
  async function open() {
    app = createApp({ dbPath, seed: false, ...options });
    await new Promise((resolve, reject) => {
      app.server.once('error', reject);
      app.server.listen(0, '127.0.0.1', resolve);
    });
    origin = `http://127.0.0.1:${app.server.address().port}`;
  }
  await open();
  return {
    async reopen() {
      await app.close();
      await open();
    },
    browser(initialCookie = '') {
      let cookie = initialCookie;
      return {
        get cookie() {
          return cookie;
        },
        async send(path, method = 'GET', body) {
          const response = await fetch(`${origin}${path}`, {
            method,
            headers: {
              ...(cookie ? { cookie } : {}),
              ...(body === undefined
                ? {}
                : { 'content-type': 'application/json' }),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
          });
          const setCookie = response.headers.get('set-cookie');
          if (setCookie) cookie = setCookie.split(';')[0];
          const text = await response.text();
          return {
            status: response.status,
            body: text ? JSON.parse(text) : null,
            headers: response.headers,
          };
        },
      };
    },
  };
}

function error(response, expected) {
  assert.equal(response.status, expected);
  assert.equal(typeof response.body.error, 'string');
  assert.ok(response.body.error.length > 0);
}

function isoDate(value) {
  assert.equal(new Date(value).toISOString(), value);
}

test('catalog exposes exactly six original series and truthful chapter counts', async (t) => {
  const api = await fixture(t);
  const response = await api.browser().send('/api/catalog');
  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.series.map((series) => series.slug),
    slugs,
  );
  assert.deepEqual(
    response.body.series.map((series) => series.title),
    [
      'El heredero del eclipse',
      'Jardín de sombras',
      'Nivel cero',
      'La última hechicera',
      'Contrato de medianoche',
      'Academia del vacío',
    ],
  );
  assert.deepEqual([...response.body.genres].sort(), [
    'Academia',
    'Acción',
    'Aventura',
    'Drama',
    'Fantasía',
    'Romance',
    'Sistema',
    'Sobrenatural',
  ]);
  for (const [index, series] of response.body.series.entries()) {
    assert.equal(series.id, series.slug);
    assert.equal(series.coverIndex, index);
    assert.equal(series.type, 'Manhwa');
    assert.equal(series.chapterCount, 3);
    assert.equal(series.latestChapter, 3);
    assert.equal(series.author, 'YitVerse Studio');
    assert.ok(['En emisión', 'Completado'].includes(series.status));
    assert.ok(series.rating >= 0 && series.rating <= 10);
    assert.ok(Number.isInteger(series.year));
    assert.ok(series.genres.length >= 2);
    for (const field of ['alternativeTitle', 'description', 'artist'])
      assert.ok(series[field].length > 0);
    isoDate(series.updatedAt);
  }
});

test('each series has three chapters, three page URLs and correct reader navigation', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  for (const slug of slugs) {
    const detail = await browser.send(`/api/series/${slug}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.series.slug, slug);
    assert.deepEqual(
      detail.body.chapters.map((chapter) => chapter.number),
      [1, 2, 3],
    );
    for (const chapter of detail.body.chapters) {
      assert.equal(chapter.id, `${slug}-${chapter.number}`);
      assert.equal(chapter.seriesId, slug);
      assert.equal(chapter.pageCount, 3);
      assert.ok(chapter.title.length > 0);
      isoDate(chapter.publishedAt);
      assert.ok(chapter.publishedAt <= detail.body.series.updatedAt);
      const reading = await browser.send(`/api/chapters/${chapter.id}`);
      assert.equal(reading.status, 200);
      assert.deepEqual(reading.body.chapter, chapter);
      assert.deepEqual(reading.body.series, detail.body.series);
      assert.equal(
        reading.body.previousChapterId,
        chapter.number === 1 ? null : `${slug}-${chapter.number - 1}`,
      );
      assert.equal(
        reading.body.nextChapterId,
        chapter.number === 3 ? null : `${slug}-${chapter.number + 1}`,
      );
      assert.deepEqual(
        reading.body.pages.map((page) => page.url),
        [1, 2, 3].map((page) => `/art/chapters/${chapter.id}-${page}.svg`),
      );
      for (const page of reading.body.pages) {
        assert.equal(page.width, 800);
        assert.equal(page.height, 1200);
        assert.ok(page.alt.length > 0);
      }
    }
  }
});

test('reader creates a persistent HttpOnly cookie and reuses browser identity', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  const response = await browser.send('/api/reader');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { savedIds: [], progress: [] });
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /^yv_reader=[0-9a-f]{64};/);
  assert.match(cookie, /(?:^|;\s*)Path=\//);
  assert.match(cookie, /(?:^|;\s*)HttpOnly(?:;|$)/i);
  assert.match(cookie, /(?:^|;\s*)SameSite=Lax(?:;|$)/i);
  assert.match(cookie, /(?:^|;\s*)Max-Age=31536000(?:;|$)/i);
  const initialCookie = browser.cookie;
  assert.equal((await browser.send('/api/reader')).status, 200);
  assert.equal(browser.cookie, initialCookie);
  assert.match(response.headers.get('cache-control'), /no-store/);
});

test('library mutations create cookies directly and saves/removals are idempotent', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  const first = await browser.send(
    '/api/reader/library/heredero-del-eclipse',
    'PUT',
  );
  assert.equal(first.status, 200);
  assert.deepEqual(first.body, { seriesId: 'heredero-del-eclipse' });
  assert.match(first.headers.get('set-cookie'), /^yv_reader=/);
  assert.equal(
    (await browser.send('/api/reader/library/heredero-del-eclipse', 'PUT'))
      .status,
    200,
  );
  assert.deepEqual((await browser.send('/api/reader')).body.savedIds, [
    'heredero-del-eclipse',
  ]);
  assert.equal(
    (await browser.send('/api/reader/library/heredero-del-eclipse', 'DELETE'))
      .status,
    204,
  );
  assert.equal(
    (await browser.send('/api/reader/library/heredero-del-eclipse', 'DELETE'))
      .status,
    204,
  );
  assert.deepEqual((await browser.send('/api/reader')).body.savedIds, []);
  const fresh = api.browser();
  const deletion = await fresh.send('/api/reader/library/nivel-cero', 'DELETE');
  assert.equal(deletion.status, 204);
  assert.match(deletion.headers.get('set-cookie'), /^yv_reader=/);
});

test('two browsers keep library and progress isolated through updates and deletion', async (t) => {
  const api = await fixture(t);
  const first = api.browser();
  const second = api.browser();
  await first.send('/api/reader/library/heredero-del-eclipse', 'PUT');
  const progress = await first.send(
    '/api/reader/progress/heredero-del-eclipse',
    'PATCH',
    { chapterId: 'heredero-del-eclipse-2', pageIndex: 1 },
  );
  assert.equal(progress.status, 200);
  assert.deepEqual(
    { ...progress.body, updatedAt: undefined },
    {
      seriesId: 'heredero-del-eclipse',
      chapterId: 'heredero-del-eclipse-2',
      pageIndex: 1,
      updatedAt: undefined,
    },
  );
  isoDate(progress.body.updatedAt);
  assert.deepEqual((await second.send('/api/reader')).body, {
    savedIds: [],
    progress: [],
  });
  assert.notEqual(first.cookie, second.cookie);
  await second.send('/api/reader/library/nivel-cero', 'PUT');
  await second.send('/api/reader/progress/heredero-del-eclipse', 'PATCH', {
    chapterId: 'heredero-del-eclipse-1',
    pageIndex: 0,
  });
  const before = (await first.send('/api/reader')).body;
  assert.deepEqual(before.savedIds, ['heredero-del-eclipse']);
  assert.deepEqual(before.progress, [progress.body]);
  await second.send('/api/reader/library/heredero-del-eclipse', 'DELETE');
  assert.deepEqual((await first.send('/api/reader')).body, before);
  const changed = await first.send(
    '/api/reader/progress/heredero-del-eclipse',
    'PATCH',
    { chapterId: 'heredero-del-eclipse-3', pageIndex: 2 },
  );
  assert.equal(changed.status, 200);
  const latest = (await first.send('/api/reader')).body;
  assert.equal(latest.progress.length, 1);
  assert.deepEqual(latest.progress[0], changed.body);
  assert.equal(
    (await second.send('/api/reader')).body.progress[0].pageIndex,
    0,
  );
});

test('progress rejects invalid indexes, wrong series and client timestamps without mutation', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  const original = await browser.send(
    '/api/reader/progress/nivel-cero',
    'PATCH',
    { chapterId: 'nivel-cero-1', pageIndex: 0 },
  );
  assert.equal(original.status, 200);
  assert.match(original.headers.get('set-cookie'), /^yv_reader=/);
  for (const body of [
    null,
    [],
    {},
    { pageIndex: 0 },
    { chapterId: 'nivel-cero-1' },
    { chapterId: 'nivel-cero-1', pageIndex: -1 },
    { chapterId: 'nivel-cero-1', pageIndex: 3 },
    { chapterId: 'nivel-cero-1', pageIndex: 1.5 },
    { chapterId: 'nivel-cero-1', pageIndex: '1' },
    { chapterId: 'nivel-cero-1', pageIndex: null },
    { chapterId: 'nivel-cero-1', pageIndex: true },
    { chapterId: 'heredero-del-eclipse-1', pageIndex: 0 },
    {
      chapterId: 'nivel-cero-1',
      pageIndex: 0,
      updatedAt: '2099-12-31T23:59:59Z',
    },
    { chapterId: 'nivel-cero-1', pageIndex: 0, extra: true },
  ])
    error(
      await browser.send('/api/reader/progress/nivel-cero', 'PATCH', body),
      400,
    );
  error(
    await browser.send('/api/reader/progress/nivel-cero', 'PATCH', {
      chapterId: 'nivel-cero-99',
      pageIndex: 0,
    }),
    404,
  );
  assert.deepEqual((await browser.send('/api/reader')).body.progress, [
    original.body,
  ]);
});

test('invalid, unknown and duplicate cookies safely receive new isolated identities', async (t) => {
  const api = await fixture(t);
  const owner = api.browser();
  await owner.send('/api/reader/library/jardin-de-sombras', 'PUT');
  for (const cookie of [
    'yv_reader=%E0%A4%A',
    'yv_reader=',
    'yv_reader=not-valid',
    `yv_reader=${'f'.repeat(64)}`,
    `${owner.cookie}; ${owner.cookie}`,
    'unrelated=%bad; yv_reader=%ZZ; another=value',
  ]) {
    const visitor = api.browser(cookie);
    const response = await visitor.send('/api/reader');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { savedIds: [], progress: [] });
    assert.match(
      response.headers.get('set-cookie'),
      /^yv_reader=[0-9a-f]{64};/,
    );
    assert.notEqual(visitor.cookie, owner.cookie);
  }
  const ownerWithOtherCookies = api.browser(
    `theme=dark; ${owner.cookie}; malformed=%ZZ`,
  );
  assert.deepEqual(
    (await ownerWithOtherCookies.send('/api/reader')).body.savedIds,
    ['jardin-de-sombras'],
  );
});

test('reader state persists after restart and legacy workspace remains intact', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  const project = await browser.send('/api/projects', 'POST', {
    title: 'Conservar mi trabajo',
  });
  assert.equal(project.status, 201);
  await browser.send('/api/reader/library/academia-del-vacio', 'PUT');
  await browser.send('/api/reader/progress/academia-del-vacio', 'PATCH', {
    chapterId: 'academia-del-vacio-2',
    pageIndex: 2,
  });
  const before = (await browser.send('/api/reader')).body;
  const cookie = browser.cookie;
  await api.reopen();
  const returningBrowser = api.browser(cookie);
  assert.deepEqual((await returningBrowser.send('/api/reader')).body, before);
  assert.deepEqual(
    (await returningBrowser.send('/api/workspace')).body.projects,
    [project.body],
  );
  assert.deepEqual((await api.browser().send('/api/reader')).body, {
    savedIds: [],
    progress: [],
  });
  assert.equal((await browser.send('/api/catalog')).body.series.length, 6);
});

test('nonexistent reader routes and records return JSON 404 and wrong methods return 405', async (t) => {
  const api = await fixture(t);
  const browser = api.browser();
  for (const path of [
    '/api/series/unknown',
    '/api/chapters/nivel-cero-4',
    '/api/series/nivel-cero/extra',
    '/api/reader/unknown',
  ]) {
    error(await browser.send(path), 404);
  }
  for (const [path, method] of [
    ['/api/catalog', 'POST'],
    ['/api/series/nivel-cero', 'PATCH'],
    ['/api/chapters/nivel-cero-1', 'DELETE'],
    ['/api/reader', 'POST'],
    ['/api/reader/library/nivel-cero', 'GET'],
    ['/api/reader/progress/nivel-cero', 'PUT'],
  ]) {
    const response = await browser.send(path, method);
    error(response, 405);
    assert.ok(response.headers.get('allow'));
  }
  error(await browser.send('/api/reader/library/unknown', 'PUT'), 404);
  error(await browser.send('/api/reader/library/unknown', 'DELETE'), 404);
  error(
    await browser.send('/api/reader/progress/unknown', 'PATCH', {
      chapterId: 'nivel-cero-1',
      pageIndex: 0,
    }),
    404,
  );
});

test('in-memory applications support both APIs and close idempotently without listening', async (t) => {
  const api = await fixture(t, { dbPath: ':memory:' });
  const browser = api.browser();
  assert.equal((await browser.send('/api/catalog')).status, 200);
  assert.equal((await browser.send('/api/workspace')).status, 200);
  await browser.send('/api/reader/library/ultima-hechicera', 'PUT');
  assert.deepEqual((await browser.send('/api/reader')).body.savedIds, [
    'ultima-hechicera',
  ]);
  const unbound = createApp({ dbPath: ':memory:', seed: false });
  await unbound.close();
  await unbound.close();
});
