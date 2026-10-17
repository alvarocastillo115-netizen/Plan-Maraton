// ---------- RUTINAS DE FUERZA ----------
// Base: Spiering et al. 2021. La masa y la fuerza se mantienen con poco volumen
// si la CARGA se mantiene. Por eso en descargas y taper bajan las series, nunca el peso.
// RIR = repeticiones en reserva (cuántas más podrías hacer al terminar la serie).

export const ROUTINES = {
  upperA: {
    title: "Tren superior A · Fuerza",
    minutes: 45,
    objetivo:
      "Mantener (y si se puede, ganar) fuerza y masa en espalda, hombros, pecho y brazos con cargas altas y pocas repeticiones. Es la sesión que más protege tu masa muscular.",
    calentamiento:
      "5 min: círculos de hombro, 10 escápulas en barra (colgado, solo mover escápulas), 10 flexiones fáciles y 1 serie de aproximación de dominadas y fondos sin peso.",
    claves: [
      "Descanso: 2-3 min entre series de dominadas y fondos; 90 s en el resto.",
      "Progresión: cuando completes todas las series en el tope del rango de repeticiones con RIR 2, sube 5 lb en el cinturón o en las mancuernas.",
      "Va en un día SIN carrera (lunes) para no sumar fatiga a las sesiones clave.",
    ],
    exercises: [
      { id: "pullw", name: "Dominadas lastradas (agarre prono)", sets: 4, reps: "5-6", load: "+25 lb", note: "RIR 2. Pecho a la barra, bajada controlada de 2 s. Cuando hagas 4×6 limpias: +5 lb." },
      { id: "dipw", name: "Fondos lastrados", sets: 4, reps: "6-8", load: "+25 lb", note: "Baja hasta que el hombro quede a la altura del codo. Torso ligeramente inclinado." },
      { id: "ohp", name: "Press de hombro con mancuernas", sets: 3, reps: "8-10", load: "RIR 2", note: "Abdomen y glúteos apretados: sin arquear la zona lumbar." },
      { id: "row1", name: "Remo a una mano con mancuerna", sets: 3, reps: "8-10 por lado", load: "RIR 2", note: "Apoya mano y rodilla en un banco o silla firme. Lleva el codo hacia la cadera." },
      { id: "curl", name: "Curl de bíceps con mancuernas", sets: 3, reps: "8-10", load: "RIR 1-2", note: "Sin balanceo. Bajada de 2-3 s." },
      { id: "lat", name: "Elevaciones laterales", sets: 2, reps: "12-15", load: "RIR 1", note: "Codos ligeramente flexionados, sube hasta la altura del hombro." },
    ],
  },
  upperB: {
    title: "Tren superior B · Volumen + abdomen",
    minutes: 45,
    objetivo:
      "Estímulo de hipertrofia con más repeticiones y tiempo bajo tensión, más dos ejercicios de abdomen. Complementa la sesión A sin cargas máximas.",
    calentamiento: "5 min: movilidad de hombro, 10 escápulas en barra y 10 flexiones.",
    claves: [
      "Descanso: 60-90 s entre series.",
      "Si el viernes llegas cansado del jueves de trail, baja una serie por ejercicio: el domingo manda la tirada larga.",
      "Hazla después del rodaje fácil (puede ser en la tarde).",
    ],
    exercises: [
      { id: "chin", name: "Dominadas supinas (chin-ups)", sets: 3, reps: "8-10", load: "Peso corporal", note: "RIR 2. Si pasas de 10 limpias, añade 10 lb." },
      { id: "dipbw", name: "Fondos con bajada lenta", sets: 3, reps: "10-15", load: "Peso corporal", note: "3 s de bajada, 1 s de pausa abajo, subida normal." },
      { id: "row2", name: "Remo inclinado con dos mancuernas", sets: 3, reps: "10-12", load: "RIR 2", note: "Torso a ~45°, espalda neutra." },
      { id: "lat2", name: "Elevaciones laterales", sets: 3, reps: "15", load: "RIR 1", note: "Última serie: al terminar, 10 parciales." },
      { id: "rear", name: "Pájaros (deltoide posterior)", sets: 3, reps: "15", load: "Ligero", note: "Clave para la postura en los km finales." },
      { id: "hammer", name: "Curl martillo", sets: 3, reps: "10-12", load: "RIR 1-2", note: "Alterna brazos." },
      { id: "hlr", name: "Elevaciones de piernas colgado", sets: 3, reps: "10-12", load: "Peso corporal", note: "Sin balanceo: sube la pelvis, no solo las piernas." },
      { id: "wcrunch", name: "Crunch con mancuerna en el pecho", sets: 3, reps: "12-15", load: "Moderado", note: "Exhala al subir, 1 s de contracción arriba." },
    ],
  },
  coreA: {
    title: "Core A · Estabilidad para correr",
    minutes: 15,
    objetivo:
      "Anti-rotación y estabilidad de pelvis: lo que mantiene tu técnica cuando llega la fatiga en el km 30 y en las bajadas del trail.",
    calentamiento: "No necesita si viene después de otra sesión. Si va sola: 2 min de movilidad de cadera.",
    claves: ["Calidad sobre cantidad: si se pierde la posición, termina la serie.", "Circuito: 3 vueltas, 45-60 s de pausa entre vueltas."],
    exercises: [
      { id: "deadbug", name: "Dead bug", sets: 3, reps: "8 por lado", load: "Peso corporal", note: "Zona lumbar pegada al suelo todo el tiempo." },
      { id: "sideplank", name: "Plancha lateral", sets: 3, reps: "30-45 s por lado", load: "Peso corporal", note: "Cadera alta, cuerpo en línea." },
      { id: "suitcase", name: "Caminata con mancuerna en una mano (suitcase carry)", sets: 3, reps: "30-40 m por lado", load: "Pesado", note: "Hombros nivelados, sin inclinarte hacia la mancuerna." },
      { id: "birddog", name: "Bird dog con pausa", sets: 3, reps: "8 por lado", load: "Peso corporal", note: "2 s de pausa con brazo y pierna extendidos." },
    ],
  },
  coreB: {
    title: "Core B · Abdomen",
    minutes: 15,
    objetivo: "Trabajo directo de recto abdominal y oblicuos, más aductores (plancha Copenhague) para proteger la cadera.",
    calentamiento: "No necesita si viene después del rodaje.",
    claves: ["Circuito: 3 vueltas.", "Para progresar: más tiempo en las isometrías o más peso en los giros."],
    exercises: [
      { id: "hlr2", name: "Elevaciones de piernas colgado", sets: 3, reps: "8-12", load: "Peso corporal", note: "Controla la bajada." },
      { id: "hollow", name: "Hollow hold", sets: 3, reps: "20-40 s", load: "Peso corporal", note: "Zona lumbar pegada al suelo." },
      { id: "copen", name: "Plancha Copenhague", sets: 3, reps: "15-25 s por lado", load: "Peso corporal", note: "Empieza con la rodilla apoyada; progresa al pie." },
      { id: "twist", name: "Giros rusos con mancuerna", sets: 3, reps: "20 totales", load: "Moderado", note: "Gira desde el torso, no solo con los brazos." },
    ],
  },
  legsAdapt: {
    title: "Piernas · Adaptación",
    minutes: 30,
    objetivo:
      "Preparar tendones y músculos para la fase pesada. Incluye trabajo excéntrico (bajada lenta) para que el cuádriceps aguante las bajadas de Ultravolcanes.",
    calentamiento: "5 min: sentadillas sin peso, zancadas caminando, puentes de glúteo.",
    claves: [
      "Ideal: en la tarde del martes, 6 h o más después de la sesión de calidad. Si no puedes, hazla justo después de correr, nunca antes.",
      "Agujetas leves los primeros días son normales; si te impiden correr el jueves, baja una serie.",
    ],
    exercises: [
      { id: "bulg", name: "Sentadilla búlgara con mancuernas", sets: 3, reps: "10 por lado", load: "Moderado (RIR 3)", note: "Pie trasero en banco o silla. Rodilla delantera alineada con el pie." },
      { id: "rdl", name: "Peso muerto rumano con mancuernas", sets: 3, reps: "10", load: "Moderado (RIR 3)", note: "Cadera atrás, espalda neutra, mancuernas pegadas a las piernas." },
      { id: "stepdown", name: "Step-down excéntrico", sets: 2, reps: "8 por lado", load: "Peso corporal", note: "Desde un escalón, baja en 3 s tocando el suelo con el talón." },
      { id: "calf", name: "Elevación de talones a una pierna", sets: 3, reps: "15 por lado", load: "Peso corporal", note: "2 series con rodilla recta y 1 con rodilla flexionada (sóleo)." },
    ],
  },
  legsHeavy: {
    title: "Piernas · Fuerza pesada",
    minutes: 35,
    objetivo:
      "Fuerza pesada para mejorar la economía de carrera (meta-análisis Eihara 2022: las cargas altas funcionan mejor que la pliometría) y blindar el cuádriceps para el trail.",
    calentamiento: "5 min dinámicos + 1 serie de aproximación de cada ejercicio con la mitad del peso.",
    claves: [
      "Pesado = RIR 2: las últimas reps cuestan pero la técnica es perfecta.",
      "Si tienes acceso a gimnasio: cambia la búlgara por sentadilla con barra o hexagonal 4×4-5 al 80-85 %.",
      "Martes en la tarde, 6 h o más después de la calidad. Nunca la víspera de un largo.",
    ],
    exercises: [
      { id: "bulg", name: "Sentadilla búlgara con mancuernas", sets: 4, reps: "6 por lado", load: "Pesado (RIR 2)", note: "Las mancuernas más pesadas que tengas." },
      { id: "rdl", name: "Peso muerto rumano (a dos o a una pierna)", sets: 4, reps: "6-8", load: "Pesado (RIR 2)", note: "Si las mancuernas se quedan cortas: versión a una pierna." },
      { id: "stepdown", name: "Step-down excéntrico", sets: 3, reps: "8 por lado", load: "Mancuerna ligera", note: "Bajada de 4 s: es tu seguro para las bajadas." },
      { id: "calf", name: "Elevación de talones a una pierna con mancuerna", sets: 3, reps: "10-12 por lado", load: "Pesado", note: "Pausa de 1 s arriba." },
      { id: "pogo", name: "Saltos pogo (tobillos rígidos)", sets: 3, reps: "20", load: "Peso corporal", note: "Contactos cortos y elásticos. Al principio de la sesión, frescos." },
    ],
  },
  legsMaint: {
    title: "Piernas · Mantenimiento",
    minutes: 20,
    objetivo: "Mantener la fuerza ganada con el mínimo costo de fatiga mientras el volumen de carrera está en su pico.",
    calentamiento: "5 min dinámicos.",
    claves: ["Misma carga pesada, la mitad de series.", "Si el largo del domingo fue muy exigente, sáltala sin culpa."],
    exercises: [
      { id: "bulg", name: "Sentadilla búlgara con mancuernas", sets: 2, reps: "5 por lado", load: "Pesado (RIR 2)", note: "" },
      { id: "rdl", name: "Peso muerto rumano", sets: 2, reps: "6", load: "Pesado (RIR 2)", note: "" },
      { id: "stepdown", name: "Step-down excéntrico", sets: 2, reps: "6 por lado", load: "Mancuerna ligera", note: "Bajada de 4 s." },
      { id: "calf", name: "Elevación de talones a una pierna", sets: 2, reps: "10 por lado", load: "Pesado", note: "" },
      { id: "pogo", name: "Saltos pogo", sets: 2, reps: "15", load: "Peso corporal", note: "" },
    ],
  },
  legsLight: {
    title: "Piernas · Ligera",
    minutes: 15,
    objetivo: "Mantener el patrón de movimiento en semanas de descarga o taper sin generar agujetas.",
    calentamiento: "5 min dinámicos.",
    claves: ["Carga moderada, lejos del fallo (RIR 4). Debes salir más suelto de como entraste."],
    exercises: [
      { id: "bulg", name: "Sentadilla búlgara", sets: 2, reps: "6 por lado", load: "Moderado (RIR 4)", note: "" },
      { id: "rdl", name: "Peso muerto rumano", sets: 2, reps: "6", load: "Moderado (RIR 4)", note: "" },
      { id: "calf", name: "Elevación de talones", sets: 2, reps: "12 por lado", load: "Peso corporal", note: "" },
    ],
  },
};

// Variantes: misma carga, menos series (descarga) o mínimo (taper)
export function routineFor(id, variant = "normal") {
  const base = ROUTINES[id];
  if (!base) throw new Error(`Rutina desconocida: ${id}`);
  if (variant === "normal") return { ...base, variant };
  const factor = variant === "deload" ? 2 / 3 : 0.5;
  const exercises = base.exercises.map((e) => ({ ...e, sets: Math.max(1, Math.round(e.sets * factor)) }));
  const extra =
    variant === "deload"
      ? "SEMANA DE DESCARGA: misma carga, ~1/3 menos de series. Así se mantiene la masa sin acumular fatiga."
      : "TAPER: misma carga, la mitad de series y nada al fallo. Solo mantener el estímulo.";
  return {
    ...base,
    variant,
    title: `${base.title} · ${variant === "deload" ? "descarga" : "taper"}`,
    minutes: Math.round(base.minutes * (variant === "deload" ? 0.75 : 0.6)),
    exercises,
    claves: [extra, ...base.claves],
  };
}
