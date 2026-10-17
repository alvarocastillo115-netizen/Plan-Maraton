import { RACES } from "../config.js";
import { daysBetween, fromParts, fmtDate } from "../lib/dates.js";

export default function Header({ now }) {
  return (
    <header className="header">
      <div>
        <div className="eyebrow">ALVARO · CICLO 2026-27</div>
        <h1 className="title">TRAIL + 42K</h1>
        <div className="subtitle">17 semanas · 5 días de carrera · 2 de descanso total</div>
      </div>
      <div className="countdowns">
        {RACES.map((r) => {
          const d = daysBetween(now, fromParts(r.date));
          return (
            <div key={r.id} className={`countdown ${r.priority === "B" ? "b" : ""}`}>
              <div className="num">{d > 0 ? d : d === 0 ? "HOY" : "✓"}</div>
              <div className="lab">
                {r.short}
                <br />
                {fmtDate(fromParts(r.date)).toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
