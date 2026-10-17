// Genera PLAN.md a partir de los mismos datos que usa la app (una sola fuente de verdad).
// Uso: npm run plan
import { writeFileSync } from "node:fs";
import { WEEKS, PHASES } from "../src/data/plan.js";
import { ROUTINES, routineFor } from "../src/data/strength.js";
import { computeTraining, fillTokens, formatPace } from "../src/lib/paces.js";
import { DEFAULT_SETTINGS, RACES, PROTEIN } from "../src/config.js";
import { DAY_KEYS, DAY_LONG, fmtDate, sessionDate, fmtRange } from "../src/lib/dates.js";
import { plannedKm, plannedDplus, fmtKm } from "../src/lib/stats.js";

const t = computeTraining(DEFAULT_SETTINGS);
const f = (s) => fillTokens(s, t.tokens);
const L = [];
const total = WEEKS.reduce((a, w) => a + plannedKm(w), 0);

L.push("# Plan de entrenamiento · Ultravolcanes 21K + Maratón El Salvador");
L.push("");
L.push(`> Generado automáticamente desde \`src/data\` con \`npm run plan\`. Ritmos calculados con la referencia inicial (${DEFAULT_SETTINGS.testLabel}: ${DEFAULT_SETTINGS.testTime}). En la app se recalculan con tus pruebas.`);
L.push("");
L.push("## Resumen");
L.push("");
L.push("| Dato | Valor |");
L.push("|---|---|");
L.push(`| Inicio | Lunes ${fmtDate(sessionDate(1, "mon"))} 2026 |`);
for (const r of RACES)
  L.push(`| ${r.name} (carrera ${r.priority}) | ${fmtDate(new Date(...r.date))}${r.start ? ` · salida ${r.start}` : ""} · ${r.km} km · ~${r.dplus} m D+ · ${r.goal} |`);
L.push(`| Semanas | ${WEEKS.length} |`);
L.push(`| Volumen total | ${Math.round(total)} km |`);
L.push(`| Pico semanal | ${Math.max(...WEEKS.map(plannedKm))} km (semana 12) |`);
L.push(`| Proteína diaria | ${PROTEIN.min}-${PROTEIN.max} g |`);
L.push("");
L.push("## Ritmos y pulso iniciales");
L.push("");
L.push("| Zona | Ritmo /km | Pulso |");
L.push("|---|---|---|");
L.push(`| E · Fácil | ${formatPace(t.paces.Efast)}-${formatPace(t.paces.Eslow)} | ${t.tokens.FC_E} |`);
L.push(`| M · Maratón (objetivo ${t.tokens.MGOAL}) | ${formatPace(t.paces.M)} | ${t.tokens.FC_M} |`);
L.push(`| T · Umbral | ${formatPace(t.paces.T)} | ${t.tokens.FC_T} |`);
L.push(`| I · Intervalos | ${formatPace(t.paces.I)} | ${t.tokens.FC_I} |`);
L.push(`| R · Repeticiones | ${formatPace(t.paces.R)} | — |`);
L.push("");
L.push("## Semana tipo");
L.push("");
L.push("| Día | Sesión |");
L.push("|---|---|");
L.push("| Lunes | Descanso total |");
L.push("| Martes | Calidad en asfalto · Piernas + Core A en la tarde |");
L.push("| Miércoles | Rodaje fácil · Tren superior A + Core B |");
L.push("| Jueves | Trail en El Espino (cuestas, bajadas o simulación) |");
L.push("| Viernes | Rodaje fácil + strides · Tren superior B |");
L.push("| Sábado | Descanso total |");
L.push("| Domingo | Tirada larga en asfalto |");
L.push("");
L.push("## Volumen por semana");
L.push("");
L.push("| Semana | Fechas | Fase | Km | D+ | Enfoque |");
L.push("|---|---|---|---|---|---|");
for (const w of WEEKS) L.push(`| ${w.n} | ${fmtRange(w.n)} | ${PHASES[w.phase].label} | ${fmtKm(plannedKm(w))} | ${plannedDplus(w)} m | ${w.focus} |`);
L.push("");
L.push("## Plan día por día");
for (const w of WEEKS) {
  L.push("");
  L.push(`### Semana ${w.n} · ${fmtRange(w.n)} · ${PHASES[w.phase].label}`);
  L.push("");
  L.push(`**${w.focus}** · ${fmtKm(plannedKm(w))} km${plannedDplus(w) ? ` · ${plannedDplus(w)} m D+` : ""}`);
  if (w.note) { L.push(""); L.push(`> ${f(w.note)}`); }
  L.push("");
  L.push("| Día | Sesión | Detalle |");
  L.push("|---|---|---|");
  for (const d of DAY_KEYS) {
    for (const s of w.days[d] || []) {
      let detail = "";
      if (s.kind === "strength") detail = routineFor(s.routine, s.variant).exercises.map((e) => `${e.name} ${e.sets}×${e.reps}`).join("; ");
      else if (s.kind !== "rest") detail = s.det.ejecucion.map(f).join(" ");
      const label = `${f(s.title)}${s.km ? ` (${fmtKm(s.km)} km)` : ""}${s.optional ? " · opcional" : ""}${s.when ? ` · ${s.when.toLowerCase()}` : ""}`;
      L.push(`| ${DAY_LONG[d]} ${fmtDate(sessionDate(w.n, d))} | ${label} | ${detail.replace(/\|/g, "/")} |`);
    }
  }
}
L.push("");
L.push("## Rutinas de fuerza");
for (const [id, r] of Object.entries(ROUTINES)) {
  L.push("");
  L.push(`### ${r.title} (~${r.minutes} min)`);
  L.push("");
  L.push(r.objetivo);
  L.push("");
  L.push("| Ejercicio | Series × reps | Carga | Nota |");
  L.push("|---|---|---|---|");
  for (const e of r.exercises) L.push(`| ${e.name} | ${e.sets} × ${e.reps} | ${e.load} | ${e.note} |`);
}
L.push("");

writeFileSync("PLAN.md", L.join("\n"));
console.log(`PLAN.md generado: ${WEEKS.length} semanas, ${Math.round(total)} km`);
