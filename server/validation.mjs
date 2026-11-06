export class HttpError extends Error {
  constructor(status, message, headers = {}) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

const fail = (message) => {
  throw new HttpError(400, message);
};

function string(value, field, max, required = false) {
  if (typeof value !== 'string') fail(`${field} debe ser texto.`);
  const trimmed = value.trim();
  if (required && !trimmed) fail(`${field} es obligatorio.`);
  if (trimmed.length > max) fail(`${field} admite hasta ${max} caracteres.`);
  return trimmed;
}

function enumeration(value, field, options) {
  if (!options.includes(value)) fail(`${field} no tiene un valor válido.`);
  return value;
}

function date(value) {
  if (value === null) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail('La fecha debe tener el formato AAAA-MM-DD.');
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    fail('La fecha no existe en el calendario.');
  }
  return value;
}

function url(value) {
  const clean = string(value, 'La URL', 2048, true);
  let parsed;
  try {
    parsed = new URL(clean);
  } catch {
    fail('Introduce una URL completa válida.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol))
    fail('La URL debe usar http o https.');
  return clean;
}

const fields = {
  projects: {
    title: (value) => string(value, 'El título', 120, true),
    description: (value) => string(value, 'La descripción', 2000),
    category: (value) =>
      enumeration(value, 'La categoría', [
        'Producto',
        'Diseño',
        'Desarrollo',
        'Comunidad',
      ]),
    color: (value) =>
      enumeration(value, 'El color', ['lime', 'purple', 'blue', 'orange']),
    status: (value) => enumeration(value, 'El estado', ['active', 'completed']),
  },
  tasks: {
    title: (value) => string(value, 'El título', 120, true),
    projectId: (value) => string(value, 'El proyecto', 100, true),
    status: (value) =>
      enumeration(value, 'El estado', ['todo', 'in-progress', 'done']),
    priority: (value) =>
      enumeration(value, 'La prioridad', ['low', 'medium', 'high']),
    dueDate: date,
  },
  resources: {
    title: (value) => string(value, 'El título', 120, true),
    url,
    category: (value) =>
      enumeration(value, 'La categoría', [
        'Diseño',
        'Desarrollo',
        'Aprendizaje',
        'Inspiración',
      ]),
    description: (value) => string(value, 'La descripción', 2000),
  },
  profile: {
    name: (value) => string(value, 'El nombre', 80, true),
    role: (value) => string(value, 'El rol', 100, true),
    bio: (value) => string(value, 'La biografía', 500),
    email: (value) => {
      const clean = string(value, 'El correo electrónico', 254);
      if (clean && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))
        fail('Introduce un correo electrónico válido.');
      return clean;
    },
  },
};

const defaults = {
  projects: {
    description: '',
    category: 'Producto',
    color: 'lime',
    status: 'active',
  },
  tasks: { status: 'todo', priority: 'medium', dueDate: null },
  resources: { category: 'Inspiración', description: '' },
};

const required = {
  projects: ['title'],
  tasks: ['title', 'projectId'],
  resources: ['title', 'url'],
};

export function validate(kind, body, creating = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    fail('El cuerpo debe ser un objeto JSON.');
  const validators = fields[kind];
  const result = creating ? { ...defaults[kind] } : {};
  for (const key of Object.keys(body)) {
    if (!Object.hasOwn(validators, key)) {
      fail(
        ['id', 'createdAt'].includes(key)
          ? `${key} lo genera el servidor y no se puede cambiar.`
          : `El campo ${key} no está permitido.`,
      );
    }
    result[key] = validators[key](body[key]);
  }
  if (creating) {
    for (const key of required[kind]) {
      if (!Object.hasOwn(result, key)) fail(`El campo ${key} es obligatorio.`);
    }
  } else if (Object.keys(result).length === 0)
    fail('Incluye al menos un campo para actualizar.');
  return result;
}
