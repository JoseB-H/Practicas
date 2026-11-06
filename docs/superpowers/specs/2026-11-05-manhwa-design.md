# YitVerse — lectura de manhwas

El usuario concreta el producto: servicio para leer manhwas y solicita un aspecto parecido a olympusxyz.com. La referencia devuelve 403 CONNECT en la red del entorno; no se afirma haber visto ni copiado sus pantallas. Se usa un diseño original de portal de lectura oscuro con violeta, portada destacada panorámica, catálogo de portadas, novedades y ranking editorial. El usuario ya delegó las decisiones y pidió ejecución sin más preguntas.

## Flujo

Inicio, catálogo con búsqueda/géneros/orden, ficha de serie con sinopsis y capítulos, lector vertical con páginas reales y anterior/siguiente, biblioteca y continuar leyendo. Favoritos y progreso separados por navegador mediante una cookie anónima HttpOnly persistida en SQLite; no se inventan cuentas ni sincronización. Obras y capítulos originales de muestra, identificados en el pie de página. Ninguna descarga de obras de terceros ni publicación.

## Contrato exacto

- `GET /api/catalog` -> `{series: Series[], genres: string[]}`.
- `GET /api/series/:slug` -> `{series: Series, chapters: Chapter[]}`.
- `GET /api/chapters/:id` -> `{series: Series, chapter: Chapter, pages: Page[], previousChapterId: string|null, nextChapterId: string|null}`.
- `GET /api/reader` -> `{savedIds: string[], progress: ReadingProgress[]}`; crea o reutiliza una cookie anónima `yv_reader`, Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000. Cookies inválidas reciben una identidad nueva.
- `PUT /api/reader/library/:seriesId` -> 200 `{seriesId}`; idempotente y sin cuerpo.
- `DELETE /api/reader/library/:seriesId` -> 204; idempotente.
- `PATCH /api/reader/progress/:seriesId` con `{chapterId,pageIndex}` -> ReadingProgress; valida capítulo perteneciente a la serie e índice entero dentro del número de páginas.
- Errores JSON `{error}`, 400 datos inválidos, 404 inexistentes, 405 método. Mantener API anterior y sus datos para evitar pérdidas, aunque la interfaz principal cambie.

`Series = {id,slug,title,alternativeTitle,description,author,artist,year,type,genres:string[],status:'En emisión'|'Completado',coverIndex:number,rating:number,chapterCount:number,latestChapter:number,updatedAt:string}`. Todos los strings salvo year/rating/counts/coverIndex numéricos. `type='Manhwa'`; rating es puntuación editorial de los ejemplos, no valoraciones de usuarios.

`Chapter = {id,seriesId,number:number,title,publishedAt:string,pageCount:number}`.
`Page = {url,alt,width:number,height:number}`.
`ReadingProgress = {seriesId,chapterId,pageIndex:number,updatedAt:string}`.

## Catálogo de muestra y rutas de arte

Seis series con IDs iguales a sus slugs; tres capítulos reales por serie, tres páginas por capítulo. IDs de capítulos `${slug}-${number}`; páginas `/art/chapters/${slug}-${number}-${page}.svg`, con page 1..3. No mostrar cifras de capítulos superiores a los disponibles.

1. `heredero-del-eclipse`, El heredero del eclipse; Fantasía/Acción; coverIndex 0; autor YitVerse Studio; joven espadachín de cabello oscuro y espada violeta entre ruinas.
2. `jardin-de-sombras`, Jardín de sombras; Romance/Drama; coverIndex 1; joven noble de cabello plateado entre rosas bajo la luna.
3. `nivel-cero`, Nivel cero; Acción/Sistema; coverIndex 2; cazador joven con chaqueta negra y portal cian en una ciudad.
4. `ultima-hechicera`, La última hechicera; Fantasía/Aventura; coverIndex 3; hechicera de cabello rojo y magia dorada.
5. `contrato-de-medianoche`, Contrato de medianoche; Romance/Sobrenatural; coverIndex 4; pareja de aristócratas con tonos burdeos y elegancia gótica.
6. `academia-del-vacio`, Academia del vacío; Acción/Academia; coverIndex 5; aprendiz de cabello blanco en academia flotante con magia azul.

Las portadas usan una ilustración original en atlas 3 columnas × 2 filas, orden de lectura, `/art/covers.png`. El banner `/art/hero.png` es original y panorámico. Las páginas de lectura originales SVG incluyen viñetas y diálogos españoles legibles, no solo portadas repetidas.

## Implementación y límites

Mantener React/TypeScript/Vite y Node24/SQLite. Conservar datos anteriores sin resets ni eliminación de tablas. Nuevos datos de lectura aislados por cookie, se mantienen tras reiniciar y no se comparten entre visitantes. Evitar raspar contenido externo. Sin publicación, sin push a GitHub.

## Verificación

Pruebas de API para catálogo/capítulos, pertenencia e índices, persistencia y aislamiento de dos visitantes. Navegador: catálogo y filtros, ficha y capítulos, lectura anterior/siguiente, biblioteca tras recarga, continuar leyendo, teclado y móvil, errores y rutas inexistentes. Compilación, peticiones de producción y capturas finales.
