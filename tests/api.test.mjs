import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { request as httpRequest } from 'node:http';
import { createApp } from '../server/app.mjs';

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'yitverse-api-'));
  let app;
  t.after(async () => {
    await app?.close();
    await rm(directory, { recursive: true, force: true });
  });
  const dbPath = join(directory, 'workspace.sqlite');
  async function open(extra = {}) {
    app = createApp({ dbPath, seed: false, ...options, ...extra });
    await new Promise((resolve, reject) => {
      app.server.once('error', reject);
      app.server.listen(0, '127.0.0.1', resolve);
    });
    return `http://127.0.0.1:${app.server.address().port}`;
  }
  let origin = await open();
  return {
    directory,
    get origin() {
      return origin;
    },
    async reopen(extra) {
      await app.close();
      origin = await open(extra);
    },
    async send(path, method = 'GET', body) {
      const response = await fetch(`${origin}${path}`, {
        method,
        headers:
          body === undefined ? {} : { 'content-type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await response.text();
      return {
        status: response.status,
        body: text ? JSON.parse(text) : null,
        headers: response.headers,
      };
    },
  };
}

const projectInput = {
  title: 'Mi universo',
  description: 'Un proyecto real',
  category: 'Diseño',
  color: 'purple',
  status: 'active',
};

async function project(api, data = {}) {
  const response = await api.send('/api/projects', 'POST', {
    ...projectInput,
    ...data,
  });
  assert.equal(response.status, 201);
  return response.body;
}

function error(response, status) {
  assert.equal(response.status, status);
  assert.equal(typeof response.body.error, 'string');
  assert.ok(response.body.error.length > 0);
}

test('an unseeded workspace returns empty collections and an editable profile', async (t) => {
  const api = await fixture(t);
  const response = await api.send('/api/workspace');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    projects: [],
    tasks: [],
    resources: [],
    profile: { name: 'Explorador', role: 'Creador', bio: '', email: '' },
  });
});

test('projects create, trim, update and delete without changing generated metadata', async (t) => {
  const api = await fixture(t);
  const created = await project(api, { title: '  Mi universo  ' });
  assert.equal(created.title, 'Mi universo');
  assert.match(created.id, /^[0-9a-f-]{36}$/);
  assert.equal(new Date(created.createdAt).toISOString(), created.createdAt);
  const updated = await api.send(`/api/projects/${created.id}`, 'PATCH', {
    title: 'Nueva órbita',
    status: 'completed',
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, 'Nueva órbita');
  assert.equal(updated.body.status, 'completed');
  assert.equal(updated.body.id, created.id);
  assert.equal(updated.body.createdAt, created.createdAt);
  assert.equal(
    (await api.send('/api/workspace')).body.projects[0].title,
    'Nueva órbita',
  );
  assert.equal(
    (await api.send(`/api/projects/${created.id}`, 'DELETE')).status,
    204,
  );
  assert.deepEqual((await api.send('/api/workspace')).body.projects, []);
  error(await api.send(`/api/projects/${created.id}`, 'DELETE'), 404);
});

test('invalid projects are rejected atomically, including immutable and unknown properties', async (t) => {
  const api = await fixture(t);
  for (const invalid of [
    { title: '' },
    { title: ' \t\n ' },
    { title: 42 },
    { title: 'a'.repeat(121) },
    { category: 'Unknown' },
    { color: 'red' },
    { status: 'done' },
    { description: 'a'.repeat(2001) },
    { description: null },
    { id: 'client-id' },
    { createdAt: '2020-01-01' },
    { unexpected: true },
  ])
    error(
      await api.send('/api/projects', 'POST', { ...projectInput, ...invalid }),
      400,
    );
  assert.deepEqual((await api.send('/api/workspace')).body.projects, []);
  const created = await project(api);
  for (const invalid of [
    { id: 'other' },
    { createdAt: '2020-01-01' },
    { title: ' ' },
    { color: 'red' },
  ]) {
    error(await api.send(`/api/projects/${created.id}`, 'PATCH', invalid), 400);
  }
  assert.deepEqual((await api.send('/api/workspace')).body.projects, [created]);
});

test('task CRUD checks projects, enums and real calendar dates', async (t) => {
  const api = await fixture(t);
  const parent = await project(api);
  const base = {
    title: '  Dibujar la idea  ',
    projectId: parent.id,
    status: 'todo',
    priority: 'high',
    dueDate: '2028-02-29',
  };
  const created = await api.send('/api/tasks', 'POST', base);
  assert.equal(created.status, 201);
  assert.equal(created.body.title, 'Dibujar la idea');
  assert.equal(created.body.dueDate, '2028-02-29');
  for (const invalid of [
    { title: ' ' },
    { title: 'a'.repeat(121) },
    { projectId: 'missing' },
    { projectId: null },
    { status: 'completed' },
    { priority: 'urgent' },
    { dueDate: '2027-02-29' },
    { dueDate: '2026-04-31' },
    { dueDate: '2026-2-03' },
    { dueDate: 'not-a-date' },
    { dueDate: 123 },
    { id: 'client-id' },
    { createdAt: '2020-01-01' },
  ])
    error(await api.send('/api/tasks', 'POST', { ...base, ...invalid }), 400);
  const changed = await api.send(`/api/tasks/${created.body.id}`, 'PATCH', {
    status: 'done',
    dueDate: null,
  });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.status, 'done');
  assert.equal(changed.body.dueDate, null);
  assert.equal(changed.body.createdAt, created.body.createdAt);
  error(
    await api.send(`/api/tasks/${created.body.id}`, 'PATCH', {
      projectId: 'missing',
    }),
    400,
  );
  error(
    await api.send(`/api/tasks/${created.body.id}`, 'PATCH', {
      id: 'overwrite',
    }),
    400,
  );
  assert.equal((await api.send('/api/workspace')).body.tasks.length, 1);
  assert.equal(
    (await api.send(`/api/tasks/${created.body.id}`, 'DELETE')).status,
    204,
  );
  error(
    await api.send(`/api/tasks/${created.body.id}`, 'PATCH', {
      status: 'done',
    }),
    404,
  );
});

test('deleting a project cascades its tasks and preserves unrelated tasks', async (t) => {
  const api = await fixture(t);
  const first = await project(api);
  const second = await project(api, { title: 'Otra órbita' });
  await api.send('/api/tasks', 'POST', {
    title: 'Primera',
    projectId: first.id,
  });
  await api.send('/api/tasks', 'POST', {
    title: 'Segunda',
    projectId: second.id,
  });
  assert.equal(
    (await api.send(`/api/projects/${first.id}`, 'DELETE')).status,
    204,
  );
  const workspace = (await api.send('/api/workspace')).body;
  assert.deepEqual(
    workspace.projects.map((item) => item.id),
    [second.id],
  );
  assert.deepEqual(
    workspace.tasks.map((item) => item.title),
    ['Segunda'],
  );
});

test('resources persist only HTTP(S) URLs with validated titles and categories', async (t) => {
  const api = await fixture(t);
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,hello',
    'file:///etc/passwd',
    'ftp://example.com',
    '/relative',
    'not a URL',
  ]) {
    error(
      await api.send('/api/resources', 'POST', { title: 'Enlace', url }),
      400,
    );
  }
  for (const invalid of [
    { title: ' ' },
    { title: 'a'.repeat(121) },
    { category: 'Producto' },
    { description: [] },
    { id: 'custom' },
  ]) {
    error(
      await api.send('/api/resources', 'POST', {
        title: 'Guía',
        url: 'https://developer.mozilla.org/',
        ...invalid,
      }),
      400,
    );
  }
  const resource = await api.send('/api/resources', 'POST', {
    title: '  Guía web  ',
    url: 'https://developer.mozilla.org/',
    category: 'Desarrollo',
    description: 'Documentación de referencia',
  });
  assert.equal(resource.status, 201);
  assert.equal(resource.body.title, 'Guía web');
  assert.equal(resource.body.url, 'https://developer.mozilla.org/');
  assert.equal(
    (
      await api.send('/api/resources', 'POST', {
        title: 'Local',
        url: 'http://localhost:8000',
      })
    ).status,
    201,
  );
  assert.equal(
    (await api.send(`/api/resources/${resource.body.id}`, 'DELETE')).status,
    204,
  );
  error(await api.send(`/api/resources/${resource.body.id}`, 'DELETE'), 404);
});

test('profile changes are validated and stored across database reopen', async (t) => {
  const api = await fixture(t);
  const profile = {
    name: '  Luna  ',
    role: 'Diseñadora',
    bio: 'Ideas que toman forma.',
    email: 'luna@example.com',
  };
  const updated = await api.send('/api/profile', 'PATCH', profile);
  assert.equal(updated.status, 200);
  assert.deepEqual(updated.body, { ...profile, name: 'Luna' });
  for (const invalid of [
    { name: ' ' },
    { role: null },
    { email: 'invalid' },
    { bio: 'a'.repeat(501) },
    { id: 'profile' },
  ]) {
    error(await api.send('/api/profile', 'PATCH', invalid), 400);
  }
  const created = await project(api);
  const task = await api.send('/api/tasks', 'POST', {
    title: 'Persistir',
    projectId: created.id,
  });
  const resource = await api.send('/api/resources', 'POST', {
    title: 'Archivo',
    url: 'https://example.com',
  });
  await api.reopen();
  const workspace = (await api.send('/api/workspace')).body;
  assert.deepEqual(workspace.profile, { ...profile, name: 'Luna' });
  assert.deepEqual(workspace.projects, [created]);
  assert.deepEqual(workspace.tasks, [task.body]);
  assert.deepEqual(workspace.resources, [resource.body]);
});

test('malformed JSON, non-object bodies and oversized requests return JSON 400', async (t) => {
  const api = await fixture(t);
  for (const body of [
    '{broken',
    'null',
    '[]',
    '"text"',
    '',
    JSON.stringify({ title: 'a'.repeat(70_000) }),
  ]) {
    const response = await fetch(`${api.origin}/api/projects`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, 'string');
  }
  assert.deepEqual((await api.send('/api/workspace')).body.projects, []);
});

test('unknown API routes and missing records are 404; unsupported route methods are 405', async (t) => {
  const api = await fixture(t);
  for (const path of [
    '/api/unknown',
    '/api/projects/missing/extra',
    '/api/resources/missing/extra',
    '/api',
  ]) {
    error(await api.send(path), 404);
  }
  for (const [path, method] of [
    ['/api/workspace', 'POST'],
    ['/api/projects', 'GET'],
    ['/api/projects/missing', 'PUT'],
    ['/api/resources/missing', 'PATCH'],
    ['/api/profile', 'GET'],
  ]) {
    const response = await api.send(path, method);
    error(response, 405);
    assert.ok(response.headers.get('allow'));
  }
  error(
    await api.send('/api/projects/missing', 'PATCH', { title: 'Missing' }),
    404,
  );
  error(await api.send('/api/tasks/missing', 'DELETE'), 404);
});

test('sample projects and related content seed once and do not return after deletion', async (t) => {
  const api = await fixture(t, { seed: true });
  const initial = (await api.send('/api/workspace')).body;
  assert.deepEqual(initial.projects.map((item) => item.title).sort(), [
    'Laboratorio de ideas',
    'YitVerse web',
    'Órbita creativa',
  ]);
  assert.ok(initial.tasks.length >= 6);
  assert.ok(initial.resources.length >= 3);
  assert.ok(
    initial.tasks.every((task) =>
      initial.projects.some((project) => project.id === task.projectId),
    ),
  );
  await api.reopen({ seed: true });
  assert.deepEqual((await api.send('/api/workspace')).body, initial);
  for (const project of initial.projects)
    await api.send(`/api/projects/${project.id}`, 'DELETE');
  await api.reopen({ seed: true });
  assert.deepEqual((await api.send('/api/workspace')).body.projects, []);
});

test('static serving supports the SPA and HEAD while blocking traversal and escaping symlinks', async (t) => {
  const api = await fixture(t);
  const distPath = join(api.directory, 'dist');
  await mkdir(join(distPath, 'assets'), { recursive: true });
  await writeFile(
    join(distPath, 'index.html'),
    '<!doctype html><title>YitVerse</title>',
  );
  await writeFile(join(distPath, 'assets', 'app.js'), 'window.ready = true;');
  await writeFile(join(api.directory, 'secret.txt'), 'PRIVATE');
  await symlink(
    join(api.directory, 'secret.txt'),
    join(distPath, 'assets', 'secret.txt'),
  );
  await api.reopen({ distPath });
  const page = await fetch(`${api.origin}/projects`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /YitVerse/);
  const asset = await fetch(`${api.origin}/assets/app.js`);
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type'), /javascript/);
  assert.equal(await asset.text(), 'window.ready = true;');
  const head = await fetch(`${api.origin}/assets/app.js`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(`${api.origin}/assets/missing.js`)).status, 404);
  assert.equal((await fetch(`${api.origin}/assets/secret.txt`)).status, 404);
  for (const path of [
    '/..%2fsecret.txt',
    '/%2e%2e%2fsecret.txt',
    '/%00',
    '/%ZZ',
    '/.hidden',
  ]) {
    const result = await new Promise((resolve, reject) => {
      const request = httpRequest(`${api.origin}${path}`, (response) => {
        let text = '';
        response.on('data', (chunk) => {
          text += chunk;
        });
        response.on('end', () =>
          resolve({ status: response.statusCode, text }),
        );
      });
      request.on('error', reject);
      request.end();
    });
    assert.ok([400, 404].includes(result.status));
    assert.doesNotMatch(result.text, /PRIVATE/);
  }
  error(await api.send('/api/unknown'), 404);
});
