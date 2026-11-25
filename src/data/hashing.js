const J = String.raw;

export default [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    desc: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\n\nExactly one solution exists, and you may not use the same element twice. Return the indices in increasing order.",
    ex: [
      ['nums = [2,7,11,15], target = 9', '[0,1]', 'nums[0] + nums[1] == 9.'],
      ['nums = [3,2,4], target = 6', '[1,2]', ''],
      ['nums = [3,3], target = 6', '[0,1]', ''],
    ],
    cons: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i], target <= 10^9', 'Exactly one valid answer exists'],
    fn: { name: 'twoSum', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int[]' },
    tests: [
      { in: [[2, 7, 11, 15], 9], out: [0, 1] },
      { in: [[3, 2, 4], 6], out: [1, 2] },
      { in: [[3, 3], 6], out: [0, 1] },
      { in: [[-1, -2, -3, -4, -5], -8], out: [2, 4] },
      { in: [[0, 4, 3, 0], 0], out: [0, 3] },
    ],
    hints: [
      'For each number x, what other number do you need?',
      'You need target - x. How can you check quickly whether you have already seen it?',
      'Store value → index in a HashMap while scanning. Before inserting x, check if target - x is already in the map.',
    ],
    brute: {
      idea: 'Check every pair (i, j).',
      code: J`class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) return new int[]{i, j};
            }
        }
        return new int[0];
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'One-pass HashMap of value → index; look up the complement before inserting.',
      code: J`import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[]{seen.get(need), i};
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['Map<Integer, Integer> seen = new HashMap<>();', 'Maps a value to the index where we saw it.'],
      ['int need = target - nums[i];', 'The complement that would complete the pair.'],
      ['if (seen.containsKey(need))', 'O(1) average lookup: has the complement appeared earlier?'],
      ['return new int[]{seen.get(need), i};', 'Earlier index first, current index second.'],
      ['seen.put(nums[i], i);', 'Insert after checking so an element is never paired with itself ([3,3] still works because the first 3 is already stored).'],
    ],
    cx: 'Single pass with O(1) average HashMap operations → O(n) time, O(n) space for the map.',
    dry: ['nums=[2,7,11,15], target=9', 'i=0: need 7, not seen → put 2→0', 'i=1: need 2, seen at 0 → return [0,1]'],
    tips: ['If the array is sorted (Two Sum II), two pointers give O(1) space.', 'Discuss trade-off: O(n) extra memory buys O(n) time.'],
    mistakes: ['Inserting before checking → using the same element twice when target = 2·x.', 'Sorting the array loses the original indices.'],
    java: ['`HashMap` offers O(1) average get/put/containsKey; worst case O(log n) per bucket since Java 8 (treeified buckets).', 'Array literal: `new int[]{a, b}`.'],
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    desc: "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.",
    ex: [
      ['nums = [1,2,3,1]', 'true', ''],
      ['nums = [1,2,3,4]', 'false', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    fn: { name: 'containsDuplicate', params: [['int[]', 'nums']], ret: 'boolean' },
    tests: [
      { in: [[1, 2, 3, 1]], out: true },
      { in: [[1, 2, 3, 4]], out: false },
      { in: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], out: true },
      { in: [[7]], out: false },
      { in: [[-1, 5, -1]], out: true },
    ],
    hints: [
      'Comparing all pairs is O(n^2). Can sorting help?',
      'After sorting, duplicates are adjacent.',
      'A HashSet gives O(n): add each number; if add() returns false, it was already present.',
    ],
    brute: {
      idea: 'Sort a copy and check neighbours.',
      code: J`import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        for (int i = 1; i < a.length; i++) {
            if (a[i] == a[i - 1]) return true;
        }
        return false;
    }
}`,
      time: 'O(n log n)', space: 'O(n) for the copy',
    },
    optimal: {
      idea: 'HashSet membership while scanning.',
      code: J`import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;
        }
        return false;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['Set<Integer> seen = new HashSet<>();', 'Stores values seen so far.'],
      ['if (!seen.add(x)) return true;', 'add returns false when x is already present — duplicate found, return early.'],
    ],
    cx: 'O(n) average time with O(1) set operations; O(n) space in the worst case (all distinct).',
    dry: ['[1,2,3,1]: add 1 ✓, 2 ✓, 3 ✓, 1 ✗ → true'],
    tips: ['Mention the time/space trade-off between sorting (less memory) and hashing (faster).', 'Follow-ups: Contains Duplicate II (within distance k → sliding window set).'],
    mistakes: ['Calling contains and then add — two lookups where one suffices.'],
    java: ['`Set.add` returns a boolean indicating whether the set changed.', 'Pre-size with `new HashSet<>(n * 2)` to avoid rehashing on large inputs.'],
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    desc: "Given an array of strings `strs`, group the **anagrams** together. You can return the answer in **any order**.",
    ex: [
      ['strs = ["eat","tea","tan","ate","nat","bat"]', '[["bat"],["nat","tan"],["ate","eat","tea"]]', ''],
      ['strs = [""]', '[[""]]', ''],
      ['strs = ["a"]', '[["a"]]', ''],
    ],
    cons: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    fn: { name: 'groupAnagrams', params: [['String[]', 'strs']], ret: 'List<List<String>>' },
    cmp: 'deep',
    tests: [
      { in: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], out: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { in: [['']], out: [['']] },
      { in: [['a']], out: [['a']] },
      { in: [['abc', 'bca', 'cab', 'xyz', 'zyx', 'q']], out: [['abc', 'bca', 'cab'], ['xyz', 'zyx'], ['q']] },
      { in: [['ab', 'ba', 'ab']], out: [['ab', 'ab', 'ba']] },
    ],
    hints: [
      'Two words are anagrams if they have the same "signature". What could that signature be?',
      'Sorting the characters of a word gives a canonical key: "eat" → "aet".',
      'Use HashMap<String, List<String>>: key = sorted word (or a 26-count signature), value = list of words. Return new ArrayList<>(map.values()).',
    ],
    brute: {
      idea: 'For each word, compare with every existing group\'s representative using an anagram check.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> groups = new ArrayList<>();
        for (String s : strs) {
            boolean placed = false;
            for (List<String> g : groups) {
                if (isAnagram(g.get(0), s)) { g.add(s); placed = true; break; }
            }
            if (!placed) groups.add(new ArrayList<>(Arrays.asList(s)));
        }
        return groups;
    }

    private boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] c = new int[26];
        for (int i = 0; i < a.length(); i++) { c[a.charAt(i) - 'a']++; c[b.charAt(i) - 'a']--; }
        for (int x : c) if (x != 0) return false;
        return true;
    }
}`,
      time: 'O(n^2 · k)', space: 'O(n · k)',
    },
    optimal: {
      idea: 'Hash each word by its sorted characters; words with the same key are anagrams.',
      code: J`import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}`,
      time: 'O(n · k log k)', space: 'O(n · k)',
    },
    lines: [
      ['Map<String, List<String>> groups = new HashMap<>();', 'Key: canonical form; value: all words sharing it.'],
      ['char[] chars = s.toCharArray(); Arrays.sort(chars);', 'Sorting letters gives the same string for all anagrams.'],
      ['String key = new String(chars);', 'Convert back to String so it has proper equals/hashCode (char[] uses identity!).'],
      ['groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);', 'Create the list on first use, then add the word — one idiomatic line.'],
      ['return new ArrayList<>(groups.values());', 'values() is a view; wrap it in a list for the return type.'],
    ],
    cx: 'n words of length up to k: sorting each costs O(k log k) → O(n·k log k). Using a 26-count key instead gives O(n·k). Map storage is O(n·k).',
    dry: ['"eat"→aet, "tea"→aet, "tan"→ant, "ate"→aet, "nat"→ant, "bat"→abt', 'groups: aet=[eat,tea,ate], ant=[tan,nat], abt=[bat]'],
    tips: ['Count-based key: build a string like "#1#0#0..." from int[26] for O(k) per word.', 'Explain why char[] cannot be a HashMap key.'],
    mistakes: ['Using char[] as the key (arrays use reference equality).', 'Using `map.get(key).add()` without creating the list first → NullPointerException.'],
    java: ['`Map.computeIfAbsent` is the idiomatic way to build multimaps in Java 8+.', '`List.of(...)` creates an immutable list — wrap in `new ArrayList<>(...)` if you need to add.'],
  },
  {
    id: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    desc: "Given an unsorted array of integers `nums`, return the length of the **longest consecutive elements sequence** (values that form a run like 1, 2, 3, 4 regardless of their positions).\n\nYou must write an algorithm that runs in **O(n)** time.",
    ex: [
      ['nums = [100,4,200,1,3,2]', '4', 'The longest consecutive sequence is [1, 2, 3, 4].'],
      ['nums = [0,3,7,2,5,8,4,6,0,1]', '9', ''],
    ],
    cons: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    fn: { name: 'longestConsecutive', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[100, 4, 200, 1, 3, 2]], out: 4 },
      { in: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], out: 9 },
      { in: [[]], out: 0 },
      { in: [[1, 2, 0, 1]], out: 3 },
      { in: [[9, 1, -3, 2, 4, 8, 3, -1, 6, -2, -4, 7]], out: 4 },
    ],
    hints: [
      'Sorting gives O(n log n). How can a HashSet help you avoid sorting?',
      'Put all numbers in a HashSet. Which numbers can be the START of a sequence?',
      'x starts a sequence only if x - 1 is not in the set. From each start, count upwards while x + 1 exists. Each number is visited at most twice → O(n).',
    ],
    brute: {
      idea: 'Sort, then count runs of consecutive values (skipping duplicates).',
      code: J`import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) return 0;
        int[] a = nums.clone();
        Arrays.sort(a);
        int best = 1, cur = 1;
        for (int i = 1; i < a.length; i++) {
            if (a[i] == a[i - 1]) continue;
            if (a[i] == a[i - 1] + 1) cur++;
            else cur = 1;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'HashSet + only start counting from sequence beginnings.',
      code: J`import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (!set.contains(x - 1)) {
                int len = 1;
                while (set.contains(x + len)) len++;
                best = Math.max(best, len);
            }
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['for (int x : nums) set.add(x);', 'O(1) membership tests; duplicates vanish.'],
      ['for (int x : set)', 'Iterate the set (not the array) so duplicates do not trigger repeated work.'],
      ['if (!set.contains(x - 1))', 'x is the smallest number of its run, so we start counting here.'],
      ['while (set.contains(x + len)) len++;', 'Extend the run upward.'],
    ],
    cx: 'Each number is the start of at most one count, and each number is visited by the inner while loop at most once overall → O(n) time. Set storage O(n).',
    dry: ['set={100,4,200,1,3,2}', '100: 99 missing → run 1', '4: 3 present → skip', '200: run 1', '1: 0 missing → 1,2,3,4 → len 4', 'answer 4'],
    tips: ['Explain the amortised argument for why the nested loop is still O(n) — interviewers look for it.'],
    mistakes: ['Starting a count from every element → O(n^2).', 'Iterating over nums with duplicates on huge inputs causes repeated work.'],
    java: ['For-each over a `HashSet` iterates in hash order (unordered).', '`Integer` autoboxing in `set.contains(x + 1)` — fine for interviews.'],
  },
  {
    id: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    desc: "Given an array of integers `nums` and an integer `k`, return the **total number of contiguous subarrays** whose sum equals `k`.",
    ex: [
      ['nums = [1,1,1], k = 2', '2', 'Subarrays [1,1] at indices 0..1 and 1..2.'],
      ['nums = [1,2,3], k = 3', '2', '[1,2] and [3].'],
    ],
    cons: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    fn: { name: 'subarraySum', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int' },
    tests: [
      { in: [[1, 1, 1], 2], out: 2 },
      { in: [[1, 2, 3], 3], out: 2 },
      { in: [[1, -1, 0], 0], out: 3 },
      { in: [[3, 4, 7, 2, -3, 1, 4, 2], 7], out: 4 },
      { in: [[5], 5], out: 1 },
    ],
    hints: [
      'Sliding window does not work here. Why? (Negative numbers.)',
      'Let prefix[j] = sum of nums[0..j]. The sum of nums[i+1..j] is prefix[j] - prefix[i].',
      'Count how many earlier prefix sums equal currentPrefix - k using a HashMap<prefixSum, count>, seeded with {0: 1}.',
    ],
    brute: {
      idea: 'Try every start, extend the end with a running sum, and count sums equal to k.',
      code: J`class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                if (sum == k) count++;
            }
        }
        return count;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Prefix sums + HashMap of how often each prefix sum occurred.',
      code: J`import java.util.*;

class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int prefix = 0, count = 0;
        for (int x : nums) {
            prefix += x;
            count += freq.getOrDefault(prefix - k, 0);
            freq.merge(prefix, 1, Integer::sum);
        }
        return count;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['freq.put(0, 1);', 'An empty prefix (sum 0) exists once — this counts subarrays that start at index 0.'],
      ['prefix += x;', 'Running prefix sum up to the current index.'],
      ['count += freq.getOrDefault(prefix - k, 0);', 'Every earlier prefix equal to prefix - k marks the start of a subarray summing to k ending here.'],
      ['freq.merge(prefix, 1, Integer::sum);', 'Record this prefix: insert 1 or add 1 to the existing count.'],
    ],
    cx: 'One pass with O(1) average map operations → O(n). The map holds up to n + 1 distinct prefix sums → O(n).',
    dry: ['nums=[1,2,3], k=3, freq={0:1}', 'x=1: prefix=1, need -2 → 0; freq{0:1,1:1}', 'x=2: prefix=3, need 0 → +1 (count1)', 'x=3: prefix=6, need 3 → +1 (count2)'],
    tips: ['This prefix-sum + hashmap pattern is extremely common: Contiguous Array, Subarray Sums Divisible by K, Path Sum III.', 'Explain why sliding window fails with negatives.'],
    mistakes: ['Forgetting to seed {0: 1}.', 'Updating the map before querying (would count empty subarrays when k = 0).'],
    java: ['`Map.merge(key, 1, Integer::sum)` increments a counter in one call.', '`Integer::sum` is a method reference to the static Integer.sum(int, int).'],
  },
  {
    id: 'isomorphic-strings',
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    desc: "Given two strings `s` and `t`, determine if they are **isomorphic**: the characters in `s` can be replaced to get `t`.\n\nAll occurrences of a character must be replaced with the same character while preserving order. No two characters may map to the same character, but a character may map to itself.",
    ex: [
      ['s = "egg", t = "add"', 'true', 'e→a, g→d.'],
      ['s = "foo", t = "bar"', 'false', 'o would need to map to both a and r.'],
      ['s = "paper", t = "title"', 'true', ''],
    ],
    cons: ['1 <= s.length <= 5 * 10^4', 't.length == s.length', 's and t consist of any valid ASCII character'],
    fn: { name: 'isIsomorphic', params: [['String', 's'], ['String', 't']], ret: 'boolean' },
    tests: [
      { in: ['egg', 'add'], out: true },
      { in: ['foo', 'bar'], out: false },
      { in: ['paper', 'title'], out: true },
      { in: ['badc', 'baba'], out: false },
      { in: ['a', 'a'], out: true },
    ],
    hints: [
      'A mapping s→t must be consistent. Is that enough?',
      'You also need t→s to be consistent ("badc" vs "baba": b→b, d→b clash on the reverse side).',
      'Keep two arrays of size 256 storing the last index (+1) where each char was seen in s and t; at every position they must match.',
    ],
    brute: {
      idea: 'Two HashMaps: s→t and t→s; check both directions at each index.',
      code: J`import java.util.*;

class Solution {
    public boolean isIsomorphic(String s, String t) {
        Map<Character, Character> st = new HashMap<>(), ts = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (st.containsKey(a) && st.get(a) != b) return false;
            if (ts.containsKey(b) && ts.get(b) != a) return false;
            st.put(a, b);
            ts.put(b, a);
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(k) distinct chars',
    },
    optimal: {
      idea: 'Two int[256] arrays recording the last position (1-based) each character appeared; positions must agree at every index.',
      code: J`class Solution {
    public boolean isIsomorphic(String s, String t) {
        int[] lastS = new int[256], lastT = new int[256];
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (lastS[a] != lastT[b]) return false;
            lastS[a] = i + 1;
            lastT[b] = i + 1;
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int[] lastS = new int[256], lastT = new int[256];', 'Last seen position (1-based) of each ASCII char; 0 means never seen.'],
      ['if (lastS[a] != lastT[b]) return false;', 'In an isomorphism, a and b must always have been seen at the same previous positions.'],
      ['lastS[a] = i + 1; lastT[b] = i + 1;', 'Use i + 1 so position 0 is distinguishable from "never seen".'],
    ],
    cx: 'Single pass → O(n). Arrays have fixed size 256 → O(1).',
    dry: ['s="badc", t="baba"', 'i0 b/b: 0==0 → set 1', 'i1 a/a: 0==0 → set 2', 'i2 d/b: lastS[d]=0, lastT[b]=1 → false'],
    tips: ['Word Pattern is the same problem with words instead of characters.'],
    mistakes: ['Checking only one direction.', 'Comparing boxed Characters with != works for ASCII due to caching, but `.equals()` is safer.'],
    java: ['Characters 0–127 are cached as Character objects, which is why `!=` happens to work in the brute force for ASCII — do not rely on it.'],
  },
  {
    id: 'intersection-two-arrays',
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    desc: "Given two integer arrays `nums1` and `nums2`, return an array of their **intersection**. Each element in the result must be **unique**, and you may return the result in **any order**.",
    ex: [
      ['nums1 = [1,2,2,1], nums2 = [2,2]', '[2]', ''],
      ['nums1 = [4,9,5], nums2 = [9,4,9,8,4]', '[9,4]', '[4,9] is also accepted.'],
    ],
    cons: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
    fn: { name: 'intersection', params: [['int[]', 'nums1'], ['int[]', 'nums2']], ret: 'int[]' },
    cmp: 'sorted',
    tests: [
      { in: [[1, 2, 2, 1], [2, 2]], out: [2] },
      { in: [[4, 9, 5], [9, 4, 9, 8, 4]], out: [4, 9] },
      { in: [[1, 2], [3, 4]], out: [] },
      { in: [[7, 7, 7], [7]], out: [7] },
      { in: [[1, 2, 3, 4, 5], [5, 4, 3]], out: [3, 4, 5] },
    ],
    hints: [
      'Duplicates should appear only once in the answer — which collection removes duplicates?',
      'Put nums1 into a HashSet.',
      'For each element of nums2 that is in the set, add it to the result and remove it from the set so it is not added twice.',
    ],
    brute: {
      idea: 'Nested loops with a result set to avoid duplicates.',
      code: J`import java.util.*;

class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> res = new HashSet<>();
        for (int a : nums1) {
            for (int b : nums2) {
                if (a == b) { res.add(a); break; }
            }
        }
        int[] out = new int[res.size()];
        int i = 0;
        for (int x : res) out[i++] = x;
        return out;
    }
}`,
      time: 'O(n·m)', space: 'O(min(n, m))',
    },
    optimal: {
      idea: 'HashSet of nums1; remove matched elements while scanning nums2.',
      code: J`import java.util.*;

class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums1) set.add(x);
        List<Integer> res = new ArrayList<>();
        for (int x : nums2) {
            if (set.remove(x)) res.add(x);
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}`,
      time: 'O(n + m)', space: 'O(n)',
    },
    lines: [
      ['for (int x : nums1) set.add(x);', 'Unique values of nums1.'],
      ['if (set.remove(x)) res.add(x);', 'remove returns true only the first time — common value recorded exactly once.'],
      ['res.stream().mapToInt(Integer::intValue).toArray();', 'Convert List<Integer> to int[] with streams.'],
    ],
    cx: 'Building the set O(n) + scanning O(m) → O(n + m). Set space O(n).',
    dry: ['nums1=[4,9,5] → set{4,9,5}', 'nums2: 9 ✓ remove, 4 ✓ remove, 9 ✗, 8 ✗, 4 ✗ → [9,4]'],
    tips: ['Intersection II (keep duplicates) → use a HashMap of counts.', 'If arrays are sorted, two pointers give O(1) extra space.'],
    mistakes: ['Returning duplicates.'],
    java: ['`Set.remove` returns whether the element was present.', '`list.stream().mapToInt(Integer::intValue).toArray()` is the standard List<Integer> → int[] conversion.', '`retainAll` computes set intersection in one call: `set1.retainAll(set2)`.'],
  },
  {
    id: 'happy-number',
    title: 'Happy Number',
    difficulty: 'Easy',
    desc: "A **happy number** is defined by the following process: starting with any positive integer, replace the number by the **sum of the squares of its digits**. Repeat until the number equals `1` (where it stays), or it loops endlessly in a cycle that does not include `1`.\n\nGiven `n`, return `true` if `n` is a happy number, and `false` if not.",
    ex: [
      ['n = 19', 'true', '1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1.'],
      ['n = 2', 'false', ''],
    ],
    cons: ['1 <= n <= 2^31 - 1'],
    fn: { name: 'isHappy', params: [['int', 'n']], ret: 'boolean' },
    tests: [
      { in: [19], out: true },
      { in: [2], out: false },
      { in: [1], out: true },
      { in: [7], out: true },
      { in: [4], out: false },
      { in: [2147483647], out: false },
    ],
    hints: [
      'What happens if the process never reaches 1?',
      'If a number repeats, you are in a cycle and will never reach 1. A HashSet can detect repeats.',
      'Or use Floyd\'s cycle detection with slow = next(n) and fast = next(next(n)) for O(1) space.',
    ],
    brute: {
      idea: 'Keep a HashSet of numbers seen; stop on 1 or on a repeat.',
      code: J`import java.util.*;

class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && seen.add(n)) {
            n = next(n);
        }
        return n == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}`,
      time: 'O(log n)', space: 'O(log n)',
    },
    optimal: {
      idea: 'Floyd\'s tortoise and hare on the sequence n → next(n): either fast reaches 1, or slow and fast meet in a cycle.',
      code: J`class Solution {
    public boolean isHappy(int n) {
        int slow = n, fast = next(n);
        while (fast != 1 && slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}`,
      time: 'O(log n)', space: 'O(1)',
    },
    lines: [
      ['int slow = n, fast = next(n);', 'fast starts one step ahead so the loop condition is meaningful immediately.'],
      ['while (fast != 1 && slow != fast)', 'Stop when we reach 1 or detect a cycle.'],
      ['slow = next(slow); fast = next(next(fast));', 'slow moves one step, fast two steps.'],
      ['int d = n % 10; sum += d * d; n /= 10;', 'Extract digits from the right with % and /.'],
    ],
    cx: 'For a number with d digits, next() is at most 81·d, so values quickly drop below 243 and the cycle length is bounded. Overall O(log n) time; Floyd uses O(1) space.',
    dry: ['n=19: slow=19, fast=82', 'slow=82, fast=next(68)=100', 'slow=68, fast=next(1)=1 → fast==1 → true'],
    tips: ['Connect it to Linked List Cycle — interviewers love seeing the pattern transfer.'],
    mistakes: ['Infinite loop without cycle detection.'],
    java: ['Integer division `/` truncates toward zero; `%` gives the last digit for positive numbers.'],
  },
  {
    id: 'ransom-note',
    title: 'Ransom Note',
    difficulty: 'Easy',
    desc: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine`, and `false` otherwise.\n\nEach letter in `magazine` can only be used **once** in `ransomNote`.",
    ex: [
      ['ransomNote = "a", magazine = "b"', 'false', ''],
      ['ransomNote = "aa", magazine = "aab"', 'true', ''],
    ],
    cons: ['1 <= ransomNote.length, magazine.length <= 10^5', 'Lowercase English letters only'],
    fn: { name: 'canConstruct', params: [['String', 'ransomNote'], ['String', 'magazine']], ret: 'boolean' },
    tests: [
      { in: ['a', 'b'], out: false },
      { in: ['aa', 'ab'], out: false },
      { in: ['aa', 'aab'], out: true },
      { in: ['hello', 'ohlelxyz'], out: true },
      { in: ['abc', 'cbaa'], out: true },
    ],
    hints: [
      'You need enough copies of each letter.',
      'Count the letters available in the magazine.',
      'Use int[26]: count magazine letters, then decrement for each ransom letter; if any count goes negative, return false.',
    ],
    brute: {
      idea: 'For each ransom letter, find and remove one matching letter from a mutable copy of magazine.',
      code: J`class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        StringBuilder mag = new StringBuilder(magazine);
        for (char c : ransomNote.toCharArray()) {
            int idx = mag.indexOf(String.valueOf(c));
            if (idx == -1) return false;
            mag.deleteCharAt(idx);
        }
        return true;
    }
}`,
      time: 'O(n·m)', space: 'O(m)',
    },
    optimal: {
      idea: 'Frequency counting with int[26].',
      code: J`class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        if (ransomNote.length() > magazine.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < magazine.length(); i++) {
            count[magazine.charAt(i) - 'a']++;
        }
        for (int i = 0; i < ransomNote.length(); i++) {
            if (--count[ransomNote.charAt(i) - 'a'] < 0) return false;
        }
        return true;
    }
}`,
      time: 'O(n + m)', space: 'O(1)',
    },
    lines: [
      ['if (ransomNote.length() > magazine.length()) return false;', 'Cheap early exit.'],
      ["count[magazine.charAt(i) - 'a']++;", 'Available supply of each letter.'],
      ["if (--count[ransomNote.charAt(i) - 'a'] < 0) return false;", 'Pre-decrement uses one letter; negative means we ran out.'],
    ],
    cx: 'Two linear passes → O(n + m); fixed 26 counters → O(1).',
    dry: ['note="aa", mag="aab" → counts a2 b1', 'use a → 1, use a → 0 → true'],
    tips: ['Ask whether characters are limited to lowercase letters; otherwise use a HashMap or int[128].'],
    mistakes: ['Checking only presence, not counts.'],
    java: ['`--x` decrements before the value is used; `x--` after.'],
  },
  {
    id: 'contiguous-array',
    title: 'Contiguous Array (Equal 0s and 1s)',
    difficulty: 'Medium',
    desc: "Given a binary array `nums`, return the **maximum length** of a contiguous subarray with an **equal number of 0 and 1**.",
    ex: [
      ['nums = [0,1]', '2', '[0, 1] has one 0 and one 1.'],
      ['nums = [0,1,0]', '2', '[0,1] or [1,0].'],
      ['nums = [0,1,1,1,1,1,0,0,0]', '6', '[1,1,1,0,0,0].'],
    ],
    cons: ['1 <= nums.length <= 10^5', 'nums[i] is 0 or 1'],
    fn: { name: 'findMaxLength', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { in: [[0, 1]], out: 2 },
      { in: [[0, 1, 0]], out: 2 },
      { in: [[0, 1, 1, 1, 1, 1, 0, 0, 0]], out: 6 },
      { in: [[0, 0, 0]], out: 0 },
      { in: [[1, 0, 1, 1, 0, 0, 1, 0]], out: 8 },
    ],
    hints: [
      'Replace every 0 with -1. What does "equal 0s and 1s" mean now?',
      'The subarray sum must be 0, i.e. two prefix sums are equal.',
      'Store the FIRST index at which each prefix sum appears (seed sum 0 at index -1). When the same sum appears again at j, the length is j - firstIndex.',
    ],
    brute: {
      idea: 'Check every subarray, counting zeros and ones.',
      code: J`class Solution {
    public int findMaxLength(int[] nums) {
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            int zeros = 0, ones = 0;
            for (int j = i; j < nums.length; j++) {
                if (nums[j] == 0) zeros++; else ones++;
                if (zeros == ones) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Treat 0 as -1; equal prefix sums enclose a balanced subarray. HashMap stores first index of each prefix sum.',
      code: J`import java.util.*;

class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> firstIndex = new HashMap<>();
        firstIndex.put(0, -1);
        int sum = 0, best = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i] == 1 ? 1 : -1;
            if (firstIndex.containsKey(sum)) {
                best = Math.max(best, i - firstIndex.get(sum));
            } else {
                firstIndex.put(sum, i);
            }
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['firstIndex.put(0, -1);', 'A prefix sum of 0 "before" the array lets balanced subarrays starting at index 0 be measured.'],
      ['sum += nums[i] == 1 ? 1 : -1;', 'Map 0 → -1 so balance means sum 0.'],
      ['best = Math.max(best, i - firstIndex.get(sum));', 'Same sum seen before at index p → nums[p+1..i] is balanced.'],
      ['else firstIndex.put(sum, i);', 'Only store the first occurrence to maximise length.'],
    ],
    cx: 'Single pass with O(1) map ops → O(n). Prefix sums range in [-n, n] → O(n) space (an int[2n+1] array works too).',
    dry: ['[0,1,0]: sums -1, 0, -1', 'i0 sum-1 store 0', 'i1 sum0 seen at -1 → len 2', 'i2 sum-1 seen at 0 → len 2 → answer 2'],
    tips: ['Point out the relation to Subarray Sum Equals K — same prefix-sum idea, but storing first index instead of counts.'],
    mistakes: ['Overwriting the first index with later ones (shrinks the answer).'],
    java: ['An `int[2 * n + 1]` array offset by n is a faster alternative to HashMap for bounded prefix sums.'],
  },
];
