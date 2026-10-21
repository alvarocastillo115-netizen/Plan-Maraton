import { fmtKm, totals } from "../lib/stats.js";

export default function Progress({ weeks, state }) {
  const t = totals(weeks, state);
  const pct = t.km ? Math.min(100, Math.round((t.kmDone / t.km) * 100)) : 0;
  return (
    <>
      <div className="km">
        <div className="km-head">
          <div>
            <div className="label">KM RECORRIDOS</div>
            <div className="km-big">
              {fmtKm(Math.round(t.kmDone * 10) / 10)} <span className="km-of">/ {fmtKm(Math.round(t.km))} km</span>
            </div>
          </div>
          <div className="km-pct">{pct}%</div>
        </div>
        <div className="km-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de kilómetros">
          <div className="km-fill" style={{ width: `${pct}%` }} />
          <div className="km-runner" style={{ left: `calc(${pct}% - 10px)` }} aria-hidden="true">🏃</div>
        </div>
        <div className="km-foot">Suma los km reales que registres; si no registras, cuenta los planificados. Las sesiones opcionales suman como extra.</div>
      </div>
    </>
  );
}

