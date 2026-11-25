import { Link } from 'react-router-dom';
import { problemById } from '../data/index.js';
import { computeStats, todayKey, useProgress } from '../lib/store.jsx';
import { Bar, Difficulty, Icon } from '../components/ui.jsx';
import Heatmap from '../components/Heatmap.jsx';

export default function Progress() {
  const { state } = useProgress();
  const s = computeStats(state);
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    days.push({ k, label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }), e: state.daily[k] });
  }
  const activeDays = Object.values(state.daily).filter((e) => e.practiced.length).length;
  const totalRuns = Object.values(state.attempts).reduce((a, x) => a + x.runs + x.submits, 0);
  const solutionsViewed = Object.values(state.revealed).filter((r) => r.solution).length;
  const sortedTopics = [...s.byTopic].sort((a, b) => (a.weakness ?? 2) - (b.weakness ?? 2));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Your progress</h1>
          <p className="muted">Everything is stored in this browser and survives refreshes. Back it up from Settings to move it to another device.</p>
        </div>
      </div>

      <section className="stat-grid">
        <div className="card stat"><span className="stat-label">Current streak</span><strong className="stat-num"><Icon name="flame" size={22} /> {s.streak.current}</strong><span className="muted">best {s.streak.best} days</span></div>
        <div className="card stat"><span className="stat-label">Active days</span><strong className="stat-num">{activeDays}</strong><span className="muted">days with practice</span></div>
        <div className="card stat"><span className="stat-label">Code runs</span><strong className="stat-num">{totalRuns}</strong><span className="muted">runs + submits</span></div>
        <div className="card stat"><span className="stat-label">Solutions opened</span><strong className="stat-num">{solutionsViewed}</strong><span className="muted">of {s.done} solved</span></div>
      </section>

      <section className="card">
        <h2>Practice calendar</h2>
        <Heatmap daily={state.daily} weeks={52} />
      </section>

      <section className="two-col">
        <div className="card">
          <h2>Weak topics</h2>
          <p className="muted small">Ranked by unfinished problems, failed submissions and reliance on revealed solutions — only topics you have started count.</p>
          {s.weak.length === 0 ? <p className="muted">No data yet. Attempt problems in a few topics first.</p> : (
            <ol className="weak-detail">
              {s.weak.map((t) => (
                <li key={t.key}>
                  <div className="topic-row-head"><Link to={`/problems?topic=${t.key}&status=todo`}>{t.name}</Link><span className="muted">{t.done}/{t.total}</span></div>
                  <Bar value={t.done} total={t.total} tone="bad" />
                  <span className="muted small">{t.submits} submits, {Math.round(t.failRate * 100)}% failed · solutions opened on {Math.round(t.helpRate * 100)}% of attempted problems</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="card">
          <h2>Last 14 days</h2>
          <ul className="day-log">
            {days.map((d) => (
              <li key={d.k}>
                <span className="day-label">{d.label}</span>
                {d.e && d.e.practiced.length ? (
                  <span className="day-items">
                    {d.e.solved.map((id) => problemById[id] && <Link key={id} to={`/problem/${id}`} className="tag tag-ok">{problemById[id].title}</Link>)}
                    {d.e.practiced.filter((id) => !d.e.solved.includes(id)).map((id) => problemById[id] && <Link key={id} to={`/problem/${id}`} className="tag">{problemById[id].title}</Link>)}
                  </span>
                ) : <span className="muted small">—</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>All topics</h2>
        <table className="topic-table">
          <thead><tr><th>Topic</th><th>Progress</th><th className="num">Solved</th><th className="num">Submits</th><th className="num">Fail rate</th></tr></thead>
          <tbody>
            {sortedTopics.map((t) => (
              <tr key={t.key}>
                <td><Link to={`/problems?topic=${t.key}`}>{t.name}</Link></td>
                <td className="w-bar"><Bar value={t.done} total={t.total} tone={t.done === t.total ? 'ok' : 'accent'} /></td>
                <td className="num">{t.done}/{t.total}</td>
                <td className="num">{t.submits}</td>
                <td className="num">{t.submits ? `${Math.round(t.failRate * 100)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>By difficulty</h2>
        <div className="diff-cards">
          {s.byDiff.map((d) => (
            <div key={d.d} className="diff-card">
              <Difficulty d={d.d} />
              <strong>{d.done}<span className="muted">/{d.total}</span></strong>
              <Bar value={d.done} total={d.total} tone={d.d.toLowerCase()} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
