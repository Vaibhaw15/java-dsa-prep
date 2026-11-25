# Java DSA Prep

A LeetCode-style practice app for Java developer interviews: **150 hand-picked DSA problems**, a Java code editor that compiles and runs your code against real test cases, progressive hints, brute-force and optimized Java solutions with line-by-line explanations, and progress tracking that persists in your browser.

## Quick start

Requirements: **Node.js 18+** and **JDK 11+** (`java` and `javac` on your PATH — check with `javac -version`).

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). The Java runner is built into the dev server, so **Run** and **Submit** work immediately.

### Production build (single command afterwards)

```bash
npm run build
npm start          # serves the app + Java runner on http://localhost:5050
```

Use `PORT=8080 npm start` to change the port.

## What's inside

| Topic | Problems |
|---|---|
| Arrays | 20 |
| Strings | 15 |
| HashMap & HashSet | 10 |
| Two Pointers & Sliding Window | 15 |
| Searching & Sorting | 15 |
| Recursion & Backtracking | 10 |
| Linked List | 10 |
| Stack & Queue | 10 |
| Binary Trees & BST | 15 |
| Heap & Priority Queue | 5 |
| Greedy Algorithms | 5 |
| Dynamic Programming | 10 |
| Graphs (bonus) | 10 |
| **Total** | **150** (49 Easy · 85 Medium · 16 Hard) |

The requested topic breakdown adds up to 140, so a **Graphs** topic (BFS/DFS, topological sort, Union-Find, Dijkstra) was added to reach 150 — graphs are a staple of backend interviews and were otherwise missing.

Every problem has:

- Full problem statement, difficulty, examples, constraints and the method signature
- Starter code, sample tests (Run) and hidden edge-case tests (Submit)
- Hint 1 (small clue) → Hint 2 (approach) → Hint 3 (optimal idea), unlocked one at a time
- Brute-force and optimized Java solutions, each with time/space complexity
- Line-by-line explanation of the optimized code, a dry run, interview tips, common mistakes and the Java concepts used (collections, autoboxing pitfalls, comparators, etc.)

Solutions stay hidden until you choose to reveal them (with a nudge if you haven't run any code yet).

## Features

- **Dashboard** — totals, completed / pending / bookmarked, overall %, difficulty split, topic-wise progress, daily goal, streak, activity heatmap, problem of the day, weak topics, "continue where you left off".
- **Problems** — search by name or number, filter by topic, difficulty and status (solved / attempted / not started), bookmarks, random unsolved.
- **Workspace** — resizable split view, Java editor (CodeMirror) with syntax highlighting and auto-saved drafts per problem, Run (samples) and Submit (all tests), per-test input / expected / your output / stdout / exceptions, compile errors mapped to your line numbers, `Ctrl+Enter` to run and `Ctrl+Shift+Enter` to submit, personal notes per problem. A full Submit pass marks the problem completed automatically.
- **Progress** — 52-week practice calendar, last-14-days log, weak-topic analysis (unfinished problems, failed submissions, reliance on solutions), per-topic table.
- **Settings** — dark / light theme, editor font size, daily goal, code-runner selection, export / import / reset progress.
- Everything is saved in `localStorage`, so progress survives refreshes. Use Export in Settings to back it up or move it to another machine.

## How code is judged

`src/lib/harness.js` turns each problem's signature and test cases into a `Main.java` that constructs the inputs (arrays, lists, linked lists, trees, design-class operation sequences), calls your `Solution`, captures your `System.out` output per test and prints results as JSON. The app compares results in JavaScript, so answers that may be returned "in any order" are compared order-insensitively and doubles use a tolerance. `ListNode` and `TreeNode` are provided automatically (you can also paste your own definitions).

### Code runner options (Settings → Code runner)

0. **In the browser (free, default on hosted copies such as Vercel)** — a full OpenJDK compiled to WebAssembly ([CheerpJ](https://cheerpj.com), free for personal use) runs inside the tab. `javac` comes from `public/tools.jar`. Compiles at Java 8 language level (no `var`, `List.of`, `String.repeat`). The first run downloads the runtime.
1. **Local JDK** (default) — the bundled Node runner (`runner/javaRunner.js`) compiles with `javac` and runs with `java` in a temp folder with a 10-second limit. Nothing leaves your machine.
2. **Judge0** — any Judge0 CE instance (self-hosted, or RapidAPI with your key).
3. **Piston** — a self-hosted Piston instance.

Hints, solutions and progress tracking all work without a runner.

## Project structure

```
src/
  data/            150 problems, one file per topic (index.js wires them together)
  lib/harness.js   Java test-harness generator + result comparison
  lib/runner.js    Local / Judge0 / Piston clients
  lib/store.jsx    Progress state, persistence, stats (streaks, weak topics)
  pages/           Dashboard, Problems, Workspace, Progress, Settings
  components/      UI primitives, heatmap, solution panel
runner/            Node Java runner (Vite middleware + standalone server)
scripts/verify.mjs Compiles and runs every brute-force and optimized solution against all tests
```

## Verifying the content

```bash
npm run verify               # all 300 solutions (needs a JDK)
npm run verify -- dp         # one topic
npm run verify -- two-sum    # one problem
npm run check                # structure checks: counts, duplicates, required fields
```

All 150 brute-force and 150 optimized solutions pass every test case.

## Adding your own problem

Add an object to one of the files in `src/data/`. Minimal shape:

```js
{
  id: 'my-problem', title: 'My Problem', difficulty: 'Easy',
  desc: 'Markdown-ish text with `code` and **bold**.',
  ex: [['nums = [1,2]', '3', 'optional explanation']],
  cons: ['1 <= n <= 10^5'],
  fn: { name: 'solve', params: [['int[]', 'nums']], ret: 'int' },
  tests: [{ in: [[1, 2]], out: 3 }],
  hints: ['clue', 'approach', 'optimal'],
  brute: { idea, code, time, space }, optimal: { idea, code, time, space },
  lines: [['code fragment', 'explanation']], cx: '...', dry: ['step'],
  tips: [], mistakes: [], java: [],
}
```

Supported parameter types: `int long double boolean char String`, their arrays, `int[][] char[][] String[]`, `List<Integer> List<String> List<List<Integer>> List<List<String>>`, `ListNode ListNode[] TreeNode`, plus `CycleList` / `TreeRef` helpers. Options: `out` (index of an in-place parameter for void methods), `cmp: 'sorted' | 'deep'` (order-insensitive), `call` (custom expression), `design` (class with operation sequences) and `starter` (custom starter code). Run `npm run verify -- my-problem` to check it.
