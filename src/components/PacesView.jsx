import { TEST_DISTANCES, formatDuration, formatPace } from "../lib/paces.js";

const ZONE_COLORS = ["#8A9B8A", "#3D6B4F", "#2E6F8E", "#C9A227", "#E4572E"];

export default function PacesView({ settings, training, onChange, onReset }) {
  const t = training;
  const p = t.paces;
  const rows = [
    { k: "E", name: "Fácil", pace: `${formatPace(p.Efast)}-${formatPace(p.Eslow)}`, hr: t.tokens.FC_E, use: "Rodajes, largos, recuperación" },
    { k: "M", name: "Maratón", pace: formatPace(p.M), hr: t.tokens.FC_M, use: `Bloques específicos · objetivo ${t.tokens.MGOAL}` },
    { k: "T", name: "Umbral", pace: formatPace(p.T), hr: t.tokens.FC_T, use: "Tempo y cruise intervals" },
    { k: "I", name: "Intervalos", pace: formatPace(p.I), hr: t.tokens.FC_I, use: "Repeticiones de 3-5 min" },
    { k: "R", name: "Repeticiones", pace: formatPace(p.R), hr: "—", use: "Strides y repeticiones cortas" },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-title">Tu referencia</div>
        <p className="p" style={{ marginBottom: 12 }}>
          Todos los ritmos del plan salen de una marca de referencia (fórmula VDOT de Jack Daniels). Empieza con la predicción de Garmin y
          cámbiala por el resultado real de la <b>prueba 5K</b> (semana 4) y la <b>prueba 10K</b> (semana 8).
        </p>
        <div className="form">
          <div className="field">
            <label htmlFor="test-dist">Distancia</label>
            <select id="test-dist" className="input" value={settings.testDist} onChange={(e) => onChange({ testDist: Number(e.target.value) })}>
              {TEST_DISTANCES.map((d) => <option key={d.m} value={d.m}>{d.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="test-time">Tiempo (h:mm:ss o mm:ss)</label>
            <input id="test-time" className="input" inputMode="numeric" value={settings.testTime} onChange={(e) => onChange({ testTime: e.target.value })} />
          </div>
          <div className="field full">
            <label htmlFor="test-label">Origen de la marca</label>
            <input id="test-label" className="input" value={settings.testLabel} onChange={(e) => onChange({ testLabel: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="hr-rest">FC en reposo</label>
            <input id="hr-rest" className="input" inputMode="numeric" value={settings.hrRest} onChange={(e) => onChange({ hrRest: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="hr-max">FC máxima</label>
            <input id="hr-max" className="input" inputMode="numeric" value={settings.hrMax} onChange={(e) => onChange({ hrMax: e.target.value })} />
          </div>
          <div className="field full">
            <label htmlFor="goal">Objetivo de maratón manual (opcional, h:mm:ss)</label>
            <input id="goal" className="input" inputMode="numeric" placeholder={`Vacío = predicción (${t.tokens.MPRED})`} value={settings.goalOverride} onChange={(e) => onChange({ goalOverride: e.target.value })} />
          </div>
        </div>
        {!t.valid && <div className="note">El tiempo no es válido. Usa el formato 1:53:26 o 24:30. Mientras tanto se usa un VDOT de 39.</div>}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={onReset}>Restablecer valores iniciales</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-val">{t.vdot.toFixed(1)}</div><div className="stat-lab">VDOT</div></div>
        <div className="stat" style={{ borderLeftColor: "var(--orange)" }}><div className="stat-val">{t.tokens.MGOAL}</div><div className="stat-lab">{t.usingGoal ? "OBJETIVO MANUAL" : "MARATÓN PREDICHO"}</div></div>
        <div className="stat"><div className="stat-val">{formatPace(p.M)}</div><div className="stat-lab">RITMO M /KM</div></div>
      </div>

      <div className="card">
        <div className="card-title">Ritmos de entrenamiento</div>
        <table className="tbl">
          <thead><tr><th>ZONA</th><th>RITMO /KM</th><th>PULSO</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <td><b>{r.k}</b> · {r.name}<div className="hint" style={{ fontStyle: "normal" }}>{r.use}</div></td>
                <td className="big">{r.pace}</td>
                <td>{r.hr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginTop: 10 }}>En El Espino ignora el ritmo: usa pulso y RPE. Con calor, el pulso manda también en asfalto.</p>
      </div>

      <div className="card">
        <div className="card-title">Zonas de pulso (Karvonen)</div>
        <table className="tbl">
          <tbody>
            {t.zones.map((z, i) => (
              <tr key={z.id}>
                <td><span className="zone-dot" style={{ background: ZONE_COLORS[i] }} /><b>{z.id}</b> · {z.name}<div className="hint" style={{ fontStyle: "normal" }}>{z.use}</div></td>
                <td className="big">{z.lo}-{z.hi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">Predicciones con tu VDOT actual</div>
        <table className="tbl">
          <tbody>
            {t.preds.map((x) => (
              <tr key={x.label}><td>{x.label}</td><td className="big">{formatDuration(x.minutes)}</td><td>{formatPace((x.minutes * 60) / (parseFloat(x.label) || 42.195))}/km</td></tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginTop: 10 }}>
          La predicción de maratón asume que el entrenamiento de fondo está completo y no considera el calor. Tu media real fue a 5:47/km: por eso las pruebas pesan más que la predicción del reloj.
        </p>
      </div>
    </div>
  );
}
