import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Icon, Toaster } from './components/ui.jsx';
import { useProgress, computeStats } from './lib/store.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Problems from './pages/Problems.jsx';
import Workspace from './pages/Workspace.jsx';
import Progress from './pages/Progress.jsx';
import Settings from './pages/Settings.jsx';

const nav = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/problems', icon: 'list', label: 'Problems' },
  { to: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
  { to: '/progress', icon: 'chart', label: 'Progress' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

function Sidebar({ open, onClose }) {
  const { state, setSettings } = useProgress();
  const stats = computeStats(state);
  const dark = state.settings.theme === 'dark';
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">{'{ }'}</span>
          <div>
            <strong>Java DSA Prep</strong>
            <small>150 interview problems</small>
          </div>
        </div>
        <nav className="nav">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose} title={n.label}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.to === '/bookmarks' && stats.bookmarked > 0 && <em className="count">{stats.bookmarked}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="side-progress">
          <div className="side-progress-row"><span>Overall</span><strong>{stats.done}/{stats.total}</strong></div>
          <div className="bar"><span className="bar-fill tone-accent" style={{ width: `${stats.pct}%` }} /></div>
          <div className="side-progress-row muted"><span><Icon name="flame" size={14} /> {stats.streak.current}-day streak</span><span>{stats.today.solved.length}/{state.settings.dailyGoal} today</span></div>
        </div>
        <button className="theme-toggle" onClick={() => setSettings({ theme: dark ? 'light' : 'dark' })} aria-label="Toggle theme">
          <Icon name={dark ? 'sun' : 'moon'} /> <span>{dark ? 'Light theme' : 'Dark theme'}</span>
        </button>
      </aside>
    </>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const inWorkspace = loc.pathname.startsWith('/problem/');
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  return (
    <div className={`app ${inWorkspace ? 'app-workspace' : ''}`}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <header className="mobile-bar">
          <button className="btn btn-ghost btn-icon" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <strong>Java DSA Prep</strong>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/bookmarks" element={<Problems bookmarksOnly />} />
          <Route path="/problem/:id" element={<Workspace />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}
