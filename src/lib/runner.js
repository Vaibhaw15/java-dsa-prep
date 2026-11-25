// Client for executing Java. Three interchangeable backends:
//  - local:  the bundled Node runner (npm run dev / npm start) using the JDK on your machine
//  - judge0: any Judge0 CE instance (public, RapidAPI or self-hosted)
//  - piston: a Piston instance (self-hosted)
// All return { ok, stdout, stderr, compileError, error, timedOut, ms }.

const withTimeout = async (url, opts, ms = 45000) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctl.signal }); }
  finally { clearTimeout(t); }
};

async function runLocal(source, cfg) {
  const base = (cfg.localUrl || '').replace(/\/$/, '');
  const res = await withTimeout(`${base}/api/run`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source }),
  });
  const data = await res.json();
  if (data.compileError) return { ok: false, compileError: data.compileError };
  if (data.error) return { ok: false, error: data.error };
  return { ok: true, stdout: data.stdout, stderr: data.stderr, timedOut: data.timedOut, ms: data.ms };
}

async function runJudge0(source, cfg) {
  const base = (cfg.judge0Url || '').replace(/\/$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (cfg.judge0Key) {
    if (/rapidapi/.test(base)) { headers['X-RapidAPI-Key'] = cfg.judge0Key; headers['X-RapidAPI-Host'] = new URL(base).host; }
    else headers['X-Auth-Token'] = cfg.judge0Key;
  }
  const res = await withTimeout(`${base}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST', headers,
    body: JSON.stringify({ source_code: source, language_id: Number(cfg.judge0Lang) || 62, stdin: '', cpu_time_limit: 10, wall_time_limit: 20, memory_limit: 512000 }),
  });
  if (!res.ok) return { ok: false, error: `Judge0 responded with HTTP ${res.status}. Check the URL and API key in Settings.` };
  const d = await res.json();
  const id = d.status?.id;
  if (id === 6) return { ok: false, compileError: d.compile_output || 'Compilation error' };
  return { ok: true, stdout: d.stdout || '', stderr: [d.stderr, d.message].filter(Boolean).join('\n'), timedOut: id === 5, ms: d.time ? Math.round(d.time * 1000) : undefined };
}

async function runPiston(source, cfg) {
  const res = await withTimeout(cfg.pistonUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'java', version: '*', files: [{ name: 'Main.java', content: source }], run_timeout: 10000, compile_timeout: 20000 }),
  });
  if (!res.ok) return { ok: false, error: `Piston responded with HTTP ${res.status}.` };
  const d = await res.json();
  if (d.compile && d.compile.code !== 0) return { ok: false, compileError: d.compile.stderr || d.compile.output };
  if (d.run?.stderr && /error:/.test(d.run.stderr) && !d.run.stdout) return { ok: false, compileError: d.run.stderr };
  return { ok: true, stdout: d.run?.stdout || '', stderr: d.run?.stderr || '', timedOut: d.run?.signal === 'SIGKILL' };
}

// ---------- Browser runner: a full OpenJDK compiled to WebAssembly (CheerpJ) ----------
// Free for personal use. Compiles with javac from /tools.jar (Java 8), runs in the page.
const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/5.0/loader.js';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let cjReady = null;
let cjQueue = Promise.resolve();
let cjBusy = false;

function cjConsole() {
  let el = document.getElementById('console'); // CheerpJ writes System.out / System.err here
  if (!el) {
    el = document.createElement('pre');
    el.id = 'console';
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  return el;
}

export function loadCheerpJ() {
  if (cjReady) return cjReady;
  cjReady = new Promise((resolve, reject) => {
    const go = async () => {
      try {
        cjConsole();
        await window.cheerpjInit({ status: 'none' });
        resolve();
      } catch (e) { reject(e); }
    };
    if (window.cheerpjInit) { go(); return; }
    const s = document.createElement('script');
    s.src = CHEERPJ_LOADER;
    s.onload = go;
    s.onerror = () => reject(new Error('Could not download the in-browser Java runtime (CheerpJ). Check your internet connection or ad blocker.'));
    document.head.appendChild(s);
  });
  cjReady.catch(() => { cjReady = null; });
  return cjReady;
}

async function cjRun(source) {
  if (cjBusy) return { ok: false, error: 'A previous run is still executing (possibly an infinite loop). Reload the page to stop it.' };
  cjBusy = true;
  let stuck = false;
  try {
    await loadCheerpJ();
    const con = cjConsole();
    // Unique package per run so freshly compiled classes never clash with earlier runs.
    // Added on the first line so compiler line numbers stay the same.
    const pkg = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const add = window.cheerpOSAddStringFile || window.cheerpjAddStringFile;
    add(`/str/${pkg}/Main.java`, new TextEncoder().encode(`package ${pkg}; ` + source));

    con.textContent = '';
    const t0 = performance.now();
    const code = await window.cheerpjRunMain('com.sun.tools.javac.Main', '/app/tools.jar',
      `/str/${pkg}/Main.java`, '-d', '/files/', '-encoding', 'UTF-8', '-nowarn');
    await sleep(50);
    if (code !== 0) return { ok: false, compileError: con.textContent || 'Compilation failed' };

    con.textContent = '';
    const run = window.cheerpjRunMain(`${pkg}.Main`, '/files/');
    const res = await Promise.race([run.then(() => 'done'), sleep(60000).then(() => 'timeout')]);
    await sleep(50);
    if (res === 'timeout') stuck = true; // Java keeps running; block new runs until reload
    if (res === 'timeout') return { ok: true, stdout: con.textContent, stderr: 'Stopped waiting after 60 s. If your code has an infinite loop, reload the page.', timedOut: true };
    return { ok: true, stdout: con.textContent, stderr: '', ms: Math.round(performance.now() - t0) };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    if (!stuck) cjBusy = false;
  }
}

export async function runProgram(source, cfg) {
  if (cfg.mode === 'browser') {
    const job = cjQueue.then(() => cjRun(source));
    cjQueue = job.catch(() => {});
    return job;
  }
  try {
    if (cfg.mode === 'judge0') return await runJudge0(source, cfg);
    if (cfg.mode === 'piston') return await runPiston(source, cfg);
    return await runLocal(source, cfg);
  } catch (e) {
    const offline = e.name === 'AbortError' ? 'The request timed out.' : 'Could not reach the code runner.';
    return { ok: false, unreachable: true, error: offline };
  }
}

export async function testConnection(cfg) {
  const hello = 'import java.util.*; public class Main { public static void main(String[] a) { System.out.println("runner-ok " + System.getProperty("java.version")); } }';
  const r = await runProgram(hello, cfg);
  if (r.ok && /runner-ok/.test(r.stdout)) return { ok: true, message: `Connected. Java ${r.stdout.trim().split(' ')[1] || ''}` };
  return { ok: false, message: r.error || r.compileError || r.stderr || 'Unexpected response' };
}
