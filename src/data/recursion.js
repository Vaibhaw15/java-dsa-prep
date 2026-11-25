const J = String.raw;

const SUDOKU_IN = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
const SUDOKU_OUT = [
  ['5', '3', '4', '6', '7', '8', '9', '1', '2'],
  ['6', '7', '2', '1', '9', '5', '3', '4', '8'],
  ['1', '9', '8', '3', '4', '2', '5', '6', '7'],
  ['8', '5', '9', '7', '6', '1', '4', '2', '3'],
  ['4', '2', '6', '8', '5', '3', '7', '9', '1'],
  ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
  ['9', '6', '1', '5', '3', '7', '2', '8', '4'],
  ['2', '8', '7', '4', '1', '9', '6', '3', '5'],
  ['3', '4', '5', '2', '8', '6', '1', '7', '9'],
];
const grid = (rows) => rows.map((r) => r.split(''));
const SUDOKU2_IN = grid(['...75.649', '9.36.2...', '.7.....8.', '1..2....6', '36..45...', '.8...9.34', '.2..7.3..', '.3.526.1.', '7..3...5.']);
const SUDOKU2_OUT = grid(['812753649', '943682175', '675491283', '154237896', '369845721', '287169534', '521974368', '438526917', '796318452']);

const BOARD = [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];

export default [
  {
    id: 'pow-x-n',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    desc: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e. x^n). Do not use `Math.pow`.",
    ex: [
      ['x = 2.00000, n = 10', '1024.00000', ''],
      ['x = 2.10000, n = 3', '9.26100', ''],
      ['x = 2.00000, n = -2', '0.25000', '2^-2 = 1/2^2 = 1/4 = 0.25.'],
    ],
    cons: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31 - 1', 'Either x is not zero or n > 0', '-10^4 <= x^n <= 10^4'],
    fn: { name: 'myPow', params: [['double', 'x'], ['int', 'n']], ret: 'double' },
    tests: [
      { in: [2.0, 10], out: 1024.0 },
      { in: [2.1, 3], out: 9.261 },
      { in: [2.0, -2], out: 0.25 },
      { in: [1.0, -2147483648], out: 1.0 },
      { in: [0.5, 3], out: 0.125 },
      { in: [-2.0, 3], out: -8.0 },
    ],
    hints: [
      'Multiplying x by itself n times is O(n). Can you reuse partial results?',
      'x^n = (x^(n/2))^2 for even n, and x · (x^(n/2))^2 for odd n.',
      'Fast exponentiation: recurse on n/2, square the result. Handle negative n with 1/x and use long to negate Integer.MIN_VALUE safely.',
    ],
    brute: {
      idea: 'Multiply x |n| times; invert for negative n.',
      code: J`class Solution {
    public double myPow(double x, int n) {
        long N = n;
        if (x == 1.0) return 1.0;
        if (x == -1.0) return (N % 2 == 0) ? 1.0 : -1.0;
        if (N < 0) { x = 1 / x; N = -N; }
        double result = 1.0;
        for (long i = 0; i < N; i++) {
            result *= x;
        }
        return result;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Recursive fast power (exponentiation by squaring).',
      code: J`class Solution {
    public double myPow(double x, int n) {
        long N = n;
        if (N < 0) {
            x = 1 / x;
            N = -N;
        }
        return fastPow(x, N);
    }

    private double fastPow(double x, long n) {
        if (n == 0) return 1.0;
        double half = fastPow(x, n / 2);
        if (n % 2 == 0) return half * half;
        return half * half * x;
    }
}`,
      time: 'O(log n)', space: 'O(log n) recursion',
    },
    lines: [
      ['long N = n;', '-Integer.MIN_VALUE overflows int; widening to long first makes negation safe.'],
      ['if (N < 0) { x = 1 / x; N = -N; }', 'x^-n = (1/x)^n.'],
      ['if (n == 0) return 1.0;', 'Base case: anything^0 = 1.'],
      ['double half = fastPow(x, n / 2);', 'Compute the half power ONCE — calling it twice would make it O(n) again.'],
      ['return n % 2 == 0 ? half * half : half * half * x;', 'Even → square; odd → square and multiply by one extra x.'],
    ],
    cx: 'Each call halves n → O(log n) calls; recursion depth O(log n) (≈ 32). An iterative bit-by-bit version uses O(1) space.',
    dry: ['pow(2, 10) → half = pow(2,5)', 'pow(2,5) → half = pow(2,2) = 4 → 4·4·2 = 32', 'pow(2,10) = 32·32 = 1024'],
    tips: ['Explain recursion → iterative binary exponentiation (multiply when the current bit of n is 1).', 'Same idea appears in modular exponentiation and matrix exponentiation (Fibonacci in O(log n)).'],
    mistakes: ['n = -n overflows for Integer.MIN_VALUE.', 'Calling fastPow(x, n/2) twice → exponential blow-up back to O(n).'],
    java: ['Widening conversion int → long is implicit: `long N = n;`.', 'Double arithmetic is IEEE-754; compare with a tolerance in tests.'],
  },
  {
    id: 'subsets',
    title: 'Subsets (Power Set)',
    difficulty: 'Medium',
    desc: "Given an integer array `nums` of **unique** elements, return **all possible subsets** (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.",
    ex: [
      ['nums = [1,2,3]', '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', ''],
      ['nums = [0]', '[[],[0]]', ''],
    ],
    cons: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All numbers are unique'],
    fn: { name: 'subsets', params: [['int[]', 'nums']], ret: 'List<List<Integer>>' },
    cmp: 'deep',
    tests: [
      { in: [[1, 2, 3]], out: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
      { in: [[0]], out: [[], [0]] },
      { in: [[5, 9]], out: [[], [5], [9], [5, 9]] },
      { in: [[4, 1, 0]], out: [[], [4], [1], [0], [4, 1], [4, 0], [1, 0], [4, 1, 0]] },
    ],
    hints: [
      'For each element there are two choices: include it or not. How many subsets is that?',
      'Recursion: at index i, branch into "take nums[i]" and "skip nums[i]".',
      'Backtracking template: add a copy of the current path to the result, then for j from start to n-1: add nums[j], recurse(j + 1), remove last.',
    ],
    brute: {
      idea: 'Bitmask enumeration: each number from 0 to 2^n - 1 encodes one subset.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) subset.add(nums[i]);
            }
            res.add(subset);
        }
        return res;
    }
}`,
      time: 'O(n · 2^n)', space: 'O(n · 2^n) output',
    },
    optimal: {
      idea: 'Backtracking: every node of the recursion tree is a subset.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
      time: 'O(n · 2^n)', space: 'O(n) recursion + output',
    },
    lines: [
      ['res.add(new ArrayList<>(path));', 'Record a COPY of the current subset — path keeps changing afterwards.'],
      ['for (int i = start; i < nums.length; i++)', 'Only choose elements after the previous choice, so each subset is generated once (no [2,1] after [1,2]).'],
      ['path.add(nums[i]);', 'Choose.'],
      ['backtrack(nums, i + 1, path, res);', 'Explore subsets that contain nums[i].'],
      ['path.remove(path.size() - 1);', 'Un-choose (backtrack) so the next iteration starts clean.'],
    ],
    cx: '2^n subsets, each copied in O(n) → O(n · 2^n). Recursion depth n.',
    dry: ['[1,2,3]', '[] → [1] → [1,2] → [1,2,3]', 'back to [1] → [1,3]', 'back to [] → [2] → [2,3]', '[] → [3]'],
    tips: ['Subsets II (with duplicates): sort, then skip nums[i] == nums[i-1] when i > start.', 'Learn this template — Combination Sum, Permutations and Palindrome Partitioning are variations.'],
    mistakes: ['Adding `path` itself instead of a copy — all entries end up as the same (empty) list.', 'Using `path.remove(Integer.valueOf(x))` vs index — remove by index is O(1) at the end.'],
    java: ['`list.remove(int index)` vs `list.remove(Object o)`: with List<Integer>, `remove(path.size() - 1)` calls the index version.', '`1 << n` computes 2^n; `(mask & (1 << i)) != 0` tests bit i.'],
  },
  {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    desc: "Given an array `nums` of **distinct** integers, return all the possible **permutations**. You can return the answer in any order.",
    ex: [
      ['nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', ''],
      ['nums = [0,1]', '[[0,1],[1,0]]', ''],
      ['nums = [1]', '[[1]]', ''],
    ],
    cons: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All integers are unique'],
    fn: { name: 'permute', params: [['int[]', 'nums']], ret: 'List<List<Integer>>' },
    cmp: 'sorted',
    tests: [
      { in: [[1, 2, 3]], out: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { in: [[0, 1]], out: [[0, 1], [1, 0]] },
      { in: [[1]], out: [[1]] },
      { in: [[5, -1]], out: [[5, -1], [-1, 5]] },
    ],
    hints: [
      'Pick the first element (n choices), then permute the rest.',
      'Track which elements are already used in the current permutation.',
      'Backtracking with boolean[] used: when path.size() == n, add a copy. Otherwise try every unused element.',
    ],
    brute: {
      idea: 'Build permutations iteratively: insert each new number into every position of every existing permutation.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        res.add(new ArrayList<>());
        for (int x : nums) {
            List<List<Integer>> next = new ArrayList<>();
            for (List<Integer> p : res) {
                for (int pos = 0; pos <= p.size(); pos++) {
                    List<Integer> q = new ArrayList<>(p);
                    q.add(pos, x);
                    next.add(q);
                }
            }
            res = next;
        }
        return res;
    }
}`,
      time: 'O(n · n!)', space: 'O(n · n!)',
    },
    optimal: {
      idea: 'Backtracking with a used[] array.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, res);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`,
      time: 'O(n · n!)', space: 'O(n) recursion + output',
    },
    lines: [
      ['if (path.size() == nums.length)', 'A complete permutation — store a copy.'],
      ['if (used[i]) continue;', 'Each element appears once per permutation.'],
      ['used[i] = true; path.add(nums[i]);', 'Choose element i for the next position.'],
      ['path.remove(...); used[i] = false;', 'Undo the choice so other branches can use element i.'],
    ],
    cx: 'n! permutations, each copied in O(n) → O(n · n!). Recursion depth n plus used[] → O(n) auxiliary.',
    dry: ['[1,2,3]', 'choose 1 → choose 2 → choose 3 → [1,2,3]', 'back → choose 3 → 2 → [1,3,2]', 'then start with 2, then 3…'],
    tips: ['Permutations II (duplicates): sort and skip nums[i] == nums[i-1] when !used[i-1].', 'Swap-based approach avoids the used[] array.'],
    mistakes: ['Forgetting to reset used[i] = false.'],
    java: ['`list.add(index, element)` inserts and shifts — O(n) on ArrayList.'],
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    desc: "Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of candidates where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe **same number may be chosen an unlimited number of times**. Two combinations are unique if the frequency of at least one chosen number is different.",
    ex: [
      ['candidates = [2,3,6,7], target = 7', '[[2,2,3],[7]]', '2 + 2 + 3 = 7 and 7 = 7.'],
      ['candidates = [2,3,5], target = 8', '[[2,2,2,2],[2,3,3],[3,5]]', ''],
      ['candidates = [2], target = 1', '[]', ''],
    ],
    cons: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements are distinct', '1 <= target <= 40'],
    fn: { name: 'combinationSum', params: [['int[]', 'candidates'], ['int', 'target']], ret: 'List<List<Integer>>' },
    cmp: 'deep',
    tests: [
      { in: [[2, 3, 6, 7], 7], out: [[2, 2, 3], [7]] },
      { in: [[2, 3, 5], 8], out: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { in: [[2], 1], out: [] },
      { in: [[1], 2], out: [[1, 1]] },
      { in: [[7, 3, 2], 18], out: [[2, 2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 3, 3], [2, 2, 2, 2, 3, 7], [2, 2, 2, 3, 3, 3, 3], [2, 2, 7, 7], [2, 3, 3, 3, 7], [3, 3, 3, 3, 3, 3]] },
    ],
    hints: [
      'At each step choose a candidate and subtract it from the remaining target.',
      'To avoid duplicates like [2,3,2] and [2,2,3], only allow choosing candidates at index >= the last chosen index.',
      'backtrack(start, remaining): if remaining == 0 record; for i from start: if candidates[i] <= remaining, add it and recurse with i (not i + 1, since reuse is allowed). Sorting enables early break.',
    ],
    brute: {
      idea: 'Include/exclude recursion on each candidate (take it again, or move to the next).',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        solve(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void solve(int[] c, int i, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        if (i == c.length || remain < 0) return;
        path.add(c[i]);
        solve(c, i, remain - c[i], path, res);
        path.remove(path.size() - 1);
        solve(c, i + 1, remain, path, res);
    }
}`,
      time: 'O(2^(target/min))', space: 'O(target/min)',
    },
    optimal: {
      idea: 'Sorted candidates + backtracking with a start index and early termination.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < c.length; i++) {
            if (c[i] > remain) break;
            path.add(c[i]);
            backtrack(c, i, remain - c[i], path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
      time: 'O(N^(T/M + 1)) worst case', space: 'O(T/M) recursion',
    },
    lines: [
      ['Arrays.sort(candidates);', 'Sorting lets us stop the loop as soon as a candidate is too big.'],
      ['if (remain == 0) { res.add(new ArrayList<>(path)); return; }', 'Exact sum reached.'],
      ['for (int i = start; i < c.length; i++)', 'Non-decreasing index order prevents permutations of the same combination.'],
      ['if (c[i] > remain) break;', 'Pruning: all later candidates are even larger.'],
      ['backtrack(c, i, remain - c[i], path, res);', 'Pass i (not i + 1) — the same number can be reused.'],
    ],
    cx: 'With N candidates, target T and minimum value M, the recursion tree has depth ≤ T/M and branching ≤ N → exponential bound O(N^(T/M+1)). Pruning makes it fast in practice.',
    dry: ['[2,3,6,7], t=7', '2 → 2 → 2 → (remain 1, 2 > 1 break)', '2 → 2 → 3 → remain 0 ✓ [2,2,3]', '2 → 3 → (remain 2, 3 > 2 break) …', '7 → ✓ [7]'],
    tips: ['Combination Sum II (each number once, duplicates in input): recurse with i + 1 and skip equal neighbours.', 'Combination Sum IV counts ORDERED ways — that one is DP.'],
    mistakes: ['Recursing with i + 1 (forbids reuse).', 'Starting the loop at 0 (generates duplicates in different orders).'],
    java: ['Passing the same `path` list down the recursion avoids copying except at the leaves.'],
  },
  {
    id: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    desc: "Given `n` pairs of parentheses, write a function to generate **all combinations of well-formed parentheses**. Return them in any order.",
    ex: [
      ['n = 3', '["((()))","(()())","(())()","()(())","()()()"]', ''],
      ['n = 1', '["()"]', ''],
    ],
    cons: ['1 <= n <= 8'],
    fn: { name: 'generateParenthesis', params: [['int', 'n']], ret: 'List<String>' },
    cmp: 'sorted',
    tests: [
      { in: [3], out: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { in: [1], out: ['()'] },
      { in: [2], out: ['(())', '()()'] },
      { in: [4], out: ['(((())))', '((()()))', '((())())', '((()))()', '(()(()))', '(()()())', '(()())()', '(())(())', '(())()()', '()((()))', '()(()())', '()(())()', '()()(())', '()()()()'] },
    ],
    hints: [
      'Generating all 2^(2n) strings and filtering valid ones works but is wasteful.',
      'Build the string left to right. When can you add "("? When can you add ")"?',
      'Add "(" if open < n. Add ")" if close < open. When length == 2n, record the string.',
    ],
    brute: {
      idea: 'Generate every sequence of 2n parentheses and keep the valid ones.',
      code: J`import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        gen(new char[2 * n], 0, res);
        return res;
    }

    private void gen(char[] cur, int pos, List<String> res) {
        if (pos == cur.length) {
            if (valid(cur)) res.add(new String(cur));
            return;
        }
        cur[pos] = '('; gen(cur, pos + 1, res);
        cur[pos] = ')'; gen(cur, pos + 1, res);
    }

    private boolean valid(char[] cur) {
        int bal = 0;
        for (char c : cur) {
            bal += c == '(' ? 1 : -1;
            if (bal < 0) return false;
        }
        return bal == 0;
    }
}`,
      time: 'O(2^(2n) · n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Backtracking that only ever builds valid prefixes.',
      code: J`import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(new StringBuilder(), 0, 0, n, res);
        return res;
    }

    private void backtrack(StringBuilder sb, int open, int close, int n, List<String> res) {
        if (sb.length() == 2 * n) {
            res.add(sb.toString());
            return;
        }
        if (open < n) {
            sb.append('(');
            backtrack(sb, open + 1, close, n, res);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(sb, open, close + 1, n, res);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
      time: 'O(4^n / √n) (Catalan number)', space: 'O(n) recursion',
    },
    lines: [
      ['if (sb.length() == 2 * n)', 'All n pairs placed — the prefix rules guarantee it is valid.'],
      ['if (open < n)', 'We may open another bracket as long as we have not used all n.'],
      ['if (close < open)', 'We may close only if there is an unmatched open bracket.'],
      ['sb.deleteCharAt(sb.length() - 1);', 'Backtrack by removing the last character.'],
    ],
    cx: 'The number of valid strings is the n-th Catalan number ≈ 4^n / (n^1.5 √π); each takes O(n) to build → O(4^n / √n).',
    dry: ['n=2', '( → (( → (() → (()) ✓', '( → () → ()( → ()() ✓'],
    tips: ['Mention Catalan numbers — they also count BST shapes and valid stack sequences.'],
    mistakes: ['Allowing ")" when close == open produces invalid prefixes.'],
    java: ['Reusing one StringBuilder with append/deleteCharAt avoids creating many intermediate Strings.'],
  },
  {
    id: 'letter-combinations-phone',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    desc: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent (like old phone keypads). Return the answer in any order.\n\nMapping: 2 → abc, 3 → def, 4 → ghi, 5 → jkl, 6 → mno, 7 → pqrs, 8 → tuv, 9 → wxyz. An empty input returns an empty list.",
    ex: [
      ['digits = "23"', '["ad","ae","af","bd","be","bf","cd","ce","cf"]', ''],
      ['digits = ""', '[]', ''],
      ['digits = "2"', '["a","b","c"]', ''],
    ],
    cons: ['0 <= digits.length <= 4', "digits[i] is a digit in the range ['2', '9']"],
    fn: { name: 'letterCombinations', params: [['String', 'digits']], ret: 'List<String>' },
    cmp: 'sorted',
    tests: [
      { in: ['23'], out: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { in: [''], out: [] },
      { in: ['2'], out: ['a', 'b', 'c'] },
      { in: ['79'], out: ['pw', 'px', 'py', 'pz', 'qw', 'qx', 'qy', 'qz', 'rw', 'rx', 'ry', 'rz', 'sw', 'sx', 'sy', 'sz'] },
    ],
    hints: [
      'Each digit contributes one letter. How many combinations are there for k digits?',
      'Process digits one at a time; for each partial string, append each letter of the current digit.',
      'Backtracking: index i, current StringBuilder. If i == digits.length(), record. Else for each letter in map[digit]: append, recurse(i + 1), delete.',
    ],
    brute: {
      idea: 'Iterative BFS: start with [""] and expand by each digit\'s letters.',
      code: J`import java.util.*;

class Solution {
    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        String[] map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        List<String> res = new ArrayList<>(List.of(""));
        for (char d : digits.toCharArray()) {
            List<String> next = new ArrayList<>();
            for (String prefix : res) {
                for (char c : map[d - '0'].toCharArray()) next.add(prefix + c);
            }
            res = next;
        }
        return res;
    }
}`,
      time: 'O(4^k · k)', space: 'O(4^k · k)',
    },
    optimal: {
      idea: 'DFS backtracking with a shared StringBuilder.',
      code: J`import java.util.*;

class Solution {
    private static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        backtrack(digits, 0, new StringBuilder(), res);
        return res;
    }

    private void backtrack(String digits, int i, StringBuilder sb, List<String> res) {
        if (i == digits.length()) {
            res.add(sb.toString());
            return;
        }
        for (char c : MAP[digits.charAt(i) - '0'].toCharArray()) {
            sb.append(c);
            backtrack(digits, i + 1, sb, res);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
      time: 'O(4^k · k)', space: 'O(k) recursion',
    },
    lines: [
      ['private static final String[] MAP', 'Constant lookup table indexed by digit; static final = one shared immutable reference.'],
      ['if (digits.isEmpty()) return res;', 'Special case: no digits → no combinations (not [""]).'],
      ['if (i == digits.length())', 'One letter chosen per digit → record.'],
      ["MAP[digits.charAt(i) - '0']", "Convert the char digit to an int index ('7' - '0' = 7)."],
    ],
    cx: 'Up to 4 letters per digit → at most 4^k combinations of length k → O(4^k · k). Recursion depth k.',
    dry: ['"23"', 'a → ad, ae, af', 'b → bd, be, bf', 'c → cd, ce, cf'],
    tips: ['Classic "Cartesian product" backtracking — mention both DFS and BFS styles.'],
    mistakes: ['Returning [""] for empty input.'],
    java: ['`static final` arrays are initialised once per class, not per call.'],
  },
  {
    id: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    desc: "The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other (no two share a row, column, or diagonal).\n\nGiven an integer `n`, return all distinct solutions. Each solution is a board configuration where `'Q'` is a queen and `'.'` an empty square. Return them in any order.",
    ex: [
      ['n = 4', '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', 'There are two distinct solutions to the 4-queens puzzle.'],
      ['n = 1', '[["Q"]]', ''],
    ],
    cons: ['1 <= n <= 9'],
    fn: { name: 'solveNQueens', params: [['int', 'n']], ret: 'List<List<String>>' },
    cmp: 'sorted',
    tests: [
      { in: [4], out: [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']] },
      { in: [1], out: [['Q']] },
      { in: [2], out: [] },
      { in: [3], out: [] },
    ],
    hints: [
      'Exactly one queen per row. Place row by row.',
      'For each row, try every column that is not attacked by queens in previous rows.',
      'Track used columns, "\\" diagonals (row - col constant) and "/" diagonals (row + col constant) in boolean arrays for O(1) checks.',
    ],
    brute: {
      idea: 'Backtracking row by row, checking safety by scanning previous rows.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        int[] queens = new int[n];
        place(0, n, queens, res);
        return res;
    }

    private void place(int row, int n, int[] q, List<List<String>> res) {
        if (row == n) { res.add(build(q, n)); return; }
        for (int col = 0; col < n; col++) {
            boolean ok = true;
            for (int r = 0; r < row; r++) {
                if (q[r] == col || Math.abs(q[r] - col) == row - r) { ok = false; break; }
            }
            if (ok) { q[row] = col; place(row + 1, n, q, res); }
        }
    }

    private List<String> build(int[] q, int n) {
        List<String> board = new ArrayList<>();
        for (int r = 0; r < n; r++) {
            char[] line = new char[n];
            Arrays.fill(line, '.');
            line[q[r]] = 'Q';
            board.add(new String(line));
        }
        return board;
    }
}`,
      time: 'O(n! · n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Backtracking with O(1) conflict checks using column and diagonal boolean arrays.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        boolean[] cols = new boolean[n];
        boolean[] diag = new boolean[2 * n];
        boolean[] anti = new boolean[2 * n];
        solve(0, n, board, cols, diag, anti, res);
        return res;
    }

    private void solve(int r, int n, char[][] board, boolean[] cols, boolean[] diag, boolean[] anti, List<List<String>> res) {
        if (r == n) {
            List<String> snapshot = new ArrayList<>();
            for (char[] row : board) snapshot.add(new String(row));
            res.add(snapshot);
            return;
        }
        for (int c = 0; c < n; c++) {
            int d = r - c + n, a = r + c;
            if (cols[c] || diag[d] || anti[a]) continue;
            board[r][c] = 'Q';
            cols[c] = diag[d] = anti[a] = true;
            solve(r + 1, n, board, cols, diag, anti, res);
            board[r][c] = '.';
            cols[c] = diag[d] = anti[a] = false;
        }
    }
}`,
      time: 'O(n!)', space: 'O(n^2) board',
    },
    lines: [
      ['boolean[] diag = new boolean[2 * n];', 'Cells on the same "\\" diagonal share r - c; we add n to keep the index non-negative.'],
      ['boolean[] anti = new boolean[2 * n];', 'Cells on the same "/" diagonal share r + c.'],
      ['if (cols[c] || diag[d] || anti[a]) continue;', 'O(1) attack check.'],
      ['cols[c] = diag[d] = anti[a] = true;', 'Chained assignment marks all three as occupied.'],
      ["board[r][c] = '.'; ... = false;", 'Undo the placement when backtracking.'],
      ['snapshot.add(new String(row));', 'Copy the board — it will be modified later.'],
    ],
    cx: 'Row r has at most n - r safe columns → roughly O(n!) placements; building each solution is O(n^2).',
    dry: ['n=4', 'r0: c0 → r1: c2 → r2: no safe column → back', 'r1: c3 → r2: c1 → r3: no safe → back …', 'r0: c1 → r1: c3 → r2: c0 → r3: c2 ✓ [".Q..","...Q","Q...","..Q."]'],
    tips: ['N-Queens II asks only for the count — same code, increment a counter.', 'Bitmask version is the fastest: available = ~(cols | diag | anti) & ((1 << n) - 1).'],
    mistakes: ['Wrong diagonal index (negative r - c).', 'Forgetting to undo the diagonal marks.'],
    java: ['`new String(char[])` copies the characters into an immutable String.', 'Chained assignment `a = b = c = true` assigns right to left.'],
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    desc: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of **sequentially adjacent cells** (horizontally or vertically neighbouring). The same cell may not be used more than once.",
    ex: [
      ['board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', 'true', ''],
      ['same board, word = "SEE"', 'true', ''],
      ['same board, word = "ABCB"', 'false', 'B cannot be reused.'],
    ],
    cons: ['1 <= m, n <= 6', '1 <= word.length <= 15', 'Only English letters'],
    fn: { name: 'exist', params: [['char[][]', 'board'], ['String', 'word']], ret: 'boolean' },
    tests: [
      { in: [BOARD, 'ABCCED'], out: true },
      { in: [BOARD, 'SEE'], out: true },
      { in: [BOARD, 'ABCB'], out: false },
      { in: [[['a']], 'a'], out: true },
      { in: [[['a', 'b'], ['c', 'd']], 'acdb'], out: true },
      { in: [[['a', 'a']], 'aaa'], out: false },
    ],
    hints: [
      'Start a search from every cell that matches word[0].',
      'DFS to the 4 neighbours looking for the next character; mark cells as visited on the current path.',
      'Mark visited by temporarily changing board[r][c] (e.g. to \'#\') and restore it after exploring — no extra visited array.',
    ],
    brute: {
      idea: 'DFS from every cell with a separate visited matrix.',
      code: J`class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfs(board, word, 0, r, c, new boolean[m][n])) return true;
        return false;
    }

    private boolean dfs(char[][] b, String w, int k, int r, int c, boolean[][] seen) {
        if (k == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || seen[r][c] || b[r][c] != w.charAt(k)) return false;
        seen[r][c] = true;
        boolean found = dfs(b, w, k + 1, r + 1, c, seen) || dfs(b, w, k + 1, r - 1, c, seen)
                || dfs(b, w, k + 1, r, c + 1, seen) || dfs(b, w, k + 1, r, c - 1, seen);
        seen[r][c] = false;
        return found;
    }
}`,
      time: 'O(m·n · 4^L)', space: 'O(m·n) per start',
    },
    optimal: {
      idea: 'Backtracking DFS that marks the path in-place.',
      code: J`class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, word, 0, r, c)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int k, int r, int c) {
        if (k == word.length()) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(k)) return false;
        char saved = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, k + 1, r + 1, c)
                || dfs(board, word, k + 1, r - 1, c)
                || dfs(board, word, k + 1, r, c + 1)
                || dfs(board, word, k + 1, r, c - 1);
        board[r][c] = saved;
        return found;
    }
}`,
      time: 'O(m·n · 3^L)', space: 'O(L) recursion',
    },
    lines: [
      ['if (k == word.length()) return true;', 'All characters matched.'],
      ['if (r < 0 || ... ) return false;', 'Out of bounds.'],
      ['if (board[r][c] != word.charAt(k)) return false;', 'Wrong letter (also rejects visited cells, which are \'#\').'],
      ["board[r][c] = '#';", 'Mark as used on the current path.'],
      ['dfs(...) || dfs(...) || ...', 'Short-circuit OR stops as soon as one direction succeeds.'],
      ['board[r][c] = saved;', 'Restore for other paths (backtracking).'],
    ],
    cx: 'Each start cell launches a DFS of depth L; after the first step each cell has at most 3 unvisited neighbours → O(m·n·3^L). Recursion depth L.',
    dry: ['"SEE": start at (1,3) S', '→ (2,3) E', '→ (2,2) E → k == 3 ✓'],
    tips: ['Pruning ideas: check board letter counts vs word counts first; start from the rarer end of the word.', 'Word Search II (many words) → Trie + DFS.'],
    mistakes: ['Not restoring the cell → later searches fail.', 'Allocating a new visited array per start in a hot loop.'],
    java: ['`||` short-circuits: later DFS calls are skipped once one returns true.'],
  },
  {
    id: 'palindrome-partitioning',
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    desc: "Given a string `s`, partition `s` such that **every substring** of the partition is a **palindrome**. Return all possible palindrome partitionings of `s` (in any order).",
    ex: [
      ['s = "aab"', '[["a","a","b"],["aa","b"]]', ''],
      ['s = "a"', '[["a"]]', ''],
    ],
    cons: ['1 <= s.length <= 16', 's contains only lowercase English letters'],
    fn: { name: 'partition', params: [['String', 's']], ret: 'List<List<String>>' },
    cmp: 'sorted',
    tests: [
      { in: ['aab'], out: [['a', 'a', 'b'], ['aa', 'b']] },
      { in: ['a'], out: [['a']] },
      { in: ['abba'], out: [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']] },
      { in: ['efe'], out: [['e', 'f', 'e'], ['efe']] },
      { in: ['ab'], out: [['a', 'b']] },
    ],
    hints: [
      'Choose the first piece: it must be a palindrome prefix. Then partition the rest.',
      'Backtracking over the end index of the next piece.',
      'Speed-up: precompute isPal[i][j] with DP (s[i]==s[j] && isPal[i+1][j-1]) so each check is O(1).',
    ],
    brute: {
      idea: 'Backtracking with a palindrome check done on the fly.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        dfs(s, 0, new ArrayList<>(), res);
        return res;
    }

    private void dfs(String s, int start, List<String> path, List<List<String>> res) {
        if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPal(s, start, end)) {
                path.add(s.substring(start, end + 1));
                dfs(s, end + 1, path, res);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isPal(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}`,
      time: 'O(n · 2^n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Precompute a palindrome table, then backtrack.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
            }
        }
        List<List<String>> res = new ArrayList<>();
        backtrack(s, 0, pal, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(String s, int start, boolean[][] pal, List<String> path, List<List<String>> res) {
        if (start == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!pal[start][end]) continue;
            path.add(s.substring(start, end + 1));
            backtrack(s, end + 1, pal, path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
      time: 'O(n · 2^n)', space: 'O(n^2) table',
    },
    lines: [
      ['for (int i = n - 1; i >= 0; i--)', 'Fill bottom-up so pal[i+1][j-1] is ready when needed.'],
      ['pal[i][j] = s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1]);', 'Ends match and the inside is a palindrome (or there is no inside).'],
      ['if (start == s.length())', 'Whole string partitioned → record.'],
      ['if (!pal[start][end]) continue;', 'O(1) check whether s[start..end] is a palindrome.'],
    ],
    cx: 'There can be 2^(n-1) partitions (e.g. "aaaa…"), each copied in O(n) → O(n · 2^n). Table O(n^2).',
    dry: ['"aab"', 'a | a | b ✓', 'a | ab ✗', 'aa | b ✓', 'aab ✗'],
    tips: ['Palindrome Partitioning II (min cuts) is a DP problem using the same table.'],
    mistakes: ['Wrong DP fill order (top-down i loop reads an unfilled cell).'],
    java: ['`substring` creates a new String each time; fine for n ≤ 16.'],
  },
  {
    id: 'sudoku-solver',
    title: 'Sudoku Solver',
    difficulty: 'Hard',
    desc: "Write a program to solve a Sudoku puzzle by filling the empty cells (`'.'`). Each of the digits `1-9` must occur exactly once in each row, each column, and each of the nine 3x3 sub-boxes.\n\nModify `board` in-place. The input has exactly one solution.",
    ex: [
      ['board = (the classic puzzle shown in the sample test)', '(the solved board)', 'Fill each "." so every row, column and 3x3 box contains 1-9.'],
    ],
    cons: ['board.length == 9, board[i].length == 9', "board[i][j] is a digit or '.'", 'Exactly one solution exists'],
    fn: { name: 'solveSudoku', params: [['char[][]', 'board']], ret: 'void', out: 0 },
    sample: 1,
    tests: [
      { in: [SUDOKU_IN], out: SUDOKU_OUT },
      { in: [SUDOKU2_IN], out: SUDOKU2_OUT },
    ],
    hints: [
      'Fill empty cells one at a time; try digits 1–9 that do not break the rules.',
      'If no digit fits, backtrack to the previous cell and try its next digit.',
      'Keep boolean[9][10] arrays for rows, columns and boxes so validity checks are O(1). Box index = (r / 3) * 3 + c / 3.',
    ],
    brute: {
      idea: 'Backtracking that checks validity by scanning the row, column and box each time.',
      code: J`class Solution {
    public void solveSudoku(char[][] board) {
        solve(board);
    }

    private boolean solve(char[][] b) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (b[r][c] != '.') continue;
                for (char d = '1'; d <= '9'; d++) {
                    if (valid(b, r, c, d)) {
                        b[r][c] = d;
                        if (solve(b)) return true;
                        b[r][c] = '.';
                    }
                }
                return false;
            }
        }
        return true;
    }

    private boolean valid(char[][] b, int r, int c, char d) {
        for (int i = 0; i < 9; i++) {
            if (b[r][i] == d || b[i][c] == d) return false;
            if (b[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == d) return false;
        }
        return true;
    }
}`,
      time: 'O(9^E · 27), E = empty cells', space: 'O(E) recursion',
    },
    optimal: {
      idea: 'Backtracking over the list of empty cells with O(1) row/column/box occupancy tables.',
      code: J`import java.util.*;

class Solution {
    private final boolean[][] row = new boolean[9][10];
    private final boolean[][] col = new boolean[9][10];
    private final boolean[][] box = new boolean[9][10];
    private final List<int[]> empty = new ArrayList<>();

    public void solveSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    empty.add(new int[]{r, c});
                } else {
                    int d = board[r][c] - '0';
                    row[r][d] = col[c][d] = box[(r / 3) * 3 + c / 3][d] = true;
                }
            }
        }
        solve(board, 0);
    }

    private boolean solve(char[][] board, int idx) {
        if (idx == empty.size()) return true;
        int r = empty.get(idx)[0], c = empty.get(idx)[1], b = (r / 3) * 3 + c / 3;
        for (int d = 1; d <= 9; d++) {
            if (row[r][d] || col[c][d] || box[b][d]) continue;
            board[r][c] = (char) ('0' + d);
            row[r][d] = col[c][d] = box[b][d] = true;
            if (solve(board, idx + 1)) return true;
            row[r][d] = col[c][d] = box[b][d] = false;
        }
        board[r][c] = '.';
        return false;
    }
}`,
      time: 'O(9^E) worst case, much faster in practice', space: 'O(E)',
    },
    lines: [
      ['boolean[][] row = new boolean[9][10];', 'row[r][d] is true if digit d already appears in row r (index 0 unused).'],
      ['box[(r / 3) * 3 + c / 3]', 'Maps a cell to its 3x3 box number 0..8.'],
      ['empty.add(new int[]{r, c});', 'Pre-collect empty cells so the recursion does not rescan the board.'],
      ['if (row[r][d] || col[c][d] || box[b][d]) continue;', 'O(1) validity check.'],
      ["board[r][c] = (char) ('0' + d);", 'Convert digit to char.'],
      ['if (solve(board, idx + 1)) return true;', 'Stop the moment a full solution is found — the board keeps it.'],
      ['row[r][d] = col[c][d] = box[b][d] = false;', 'Undo the mark and try the next digit.'],
    ],
    cx: 'Exponential in the worst case (9 options per empty cell), but constraint tables prune heavily; typical puzzles solve in milliseconds. Choosing the cell with the fewest candidates first (MRV heuristic) speeds it up dramatically.',
    dry: ['First empty cell (0,2): row 0 has 5,3,7; col 2 has 8; box 0 has 5,3,6,9,8 → candidates 1,2,4', 'Try 1 → recurse… eventually contradiction → backtrack', 'Try 4 → leads to the full solution'],
    tips: ['Mention the MRV heuristic and bitmasks as optimisations.', 'Valid Sudoku (check only) is the easier warm-up version.'],
    mistakes: ['Forgetting to reset the cell to \'.\' when all digits fail.', 'Wrong box index formula.'],
    java: ['Instance fields keep the helper signatures short; they reset automatically because a new Solution is created per test.', '`(char) (\'0\' + d)` — the addition produces an int, so the cast is required.'],
  },
];
