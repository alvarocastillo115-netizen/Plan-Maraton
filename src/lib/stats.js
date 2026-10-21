import { DAY_KEYS, sessionDate, daysBetween } from "./dates.js";

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

// ---------- DASHBOARD ----------
// Recorre las sesiones en orden cronológico con su fecha
export const datedSessions = (weeks) =>
  weeks.flatMap((w) => DAY_KEYS.flatMap((d) => (w.days[d] || []).map((s) => ({ s, w, d, date: sessionDate(w.n, d) }))));

export function dashboard(weeks, state, now) {
  const all = datedSessions(weeks);
  // Adherencia: sesiones obligatorias con fecha de hoy o anterior que ya están completadas
  // (las de hoy solo cuentan cuando ya están hechas, para no penalizar la mañana)
  const due = all.filter((x) => {
    if (!isTrackable(x.s) || x.s.optional) return false;
    const diff = daysBetween(x.date, now);
    return diff > 0 || (diff === 0 && !!state.done[x.s.id]);
  });
  const dueDone = due.filter((x) => state.done[x.s.id]).length;

  // Últimos 7 días (incluye hoy)
  const recent = all.filter((x) => {
    const diff = daysBetween(x.date, now);
    return diff >= 0 && diff < 7 && state.done[x.s.id];
  });
  const rpes = recent.map((x) => Number(state.logs[x.s.id]?.rpe)).filter((n) => n >= 1 && n <= 10);

  const dplusDone = all.reduce((a, x) => a + (state.done[x.s.id] ? x.s.dplus || 0 : 0), 0);

  // Última carga registrada de un ejercicio (la más reciente en el calendario)
  const lastLoad = (exId) => {
    for (let i = all.length - 1; i >= 0; i--) {
      const v = state.logs[all[i].s.id]?.ex?.[exId];
      if (v && String(v).trim()) return { value: String(v).trim(), week: all[i].w.n };
    }
    return null;
  };

  return {
    due: due.length,
    dueDone,
    adherence: due.length ? Math.round((dueDone / due.length) * 100) : null,
    last7: {
      km: recent.reduce((a, x) => a + kmDoneFor(x.s, state), 0),
      sessions: recent.length,
      rpe: rpes.length ? rpes.reduce((a, n) => a + n, 0) / rpes.length : null,
    },
    dplusDone,
    lastLoad,
  };
}
