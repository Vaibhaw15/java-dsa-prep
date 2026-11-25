import arrays1 from './arrays1.js';
import arrays2 from './arrays2.js';
import strings from './strings.js';
import hashing from './hashing.js';
import twopointers from './twopointers.js';
import searching from './searching.js';
import recursion from './recursion.js';
import linkedlist from './linkedlist.js';
import stackqueue from './stackqueue.js';
import trees from './trees.js';
import heap from './heap.js';
import greedy from './greedy.js';
import dp from './dp.js';
import graphs from './graphs.js';

export const topics = [
  { key: 'arrays', name: 'Arrays', problems: [...arrays1, ...arrays2] },
  { key: 'strings', name: 'Strings', problems: strings },
  { key: 'hashing', name: 'HashMap & HashSet', problems: hashing },
  { key: 'two-pointers', name: 'Two Pointers & Sliding Window', problems: twopointers },
  { key: 'searching-sorting', name: 'Searching & Sorting', problems: searching },
  { key: 'recursion', name: 'Recursion & Backtracking', problems: recursion },
  { key: 'linked-list', name: 'Linked List', problems: linkedlist },
  { key: 'stack-queue', name: 'Stack & Queue', problems: stackqueue },
  { key: 'trees', name: 'Binary Trees & BST', problems: trees },
  { key: 'heap', name: 'Heap & Priority Queue', problems: heap },
  { key: 'greedy', name: 'Greedy Algorithms', problems: greedy },
  { key: 'dp', name: 'Dynamic Programming', problems: dp },
  { key: 'graphs', name: 'Graphs (Bonus)', problems: graphs },
];

// Flat list with a global number for each problem, in study order.
export const allProblems = topics.flatMap((t) => t.problems.map((p) => ({ ...p, topic: t.key, topicName: t.name })))
  .map((p, i) => ({ ...p, num: i + 1 }));
export const problemById = Object.fromEntries(allProblems.map((p) => [p.id, p]));
export const topicByKey = Object.fromEntries(topics.map((t) => [t.key, t]));
