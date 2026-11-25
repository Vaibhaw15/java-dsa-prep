// Generates a runnable Java program (class Main) from a problem's signature,
// test cases and the user's code. Results are printed as "##R##{json}" lines
// and compared in JavaScript so we can support unordered answers, floats, etc.

const OUT_BASE = String.raw`
class Out {
    static String q(String s) {
        StringBuilder b = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
                    else b.append(c);
            }
        }
        return b.append('"').toString();
    }
    static String num(double d) {
        if (Double.isNaN(d) || Double.isInfinite(d)) return q(String.valueOf(d));
        return String.valueOf(d);
    }
    static String ser(Object o) {
        if (o == null) return "null";
        if (o instanceof String) return q((String) o);
        if (o instanceof Character) return q(String.valueOf(o));
        if (o instanceof Double || o instanceof Float) return num(((Number) o).doubleValue());
        if (o instanceof Number || o instanceof Boolean) return String.valueOf(o);
        StringBuilder b = new StringBuilder("[");
        if (o instanceof int[]) { int[] a = (int[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof long[]) { long[] a = (long[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof double[]) { double[] a = (double[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(num(a[i])); } return b.append(']').toString(); }
        if (o instanceof boolean[]) { boolean[] a = (boolean[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof char[]) { char[] a = (char[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(q(String.valueOf(a[i]))); } return b.append(']').toString(); }
        if (o instanceof Object[]) { Object[] a = (Object[]) o; for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(ser(a[i])); } return b.append(']').toString(); }
        if (o instanceof Iterable) { boolean first = true; for (Object x : (Iterable<?>) o) { if (!first) b.append(','); first = false; b.append(ser(x)); } return b.append(']').toString(); }
        /*EXTRA_SER*/
        return q(String.valueOf(o));
    }
    static List<Integer> li(int[] a) { List<Integer> r = new ArrayList<>(); for (int x : a) r.add(x); return r; }
    static List<String> ls(String[] a) { return new ArrayList<>(Arrays.asList(a)); }
    static List<List<Integer>> lli(int[][] a) { List<List<Integer>> r = new ArrayList<>(); for (int[] x : a) r.add(li(x)); return r; }
    static List<List<String>> lls(String[][] a) { List<List<String>> r = new ArrayList<>(); for (String[] x : a) r.add(ls(x)); return r; }
    /*EXTRA_HELPERS*/
}
`;

const LIST_SER = String.raw`
        if (o instanceof ListNode) { ListNode c = (ListNode) o; int n = 0; boolean first = true;
            while (c != null && n++ < 10000) { if (!first) b.append(','); first = false; b.append(c.val); c = c.next; }
            if (c != null) b.append(",\"...cycle\""); return b.append(']').toString(); }`;
const LIST_HELPERS = String.raw`
    static ListNode list(int[] a) { ListNode d = new ListNode(0), c = d; for (int v : a) { c.next = new ListNode(v); c = c.next; } return d.next; }
    static ListNode cycle(int[] a, int pos) { ListNode h = list(a); if (pos < 0 || h == null) return h;
        ListNode t = h, p = null; int i = 0; while (true) { if (i == pos) p = t; if (t.next == null) break; t = t.next; i++; } t.next = p; return h; }
    static ListNode[] lists(int[][] a) { ListNode[] r = new ListNode[a.length]; for (int i = 0; i < a.length; i++) r[i] = list(a[i]); return r; }`;
const TREE_SER = String.raw`
        if (o instanceof TreeNode) { List<String> r = new ArrayList<>(); Deque<TreeNode> dq = new ArrayDeque<>(); List<TreeNode> lvl = new ArrayList<>();
            lvl.add((TreeNode) o); int guard = 0;
            while (!lvl.isEmpty() && guard++ < 100000) { List<TreeNode> nx = new ArrayList<>();
                for (TreeNode t : lvl) { if (t == null) { r.add("null"); continue; } r.add(String.valueOf(t.val)); nx.add(t.left); nx.add(t.right); }
                boolean any = false; for (TreeNode t : nx) if (t != null) any = true; lvl = any ? nx : new ArrayList<>(); }
            while (!r.isEmpty() && r.get(r.size() - 1).equals("null")) r.remove(r.size() - 1);
            return "[" + String.join(",", r) + "]"; }`;
const TREE_HELPERS = String.raw`
    static TreeNode tree(Integer[] a) { if (a.length == 0 || a[0] == null) return null;
        TreeNode root = new TreeNode(a[0]); Queue<TreeNode> q = new LinkedList<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < a.length) { TreeNode c = q.poll();
            if (i < a.length && a[i] != null) { c.left = new TreeNode(a[i]); q.add(c.left); } i++;
            if (i < a.length && a[i] != null) { c.right = new TreeNode(a[i]); q.add(c.right); } i++; }
        return root; }
    static TreeNode find(TreeNode r, int v) { if (r == null) return null; if (r.val == v) return r; TreeNode l = find(r.left, v); return l != null ? l : find(r.right, v); }`;

export const LISTNODE_DEF = `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}`;
export const TREENODE_DEF = `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}`;

const allTypes = (p) => {
  const t = [];
  if (p.fn) { p.fn.params.forEach(([ty]) => t.push(ty)); t.push(p.fn.ret); }
  if (p.design) { t.push(...p.design.ctor); Object.values(p.design.methods).forEach(([ps, r]) => { t.push(...ps, r); }); }
  if (p.uses) t.push(...p.uses);
  return t.join(' ');
};
export const usesList = (p) => /ListNode|CycleList/.test(allTypes(p));
export const usesTree = (p) => /TreeNode|TreeRef/.test(allTypes(p));

const jStr = (s) => JSON.stringify(s);
const jChar = (c) => {
  const m = { "'": "\\'", '\\': '\\\\', '\n': '\\n', '\t': '\\t', '\r': '\\r' };
  return `'${m[c] ?? c}'`;
};
const dbl = (v) => { const s = String(v); return /[.eE]/.test(s) ? s : s + '.0'; };

// Convert a JSON value into a Java expression of the given type.
export function lit(type, v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && v.$java) return v.$java;
  switch (type) {
    case 'int': case 'short': case 'byte': return String(v);
    case 'long': return `${v}L`;
    case 'double': case 'float': return dbl(v);
    case 'boolean': return String(!!v);
    case 'char': return jChar(v);
    case 'String': return v === null ? 'null' : jStr(v);
    case 'Integer': return v === null ? 'null' : `Integer.valueOf(${v})`;
    case 'int[]': return `new int[]{${v.join(',')}}`;
    case 'long[]': return `new long[]{${v.map((x) => x + 'L').join(',')}}`;
    case 'double[]': return `new double[]{${v.map(dbl).join(',')}}`;
    case 'boolean[]': return `new boolean[]{${v.join(',')}}`;
    case 'char[]': return `new char[]{${v.map(jChar).join(',')}}`;
    case 'String[]': return `new String[]{${v.map(jStr).join(',')}}`;
    case 'int[][]': return `new int[][]{${v.map((r) => `{${r.join(',')}}`).join(',')}}`;
    case 'char[][]': return `new char[][]{${v.map((r) => `{${r.map(jChar).join(',')}}`).join(',')}}`;
    case 'String[][]': return `new String[][]{${v.map((r) => `{${r.map(jStr).join(',')}}`).join(',')}}`;
    case 'List<Integer>': return `Out.li(${lit('int[]', v)})`;
    case 'List<String>': return `Out.ls(${lit('String[]', v)})`;
    case 'List<List<Integer>>': return `Out.lli(${lit('int[][]', v)})`;
    case 'List<List<String>>': return `Out.lls(${lit('String[][]', v)})`;
    case 'ListNode': return `Out.list(${lit('int[]', v)})`;
    case 'ListNode[]': return `Out.lists(${lit('int[][]', v)})`;
    case 'CycleList': return `Out.cycle(${lit('int[]', v[0])}, ${v[1]})`;
    case 'TreeNode': return `Out.tree(new Integer[]{${v.map((x) => (x === null ? 'null' : x)).join(',')}})`;
    case 'TreeRef': return `Out.find(a0, ${v})`;
    default: throw new Error('Unsupported type ' + type);
  }
}
const javaType = (t) => (t === 'CycleList' ? 'ListNode' : t === 'TreeRef' ? 'TreeNode' : t);

function defaultReturn(t) {
  if (t === 'void') return '';
  if (['int', 'long', 'short', 'byte'].includes(t)) return 'return 0;';
  if (t === 'double' || t === 'float') return 'return 0.0;';
  if (t === 'boolean') return 'return false;';
  if (t === 'char') return "return ' ';";
  if (t.startsWith('List<')) return 'return new ArrayList<>();';
  if (t.endsWith('[][]')) return `return new ${t.slice(0, -4)}[0][];`;
  if (t.endsWith('[]')) return `return new ${t.slice(0, -2)}[0];`;
  return 'return null;';
}

export function starterCode(p) {
  const head = [];
  if (p.starter) {
    if (usesTree(p)) head.push('/*\n * Definition for a binary tree node (already provided):\n * ' + TREENODE_DEF.split('\n').join('\n * ') + '\n */');
    return (head.length ? head.join('\n') + '\n\n' : '') + 'import java.util.*;\n\n' + p.starter + '\n';
  }
  if (usesList(p)) head.push('/*\n * Definition for singly-linked list (already provided):\n * ' + LISTNODE_DEF.split('\n').join('\n * ') + '\n */');
  if (usesTree(p)) head.push('/*\n * Definition for a binary tree node (already provided):\n * ' + TREENODE_DEF.split('\n').join('\n * ') + '\n */');
  let body;
  if (p.design) {
    const d = p.design;
    const ctorParams = d.ctor.map((t, i) => `${javaType(t)} ${d.ctorNames?.[i] ?? 'arg' + i}`).join(', ');
    const methods = Object.entries(d.methods).map(([name, [ps, r, names]]) => {
      const params = ps.map((t, i) => `${javaType(t)} ${names?.[i] ?? 'arg' + i}`).join(', ');
      const ret = defaultReturn(r);
      return `\n    public ${r} ${name}(${params}) {\n        // Write your code here\n        ${ret}\n    }`;
    }).join('\n');
    body = `class ${d.cls} {\n\n    public ${d.cls}(${ctorParams}) {\n        // Initialize your data structure here\n    }\n${methods}\n}`;
  } else {
    const f = p.fn;
    const params = f.params.map(([t, n]) => `${javaType(t)} ${n}`).join(', ');
    const ret = defaultReturn(f.ret === 'void' || p.fn.out !== undefined ? f.ret : f.ret);
    body = `class ${p.cls || 'Solution'} {\n    public ${f.ret} ${f.name}(${params}) {\n        // Write your code here\n        ${ret}\n    }\n}`;
  }
  return (head.length ? head.join('\n') + '\n\n' : '') + 'import java.util.*;\n\n' + body + '\n';
}

function testBody(p, t) {
  const cls = p.cls || 'Solution';
  if (p.design) {
    const d = p.design;
    const lines = ['List<String> __r = new ArrayList<>();'];
    t.ops.forEach((op, k) => {
      const args = t.args[k] || [];
      if (k === 0) {
        lines.push(`${d.cls} __o = new ${d.cls}(${args.map((v, i) => lit(d.ctor[i], v)).join(', ')});`, '__r.add("null");');
      } else {
        const [ps, r] = d.methods[op];
        const call = `__o.${op}(${args.map((v, i) => lit(ps[i], v)).join(', ')})`;
        lines.push(r === 'void' ? `${call}; __r.add("null");` : `__r.add(Out.ser(${call}));`);
      }
    });
    lines.push('return "[" + String.join(",", __r) + "]";');
    return lines.join(' ');
  }
  const f = p.fn;
  const decl = f.params.map(([ty], i) => `${javaType(ty)} a${i} = ${lit(ty, t.in[i])};`);
  const args = f.params.map((_, i) => `a${i}`).join(', ');
  let ret;
  if (p.call) ret = `return Out.ser(${p.call.replace(/\$(\d)/g, 'a$1')});`;
  else if (f.out !== undefined) ret = `s.${f.name}(${args}); return Out.ser(a${f.out});`;
  else ret = `return Out.ser(s.${f.name}(${args}));`;
  return `${cls} s = new ${cls}(); ${decl.join(' ')} ${ret}`;
}

export function buildProgram(p, userCode, tests) {
  const imports = new Set(['import java.util.*;', 'import java.util.stream.*;', 'import java.util.function.*;']);
  const body = [];
  userCode.split('\n').forEach((line) => {
    const m = line.match(/^\s*import\s+[\w.*\s]+;\s*$/);
    if (m) { imports.add(line.trim()); body.push(''); }
    else if (/^\s*package\s+[\w.]+\s*;/.test(line)) body.push('');
    else body.push(line.replace(/^public\s+(?=((final|abstract)\s+)*(class|interface|enum|record)\b)/, ''));
  });
  const code = body.join('\n');
  const L = usesList(p), T = usesTree(p);
  let out = OUT_BASE
    .replace('/*EXTRA_SER*/', (L ? LIST_SER : '') + (T ? TREE_SER : ''))
    .replace('/*EXTRA_HELPERS*/', (L ? LIST_HELPERS : '') + (T ? TREE_HELPERS : ''));
  const defs = [];
  if (L && !/^\s*(public\s+)?class\s+ListNode\b/m.test(code)) defs.push(LISTNODE_DEF);
  if (T && !/^\s*(public\s+)?class\s+TreeNode\b/m.test(code)) defs.push(TREENODE_DEF);

  const runs = tests.map((t, i) => `        run(${i}, () -> { ${testBody(p, t)} });`).join('\n');
  const main = String.raw`public class Main {
    static void run(int i, java.util.concurrent.Callable<String> c) {
        final java.io.PrintStream real = System.out;
        final java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();
        final String[] res = new String[2];
        final long[] time = new long[1];
        System.setOut(new java.io.PrintStream(buf, true));
        Thread th = new Thread(null, () -> {
            long t0 = System.nanoTime();
            try { res[0] = c.call(); }
            catch (Throwable e) {
                StringBuilder sb = new StringBuilder(e.toString());
                StackTraceElement[] st = e.getStackTrace();
                for (int k = 0; k < Math.min(4, st.length); k++) sb.append("\n    at ").append(st[k]);
                res[1] = sb.toString();
            }
            time[0] = (System.nanoTime() - t0) / 1000000;
        }, "t" + i, 1L << 26);
        th.start();
        try { th.join(); } catch (InterruptedException e) { }
        System.out.flush();
        System.setOut(real);
        String log = buf.toString();
        if (log.length() > 4000) log = log.substring(0, 4000) + "\n...(output truncated)";
        real.println("##R##{\"i\":" + i + ",\"ms\":" + time[0] + ",\"out\":" + (res[0] == null ? "null" : Out.q(res[0]))
            + ",\"err\":" + (res[1] == null ? "null" : Out.q(res[1])) + ",\"log\":" + Out.q(log) + "}");
        real.flush();
    }
    public static void main(String[] args) {
${runs}
    }
}`;
  const pre = [...imports].join('\n') + '\n\n' + main + '\n' + out + '\n' + defs.join('\n') + '\n// ---- your code ----\n';
  const offset = pre.split('\n').length - 1; // number of lines before user code
  return { source: pre + code + '\n', offset };
}

// ---------- result comparison ----------
const cmpVal = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const x = JSON.stringify(a), y = JSON.stringify(b);
  return x < y ? -1 : x > y ? 1 : 0;
};
export function normalize(v, mode) {
  if (!Array.isArray(v) || !mode) return v;
  if (mode === 'sorted') return [...v].sort(cmpVal);
  if (mode === 'deep') return v.map((x) => (Array.isArray(x) ? [...x].sort(cmpVal) : x)).sort(cmpVal);
  return v;
}
export function deepEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(b));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  return a === b;
}

export function parseResults(stdout) {
  const results = {};
  let extra = '';
  (stdout || '').split('\n').forEach((line) => {
    if (line.startsWith('##R##')) {
      try { const r = JSON.parse(line.slice(5)); results[r.i] = r; } catch { /* ignore */ }
    } else if (line.trim()) extra += line + '\n';
  });
  return { results, extra };
}

export function evaluate(p, tests, stdout) {
  const { results } = parseResults(stdout);
  return tests.map((t, i) => {
    const r = results[i];
    const expected = p.design ? t.out : t.out;
    if (!r) return { i, status: 'missing', expected };
    if (r.err) return { i, status: 'error', expected, error: r.err, log: r.log, ms: r.ms };
    let got;
    try { got = JSON.parse(r.out); } catch { got = r.out; }
    if (got === null && Array.isArray(expected) && p.fn) {
      const t = p.fn.out !== undefined ? p.fn.params[p.fn.out][0] : p.fn.ret;
      if (t === 'ListNode' || t === 'TreeNode') got = []; // an empty list/tree is null
    }
    const pass = deepEqual(normalize(got, p.cmp), normalize(expected, p.cmp));
    return { i, status: pass ? 'pass' : 'fail', expected, got, log: r.log, ms: r.ms };
  });
}

export function remapErrors(text, offset) {
  return (text || '').replace(/Main\.java:(\d+)/g, (m, n) => {
    const ln = Number(n) - offset;
    return ln > 0 ? `Line ${ln}` : m;
  });
}

// Turn a raw exception (with harness frames) into something about the user's code only.
export function cleanTrace(text, offset) {
  const lines = remapErrors(text, offset).split('\n');
  return lines.filter((l, i) => i === 0 || (/^\s*at /.test(l) && /Line \d+/.test(l))).join('\n');
}

export function formatArgs(p, t) {
  if (p.design) return t.ops.map((op, k) => `${op}(${(t.args[k] || []).map((x) => JSON.stringify(x)).join(', ')})`).join('\n');
  return p.fn.params.map(([ty, n], i) => {
    let v = t.in[i];
    if (ty === 'CycleList') return `head = ${JSON.stringify(v[0])}, pos = ${v[1]}`;
    if (v && v.$java) v = v.label || '(generated large input)';
    return `${n} = ${JSON.stringify(v)}`;
  }).join('\n');
}
