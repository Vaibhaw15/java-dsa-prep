import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { allProblems, topics } from '../data/index.js';
import { problemStatus, useProgress } from '../lib/store.jsx';
import { Difficulty, Icon } from '../components/ui.jsx';

const DIFFS = ['Easy', 'Medium', 'Hard'];

export default function Problems({ bookmarksOnly = false }) {
  const { state, toggleBookmark } = useProgress();
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const q = params.get('q') || '';
  const topic = params.get('topic') || '';
  const diff = params.get('diff') || '';
  const status = params.get('status') || '';
  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allProblems.filter((p) => {
      if (bookmarksOnly && !state.bookmarks[p.id]) return false;
      if (topic && p.topic !== topic) return false;
      if (diff && p.difficulty !== diff) return false;
      if (status && problemStatus(state, p.id) !== status) return false;
      if (needle && !(`${p.num} ${p.title} ${p.topicName}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [q, topic, diff, status, bookmarksOnly, state]);

  const solvedInView = list.filter((p) => state.completed[p.id]).length;
  const pickRandom = () => {
    const pool = list.filter((p) => !state.completed[p.id]);
    const from = pool.length ? pool : list;
    if (from.length) nav(`/problem/${from[Math.floor(Math.random() * from.length)].id}`);
  };
  const hasFilters = q || topic || diff || status;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{bookmarksOnly ? 'Bookmarked problems' : 'Problems'}</h1>
          <p className="muted">{list.length} shown · {solvedInView} solved{bookmarksOnly ? ' · star a problem to keep it here for revision' : ''}</p>
        </div>
        <button className="btn" onClick={pickRandom} disabled={!list.length}><Icon name="shuffle" size={16} /> Random unsolved</button>
      </div>

      <div className="filters card">
        <label className="search">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search by name or number…" aria-label="Search problems" />
          {q && <button className="btn-clear" onClick={() => set('q', '')} aria-label="Clear search"><Icon name="x" size={14} /></button>}
        </label>
        <select value={topic} onChange={(e) => set('topic', e.target.value)} aria-label="Filter by topic">
          <option value="">All topics</option>
          {topics.map((t) => <option key={t.key} value={t.key}>{t.name} ({t.problems.length})</option>)}
        </select>
        <div className="chips" role="group" aria-label="Filter by difficulty">
          {DIFFS.map((d) => (
            <button key={d} className={`chip chip-${d.toLowerCase()} ${diff === d ? 'on' : ''}`} onClick={() => set('diff', diff === d ? '' : d)}>{d}</button>
          ))}
        </div>
        <select value={status} onChange={(e) => set('status', e.target.value)} aria-label="Filter by status">
          <option value="">Any status</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
          <option value="todo">Not started</option>
        </select>
        {hasFilters && <button className="btn btn-ghost btn-sm" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
      </div>

      <div className="card table-card">
        {list.length === 0 ? (
          <div className="empty">
            <Icon name={bookmarksOnly ? 'bookmark' : 'search'} size={28} />
            <p>{bookmarksOnly && !hasFilters ? 'No bookmarks yet. Use the star on any problem to save it for revision.' : 'No problems match these filters.'}</p>
          </div>
        ) : (
          <table className="ptable">
            <thead>
              <tr><th className="c-status" aria-label="Status" /><th className="c-num">#</th><th>Title</th><th className="c-topic">Topic</th><th className="c-diff">Difficulty</th><th className="c-star" aria-label="Bookmark" /></tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const st = problemStatus(state, p.id);
                return (
                  <tr key={p.id} onClick={() => nav(`/problem/${p.id}`)}>
                    <td className="c-status">
                      {st === 'solved' && <span className="st st-solved" title="Solved"><Icon name="check" size={14} /></span>}
                      {st === 'attempted' && <span className="st st-attempted" title="Attempted" />}
                    </td>
                    <td className="c-num muted">{p.num}</td>
                    <td><Link to={`/problem/${p.id}`} onClick={(e) => e.stopPropagation()} className="ptitle">{p.title}</Link></td>
                    <td className="c-topic muted">{p.topicName}</td>
                    <td className="c-diff"><Difficulty d={p.difficulty} /></td>
                    <td className="c-star">
                      <button className={`star ${state.bookmarks[p.id] ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleBookmark(p.id); }}
                        aria-label={state.bookmarks[p.id] ? 'Remove bookmark' : 'Bookmark'}>
                        <Icon name="bookmark" size={16} fill={!!state.bookmarks[p.id]} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
