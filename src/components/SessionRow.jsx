import { fillTokens } from "../lib/paces.js";
import { fmtKm } from "../lib/stats.js";
import { routineFor } from "../data/strength.js";

const CHIP = { asfalto: "ASFALTO", trail: "TRAIL", fuerza: "FUERZA", descanso: "DESCANSO" };

export function metaFor(s) {
  if (s.kind === "rest") return "DESCANSO";
  if (s.kind === "strength") {
    const r = routineFor(s.routine, s.variant);
    return `~${r.minutes} MIN${s.when ? ` · ${s.when.toUpperCase()}` : ""}${s.optional ? " · OPCIONAL" : ""}`;
  }
  const parts = [`${fmtKm(s.km)} KM`];
  if (s.dplus) parts.push(`${s.dplus} m D+`);
  if (s.kind === "race") parts.unshift("DÍA DE CARRERA");
  if (s.kind === "test") parts.unshift("PRUEBA DE RITMOS");
  if (s.optional) parts.push("OPCIONAL");
  return parts.join(" · ");
}

export default function SessionRow({ s, done, log, tokens, onOpen, onToggle }) {
  const isRest = s.kind === "rest";
  const isRace = s.kind === "race";
  const open = () => !isRest && onOpen(s.id);
  const realKm = done && log?.km ? ` · ✓ ${log.km} km` : "";
  return (
    <div
      className={`sess ${done ? "done" : ""} ${isRace ? "race" : ""} ${isRest ? "rest" : ""}`}
      role={isRest ? undefined : "button"}
      tabIndex={isRest ? undefined : 0}
      onClick={open}
      onKeyDown={(e) => {
        if (!isRest && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); }
      }}
    >
      <span className={`chip ${s.surface}`}>{isRace ? "CARRERA" : CHIP[s.surface]}</span>
      <div className="sess-body">
        <div className="sess-meta">{metaFor(s)}{realKm}</div>
        <div className="sess-title">{fillTokens(s.title, tokens)}</div>
      </div>
      {!isRest && (
        <>
          <button
            className={`check ${done ? "on" : ""}`}
            onClick={(e) => { e.stopPropagation(); onToggle(s.id); }}
            aria-label={done ? `Desmarcar ${s.title}` : `Marcar ${s.title} como completada`}
            aria-pressed={!!done}
          >
            {done && "✓"}
          </button>
          <span className="chev" aria-hidden="true">›</span>
        </>
      )}
    </div>
  );
}
