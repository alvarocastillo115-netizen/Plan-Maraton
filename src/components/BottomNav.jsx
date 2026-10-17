const ICONS = {
  hoy: <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z" />,
  plan: <path d="M4 6h16M4 6v14h16V6M4 10h16M8 3v4M16 3v4M8 14h2M12 14h2M16 14h0" />,
  ritmos: <path d="M12 21a8 8 0 100-16 8 8 0 000 16zM12 13l3-3M10 2h4" />,
  guia: <path d="M5 4h10a4 4 0 014 4v12H9a4 4 0 01-4-4V4zM9 8h6M9 12h6" />,
};

export const TABS = [
  { id: "hoy", label: "HOY" },
  { id: "plan", label: "PLAN" },
  { id: "ritmos", label: "RITMOS" },
  { id: "guia", label: "GUÍA" },
];

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="nav" aria-label="Secciones">
      <div className="nav-inner">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[t.id]}
            </svg>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
