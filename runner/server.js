// Standalone server: serves the built app from ../dist and the Java runner at /api.
// Usage: npm run build && npm start   (then open http://localhost:5050)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handler, javaVersion } from './javaRunner.js';

const PORT = Number(process.env.PORT || 5050);
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const api = handler();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  if ((req.url || '').startsWith('/api/')) return api(req, res);
  const path = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(dist, path === '/' ? 'index.html' : path);
  try {
    const data = await readFile(file);
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    try { res.setHeader('Content-Type', 'text/html'); res.end(await readFile(join(dist, 'index.html'))); }
    catch { res.statusCode = 404; res.end('Run "npm run build" first.'); }
  }
}).listen(PORT, async () => {
  const v = await javaVersion();
  console.log(`\n  Java DSA Prep running at http://localhost:${PORT}`);
  console.log(v ? `  Java runner ready: ${v}\n` : '  WARNING: java/javac not found on PATH. Run Code will not work until a JDK is installed.\n');
});
