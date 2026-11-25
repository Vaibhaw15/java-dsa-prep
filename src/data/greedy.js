const J = String.raw;

export default [
  {
    id: 'assign-cookies',
    title: 'Assign Cookies',
    difficulty: 'Easy',
    desc: "You want to give your children some cookies, but each child gets at most one cookie. Child `i` has a greed factor `g[i]`: the minimum cookie size they will be content with. Cookie `j` has size `s[j]`. If `s[j] >= g[i]`, child `i` is content.\n\nMaximize the number of content children and return it.",
    ex: [
      ['g = [1,2,3], s = [1,1]', '1', 'Only the child with greed 1 can be satisfied.'],
      ['g = [1,2], s = [1,2,3]', '2', ''],
    ],
    cons: ['1 <= g.length <= 3 * 10^4', '0 <= s.length <= 3 * 10^4', '1 <= g[i], s[j] <= 2^31 - 1'],
    fn: { name: 'findContentChildren', params: [['int[]', 'g'], ['int[]', 's']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3], [1, 1]], out: 1 },
      { in: [[1, 2], [1, 2, 3]], out: 2 },
      { in: [[5], []], out: 0 },
      { in: [[10, 9, 8, 7], [5, 6, 7, 8]], out: 2 },
      { in: [[1, 1, 1], [3]], out: 1 },
    ],
    hints: [
      'Which child should get the smallest cookie that is still big enough?',
      'Sort both arrays.',
      'Two pointers: give the current smallest cookie to the least greedy unsatisfied child if it is big enough; otherwise discard that cookie.',
    ],
    brute: {
      idea: 'For each child (sorted), search for the smallest unused cookie that satisfies them.',
      code: J`import java.util.*;

class Solution {
    public int findContentChildren(int[] g, int[] s) {
        int[] gs = g.clone(), ss = s.clone();
        Arrays.sort(gs);
        Arrays.sort(ss);
        boolean[] used = new boolean[ss.length];
        int count = 0;
        for (int greed : gs) {
            for (int j = 0; j < ss.length; j++) {
                if (!used[j] && ss[j] >= greed) { used[j] = true; count++; break; }
            }
        }
        return count;
    }
}`,
      time: 'O(n · m)', space: 'O(m)',
    },
    optimal: {
      idea: 'Sort both, then greedily match with two pointers.',
      code: J`import java.util.*;

class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0, cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) {
                child++;
            }
            cookie++;
        }
        return child;
    }
}`,
      time: 'O(n log n + m log m)', space: 'O(1) extra (sort in place)',
    },
    lines: [
      ['Arrays.sort(g); Arrays.sort(s);', 'Process children and cookies from smallest to largest.'],
      ['if (s[cookie] >= g[child]) child++;', 'Smallest available cookie satisfies the least greedy child — use it.'],
      ['cookie++;', 'Either the cookie was used or it is too small for every remaining child.'],
      ['return child;', 'Number of satisfied children.'],
    ],
    cx: 'Sorting dominates; the matching is linear.',
    dry: ['g=[1,2,3], s=[1,1]', 'cookie 1 ≥ 1 → child1', 'cookie 1 < 2 → skip', 'done → 1'],
    tips: ['Explain the exchange argument: giving a larger cookie than necessary never helps.'],
    mistakes: ['Giving the biggest cookie to the least greedy child.'],
    java: ['Sorting the input in place is fine in interviews if you mention it; clone if the caller needs the original.'],
  },
  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    desc: "You are given an integer array `nums`. You are initially positioned at the first index, and each element represents your **maximum jump length** at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
    ex: [
      ['nums = [2,3,1,1,4]', 'true', 'Jump 1 step to index 1, then 3 steps to the last index.'],
      ['nums = [3,2,1,0,4]', 'false', 'You always arrive at index 3, whose jump length is 0.'],
    ],
    cons: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    fn: { name: 'canJump', params: [['int[]', 'nums']], ret: 'boolean' },
    tests: [
      { in: [[2, 3, 1, 1, 4]], out: true },
      { in: [[3, 2, 1, 0, 4]], out: false },
      { in: [[0]], out: true },
      { in: [[0, 1]], out: false },
      { in: [[1, 0, 1, 0]], out: false },
      { in: [[2, 0, 0]], out: true },
    ],
    hints: [
      'DP: reachable[i] = some earlier reachable j with j + nums[j] >= i. That is O(n^2).',
      'Do you really need to know every reachable index — or just how far you can get?',
      'Track maxReach. For each i: if i > maxReach return false; maxReach = max(maxReach, i + nums[i]).',
    ],
    brute: {
      idea: 'Dynamic programming over reachability.',
      code: J`class Solution {
    public boolean canJump(int[] nums) {
        int n = nums.length;
        boolean[] reach = new boolean[n];
        reach[0] = true;
        for (int i = 0; i < n; i++) {
            if (!reach[i]) continue;
            for (int j = i + 1; j <= Math.min(n - 1, i + nums[i]); j++) reach[j] = true;
        }
        return reach[n - 1];
    }
}`,
      time: 'O(n · maxJump)', space: 'O(n)',
    },
    optimal: {
      idea: 'Greedy: keep the farthest reachable index.',
      code: J`class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int maxReach = 0;', 'Farthest index reachable so far.'],
      ['if (i > maxReach) return false;', 'We cannot even stand on index i.'],
      ['maxReach = Math.max(maxReach, i + nums[i]);', 'Jumping from i may extend our reach.'],
      ['if (maxReach >= nums.length - 1) return true;', 'Early exit once the last index is reachable.'],
    ],
    cx: 'Single pass → O(n), O(1) space.',
    dry: ['[3,2,1,0,4]', 'i0 reach 3', 'i1 reach 3', 'i2 reach 3', 'i3 reach 3', 'i4 > 3 → false'],
    tips: ['Alternative greedy: scan from the right keeping the leftmost "good" index.'],
    mistakes: ['Forgetting the i > maxReach check (stepping over a gap).'],
    java: ['`Math.max` on ints is a cheap intrinsic — the whole solution is a single loop over a primitive `int[]`, so no boxing or collections are needed.', 'Returning early from inside a `for` loop (`return true` once maxReach covers the end) is idiomatic and saves work.'],
  },
  {
    id: 'jump-game-ii',
    title: 'Jump Game II',
    difficulty: 'Medium',
    desc: "You are given a 0-indexed array of integers `nums` of length `n`. You are initially at `nums[0]`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`.\n\nReturn the **minimum number of jumps** to reach `nums[n - 1]`. The test cases guarantee you can reach it.",
    ex: [
      ['nums = [2,3,1,1,4]', '2', 'Jump 1 step to index 1, then 3 steps to the last index.'],
      ['nums = [2,3,0,1,4]', '2', ''],
    ],
    cons: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000', 'It is guaranteed you can reach nums[n - 1]'],
    fn: { name: 'jump', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[2, 3, 1, 1, 4]], out: 2 },
      { in: [[2, 3, 0, 1, 4]], out: 2 },
      { in: [[0]], out: 0 },
      { in: [[1, 1, 1, 1]], out: 3 },
      { in: [[5, 1, 1, 1, 1, 1]], out: 1 },
      { in: [[1, 2, 1, 1, 1]], out: 3 },
    ],
    hints: [
      'Think of BFS levels: indices reachable with 1 jump, with 2 jumps, ...',
      'For the current "level" [start, end], the next level ends at the farthest index reachable from it.',
      'Greedy: iterate i up to n-2, tracking farthest; when i reaches the current end, jumps++ and end = farthest.',
    ],
    brute: {
      idea: 'DP: dp[i] = min jumps to reach i; relax every reachable j from each i.',
      code: J`import java.util.*;

class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 0; i < n; i++) {
            if (dp[i] == Integer.MAX_VALUE) continue;
            for (int j = i + 1; j <= Math.min(n - 1, i + nums[i]); j++) {
                dp[j] = Math.min(dp[j], dp[i] + 1);
            }
        }
        return dp[n - 1];
    }
}`,
      time: 'O(n · maxJump)', space: 'O(n)',
    },
    optimal: {
      idea: 'Greedy BFS over index ranges.',
      code: J`class Solution {
    public int jump(int[] nums) {
        int jumps = 0, currentEnd = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }
        return jumps;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['for (int i = 0; i < nums.length - 1; i++)', 'We never need to jump FROM the last index.'],
      ['farthest = Math.max(farthest, i + nums[i]);', 'Best reach from anywhere in the current level.'],
      ['if (i == currentEnd) { jumps++; currentEnd = farthest; }', 'Finished scanning the current level → take one more jump to the farthest point.'],
    ],
    cx: 'O(n) time, O(1) space.',
    dry: ['[2,3,1,1,4]', 'i0: far 2, i==end0 → jumps1, end2', 'i1: far 4', 'i2: far 4, i==end2 → jumps2, end4', 'i3 → loop ends → 2'],
    tips: ['Explain the BFS analogy — it makes the greedy obviously correct.'],
    mistakes: ['Looping to n - 1 inclusive adds an extra jump when the last level ends exactly at n - 1.'],
    java: ['A plain `for` loop that stops at `nums.length - 1` expresses the "never jump from the last index" rule directly.', 'Primitive `int` counters avoid any allocation; the algorithm is O(1) extra space in Java as well.'],
  },
  {
    id: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    desc: "There are `n` gas stations along a **circular** route, where the amount of gas at station `i` is `gas[i]`. Your car has an unlimited tank, and it costs `cost[i]` of gas to travel from station `i` to station `i + 1`. You begin with an empty tank at one of the stations.\n\nReturn the starting station's index if you can travel around the circuit once clockwise, otherwise return `-1`. If a solution exists, it is guaranteed to be unique.",
    ex: [
      ['gas = [1,2,3,4,5], cost = [3,4,5,1,2]', '3', 'Start at station 3 with 4 gas … you can complete the loop.'],
      ['gas = [2,3,4], cost = [3,4,3]', '-1', 'Total gas 9 < total cost 10.'],
    ],
    cons: ['1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4', 'The answer is unique if it exists'],
    fn: { name: 'canCompleteCircuit', params: [['int[]', 'gas'], ['int[]', 'cost']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], out: 3 },
      { in: [[2, 3, 4], [3, 4, 3]], out: -1 },
      { in: [[5], [4]], out: 0 },
      { in: [[3, 1, 1], [1, 2, 2]], out: 0 },
      { in: [[1, 2, 3, 4], [2, 2, 2, 2]], out: 1 },
    ],
    hints: [
      'If total gas < total cost, no start works. Otherwise a solution exists.',
      'Simulate from start s. If the tank goes negative at station i, can any station between s and i be a valid start?',
      'No! So restart from i + 1 with an empty tank. One pass with a running tank and a total balance.',
    ],
    brute: {
      idea: 'Try every start and simulate the full loop.',
      code: J`class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        for (int s = 0; s < n; s++) {
            int tank = 0, k = 0;
            for (; k < n; k++) {
                int i = (s + k) % n;
                tank += gas[i] - cost[i];
                if (tank < 0) break;
            }
            if (k == n) return s;
        }
        return -1;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'One pass: reset the start whenever the running tank goes negative; check total balance at the end.',
      code: J`class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['total += diff;', 'Overall surplus: if negative, the trip is impossible from anywhere.'],
      ['tank += diff;', 'Fuel left since the current candidate start.'],
      ['if (tank < 0) { start = i + 1; tank = 0; }', 'No station in [start, i] can work as a start; try i + 1.'],
      ['return total >= 0 ? start : -1;', 'A non-negative total guarantees the last candidate works.'],
    ],
    cx: 'Single pass → O(n), O(1) space.',
    dry: ['gas=[1,2,3,4,5], cost=[3,4,5,1,2] → diffs [-2,-2,-2,3,3]', 'i0 tank -2 → start1', 'i1 → start2', 'i2 → start3', 'i3 tank3, i4 tank6; total 0 ≥ 0 → 3'],
    tips: ['Be ready to prove both claims: total ≥ 0 ⇒ solution exists, and the skipping argument.'],
    mistakes: ['Returning start without checking total.'],
    java: ['Two running `int` sums in one pass; with gas/cost ≤ 10^4 and n ≤ 10^5, totals stay below 2^31 so `int` is safe (use `long` if limits grow).', 'The ternary `total >= 0 ? start : -1` keeps the final decision on one line.'],
  },
  {
    id: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    desc: "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the **minimum number of intervals you need to remove** to make the rest of the intervals non-overlapping.\n\nIntervals that only touch at a point (e.g. `[1,2]` and `[2,3]`) are non-overlapping.",
    ex: [
      ['intervals = [[1,2],[2,3],[3,4],[1,3]]', '1', 'Remove [1,3].'],
      ['intervals = [[1,2],[1,2],[1,2]]', '2', ''],
      ['intervals = [[1,2],[2,3]]', '0', ''],
    ],
    cons: ['1 <= intervals.length <= 10^5', '-5 * 10^4 <= start_i < end_i <= 5 * 10^4'],
    fn: { name: 'eraseOverlapIntervals', params: [['int[][]', 'intervals']], ret: 'int' },
    tests: [
      { in: [[[1, 2], [2, 3], [3, 4], [1, 3]]], out: 1 },
      { in: [[[1, 2], [1, 2], [1, 2]]], out: 2 },
      { in: [[[1, 2], [2, 3]]], out: 0 },
      { in: [[[1, 100], [11, 22], [1, 11], [2, 12]]], out: 2 },
      { in: [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]], out: 2 },
    ],
    hints: [
      'Equivalent: keep the MAXIMUM number of non-overlapping intervals.',
      'Activity selection: which interval should you keep first to leave the most room for others?',
      'Sort by END time. Keep an interval if its start >= last kept end; otherwise remove it (count++).',
    ],
    brute: {
      idea: 'DP after sorting by start: dp[i] = max non-overlapping set ending with interval i (O(n^2)).',
      code: J`import java.util.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        int[][] a = intervals.clone();
        Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
        int n = a.length, best = 0;
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (a[j][1] <= a[i][0]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            best = Math.max(best, dp[i]);
        }
        return n - best;
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Greedy by earliest end time (classic activity selection).',
      code: J`import java.util.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int removed = 0;
        int lastEnd = Integer.MIN_VALUE;
        for (int[] in : intervals) {
            if (in[0] >= lastEnd) {
                lastEnd = in[1];
            } else {
                removed++;
            }
        }
        return removed;
    }
}`,
      time: 'O(n log n)', space: 'O(log n) for sorting',
    },
    lines: [
      ['Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));', 'Sort by end: the interval finishing first leaves the most space.'],
      ['if (in[0] >= lastEnd) lastEnd = in[1];', 'No overlap with the last kept interval → keep it.'],
      ['else removed++;', 'Overlaps → remove it (it ends later than the kept one, so it is the worse choice).'],
    ],
    cx: 'Sorting O(n log n) + linear scan.',
    dry: ['sorted by end: [1,2],[2,3],[1,3],[3,4]', 'keep [1,2] (end2)', 'keep [2,3] (end3)', '[1,3] start1 < 3 → remove', 'keep [3,4] → 1 removed'],
    tips: ['Same greedy answers "maximum number of meetings in one room" and Minimum Arrows to Burst Balloons.'],
    mistakes: ['Sorting by start and greedily keeping — needs extra logic to choose the smaller end.'],
    java: ['Using Integer.compare in comparators avoids overflow with negative coordinates.'],
  },
];
