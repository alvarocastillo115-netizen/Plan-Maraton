import { describe, it, expect } from "vitest";
import { totals, weekKmDone, kmDoneFor, paceFromLog, plannedKm } from "./stats.js";
import { loadState, saveState, parseBackup, emptyState } from "./storage.js";
import { locate } from "./dates.js";
import { WEEKS } from "../data/plan.js";

const w1 = WEEKS[0];
const run = w1.days.sun[0];
const opt = WEEKS[10].days.fri.find((s) => s.optional);

describe("estadísticas", () => {
  it("usa los km reales registrados si existen", () => {
    const st = { ...emptyState(), done: { [run.id]: true }, logs: { [run.id]: { km: "13,5" } } };
    expect(kmDoneFor(run, st)).toBe(13.5);
    expect(kmDoneFor(run, { ...st, logs: {} })).toBe(run.km);
    expect(kmDoneFor(run, emptyState())).toBe(0);
  });

  it("las opcionales suman km como extra pero no cuentan en el total de sesiones", () => {
    const base = totals(WEEKS, emptyState());
    const withOpt = totals(WEEKS, { ...emptyState(), done: { [opt.id]: true } });
    expect(withOpt.req).toBe(base.req);
    expect(withOpt.reqDone).toBe(0);
    expect(withOpt.optDone).toBe(1);
    expect(weekKmDone(WEEKS[10], { ...emptyState(), done: { [opt.id]: true } })).toBe(opt.km);
    expect(plannedKm(WEEKS[10])).not.toBeCloseTo(plannedKm(WEEKS[10]) + opt.km);
  });

  it("los días de descanso no cuentan como sesiones", () => {
    const t = totals(WEEKS, emptyState());
    const rests = WEEKS.flatMap((w) => Object.values(w.days).flat()).filter((s) => s.kind === "rest").length;
    const all = WEEKS.flatMap((w) => Object.values(w.days).flat()).filter((s) => !s.optional).length;
    expect(t.req).toBe(all - rests);
  });

  it("calcula el ritmo medio del registro", () => {
    expect(paceFromLog({ km: "10", time: "55:40" })).toBe("5:34/km");
    expect(paceFromLog({ km: "21.1", time: "1:53:26" })).toBe("5:23/km");
    expect(paceFromLog({ km: "", time: "50:00" })).toBeNull();
    expect(paceFromLog({ km: "5", time: "abc" })).toBeNull();
  });
});

describe("almacenamiento", () => {
  const fakeStore = () => {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
  };

  it("guarda y recupera el estado", () => {
    const store = fakeStore();
    const st = { ...emptyState(), done: { a: true }, logs: { a: { km: "5" } } };
    expect(saveState(st, store)).toBe(true);
    const back = loadState(store);
    expect(back.done).toEqual({ a: true });
    expect(back.logs.a.km).toBe("5");
    expect(back.updatedAt).toBeTruthy();
  });

  it("un almacenamiento corrupto no rompe la app", () => {
    const store = fakeStore();
    store.setItem("maraton27-v1", "{no es json");
    expect(loadState(store)).toEqual(emptyState());
  });

  it("parseBackup valida el archivo", () => {
    expect(() => parseBackup('{"foo":1}')).toThrow();
    expect(() => parseBackup("[]")).toThrow();
    expect(parseBackup('{"done":{"x":true}}').done).toEqual({ x: true });
  });
});

describe("ubicación en el calendario", () => {
  it("antes, durante y después del plan", () => {
    expect(locate(new Date(2026, 9, 16), 17)).toMatchObject({ status: "before", daysToStart: 3 });
    expect(locate(new Date(2026, 9, 19), 17)).toMatchObject({ status: "during", week: 1, day: "mon" });
    expect(locate(new Date(2027, 0, 24), 17)).toMatchObject({ status: "during", week: 14, day: "sun" });
    expect(locate(new Date(2027, 1, 14), 17)).toMatchObject({ status: "during", week: 17, day: "sun" });
    expect(locate(new Date(2027, 1, 15), 17)).toMatchObject({ status: "after" });
  });
});
