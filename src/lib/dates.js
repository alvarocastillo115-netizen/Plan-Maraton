import { START_DATE } from "../config.js";

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const DAY_SHORT = { mon: "LUN", tue: "MAR", wed: "MIÉ", thu: "JUE", fri: "VIE", sat: "SÁB", sun: "DOM" };
export const DAY_LONG = { mon: "Lunes", tue: "Martes", wed: "Miércoles", thu: "Jueves", fri: "Viernes", sat: "Sábado", sun: "Domingo" };
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const fromParts = ([y, m, d]) => new Date(y, m, d);
export const startDate = () => fromParts(START_DATE);
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const weekStart = (n) => addDays(startDate(), (n - 1) * 7);
export const sessionDate = (n, day) => addDays(weekStart(n), DAY_KEYS.indexOf(day));

const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
export const daysBetween = (from, to) => Math.round((utc(to) - utc(from)) / 86400000);

// Ubica una fecha dentro del plan
export function locate(date, totalWeeks) {
  const i = daysBetween(startDate(), date);
  if (i < 0) return { status: "before", week: 1, day: "mon", daysToStart: -i };
  const week = Math.floor(i / 7) + 1;
  if (week > totalWeeks) return { status: "after", week: totalWeeks, day: "sun" };
  return { status: "during", week, day: DAY_KEYS[i % 7] };
}

export const fmtDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const fmtRange = (n) => `${fmtDate(weekStart(n))} – ${fmtDate(addDays(weekStart(n), 6))}`;
