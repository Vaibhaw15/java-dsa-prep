const J = String.raw;
const N = null;

export default [
  {
    id: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    desc: "Given the `root` of a binary tree, return the **inorder traversal** of its nodes' values (left subtree, node, right subtree).\n\nTrees are written in level order, where `null` means a missing child. Follow-up: recursion is trivial — can you do it iteratively?",
    ex: [
      ['root = [1,null,2,3]', '[1,3,2]', ''],
      ['root = [1,2,3,4,5,null,8,null,null,6,7,9]', '[4,2,6,5,7,1,3,9,8]', ''],
      ['root = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    fn: { name: 'inorderTraversal', params: [['TreeNode', 'root']], ret: 'List<Integer>' },
    tests: [
      { in: [[1, N, 2, 3]], out: [1, 3, 2] },
      { in: [[1, 2, 3, 4, 5, N, 8, N, N, 6, 7, 9]], out: [4, 2, 6, 5, 7, 1, 3, 9, 8] },
      { in: [[]], out: [] },
      { in: [[1]], out: [1] },
      { in: [[4, 2, 6, 1, 3, 5, 7]], out: [1, 2, 3, 4, 5, 6, 7] },
    ],
    hints: [
      'Recursive: inorder(left), visit(node), inorder(right).',
      'Iteratively, simulate the call stack with an explicit Stack.',
      'Push all left children; pop a node, visit it, then move to its right child and repeat.',
    ],
    brute: {
      idea: 'Straightforward recursion.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, res);
        return res;
    }

    private void dfs(TreeNode node, List<Integer> res) {
        if (node == null) return;
        dfs(node.left, res);
        res.add(node.val);
        dfs(node.right, res);
    }
}`,
      time: 'O(n)', space: 'O(h) recursion',
    },
    optimal: {
      idea: 'Iterative traversal with an explicit stack (no recursion — safe for very deep trees).',
      code: J`import java.util.*;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            res.add(curr.val);
            curr = curr.right;
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['while (curr != null || !stack.isEmpty())', 'Continue while there is a subtree to explore or a node waiting to be visited.'],
      ['while (curr != null) { stack.push(curr); curr = curr.left; }', 'Go as far left as possible, remembering the path.'],
      ['curr = stack.pop(); res.add(curr.val);', 'The leftmost unvisited node is next in inorder.'],
      ['curr = curr.right;', 'Then traverse its right subtree.'],
    ],
    cx: 'Every node is pushed and popped once → O(n). The stack holds at most h nodes (tree height). Morris traversal achieves O(1) space by temporarily threading the tree.',
    dry: ['[1,null,2,3]', 'push 1 → pop 1 (visit 1) → curr=2', 'push 2, push 3 → pop 3 (visit) → pop 2 (visit)', '→ [1,3,2]'],
    tips: ['Inorder of a BST is sorted — used by Validate BST and Kth Smallest.', 'Know preorder/postorder iterative versions too.'],
    mistakes: ['Forgetting the outer condition `curr != null` → stops early.'],
    java: ['`Deque<TreeNode>` as a stack: push/pop/peek. Avoid the legacy `Stack` class.'],
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    desc: "Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (from left to right, level by level).",
    ex: [
      ['root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]', ''],
      ['root = [1]', '[[1]]', ''],
      ['root = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 2000', '-1000 <= Node.val <= 1000'],
    fn: { name: 'levelOrder', params: [['TreeNode', 'root']], ret: 'List<List<Integer>>' },
    tests: [
      { in: [[3, 9, 20, N, N, 15, 7]], out: [[3], [9, 20], [15, 7]] },
      { in: [[1]], out: [[1]] },
      { in: [[]], out: [] },
      { in: [[1, 2, 3, 4, N, N, 5]], out: [[1], [2, 3], [4, 5]] },
    ],
    hints: [
      'Breadth-first search visits nodes level by level. Which data structure does BFS use?',
      'Use a Queue. How do you know where one level ends?',
      'At the start of each level, the queue size is the number of nodes in that level. Process exactly that many.',
    ],
    brute: {
      idea: 'DFS with a depth parameter, appending each value to the list for its depth.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(root, 0, res);
        return res;
    }

    private void dfs(TreeNode node, int depth, List<List<Integer>> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(new ArrayList<>());
        res.get(depth).add(node.val);
        dfs(node.left, depth + 1, res);
        dfs(node.right, depth + 1, res);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    optimal: {
      idea: 'BFS with a queue, processing one level per outer iteration.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(w), w = max width',
    },
    lines: [
      ['Queue<TreeNode> queue = new LinkedList<>();', 'FIFO queue for BFS (ArrayDeque also works, but it rejects null).'],
      ['int size = queue.size();', 'Snapshot of the current level\'s node count.'],
      ['TreeNode node = queue.poll();', 'Remove from the front.'],
      ['if (node.left != null) queue.offer(node.left);', 'Children are queued for the next level.'],
      ['res.add(level);', 'One list per level.'],
    ],
    cx: 'Every node enqueued/dequeued once → O(n). The queue holds at most one full level → O(w), up to n/2.',
    dry: ['[3,9,20,null,null,15,7]', 'level0 size1: 3 → queue [9,20]', 'level1 size2: 9,20 → queue [15,7]', 'level2: 15,7'],
    tips: ['Variants with the same template: Zigzag Level Order, Right Side View, Average of Levels, Minimum Depth.'],
    mistakes: ['Using queue.size() in the for-loop condition (it changes as you add children).'],
    java: ['`Queue` methods: offer/poll/peek return special values; add/remove/element throw exceptions.'],
  },
  {
    id: 'maximum-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    desc: "Given the `root` of a binary tree, return its **maximum depth**: the number of nodes along the longest path from the root down to the farthest leaf.",
    ex: [
      ['root = [3,9,20,null,null,15,7]', '3', ''],
      ['root = [1,null,2]', '2', ''],
    ],
    cons: ['0 <= number of nodes <= 10^4', '-100 <= Node.val <= 100'],
    fn: { name: 'maxDepth', params: [['TreeNode', 'root']], ret: 'int' },
    tests: [
      { in: [[3, 9, 20, N, N, 15, 7]], out: 3 },
      { in: [[1, N, 2]], out: 2 },
      { in: [[]], out: 0 },
      { in: [[1, 2, N, 3, N, 4]], out: 4 },
    ],
    hints: [
      'Depth of a tree = 1 + depth of its deeper subtree.',
      'What is the depth of an empty tree?',
      'return root == null ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).',
    ],
    brute: {
      idea: 'BFS counting levels.',
      code: J`import java.util.*;

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int depth = 0;
        while (!q.isEmpty()) {
            depth++;
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
        }
        return depth;
    }
}`,
      time: 'O(n)', space: 'O(w)',
    },
    optimal: {
      idea: 'Recursive DFS — the cleanest interview answer.',
      code: J`class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        int left = maxDepth(root.left);
        int right = maxDepth(root.right);
        return 1 + Math.max(left, right);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (root == null) return 0;', 'Base case: an empty tree has depth 0.'],
      ['int left = maxDepth(root.left);', 'Trust the recursion to solve the subproblem.'],
      ['return 1 + Math.max(left, right);', 'Count this node plus the deeper side.'],
    ],
    cx: 'Each node visited once → O(n). Recursion depth = height h (O(log n) balanced, O(n) skewed).',
    dry: ['[3,9,20,null,null,15,7]', 'depth(9)=1, depth(15)=depth(7)=1 → depth(20)=2', 'depth(3)=1+max(1,2)=3'],
    tips: ['Many tree problems are "compute something from left and right results" — this is the simplest example.'],
    mistakes: ['Returning -1 for null (that counts edges instead of nodes).'],
    java: ['Default JVM stack handles ~10^4 recursion depth for simple frames; for skewed trees of 10^5+ nodes use iteration.'],
  },
  {
    id: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    desc: "Given the roots of two binary trees `p` and `q`, write a function to check if they are the **same**: structurally identical, with the same node values.",
    ex: [
      ['p = [1,2,3], q = [1,2,3]', 'true', ''],
      ['p = [1,2], q = [1,null,2]', 'false', ''],
      ['p = [1,2,1], q = [1,1,2]', 'false', ''],
    ],
    cons: ['0 <= number of nodes <= 100', '-10^4 <= Node.val <= 10^4'],
    fn: { name: 'isSameTree', params: [['TreeNode', 'p'], ['TreeNode', 'q']], ret: 'boolean' },
    tests: [
      { in: [[1, 2, 3], [1, 2, 3]], out: true },
      { in: [[1, 2], [1, N, 2]], out: false },
      { in: [[1, 2, 1], [1, 1, 2]], out: false },
      { in: [[], []], out: true },
      { in: [[1], []], out: false },
    ],
    hints: [
      'Two empty trees are the same. One empty, one not → different.',
      'Otherwise, the roots must match and both subtree pairs must be the same.',
      'Recursive: p.val == q.val && same(p.left, q.left) && same(p.right, q.right).',
    ],
    brute: {
      idea: 'Serialize both trees (with null markers) and compare the strings.',
      code: J`class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        return ser(p).equals(ser(q));
    }

    private String ser(TreeNode n) {
        if (n == null) return "#";
        return n.val + "(" + ser(n.left) + "," + ser(n.right) + ")";
    }
}`,
      time: 'O(n^2) worst case (string concat)', space: 'O(n)',
    },
    optimal: {
      idea: 'Simultaneous recursive comparison with early exit.',
      code: J`class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (p == null && q == null) return true;', 'Both subtrees empty → identical.'],
      ['if (p == null || q == null) return false;', 'Exactly one empty → structure differs.'],
      ['if (p.val != q.val) return false;', 'Values differ.'],
      ['return same(left) && same(right);', '&& short-circuits on the first mismatch.'],
    ],
    cx: 'Visits each node pair at most once → O(min(n, m)). Recursion O(h).',
    dry: ['p=[1,2], q=[1,null,2]', 'roots 1 == 1', 'left: 2 vs null → false'],
    tips: ['Used as a helper in Subtree of Another Tree.'],
    mistakes: ['Checking values before null checks → NullPointerException.'],
    java: ['Order of the null checks matters because `p.val` dereferences p.'],
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    desc: "Given the `root` of a binary tree, **invert the tree** (mirror it: swap every node's left and right children), and return its root.",
    ex: [
      ['root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]', ''],
      ['root = [2,1,3]', '[2,3,1]', ''],
      ['root = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    fn: { name: 'invertTree', params: [['TreeNode', 'root']], ret: 'TreeNode' },
    tests: [
      { in: [[4, 2, 7, 1, 3, 6, 9]], out: [4, 7, 2, 9, 6, 3, 1] },
      { in: [[2, 1, 3]], out: [2, 3, 1] },
      { in: [[]], out: [] },
      { in: [[1, 2]], out: [1, N, 2] },
    ],
    hints: [
      'What does inverting a single node mean?',
      'Swap its left and right children — then invert each child subtree.',
      'Recursion: left = invert(root.right), right = invert(root.left). Or BFS swapping children of every node.',
    ],
    brute: {
      idea: 'BFS: visit every node with a queue and swap its children.',
      code: J`import java.util.*;

class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            TreeNode t = n.left; n.left = n.right; n.right = t;
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        return root;
    }
}`,
      time: 'O(n)', space: 'O(w)',
    },
    optimal: {
      idea: 'Recursive post-order swap.',
      code: J`class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (root == null) return null;', 'Nothing to invert.'],
      ['TreeNode left = invertTree(root.left);', 'Invert both subtrees first (save results before overwriting).'],
      ['root.left = right; root.right = left;', 'Swap the inverted subtrees.'],
    ],
    cx: 'O(n) time; O(h) recursion.',
    dry: ['[2,1,3] → invert(1)=1, invert(3)=3 → swap → [2,3,1]'],
    tips: ['Famous for being asked in interviews — answer it quickly and cleanly.'],
    mistakes: ['root.left = invertTree(root.right); root.right = invertTree(root.left); — the second call uses the already-replaced left.'],
    java: ['Objects are passed by reference value, so modifying node fields mutates the original tree.'],
  },
  {
    id: 'symmetric-tree',
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    desc: "Given the `root` of a binary tree, check whether it is a **mirror of itself** (symmetric around its center).",
    ex: [
      ['root = [1,2,2,3,4,4,3]', 'true', ''],
      ['root = [1,2,2,null,3,null,3]', 'false', ''],
    ],
    cons: ['1 <= number of nodes <= 1000', '-100 <= Node.val <= 100'],
    fn: { name: 'isSymmetric', params: [['TreeNode', 'root']], ret: 'boolean' },
    tests: [
      { in: [[1, 2, 2, 3, 4, 4, 3]], out: true },
      { in: [[1, 2, 2, N, 3, N, 3]], out: false },
      { in: [[1]], out: true },
      { in: [[1, 2, 3]], out: false },
      { in: [[2, 3, 3, 4, 5, 5]], out: false },
    ],
    hints: [
      'Symmetric means the left subtree is a mirror of the right subtree.',
      'Two trees are mirrors if their roots match, and a.left mirrors b.right and a.right mirrors b.left.',
      'Write isMirror(a, b) recursively, call isMirror(root.left, root.right).',
    ],
    brute: {
      idea: 'Iterative BFS comparing pairs from a queue.',
      code: J`import java.util.*;

class Solution {
    public boolean isSymmetric(TreeNode root) {
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root.left);
        q.offer(root.right);
        while (!q.isEmpty()) {
            TreeNode a = q.poll(), b = q.poll();
            if (a == null && b == null) continue;
            if (a == null || b == null || a.val != b.val) return false;
            q.offer(a.left); q.offer(b.right);
            q.offer(a.right); q.offer(b.left);
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(w)',
    },
    optimal: {
      idea: 'Recursive mirror check.',
      code: J`class Solution {
    public boolean isSymmetric(TreeNode root) {
        return isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val
                && isMirror(a.left, b.right)
                && isMirror(a.right, b.left);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['return isMirror(root.left, root.right);', 'The tree is symmetric if its two halves mirror each other.'],
      ['if (a == null && b == null) return true;', 'Both empty.'],
      ['if (a == null || b == null) return false;', 'Shape mismatch.'],
      ['isMirror(a.left, b.right) && isMirror(a.right, b.left)', 'Outer pair and inner pair must both mirror.'],
    ],
    cx: 'Each node compared once → O(n); recursion O(h).',
    dry: ['[1,2,2,3,4,4,3]', 'mirror(2,2): vals equal', 'mirror(3,3) ✓ and mirror(4,4) ✓ → true'],
    tips: ['Note the difference from Same Tree: compare left with right, not left with left.'],
    mistakes: ['Comparing a.left with b.left.'],
    java: ['`LinkedList` accepts null elements; `ArrayDeque` does not — important for the BFS version.'],
  },
  {
    id: 'diameter-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    desc: "Given the `root` of a binary tree, return the length of the **diameter** of the tree: the length of the longest path between any two nodes. The path may or may not pass through the root. The length is the number of **edges**.",
    ex: [
      ['root = [1,2,3,4,5]', '3', 'Path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3).'],
      ['root = [1,2]', '1', ''],
    ],
    cons: ['1 <= number of nodes <= 10^4', '-100 <= Node.val <= 100'],
    fn: { name: 'diameterOfBinaryTree', params: [['TreeNode', 'root']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3, 4, 5]], out: 3 },
      { in: [[1, 2]], out: 1 },
      { in: [[1]], out: 0 },
      { in: [[1, 2, N, 3, 4, 5, N, N, 6]], out: 4 },
    ],
    hints: [
      'The longest path through a node = height(left) + height(right).',
      'Computing heights separately for every node is O(n^2).',
      'Compute heights with one DFS; at each node update a global best with left + right, and return 1 + max(left, right).',
    ],
    brute: {
      idea: 'For every node compute heights of both subtrees from scratch.',
      code: J`class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int through = height(root.left) + height(root.right);
        return Math.max(through, Math.max(diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right)));
    }

    private int height(TreeNode n) {
        return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));
    }
}`,
      time: 'O(n^2) worst case', space: 'O(h)',
    },
    optimal: {
      idea: 'Single post-order DFS that returns height and updates the best diameter.',
      code: J`class Solution {
    private int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return best;
    }

    private int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        best = Math.max(best, left + right);
        return 1 + Math.max(left, right);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['private int best = 0;', 'Global answer updated during the DFS.'],
      ['int left = height(node.left); int right = height(node.right);', 'Heights (in nodes) of both subtrees.'],
      ['best = Math.max(best, left + right);', 'Longest path passing through this node has left + right edges.'],
      ['return 1 + Math.max(left, right);', 'Height of this subtree for the parent.'],
    ],
    cx: 'Each node visited once → O(n). O(h) recursion.',
    dry: ['[1,2,3,4,5]', 'h(4)=h(5)=1 → at 2: best=2, h=2', 'h(3)=1 → at 1: best=2+1=3'],
    tips: ['This "return one thing, update a global with another" pattern also solves Max Path Sum and Longest Univalue Path.'],
    mistakes: ['Returning the diameter from the recursive function instead of the height.'],
    java: ['A field (or an int[1] holder) is the usual way to keep a running global in recursive Java code.'],
  },
  {
    id: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    desc: "Given a binary tree, determine if it is **height-balanced**: for every node, the heights of the left and right subtrees differ by at most one.",
    ex: [
      ['root = [3,9,20,null,null,15,7]', 'true', ''],
      ['root = [1,2,2,3,3,null,null,4,4]', 'false', ''],
      ['root = []', 'true', ''],
    ],
    cons: ['0 <= number of nodes <= 5000', '-10^4 <= Node.val <= 10^4'],
    fn: { name: 'isBalanced', params: [['TreeNode', 'root']], ret: 'boolean' },
    tests: [
      { in: [[3, 9, 20, N, N, 15, 7]], out: true },
      { in: [[1, 2, 2, 3, 3, N, N, 4, 4]], out: false },
      { in: [[]], out: true },
      { in: [[1, 2, 2, 3, N, N, 3, 4, N, N, 4]], out: false },
      { in: [[1, N, 2]], out: true },
    ],
    hints: [
      'Checking |height(left) - height(right)| at every node is O(n^2) if heights are recomputed.',
      'Compute height bottom-up and detect imbalance at the same time.',
      'Return -1 from height() as soon as any subtree is unbalanced, and propagate it upward.',
    ],
    brute: {
      idea: 'Top-down: check height difference at each node, recompute heights each time.',
      code: J`class Solution {
    public boolean isBalanced(TreeNode root) {
        if (root == null) return true;
        if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
        return isBalanced(root.left) && isBalanced(root.right);
    }

    private int height(TreeNode n) {
        return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));
    }
}`,
      time: 'O(n^2) worst case', space: 'O(h)',
    },
    optimal: {
      idea: 'Bottom-up height with a -1 sentinel for "unbalanced".',
      code: J`class Solution {
    public boolean isBalanced(TreeNode root) {
        return check(root) != -1;
    }

    private int check(TreeNode node) {
        if (node == null) return 0;
        int left = check(node.left);
        if (left == -1) return -1;
        int right = check(node.right);
        if (right == -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (node == null) return 0;', 'Empty subtree: height 0, balanced.'],
      ['if (left == -1) return -1;', 'Short-circuit: once unbalanced, stop computing.'],
      ['if (Math.abs(left - right) > 1) return -1;', 'This node violates the balance condition.'],
      ['return 1 + Math.max(left, right);', 'Valid height for the parent.'],
    ],
    cx: 'One post-order traversal → O(n). Recursion O(h).',
    dry: ['[1,2,2,3,3,null,null,4,4]', 'left subtree of root has height 3, right height 1 → diff 2 → -1 → false'],
    tips: ['Explain why the top-down approach is O(n^2) for skewed trees — interviewers like the comparison.'],
    mistakes: ['Only checking the root\'s balance.'],
    java: ['Using a sentinel value avoids creating a wrapper class for (height, balanced).'],
  },
  {
    id: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    desc: "Given the `root` of a binary tree, imagine yourself standing on the **right side** of it. Return the values of the nodes you can see ordered from top to bottom.",
    ex: [
      ['root = [1,2,3,null,5,null,4]', '[1,3,4]', ''],
      ['root = [1,2,3,4,null,null,null,5]', '[1,3,4,5]', ''],
      ['root = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    fn: { name: 'rightSideView', params: [['TreeNode', 'root']], ret: 'List<Integer>' },
    tests: [
      { in: [[1, 2, 3, N, 5, N, 4]], out: [1, 3, 4] },
      { in: [[1, 2, 3, 4, N, N, N, 5]], out: [1, 3, 4, 5] },
      { in: [[]], out: [] },
      { in: [[1, N, 3]], out: [1, 3] },
    ],
    hints: [
      'You see exactly one node per level. Which one?',
      'The last node of each level in a BFS.',
      'Or DFS visiting right before left: the first node you reach at each new depth is visible.',
    ],
    brute: {
      idea: 'BFS level order; take the last value of every level.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                if (i == size - 1) res.add(n.val);
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(w)',
    },
    optimal: {
      idea: 'DFS right-first; record the first node at each depth.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, 0, res);
        return res;
    }

    private void dfs(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(node.val);
        dfs(node.right, depth + 1, res);
        dfs(node.left, depth + 1, res);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (depth == res.size()) res.add(node.val);', 'First time we reach this depth — because we go right first, this is the rightmost node.'],
      ['dfs(node.right, ...); dfs(node.left, ...);', 'Right subtree before left.'],
    ],
    cx: 'O(n) time. DFS uses O(h) stack; BFS uses O(w) queue.',
    dry: ['[1,2,3,null,5,null,4]', 'depth0: 1', 'depth1: 3 (right first)', 'depth2: 4 (from 3\'s right)', '5 at depth2 is skipped'],
    tips: ['Left side view: same code, go left first.'],
    mistakes: ['Assuming the rightmost node is always reachable via right children only ([1,2,3,4] → 4 is a left descendant).'],
    java: ['`res.size()` doubles as "deepest level recorded so far".'],
  },
  {
    id: 'lowest-common-ancestor-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    desc: "Given a binary tree, find the **lowest common ancestor (LCA)** of two given nodes `p` and `q`: the lowest node that has both `p` and `q` as descendants (a node can be a descendant of itself).\n\nAll node values are unique, and both `p` and `q` exist in the tree. (In the tests, `p` and `q` are given by value; the judge prints the value of the node you return.)",
    ex: [
      ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3', ''],
      ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', '5', 'A node can be a descendant of itself.'],
      ['root = [1,2], p = 1, q = 2', '1', ''],
    ],
    cons: ['2 <= number of nodes <= 10^5', 'All Node.val are unique', 'p != q, both exist in the tree'],
    fn: { name: 'lowestCommonAncestor', params: [['TreeNode', 'root'], ['TreeRef', 'p'], ['TreeRef', 'q']], ret: 'TreeNode' },
    call: 's.lowestCommonAncestor($0, $1, $2).val',
    tests: [
      { in: [[3, 5, 1, 6, 2, 0, 8, N, N, 7, 4], 5, 1], out: 3 },
      { in: [[3, 5, 1, 6, 2, 0, 8, N, N, 7, 4], 5, 4], out: 5 },
      { in: [[1, 2], 1, 2], out: 1 },
      { in: [[3, 5, 1, 6, 2, 0, 8, N, N, 7, 4], 7, 6], out: 5 },
      { in: [[3, 5, 1, 6, 2, 0, 8, N, N, 7, 4], 0, 8], out: 1 },
    ],
    hints: [
      'If p is in the left subtree and q in the right subtree, the current node is the LCA.',
      'Recursively search for p or q in both subtrees.',
      'Return root if it is null, p or q. Otherwise get left = lca(left), right = lca(right). If both non-null → root; else return the non-null one.',
    ],
    brute: {
      idea: 'Find root-to-node paths for p and q, then return the last common node.',
      code: J`import java.util.*;

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> a = new ArrayList<>(), b = new ArrayList<>();
        path(root, p, a);
        path(root, q, b);
        TreeNode lca = null;
        for (int i = 0; i < Math.min(a.size(), b.size()) && a.get(i) == b.get(i); i++) lca = a.get(i);
        return lca;
    }

    private boolean path(TreeNode node, TreeNode target, List<TreeNode> out) {
        if (node == null) return false;
        out.add(node);
        if (node == target || path(node.left, target, out) || path(node.right, target, out)) return true;
        out.remove(out.size() - 1);
        return false;
    }
}`,
      time: 'O(n)', space: 'O(h) for the paths',
    },
    optimal: {
      idea: 'Single recursive DFS: a node where p and q are found in different subtrees is the LCA.',
      code: J`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['if (root == null || root == p || root == q) return root;', 'Found one target (or nothing). If root is p, it is also the LCA when q is below it.'],
      ['TreeNode left = lca(root.left, p, q);', 'Search both subtrees.'],
      ['if (left != null && right != null) return root;', 'p and q are on different sides → this node is their lowest common ancestor.'],
      ['return left != null ? left : right;', 'Both targets (or the LCA) are in one subtree — pass it up.'],
    ],
    cx: 'Each node visited once → O(n). Recursion O(h).',
    dry: ['p=5, q=1 at root 3', 'left subtree returns 5 (found p)', 'right subtree returns 1 (found q)', 'both non-null → 3'],
    tips: ['For a BST, use values: if both < root go left, both > root go right, else root — O(h).', 'Mention the parent-pointer + HashSet approach as an alternative.'],
    mistakes: ['Comparing values instead of node references (fine here since values are unique, but references are the correct notion).'],
    java: ['`root == p` compares references — exactly the "same node" check we want.'],
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    desc: "Given the `root` of a binary tree, determine if it is a **valid binary search tree (BST)**:\n\n- The left subtree of a node contains only nodes with keys **strictly less** than the node's key.\n- The right subtree contains only nodes with keys **strictly greater** than the node's key.\n- Both subtrees must also be BSTs.",
    ex: [
      ['root = [2,1,3]', 'true', ''],
      ['root = [5,1,4,null,null,3,6]', 'false', 'The root is 5 but its right child is 4.'],
    ],
    cons: ['1 <= number of nodes <= 10^4', '-2^31 <= Node.val <= 2^31 - 1'],
    fn: { name: 'isValidBST', params: [['TreeNode', 'root']], ret: 'boolean' },
    tests: [
      { in: [[2, 1, 3]], out: true },
      { in: [[5, 1, 4, N, N, 3, 6]], out: false },
      { in: [[2147483647]], out: true },
      { in: [[5, 4, 6, N, N, 3, 7]], out: false },
      { in: [[2, 2, 2]], out: false },
      { in: [[-2147483648, N, 2147483647]], out: true },
    ],
    hints: [
      'Checking only node.left.val < node.val < node.right.val is not enough. Why? ([5,4,6,null,null,3,7])',
      'Every node must lie within a (min, max) range inherited from its ancestors.',
      'DFS with bounds: valid(node, low, high). Use long (or nullable Integer) bounds to handle Integer.MIN/MAX values. Alternatively, inorder traversal must be strictly increasing.',
    ],
    brute: {
      idea: 'Collect the inorder traversal and check that it is strictly increasing.',
      code: J`import java.util.*;

class Solution {
    public boolean isValidBST(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        for (int i = 1; i < vals.size(); i++) {
            if (vals.get(i) <= vals.get(i - 1)) return false;
        }
        return true;
    }

    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Recursive range check with long bounds (no extra list).',
      code: J`class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return valid(node.left, low, node.val) && valid(node.right, node.val, high);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['valid(root, Long.MIN_VALUE, Long.MAX_VALUE)', 'long bounds are strictly outside the int range, so nodes with Integer.MIN/MAX are handled.'],
      ['if (node.val <= low || node.val >= high) return false;', 'Value must be strictly within (low, high).'],
      ['valid(node.left, low, node.val)', 'Everything on the left must be smaller than this node.'],
      ['valid(node.right, node.val, high)', 'Everything on the right must be larger.'],
    ],
    cx: 'Each node checked once → O(n); recursion O(h).',
    dry: ['[5,4,6,null,null,3,7]', '5 in (-∞, ∞) ✓', '4 in (-∞, 5) ✓', '6 in (5, ∞) ✓', '3 in (5, 6)? ✗ → false'],
    tips: ['Mention both approaches; the iterative inorder with a prev pointer is O(h) space too.'],
    mistakes: ['Only comparing a node with its direct children.', 'Using int bounds and Integer.MIN_VALUE sentinels — fails when the tree contains those values.'],
    java: ['`Long.MIN_VALUE` / `Long.MAX_VALUE` as sentinels; int values are widened automatically in comparisons.'],
  },
  {
    id: 'kth-smallest-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    desc: "Given the `root` of a binary search tree, and an integer `k`, return the **k-th smallest value** (1-indexed) of all the values of the nodes in the tree.",
    ex: [
      ['root = [3,1,4,null,2], k = 1', '1', ''],
      ['root = [5,3,6,2,4,null,null,1], k = 3', '3', ''],
    ],
    cons: ['1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
    fn: { name: 'kthSmallest', params: [['TreeNode', 'root'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: [[3, 1, 4, N, 2], 1], out: 1 },
      { in: [[5, 3, 6, 2, 4, N, N, 1], 3], out: 3 },
      { in: [[1], 1], out: 1 },
      { in: [[5, 3, 6, 2, 4, N, N, 1], 6], out: 6 },
    ],
    hints: [
      'Which traversal of a BST visits values in sorted order?',
      'Inorder traversal. The k-th visited node is the answer.',
      'Iterative inorder with a stack, decrementing k on each visit; stop when k reaches 0 — no need to traverse the rest.',
    ],
    brute: {
      idea: 'Collect all values with inorder traversal, return the (k-1)-th.',
      code: J`import java.util.*;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        return vals.get(k - 1);
    }

    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Iterative inorder that stops after k visits.',
      code: J`import java.util.*;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            if (--k == 0) return curr.val;
            curr = curr.right;
        }
        return -1;
    }
}`,
      time: 'O(h + k)', space: 'O(h)',
    },
    lines: [
      ['while (curr != null) { stack.push(curr); curr = curr.left; }', 'Descend to the smallest unvisited node.'],
      ['curr = stack.pop();', 'Next node in sorted order.'],
      ['if (--k == 0) return curr.val;', 'Count visits; return as soon as we reach the k-th.'],
      ['curr = curr.right;', 'Continue with the right subtree.'],
    ],
    cx: 'We descend h levels and visit k nodes → O(h + k). Stack O(h).',
    dry: ['[5,3,6,2,4,null,null,1], k=3', 'push 5,3,2,1 → visit 1 (k=2) → visit 2 (k=1) → visit 3 (k=0) → 3'],
    tips: ['Follow-up: frequent inserts/deletes → augment nodes with subtree sizes for O(h) queries.'],
    mistakes: ['Traversing the entire tree when k is small.'],
    java: ['Pre-decrement `--k == 0` decrements first, then compares.'],
  },
  {
    id: 'construct-tree-preorder-inorder',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    desc: "Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree. All values are unique.",
    ex: [
      ['preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', '[3,9,20,null,null,15,7]', ''],
      ['preorder = [-1], inorder = [-1]', '[-1]', ''],
    ],
    cons: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length', 'Values are unique'],
    fn: { name: 'buildTree', params: [['int[]', 'preorder'], ['int[]', 'inorder']], ret: 'TreeNode' },
    tests: [
      { in: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], out: [3, 9, 20, N, N, 15, 7] },
      { in: [[-1], [-1]], out: [-1] },
      { in: [[1, 2], [2, 1]], out: [1, 2] },
      { in: [[1, 2, 4, 5, 3, 6], [4, 2, 5, 1, 6, 3]], out: [1, 2, 3, 4, 5, 6] },
      { in: [[1, 2, 3], [1, 2, 3]], out: [1, N, 2, N, 3] },
    ],
    hints: [
      'The first preorder element is the root. Where is it in inorder?',
      'Everything left of the root in inorder belongs to the left subtree; everything right to the right subtree.',
      'Recurse with index ranges. Use a HashMap value → inorder index for O(1) lookups, and a global preorder pointer.',
    ],
    brute: {
      idea: 'Recursion with array copies and a linear search for the root in inorder.',
      code: J`import java.util.*;

class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        TreeNode root = new TreeNode(preorder[0]);
        int mid = 0;
        while (inorder[mid] != preorder[0]) mid++;
        root.left = buildTree(Arrays.copyOfRange(preorder, 1, mid + 1), Arrays.copyOfRange(inorder, 0, mid));
        root.right = buildTree(Arrays.copyOfRange(preorder, mid + 1, preorder.length), Arrays.copyOfRange(inorder, mid + 1, inorder.length));
        return root;
    }
}`,
      time: 'O(n^2)', space: 'O(n^2) copies worst case',
    },
    optimal: {
      idea: 'Index-range recursion with a value → index HashMap.',
      code: J`import java.util.*;

class Solution {
    private int preIdx = 0;
    private final Map<Integer, Integer> inPos = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) inPos.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int lo, int hi) {
        if (lo > hi) return null;
        int rootVal = preorder[preIdx++];
        TreeNode root = new TreeNode(rootVal);
        int mid = inPos.get(rootVal);
        root.left = build(preorder, lo, mid - 1);
        root.right = build(preorder, mid + 1, hi);
        return root;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['private int preIdx = 0;', 'Next preorder element to use as a root; preorder visits roots in exactly the order we build them.'],
      ['inPos.put(inorder[i], i);', 'O(1) lookup of a value\'s position in inorder.'],
      ['if (lo > hi) return null;', 'Empty inorder range → no subtree.'],
      ['int mid = inPos.get(rootVal);', 'Root splits the inorder range into left and right parts.'],
      ['root.left = build(lo, mid - 1); root.right = build(mid + 1, hi);', 'Build left first — matches preorder (root, left, right).'],
    ],
    cx: 'Each node created once with O(1) work → O(n). HashMap O(n), recursion O(h).',
    dry: ['pre=[3,9,20,15,7], in=[9,3,15,20,7]', 'root 3 (mid 1) → left range [0,0] → 9', 'right range [2,4] → root 20 (mid 3) → left 15, right 7'],
    tips: ['Similar: Construct from Inorder + Postorder (consume postorder from the end, build right first).'],
    mistakes: ['Building the right subtree before the left (preorder pointer goes out of sync).'],
    java: ['`Arrays.copyOfRange(arr, from, to)` copies a slice — convenient but O(n) each time.'],
  },
  {
    id: 'binary-tree-max-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    desc: "A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear once in the path, and the path does not need to pass through the root.\n\nThe **path sum** is the sum of the node values in the path. Given the `root`, return the **maximum path sum** of any non-empty path.",
    ex: [
      ['root = [1,2,3]', '6', 'Path 2 → 1 → 3.'],
      ['root = [-10,9,20,null,null,15,7]', '42', 'Path 15 → 20 → 7.'],
    ],
    cons: ['1 <= number of nodes <= 3 * 10^4', '-1000 <= Node.val <= 1000'],
    fn: { name: 'maxPathSum', params: [['TreeNode', 'root']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3]], out: 6 },
      { in: [[-10, 9, 20, N, N, 15, 7]], out: 42 },
      { in: [[-3]], out: -3 },
      { in: [[2, -1]], out: 2 },
      { in: [[5, 4, 8, 11, N, 13, 4, 7, 2, N, N, N, 1]], out: 48 },
    ],
    hints: [
      'At each node, a path can "bend" there (use both children) or continue upward (use at most one child).',
      'Compute gain(node) = node.val + max(0, gain(left), gain(right)) — the best downward path starting at node.',
      'While computing gains, update a global best with node.val + max(0, leftGain) + max(0, rightGain).',
    ],
    brute: {
      idea: 'For every node as the "top" of the path, compute the best downward paths into each child separately (recomputing gains).',
      code: J`class Solution {
    public int maxPathSum(TreeNode root) {
        if (root == null) return Integer.MIN_VALUE;
        int through = root.val + Math.max(0, down(root.left)) + Math.max(0, down(root.right));
        return Math.max(through, Math.max(maxPathSum(root.left), maxPathSum(root.right)));
    }

    private int down(TreeNode n) {
        if (n == null) return 0;
        return n.val + Math.max(0, Math.max(down(n.left), down(n.right)));
    }
}`,
      time: 'O(n^2) worst case', space: 'O(h)',
    },
    optimal: {
      idea: 'One post-order DFS returning the max downward gain and updating a global answer.',
      code: J`class Solution {
    private int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + left + right);
        return node.val + Math.max(left, right);
    }
}`,
      time: 'O(n)', space: 'O(h)',
    },
    lines: [
      ['private int best = Integer.MIN_VALUE;', 'Answer may be negative (all-negative tree), so do not start at 0.'],
      ['int left = Math.max(0, gain(node.left));', 'Ignore a child path that would decrease the sum.'],
      ['best = Math.max(best, node.val + left + right);', 'Path that bends at this node, using both sides.'],
      ['return node.val + Math.max(left, right);', 'The parent can only extend one side, so return the better single branch.'],
    ],
    cx: 'Each node processed once → O(n); recursion O(h).',
    dry: ['[-10,9,20,null,null,15,7]', 'gain(15)=15, gain(7)=7 → at 20: best=42, return 35', 'gain(9)=9 → at -10: -10+9+35=34 < 42', 'answer 42'],
    tips: ['Same skeleton as Diameter of Binary Tree — mention the connection.'],
    mistakes: ['Returning node.val + left + right to the parent (a path cannot fork).', 'Initialising best to 0.'],
    java: ['Instance field for the global maximum; reset it if the Solution object is reused.'],
  },
  {
    id: 'serialize-deserialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    desc: "Design an algorithm to **serialize** a binary tree to a string and **deserialize** that string back to the original tree structure. There is no restriction on the format — it just has to round-trip.\n\nImplement the `Codec` class with `String serialize(TreeNode root)` and `TreeNode deserialize(String data)`. The judge checks that `deserialize(serialize(root))` reproduces the tree.",
    ex: [
      ['root = [1,2,3,null,null,4,5]', '[1,2,3,null,null,4,5]', ''],
      ['root = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 10^4', '-1000 <= Node.val <= 1000'],
    fn: { name: 'serialize', params: [['TreeNode', 'root']], ret: 'TreeNode' },
    cls: 'Codec',
    call: 's.deserialize(s.serialize($0))',
    starter: J`class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        // Write your code here
        return "";
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        // Write your code here
        return null;
    }
}`,
    tests: [
      { in: [[1, 2, 3, N, N, 4, 5]], out: [1, 2, 3, N, N, 4, 5] },
      { in: [[]], out: [] },
      { in: [[-7]], out: [-7] },
      { in: [[1, N, 2, N, 3, N, 4]], out: [1, N, 2, N, 3, N, 4] },
      { in: [[5, 4, 8, 11, N, 13, 4, 7, 2, N, N, N, 1]], out: [5, 4, 8, 11, N, 13, 4, 7, 2, N, N, N, 1] },
    ],
    hints: [
      'A preorder or level-order traversal alone is ambiguous — unless you also record missing children.',
      'Write a marker like "#" for null children; then a preorder list uniquely describes the tree.',
      'serialize: preorder with "#" for null, joined by commas. deserialize: split, then recursively rebuild consuming tokens from a Queue.',
    ],
    brute: {
      idea: 'Level-order (BFS) serialization with "null" markers, rebuilt with a queue.',
      code: J`import java.util.*;

class Codec {
    public String serialize(TreeNode root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) { sb.append("null,"); continue; }
            sb.append(n.val).append(',');
            q.offer(n.left);
            q.offer(n.right);
        }
        return sb.toString();
    }

    public TreeNode deserialize(String data) {
        if (data.isEmpty()) return null;
        String[] t = data.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode n = q.poll();
            if (!t[i].equals("null")) { n.left = new TreeNode(Integer.parseInt(t[i])); q.offer(n.left); }
            i++;
            if (i < t.length && !t[i].equals("null")) { n.right = new TreeNode(Integer.parseInt(t[i])); q.offer(n.right); }
            i++;
        }
        return root;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Preorder DFS with "#" for null; deserialize by consuming tokens recursively from a queue.',
      code: J`import java.util.*;

class Codec {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        write(root, sb);
        return sb.toString();
    }

    private void write(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#,");
            return;
        }
        sb.append(node.val).append(',');
        write(node.left, sb);
        write(node.right, sb);
    }

    public TreeNode deserialize(String data) {
        Queue<String> tokens = new LinkedList<>(Arrays.asList(data.split(",")));
        return read(tokens);
    }

    private TreeNode read(Queue<String> tokens) {
        String t = tokens.poll();
        if (t == null || t.equals("#") || t.isEmpty()) return null;
        TreeNode node = new TreeNode(Integer.parseInt(t));
        node.left = read(tokens);
        node.right = read(tokens);
        return node;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['if (node == null) { sb.append("#,"); return; }', 'Null markers make the preorder sequence unambiguous.'],
      ['sb.append(node.val).append(\',\'); write(left); write(right);', 'Preorder: root, left, right.'],
      ['new LinkedList<>(Arrays.asList(data.split(",")))', 'Tokens in a queue so each recursive call consumes the next one.'],
      ['if (t == null || t.equals("#") ...) return null;', 'A "#" token means an empty subtree.'],
      ['node.left = read(tokens); node.right = read(tokens);', 'Rebuild in the same preorder as written.'],
    ],
    cx: 'Each node and each null marker is written and read once → O(n). String and queue O(n); recursion O(h).',
    dry: ['[1,2,3,null,null,4,5] → "1,2,#,#,3,4,#,#,5,#,#,"', 'read 1 → left read 2 (children #,#) → right read 3 → left 4, right 5'],
    tips: ['Discuss trade-offs: preorder is compact and simple; level order matches LeetCode\'s display format.', 'For BSTs, preorder alone (without nulls) is enough.'],
    mistakes: ['Omitting null markers — ambiguous trees.', 'Splitting "" gives [""], so handle the empty tree.'],
    java: ['`String.split(",")` drops trailing empty strings — that is why a trailing comma is harmless.', 'Queue.poll() returns null when empty instead of throwing.'],
  },
];
