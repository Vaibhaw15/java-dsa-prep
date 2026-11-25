import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { allProblems, problemById } from '../data/index.js';
import { useProgress } from '../lib/store.jsx';
import { buildProgram, cleanTrace, evaluate, formatArgs, parseResults, remapErrors, starterCode } from '../lib/harness.js';
import { runProgram } from '../lib/runner.js';
import { CodeEditor, Difficulty, Icon, Md, Modal, toast } from '../components/ui.jsx';
import SolutionPanel from '../components/SolutionPanel.jsx';

const sampleCount = (p) => p.sample ?? Math.max(1, Math.min(p.ex.length, p.tests.length));
const show = (v) => (v === undefined ? '—' : JSON.stringify(v));

function useDrag(onMove) {
  return useCallback((e) => {
    e.preventDefault();
    const move = (ev) => onMove(ev);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.classList.remove('dragging'); };
    document.body.classList.add('dragging');
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [onMove]);
}

export default function Workspace() {
  const { id } = useParams();
  const p = problemById[id];
  const nav = useNavigate();
  const prog = useProgress();
  const { state } = prog;
  const settings = state.settings;

  const starter = useMemo(() => (p ? starterCode(p) : ''), [p]);
  const [code, setCode] = useState('');
  const [leftTab, setLeftTab] = useState('desc');
  const [consoleTab, setConsoleTab] = useState('tests');
  const [running, setRunning] = useState(null);
  const [result, setResult] = useState(null);
  const [activeCase, setActiveCase] = useState(0);
  const [split, setSplit] = useState(44);
  const [consoleH, setConsoleH] = useState(260);
  const [mobilePane, setMobilePane] = useState('problem');
  const [confirmReset, setConfirmReset] = useState(false);
  const bodyRef = useRef(null), rightRef = useRef(null);

  useEffect(() => {
    if (!p) return;
    setCode(state.drafts[p.id] ?? starter);
    setLeftTab('desc');
    setConsoleTab('tests');
    setResult(null);
    setActiveCase(0);
    prog.visit(p.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // debounce draft saving
  useEffect(() => {
    if (!p || !code) return;
    const t = setTimeout(() => {
      if (code === starter) { if (state.drafts[p.id] !== undefined) prog.clearDraft(p.id); }
      else if (state.drafts[p.id] !== code) prog.saveDraft(p.id, code);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const onDragV = useDrag((ev) => {
    const r = bodyRef.current.getBoundingClientRect();
    setSplit(Math.min(70, Math.max(25, ((ev.clientX - r.left) / r.width) * 100)));
  });
  const onDragH = useDrag((ev) => {
    const r = rightRef.current.getBoundingClientRect();
    setConsoleH(Math.min(r.height - 120, Math.max(90, r.bottom - ev.clientY)));
  });

  const execute = useCallback(async (kind) => {
    if (!p || running) return;
    const tests = kind === 'submit' ? p.tests : p.tests.slice(0, sampleCount(p));
    setRunning(kind);
    setConsoleTab('result');
    setMobilePane('code');
    const { source, offset } = buildProgram(p, code, tests);
    const r = await runProgram(source, settings.runner);
    setRunning(null);
    if (!r.ok) {
      setResult({ kind, error: r.compileError ? remapErrors(r.compileError, offset) : r.error, compile: !!r.compileError, unreachable: r.unreachable });
      if (r.compileError) prog.recordRun(p.id, kind, false);
      return;
    }
    const cases = evaluate(p, tests, r.stdout).map((c) => (c.error ? { ...c, error: cleanTrace(c.error, offset) } : c));
    const { extra } = parseResults(r.stdout);
    const passed = cases.filter((c) => c.status === 'pass').length;
    const allPassed = passed === cases.length;
    const firstBad = cases.findIndex((c) => c.status !== 'pass');
    setActiveCase(firstBad >= 0 ? firstBad : 0);
    setResult({ kind, cases, passed, allPassed, timedOut: r.timedOut, stderr: remapErrors(r.stderr || '', offset), extra, ms: r.ms });
    prog.recordRun(p.id, kind, allPassed);
    if (kind === 'submit' && allPassed) {
      if (!state.completed[p.id]) toast('Accepted! Marked as completed.');
      prog.markComplete(p.id);
    }
  }, [p, code, running, settings.runner, prog, state.completed]);

  if (!p) {
    return <div className="page"><h1>Problem not found</h1><Link to="/problems">Back to problems</Link></div>;
  }

  const idx = allProblems.findIndex((x) => x.id === p.id);
  const prev = allProblems[idx - 1], next = allProblems[idx + 1];
  const done = !!state.completed[p.id];
  const marked = !!state.bookmarks[p.id];
  const rev = state.revealed[p.id] || { hints: 0, solution: false };
  const samples = p.tests.slice(0, sampleCount(p));
  const attempts = state.attempts[p.id];

  return (
    <div className="ws">
      <div className="ws-top">
        <div className="ws-title">
          <Link to="/problems" className="btn btn-ghost btn-icon" aria-label="Back to problems"><Icon name="list" /></Link>
          <div className="ws-nav">
            <button className="btn btn-ghost btn-icon" disabled={!prev} onClick={() => nav(`/problem/${prev.id}`)} aria-label="Previous problem"><Icon name="left" /></button>
            <button className="btn btn-ghost btn-icon" disabled={!next} onClick={() => nav(`/problem/${next.id}`)} aria-label="Next problem"><Icon name="right" /></button>
          </div>
          <h1><span className="muted">{p.num}.</span> {p.title}</h1>
        </div>
        <div className="ws-actions">
          <button className={`btn btn-ghost btn-icon star ${marked ? 'on' : ''}`} onClick={() => prog.toggleBookmark(p.id)} aria-label={marked ? 'Remove bookmark' : 'Bookmark'} title="Bookmark">
            <Icon name="bookmark" fill={marked} />
          </button>
          <button className={`btn ${done ? 'btn-done' : ''}`} onClick={() => prog.toggleComplete(p.id)}>
            <Icon name="check" size={16} /> {done ? 'Completed' : 'Mark as completed'}
          </button>
        </div>
      </div>

      <div className="ws-mobile-tabs">
        <button className={mobilePane === 'problem' ? 'on' : ''} onClick={() => setMobilePane('problem')}>Problem</button>
        <button className={mobilePane === 'code' ? 'on' : ''} onClick={() => setMobilePane('code')}>Code</button>
      </div>

      <div className={`ws-body show-${mobilePane}`} ref={bodyRef} style={{ '--split': `${split}%` }}>
        <section className="ws-left">
          <div className="tabs" role="tablist">
            {[['desc', 'Description', 'book'], ['hints', 'Hints', 'bulb'], ['solution', 'Solutions', rev.solution ? 'code' : 'lock'], ['notes', 'Notes', 'note']].map(([k, label, icon]) => (
              <button key={k} role="tab" aria-selected={leftTab === k} className={`tab ${leftTab === k ? 'on' : ''}`} onClick={() => setLeftTab(k)}>
                <Icon name={icon} size={15} /> {label}
                {k === 'hints' && <em className="tab-count">{rev.hints}/3</em>}
              </button>
            ))}
          </div>
          <div className="ws-scroll">
            {leftTab === 'desc' && (
              <article className="desc">
                <div className="desc-meta">
                  <Difficulty d={p.difficulty} />
                  <Link to={`/problems?topic=${p.topic}`} className="tag">{p.topicName}</Link>
                  {done && <span className="tag tag-ok"><Icon name="check" size={12} /> Solved</span>}
                  {attempts && <span className="muted small">{attempts.runs} runs · {attempts.submits} submits</span>}
                </div>
                <Md text={p.desc} />
                {p.ex.map(([input, output, explain], i) => (
                  <div className="example" key={i}>
                    <h4>Example {i + 1}</h4>
                    <pre><b>Input:</b> {input}{'\n'}<b>Output:</b> {output}{explain ? <>{'\n'}<b>Explanation:</b> {explain}</> : null}</pre>
                  </div>
                ))}
                <h4>Constraints</h4>
                <ul className="constraints">{p.cons.map((c, i) => <li key={i}><code>{c}</code></li>)}</ul>
                <h4>Method signature</h4>
                <p className="muted small">Implement this in the editor. Run checks {samples.length} sample test{samples.length > 1 ? 's' : ''}; Submit checks all {p.tests.length}.</p>
                <pre className="sig">{p.design ? `class ${p.design.cls} { ${Object.keys(p.design.methods).join(', ')} }` : `${p.fn.ret} ${p.fn.name}(${p.fn.params.map(([t, n]) => `${t === 'CycleList' ? 'ListNode' : t === 'TreeRef' ? 'TreeNode' : t} ${n}`).join(', ')})`}</pre>
              </article>
            )}
            {leftTab === 'hints' && (
              <div className="hints">
                <p className="muted">Hints unlock one at a time. Try to make progress after each one before opening the next.</p>
                {p.hints.map((h, i) => {
                  const n = i + 1, open = rev.hints >= n, canOpen = rev.hints >= i;
                  return (
                    <div key={i} className={`hint ${open ? 'open' : ''}`}>
                      <div className="hint-head">
                        <strong>Hint {n}</strong><span className="muted small">{['A small clue', 'A more detailed approach', 'The optimal approach'][i]}</span>
                      </div>
                      {open ? <Md text={h} /> : (
                        <button className="btn btn-sm" disabled={!canOpen} onClick={() => prog.reveal(p.id, n)}>
                          <Icon name={canOpen ? 'bulb' : 'lock'} size={14} /> {canOpen ? `Reveal hint ${n}` : `Reveal hint ${i} first`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {leftTab === 'solution' && (
              <SolutionPanel p={p} revealed={rev.solution} onReveal={() => prog.reveal(p.id, 'solution')} attempts={attempts}
                theme={settings.theme} onLoad={(c) => { setCode(c); setMobilePane('code'); toast('Solution loaded into the editor'); }} />
            )}
            {leftTab === 'notes' && (
              <div className="notes">
                <p className="muted small">Personal notes for revision — key insight, edge cases you missed, what to remember. Saved automatically in this browser.</p>
                <textarea value={state.notes[p.id] || ''} onChange={(e) => prog.saveNote(p.id, e.target.value)} placeholder="e.g. Remember to seed the map with {0: 1}…" />
              </div>
            )}
          </div>
        </section>

        <div className="splitter-v" onPointerDown={onDragV} role="separator" aria-orientation="vertical" aria-label="Resize panels" />

        <section className="ws-right" ref={rightRef}>
          <div className="editor-bar">
            <span className="lang"><Icon name="code" size={15} /> Java</span>
            <span className="muted small autosave">{code !== starter ? 'Draft saved' : 'Starter code'}</span>
            <div className="spacer" />
            <button className="btn btn-ghost btn-sm" onClick={() => prog.setSettings({ fontSize: Math.max(11, settings.fontSize - 1) })} aria-label="Smaller font">A−</button>
            <button className="btn btn-ghost btn-sm" onClick={() => prog.setSettings({ fontSize: Math.min(22, settings.fontSize + 1) })} aria-label="Larger font">A+</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)} title="Reset to starter code"><Icon name="reset" size={14} /> Reset</button>
          </div>
          <div className="editor-area">
            <CodeEditor value={code} onChange={setCode} theme={settings.theme} fontSize={settings.fontSize}
              onRun={() => execute('run')} onSubmit={() => execute('submit')} />
          </div>
          <div className="splitter-h" onPointerDown={onDragH} role="separator" aria-orientation="horizontal" aria-label="Resize console" />
          <div className="console" style={{ height: consoleH }}>
            <div className="console-bar">
              <button className={`tab ${consoleTab === 'tests' ? 'on' : ''}`} onClick={() => setConsoleTab('tests')}>Test cases</button>
              <button className={`tab ${consoleTab === 'result' ? 'on' : ''}`} onClick={() => setConsoleTab('result')}>Result</button>
              <div className="spacer" />
              <span className="muted small kbd-hint">Ctrl+Enter run · Ctrl+Shift+Enter submit</span>
              <button className="btn" onClick={() => execute('run')} disabled={!!running}>
                {running === 'run' ? <span className="spin" /> : <Icon name="play" size={14} />} Run
              </button>
              <button className="btn btn-primary" onClick={() => execute('submit')} disabled={!!running}>
                {running === 'submit' ? <span className="spin" /> : <Icon name="send" size={14} />} Submit
              </button>
            </div>
            <div className="console-body">
              {consoleTab === 'tests' && (
                <div className="cases">
                  {samples.map((t, i) => (
                    <div className="case" key={i}>
                      <div className="case-label">Case {i + 1}</div>
                      <pre>{formatArgs(p, t)}</pre>
                      <div className="case-exp muted small">Expected: <code>{show(t.out)}</code></div>
                    </div>
                  ))}
                  <p className="muted small">+ {p.tests.length - samples.length} hidden test{p.tests.length - samples.length === 1 ? '' : 's'} on Submit (edge cases included).</p>
                </div>
              )}
              {consoleTab === 'result' && <ResultView p={p} result={result} running={running} activeCase={activeCase} setActiveCase={setActiveCase} />}
            </div>
          </div>
        </section>
      </div>

      {confirmReset && (
        <Modal title="Reset code?" onClose={() => setConfirmReset(false)} actions={<>
          <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { setCode(starter); prog.clearDraft(p.id); setConfirmReset(false); }}>Reset</button>
        </>}>
          <p>This replaces your current code with the starter template. Your saved draft for this problem will be cleared.</p>
        </Modal>
      )}
    </div>
  );
}

function ResultView({ p, result, running, activeCase, setActiveCase }) {
  if (running) return <div className="result-wait"><span className="spin" /> {running === 'submit' ? 'Running all tests…' : 'Running sample tests…'}</div>;
  if (!result) return <p className="muted">Run your code to see results here.</p>;
  if (result.error) {
    if (result.unreachable) {
      return (
        <div className="result-error">
          <h4 className="tone-text-bad">Code runner not reachable</h4>
          <p>Java code is compiled and executed by a runner. Pick one in <Link to="/settings">Settings</Link>:</p>
          <ul>
            <li><b>Local (recommended):</b> install JDK 11+, then run <code>npm run dev</code> (or <code>npm start</code> after building) from the project folder. Open the app at the address it prints.</li>
            <li><b>Judge0</b> or <b>Piston</b>: point the app at a hosted or self-hosted instance.</li>
          </ul>
          <p className="muted small">Everything else (hints, solutions, progress) works without a runner.</p>
        </div>
      );
    }
    return (
      <div className="result-error">
        <h4 className="tone-text-bad">{result.compile ? 'Compilation error' : 'Error'}</h4>
        <pre className="err">{result.error}</pre>
      </div>
    );
  }
  const { cases, passed, allPassed, timedOut, stderr, extra } = result;
  const c = cases[activeCase];
  const verdict = timedOut ? 'Time Limit Exceeded' : allPassed ? (result.kind === 'submit' ? 'Accepted' : 'All sample tests passed') : cases.some((x) => x.status === 'error') ? 'Runtime Error' : 'Wrong Answer';
  return (
    <div className="result">
      <div className="verdict">
        <h4 className={allPassed && !timedOut ? 'tone-text-ok' : 'tone-text-bad'}>{verdict}</h4>
        <span className="muted small">{passed}/{cases.length} test cases passed{result.ms ? ` · ${result.ms} ms total` : ''}</span>
      </div>
      <div className="case-chips">
        {cases.map((x, i) => (
          <button key={i} className={`case-chip ${x.status} ${i === activeCase ? 'on' : ''}`} onClick={() => setActiveCase(i)}>
            {x.status === 'pass' ? '✓' : '✗'} Case {i + 1}
          </button>
        ))}
      </div>
      {c && (
        <div className="case-detail">
          <div className="kv"><span>Input</span><pre>{formatArgs(p, p.tests[activeCase])}</pre></div>
          {c.status === 'error' && <div className="kv"><span>Exception</span><pre className="err">{c.error}</pre></div>}
          {c.status === 'missing' && <div className="kv"><span>Output</span><pre className="err">No result — the program stopped before this test (timeout, crash or System.exit).</pre></div>}
          {(c.status === 'pass' || c.status === 'fail') && <div className="kv"><span>Your output</span><pre className={c.status === 'fail' ? 'err' : ''}>{show(c.got)}</pre></div>}
          <div className="kv"><span>Expected</span><pre>{show(c.expected)}</pre></div>
          {p.cmp && <p className="muted small">Order does not matter for this problem — results are compared after sorting.</p>}
          {c.log && <div className="kv"><span>Stdout</span><pre>{c.log}</pre></div>}
        </div>
      )}
      {(stderr || extra) && <div className="kv"><span>Program output</span><pre>{[extra, stderr].filter(Boolean).join('\n')}</pre></div>}
    </div>
  );
}

