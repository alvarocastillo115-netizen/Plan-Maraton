import { DAY_KEYS, DAY_LONG, fmtDate, sessionDate, addDays, locate, daysBetween } from "../lib/dates.js";
import { allSessions, plannedKm, weekKmDone, fmtKm } from "../lib/stats.js";
import { fillTokens } from "../lib/paces.js";
import { PHASES } from "../data/plan.js";
import WeekDays from "./WeekDays.jsx";
import SessionRow from "./SessionRow.jsx";
import Progress from "./Progress.jsx";

const isKey = (s) =>
  s.kind === "race" || s.kind === "test" || ["T", "I", "M"].includes(s.intensity) || s.km >= 20 || (s.surface === "trail" && s.intensity === "mix");

function nextKey(weeks, now) {
  for (const w of weeks) {
    for (const d of DAY_KEYS) {
      if (daysBetween(now, sessionDate(w.n, d)) <= 0) continue;
      const s = (w.days[d] || []).find((x) => isKey(x) && !x.optional);
      if (s) return { s, w, d };
    }
  }
  return null;
}

export default function TodayView({ weeks, now, state, training, onOpen, onToggle, goToWeek }) {
  const loc = locate(now, weeks.length);
  const week = weeks[loc.week - 1];
  const tokens = training.tokens;
  const rowProps = { state, tokens, now, onOpen, onToggle };

  const key = nextKey(weeks, now);
  const tomorrow = locate(addDays(now, 1), weeks.length);

  return (
    <div>
      {loc.status === "before" && (
        <div className="card">
          <div className="card-title">El plan arranca el lunes 19 de octubre</div>
          <p className="p">
            Faltan <b>{loc.daysToStart} {loc.daysToStart === 1 ? "día" : "días"}</b>. Mientras tanto: 1-2 rodajes fáciles de 30-40 min por pulso ({tokens.FC_E}) y
            tu rutina de tren superior. Llega descansado al lunes.
          </p>
          <div className="note">
            Revisa la pestaña <b>Ritmos</b>: tus ritmos salen de la predicción de Garmin (21K en 1:53:26). La prueba 5K de la semana 4 los ajustará a tu forma real.
          </div>
        </div>
      )}

      {loc.status === "during" && (
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              HOY · {DAY_LONG[loc.day]} {fmtDate(now)}
            </div>
            <span className="badge" style={{ background: PHASES[week.phase].color }}>SEMANA {week.n}</span>
          </div>
          <WeekDays week={week} only={loc.day} {...rowProps} />
          {(week.days[loc.day] || []).length === 0 && <p className="p">Hoy no hay nada programado.</p>}
        </div>
      )}

      {loc.status === "after" && (
        <div className="card">
          <div className="card-title">Ciclo terminado 🏁</div>
          <p className="p">17 semanas, dos carreras. Revisa tus registros en la pestaña Plan y exporta un respaldo desde la Guía.</p>
        </div>
      )}

      {loc.status === "during" && tomorrow.status === "during" && (
        <div className="card">
          <div className="card-title">MAÑANA · {DAY_LONG[tomorrow.day]}</div>
          {(weeks[tomorrow.week - 1].days[tomorrow.day] || []).map((s) => (
            <SessionRow key={s.id} s={s} done={!!state.done[s.id]} log={state.logs[s.id]} tokens={tokens} onOpen={onOpen} onToggle={onToggle} />
          ))}
        </div>
      )}

      {key && (
        <div className="card">
          <div className="card-title">PRÓXIMA SESIÓN CLAVE · {DAY_LONG[key.d]} {fmtDate(sessionDate(key.w.n, key.d))}</div>
          <SessionRow s={key.s} done={!!state.done[key.s.id]} log={state.logs[key.s.id]} tokens={tokens} onOpen={onOpen} onToggle={onToggle} />
          <p className="hint">{fillTokens(key.s.det.objetivo, tokens)}</p>
        </div>
      )}

      <Progress weeks={weeks} state={state} />

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="card-title" style={{ marginBottom: 0 }}>SEMANA {week.n} · {week.focus}</div>
          <span className="label">{fmtKm(Math.round(weekKmDone(week, state) * 10) / 10)}/{fmtKm(plannedKm(week))} km</span>
        </div>
        <div className="wtrack">
          <div className="wfill" style={{ width: `${Math.min(100, (weekKmDone(week, state) / plannedKm(week)) * 100)}%` }} />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {DAY_KEYS.map((d) => {
            const list = (week.days[d] || []).filter((s) => s.kind !== "rest");
            const all = list.length > 0 && list.every((s) => s.optional || state.done[s.id]);
            return (
              <span key={d} className="tag" title={DAY_LONG[d]} style={all ? { background: "var(--green)", color: "#fff", borderColor: "var(--green)" } : undefined}>
                {DAY_LONG[d].slice(0, 2)} {list.length ? (all ? "✓" : list.length) : "—"}
              </span>
            );
          })}
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={() => goToWeek(week.n)}>Ver la semana completa ›</button>
        {week.note && <div className="note">⚑ {fillTokens(week.note, tokens)}</div>}
        {(() => {
          const n = allSessions(week).filter((s) => s.kind === "strength" && !s.optional).length;
          return <p className="hint" style={{ marginTop: 8 }}>{n} {n === 1 ? "sesión" : "sesiones"} de fuerza esta semana.</p>;
        })()}
      </div>
    </div>
  );
}
