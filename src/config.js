// ---------- CONFIGURACIÓN CENTRAL ----------
// Todo el calendario se deriva de START_DATE: cambiar esta fecha mueve el plan completo.
export const START_DATE = [2026, 9, 19]; // lunes 19 oct 2026 (mes 0-indexado)

export const ATHLETE = {
  name: "Alvaro",
  age: 27,
  heightCm: 176,
  weightKg: 77.1, // 170 lb
};

export const RACES = [
  {
    id: "trail",
    name: "Ultravolcanes 21K",
    short: "ULTRAVOLCANES",
    date: [2027, 0, 24],
    km: 21,
    dplus: 1200,
    start: null,
    surface: "trail",
    priority: "B",
    goal: "Disfrutar · RPE 5-6 · power hike en las subidas · sin atacar bajadas",
  },
  {
    id: "marathon",
    name: "Maratón El Salvador",
    short: "MARATÓN",
    date: [2027, 1, 14],
    km: 42.195,
    dplus: 60,
    start: "4:00 am",
    surface: "asfalto",
    priority: "A",
    goal: "A tope",
  },
];

// Ajustes por defecto de ritmos y pulso (editables en la pestaña Ritmos)
export const DEFAULT_SETTINGS = {
  testDist: 21097.5,
  testTime: "1:53:26",
  testLabel: "Predicción Garmin 21K",
  hrRest: 43,
  hrMax: 181,
  goalOverride: "",
};

export const PROTEIN = {
  min: Math.round(ATHLETE.weightKg * 1.6),
  max: Math.round(ATHLETE.weightKg * 2.0),
};
