const entries = [
  {
    slug: 'heredero-del-eclipse',
    title: 'El heredero del eclipse',
    alternativeTitle: 'Heir of the Eclipse',
    description:
      'Cuando el sol desaparece sobre las ruinas de Aster, una marca despierta en la mano de Kael. Su espada violeta es la única luz capaz de abrir un camino entre las sombras, pero cada golpe revela una memoria que el reino quiso borrar.',
    genres: ['Fantasía', 'Acción'],
    rating: 9.8,
    chapters: [
      'La marca de ceniza',
      'La espada sin sombra',
      'El alba prohibida',
    ],
  },
  {
    slug: 'jardin-de-sombras',
    title: 'Jardín de sombras',
    alternativeTitle: 'Garden of Shadows',
    description:
      'Liora regresa a la mansión de su familia con una carta que nadie recuerda haber escrito. Entre rosas que solo florecen de noche, descubrirá que algunas promesas sobreviven incluso a quienes las hicieron.',
    genres: ['Romance', 'Drama'],
    rating: 9.6,
    chapters: [
      'La rosa imposible',
      'El invernadero cerrado',
      'La promesa de invierno',
    ],
  },
  {
    slug: 'nivel-cero',
    title: 'Nivel cero',
    alternativeTitle: 'Level Zero',
    description:
      'Todos los cazadores de Neo Seúl reciben una habilidad al cruzar su primer portal. A Iker le asignan un error. Cuando la ciudad empieza a congelarse, ese fallo en el sistema podría convertirse en su única oportunidad.',
    genres: ['Acción', 'Sistema'],
    rating: 9.7,
    chapters: ['Error de acceso', 'La ciudad bajo cero', 'Reinicio'],
  },
  {
    slug: 'ultima-hechicera',
    title: 'La última hechicera',
    alternativeTitle: 'The Last Spellkeeper',
    description:
      'La magia se apaga en los mapas, en las ciudades y en los recuerdos. Aira conserva una última llama dorada y una pregunta: ¿quién decidió que el mundo debía olvidar sus hechizos? Su viaje empieza donde terminan los caminos.',
    genres: ['Fantasía', 'Aventura'],
    rating: 9.5,
    chapters: ['La llama que queda', 'El mapa de las brasas', 'Un cielo nuevo'],
  },
  {
    slug: 'contrato-de-medianoche',
    title: 'Contrato de medianoche',
    alternativeTitle: 'The Midnight Covenant',
    description:
      'Un baile, un nombre prestado y un contrato firmado antes de medianoche. Elia acepta proteger el secreto de un aristócrata a cambio de recuperar su libertad. Ninguno de los dos ha leído todavía la última cláusula.',
    genres: ['Romance', 'Sobrenatural'],
    rating: 9.4,
    chapters: [
      'La cláusula olvidada',
      'El nombre del huésped',
      'Antes del amanecer',
    ],
  },
  {
    slug: 'academia-del-vacio',
    title: 'Academia del vacío',
    alternativeTitle: 'Academy of the Void',
    description:
      'En una academia suspendida sobre las nubes, aprender a controlar la gravedad es una cuestión de supervivencia. Nao llega sin apellido ni talento aparente, justo el día en que una de las islas empieza a caer.',
    genres: ['Acción', 'Academia'],
    rating: 9.3,
    chapters: ['La isla que cae', 'El aula de gravedad', 'El primer juramento'],
  },
];

export const sampleSeries = entries.map((entry, coverIndex) => ({
  id: entry.slug,
  slug: entry.slug,
  title: entry.title,
  alternativeTitle: entry.alternativeTitle,
  description: entry.description,
  author: 'YitVerse Studio',
  artist: 'YitVerse Studio',
  year: 2026,
  type: 'Manhwa',
  genres: entry.genres,
  status: coverIndex === 4 ? 'Completado' : 'En emisión',
  coverIndex,
  rating: entry.rating,
  chapterCount: 3,
  latestChapter: 3,
  updatedAt: `2026-11-0${3 + (coverIndex % 3)}T12:00:00.000Z`,
}));

export const sampleChapters = entries.flatMap((entry, seriesIndex) =>
  entry.chapters.map((title, index) => ({
    id: `${entry.slug}-${index + 1}`,
    seriesId: entry.slug,
    number: index + 1,
    title,
    publishedAt: `2026-11-0${index + 1 + (seriesIndex % 3)}T12:00:00.000Z`,
    pageCount: 3,
  })),
);
