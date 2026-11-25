const J = String.raw;

export default [
  {
    id: 'two-sum-ii-sorted',
    title: 'Two Sum II – Input Array Is Sorted',
    difficulty: 'Medium',
    desc: "Given a **1-indexed** array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers that add up to a specific `target`. Return their indices `[index1, index2]` (1-indexed, `index1 < index2`).\n\nExactly one solution exists. Your solution must use only **constant extra space**.",
    ex: [
      ['numbers = [2,7,11,15], target = 9', '[1,2]', '2 + 7 = 9, so index1 = 1, index2 = 2.'],
      ['numbers = [2,3,4], target = 6', '[1,3]', ''],
      ['numbers = [-1,0], target = -1', '[1,2]', ''],
    ],
    cons: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i], target <= 1000', 'Sorted in non-decreasing order'],
    fn: { name: 'twoSum', params: [['int[]', 'numbers'], ['int', 'target']], ret: 'int[]' },
    tests: [
      { in: [[2, 7, 11, 15], 9], out: [1, 2] },
      { in: [[2, 3, 4], 6], out: [1, 3] },
      { in: [[-1, 0], -1], out: [1, 2] },
      { in: [[1, 2, 3, 4, 4, 9, 56, 90], 8], out: [4, 5] },
      { in: [[5, 25, 75], 100], out: [2, 3] },
    ],
    hints: [
      'The array is sorted — how can you use that instead of a HashMap?',
      'Start with the smallest and largest elements. If their sum is too big, which pointer should move?',
      'left = 0, right = n - 1. If sum < target, left++; if sum > target, right--; else return [left + 1, right + 1].',
    ],
    brute: {
      idea: 'For each element, binary search for its complement in the remaining suffix.',
      code: J`class Solution {
    public int[] twoSum(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i++) {
            int need = target - numbers[i];
            int lo = i + 1, hi = numbers.length - 1;
            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (numbers[mid] == need) return new int[]{i + 1, mid + 1};
                if (numbers[mid] < need) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return new int[0];
    }
}`,
      time: 'O(n log n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Converging two pointers exploit the sorted order.',
      code: J`class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[0];
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int left = 0, right = numbers.length - 1;', 'Smallest and largest candidates.'],
      ['if (sum == target) return new int[]{left + 1, right + 1};', 'Found it; convert to 1-indexed.'],
      ['else if (sum < target) left++;', 'Need a bigger sum: only moving left rightward can increase it.'],
      ['else right--;', 'Sum too big: move right leftward to decrease it.'],
    ],
    cx: 'Each step moves one pointer inward, so at most n steps → O(n). O(1) space — better than the HashMap Two Sum.',
    dry: ['[2,7,11,15], t=9', 'L=0,R=3: 17 > 9 → R=2', '13 > 9 → R=1', '9 == 9 → [1,2]'],
    tips: ['Explain why no valid pair is skipped: when sum > target, numbers[right] cannot pair with any element ≥ numbers[left].'],
    mistakes: ['Returning 0-indexed answers.', 'Using a HashMap ignores the constant-space requirement.'],
    java: ['`lo + (hi - lo) / 2` avoids integer overflow compared to `(lo + hi) / 2`.'],
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i`, `j`, `k` are distinct and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must **not contain duplicate triplets**. Triplets and their order may be returned in any order.",
    ex: [
      ['nums = [-1,0,1,2,-1,-4]', '[[-1,-1,2],[-1,0,1]]', ''],
      ['nums = [0,1,1]', '[]', ''],
      ['nums = [0,0,0]', '[[0,0,0]]', ''],
    ],
    cons: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    fn: { name: 'threeSum', params: [['int[]', 'nums']], ret: 'List<List<Integer>>' },
    cmp: 'deep',
    tests: [
      { in: [[-1, 0, 1, 2, -1, -4]], out: [[-1, -1, 2], [-1, 0, 1]] },
      { in: [[0, 1, 1]], out: [] },
      { in: [[0, 0, 0]], out: [[0, 0, 0]] },
      { in: [[0, 0, 0, 0]], out: [[0, 0, 0]] },
      { in: [[-2, 0, 1, 1, 2]], out: [[-2, 0, 2], [-2, 1, 1]] },
      { in: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]], out: [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]] },
    ],
    hints: [
      'Fix one number; the problem becomes Two Sum for the remaining part.',
      'Sort the array first. Then for each fixed index i, use two pointers on the right side to find pairs summing to -nums[i].',
      'Skip duplicates: skip i if nums[i] == nums[i-1]; after finding a triplet, move left/right past equal values.',
    ],
    brute: {
      idea: 'Try all triples, store sorted triplets in a HashSet to remove duplicates.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> set = new HashSet<>();
        int n = nums.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        List<Integer> t = Arrays.asList(nums[i], nums[j], nums[k]);
                        Collections.sort(t);
                        set.add(t);
                    }
        return new ArrayList<>(set);
    }
}`,
      time: 'O(n^3)', space: 'O(answer)',
    },
    optimal: {
      idea: 'Sort + fix one element + two-pointer search, skipping duplicates at every level.',
      code: J`import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        return res;
    }
}`,
      time: 'O(n^2)', space: 'O(log n) for sorting (excluding output)',
    },
    lines: [
      ['Arrays.sort(nums);', 'Sorting enables two pointers and makes duplicates adjacent.'],
      ['if (nums[i] > 0) break;', 'Smallest element positive → no triplet can sum to 0.'],
      ['if (i > 0 && nums[i] == nums[i - 1]) continue;', 'Same first element as before would produce duplicate triplets.'],
      ['res.add(Arrays.asList(nums[i], nums[l], nums[r]));', 'Record a valid triplet.'],
      ['while (l < r && nums[l] == nums[l + 1]) l++;', 'Skip duplicates of the second element…'],
      ['while (l < r && nums[r] == nums[r - 1]) r--;', '…and of the third element.'],
      ['else if (sum < 0) l++; else r--;', 'Standard two-pointer movement on a sorted array.'],
    ],
    cx: 'Sorting O(n log n) + for each i an O(n) two-pointer scan → O(n^2). Space is O(log n) for the sort\'s recursion (output not counted).',
    dry: ['sorted [-4,-1,-1,0,1,2]', 'i=0 (-4): no pair sums to 4', 'i=1 (-1): l=-1,r=2 → 0 ✓ [-1,-1,2]; then l=0,r=1 → 0 ✓ [-1,0,1]', 'i=2 (-1): duplicate → skip', 'i=3 (0): l=1,r=2 → 3 > 0 → done'],
    tips: ['Generalises to kSum with recursion down to 2Sum.', '3Sum Closest uses the same skeleton, tracking the minimum |sum - target|.'],
    mistakes: ['Forgetting duplicate skipping on i, l or r.', 'Using a HashSet of lists to dedupe — works but hides the real technique.'],
    java: ['`Arrays.asList(a, b, c)` returns a fixed-size list backed by an array (cannot add/remove, but can sort/set).', '`HashSet<List<Integer>>` works because List implements value-based equals/hashCode.'],
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    desc: "You are given an integer array `height` of length `n`. There are `n` vertical lines; the `i`-th line goes from `(i, 0)` to `(i, height[i])`.\n\nFind two lines that, together with the x-axis, form a container that holds the **most water**. Return the maximum amount of water the container can store. You may not slant the container.",
    ex: [
      ['height = [1,8,6,2,5,4,8,3,7]', '49', 'Lines at index 1 (height 8) and 8 (height 7): width 7 × min(8,7) = 49.'],
      ['height = [1,1]', '1', ''],
    ],
    cons: ['2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    fn: { name: 'maxArea', params: [['int[]', 'height']], ret: 'int' },
    tests: [
      { in: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], out: 49 },
      { in: [[1, 1]], out: 1 },
      { in: [[4, 3, 2, 1, 4]], out: 16 },
      { in: [[1, 2, 1]], out: 2 },
      { in: [[2, 3, 10, 5, 7, 8, 9]], out: 36 },
    ],
    hints: [
      'Area = width × min(height[l], height[r]). Start with the widest possible container.',
      'When you shrink the width, the only way to get more water is a taller limiting line.',
      'Two pointers at both ends; always move the pointer at the SHORTER line inward.',
    ],
    brute: {
      idea: 'Compute the area for every pair of lines.',
      code: J`class Solution {
    public int maxArea(int[] height) {
        int best = 0;
        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {
                best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Greedy two pointers: moving the taller line can never help, so always move the shorter one.',
      code: J`class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            int area = (r - l) * Math.min(height[l], height[r]);
            best = Math.max(best, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int l = 0, r = height.length - 1', 'Start with maximum width.'],
      ['int area = (r - l) * Math.min(height[l], height[r]);', 'Water is limited by the shorter line.'],
      ['if (height[l] < height[r]) l++; else r--;', 'Any container using the shorter line with a narrower width is worse, so discard the shorter line.'],
    ],
    cx: 'Each iteration moves a pointer, so O(n). Constant space.',
    dry: ['[1,8,6,2,5,4,8,3,7]', 'l0 r8: 8*1=8 → move l', 'l1 r8: 7*7=49 → move r (7<8)', 'l1 r7: 6*3=18 ... best stays 49'],
    tips: ['Be ready to justify the greedy step with an exchange argument.', 'Do not confuse with Trapping Rain Water (that sums water over all bars).'],
    mistakes: ['Moving the taller pointer.'],
    java: ['No overflow: max area = 10^5 × 10^4 = 10^9 fits in int.'],
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    desc: "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    ex: [
      ['height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6', ''],
      ['height = [4,2,0,3,2,5]', '9', ''],
    ],
    cons: ['1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    fn: { name: 'trap', params: [['int[]', 'height']], ret: 'int' },
    tests: [
      { in: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], out: 6 },
      { in: [[4, 2, 0, 3, 2, 5]], out: 9 },
      { in: [[1]], out: 0 },
      { in: [[3, 0, 3]], out: 3 },
      { in: [[5, 4, 1, 2]], out: 1 },
      { in: [[0, 0, 0]], out: 0 },
    ],
    hints: [
      'Water above bar i = min(tallest bar to its left, tallest bar to its right) - height[i].',
      'Precompute leftMax[] and rightMax[] arrays → O(n) time and O(n) space.',
      'Two pointers: keep leftMax and rightMax as variables. Process the side with the smaller max — its water level is already determined.',
    ],
    brute: {
      idea: 'Prefix maximum and suffix maximum arrays.',
      code: J`class Solution {
    public int trap(int[] height) {
        int n = height.length;
        int[] leftMax = new int[n], rightMax = new int[n];
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
        int water = 0;
        for (int i = 0; i < n; i++) water += Math.min(leftMax[i], rightMax[i]) - height[i];
        return water;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Two pointers with running maxima: the side with the lower max is the bottleneck, so its water is known.',
      code: J`class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                leftMax = Math.max(leftMax, height[l]);
                water += leftMax - height[l];
                l++;
            } else {
                rightMax = Math.max(rightMax, height[r]);
                water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int leftMax = 0, rightMax = 0', 'Tallest bar seen so far from each side.'],
      ['if (height[l] < height[r])', 'There is a bar on the right at least as tall as height[l], so the left side\'s water is limited by leftMax only.'],
      ['leftMax = Math.max(leftMax, height[l]); water += leftMax - height[l];', 'Update the max, then add water above bar l (0 if this bar is the new max).'],
      ['else { rightMax = ...; water += rightMax - height[r]; r--; }', 'Symmetric case for the right side.'],
    ],
    cx: 'Each bar is processed once → O(n), using four variables → O(1). The prefix/suffix array approach is also O(n) time but O(n) space; a monotonic stack is a third O(n) option.',
    dry: ['[4,2,0,3,2,5]', 'l=0(4) < r(5): leftMax=4, water 0, l=1', 'l(2)<5: water += 2 → 2', 'l(0): +4 → 6', 'l(3): +1 → 7', 'l(2): +2 → 9', 'l=r → 9'],
    tips: ['Present the prefix/suffix max solution first — it makes the two-pointer version easy to justify.', 'Monotonic stack approach computes water layer by layer.'],
    mistakes: ['Adding negative water when height exceeds the max (update max first).'],
    java: ['Using int is safe: max water ≈ 2·10^4 × 10^5 = 2·10^9 — close to the limit! Use long if constraints are larger.'],
  },
  {
    id: 'squares-sorted-array',
    title: 'Squares of a Sorted Array',
    difficulty: 'Easy',
    desc: "Given an integer array `nums` sorted in **non-decreasing** order, return an array of **the squares of each number** sorted in non-decreasing order.\n\nFollow-up: can you find an O(n) solution?",
    ex: [
      ['nums = [-4,-1,0,3,10]', '[0,1,9,16,100]', ''],
      ['nums = [-7,-3,2,3,11]', '[4,9,9,49,121]', ''],
    ],
    cons: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4', 'nums is sorted'],
    fn: { name: 'sortedSquares', params: [['int[]', 'nums']], ret: 'int[]' },
    tests: [
      { in: [[-4, -1, 0, 3, 10]], out: [0, 1, 9, 16, 100] },
      { in: [[-7, -3, 2, 3, 11]], out: [4, 9, 9, 49, 121] },
      { in: [[1, 2, 3]], out: [1, 4, 9] },
      { in: [[-3, -2, -1]], out: [1, 4, 9] },
      { in: [[0]], out: [0] },
    ],
    hints: [
      'Squaring and sorting is O(n log n). Where do the largest squares come from?',
      'The largest square is at one of the two ends (most negative or most positive).',
      'Two pointers at both ends; fill the result array from the back with the larger square.',
    ],
    brute: {
      idea: 'Square every element, then sort.',
      code: J`import java.util.*;

class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] res = new int[nums.length];
        for (int i = 0; i < nums.length; i++) res[i] = nums[i] * nums[i];
        Arrays.sort(res);
        return res;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Merge from both ends: compare absolute values and write the larger square at the end of the result.',
      code: J`class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int l = 0, r = n - 1;
        for (int k = n - 1; k >= 0; k--) {
            if (Math.abs(nums[l]) > Math.abs(nums[r])) {
                res[k] = nums[l] * nums[l];
                l++;
            } else {
                res[k] = nums[r] * nums[r];
                r--;
            }
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(n) for the output',
    },
    lines: [
      ['for (int k = n - 1; k >= 0; k--)', 'Fill the output from the largest position down.'],
      ['if (Math.abs(nums[l]) > Math.abs(nums[r]))', 'The bigger magnitude produces the bigger square.'],
      ['res[k] = nums[l] * nums[l]; l++;', 'Place it and consume that end.'],
    ],
    cx: 'One pass → O(n). Output array O(n).',
    dry: ['[-4,-1,0,3,10]', 'k4: |−4|<10 → 100', 'k3: 4>3 → 16', 'k2: 1<3 → 9', 'k1: 1>0 → 1', 'k0: 0 → [0,1,9,16,100]'],
    tips: ['This is the "merge" step of merge sort applied from the outside in.'],
    mistakes: ['Filling from the front (smallest squares are in the middle, not at the ends).'],
    java: ['`Math.abs(Integer.MIN_VALUE)` is still negative — not an issue for these constraints, but worth knowing.'],
  },
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    desc: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n` — the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums2` into `nums1` as one sorted array **in-place**. `nums1` has length `m + n`: the first `m` elements are real, the last `n` are zeros that should be overwritten.",
    ex: [
      ['nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', '[1,2,2,3,5,6]', ''],
      ['nums1 = [1], m = 1, nums2 = [], n = 0', '[1]', ''],
      ['nums1 = [0], m = 0, nums2 = [1], n = 1', '[1]', ''],
    ],
    cons: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    fn: { name: 'merge', params: [['int[]', 'nums1'], ['int', 'm'], ['int[]', 'nums2'], ['int', 'n']], ret: 'void', out: 0 },
    tests: [
      { in: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], out: [1, 2, 2, 3, 5, 6] },
      { in: [[1], 1, [], 0], out: [1] },
      { in: [[0], 0, [1], 1], out: [1] },
      { in: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], out: [1, 2, 3, 4, 5, 6] },
      { in: [[2, 0], 1, [1], 1], out: [1, 2] },
    ],
    hints: [
      'Merging from the front would overwrite elements of nums1 you still need.',
      'Where is the free space in nums1? At the end!',
      'Three pointers: i = m-1, j = n-1, k = m+n-1. Place the larger of nums1[i] and nums2[j] at k, moving backwards. Copy leftover nums2 elements.',
    ],
    brute: {
      idea: 'Copy nums2 into the tail of nums1 and sort.',
      code: J`import java.util.*;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        for (int j = 0; j < n; j++) nums1[m + j] = nums2[j];
        Arrays.sort(nums1);
    }
}`,
      time: 'O((m+n) log(m+n))', space: 'O(1)',
    },
    optimal: {
      idea: 'Merge backwards using the empty space at the end of nums1.',
      code: J`class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k--] = nums1[i--];
            } else {
                nums1[k--] = nums2[j--];
            }
        }
    }
}`,
      time: 'O(m + n)', space: 'O(1)',
    },
    lines: [
      ['int i = m - 1, j = n - 1, k = m + n - 1;', 'Last real element of each array, and the last slot of nums1.'],
      ['while (j >= 0)', 'Once nums2 is exhausted, the remaining nums1 elements are already in place.'],
      ['if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];', 'Larger element goes to the back.'],
      ['else nums1[k--] = nums2[j--];', 'Take from nums2 (also when nums1 is exhausted).'],
    ],
    cx: 'Each element is written once → O(m + n). In-place → O(1).',
    dry: ['nums1=[1,2,3,_,_,_], nums2=[2,5,6]', '3 vs 6 → k5=6', '3 vs 5 → k4=5', '3 vs 2 → k3=3', '2 vs 2 → k2=2 (from nums2)', 'j<0 → done [1,2,2,3,5,6]'],
    tips: ['Explain why backwards is safe: k is always ≥ i, so we never overwrite unread nums1 values.'],
    mistakes: ['Looping while (i >= 0 && j >= 0) and forgetting to copy the leftover nums2 elements.'],
    java: ['`nums1[k--] = nums1[i--]` reads and writes before decrementing — compact but make sure you can explain it.'],
  },
  {
    id: 'remove-element',
    title: 'Remove Element',
    difficulty: 'Easy',
    desc: "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` **in-place**. The order of the remaining elements may change.\n\nReturn `k`, the number of elements not equal to `val`. The first `k` elements of `nums` must contain them. (The judge sorts the first `k` elements before comparing.)",
    ex: [
      ['nums = [3,2,2,3], val = 3', 'k = 2, nums = [2,2,_,_]', ''],
      ['nums = [0,1,2,2,3,0,4,2], val = 2', 'k = 5, nums = [0,1,4,0,3,_,_,_]', 'Any order of the five elements is fine.'],
    ],
    cons: ['0 <= nums.length <= 100', '0 <= nums[i] <= 50', '0 <= val <= 100'],
    fn: { name: 'removeElement', params: [['int[]', 'nums'], ['int', 'val']], ret: 'int' },
    call: 'java.util.Arrays.copyOf($0, s.removeElement($0, $1))',
    cmp: 'sorted',
    tests: [
      { in: [[3, 2, 2, 3], 3], out: [2, 2] },
      { in: [[0, 1, 2, 2, 3, 0, 4, 2], 2], out: [0, 0, 1, 3, 4] },
      { in: [[], 1], out: [] },
      { in: [[1, 1, 1], 1], out: [] },
      { in: [[4, 5], 6], out: [4, 5] },
    ],
    hints: [
      'You only need to keep the elements that are not val.',
      'Use a write pointer like in Remove Duplicates.',
      'For each element != val, copy it to nums[k] and increment k. Return k.',
    ],
    brute: {
      idea: 'Collect kept values in a list and copy them back.',
      code: J`import java.util.*;

class Solution {
    public int removeElement(int[] nums, int val) {
        List<Integer> keep = new ArrayList<>();
        for (int x : nums) if (x != val) keep.add(x);
        for (int i = 0; i < keep.size(); i++) nums[i] = keep.get(i);
        return keep.size();
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Write pointer (fast/slow two pointers), O(1) space.',
      code: J`class Solution {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int x : nums) {
            if (x != val) {
                nums[k++] = x;
            }
        }
        return k;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int k = 0;', 'Number of kept elements and the next write position.'],
      ['if (x != val) nums[k++] = x;', 'Keep x by writing it into the prefix.'],
      ['return k;', 'Length of the kept prefix.'],
    ],
    cx: 'Single pass → O(n); O(1) extra space.',
    dry: ['[3,2,2,3], val=3', '3 skip, 2 → nums[0]=2, 2 → nums[1]=2, 3 skip → k=2'],
    tips: ['If removals are rare, swapping with the last element minimises writes.'],
    mistakes: ['Using ArrayList.remove in a loop — shifting makes it O(n^2).'],
    java: ['Enhanced for-loop reads values; writing into `nums[k]` while iterating is safe because k ≤ current index.'],
  },
  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    desc: "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    ex: [
      ['s = "abcabcbb"', '3', 'The answer is "abc", with length 3.'],
      ['s = "bbbbb"', '1', 'The answer is "b".'],
      ['s = "pwwkew"', '3', '"wke". Note "pwke" is a subsequence, not a substring.'],
    ],
    cons: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    fn: { name: 'lengthOfLongestSubstring', params: [['String', 's']], ret: 'int' },
    tests: [
      { in: ['abcabcbb'], out: 3 },
      { in: ['bbbbb'], out: 1 },
      { in: ['pwwkew'], out: 3 },
      { in: [''], out: 0 },
      { in: ['abba'], out: 2 },
      { in: ['dvdf'], out: 3 },
      { in: [' '], out: 1 },
    ],
    hints: [
      'Consider a window [left, right] that contains no repeated characters.',
      'Expand right one char at a time. If the new char is already in the window, shrink from the left until it is not.',
      'Store the last index of every character; when s[right] was seen at index ≥ left, jump left to lastIndex + 1 directly.',
    ],
    brute: {
      idea: 'For each start, extend while characters are unique (HashSet).',
      code: J`import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < s.length(); j++) {
                if (!seen.add(s.charAt(j))) break;
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(min(n, alphabet))',
    },
    optimal: {
      idea: 'Sliding window with last-seen index table; left jumps past the previous occurrence.',
      code: J`class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[128];
        java.util.Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = right;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1) (128 entries)',
    },
    lines: [
      ['int[] last = new int[128]; Arrays.fill(last, -1);', 'last[c] = most recent index of character c, -1 if unseen. 128 covers ASCII.'],
      ['if (last[c] >= left) left = last[c] + 1;', 'c repeats inside the current window → move left just past its previous occurrence. The >= left check ignores occurrences that are already outside the window (important for "abba").'],
      ['last[c] = right;', 'Update the latest position of c.'],
      ['best = Math.max(best, right - left + 1);', 'Window [left, right] is now valid.'],
    ],
    cx: 'right moves n times and left only moves forward → O(n). Fixed table → O(1) space.',
    dry: ['"abba"', 'r0 a: window "a" (1)', 'r1 b: "ab" (2)', 'r2 b: last[b]=1 ≥ 0 → left=2, "b"', 'r3 a: last[a]=0 < left=2 → ignore, "ba" (2) → answer 2'],
    tips: ['This is THE canonical sliding window question — explain the window invariant clearly.', 'HashMap<Character, Integer> version handles Unicode.'],
    mistakes: ['Setting left = last[c] + 1 without checking last[c] >= left — left can move backwards ("abba").'],
    java: ['A char can index an array directly (implicitly widened to int).', '`Arrays.fill(array, value)` initialises all entries.'],
  },
  {
    id: 'minimum-size-subarray-sum',
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    desc: "Given an array of **positive** integers `nums` and a positive integer `target`, return the **minimal length** of a contiguous subarray whose sum is **greater than or equal to** `target`. If there is no such subarray, return `0`.",
    ex: [
      ['target = 7, nums = [2,3,1,2,4,3]', '2', 'The subarray [4,3] has the minimal length.'],
      ['target = 4, nums = [1,4,4]', '1', ''],
      ['target = 11, nums = [1,1,1,1,1,1,1,1]', '0', ''],
    ],
    cons: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
    fn: { name: 'minSubArrayLen', params: [['int', 'target'], ['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [7, [2, 3, 1, 2, 4, 3]], out: 2 },
      { in: [4, [1, 4, 4]], out: 1 },
      { in: [11, [1, 1, 1, 1, 1, 1, 1, 1]], out: 0 },
      { in: [15, [1, 2, 3, 4, 5]], out: 5 },
      { in: [6, [10, 2, 3]], out: 1 },
    ],
    hints: [
      'All numbers are positive — what does adding an element do to the sum? Removing one?',
      'Grow a window to the right until its sum ≥ target, then shrink from the left as much as possible.',
      'Each time sum ≥ target, record right - left + 1 and subtract nums[left++].',
    ],
    brute: {
      idea: 'For each start, extend until the sum reaches target.',
      code: J`class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                if (sum >= target) { best = Math.min(best, j - i + 1); break; }
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Variable-size sliding window (valid because all values are positive).',
      code: J`class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0, sum = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['sum += nums[right];', 'Expand the window to the right.'],
      ['while (sum >= target)', 'Window is valid; try to shrink it while it stays valid.'],
      ['best = Math.min(best, right - left + 1);', 'Record the current valid length.'],
      ['sum -= nums[left++];', 'Drop the leftmost element.'],
      ['return best == Integer.MAX_VALUE ? 0 : best;', 'No valid window ever found → 0.'],
    ],
    cx: 'Each index enters and leaves the window once → O(n). Constant space. A prefix-sum + binary search approach gives O(n log n).',
    dry: ['t=7, [2,3,1,2,4,3]', 'r3 sum=8 ≥ 7 → len4, drop 2 → 6', 'r4 sum=10 → len4, drop 3 → 7 → len3, drop 1 → 6', 'r5 sum=9 → len3, drop 2 → 7 → len2, drop 4 → 3 → answer 2'],
    tips: ['State why the window works: with positives, the sum is monotonic in window size. With negatives you would need prefix sums + a deque.'],
    mistakes: ['Using if instead of while for shrinking (misses shorter windows).'],
    java: ['`nums[left++]` reads the old left index then increments it.'],
  },
  {
    id: 'maximum-average-subarray',
    title: 'Maximum Average Subarray I',
    difficulty: 'Easy',
    desc: "You are given an integer array `nums` of `n` elements and an integer `k`. Find a contiguous subarray of length exactly `k` that has the **maximum average value** and return this value. Answers within `10^-5` of the actual value are accepted.",
    ex: [
      ['nums = [1,12,-5,-6,50,3], k = 4', '12.75', 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.'],
      ['nums = [5], k = 1', '5.0', ''],
    ],
    cons: ['1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    fn: { name: 'findMaxAverage', params: [['int[]', 'nums'], ['int', 'k']], ret: 'double' },
    tests: [
      { in: [[1, 12, -5, -6, 50, 3], 4], out: 12.75 },
      { in: [[5], 1], out: 5.0 },
      { in: [[0, 4, 0, 3, 2], 1], out: 4.0 },
      { in: [[-1, -2, -3], 2], out: -1.5 },
      { in: [[4, 2, 1, 3, 3], 2], out: 3.0 },
    ],
    hints: [
      'The maximum average window is the maximum SUM window, since k is fixed.',
      'Recomputing each window sum costs O(k). Can you update the previous sum in O(1)?',
      'Fixed-size sliding window: sum += nums[i] - nums[i - k].',
    ],
    brute: {
      idea: 'Compute the sum of each window of length k from scratch.',
      code: J`class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i + k <= nums.length; i++) {
            long sum = 0;
            for (int j = i; j < i + k; j++) sum += nums[j];
            best = Math.max(best, sum);
        }
        return (double) best / k;
    }
}`,
      time: 'O(n·k)', space: 'O(1)',
    },
    optimal: {
      idea: 'Fixed-size sliding window: add the new element, subtract the element leaving.',
      code: J`class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        long best = sum;
        for (int i = k; i < nums.length; i++) {
            sum += nums[i] - nums[i - k];
            best = Math.max(best, sum);
        }
        return (double) best / k;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['for (int i = 0; i < k; i++) sum += nums[i];', 'Sum of the first window.'],
      ['sum += nums[i] - nums[i - k];', 'Slide by one: nums[i] enters, nums[i-k] leaves.'],
      ['return (double) best / k;', 'Cast before dividing, otherwise integer division truncates.'],
    ],
    cx: 'O(n) time, O(1) space.',
    dry: ['[1,12,-5,-6,50,3], k=4', 'first sum = 2', 'i=4: +50-1 → 51 (best)', 'i=5: +3-12 → 42', 'answer 51/4 = 12.75'],
    tips: ['Fixed window = "add right, remove left" in one line. Variable window = while-loop shrink.'],
    mistakes: ['Integer division: best / k returns an int.'],
    java: ['`(double) best / k` casts first, then divides as double.'],
  },
  {
    id: 'permutation-in-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    desc: "Given two strings `s1` and `s2`, return `true` if `s2` contains a **permutation** of `s1` as a substring, or `false` otherwise.",
    ex: [
      ['s1 = "ab", s2 = "eidbaooo"', 'true', 's2 contains "ba", a permutation of s1.'],
      ['s1 = "ab", s2 = "eidboaoo"', 'false', ''],
    ],
    cons: ['1 <= s1.length, s2.length <= 10^4', 'Lowercase English letters only'],
    fn: { name: 'checkInclusion', params: [['String', 's1'], ['String', 's2']], ret: 'boolean' },
    tests: [
      { in: ['ab', 'eidbaooo'], out: true },
      { in: ['ab', 'eidboaoo'], out: false },
      { in: ['adc', 'dcda'], out: true },
      { in: ['abc', 'ab'], out: false },
      { in: ['a', 'a'], out: true },
      { in: ['hello', 'ooolleoooleh'], out: false },
    ],
    hints: [
      'A permutation of s1 has exactly the same character counts as s1.',
      'Slide a window of length s1.length() over s2 and compare counts.',
      'Maintain counts with int[26] and a "matches" counter of letters whose counts agree; update it in O(1) per slide.',
    ],
    brute: {
      idea: 'For every window of length m in s2, sort it and compare with sorted s1.',
      code: J`import java.util.*;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        char[] a = s1.toCharArray();
        Arrays.sort(a);
        String key = new String(a);
        for (int i = 0; i + m <= s2.length(); i++) {
            char[] w = s2.substring(i, i + m).toCharArray();
            Arrays.sort(w);
            if (key.equals(new String(w))) return true;
        }
        return false;
    }
}`,
      time: 'O(n · m log m)', space: 'O(m)',
    },
    optimal: {
      idea: 'Fixed window with two frequency arrays; compare arrays in O(26) per step.',
      code: J`class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m > n) return false;
        int[] need = new int[26], window = new int[26];
        for (int i = 0; i < m; i++) {
            need[s1.charAt(i) - 'a']++;
            window[s2.charAt(i) - 'a']++;
        }
        if (java.util.Arrays.equals(need, window)) return true;
        for (int i = m; i < n; i++) {
            window[s2.charAt(i) - 'a']++;
            window[s2.charAt(i - m) - 'a']--;
            if (java.util.Arrays.equals(need, window)) return true;
        }
        return false;
    }
}`,
      time: 'O(26 · n) = O(n)', space: 'O(1)',
    },
    lines: [
      ['if (m > n) return false;', 'A longer pattern cannot fit.'],
      ['need[...]++; window[...]++;', 'Count s1 and the first window of s2.'],
      ['window[s2.charAt(i) - \'a\']++; window[s2.charAt(i - m) - \'a\']--;', 'Slide: add the new char, remove the char that left.'],
      ['Arrays.equals(need, window)', 'Compare 26 counters — constant work.'],
    ],
    cx: 'n slides × 26 comparisons → O(n). Two arrays of 26 → O(1).',
    dry: ['s1="ab", s2="eidbaooo"', 'windows: "ei" ✗, "id" ✗, "db" ✗, "ba" ✓ → true'],
    tips: ['Optimise further with a matches counter to avoid the 26-step comparison.', 'Sister problem: Find All Anagrams in a String (return all start indices).'],
    mistakes: ['Generating all permutations of s1 (m! work).'],
    java: ['`Arrays.equals(int[], int[])` compares element by element.'],
  },
  {
    id: 'find-all-anagrams',
    title: 'Find All Anagrams in a String',
    difficulty: 'Medium',
    desc: "Given two strings `s` and `p`, return an array of all the **start indices** of `p`'s anagrams in `s`, in increasing order.",
    ex: [
      ['s = "cbaebabacd", p = "abc"', '[0,6]', '"cba" at 0 and "bac" at 6 are anagrams of "abc".'],
      ['s = "abab", p = "ab"', '[0,1,2]', ''],
    ],
    cons: ['1 <= s.length, p.length <= 3 * 10^4', 'Lowercase English letters only'],
    fn: { name: 'findAnagrams', params: [['String', 's'], ['String', 'p']], ret: 'List<Integer>' },
    tests: [
      { in: ['cbaebabacd', 'abc'], out: [0, 6] },
      { in: ['abab', 'ab'], out: [0, 1, 2] },
      { in: ['a', 'ab'], out: [] },
      { in: ['aaaa', 'aa'], out: [0, 1, 2] },
      { in: ['baa', 'aa'], out: [1] },
    ],
    hints: [
      'Same idea as Permutation in String, but collect every match.',
      'Use a fixed window of size p.length() with frequency counts.',
      'Track how many characters still need to be matched ("count"). When count hits 0, record the window start.',
    ],
    brute: {
      idea: 'Check each window of length |p| with a fresh frequency array.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        int m = p.length();
        int[] need = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int i = 0; i + m <= s.length(); i++) {
            int[] w = new int[26];
            for (int j = i; j < i + m; j++) w[s.charAt(j) - 'a']++;
            if (Arrays.equals(need, w)) res.add(i);
        }
        return res;
    }
}`,
      time: 'O(n · m)', space: 'O(1)',
    },
    optimal: {
      idea: 'Sliding window with a single count array and a "remaining" counter for O(1) checks.',
      code: J`import java.util.*;

class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        if (p.length() > s.length()) return res;
        int[] need = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        int left = 0, remaining = p.length();
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right) - 'a']-- > 0) remaining--;
            if (right - left + 1 > p.length()) {
                if (++need[s.charAt(left) - 'a'] > 0) remaining++;
                left++;
            }
            if (remaining == 0) res.add(left);
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int[] need = ...', 'need[c] > 0 means the window still needs that many c\'s; negative means extra c\'s.'],
      ["if (need[s.charAt(right) - 'a']-- > 0) remaining--;", 'Adding a character that was still needed reduces the remaining count.'],
      ['if (right - left + 1 > p.length())', 'Window too large → drop the left character.'],
      ["if (++need[s.charAt(left) - 'a'] > 0) remaining++;", 'If the removed char was a needed one, we need it again.'],
      ['if (remaining == 0) res.add(left);', 'All characters of p matched in the current window.'],
    ],
    cx: 'Each character enters and leaves once → O(n). Array of 26 → O(1).',
    dry: ['s="abab", p="ab" → need a=1, b=1, remaining=2', 'r0 \'a\': need[a] 1→0, remaining=1', 'r1 \'b\': need[b] 1→0, remaining=0 → add 0', 'r2 \'a\': need[a] 0→-1 (extra). Window size 3 → drop s[0]=\'a\': need[a] -1→0 (still not > 0), left=1. remaining=0 → add 1', 'r3 \'b\': need[b] 0→-1, drop s[1]=\'b\': need[b]→0, left=2 → add 2', 'Answer [0,1,2]'],
    tips: ['The "remaining counter" trick generalises to Minimum Window Substring.'],
    mistakes: ['Off-by-one on the window size check.'],
    java: ['Post-decrement inside a condition (`need[x]-- > 0`) compares the old value — be explicit about this in interviews.'],
  },
  {
    id: 'longest-repeating-character-replacement',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    desc: "You are given a string `s` of uppercase English letters and an integer `k`. You can choose any character of the string and change it to any other uppercase letter. You can perform this operation at most `k` times.\n\nReturn the length of the **longest substring containing the same letter** you can get after performing the operations.",
    ex: [
      ['s = "ABAB", k = 2', '4', 'Replace the two A\'s with B\'s or vice versa.'],
      ['s = "AABABBA", k = 1', '4', 'Replace the A at index 3 with B → "AABBBBA", which contains "BBBB".'],
    ],
    cons: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters', '0 <= k <= s.length'],
    fn: { name: 'characterReplacement', params: [['String', 's'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: ['ABAB', 2], out: 4 },
      { in: ['AABABBA', 1], out: 4 },
      { in: ['A', 0], out: 1 },
      { in: ['AAAA', 0], out: 4 },
      { in: ['ABCDE', 1], out: 2 },
      { in: ['BAAAB', 2], out: 5 },
    ],
    hints: [
      'In a window, which characters should you replace? (Everything except the most frequent one.)',
      'A window is valid if windowLength - maxFreq <= k.',
      'Slide a window, tracking counts and the max frequency. If invalid, move left by one. maxFreq never needs to decrease for the answer to be correct.',
    ],
    brute: {
      idea: 'For each start, extend the end while (length - maxFreq) <= k.',
      code: J`class Solution {
    public int characterReplacement(String s, int k) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            int[] cnt = new int[26];
            int maxF = 0;
            for (int j = i; j < s.length(); j++) {
                maxF = Math.max(maxF, ++cnt[s.charAt(j) - 'A']);
                if (j - i + 1 - maxF <= k) best = Math.max(best, j - i + 1);
                else break;
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Sliding window that never shrinks below the best size; maxFreq only increases.',
      code: J`class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0, maxFreq = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);
            while (right - left + 1 - maxFreq > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ["maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);", 'Add the new char and update the highest single-letter count seen in a window.'],
      ['while (right - left + 1 - maxFreq > k)', 'Number of replacements needed exceeds k → shrink.'],
      ['count[...]--; left++;', 'Remove the leftmost character.'],
      ['best = Math.max(best, right - left + 1);', 'Window is valid now.'],
    ],
    cx: 'Both pointers move at most n times → O(n). 26 counters → O(1). We do not recompute maxFreq when shrinking: a stale (too large) maxFreq can only keep the window at its previous best size, never produce a wrong larger answer.',
    dry: ['"AABABBA", k=1', 'r0-r3 "AABA": maxF 3, need 1 ✓ → best 4', 'r4 "AABAB": need 2 > 1 → shrink to "ABAB" (maxF stays 3, need 1)', 'r5, r6 … best stays 4'],
    tips: ['Explain why not decrementing maxFreq is safe — that is what impresses interviewers.'],
    mistakes: ['Recomputing max over 26 counts each step is fine (O(26n)), but forgetting to shrink is not.'],
    java: ["`s.charAt(i) - 'A'` maps uppercase letters to 0..25."],
  },
  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    desc: "Given two strings `s` and `t` of lengths `m` and `n`, return the **minimum window substring** of `s` such that every character in `t` (**including duplicates**) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe answer is unique.",
    ex: [
      ['s = "ADOBECODEBANC", t = "ABC"', '"BANC"', 'The minimum window containing A, B and C.'],
      ['s = "a", t = "a"', '"a"', ''],
      ['s = "a", t = "aa"', '""', 'Both a\'s from t must be included.'],
    ],
    cons: ['1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters'],
    fn: { name: 'minWindow', params: [['String', 's'], ['String', 't']], ret: 'String' },
    tests: [
      { in: ['ADOBECODEBANC', 'ABC'], out: 'BANC' },
      { in: ['a', 'a'], out: 'a' },
      { in: ['a', 'aa'], out: '' },
      { in: ['ab', 'b'], out: 'b' },
      { in: ['aaflslflsldkalskaaa', 'aaa'], out: 'aaa' },
      { in: ['cabwefgewcwaefgcf', 'cae'], out: 'cwae' },
    ],
    hints: [
      'Expand a window until it contains all characters of t. Then try to shrink it.',
      'Track how many required characters are still missing.',
      'need[] counts from t; "missing" = t.length(). Expand right, decrementing need. When missing == 0, shrink left while the window stays valid, recording the minimum.',
    ],
    brute: {
      idea: 'Check every substring and test if it covers t.',
      code: J`class Solution {
    public String minWindow(String s, String t) {
        String best = "";
        for (int i = 0; i < s.length(); i++) {
            int[] need = new int[128];
            int missing = t.length();
            for (char c : t.toCharArray()) need[c]++;
            for (int j = i; j < s.length(); j++) {
                if (need[s.charAt(j)]-- > 0) missing--;
                if (missing == 0) {
                    if (best.isEmpty() || j - i + 1 < best.length()) best = s.substring(i, j + 1);
                    break;
                }
            }
        }
        return best;
    }
}`,
      time: 'O(m^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Variable sliding window with a need-count array and a missing counter.',
      code: J`class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length();
        int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) missing--;
            while (missing == 0) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                if (++need[s.charAt(left)] > 0) missing++;
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
      time: 'O(m + n)', space: 'O(1) (128 counters)',
    },
    lines: [
      ['int[] need = new int[128];', 'need[c] > 0: window still needs that many c. Negative: window has extras.'],
      ['if (need[s.charAt(right)]-- > 0) missing--;', 'Taking a character that was still needed reduces missing.'],
      ['while (missing == 0)', 'Window covers t; shrink it from the left.'],
      ['if (right - left + 1 < bestLen) { ... }', 'Record a new minimum window.'],
      ['if (++need[s.charAt(left)] > 0) missing++;', 'Removing a required character breaks coverage.'],
      ['s.substring(bestStart, bestStart + bestLen)', 'Build the answer string only once at the end.'],
    ],
    cx: 'Each pointer traverses s once → O(m), plus O(n) to count t. Fixed 128-size array → O(1) extra space.',
    dry: ['s="ADOBECODEBANC", t="ABC"', 'expand to r=5 "ADOBEC": missing=0 → best="ADOBEC"(6); drop \'A\' → missing=1, left=1', 'expand to r=10 "DOBECODEBA": valid again; shrink while valid: "OBECODEBA", "BECODEBA", "ECODEBA", "CODEBA"(6); dropping \'C\' breaks it', 'expand to r=12 "ODEBANC": valid; shrink to "BANC"(4) → new best; dropping \'B\' breaks it', 'Answer "BANC"'],
    tips: ['This template (need array + missing counter + while-shrink) solves most substring window problems — memorise it.'],
    mistakes: ['Building substrings inside the loop (slow) — track start and length instead.', 'Ignoring duplicates in t.'],
    java: ['Characters index directly into `int[128]` for ASCII; use `int[256]` or a HashMap for extended sets.'],
  },
  {
    id: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    desc: "Given a binary array `nums` and an integer `k`, return the **maximum number of consecutive 1's** in the array if you can flip at most `k` `0`'s.",
    ex: [
      ['nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', '6', 'Flip the two zeros at indices 5 and 10 → [1,1,1,1,1,1] from index 5..10.'],
      ['nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', '10', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', 'nums[i] is 0 or 1', '0 <= k <= nums.length'],
    fn: { name: 'longestOnes', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], out: 6 },
      { in: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], out: 10 },
      { in: [[0, 0, 0], 0], out: 0 },
      { in: [[1, 1, 1], 0], out: 3 },
      { in: [[0, 0, 0, 1], 4], out: 4 },
    ],
    hints: [
      'Rephrase: find the longest subarray containing at most k zeros.',
      'Sliding window: count zeros inside the window.',
      'Expand right; if zeros > k, move left forward (decrementing zeros when a 0 leaves). Track the max window length.',
    ],
    brute: {
      idea: 'For each start, extend while the number of zeros is ≤ k.',
      code: J`class Solution {
    public int longestOnes(int[] nums, int k) {
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            int zeros = 0;
            for (int j = i; j < nums.length; j++) {
                if (nums[j] == 0) zeros++;
                if (zeros > k) break;
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Sliding window with at most k zeros.',
      code: J`class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k) {
                if (nums[left] == 0) zeros--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['if (nums[right] == 0) zeros++;', 'Include the new element; count zeros (flips needed).'],
      ['while (zeros > k)', 'Too many flips needed → shrink.'],
      ['if (nums[left] == 0) zeros--; left++;', 'Removing a zero frees one flip.'],
      ['best = Math.max(best, right - left + 1);', 'Window has at most k zeros → all can become ones.'],
    ],
    cx: 'O(n) time (each pointer moves n times), O(1) space.',
    dry: ['[1,1,1,0,0,0,1,1,1,1,0], k=2', 'r=4 zeros=2 → len5', 'r=5 zeros=3 → shrink left to 4 → zeros=2', 'r=10 window [5..10] zeros=2 → len6'],
    tips: ['Generic pattern: "longest subarray with at most K bad elements".'],
    mistakes: ['Trying to decide which zeros to flip explicitly — the window handles it.'],
    java: ['Plain int arithmetic; no collections needed.'],
  },
];
