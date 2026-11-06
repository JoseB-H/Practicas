# YitVerse — manhwas en español

Portal de lectura con catálogo, géneros, fichas de series, capítulos, biblioteca y progreso por navegador. El diseño oscuro con violeta y las ilustraciones son originales. Olympus fue la referencia solicitada, pero su sitio devolvió 403 desde la red del entorno; no se afirma haber reproducido sus pantallas exactas.

## Iniciar

Node.js 24 o posterior y npm.

```sh
cd /workspace/Practicas
npm ci
npm run dev
```

Vite sirve la interfaz en el puerto 5173 y reenvía `/api` al servidor Node en el puerto 3001. Ctrl+C detiene ambos procesos. Las dependencias ya están instaladas en este entorno.

Cada tarea de este entorno utiliza un checkout aislado. Usa el existente y no crees un worktree adicional salvo petición explícita.

## Compilar y ejecutar

```sh
npm run build
npm start
```

En este modo, el servidor Node sirve `dist/`, las ilustraciones y la API en el mismo puerto. Por defecto escucha únicamente en loopback. Los procesos se deben arrancar de nuevo tras restaurar el entorno.

| Variable opcional  | Valor predeterminado    | Función               |
| ------------------ | ----------------------- | --------------------- |
| `HOST`             | `127.0.0.1`             | Interfaz del servidor |
| `PORT`             | `3001`                  | Puerto del servidor   |
| `YITVERSE_DB_PATH` | `.data/yitverse.sqlite` | Base SQLite           |

Vite espera el puerto 3001 en desarrollo. Si lo cambias, ajusta también su proxy en `vite.config.mjs`.

## Funciones de esta versión

- Inicio con destacado navegable, catálogo, novedades y selección editorial.
- Buscar títulos, filtrar géneros/estado y ordenar por fecha, nombre o puntuación editorial.
- Fichas con sinopsis, autores y capítulos reales disponibles.
- Lectura vertical con imágenes locales, ancho ajustable, selector y capítulo anterior/siguiente. Las flechas izquierda/derecha también cambian de capítulo.
- Biblioteca personal y botón para continuar desde la página leída.
- Progreso automático con escrituras ordenadas, incluso si se cierra el lector y se abre otro capítulo antes de terminar un guardado.
- Interfaz móvil, búsqueda desplegable, menú nativo y estados de error recuperables.

## Contenido y datos

El catálogo inicial contiene **6 historias originales de muestra, 18 capítulos y 54 páginas SVG** con diálogos en español. Las dos ilustraciones PNG del portal y de las portadas son originales; no se descarga contenido de terceros. La puntuación mostrada es editorial de las muestras, no votos de usuarios reales.

`server/manhwa-content.mjs` declara el catálogo inicial. `scripts/generate-demo-chapters.mjs` permite regenerar las páginas originales. Los archivos se encuentran en `public/art/`; sus rutas coinciden con los metadatos del servidor.

SQLite conserva catálogo, biblioteca y progreso en `.data/yitverse.sqlite`, ignorado por Git. La cookie anónima `yv_reader` es HttpOnly, SameSite=Lax y dura un año. Cada navegador recibe una identidad distinta; su biblioteca no se comparte con otros visitantes. Borrar la cookie genera una biblioteca nueva. No hay cuentas ni sincronización entre dispositivos.

Las tablas y rutas de la anterior versión de proyectos se conservan para evitar pérdida de datos. Su interfaz se sustituyó y se guardó una copia del código anterior en `/workspace/backups/` antes del cambio.

## Comprobar

```sh
npm test
npm run test:e2e
npm run build
npm run format:check
```

Las pruebas API usan HTTP real y SQLite temporal. Las de navegador verifican catálogo, filtros, lector, capítulos, biblioteca, progreso, errores, móvil y concurrencia de guardado. Playwright utiliza `/usr/bin/chromium` cuando está disponible; en otra máquina instala el navegador con `npx playwright install chromium`. Los puertos 3001 y 5173 deben estar libres.

## Alcance

Es una primera versión funcional con catálogo de demostración, sin panel editorial de subida, cuentas, pagos ni catálogo comercial conectado. Para ofrecer obras reales habrá que incorporar ese contenido y el flujo editorial correspondiente. Esta entrega no publica el entorno ni sube cambios a GitHub.
