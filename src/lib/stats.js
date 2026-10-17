import { DAY_KEYS } from "./dates.js";

export const allSessions = (week) => DAY_KEYS.flatMap((d) => week.days[d] || []);
export const isTrackable = (s) => s.kind !== "rest";
export const isRun = (s) => s.km > 0;

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

// km planificados de la semana: solo sesiones obligatorias
export const plannedKm = (week) =>
  allSessions(week).filter((s) => isRun(s) && !s.optional).reduce((a, s) => a + s.km, 0);

export const plannedDplus = (week) =>
  allSessions(week).filter((s) => !s.optional).reduce((a, s) => a + (s.dplus || 0), 0);

// km hechos: usa los km reales registrados si existen; si no, los planificados
export const kmDoneFor = (s, state) => {
  if (!isRun(s) || !state.done[s.id]) return 0;
  const real = num(state.logs[s.id]?.km);
  return real ?? s.km;
};

export const weekKmDone = (week, state) => allSessions(week).reduce((a, s) => a + kmDoneFor(s, state), 0);

export const weekComplete = (week, state) =>
  allSessions(week).filter((s) => isTrackable(s) && !s.optional).every((s) => state.done[s.id]);

export function totals(weeks, state) {
  let req = 0, reqDone = 0, optDone = 0, strength = 0, strengthDone = 0, km = 0, kmDone = 0, dplus = 0;
  for (const w of weeks) {
    km += plannedKm(w);
    kmDone += weekKmDone(w, state);
    dplus += plannedDplus(w);
    for (const s of allSessions(w)) {
      if (!isTrackable(s)) continue;
      if (s.optional) { if (state.done[s.id]) optDone++; continue; }
      req++;
      if (state.done[s.id]) reqDone++;
      if (s.kind === "strength") { strength++; if (state.done[s.id]) strengthDone++; }
    }
  }
  return { req, reqDone, optDone, strength, strengthDone, km, kmDone, dplus };
}

export const paceFromLog = (log) => {
  const km = num(log?.km);
  const t = String(log?.time || "").trim();
  if (!km || !t) return null;
  const parts = t.split(":").map(Number);
  if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return null;
  const secs = parts.reduce((a, n) => a * 60 + n, 0);
  if (!secs) return null;
  const p = Math.round(secs / km);
  return `${Math.floor(p / 60)}:${String(p % 60).padStart(2, "0")}/km`;
};

export const fmtKm = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
