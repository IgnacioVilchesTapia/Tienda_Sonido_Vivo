// datos.js — catálogo de Sonido Vivo.
// Fuente: archivo Excel entregado por la tienda (muestra representativa del catálogo de 340 referencias).
// En la entrega 1 los datos viven en este arreglo; en entregas posteriores vendrán de la API REST.

const CATEGORIAS = [
  "Guitarras Acústicas",
  "Guitarras Eléctricas",
  "Bajos Eléctricos",
  "Baterías",
  "Teclados y Pianos",
  "Amplificadores",
  "Micrófonos",
  "Pedales de Efectos",
  "Accesorios",
  "Estudio y Grabación"
];

const PRODUCTOS = [
  {"codigo": "GA001", "categoria": "Guitarras Acústicas", "nombre": "Guitarra Acústica Folk", "marca": "Yamaha", "modelo": "F310", "stock": 8, "stockCritico": 3, "precio": 129990, "descripcion": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.", "imagen": "assets/img/guitarras-acusticas.svg"},
  {"codigo": "GA002", "categoria": "Guitarras Acústicas", "nombre": "Guitarra Acústica Dreadnought", "marca": "Fender", "modelo": "CD-60S", "stock": 5, "stockCritico": 3, "precio": 189990, "descripcion": "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado.", "imagen": "assets/img/guitarras-acusticas.svg"},
  {"codigo": "GA003", "categoria": "Guitarras Acústicas", "nombre": "Guitarra Acústica Clásica 4/4", "marca": "Yamaha", "modelo": "C40", "stock": 10, "stockCritico": 3, "precio": 89990, "descripcion": "Nailon, tapa de abeto. Ideal para estudio y flamenco.", "imagen": "assets/img/guitarras-acusticas.svg"},
  {"codigo": "GA004", "categoria": "Guitarras Acústicas", "nombre": "Guitarra Electroacústica", "marca": "Takamine", "modelo": "GN20CE", "stock": 3, "stockCritico": 3, "precio": 349990, "descripcion": "Pickup integrado, afinador incorporado.", "imagen": "assets/img/guitarras-acusticas.svg"},
  {"codigo": "GA005", "categoria": "Guitarras Acústicas", "nombre": "Guitarra 3/4 Niños", "marca": "Yamaha", "modelo": "JR1", "stock": 6, "stockCritico": 3, "precio": 79990, "descripcion": "Tamaño reducido para niños de 6 a 10 años.", "imagen": "assets/img/guitarras-acusticas.svg"},
  {"codigo": "GE001", "categoria": "Guitarras Eléctricas", "nombre": "Guitarra Eléctrica Stratocaster", "marca": "Squier", "modelo": "Affinity Strat", "stock": 5, "stockCritico": 3, "precio": 249990, "descripcion": "Cuerpo de álamo, mástil de arce, pastillas SSS.", "imagen": "assets/img/guitarras-electricas.svg"},
  {"codigo": "GE002", "categoria": "Guitarras Eléctricas", "nombre": "Guitarra Eléctrica Les Paul", "marca": "Epiphone", "modelo": "Les Paul Std", "stock": 4, "stockCritico": 3, "precio": 329990, "descripcion": "Cuerpo caoba, tapa arce, pastillas humbucker.", "imagen": "assets/img/guitarras-electricas.svg"},
  {"codigo": "GE003", "categoria": "Guitarras Eléctricas", "nombre": "Guitarra Eléctrica SG", "marca": "Epiphone", "modelo": "SG Standard", "stock": 3, "stockCritico": 3, "precio": 319990, "descripcion": "Cuerpo caoba, mástil caoba, 2 humbuckers.", "imagen": "assets/img/guitarras-electricas.svg"},
  {"codigo": "GE004", "categoria": "Guitarras Eléctricas", "nombre": "Guitarra Eléctrica Telecaster", "marca": "Squier", "modelo": "Affinity Tele", "stock": 4, "stockCritico": 3, "precio": 239990, "descripcion": "Cuerpo álamo, clavijero vintage, 2 pastillas single.", "imagen": "assets/img/guitarras-electricas.svg"},
  {"codigo": "GE005", "categoria": "Guitarras Eléctricas", "nombre": "Guitarra Eléctrica Semi-hollow", "marca": "Epiphone", "modelo": "ES-335", "stock": 2, "stockCritico": 3, "precio": 549990, "descripcion": "Semi-hueca, 2 humbuckers, ideal para jazz y blues.", "imagen": "assets/img/guitarras-electricas.svg"},
  {"codigo": "BA001", "categoria": "Bajos Eléctricos", "nombre": "Bajo Eléctrico 4 Cuerdas", "marca": "Squier", "modelo": "Affinity PJ", "stock": 5, "stockCritico": 3, "precio": 299990, "descripcion": "Pickup PJ, cuerpo álamo, mástil arce.", "imagen": "assets/img/bajos-electricos.svg"},
  {"codigo": "BA002", "categoria": "Bajos Eléctricos", "nombre": "Bajo Eléctrico Jazz Bass", "marca": "Fender", "modelo": "Player Jazz", "stock": 2, "stockCritico": 3, "precio": 699990, "descripcion": "Alder body, 2 Alnico V Jazz single-coil.", "imagen": "assets/img/bajos-electricos.svg"},
  {"codigo": "BA003", "categoria": "Bajos Eléctricos", "nombre": "Bajo Acústico 4 Cuerdas", "marca": "Yamaha", "modelo": "APX700II", "stock": 2, "stockCritico": 3, "precio": 429990, "descripcion": "Electroacústico, afinador incorporado.", "imagen": "assets/img/bajos-electricos.svg"},
  {"codigo": "BT001", "categoria": "Baterías", "nombre": "Batería Acústica 5 piezas", "marca": "Pearl", "modelo": "Roadshow", "stock": 2, "stockCritico": 3, "precio": 599990, "descripcion": "Incluye stands, platillos y pedal de bombo.", "imagen": "assets/img/baterias.svg"},
  {"codigo": "BT002", "categoria": "Baterías", "nombre": "Batería Electrónica 8 pads", "marca": "Roland", "modelo": "TD-02KV", "stock": 2, "stockCritico": 3, "precio": 799990, "descripcion": "Módulo TD-02, 8 pads de goma, pedal hi-hat.", "imagen": "assets/img/baterias.svg"},
  {"codigo": "BT003", "categoria": "Baterías", "nombre": "Caja Snare 14\"", "marca": "Pearl", "modelo": "STE1450", "stock": 4, "stockCritico": 3, "precio": 89990, "descripcion": "Acero, 14x5\", 10 tensores.", "imagen": "assets/img/baterias.svg"},
  {"codigo": "BT004", "categoria": "Baterías", "nombre": "Platillo Hi-Hat 14\"", "marca": "Zildjian", "modelo": "A Series", "stock": 3, "stockCritico": 3, "precio": 149990, "descripcion": "Latón B20, sonido brillante y claro.", "imagen": "assets/img/baterias.svg"},
  {"codigo": "BT005", "categoria": "Baterías", "nombre": "Platillo Crash 16\"", "marca": "Zildjian", "modelo": "A Series", "stock": 3, "stockCritico": 3, "precio": 129990, "descripcion": "Latón B20, ataque rápido.", "imagen": "assets/img/baterias.svg"},
  {"codigo": "TC001", "categoria": "Teclados y Pianos", "nombre": "Teclado Digital 61 teclas", "marca": "Yamaha", "modelo": "PSR-E373", "stock": 4, "stockCritico": 3, "precio": 249990, "descripcion": "61 teclas sensibles al tacto, 622 voces.", "imagen": "assets/img/teclados-y-pianos.svg"},
  {"codigo": "TC002", "categoria": "Teclados y Pianos", "nombre": "Piano Digital 88 teclas", "marca": "Yamaha", "modelo": "P-45", "stock": 2, "stockCritico": 3, "precio": 499990, "descripcion": "88 teclas pesadas, 10 voces, pedal sustain incluido.", "imagen": "assets/img/teclados-y-pianos.svg"},
  {"codigo": "TC003", "categoria": "Teclados y Pianos", "nombre": "Sintetizador 49 teclas", "marca": "Arturia", "modelo": "MiniLab MKII", "stock": 5, "stockCritico": 3, "precio": 129990, "descripcion": "MIDI controller, 49 mini teclas.", "imagen": "assets/img/teclados-y-pianos.svg"},
  {"codigo": "TC004", "categoria": "Teclados y Pianos", "nombre": "Teclado MIDI 88 teclas", "marca": "M-Audio", "modelo": "Hammer 88", "stock": 2, "stockCritico": 3, "precio": 399990, "descripcion": "88 teclas martillo, sin sonidos propios.", "imagen": "assets/img/teclados-y-pianos.svg"},
  {"codigo": "AM001", "categoria": "Amplificadores", "nombre": "Amplificador Guitarra 15W", "marca": "Fender", "modelo": "Frontman 15G", "stock": 5, "stockCritico": 3, "precio": 99990, "descripcion": "15W, distorsión incorporada, entrada auxiliar.", "imagen": "assets/img/amplificadores.svg"},
  {"codigo": "AM002", "categoria": "Amplificadores", "nombre": "Amplificador Guitarra 40W", "marca": "Marshall", "modelo": "MG40GFX", "stock": 3, "stockCritico": 3, "precio": 299990, "descripcion": "40W, 4 canales, efectos digitales integrados.", "imagen": "assets/img/amplificadores.svg"},
  {"codigo": "AM003", "categoria": "Amplificadores", "nombre": "Amplificador Bajo 100W", "marca": "Hartke", "modelo": "HD100", "stock": 2, "stockCritico": 3, "precio": 449990, "descripcion": "100W, tweeter integrado, ecualizador de 4 bandas.", "imagen": "assets/img/amplificadores.svg"},
  {"codigo": "AM004", "categoria": "Amplificadores", "nombre": "Amplificador Acústico 40W", "marca": "Fishman", "modelo": "Loudbox Mini", "stock": 2, "stockCritico": 3, "precio": 499990, "descripcion": "60W, 2 canales, reverb y chorus incorporados.", "imagen": "assets/img/amplificadores.svg"},
  {"codigo": "MI001", "categoria": "Micrófonos", "nombre": "Micrófono Dinámico Cardioide", "marca": "Shure", "modelo": "SM58", "stock": 8, "stockCritico": 3, "precio": 149990, "descripcion": "Estándar industria para voz en vivo.", "imagen": "assets/img/microfonos.svg"},
  {"codigo": "MI002", "categoria": "Micrófonos", "nombre": "Micrófono Dinámico Instrumento", "marca": "Shure", "modelo": "SM57", "stock": 6, "stockCritico": 3, "precio": 139990, "descripcion": "Ideal para captura de instrumentos y amplificadores.", "imagen": "assets/img/microfonos.svg"},
  {"codigo": "MI003", "categoria": "Micrófonos", "nombre": "Micrófono Condensador", "marca": "Audio-Tech.", "modelo": "AT2020", "stock": 4, "stockCritico": 3, "precio": 199990, "descripcion": "Cardioide, XLR, ideal para grabación en estudio.", "imagen": "assets/img/microfonos.svg"},
  {"codigo": "MI004", "categoria": "Micrófonos", "nombre": "Micrófono USB de Condensador", "marca": "Blue", "modelo": "Yeti", "stock": 5, "stockCritico": 3, "precio": 299990, "descripcion": "USB, 4 patrones polares, ideal para streaming y podcast.", "imagen": "assets/img/microfonos.svg"},
  {"codigo": "PE001", "categoria": "Pedales de Efectos", "nombre": "Pedal Distorsión", "marca": "Boss", "modelo": "DS-1", "stock": 7, "stockCritico": 3, "precio": 79990, "descripcion": "Clásico pedal de distorsión, 3 controles.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "PE002", "categoria": "Pedales de Efectos", "nombre": "Pedal Reverb", "marca": "Boss", "modelo": "RV-6", "stock": 4, "stockCritico": 3, "precio": 179990, "descripcion": "8 modos de reverb, control de shimmer.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "PE003", "categoria": "Pedales de Efectos", "nombre": "Pedal Multi-efectos", "marca": "Boss", "modelo": "ME-80", "stock": 2, "stockCritico": 3, "precio": 349990, "descripcion": "Diseño tipo pedalboard, 8 efectos simultáneos.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "PE004", "categoria": "Pedales de Efectos", "nombre": "Pedal Tuner Cromático", "marca": "Boss", "modelo": "TU-3", "stock": 8, "stockCritico": 3, "precio": 89990, "descripcion": "Afinador cromático, indicador de tono.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "PE005", "categoria": "Pedales de Efectos", "nombre": "Pedal Delay", "marca": "MXR", "modelo": "Carbon Copy", "stock": 4, "stockCritico": 3, "precio": 179990, "descripcion": "Delay analógico cálido, tiempo 600ms.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "PE006", "categoria": "Pedales de Efectos", "nombre": "Pedal Overdrive", "marca": "Ibanez", "modelo": "TS9", "stock": 6, "stockCritico": 3, "precio": 99990, "descripcion": "Tube Screamer clásico, sonido suave y orgánico.", "imagen": "assets/img/pedales-de-efectos.svg"},
  {"codigo": "AC001", "categoria": "Accesorios", "nombre": "Cuerdas Guitarra Eléctrica 09-42", "marca": "Ernie Ball", "modelo": "Super Slinky", "stock": 25, "stockCritico": 3, "precio": 8990, "descripcion": "Juego 6 cuerdas, calibre ligero.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC002", "categoria": "Accesorios", "nombre": "Cuerdas Guitarra Acústica 12-53", "marca": "Ernie Ball", "modelo": "Earthwood", "stock": 20, "stockCritico": 3, "precio": 10990, "descripcion": "Bronce fósforo, sonido cálido.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC003", "categoria": "Accesorios", "nombre": "Cuerdas Bajo 45-105", "marca": "Ernie Ball", "modelo": "Regular Slinky", "stock": 12, "stockCritico": 3, "precio": 14990, "descripcion": "Cuerdas de níquel enrollado, set 4 cuerdas.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC004", "categoria": "Accesorios", "nombre": "Púas de Guitarra x10 (0.73mm)", "marca": "Fender", "modelo": "351", "stock": 50, "stockCritico": 3, "precio": 3990, "descripcion": "Celulosa, grosor medio.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC005", "categoria": "Accesorios", "nombre": "Capotraste Guitarra", "marca": "Dunlop", "modelo": "Trigger", "stock": 15, "stockCritico": 3, "precio": 12990, "descripcion": "Capotraste de resorte, compatible 6 cuerdas.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC006", "categoria": "Accesorios", "nombre": "Afinador de Clip", "marca": "Snark", "modelo": "SN-5", "stock": 20, "stockCritico": 3, "precio": 8990, "descripcion": "Afinador cromático de clip, pantalla giratoria.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC007", "categoria": "Accesorios", "nombre": "Cable Instrumento 3m", "marca": "Monster", "modelo": "S100-I-3", "stock": 15, "stockCritico": 3, "precio": 12990, "descripcion": "Cable trenzado, conectores dorados, 3 metros.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC008", "categoria": "Accesorios", "nombre": "Cable Instrumento 6m", "marca": "Monster", "modelo": "S100-I-6", "stock": 10, "stockCritico": 3, "precio": 17990, "descripcion": "Cable trenzado, conectores dorados, 6 metros.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC009", "categoria": "Accesorios", "nombre": "Soporte Guitarra de Piso", "marca": "Hercules", "modelo": "GS302B", "stock": 12, "stockCritico": 3, "precio": 22990, "descripcion": "Soporte plegable con enganche automático.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "AC010", "categoria": "Accesorios", "nombre": "Soporte Guitarra de Pared", "marca": "Hercules", "modelo": "WAH-202", "stock": 10, "stockCritico": 3, "precio": 18990, "descripcion": "Montaje a pared, enganche automático.", "imagen": "assets/img/accesorios.svg"},
  {"codigo": "ES001", "categoria": "Estudio y Grabación", "nombre": "Interfaz de Audio 2x2 USB", "marca": "Focusrite", "modelo": "Scarlett Solo", "stock": 4, "stockCritico": 3, "precio": 149990, "descripcion": "1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz.", "imagen": "assets/img/estudio-y-grabacion.svg"},
  {"codigo": "ES002", "categoria": "Estudio y Grabación", "nombre": "Auriculares de Estudio", "marca": "Audio-Tech.", "modelo": "ATH-M20x", "stock": 6, "stockCritico": 3, "precio": 79990, "descripcion": "Circumaurales, respuesta 15Hz-20kHz.", "imagen": "assets/img/estudio-y-grabacion.svg"},
  {"codigo": "ES003", "categoria": "Estudio y Grabación", "nombre": "Auriculares de Estudio Pro", "marca": "Audio-Tech.", "modelo": "ATH-M50x", "stock": 4, "stockCritico": 3, "precio": 219990, "descripcion": "Referencia de industria, sonido neutro y detallado.", "imagen": "assets/img/estudio-y-grabacion.svg"},
  {"codigo": "ES004", "categoria": "Estudio y Grabación", "nombre": "Monitor de Estudio 5\"", "marca": "Yamaha", "modelo": "HS5", "stock": 2, "stockCritico": 3, "precio": 349990, "descripcion": "Altavoz activo, respuesta plana, ideal mezcla.", "imagen": "assets/img/estudio-y-grabacion.svg"},
  {"codigo": "ES005", "categoria": "Estudio y Grabación", "nombre": "Pop Filter para Micrófono", "marca": "Sennheiser", "modelo": "MZP 40", "stock": 8, "stockCritico": 3, "precio": 14990, "descripcion": "Doble malla, brazo flexible con clip.", "imagen": "assets/img/estudio-y-grabacion.svg"},
];

// Blogs de la tienda (contenido editorial, sin backend por ahora).
const BLOGS = [
  {
    id: 1,
    titulo: "Cómo elegir tu primera guitarra",
    resumen: "Cuerdas de nailon o de acero, tamaño 3/4 o 4/4, y por qué el presupuesto no es lo primero que deberías mirar.",
    imagen: "assets/img/guitarras-acusticas.svg",
    url: "blog-1.html"
  },
  {
    id: 2,
    titulo: "Cada cuánto cambiar las cuerdas",
    resumen: "Una guía corta para saber cuándo tus cuerdas dejaron de sonar y empezaron a sonar solo a metal viejo.",
    imagen: "assets/img/accesorios.svg",
    url: "blog-2.html"
  }
];

// Usuarios de ejemplo para el mantenedor del administrador.
const USUARIOS = [
  { run: "190110222", nombre: "Carla", apellidos: "Pizarro Muñoz", correo: "c.pizarro@duoc.cl", tipo: "Administrador", region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Av. San Martín 452", nacimiento: "1994-03-12" },
  { run: "175558888", nombre: "Diego", apellidos: "Rojas Fuentes", correo: "d.rojas@duoc.cl", tipo: "Vendedor", region: "Región de Valparaíso", comuna: "Valparaíso", direccion: "Calle Prat 88", nacimiento: "1990-11-02" },
  { run: "213334441", nombre: "Fernanda", apellidos: "Soto Lagos", correo: "fsoto2000@gmail.com", tipo: "Cliente", region: "Región Metropolitana de Santiago", comuna: "Ñuñoa", direccion: "Irarrázaval 1200, depto 41", nacimiento: "2000-07-25" },
  { run: "165552229", nombre: "Matías", apellidos: "Contreras Vera", correo: "m.contreras@profesor.duoc.cl", tipo: "Vendedor", region: "Región del Biobío", comuna: "Concepción", direccion: "Barros Arana 340", nacimiento: "1988-01-30" }
];
