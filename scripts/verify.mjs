// Runs every brute-force and optimized solution against all test cases.
// Usage: node scripts/verify.mjs [topicKey|problemId ...]
import { buildProgram, evaluate, remapErrors } from '../src/lib/harness.js';
import { runJava } from '../runner/javaRunner.js';
import { topics } from '../src/data/index.js';

const filters = process.argv.slice(2);
const jobs = [];
for (const t of topics) for (const p of t.problems) {
  if (filters.length && !filters.includes(t.key) && !filters.includes(p.id)) continue;
  for (const kind of ['optimal', 'brute']) {
    const code = p[kind]?.code;
    if (code) jobs.push({ p, kind, code });
    else console.log(`MISSING ${kind} code: ${p.id}`);
  }
}
let failures = 0, done = 0;
async function work(job) {
  const { p, kind, code } = job;
  const { source, offset } = buildProgram(p, code, p.tests);
  const r = await runJava(source, { timeoutMs: 20000 });
  done++;
  if (!r.ok) { failures++; console.log(`\nFAIL ${p.id} [${kind}] compile:\n${remapErrors(r.compileError || r.error, offset).slice(0, 1500)}`); return; }
  if (r.timedOut) { failures++; console.log(`\nFAIL ${p.id} [${kind}] timeout`); return; }
  const res = evaluate(p, p.tests, r.stdout);
  const bad = res.filter((x) => x.status !== 'pass');
  if (bad.length) {
    failures++;
    console.log(`\nFAIL ${p.id} [${kind}]`);
    bad.slice(0, 3).forEach((b) => console.log(`  test ${b.i}: ${b.status} expected=${JSON.stringify(b.expected)} got=${JSON.stringify(b.got)} ${b.error || ''}`));
    if (r.stderr) console.log('  stderr:', r.stderr.slice(0, 500));
  }
}
const N = 6;
let idx = 0;
await Promise.all(Array.from({ length: N }, async () => { while (idx < jobs.length) await work(jobs[idx++]); }));
console.log(`\nChecked ${done} solutions, ${failures} failing.`);
process.exit(failures ? 1 : 0);
