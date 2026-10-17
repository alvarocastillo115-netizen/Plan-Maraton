import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WEEKS, TOTAL_WEEKS } from "./data/plan.js";
import { DEFAULT_SETTINGS } from "./config.js";
import { computeTraining } from "./lib/paces.js";
import { loadState, saveState } from "./lib/storage.js";
import { DAY_KEYS, locate } from "./lib/dates.js";
import Header from "./components/Header.jsx";
import TodayView from "./components/TodayView.jsx";
import PlanView from "./components/PlanView.jsx";
import PacesView from "./components/PacesView.jsx";
import GuideView from "./components/GuideView.jsx";
import SessionModal from "./components/SessionModal.jsx";
import BottomNav, { TABS } from "./components/BottomNav.jsx";

// Índice ordenado de sesiones: búsqueda por id y "última vez" de cada ejercicio
const ORDER = [];
const INDEX = new Map();
for (const w of WEEKS) {
  for (const d of DAY_KEYS) {
    for (const s of w.days[d] || []) {
      const entry = { session: s, week: w, day: d, pos: ORDER.length };
      ORDER.push(entry);
      INDEX.set(s.id, entry);
    }
  }
}
const group = (s) => (s.routine?.startsWith("legs") ? "legs" : s.routine);

const readTab = () => {
  try {
    const t = localStorage.getItem("m27-tab");
    return TABS.some((x) => x.id === t) ? t : "hoy";
  } catch {
    return "hoy";
  }
};

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTabRaw] = useState(readTab);
  const [now, setNow] = useState(() => new Date());
  const [week, setWeek] = useState(() => locate(new Date(), TOTAL_WEEKS).week);
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...(state.settings || {}) }), [state.settings]);
  const training = useMemo(() => computeTraining(settings), [settings]);

  useEffect(() => {
    if (!saveState(state)) notify("No se pudo guardar en este dispositivo");
  }, [state, notify]);

  // La app puede quedar abierta días en el iPhone: refresca "hoy" al volver
  useEffect(() => {
    const refresh = () => document.visibilityState === "visible" && setNow(new Date());
    document.addEventListener("visibilitychange", refresh);
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      clearInterval(t);
    };
  }, []);

  const setTab = (t) => {
    setTabRaw(t);
    try { localStorage.setItem("m27-tab", t); } catch { /* sin almacenamiento */ }
    window.scrollTo({ top: 0 });
  };

  const toggle = useCallback((id) => setState((s) => ({ ...s, done: { ...s.done, [id]: !s.done[id] } })), []);
  const setLog = useCallback(
    (id, patch) => setState((s) => ({ ...s, logs: { ...s.logs, [id]: { ...(s.logs[id] || {}), ...patch } } })),
    []
  );
  const setSettings = (patch) => setState((s) => ({ ...s, settings: { ...DEFAULT_SETTINGS, ...(s.settings || {}), ...patch } }));
  const closeModal = useCallback(() => setOpenId(null), []);

  const lastExercise = useCallback(
    (session, exId) => {
      const cur = INDEX.get(session.id);
      for (let i = cur.pos - 1; i >= 0; i--) {
        const e = ORDER[i];
        if (e.session.kind !== "strength" || group(e.session) !== group(session)) continue;
        const v = state.logs[e.session.id]?.ex?.[exId];
        if (v && String(v).trim()) return { week: e.week.n, value: v };
      }
      return null;
    },
    [state.logs]
  );

  const goToWeek = (n) => {
    setWeek(n);
    setTab("plan");
  };

  const common = { weeks: WEEKS, now, state, training, onOpen: setOpenId, onToggle: toggle };
  const entry = openId ? INDEX.get(openId) : null;

  return (
    <div className="page">
      <Header now={now} />

      {tab === "hoy" && <TodayView {...common} goToWeek={goToWeek} />}
      {tab === "plan" && <PlanView {...common} week={week} setWeek={setWeek} />}
      {tab === "ritmos" && (
        <PacesView settings={settings} training={training} onChange={setSettings} onReset={() => setState((s) => ({ ...s, settings: null }))} />
      )}
      {tab === "guia" && <GuideView state={state} onReplace={setState} notify={notify} />}

      <footer className="footer">Progreso guardado en este dispositivo · Alvaro · rumbo al 14 de febrero</footer>

      {entry && (
        <SessionModal
          entry={entry}
          state={state}
          training={training}
          onClose={closeModal}
          onToggle={toggle}
          onLog={setLog}
          lastExercise={lastExercise}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
