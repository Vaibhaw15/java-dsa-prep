import { Link, useNavigate } from 'react-router-dom';
import { allProblems, problemById } from '../data/index.js';
import { computeStats, todayKey, useProgress } from '../lib/store.jsx';
import { Bar, Difficulty, Icon, Ring } from '../components/ui.jsx';
import Heatmap from '../components/Heatmap.jsx';

function problemOfTheDay(state) {
  const pool = allProblems.filter((p) => !state.completed[p.id]);
  if (!pool.length) return null;
  const k = todayKey();
  let h = 0;
  for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

function nextUnsolved(state, afterId) {
  const start = afterId ? allProblems.findIndex((p) => p.id === afterId) : -1;
  for (let i = 1; i <= allProblems.length; i++) {
    const p = allProblems[(start + i + allProblems.length) % allProblems.length];
    if (!state.completed[p.id]) return p;
  }
  return null;
}

export default function Dashboard() {
  const { state } = useProgress();
  const nav = useNavigate();
  const s = computeStats(state);
  const last = state.lastVisited && problemById[state.lastVisited];
  const next = last && !state.completed[last.id] ? last : nextUnsolved(state, state.lastVisited);
  const potd = problemOfTheDay(state);
  const goal = state.settings.dailyGoal;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const recent = Object.entries(state.completed).sort((a, b) => b[1].localeCompare(a[1])).slice(0, 5).map(([id]) => problemById[id]).filter(Boolean);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{greet}. Let's keep the streak going.</h1>
          <p className="muted">{s.done === 0 ? 'Start with the first Arrays problem — the set ramps from beginner to advanced.' : `You have solved ${s.done} of ${s.total} problems. ${s.pending} to go.`}</p>
        </div>
        {next && (
          <button className="btn btn-primary" onClick={() => nav(`/problem/${next.id}`)}>
            <Icon name="play" size={16} /> {last && next.id === last.id ? 'Continue' : 'Start next'}: {next.title}
          </button>
        )}
      </div>

      <section className="stat-grid">
        <div className="card stat"><span className="stat-label">Total questions</span><strong className="stat-num">{s.total}</strong><span className="muted">13 topics</span></div>
        <div className="card stat"><span className="stat-label">Completed</span><strong className="stat-num tone-text-ok">{s.done}</strong><span className="muted">{s.attempted} in progress</span></div>
        <div className="card stat"><span className="stat-label">Pending</span><strong className="stat-num">{s.pending}</strong><span className="muted">not yet solved</span></div>
        <Link to="/bookmarks" className="card stat stat-link"><span className="stat-label">Bookmarked</span><strong className="stat-num tone-text-warn">{s.bookmarked}</strong><span className="muted">saved for revision</span></Link>
      </section>

      <section className="dash-grid">
        <div className="card overall">
          <h2>Overall progress</h2>
          <div className="overall-body">
            <Ring pct={s.pct} size={140} label="complete" />
            <div className="diff-break">
              {s.byDiff.map((d) => (
                <div key={d.d} className="diff-row">
                  <div className="diff-row-head"><Difficulty d={d.d} /><span>{d.done}/{d.total}</span></div>
                  <Bar value={d.done} total={d.total} tone={d.d.toLowerCase()} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card daily">
          <div className="card-head">
            <h2>Daily practice</h2>
            <span className="streak"><Icon name="flame" size={16} /> {s.streak.current} day{s.streak.current === 1 ? '' : 's'}</span>
          </div>
          <div className="goal">
            <div className="goal-num"><strong>{s.today.solved.length}</strong><span>/ {goal} solved today</span></div>
            <Bar value={Math.min(s.today.solved.length, goal)} total={goal} tone="ok" />
            <p className="muted small">{s.today.practiced.length} problem{s.today.practiced.length === 1 ? '' : 's'} practiced · {s.today.runs} runs · best streak {s.streak.best}</p>
          </div>
          <Heatmap daily={state.daily} weeks={17} />
        </div>

        <div className="card">
          <h2>Problem of the day</h2>
          {potd ? (
            <Link to={`/problem/${potd.id}`} className="potd">
              <span className="muted small">#{potd.num} · {potd.topicName}</span>
              <strong>{potd.title}</strong>
              <Difficulty d={potd.difficulty} />
            </Link>
          ) : <p className="muted">You have solved everything. Time to revise your bookmarks.</p>}
          <h2 className="mt">Weak topics</h2>
          {s.weak.length ? (
            <ul className="weak-list">
              {s.weak.map((t) => (
                <li key={t.key}>
                  <Link to={`/problems?topic=${t.key}`}>{t.name}</Link>
                  <span className="muted small">{Math.round(t.completion * 100)}% done{t.submits ? ` · ${Math.round(t.failRate * 100)}% failed submits` : ''}{t.helpRate ? ' · relied on solutions' : ''}</span>
                </li>
              ))}
            </ul>
          ) : <p className="muted small">Attempt a few problems and your weak topics will appear here, based on completion, failed submissions and how often you open the solution.</p>}
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Topic-wise progress</h2><Link to="/problems" className="muted small">Browse all problems →</Link></div>
        <div className="topic-grid">
          {s.byTopic.map((t) => (
            <Link key={t.key} to={`/problems?topic=${t.key}`} className="topic-row">
              <div className="topic-row-head"><span>{t.name}</span><span className="muted">{t.done}/{t.total}</span></div>
              <Bar value={t.done} total={t.total} tone={t.done === t.total ? 'ok' : 'accent'} />
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="card">
          <h2>Recently solved</h2>
          <ul className="recent">
            {recent.map((p) => (
              <li key={p.id}><Link to={`/problem/${p.id}`}>{p.title}</Link><span className="muted small">{p.topicName}</span><Difficulty d={p.difficulty} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
