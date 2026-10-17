import { describe, it, expect } from "vitest";
import { vdotFrom, predictMinutes, parseTime, formatDuration, formatPace, computeTraining, fillTokens } from "./paces.js";
import { DEFAULT_SETTINGS } from "../config.js";

describe("VDOT (Daniels)", () => {
  it("la predicción Garmin de 21K en 1:53:26 equivale a VDOT ≈ 39", () => {
    expect(vdotFrom(21097.5, parseTime("1:53:26"))).toBeCloseTo(39.0, 1);
  });

  it("reproduce las tablas publicadas de Daniels", () => {
    // VDOT 40 → maratón 3:49:45 · VDOT 50 → 3:10:49 (tabla de Daniels' Running Formula)
    expect(Math.abs(predictMinutes(40, 42195) - (3 * 60 + 49.75))).toBeLessThan(1.5);
    expect(Math.abs(predictMinutes(50, 42195) - (3 * 60 + 10.8))).toBeLessThan(1.5);
  });

  it("predecir y volver a calcular el VDOT es consistente", () => {
    const t = predictMinutes(45, 10000);
    expect(vdotFrom(10000, t)).toBeCloseTo(45, 3);
  });
});

describe("parseTime / formatos", () => {
  it("acepta h:mm:ss y mm:ss", () => {
    expect(parseTime("1:53:26")).toBeCloseTo(113.4333, 3);
    expect(parseTime("24:30")).toBe(24.5);
  });
  it("rechaza entradas inválidas", () => {
    for (const bad of ["", "abc", "12", "1:75:00", "1:2:3:4", null, undefined, "0:00"]) expect(parseTime(bad)).toBeNull();
  });
  it("formatea duraciones y ritmos", () => {
    expect(formatDuration(234.6833)).toBe("3:54:41");
    expect(formatDuration(24.5)).toBe("24:30");
    expect(formatPace(334)).toBe("5:34");
  });
});

describe("computeTraining", () => {
  const t = computeTraining(DEFAULT_SETTINGS);

  it("ritmo de maratón inicial ≈ 5:34/km (objetivo ≈ 3:55)", () => {
    expect(t.tokens.M).toBe("5:34/km");
    expect(t.tokens.MGOAL).toMatch(/^3:5[45]/);
  });

  it("orden lógico de ritmos: R < I < T < M < E", () => {
    const p = t.paces;
    expect(p.R).toBeLessThan(p.I);
    expect(p.I).toBeLessThan(p.T);
    expect(p.T).toBeLessThan(p.M);
    expect(p.M).toBeLessThan(p.Efast);
    expect(p.Efast).toBeLessThan(p.Eslow);
  });

  it("zonas de pulso Karvonen crecientes con FC reposo 43 y máx 181", () => {
    expect(t.zones[0].lo).toBe(112);
    expect(t.zones.at(-1).hi).toBe(181);
    for (let i = 1; i < t.zones.length; i++) expect(t.zones[i].lo).toBe(t.zones[i - 1].hi);
  });

  it("un objetivo manual reemplaza el ritmo M", () => {
    const g = computeTraining({ ...DEFAULT_SETTINGS, goalOverride: "3:45:00" });
    expect(g.usingGoal).toBe(true);
    expect(g.tokens.M).toBe("5:20/km");
  });

  it("un tiempo inválido cae a VDOT 39 y lo marca", () => {
    const bad = computeTraining({ ...DEFAULT_SETTINGS, testTime: "xx" });
    expect(bad.valid).toBe(false);
    expect(bad.vdot).toBe(39);
  });

  it("fillTokens reemplaza tokens conocidos y deja intactos los desconocidos", () => {
    expect(fillTokens("A {M} y {NOPE}", t.tokens)).toBe("A 5:34/km y {NOPE}");
  });
});
