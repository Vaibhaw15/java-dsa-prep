import { useRef, useState } from 'react';
import { useProgress } from '../lib/store.jsx';
import { testConnection } from '../lib/runner.js';
import { Icon, Modal, toast } from '../components/ui.jsx';

export default function Settings() {
  const { state, setSettings, setRunner, importData, resetAll } = useProgress();
  const st = state.settings;
  const r = st.runner;
  const [testing, setTesting] = useState(false);
  const [conn, setConn] = useState(null);
  const [exportText, setExportText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);

  const test = async () => {
    setTesting(true);
    setConn(null);
    setConn(await testConnection(r));
    setTesting(false);
  };

  const download = () => {
    const json = JSON.stringify(state, null, 2);
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `java-dsa-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { /* downloads blocked */ }
    setExportText(json);
  };

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data || typeof data !== 'object' || !('completed' in data)) throw new Error('Not a progress file');
      importData(data);
      toast('Progress imported');
    } catch (err) {
      toast(`Import failed: ${err.message}`, 'bad');
    }
    e.target.value = '';
  };

  return (
    <div className="page settings">
      <div className="page-head"><div><h1>Settings</h1><p className="muted">Appearance, practice goal, code runner and your data.</p></div></div>

      <section className="card">
        <h2>Appearance</h2>
        <div className="field-row">
          <label>Theme</label>
          <div className="seg">
            <button className={st.theme === 'light' ? 'on' : ''} onClick={() => setSettings({ theme: 'light' })}><Icon name="sun" size={15} /> Light</button>
            <button className={st.theme === 'dark' ? 'on' : ''} onClick={() => setSettings({ theme: 'dark' })}><Icon name="moon" size={15} /> Dark</button>
          </div>
        </div>
        <div className="field-row">
          <label htmlFor="font">Editor font size</label>
          <input id="font" type="range" min="11" max="22" value={st.fontSize} onChange={(e) => setSettings({ fontSize: Number(e.target.value) })} />
          <span className="muted">{st.fontSize}px</span>
        </div>
      </section>

      <section className="card">
        <h2>Daily goal</h2>
        <div className="field-row">
          <label htmlFor="goal">Problems to solve per day</label>
          <input id="goal" type="number" min="1" max="20" value={st.dailyGoal} onChange={(e) => setSettings({ dailyGoal: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })} />
        </div>
      </section>

      <section className="card">
        <h2>Code runner</h2>
        <p className="muted small">Run and Submit compile your Java with a real JDK. Choose where that happens.</p>
        <div className="runner-opts">
          {[
            ['local', 'Local JDK (recommended)', 'Uses the bundled Node runner and the JDK installed on your computer. Works with `npm run dev` or `npm start`.'],
            ['judge0', 'Judge0', 'A Judge0 CE instance — self-hosted, the public demo server, or RapidAPI with your key.'],
            ['piston', 'Piston', 'A self-hosted Piston execution engine.'],
          ].map(([k, title, d]) => (
            <label key={k} className={`runner-opt ${r.mode === k ? 'on' : ''}`}>
              <input type="radio" name="mode" checked={r.mode === k} onChange={() => setRunner({ mode: k })} />
              <span><strong>{title}</strong><small className="muted">{d.replace(/`/g, '')}</small></span>
            </label>
          ))}
        </div>
        {r.mode === 'local' && (
          <div className="field-row">
            <label htmlFor="lurl">Runner URL</label>
            <input id="lurl" value={r.localUrl} onChange={(e) => setRunner({ localUrl: e.target.value })} placeholder="(same origin) — e.g. http://localhost:5050" />
          </div>
        )}
        {r.mode === 'judge0' && (<>
          <div className="field-row"><label htmlFor="jurl">Judge0 URL</label><input id="jurl" value={r.judge0Url} onChange={(e) => setRunner({ judge0Url: e.target.value })} placeholder="https://judge0-ce.p.rapidapi.com" /></div>
          <div className="field-row"><label htmlFor="jkey">API key (optional)</label><input id="jkey" type="password" value={r.judge0Key} onChange={(e) => setRunner({ judge0Key: e.target.value })} placeholder="RapidAPI key or X-Auth-Token" autoComplete="off" /></div>
          <div className="field-row"><label htmlFor="jlang">Language ID</label><input id="jlang" type="number" value={r.judge0Lang} onChange={(e) => setRunner({ judge0Lang: e.target.value })} /><span className="muted small">62 = Java (OpenJDK 13) on Judge0 CE; 91 = JDK 17 where available</span></div>
        </>)}
        {r.mode === 'piston' && (
          <div className="field-row"><label htmlFor="purl">Piston execute URL</label><input id="purl" value={r.pistonUrl} onChange={(e) => setRunner({ pistonUrl: e.target.value })} /></div>
        )}
        <div className="field-row">
          <button className="btn" onClick={test} disabled={testing}>{testing ? <span className="spin" /> : <Icon name="play" size={14} />} Test connection</button>
          {conn && <span className={conn.ok ? 'tone-text-ok' : 'tone-text-bad'}>{conn.message}</span>}
        </div>
      </section>

      <section className="card">
        <h2>Your data</h2>
        <p className="muted small">Progress, bookmarks, drafts, notes and the practice calendar live in this browser's local storage.</p>
        <div className="field-row wrap">
          <button className="btn" onClick={download}><Icon name="download" size={14} /> Export progress</button>
          <button className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" size={14} /> Import progress</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
          <button className="btn btn-danger" onClick={() => setConfirmReset(true)}><Icon name="trash" size={14} /> Reset progress</button>
        </div>
        {exportText && (
          <details className="export-box">
            <summary>Exported JSON (copy it if the download was blocked)</summary>
            <textarea readOnly value={exportText} onFocus={(e) => e.target.select()} />
          </details>
        )}
      </section>

      {confirmReset && (
        <Modal title="Reset all progress?" onClose={() => setConfirmReset(false)} actions={<>
          <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { resetAll(); setConfirmReset(false); toast('Progress reset'); }}>Reset everything</button>
        </>}>
          <p>This permanently clears completed problems, bookmarks, drafts, notes and your practice calendar from this browser. Settings are kept. Export first if you might want it back.</p>
        </Modal>
      )}
    </div>
  );
}
