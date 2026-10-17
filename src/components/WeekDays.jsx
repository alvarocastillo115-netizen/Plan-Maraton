import { DAY_KEYS, DAY_LONG, fmtDate, sessionDate, daysBetween } from "../lib/dates.js";
import SessionRow from "./SessionRow.jsx";

export default function WeekDays({ week, state, tokens, now, onOpen, onToggle, only }) {
  const days = only ? [only] : DAY_KEYS;
  return (
    <div>
      {days.map((d) => {
        const list = week.days[d] || [];
        const date = sessionDate(week.n, d);
        const isToday = daysBetween(now, date) === 0;
        return (
          <div className="day" key={d}>
            {!only && (
              <div className="day-head">
                <span className="day-name">{DAY_LONG[d].toUpperCase()}</span>
                <span className="day-date">{fmtDate(date)}</span>
                {isToday && <span className="today-pill">HOY</span>}
              </div>
            )}
            {list.map((s) => (
              <SessionRow
                key={s.id}
                s={s}
                done={!!state.done[s.id]}
                log={state.logs[s.id]}
                tokens={tokens}
                onOpen={onOpen}
                onToggle={onToggle}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
