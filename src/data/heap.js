const J = String.raw;

export default [
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    desc: "Given an integer array `nums` and an integer `k`, return the **k-th largest element** in the array. Note that it is the k-th largest element in sorted order, not the k-th distinct element.\n\nCan you solve it without sorting?",
    ex: [
      ['nums = [3,2,1,5,6,4], k = 2', '5', ''],
      ['nums = [3,2,3,1,2,4,5,5,6], k = 4', '4', ''],
    ],
    cons: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    fn: { name: 'findKthLargest', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: [[3, 2, 1, 5, 6, 4], 2], out: 5 },
      { in: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], out: 4 },
      { in: [[1], 1], out: 1 },
      { in: [[-1, -1], 2], out: -1 },
      { in: [[7, 6, 5, 4, 3, 2, 1], 7], out: 1 },
    ],
    hints: [
      'Sorting gives O(n log n). Do you need the whole array sorted?',
      'Keep only the k largest elements seen so far. Which of them is the k-th largest?',
      'Min-heap of size k: push each number, pop when size > k. The heap top is the answer. (Quickselect gives O(n) average.)',
    ],
    brute: {
      idea: 'Sort ascending and index from the end.',
      code: J`import java.util.*;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        int[] a = nums.clone();
        Arrays.sort(a);
        return a[a.length - k];
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Min-heap holding the k largest elements.',
      code: J`import java.util.*;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int x : nums) {
            minHeap.offer(x);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.peek();
    }
}`,
      time: 'O(n log k)', space: 'O(k)',
    },
    lines: [
      ['PriorityQueue<Integer> minHeap = new PriorityQueue<>();', 'Java\'s PriorityQueue is a min-heap by default.'],
      ['minHeap.offer(x);', 'O(log k) insertion.'],
      ['if (minHeap.size() > k) minHeap.poll();', 'Evict the smallest — it cannot be among the top k.'],
      ['return minHeap.peek();', 'Smallest of the k largest = k-th largest.'],
    ],
    cx: 'n insertions/removals on a heap of size ≤ k → O(n log k). Heap O(k). Quickselect: O(n) average, O(n^2) worst; heap is predictable and works on streams.',
    dry: ['[3,2,1,5,6,4], k=2', 'heap [3] → [2,3] → add 1, pop 1 → [2,3]', 'add 5, pop 2 → [3,5]', 'add 6, pop 3 → [5,6]', 'add 4, pop 4 → [5,6] → peek 5'],
    tips: ['Explain when to use a min-heap (k largest) vs max-heap (k smallest).', 'Mention Quickselect and its average O(n).'],
    mistakes: ['Using a max-heap of all n elements and polling k times — O(n + k log n), fine, but uses O(n) memory.'],
    java: ['Max-heap: `new PriorityQueue<>(Collections.reverseOrder())` or `(a, b) -> b - a` (beware overflow; prefer `Integer.compare(b, a)`).', 'PriorityQueue iteration order is NOT sorted; only peek/poll respect priority.'],
  },
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    desc: "Given an integer array `nums` and an integer `k`, return the `k` **most frequent elements**. You may return the answer in **any order**. The answer is guaranteed to be unique.\n\nYour algorithm's time complexity must be better than O(n log n).",
    ex: [
      ['nums = [1,1,1,2,2,3], k = 2', '[1,2]', ''],
      ['nums = [1], k = 1', '[1]', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, number of unique elements]', 'The answer is unique'],
    fn: { name: 'topKFrequent', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int[]' },
    cmp: 'sorted',
    tests: [
      { in: [[1, 1, 1, 2, 2, 3], 2], out: [1, 2] },
      { in: [[1], 1], out: [1] },
      { in: [[4, 4, 4, 6, 6, 7, 7, 7, 7], 1], out: [7] },
      { in: [[5, 3, 1, 1, 1, 3, 73, 1], 2], out: [1, 3] },
      { in: [[-1, -1, 2, 2, 2, 9], 2], out: [-1, 2] },
    ],
    hints: [
      'First count frequencies with a HashMap.',
      'Then you need the k keys with the highest counts — a heap of size k works in O(n log k).',
      'Bucket sort for O(n): bucket[f] = list of numbers that appear f times; walk buckets from high to low frequency.',
    ],
    brute: {
      idea: 'Count, then sort the distinct keys by frequency descending.',
      code: J`import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum);
        List<Integer> keys = new ArrayList<>(freq.keySet());
        keys.sort((a, b) -> freq.get(b) - freq.get(a));
        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = keys.get(i);
        return res;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Frequency map + min-heap of size k keyed by frequency.',
      code: J`import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) {
            freq.merge(x, 1, Integer::sum);
        }
        PriorityQueue<Map.Entry<Integer, Integer>> heap =
                new PriorityQueue<>((a, b) -> Integer.compare(a.getValue(), b.getValue()));
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            heap.offer(e);
            if (heap.size() > k) heap.poll();
        }
        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            res[i] = heap.poll().getKey();
        }
        return res;
    }
}`,
      time: 'O(n log k)', space: 'O(n)',
    },
    lines: [
      ['freq.merge(x, 1, Integer::sum);', 'Count occurrences.'],
      ['new PriorityQueue<>((a, b) -> Integer.compare(a.getValue(), b.getValue()))', 'Min-heap ordered by frequency.'],
      ['heap.offer(e); if (heap.size() > k) heap.poll();', 'Keep only the k most frequent entries.'],
      ['res[i] = heap.poll().getKey();', 'Extract the numbers (order does not matter here).'],
    ],
    cx: 'Counting O(n); u distinct keys pushed into a size-k heap → O(u log k) ≤ O(n log k). Map O(n). Bucket sort achieves O(n).',
    dry: ['[1,1,1,2,2,3], k=2 → freq {1:3, 2:2, 3:1}', 'heap after all: {2:2, 1:3} (3:1 evicted)', 'result [1,2]'],
    tips: ['Describe the bucket-sort O(n) variant as the follow-up.', 'Top K Frequent Words adds a tie-break by lexicographic order — needs a careful comparator.'],
    mistakes: ['Comparator `a.getValue() - b.getValue()` can overflow for huge values; Integer.compare is safe.'],
    java: ['`Map.Entry<K, V>` exposes getKey()/getValue(); `entrySet()` iterates all pairs.', 'Lambdas implement Comparator inline.'],
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    desc: "You are given an array of `k` linked lists `lists`, each linked list is sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.",
    ex: [
      ['lists = [[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]', ''],
      ['lists = []', '[]', ''],
      ['lists = [[]]', '[]', ''],
    ],
    cons: ['0 <= k <= 10^4', '0 <= lists[i].length <= 500', 'Each list is sorted', 'Total nodes <= 10^4'],
    fn: { name: 'mergeKLists', params: [['ListNode[]', 'lists']], ret: 'ListNode' },
    tests: [
      { in: [[[1, 4, 5], [1, 3, 4], [2, 6]]], out: [1, 1, 2, 3, 4, 4, 5, 6] },
      { in: [[]], out: [] },
      { in: [[[]]], out: [] },
      { in: [[[5], [1], [3]]], out: [1, 3, 5] },
      { in: [[[-2, 0, 9], [], [-1, 10]]], out: [-2, -1, 0, 9, 10] },
    ],
    hints: [
      'Merging lists one by one costs O(k · N). Can you always pick the global minimum quickly?',
      'At any moment, the next node is the smallest head among the k lists.',
      'Put all non-null heads into a min-heap keyed by value. Poll the smallest, append it, push its next.',
    ],
    brute: {
      idea: 'Merge the lists one after another into an accumulating result.',
      code: J`class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        ListNode result = null;
        for (ListNode l : lists) result = merge(result, l);
        return result;
    }

    private ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), t = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.next = a; a = a.next; }
            else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = a != null ? a : b;
        return dummy.next;
    }
}`,
      time: 'O(k · N)', space: 'O(1)',
    },
    optimal: {
      idea: 'Min-heap of current list heads.',
      code: J`import java.util.*;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode head : lists) {
            if (head != null) heap.offer(head);
        }
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!heap.isEmpty()) {
            ListNode node = heap.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) heap.offer(node.next);
        }
        return dummy.next;
    }
}`,
      time: 'O(N log k)', space: 'O(k)',
    },
    lines: [
      ['new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val))', 'ListNode is not Comparable, so supply a Comparator.'],
      ['if (head != null) heap.offer(head);', 'Only non-empty lists participate.'],
      ['ListNode node = heap.poll();', 'Smallest head among all lists.'],
      ['if (node.next != null) heap.offer(node.next);', 'That list\'s next node becomes a candidate.'],
    ],
    cx: 'Each of N total nodes is pushed and popped once on a heap of size ≤ k → O(N log k). Divide-and-conquer pairwise merging also achieves O(N log k).',
    dry: ['heads 1,1,2', 'poll 1(a) → push 4', 'poll 1(b) → push 3', 'poll 2 → push 6', 'poll 3, 4, 4, 5, 6'],
    tips: ['Mention divide and conquer: merge pairs (0,1),(2,3)… then repeat — O(N log k) with O(1) extra space.'],
    mistakes: ['Forgetting null lists.', 'Comparator `a.val - b.val` overflow with extreme values.'],
    java: ['PriorityQueue needs either Comparable elements or a Comparator — otherwise ClassCastException at runtime.'],
  },
  {
    id: 'k-closest-points-origin',
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    desc: "Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`. Distance is Euclidean. You may return the answer in **any order**; it is guaranteed to be unique.",
    ex: [
      ['points = [[1,3],[-2,2]], k = 1', '[[-2,2]]', 'Distance² of (1,3) is 10 and of (-2,2) is 8.'],
      ['points = [[3,3],[5,-1],[-2,4]], k = 2', '[[3,3],[-2,4]]', ''],
    ],
    cons: ['1 <= k <= points.length <= 10^4', '-10^4 <= xi, yi <= 10^4'],
    fn: { name: 'kClosest', params: [['int[][]', 'points'], ['int', 'k']], ret: 'int[][]' },
    cmp: 'sorted',
    tests: [
      { in: [[[1, 3], [-2, 2]], 1], out: [[-2, 2]] },
      { in: [[[3, 3], [5, -1], [-2, 4]], 2], out: [[3, 3], [-2, 4]] },
      { in: [[[0, 1], [1, 0]], 2], out: [[0, 1], [1, 0]] },
      { in: [[[10, 10], [1, 1], [-5, 0], [2, -2]], 2], out: [[1, 1], [2, -2]] },
    ],
    hints: [
      'You only need to compare squared distances — no square roots.',
      'Sorting all points is O(n log n). Can you keep only k candidates?',
      'Max-heap of size k by distance: push each point, poll when size > k. Remaining points are the answer.',
    ],
    brute: {
      idea: 'Sort all points by squared distance and take the first k.',
      code: J`import java.util.*;

class Solution {
    public int[][] kClosest(int[][] points, int k) {
        int[][] p = points.clone();
        Arrays.sort(p, (a, b) -> Integer.compare(a[0] * a[0] + a[1] * a[1], b[0] * b[0] + b[1] * b[1]));
        return Arrays.copyOfRange(p, 0, k);
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Max-heap of size k on squared distance.',
      code: J`import java.util.*;

class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
                (a, b) -> Integer.compare(dist(b), dist(a)));
        for (int[] p : points) {
            maxHeap.offer(p);
            if (maxHeap.size() > k) maxHeap.poll();
        }
        int[][] res = new int[k][];
        for (int i = 0; i < k; i++) res[i] = maxHeap.poll();
        return res;
    }

    private int dist(int[] p) {
        return p[0] * p[0] + p[1] * p[1];
    }
}`,
      time: 'O(n log k)', space: 'O(k)',
    },
    lines: [
      ['(a, b) -> Integer.compare(dist(b), dist(a))', 'Reversed comparison → max-heap: the farthest candidate sits on top.'],
      ['if (maxHeap.size() > k) maxHeap.poll();', 'Drop the farthest point; it is not among the k closest.'],
      ['p[0] * p[0] + p[1] * p[1]', 'Squared distance preserves order and avoids floating point. Max 2·10^8 fits in int.'],
    ],
    cx: 'n heap operations on size k → O(n log k). Quickselect gives O(n) average.',
    dry: ['[[3,3],[5,-1],[-2,4]], k=2', 'dist 18, 26, 20', 'push 18, 26 → push 20 → poll 26 → {18, 20}'],
    tips: ['Same "size-k heap of the opposite type" trick as Kth Largest.'],
    mistakes: ['Using Math.sqrt — slower and introduces precision issues.'],
    java: ['`PriorityQueue<int[]>` works with a comparator; `int[][] res = new int[k][]` creates a jagged array whose rows we fill with references.'],
  },
  {
    id: 'find-median-data-stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    desc: "The **median** is the middle value in an ordered list. If the size is even, it is the mean of the two middle values.\n\nImplement the `MedianFinder` class:\n- `MedianFinder()` initializes the object.\n- `void addNum(int num)` adds the integer `num` from the data stream.\n- `double findMedian()` returns the median of all elements so far.",
    ex: [
      ['["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', '[null,null,null,1.5,null,2.0]', ''],
    ],
    cons: ['-10^5 <= num <= 10^5', 'findMedian is called only after at least one addNum', 'At most 5 * 10^4 calls'],
    design: {
      cls: 'MedianFinder', ctor: [],
      methods: { addNum: [['int'], 'void', ['num']], findMedian: [[], 'double'] },
    },
    tests: [
      { ops: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], args: [[], [1], [2], [], [3], []], out: [null, null, null, 1.5, null, 2.0] },
      { ops: ['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian'], args: [[], [-1], [], [-2], [], [-3], [], [-4], []], out: [null, null, -1.0, null, -1.5, null, -2.0, null, -2.5] },
      { ops: ['MedianFinder', 'addNum', 'addNum', 'addNum', 'addNum', 'addNum', 'findMedian'], args: [[], [6], [10], [2], [6], [5], []], out: [null, null, null, null, null, null, 6.0] },
    ],
    hints: [
      'Keeping a sorted list makes findMedian O(1) but addNum O(n).',
      'Split the numbers into a lower half and an upper half. What do you need from each half?',
      'Max-heap for the lower half, min-heap for the upper half. Keep sizes balanced (lower may have one extra). Median = lower.peek() or the average of both tops.',
    ],
    brute: {
      idea: 'Maintain a sorted ArrayList using binary-search insertion.',
      code: J`import java.util.*;

class MedianFinder {
    private final List<Integer> data = new ArrayList<>();

    public MedianFinder() {}

    public void addNum(int num) {
        int i = Collections.binarySearch(data, num);
        if (i < 0) i = -(i + 1);
        data.add(i, num);
    }

    public double findMedian() {
        int n = data.size();
        if (n % 2 == 1) return data.get(n / 2);
        return (data.get(n / 2 - 1) + (double) data.get(n / 2)) / 2.0;
    }
}`,
      time: 'addNum O(n), findMedian O(1)', space: 'O(n)',
    },
    optimal: {
      idea: 'Two heaps: a max-heap for the smaller half and a min-heap for the larger half.',
      code: J`import java.util.*;

class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public MedianFinder() {}

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (high.size() > low.size()) {
            low.offer(high.poll());
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + (double) high.peek()) / 2.0;
    }
}`,
      time: 'addNum O(log n), findMedian O(1)', space: 'O(n)',
    },
    lines: [
      ['PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());', 'Max-heap: top is the largest of the smaller half.'],
      ['PriorityQueue<Integer> high = new PriorityQueue<>();', 'Min-heap: top is the smallest of the larger half.'],
      ['low.offer(num); high.offer(low.poll());', 'Route the number through low so the largest "low" element moves to high — keeps every low ≤ every high.'],
      ['if (high.size() > low.size()) low.offer(high.poll());', 'Rebalance so low has the same size or one more element.'],
      ['if (low.size() > high.size()) return low.peek();', 'Odd count → middle element is low\'s top.'],
      ['(low.peek() + (double) high.peek()) / 2.0', 'Even count → average of the two middles (cast avoids int overflow/truncation).'],
    ],
    cx: 'Each addNum does a constant number of heap operations → O(log n). findMedian peeks → O(1). Both heaps together store n elements.',
    dry: ['add 1: low=[1] → move 1 to high → high bigger, move back → low=[1], high=[]', 'add 2: low=[2,1] → move 2 to high → low=[1], high=[2] → median (1+2)/2 = 1.5', 'add 3: low=[3,1] → move 3 to high → high=[2,3] is bigger → move 2 back → low=[2,1], high=[3] → median 2.0'],
    tips: ['Follow-ups: numbers only in [0, 100] → counting array; sliding-window median → two heaps with lazy deletion or TreeMap.'],
    mistakes: ['Not keeping the invariant max(low) ≤ min(high).', 'Integer division when averaging.'],
    java: ['`Collections.reverseOrder()` returns a Comparator that reverses natural ordering — the cleanest way to get a max-heap.'],
  },
];
