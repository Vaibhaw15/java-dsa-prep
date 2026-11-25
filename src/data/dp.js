const J = String.raw;

export default [
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    desc: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb either `1` or `2` steps. In how many **distinct ways** can you climb to the top?",
    ex: [
      ['n = 2', '2', '1+1 or 2.'],
      ['n = 3', '3', '1+1+1, 1+2, 2+1.'],
    ],
    cons: ['1 <= n <= 45'],
    fn: { name: 'climbStairs', params: [['int', 'n']], ret: 'int' },
    tests: [
      { in: [2], out: 2 },
      { in: [3], out: 3 },
      { in: [1], out: 1 },
      { in: [5], out: 8 },
      { in: [30], out: 1346269 },
    ],
    hints: [
      'How can you arrive at step n? From which steps?',
      'ways(n) = ways(n - 1) + ways(n - 2) — that is Fibonacci.',
      'Plain recursion recomputes subproblems exponentially. Iterate bottom-up keeping only the last two values.',
    ],
    brute: {
      idea: 'Direct recursion on the recurrence (exponential because of overlapping subproblems).',
      code: J`class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
}`,
      time: 'O(2^n)', space: 'O(n) recursion',
    },
    optimal: {
      idea: 'Bottom-up DP with two rolling variables.',
      code: J`class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['if (n <= 2) return n;', 'Base cases: 1 way for 1 step, 2 ways for 2 steps.'],
      ['int prev2 = 1, prev1 = 2;', 'ways(1) and ways(2).'],
      ['int cur = prev1 + prev2;', 'Last move was a 1-step (from i-1) or a 2-step (from i-2).'],
      ['prev2 = prev1; prev1 = cur;', 'Slide the window forward.'],
    ],
    cx: 'O(n) time; only two variables → O(1). Memoised recursion would be O(n) time and O(n) space.',
    dry: ['n=5: ways 1,2,3,5,8 → 8'],
    tips: ['Walk the interviewer through recursion → memoisation → tabulation → space optimisation. That progression is the core DP skill.', 'Follow-up: steps of 1, 2 or 3 → add prev3.'],
    mistakes: ['Returning the wrong base case for n = 1.'],
    java: ['int is enough for n ≤ 45 (ways(45) = 1,836,311,903 < 2^31 - 1).'],
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    desc: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money `nums[i]`. **Adjacent houses have connected security systems** — robbing two adjacent houses on the same night alerts the police.\n\nReturn the maximum amount of money you can rob tonight without alerting the police.",
    ex: [
      ['nums = [1,2,3,1]', '4', 'Rob house 0 (1) and house 2 (3).'],
      ['nums = [2,7,9,3,1]', '12', 'Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.'],
    ],
    cons: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    fn: { name: 'rob', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3, 1]], out: 4 },
      { in: [[2, 7, 9, 3, 1]], out: 12 },
      { in: [[5]], out: 5 },
      { in: [[2, 1, 1, 2]], out: 4 },
      { in: [[1, 3, 1, 3, 100]], out: 103 },
    ],
    hints: [
      'At house i you either rob it or skip it.',
      'If you rob i, you cannot rob i - 1: best(i) = max(best(i-1), best(i-2) + nums[i]).',
      'Iterate with two variables: prev (best up to i-1) and prev2 (best up to i-2).',
    ],
    brute: {
      idea: 'Recursion: rob(i) = max(rob(i + 1), nums[i] + rob(i + 2)).',
      code: J`class Solution {
    public int rob(int[] nums) {
        return robFrom(nums, 0);
    }

    private int robFrom(int[] nums, int i) {
        if (i >= nums.length) return 0;
        return Math.max(robFrom(nums, i + 1), nums[i] + robFrom(nums, i + 2));
    }
}`,
      time: 'O(2^n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Bottom-up DP with O(1) space.',
      code: J`class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int prev2 = 0, prev1 = 0;', 'Best totals considering houses up to i-2 and i-1.'],
      ['int cur = Math.max(prev1, prev2 + x);', 'Skip this house (keep prev1) or rob it (prev2 + x).'],
      ['prev2 = prev1; prev1 = cur;', 'Shift for the next house.'],
    ],
    cx: 'O(n) time, O(1) space.',
    dry: ['[2,7,9,3,1]', '2 → 2', '7 → max(2, 7) = 7', '9 → max(7, 2+9) = 11', '3 → max(11, 7+3) = 11', '1 → max(11, 11+1) = 12'],
    tips: ['House Robber II (circular street): run the linear version on [0..n-2] and [1..n-1].', 'House Robber III is the tree version (return pair from DFS).'],
    mistakes: ['Greedy "pick every other house" fails ([2,1,1,2] → 4, not 3).'],
    java: ['Enhanced for-loop keeps the DP loop clean when you do not need the index.'],
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    desc: "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the **fewest number of coins** needed to make up that amount. If that amount cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    ex: [
      ['coins = [1,2,5], amount = 11', '3', '11 = 5 + 5 + 1.'],
      ['coins = [2], amount = 3', '-1', ''],
      ['coins = [1], amount = 0', '0', ''],
    ],
    cons: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    fn: { name: 'coinChange', params: [['int[]', 'coins'], ['int', 'amount']], ret: 'int' },
    tests: [
      { in: [[1, 2, 5], 11], out: 3 },
      { in: [[2], 3], out: -1 },
      { in: [[1], 0], out: 0 },
      { in: [[2, 5, 10, 1], 27], out: 4 },
      { in: [[3, 7], 16], out: 4 },
      { in: [[4, 3, 1], 6], out: 2 },
    ],
    hints: [
      'Greedy (largest coin first) fails: coins [1,3,4], amount 6 → 4+1+1 (3 coins) but 3+3 is 2.',
      'minCoins(a) = 1 + min over coins c of minCoins(a - c).',
      'Bottom-up: dp[0] = 0, dp[a] = min(dp[a], dp[a - c] + 1). Initialise dp with amount + 1 as "infinity".',
    ],
    brute: {
      idea: 'Plain recursion trying every coin at every step.',
      code: J`class Solution {
    public int coinChange(int[] coins, int amount) {
        int r = solve(coins, amount);
        return r == Integer.MAX_VALUE ? -1 : r;
    }

    private int solve(int[] coins, int amount) {
        if (amount == 0) return 0;
        int best = Integer.MAX_VALUE;
        for (int c : coins) {
            if (c <= amount) {
                int sub = solve(coins, amount - c);
                if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);
            }
        }
        return best;
    }
}`,
      time: 'O(k^amount)', space: 'O(amount)',
    },
    optimal: {
      idea: 'Unbounded-knapsack style bottom-up DP over amounts.',
      code: J`import java.util.*;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a) {
                    dp[a] = Math.min(dp[a], dp[a - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      time: 'O(amount · k)', space: 'O(amount)',
    },
    lines: [
      ['Arrays.fill(dp, amount + 1);', 'amount + 1 is larger than any real answer (at most amount coins of value 1), so it acts as infinity without overflow risk.'],
      ['dp[0] = 0;', 'Zero coins make amount 0.'],
      ['if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);', 'Use coin c last: best way to make a - c, plus this coin.'],
      ['return dp[amount] > amount ? -1 : dp[amount];', 'Still "infinity" → impossible.'],
    ],
    cx: 'amount × k transitions → O(amount · k). Array of amount + 1 ints.',
    dry: ['coins [1,2,5], amount 11', 'dp[1..5] = 1,1,2,2,1', 'dp[10] = dp[5] + 1 = 2', 'dp[11] = dp[10] + 1 = 3'],
    tips: ['Coin Change II (count combinations): loop coins in the OUTER loop to avoid counting permutations.', 'Mention memoised recursion as the intermediate step.'],
    mistakes: ['Using Integer.MAX_VALUE as infinity then adding 1 → overflow to negative.', 'Greedy approach.'],
    java: ['`Arrays.fill` initialises a whole array in one call.'],
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, return the length of the **longest strictly increasing subsequence**. A subsequence keeps the relative order of elements but may skip some.",
    ex: [
      ['nums = [10,9,2,5,3,7,101,18]', '4', 'The LIS is [2,3,7,101].'],
      ['nums = [0,1,0,3,2,3]', '4', ''],
      ['nums = [7,7,7,7,7,7,7]', '1', ''],
    ],
    cons: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    fn: { name: 'lengthOfLIS', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[10, 9, 2, 5, 3, 7, 101, 18]], out: 4 },
      { in: [[0, 1, 0, 3, 2, 3]], out: 4 },
      { in: [[7, 7, 7, 7, 7, 7, 7]], out: 1 },
      { in: [[1]], out: 1 },
      { in: [[4, 10, 4, 3, 8, 9]], out: 3 },
      { in: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], out: 6 },
    ],
    hints: [
      'O(n^2) DP: dp[i] = length of the LIS ending at index i = 1 + max(dp[j]) for j < i with nums[j] < nums[i].',
      'For O(n log n): maintain tails[len] = smallest possible tail of an increasing subsequence of length len + 1.',
      'For each x, binary search the first tail >= x and replace it (or append if x is larger than all tails). The answer is tails.size().',
    ],
    brute: {
      idea: 'Classic O(n^2) DP.',
      code: J`class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length, best = 1;
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Patience sorting: tails array + binary search.',
      code: J`class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    lines: [
      ['int[] tails = new int[nums.length];', 'tails[k] = smallest tail value of any increasing subsequence of length k + 1 found so far (always sorted).'],
      ['while (lo < hi) { ... }', 'Lower-bound binary search: first index whose tail is >= x.'],
      ['tails[lo] = x;', 'x can end a subsequence of length lo + 1 with a smaller (better) tail.'],
      ['if (lo == size) size++;', 'x extends the longest subsequence.'],
      ['(lo + hi) >>> 1', 'Unsigned shift: overflow-safe midpoint.'],
    ],
    cx: 'Each element does one O(log n) binary search → O(n log n). tails is O(n). Note: tails is not itself an LIS, only its length is meaningful.',
    dry: ['[10,9,2,5,3,7,101,18]', '10 → [10]', '9 → [9]', '2 → [2]', '5 → [2,5]', '3 → [2,3]', '7 → [2,3,7]', '101 → [2,3,7,101]', '18 → [2,3,7,18] → 4'],
    tips: ['Present the O(n^2) DP first, then optimise.', 'Related: Russian Doll Envelopes, Number of LIS, Longest Bitonic Subsequence.'],
    mistakes: ['Using upper bound (<=) instead of lower bound — counts non-strict sequences.'],
    java: ['`>>>` is the unsigned right shift; `(lo + hi) >>> 1` is a common overflow-safe midpoint idiom.', '`Arrays.binarySearch(tails, 0, size, x)` can replace the manual loop.'],
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    desc: "Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\nA subsequence is derived by deleting some (possibly no) characters without changing the order of the rest.",
    ex: [
      ['text1 = "abcde", text2 = "ace"', '3', 'The LCS is "ace".'],
      ['text1 = "abc", text2 = "abc"', '3', ''],
      ['text1 = "abc", text2 = "def"', '0', ''],
    ],
    cons: ['1 <= text1.length, text2.length <= 1000', 'Lowercase English characters only'],
    fn: { name: 'longestCommonSubsequence', params: [['String', 'text1'], ['String', 'text2']], ret: 'int' },
    tests: [
      { in: ['abcde', 'ace'], out: 3 },
      { in: ['abc', 'abc'], out: 3 },
      { in: ['abc', 'def'], out: 0 },
      { in: ['bsbininm', 'jmjkbkjkv'], out: 1 },
      { in: ['oxcpqrsvwf', 'shmtulqrypy'], out: 2 },
    ],
    hints: [
      'Compare the last characters. If they match, what happens? If they don\'t?',
      'dp[i][j] = LCS of text1[0..i) and text2[0..j).',
      'If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1; else max(dp[i-1][j], dp[i][j-1]). Space can be reduced to one row.',
    ],
    brute: {
      idea: 'Plain recursion on both indices.',
      code: J`class Solution {
    public int longestCommonSubsequence(String a, String b) {
        return lcs(a, b, 0, 0);
    }

    private int lcs(String a, String b, int i, int j) {
        if (i == a.length() || j == b.length()) return 0;
        if (a.charAt(i) == b.charAt(j)) return 1 + lcs(a, b, i + 1, j + 1);
        return Math.max(lcs(a, b, i + 1, j), lcs(a, b, i, j + 1));
    }
}`,
      time: 'O(2^(n+m))', space: 'O(n + m)',
    },
    optimal: {
      idea: '2-D bottom-up DP table.',
      code: J`class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n = text1.length(), m = text2.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[n][m];
    }
}`,
      time: 'O(n · m)', space: 'O(n · m)',
    },
    lines: [
      ['int[][] dp = new int[n + 1][m + 1];', 'Extra row/column of zeros represent empty prefixes.'],
      ['if (text1.charAt(i - 1) == text2.charAt(j - 1))', 'Last characters of both prefixes match.'],
      ['dp[i][j] = dp[i - 1][j - 1] + 1;', 'Extend the LCS of the shorter prefixes by this character.'],
      ['dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);', 'Drop the last character of one string or the other.'],
    ],
    cx: 'n·m cells, O(1) each → O(n·m). Table O(n·m), reducible to O(min(n, m)) with two rows.',
    dry: ['"abcde" vs "ace"', 'a=a → 1', 'c=c → 2', 'e=e → 3'],
    tips: ['Reconstruct the actual subsequence by walking back from dp[n][m].', 'Related: Edit Distance, Shortest Common Supersequence, Delete Operation for Two Strings.'],
    mistakes: ['Confusing subsequence with substring (substring requires contiguous match and resets to 0 on mismatch).'],
    java: ['A new int[][] is zero-filled, giving the base cases for free.'],
  },
  {
    id: 'zero-one-knapsack',
    title: '0/1 Knapsack',
    difficulty: 'Medium',
    desc: "You are given `n` items, where item `i` has weight `wt[i]` and value `val[i]`, and a knapsack with capacity `W`. Each item can be taken **at most once** (0/1). Return the **maximum total value** you can carry without exceeding the capacity.",
    ex: [
      ['W = 4, wt = [4,5,1], val = [1,2,3]', '3', 'Item 2 alone (weight 1, value 3) is best; items 0 and 2 together weigh 5 > 4.'],
      ['W = 3, wt = [4,5,6], val = [1,2,3]', '0', 'No item fits.'],
      ['W = 50, wt = [10,20,30], val = [60,100,120]', '220', 'Take items 1 and 2.'],
    ],
    cons: ['1 <= n <= 1000', '1 <= W <= 1000', '1 <= wt[i] <= 1000', '1 <= val[i] <= 1000'],
    fn: { name: 'knapsack', params: [['int', 'W'], ['int[]', 'wt'], ['int[]', 'val']], ret: 'int' },
    tests: [
      { in: [4, [4, 5, 1], [1, 2, 3]], out: 3 },
      { in: [3, [4, 5, 6], [1, 2, 3]], out: 0 },
      { in: [50, [10, 20, 30], [60, 100, 120]], out: 220 },
      { in: [7, [1, 3, 4, 5], [1, 4, 5, 7]], out: 9 },
      { in: [10, [5, 4, 6, 3], [10, 40, 30, 50]], out: 90 },
    ],
    hints: [
      'For each item: take it (if it fits) or leave it.',
      'dp[i][w] = best value using the first i items with capacity w.',
      'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]). With a 1-D array, iterate w from W DOWN to wt[i] so each item is used once.',
    ],
    brute: {
      idea: 'Recursion: include or exclude each item.',
      code: J`class Solution {
    public int knapsack(int W, int[] wt, int[] val) {
        return best(W, wt, val, wt.length - 1);
    }

    private int best(int cap, int[] wt, int[] val, int i) {
        if (i < 0 || cap == 0) return 0;
        int skip = best(cap, wt, val, i - 1);
        if (wt[i] > cap) return skip;
        int take = val[i] + best(cap - wt[i], wt, val, i - 1);
        return Math.max(skip, take);
    }
}`,
      time: 'O(2^n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Space-optimised 1-D DP iterating capacity in reverse.',
      code: J`class Solution {
    public int knapsack(int W, int[] wt, int[] val) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++) {
            for (int w = W; w >= wt[i]; w--) {
                dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
            }
        }
        return dp[W];
    }
}`,
      time: 'O(n · W)', space: 'O(W)',
    },
    lines: [
      ['int[] dp = new int[W + 1];', 'dp[w] = best value achievable with capacity w using the items processed so far.'],
      ['for (int w = W; w >= wt[i]; w--)', 'Reverse order ensures dp[w - wt[i]] still refers to the previous item row — each item used at most once.'],
      ['dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);', 'Skip item i, or take it and use the remaining capacity optimally.'],
    ],
    cx: 'n items × W capacities → O(n·W) (pseudo-polynomial). One array of W + 1.',
    dry: ['W=7, items (1,1),(3,4),(4,5),(5,7)', 'after item (3,4): dp[3..7]=4,5,5,5,5', 'after (4,5): dp[7]=max(5, 5+dp[3]=9)=9', 'after (5,7): dp[7]=max(9, 7+dp[2]=8)=9'],
    tips: ['Unbounded knapsack: iterate w forward instead.', 'Many problems reduce to knapsack: Partition Equal Subset Sum, Target Sum, Last Stone Weight II.'],
    mistakes: ['Forward iteration in 0/1 knapsack (uses an item multiple times).', 'Greedy by value/weight ratio — only valid for the fractional knapsack.'],
    java: ['A 1-D int[] halves memory compared to int[n+1][W+1].'],
  },
  {
    id: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    desc: "There is a robot on an `m x n` grid, initially at the **top-left corner**. The robot tries to move to the **bottom-right corner**. It can only move either **down** or **right** at any point in time.\n\nGiven `m` and `n`, return the number of possible unique paths.",
    ex: [
      ['m = 3, n = 7', '28', ''],
      ['m = 3, n = 2', '3', 'Right→Down→Down, Down→Down→Right, Down→Right→Down.'],
    ],
    cons: ['1 <= m, n <= 100', 'The answer is <= 2 * 10^9'],
    fn: { name: 'uniquePaths', params: [['int', 'm'], ['int', 'n']], ret: 'int' },
    tests: [
      { in: [3, 7], out: 28 },
      { in: [3, 2], out: 3 },
      { in: [1, 1], out: 1 },
      { in: [10, 10], out: 48620 },
      { in: [1, 5], out: 1 },
    ],
    hints: [
      'How many ways to reach cell (i, j)? Which cells lead into it?',
      'paths(i, j) = paths(i - 1, j) + paths(i, j - 1); the first row and column have 1 path each.',
      'A single row array works: dp[j] += dp[j - 1]. (Math: C(m + n - 2, m - 1).)',
    ],
    brute: {
      idea: 'Recursion counting paths from (0,0).',
      code: J`class Solution {
    public int uniquePaths(int m, int n) {
        return count(0, 0, m, n);
    }

    private int count(int r, int c, int m, int n) {
        if (r == m - 1 || c == n - 1) return 1;
        return count(r + 1, c, m, n) + count(r, c + 1, m, n);
    }
}`,
      time: 'O(2^(m+n))', space: 'O(m + n)',
    },
    optimal: {
      idea: '1-D rolling DP row.',
      code: J`import java.util.*;

class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}`,
      time: 'O(m · n)', space: 'O(n)',
    },
    lines: [
      ['Arrays.fill(dp, 1);', 'First row: only one way (all rights).'],
      ['dp[j] += dp[j - 1];', 'dp[j] (old value = from above) + dp[j-1] (already updated = from left).'],
      ['return dp[n - 1];', 'Paths to the bottom-right cell.'],
    ],
    cx: 'O(m·n) time with an O(n) row. The combinatorial formula is O(min(m, n)).',
    dry: ['m=3, n=3', 'row0 [1,1,1]', 'row1 [1,2,3]', 'row2 [1,3,6] → 6'],
    tips: ['Unique Paths II adds obstacles: set dp[j] = 0 on obstacle cells.', 'Minimum Path Sum uses the same grid DP with min.'],
    mistakes: ['Overflow when computing the binomial with factorials.'],
    java: ['Compute C(n, k) iteratively with long: res = res * (n - k + i) / i.'],
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Hard',
    desc: "Given two strings `word1` and `word2`, return the **minimum number of operations** required to convert `word1` to `word2`. You have the following three operations permitted on a word:\n\n- Insert a character\n- Delete a character\n- Replace a character",
    ex: [
      ['word1 = "horse", word2 = "ros"', '3', 'horse → rorse (replace h with r) → rose (remove r) → ros (remove e).'],
      ['word1 = "intention", word2 = "execution"', '5', ''],
    ],
    cons: ['0 <= word1.length, word2.length <= 500', 'Lowercase English letters'],
    fn: { name: 'minDistance', params: [['String', 'word1'], ['String', 'word2']], ret: 'int' },
    tests: [
      { in: ['horse', 'ros'], out: 3 },
      { in: ['', 'a'], out: 1 },
      { in: ['abc', 'abc'], out: 0 },
      { in: ['sunday', 'saturday'], out: 3 },
      { in: ['abc', 'yabd'], out: 2 },
    ],
    hints: [
      'Look at the last characters of both prefixes.',
      'If they match, no operation is needed for them. Otherwise try insert, delete or replace and take the cheapest.',
      'dp[i][j] = dp[i-1][j-1] if chars equal, else 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)). Base: dp[i][0] = i, dp[0][j] = j.',
    ],
    brute: {
      idea: 'Recursion over prefix lengths.',
      code: J`class Solution {
    public int minDistance(String a, String b) {
        return solve(a, b, a.length(), b.length());
    }

    private int solve(String a, String b, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (a.charAt(i - 1) == b.charAt(j - 1)) return solve(a, b, i - 1, j - 1);
        return 1 + Math.min(solve(a, b, i - 1, j - 1),
                Math.min(solve(a, b, i - 1, j), solve(a, b, i, j - 1)));
    }
}`,
      time: 'O(3^(n+m))', space: 'O(n + m)',
    },
    optimal: {
      idea: 'Levenshtein DP table.',
      code: J`class Solution {
    public int minDistance(String word1, String word2) {
        int n = word1.length(), m = word2.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[n][m];
    }
}`,
      time: 'O(n · m)', space: 'O(n · m)',
    },
    lines: [
      ['dp[i][0] = i; dp[0][j] = j;', 'Converting to/from an empty string needs i deletions or j insertions.'],
      ['if (chars equal) dp[i][j] = dp[i - 1][j - 1];', 'Matching last characters cost nothing.'],
      ['dp[i - 1][j - 1]', 'Replace word1[i-1] with word2[j-1].'],
      ['dp[i - 1][j]', 'Delete word1[i-1].'],
      ['dp[i][j - 1]', 'Insert word2[j-1].'],
    ],
    cx: 'O(n·m) time and space; rolling rows reduce space to O(m).',
    dry: ['horse → ros', 'dp table last cell = 3', 'path: replace h→r, delete r, delete e'],
    tips: ['Classic interview DP — know how to explain each of the three transitions.', 'Used in spell checkers and diff tools.'],
    mistakes: ['Forgetting base row/column initialisation.'],
    java: ['Nested Math.min calls are fine; Java has no 3-argument min.'],
  },
  {
    id: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    desc: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of **one or more dictionary words**. The same word may be reused multiple times.",
    ex: [
      ['s = "leetcode", wordDict = ["leet","code"]', 'true', '"leet code".'],
      ['s = "applepenapple", wordDict = ["apple","pen"]', 'true', 'Words can be reused.'],
      ['s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', 'false', ''],
    ],
    cons: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20', 'All words are unique'],
    fn: { name: 'wordBreak', params: [['String', 's'], ['List<String>', 'wordDict']], ret: 'boolean' },
    tests: [
      { in: ['leetcode', ['leet', 'code']], out: true },
      { in: ['applepenapple', ['apple', 'pen']], out: true },
      { in: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], out: false },
      { in: ['a', ['b']], out: false },
      { in: ['cars', ['car', 'ca', 'rs']], out: true },
    ],
    hints: [
      'Try every dictionary word as a prefix and recurse on the rest.',
      'Many suffixes are checked repeatedly — store results.',
      'dp[i] = true if s[0..i) can be segmented. dp[0] = true; dp[i] = any j < i with dp[j] && dict contains s[j..i).',
    ],
    brute: {
      idea: 'Recursion trying every prefix (exponential without memoisation).',
      code: J`import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        return can(s, 0, new HashSet<>(wordDict));
    }

    private boolean can(String s, int start, Set<String> dict) {
        if (start == s.length()) return true;
        for (int end = start + 1; end <= s.length(); end++) {
            if (dict.contains(s.substring(start, end)) && can(s, end, dict)) return true;
        }
        return false;
    }
}`,
      time: 'O(2^n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Bottom-up DP over prefix lengths with a HashSet dictionary.',
      code: J`import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int maxLen = 0;
        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = Math.max(0, i - maxLen); j < i; j++) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`,
      time: 'O(n · L · L), L = max word length', space: 'O(n + dict)',
    },
    lines: [
      ['Set<String> dict = new HashSet<>(wordDict);', 'O(1) average word lookup.'],
      ['dp[0] = true;', 'The empty prefix is trivially segmentable.'],
      ['for (int j = Math.max(0, i - maxLen); j < i; j++)', 'Only words up to maxLen can end at i — prunes the inner loop.'],
      ['if (dp[j] && dict.contains(s.substring(j, i)))', 's[0..j) is segmentable and s[j..i) is a word.'],
    ],
    cx: 'n positions × up to L split points × O(L) substring/hash → O(n·L²).',
    dry: ['"leetcode"', 'dp[4]: "leet" ✓', 'dp[8]: dp[4] && "code" ✓ → true'],
    tips: ['Word Break II (return all sentences) — memoised DFS.', 'A Trie can replace the HashSet to avoid creating substrings.'],
    mistakes: ['Greedy longest-prefix matching fails ("cars" with ["car","ca","rs"]).'],
    java: ['`new HashSet<>(collection)` copies a List into a Set in one call.', '`substring` allocates; for performance check with `s.startsWith(word, j)`.'],
  },
  {
    id: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, return `true` if you can partition the array into **two subsets** such that the sum of the elements in both subsets is equal, or `false` otherwise.",
    ex: [
      ['nums = [1,5,11,5]', 'true', '[1, 5, 5] and [11].'],
      ['nums = [1,2,3,5]', 'false', ''],
    ],
    cons: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    fn: { name: 'canPartition', params: [['int[]', 'nums']], ret: 'boolean' },
    tests: [
      { in: [[1, 5, 11, 5]], out: true },
      { in: [[1, 2, 3, 5]], out: false },
      { in: [[2, 2]], out: true },
      { in: [[1]], out: false },
      { in: [[3, 3, 3, 4, 5]], out: true },
      { in: [[1, 2, 5]], out: false },
    ],
    hints: [
      'If the total sum is odd, the answer is immediately false.',
      'Otherwise, you need a subset with sum total / 2 — a subset-sum (0/1 knapsack) problem.',
      'boolean dp[target + 1], dp[0] = true; for each num, for s from target down to num: dp[s] |= dp[s - num].',
    ],
    brute: {
      idea: 'Recursion: include or exclude each number, looking for target = sum / 2.',
      code: J`class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        return can(nums, nums.length - 1, sum / 2);
    }

    private boolean can(int[] nums, int i, int target) {
        if (target == 0) return true;
        if (i < 0 || target < 0) return false;
        return can(nums, i - 1, target - nums[i]) || can(nums, i - 1, target);
    }
}`,
      time: 'O(2^n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Subset-sum DP with a 1-D boolean array (reverse iteration).',
      code: J`class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums) {
            for (int s = target; s >= num; s--) {
                dp[s] = dp[s] || dp[s - num];
            }
            if (dp[target]) return true;
        }
        return dp[target];
    }
}`,
      time: 'O(n · sum)', space: 'O(sum)',
    },
    lines: [
      ['if (sum % 2 != 0) return false;', 'Two equal integer halves need an even total.'],
      ['boolean[] dp = new boolean[target + 1]; dp[0] = true;', 'dp[s] = some subset of processed numbers sums to s.'],
      ['for (int s = target; s >= num; s--)', 'Backwards so each number is used at most once (0/1 knapsack).'],
      ['dp[s] = dp[s] || dp[s - num];', 'Either s was reachable before, or we reach it by adding num.'],
      ['if (dp[target]) return true;', 'Early exit.'],
    ],
    cx: 'n × target updates → O(n · sum/2). Array of size sum/2 + 1.',
    dry: ['[1,5,11,5], target 11', 'after 1: {0,1}', 'after 5: {0,1,5,6}', 'after 11: {…,11} → true'],
    tips: ['Bitset trick: `BitSet` or `long` shifts make it very fast: bits |= bits << num.', 'Related: Target Sum, Last Stone Weight II, Partition to K Equal Sum Subsets (backtracking).'],
    mistakes: ['Forward iteration reuses the same number.'],
    java: ['`java.util.BitSet` can implement subset-sum as bit shifts for large inputs.'],
  },
];
