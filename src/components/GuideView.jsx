import { useRef } from "react";
import { GUIDE, SOURCES } from "../data/guide.js";
import { RACES } from "../config.js";
import { fromParts, fmtDate } from "../lib/dates.js";
import { backupFileName, parseBackup, emptyState } from "../lib/storage.js";

export default function GuideView({ state, onReplace, notify }) {
  const fileRef = useRef(null);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Respaldo descargado");
  };

  const importBackup = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const next = parseBackup(await file.text());
      const n = Object.values(next.done).filter(Boolean).length;
      if (window.confirm(`El respaldo tiene ${n} sesiones completadas. ¿Reemplazar el progreso de este dispositivo?`)) {
        onReplace(next);
        notify("Respaldo importado");
      }
    } catch (err) {
      notify(err.message || "No se pudo leer el archivo");
    }
  };

  const reset = () => {
    if (window.confirm("¿Borrar TODO el progreso y registros de este dispositivo? Exporta un respaldo antes si lo quieres conservar.")) {
      onReplace({ ...emptyState(), settings: state.settings });
      notify("Progreso borrado");
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">Carreras</div>
        {RACES.map((r) => (
          <div key={r.id} className="g-item">
            <b>{r.name}</b> · {fmtDate(fromParts(r.date))}{r.start ? ` · salida ${r.start}` : ""} · {r.km} km · ~{r.dplus.toLocaleString("es")} m D+ · {r.surface} · carrera {r.priority}
            <br />Objetivo: {r.goal}
          </div>
        ))}
      </div>

      {GUIDE.map((sec, i) => (
        <details className="g" key={sec.id} open={i === 0}>
          <summary>{sec.title}</summary>
          <div className="g-body">
            {sec.items.map((it) => (
              <div className="g-item" key={it.t}><b>{it.t}.</b> {it.d}</div>
            ))}
          </div>
        </details>
      ))}

      <details className="g">
        <summary>Fuentes</summary>
        <div className="g-body">
          {SOURCES.map((s) => (
            <div className="g-item" key={s.u}><a href={s.u} target="_blank" rel="noreferrer noopener">{s.t}</a></div>
          ))}
        </div>
      </details>

      <div className="card">
        <div className="card-title">Respaldo de tu progreso</div>
        <p className="p" style={{ marginBottom: 12 }}>
          El progreso se guarda en este teléfono. Exporta un respaldo cada semana (por ejemplo, a iCloud Drive) para no perder tus registros si borras los datos de Safari o cambias de teléfono.
        </p>
        <div className="row">
          <button className="btn primary" onClick={exportBackup}>Exportar respaldo</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Importar respaldo</button>
          <button className="btn danger" onClick={reset}>Borrar progreso</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={importBackup} hidden />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Instalar en tu iPhone</div>
        <p className="p">
          Abre la app en Safari, toca <b>Compartir</b> y luego <b>Agregar a pantalla de inicio</b>. Se abre a pantalla completa y funciona sin conexión, útil en El Espino.
        </p>
      </div>
    </div>
  );
}
