import { describe, it, expect } from "vitest";
import { WEEKS, PHASES } from "./plan.js";
import { routineFor } from "./strength.js";
import { RACES } from "../config.js";
import { computeTraining } from "../lib/paces.js";
import { DEFAULT_SETTINGS } from "../config.js";
import { DAY_KEYS, sessionDate, startDate, fromParts, daysBetween } from "../lib/dates.js";
import { allSessions, plannedKm } from "../lib/stats.js";

const tokens = computeTraining(DEFAULT_SETTINGS).tokens;
const flat = WEEKS.flatMap((w) => DAY_KEYS.flatMap((d) => (w.days[d] || []).map((s) => ({ s, w, d, date: sessionDate(w.n, d) }))));
const hard = (s) =>
  !s.optional && (s.kind === "race" || s.kind === "test" || ["T", "I", "M"].includes(s.intensity) || s.intensity === "mix" || s.km >= 20);

describe("calendario", () => {
  it("17 semanas que empiezan el lunes 19 oct 2026", () => {
    expect(WEEKS).toHaveLength(17);
    expect(startDate().getDay()).toBe(1);
    expect(startDate().toDateString()).toBe(new Date(2026, 9, 19).toDateString());
    WEEKS.forEach((w, i) => expect(w.n).toBe(i + 1));
  });

  it("Ultravolcanes cae el domingo 24 ene (semana 14) y el maratón el domingo 14 feb (semana 17)", () => {
    const races = flat.filter((x) => x.s.kind === "race");
    expect(races).toHaveLength(2);
    const [trail, mar] = races;
    expect(daysBetween(trail.date, fromParts(RACES[0].date))).toBe(0);
    expect(daysBetween(mar.date, fromParts(RACES[1].date))).toBe(0);
    expect([trail.w.n, trail.d, mar.w.n, mar.d]).toEqual([14, "sun", 17, "sun"]);
    expect(trail.date.getDay()).toBe(0);
    expect(mar.date.getDay()).toBe(0);
  });

  it("todas las semanas tienen una fase válida y los 7 días definidos", () => {
    for (const w of WEEKS) {
      expect(PHASES[w.phase]).toBeTruthy();
      for (const d of DAY_KEYS) expect(Array.isArray(w.days[d])).toBe(true);
    }
  });
});

describe("integridad de sesiones", () => {
  it("ids únicos", () => {
    const ids = flat.map((x) => x.s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada sesión de carrera tiene detalle completo y todas las rutinas existen", () => {
    for (const { s } of flat) {
      if (s.kind === "strength") {
        const r = routineFor(s.routine, s.variant);
        expect(r.exercises.length).toBeGreaterThan(0);
        r.exercises.forEach((e) => expect(e.sets).toBeGreaterThanOrEqual(1));
      } else {
        expect(s.det.objetivo).toBeTruthy();
        expect(s.det.ejecucion.length).toBeGreaterThan(0);
        expect(s.det.claves.length).toBeGreaterThan(0);
      }
    }
  });

  it("todos los tokens de texto se pueden resolver", () => {
    const texts = [];
    for (const { s } of flat) {
      texts.push(s.title);
      if (s.det) texts.push(s.det.objetivo, s.det.calentamiento, ...s.det.ejecucion, ...s.det.claves);
    }
    WEEKS.forEach((w) => w.note && texts.push(w.note));
    for (const t of texts) {
      for (const [, k] of t.matchAll(/\{([A-Z_]+)\}/g)) expect(tokens[k], `token {${k}} en "${t}"`).toBeDefined();
    }
  });

  it("2 días sin correr por semana (lunes y sábado), salvo la semana de carrera", () => {
    for (const w of WEEKS) {
      expect(w.days.mon.some((s) => s.km > 0)).toBe(false);
      if (w.n !== 17) expect(w.days.sat.some((s) => s.km > 0)).toBe(false);
    }
  });

  it("el trail solo se hace entre semana y los largos del domingo son en asfalto", () => {
    for (const { s, d, w } of flat) {
      if (s.surface === "trail" && s.kind !== "race") expect(["mon", "tue", "wed", "thu", "fri"]).toContain(d);
      if (d === "sun" && s.kind === "run") expect(s.surface, `semana ${w.n}`).toBe("asfalto");
    }
  });

  it("nunca hay dos días seguidos con sesión dura", () => {
    const byDate = new Map();
    for (const x of flat) if (hard(x.s)) byDate.set(daysBetween(startDate(), x.date), x);
    for (const [i, x] of byDate) expect(byDate.has(i + 1), `${x.s.id} seguido de otra sesión dura`).toBe(false);
  });

  it("la fuerza de piernas nunca va el sábado ni en semanas de carrera", () => {
    for (const { s, d, w } of flat) {
      if (s.routine?.startsWith("legs")) {
        expect(d).not.toBe("sat");
        expect([14, 17]).not.toContain(w.n);
      }
    }
  });
});

describe("carga", () => {
  const longest = (w) => Math.max(...allSessions(w).filter((s) => s.kind === "run").map((s) => s.km));

  it("la tirada larga nunca supera en más de 15 % la más larga de las 4 semanas anteriores", () => {
    for (let i = 4; i < 16; i++) {
      const prevMax = Math.max(...WEEKS.slice(i - 4, i).map(longest));
      expect(longest(WEEKS[i]), `semana ${i + 1}`).toBeLessThanOrEqual(prevMax * 1.15);
    }
  });

  it("el desnivel de los jueves crece hasta ≥ 2/3 del de Ultravolcanes antes de la carrera", () => {
    const trailRace = flat.find((x) => x.s.kind === "race" && x.s.surface === "trail").s;
    expect(trailRace.dplus).toBe(RACES[0].dplus);
    const thu = WEEKS.slice(0, 13).map((w) => w.days.thu[0].dplus);
    expect(Math.max(...thu)).toBeGreaterThanOrEqual((RACES[0].dplus * 2) / 3);
    expect(thu[11]).toBe(Math.max(...thu)); // el pico de desnivel va en la semana 12
  });

  it("pico de 32 km en la semana 12 y pico de volumen ≤ 75 km", () => {
    expect(longest(WEEKS[11])).toBe(32);
    expect(Math.max(...WEEKS.map(plannedKm))).toBeLessThanOrEqual(75);
  });

  it("las semanas de asimilación bajan al menos 15 % respecto a la anterior", () => {
    for (const w of WEEKS.filter((x) => x.phase === "asim")) {
      expect(plannedKm(w)).toBeLessThanOrEqual(plannedKm(WEEKS[w.n - 2]) * 0.85);
    }
  });

  it("taper: semana 16 ≤ 80 % del pico y semana 17 (sin el maratón) ≤ 50 %", () => {
    const peak = Math.max(...WEEKS.map(plannedKm));
    expect(plannedKm(WEEKS[15])).toBeLessThanOrEqual(peak * 0.8);
    const w17 = plannedKm(WEEKS[16]) - 42.2;
    expect(w17).toBeLessThanOrEqual(peak * 0.5);
  });
});
