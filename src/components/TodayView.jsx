import { DAY_KEYS, DAY_LONG, fmtDate, sessionDate, locate, daysBetween, startDate } from "../lib/dates.js";
import { allSessions, plannedKm, weekKmDone, fmtKm, totals, dashboard } from "../lib/stats.js";
import { fillTokens, formatPace } from "../lib/paces.js";
import { PHASES } from "../data/plan.js";
import { CATEGORIES, categoryOf } from "./SessionRow.jsx";
import Progress from "./Progress.jsx";

const isKey = (s) =>
  !s.optional && (s.kind === "race" || s.kind === "test" || ["T", "I", "M"].includes(s.intensity) || s.km >= 20 || (s.surface === "trail" && s.intensity === "mix"));

function nextKey(weeks, now) {
  for (const w of weeks) {
    for (const d of DAY_KEYS) {
      if (daysBetween(now, sessionDate(w.n, d)) < 0) continue;
      const s = (w.days[d] || []).find(isKey);
      if (s) return { s, w, d };
    }
  }
  return null;
}

const STRENGTH_KEYS = [
  { id: "pullw", name: "Dominadas lastradas" },
  { id: "dipw", name: "Fondos lastrados" },
  { id: "bulg", name: "Sentadilla búlgara" },
];

function Tile({ label, value, sub, accent }) {
  return (
    <div className="stat" style={accent ? { borderLeftColor: accent } : undefined}>
      <div className="stat-val">{value}</div>
      <div className="stat-lab">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function TodayView({ weeks, now, state, training, goToWeek, goToTab }) {
  const loc = locate(now, weeks.length);
  const week = weeks[loc.week - 1];
  const tokens = training.tokens;
  const t = totals(weeks, state);
  const dash = dashboard(weeks, state, now);
  const key = nextKey(weeks, now);
  const totalDays = weeks.length * 7;
  const elapsed = Math.min(totalDays, Math.max(0, daysBetween(startDate(), now) + 1));
  const todays = loc.status === "during" ? (week.days[loc.day] || []) : [];
  const wKm = plannedKm(week);
  const wDone = weekKmDone(week, state);
  const maxKm = Math.max(...weeks.map(plannedKm));

  // composición de la semana por categoría
  const counts = {};
  for (const s of allSessions(week)) {
    if (s.kind === "rest" || s.optional) continue;
    const c = categoryOf(s);
    counts[c] = (counts[c] || 0) + 1;
  }

  return (
    <div>
      {/* ---------- ESTADO DEL PLAN ---------- */}
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="badge" style={{ background: PHASES[week.phase].color }}>{PHASES[week.phase].label}</span>
          <span className="label">DÍA {elapsed} DE {totalDays}</span>
        </div>
        <h2 className="week-title">
          {loc.status === "before" ? "Arranca el lunes 19 oct" : `Semana ${week.n} de ${weeks.length}`}
        </h2>
        <div className="week-focus">
          {loc.status === "before"
            ? `Faltan ${loc.daysToStart} ${loc.daysToStart === 1 ? "día" : "días"}. Primera semana: ${week.focus.toLowerCase()}.`
            : loc.status === "after"
              ? "Ciclo terminado 🏁"
              : week.focus}
        </div>
        <div className="wtrack" role="progressbar" aria-label="Avance del calendario" aria-valuenow={elapsed} aria-valuemin={0} aria-valuemax={totalDays}>
          <div className="wfill" style={{ width: `${(elapsed / totalDays) * 100}%`, background: "var(--orange)" }} />
        </div>
        {loc.status === "during" && (
          <div className="today-line">
            <span className="label">HOY · {DAY_LONG[loc.day].toUpperCase()} {fmtDate(now).toUpperCase()}</span>
            <div className="today-items">
              {todays.map((s) => (
                <span key={s.id} className={`today-item ${state.done[s.id] ? "done" : ""}`}>
                  <span className="dot" style={{ background: `var(--${categoryOf(s)})` }} />
                  {fillTokens(s.title, tokens)}
                  {state.done[s.id] && " ✓"}
                </span>
              ))}
            </div>
          </div>
        )}
        <button className="btn" style={{ marginTop: 12 }} onClick={() => goToWeek(week.n)}>Ver y registrar en el plan ›</button>
      </div>

      {/* ---------- KM TOTALES ---------- */}
      <Progress weeks={weeks} state={state} />

      <div className="stats">
        <Tile
          label="ADHERENCIA"
          value={dash.adherence === null ? "—" : `${dash.adherence}%`}
          sub={dash.due ? `${dash.dueDone} de ${dash.due} sesiones vencidas` : "Aún no hay sesiones vencidas"}
          accent="var(--orange)"
        />
        <Tile label="SESIONES" value={`${t.reqDone}/${t.req}`} sub={t.optDone ? `+${t.optDone} opcionales` : "del plan completo"} />
        <Tile label="FUERZA" value={`${t.strengthDone}/${t.strength}`} sub="sesiones de gimnasio" accent="var(--superior)" />
        <Tile label="D+ HECHO" value={`${fmtKm(dash.dplusDone)} m`} sub={`de ${fmtKm(t.dplus)} m del plan`} accent="var(--trail)" />
      </div>

      {/* ---------- KM POR SEMANA ---------- */}
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>KM por semana</div>
          <div className="legend" style={{ marginTop: 0 }}>
            <span><span className="dot" style={{ background: "var(--green)" }} /> HECHO</span>
            <span><span className="dot" style={{ background: "var(--track-light)" }} /> PLANIFICADO</span>
          </div>
        </div>
        <div className="kchart" role="img" aria-label="Kilómetros hechos frente a planificados por semana">
          {weeks.map((w) => {
            const plan = plannedKm(w);
            const done = weekKmDone(w, state);
            const isCur = loc.status === "during" && w.n === loc.week;
            return (
              <button
                key={w.n}
                className={`kcol ${isCur ? "cur" : ""}`}
                title={`Semana ${w.n}: ${fmtKm(Math.round(done * 10) / 10)} de ${fmtKm(plan)} km`}
                aria-label={`Semana ${w.n}: ${fmtKm(Math.round(done * 10) / 10)} de ${fmtKm(plan)} km`}
                onClick={() => goToWeek(w.n)}
              >
                <span className="kbar" style={{ height: `${(plan / maxKm) * 100}%` }}>
                  <span className="kdone" style={{ height: `${plan ? Math.min(100, (done / plan) * 100) : 0}%` }} />
                </span>
                <span className="kn">{w.n}</span>
              </button>
            );
          })}
        </div>
        <p className="hint" style={{ marginTop: 6 }}>Toca una barra para abrir esa semana. Semana 14: Ultravolcanes · semana 17: maratón.</p>
      </div>

      {/* ---------- ESTA SEMANA ---------- */}
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Esta semana</div>
          <span className="label">{fmtKm(Math.round(wDone * 10) / 10)}/{fmtKm(wKm)} km</span>
        </div>
        <div className="wtrack">
          <div className="wfill" style={{ width: `${Math.min(100, (wDone / wKm) * 100)}%` }} />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {DAY_KEYS.map((d) => {
            const list = (week.days[d] || []).filter((s) => s.kind !== "rest");
            const all = list.length > 0 && list.every((s) => s.optional || state.done[s.id]);
            const isToday = loc.status === "during" && loc.day === d;
            return (
              <span
                key={d}
                className={`tag ${isToday ? "tag-today" : ""}`}
                title={DAY_LONG[d]}
                style={all ? { background: "var(--green)", color: "#fff", borderColor: "var(--green)" } : undefined}
              >
                {DAY_LONG[d].slice(0, 2)} {list.length ? (all ? "✓" : list.length) : "—"}
              </span>
            );
          })}
        </div>
        <div className="legend" style={{ marginTop: 12 }}>
          {Object.keys(CATEGORIES).filter((c) => counts[c]).map((c) => (
            <span key={c}><span className="dot" style={{ background: `var(--${c})` }} /> {counts[c]} {CATEGORIES[c]}</span>
          ))}
        </div>
        {week.note && <div className="note">⚑ {fillTokens(week.note, tokens)}</div>}
      </div>

      {/* ---------- ÚLTIMOS 7 DÍAS + PRÓXIMO HITO ---------- */}
      <div className="card">
        <div className="card-title">Últimos 7 días</div>
        <div className="kv">
          <div><span className="kv-val">{fmtKm(Math.round(dash.last7.km * 10) / 10)}</span><span className="kv-lab">km corridos</span></div>
          <div><span className="kv-val">{dash.last7.sessions}</span><span className="kv-lab">sesiones hechas</span></div>
          <div><span className="kv-val">{dash.last7.rpe ? dash.last7.rpe.toFixed(1) : "—"}</span><span className="kv-lab">RPE medio</span></div>
        </div>
        {key && (
          <div className="next-key">
            <span className="label">PRÓXIMA SESIÓN CLAVE</span>
            <div>
              <span className="dot" style={{ background: `var(--${categoryOf(key.s)})` }} />{" "}
              <b>{DAY_LONG[key.d]} {fmtDate(sessionDate(key.w.n, key.d))}:</b> {fillTokens(key.s.title, tokens)}
            </div>
          </div>
        )}
      </div>

      {/* ---------- RITMOS Y FUERZA ---------- */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">Ritmos actuales</div>
          <div className="kv kv-list">
            <div><span className="kv-lab">Objetivo maratón</span><span className="kv-val">{tokens.MGOAL}</span></div>
            <div><span className="kv-lab">Ritmo M</span><span className="kv-val">{formatPace(training.paces.M)}/km</span></div>
            <div><span className="kv-lab">Fácil</span><span className="kv-val">{formatPace(training.paces.Efast)}-{formatPace(training.paces.Eslow)}</span></div>
            <div><span className="kv-lab">VDOT</span><span className="kv-val">{training.vdot.toFixed(1)}</span></div>
          </div>
          <button className="btn" style={{ marginTop: 10 }} onClick={() => goToTab("ritmos")}>Ajustar ritmos ›</button>
        </div>
        <div className="card">
          <div className="card-title">Cargas de fuerza</div>
          <div className="kv kv-list">
            {STRENGTH_KEYS.map((e) => {
              const last = dash.lastLoad(e.id);
              return (
                <div key={e.id}>
                  <span className="kv-lab">{e.name}</span>
                  <span className="kv-val small">{last ? last.value : "Sin registro"}</span>
                </div>
              );
            })}
          </div>
          <p className="hint" style={{ marginTop: 8 }}>Última carga que registraste en cada ejercicio.</p>
        </div>
      </div>
    </div>
  );
}
