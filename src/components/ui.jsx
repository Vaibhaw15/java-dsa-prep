import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';

// ---------- icons (inline SVG, stroke = currentColor) ----------
const paths = {
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  play: 'M6 4l14 8-14 8z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  check: 'M20 6L9 17l-5-5',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  shuffle: 'M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 1 1 8 0v4',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  flame: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z',
  x: 'M18 6L6 18M6 6l12 12',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  note: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
};
export function Icon({ name, size = 18, className = '', fill = false }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function Difficulty({ d }) {
  return <span className={`diff diff-${d.toLowerCase()}`}>{d}</span>;
}

export function Bar({ value, total, tone = 'accent' }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><span className={`bar-fill tone-${tone}`} style={{ width: `${pct}%` }} /></div>;
}

export function Ring({ pct, size = 120, stroke = 10, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-fill" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="ring-label"><strong>{pct}%</strong>{label && <span>{label}</span>}</div>
    </div>
  );
}

// ---------- tiny safe markdown: paragraphs, lists, `code`, **bold** ----------
function inline(text, keyBase) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={`${keyBase}-${k++}`}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith('`')) parts.push(<code key={`${keyBase}-${k++}`}>{tok.slice(1, -1)}</code>);
    else parts.push(<strong key={`${keyBase}-${k++}`}>{tok.slice(2, -2)}</strong>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(<Fragment key={`${keyBase}-${k++}`}>{text.slice(last)}</Fragment>);
  return parts;
}
export function Md({ text, className = 'md' }) {
  const blocks = String(text || '').split(/\n\n+/);
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^- /.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ''), `${i}-${j}`)}</li>)}</ol>;
        if (lines.length > 1 && lines.slice(1).every((l) => /^- /.test(l))) {
          return <div key={i}><p>{inline(lines[0], `${i}h`)}</p><ul>{lines.slice(1).map((l, j) => <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>)}</ul></div>;
        }
        return <p key={i}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l, `${i}-${j}`)}</Fragment>)}</p>;
      })}
    </div>
  );
}

// ---------- code editor / viewer ----------
const baseTheme = EditorView.theme({
  '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.6' },
  '.cm-gutters': { border: 'none' },
});

export function CodeEditor({ value, onChange, theme, fontSize = 14, readOnly = false, auto = false, onRun, onSubmit }) {
  const runRef = useRef(onRun), submitRef = useRef(onSubmit);
  runRef.current = onRun;
  submitRef.current = onSubmit;
  const extensions = useMemo(() => [
    java(),
    baseTheme,
    Prec.highest(keymap.of([
      { key: 'Mod-Enter', run: () => { runRef.current?.(); return true; } },
      { key: 'Mod-Shift-Enter', run: () => { submitRef.current?.(); return true; } },
    ])),
    ...(readOnly ? [EditorView.lineWrapping] : []),
  ], [readOnly]);
  return (
    <div className={`editor-wrap ${auto ? 'editor-auto' : ''}`} style={{ fontSize }}>
      <CodeMirror
        value={value}
        height={auto ? undefined : '100%'}
        theme={theme === 'dark' ? oneDark : 'light'}
        extensions={extensions}
        editable={!readOnly}
        readOnly={readOnly}
        basicSetup={{ lineNumbers: true, foldGutter: !readOnly, highlightActiveLine: !readOnly, highlightActiveLineGutter: !readOnly, autocompletion: !readOnly, tabSize: 4, indentOnInput: true, bracketMatching: true, closeBrackets: !readOnly }}
        onChange={onChange}
      />
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  useEffect(() => { if (done) { const t = setTimeout(() => setDone(false), 1500); return () => clearTimeout(t); } }, [done]);
  return (
    <button className="btn btn-ghost btn-sm" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setDone(true); } catch { /* clipboard blocked */ }
    }}>
      <Icon name={done ? 'check' : 'copy'} size={14} /> {done ? 'Copied' : label}
    </button>
  );
}

export function Modal({ title, children, onClose, actions }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}

let toastSetter = null;
export function toast(msg, tone = 'ok') { toastSetter?.({ msg, tone, id: Date.now() }); }
export function Toaster() {
  const [t, setT] = useState(null);
  useEffect(() => { toastSetter = setT; return () => { toastSetter = null; }; }, []);
  useEffect(() => { if (t) { const x = setTimeout(() => setT(null), 2800); return () => clearTimeout(x); } }, [t]);
  return t ? <div className={`toast toast-${t.tone}`} role="status">{t.msg}</div> : null;
}
