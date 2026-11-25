// Compiles and runs a Java program (class Main) with the JDK installed on this machine.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function exec(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    let stdout = '', stderr = '', killed = false;
    const env = { ...process.env };
    delete env.JAVA_TOOL_OPTIONS;
    delete env._JAVA_OPTIONS;
    delete env.JDK_JAVA_OPTIONS;
    const child = spawn(cmd, args, { cwd: opts.cwd, env });
    const limit = 2_000_000;
    child.stdout.on('data', (d) => { if (stdout.length < limit) stdout += d; });
    child.stderr.on('data', (d) => { if (stderr.length < limit) stderr += d; });
    const timer = setTimeout(() => { killed = true; child.kill('SIGKILL'); }, opts.timeout || 10000);
    child.on('error', (e) => { clearTimeout(timer); resolve({ code: -1, stdout, stderr: String(e.message), killed, ms: Date.now() - started, spawnError: true }); });
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, stdout, stderr, killed, ms: Date.now() - started }); });
  });
}

let cachedVersion = null;
export async function javaVersion() {
  if (cachedVersion) return cachedVersion;
  const r = await exec('java', ['-version'], { timeout: 8000 });
  if (r.spawnError) return null;
  const line = (r.stderr || r.stdout).split('\n').find((l) => /version/.test(l));
  cachedVersion = line ? line.trim() : 'java';
  return cachedVersion;
}

export async function runJava(source, { timeoutMs = 10000 } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'jdsa-'));
  try {
    await writeFile(join(dir, 'Main.java'), source, 'utf8');
    const rel = process.env.JAVAC_RELEASE ? ['--release', process.env.JAVAC_RELEASE] : [];
    const c = await exec('javac', [...rel, '-encoding', 'UTF-8', '-nowarn', 'Main.java'], { cwd: dir, timeout: 30000 });
    if (c.spawnError) return { ok: false, error: 'javac not found. Install a JDK (11+) and make sure javac is on your PATH.' };
    if (c.code !== 0) return { ok: false, compileError: c.stderr || c.stdout || 'Compilation failed' };
    const r = await exec('java', ['-Xss256m', '-Xmx512m', '-cp', dir, 'Main'], { cwd: dir, timeout: timeoutMs });
    return { ok: true, stdout: r.stdout, stderr: r.stderr, exitCode: r.code, timedOut: r.killed, ms: r.ms };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// Minimal HTTP handler usable from Vite middleware or a plain node server.
export function handler() {
  return async (req, res, next) => {
    const url = req.url || '';
    if (!url.startsWith('/api/')) return next ? next() : (res.statusCode = 404, res.end());
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
    if (url.startsWith('/api/health')) {
      const v = await javaVersion();
      return res.end(JSON.stringify({ ok: !!v, java: v }));
    }
    if (url.startsWith('/api/run') && req.method === 'POST') {
      let body = '';
      req.on('data', (d) => { body += d; if (body.length > 1_000_000) req.destroy(); });
      req.on('end', async () => {
        try {
          const { source } = JSON.parse(body || '{}');
          if (!source) throw new Error('Missing source');
          const out = await runJava(source);
          res.end(JSON.stringify(out));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ ok: false, error: 'Not found' }));
  };
}
