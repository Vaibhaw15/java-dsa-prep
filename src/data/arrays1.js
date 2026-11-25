const J = String.raw;

export default [
  {
    id: 'second-largest',
    title: 'Second Largest Element in an Array',
    difficulty: 'Easy',
    desc: "Given an array of integers `arr`, return the **second largest distinct** element in the array.\n\nIf no second largest element exists (for example, all elements are equal or the array has a single element), return `-1`.",
    ex: [
      ['arr = [12, 35, 1, 10, 34, 1]', '34', 'The largest element is 35 and the second largest distinct element is 34.'],
      ['arr = [10, 10, 10]', '-1', 'All elements are equal, so there is no second largest element.'],
    ],
    cons: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    fn: { name: 'secondLargest', params: [['int[]', 'arr']], ret: 'int' },
    tests: [
      { in: [[12, 35, 1, 10, 34, 1]], out: 34 },
      { in: [[10, 10, 10]], out: -1 },
      { in: [[5]], out: -1 },
      { in: [[1, 2]], out: 1 },
      { in: [[-5, -2, -9, -2]], out: -5 },
      { in: [[7, 7, 3, 7]], out: 3 },
    ],
    hints: [
      'Do you really need to sort? Think about what information you must remember while scanning the array once.',
      'Keep two variables: the largest value seen so far and the second largest value seen so far.',
      'For each number x: if x > largest, the old largest becomes second and x becomes largest. Else if x < largest and x > second, update second. Skip x == largest so duplicates do not count.',
    ],
    brute: {
      idea: 'Sort the array, then walk from the end to find the first element that is smaller than the maximum.',
      code: J`import java.util.*;

class Solution {
    public int secondLargest(int[] arr) {
        int[] copy = arr.clone();
        Arrays.sort(copy);
        int n = copy.length;
        int largest = copy[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            if (copy[i] != largest) {
                return copy[i];
            }
        }
        return -1;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Single pass tracking the largest and second largest distinct values. Use long sentinels so negative inputs and Integer.MIN_VALUE are handled.',
      code: J`class Solution {
    public int secondLargest(int[] arr) {
        long largest = Long.MIN_VALUE;
        long second = Long.MIN_VALUE;
        for (int x : arr) {
            if (x > largest) {
                second = largest;
                largest = x;
            } else if (x < largest && x > second) {
                second = x;
            }
        }
        return second == Long.MIN_VALUE ? -1 : (int) second;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['long largest = Long.MIN_VALUE;', 'We use long sentinels that are smaller than every possible int, so even Integer.MIN_VALUE in the input is handled correctly.'],
      ['for (int x : arr)', 'Enhanced for-loop: visits each element once, left to right.'],
      ['if (x > largest)', 'Found a new maximum. The previous maximum is now the best candidate for second largest.'],
      ['second = largest; largest = x;', 'Order matters: shift largest into second first, then overwrite largest.'],
      ['else if (x < largest && x > second)', 'x is strictly less than the max (so duplicates of the max are ignored) but better than the current second.'],
      ['return second == Long.MIN_VALUE ? -1 : (int) second;', 'If second was never updated, no distinct second largest exists. Otherwise cast back to int.'],
    ],
    cx: 'Each element is examined exactly once with O(1) work, giving O(n) time. Only two variables are stored, so O(1) extra space. The brute force pays O(n log n) for sorting and O(n) for the copy.',
    dry: [
      'arr = [12, 35, 1, 10, 34, 1]; largest = -inf, second = -inf',
      'x=12: 12 > largest → second=-inf, largest=12',
      'x=35: 35 > 12 → second=12, largest=35',
      'x=1: 1 < 35 but 1 < 12 → no change',
      'x=10: 10 < 12 → no change',
      'x=34: 34 < 35 and 34 > 12 → second=34',
      'x=1: no change → answer 34',
    ],
    tips: ['Interviewers often follow up with "find the k-th largest" — mention a min-heap of size k (PriorityQueue).', 'State upfront how you treat duplicates: distinct vs. non-distinct second largest.'],
    mistakes: ['Initialising largest and second with 0 breaks for all-negative arrays.', 'Forgetting to ignore duplicates of the maximum (returning 35 for [35, 35, 1]).', 'Using Integer.MIN_VALUE as a sentinel when it can also be a valid input.'],
    java: ['`arr.clone()` creates a shallow copy of a primitive array so sorting does not mutate the caller\'s data.', '`Arrays.sort(int[])` uses Dual-Pivot Quicksort for primitives — O(n log n) on average.', 'Widening int → long and casting back with `(int)` is safe here because the value originated from an int.'],
  },
  {
    id: 'reverse-array',
    title: 'Reverse an Array In-Place',
    difficulty: 'Easy',
    desc: "Given an integer array `arr`, reverse its elements **in-place** so that the first element becomes the last, the second becomes the second last, and so on.\n\nYou must modify the input array directly; the judge checks `arr` after your method returns.",
    ex: [
      ['arr = [1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]', ''],
      ['arr = [4, 5, 1, 2]', '[2, 1, 5, 4]', ''],
    ],
    cons: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    fn: { name: 'reverse', params: [['int[]', 'arr']], ret: 'void', out: 0 },
    tests: [
      { in: [[1, 2, 3, 4, 5]], out: [5, 4, 3, 2, 1] },
      { in: [[4, 5, 1, 2]], out: [2, 1, 5, 4] },
      { in: [[7]], out: [7] },
      { in: [[1, 2]], out: [2, 1] },
      { in: [[-1, 0, 0, 9]], out: [9, 0, 0, -1] },
    ],
    hints: [
      'Which element should end up at index 0? Which at index n-1?',
      'Swap the first and last elements, then the second and second-last, and keep moving inward.',
      'Use two pointers left = 0 and right = n - 1; swap and move them toward each other until they meet. O(n) time, O(1) space.',
    ],
    brute: {
      idea: 'Copy elements into a temporary array in reverse order, then copy them back.',
      code: J`class Solution {
    public void reverse(int[] arr) {
        int n = arr.length;
        int[] temp = new int[n];
        for (int i = 0; i < n; i++) {
            temp[i] = arr[n - 1 - i];
        }
        for (int i = 0; i < n; i++) {
            arr[i] = temp[i];
        }
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Two pointers swapping from both ends toward the middle — no extra array needed.',
      code: J`class Solution {
    public void reverse(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            left++;
            right--;
        }
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int left = 0, right = arr.length - 1;', 'Pointers at both ends of the array.'],
      ['while (left < right)', 'Stop when they meet or cross; the middle element of an odd-length array stays in place.'],
      ['int tmp = arr[left]; ...', 'Classic three-step swap using a temporary variable.'],
      ['left++; right--;', 'Move both pointers inward.'],
    ],
    cx: 'We perform n/2 swaps, each O(1), so O(n) time. Only a temp variable and two indices are used: O(1) space.',
    dry: ['arr=[1,2,3,4,5], L=0, R=4 → swap → [5,2,3,4,1]', 'L=1, R=3 → swap → [5,4,3,2,1]', 'L=2, R=2 → stop'],
    tips: ['This two-pointer swap is the building block for Rotate Array, Reverse Words and Next Permutation.', 'Mention that Java has `Collections.reverse(list)` for lists, but arrays of primitives need a manual loop.'],
    mistakes: ['Looping to n instead of n/2 reverses the array twice (back to original).', 'Using `while (left <= right)` is harmless but does one useless self-swap.'],
    java: ['Java passes the array reference by value, so modifying `arr[i]` changes the caller\'s array — that is why a void method works.', '`Collections.reverse()` works only on `List`, not on `int[]`.'],
  },
  {
    id: 'remove-duplicates-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    desc: "Given an integer array `nums` sorted in **non-decreasing** order, remove the duplicates **in-place** so each unique element appears only once. The relative order should stay the same.\n\nReturn `k`, the number of unique elements. The first `k` elements of `nums` must hold the unique elements in order; what you leave beyond index `k - 1` does not matter. (The judge checks the first `k` elements.)",
    ex: [
      ['nums = [1, 1, 2]', 'k = 2, nums = [1, 2, _]', 'The first two elements are 1 and 2.'],
      ['nums = [0,0,1,1,1,2,2,3,3,4]', 'k = 5, nums = [0,1,2,3,4,_,...]', ''],
    ],
    cons: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order'],
    fn: { name: 'removeDuplicates', params: [['int[]', 'nums']], ret: 'int' },
    call: 'java.util.Arrays.copyOf($0, s.removeDuplicates($0))',
    tests: [
      { in: [[1, 1, 2]], out: [1, 2] },
      { in: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], out: [0, 1, 2, 3, 4] },
      { in: [[5]], out: [5] },
      { in: [[1, 2, 3]], out: [1, 2, 3] },
      { in: [[-3, -3, -3, -3]], out: [-3] },
    ],
    hints: [
      'Because the array is sorted, all copies of a value sit next to each other.',
      'Keep a "write" pointer for where the next unique value should go, and a "read" pointer scanning the array.',
      'Start write = 1. For each read index i from 1, if nums[i] != nums[write - 1], copy it to nums[write] and increment write. Return write.',
    ],
    brute: {
      idea: 'Insert all values into a LinkedHashSet (keeps insertion order, drops duplicates), then copy them back to the front of the array.',
      code: J`import java.util.*;

class Solution {
    public int removeDuplicates(int[] nums) {
        Set<Integer> set = new LinkedHashSet<>();
        for (int x : nums) set.add(x);
        int k = 0;
        for (int x : set) nums[k++] = x;
        return k;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Slow/fast two pointers. The slow pointer marks the end of the unique prefix; the fast pointer finds the next new value.',
      code: J`class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 1;
        for (int read = 1; read < nums.length; read++) {
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }
        return write;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int write = 1;', 'The first element is always unique, so the unique prefix starts with length 1.'],
      ['for (int read = 1; ...)', 'Scan every remaining element exactly once.'],
      ['if (nums[read] != nums[write - 1])', 'Compare with the last element of the unique prefix. Since the array is sorted, a different value means a new unique element.'],
      ['nums[write] = nums[read]; write++;', 'Append the new unique value to the prefix.'],
      ['return write;', 'write equals the length of the unique prefix, i.e. k.'],
    ],
    cx: 'One pass over the array: O(n). Two integer pointers: O(1) extra space. The LinkedHashSet version needs O(n) memory and boxing overhead.',
    dry: ['nums=[0,0,1,1,1,2]; write=1', 'read=1: 0 == nums[0] → skip', 'read=2: 1 != 0 → nums[1]=1, write=2', 'read=3,4: 1 == 1 → skip', 'read=5: 2 != 1 → nums[2]=2, write=3 → return 3, prefix [0,1,2]'],
    tips: ['Follow-up: "allow at most two duplicates" — compare with nums[write - 2] instead.', 'Clarify that the extra space must be O(1) before jumping to a HashSet.'],
    mistakes: ['Starting write at 0 and comparing nums[read] with nums[read-1] works too, but mixing the two styles causes off-by-one errors.', 'Returning write - 1 instead of write.'],
    java: ['`LinkedHashSet` preserves insertion order, unlike `HashSet`.', 'Autoboxing: adding `int` to `Set<Integer>` boxes each value into an Integer object, which costs memory.'],
  },
  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    desc: "Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements.\n\nYou must do this **in-place** without making a copy of the array.",
    ex: [
      ['nums = [0, 1, 0, 3, 12]', '[1, 3, 12, 0, 0]', ''],
      ['nums = [0]', '[0]', ''],
    ],
    cons: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    fn: { name: 'moveZeroes', params: [['int[]', 'nums']], ret: 'void', out: 0 },
    tests: [
      { in: [[0, 1, 0, 3, 12]], out: [1, 3, 12, 0, 0] },
      { in: [[0]], out: [0] },
      { in: [[1, 2, 3]], out: [1, 2, 3] },
      { in: [[0, 0, 1]], out: [1, 0, 0] },
      { in: [[4, 0, -2, 0, 0, 5]], out: [4, -2, 5, 0, 0, 0] },
    ],
    hints: [
      'Think of building the "non-zero part" of the answer at the front of the array.',
      'Use a pointer that marks where the next non-zero element should be placed.',
      'Scan with i; whenever nums[i] != 0, swap nums[i] with nums[pos] and increment pos. All zeroes naturally drift to the end.',
    ],
    brute: {
      idea: 'Copy the non-zero values into a new array, fill the rest with zeroes, then copy back.',
      code: J`class Solution {
    public void moveZeroes(int[] nums) {
        int[] temp = new int[nums.length];
        int k = 0;
        for (int x : nums) {
            if (x != 0) temp[k++] = x;
        }
        // remaining positions of temp are already 0
        System.arraycopy(temp, 0, nums, 0, nums.length);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'One pass with a write pointer; swap each non-zero into its final position.',
      code: J`class Solution {
    public void moveZeroes(int[] nums) {
        int pos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int tmp = nums[pos];
                nums[pos] = nums[i];
                nums[i] = tmp;
                pos++;
            }
        }
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int pos = 0;', 'pos is the index where the next non-zero element must go. Everything before pos is non-zero and in original order.'],
      ['if (nums[i] != 0)', 'Only non-zero elements are moved forward.'],
      ['swap(nums[pos], nums[i])', 'Places the non-zero at pos; the element that was at pos (a zero, or the same element when pos == i) moves to i.'],
      ['pos++;', 'The non-zero prefix grew by one.'],
    ],
    cx: 'Every index is visited once: O(n) time. The swap uses one temporary variable: O(1) space. The swap version also minimises writes compared to "copy non-zeros then fill zeros" when there are few zeros.',
    dry: ['[0,1,0,3,12], pos=0', 'i=0: zero → skip', 'i=1: swap(0,1) → [1,0,0,3,12], pos=1', 'i=2: zero → skip', 'i=3: swap(1,3) → [1,3,0,0,12], pos=2', 'i=4: swap(2,4) → [1,3,12,0,0], pos=3'],
    tips: ['Explain why relative order is preserved: elements are moved forward in the order they are encountered.', 'Alternative: overwrite non-zeros forward, then fill the tail with zeros — same complexity.'],
    mistakes: ['Removing zeros with ArrayList.remove() inside a loop — O(n^2) and skips elements.', 'Swapping with the end of the array breaks relative order.'],
    java: ['`System.arraycopy(src, srcPos, dest, destPos, length)` is a fast native bulk copy.', 'New int arrays in Java are zero-initialised automatically.'],
  },
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, rotate the array to the **right** by `k` steps, where `k` is non-negative. Modify `nums` in-place.",
    ex: [
      ['nums = [1,2,3,4,5,6,7], k = 3', '[5,6,7,1,2,3,4]', 'Rotate right 1 step: [7,1,2,3,4,5,6]; 2 steps: [6,7,1,2,3,4,5]; 3 steps: [5,6,7,1,2,3,4].'],
      ['nums = [-1,-100,3,99], k = 2', '[3,99,-1,-100]', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    fn: { name: 'rotate', params: [['int[]', 'nums'], ['int', 'k']], ret: 'void', out: 0 },
    tests: [
      { in: [[1, 2, 3, 4, 5, 6, 7], 3], out: [5, 6, 7, 1, 2, 3, 4] },
      { in: [[-1, -100, 3, 99], 2], out: [3, 99, -1, -100] },
      { in: [[1, 2], 5], out: [2, 1] },
      { in: [[1], 0], out: [1] },
      { in: [[1, 2, 3], 3], out: [1, 2, 3] },
      { in: [[1, 2, 3, 4, 5, 6], 4], out: [3, 4, 5, 6, 1, 2] },
    ],
    hints: [
      'Rotating by n (the length) gives back the same array. What does that tell you about k?',
      'An extra array makes it easy: element i goes to index (i + k) % n. Can you avoid the extra array?',
      'Reverse the whole array, then reverse the first k elements, then reverse the remaining n-k elements (with k = k % n).',
    ],
    brute: {
      idea: 'Use an auxiliary array: put nums[i] at position (i + k) % n, then copy back.',
      code: J`class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[(i + k) % n] = nums[i];
        }
        System.arraycopy(result, 0, nums, 0, n);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Three reversals. After reversing everything, the last k elements are at the front but backwards; reversing each part fixes the order.',
      code: J`class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] a, int l, int r) {
        while (l < r) {
            int t = a[l];
            a[l++] = a[r];
            a[r--] = t;
        }
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['k %= n;', 'Rotating by n is a no-op, so only k mod n matters. This also prevents index errors when k > n.'],
      ['reverse(nums, 0, n - 1);', 'Whole array reversed: [7,6,5,4,3,2,1]. The k elements that should be first are now first, but in reverse order.'],
      ['reverse(nums, 0, k - 1);', 'Fix the first k: [5,6,7,4,3,2,1].'],
      ['reverse(nums, k, n - 1);', 'Fix the remaining n-k: [5,6,7,1,2,3,4].'],
      ['a[l++] = a[r]; a[r--] = t;', 'Swap and move pointers in the same statement using post-increment/decrement.'],
    ],
    cx: 'Each element is swapped at most twice across the three reversals → O(n) time, O(1) space. A naive approach of rotating one step k times would be O(n·k), which times out for n = k = 10^5.',
    dry: ['nums=[1,2,3,4,5,6,7], k=3', 'reverse all → [7,6,5,4,3,2,1]', 'reverse [0..2] → [5,6,7,4,3,2,1]', 'reverse [3..6] → [5,6,7,1,2,3,4] ✓'],
    tips: ['Always ask whether rotation is left or right. Left by k equals right by n - k.', 'Mention the cyclic-replacements approach as another O(1)-space method.'],
    mistakes: ['Forgetting k %= n → ArrayIndexOutOfBoundsException when k > n.', 'Rotating one step at a time in a loop (O(n·k)).'],
    java: ['`a[l++] = a[r]` uses the old value of l, then increments — understand post-increment semantics.', 'Private helper methods keep interview code readable.'],
  },
  {
    id: 'best-time-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    desc: "You are given an array `prices` where `prices[i]` is the price of a stock on day `i`.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and a **different day in the future** to sell it. Return the maximum profit you can achieve. If no profit is possible, return `0`.",
    ex: [
      ['prices = [7,1,5,3,6,4]', '5', 'Buy on day 1 (price 1) and sell on day 4 (price 6): profit = 6 - 1 = 5.'],
      ['prices = [7,6,4,3,1]', '0', 'Prices only fall, so no transaction is done.'],
    ],
    cons: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    fn: { name: 'maxProfit', params: [['int[]', 'prices']], ret: 'int' },
    tests: [
      { in: [[7, 1, 5, 3, 6, 4]], out: 5 },
      { in: [[7, 6, 4, 3, 1]], out: 0 },
      { in: [[1]], out: 0 },
      { in: [[2, 4, 1]], out: 2 },
      { in: [[3, 2, 6, 5, 0, 3]], out: 4 },
      { in: [[1, 2, 3, 4, 5]], out: 4 },
    ],
    hints: [
      'If you sell on day i, which buy day gives you the best profit?',
      'The best buy day for selling on day i is the day with the minimum price before i.',
      'Scan once, keeping the minimum price so far. At each day, profit = price - minSoFar; keep the maximum.',
    ],
    brute: {
      idea: 'Try every pair (buy day i, sell day j > i) and keep the best difference.',
      code: J`class Solution {
    public int maxProfit(int[] prices) {
        int best = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                best = Math.max(best, prices[j] - prices[i]);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Track the cheapest price seen so far; every day, check the profit if we sold today.',
      code: J`class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else {
                maxProfit = Math.max(maxProfit, price - minPrice);
            }
        }
        return maxProfit;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int minPrice = Integer.MAX_VALUE;', 'Start higher than any price so the first day becomes the minimum.'],
      ['int maxProfit = 0;', 'Not trading is allowed, so the answer is never negative.'],
      ['if (price < minPrice) minPrice = price;', 'A cheaper buying opportunity — selling today would give negative profit anyway.'],
      ['else maxProfit = Math.max(maxProfit, price - minPrice);', 'Selling today after buying at the cheapest earlier price.'],
    ],
    cx: 'Single pass: O(n) time, O(1) space. The brute force checks n(n-1)/2 pairs → O(n^2), too slow for 10^5 elements.',
    dry: ['[7,1,5,3,6,4]', '7: min=7', '1: min=1', '5: profit 4 → best=4', '3: profit 2', '6: profit 5 → best=5', '4: profit 3 → answer 5'],
    tips: ['This is a mini dynamic-programming / Kadane-style problem; say that out loud.', 'Know the follow-ups: unlimited transactions (sum positive differences), at most 2 transactions, with cooldown/fee.'],
    mistakes: ['Returning max - min of the whole array ignores that you must buy before selling.', 'Initialising maxProfit to Integer.MIN_VALUE and returning a negative number.'],
    java: ['`Integer.MAX_VALUE` = 2^31 - 1 is the standard sentinel for minimum tracking.', '`Math.max` / `Math.min` are overloaded for int, long, float and double.'],
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    desc: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the **largest sum**, and return its sum.",
    ex: [
      ['nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'The subarray [4,-1,2,1] has the largest sum 6.'],
      ['nums = [5,4,-1,7,8]', '23', 'The whole array.'],
    ],
    cons: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    fn: { name: 'maxSubArray', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], out: 6 },
      { in: [[5, 4, -1, 7, 8]], out: 23 },
      { in: [[1]], out: 1 },
      { in: [[-3, -1, -2]], out: -1 },
      { in: [[2, -1, 2, -5, 3]], out: 3 },
      { in: [[-1, 3, -2, 4, -10, 6]], out: 6 },
    ],
    hints: [
      'For every index, consider the best subarray that ENDS at that index.',
      'If the best sum ending at i-1 is negative, is it ever useful to extend it to i?',
      'Kadane: current = max(nums[i], current + nums[i]); best = max(best, current). Start both with nums[0].',
    ],
    brute: {
      idea: 'Fix a start index, extend the end index while maintaining a running sum, and track the maximum.',
      code: J`class Solution {
    public int maxSubArray(int[] nums) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                best = Math.max(best, sum);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Kadane\'s algorithm: at each index decide whether to extend the previous subarray or start fresh here.',
      code: J`class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int current = nums[0];', 'current = maximum sum of a subarray that ends exactly at the current index.'],
      ['int best = nums[0];', 'best = answer so far. Starting with nums[0] (not 0) handles all-negative arrays.'],
      ['current = Math.max(nums[i], current + nums[i]);', 'Either extend the previous best subarray, or start a new one at i if the previous sum would only drag us down.'],
      ['best = Math.max(best, current);', 'Record the best subarray ending anywhere so far.'],
    ],
    cx: 'One pass with constant work → O(n) time and O(1) space. This is a DP where dp[i] = max(nums[i], dp[i-1] + nums[i]); we only keep dp[i-1], so space collapses to O(1).',
    dry: ['nums=[-2,1,-3,4,-1,2,1,-5,4]', 'start cur=-2 best=-2', '1: cur=max(1,-1)=1 best=1', '-3: cur=-2', '4: cur=max(4,2)=4 best=4', '-1: cur=3', '2: cur=5 best=5', '1: cur=6 best=6', '-5: cur=1', '4: cur=5 → answer 6'],
    tips: ['Be ready to also return the start/end indices — track where `current` was reset.', 'Mention the divide-and-conquer O(n log n) approach as an alternative if asked.'],
    mistakes: ['Initialising best = 0 returns 0 for all-negative arrays (should be the largest negative).', 'Resetting current to 0 when it goes negative and then forgetting the all-negative case.'],
    java: ['`Math.max` keeps the code branch-free and readable.', 'No overflow here: max |sum| = 10^5 × 10^4 = 10^9 < 2^31 - 1.'],
  },
  {
    id: 'missing-number',
    title: 'Missing Number',
    difficulty: 'Easy',
    desc: "Given an array `nums` containing `n` **distinct** numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    ex: [
      ['nums = [3,0,1]', '2', 'n = 3, so the range is [0,3]. 2 is missing.'],
      ['nums = [9,6,4,2,3,5,7,0,1]', '8', ''],
    ],
    cons: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers are unique'],
    fn: { name: 'missingNumber', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[3, 0, 1]], out: 2 },
      { in: [[0, 1]], out: 2 },
      { in: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], out: 8 },
      { in: [[1]], out: 0 },
      { in: [[0]], out: 1 },
    ],
    hints: [
      'What would the sum of 0..n be if nothing were missing?',
      'Expected sum minus actual sum gives the missing number. Is there an approach that can never overflow?',
      'XOR all indices 0..n with all values: equal numbers cancel out (a ^ a = 0), leaving the missing one.',
    ],
    brute: {
      idea: 'Put all numbers into a HashSet, then check 0..n to find the one not present.',
      code: J`import java.util.*;

class Solution {
    public int missingNumber(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) seen.add(x);
        for (int i = 0; i <= nums.length; i++) {
            if (!seen.contains(i)) return i;
        }
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'XOR trick: XOR of all numbers 0..n with all array values leaves only the missing number. (Gauss sum n(n+1)/2 - sum also works.)',
      code: J`class Solution {
    public int missingNumber(int[] nums) {
        int xor = nums.length;
        for (int i = 0; i < nums.length; i++) {
            xor ^= i ^ nums[i];
        }
        return xor;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int xor = nums.length;', 'Indices only go up to n-1, so we seed the XOR with n to include the full range 0..n.'],
      ['xor ^= i ^ nums[i];', 'XOR in both the index i and the value nums[i]. Every number that is present appears twice (once as an index or n, once as a value) and cancels to 0.'],
      ['return xor;', 'Only the missing number appeared an odd number of times, so it remains.'],
    ],
    cx: 'Linear scan, O(n) time, O(1) space. The HashSet approach is also O(n) time but needs O(n) memory.',
    dry: ['nums=[3,0,1], xor=3', 'i=0: xor = 3^0^3 = 0', 'i=1: xor = 0^1^0 = 1', 'i=2: xor = 1^2^1 = 2 → answer 2'],
    tips: ['Present the sum formula first (easy to explain), then mention XOR avoids overflow.', 'If the array were sorted, binary search would find the first index where nums[i] != i.'],
    mistakes: ['Computing n*(n+1)/2 with int when n is large can overflow — use long.', 'Forgetting that n itself may be the missing number.'],
    java: ['`^` is bitwise XOR in Java; `a ^ a == 0` and `a ^ 0 == a`, and it is commutative.', '`HashSet.contains` is O(1) average.'],
  },
  {
    id: 'find-duplicate-number',
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    desc: "Given an array `nums` of `n + 1` integers where each integer is in the range `[1, n]`, there is exactly **one repeated number** (it may repeat more than once). Return this repeated number.\n\nYou must solve the problem **without modifying** the array and using only constant extra space.",
    ex: [
      ['nums = [1,3,4,2,2]', '2', ''],
      ['nums = [3,1,3,4,2]', '3', ''],
    ],
    cons: ['1 <= n <= 10^5', 'nums.length == n + 1', '1 <= nums[i] <= n', 'Exactly one integer repeats'],
    fn: { name: 'findDuplicate', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[1, 3, 4, 2, 2]], out: 2 },
      { in: [[3, 1, 3, 4, 2]], out: 3 },
      { in: [[1, 1]], out: 1 },
      { in: [[2, 2, 2, 2, 2]], out: 2 },
      { in: [[1, 4, 4, 2, 4]], out: 4 },
    ],
    hints: [
      'A HashSet solves it easily, but uses O(n) space. Can you reuse an idea from linked lists?',
      'Treat each index i as a node with an edge to nums[i]. Because some value repeats, two nodes point to the same next node — that creates a cycle.',
      'Use Floyd\'s cycle detection (tortoise and hare). The entrance of the cycle is the duplicate number.',
    ],
    brute: {
      idea: 'Remember every value in a HashSet; the first value already present is the duplicate.',
      code: J`import java.util.*;

class Solution {
    public int findDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return x;
        }
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Floyd\'s tortoise and hare on the implicit linked list i → nums[i]. Phase 1 finds a meeting point inside the cycle; phase 2 finds the cycle entrance.',
      code: J`class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int slow = nums[0], fast = nums[0];', 'Both pointers start at the first node of our implicit list.'],
      ['slow = nums[slow]; fast = nums[nums[fast]];', 'slow moves one step, fast moves two steps.'],
      ['while (slow != fast)', 'They must meet somewhere inside the cycle (do-while ensures we move at least once).'],
      ['slow = nums[0];', 'Reset one pointer to the start. Mathematically, the distance from start to cycle entry equals the distance from the meeting point to the entry (mod cycle length).'],
      ['slow = nums[slow]; fast = nums[fast];', 'Move both one step at a time; they meet exactly at the cycle entrance.'],
      ['return slow;', 'The cycle entrance is the value pointed to by two different indices — the duplicate.'],
    ],
    cx: 'Each phase runs at most O(n) steps → O(n) time; only two integers → O(1) space. Alternatives: sort a copy (O(n log n), modifies/copies), binary search on value range counting ≤ mid (O(n log n), O(1)).',
    dry: ['nums=[1,3,4,2,2] → edges 0→1→3→2→4→2 (cycle 2→4→2)', 'Start slow=fast=nums[0]=1', 'Phase 1, step 1: slow=nums[1]=3, fast=nums[nums[1]]=nums[3]=2', 'Phase 1, step 2: slow=nums[3]=2, fast=nums[nums[2]]=nums[4]=2 → meet at 2', 'Phase 2: slow=nums[0]=1, fast=2 → slow=3, fast=nums[2]=4 → slow=nums[3]=2, fast=nums[4]=2 → meet', 'Answer: 2'],
    tips: ['Explain the mapping to a linked list clearly — that is what the interviewer is testing.', 'If asked for a simpler O(1)-space idea, mention binary search on the answer with the pigeonhole principle.'],
    mistakes: ['Sorting the array — violates the "do not modify" constraint.', 'Using a while loop instead of do-while in phase 1 exits immediately because slow == fast initially.'],
    java: ['`Set.add()` returns false if the element was already present — a neat way to detect duplicates in one call.', 'do-while executes the body at least once before checking the condition.'],
  },
  {
    id: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    desc: "Given an array `nums` of size `n`, return the **majority element** — the element that appears **more than ⌊n / 2⌋ times**. You may assume the majority element always exists.",
    ex: [
      ['nums = [3,2,3]', '3', ''],
      ['nums = [2,2,1,1,1,2,2]', '2', ''],
    ],
    cons: ['1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9', 'A majority element always exists'],
    fn: { name: 'majorityElement', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[3, 2, 3]], out: 3 },
      { in: [[2, 2, 1, 1, 1, 2, 2]], out: 2 },
      { in: [[1]], out: 1 },
      { in: [[6, 5, 5]], out: 5 },
      { in: [[-1, -1, 4, -1, 7, -1, -1]], out: -1 },
    ],
    hints: [
      'Counting with a HashMap works. Can you do it in O(1) space?',
      'If you pair up each majority element with a different element and cancel both, what survives?',
      'Boyer–Moore voting: keep a candidate and a count. Same number → count++, different → count--, count 0 → pick a new candidate.',
    ],
    brute: {
      idea: 'Count occurrences in a HashMap and return the element whose count exceeds n/2.',
      code: J`import java.util.*;

class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.put(x, count.getOrDefault(x, 0) + 1);
            if (count.get(x) > nums.length / 2) return x;
        }
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Boyer–Moore Voting Algorithm: the majority element survives all pairwise cancellations.',
      code: J`class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) {
                candidate = x;
            }
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int candidate = 0, count = 0;', 'candidate is our current guess; count is its net "votes".'],
      ['if (count == 0) candidate = x;', 'All previous votes cancelled out, so start fresh with the current element.'],
      ['count += (x == candidate) ? 1 : -1;', 'A matching element supports the candidate; a different element cancels one vote.'],
      ['return candidate;', 'Because the majority appears more than n/2 times, it cannot be fully cancelled and must be the final candidate.'],
    ],
    cx: 'Single pass, O(n) time, two integers → O(1) space. If the majority is not guaranteed, do a second pass to verify the candidate\'s count.',
    dry: ['[2,2,1,1,1,2,2]', '2: cand=2 cnt=1', '2: cnt=2', '1: cnt=1', '1: cnt=0', '1: cand=1 cnt=1', '2: cnt=0', '2: cand=2 cnt=1 → answer 2'],
    tips: ['Mention the verification pass when the problem does not guarantee a majority.', 'Follow-up: elements appearing more than n/3 times — extended Boyer–Moore with two candidates.'],
    mistakes: ['Sorting and returning nums[n/2] is correct but O(n log n) — say so if you use it.', 'Comparing Integer objects with == from a Map (works only for -128..127 due to caching).'],
    java: ['`map.getOrDefault(key, 0)` avoids null checks when counting.', 'Integer caching: `Integer a = 127, b = 127; a == b` is true, but for 128 it is false — use `.equals()` for boxed values.'],
  },
];
