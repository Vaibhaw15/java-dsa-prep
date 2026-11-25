import { todayKey } from '../lib/store.jsx';

// GitHub-style activity grid: one column per week, Sunday at the top.
export default function Heatmap({ daily, weeks = 17 }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7); // Sunday, (weeks - 1) weeks ago
  const cols = [];
  const months = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const k = todayKey(date);
      const e = daily[k];
      const score = e ? e.solved.length * 2 + (e.practiced.length - e.solved.length) : 0;
      const level = date > today ? -1 : score === 0 ? 0 : score <= 2 ? 1 : score <= 4 ? 2 : score <= 7 ? 3 : 4;
      col.push({ k, level, e });
      if (d === 0 && date.getDate() <= 7) months.push({ w, label: date.toLocaleString(undefined, { month: 'short' }) });
    }
    cols.push(col);
  }
  return (
    <div className="heatmap" aria-label="Practice activity heatmap">
      <div className="heatmap-months" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(10px, 1fr))` }}>
        {months.map((m) => <span key={m.w} style={{ gridColumn: m.w + 1 }}>{m.label}</span>)}
      </div>
      <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(10px, 1fr))` }}>
        {cols.map((col, i) => (
          <div key={i} className="heatmap-col">
            {col.map((c) => (
              <span key={c.k} className={`hm hm-${c.level}`}
                title={c.level < 0 ? '' : `${c.k}: ${c.e ? `${c.e.solved.length} solved, ${c.e.practiced.length} practiced` : 'no activity'}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend muted small">Less <span className="hm hm-0" /><span className="hm hm-1" /><span className="hm hm-2" /><span className="hm hm-3" /><span className="hm hm-4" /> More</div>
    </div>
  );
}
