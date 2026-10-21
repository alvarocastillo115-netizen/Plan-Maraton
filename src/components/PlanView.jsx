import { PHASES } from "../data/plan.js";
import { fmtRange, locate } from "../lib/dates.js";
import { plannedKm, plannedDplus, weekKmDone, weekComplete, fmtKm } from "../lib/stats.js";
import { fillTokens } from "../lib/paces.js";
import WeekDays from "./WeekDays.jsx";
import { CATEGORIES } from "./SessionRow.jsx";

const RACE_WEEKS = { 14: "⛰️", 17: "🏁" };

export default function PlanView({ weeks, week, setWeek, now, state, training, onOpen, onToggle }) {
  const w = weeks[week - 1];
  const maxKm = Math.max(...weeks.map(plannedKm));
  const cur = locate(now, weeks.length);
  const kmDone = weekKmDone(w, state);
  const km = plannedKm(w);

  return (
    <div>
      <div className="card">
        <div className="label" style={{ marginBottom: 22 }}>PERFIL DEL PLAN · toca una semana</div>
        <div className="profile">
          {weeks.map((x) => {
            const k = plannedKm(x);
            const sel = x.n === week;
            const color = sel ? "var(--orange)" : weekComplete(x, state) ? "var(--green)" : PHASES[x.phase].color;
            return (
              <button
                key={x.n}
                className={`bar ${cur.status === "during" && cur.week === x.n ? "current" : ""}`}
                style={{ height: 30 + (k / maxKm) * 112, background: color, opacity: sel ? 1 : 0.88 }}
                onClick={() => setWeek(x.n)}
                aria-label={`Semana ${x.n}, ${fmtKm(k)} km`}
                aria-pressed={sel}
              >
                {RACE_WEEKS[x.n] && <span className="bar-flag" aria-hidden="true">{RACE_WEEKS[x.n]}</span>}
                <span className="bar-km">{Math.round(k)}</span>
                <span className="bar-n">S{x.n}</span>
              </button>
            );
          })}
        </div>
        <div className="legend">
          {Object.entries(PHASES).map(([k, p]) => (
            <span key={k}><span className="dot" style={{ background: p.color }} /> {p.label}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="week-head">
          <div>
            <span className="badge" style={{ background: PHASES[w.phase].color }}>{PHASES[w.phase].label}</span>
            <h2 className="week-title">
              Semana {w.n} <span className="week-date">· {fmtRange(w.n)}</span>
            </h2>
            <div className="week-focus">{w.focus}</div>
          </div>
          <div className="week-stats">
            <span><b>{fmtKm(Math.round(kmDone * 10) / 10)}</b>/<b>{fmtKm(km)}</b> km</span>
            {plannedDplus(w) > 0 && <span><b>{plannedDplus(w)}</b> m D+</span>}
          </div>
        </div>
        <div className="wtrack">
          <div className="wfill" style={{ width: `${km ? Math.min(100, (kmDone / km) * 100) : 0}%` }} />
        </div>
        {w.note && <div className="note">⚑ {fillTokens(w.note, training.tokens)}</div>}
        <div className="week-nav">
          <button className="btn" disabled={week <= 1} onClick={() => setWeek(week - 1)}>‹ Anterior</button>
          <button className="btn" disabled={week >= weeks.length} onClick={() => setWeek(week + 1)}>Siguiente ›</button>
          {cur.status === "during" && cur.week !== week && (
            <button className="btn primary" onClick={() => setWeek(cur.week)}>Semana actual</button>
          )}
        </div>
        <div className="legend" style={{ margin: "6px 0 10px" }}>
          {Object.entries(CATEGORIES).map(([k, label]) => (
            <span key={k}><span className="dot" style={{ background: `var(--${k})` }} /> {label}</span>
          ))}
        </div>
        <p className="hint">Toca cualquier sesión para ver el detalle completo y registrar lo que hiciste.</p>
        <WeekDays week={w} state={state} tokens={training.tokens} now={now} onOpen={onOpen} onToggle={onToggle} />
      </div>
    </div>
  );
}
