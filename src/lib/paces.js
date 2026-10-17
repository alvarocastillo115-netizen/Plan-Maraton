// Fórmulas VDOT de Jack Daniels y Jimmy Gilbert (Daniels' Running Formula).
// v en metros/minuto, t en minutos.
const vo2Cost = (v) => -4.6 + 0.182258 * v + 0.000104 * v * v;
const fractionSustained = (t) =>
  0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t);

export const vdotFrom = (meters, minutes) => vo2Cost(meters / minutes) / fractionSustained(minutes);

const velocityFor = (vo2) => {
  const a = 0.000104, b = 0.182258, c = -4.6 - vo2;
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
};

export function predictMinutes(vdot, meters) {
  let lo = 1, hi = 2000;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (vdotFrom(meters, mid) > vdot) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// segundos por km a una fracción del VDOT
const paceAt = (vdot, fraction) => 60000 / velocityFor(vdot * fraction);

// "1:53:26" o "24:30" -> minutos. Devuelve null si no es válido.
export function parseTime(str) {
  if (str === null || str === undefined) return null;
  const parts = String(str).trim().split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  const nums = parts.map((p) => (/^\d{1,3}$/.test(p.trim()) ? Number(p) : NaN));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  if (nums.slice(1).some((n) => n >= 60)) return null;
  const secs = nums.reduce((acc, n) => acc * 60 + n, 0);
  return secs > 0 ? secs / 60 : null;
}

export function formatDuration(minutes) {
  const s = Math.round(minutes * 60);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function formatPace(secPerKm) {
  const s = Math.round(secPerKm);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export const TEST_DISTANCES = [
  { label: "5K", m: 5000 },
  { label: "10K", m: 10000 },
  { label: "15K", m: 15000 },
  { label: "21.1K", m: 21097.5 },
  { label: "42.2K", m: 42195 },
];

export function computeTraining(settings) {
  const t = parseTime(settings.testTime);
  const dist = Number(settings.testDist) || 21097.5;
  const valid = !!t;
  const vdot = valid ? vdotFrom(dist, t) : 39;
  const predMarathon = predictMinutes(vdot, 42195);
  const goal = parseTime(settings.goalOverride);
  const marathonMin = goal || predMarathon;

  const paces = {
    Efast: paceAt(vdot, 0.7),
    Eslow: paceAt(vdot, 0.62),
    M: (marathonMin * 60) / 42.195,
    T: paceAt(vdot, 0.88),
    I: paceAt(vdot, 0.975),
    R: paceAt(vdot, 1.05),
  };

  const rest = Number(settings.hrRest) || 43;
  const max = Number(settings.hrMax) || 181;
  const hrr = Math.max(1, max - rest);
  const hr = (p) => Math.round(rest + p * hrr); // método Karvonen (frecuencia cardíaca de reserva)
  const zones = [
    { id: "Z1", name: "Recuperación", lo: hr(0.5), hi: hr(0.6), use: "Trote regenerativo y calentamientos" },
    { id: "Z2", name: "Fácil / aeróbico", lo: hr(0.6), hi: hr(0.72), use: "Rodajes y tiradas largas: el 80 % del plan" },
    { id: "Z3", name: "Ritmo maratón", lo: hr(0.72), hi: hr(0.82), use: "Bloques a ritmo M y finales de largos" },
    { id: "Z4", name: "Umbral", lo: hr(0.82), hi: hr(0.89), use: "Tempo e intervalos a ritmo T" },
    { id: "Z5", name: "VO2máx", lo: hr(0.89), hi: max, use: "Intervalos I y cuestas cortas" },
  ];

  const fp = formatPace;
  const tokens = {
    E: `${fp(paces.Efast)}-${fp(paces.Eslow)}/km`,
    M: `${fp(paces.M)}/km`,
    T: `${fp(paces.T)}/km`,
    I: `${fp(paces.I)}/km`,
    R: `${fp(paces.R)}/km`,
    FC_R: `<${zones[0].hi} lpm`,
    FC_E: `${zones[1].lo}-${zones[1].hi} lpm`,
    FC_M: `${zones[2].lo}-${zones[2].hi} lpm`,
    FC_T: `${zones[3].lo}-${zones[3].hi} lpm`,
    FC_I: `${zones[4].lo}-${zones[4].hi} lpm`,
    MGOAL: formatDuration(marathonMin),
    MPRED: formatDuration(predMarathon),
  };

  const preds = TEST_DISTANCES.map((d) => ({ label: d.label, minutes: predictMinutes(vdot, d.m) }));
  return { valid, vdot, paces, zones, tokens, preds, marathonMin, predMarathon, usingGoal: !!goal };
}

export const fillTokens = (text, tokens) =>
  typeof text === "string" ? text.replace(/\{([A-Z_]+)\}/g, (m, k) => tokens?.[k] ?? m) : text;
