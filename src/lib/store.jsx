import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { allProblems, topics } from '../data/index.js';

const KEY = 'java-dsa-prep:v1';
const onOwnComputer = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const defaults = () => ({
  completed: {},   // id -> ISO timestamp
  bookmarks: {},   // id -> ISO timestamp
  attempts: {},    // id -> { runs, submits, failedSubmits, lastStatus, lastAt }
  revealed: {},    // id -> { hints: number, solution: bool }
  drafts: {},      // id -> code
  notes: {},       // id -> text
  daily: {},       // yyyy-mm-dd -> { solved: [ids], practiced: [ids], runs: n }
  lastVisited: null,
  settings: {
    theme: 'dark',
    fontSize: 14,
    dailyGoal: 3,
    runner: { mode: onOwnComputer() ? 'local' : 'browser', localUrl: '', judge0Url: 'https://ce.judge0.com', judge0Key: '', judge0Lang: 62, pistonUrl: 'http://localhost:2000/api/v2/execute' },
  },
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const saved = JSON.parse(raw);
    const d = defaults();
    // A hosted copy (e.g. Vercel) has no local runner: move old default settings to the in-browser runner.
    const sr = saved.settings?.runner;
    if (sr && sr.mode === 'local' && !sr.localUrl && !onOwnComputer()) sr.mode = 'browser';
    return { ...d, ...saved, settings: { ...d.settings, ...saved.settings, runner: { ...d.settings.runner, ...(saved.settings?.runner || {}) } } };
  } catch {
    return defaults();
  }
}

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(load);
  const saveTimer = useRef();

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
    }, 250);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  const update = useCallback((fn) => setState((s) => fn(structuredClone(s))), []);

  const logDay = (s, id, kind) => {
    const k = todayKey();
    const day = s.daily[k] || { solved: [], practiced: [], runs: 0 };
    if (kind === 'run') day.runs += 1;
    if (!day.practiced.includes(id)) day.practiced.push(id);
    if (kind === 'solved' && !day.solved.includes(id)) day.solved.push(id);
    s.daily[k] = day;
  };

  const api = useMemo(() => ({
    state,
    isDone: (id) => !!state.completed[id],
    isBookmarked: (id) => !!state.bookmarks[id],
    toggleComplete: (id) => update((s) => {
      if (s.completed[id]) delete s.completed[id];
      else { s.completed[id] = new Date().toISOString(); logDay(s, id, 'solved'); }
      return s;
    }),
    markComplete: (id) => update((s) => {
      if (!s.completed[id]) s.completed[id] = new Date().toISOString();
      logDay(s, id, 'solved');
      return s;
    }),
    toggleBookmark: (id) => update((s) => {
      if (s.bookmarks[id]) delete s.bookmarks[id]; else s.bookmarks[id] = new Date().toISOString();
      return s;
    }),
    recordRun: (id, kind, allPassed) => update((s) => {
      const a = s.attempts[id] || { runs: 0, submits: 0, failedSubmits: 0 };
      if (kind === 'submit') { a.submits += 1; if (!allPassed) a.failedSubmits += 1; } else a.runs += 1;
      a.lastStatus = allPassed ? 'pass' : 'fail';
      a.lastAt = new Date().toISOString();
      s.attempts[id] = a;
      logDay(s, id, 'run');
      return s;
    }),
    reveal: (id, what) => update((s) => {
      const r = s.revealed[id] || { hints: 0, solution: false };
      if (what === 'solution') r.solution = true; else r.hints = Math.max(r.hints, what);
      s.revealed[id] = r;
      return s;
    }),
    saveDraft: (id, code) => update((s) => { s.drafts[id] = code; return s; }),
    clearDraft: (id) => update((s) => { delete s.drafts[id]; return s; }),
    saveNote: (id, text) => update((s) => { s.notes[id] = text; return s; }),
    visit: (id) => update((s) => { s.lastVisited = id; return s; }),
    setSettings: (patch) => update((s) => { s.settings = { ...s.settings, ...patch }; return s; }),
    setRunner: (patch) => update((s) => { s.settings.runner = { ...s.settings.runner, ...patch }; return s; }),
    importData: (data) => setState(() => {
      const d = defaults();
      return { ...d, ...data, settings: { ...d.settings, ...(data.settings || {}), runner: { ...d.settings.runner, ...(data.settings?.runner || {}) } } };
    }),
    resetAll: () => setState((s) => ({ ...defaults(), settings: s.settings })),
  }), [state, update]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);

// ---------- derived statistics ----------
export function computeStats(state) {
  const total = allProblems.length;
  const done = allProblems.filter((p) => state.completed[p.id]).length;
  const bookmarked = Object.keys(state.bookmarks).length;
  const attempted = allProblems.filter((p) => !state.completed[p.id] && (state.attempts[p.id] || state.drafts[p.id])).length;
  const byDiff = ['Easy', 'Medium', 'Hard'].map((d) => {
    const list = allProblems.filter((p) => p.difficulty === d);
    return { d, total: list.length, done: list.filter((p) => state.completed[p.id]).length };
  });
  const byTopic = topics.map((t) => {
    const ps = t.problems;
    const doneT = ps.filter((p) => state.completed[p.id]).length;
    let submits = 0, failed = 0, revealedBeforeSolve = 0, touched = 0;
    ps.forEach((p) => {
      const a = state.attempts[p.id];
      if (a) { submits += a.submits; failed += a.failedSubmits; }
      if (a || state.completed[p.id] || state.revealed[p.id]) touched++;
      const r = state.revealed[p.id];
      if (r && (r.solution || r.hints >= 3)) revealedBeforeSolve++;
    });
    const completion = doneT / ps.length;
    const failRate = submits ? failed / submits : 0;
    const helpRate = touched ? revealedBeforeSolve / touched : 0;
    const enough = touched >= 2 || failed >= 2;
    const weakness = enough ? (1 - completion) * 0.45 + failRate * 0.35 + helpRate * 0.2 : null;
    return { key: t.key, name: t.name, total: ps.length, done: doneT, completion, submits, failed, failRate, helpRate, touched, weakness };
  });
  const weak = byTopic.filter((t) => t.weakness !== null && t.done < t.total).sort((a, b) => b.weakness - a.weakness).slice(0, 3);
  const streak = computeStreak(state.daily);
  const today = state.daily[todayKey()] || { solved: [], practiced: [], runs: 0 };
  return { total, done, pending: total - done, bookmarked, attempted, pct: Math.round((done / total) * 100), byDiff, byTopic, weak, streak, today };
}

export function computeStreak(daily) {
  const active = (k) => daily[k] && (daily[k].solved.length || daily[k].practiced.length);
  const d = new Date();
  if (!active(todayKey(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (active(todayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
  let best = 0, run = 0;
  const keys = Object.keys(daily).filter(active).sort();
  let prev = null;
  keys.forEach((k) => {
    const cur = new Date(k + 'T00:00:00');
    if (prev && (cur - prev) / 86400000 === 1) run++; else run = 1;
    best = Math.max(best, run);
    prev = cur;
  });
  return { current: streak, best };
}

export function problemStatus(state, id) {
  if (state.completed[id]) return 'solved';
  if (state.attempts[id] || state.drafts[id]) return 'attempted';
  return 'todo';
}
