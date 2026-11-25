import { useState } from 'react';
import { CodeEditor, CopyButton, Icon, Md, Modal } from './ui.jsx';

const SECTIONS = [
  ['approaches', 'Approaches'],
  ['explain', 'Line by line'],
  ['complexity', 'Complexity'],
  ['dry', 'Dry run'],
  ['tips', 'Interview tips'],
  ['java', 'Java concepts'],
];

export default function SolutionPanel({ p, revealed, onReveal, attempts, theme, onLoad }) {
  const [ask, setAsk] = useState(false);
  const [approach, setApproach] = useState('optimal');
  const [loadAsk, setLoadAsk] = useState(null);

  if (!revealed) {
    const tried = attempts && (attempts.runs || attempts.submits);
    return (
      <div className="locked">
        <Icon name="lock" size={30} />
        <h3>Solutions are hidden</h3>
        <p className="muted">Give it a real attempt first — use the hints if you are stuck. Struggling for a while is where most of the learning happens.</p>
        <p className="muted small">{tried ? `You have run your code ${attempts.runs + attempts.submits} time${attempts.runs + attempts.submits > 1 ? 's' : ''} on this problem.` : 'You have not run any code for this problem yet.'}</p>
        <button className="btn btn-primary" onClick={() => (tried ? onReveal() : setAsk(true))}>Show solutions & explanation</button>
        {ask && (
          <Modal title="Reveal without trying?" onClose={() => setAsk(false)} actions={<>
            <button className="btn btn-ghost" onClick={() => setAsk(false)}>Keep trying</button>
            <button className="btn btn-primary" onClick={() => { setAsk(false); onReveal(); }}>Show anyway</button>
          </>}>
            <p>You have not run any code yet. Even a brute-force attempt helps you understand the optimized solution. Reveal anyway?</p>
          </Modal>
        )}
      </div>
    );
  }

  const sol = p[approach];
  const jump = (k) => document.getElementById(`sec-${p.id}-${k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="solution">
      <div className="sec-nav scroll">
        {SECTIONS.map(([k, label]) => <button key={k} className="pill" onClick={() => jump(k)}>{label}</button>)}
      </div>

      <section id={`sec-${p.id}-approaches`}>
        <div className="seg" role="tablist">
          <button className={approach === 'brute' ? 'on' : ''} onClick={() => setApproach('brute')}>Brute force</button>
          <button className={approach === 'optimal' ? 'on' : ''} onClick={() => setApproach('optimal')}>Optimized</button>
        </div>
        <div className="approach">
          <div className="approach-head">
            <p>{sol.idea}</p>
            <div className="cx-pills"><span className="pill pill-static">Time {sol.time}</span><span className="pill pill-static">Space {sol.space}</span></div>
          </div>
          <div className="code-card">
            <div className="code-card-bar">
              <span className="muted small">{approach === 'optimal' ? 'Optimized' : 'Brute force'} · Java</span>
              <div className="spacer" />
              <CopyButton text={sol.code} />
              <button className="btn btn-ghost btn-sm" onClick={() => setLoadAsk(sol.code)}><Icon name="upload" size={14} /> Load in editor</button>
            </div>
            <CodeEditor value={sol.code} readOnly auto theme={theme} fontSize={13} />
          </div>
        </div>
      </section>

      <section id={`sec-${p.id}-explain`}>
        <h3>Line-by-line explanation (optimized)</h3>
        <ol className="lines">
          {p.lines.map(([frag, text], i) => (
            <li key={i}><code className="frag">{frag}</code><Md text={text} /></li>
          ))}
        </ol>
      </section>

      <section id={`sec-${p.id}-complexity`}>
        <h3>Time & space complexity</h3>
        <table className="cx-table">
          <thead><tr><th>Approach</th><th>Time</th><th>Space</th></tr></thead>
          <tbody>
            <tr><td>Brute force</td><td>{p.brute.time}</td><td>{p.brute.space}</td></tr>
            <tr className="best"><td>Optimized</td><td>{p.optimal.time}</td><td>{p.optimal.space}</td></tr>
          </tbody>
        </table>
        <Md text={p.cx} />
      </section>

      <section id={`sec-${p.id}-dry`}>
        <h3>Dry run</h3>
        <ol className="dry">{p.dry.map((d, i) => <li key={i}><Md text={d} /></li>)}</ol>
      </section>

      <section id={`sec-${p.id}-tips`}>
        <h3>Interview tips</h3>
        <ul className="bullets ok">{p.tips.map((t, i) => <li key={i}><Md text={t} /></li>)}</ul>
        <h3>Common mistakes</h3>
        <ul className="bullets bad">{p.mistakes.map((t, i) => <li key={i}><Md text={t} /></li>)}</ul>
      </section>

      <section id={`sec-${p.id}-java`}>
        <h3>Java concepts used</h3>
        <ul className="bullets java">{p.java.filter((t) => t !== '—').map((t, i) => <li key={i}><Md text={t} /></li>)}</ul>
        {p.java.every((t) => t === '—') && <p className="muted">Plain arrays and primitives only — no special library features needed here.</p>}
      </section>

      {loadAsk && (
        <Modal title="Replace your code?" onClose={() => setLoadAsk(null)} actions={<>
          <button className="btn btn-ghost" onClick={() => setLoadAsk(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onLoad(loadAsk); setLoadAsk(null); }}>Load solution</button>
        </>}>
          <p>Your current code in the editor will be replaced with this solution (your draft is overwritten). Tip: try re-typing it from memory instead — it sticks better.</p>
        </Modal>
      )}
    </div>
  );
}
