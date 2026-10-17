import { useEffect, useRef } from "react";
import { DAY_LONG, fmtDate, sessionDate } from "../lib/dates.js";
import { fillTokens } from "../lib/paces.js";
import { fmtKm, paceFromLog } from "../lib/stats.js";
import { routineFor } from "../data/strength.js";
import { metaFor } from "./SessionRow.jsx";

const INTENSITY = { E: "Fácil", M: "Ritmo maratón", T: "Umbral", I: "Intervalos", mix: "Cuestas / mixto" };

function Section({ icon, title, children }) {
  return (
    <div className="sec">
      <div className="sec-title"><span aria-hidden="true">{icon}</span> {title}</div>
      {children}
    </div>
  );
}

export default function SessionModal({ entry, state, training, onClose, onToggle, onLog, lastExercise }) {
  const { session: s, week, day } = entry;
  const closeRef = useRef(null);
  const tokens = training.tokens;
  const f = (t) => fillTokens(t, tokens);
  const log = state.logs[s.id] || {};
  const done = !!state.done[s.id];
  const isStrength = s.kind === "strength";
  const routine = isStrength ? routineFor(s.routine, s.variant) : null;
  const det = isStrength ? routine : s.det;

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [onClose]);

  const pace = paceFromLog(log);
  const setEx = (id, value) => onLog(s.id, { ex: { ...(log.ex || {}), [id]: value } });

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="m-title">
        <div className="m-head">
          <div>
            <div className="m-eyebrow">
              {DAY_LONG[day].toUpperCase()} {fmtDate(sessionDate(week.n, day)).toUpperCase()} · SEMANA {week.n} · {metaFor(s)}
            </div>
            <h2 className="m-title" id="m-title">{f(s.title)}</h2>
          </div>
          <button ref={closeRef} onClick={onClose} className="close" aria-label="Cerrar">✕</button>
        </div>

        {!isStrength && (
          <div className="tags">
            {s.intensity && <span className="tag">{INTENSITY[s.intensity]}</span>}
            <span className="tag">{s.surface === "trail" ? "Trail · El Espino" : "Asfalto"}</span>
            {s.intensity === "M" && <span className="tag">Ritmo M {tokens.M}</span>}
            {s.intensity === "T" && <span className="tag">Ritmo T {tokens.T}</span>}
            {s.intensity === "I" && <span className="tag">Ritmo I {tokens.I}</span>}
            <span className="tag">Fácil {tokens.E}</span>
          </div>
        )}

        <Section icon="🎯" title="OBJETIVO"><p className="p">{f(det.objetivo)}</p></Section>
        <Section icon="🔥" title="CALENTAMIENTO"><p className="p">{f(det.calentamiento)}</p></Section>

        {isStrength ? (
          <Section icon="🏋️" title={`EJERCICIOS · ~${routine.minutes} MIN`}>
            {routine.exercises.map((e) => {
              const last = lastExercise(s, e.id);
              return (
                <div className="ex" key={e.id}>
                  <div className="ex-top">
                    <span className="ex-name">{e.name}</span>
                    <span className="ex-dose">{e.sets} × {e.reps}</span>
                  </div>
                  <div className="ex-note">Carga: {e.load}{e.note ? ` · ${e.note}` : ""}</div>
                  {last && <div className="ex-last">Última vez (semana {last.week}): {last.value}</div>}
                  <label className="sr-only" htmlFor={`ex-${e.id}`}>Registro de {e.name}</label>
                  <input
                    id={`ex-${e.id}`}
                    className="input"
                    placeholder="Carga y reps · ej. +30 lb · 6,6,5,5"
                    value={log.ex?.[e.id] || ""}
                    onChange={(ev) => setEx(e.id, ev.target.value)}
                  />
                </div>
              );
            })}
          </Section>
        ) : (
          <Section icon="⚙️" title="EJECUCIÓN">
            {det.ejecucion.map((e, i) => (
              <div className="step" key={i}>
                <span className="step-n">{i + 1}</span>
                <span className="p">{f(e)}</span>
              </div>
            ))}
          </Section>
        )}

        <Section icon="🔑" title="CLAVES">
          {det.claves.map((c, i) => <div className="clave" key={i}>▸ {f(c)}</div>)}
        </Section>

        <Section icon="📝" title="REGISTRO">
          <div className="form">
            {!isStrength && (
              <>
                <div className="field">
                  <label htmlFor="log-km">Km reales</label>
                  <input id="log-km" className="input" inputMode="decimal" placeholder={fmtKm(s.km)} value={log.km || ""} onChange={(e) => onLog(s.id, { km: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="log-time">Tiempo (h:mm:ss)</label>
                  <input id="log-time" className="input" inputMode="numeric" placeholder="1:05:30" value={log.time || ""} onChange={(e) => onLog(s.id, { time: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="log-hr">FC media (lpm)</label>
                  <input id="log-hr" className="input" inputMode="numeric" placeholder="140" value={log.hr || ""} onChange={(e) => onLog(s.id, { hr: e.target.value })} />
                </div>
                <div className="field">
                  <label>Ritmo medio</label>
                  <div className="pace-out">{pace || "—"}</div>
                </div>
              </>
            )}
            <div className="field full">
              <label id="rpe-label">Esfuerzo percibido (RPE 1-10)</label>
              <div className="rpe" role="group" aria-labelledby="rpe-label">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={Number(log.rpe) === n ? "on" : ""} aria-pressed={Number(log.rpe) === n} onClick={() => onLog(s.id, { rpe: Number(log.rpe) === n ? "" : n })}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="field full">
              <label htmlFor="log-notes">Notas: sensaciones, molestias, clima, zapatillas</label>
              <textarea id="log-notes" className="input" value={log.notes || ""} onChange={(e) => onLog(s.id, { notes: e.target.value })} />
            </div>
          </div>
        </Section>

        <button onClick={() => onToggle(s.id)} className={`done-btn ${done ? "on" : s.kind === "race" ? "race" : ""}`}>
          {done
            ? "✓ Completada · toca para desmarcar"
            : s.kind === "race"
              ? `🏁 Marcar carrera completada (+${fmtKm(s.km)} km)`
              : s.km
                ? `Marcar como completada (+${log.km || fmtKm(s.km)} km)`
                : "Marcar como completada"}
        </button>
      </div>
    </div>
  );
}
