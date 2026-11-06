import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { HttpError } from './validation.mjs';

const tables = new Set(['projects', 'tasks', 'resources']);

export function openDatabase(dbPath, seed) {
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Producto','Diseño','Desarrollo','Comunidad')),
      color TEXT NOT NULL CHECK(color IN ('lime','purple','blue','orange')),
      status TEXT NOT NULL CHECK(status IN ('active','completed')), createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, title TEXT NOT NULL,
      projectId TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK(status IN ('todo','in-progress','done')),
      priority TEXT NOT NULL CHECK(priority IN ('low','medium','high')),
      dueDate TEXT, createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS tasks_project ON tasks(projectId);
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Diseño','Desarrollo','Aprendizaje','Inspiración')),
      description TEXT NOT NULL, createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK(id = 1), name TEXT NOT NULL, role TEXT NOT NULL,
      bio TEXT NOT NULL, email TEXT NOT NULL
    );
  `);

  function insert(kind, fields) {
    if (!tables.has(kind)) throw new Error('Unknown collection');
    if (kind === 'tasks') requireProject(fields.projectId);
    const entity = {
      id: randomUUID(),
      ...fields,
      createdAt: new Date().toISOString(),
    };
    const keys = Object.keys(entity);
    db.prepare(
      `INSERT INTO ${kind} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    ).run(...Object.values(entity));
    return entity;
  }

  function requireProject(id) {
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id))
      throw new HttpError(400, 'El proyecto seleccionado no existe.');
  }

  function get(kind, id) {
    if (!tables.has(kind)) throw new Error('Unknown collection');
    const entity = db.prepare(`SELECT * FROM ${kind} WHERE id = ?`).get(id);
    if (!entity) throw new HttpError(404, 'No se encontró el elemento.');
    return { ...entity };
  }

  try {
    db.exec('BEGIN IMMEDIATE');
    if (
      !db.prepare("SELECT value FROM metadata WHERE key = 'initialized'").get()
    ) {
      db.prepare(
        'INSERT OR IGNORE INTO profile (id,name,role,bio,email) VALUES (1,?,?,?,?)',
      ).run('Explorador', 'Creador', '', '');
      if (seed) seedWorkspace(insert);
      db.prepare('INSERT INTO metadata (key,value) VALUES (?,?)').run(
        'initialized',
        '1',
      );
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    db.close();
    throw error;
  }

  return {
    insert,
    get,
    update(kind, id, fields) {
      get(kind, id);
      if (kind === 'tasks' && Object.hasOwn(fields, 'projectId'))
        requireProject(fields.projectId);
      db.prepare(
        `UPDATE ${kind} SET ${Object.keys(fields)
          .map((key) => `${key} = ?`)
          .join(',')} WHERE id = ?`,
      ).run(...Object.values(fields), id);
      return get(kind, id);
    },
    delete(kind, id) {
      get(kind, id);
      db.prepare(`DELETE FROM ${kind} WHERE id = ?`).run(id);
    },
    workspace() {
      return {
        projects: db.prepare('SELECT * FROM projects ORDER BY rowid').all(),
        tasks: db.prepare('SELECT * FROM tasks ORDER BY rowid').all(),
        resources: db.prepare('SELECT * FROM resources ORDER BY rowid').all(),
        profile: db
          .prepare('SELECT name,role,bio,email FROM profile WHERE id = 1')
          .get(),
      };
    },
    updateProfile(fields) {
      db.prepare(
        `UPDATE profile SET ${Object.keys(fields)
          .map((key) => `${key} = ?`)
          .join(',')} WHERE id = 1`,
      ).run(...Object.values(fields));
      return db
        .prepare('SELECT name,role,bio,email FROM profile WHERE id = 1')
        .get();
    },
    close() {
      db.close();
    },
  };
}

function seedWorkspace(insert) {
  const orbit = insert('projects', {
    title: 'Órbita creativa',
    description:
      'Una identidad visual para ideas que merecen salir al mundo. Explorar, conectar y dar forma a lo que viene.',
    category: 'Diseño',
    color: 'purple',
    status: 'active',
  });
  const web = insert('projects', {
    title: 'YitVerse web',
    description:
      'Construir un pequeño universo digital donde proyectos, ideas y recursos encuentren su lugar.',
    category: 'Desarrollo',
    color: 'lime',
    status: 'active',
  });
  const lab = insert('projects', {
    title: 'Laboratorio de ideas',
    description:
      'Un espacio para probar sin miedo: pequeñas hipótesis, nuevos caminos y mucha curiosidad.',
    category: 'Producto',
    color: 'blue',
    status: 'active',
  });
  const date = (offset) => {
    const value = new Date();
    value.setUTCDate(value.getUTCDate() + offset);
    return value.toISOString().slice(0, 10);
  };
  for (const task of [
    {
      title: 'Explorar referencias visuales',
      projectId: orbit.id,
      status: 'done',
      priority: 'medium',
      dueDate: date(-1),
    },
    {
      title: 'Diseñar el primer moodboard',
      projectId: orbit.id,
      status: 'in-progress',
      priority: 'high',
      dueDate: date(0),
    },
    {
      title: 'Definir la paleta de color',
      projectId: orbit.id,
      status: 'todo',
      priority: 'medium',
      dueDate: date(2),
    },
    {
      title: 'Dar forma al dashboard',
      projectId: web.id,
      status: 'in-progress',
      priority: 'high',
      dueDate: date(1),
    },
    {
      title: 'Conectar las primeras ideas',
      projectId: web.id,
      status: 'done',
      priority: 'medium',
      dueDate: date(-2),
    },
    {
      title: 'Probar la experiencia en móvil',
      projectId: web.id,
      status: 'todo',
      priority: 'medium',
      dueDate: date(4),
    },
    {
      title: 'Escribir tres nuevas hipótesis',
      projectId: lab.id,
      status: 'todo',
      priority: 'low',
      dueDate: date(3),
    },
    {
      title: 'Reservar tiempo para explorar',
      projectId: lab.id,
      status: 'todo',
      priority: 'low',
      dueDate: null,
    },
  ])
    insert('tasks', task);
  for (const resource of [
    {
      title: 'Un buen punto de partida',
      url: 'https://www.figma.com/community',
      category: 'Diseño',
      description:
        'Plantillas, sistemas de diseño y una comunidad llena de ideas.',
    },
    {
      title: 'La web, bien explicada',
      url: 'https://developer.mozilla.org/es/',
      category: 'Desarrollo',
      description: 'Documentación para construir una web abierta y accesible.',
    },
    {
      title: 'Aprender haciendo',
      url: 'https://www.freecodecamp.org/espanol/',
      category: 'Aprendizaje',
      description: 'Pequeños pasos para desarrollar nuevas habilidades.',
    },
    {
      title: 'Mirar con otros ojos',
      url: 'https://www.are.na/',
      category: 'Inspiración',
      description: 'Colecciones de referencias y conexiones inesperadas.',
    },
  ])
    insert('resources', resource);
}
