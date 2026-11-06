import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Original sample stories and vector drawings. No downloaded artwork or fonts.
const output = fileURLToPath(
  new URL('../public/art/chapters/', import.meta.url),
);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[c],
  );
const series = [
  {
    slug: 'heredero-del-eclipse',
    title: 'El heredero del eclipse',
    name: 'IAN',
    partner: 'NARA',
    kind: 'ruins',
    ink: '#27203e',
    light: '#c3a6ff',
    glow: '#9672ff',
    hair: '#151626',
    coat: '#242637',
    accent: '#a383ff',
    skin: '#eac9b9',
    chapters: [
      'La marca de ceniza',
      'La espada sin sombra',
      'El alba prohibida',
    ],
    pages: [
      [
        'La ciudad bajo el sol negro.',
        'wide',
        'El eclipse no se ha movido en cien años.',
        'close',
        'Entonces, ¿por qué mi sombra está huyendo?',
        'relic',
        'Esa marca… era el sello de mi padre.',
      ],
      [
        'Una voz en las ruinas.',
        'duo',
        'No toques la espada. Está esperando a alguien.',
        'relic',
        'No espera a un rey. Espera una respuesta.',
        'action',
        '¡Pues dile que ya he llegado!',
      ],
      [
        'La piedra recuerda.',
        'action',
        'La hoja no corta la piedra… ¡corta su sombra!',
        'close',
        'Tu padre también oyó esa voz, Ian.',
        'wide',
        'Entonces seguiré el camino que él dejó.',
      ],
      [
        'Al otro lado de la grieta.',
        'wide',
        'Aquí el eclipse proyecta dos sombras.',
        'close',
        'Una es tuya. La otra aún no ha nacido.',
        'relic',
        'La brújula señala hacia mi propia espada.',
      ],
      [
        'El guardián sin rostro.',
        'duo',
        'Para pasar, debes entregar tu recuerdo más feliz.',
        'close',
        'No. Mi pasado no es una moneda.',
        'action',
        '¡Buscaré una puerta que no cobre ese precio!',
      ],
      [
        'Una salida dibujada en luz.',
        'action',
        'Si corto la sombra del muro…',
        'relic',
        'La piedra conserva la forma de una puerta.',
        'wide',
        'Padre, esta vez voy a elegir mi camino.',
      ],
      [
        'La torre del primer amanecer.',
        'wide',
        'Arriba guardan el último minuto de sol.',
        'duo',
        'Liberarlo también despertará a la ciudad.',
        'close',
        'Entonces nadie tendrá que despertar solo.',
      ],
      [
        'El precio de la corona.',
        'relic',
        'La corona no pide sangre. Pide un nombre.',
        'close',
        'Ya tengo uno. Me lo dio alguien que me quería.',
        'action',
        '¡No soy el heredero de tu oscuridad!',
      ],
      [
        'Un minuto basta.',
        'action',
        '¡Nara, abre las ventanas!',
        'wide',
        'Por primera vez, las ruinas proyectaron luz.',
        'close',
        'No era el fin del eclipse. Era el comienzo.',
      ],
    ],
  },
  {
    slug: 'jardin-de-sombras',
    title: 'Jardín de sombras',
    name: 'ELIA',
    partner: 'LEÓN',
    kind: 'garden',
    ink: '#302035',
    light: '#efc9eb',
    glow: '#e69bbd',
    hair: '#e4ddec',
    coat: '#4a2941',
    accent: '#e9b6c9',
    skin: '#f0d1c3',
    chapters: [
      'La rosa imposible',
      'El invernadero cerrado',
      'La promesa de invierno',
    ],
    pages: [
      [
        'Una flor fuera de estación.',
        'wide',
        'Todas las rosas murieron con la primera nieve.',
        'relic',
        'Todas… excepto esta.',
        'close',
        '¿Quién ha escrito mi nombre en sus pétalos?',
      ],
      [
        'Un visitante a medianoche.',
        'duo',
        'No debería estar aquí, lady Elia.',
        'close',
        'Entonces somos dos rompiendo las reglas.',
        'relic',
        'Esa llave abre el jardín que mi madre cerró.',
      ],
      [
        'Tras la verja.',
        'wide',
        'Pensé que encontraría un secreto terrible.',
        'duo',
        'Solo conservaba las cosas que no pudo decir.',
        'close',
        'A veces una carta necesita veinte inviernos.',
      ],
      [
        'El corazón de cristal.',
        'wide',
        'El invernadero estaba cálido. Y vacío.',
        'relic',
        'Esta cinta pertenecía a mi madre.',
        'close',
        'León… ¿cómo conocía usted esta habitación?',
      ],
      [
        'Lo que guardan las flores.',
        'duo',
        'Mi padre fue el jardinero de esta casa.',
        'relic',
        'Prometió cuidar de la última semilla.',
        'close',
        '¿Y usted heredó también sus silencios?',
      ],
      [
        'La primera verdad.',
        'close',
        'Heredé una deuda. Pero venir fue decisión mía.',
        'duo',
        'Entonces quédese por una razón diferente.',
        'wide',
        'Las rosas florecieron antes de la respuesta.',
      ],
      [
        'La noche más larga.',
        'wide',
        'Mañana venderán la casa y cerrarán el jardín.',
        'close',
        'Nos queda una noche para salvarlo.',
        'relic',
        'No necesitamos oro. Necesitamos estas cartas.',
      ],
      [
        'La memoria de una casa.',
        'duo',
        'Cada familia del valle plantó aquí una rosa.',
        'relic',
        'El jardín nunca perteneció a una sola persona.',
        'action',
        '¡Abrid las puertas! Que entren todos.',
      ],
      [
        'Cuando vuelve la primavera.',
        'wide',
        'La casa abrió sus ventanas al primer deshielo.',
        'duo',
        '¿Y si ahora plantamos algo nuestro?',
        'close',
        'Esta vez, no dejaremos nada sin decir.',
      ],
    ],
  },
  {
    slug: 'nivel-cero',
    title: 'Nivel cero',
    name: 'KAI',
    partner: 'VERA',
    kind: 'city',
    ink: '#132b39',
    light: '#b2f5f3',
    glow: '#5ce8ed',
    hair: '#161e28',
    coat: '#1b2835',
    accent: '#62edf3',
    skin: '#e5c8b5',
    chapters: ['Error de acceso', 'La ciudad bajo cero', 'Reinicio'],
    pages: [
      [
        'Distrito 8 · 03:17.',
        'wide',
        'El portal se abrió después del último tren.',
        'close',
        'Todos recibieron un rango. Yo recibí un error.',
        'relic',
        'NIVEL 0. ACCESO NO REGISTRADO.',
      ],
      [
        'Nadie mira hacia abajo.',
        'duo',
        'Sin rango no puedes entrar, Kai.',
        'close',
        'Mi hermana está al otro lado.',
        'action',
        'Puedes quitarme el rango. No la razón.',
      ],
      [
        'Un paso fuera del sistema.',
        'action',
        'El portal no me rechaza…',
        'relic',
        'Me está mostrando las costuras.',
        'wide',
        'Hay otra ciudad debajo de la nuestra.',
      ],
      [
        'La ciudad que nadie recuerda.',
        'wide',
        'Los edificios están aquí. Sus nombres, no.',
        'duo',
        'El sistema borra lo que no puede clasificar.',
        'close',
        'Entonces no soy un error. Soy una excepción.',
      ],
      [
        'Una puerta sin coordenadas.',
        'relic',
        'Ella dejó esta señal para mí.',
        'close',
        '¿Una grulla de papel, en medio de todo esto?',
        'action',
        'Siempre dijo que encontraría el camino a casa.',
      ],
      [
        'El monstruo de los números.',
        'action',
        '¡No ataques su armadura! Mira su sombra.',
        'relic',
        'Cada número es una persona atrapada.',
        'duo',
        'Vamos a devolverles sus nombres.',
      ],
      [
        'El centro del laberinto.',
        'wide',
        'Aquí nacen todos los portales de la ciudad.',
        'close',
        'Y aquí escondieron a los que no encajaban.',
        'relic',
        'REINICIO DISPONIBLE. COSTE: TU RANGO.',
      ],
      [
        'La elección más fácil.',
        'duo',
        'Si lo haces, nadie sabrá que fuiste tú.',
        'close',
        'No vine para que me recordaran.',
        'action',
        '¡Vine para que pudieran volver!',
      ],
      [
        'Un mundo sin marcador.',
        'action',
        'Los portales se cerraron desde dentro.',
        'wide',
        'Al amanecer, todas las estaciones tenían nombre.',
        'close',
        'Nivel cero. Por primera vez, me parece suficiente.',
      ],
    ],
  },
  {
    slug: 'ultima-hechicera',
    title: 'La última hechicera',
    name: 'IRIA',
    partner: 'SOL',
    kind: 'forest',
    ink: '#33243c',
    light: '#ffe7ae',
    glow: '#f7be61',
    hair: '#b54d3e',
    coat: '#55415a',
    accent: '#ffd17c',
    skin: '#efd0b8',
    chapters: ['La llama que queda', 'El mapa de las brasas', 'Un cielo nuevo'],
    pages: [
      [
        'El bosque después del fuego.',
        'wide',
        'Dicen que la magia se apagó hace diez años.',
        'relic',
        'Entonces… ¿qué está latiendo aquí?',
        'close',
        'No es una brasa. Es una estrella.',
      ],
      [
        'Una voz entre las hojas.',
        'duo',
        'Si puedes oírla, aún no es demasiado tarde.',
        'close',
        '¿Demasiado tarde para qué?',
        'relic',
        'Para devolver al cielo lo que perdió.',
      ],
      [
        'La primera chispa.',
        'action',
        'No recuerdo ningún hechizo.',
        'relic',
        'La estrella respondió al sonido de su nombre.',
        'close',
        'Quizá recordar no sea el único camino.',
      ],
      [
        'Un mapa que solo arde de noche.',
        'wide',
        'Las brasas dibujan rutas entre los árboles.',
        'relic',
        'Tres torres. Tres luces que siguen vivas.',
        'duo',
        'Y una de ellas acaba de apagarse.',
      ],
      [
        'La biblioteca del viento.',
        'wide',
        'Aquí guardaban cada hechizo que alguien inventó.',
        'close',
        'Todos los libros están en blanco.',
        'relic',
        'La magia no se perdió. Dejó de compartirse.',
      ],
      [
        'Palabras para una llama nueva.',
        'close',
        'Mi maestra decía que yo pronunciaba todo mal.',
        'action',
        'Pues este hechizo llevará mis propias palabras.',
        'wide',
        'El bosque escuchó. Y encendió sus ventanas.',
      ],
      [
        'La torre del último cielo.',
        'wide',
        'Solo queda una estrella en su lugar.',
        'duo',
        'Si subes, quizá no puedas regresar.',
        'close',
        'Entonces construyamos un camino para todos.',
      ],
      [
        'Ninguna magia nace sola.',
        'relic',
        'Una chispa no alcanza para llenar la noche.',
        'duo',
        'Pero el valle entero ha traído sus faroles.',
        'action',
        '¡A la vez! ¡Como lo ensayamos!',
      ],
      [
        'El primer cielo de muchos.',
        'action',
        'La última estrella abrió los ojos.',
        'wide',
        'Y miles de luces encontraron su lugar.',
        'close',
        'Ya no soy la última. Solo fui la primera.',
      ],
    ],
  },
  {
    slug: 'contrato-de-medianoche',
    title: 'Contrato de medianoche',
    name: 'LÍA',
    partner: 'DARIAN',
    kind: 'gothic',
    ink: '#311b33',
    light: '#f1d2ce',
    glow: '#d37998',
    hair: '#382532',
    coat: '#602b40',
    accent: '#e1b6a6',
    skin: '#edc8b8',
    chapters: [
      'La cláusula olvidada',
      'El nombre del huésped',
      'Antes del amanecer',
    ],
    pages: [
      [
        'Una invitación sin remitente.',
        'wide',
        'La mansión solo aparece cuando dan las doce.',
        'relic',
        'Y esta carta lleva mi firma… desde hace cien años.',
        'close',
        'Yo no he firmado nada. Todavía.',
      ],
      [
        'El señor de las horas perdidas.',
        'duo',
        'Bienvenida de nuevo, señorita Lía.',
        'close',
        'No puede recibirme como si nos conociéramos.',
        'relic',
        'Cláusula primera: recordar antes del amanecer.',
      ],
      [
        'Un baile fuera del tiempo.',
        'duo',
        'Si la música termina, la casa desaparecerá.',
        'close',
        'Entonces será mejor que no me pise los pies.',
        'wide',
        'Por un instante, el reloj avanzó.',
      ],
      [
        'La habitación que no existe.',
        'wide',
        'Hay una puerta más de las que muestra el plano.',
        'relic',
        'Dentro, cada espejo guarda una vida posible.',
        'close',
        'En todas apareces tú. ¿Por qué?',
      ],
      [
        'El nombre bajo la tinta.',
        'duo',
        'Hice un trato para que pudieras vivir.',
        'relic',
        'Pero alguien borró la última cláusula.',
        'close',
        'No te pedía que esperaras. Te pedía que siguieras.',
      ],
      [
        'La verdad detrás del cristal.',
        'close',
        'Creí que olvidar sería una forma de salvarte.',
        'duo',
        'Eso también debió ser decisión mía.',
        'action',
        'Esta vez leeremos juntos la letra pequeña.',
      ],
      [
        'A tres minutos del alba.',
        'wide',
        'La casa comienza a recordar sus ruinas.',
        'relic',
        'Cláusula final: el contrato exige dos firmas.',
        'close',
        'Entonces ninguna promesa debe encerrar a uno solo.',
      ],
      [
        'Una promesa diferente.',
        'duo',
        'No puedo ofrecerte cien años más.',
        'close',
        'Ofréceme mañana. Y deja que lo elija.',
        'relic',
        'Ambos tacharon la palabra «siempre».',
      ],
      [
        'La primera mañana.',
        'action',
        'Cuando dieron las seis, nadie desapareció.',
        'wide',
        'La mansión abrió sus puertas a la luz.',
        'duo',
        '¿Un paseo? Creo que nos debemos uno.',
      ],
    ],
  },
  {
    slug: 'academia-del-vacio',
    title: 'Academia del vacío',
    name: 'NOA',
    partner: 'REN',
    kind: 'academy',
    ink: '#1d274b',
    light: '#d6e8ff',
    glow: '#83b7ff',
    hair: '#e3edf6',
    coat: '#273d67',
    accent: '#a4ceff',
    skin: '#edcfbd',
    chapters: ['La isla que cae', 'El aula de gravedad', 'El primer juramento'],
    pages: [
      [
        'Primer día sobre las nubes.',
        'wide',
        'La academia nunca había aceptado a alguien sin don.',
        'close',
        'Quizá mi carta de admisión sea una broma.',
        'relic',
        'La brújula acaba de señalar hacia abajo.',
      ],
      [
        'La prueba de bienvenida.',
        'duo',
        'Si no puedes volar, no te acerques al borde.',
        'close',
        'La isla se está cayendo. ¿No lo sentís?',
        'action',
        '¡Apartaos del puente!',
      ],
      [
        'Un talento que nadie vio.',
        'action',
        'Noa no detuvo la caída.',
        'relic',
        'Detuvo el espacio entre la isla y el cielo.',
        'close',
        '¿Eso cuenta como un don?',
      ],
      [
        'El aula sin suelo.',
        'wide',
        'La profesora dejó caer una pluma. Nunca llegó abajo.',
        'duo',
        'Aquí no entrenamos fuerza. Entrenamos atención.',
        'close',
        'Entonces llevo toda la vida practicando.',
      ],
      [
        'La forma de la ausencia.',
        'relic',
        'Todos ven el cristal. Tú ves lo que lo rodea.',
        'close',
        'Hay una grieta entre las dos mitades.',
        'action',
        'Y algo está intentando cruzarla.',
      ],
      [
        'Un examen imprevisto.',
        'action',
        '¡Ren, necesito un punto fijo!',
        'duo',
        'Toma mi mano. No pienso soltarte.',
        'wide',
        'El aula volvió a tener suelo. Y dos alumnos menos solos.',
      ],
      [
        'La noche del juramento.',
        'wide',
        'La academia se sostiene sobre una sola promesa.',
        'relic',
        'Proteger el cielo… incluso de nosotros mismos.',
        'close',
        'Alguien ha borrado la segunda parte.',
      ],
      [
        'Una lección para los maestros.',
        'duo',
        'El vacío obedece al que no tiene miedo.',
        'close',
        'Tengo miedo. Pero puedo pedir ayuda.',
        'action',
        '¡Todos juntos, sostened las islas!',
      ],
      [
        'Una nueva constelación.',
        'action',
        'Una a una, las torres volvieron a encenderse.',
        'wide',
        'Desde abajo, parecían estrellas aprendiendo a volar.',
        'close',
        'Mañana tenemos clase. Y esta vez, voy a llegar pronto.',
      ],
    ],
  },
];

const polygon = (points, fill, stroke = 'none', width = 1) =>
  `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d, fill, stroke = 'none', width = 1, extra = '') =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const line = (x1, y1, x2, y2, color, width = 1, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const circle = (x, y, r, fill, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const rand = (seed) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

function defs(s) {
  return `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="${s.ink}"/><stop offset="1" stop-color="#080d1c"/></linearGradient>
  <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${s.glow}" stop-opacity="0"/><stop offset="1" stop-color="${s.glow}" stop-opacity=".3"/></linearGradient>
  <linearGradient id="cloth" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${s.coat}"/><stop offset="1" stop-color="#101827"/></linearGradient>
  <linearGradient id="hair" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="${s.hair}"/><stop offset="1" stop-color="${s.ink}"/></linearGradient>
  <linearGradient id="skin" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${s.skin}"/><stop offset=".7" stop-color="${s.skin}"/><stop offset="1" stop-color="#b08283"/></linearGradient>
  <radialGradient id="aura"><stop stop-color="${s.glow}" stop-opacity=".5"/><stop offset="1" stop-color="${s.glow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="metal"><stop stop-color="#f5f1ed"/><stop offset=".35" stop-color="${s.light}"/><stop offset=".52" stop-color="#73809a"/><stop offset=".56" stop-color="#eef1ff"/><stop offset="1" stop-color="${s.glow}"/></linearGradient>
  <pattern id="tones" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="${s.light}" opacity=".16"/></pattern>
  </defs>`;
}

function stars(w, h, s, seed) {
  const r = rand(seed);
  let art = '';
  for (let i = 0; i < 40; i++) {
    const x = r() * w,
      y = r() * h * 0.72;
    art += circle(
      x.toFixed(1),
      y.toFixed(1),
      (r() * 1.8 + 0.5).toFixed(1),
      s.light,
      `opacity="${(0.2 + r() * 0.6).toFixed(2)}"`,
    );
  }
  return art;
}

function rose(x, y, scale, color) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${path('M0 8Q-12 1-9-8Q-3-16 3-9Q12-14 14-4Q19 4 8 10Q4 17 0 8Z', color, '#2c1c36', 1.5)}${path('M1 5Q-7-7 4-6Q12-3 5 4Q1 8-2 0', 'none', '#f2a7bd', 1)}${path('M-3 13Q-20 1-25 11Q-17 22-3 17M5 15Q22 6 24 17Q14 24 5 15', '#3d594c')}</g>`;
}

function scenery(s, w, h, seed, chapter, mode) {
  const r = rand(seed);
  let a =
    rect(0, 0, w, h, 'url(#sky)') +
    stars(w, h, s, seed) +
    circle(w * 0.63, h * 0.39, Math.max(w, h) * 0.42, 'url(#aura)');
  const ground = h * 0.79;
  if (s.kind === 'ruins') {
    a +=
      circle(
        w * 0.73,
        h * 0.25,
        Math.min(w, h) * 0.15,
        s.glow,
        `opacity=".55"`,
      ) + circle(w * 0.73 - 5, h * 0.25 - 3, Math.min(w, h) * 0.145, '#111326');
    for (let k = 0; k < 3; k++) {
      let y = h * (0.42 + k * 0.11);
      a += path(
        `M0 ${y + 90}L${w * 0.2} ${y - 18}L${w * 0.39} ${y + 60}L${w * 0.59} ${y - 35}L${w * 0.82} ${y + 35}L${w} ${y - 10}V${h}H0Z`,
        ['#29263f', '#212438', '#171e2c'][k],
      );
    }
    for (let i = 0; i < 5; i++) {
      let x = w * (i * 0.24 - 0.06),
        ph = h * (0.32 + r() * 0.2);
      a +=
        path(
          `M${x} ${ground}V${ground - ph}l16-16 25 8 4 22h-9v${ph - 14}Z`,
          '#424052',
          '#121724',
          2,
        ) +
        line(
          x + 14,
          ground - ph + 25,
          x + 14,
          ground,
          s.light,
          1,
          'opacity=".25"',
        );
    }
    a += path(`M0 ${ground}L${w} ${ground - 15}V${h}H0Z`, '#151d2a');
    for (let i = 0; i < 10; i++)
      a += line(
        w * 0.5,
        ground,
        w * (i / 8 - 0.1),
        h,
        '#5d5269',
        1.5,
        'opacity=".4"',
      );
    for (let i = 0; i < 8; i++) {
      let x = r() * w,
        y = ground + r() * (h - ground);
      a += polygon(
        `${x},${y} ${x + 20},${y - 17} ${x + 45},${y - 8} ${x + 34},${y + 10}`,
        '#393444',
        '#171b29',
        2,
      );
    }
  } else if (s.kind === 'garden') {
    a +=
      circle(w * 0.76, h * 0.19, Math.min(w, h) * 0.12, '#f1dfee') +
      circle(w * 0.74, h * 0.18, Math.min(w, h) * 0.12, '#30233c');
    a += path(
      `M0 ${ground}Q${w * 0.4} ${ground - 100} ${w} ${ground - 30}V${h}H0Z`,
      '#152c32',
    );
    for (let i = 0; i < 9; i++) {
      let x = (i * w) / 8;
      a += path(
        `M${x} ${ground + 10}V${h * 0.46}M${x - 7} ${h * 0.51}l7-18 7 18`,
        'none',
        '#64716f',
        2,
      );
    }
    a +=
      path(
        `M${w * 0.12} ${ground}V${h * 0.43}Q${w * 0.5} ${h * 0.04} ${w * 0.88} ${h * 0.43}V${ground}`,
        'none',
        '#6f6878',
        10,
      ) +
      path(
        `M${w * 0.17} ${ground}V${h * 0.44}Q${w * 0.5} ${h * 0.13} ${w * 0.83} ${h * 0.44}V${ground}`,
        'none',
        '#a6a1a6',
        1.5,
      );
    for (let i = 0; i < 18; i++) {
      let side = i % 2,
        x = side ? w * 0.86 : w * 0.13,
        y = h * (0.35 + 0.025 * i);
      a +=
        path(`M${x} ${y}q${side ? -25 : 25} 15 0 42`, 'none', '#4f6655', 4) +
        rose(
          x + (r() - 0.5) * 35,
          y,
          0.45 + r() * 0.45,
          i % 3 ? '#923f65' : '#d59bb5',
        );
    }
    a += path(
      `M${w * 0.44} ${ground}L${w * 0.7} ${h}H${w * 0.17}L${w * 0.38} ${ground}Z`,
      '#76626f',
      '#a18b94',
      1,
    );
  } else if (s.kind === 'city') {
    for (let layer = 0; layer < 2; layer++)
      for (let i = 0; i < 9; i++) {
        let bw = w / 7,
          x = i * bw - w * 0.1 + (layer ? bw * 0.4 : 0),
          top = h * (0.15 + r() * 0.4);
        a += rect(x, top, bw * 0.8, h - top, layer ? '#192d3c' : '#14222f');
        for (let j = 0; j < 7; j++)
          for (let k = 0; k < 3; k++)
            if (r() > 0.25)
              a += rect(
                x + 10 + k * bw * 0.2,
                top + 16 + j * 27,
                5,
                10,
                s.glow,
                `opacity="${r() * 0.4 + 0.1}"`,
              );
      }
    a += path(`M0 ${ground}H${w}V${h}H0Z`, '#101b2b');
    for (let i = 0; i < 8; i++)
      a += line(
        w * 0.47,
        ground,
        (w * i) / 6,
        h,
        '#376275',
        1.5,
        'opacity=".6"',
      );
    for (let i = 0; i < 5; i++)
      a += line(
        0,
        ground + i * i * 9,
        w,
        ground + i * i * 9,
        '#376275',
        1.5,
        'opacity=".5"',
      );
    a += `<ellipse cx="${w * 0.65}" cy="${h * 0.49}" rx="${w * 0.22}" ry="${h * 0.32}" fill="#062b36" stroke="${s.glow}" stroke-width="8"/><ellipse cx="${w * 0.65}" cy="${h * 0.49}" rx="${w * 0.19}" ry="${h * 0.29}" fill="url(#aura)" stroke="#c3ffff" stroke-width="2"/>`;
    for (let i = 0; i < 12; i++)
      a += rect(
        w * (0.35 + r() * 0.6),
        h * (0.16 + r() * 0.65),
        r() * 24 + 8,
        2,
        s.glow,
        `opacity="${r() * 0.6 + 0.2}"`,
      );
  } else if (s.kind === 'forest') {
    a += circle(w * 0.62, h * 0.3, Math.min(w, h) * 0.28, 'url(#aura)');
    for (let k = 0; k < 2; k++)
      for (let i = 0; i < 7; i++) {
        let x = (i * w) / 5 - w * 0.15,
          y = h * (0.23 + r() * 0.2),
          z = k ? 1 : 0.7;
        a += path(
          `M${x} ${h}V${y}l${-20 * z} ${-h * 0.2} 25 ${h * 0.1} 30 ${-h * 0.21}-11 ${h * 0.3} 25 ${-h * 0.11}-20 ${h * 0.23}V${h}Z`,
          k ? '#1c2834' : '#383144',
        );
      }
    a += path(
      `M0 ${h * 0.88}Q${w * 0.5} ${h * 0.7} ${w} ${h * 0.88}V${h}H0Z`,
      '#171f2b',
    );
    for (let i = 0; i < 16; i++) {
      let x = r() * w,
        y = h * (0.2 + r() * 0.7);
      a += circle(x, y, 2 + r() * 3, s.glow, `opacity="${r() * 0.6 + 0.2}"`);
    }
    for (let i = 0; i < 5; i++) {
      let x = w * (0.15 + i * 0.18),
        y = h * (0.64 + (i % 2) * 0.08);
      a +=
        rect(x - 8, y, 16, 30, '#ac7446', `rx="3"`) +
        rect(x - 5, y + 3, 10, 20, '#ffe1a3') +
        path(`M${x - 10} ${y}l10-10 10 10Z`, '#70485a');
    }
  } else if (s.kind === 'gothic') {
    a += rect(0, 0, w, h, '#251b2d');
    for (let i = 0; i < 3; i++) {
      let x = w * (i * 0.37 + 0.13),
        ww = w * 0.2;
      a +=
        path(
          `M${x} ${h * 0.72}V${h * 0.23}Q${x + ww / 2} ${-h * 0.02} ${x + ww} ${h * 0.23}V${h * 0.72}Z`,
          '#493448',
          '#927586',
          3,
        ) +
        path(
          `M${x + 8} ${h * 0.7}V${h * 0.25}Q${x + ww / 2} ${h * 0.04} ${x + ww - 8} ${h * 0.25}V${h * 0.7}Z`,
          '#1d293e',
        );
      a +=
        line(x + ww / 2, h * 0.13, x + ww / 2, h * 0.7, '#978095', 3) +
        line(x + 8, h * 0.39, x + ww - 8, h * 0.39, '#978095', 2);
    }
    a +=
      path(`M0 0H${w * 0.2}Q${w * 0.1} ${h * 0.45} 0 ${h * 0.65}Z`, '#6d2f49') +
      path(
        `M${w} 0H${w * 0.8}Q${w * 0.9} ${h * 0.45} ${w} ${h * 0.65}Z`,
        '#6d2f49',
      );
    a += path(`M0 ${ground}H${w}V${h}H0Z`, '#584453');
    for (let i = 0; i < 9; i++)
      a += line(w * 0.5, ground, w * (i / 6 - 0.2), h, '#261e2e', 2);
    for (let i = 0; i < 5; i++)
      a += line(0, ground + i * i * 9, w, ground + i * i * 9, '#261e2e', 2);
    a +=
      line(w * 0.5, 0, w * 0.5, h * 0.16, '#b89c93', 2) +
      path(
        `M${w * 0.35} ${h * 0.19}Q${w * 0.5} ${h * 0.31} ${w * 0.65} ${h * 0.19}`,
        'none',
        '#c8a88f',
        3,
      );
    for (let i = 0; i < 5; i++)
      a +=
        rect(w * (0.35 + i * 0.075) - 2, h * 0.19 - 19, 4, 17, '#f2cc9e') +
        circle(w * (0.35 + i * 0.075), h * 0.19 - 23, 3, '#ffedbf');
  } else {
    a += path(
      `M0 ${h * 0.55}Q${w * 0.2} ${h * 0.45} ${w * 0.35} ${h * 0.55}T${w} ${h * 0.5}V${h}H0Z`,
      '#3a507b',
    );
    for (let i = 0; i < 4; i++) {
      let x = w * (i * 0.3 - 0.05),
        y = h * (0.35 + (i % 2) * 0.16),
        iw = w * 0.28;
      a +=
        path(
          `M${x} ${y}h${iw}l${-iw * 0.35} ${h * 0.17}Z`,
          '#45577b',
          '#182841',
          2,
        ) +
        path(
          `M${x + 8} ${y}l${iw * 0.45} ${-h * 0.045} ${iw * 0.5} ${h * 0.045}Z`,
          '#a2a8bf',
        );
      let tx = x + iw * 0.3;
      a +=
        path(
          `M${tx} ${y}v${-h * 0.18}h${iw * 0.17}v${h * 0.18}M${tx - 8} ${y - h * 0.18}l${iw * 0.16} ${-h * 0.09} ${iw * 0.16} ${h * 0.09}Z`,
          '#adb5ce',
          '#354c70',
          2,
        ) + rect(tx + iw * 0.05, y - h * 0.13, iw * 0.055, h * 0.08, '#526faa');
    }
    a += `<ellipse cx="${w * 0.67}" cy="${h * 0.29}" rx="${w * 0.21}" ry="${h * 0.1}" fill="none" stroke="${s.glow}" stroke-width="3" transform="rotate(-25 ${w * 0.67} ${h * 0.29})"/>`;
    a += path(
      `M0 ${h * 0.9}L${w} ${h * 0.75}V${h}H0Z`,
      '#293f65',
      '#829dc4',
      2,
    );
    for (let i = 0; i < 6; i++)
      a += line(
        (w * i) / 5,
        h * 0.9 - i * h * 0.03,
        (w * i) / 5,
        h,
        '#647ba2',
        2,
      );
  }
  // Location changes are drawn into the chapters as well as described in text.
  if (chapter === 2) {
    if (s.kind === 'ruins') {
      a +=
        path(
          `M${w * 0.24} ${h * 0.87}V${h * 0.3}L${w * 0.5} ${h * 0.12} ${w * 0.76} ${h * 0.3}V${h * 0.87}H${w * 0.66}V${h * 0.34}L${w * 0.5} ${h * 0.23} ${w * 0.34} ${h * 0.34}V${h * 0.87}Z`,
          '#4a4359',
          '#afa0c9',
          2,
        ) +
        path(
          `M${w * 0.35} ${h * 0.86}V${h * 0.35}L${w * 0.5} ${h * 0.25} ${w * 0.65} ${h * 0.35}V${h * 0.86}`,
          'none',
          s.glow,
          2,
        );
    } else if (s.kind === 'garden') {
      a += path(
        `M0 ${h * 0.24}L${w * 0.5} ${h * 0.05} ${w} ${h * 0.24}V${h * 0.83}H0Z`,
        '#aec9c4',
        'none',
        1,
        'opacity=".08"',
      );
      for (let i = 0; i < 7; i++)
        a +=
          line(
            (w * i) / 6,
            h * 0.15,
            (w * i) / 6,
            h * 0.84,
            '#b3afb7',
            2,
            'opacity=".45"',
          ) +
          line(
            0,
            h * (0.24 + i * 0.095),
            w,
            h * (0.24 + i * 0.095),
            '#b3afb7',
            1.5,
            'opacity=".35"',
          );
      a +=
        line(0, h * 0.24, w * 0.5, h * 0.05, '#b3afb7', 4) +
        line(w, h * 0.24, w * 0.5, h * 0.05, '#b3afb7', 4);
    } else if (s.kind === 'city') {
      a += rect(
        w * 0.08,
        h * 0.3,
        w * 0.36,
        h * 0.32,
        '#0a2130',
        `stroke="${s.glow}" stroke-width="1" opacity=".8"`,
      );
      for (let i = 0; i < 8; i++)
        a += rect(
          w * 0.11,
          h * (0.33 + i * 0.032),
          w * (0.1 + (i % 3) * 0.06),
          2,
          s.glow,
          'opacity=".65"',
        );
      a += `<text x="${w * 0.11}" y="${h * 0.59}" fill="${s.light}" font-size="12" letter-spacing="2">SECTOR 00</text>`;
    } else if (s.kind === 'forest') {
      a += path(
        `M${w * 0.27} ${h * 0.85}V${h * 0.36}Q${w * 0.5} ${h * 0.06} ${w * 0.73} ${h * 0.36}V${h * 0.85}Z`,
        '#383044',
        '#94746b',
        3,
      );
      for (let i = 0; i < 5; i++) {
        a += rect(
          w * 0.32,
          h * (0.39 + i * 0.08),
          w * 0.36,
          h * 0.015,
          '#ac8266',
        );
        for (let j = 0; j < 9; j++)
          a += rect(
            w * (0.33 + j * 0.038),
            h * (0.35 + i * 0.08),
            w * 0.025,
            h * 0.04,
            j % 2 ? '#92765d' : '#675768',
          );
      }
    } else if (s.kind === 'gothic') {
      a +=
        path(
          `M${w * 0.23} ${h * 0.8}V${h * 0.3}Q${w * 0.5} ${h * 0.02} ${w * 0.77} ${h * 0.3}V${h * 0.8}Z`,
          '#454963',
          '#ba879b',
          8,
        ) +
        path(
          `M${w * 0.3} ${h * 0.75}L${w * 0.68} ${h * 0.25}M${w * 0.47} ${h * 0.72}L${w * 0.7} ${h * 0.43}`,
          'none',
          '#b0a6b8',
          2,
          'opacity=".5"',
        );
    } else {
      a += rect(
        w * 0.14,
        h * 0.22,
        w * 0.72,
        h * 0.39,
        '#182b48',
        `stroke="#93acd3" stroke-width="3" opacity=".9"`,
      );
      for (let i = 0; i < 3; i++)
        a += `<ellipse cx="${w * 0.5}" cy="${h * 0.42}" rx="${w * (0.12 + i * 0.06)}" ry="${h * (0.055 + i * 0.03)}" fill="none" stroke="${s.light}" stroke-width="1" transform="rotate(${i * 40 - 40} ${w * 0.5} ${h * 0.42})"/>`;
      a +=
        line(w * 0.22, h * 0.54, w * 0.4, h * 0.29, s.light, 1) +
        line(w * 0.4, h * 0.29, w * 0.78, h * 0.54, s.light, 1);
    }
  } else if (chapter === 3) {
    if (s.kind === 'ruins' || s.kind === 'gothic') {
      a +=
        path(
          `M${w} ${h * 0.18}L${w * 0.13} ${h}H${w * 0.48}L${w} ${h * 0.37}Z`,
          '#e9bf9d',
          'none',
          1,
          'opacity=".13"',
        ) +
        path(
          `M${w} ${h * 0.4}L${w * 0.68} ${h}H${w}Z`,
          '#fff0d4',
          'none',
          1,
          'opacity=".1"',
        );
      if (s.kind === 'gothic') {
        a += circle(
          w * 0.5,
          h * 0.35,
          Math.min(w, h) * 0.2,
          '#302537',
          `stroke="#c99ca1" stroke-width="3"`,
        );
        for (let i = 0; i < 12; i++) {
          let t = (i * Math.PI) / 6,
            rr = Math.min(w, h) * 0.17;
          a += line(
            w * 0.5 + Math.cos(t) * rr,
            h * 0.35 + Math.sin(t) * rr,
            w * 0.5 + Math.cos(t) * rr * 0.88,
            h * 0.35 + Math.sin(t) * rr * 0.88,
            '#e0b9b0',
            2,
          );
        }
        a +=
          line(w * 0.5, h * 0.35, w * 0.5, h * 0.21, '#e0b9b0', 2) +
          line(w * 0.5, h * 0.35, w * 0.59, h * 0.4, '#e0b9b0', 2);
      }
    } else if (s.kind === 'garden') {
      for (let i = 0; i < 23; i++) {
        let xx = r() * w,
          yy = h * (0.24 + r() * 0.68);
        a += path(
          `M${xx} ${yy}q-8-16 7-17 13 12-7 17Z`,
          i % 2 ? '#f0cfdb' : '#c77b9c',
          'none',
          1,
          'opacity=".7"',
        );
      }
    } else {
      const points = [];
      for (let i = 0; i < 7; i++)
        points.push([w * (0.12 + i * 0.12), h * (0.25 + (i % 3) * 0.08)]);
      for (let i = 1; i < points.length; i++)
        a += line(...points[i - 1], ...points[i], s.glow, 1.5, 'opacity=".8"');
      for (const [xx, yy] of points)
        a +=
          circle(xx, yy, 4, s.light) +
          path(`M${xx - 10} ${yy}h20M${xx} ${yy - 10}v20`, 'none', s.glow, 1);
    }
  }
  a +=
    rect(0, h * 0.42, w, h * 0.58, 'url(#mist)') +
    rect(0, 0, w, h, 'url(#tones)');
  return a;
}

function character(s, x, y, z, pose = 'calm', partner = false) {
  const noble = s.kind === 'garden' || s.kind === 'gothic',
    witch = s.kind === 'forest';
  const longHair = !partner && (noble || witch);
  const hair = partner ? '#242230' : 'url(#hair)';
  let a = `<g transform="translate(${x} ${y}) scale(${z})" stroke="#141925" stroke-width="2.5" stroke-linejoin="round">`;
  if (longHair)
    a += path(
      'M-36-303Q-72-275-53-135L-79-67Q-25-86-6-144Q43-103 80-142Q35-176 47-277Z',
      hair,
      '#202033',
      2,
    );
  a += path(
    'M-40-118L-44-13-15 4 0-112M9-112L16-10 45-11 43-125',
    '#1a2434',
    '#101725',
    3,
  );
  a += path(
    'M-46-16L-56 0Q-59 11-13 6L-14-13M16-13L17 8Q61 12 53 0L43-15',
    '#111723',
    '#0d131e',
    2,
  );
  a += path(
    'M-29-228L-68-218-92-94-53-110-75-23-19-39 1-122 20-36 87-19 59-111 89-106 65-219 30-231Z',
    'url(#cloth)',
    '#101625',
    3,
  );
  a += path(
    'M-27-230L0-194 29-230 22-147-15-151Z',
    noble ? '#d9c9cc' : '#e1e0d9',
    '#171d2b',
    2,
  );
  a += path(
    'M-35-228L-1-192-28-158-51-211M30-230L0-192 28-166 52-215',
    s.coat,
    s.accent,
    1.5,
  );
  a += path(
    'M-48-177L-61-59M46-175L61-56M-14-146L-22-68M10-145L26-62',
    'none',
    s.accent,
    1,
    'opacity=".55"',
  );
  a += path('M-16-254V-229Q0-213 18-232V-257Z', 'url(#skin)', '#30303b', 2);
  a += path(
    'M-40-293Q-42-265-31-249L0-228 31-248Q44-272 36-300L-7-314Z',
    'url(#skin)',
    '#202331',
    2.2,
  );
  a += path(
    'M-36-275Q-47-284-44-267L-34-258M36-275Q47-284 42-268L33-257',
    s.skin,
    '#56434c',
    1.3,
  );
  const worried = pose === 'worry',
    fierce = pose === 'action';
  a += path(
    worried
      ? 'M-29-273L-10-279M12-279L31-274'
      : fierce
        ? 'M-29-279L-9-270M11-270L31-281'
        : 'M-29-273L-10-269M12-269L31-274',
    'none',
    '#36303a',
    2.7,
  );
  a += path(
    worried
      ? 'M-28-267Q-18-278-9-266M11-266Q21-278 31-268'
      : 'M-28-267Q-18-273-9-266M11-266Q21-273 31-268',
    'none',
    '#222a36',
    2.5,
  );
  a += path('M-27-266L-13-264M14-264L28-267', 'none', '#f7f5ef', 3);
  a += circle(-17, -266, 2.7, s.glow) + circle(21, -266, 2.7, s.glow);
  a += path('M3-263L0-252 5-252', 'none', '#8d626b', 1.3);
  a += fierce
    ? path('M-10-243Q1-247 12-244L8-234-6-235Z', '#704b59', '#6c4756', 1.3) +
      path('M-7-242L9-242', 'none', '#fff7ed', 2)
    : path(
        worried ? 'M-7-241Q1-245 10-241' : 'M-9-243Q2-239 12-244',
        'none',
        '#8d626b',
        1.3,
      );
  if (partner || (!longHair && s.kind !== 'academy'))
    a += path(
      'M-44-281L-48-306-35-300-30-326-12-314 0-334 16-317 29-322 46-299 41-278 29-295 18-280 11-303-2-285-10-307-24-285-28-299Z',
      hair,
      '#111824',
      2,
    );
  else if (s.kind === 'academy')
    a += path(
      'M-44-281L-46-307-31-302-24-328-10-315 6-333 16-316 33-322 43-299 37-279 27-296 18-282 8-304-4-283-12-305-27-282-29-299Z',
      hair,
      '#5d7595',
      1.5,
    );
  else
    a += path(
      'M-43-275Q-57-310-22-326Q13-344 42-310L46-275 29-294 16-303 12-282-3-308Q-14-279-36-277L-28-302Z',
      hair,
      '#2c263a',
      2,
    );
  a += path(
    'M-29-309Q-11-323 8-318',
    'none',
    partner ? '#605068' : s.accent,
    1.2,
    'opacity=".6"',
  );
  if (pose === 'action' || pose === 'magic') {
    a += path(
      'M-62-212Q-108-185-122-139L-103-126-51-175M58-213Q93-190 128-214L132-197 67-166',
      'url(#cloth)',
      '#161e2a',
      3,
    );
    a += path(
      'M119-214L134-221 146-215 141-203 131-196 123-199M-122-141L-132-130-127-115-111-114-101-127',
      'url(#skin)',
      '#453b45',
      2,
    );
    if (s.kind === 'ruins')
      a += `<g transform="translate(137 -216) rotate(20)">${path('M-7-9L-4-184 5-210 11-184 5-9Z', 'url(#metal)', s.glow, 1.5)}${rect(-21, -10, 45, 7, '#cbbae5')}${rect(-2, -3, 9, 30, '#413254')}${circle(2, 31, 7, '#a590cd')}</g>`;
    else
      a +=
        circle(151, -226, 40, 'url(#aura)') +
        circle(151, -226, 23, 'none', `stroke="${s.glow}" stroke-width="2"`) +
        path(
          'M151-256L157-232 182-226 158-220 151-196 145-220 122-226 145-232Z',
          s.light,
          s.glow,
          1,
        );
  } else {
    a += path(
      'M-67-215Q-90-187-89-132L-72-108-54-122-58-182M64-215Q88-178 83-126L64-109-50-152 49-170',
      'url(#cloth)',
      '#171d2a',
      2.5,
    );
    a += path(
      'M-73-112L-78-96-68-82-56-88-56-105M65-113L56-104 52-89 64-80 76-91 77-104',
      'url(#skin)',
      '#51434e',
      1.7,
    );
  }
  a +=
    circle(0, -183, 5, s.accent, `stroke="#20283a" stroke-width="1.5"`) +
    path('M-30-122Q0-111 33-122', 'none', s.accent, 2);
  if (noble && !partner)
    a += path('M-28-115L-60-27 0-46 64-25 33-116Z', s.coat, '#242034', 2);
  a += `</g>`;
  return a;
}

function relic(s, w, h, seed) {
  const cx = w * 0.52,
    cy = h * 0.58,
    r = Math.min(w, h) * 0.25;
  let a = circle(cx, cy, r * 1.7, 'url(#aura)');
  for (let i = 0; i < 3; i++)
    a += circle(
      cx,
      cy,
      r * (0.7 + i * 0.28),
      'none',
      `stroke="${s.glow}" stroke-width="${i ? 1 : 2}" opacity="${0.8 - i * 0.2}"`,
    );
  a += `<g transform="translate(${cx} ${cy})">`;
  if (s.kind === 'ruins')
    a += `<g transform="rotate(23)">${path(`M-9 ${r * 0.7}L-7 ${-r * 0.8} 0 ${-r * 1.1} 9 ${-r * 0.8} 9 ${r * 0.7}Z`, 'url(#metal)', s.glow, 2)}${rect(-r * 0.48, r * 0.55, r * 0.96, 10, '#beace0')}${rect(-5, r * 0.65, 12, r * 0.5, '#453455')}${circle(1, r * 1.16, 9, s.glow)}</g>`;
  else if (s.kind === 'garden')
    a +=
      path(
        `M0 ${r * 0.15}Q${-r * 0.5} ${r * 0.7} ${-r * 0.25} ${r * 1.3}`,
        'none',
        '#63816a',
        6,
      ) + rose(0, 0, r / 24, '#d992b6');
  else if (s.kind === 'city')
    a += `<g transform="rotate(-12)">${path(`M${-r * 0.7} 0L0 ${-r * 0.65} ${r * 0.75} 0 0 ${r * 0.65}Z`, '#123b4a', s.glow, 3)}${path(`M${-r * 0.45} 0L0 ${-r * 0.4} ${r * 0.45} 0 0 ${r * 0.4}Z`, 'none', '#c3ffff', 2)}${line(-r * 0.7, 0, r * 0.75, 0, s.glow, 1)}${line(0, -r * 0.65, 0, r * 0.65, s.glow, 1)}</g>`;
  else if (s.kind === 'forest')
    a +=
      path(
        `M0 ${-r}Q${r * 0.12} ${-r * 0.25} ${r * 0.65} 0Q${r * 0.85} ${r * 0.7} 0 ${r * 0.9}Q${-r * 0.9} ${r * 0.7} ${-r * 0.5} 0Q${-r * 0.3} ${r * 0.3} 0 ${-r}Z`,
        s.glow,
        s.light,
        2,
      ) +
      path(
        `M0 ${-r * 0.15}Q${r * 0.45} ${r * 0.5} 0 ${r * 0.7}Q${-r * 0.4} ${r * 0.5} 0 ${-r * 0.15}Z`,
        '#fff0b6',
      );
  else if (s.kind === 'gothic') {
    a += `<g transform="rotate(-8)">${path(`M${-r * 0.7} ${-r}L${r * 0.7} ${-r * 0.9} ${r * 0.65} ${r} ${-r * 0.8} ${r * 0.9}Z`, '#e4ccb5', '#ad8d88', 2)}`;
    for (let i = 0; i < 7; i++)
      a += line(
        -r * 0.5,
        -r * 0.65 + i * r * 0.18,
        r * (i === 6 ? 0.05 : 0.5),
        -r * 0.65 + i * r * 0.18,
        '#8c6570',
        i === 6 ? 2 : 1.2,
      );
    a +=
      circle(r * 0.25, r * 0.56, r * 0.19, '#9c3859') +
      path(
        `M${r * 0.14} ${r * 0.57}l${r * 0.12} ${-r * 0.1} ${r * 0.1} ${r * 0.13}`,
        'none',
        '#d99ba8',
        2,
      ) +
      `</g>`;
  } else
    a +=
      path(
        `M0 ${-r}L${r * 0.65} ${-r * 0.35} ${r * 0.38} ${r * 0.7} 0 ${r} ${-r * 0.4} ${r * 0.65} ${-r * 0.65} ${-r * 0.35}Z`,
        '#91bce6',
        s.light,
        2,
      ) +
      path(`M0 ${-r}L${-r * 0.16} 0 0 ${r} ${r * 0.25} 0Z`, '#d7edff') +
      path(
        `M${-r * 0.65} ${-r * 0.35}L${r * 0.25} 0 ${r * 0.65} ${-r * 0.35}`,
        'none',
        '#577fb6',
        2,
      );
  a += `</g>`;
  // A reaching hand places the object in a scene rather than making a cover.
  a += path(
    `M${w * 0.14} ${h}L${cx - r * 0.6} ${cy + r * 0.8}Q${cx - r * 0.5} ${cy + r * 0.5} ${cx - r * 0.33} ${cy + r * 0.55}L${cx - r * 0.15} ${cy + r * 0.85}Q${cx + r * 0.2} ${cy + r * 0.8} ${cx + r * 0.45} ${cy + r * 0.9}L${cx + r * 0.2} ${cy + r * 1.2} ${w * 0.53} ${h}Z`,
    'url(#skin)',
    '#4d404c',
    3,
  );
  a += path(
    `M${cx - r * 0.44} ${cy + r * 0.81}L${cx - r * 0.25} ${cy + r * 1.03}M${cx - r * 0.2} ${cy + r * 0.91}L${cx - r * 0.04} ${cy + r * 1.08}`,
    'none',
    '#a77c7e',
    2,
  );
  return a;
}

function wrap(text, limit) {
  const words = text.split(' '),
    lines = [];
  let line = '';
  for (const word of words) {
    if (line && `${line} ${word}`.length > limit) {
      lines.push(line);
      line = word;
    } else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  return lines;
}
function bubble(text, speaker, w, h, side, s) {
  const bw = Math.min(w - 34, w > 600 ? 452 : 340),
    lines = wrap(text, Math.floor((bw - 42) / 13.1)),
    bh = lines.length * 29 + 51,
    x = side ? w - bw - 18 : 18,
    y = 18;
  return `<g>${path(`M${x + 18} ${y}H${x + bw - 18}Q${x + bw} ${y} ${x + bw} ${y + 18}V${y + bh - 18}Q${x + bw} ${y + bh} ${x + bw - 18} ${y + bh}H${x + bw * 0.55}L${x + bw * 0.48} ${y + bh + 22} ${x + bw * 0.45} ${y + bh}H${x + 18}Q${x} ${y + bh} ${x} ${y + bh - 18}V${y + 18}Q${x} ${y} ${x + 18} ${y}Z`, '#fffdf7', '#1e2431', 2.5)}<text x="${x + 22}" y="${y + 24}" fill="#746b79" font-size="12" font-weight="700" letter-spacing="2">${esc(speaker)}</text><text fill="#252332" font-size="25" font-weight="500">${lines.map((l, i) => `<tspan x="${x + 22}" y="${y + 53 + i * 29}">${esc(l)}</tspan>`).join('')}</text></g>`;
}

function panel(s, x, y, w, h, mode, text, seed, chapter, index) {
  let art = scenery(s, w, h, seed, chapter, mode),
    base = h * 0.98,
    z = Math.min(w / 270, h / 360);
  if (mode === 'wide') {
    art += character(
      s,
      w * (w > 600 ? 0.74 : 0.55),
      base + 32,
      Math.min(h / 490, w / 450),
      'calm',
    );
    art += path(
      `M0 ${h}L${w * 0.13} ${h * 0.8} ${w * 0.18} ${h}M${w} ${h}L${w * 0.85} ${h * 0.83} ${w * 0.8} ${h}Z`,
      '#0b1423',
    );
  } else if (mode === 'close') {
    const closeScale = Math.min(w / 140, h / 160);
    art += character(
      s,
      w * 0.51,
      h * 0.66 + 275 * closeScale,
      closeScale,
      text.includes('?') ? 'worry' : 'calm',
    );
    art += path(
      `M0 ${h * 0.8}Q${w * 0.35} ${h * 0.95} ${w} ${h * 0.8}V${h}H0Z`,
      'url(#mist)',
    );
  } else if (mode === 'duo') {
    art +=
      character(s, w * 0.78, h * 0.99, z * 0.85, 'calm', true) +
      character(s, w * 0.3, h * 1.04, z * 0.97, 'calm');
  } else if (mode === 'relic') {
    art += rect(0, 0, w, h, '#0a1020', `opacity=".25"`) + relic(s, w, h, seed);
  } else {
    const r = rand(seed);
    for (let i = 0; i < 22; i++) {
      let xx = r() * w,
        yy = r() * h;
      art += line(
        xx,
        yy,
        xx + w * 0.25,
        yy - h * 0.17,
        s.light,
        i % 3 ? 1 : 3,
        `opacity="${0.1 + r() * 0.3}"`,
      );
    }
    art += `<g transform="rotate(-9 ${w * 0.5} ${h * 0.65})">${character(s, w * 0.43, h * 1.05, z * 1.1, 'action')}</g>`;
    art +=
      path(
        `M${w * 0.12} ${h * 0.78}Q${w * 0.83} ${h * 0.82} ${w * 0.9} ${h * 0.3}`,
        'none',
        s.glow,
        5,
        'opacity=".7"',
      ) +
      path(
        `M${w * 0.13} ${h * 0.8}Q${w * 0.82} ${h * 0.87} ${w * 0.94} ${h * 0.28}`,
        'none',
        s.light,
        2,
      );
    art += `<text x="${w * 0.7}" y="${h * 0.62}" fill="${s.light}" stroke="${s.ink}" stroke-width="1" font-size="${Math.min(w * 0.13, 58)}" font-style="italic" font-weight="900" transform="rotate(-12 ${w * 0.7} ${h * 0.62})">${s.kind === 'garden' ? 'FSS' : s.kind === 'gothic' ? 'TIC' : 'SHAA'}</text>`;
  }
  const narrative =
    /^(Noa no |Los portales |Cuando dieron|La última estrella|Una a una|Ambos tacharon|El aula volvió)/.test(
      text,
    );
  art += bubble(
    text,
    mode === 'wide' || narrative
      ? 'RELATO'
      : mode === 'duo'
        ? s.partner
        : s.name,
    w,
    h,
    index === 1,
    s,
  );
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden">${art}</svg>${rect(x, y, w, h, 'none', `stroke="#030711" stroke-width="4"`)}`;
}

function page(s, chapter, pageNumber) {
  const entry = s.pages[(chapter - 1) * 3 + pageNumber - 1],
    caption = entry[0],
    seed = series.indexOf(s) * 10000 + chapter * 100 + pageNumber * 10;
  const layouts = [
    [
      [30, 110, 740, 326],
      [30, 456, 360, 664],
      [410, 456, 360, 664],
    ],
    [
      [30, 110, 360, 454],
      [410, 110, 360, 454],
      [30, 584, 740, 536],
    ],
    [
      [30, 110, 740, 582],
      [30, 712, 360, 408],
      [410, 712, 360, 408],
    ],
  ];
  const layout = layouts[pageNumber - 1];
  let art = '';
  for (let i = 0; i < 3; i++)
    art += panel(
      s,
      ...layout[i],
      entry[i * 2 + 1],
      entry[i * 2 + 2],
      seed + i,
      chapter,
      i,
    );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200" fill="none"><title>${esc(s.title)} · Capítulo ${chapter} · Página ${pageNumber}</title><desc>${esc(caption)} Tres viñetas originales de muestra con diálogos en español.</desc>${defs(s)}<g font-family="Arial, Helvetica, sans-serif">${rect(0, 0, 800, 1200, '#0c101b')}${rect(30, 24, 4, 55, s.glow)}<text x="48" y="42" fill="${s.light}" font-size="14" letter-spacing="2" font-weight="700">${esc(s.title.toUpperCase())}</text><text x="48" y="69" fill="#eef0f5" font-size="21" font-weight="700">${esc(caption)}</text><text x="767" y="44" text-anchor="end" fill="#8c96ae" font-size="13">${String(chapter).padStart(2, '0')} / ${String(pageNumber).padStart(2, '0')}</text>${art}<text x="30" y="1159" fill="${s.light}" font-size="16" font-weight="700">${String(chapter).padStart(2, '0')} · ${esc(s.chapters[chapter - 1])}</text><text x="770" y="1180" text-anchor="end" fill="#737d93" font-size="12" letter-spacing="1.5">YITVERSE ORIGINALS · FICCIÓN DE MUESTRA · ${pageNumber}/3</text></g></svg>`;
}

await mkdir(output, { recursive: true });
let count = 0;
for (const s of series)
  for (let chapter = 1; chapter <= 3; chapter++)
    for (let pageNumber = 1; pageNumber <= 3; pageNumber++) {
      await writeFile(
        `${output}${s.slug}-${chapter}-${pageNumber}.svg`,
        page(s, chapter, pageNumber),
      );
      count++;
    }
console.log(`Generated ${count} original chapter pages in ${output}`);
