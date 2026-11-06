import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './database.mjs';
import { HttpError, validate } from './validation.mjs';
import { createManhwaApi } from './manhwa.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const BODY_LIMIT = 64 * 1024;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function json(response, status, body, headers = {}) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    let chunks = [];
    let failed = false;
    request.on('data', (chunk) => {
      if (failed) return;
      size += chunk.length;
      if (size > BODY_LIMIT) {
        failed = true;
        chunks = [];
        reject(new HttpError(400, 'El cuerpo supera el límite de 64 KB.'));
      } else chunks.push(chunk);
    });
    request.on('end', () => {
      if (failed) return;
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new HttpError(400, 'El cuerpo debe contener JSON válido.'));
      }
    });
    request.on('error', () =>
      reject(new HttpError(400, 'No se pudo leer la solicitud.')),
    );
    request.on('aborted', () =>
      reject(new HttpError(400, 'La solicitud se interrumpió.')),
    );
  });
}

function allow(method, methods) {
  if (!methods.includes(method))
    throw new HttpError(405, 'Este método no está permitido.', {
      allow: methods.join(', '),
    });
}

async function serveStatic(request, response, pathname, distPath) {
  allow(request.method, ['GET', 'HEAD']);
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new HttpError(400, 'La ruta no es válida.');
  }
  if (
    decoded.includes('\\') ||
    decoded.includes('\0') ||
    decoded.split('/').some((part) => part.startsWith('.'))
  ) {
    throw new HttpError(404, 'No se encontró la página.');
  }
  const directory = resolve(distPath);
  const requested = resolve(directory, `.${decoded}`);
  if (requested !== directory && !requested.startsWith(`${directory}${sep}`))
    throw new HttpError(404, 'No se encontró la página.');
  let canonicalRoot;
  try {
    canonicalRoot = await realpath(directory);
  } catch {
    throw new HttpError(
      404,
      'La interfaz todavía no está compilada. Ejecuta npm run build.',
    );
  }
  async function existingFile(path) {
    try {
      const canonical = await realpath(path);
      if (!canonical.startsWith(`${canonicalRoot}${sep}`)) return null;
      return (await stat(canonical)).isFile() ? canonical : null;
    } catch {
      return null;
    }
  }
  let file = await existingFile(requested);
  if (!file && !extname(decoded) && !decoded.startsWith('/assets/'))
    file = await existingFile(resolve(directory, 'index.html'));
  if (!file) throw new HttpError(404, 'No se encontró el archivo.');
  const data = await readFile(file);
  response.writeHead(200, {
    'content-type':
      MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': data.length,
    'cache-control':
      extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600',
  });
  response.end(request.method === 'HEAD' ? undefined : data);
}

export function createApp({
  dbPath = process.env.YITVERSE_DB_PATH ||
    resolve(root, '.data/yitverse.sqlite'),
  seed = true,
  distPath = resolve(root, 'dist'),
} = {}) {
  const database = openDatabase(dbPath, seed);
  let manhwa;
  try {
    manhwa = createManhwaApi({ dbPath, json, readJson, allow });
  } catch (error) {
    database.close();
    throw error;
  }
  const server = createServer(async (request, response) => {
    response.setHeader('x-content-type-options', 'nosniff');
    try {
      let pathname;
      try {
        pathname = new URL(request.url, 'http://localhost').pathname;
      } catch {
        throw new HttpError(400, 'La ruta no es válida.');
      }
      if (await manhwa.handle(request, response, pathname)) return;
      if (pathname === '/api/workspace') {
        allow(request.method, ['GET']);
        return json(response, 200, database.workspace());
      }
      if (pathname === '/api/profile') {
        allow(request.method, ['PATCH']);
        const fields = validate('profile', await readJson(request));
        return json(response, 200, database.updateProfile(fields));
      }
      const match = /^\/api\/(projects|tasks|resources)(?:\/([^/]+))?$/.exec(
        pathname,
      );
      if (match) {
        const [, kind, id] = match;
        if (!id) {
          allow(request.method, ['POST']);
          const fields = validate(kind, await readJson(request), true);
          return json(response, 201, database.insert(kind, fields));
        }
        allow(
          request.method,
          kind === 'resources' ? ['DELETE'] : ['PATCH', 'DELETE'],
        );
        database.get(kind, id);
        if (request.method === 'DELETE') {
          database.delete(kind, id);
          response.writeHead(204);
          return response.end();
        }
        const fields = validate(kind, await readJson(request));
        return json(response, 200, database.update(kind, id, fields));
      }
      if (pathname === '/api' || pathname.startsWith('/api/'))
        throw new HttpError(404, 'No se encontró la ruta de la API.');
      await serveStatic(request, response, pathname, distPath);
    } catch (error) {
      if (response.writableEnded || response.destroyed) return;
      if (error instanceof HttpError)
        json(response, error.status, { error: error.message }, error.headers);
      else {
        console.error('YitVerse: error al procesar la solicitud.', error);
        json(response, 500, {
          error: 'Ocurrió un error al procesar la solicitud.',
        });
      }
    }
  });
  let closing;
  return {
    server,
    close() {
      if (!closing) {
        closing = new Promise((resolveClose, reject) => {
          server.close((error) => {
            if (error && error.code !== 'ERR_SERVER_NOT_RUNNING') {
              reject(error);
              return;
            }
            try {
              try {
                manhwa.close();
              } finally {
                database.close();
              }
              resolveClose();
            } catch (closeError) {
              reject(closeError);
            }
          });
          server.closeIdleConnections();
        });
      }
      return closing;
    },
  };
}
