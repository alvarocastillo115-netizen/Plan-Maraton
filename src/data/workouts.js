// ---------- GENERADORES DE SESIONES ----------
// Los textos usan tokens que se reemplazan con tus ritmos y zonas reales:
// {E} fácil · {M} maratón · {T} umbral · {I} intervalos · {R} repeticiones
// {FC_E} {FC_M} {FC_T} {FC_I} {FC_R} zonas de pulso · {MGOAL} tiempo objetivo de maratón

const GU = "GU Energy Gel (≈22 g de carbohidratos; revisa la etiqueta de tu sabor)";

// Progresión de entrenamiento intestinal: de ~40 g/h hasta 60-75 g/h (protocolo de maratón)
export function fuelFor(week) {
  if (week <= 4) return { gph: "~40 g/h", text: `Si pasas de 75 min: 1 ${GU} cada 30-35 min desde el minuto 45.` };
  if (week <= 8) return { gph: "~45 g/h", text: "2 GU por hora (cada 30 min) desde el minuto 30." };
  if (week <= 11) return { gph: "~55 g/h", text: "1 GU cada 25 min desde el minuto 25, siempre con 150-200 ml de agua." };
  return {
    gph: "60-75 g/h",
    text: "PROTOCOLO DE MARATÓN: 1 GU cada 20 min desde el minuto 20, o 2 GU/h + 500 ml/h de bebida isotónica. Ensaya exactamente lo que harás el 14 de febrero.",
  };
}

const run = (o) => ({ kind: "run", optional: false, dplus: 0, ...o });

// ---------- FÁCILES ----------
export const easy = (km, o = {}) =>
  run({
    surface: o.trail ? "trail" : "asfalto",
    title: o.title || `${km} km fáciles${o.strides ? " + 6 strides" : ""}${o.trail ? " · El Espino" : ""}`,
    km,
    dplus: o.dplus || 0,
    optional: !!o.optional,
    intensity: "E",
    det: {
      objetivo:
        o.purpose ||
        `Rodaje aeróbico de ${km} km. Construye la base (capilares, mitocondrias, tolerancia al impacto) sin generar fatiga que comprometa las sesiones clave.`,
      calentamiento: "No necesita: los primeros 10 minutos, más lentos que el resto.",
      ejecucion: [
        "Ritmo fácil {E} o pulso {FC_E}. Debes poder hablar en frases completas.",
        o.trail
          ? "En El Espino guíate por pulso y sensación, no por el ritmo: camina las cuestas empinadas si el pulso se sale de la zona."
          : "Asfalto plano o con ondulaciones suaves.",
        o.strides
          ? "Al terminar: 6 strides de 20 s, acelerando progresivamente hasta ~90 % con técnica suelta. Recupera caminando 40-60 s entre cada uno."
          : "Termina sintiéndote mejor que cuando empezaste.",
        ...(o.extra ? [o.extra] : []),
      ],
      claves: [
        "Si dudas entre dos ritmos, elige el lento. El 80 % de tu semana vive aquí.",
        "Con calor o humedad alta manda el pulso: el ritmo puede caer 10-20 s/km y está bien.",
        ...(o.claves || []),
      ],
    },
  });

export const recovery = (km, o = {}) =>
  easy(km, {
    ...o,
    title: o.title || `${km} km muy suaves · recuperación`,
    purpose:
      o.purpose ||
      "Trote regenerativo: mover las piernas para acelerar la recuperación. No suma forma física; resta fatiga.",
    extra: "Pulso por debajo de {FC_R} si puedes; si no, el extremo bajo de {FC_E}.",
  });

// ---------- CALIDAD EN ASFALTO ----------
export const fartlek = (reps, km) =>
  run({
    surface: "asfalto",
    title: `Fartlek ${reps} × 1' fuerte / 1' suave`,
    km,
    intensity: "I",
    det: {
      objetivo:
        "Primera sesión de calidad del ciclo: reactivar la velocidad después de la carrera de septiembre, sin la presión de un ritmo exacto.",
      calentamiento: "2 km fáciles + movilidad dinámica de cadera y tobillo.",
      ejecucion: [
        `${reps} repeticiones de 1 minuto fuerte (RPE 8, cerca de {I}) por 1 minuto de trote suave.`,
        "La primera y la última repetición deben salir al mismo ritmo.",
        "Enfriamiento: 2 km muy suaves.",
      ],
      claves: ["No son sprints: fuerte y controlado.", "Postura alta, brazos relajados, cadencia rápida."],
    },
  });

export const threshold = (reps, dist, rec, km, o = {}) =>
  run({
    surface: "asfalto",
    title: `${reps} × ${dist} a ritmo umbral (T)`,
    km,
    intensity: "T",
    det: {
      objetivo:
        "Subir tu umbral de lactato: el ritmo más rápido que sostienes sin que la fatiga se dispare. Es el motor del maratón.",
      calentamiento: "2-3 km fáciles + 4 strides + movilidad de cadera y tobillo.",
      ejecucion: [
        `${reps} × ${dist} a {T} (pulso de referencia {FC_T}). Recuperación: ${rec} suave.`,
        "RPE 7 de 10: \"cómodamente duro\". Puedes decir frases cortas, no conversar.",
        "Todas las repeticiones al mismo ritmo. Si la última sale más de 5 s/km lenta, empezaste rápido.",
        "Enfriamiento: 2 km muy suaves.",
        ...(o.extra ? [o.extra] : []),
      ],
      claves: [
        "El error clásico es convertirlo en carrera: terminas sintiendo que podías hacer una repetición más.",
        "En asfalto plano, para controlar el ritmo real.",
        ...(o.claves || []),
      ],
    },
  });

export const intervals = (reps, dist, rec, km) =>
  run({
    surface: "asfalto",
    title: `${reps} × ${dist} a ritmo de intervalos (I)`,
    km,
    intensity: "I",
    det: {
      objetivo: "Estimular el VO2máx: subir el techo aeróbico para que el ritmo de maratón quede más lejos de tu límite.",
      calentamiento: "3 km fáciles + 4 strides.",
      ejecucion: [
        `${reps} × ${dist} a {I} (al final de cada repetición el pulso debería tocar {FC_I}).`,
        `Recuperación: ${rec} muy suave.`,
        "Si en la repetición 3-4 el ritmo cae más de 5-8 s, ajusta desde la siguiente.",
        "Enfriamiento: 2 km muy suaves.",
      ],
      claves: ["Esfuerzo fuerte pero repetible (~90 %), no sprint.", "Semana de construcción: es la sesión más dura de la semana."],
    },
  });

export const marathonPace = (title, km, lines, o = {}) =>
  run({
    surface: "asfalto",
    title,
    km,
    intensity: "M",
    det: {
      objetivo:
        o.purpose ||
        "Especificidad pura: grabar en cuerpo y mente tu ritmo de maratón ({M}, objetivo {MGOAL}) y volverlo económico.",
      calentamiento: "2-3 km fáciles + 3 strides.",
      ejecucion: [...lines, "Pulso de referencia a ritmo M: {FC_M}. Con calor, manda el pulso.", "Enfriamiento: 1-2 km suaves."],
      claves: [
        "El ritmo M debe sentirse \"demasiado fácil\" al principio. Si hoy no lo es, no lo fuerces: es información útil.",
        "Usa las zapatillas de carrera en al menos la mitad de estas sesiones.",
        ...(o.claves || []),
      ],
    },
  });

// ---------- TRAIL EN EL ESPINO ----------
const TRAIL_VARIANTS = {
  cortas: (reps) => [
    `Dentro del recorrido: ${reps} cuestas de 45 s en una pendiente fuerte (8-15 %) a RPE 8.`,
    "Recuperación: baja caminando o trotando muy suave. Arranca la siguiente cuando respires casi normal.",
  ],
  medias: (reps) => [
    `Dentro del recorrido: ${reps} cuestas de 60-90 s (5-8 %) a RPE 8, como si empujaras los últimos 400 m de una carrera.`,
    "Pasos cortos, torso inclinado desde el tobillo, brazos activos. Baja trotando muy suave.",
  ],
  largas: (reps) => [
    `Dentro del recorrido: ${reps} subidas sostenidas de 3-4 min a RPE 7 (zona {FC_T} baja).`,
    "Si la pendiente pasa de 15 %, alterna 1 min corriendo y 1 min de power hike fuerte con manos en los muslos.",
  ],
  bajada: (reps) => [
    `Dentro del recorrido: ${reps} bajadas técnicas de 2-3 min a ritmo decidido (no frenando), subiendo caminando entre cada una.`,
    "Técnica: cadencia alta, pasos cortos, mirada 3-4 m adelante, brazos abiertos como estabilizadores.",
    "Es entrenamiento excéntrico para el cuádriceps: puede dejar agujetas 1-2 días. Por eso el viernes es fácil.",
  ],
  sim: () => [
    "Simulación de Ultravolcanes (21 km con ~1,200 m D+, unos 57 m por km): repite la subida más larga de El Espino las veces necesarias para sumar el desnivel de hoy.",
    "Sube a esfuerzo constante (RPE 6-7), alternando trote y power hike según la pendiente. Con más de 12-15 % de pendiente, el power hike es más eficiente que trotar.",
    "Las bajadas, a ritmo de carrera pero controladas: el objetivo es que el cuádriceps aprenda, no que se destruya.",
    "Practica comer en movimiento: 1 GU a los 40 min aunque la sesión sea corta.",
  ],
  suave: () => ["Todo a ritmo cómodo por pulso ({FC_E}). Camina las cuestas fuertes. Hoy solo se acumula tiempo en el terreno."],
};

export const trail = (km, dplus, variant, reps, o = {}) =>
  run({
    surface: "trail",
    title: o.title || `${km} km El Espino · ~${dplus} m D+ · ${
      { cortas: "cuestas cortas", medias: "cuestas", largas: "subidas largas", bajada: "bajadas técnicas", sim: "simulación de carrera", suave: "suave" }[variant]
    }`,
    km,
    dplus,
    intensity: variant === "suave" ? "E" : "mix",
    det: {
      objetivo:
        o.purpose ||
        `Fuerza específica de subida y técnica de bajada para Ultravolcanes, en tu día de trail. ${km} km con ~${dplus} m de desnivel positivo.`,
      calentamiento: "Los primeros 2-3 km del recorrido a ritmo muy fácil sirven de calentamiento.",
      ejecucion: [
        "Fuera de las repeticiones: ritmo fácil por pulso ({FC_E}).",
        ...TRAIL_VARIANTS[variant](reps),
        ...(o.extra ? [o.extra] : []),
      ],
      claves: [
        "En subida: mira 3-4 m adelante, no a tus pies ni a la cima.",
        "Con lodo: pasos más cortos y el pie bajo tu centro de gravedad.",
        "RPE y pulso, nunca ritmo/km: el terreno técnico distorsiona el reloj.",
        ...(o.claves || []),
      ],
    },
  });

// ---------- TIRADAS LARGAS (ASFALTO, DOMINGO) ----------
export const longRun = (week, km, o = {}) => {
  const fuel = fuelFor(week);
  return run({
    surface: "asfalto",
    title: o.title || `Largo ${km} km${o.short ? ` · ${o.short}` : " · fácil"}`,
    km,
    // solo es sesión de ritmo M si algún tramo se corre "a ritmo M"
    intensity: o.segments?.some((t) => /a ritmo M\b/.test(t)) ? "M" : "E",
    det: {
      objetivo:
        o.purpose ||
        `Resistencia aeróbica y durabilidad: ${km} km en asfalto. Es la sesión más importante de la semana para el maratón.`,
      calentamiento: "Arranca directamente, pero los primeros 3 km claramente más lentos de lo que te pide el cuerpo.",
      ejecucion: [
        "Ritmo base: fácil {E}, pulso {FC_E}.",
        ...(o.segments || ["Todo a ritmo fácil. Si en los últimos 3 km te sientes muy bien, puedes acercarte a ritmo M + 20 s, nunca más rápido."]),
        `NUTRICIÓN (${fuel.gph}): ${fuel.text}`,
      ],
      claves: [
        "Sal lo más temprano posible (4:00-5:00 am): el maratón sale a las 4:00 am y tu cuerpo tiene que acostumbrarse a correr a esa hora.",
        "Hidratación: 400-800 ml/h según el calor, con electrolitos (300-600 mg de sodio/h) si pasas de 2 h.",
        ...(o.claves || []),
      ],
    },
  });
};

// ---------- PRUEBAS DE CALIBRACIÓN ----------
export const timeTrial = (dist, km) =>
  run({
    kind: "test",
    surface: "asfalto",
    title: `PRUEBA ${dist} contrarreloj`,
    km,
    intensity: "T",
    det: {
      objetivo: `Medir tu forma real para recalcular TODOS los ritmos del plan. Introduce el resultado en la pestaña Ritmos (distancia ${dist}).`,
      calentamiento: "2.5 km fáciles + 4 strides + 3 min de movilidad. Llega a la salida con el pulso activado.",
      ejecucion: [
        `${dist} al máximo esfuerzo SOSTENIBLE en un recorrido plano y medido (pista, avenida o un circuito que conozcas).`,
        "Primer km 3-5 s más lento que tu ritmo objetivo. Luego estabiliza y aprieta en el último 20 %.",
        "Enfriamiento: 2 km muy suaves.",
      ],
      claves: [
        "Desayuno ligero 2 h antes, como en una carrera.",
        "Usa el tiempo del reloj, no la predicción de Garmin: el plan se ajusta a lo que corres, no a lo que estima el reloj.",
      ],
    },
  });

// ---------- CARRERAS ----------
export const trailRace = () =>
  run({
    kind: "race",
    surface: "trail",
    title: "ULTRAVOLCANES 21K · ~1,200 m D+ · para disfrutar",
    km: 21,
    dplus: 1200,
    intensity: "E",
    det: {
      objetivo:
        "Disfrutar y sumar la última gran sesión de resistencia antes del maratón. Tu carrera A es dentro de 3 semanas: hoy NO se corre a tope. Con ~1,200 m de desnivel, calcula entre 3 h 15 min y 4 h en movimiento.",
      calentamiento: "10 min de caminata y trote muy suave. Nada más: la carrera es tu calentamiento.",
      ejecucion: [
        "Esfuerzo RPE 5-6 todo el día. Pulso mayormente en {FC_E} con picos en las subidas; si te pasas de {FC_M} por mucho tiempo, camina.",
        "Power hike en TODA cuesta empinada desde el principio. Con 57 m de desnivel por km, vas a caminar mucho: es lo correcto. Correr cuestas hoy no te da nada para el maratón.",
        "Bajadas controladas, pasos cortos y sin frenar en seco. Probablemente bajes lo mismo que subes: ese daño excéntrico del cuádriceps es lo que más tarda en recuperarse y lo que más pone en riesgo el maratón.",
        "Nutrición: 1 GU cada 20-25 min desde el minuto 20. Lleva 1-1.5 L de líquido con electrolitos además de lo que den en los puestos.",
      ],
      claves: [
        "Si el terreno está extremo (como la lluvia de Comasagua) o llegas con molestias, está bien no correrla: el maratón manda.",
        "Si las piernas te piden apretar en el último tercio, hazlo en las subidas, nunca en las bajadas.",
        "Toma fotos, habla con la gente, disfruta. Ese es el objetivo.",
        "Al terminar: come carbohidratos y proteína en la primera hora y camina 10-15 min.",
      ],
    },
  });

export const marathonRace = () =>
  run({
    kind: "race",
    surface: "asfalto",
    title: "MARATÓN EL SALVADOR · 42.2K",
    km: 42.2,
    intensity: "M",
    det: {
      objetivo:
        "Carrera A del ciclo. Salida 4:00 am, recorrido casi plano (~60 m D+). Objetivo: {MGOAL} a {M}, con un ritmo parejo o ligeramente más rápido en la segunda mitad.",
      calentamiento: "10 min de trote muy suave + 3 strides cortos, 20-30 min antes de la salida. Llega a la línea hidratado y sin prisa.",
      ejecucion: [
        "Km 1-5: 5-10 s/km MÁS LENTO que {M}. A oscuras y con adrenalina es fácil salir rápido: es lo que más tiempo te ahorra al final.",
        "Km 5-30: ritmo M exacto. Con un recorrido tan plano, el ritmo debe ser casi constante; el pulso subirá poco a poco y es normal.",
        "Km 30-42: coincide con el amanecer y el calor. Si vas bien, aprieta 2-3 s/km cada 2 km; si sube el calor, manda el pulso ({FC_M}).",
        "Nutrición: 1 GU cada 20 min desde el minuto 20 + agua en cada puesto. Sodio desde la primera hora: a las 6-7 am ya hará calor.",
      ],
      claves: [
        "Desayuno de 1-1.5 g de carbohidratos por kg (80-115 g) a la 1:30-2:00 am: pan blanco con miel, banano, bebida isotónica. Es el mismo que ensayaste en los largos de las semanas 12 y 13.",
        "La noche importante es la del jueves: duerme 8-9 h. El sábado acuéstate a las 7:30-8:00 pm aunque no duermas mucho.",
        "Nada nuevo hoy: ni zapatillas, ni geles, ni ropa. Revisa si el recorrido tiene iluminación; si no, lleva una linterna de pecho o frontal ligera.",
        "Confía en el plan.",
      ],
    },
  });

export const shakeout = (km) =>
  run({
    surface: "asfalto",
    title: `${km} km de soltura + 4 strides`,
    km,
    intensity: "E",
    det: {
      objetivo: "Soltar las piernas el día antes de la carrera.",
      calentamiento: "No necesita.",
      ejecucion: ["Trote muy suave por pulso ({FC_R}-{FC_E}).", "4 strides de 15 s al final, sin cansarte."],
      claves: ["Prepara todo hoy: dorsal, ropa, geles, zapatillas, desayuno.", "Acuéstate a las 7:30-8:00 pm aunque no tengas sueño: la alarma suena a la 1:30 am y la noche importante ya fue la del jueves."],
    },
  });

export const rest = (title = "Descanso de correr", text) => ({
  kind: "rest",
  surface: "descanso",
  title,
  km: 0,
  dplus: 0,
  optional: false,
  intensity: null,
  det: {
    objetivo: text || "El descanso es parte del entrenamiento: aquí es donde el cuerpo asimila la carga.",
    calentamiento: "—",
    ejecucion: ["Caminar, movilidad suave o estiramientos son bienvenidos.", "Prioriza dormir 7.5-8 h."],
    claves: ["Si te sientes con mucha energía, no la gastes: guárdala para la próxima sesión clave."],
  },
});

export const strength = (routine, variant = "normal", o = {}) => ({
  kind: "strength",
  surface: "fuerza",
  routine,
  variant,
  km: 0,
  dplus: 0,
  optional: !!o.optional,
  intensity: null,
  when: o.when || null,
});
