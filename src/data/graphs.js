const J = String.raw;

const g = (rows) => rows.map((r) => r.split(''));

export default [
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    desc: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the **number of islands**.\n\nAn island is surrounded by water and is formed by connecting adjacent lands **horizontally or vertically**. Assume all four edges of the grid are surrounded by water.",
    ex: [
      ['grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', '1', ''],
      ['grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', '3', ''],
    ],
    cons: ['1 <= m, n <= 300', "grid[i][j] is '0' or '1'"],
    fn: { name: 'numIslands', params: [['char[][]', 'grid']], ret: 'int' },
    tests: [
      { in: [g(['11110', '11010', '11000', '00000'])], out: 1 },
      { in: [g(['11000', '11000', '00100', '00011'])], out: 3 },
      { in: [g(['0'])], out: 0 },
      { in: [g(['1'])], out: 1 },
      { in: [g(['10101', '01010', '10101'])], out: 8 },
    ],
    hints: [
      'Each island is a connected component of land cells.',
      'When you find an unvisited "1", you found a new island. Visit all of its land cells so you do not count them again.',
      'DFS/BFS from each new land cell, marking visited cells (e.g. set them to \'0\'). Count how many searches you start.',
    ],
    brute: {
      idea: 'BFS from each unvisited land cell using a separate visited matrix (does not modify input).',
      code: J`import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length, count = 0;
        boolean[][] seen = new boolean[m][n];
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] != '1' || seen[i][j]) continue;
                count++;
                Queue<int[]> q = new LinkedList<>();
                q.offer(new int[]{i, j});
                seen[i][j] = true;
                while (!q.isEmpty()) {
                    int[] c = q.poll();
                    for (int[] d : dirs) {
                        int r = c[0] + d[0], s = c[1] + d[1];
                        if (r >= 0 && s >= 0 && r < m && s < n && grid[r][s] == '1' && !seen[r][s]) {
                            seen[r][s] = true;
                            q.offer(new int[]{r, s});
                        }
                    }
                }
            }
        }
        return count;
    }
}`,
      time: 'O(m·n)', space: 'O(m·n)',
    },
    optimal: {
      idea: 'DFS flood fill that sinks visited land in-place (no visited array).',
      code: J`class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    sink(grid, i, j);
                }
            }
        }
        return count;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}`,
      time: 'O(m·n)', space: 'O(m·n) recursion worst case',
    },
    lines: [
      ["if (grid[i][j] == '1') { count++; sink(grid, i, j); }", 'Unvisited land → a new island; erase the whole island.'],
      ["if (out of bounds || grid[r][c] != '1') return;", 'Stop at water, visited cells or the border.'],
      ["grid[r][c] = '0';", 'Mark visited by sinking the cell.'],
      ['sink(grid, r ± 1, c); sink(grid, r, c ± 1);', 'Explore the 4 neighbours.'],
    ],
    cx: 'Every cell is visited a constant number of times → O(m·n). Recursion depth can reach m·n for a snake-shaped island; BFS avoids deep recursion.',
    dry: ['grid 2 (3 islands)', '(0,0) → sink 4 cells → count 1', '(2,2) → count 2', '(3,3) → sink (3,3),(3,4) → count 3'],
    tips: ['Ask whether you may modify the input. If not, use a visited array.', 'Union-Find is another valid approach (and handles "Number of Islands II" with dynamic additions).'],
    mistakes: ['Counting diagonal neighbours.', 'Forgetting to mark visited before exploring → infinite recursion.'],
    java: ['Direction arrays `int[][] dirs` keep neighbour loops compact.', 'Deep recursion can throw StackOverflowError on large grids — mention BFS as the safe alternative.'],
  },
  {
    id: 'flood-fill',
    title: 'Flood Fill',
    difficulty: 'Easy',
    desc: "An image is represented by an `m x n` integer grid `image` where `image[i][j]` is the pixel value. You are given three integers `sr`, `sc`, and `color`.\n\nPerform a **flood fill** starting from pixel `image[sr][sc]`: change the starting pixel and every pixel 4-directionally connected to it **with the same original color** to `color`. Return the modified image.",
    ex: [
      ['image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', '[[2,2,2],[2,2,0],[2,0,1]]', 'The bottom-right 1 is not connected 4-directionally.'],
      ['image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', '[[0,0,0],[0,0,0]]', 'Same color — nothing changes.'],
    ],
    cons: ['1 <= m, n <= 50', '0 <= image[i][j], color < 2^16'],
    fn: { name: 'floodFill', params: [['int[][]', 'image'], ['int', 'sr'], ['int', 'sc'], ['int', 'color']], ret: 'int[][]' },
    tests: [
      { in: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], out: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { in: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], out: [[0, 0, 0], [0, 0, 0]] },
      { in: [[[5]], 0, 0, 9], out: [[9]] },
      { in: [[[1, 2], [2, 1]], 0, 1, 7], out: [[1, 7], [2, 1]] },
    ],
    hints: [
      'Remember the original color of the starting pixel.',
      'DFS or BFS to all neighbours with that color, recolouring them.',
      'If the original color equals the new color, return immediately — otherwise the DFS never stops.',
    ],
    brute: {
      idea: 'BFS with a queue.',
      code: J`import java.util.*;

class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int orig = image[sr][sc];
        if (orig == color) return image;
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{sr, sc});
        image[sr][sc] = color;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] c = q.poll();
            for (int[] d : dirs) {
                int r = c[0] + d[0], s = c[1] + d[1];
                if (r >= 0 && s >= 0 && r < image.length && s < image[0].length && image[r][s] == orig) {
                    image[r][s] = color;
                    q.offer(new int[]{r, s});
                }
            }
        }
        return image;
    }
}`,
      time: 'O(m·n)', space: 'O(m·n)',
    },
    optimal: {
      idea: 'Recursive DFS recolouring in place.',
      code: J`class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int orig = image[sr][sc];
        if (orig != color) dfs(image, sr, sc, orig, color);
        return image;
    }

    private void dfs(int[][] img, int r, int c, int orig, int color) {
        if (r < 0 || c < 0 || r >= img.length || c >= img[0].length || img[r][c] != orig) return;
        img[r][c] = color;
        dfs(img, r + 1, c, orig, color);
        dfs(img, r - 1, c, orig, color);
        dfs(img, r, c + 1, orig, color);
        dfs(img, r, c - 1, orig, color);
    }
}`,
      time: 'O(m·n)', space: 'O(m·n) recursion worst case',
    },
    lines: [
      ['int orig = image[sr][sc];', 'Color to replace.'],
      ['if (orig != color) dfs(...)', 'Guard against infinite recursion when nothing needs changing.'],
      ['if (... img[r][c] != orig) return;', 'Stop outside the image or at a different color.'],
      ['img[r][c] = color;', 'Recolour = also marks as visited.'],
    ],
    cx: 'Each pixel processed at most once → O(m·n).',
    dry: ['start (1,1)=1 → recolour 2', 'spread to (0,1),(1,0),(0,0),(0,2),(2,0)', '(2,2) not connected → stays 1'],
    tips: ['The "paint bucket" tool — a friendly intro to grid DFS.'],
    mistakes: ['Missing the same-color guard → StackOverflowError.'],
    java: ['Arrays are references — modifying `img` changes `image`.'],
  },
  {
    id: 'max-area-of-island',
    title: 'Max Area of Island',
    difficulty: 'Medium',
    desc: "You are given an `m x n` binary matrix `grid`. An island is a group of `1`s connected 4-directionally. The **area** of an island is the number of cells with value `1` in it.\n\nReturn the **maximum area** of an island in `grid`. If there is no island, return `0`.",
    ex: [
      ['grid = [[0,0,1,0],[1,1,1,0],[0,1,0,0],[1,0,0,1]]', '5', ''],
      ['grid = [[0,0,0,0,0,0,0,0]]', '0', ''],
    ],
    cons: ['1 <= m, n <= 50', 'grid[i][j] is 0 or 1'],
    fn: { name: 'maxAreaOfIsland', params: [['int[][]', 'grid']], ret: 'int' },
    tests: [
      { in: [[[0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 0, 0, 1]]], out: 5 },
      { in: [[[0, 0, 0, 0, 0, 0, 0, 0]]], out: 0 },
      { in: [[[1, 1], [1, 1]]], out: 4 },
      { in: [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], out: 1 },
    ],
    hints: [
      'Same as Number of Islands, but measure each island.',
      'Let DFS return the number of cells it visited.',
      'area(r, c) = 0 if water/visited, else 1 + area of the 4 neighbours (after marking visited).',
    ],
    brute: {
      idea: 'BFS per island with a visited matrix, counting cells.',
      code: J`import java.util.*;

class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int m = grid.length, n = grid[0].length, best = 0;
        boolean[][] seen = new boolean[m][n];
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 0 || seen[i][j]) continue;
                int area = 0;
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{i, j});
                seen[i][j] = true;
                while (!q.isEmpty()) {
                    int[] c = q.poll();
                    area++;
                    for (int[] d : dirs) {
                        int r = c[0] + d[0], s = c[1] + d[1];
                        if (r >= 0 && s >= 0 && r < m && s < n && grid[r][s] == 1 && !seen[r][s]) {
                            seen[r][s] = true;
                            q.offer(new int[]{r, s});
                        }
                    }
                }
                best = Math.max(best, area);
            }
        return best;
    }
}`,
      time: 'O(m·n)', space: 'O(m·n)',
    },
    optimal: {
      idea: 'DFS that returns the island area and sinks visited cells.',
      code: J`class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int best = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) best = Math.max(best, area(grid, i, j));
            }
        }
        return best;
    }

    private int area(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return 0;
        g[r][c] = 0;
        return 1 + area(g, r + 1, c) + area(g, r - 1, c) + area(g, r, c + 1) + area(g, r, c - 1);
    }
}`,
      time: 'O(m·n)', space: 'O(m·n) recursion worst case',
    },
    lines: [
      ['if (grid[i][j] == 1) best = Math.max(best, area(grid, i, j));', 'Measure each new island.'],
      ['g[r][c] = 0;', 'Mark visited before recursing.'],
      ['return 1 + area(...) + ...;', 'This cell plus the areas reachable from its neighbours.'],
    ],
    cx: 'O(m·n) time; recursion up to O(m·n).',
    dry: ['grid example', 'island at (0,2),(1,0),(1,1),(1,2),(2,1) → area 5', 'others area 1 → max 5'],
    tips: ['Returning values from DFS is a cleaner way to aggregate than global counters.'],
    mistakes: ['Marking visited after recursing → double counting.'],
    java: ['`ArrayDeque` is a faster queue than `LinkedList` (when no nulls are stored).'],
  },
  {
    id: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    desc: "You are given an `m x n` grid where each cell is `0` (empty), `1` (fresh orange) or `2` (rotten orange). Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.\n\nReturn the **minimum number of minutes** that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.",
    ex: [
      ['grid = [[2,1,1],[1,1,0],[0,1,1]]', '4', ''],
      ['grid = [[2,1,1],[0,1,1],[1,0,1]]', '-1', 'The bottom-left orange is never reached.'],
      ['grid = [[0,2]]', '0', 'No fresh oranges at minute 0.'],
    ],
    cons: ['1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2'],
    fn: { name: 'orangesRotting', params: [['int[][]', 'grid']], ret: 'int' },
    tests: [
      { in: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], out: 4 },
      { in: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], out: -1 },
      { in: [[[0, 2]]], out: 0 },
      { in: [[[1]]], out: -1 },
      { in: [[[2, 1, 1], [1, 1, 1], [1, 1, 2]]], out: 2 },
    ],
    hints: [
      'Rot spreads from ALL rotten oranges at the same time.',
      'Multi-source BFS: start the queue with every rotten orange.',
      'Process the queue level by level (one level = one minute). Count fresh oranges; if any remain at the end, return -1.',
    ],
    brute: {
      idea: 'Simulate minute by minute: scan the whole grid each minute and rot neighbours of rotten oranges.',
      code: J`class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (true) {
            boolean changed = false;
            int[][] next = new int[m][];
            for (int i = 0; i < m; i++) next[i] = grid[i].clone();
            for (int i = 0; i < m; i++)
                for (int j = 0; j < n; j++)
                    if (grid[i][j] == 2)
                        for (int[] d : dirs) {
                            int r = i + d[0], c = j + d[1];
                            if (r >= 0 && c >= 0 && r < m && c < n && next[r][c] == 1) { next[r][c] = 2; changed = true; }
                        }
            grid = next;
            if (!changed) break;
            minutes++;
        }
        for (int[] row : grid) for (int v : row) if (v == 1) return -1;
        return minutes;
    }
}`,
      time: 'O((m·n)^2)', space: 'O(m·n)',
    },
    optimal: {
      idea: 'Multi-source BFS from all rotten oranges, counting levels.',
      code: J`import java.util.*;

class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0;
        Queue<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        }
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            for (int size = q.size(); size > 0; size--) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int r = cell[0] + d[0], c = cell[1] + d[1];
                    if (r >= 0 && c >= 0 && r < m && c < n && grid[r][c] == 1) {
                        grid[r][c] = 2;
                        fresh--;
                        q.offer(new int[]{r, c});
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
      time: 'O(m·n)', space: 'O(m·n)',
    },
    lines: [
      ['if (grid[i][j] == 2) q.offer(...); else if (== 1) fresh++;', 'All rotten oranges are BFS sources at minute 0; count fresh ones.'],
      ['while (!q.isEmpty() && fresh > 0)', 'Stop when nothing fresh remains (avoids counting an extra minute).'],
      ['for (int size = q.size(); size > 0; size--)', 'Process exactly one minute (one BFS level).'],
      ['grid[r][c] = 2; fresh--; q.offer(...);', 'Rot the neighbour and schedule it for the next minute.'],
      ['return fresh == 0 ? minutes : -1;', 'Unreachable fresh oranges → -1.'],
    ],
    cx: 'Each cell enters the queue at most once → O(m·n).',
    dry: ['[[2,1,1],[1,1,0],[0,1,1]]', 'min1: (0,1),(1,0)', 'min2: (0,2),(1,1)', 'min3: (2,1)', 'min4: (2,2) → fresh 0 → 4'],
    tips: ['Multi-source BFS also solves 01 Matrix, Walls and Gates, and As Far from Land as Possible.'],
    mistakes: ['Running a separate BFS from each rotten orange.', 'Off-by-one: incrementing minutes after the last level.'],
    java: ['`for (int size = q.size(); size > 0; size--)` captures the level size once.'],
  },
  {
    id: 'number-of-provinces',
    title: 'Number of Provinces',
    difficulty: 'Medium',
    desc: "There are `n` cities. Some of them are connected directly or indirectly. A **province** is a group of directly or indirectly connected cities and no other cities outside of the group.\n\nYou are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if city `i` and city `j` are directly connected. Return the total number of provinces.",
    ex: [
      ['isConnected = [[1,1,0],[1,1,0],[0,0,1]]', '2', ''],
      ['isConnected = [[1,0,0],[0,1,0],[0,0,1]]', '3', ''],
    ],
    cons: ['1 <= n <= 200', 'isConnected[i][i] == 1', 'isConnected is symmetric'],
    fn: { name: 'findCircleNum', params: [['int[][]', 'isConnected']], ret: 'int' },
    tests: [
      { in: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], out: 2 },
      { in: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], out: 3 },
      { in: [[[1]]], out: 1 },
      { in: [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], out: 1 },
    ],
    hints: [
      'Provinces are connected components of an undirected graph.',
      'DFS from each unvisited city marks its whole province.',
      'Union-Find: union every connected pair; the answer is the number of distinct roots.',
    ],
    brute: {
      idea: 'DFS over the adjacency matrix with a visited array.',
      code: J`class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, count = 0;
        boolean[] seen = new boolean[n];
        for (int i = 0; i < n; i++) {
            if (!seen[i]) { count++; dfs(isConnected, i, seen); }
        }
        return count;
    }

    private void dfs(int[][] g, int u, boolean[] seen) {
        seen[u] = true;
        for (int v = 0; v < g.length; v++) {
            if (g[u][v] == 1 && !seen[v]) dfs(g, v, seen);
        }
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Union-Find (disjoint set union) with path compression and union by rank.',
      code: J`class Solution {
    private int[] parent, rank;

    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, components = n;
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1 && union(i, j)) components--;
            }
        }
        return components;
    }

    private int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    private boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
      time: 'O(n^2 · α(n))', space: 'O(n)',
    },
    lines: [
      ['parent[i] = i;', 'Every city starts in its own set.'],
      ['if (isConnected[i][j] == 1 && union(i, j)) components--;', 'Each successful union merges two provinces into one.'],
      ['if (parent[x] != x) parent[x] = find(parent[x]);', 'Path compression: point nodes directly at the root.'],
      ['if (rank[ra] < rank[rb]) swap', 'Union by rank: attach the shorter tree under the taller one.'],
    ],
    cx: 'The matrix has n^2 entries; each union/find is nearly O(1) (inverse Ackermann α). Both approaches are O(n^2) because reading the matrix dominates.',
    dry: ['[[1,1,0],[1,1,0],[0,0,1]]', 'start 3 components', 'union(0,1) → 2', 'no more edges → 2'],
    tips: ['Union-Find is a must-know template: Redundant Connection, Accounts Merge, Kruskal\'s MST.'],
    mistakes: ['Counting edges instead of components.'],
    java: ['Instance arrays avoid passing parent/rank to every helper call.'],
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    desc: "There are a total of `numCourses` courses you have to take, labelled `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you **must take course `b` first** if you want to take course `a`.\n\nReturn `true` if you can finish all courses, otherwise `false`.",
    ex: [
      ['numCourses = 2, prerequisites = [[1,0]]', 'true', 'Take course 0, then course 1.'],
      ['numCourses = 2, prerequisites = [[1,0],[0,1]]', 'false', 'Circular dependency.'],
    ],
    cons: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'All pairs are unique'],
    fn: { name: 'canFinish', params: [['int', 'numCourses'], ['int[][]', 'prerequisites']], ret: 'boolean' },
    tests: [
      { in: [2, [[1, 0]]], out: true },
      { in: [2, [[1, 0], [0, 1]]], out: false },
      { in: [1, []], out: true },
      { in: [4, [[1, 0], [2, 1], [3, 2]]], out: true },
      { in: [3, [[0, 1], [1, 2], [2, 0]]], out: false },
      { in: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], out: true },
    ],
    hints: [
      'Model courses as a directed graph b → a. When is it impossible to finish?',
      'When the graph contains a cycle.',
      'Kahn\'s algorithm: compute in-degrees, BFS from all courses with in-degree 0, decrement neighbours. If you process all courses, there is no cycle.',
    ],
    brute: {
      idea: 'DFS cycle detection with three colours (unvisited / visiting / done).',
      code: J`import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        for (int[] p : prerequisites) g.get(p[1]).add(p[0]);
        int[] state = new int[numCourses];
        for (int i = 0; i < numCourses; i++) if (hasCycle(g, i, state)) return false;
        return true;
    }

    private boolean hasCycle(List<List<Integer>> g, int u, int[] state) {
        if (state[u] == 1) return true;
        if (state[u] == 2) return false;
        state[u] = 1;
        for (int v : g.get(u)) if (hasCycle(g, v, state)) return true;
        state[u] = 2;
        return false;
    }
}`,
      time: 'O(V + E)', space: 'O(V + E)',
    },
    optimal: {
      idea: 'Kahn\'s topological sort (BFS on in-degrees) — iterative, no recursion depth issues.',
      code: J`import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.offer(i);
        }
        int taken = 0;
        while (!q.isEmpty()) {
            int course = q.poll();
            taken++;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) q.offer(next);
            }
        }
        return taken == numCourses;
    }
}`,
      time: 'O(V + E)', space: 'O(V + E)',
    },
    lines: [
      ['graph.get(p[1]).add(p[0]); indegree[p[0]]++;', 'Edge prerequisite → course; course has one more unmet prerequisite.'],
      ['if (indegree[i] == 0) q.offer(i);', 'Courses with no prerequisites can be taken immediately.'],
      ['if (--indegree[next] == 0) q.offer(next);', 'Taking this course unlocks courses whose last prerequisite it was.'],
      ['return taken == numCourses;', 'Courses inside a cycle never reach in-degree 0.'],
    ],
    cx: 'Each vertex and edge processed once → O(V + E). Adjacency list O(V + E).',
    dry: ['n=4, chain 0→1→2→3', 'queue [0] → take 0, unlock 1 → take 1 → 2 → 3', 'taken 4 == 4 → true'],
    tips: ['Course Schedule II asks for the order itself — record the polled courses.', 'Explain both DFS colouring and Kahn\'s algorithm.'],
    mistakes: ['Reversing the edge direction (still detects cycles, but gives the reversed order in Course Schedule II).'],
    java: ['`List<List<Integer>>` adjacency list is the idiomatic Java graph representation.'],
  },
  {
    id: 'find-if-path-exists',
    title: 'Find if Path Exists in Graph',
    difficulty: 'Easy',
    desc: "There is a **bi-directional** graph with `n` vertices labelled `0` to `n - 1`. The edges are given as a 2D array `edges`, where `edges[i] = [u, v]` denotes an edge between `u` and `v`.\n\nReturn `true` if there is a valid path from `source` to `destination`, or `false` otherwise.",
    ex: [
      ['n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2', 'true', ''],
      ['n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5', 'false', ''],
    ],
    cons: ['1 <= n <= 2 * 10^5', '0 <= edges.length <= 2 * 10^5', 'No duplicate edges or self loops'],
    fn: { name: 'validPath', params: [['int', 'n'], ['int[][]', 'edges'], ['int', 'source'], ['int', 'destination']], ret: 'boolean' },
    tests: [
      { in: [3, [[0, 1], [1, 2], [2, 0]], 0, 2], out: true },
      { in: [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], out: false },
      { in: [1, [], 0, 0], out: true },
      { in: [4, [[0, 1], [2, 3]], 1, 0], out: true },
      { in: [5, [[0, 4], [4, 3], [3, 2]], 0, 2], out: true },
    ],
    hints: [
      'Build an adjacency list first.',
      'BFS or DFS from source; stop when you reach destination.',
      'Union-Find also works: union all edges and check find(source) == find(destination).',
    ],
    brute: {
      idea: 'Union-Find over all edges.',
      code: J`class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) parent[find(parent, e[0])] = find(parent, e[1]);
        return find(parent, source) == find(parent, destination);
    }

    private int find(int[] p, int x) {
        while (p[x] != x) {
            p[x] = p[p[x]];
            x = p[x];
        }
        return x;
    }
}`,
      time: 'O(E · α(n)) amortised', space: 'O(n)',
    },
    optimal: {
      idea: 'BFS from source with early exit (also gives shortest path length if needed).',
      code: J`import java.util.*;

class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        boolean[] seen = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(source);
        seen[source] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (u == destination) return true;
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    q.offer(v);
                }
            }
        }
        return false;
    }
}`,
      time: 'O(V + E)', space: 'O(V + E)',
    },
    lines: [
      ['adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]);', 'Undirected edge: add both directions.'],
      ['seen[source] = true;', 'Mark when enqueuing so a node is never queued twice.'],
      ['if (u == destination) return true;', 'Early exit.'],
    ],
    cx: 'Each vertex and edge processed at most once → O(V + E).',
    dry: ['n=6, source 0, dest 5', 'visit 0 → 1, 2', 'queue empties without reaching 5 → false'],
    tips: ['Template for every BFS problem on graphs: adjacency list + visited + queue.'],
    mistakes: ['Marking visited when polling instead of when offering → duplicates in the queue.'],
    java: ['`ArrayDeque<Integer>` as a queue: offer/poll.'],
  },
  {
    id: 'is-graph-bipartite',
    title: 'Is Graph Bipartite?',
    difficulty: 'Medium',
    desc: "There is an **undirected** graph with `n` nodes, numbered `0` to `n - 1`. You are given `graph`, where `graph[u]` is an array of nodes adjacent to `u`.\n\nA graph is **bipartite** if the nodes can be partitioned into two sets A and B such that every edge connects a node in A and a node in B. Return `true` if the graph is bipartite. The graph may be disconnected.",
    ex: [
      ['graph = [[1,2,3],[0,2],[0,1,3],[0,2]]', 'false', 'Nodes 0, 1, 2 form a triangle.'],
      ['graph = [[1,3],[0,2],[1,3],[0,2]]', 'true', 'Sets {0, 2} and {1, 3}.'],
    ],
    cons: ['1 <= n <= 100', 'graph[u] does not contain u', 'The graph is undirected'],
    fn: { name: 'isBipartite', params: [['int[][]', 'graph']], ret: 'boolean' },
    tests: [
      { in: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]], out: false },
      { in: [[[1, 3], [0, 2], [1, 3], [0, 2]]], out: true },
      { in: [[[]]], out: true },
      { in: [[[1], [0], [3], [2]]], out: true },
      { in: [[[1], [0, 2], [1, 3], [2, 4], [3, 0]]], out: false },
    ],
    hints: [
      'Try to colour the graph with two colours so that neighbours always differ.',
      'BFS/DFS: give the start node colour 0, its neighbours colour 1, their neighbours colour 0, ...',
      'If you ever see an edge between two nodes of the same colour, it is not bipartite. Start a new BFS for each uncoloured node (disconnected graphs).',
    ],
    brute: {
      idea: 'Recursive DFS two-colouring.',
      code: J`import java.util.*;

class Solution {
    public boolean isBipartite(int[][] graph) {
        int[] color = new int[graph.length];
        Arrays.fill(color, -1);
        for (int i = 0; i < graph.length; i++) {
            if (color[i] == -1 && !dfs(graph, i, 0, color)) return false;
        }
        return true;
    }

    private boolean dfs(int[][] g, int u, int c, int[] color) {
        color[u] = c;
        for (int v : g[u]) {
            if (color[v] == c) return false;
            if (color[v] == -1 && !dfs(g, v, 1 - c, color)) return false;
        }
        return true;
    }
}`,
      time: 'O(V + E)', space: 'O(V)',
    },
    optimal: {
      idea: 'Iterative BFS two-colouring over every component.',
      code: J`import java.util.*;

class Solution {
    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int start = 0; start < n; start++) {
            if (color[start] != -1) continue;
            Queue<Integer> q = new ArrayDeque<>();
            q.offer(start);
            color[start] = 0;
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : graph[u]) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.offer(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}`,
      time: 'O(V + E)', space: 'O(V)',
    },
    lines: [
      ['Arrays.fill(color, -1);', '-1 = uncoloured, 0 and 1 are the two sets.'],
      ['for (int start = 0; start < n; start++)', 'Handle disconnected components.'],
      ['color[v] = 1 - color[u];', 'Neighbour gets the opposite colour.'],
      ['else if (color[v] == color[u]) return false;', 'Conflict: an edge inside one set (odd cycle).'],
    ],
    cx: 'Each node and edge examined once → O(V + E).',
    dry: ['graph 2', '0 → colour 0; neighbours 1, 3 → colour 1', '2 → colour 0 (from 1); check 3 is colour 1 ✓ → true'],
    tips: ['Bipartite ⇔ no odd-length cycle.', 'Used in Possible Bipartition (dislikes graph).'],
    mistakes: ['Only starting BFS from node 0 (misses other components).'],
    java: ['`1 - c` toggles between 0 and 1.'],
  },
  {
    id: 'network-delay-time',
    title: 'Network Delay Time',
    difficulty: 'Medium',
    desc: "You are given a network of `n` nodes, labelled `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u, v, w)`, where `u` is the source, `v` the target, and `w` the time a signal takes to travel from `u` to `v`.\n\nWe send a signal from node `k`. Return the **minimum time** it takes for all `n` nodes to receive the signal. If it is impossible, return `-1`.",
    ex: [
      ['times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', '2', ''],
      ['times = [[1,2,1]], n = 2, k = 1', '1', ''],
      ['times = [[1,2,1]], n = 2, k = 2', '-1', ''],
    ],
    cons: ['1 <= k <= n <= 100', '1 <= times.length <= 6000', '0 <= w <= 100', 'All (u, v) pairs are unique'],
    fn: { name: 'networkDelayTime', params: [['int[][]', 'times'], ['int', 'n'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], out: 2 },
      { in: [[[1, 2, 1]], 2, 1], out: 1 },
      { in: [[[1, 2, 1]], 2, 2], out: -1 },
      { in: [[[1, 2, 5], [1, 3, 1], [3, 2, 1]], 3, 1], out: 2 },
      { in: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], out: 3 },
    ],
    hints: [
      'The answer is the longest of the shortest paths from k to every node.',
      'Non-negative weights → Dijkstra\'s algorithm.',
      'PriorityQueue of (distance, node). Pop the smallest; skip if outdated; relax its outgoing edges. Answer = max distance, or -1 if some node is unreachable.',
    ],
    brute: {
      idea: 'Bellman–Ford: relax all edges n - 1 times.',
      code: J`import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        int INF = Integer.MAX_VALUE / 2;
        int[] dist = new int[n + 1];
        Arrays.fill(dist, INF);
        dist[k] = 0;
        for (int round = 1; round < n; round++) {
            for (int[] t : times) {
                if (dist[t[0]] + t[2] < dist[t[1]]) dist[t[1]] = dist[t[0]] + t[2];
            }
        }
        int ans = 0;
        for (int v = 1; v <= n; v++) ans = Math.max(ans, dist[v]);
        return ans >= INF ? -1 : ans;
    }
}`,
      time: 'O(V · E)', space: 'O(V)',
    },
    optimal: {
      idea: 'Dijkstra with a binary-heap priority queue.',
      code: J`import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});

        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] e : adj.get(u)) {
                int v = e[0], nd = d + e[1];
                if (nd < dist[v]) {
                    dist[v] = nd;
                    pq.offer(new int[]{nd, v});
                }
            }
        }
        int ans = 0;
        for (int v = 1; v <= n; v++) {
            if (dist[v] == Integer.MAX_VALUE) return -1;
            ans = Math.max(ans, dist[v]);
        }
        return ans;
    }
}`,
      time: 'O(E log V)', space: 'O(V + E)',
    },
    lines: [
      ['adj.get(t[0]).add(new int[]{t[1], t[2]});', 'Directed weighted edge stored as {target, weight}.'],
      ['PriorityQueue<int[]> pq = ... compare(a[0], b[0])', 'Min-heap by tentative distance.'],
      ['if (d > dist[u]) continue;', 'Lazy deletion: skip stale queue entries.'],
      ['if (nd < dist[v]) { dist[v] = nd; pq.offer(...); }', 'Relaxation: found a shorter path to v.'],
      ['if (dist[v] == Integer.MAX_VALUE) return -1;', 'Unreachable node.'],
      ['ans = Math.max(ans, dist[v]);', 'The signal reaches everyone when the farthest node receives it.'],
    ],
    cx: 'Each edge relaxation may push into the heap → O(E log E) = O(E log V). Adjacency list O(V + E).',
    dry: ['times [[1,2,5],[1,3,1],[3,2,1]], k=1', 'pop (0,1) → dist2=5, dist3=1', 'pop (1,3) → dist2=min(5,2)=2', 'pop (2,2); pop stale (5,2) skipped', 'max = 2'],
    tips: ['Dijkstra fails with negative weights → Bellman–Ford.', 'Know the "skip stale entries" trick since Java\'s PriorityQueue has no decrease-key.'],
    mistakes: ['Overflow from dist + w when dist is Integer.MAX_VALUE (Bellman–Ford uses MAX / 2 to avoid it).'],
    java: ['`PriorityQueue<int[]>` with a lambda comparator is the standard Dijkstra setup in Java.'],
  },
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    desc: "A **transformation sequence** from `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words where every adjacent pair differs by a **single letter**, and every word after `beginWord` is in `wordList`.\n\nReturn the **number of words** in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.",
    ex: [
      ['beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', '5', 'hit → hot → dot → dog → cog.'],
      ['beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', '0', 'endWord is not in the list.'],
    ],
    cons: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'All words are lowercase and unique'],
    fn: { name: 'ladderLength', params: [['String', 'beginWord'], ['String', 'endWord'], ['List<String>', 'wordList']], ret: 'int' },
    tests: [
      { in: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], out: 5 },
      { in: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], out: 0 },
      { in: ['a', 'c', ['a', 'b', 'c']], out: 2 },
      { in: ['hot', 'dog', ['hot', 'dog']], out: 0 },
      { in: ['lost', 'cost', ['most', 'fist', 'lost', 'cost', 'fish']], out: 2 },
    ],
    hints: [
      'Words are nodes; an edge connects words differing by one letter. Shortest path in an unweighted graph → BFS.',
      'Comparing every pair of words to build edges is O(N^2 · L).',
      'During BFS, generate neighbours by changing each position to \'a\'..\'z\' and checking a HashSet; remove words from the set when visited.',
    ],
    brute: {
      idea: 'BFS where neighbours are found by comparing the current word against every unvisited dictionary word.',
      code: J`import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if (!wordList.contains(endWord)) return 0;
        boolean[] used = new boolean[wordList.size()];
        Queue<String> q = new LinkedList<>();
        q.offer(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            for (int s = q.size(); s > 0; s--) {
                String w = q.poll();
                if (w.equals(endWord)) return steps;
                for (int i = 0; i < wordList.size(); i++) {
                    if (!used[i] && oneApart(w, wordList.get(i))) { used[i] = true; q.offer(wordList.get(i)); }
                }
            }
            steps++;
        }
        return 0;
    }

    private boolean oneApart(String a, String b) {
        int diff = 0;
        for (int i = 0; i < a.length(); i++) if (a.charAt(i) != b.charAt(i) && ++diff > 1) return false;
        return diff == 1;
    }
}`,
      time: 'O(N^2 · L)', space: 'O(N)',
    },
    optimal: {
      idea: 'BFS generating neighbours by single-character substitutions against a HashSet.',
      code: J`import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        Queue<String> q = new ArrayDeque<>();
        q.offer(beginWord);
        dict.remove(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            for (int size = q.size(); size > 0; size--) {
                char[] w = q.poll().toCharArray();
                for (int i = 0; i < w.length; i++) {
                    char orig = w[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == orig) continue;
                        w[i] = c;
                        String next = new String(w);
                        if (next.equals(endWord)) return steps + 1;
                        if (dict.remove(next)) q.offer(next);
                    }
                    w[i] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
}`,
      time: 'O(N · L · 26 · L)', space: 'O(N · L)',
    },
    lines: [
      ['Set<String> dict = new HashSet<>(wordList);', 'O(1) average membership tests.'],
      ['dict.remove(beginWord);', 'Never revisit the start.'],
      ["for (char c = 'a'; c <= 'z'; c++) { w[i] = c; ... }", 'Generate all 25·L one-letter variations.'],
      ['if (next.equals(endWord)) return steps + 1;', 'Reached the target in the next layer.'],
      ['if (dict.remove(next)) q.offer(next);', 'remove returns true only for unvisited dictionary words — doubles as the visited check.'],
      ['w[i] = orig;', 'Restore the character before changing the next position.'],
    ],
    cx: 'Each of N words is dequeued once; for each we try 26·L variations and build/hash strings of length L → O(N·26·L²). Bidirectional BFS speeds this up in practice.',
    dry: ['hit → hot (layer 2)', 'hot → dot, lot (layer 3)', 'dot → dog, lot → log (layer 4)', 'dog → cog → return 5'],
    tips: ['Mention bidirectional BFS as the optimisation.', 'Word Ladder II (all shortest paths) needs BFS + backtracking over parents.'],
    mistakes: ['Using DFS (finds a path, not the shortest).', 'Forgetting to mark visited → exponential blow-up.'],
    java: ['`List.contains` is O(N); convert to a HashSet first.', 'Mutating a char[] and creating `new String(w)` is cheaper than substring concatenation.'],
  },
];
