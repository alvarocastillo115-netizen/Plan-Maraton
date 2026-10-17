// ---------- PLAN: 17 SEMANAS · 19 OCT 2026 → 14 FEB 2027 ----------
// Prioridad A: Maratón El Salvador (14 feb). Prioridad B: Ultravolcanes 21K (24 ene), para disfrutar.
// Semana tipo: LUN descanso total · MAR calidad asfalto (+ piernas y core en la tarde)
// MIÉ fácil + tren superior A + core · JUE trail El Espino · VIE fácil + tren superior B · SÁB descanso total · DOM largo asfalto
import {
  easy, recovery, fartlek, threshold, intervals, marathonPace, trail,
  longRun, timeTrial, trailRace, marathonRace, shakeout, rest, strength,
} from "./workouts.js";
import { routineFor } from "./strength.js";

export const PHASES = {
  base: { label: "BASE", color: "#5C7A5C" },
  build: { label: "CONSTRUCCIÓN", color: "#3D6B4F" },
  asim: { label: "ASIMILACIÓN", color: "#8A9B8A" },
  spec: { label: "ESPECÍFICO MARATÓN", color: "#2E6F8E" },
  peak: { label: "PICO", color: "#E4572E" },
  trail: { label: "ULTRAVOLCANES", color: "#8B5E3C" },
  taper: { label: "TAPER", color: "#C9A227" },
};

const SAT = () => [rest("Descanso total", "Día libre: sin correr ni gimnasio. Llegas fresco a la tirada larga del domingo; acuéstate temprano.")];
const MON = () => [rest("Descanso total", "Día libre después de la tirada larga: sin correr ni gimnasio. Caminar o movilidad suave si te apetece.")];
const upper = (v = "normal") => ({ a: strength("upperA", v), b: strength("upperB", v) });

const RAW = [
  {
    n: 1, phase: "base", focus: "Regreso y rutina",
    note: "Semana de reentrada: todo controlado. El objetivo es instalar la rutina de 5 días de carrera, 3 de fuerza y 2 de descanso total, no ganar forma. Si en las últimas 3 semanas corriste menos de 25 km por semana, quita 1-2 km a cada rodaje.",
    days: {
      mon: MON(),
      tue: [fartlek(8, 7), strength("legsAdapt", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(6), upper().a, strength("coreB")],
      thu: [trail(7, 200, "cortas", 5)],
      fri: [easy(5, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(1, 12)],
    },
  },
  {
    n: 2, phase: "base", focus: "Base aeróbica",
    days: {
      mon: MON(),
      tue: [threshold(4, "6 min", "2 min de trote", 8), strength("legsAdapt", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(7), upper().a, strength("coreB")],
      thu: [trail(8, 250, "medias", 6)],
      fri: [easy(5, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(2, 15)],
    },
  },
  {
    n: 3, phase: "base", focus: "Base aeróbica",
    days: {
      mon: MON(),
      tue: [threshold(3, "10 min", "2 min de trote", 10), strength("legsAdapt", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(8), upper().a, strength("coreB")],
      thu: [trail(9, 300, "bajada", 4)],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(3, 17)],
    },
  },
  {
    n: 4, phase: "asim", focus: "Descarga + prueba 5K",
    note: "Bajamos ~20 % el volumen. El martes es la PRUEBA 5K: al terminar, introduce el tiempo en la pestaña Ritmos y todo el plan se recalcula.",
    days: {
      mon: MON(),
      tue: [timeTrial("5K", 9.5), strength("coreA", "deload")],
      wed: [recovery(6), upper("deload").a, strength("coreB", "deload")],
      thu: [trail(7, 200, "suave"), strength("legsLight", "normal", { when: "Tarde" })],
      fri: [easy(5, { strides: true }), upper("deload").b],
      sat: SAT(),
      sun: [longRun(4, 14)],
    },
  },
  {
    n: 5, phase: "build", focus: "VO2máx + primer contacto con ritmo M",
    days: {
      mon: MON(),
      tue: [intervals(5, "1 km", "2:30 de trote", 11), strength("legsHeavy", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(10), upper().a, strength("coreB")],
      thu: [trail(10, 450, "medias", 6)],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(5, 19, { short: "últimos 3 km a M", segments: ["Km 1-16 fácil.", "Km 17-19 a ritmo M ({M}): primer contacto con el ritmo de carrera, con piernas cansadas."] })],
    },
  },
  {
    n: 6, phase: "build", focus: "Umbral + bajadas",
    note: "Compra esta semana tus zapatillas para ritmo y carrera (las Clifton 10 quedan para rodajes). Estrénalas en rodajes fáciles y luego úsalas en las sesiones a ritmo M.",
    days: {
      mon: MON(),
      tue: [threshold(3, "2 km", "2 min de trote", 12), strength("legsHeavy", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(10), upper().a, strength("coreB")],
      thu: [trail(11, 500, "bajada", 5)],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(6, 21, { short: "últimos 5 km a M", segments: ["Km 1-16 fácil.", "Km 17-21 a ritmo M."] })],
    },
  },
  {
    n: 7, phase: "build", focus: "Umbral + subidas largas",
    days: {
      mon: MON(),
      tue: [threshold(4, "1.6 km", "1 min de trote", 12), strength("legsHeavy", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(11), upper().a, strength("coreB")],
      thu: [trail(11, 550, "largas", 4)],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(7, 24, { short: "fácil · ensayo de nutrición", segments: ["Todo fácil. Prioridad de hoy: tolerar 2 GU por hora sin molestias de estómago."] })],
    },
  },
  {
    n: 8, phase: "asim", focus: "Descarga + prueba 10K",
    note: "Descarga. El domingo es la PRUEBA 10K: es la que define los ritmos del bloque específico de maratón. Actualiza la pestaña Ritmos ese mismo día.",
    days: {
      mon: MON(),
      tue: [threshold(5, "3 min", "2 min de trote", 8), strength("legsLight", "normal", { when: "Tarde" }), strength("coreA", "deload", { when: "Tarde" })],
      wed: [easy(8), upper("deload").a, strength("coreB", "deload")],
      thu: [trail(8, 300, "suave")],
      fri: [easy(5, { strides: true }), upper("deload").b],
      sat: SAT(),
      sun: [timeTrial("10K", 15)],
    },
  },
  {
    n: 9, phase: "spec", focus: "Entra el ritmo de maratón",
    days: {
      mon: MON(),
      tue: [marathonPace("2 × 4 km a ritmo maratón", 14, ["2 × 4 km a {M} con 1 km suave entre bloques."]), strength("legsHeavy", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(10), upper().a, strength("coreB")],
      thu: [trail(11, 600, "largas", 5)],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(9, 26, { short: "últimos 8 km a M", segments: ["Km 1-18 fácil.", "Km 19-26 a ritmo M. Toma un gel justo antes del bloque."] })],
    },
  },
  {
    n: 10, phase: "spec", focus: "Bloques M en el largo · Navidad",
    note: "Semana de Navidad: el jueves 24 es corto y el viernes 25 puedes moverlo al sábado si hace falta. El largo del domingo no se mueve.",
    days: {
      mon: MON(),
      tue: [threshold(3, "2.5 km", "2 min de trote", 13), strength("legsHeavy", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(10), upper().a, strength("coreB")],
      thu: [trail(12, 700, "sim")],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(10, 29, { short: "3 × 4 km a M", segments: ["Km 1-12 fácil.", "3 × 4 km a ritmo M con 1 km fácil entre bloques (km 13-26).", "Km 27-29 fácil."] })],
    },
  },
  {
    n: 11, phase: "asim", focus: "Descarga · Año Nuevo",
    note: "Descarga de fin de año. El viernes 1 de enero es opcional. Mantén el bloque M del domingo: la intensidad no se pierde en descarga.",
    days: {
      mon: MON(),
      tue: [threshold(5, "1 km", "1 min de trote", 10), strength("legsLight", "normal", { when: "Tarde" }), strength("coreA", "deload", { when: "Tarde" })],
      wed: [easy(8), upper("deload").a, strength("coreB", "deload")],
      thu: [trail(9, 400, "suave")],
      fri: [easy(5, { optional: true, title: "5 km fáciles · opcional (Año Nuevo)" }), upper("deload").b],
      sat: SAT(),
      sun: [longRun(11, 22, { short: "últimos 8 km a M", segments: ["Km 1-14 fácil.", "Km 15-22 a ritmo M."] })],
    },
  },
  {
    n: 12, phase: "peak", focus: "Semana más fuerte · largo de 32 km",
    note: "Semana pico: el mayor volumen del plan. El largo de 32 km es tu ensayo general del maratón (hora, desayuno, zapatillas, geles).",
    days: {
      mon: MON(),
      tue: [threshold(4, "2 km", "2 min de trote", 13), strength("legsMaint", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(11), upper().a, strength("coreB")],
      thu: [trail(13, 800, "sim", 0, { extra: "Es tu sesión de subida más grande: 2/3 del desnivel de Ultravolcanes en 13 km." })],
      fri: [easy(5, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(12, 32, {
        title: "LARGO PICO · 32 km",
        segments: ["Todo a ritmo fácil. Los últimos 6 km pueden ir a M + 15 s si te sientes bien.", "Límite de tiempo: si llegas a 3 h 15 min, termina ahí aunque falten km."],
        claves: ["ENSAYO GENERAL A LA HORA DEL MARATÓN: alarma 1:30 am, desayuno de 80-115 g de carbohidratos a las 2:00 am y salida a las 4:00 am, con las zapatillas, ropa y geles del 14 de febrero. Acuéstate el sábado a las 7:30-8:00 pm."],
      })],
    },
  },
  {
    n: 13, phase: "peak", focus: "La sesión más específica: 14 km a M",
    days: {
      mon: MON(),
      tue: [threshold(6, "1 km", "1 min de trote", 12), strength("legsMaint", "normal", { when: "Tarde" }), strength("coreA", "normal", { when: "Tarde" })],
      wed: [easy(10), upper().a, strength("coreB")],
      thu: [trail(10, 550, "bajada", 4, { extra: "Última sesión de bajadas antes de Ultravolcanes: técnica, no velocidad." })],
      fri: [easy(5, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(13, 28, {
        title: "Largo 28 km · 14 km a ritmo maratón",
        segments: ["Km 1-10 fácil.", "Km 11-24: 14 km continuos a ritmo M. Es la sesión más específica del plan.", "Km 25-28 fácil."],
        claves: ["Repite el horario de 4:00 am si puedes: el bloque M de madrugada es lo más parecido al día de carrera.", "Si el bloque M sale cómodo y con pulso estable, tu objetivo {MGOAL} es realista. Si no, ajústalo en la pestaña Ritmos."],
      })],
    },
  },
  {
    n: 14, phase: "trail", focus: "Mini taper + Ultravolcanes",
    note: "Semana de Ultravolcanes: 21 km con ~1,200 m D+. Sin piernas en el gimnasio. La carrera del domingo es para DISFRUTAR a RPE 5-6, caminando las subidas y cuidando las bajadas: tu carrera A es en 3 semanas.",
    days: {
      mon: MON(),
      tue: [marathonPace("3 × 2 km a ritmo maratón", 10, ["3 × 2 km a {M} con 2 min de trote."]), strength("coreA")],
      wed: [easy(8), upper().a, strength("coreB", "deload")],
      thu: [trail(6, 200, "suave", 0, { title: "6 km El Espino · activación", extra: "Al final: 4 × 30 s de subida a RPE 7 con recuperación completa." })],
      fri: [easy(4, { strides: true }), upper("taper").b],
      sat: SAT(),
      sun: [trailRace()],
    },
  },
  {
    n: 15, phase: "spec", focus: "Recuperar + último bloque M",
    note: "Con 1,200 m de bajada acumulada, el cuádriceps tardará más en recuperarse que tras un 21K plano. Primeros 3 días: solo recuperar. El bloque M del jueves y el largo del domingo solo si el cuádriceps ya no duele al bajar escaleras.",
    days: {
      mon: MON(),
      tue: [recovery(6, { title: "6 km muy suaves (o 40 min de bici o caminata)" }), strength("coreA")],
      wed: [easy(8), upper().a, strength("coreB")],
      thu: [marathonPace("2 × 4 km a ritmo maratón", 13, ["2 × 4 km a {M} con 1 km suave."])],
      fri: [easy(6, { strides: true }), upper().b],
      sat: SAT(),
      sun: [longRun(15, 24, {
        short: "10 km a M",
        segments: ["Km 1-12 fácil.", "Km 13-22 a ritmo M.", "Km 23-24 fácil.", "PLAN B: si el cuádriceps sigue adolorido por Ultravolcanes, haz 20 km fáciles sin bloque M."],
      })],
    },
  },
  {
    n: 16, phase: "taper", focus: "Taper: menos volumen, misma intensidad",
    note: "Taper (Bosquet 2007): el volumen baja ~30 % pero la intensidad y la frecuencia se mantienen. Vas a sentir piernas raras: es normal.",
    days: {
      mon: MON(),
      tue: [threshold(5, "1 km", "2 min de trote", 11), strength("legsLight", "normal", { when: "Tarde" }), strength("coreA", "taper", { when: "Tarde" })],
      wed: [easy(9), upper("taper").a, strength("coreB", "taper")],
      thu: [marathonPace("5 km a ritmo maratón", 10, ["5 km continuos a {M}."])],
      fri: [easy(6, { strides: true }), upper("taper").b],
      sat: SAT(),
      sun: [longRun(16, 16, { short: "últimos 5 km a M", segments: ["Km 1-11 fácil.", "Km 12-16 a ritmo M."] })],
    },
  },
  {
    n: 17, phase: "taper", focus: "Semana de carrera",
    note: "Viernes y sábado: carga de carbohidratos (8-10 g/kg al día, ≈620-770 g). Baja fibra y grasa. Último gimnasio: el martes. Toda la semana acuéstate 30 min antes cada noche: el sábado a las 7:30-8:00 pm, alarma a la 1:30 am.",
    days: {
      mon: MON(),
      tue: [marathonPace("2 × 2 km a ritmo maratón + 4 strides", 9, ["2 × 2 km a {M} con 2 min de trote.", "4 strides de 20 s al final."]), upper("taper").a],
      wed: [easy(6)],
      thu: [marathonPace("6 km con 2 km a ritmo maratón", 6, ["2 km a {M} en la mitad del rodaje."], { purpose: "Recordatorio del ritmo de carrera sin ningún costo de fatiga." })],
      fri: [rest("Descanso · carga de carbohidratos (día 1)", "Día 1 de carga: 8-10 g de carbohidratos por kg (arroz, pasta, pan, papa, jugos). Poca fibra y grasa. Hidrátate.")],
      sat: [shakeout(4)],
      sun: [marathonRace()],
    },
  },
];

const slug = (s) => (s.kind === "strength" ? s.routine : s.kind);

// Asigna ids estables y títulos de fuerza
export const WEEKS = RAW.map((w) => ({
  ...w,
  days: Object.fromEntries(
    Object.entries(w.days).map(([day, list]) => [
      day,
      list.map((s) => ({
        ...s,
        id: `w${w.n}-${day}-${slug(s)}`,
        title: s.kind === "strength" ? routineFor(s.routine, s.variant).title : s.title,
      })),
    ])
  ),
}));

export const TOTAL_WEEKS = WEEKS.length;
