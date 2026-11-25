const J = String.raw;

export default [
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in **O(n)** time and **without using the division** operation. The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.",
    ex: [
      ['nums = [1,2,3,4]', '[24,12,8,6]', ''],
      ['nums = [-1,1,0,-3,3]', '[0,0,9,0,0]', ''],
    ],
    cons: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    fn: { name: 'productExceptSelf', params: [['int[]', 'nums']], ret: 'int[]' },
    tests: [
      { in: [[1, 2, 3, 4]], out: [24, 12, 8, 6] },
      { in: [[-1, 1, 0, -3, 3]], out: [0, 0, 9, 0, 0] },
      { in: [[2, 3]], out: [3, 2] },
      { in: [[0, 0]], out: [0, 0] },
      { in: [[5, 1, 1, 2]], out: [2, 10, 10, 5] },
    ],
    hints: [
      'answer[i] = (product of everything to the left of i) × (product of everything to the right of i).',
      'Build a prefix-product array and a suffix-product array, then multiply them.',
      'Store prefix products directly in the output array, then sweep from the right with a single running suffix variable — O(1) extra space.',
    ],
    brute: {
      idea: 'For each index, multiply all other elements with a nested loop.',
      code: J`class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            int prod = 1;
            for (int j = 0; j < n; j++) {
                if (j != i) prod *= nums[j];
            }
            ans[i] = prod;
        }
        return ans;
    }
}`,
      time: 'O(n^2)', space: 'O(1) extra',
    },
    optimal: {
      idea: 'Two passes: left-to-right fills prefix products into ans; right-to-left multiplies in a running suffix product.',
      code: J`class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) {
            ans[i] = ans[i - 1] * nums[i - 1];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
}`,
      time: 'O(n)', space: 'O(1) extra (output excluded)',
    },
    lines: [
      ['ans[0] = 1;', 'Nothing lies to the left of index 0, so its prefix product is the empty product 1.'],
      ['ans[i] = ans[i - 1] * nums[i - 1];', 'Prefix product of everything strictly before i.'],
      ['int suffix = 1;', 'Running product of everything strictly to the right of the current index.'],
      ['ans[i] *= suffix;', 'Combine left product (already in ans[i]) with right product.'],
      ['suffix *= nums[i];', 'Include nums[i] in the suffix for the next index to the left.'],
    ],
    cx: 'Two linear passes → O(n). Apart from the output array we use one variable → O(1) extra space.',
    dry: ['nums=[1,2,3,4]', 'prefix pass → ans=[1,1,2,6]', 'i=3: ans=6*1=6, suffix=4', 'i=2: ans=2*4=8, suffix=12', 'i=1: ans=1*12=12, suffix=24', 'i=0: ans=1*24=24 → [24,12,8,6]'],
    tips: ['Explain why division fails: zeros in the input (and the problem forbids it).', 'Prefix/suffix products are a reusable pattern — similar to prefix sums.'],
    mistakes: ['Using division and crashing/incorrect results when the array contains zero.', 'Off-by-one: including nums[i] in its own prefix.'],
    java: ['`int[] ans = new int[n]` — Java zero-fills, so we must explicitly set ans[0] = 1.', 'Compound assignment `ans[i] *= suffix` is shorthand for `ans[i] = ans[i] * suffix`.'],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    desc: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input, **sorted by start**.\n\nIntervals that touch (e.g. `[1,4]` and `[4,5]`) are considered overlapping.",
    ex: [
      ['intervals = [[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]', '[1,3] and [2,6] overlap, so they merge into [1,6].'],
      ['intervals = [[1,4],[4,5]]', '[[1,5]]', ''],
    ],
    cons: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    fn: { name: 'merge', params: [['int[][]', 'intervals']], ret: 'int[][]' },
    tests: [
      { in: [[[1, 3], [2, 6], [8, 10], [15, 18]]], out: [[1, 6], [8, 10], [15, 18]] },
      { in: [[[1, 4], [4, 5]]], out: [[1, 5]] },
      { in: [[[1, 4], [0, 4]]], out: [[0, 4]] },
      { in: [[[1, 4], [2, 3]]], out: [[1, 4]] },
      { in: [[[5, 6]]], out: [[5, 6]] },
      { in: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], out: [[1, 10]] },
    ],
    hints: [
      'Overlaps are easy to detect if intervals are processed in some order. Which order?',
      'Sort by start time. Then an interval overlaps the previous merged one only if its start <= previous end.',
      'After sorting, keep a list of merged intervals. For each interval, either extend the last merged end = max(end, cur.end) or append a new interval.',
    ],
    brute: {
      idea: 'Repeatedly scan all pairs and merge any two that overlap until no more merges happen.',
      code: J`import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        List<int[]> list = new ArrayList<>();
        for (int[] in : intervals) list.add(new int[]{in[0], in[1]});
        boolean merged = true;
        while (merged) {
            merged = false;
            outer:
            for (int i = 0; i < list.size(); i++) {
                for (int j = i + 1; j < list.size(); j++) {
                    int[] a = list.get(i), b = list.get(j);
                    if (a[0] <= b[1] && b[0] <= a[1]) {
                        a[0] = Math.min(a[0], b[0]);
                        a[1] = Math.max(a[1], b[1]);
                        list.remove(j);
                        merged = true;
                        break outer;
                    }
                }
            }
        }
        list.sort((x, y) -> Integer.compare(x[0], y[0]));
        return list.toArray(new int[0][]);
    }
}`,
      time: 'O(n^3) worst case', space: 'O(n)',
    },
    optimal: {
      idea: 'Sort by start; sweep once, merging into the last interval of the result when they overlap.',
      code: J`import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        for (int[] cur : intervals) {
            if (result.isEmpty() || result.get(result.size() - 1)[1] < cur[0]) {
                result.add(new int[]{cur[0], cur[1]});
            } else {
                int[] last = result.get(result.size() - 1);
                last[1] = Math.max(last[1], cur[1]);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    lines: [
      ['Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));', 'Sort by start using a lambda Comparator. Integer.compare avoids overflow bugs of a[0] - b[0].'],
      ['List<int[]> result = new ArrayList<>();', 'Dynamic list because we do not know how many merged intervals there will be.'],
      ['if (result.isEmpty() || last[1] < cur[0])', 'No overlap with the last merged interval (it ends before cur starts) → start a new interval.'],
      ['last[1] = Math.max(last[1], cur[1]);', 'Overlap → extend the end. Use max because cur may be fully contained in last.'],
      ['result.toArray(new int[result.size()][])', 'Convert List<int[]> back to int[][].'],
    ],
    cx: 'Sorting dominates: O(n log n). The sweep is O(n). The output list holds up to n intervals → O(n) space (plus O(log n) for the sort).',
    dry: ['sorted: [1,3],[2,6],[8,10],[15,18]', '[1,3] → result=[[1,3]]', '[2,6]: 3 >= 2 overlap → [[1,6]]', '[8,10]: 6 < 8 → add', '[15,18]: add → [[1,6],[8,10],[15,18]]'],
    tips: ['Clarify whether touching intervals count as overlapping.', 'Related: Insert Interval, Meeting Rooms (can one person attend all?), Meeting Rooms II (min rooms → PriorityQueue).'],
    mistakes: ['Forgetting Math.max when extending — [1,10] then [2,3] would wrongly shrink to [1,3].', 'Using a[0] - b[0] in comparators can overflow for large negative values.'],
    java: ['Lambda comparator `(a, b) -> Integer.compare(a[0], b[0])` — or `Comparator.comparingInt(a -> a[0])`.', '`list.toArray(new int[0][])` converts a List of arrays to a 2-D array.', '`int[]` stored in a List is a reference, so modifying `last[1]` updates the list element.'],
  },
  {
    id: 'rotate-image',
    title: 'Rotate Image (Matrix 90°)',
    difficulty: 'Medium',
    desc: "You are given an `n x n` 2-D `matrix` representing an image. Rotate the image by **90 degrees clockwise**, **in-place**. Do not allocate another 2-D matrix.",
    ex: [
      ['matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[[7,4,1],[8,5,2],[9,6,3]]', ''],
      ['matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]', ''],
    ],
    cons: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
    fn: { name: 'rotate', params: [['int[][]', 'matrix']], ret: 'void', out: 0 },
    tests: [
      { in: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], out: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
      { in: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], out: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] },
      { in: [[[1]]], out: [[1]] },
      { in: [[[1, 2], [3, 4]]], out: [[3, 1], [4, 2]] },
    ],
    hints: [
      'Where does element (i, j) go after a 90° clockwise rotation?',
      '(i, j) moves to (j, n-1-i). Can you reach that with two simpler operations?',
      'Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row.',
    ],
    brute: {
      idea: 'Build a rotated copy using rotated[j][n-1-i] = matrix[i][j], then copy it back (uses extra matrix).',
      code: J`class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        int[][] rotated = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotated[j][n - 1 - i] = matrix[i][j];
            }
        }
        for (int i = 0; i < n; i++) {
            matrix[i] = rotated[i].clone();
        }
    }
}`,
      time: 'O(n^2)', space: 'O(n^2)',
    },
    optimal: {
      idea: 'Transpose then reverse every row — both in-place.',
      code: J`class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = t;
            }
        }
        for (int[] row : matrix) {
            for (int l = 0, r = n - 1; l < r; l++, r--) {
                int t = row[l];
                row[l] = row[r];
                row[r] = t;
            }
        }
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    lines: [
      ['for (int j = i + 1; j < n; j++)', 'Only visit the upper triangle; swapping both triangles would undo the transpose.'],
      ['swap(matrix[i][j], matrix[j][i])', 'Transpose: rows become columns.'],
      ['for (int[] row : matrix)', 'Each row of a 2-D array is itself an int[] we can modify directly.'],
      ['for (int l = 0, r = n - 1; l < r; l++, r--)', 'Two-pointer reversal of each row, completing the clockwise rotation.'],
    ],
    cx: 'Each cell is touched a constant number of times → O(n^2) time. Swaps are in-place → O(1) extra space.',
    dry: ['[[1,2,3],[4,5,6],[7,8,9]]', 'transpose → [[1,4,7],[2,5,8],[3,6,9]]', 'reverse rows → [[7,4,1],[8,5,2],[9,6,3]] ✓'],
    tips: ['Counter-clockwise = transpose then reverse each column (or reverse rows first, then transpose).', 'Mention the layer-by-layer four-way swap as an alternative in-place method.'],
    mistakes: ['Transposing with j starting at 0 — swaps each pair twice, leaving the matrix unchanged.', 'Reversing columns instead of rows (gives counter-clockwise).'],
    java: ['A Java 2-D array is an array of row arrays; `matrix[i]` is an `int[]` reference.', 'The for loop can declare two variables: `for (int l = 0, r = n - 1; l < r; l++, r--)`.'],
  },
  {
    id: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    desc: "Given an `m x n` `matrix`, return all elements of the matrix in **spiral order** (clockwise, starting from the top-left).",
    ex: [
      ['matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[1,2,3,6,9,8,7,4,5]', ''],
      ['matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', '[1,2,3,4,8,12,11,10,9,5,6,7]', ''],
    ],
    cons: ['m == matrix.length, n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    fn: { name: 'spiralOrder', params: [['int[][]', 'matrix']], ret: 'List<Integer>' },
    tests: [
      { in: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], out: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { in: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], out: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { in: [[[7]]], out: [7] },
      { in: [[[1, 2, 3]]], out: [1, 2, 3] },
      { in: [[[1], [2], [3]]], out: [1, 2, 3] },
      { in: [[[1, 2], [3, 4], [5, 6]]], out: [1, 2, 4, 6, 5, 3] },
    ],
    hints: [
      'Think of peeling the matrix layer by layer, like an onion.',
      'Maintain four boundaries: top, bottom, left, right. Traverse one side, then shrink that boundary.',
      'Loop while top <= bottom && left <= right: go right on top row, down on right column, left on bottom row (if top <= bottom), up on left column (if left <= right).',
    ],
    brute: {
      idea: 'Simulate walking with a direction vector and a visited matrix; turn clockwise when the next cell is out of bounds or visited.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[][] seen = new boolean[m][n];
        int[] dr = {0, 1, 0, -1}, dc = {1, 0, -1, 0};
        List<Integer> res = new ArrayList<>();
        int r = 0, c = 0, d = 0;
        for (int k = 0; k < m * n; k++) {
            res.add(matrix[r][c]);
            seen[r][c] = true;
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) {
                d = (d + 1) % 4;
                nr = r + dr[d];
                nc = c + dc[d];
            }
            r = nr;
            c = nc;
        }
        return res;
    }
}`,
      time: 'O(m·n)', space: 'O(m·n)',
    },
    optimal: {
      idea: 'Boundary shrinking: four pointers mark the unvisited rectangle; no visited matrix needed.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
                left++;
            }
        }
        return res;
    }
}`,
      time: 'O(m·n)', space: 'O(1) extra',
    },
    lines: [
      ['int top = 0, bottom = m - 1, left = 0, right = n - 1;', 'The current unvisited layer is the rectangle [top..bottom] × [left..right].'],
      ['for (j = left..right) add(matrix[top][j]); top++;', 'Walk the top row left→right, then that row is done.'],
      ['for (i = top..bottom) add(matrix[i][right]); right--;', 'Walk the right column top→bottom.'],
      ['if (top <= bottom) { ... bottom--; }', 'Only walk the bottom row if a row remains — avoids duplicates in single-row layers.'],
      ['if (left <= right) { ... left++; }', 'Only walk the left column if a column remains.'],
    ],
    cx: 'Each element is added exactly once → O(m·n). Apart from the output list, only four integers → O(1).',
    dry: ['3x3: top=0,bottom=2,left=0,right=2', 'right along top: 1,2,3 (top=1)', 'down right col: 6,9 (right=1)', 'left along bottom: 8,7 (bottom=1)', 'up left col: 4 (left=1)', 'next layer: 5 → [1,2,3,6,9,8,7,4,5]'],
    tips: ['Test with a single row and a single column — that is where spiral bugs hide.', 'Spiral Matrix II (fill 1..n^2) uses the exact same boundary loop.'],
    mistakes: ['Missing the `if (top <= bottom)` / `if (left <= right)` guards → duplicates for non-square matrices.'],
    java: ['`List<Integer>` with `ArrayList` — primitives are autoboxed on `add`.', 'Direction arrays `dr`/`dc` are a common grid-simulation idiom.'],
  },
  {
    id: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    desc: "Given an `m x n` integer `matrix`, if an element is `0`, set its **entire row and column** to `0`s. You must do it **in-place**.\n\nFollow-up: can you use only O(1) extra space?",
    ex: [
      ['matrix = [[1,1,1],[1,0,1],[1,1,1]]', '[[1,0,1],[0,0,0],[1,0,1]]', ''],
      ['matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]', ''],
    ],
    cons: ['1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    fn: { name: 'setZeroes', params: [['int[][]', 'matrix']], ret: 'void', out: 0 },
    tests: [
      { in: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], out: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { in: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], out: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
      { in: [[[1]]], out: [[1]] },
      { in: [[[1, 0]]], out: [[0, 0]] },
      { in: [[[1, 2, 3], [4, 5, 6], [0, 8, 9]]], out: [[0, 2, 3], [0, 5, 6], [0, 0, 0]] },
    ],
    hints: [
      'Why can you not just set zeros as you scan? (New zeros would spread further.)',
      'First record which rows and which columns need zeroing (two boolean arrays), then apply.',
      'For O(1) space, use the first row and first column themselves as the markers, plus one flag for whether column 0 itself must be zeroed.',
    ],
    brute: {
      idea: 'Record zero rows and zero columns in two boolean arrays, then zero those rows/columns.',
      code: J`class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[] rows = new boolean[m], cols = new boolean[n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 0) { rows[i] = true; cols[j] = true; }
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (rows[i] || cols[j]) matrix[i][j] = 0;
    }
}`,
      time: 'O(m·n)', space: 'O(m + n)',
    },
    optimal: {
      idea: 'Use row 0 and column 0 as marker arrays. A separate boolean remembers if column 0 originally had a zero.',
      code: J`class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstColZero = false;
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 1; j--) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
            if (firstColZero) matrix[i][0] = 0;
        }
    }
}`,
      time: 'O(m·n)', space: 'O(1)',
    },
    lines: [
      ['boolean firstColZero = false;', 'matrix[0][0] can only mark one thing; we let it mark row 0 and keep column 0\'s state in this flag.'],
      ['if (matrix[i][0] == 0) firstColZero = true;', 'Column 0 contains a zero, so it must be zeroed at the end.'],
      ['matrix[i][0] = 0; matrix[0][j] = 0;', 'Mark row i (in column 0) and column j (in row 0).'],
      ['for (int i = m - 1; ...; i--) for (int j = n - 1; j >= 1; j--)', 'Apply bottom-up and right-to-left so the marker row/column are overwritten last.'],
      ['if (firstColZero) matrix[i][0] = 0;', 'Finally zero column 0 if needed.'],
    ],
    cx: 'Two passes over the matrix → O(m·n). Markers live inside the matrix → O(1) extra space.',
    dry: ['[[1,1,1],[1,0,1],[1,1,1]]', 'zero at (1,1) → mark matrix[1][0]=0, matrix[0][1]=0', 'apply: row 1 all zero, column 1 all zero', '→ [[1,0,1],[0,0,0],[1,0,1]]'],
    tips: ['Start with the O(m+n) solution, then optimise — interviewers like seeing the progression.'],
    mistakes: ['Zeroing while scanning — cascades zeros across the whole matrix.', 'Applying markers top-down, which destroys row 0 markers before they are read.'],
    java: ['`boolean[]` defaults to false in Java.', 'Braceless for-loops are legal but use them carefully; braces prevent bugs.'],
  },
  {
    id: 'next-permutation',
    title: 'Next Permutation',
    difficulty: 'Medium',
    desc: "Given an array of integers `nums`, rearrange it into the **next lexicographically greater permutation**. If no such arrangement exists (the array is in descending order), rearrange it into the lowest possible order (ascending).\n\nThe replacement must be **in-place** and use only constant extra memory.",
    ex: [
      ['nums = [1,2,3]', '[1,3,2]', ''],
      ['nums = [3,2,1]', '[1,2,3]', 'Already the largest permutation, so wrap around to the smallest.'],
      ['nums = [1,1,5]', '[1,5,1]', ''],
    ],
    cons: ['1 <= nums.length <= 100', '0 <= nums[i] <= 100'],
    fn: { name: 'nextPermutation', params: [['int[]', 'nums']], ret: 'void', out: 0 },
    tests: [
      { in: [[1, 2, 3]], out: [1, 3, 2] },
      { in: [[3, 2, 1]], out: [1, 2, 3] },
      { in: [[1, 1, 5]], out: [1, 5, 1] },
      { in: [[1, 3, 2]], out: [2, 1, 3] },
      { in: [[2, 3, 1, 3, 3]], out: [2, 3, 3, 1, 3] },
      { in: [[1]], out: [1] },
    ],
    hints: [
      'To get the next permutation you want to change the array as far to the right as possible.',
      'Scan from the right to find the first index i where nums[i] < nums[i+1]. The suffix after i is non-increasing.',
      'Swap nums[i] with the smallest element in the suffix that is greater than nums[i] (scan from the right), then reverse the suffix. If no such i exists, reverse the whole array.',
    ],
    brute: {
      idea: 'Generate all permutations, sort them, find the current one and take the next (wrap around). Shown for understanding — factorial time.',
      code: J`import java.util.*;

class Solution {
    public void nextPermutation(int[] nums) {
        List<List<Integer>> all = new ArrayList<>();
        permute(nums, 0, all);
        all.sort((a, b) -> {
            for (int i = 0; i < a.size(); i++) {
                int c = Integer.compare(a.get(i), b.get(i));
                if (c != 0) return c;
            }
            return 0;
        });
        List<Integer> cur = new ArrayList<>();
        for (int x : nums) cur.add(x);
        int idx = 0;
        while (!all.get(idx).equals(cur)) idx++;
        while (idx < all.size() && all.get(idx).equals(cur)) idx++;
        List<Integer> next = all.get(idx % all.size());
        for (int i = 0; i < nums.length; i++) nums[i] = next.get(i);
    }

    private void permute(int[] a, int k, List<List<Integer>> out) {
        if (k == a.length) {
            List<Integer> p = new ArrayList<>();
            for (int x : a) p.add(x);
            out.add(p);
            return;
        }
        for (int i = k; i < a.length; i++) {
            int t = a[k]; a[k] = a[i]; a[i] = t;
            permute(a, k + 1, out);
            t = a[k]; a[k] = a[i]; a[i] = t;
        }
    }
}`,
      time: 'O(n! · n)', space: 'O(n! · n)',
    },
    optimal: {
      idea: 'Find the pivot (first descent from the right), swap it with its successor in the suffix, reverse the suffix.',
      code: J`class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        reverse(nums, i + 1, n - 1);
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    private void reverse(int[] a, int l, int r) {
        while (l < r) swap(a, l++, r--);
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (i >= 0 && nums[i] >= nums[i + 1]) i--;', 'Find the pivot: the rightmost index whose value is smaller than its right neighbour. Everything to its right is in non-increasing order (already the largest arrangement).'],
      ['while (nums[j] <= nums[i]) j--;', 'Find the rightmost element greater than the pivot — the smallest possible bump.'],
      ['swap(nums, i, j);', 'Increase the pivot position by the minimum amount.'],
      ['reverse(nums, i + 1, n - 1);', 'The suffix is still non-increasing; reversing makes it the smallest arrangement. If i == -1 this reverses the whole array (wrap-around).'],
    ],
    cx: 'At most three linear scans → O(n). Only swaps → O(1) space.',
    dry: ['nums=[1,3,5,4,2]', 'pivot: from right 4>2? 5>4, 3<5 → i=1 (value 3)', 'successor from right > 3: 4 at j=3', 'swap → [1,4,5,3,2]', 'reverse suffix [5,3,2] → [1,4,2,3,5]'],
    tips: ['Explain with a concrete example on the whiteboard; the algorithm is easy once the pivot idea is clear.', 'This is how C++ std::next_permutation works.'],
    mistakes: ['Using > instead of >= when searching the pivot breaks arrays with duplicates like [1,5,1].', 'Sorting the suffix (O(n log n)) instead of reversing it.'],
    java: ['Small private helpers (swap, reverse) keep the main method readable — interviewers appreciate it.', '`swap(a, l++, r--)` passes the old values, then updates the pointers.'],
  },
  {
    id: 'pascals-triangle',
    title: "Pascal's Triangle",
    difficulty: 'Easy',
    desc: "Given an integer `numRows`, return the first `numRows` rows of **Pascal's triangle**.\n\nIn Pascal's triangle, each number is the sum of the two numbers directly above it, and each row starts and ends with `1`.",
    ex: [
      ['numRows = 5', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]', ''],
      ['numRows = 1', '[[1]]', ''],
    ],
    cons: ['1 <= numRows <= 30'],
    fn: { name: 'generate', params: [['int', 'numRows']], ret: 'List<List<Integer>>' },
    tests: [
      { in: [5], out: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] },
      { in: [1], out: [[1]] },
      { in: [2], out: [[1], [1, 1]] },
      { in: [6], out: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]] },
    ],
    hints: [
      'Row i has i + 1 elements, and its first and last elements are 1.',
      'Every inner element row[i][j] = row[i-1][j-1] + row[i-1][j].',
      'Build rows one at a time using the previous row. Alternatively compute each value with the binomial formula C(i, j) = C(i, j-1) * (i - j + 1) / j.',
    ],
    brute: {
      idea: 'Compute every entry independently as the binomial coefficient C(i, j) using factorial-free multiplication.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                row.add((int) nCr(i, j));
            }
            res.add(row);
        }
        return res;
    }

    private long nCr(int n, int r) {
        long result = 1;
        for (int k = 0; k < r; k++) {
            result = result * (n - k) / (k + 1);
        }
        return result;
    }
}`,
      time: 'O(n^3)', space: 'O(1) extra',
    },
    optimal: {
      idea: 'Dynamic programming row by row: each row is built from the previous one.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> triangle = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    row.add(1);
                } else {
                    List<Integer> prev = triangle.get(i - 1);
                    row.add(prev.get(j - 1) + prev.get(j));
                }
            }
            triangle.add(row);
        }
        return triangle;
    }
}`,
      time: 'O(n^2)', space: 'O(n^2) for the output',
    },
    lines: [
      ['List<List<Integer>> triangle = new ArrayList<>();', 'A list of rows; each row is a List<Integer>.'],
      ['for (int j = 0; j <= i; j++)', 'Row i has i + 1 entries.'],
      ['if (j == 0 || j == i) row.add(1);', 'Edges of the triangle are always 1.'],
      ['row.add(prev.get(j - 1) + prev.get(j));', 'Each inner value is the sum of the two values above it.'],
    ],
    cx: 'Total elements = 1 + 2 + … + n = n(n+1)/2 → O(n^2) time and output space.',
    dry: ['row0 [1]', 'row1 [1,1]', 'row2 [1, 1+1, 1] = [1,2,1]', 'row3 [1, 1+2, 2+1, 1] = [1,3,3,1]'],
    tips: ['Variant: return only the k-th row in O(k) space — update a single list from right to left.', 'Mention that entries are binomial coefficients C(i, j).'],
    mistakes: ['Overflow when computing factorials directly for nCr.', 'Off-by-one: generating numRows + 1 rows.'],
    java: ['`List.get(index)` on ArrayList is O(1).', 'Unboxing happens automatically in `prev.get(j - 1) + prev.get(j)`.'],
  },
  {
    id: 'leaders-in-array',
    title: 'Leaders in an Array',
    difficulty: 'Easy',
    desc: "Given an array `arr` of integers, return all the **leaders** in the array. An element is a leader if it is **greater than or equal to** all the elements to its right. The rightmost element is always a leader.\n\nReturn the leaders in the same order as they appear in the array.",
    ex: [
      ['arr = [16, 17, 4, 3, 5, 2]', '[17, 5, 2]', '17 is >= everything to its right, as are 5 and 2.'],
      ['arr = [10, 4, 2, 4, 1]', '[10, 4, 4, 1]', ''],
    ],
    cons: ['1 <= arr.length <= 10^5', '0 <= arr[i] <= 10^9'],
    fn: { name: 'leaders', params: [['int[]', 'arr']], ret: 'List<Integer>' },
    tests: [
      { in: [[16, 17, 4, 3, 5, 2]], out: [17, 5, 2] },
      { in: [[10, 4, 2, 4, 1]], out: [10, 4, 4, 1] },
      { in: [[5]], out: [5] },
      { in: [[1, 2, 3, 4]], out: [4] },
      { in: [[7, 7, 7]], out: [7, 7, 7] },
    ],
    hints: [
      'Checking everything to the right of each element is O(n^2). Which direction makes this easy?',
      'Scan from right to left and keep the maximum seen so far.',
      'An element is a leader if it is >= maxFromRight. Collect leaders while scanning right-to-left, then reverse the list.',
    ],
    brute: {
      idea: 'For each element, check every element to its right.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> leaders(int[] arr) {
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < arr.length; i++) {
            boolean leader = true;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] > arr[i]) { leader = false; break; }
            }
            if (leader) res.add(arr[i]);
        }
        return res;
    }
}`,
      time: 'O(n^2)', space: 'O(1) extra',
    },
    optimal: {
      idea: 'Right-to-left scan with a running maximum, then reverse the collected leaders.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> leaders(int[] arr) {
        List<Integer> res = new ArrayList<>();
        int maxRight = Integer.MIN_VALUE;
        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] >= maxRight) {
                res.add(arr[i]);
                maxRight = arr[i];
            }
        }
        Collections.reverse(res);
        return res;
    }
}`,
      time: 'O(n)', space: 'O(1) extra',
    },
    lines: [
      ['int maxRight = Integer.MIN_VALUE;', 'Maximum of all elements to the right of the current index.'],
      ['for (int i = arr.length - 1; i >= 0; i--)', 'Scan right to left so the "everything to my right" information is already known.'],
      ['if (arr[i] >= maxRight)', '>= because ties still count as leaders in this problem.'],
      ['Collections.reverse(res);', 'We collected leaders right-to-left; reverse to restore original order.'],
    ],
    cx: 'One pass plus a reverse → O(n) time; no extra structures beyond the output.',
    dry: ['[16,17,4,3,5,2], max=-inf', '2 → leader, max=2', '5 → leader, max=5', '3,4 → no', '17 → leader, max=17', '16 → no', 'reverse [2,5,17] → [17,5,2]'],
    tips: ['Clarify strict vs non-strict comparison — it changes the answer for duplicates.', 'Suffix-maximum scanning appears in Trapping Rain Water and Best Time to Buy/Sell Stock too.'],
    mistakes: ['Using > instead of >= (misses equal leaders).', 'Forgetting to reverse the result.'],
    java: ['`Collections.reverse(list)` reverses a List in-place in O(n).', 'Alternatively use `res.add(0, x)`, but that is O(n) per insert on ArrayList → O(n^2).'],
  },
  {
    id: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, find a contiguous non-empty subarray that has the **largest product**, and return the product. The answer is guaranteed to fit in a 32-bit integer.",
    ex: [
      ['nums = [2,3,-2,4]', '6', '[2,3] has the largest product 6.'],
      ['nums = [-2,0,-1]', '0', 'The result cannot be 2, because [-2,-1] is not a contiguous subarray.'],
    ],
    cons: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    fn: { name: 'maxProduct', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[2, 3, -2, 4]], out: 6 },
      { in: [[-2, 0, -1]], out: 0 },
      { in: [[-2]], out: -2 },
      { in: [[-2, 3, -4]], out: 24 },
      { in: [[0, 2]], out: 2 },
      { in: [[2, -5, -2, -4, 3]], out: 24 },
    ],
    hints: [
      'Kadane for sums does not directly work. What makes products different?',
      'A negative number turns the smallest (most negative) product into the largest one.',
      'Track both the maximum and minimum product ending at each index. For nums[i], newMax = max(x, x*max, x*min), newMin = min(x, x*max, x*min).',
    ],
    brute: {
      idea: 'Try every subarray start, extend the end while multiplying, and track the maximum.',
      code: J`class Solution {
    public int maxProduct(int[] nums) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int prod = 1;
            for (int j = i; j < nums.length; j++) {
                prod *= nums[j];
                best = Math.max(best, prod);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Modified Kadane keeping both max and min products ending at the current index (min can flip to max on a negative).',
      code: J`class Solution {
    public int maxProduct(int[] nums) {
        int maxEnd = nums[0], minEnd = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            if (x < 0) {
                int t = maxEnd;
                maxEnd = minEnd;
                minEnd = t;
            }
            maxEnd = Math.max(x, maxEnd * x);
            minEnd = Math.min(x, minEnd * x);
            best = Math.max(best, maxEnd);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int maxEnd = nums[0], minEnd = nums[0], best = nums[0];', 'Max and min product of a subarray ending at the current index, plus the global answer.'],
      ['if (x < 0) swap(maxEnd, minEnd)', 'Multiplying by a negative flips order: the old minimum becomes the candidate for the new maximum.'],
      ['maxEnd = Math.max(x, maxEnd * x);', 'Either extend the best product or start fresh at x (handles zeros resetting the product).'],
      ['minEnd = Math.min(x, minEnd * x);', 'Same for the most negative product.'],
      ['best = Math.max(best, maxEnd);', 'Update the global maximum.'],
    ],
    cx: 'Single pass, constant work per element → O(n) time, O(1) space.',
    dry: ['[2,3,-2,4]', 'start max=2 min=2 best=2', '3: max=6 min=3 best=6', '-2: swap → max=3,min=6 → max=max(-2,-6)=-2, min=min(-2,-12)=-12', '4: max=max(4,-8)=4, min=-48 → best stays 6'],
    tips: ['Point out how zeros act as natural "reset" points.', 'Alternative: prefix and suffix product scans (reset to 1 after zero) — also O(n).'],
    mistakes: ['Tracking only the max product (fails for [-2,3,-4]).', 'Updating maxEnd before computing minEnd using the old maxEnd (use a swap or temp).'],
    java: ['Swap two ints with a temp variable; Java has no tuple swap like Python.'],
  },
  {
    id: 'first-missing-positive',
    title: 'First Missing Positive',
    difficulty: 'Hard',
    desc: "Given an unsorted integer array `nums`, return the **smallest positive integer** that is not present in `nums`.\n\nYou must implement an algorithm that runs in **O(n)** time and uses **O(1)** auxiliary space.",
    ex: [
      ['nums = [1,2,0]', '3', 'The numbers 1 and 2 are present.'],
      ['nums = [3,4,-1,1]', '2', ''],
      ['nums = [7,8,9,11,12]', '1', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    fn: { name: 'firstMissingPositive', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[1, 2, 0]], out: 3 },
      { in: [[3, 4, -1, 1]], out: 2 },
      { in: [[7, 8, 9, 11, 12]], out: 1 },
      { in: [[1]], out: 2 },
      { in: [[1, 1]], out: 2 },
      { in: [[2, 1, 4, 3, 6, 5]], out: 7 },
    ],
    hints: [
      'For an array of length n, the answer is always in the range [1, n + 1]. Why?',
      'Try to use the array itself as a hash table: value v belongs at index v - 1.',
      'Cyclic sort: while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i], swap nums[i] into its correct slot. Then the first index i with nums[i] != i + 1 gives the answer i + 1.',
    ],
    brute: {
      idea: 'Store every number in a HashSet, then check 1, 2, 3, ... until a number is missing.',
      code: J`import java.util.*;

class Solution {
    public int firstMissingPositive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int k = 1;
        while (set.contains(k)) k++;
        return k;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Cyclic sort: place each value v in [1, n] at index v - 1, then scan for the first mismatch.',
      code: J`class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int target = nums[i] - 1;
                int t = nums[target];
                nums[target] = nums[i];
                nums[i] = t;
            }
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (nums[i] > 0 && nums[i] <= n && ...)', 'Only values in [1, n] can affect the answer; others are ignored.'],
      ['nums[nums[i] - 1] != nums[i]', 'Stop if the target slot already holds the right value — prevents infinite loops with duplicates.'],
      ['swap nums[i] with nums[target]', 'Put the value in its home. The value swapped in is processed by the same while loop.'],
      ['if (nums[i] != i + 1) return i + 1;', 'The first slot not holding its own number reveals the smallest missing positive.'],
      ['return n + 1;', 'All of 1..n are present.'],
    ],
    cx: 'Each swap places at least one value in its final position, so there are at most n swaps overall → O(n) despite the nested while. Constant extra space.',
    dry: ['[3,4,-1,1], n=4', 'i=0: 3 → swap with idx2 → [-1,4,3,1]; -1 stop', 'i=1: 4 → swap with idx3 → [-1,1,3,4]; 1 → swap with idx0 → [1,-1,3,4]', 'scan: idx1 holds -1 ≠ 2 → answer 2'],
    tips: ['State the key insight first: the answer lies in [1, n+1]. That justifies using indices as buckets.', 'Cyclic sort also solves Missing Number, Find All Duplicates and Find All Disappeared Numbers.'],
    mistakes: ['Forgetting the duplicate check → infinite loop on [1,1].', 'Using a for loop with if instead of while (the swapped-in value is never placed).'],
    java: ['Watch out for `nums[i] - 1` overflow when nums[i] is Integer.MIN_VALUE; the `nums[i] > 0` check comes first and short-circuits.'],
  },
];
