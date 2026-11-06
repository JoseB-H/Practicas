import { test, expect } from '@playwright/test';

test('home shows original series and catalogue filters find matching stories', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'El heredero del eclipse',
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Explorar', exact: true }).click();
  await expect(page.getByTestId('series-card')).toHaveCount(6);
  await page.getByLabel('Buscar historias').fill('hechicera');
  await expect(page.getByTestId('series-card')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'La última hechicera', exact: true }),
  ).toBeVisible();
  await page.getByLabel('Buscar historias').fill('');
  await page.getByRole('button', { name: 'Romance', exact: true }).click();
  await expect(page.getByTestId('series-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(page.getByTestId('series-card')).toHaveCount(6);
});

test('series opens real chapters and reader navigates between them', async ({
  page,
}) => {
  await page.goto('/#/serie/heredero-del-eclipse');
  await expect(
    page.getByRole('heading', {
      name: 'El heredero del eclipse',
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByTestId('chapter-row')).toHaveCount(3);
  await page
    .getByRole('button', { name: 'Leer primer capítulo', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Capítulo 1', exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('reader-page')).toHaveCount(3);
  const first = page.getByTestId('reader-page').first().locator('img');
  await expect
    .poll(() => first.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await page
    .getByRole('button', { name: 'Siguiente capítulo', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Capítulo 2', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Capítulo anterior', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Capítulo 1', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Capítulo anterior', exact: true }),
  ).toBeDisabled();
});

test('saved library persists after reload and can remove stories', async ({
  page,
}) => {
  await page.goto('/#/serie/jardin-de-sombras');
  await page
    .getByRole('button', { name: 'Guardar en mi biblioteca', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'En mi biblioteca', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'En mi biblioteca', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Mi biblioteca', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Jardín de sombras', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Quitar Jardín de sombras de mi biblioteca' })
    .click();
  await expect(page.getByTestId('series-card')).toHaveCount(0);
  await expect(
    page.getByText('Tu biblioteca empieza con una historia'),
  ).toBeVisible();
});

test('reading progress resumes at the saved page', async ({ page }) => {
  await page.goto('/#/leer/heredero-del-eclipse-1');
  await expect(page.getByTestId('reader-page')).toHaveCount(3);
  await page.getByTestId('reader-page').nth(2).scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      const data = await (await page.request.get('/api/reader')).json();
      return data.progress.find(
        (item: { seriesId: string }) =>
          item.seriesId === 'heredero-del-eclipse',
      )?.pageIndex;
    })
    .toBe(2);
  await page.goto('/#/biblioteca');
  await page
    .getByRole('button', { name: 'Continuar leyendo El heredero del eclipse' })
    .click();
  await expect(page.getByTestId('reader-page').nth(2)).toBeInViewport();
  await expect(page.getByText('Página 3 de 3', { exact: true })).toBeVisible();
});

test('unknown routes and missing chapters show a recoverable state', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/__proto__');
  await expect(
    page.getByRole('heading', {
      name: 'El heredero del eclipse',
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page.goto('/#/leer/capitulo-inexistente');
  await expect(
    page.getByRole('heading', { name: 'Esta historia tomó otro camino' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Volver al catálogo', exact: true })
    .click();
  await expect(page.getByTestId('series-card')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('mobile menu, catalogue and reader fit a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Explorar', exact: true })
    .click();
  await expect(page.getByTestId('series-card')).toHaveCount(6);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.goto('/#/leer/ultima-hechicera-1');
  await expect(page.getByTestId('reader-page')).toHaveCount(3);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByLabel('Ancho de lectura').selectOption('wide');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test('failed library save keeps the story unsaved and explains the error', async ({
  page,
}) => {
  await page.goto('/#/serie/nivel-cero');
  await page.route('**/api/reader/library/*', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: '{"error":"No pudimos guardar tu historia"}',
    }),
  );
  await page
    .getByRole('button', { name: 'Guardar en mi biblioteca', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'No pudimos guardar tu historia',
  );
  await expect(
    page.getByRole('button', { name: 'Guardar en mi biblioteca', exact: true }),
  ).toBeVisible();
  const data = await (await page.request.get('/api/reader')).json();
  expect(data.savedIds).not.toContain('nivel-cero');
});

test('a delayed previous chapter save cannot overwrite the newer reading session', async ({
  page,
}) => {
  let release!: () => void;
  let firstSeen!: () => void;
  let secondSeen!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const firstRequest = new Promise<void>((resolve) => {
    firstSeen = resolve;
  });
  const secondRequest = new Promise<void>((resolve) => {
    secondSeen = resolve;
  });
  let held = false;
  await page.route(
    '**/api/reader/progress/heredero-del-eclipse',
    async (route) => {
      const body = route.request().postDataJSON();
      if (body.chapterId === 'heredero-del-eclipse-1' && !held) {
        held = true;
        firstSeen();
        await gate;
      }
      await route.continue();
      if (body.chapterId === 'heredero-del-eclipse-2') secondSeen();
    },
  );
  await page.goto('/#/leer/heredero-del-eclipse-1');
  await expect(page.getByTestId('reader-page')).toHaveCount(3);
  await firstRequest;
  await page.getByTestId('reader-page').nth(2).scrollIntoViewIfNeeded();
  await expect(page.getByText('Página 3 de 3', { exact: true })).toBeVisible();
  await page
    .getByRole('button', { name: 'Volver a la serie', exact: true })
    .click();
  await page
    .getByTestId('chapter-row')
    .filter({ hasText: 'Capítulo 2' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Capítulo 2', exact: true }),
  ).toBeVisible();
  // Before a fix, the new write finishes while the old one is still held.
  // A serialized implementation waits, so the bounded fallback releases it.
  await Promise.race([
    secondRequest,
    new Promise((resolve) => setTimeout(resolve, 700)),
  ]);
  release();
  await expect
    .poll(async () => {
      const state = await (await page.request.get('/api/reader')).json();
      return state.progress.find(
        (item: { seriesId: string }) =>
          item.seriesId === 'heredero-del-eclipse',
      )?.chapterId;
    })
    .toBe('heredero-del-eclipse-2');
  await expect(
    page.getByText('Lectura guardada', { exact: true }),
  ).toBeVisible();
});
