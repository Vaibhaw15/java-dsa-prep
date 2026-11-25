import { topics } from '../src/data/index.js';
import { starterCode } from '../src/lib/harness.js';
const ids = new Set(), titles = new Set(); let total = 0, bad = 0;
const req = ['id','title','difficulty','desc','ex','cons','tests','hints','brute','optimal','lines','cx','dry','tips','mistakes','java'];
for (const t of topics) {
  console.log(t.name.padEnd(32), t.problems.length);
  for (const p of t.problems) {
    total++;
    for (const k of req) if (!p[k] || (Array.isArray(p[k]) && !p[k].length)) { console.log('  missing', k, p.id); bad++; }
    if (p.hints.length !== 3) { console.log('  hints != 3', p.id); bad++; }
    if (!['Easy','Medium','Hard'].includes(p.difficulty)) { console.log('  diff', p.id); bad++; }
    if (ids.has(p.id)) { console.log('  dup id', p.id); bad++; } ids.add(p.id);
    const tl = p.title.toLowerCase(); if (titles.has(tl)) { console.log('  dup title', p.title); bad++; } titles.add(tl);
    if (!p.fn && !p.design) { console.log('  no signature', p.id); bad++; }
    starterCode(p);
  }
}
const diff = {}; topics.flatMap(t=>t.problems).forEach(p=>diff[p.difficulty]=(diff[p.difficulty]||0)+1);
console.log('TOTAL', total, diff, 'problems with issues:', bad);
