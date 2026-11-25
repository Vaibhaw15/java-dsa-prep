const J = String.raw;

export default [
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    desc: "Given an array of integers `nums` sorted in ascending order and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index; otherwise return `-1`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.",
    ex: [
      ['nums = [-1,0,3,5,9,12], target = 9', '4', '9 exists in nums at index 4.'],
      ['nums = [-1,0,3,5,9,12], target = 2', '-1', ''],
    ],
    cons: ['1 <= nums.length <= 10^4', 'All integers in nums are unique', 'nums is sorted ascending'],
    fn: { name: 'search', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int' },
    tests: [
      { in: [[-1, 0, 3, 5, 9, 12], 9], out: 4 },
      { in: [[-1, 0, 3, 5, 9, 12], 2], out: -1 },
      { in: [[5], 5], out: 0 },
      { in: [[5], -5], out: -1 },
      { in: [[1, 3, 5, 7, 9, 11, 13], 1], out: 0 },
      { in: [[1, 3, 5, 7, 9, 11, 13], 13], out: 6 },
    ],
    hints: [
      'Compare target with the middle element. What does that tell you about each half?',
      'If nums[mid] < target, the answer can only be to the right of mid.',
      'Loop while lo <= hi; mid = lo + (hi - lo) / 2; move lo = mid + 1 or hi = mid - 1.',
    ],
    brute: {
      idea: 'Linear scan.',
      code: J`class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Classic iterative binary search on a closed interval [lo, hi].',
      code: J`class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['int lo = 0, hi = nums.length - 1;', 'Search space is the closed interval [lo, hi].'],
      ['while (lo <= hi)', 'Continue while the interval is non-empty.'],
      ['int mid = lo + (hi - lo) / 2;', 'Overflow-safe midpoint (lo + hi can exceed Integer.MAX_VALUE).'],
      ['if (nums[mid] < target) lo = mid + 1;', 'mid and everything left of it are too small.'],
      ['else hi = mid - 1;', 'mid and everything right of it are too big.'],
    ],
    cx: 'The interval halves each iteration → O(log n). Constant space.',
    dry: ['[-1,0,3,5,9,12], t=9', 'lo0 hi5 mid2 (3) < 9 → lo3', 'lo3 hi5 mid4 (9) == 9 → 4'],
    tips: ['Know both templates: closed [lo, hi] with lo <= hi, and half-open [lo, hi) with lo < hi.', 'Java has `Arrays.binarySearch`, which returns -(insertionPoint) - 1 when not found.'],
    mistakes: ['(lo + hi) / 2 overflow on huge arrays.', 'Infinite loops from lo = mid instead of mid + 1.'],
    java: ['`Arrays.binarySearch(arr, key)` and `Collections.binarySearch(list, key)` exist in the standard library.'],
  },
  {
    id: 'search-insert-position',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    desc: "Given a sorted array of **distinct** integers and a target value, return the index if the target is found. If not, return the index where it would be **inserted** in order.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    ex: [
      ['nums = [1,3,5,6], target = 5', '2', ''],
      ['nums = [1,3,5,6], target = 2', '1', ''],
      ['nums = [1,3,5,6], target = 7', '4', ''],
    ],
    cons: ['1 <= nums.length <= 10^4', 'nums has distinct values sorted ascending'],
    fn: { name: 'searchInsert', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int' },
    tests: [
      { in: [[1, 3, 5, 6], 5], out: 2 },
      { in: [[1, 3, 5, 6], 2], out: 1 },
      { in: [[1, 3, 5, 6], 7], out: 4 },
      { in: [[1, 3, 5, 6], 0], out: 0 },
      { in: [[1], 1], out: 0 },
    ],
    hints: [
      'The answer is the first index whose value is >= target.',
      'This is a "lower bound" binary search.',
      'Use lo = 0, hi = n (half-open). While lo < hi: if nums[mid] < target, lo = mid + 1, else hi = mid. Return lo.',
    ],
    brute: {
      idea: 'Scan for the first element >= target.',
      code: J`class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) return i;
        }
        return nums.length;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Lower-bound binary search on a half-open interval.',
      code: J`class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['int lo = 0, hi = nums.length;', 'hi = n because the answer can be n (insert at the end).'],
      ['while (lo < hi)', 'Half-open [lo, hi) interval; stops when lo == hi.'],
      ['if (nums[mid] < target) lo = mid + 1;', 'mid is too small; the first >= target is to the right.'],
      ['else hi = mid;', 'mid could be the answer — keep it in range.'],
      ['return lo;', 'lo == hi is the first index with nums[i] >= target.'],
    ],
    cx: 'O(log n) time, O(1) space.',
    dry: ['[1,3,5,6], t=2', 'lo0 hi4 mid2 (5) ≥ 2 → hi2', 'mid1 (3) ≥ 2 → hi1', 'mid0 (1) < 2 → lo1 → return 1'],
    tips: ['Lower bound / upper bound are the two binary search primitives — most problems reduce to one of them.'],
    mistakes: ['Returning -1 when not found (the question wants the insertion index).'],
    java: ['`Arrays.binarySearch` returns `-(insertionPoint) - 1` for missing keys; `-(r + 1)` recovers the insertion point.'],
  },
  {
    id: 'first-last-position',
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    desc: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found, return `[-1, -1]`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    ex: [
      ['nums = [5,7,7,8,8,10], target = 8', '[3,4]', ''],
      ['nums = [5,7,7,8,8,10], target = 6', '[-1,-1]', ''],
      ['nums = [], target = 0', '[-1,-1]', ''],
    ],
    cons: ['0 <= nums.length <= 10^5', 'nums is sorted non-decreasing'],
    fn: { name: 'searchRange', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int[]' },
    tests: [
      { in: [[5, 7, 7, 8, 8, 10], 8], out: [3, 4] },
      { in: [[5, 7, 7, 8, 8, 10], 6], out: [-1, -1] },
      { in: [[], 0], out: [-1, -1] },
      { in: [[1], 1], out: [0, 0] },
      { in: [[2, 2, 2, 2], 2], out: [0, 3] },
      { in: [[1, 2, 3], 3], out: [2, 2] },
    ],
    hints: [
      'One binary search finds *a* target. How do you find the leftmost one?',
      'When you find target, do not stop — continue searching left (for first) or right (for last).',
      'Run two binary searches: lowerBound(target) and lowerBound(target + 1) - 1.',
    ],
    brute: {
      idea: 'Linear scan for the first and last occurrence.',
      code: J`class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = -1, last = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                if (first == -1) first = i;
                last = i;
            }
        }
        return new int[]{first, last};
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Two lower-bound searches: first index >= target and first index >= target + 1.',
      code: J`class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lowerBound(nums, target);
        if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
        int last = lowerBound(nums, target + 1) - 1;
        return new int[]{first, last};
    }

    private int lowerBound(int[] nums, int x) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['int first = lowerBound(nums, target);', 'First index with value >= target.'],
      ['if (first == nums.length || nums[first] != target)', 'target is absent.'],
      ['int last = lowerBound(nums, target + 1) - 1;', 'First index with value > target, minus one, is the last target.'],
      ['private int lowerBound(...)', 'Reusable helper — a strong interview signal.'],
    ],
    cx: 'Two O(log n) searches → O(log n). O(1) space.',
    dry: ['[5,7,7,8,8,10], t=8', 'lowerBound(8) = 3', 'lowerBound(9) = 5 → last = 4 → [3,4]'],
    tips: ['Count occurrences of x = upperBound - lowerBound — same idea.'],
    mistakes: ['Finding one occurrence then expanding linearly — O(n) when all elements equal target.', 'target + 1 overflow if target == Integer.MAX_VALUE (use an upperBound helper instead).'],
    java: ['Helper methods with clear names make binary-search code much easier to verify.'],
  },
  {
    id: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    desc: "An integer array `nums` sorted in ascending order (with **distinct** values) is possibly rotated at an unknown pivot, e.g. `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`.\n\nGiven `nums` after the rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not. You must write an algorithm with O(log n) runtime complexity.",
    ex: [
      ['nums = [4,5,6,7,0,1,2], target = 0', '4', ''],
      ['nums = [4,5,6,7,0,1,2], target = 3', '-1', ''],
      ['nums = [1], target = 0', '-1', ''],
    ],
    cons: ['1 <= nums.length <= 5000', 'All values are unique', 'nums is an ascending array that is possibly rotated'],
    fn: { name: 'search', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int' },
    tests: [
      { in: [[4, 5, 6, 7, 0, 1, 2], 0], out: 4 },
      { in: [[4, 5, 6, 7, 0, 1, 2], 3], out: -1 },
      { in: [[1], 0], out: -1 },
      { in: [[3, 1], 1], out: 1 },
      { in: [[5, 1, 3], 5], out: 0 },
      { in: [[6, 7, 1, 2, 3, 4, 5], 6], out: 0 },
      { in: [[1, 2, 3, 4, 5], 4], out: 3 },
    ],
    hints: [
      'After splitting at mid, at least one half is always sorted.',
      'Check which half is sorted by comparing nums[lo] with nums[mid].',
      'If the left half is sorted and nums[lo] <= target < nums[mid], search left; otherwise search right. Mirror the logic when the right half is sorted.',
    ],
    brute: {
      idea: 'Linear scan.',
      code: J`class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) if (nums[i] == target) return i;
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Modified binary search: identify the sorted half and check whether target lies within it.',
      code: J`class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['if (nums[lo] <= nums[mid])', 'Left half [lo..mid] is sorted (no rotation point inside it). <= handles lo == mid.'],
      ['if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;', 'Target lies inside the sorted left half.'],
      ['else lo = mid + 1;', 'Otherwise it can only be in the right half.'],
      ['if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;', 'Right half is sorted and contains target.'],
    ],
    cx: 'We discard half of the range each iteration → O(log n). O(1) space.',
    dry: ['[4,5,6,7,0,1,2], t=0', 'mid3 (7): left [4..7] sorted; 0 not in [4,7) → lo4', 'mid5 (1): left [0..1] sorted; 0 in [0,1) → hi4', 'mid4 (0) → found 4'],
    tips: ['Follow-up with duplicates (Search in Rotated Sorted Array II): when nums[lo] == nums[mid], just do lo++.', 'Alternative: find the pivot (min index) first, then binary search the correct half.'],
    mistakes: ['Using < instead of <= in nums[lo] <= nums[mid] — breaks for two-element ranges.'],
    java: ['Nothing Java-specific; focus on clean conditions and inclusive/exclusive bounds.'],
  },
  {
    id: 'find-minimum-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    desc: "Suppose an array of length `n` sorted in ascending order with **unique** elements is rotated between `1` and `n` times. For example, `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`.\n\nGiven the rotated array `nums`, return the **minimum** element. You must write an algorithm that runs in O(log n) time.",
    ex: [
      ['nums = [3,4,5,1,2]', '1', ''],
      ['nums = [4,5,6,7,0,1,2]', '0', ''],
      ['nums = [11,13,15,17]', '11', 'Rotated n times = not rotated.'],
    ],
    cons: ['1 <= n <= 5000', 'All integers are unique'],
    fn: { name: 'findMin', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[3, 4, 5, 1, 2]], out: 1 },
      { in: [[4, 5, 6, 7, 0, 1, 2]], out: 0 },
      { in: [[11, 13, 15, 17]], out: 11 },
      { in: [[2, 1]], out: 1 },
      { in: [[1]], out: 1 },
    ],
    hints: [
      'Compare nums[mid] with nums[hi]. What does it tell you about where the rotation point is?',
      'If nums[mid] > nums[hi], the minimum is strictly to the right of mid.',
      'Else the minimum is at mid or to its left: hi = mid. Loop while lo < hi and return nums[lo].',
    ],
    brute: {
      idea: 'Linear scan for the minimum.',
      code: J`class Solution {
    public int findMin(int[] nums) {
        int min = nums[0];
        for (int x : nums) min = Math.min(min, x);
        return min;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Binary search comparing mid with the right end.',
      code: J`class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['while (lo < hi)', 'Stop when the range has one element — that is the minimum.'],
      ['if (nums[mid] > nums[hi]) lo = mid + 1;', 'The drop (rotation point) is to the right of mid.'],
      ['else hi = mid;', 'mid..hi is sorted, so the minimum is mid or something left of it.'],
    ],
    cx: 'O(log n) time, O(1) space.',
    dry: ['[3,4,5,1,2]', 'lo0 hi4 mid2 (5 > 2) → lo3', 'lo3 hi4 mid3 (1 ≤ 2) → hi3 → return 1'],
    tips: ['Compare with nums[hi] rather than nums[lo] — it handles the unrotated case without special logic.'],
    mistakes: ['Using hi = mid - 1 in the else branch skips the minimum.'],
    java: ['`int mid = lo + (hi - lo) / 2` avoids the overflow of `(lo + hi) / 2` for large indices — a classic Java interview point.', 'Compound boolean conditions with `&&` short-circuit, so range checks stay cheap and safe.'],
  },
  {
    id: 'find-peak-element',
    title: 'Find Peak Element',
    difficulty: 'Medium',
    desc: "A **peak element** is an element that is strictly greater than its neighbours. Given a 0-indexed integer array `nums`, find a peak element and return its index. Imagine `nums[-1] = nums[n] = -∞`.\n\nYou must write an algorithm that runs in O(log n) time. (In the test cases below, each array has exactly one peak.)",
    ex: [
      ['nums = [1,2,3,1]', '2', '3 is a peak element and its index is 2.'],
      ['nums = [1,5,9,7,2]', '2', ''],
    ],
    cons: ['1 <= nums.length <= 1000', 'nums[i] != nums[i + 1] for all valid i'],
    fn: { name: 'findPeakElement', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3, 1]], out: 2 },
      { in: [[1, 5, 9, 7, 2]], out: 2 },
      { in: [[1]], out: 0 },
      { in: [[5, 4, 3]], out: 0 },
      { in: [[1, 2, 3]], out: 2 },
      { in: [[2, 4, 6, 8, 10, 3]], out: 4 },
    ],
    hints: [
      'If nums[mid] < nums[mid + 1], you are on an upward slope. Is there a peak to the right?',
      'Walking uphill must eventually reach a peak (because nums[n] = -∞).',
      'Binary search: if nums[mid] < nums[mid+1], lo = mid + 1; else hi = mid. Return lo.',
    ],
    brute: {
      idea: 'Return the first index that is greater than its next element (or the last index).',
      code: J`class Solution {
    public int findPeakElement(int[] nums) {
        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) return i;
        }
        return nums.length - 1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Binary search on the slope direction.',
      code: J`class Solution {
    public int findPeakElement(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['if (nums[mid] < nums[mid + 1]) lo = mid + 1;', 'Ascending slope → a peak exists strictly to the right.'],
      ['else hi = mid;', 'Descending slope → mid itself may be the peak, or one exists to the left.'],
      ['return lo;', 'lo == hi converges onto a peak.'],
    ],
    cx: 'O(log n) — binary search does not need a sorted array, just a rule to discard half.',
    dry: ['[1,2,3,1]', 'mid1: 2 < 3 → lo2', 'mid2: 3 > 1 → hi2 → 2'],
    tips: ['Great example that binary search works on any monotonic decision, not just sorted arrays.'],
    mistakes: ['Accessing nums[mid + 1] when mid == n - 1 (cannot happen when lo < hi).'],
    java: ['`Arrays.stream(nums).min().getAsInt()` is the one-line O(n) alternative — mention it, then explain why binary search is O(log n).', 'Integer division `(hi - lo) / 2` truncates toward zero, which is exactly the floor for non-negative values.'],
  },
  {
    id: 'sqrt-x',
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    desc: "Given a non-negative integer `x`, return the **square root of `x` rounded down** to the nearest integer. You must not use any built-in exponent function or operator such as `Math.sqrt` or `Math.pow`.",
    ex: [
      ['x = 4', '2', ''],
      ['x = 8', '2', 'The square root of 8 is 2.828..., rounded down to 2.'],
    ],
    cons: ['0 <= x <= 2^31 - 1'],
    fn: { name: 'mySqrt', params: [['int', 'x']], ret: 'int' },
    tests: [
      { in: [4], out: 2 },
      { in: [8], out: 2 },
      { in: [0], out: 0 },
      { in: [1], out: 1 },
      { in: [2147395599], out: 46339 },
      { in: [2147483647], out: 46340 },
    ],
    hints: [
      'The answer is the largest k such that k * k <= x.',
      'k*k is monotonic — binary search over k in [0, x].',
      'Use long for mid * mid to avoid overflow, or compare mid <= x / mid.',
    ],
    brute: {
      idea: 'Increment k while (k+1)^2 <= x (using long).',
      code: J`class Solution {
    public int mySqrt(int x) {
        long k = 0;
        while ((k + 1) * (k + 1) <= x) k++;
        return (int) k;
    }
}`,
      time: 'O(√x)', space: 'O(1)',
    },
    optimal: {
      idea: 'Binary search for the largest k with k² ≤ x.',
      code: J`class Solution {
    public int mySqrt(int x) {
        if (x < 2) return x;
        int lo = 1, hi = x / 2, ans = 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if ((long) mid * mid <= x) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}`,
      time: 'O(log x)', space: 'O(1)',
    },
    lines: [
      ['if (x < 2) return x;', '0 and 1 are their own square roots.'],
      ['int lo = 1, hi = x / 2', 'For x ≥ 2, √x ≤ x/2.'],
      ['if ((long) mid * mid <= x)', 'Cast to long BEFORE multiplying to avoid int overflow.'],
      ['ans = mid; lo = mid + 1;', 'mid is valid; look for a larger valid value.'],
    ],
    cx: 'O(log x) iterations, O(1) space. Newton\'s method converges even faster (quadratically).',
    dry: ['x=8: lo1 hi4', 'mid2: 4 ≤ 8 → ans2, lo3', 'mid3: 9 > 8 → hi2 → return 2'],
    tips: ['This "binary search on the answer" pattern reappears in Koko Eating Bananas and Capacity to Ship Packages.'],
    mistakes: ['`mid * mid` overflows for mid > 46340.'],
    java: ['`(long) mid * mid` — the cast binds tighter than *, so the multiplication happens in long.'],
  },
  {
    id: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    desc: "Koko has `n` piles of bananas; the `i`-th pile has `piles[i]` bananas. The guards return in `h` hours.\n\nEach hour, Koko chooses a pile and eats `k` bananas from it. If the pile has fewer than `k` bananas, she eats them all and won't eat more that hour. Return the **minimum integer `k`** such that she can eat all the bananas within `h` hours.",
    ex: [
      ['piles = [3,6,7,11], h = 8', '4', ''],
      ['piles = [30,11,23,4,20], h = 5', '30', ''],
      ['piles = [30,11,23,4,20], h = 6', '23', ''],
    ],
    cons: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    fn: { name: 'minEatingSpeed', params: [['int[]', 'piles'], ['int', 'h']], ret: 'int' },
    tests: [
      { in: [[3, 6, 7, 11], 8], out: 4 },
      { in: [[30, 11, 23, 4, 20], 5], out: 30 },
      { in: [[30, 11, 23, 4, 20], 6], out: 23 },
      { in: [[1000000000], 2], out: 500000000 },
      { in: [[312884470], 312884469], out: 2 },
    ],
    hints: [
      'If speed k works, does every speed greater than k also work?',
      'Yes — feasibility is monotonic, so binary search on k in [1, max(piles)].',
      'Hours needed at speed k = Σ ceil(pile / k) = Σ (pile + k - 1) / k. Use long for the sum.',
    ],
    brute: {
      idea: 'Try speeds 1, 2, 3, … until one is feasible. Correct but too slow when piles are huge.',
      code: J`class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int max = 0;
        for (int p : piles) max = Math.max(max, p);
        for (int k = 1; k <= max; k++) {
            if (canFinish(piles, h, k)) return k;
        }
        return max;
    }

    private boolean canFinish(int[] piles, int h, int k) {
        long hours = 0;
        for (int p : piles) hours += (p + (long) k - 1) / k;
        return hours <= h;
    }
}`,
      time: 'O(n · max) worst case', space: 'O(1)',
    },
    optimal: {
      idea: 'Binary search on the answer (speed) with a feasibility check.',
      code: J`class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private long hoursNeeded(int[] piles, int k) {
        long hours = 0;
        for (int p : piles) {
            hours += (p + (long) k - 1) / k;
        }
        return hours;
    }
}`,
      time: 'O(n log max)', space: 'O(1)',
    },
    lines: [
      ['int lo = 1, hi = max(piles)', 'Speed max(piles) always works (one hour per pile) and speed 0 is meaningless.'],
      ['if (hoursNeeded(piles, mid) <= h) hi = mid;', 'mid is feasible; maybe a smaller speed is too.'],
      ['else lo = mid + 1;', 'Too slow; need a faster speed.'],
      ['hours += (p + (long) k - 1) / k;', 'Integer ceiling division; long avoids overflow when p is near 10^9.'],
    ],
    cx: 'Binary search over [1, max] takes O(log max) steps; each check is O(n) → O(n log max).',
    dry: ['[3,6,7,11], h=8, range [1,11]', 'mid6: 1+1+2+2=6 ≤ 8 → hi6', 'mid3: 1+2+3+4=10 > 8 → lo4', 'mid5: 1+2+2+3=8 → hi5', 'mid4: 1+2+2+3=8 → hi4 → answer 4'],
    tips: ['Recognise the pattern: "minimum X such that condition(X) holds" + monotonic condition → binary search on the answer.'],
    mistakes: ['Summing hours in int → overflow.', 'Using Math.ceil with doubles (precision issues, slower).'],
    java: ['Ceiling of a / b for positives: `(a + b - 1) / b`.'],
  },
  {
    id: 'median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    desc: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be **O(log (m+n))**.",
    ex: [
      ['nums1 = [1,3], nums2 = [2]', '2.0', 'Merged array = [1,2,3] and median is 2.'],
      ['nums1 = [1,2], nums2 = [3,4]', '2.5', 'Merged = [1,2,3,4], median = (2 + 3) / 2 = 2.5.'],
    ],
    cons: ['0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    fn: { name: 'findMedianSortedArrays', params: [['int[]', 'nums1'], ['int[]', 'nums2']], ret: 'double' },
    tests: [
      { in: [[1, 3], [2]], out: 2.0 },
      { in: [[1, 2], [3, 4]], out: 2.5 },
      { in: [[], [1]], out: 1.0 },
      { in: [[0, 0], [0, 0]], out: 0.0 },
      { in: [[1, 3, 8, 9, 15], [7, 11, 18, 19, 21, 25]], out: 11.0 },
      { in: [[2], []], out: 2.0 },
    ],
    hints: [
      'Merging takes O(m + n). The median only needs the "middle split" of the combined array.',
      'Partition both arrays so that the left parts together contain half of all elements, and every left element <= every right element.',
      'Binary search the partition index i in the SMALLER array; j = (m + n + 1) / 2 - i. Check maxLeft1 <= minRight2 and maxLeft2 <= minRight1.',
    ],
    brute: {
      idea: 'Merge both arrays (like merge sort), then pick the middle element(s).',
      code: J`class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[] merged = new int[m + n];
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) merged[k++] = nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++];
        while (i < m) merged[k++] = nums1[i++];
        while (j < n) merged[k++] = nums2[j++];
        int total = m + n;
        if (total % 2 == 1) return merged[total / 2];
        return (merged[total / 2 - 1] + merged[total / 2]) / 2.0;
    }
}`,
      time: 'O(m + n)', space: 'O(m + n)',
    },
    optimal: {
      idea: 'Binary search a partition of the smaller array such that both left halves form the lower half of the merged array.',
      code: J`class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = lo + (hi - lo) / 2;
            int j = half - i;
            int left1 = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
            int right1 = i == m ? Integer.MAX_VALUE : nums1[i];
            int left2 = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
            int right2 = j == n ? Integer.MAX_VALUE : nums2[j];
            if (left1 <= right2 && left2 <= right1) {
                if ((m + n) % 2 == 1) return Math.max(left1, left2);
                return (Math.max(left1, left2) + (double) Math.min(right1, right2)) / 2.0;
            } else if (left1 > right2) {
                hi = i - 1;
            } else {
                lo = i + 1;
            }
        }
        throw new IllegalArgumentException("Input arrays are not sorted");
    }
}`,
      time: 'O(log min(m, n))', space: 'O(1)',
    },
    lines: [
      ['if (nums1.length > nums2.length) return find...(nums2, nums1);', 'Binary search the smaller array so j is always valid and the cost is log(min).'],
      ['int half = (m + n + 1) / 2;', 'Size of the combined left half (gets the extra element when total is odd).'],
      ['int j = half - i;', 'Taking i elements from nums1 forces j from nums2.'],
      ['left1/right1/left2/right2 with MIN/MAX sentinels', 'Handle partitions at the very edges of an array.'],
      ['if (left1 <= right2 && left2 <= right1)', 'Correct partition: everything on the left is <= everything on the right.'],
      ['else if (left1 > right2) hi = i - 1;', 'Took too many from nums1 → move partition left.'],
      ['else lo = i + 1;', 'Took too few from nums1 → move right.'],
    ],
    cx: 'Binary search over at most min(m, n) + 1 partition positions → O(log min(m, n)). Constant space.',
    dry: ['nums1=[1,3], nums2=[2] → swap so nums1=[2], nums2=[1,3]; half=2', 'i=0, j=2: left1=-inf,right1=2,left2=3,right2=+inf → left2 > right1 → lo=1', 'i=1, j=1: left1=2,right1=+inf,left2=1,right2=3 ✓ → odd → max(2,1)=2'],
    tips: ['Start by explaining the O(m+n) merge, then the partition idea. Few candidates finish the log version without explanation.', 'Alternative: generic "k-th smallest of two arrays" recursion in O(log(m+n)).'],
    mistakes: ['Binary searching the larger array → j can go negative.', 'Integer division when averaging (use 2.0).'],
    java: ['`Integer.MIN_VALUE` / `MAX_VALUE` as sentinels; cast to double before adding to avoid int overflow.'],
  },
  {
    id: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    desc: "Given an array `nums` with `n` objects colored red, white, or blue (represented by `0`, `1`, `2`), sort them **in-place** so that objects of the same color are adjacent, in the order red, white, blue.\n\nYou must solve this without using the library's sort function. Follow-up: one pass, constant space.",
    ex: [
      ['nums = [2,0,2,1,1,0]', '[0,0,1,1,2,2]', ''],
      ['nums = [2,0,1]', '[0,1,2]', ''],
    ],
    cons: ['1 <= n <= 300', 'nums[i] is 0, 1, or 2'],
    fn: { name: 'sortColors', params: [['int[]', 'nums']], ret: 'void', out: 0 },
    tests: [
      { in: [[2, 0, 2, 1, 1, 0]], out: [0, 0, 1, 1, 2, 2] },
      { in: [[2, 0, 1]], out: [0, 1, 2] },
      { in: [[0]], out: [0] },
      { in: [[2, 2, 1, 1, 0, 0]], out: [0, 0, 1, 1, 2, 2] },
      { in: [[1, 0, 2, 1, 0]], out: [0, 0, 1, 1, 2] },
    ],
    hints: [
      'Counting sort works in two passes. Can you do it in one?',
      'Maintain three regions: 0s at the front, 2s at the back, 1s in the middle, and an unknown region.',
      'Pointers low, mid, high. nums[mid]==0 → swap with low, low++, mid++. ==1 → mid++. ==2 → swap with high, high-- (do not advance mid).',
    ],
    brute: {
      idea: 'Counting sort: count 0s, 1s, 2s and rewrite the array.',
      code: J`class Solution {
    public void sortColors(int[] nums) {
        int[] count = new int[3];
        for (int x : nums) count[x]++;
        int k = 0;
        for (int c = 0; c < 3; c++) {
            for (int t = 0; t < count[c]; t++) nums[k++] = c;
        }
    }
}`,
      time: 'O(n), two passes', space: 'O(1)',
    },
    optimal: {
      idea: 'Dijkstra\'s Dutch National Flag partitioning in one pass.',
      code: J`class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low++, mid++);
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums, mid, high--);
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`,
      time: 'O(n), one pass', space: 'O(1)',
    },
    lines: [
      ['int low = 0, mid = 0, high = n - 1;', 'Invariants: [0, low) are 0s, [low, mid) are 1s, (high, n-1] are 2s, [mid, high] unknown.'],
      ['while (mid <= high)', 'Process until the unknown region is empty.'],
      ['if (nums[mid] == 0) swap(nums, low++, mid++);', 'Move the 0 to the 0-region. The element swapped in from low is a 1 (already processed), so mid can advance.'],
      ['else if (nums[mid] == 1) mid++;', '1 is already in the right region.'],
      ['else swap(nums, mid, high--);', 'Move the 2 to the back. The swapped-in element is unknown, so mid stays put.'],
    ],
    cx: 'Each step either advances mid or shrinks high → at most n steps → O(n). In-place → O(1).',
    dry: ['[2,0,2,1,1,0], l0 m0 h5', 'm0=2 → swap h5 → [0,0,2,1,1,2], h4', 'm0=0 → swap l0 → l1 m1', 'm1=0 → l2 m2', 'm2=2 → swap h4 → [0,0,1,1,2,2], h3', 'm2=1 → m3; m3=1 → m4 > h3 stop'],
    tips: ['The same 3-way partition is used in quicksort for arrays with many duplicates.'],
    mistakes: ['Advancing mid after swapping with high.'],
    java: ['`swap(nums, low++, mid++)` passes current indices and increments both afterwards.'],
  },
  {
    id: 'sort-an-array',
    title: 'Sort an Array (Merge Sort)',
    difficulty: 'Medium',
    desc: "Given an array of integers `nums`, sort the array in **ascending order** and return it.\n\nYou must solve the problem **without using any built-in sort functions** in O(n log n) time complexity. This is the classic interview prompt to implement merge sort (or heap sort / quicksort) yourself.",
    ex: [
      ['nums = [5,2,3,1]', '[1,2,3,5]', ''],
      ['nums = [5,1,1,2,0,0]', '[0,0,1,1,2,5]', ''],
    ],
    cons: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
    fn: { name: 'sortArray', params: [['int[]', 'nums']], ret: 'int[]' },
    tests: [
      { in: [[5, 2, 3, 1]], out: [1, 2, 3, 5] },
      { in: [[5, 1, 1, 2, 0, 0]], out: [0, 0, 1, 1, 2, 5] },
      { in: [[1]], out: [1] },
      { in: [[-3, 10, -7, 0, 2]], out: [-7, -3, 0, 2, 10] },
      { in: [[9, 8, 7, 6, 5, 4, 3, 2, 1]], out: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    ],
    hints: [
      'Bubble / insertion / selection sort are O(n^2). Which algorithms guarantee O(n log n)?',
      'Merge sort: split in half, sort each half recursively, merge the two sorted halves.',
      'Allocate one temp array once and reuse it in every merge to avoid repeated allocations.',
    ],
    brute: {
      idea: 'Insertion sort — simple and stable, but quadratic.',
      code: J`class Solution {
    public int[] sortArray(int[] nums) {
        for (int i = 1; i < nums.length; i++) {
            int key = nums[i];
            int j = i - 1;
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j];
                j--;
            }
            nums[j + 1] = key;
        }
        return nums;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Top-down merge sort with a single shared buffer.',
      code: J`class Solution {
    public int[] sortArray(int[] nums) {
        int[] temp = new int[nums.length];
        mergeSort(nums, 0, nums.length - 1, temp);
        return nums;
    }

    private void mergeSort(int[] a, int lo, int hi, int[] temp) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(a, lo, mid, temp);
        mergeSort(a, mid + 1, hi, temp);
        merge(a, lo, mid, hi, temp);
    }

    private void merge(int[] a, int lo, int mid, int hi, int[] temp) {
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        }
        while (i <= mid) temp[k++] = a[i++];
        while (j <= hi) temp[k++] = a[j++];
        for (k = lo; k <= hi; k++) a[k] = temp[k];
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    lines: [
      ['int[] temp = new int[nums.length];', 'One buffer reused by all merges (instead of allocating in every call).'],
      ['if (lo >= hi) return;', 'Base case: 0 or 1 element is already sorted.'],
      ['mergeSort(a, lo, mid, temp); mergeSort(a, mid + 1, hi, temp);', 'Divide: sort both halves recursively.'],
      ['temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];', 'Conquer: take the smaller head. <= keeps the sort stable.'],
      ['while (i <= mid) ...; while (j <= hi) ...;', 'Copy leftovers from whichever half remains.'],
      ['for (k = lo; k <= hi; k++) a[k] = temp[k];', 'Copy the merged range back.'],
    ],
    cx: 'Recursion depth log n; each level merges n elements → O(n log n) in all cases. Buffer O(n) + recursion stack O(log n).',
    dry: ['[5,2,3,1]', 'split [5,2] | [3,1]', '[5,2] → [2,5]; [3,1] → [1,3]', 'merge [2,5] + [1,3] → 1,2,3,5'],
    tips: ['Know the trade-offs: merge sort is stable and O(n log n) worst case; quicksort is in-place on average but O(n^2) worst case; heap sort is in-place O(n log n) but not stable.', 'Java\'s Arrays.sort uses Dual-Pivot Quicksort for primitives and TimSort (merge-based, stable) for objects.'],
    mistakes: ['Allocating new arrays in every merge (slow, GC heavy).', 'Using < instead of <= — breaks stability.'],
    java: ['`Arrays.sort(int[])` → Dual-Pivot Quicksort; `Arrays.sort(Object[])` / `Collections.sort` → TimSort.'],
  },
  {
    id: 'count-inversions',
    title: 'Count Inversions',
    difficulty: 'Hard',
    desc: "Given an array of integers `arr`, return the number of **inversions**: pairs of indices `(i, j)` such that `i < j` and `arr[i] > arr[j]`.\n\nThe inversion count indicates how far the array is from being sorted. Return the count as a `long`.",
    ex: [
      ['arr = [2, 4, 1, 3, 5]', '3', 'Inversions: (2,1), (4,1), (4,3).'],
      ['arr = [2, 3, 4, 5, 6]', '0', 'Already sorted.'],
      ['arr = [10, 10, 10]', '0', 'Equal elements are not inversions.'],
    ],
    cons: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^18 (values fit in int in these tests)'],
    fn: { name: 'inversionCount', params: [['int[]', 'arr']], ret: 'long' },
    tests: [
      { in: [[2, 4, 1, 3, 5]], out: 3 },
      { in: [[2, 3, 4, 5, 6]], out: 0 },
      { in: [[10, 10, 10]], out: 0 },
      { in: [[5, 4, 3, 2, 1]], out: 10 },
      { in: [[1, 20, 6, 4, 5]], out: 5 },
    ],
    hints: [
      'Checking all pairs is O(n^2). Can sorting help you count?',
      'During merge sort\'s merge step, when an element from the right half is placed before elements of the left half, each remaining left element forms an inversion with it.',
      'In merge: if left[i] > right[j], add (mid - i + 1) to the count.',
    ],
    brute: {
      idea: 'Count all pairs i < j with arr[i] > arr[j].',
      code: J`class Solution {
    public long inversionCount(int[] arr) {
        long count = 0;
        for (int i = 0; i < arr.length; i++)
            for (int j = i + 1; j < arr.length; j++)
                if (arr[i] > arr[j]) count++;
        return count;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Merge sort with counting: cross inversions are counted in bulk during merge.',
      code: J`class Solution {
    public long inversionCount(int[] arr) {
        int[] a = arr.clone();
        return sortCount(a, new int[a.length], 0, a.length - 1);
    }

    private long sortCount(int[] a, int[] tmp, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = lo + (hi - lo) / 2;
        long count = sortCount(a, tmp, lo, mid) + sortCount(a, tmp, mid + 1, hi);
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            if (a[i] <= a[j]) {
                tmp[k++] = a[i++];
            } else {
                tmp[k++] = a[j++];
                count += mid - i + 1;
            }
        }
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi) tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
        return count;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    lines: [
      ['int[] a = arr.clone();', 'Do not mutate the caller\'s array.'],
      ['long count = sortCount(left) + sortCount(right);', 'Inversions entirely inside each half.'],
      ['if (a[i] <= a[j]) tmp[k++] = a[i++];', 'No inversion — equal elements are not counted.'],
      ['count += mid - i + 1;', 'a[j] is smaller than a[i] and all remaining left elements a[i..mid] (they are sorted), giving mid - i + 1 inversions at once.'],
      ['System.arraycopy(tmp, lo, a, lo, hi - lo + 1);', 'Copy the merged run back.'],
    ],
    cx: 'Same recurrence as merge sort: T(n) = 2T(n/2) + O(n) → O(n log n). Buffer O(n). The count can reach n(n-1)/2 ≈ 5·10^9 → must be long.',
    dry: ['[2,4,1,3,5]', 'left [2,4], right [1,3,5]', 'merge: 1 < 2 → +2 (2 and 4)', '2 < 3 → take 2', '3 < 4 → +1 (4)', 'total 3'],
    tips: ['A Fenwick tree (BIT) over compressed values is another O(n log n) approach.', 'Related: Reverse Pairs (arr[i] > 2·arr[j]), Count of Smaller Numbers After Self.'],
    mistakes: ['Using int for the count → overflow for n = 10^5.', 'Counting equal elements as inversions (use <= in the merge).'],
    java: ['`System.arraycopy` is a native bulk copy — faster than a manual loop.'],
  },
  {
    id: 'search-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    desc: "You are given an `m x n` integer `matrix` with the following properties:\n\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix`, or `false` otherwise. You must write a solution in O(log(m · n)) time.",
    ex: [
      ['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', 'true', ''],
      ['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', 'false', ''],
    ],
    cons: ['1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4'],
    fn: { name: 'searchMatrix', params: [['int[][]', 'matrix'], ['int', 'target']], ret: 'boolean' },
    tests: [
      { in: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], out: true },
      { in: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], out: false },
      { in: [[[1]], 1], out: true },
      { in: [[[1], [3]], 3], out: true },
      { in: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 60], out: true },
      { in: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 0], out: false },
    ],
    hints: [
      'If you read the matrix row by row, what do you get?',
      'A single sorted array of length m·n.',
      'Binary search over index k in [0, m·n - 1] and map it to matrix[k / n][k % n].',
    ],
    brute: {
      idea: 'Staircase search from the top-right corner (O(m + n)) — also works for matrices with only row/column sorting.',
      code: J`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int r = 0, c = matrix[0].length - 1;
        while (r < matrix.length && c >= 0) {
            if (matrix[r][c] == target) return true;
            if (matrix[r][c] > target) c--;
            else r++;
        }
        return false;
    }
}`,
      time: 'O(m + n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Treat the matrix as a flattened sorted array and binary search it.',
      code: J`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
}`,
      time: 'O(log(m·n))', space: 'O(1)',
    },
    lines: [
      ['int lo = 0, hi = m * n - 1;', 'Virtual indices of the flattened matrix.'],
      ['int val = matrix[mid / n][mid % n];', 'Row = index / columns, column = index % columns.'],
      ['if (val < target) lo = mid + 1; else hi = mid - 1;', 'Standard binary search.'],
    ],
    cx: 'O(log(m·n)) time, O(1) space.',
    dry: ['3x4, target 3: lo0 hi11', 'mid5 → [1][1]=11 > 3 → hi4', 'mid2 → [0][2]=5 > 3 → hi1', 'mid0 → 1 < 3 → lo1', 'mid1 → 3 ✓'],
    tips: ['Search a 2D Matrix II (rows and columns sorted independently) needs the staircase method.'],
    mistakes: ['Using m instead of n for the index mapping.'],
    java: ['Row/column from a flat index: `matrix[mid / n][mid % n]` — `/` and `%` on ints give quotient and remainder.', 'In Java a 2-D array is an array of row arrays, so `matrix[0].length` is the column count (rows may be jagged in general).'],
  },
  {
    id: 'largest-number',
    title: 'Largest Number',
    difficulty: 'Medium',
    desc: "Given a list of non-negative integers `nums`, arrange them such that they form the **largest number** and return it as a string.\n\nThe result may be very large, so return a string instead of an integer.",
    ex: [
      ['nums = [10,2]', '"210"', ''],
      ['nums = [3,30,34,5,9]', '"9534330"', ''],
      ['nums = [0,0]', '"0"', 'Not "00".'],
    ],
    cons: ['1 <= nums.length <= 100', '0 <= nums[i] <= 10^9'],
    fn: { name: 'largestNumber', params: [['int[]', 'nums']], ret: 'String' },
    tests: [
      { in: [[10, 2]], out: '210' },
      { in: [[3, 30, 34, 5, 9]], out: '9534330' },
      { in: [[0, 0]], out: '0' },
      { in: [[1]], out: '1' },
      { in: [[121, 12]], out: '12121' },
      { in: [[999999991, 9]], out: '9999999991' },
    ],
    hints: [
      'Sorting numerically fails: [10, 2] → "102" < "210".',
      'For two numbers a and b, which should come first?',
      'Sort strings with comparator (a, b) -> (b + a).compareTo(a + b). Handle the all-zero case.',
    ],
    brute: {
      idea: 'Try all permutations and keep the largest concatenation (only feasible for tiny inputs).',
      code: J`class Solution {
    private String best = "";

    public String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        permute(s, 0);
        return best.charAt(0) == '0' ? "0" : best;
    }

    private void permute(String[] s, int k) {
        if (k == s.length) {
            String cand = String.join("", s);
            if (cand.length() > best.length() || (cand.length() == best.length() && cand.compareTo(best) > 0)) best = cand;
            return;
        }
        for (int i = k; i < s.length; i++) {
            String t = s[k]; s[k] = s[i]; s[i] = t;
            permute(s, k + 1);
            t = s[k]; s[k] = s[i]; s[i] = t;
        }
    }
}`,
      time: 'O(n! · L)', space: 'O(n · L)',
    },
    optimal: {
      idea: 'Custom comparator: a goes before b if a + b > b + a as strings.',
      code: J`import java.util.*;

class Solution {
    public String largestNumber(int[] nums) {
        String[] strs = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            strs[i] = String.valueOf(nums[i]);
        }
        Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));
        if (strs[0].equals("0")) return "0";
        StringBuilder sb = new StringBuilder();
        for (String s : strs) sb.append(s);
        return sb.toString();
    }
}`,
      time: 'O(n log n · L)', space: 'O(n · L)',
    },
    lines: [
      ['strs[i] = String.valueOf(nums[i]);', 'Work with strings — we compare concatenations, not values.'],
      ['Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));', 'Descending by "which order produces the larger concatenation". For "3" vs "30": "330" > "303" → 3 first.'],
      ['if (strs[0].equals("0")) return "0";', 'If the largest is "0", all are zeros.'],
    ],
    cx: 'Sorting does O(n log n) comparisons, each O(L) where L ≤ 10 digits → O(n log n · L).',
    dry: ['[3,30,34,5,9]', 'Comparator order: 9, 5, 34, 3, 30', '34 before 3 because "343" > "334"; 3 before 30 because "330" > "303"', 'join → "9534330"'],
    tips: ['Be ready to argue the comparator is transitive (it is) — interviewers sometimes ask.'],
    mistakes: ['Forgetting the leading-zero case.', 'Comparing by the first digit only.'],
    java: ['`Arrays.sort(T[], Comparator)` uses TimSort (stable). Primitive arrays cannot take a Comparator — that is why we convert to String[].', '`String.compareTo` compares lexicographically.'],
  },
  {
    id: 'capacity-to-ship-packages',
    title: 'Capacity To Ship Packages Within D Days',
    difficulty: 'Medium',
    desc: "A conveyor belt has packages that must be shipped from one port to another within `days` days. The `i`-th package has weight `weights[i]`. Each day, we load the ship with packages **in the order given** by `weights`. We may not load more weight than the ship's maximum capacity.\n\nReturn the **least weight capacity** of the ship that will result in all packages being shipped within `days` days.",
    ex: [
      ['weights = [1,2,3,4,5,6,7,8,9,10], days = 5', '15', 'Day1: 1..5, Day2: 6,7, Day3: 8, Day4: 9, Day5: 10.'],
      ['weights = [3,2,2,4,1,4], days = 3', '6', ''],
      ['weights = [1,2,3,1,1], days = 4', '3', ''],
    ],
    cons: ['1 <= days <= weights.length <= 5 * 10^4', '1 <= weights[i] <= 500'],
    fn: { name: 'shipWithinDays', params: [['int[]', 'weights'], ['int', 'days']], ret: 'int' },
    tests: [
      { in: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], out: 15 },
      { in: [[3, 2, 2, 4, 1, 4], 3], out: 6 },
      { in: [[1, 2, 3, 1, 1], 4], out: 3 },
      { in: [[10], 1], out: 10 },
      { in: [[5, 5, 5, 5], 4], out: 5 },
    ],
    hints: [
      'What is the minimum possible capacity? The maximum?',
      'Capacity must be at least max(weights) and at most sum(weights). Feasibility is monotonic in capacity.',
      'Binary search capacity; greedily count days needed by filling each day until the next package would overflow.',
    ],
    brute: {
      idea: 'Try every capacity from max(weights) upward until it fits in the given days.',
      code: J`class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int cap = 0;
        for (int w : weights) cap = Math.max(cap, w);
        while (daysNeeded(weights, cap) > days) cap++;
        return cap;
    }

    private int daysNeeded(int[] weights, int cap) {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    }
}`,
      time: 'O(n · sum)', space: 'O(1)',
    },
    optimal: {
      idea: 'Binary search on capacity in [max, sum] with a greedy day counter.',
      code: J`class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int lo = 0, hi = 0;
        for (int w : weights) {
            lo = Math.max(lo, w);
            hi += w;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (daysNeeded(weights, mid) <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private int daysNeeded(int[] weights, int cap) {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) {
                d++;
                load = 0;
            }
            load += w;
        }
        return d;
    }
}`,
      time: 'O(n log(sum))', space: 'O(1)',
    },
    lines: [
      ['lo = max(weights), hi = sum(weights)', 'The ship must carry the heaviest package; capacity = sum ships everything in one day.'],
      ['if (daysNeeded(weights, mid) <= days) hi = mid;', 'Feasible → try smaller capacity.'],
      ['if (load + w > cap) { d++; load = 0; }', 'Greedy: start a new day when the next package does not fit.'],
    ],
    cx: 'O(log(sum)) iterations × O(n) check → O(n log(sum)).',
    dry: ['[3,2,2,4,1,4], days=3, lo=4, hi=16', 'mid10 → 2 days ✓ hi10', 'mid7 → [3,2,2][4,1][4] = 3 ✓ hi7', 'mid5 → 4 days ✗ lo6', 'mid6 → [3,2][2,4][1,4] = 3 ✓ hi6 → 6'],
    tips: ['Same template as Koko and Split Array Largest Sum.'],
    mistakes: ['Starting lo at 1 (works, but slower and capacity < max weight is impossible).'],
    java: ['The helper `daysNeeded` keeps the binary-search loop readable — small private methods are good interview style.', 'Sum of weights fits in `int` here (5·10^4 × 500 = 2.5·10^7); switch to `long` if constraints grow.'],
  },
];
