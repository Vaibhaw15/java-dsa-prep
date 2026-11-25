const J = String.raw;

export default [
  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    desc: "Given an input string `s`, reverse the order of the **words**. A word is a sequence of non-space characters. Words in `s` are separated by at least one space.\n\nReturn a string of the words in reverse order joined by a **single space**. The result must not contain leading or trailing spaces or multiple spaces between words.",
    ex: [
      ['s = "the sky is blue"', '"blue is sky the"', ''],
      ['s = "  hello world  "', '"world hello"', 'Leading and trailing spaces are removed.'],
      ['s = "a good   example"', '"example good a"', 'Multiple spaces are reduced to one.'],
    ],
    cons: ['1 <= s.length <= 10^4', 's contains English letters, digits and spaces', 'There is at least one word in s'],
    fn: { name: 'reverseWords', params: [['String', 's']], ret: 'String' },
    tests: [
      { in: ['the sky is blue'], out: 'blue is sky the' },
      { in: ['  hello world  '], out: 'world hello' },
      { in: ['a good   example'], out: 'example good a' },
      { in: ['single'], out: 'single' },
      { in: ['  Java  is   fun '], out: 'fun is Java' },
    ],
    hints: [
      'Can you first extract the words, ignoring the extra spaces?',
      'trim() and split("\\s+") give you the words; then join them backwards.',
      'Without library splitting: scan from the end, skip spaces, find each word\'s boundaries and append it to a StringBuilder.',
    ],
    brute: {
      idea: 'Trim, split on one-or-more whitespace with a regex, reverse the list and join with single spaces.',
      code: J`import java.util.*;

class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\s+");
        List<String> list = new ArrayList<>(Arrays.asList(words));
        Collections.reverse(list);
        return String.join(" ", list);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Manual two-pointer scan from the right; append each word to a StringBuilder. No regex, a single pass — shows you understand the mechanics.',
      code: J`class Solution {
    public String reverseWords(String s) {
        StringBuilder sb = new StringBuilder();
        int i = s.length() - 1;
        while (i >= 0) {
            while (i >= 0 && s.charAt(i) == ' ') i--;
            if (i < 0) break;
            int end = i;
            while (i >= 0 && s.charAt(i) != ' ') i--;
            if (sb.length() > 0) sb.append(' ');
            sb.append(s, i + 1, end + 1);
        }
        return sb.toString();
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['StringBuilder sb = new StringBuilder();', 'Strings are immutable in Java; StringBuilder lets us append in amortised O(1).'],
      ['while (i >= 0 && s.charAt(i) == \' \') i--;', 'Skip trailing/separating spaces.'],
      ['int end = i;', 'Last character of the current word.'],
      ['while (i >= 0 && s.charAt(i) != \' \') i--;', 'Move to just before the word\'s first character.'],
      ['if (sb.length() > 0) sb.append(\' \');', 'Add exactly one separator between words, never a leading one.'],
      ['sb.append(s, i + 1, end + 1);', 'Append the substring [i+1, end] without creating an intermediate String.'],
    ],
    cx: 'Each character is visited a constant number of times → O(n). The output StringBuilder is O(n).',
    dry: ['s="  hello world  "', 'skip 2 spaces, word "world" (end=12) → sb="world"', 'skip space, word "hello" → sb="world hello"', 'skip leading spaces, i<0 → done'],
    tips: ['Mention both: the one-liner with split is fine in production, the manual scan shows algorithmic thinking.', 'Follow-up (char array, in-place): reverse the whole string, then reverse each word.'],
    mistakes: ['split(" ") produces empty strings for multiple spaces.', 'Concatenating with + inside a loop (O(n^2) due to immutable Strings).'],
    java: ['`String.split` takes a regex: "\\\\s+" in Java source means one or more whitespace characters.', '`StringBuilder.append(CharSequence s, int start, int end)` appends a slice.', '`String.join(delimiter, iterable)` joins elements with a separator.'],
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    desc: "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    ex: [
      ['s = "A man, a plan, a canal: Panama"', 'true', '"amanaplanacanalpanama" is a palindrome.'],
      ['s = "race a car"', 'false', '"raceacar" is not a palindrome.'],
      ['s = " "', 'true', 'An empty string after cleaning is a palindrome.'],
    ],
    cons: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
    fn: { name: 'isPalindrome', params: [['String', 's']], ret: 'boolean' },
    tests: [
      { in: ['A man, a plan, a canal: Panama'], out: true },
      { in: ['race a car'], out: false },
      { in: [' '], out: true },
      { in: ['0P'], out: false },
      { in: ['No lemon, no melon'], out: true },
      { in: ['ab_a'], out: true },
    ],
    hints: [
      'First imagine the cleaned string. How do you check if it is a palindrome?',
      'Compare characters from both ends moving inward.',
      'Use two pointers on the original string and skip non-alphanumeric characters with Character.isLetterOrDigit — no extra string needed.',
    ],
    brute: {
      idea: 'Build the cleaned lowercase string, reverse it, and compare.',
      code: J`class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder clean = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) clean.append(Character.toLowerCase(c));
        }
        String a = clean.toString();
        String b = clean.reverse().toString();
        return a.equals(b);
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Two pointers on the original string, skipping non-alphanumerics, comparing case-insensitively.',
      code: J`class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }
            l++;
            r--;
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int l = 0, r = s.length() - 1;', 'Pointers at both ends.'],
      ['while (l < r && !Character.isLetterOrDigit(...)) l++;', 'Skip characters that do not count. The l < r guard keeps us inside the string.'],
      ['Character.toLowerCase(a) != Character.toLowerCase(b)', 'Case-insensitive comparison of chars (primitives, so != is correct).'],
      ['l++; r--;', 'Both characters matched; move inward.'],
    ],
    cx: 'Each pointer moves at most n steps → O(n). No extra string → O(1).',
    dry: ['"race a car"', 'r/r ✓, a/a ✓, c/c ✓, e/(skip space) a ✗ → false'],
    tips: ['Ask: should digits count? Is it ASCII only?', 'Follow-up: Valid Palindrome II (delete at most one char) — on mismatch, try skipping l or r.'],
    mistakes: ['Forgetting the l < r guard in the inner skip loops → index out of bounds.', 'Comparing Strings with == instead of equals in the brute force.'],
    java: ['`Character.isLetterOrDigit`, `Character.toLowerCase` are static helpers in java.lang.Character.', '`StringBuilder.reverse()` reverses in place and returns this.', 'Use `equals()` for String content comparison; `==` compares references.'],
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    desc: "Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s`, and `false` otherwise. An anagram uses exactly the same characters with the same frequencies, possibly in a different order.",
    ex: [
      ['s = "anagram", t = "nagaram"', 'true', ''],
      ['s = "rat", t = "car"', 'false', ''],
    ],
    cons: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    fn: { name: 'isAnagram', params: [['String', 's'], ['String', 't']], ret: 'boolean' },
    tests: [
      { in: ['anagram', 'nagaram'], out: true },
      { in: ['rat', 'car'], out: false },
      { in: ['a', 'ab'], out: false },
      { in: ['listen', 'silent'], out: true },
      { in: ['aacc', 'ccac'], out: false },
    ],
    hints: [
      'If the lengths differ, can they be anagrams?',
      'Sorting both strings and comparing works. Can you avoid the O(n log n) sort?',
      'Use an int[26] frequency array: +1 for each char of s, -1 for each char of t; all counts must be 0.',
    ],
    brute: {
      idea: 'Sort the characters of both strings and compare.',
      code: J`import java.util.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        char[] a = s.toCharArray();
        char[] b = t.toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}`,
      time: 'O(n log n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Count frequencies with a fixed int[26] array.',
      code: J`class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(1) (26 counters)',
    },
    lines: [
      ['if (s.length() != t.length()) return false;', 'Quick reject: different lengths can never be anagrams.'],
      ['int[] count = new int[26];', 'One counter per lowercase letter.'],
      ["count[s.charAt(i) - 'a']++;", "char arithmetic: 'c' - 'a' = 2 maps letters to indices 0..25."],
      ["count[t.charAt(i) - 'a']--;", 'Characters of t cancel those of s.'],
      ['if (c != 0) return false;', 'Any non-zero counter means a frequency mismatch.'],
    ],
    cx: 'One pass over both strings plus a 26-step check → O(n). The counter array has fixed size → O(1).',
    dry: ['s="rat", t="car"', 'r:+1 c:-1, a:+1 a:-1, t:+1 r:-1', 'counts: c=-1, t=+1 → false'],
    tips: ['Follow-up: Unicode input → use HashMap<Character, Integer> instead of int[26].', 'This counting idea powers Group Anagrams and Find All Anagrams.'],
    mistakes: ['Forgetting the length check when using a single loop over s.', 'Assuming uppercase letters fit in int[26].'],
    java: ["chars are 16-bit unsigned integers, so `c - 'a'` yields an int index.", '`Arrays.equals(char[], char[])` compares contents element by element.'],
  },
  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    desc: "Write a function to find the **longest common prefix** string amongst an array of strings `strs`. If there is no common prefix, return an empty string `\"\"`.",
    ex: [
      ['strs = ["flower","flow","flight"]', '"fl"', ''],
      ['strs = ["dog","racecar","car"]', '""', 'There is no common prefix.'],
    ],
    cons: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of lowercase English letters'],
    fn: { name: 'longestCommonPrefix', params: [['String[]', 'strs']], ret: 'String' },
    tests: [
      { in: [['flower', 'flow', 'flight']], out: 'fl' },
      { in: [['dog', 'racecar', 'car']], out: '' },
      { in: [['alone']], out: 'alone' },
      { in: [['', 'b']], out: '' },
      { in: [['interview', 'internet', 'interval', 'internal']], out: 'inter' },
    ],
    hints: [
      'The common prefix can be no longer than the shortest string.',
      'Compare character by character at the same index across all strings (vertical scanning).',
      'Or sort the array: the common prefix of the whole array equals the common prefix of the first and last strings after sorting.',
    ],
    brute: {
      idea: 'Horizontal scanning: start with the first string as prefix and shorten it until every string startsWith it.',
      code: J`class Solution {
    public String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (!strs[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
      time: 'O(S) where S = total characters', space: 'O(1) extra',
    },
    optimal: {
      idea: 'Vertical scanning: check column by column and stop at the first mismatch or the end of any string.',
      code: J`class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        for (int i = 0; i < first.length(); i++) {
            char c = first.charAt(i);
            for (int j = 1; j < strs.length; j++) {
                if (i >= strs[j].length() || strs[j].charAt(i) != c) {
                    return first.substring(0, i);
                }
            }
        }
        return first;
    }
}`,
      time: 'O(S) worst case, stops early on mismatch', space: 'O(1) extra',
    },
    lines: [
      ['String first = strs[0];', 'Any common prefix must be a prefix of the first string.'],
      ['char c = first.charAt(i);', 'Candidate character for column i.'],
      ['if (i >= strs[j].length() || strs[j].charAt(i) != c)', 'String j ended or differs → prefix ends just before column i.'],
      ['return first.substring(0, i);', 'Characters 0..i-1 matched in all strings.'],
      ['return first;', 'The entire first string is a prefix of all others.'],
    ],
    cx: 'In the worst case all strings are equal and we read every character → O(S). Vertical scanning stops at the first mismatching column, which makes it fast when the prefix is short.',
    dry: ['["flower","flow","flight"]', 'col0 f f f ✓', 'col1 l l l ✓', 'col2 o o i ✗ → "fl"'],
    tips: ['Mention a Trie for repeated queries (autocomplete systems).', 'Divide and conquer and binary search on length are other valid approaches.'],
    mistakes: ['Not checking i >= strs[j].length() → StringIndexOutOfBoundsException.'],
    java: ['`substring(begin, end)` excludes end and creates a new String (O(length)).', '`startsWith` checks a prefix without creating new strings.'],
  },
  {
    id: 'string-compression',
    title: 'String Compression',
    difficulty: 'Medium',
    desc: "Given an array of characters `chars`, compress it in-place using this algorithm: for each group of **consecutive repeating characters**, append the character, and if the group length is greater than 1, append the group's length (each digit as a separate char).\n\nReturn the new length `k`. The first `k` characters of `chars` must hold the compressed result. (The judge checks the first `k` characters.)",
    ex: [
      ['chars = ["a","a","b","b","c","c","c"]', '6, chars = ["a","2","b","2","c","3"]', ''],
      ['chars = ["a"]', '1, chars = ["a"]', ''],
      ['chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]', '4, chars = ["a","b","1","2"]', 'The group of 12 b\'s becomes "b12".'],
    ],
    cons: ['1 <= chars.length <= 2000', 'chars[i] is a lowercase/uppercase letter, digit, or symbol'],
    fn: { name: 'compress', params: [['char[]', 'chars']], ret: 'int' },
    call: 'java.util.Arrays.copyOf($0, s.compress($0))',
    tests: [
      { in: [['a', 'a', 'b', 'b', 'c', 'c', 'c']], out: ['a', '2', 'b', '2', 'c', '3'] },
      { in: [['a']], out: ['a'] },
      { in: [['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']], out: ['a', 'b', '1', '2'] },
      { in: [['a', 'b', 'c']], out: ['a', 'b', 'c'] },
      { in: [['z', 'z', 'z', 'y']], out: ['z', '3', 'y'] },
    ],
    hints: [
      'Process the array group by group. How do you find where a group ends?',
      'Use a read pointer to scan groups and a write pointer to write the compressed output.',
      'For each group, write the char, then if count > 1 write each digit of String.valueOf(count). The write pointer never overtakes the read pointer, so in-place is safe.',
    ],
    brute: {
      idea: 'Build the compressed form in a StringBuilder, then copy it back into the array.',
      code: J`class Solution {
    public int compress(char[] chars) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < chars.length) {
            char c = chars[i];
            int count = 0;
            while (i < chars.length && chars[i] == c) { i++; count++; }
            sb.append(c);
            if (count > 1) sb.append(count);
        }
        for (int k = 0; k < sb.length(); k++) chars[k] = sb.charAt(k);
        return sb.length();
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Read/write two pointers directly inside the array (O(1) extra space).',
      code: J`class Solution {
    public int compress(char[] chars) {
        int write = 0, read = 0;
        while (read < chars.length) {
            char c = chars[read];
            int start = read;
            while (read < chars.length && chars[read] == c) read++;
            int count = read - start;
            chars[write++] = c;
            if (count > 1) {
                for (char d : String.valueOf(count).toCharArray()) {
                    chars[write++] = d;
                }
            }
        }
        return write;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int write = 0, read = 0;', 'read scans groups; write is where the compressed output goes.'],
      ['while (read < chars.length && chars[read] == c) read++;', 'Advance read to the end of the current group.'],
      ['int count = read - start;', 'Group length.'],
      ['chars[write++] = c;', 'Always write the character itself.'],
      ['for (char d : String.valueOf(count).toCharArray())', 'Write each digit separately (12 → \'1\', \'2\').'],
      ['return write;', 'Length of the compressed prefix.'],
    ],
    cx: 'Each character is read once and written at most once → O(n). The digit string has at most 4 chars → O(1) extra space.',
    dry: ['[a,a,b,b,c,c,c]', 'group a×2 → write a,2', 'group b×2 → write b,2', 'group c×3 → write c,3 → k=6'],
    tips: ['Explain why write never passes read: a group of length L produces at most L characters.'],
    mistakes: ['Writing count as a single char: (char) count produces a control character, not "12".', 'Appending "1" for single characters.'],
    java: ['`String.valueOf(int)` converts a number to its decimal string.', '`(char) (\'0\' + d)` converts a single digit 0–9 to its character.'],
  },
  {
    id: 'rotate-string',
    title: 'Rotate String',
    difficulty: 'Easy',
    desc: "Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of **shifts** on `s`.\n\nA shift moves the leftmost character to the rightmost position. For example, if `s = \"abcde\"`, one shift gives `\"bcdea\"`.",
    ex: [
      ['s = "abcde", goal = "cdeab"', 'true', ''],
      ['s = "abcde", goal = "abced"', 'false', ''],
    ],
    cons: ['1 <= s.length, goal.length <= 100', 's and goal consist of lowercase English letters'],
    fn: { name: 'rotateString', params: [['String', 's'], ['String', 'goal']], ret: 'boolean' },
    tests: [
      { in: ['abcde', 'cdeab'], out: true },
      { in: ['abcde', 'abced'], out: false },
      { in: ['aa', 'a'], out: false },
      { in: ['a', 'a'], out: true },
      { in: ['waterbottle', 'erbottlewat'], out: true },
    ],
    hints: [
      'You could try all n rotations. Is there a neater observation?',
      'Write s twice: s + s. What substrings of length n does it contain?',
      's + s contains every rotation of s. So goal is a rotation iff lengths are equal and (s + s).contains(goal).',
    ],
    brute: {
      idea: 'Generate each rotation explicitly and compare with goal.',
      code: J`class Solution {
    public boolean rotateString(String s, String goal) {
        if (s.length() != goal.length()) return false;
        for (int k = 0; k < s.length(); k++) {
            String rotated = s.substring(k) + s.substring(0, k);
            if (rotated.equals(goal)) return true;
        }
        return false;
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Concatenation trick: every rotation of s appears inside s + s.',
      code: J`class Solution {
    public boolean rotateString(String s, String goal) {
        return s.length() == goal.length() && (s + s).contains(goal);
    }
}`,
      time: 'O(n^2) worst case with contains(); O(n) with KMP', space: 'O(n)',
    },
    lines: [
      ['s.length() == goal.length()', 'A rotation never changes the length; this also stops "aa" vs "a" from matching.'],
      ['(s + s).contains(goal)', '"abcdeabcde" contains "cdeab" — every rotation is a window of length n in the doubled string.'],
    ],
    cx: 'String.contains is a naive search: O(n·m) worst case, which is O(n^2) here. Using KMP on (s+s, goal) gives guaranteed O(n). Space O(n) for the doubled string.',
    dry: ['s="abcde", s+s="abcdeabcde"', 'search "cdeab" → found at index 2 → true'],
    tips: ['Mention KMP or Z-algorithm for a guaranteed linear-time substring check.', 'This trick also checks whether a string is a rotation of another in O(1) code.'],
    mistakes: ['Forgetting the length check.'],
    java: ['`String.contains(CharSequence)` delegates to `indexOf`.', '`+` on Strings creates a new String; inside a loop use StringBuilder.'],
  },
  {
    id: 'first-unique-character',
    title: 'First Unique Character in a String',
    difficulty: 'Easy',
    desc: "Given a string `s`, find the **first non-repeating character** in it and return its index. If it does not exist, return `-1`.",
    ex: [
      ['s = "leetcode"', '0', "'l' occurs once and is first."],
      ['s = "loveleetcode"', '2', "'v' is the first unique character."],
      ['s = "aabb"', '-1', ''],
    ],
    cons: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters'],
    fn: { name: 'firstUniqChar', params: [['String', 's']], ret: 'int' },
    tests: [
      { in: ['leetcode'], out: 0 },
      { in: ['loveleetcode'], out: 2 },
      { in: ['aabb'], out: -1 },
      { in: ['z'], out: 0 },
      { in: ['aadadaad'], out: -1 },
      { in: ['dddccdbba'], out: 8 },
    ],
    hints: [
      'You need to know how many times each character appears.',
      'Count all frequencies first in one pass.',
      'Second pass over the string in order: return the first index whose character has count 1.',
    ],
    brute: {
      idea: 'For every character, scan the whole string to see if it appears elsewhere.',
      code: J`class Solution {
    public int firstUniqChar(String s) {
        for (int i = 0; i < s.length(); i++) {
            boolean unique = true;
            for (int j = 0; j < s.length(); j++) {
                if (i != j && s.charAt(i) == s.charAt(j)) { unique = false; break; }
            }
            if (unique) return i;
        }
        return -1;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Two passes with an int[26] frequency table.',
      code: J`class Solution {
    public int firstUniqChar(String s) {
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int[] freq = new int[26];', 'Frequency table for lowercase letters.'],
      ["freq[s.charAt(i) - 'a']++;", 'First pass: count every character.'],
      ["if (freq[s.charAt(i) - 'a'] == 1) return i;", 'Second pass in original order: the first character with count 1 is the answer.'],
    ],
    cx: 'Two linear passes → O(n). Fixed 26-size table → O(1) space.',
    dry: ['"loveleetcode" counts: l2 o2 v1 e4 t1 c1 d1', 'index0 l(2) ✗, index1 o(2) ✗, index2 v(1) ✓ → 2'],
    tips: ['For a stream of characters, use a LinkedHashMap or a Queue to keep candidates in order.'],
    mistakes: ['Iterating over the frequency array (alphabet order) instead of the string (input order) in the second pass.'],
    java: ['A `LinkedHashMap<Character, Integer>` keeps insertion order if the alphabet is large.'],
  },
  {
    id: 'string-to-integer-atoi',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    desc: "Implement `myAtoi(String s)`, which converts a string to a 32-bit signed integer:\n\n1. Ignore any leading whitespace (`' '`).\n2. Check for an optional sign `'-'` or `'+'`.\n3. Read digits until a non-digit character or the end of the string. Leading zeros are fine.\n4. If no digits were read, the result is `0`.\n5. Clamp the result to the 32-bit signed range `[-2^31, 2^31 - 1]`.\n\nReturn the integer.",
    ex: [
      ['s = "42"', '42', ''],
      ['s = "   -042"', '-42', 'Leading spaces ignored, sign read, leading zero ignored.'],
      ['s = "1337c0d3"', '1337', 'Reading stops at the first non-digit.'],
      ['s = "-91283472332"', '-2147483648', 'Clamped to Integer.MIN_VALUE.'],
    ],
    cons: ['0 <= s.length <= 200', 's consists of English letters, digits, \' \', \'+\', \'-\', and \'.\''],
    fn: { name: 'myAtoi', params: [['String', 's']], ret: 'int' },
    tests: [
      { in: ['42'], out: 42 },
      { in: ['   -042'], out: -42 },
      { in: ['1337c0d3'], out: 1337 },
      { in: ['0-1'], out: 0 },
      { in: ['words and 987'], out: 0 },
      { in: ['-91283472332'], out: -2147483648 },
      { in: ['2147483648'], out: 2147483647 },
      { in: ['+-12'], out: 0 },
      { in: [''], out: 0 },
    ],
    hints: [
      'Process the string left to right in clear phases: spaces, sign, digits.',
      'Build the number as result = result * 10 + digit.',
      'Before multiplying, check overflow: if result > (MAX - digit) / 10, clamp immediately to MAX or MIN depending on sign.',
    ],
    brute: {
      idea: 'Parse phases and accumulate into a long, clamping as soon as the value leaves the int range.',
      code: J`class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            sign = s.charAt(i) == '-' ? -1 : 1;
            i++;
        }
        long result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            result = result * 10 + (s.charAt(i) - '0');
            if (sign * result > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (sign * result < Integer.MIN_VALUE) return Integer.MIN_VALUE;
            i++;
        }
        return (int) (sign * result);
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Same phases, but detect overflow with pure int arithmetic before it happens (what interviewers usually want).',
      code: J`class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            if (s.charAt(i) == '-') sign = -1;
            i++;
        }
        int result = 0;
        while (i < n && s.charAt(i) >= '0' && s.charAt(i) <= '9') {
            int digit = s.charAt(i) - '0';
            if (result > (Integer.MAX_VALUE - digit) / 10) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            result = result * 10 + digit;
            i++;
        }
        return sign * result;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ["while (i < n && s.charAt(i) == ' ') i++;", 'Phase 1: skip leading spaces.'],
      ["if (... '+' || '-') { ... i++; }", 'Phase 2: at most one sign character.'],
      ["while (i < n && s.charAt(i) >= '0' && s.charAt(i) <= '9')", 'Phase 3: read digits only; stop at anything else.'],
      ['if (result > (Integer.MAX_VALUE - digit) / 10)', 'Rearranged form of result * 10 + digit > MAX that can never overflow itself.'],
      ['return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;', 'Clamp. For negatives, -2147483648 is exactly MIN_VALUE, so clamping to MIN is correct even at the boundary.'],
      ['return sign * result;', 'Apply the sign at the end.'],
    ],
    cx: 'Single pass over the string → O(n), constant variables → O(1).',
    dry: ['"   -042"', 'skip 3 spaces → i=3', "'-' → sign=-1, i=4", "'0' → result 0, '4' → 4, '2' → 42", 'end → -42'],
    tips: ['Ask clarifying questions about each edge case — interviewers grade this problem on edge-case handling.', 'Mention that Integer.parseInt throws NumberFormatException instead of clamping.'],
    mistakes: ['Checking overflow after multiplication (the int already overflowed).', 'Accepting multiple signs like "+-12".', 'Skipping whitespace in the middle of the number.'],
    java: ['`Integer.MAX_VALUE = 2147483647`, `Integer.MIN_VALUE = -2147483648`; |MIN| > MAX.', '`Character.isDigit` also accepts non-ASCII digits; comparing with \'0\'..\'9\' is stricter.'],
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    desc: "Given a string `s`, return the **longest palindromic substring** in `s`. If there are several of the same maximum length, return the one that appears **first**.",
    ex: [
      ['s = "babad"', '"bab"', '"aba" is also valid in general, but "bab" appears first.'],
      ['s = "cbbd"', '"bb"', ''],
    ],
    cons: ['1 <= s.length <= 1000', 's consists of digits and English letters'],
    fn: { name: 'longestPalindrome', params: [['String', 's']], ret: 'String' },
    tests: [
      { in: ['babad'], out: 'bab' },
      { in: ['cbbd'], out: 'bb' },
      { in: ['a'], out: 'a' },
      { in: ['ac'], out: 'a' },
      { in: ['forgeeksskeegfor'], out: 'geeksskeeg' },
      { in: ['abacdfgdcaba'], out: 'aba' },
    ],
    hints: [
      'A palindrome mirrors around its center. How many possible centers does a string have?',
      'There are 2n - 1 centers: each character (odd length) and each gap between characters (even length).',
      'Expand around each center while s[l] == s[r]; track the longest window. O(n^2) time, O(1) space.',
    ],
    brute: {
      idea: 'Check every substring and test whether it is a palindrome.',
      code: J`class Solution {
    public String longestPalindrome(String s) {
        String best = "";
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                if (j - i + 1 > best.length() && isPal(s, i, j)) {
                    best = s.substring(i, j + 1);
                }
            }
        }
        return best;
    }

    private boolean isPal(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }
}`,
      time: 'O(n^3)', space: 'O(1)',
    },
    optimal: {
      idea: 'Expand around center: for each of the 2n - 1 centers, grow outwards while the characters match.',
      code: J`class Solution {
    private int start = 0, maxLen = 0;

    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(start, start + maxLen);
    }

    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        int len = r - l - 1;
        if (len > maxLen) {
            maxLen = len;
            start = l + 1;
        }
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    lines: [
      ['private int start = 0, maxLen = 0;', 'Best palindrome found so far, stored as fields to avoid returning pairs.'],
      ['expand(s, i, i);', 'Odd-length palindromes centered on character i.'],
      ['expand(s, i, i + 1);', 'Even-length palindromes centered between i and i + 1.'],
      ['while (l >= 0 && r < n && s.charAt(l) == s.charAt(r))', 'Grow while still inside the string and still mirrored.'],
      ['int len = r - l - 1;', 'The loop stopped one step too far on both sides, so the palindrome is (l, r) exclusive.'],
      ['if (len > maxLen)', 'Strictly greater keeps the first (leftmost) palindrome on ties.'],
    ],
    cx: '2n - 1 centers, each expansion is O(n) in the worst case → O(n^2). Only a few ints → O(1). Manacher\'s algorithm achieves O(n) but is rarely expected.',
    dry: ['s="cbbd"', 'i=0: odd "c" len1 → best "c"', 'i=1: odd "b"; even (1,2) "bb" len2 → best "bb"', 'i=2: odd "b"; even (2,3) b≠d', 'answer "bb"'],
    tips: ['DP alternative: dp[i][j] = s[i]==s[j] && dp[i+1][j-1] — O(n^2) time AND space; expand-around-center is better.', 'Related: Palindromic Substrings (count them) uses the same expansion.'],
    mistakes: ['Forgetting even-length centers (fails "cbbd").', 'Computing len as r - l + 1 after the loop (off by two).'],
    java: ['Instance fields are a clean way to share state between helper methods. Reset them if the object is reused.'],
  },
  {
    id: 'find-index-first-occurrence',
    title: 'Find the Index of the First Occurrence (strStr)',
    difficulty: 'Easy',
    desc: "Given two strings `haystack` and `needle`, return the index of the **first occurrence** of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.\n\nDo not use built-in methods such as `indexOf` in your final solution — interviewers want to see the algorithm.",
    ex: [
      ['haystack = "sadbutsad", needle = "sad"', '0', '"sad" occurs at index 0 and 6; the first is 0.'],
      ['haystack = "leetcode", needle = "leeto"', '-1', ''],
    ],
    cons: ['1 <= haystack.length, needle.length <= 10^4', 'Both consist of only lowercase English characters'],
    fn: { name: 'strStr', params: [['String', 'haystack'], ['String', 'needle']], ret: 'int' },
    tests: [
      { in: ['sadbutsad', 'sad'], out: 0 },
      { in: ['leetcode', 'leeto'], out: -1 },
      { in: ['hello', 'll'], out: 2 },
      { in: ['aaaaab', 'aab'], out: 3 },
      { in: ['abc', 'abcd'], out: -1 },
      { in: ['mississippi', 'issip'], out: 4 },
    ],
    hints: [
      'Try every starting position in the haystack.',
      'At each start, compare characters until a mismatch. This is O(n·m).',
      'KMP avoids re-checking characters: precompute the LPS (longest proper prefix that is also a suffix) array for needle, then scan haystack once.',
    ],
    brute: {
      idea: 'Sliding comparison at every start index.',
      code: J`class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        for (int i = 0; i + m <= n; i++) {
            int j = 0;
            while (j < m && haystack.charAt(i + j) == needle.charAt(j)) j++;
            if (j == m) return i;
        }
        return -1;
    }
}`,
      time: 'O(n·m)', space: 'O(1)',
    },
    optimal: {
      idea: 'Knuth–Morris–Pratt: on a mismatch, jump within the needle using the LPS table instead of restarting.',
      code: J`class Solution {
    public int strStr(String haystack, String needle) {
        int m = needle.length();
        int[] lps = new int[m];
        for (int i = 1, len = 0; i < m; ) {
            if (needle.charAt(i) == needle.charAt(len)) {
                lps[i++] = ++len;
            } else if (len > 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
        for (int i = 0, j = 0; i < haystack.length(); ) {
            if (haystack.charAt(i) == needle.charAt(j)) {
                i++;
                j++;
                if (j == m) return i - m;
            } else if (j > 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
        return -1;
    }
}`,
      time: 'O(n + m)', space: 'O(m)',
    },
    lines: [
      ['int[] lps = new int[m];', 'lps[i] = length of the longest proper prefix of needle[0..i] that is also a suffix of it.'],
      ['if (needle.charAt(i) == needle.charAt(len)) lps[i++] = ++len;', 'The current prefix-suffix match extends by one.'],
      ['else if (len > 0) len = lps[len - 1];', 'Fall back to the next shorter border and retry — do not advance i.'],
      ['if (haystack.charAt(i) == needle.charAt(j)) { i++; j++; }', 'Characters match; advance both.'],
      ['if (j == m) return i - m;', 'Whole needle matched; it started m characters back.'],
      ['else if (j > 0) j = lps[j - 1];', 'Mismatch: reuse the matched prefix instead of restarting from scratch. i never moves backwards.'],
    ],
    cx: 'Building LPS is O(m) and the scan is O(n) because i only moves forward and j decreases at most as much as it increased → O(n + m). LPS array is O(m).',
    dry: ['needle="aab" → lps=[0,1,0]', 'haystack="aaaaab": match a,a; mismatch at b vs a → j=lps[1]=1, keep i', 'continue... matches "aab" ending at i=6 → return 6-3=3'],
    tips: ['Start with the brute force, then mention KMP and Rabin–Karp (rolling hash) as optimisations.', 'Java\'s String.indexOf uses a naive search in many JDK versions, but it is highly optimised.'],
    mistakes: ['Looping i < n instead of i + m <= n in the brute force → index errors.', 'Advancing i on fallback in KMP.'],
    java: ['A for loop with an empty update clause `for (int i = 1, len = 0; i < m; )` lets you control increments manually.'],
  },
  {
    id: 'roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    desc: "Roman numerals use seven symbols: `I=1, V=5, X=10, L=50, C=100, D=500, M=1000`. Normally symbols are written largest to smallest from left to right, but subtraction is used in six cases: `IV=4, IX=9, XL=40, XC=90, CD=400, CM=900`.\n\nGiven a valid roman numeral `s`, convert it to an integer.",
    ex: [
      ['s = "III"', '3', ''],
      ['s = "LVIII"', '58', 'L = 50, V = 5, III = 3.'],
      ['s = "MCMXCIV"', '1994', 'M = 1000, CM = 900, XC = 90 and IV = 4.'],
    ],
    cons: ['1 <= s.length <= 15', 's is a valid roman numeral in the range [1, 3999]'],
    fn: { name: 'romanToInt', params: [['String', 's']], ret: 'int' },
    tests: [
      { in: ['III'], out: 3 },
      { in: ['LVIII'], out: 58 },
      { in: ['MCMXCIV'], out: 1994 },
      { in: ['IV'], out: 4 },
      { in: ['MMMCMXCIX'], out: 3999 },
      { in: ['XLII'], out: 42 },
    ],
    hints: [
      'Map each symbol to its value.',
      'When is a symbol subtracted instead of added?',
      'If a symbol\'s value is less than the value of the next symbol, subtract it; otherwise add it.',
    ],
    brute: {
      idea: 'Check for the six two-character subtractive pairs explicitly first, then single symbols.',
      code: J`import java.util.*;

class Solution {
    public int romanToInt(String s) {
        Map<String, Integer> map = new HashMap<>();
        String[] keys = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
        int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
        for (int k = 0; k < keys.length; k++) map.put(keys[k], vals[k]);
        int total = 0, i = 0;
        while (i < s.length()) {
            if (i + 1 < s.length() && map.containsKey(s.substring(i, i + 2))) {
                total += map.get(s.substring(i, i + 2));
                i += 2;
            } else {
                total += map.get(s.substring(i, i + 1));
                i++;
            }
        }
        return total;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Single pass comparing each value with the next one; subtract when smaller.',
      code: J`class Solution {
    public int romanToInt(String s) {
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = value(s.charAt(i));
            int next = i + 1 < s.length() ? value(s.charAt(i + 1)) : 0;
            if (cur < next) total -= cur;
            else total += cur;
        }
        return total;
    }

    private int value(char c) {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return 0;
        }
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['int cur = value(s.charAt(i));', 'Value of the current symbol.'],
      ['int next = i + 1 < n ? value(s.charAt(i + 1)) : 0;', 'Look ahead one symbol (0 at the end).'],
      ['if (cur < next) total -= cur;', 'Subtractive notation: the I in IV contributes -1.'],
      ['else total += cur;', 'Normal additive symbol.'],
      ['switch (c) { case \'I\': return 1; ... }', 'A switch on char is faster than a HashMap lookup and has no boxing.'],
    ],
    cx: 'One pass → O(n). n ≤ 15, so effectively O(1). No extra data structures.',
    dry: ['MCMXCIV', 'M(1000) next C → +1000', 'C(100) < M → -100', 'M → +1000 (1900)', 'X < C → -10, C → +100 (1990)', 'I < V → -1, V → +5 → 1994'],
    tips: ['Pair this with Integer to Roman — interviewers often ask both.'],
    mistakes: ['Subtracting when cur <= next ("II" would become 0).'],
    java: ['Classic switch with `return` in each case needs no `break`. Java 14+ also offers `case \'I\' -> 1;` switch expressions.'],
  },
  {
    id: 'integer-to-roman',
    title: 'Integer to Roman',
    difficulty: 'Medium',
    desc: "Given an integer `num` (1 to 3999), convert it to a **roman numeral**. Use the standard symbols `I, V, X, L, C, D, M` and the six subtractive forms `IV, IX, XL, XC, CD, CM`.",
    ex: [
      ['num = 3749', '"MMMDCCXLIX"', '3000 = MMM, 700 = DCC, 40 = XL, 9 = IX.'],
      ['num = 58', '"LVIII"', ''],
      ['num = 1994', '"MCMXCIV"', ''],
    ],
    cons: ['1 <= num <= 3999'],
    fn: { name: 'intToRoman', params: [['int', 'num']], ret: 'String' },
    tests: [
      { in: [3749], out: 'MMMDCCXLIX' },
      { in: [58], out: 'LVIII' },
      { in: [1994], out: 'MCMXCIV' },
      { in: [4], out: 'IV' },
      { in: [3999], out: 'MMMCMXCIX' },
      { in: [1], out: 'I' },
    ],
    hints: [
      'Greedy works: always use the largest symbol that still fits.',
      'Include the six subtractive forms in your symbol list so greedy handles them automatically.',
      'Iterate over values [1000, 900, 500, 400, ..., 1]; while num >= value, append the symbol and subtract.',
    ],
    brute: {
      idea: 'Digit-by-digit lookup tables for thousands, hundreds, tens and ones.',
      code: J`class Solution {
    public String intToRoman(int num) {
        String[] thousands = {"", "M", "MM", "MMM"};
        String[] hundreds = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        String[] tens = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        String[] ones = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        return thousands[num / 1000] + hundreds[(num % 1000) / 100]
                + tens[(num % 100) / 10] + ones[num % 10];
    }
}`,
      time: 'O(1)', space: 'O(1)',
    },
    optimal: {
      idea: 'Greedy over the 13 value/symbol pairs in descending order.',
      code: J`class Solution {
    public String intToRoman(int num) {
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < values.length && num > 0; i++) {
            while (num >= values[i]) {
                sb.append(symbols[i]);
                num -= values[i];
            }
        }
        return sb.toString();
    }
}`,
      time: 'O(1) (bounded by 3999)', space: 'O(1)',
    },
    lines: [
      ['int[] values = {1000, 900, ...};', 'Parallel arrays: values[i] corresponds to symbols[i], sorted descending, including subtractive pairs.'],
      ['while (num >= values[i])', 'Use the current symbol as many times as it fits (greedy).'],
      ['sb.append(symbols[i]); num -= values[i];', 'Emit the symbol and reduce the remaining number.'],
    ],
    cx: 'The output length is bounded (max 15 characters) and there are 13 symbols → O(1) time and space.',
    dry: ['num=1994', '1000 → M (994)', '900 → CM (94)', '90 → XC (4)', '4 → IV (0) → MCMXCIV'],
    tips: ['Explain why greedy is correct here: the symbol system is canonical, so the largest fit never blocks a valid representation.'],
    mistakes: ['Forgetting the subtractive pairs and producing "IIII" for 4.'],
    java: ['Parallel arrays are fine for fixed tables; an enum is a more object-oriented alternative.'],
  },
  {
    id: 'count-and-say',
    title: 'Count and Say',
    difficulty: 'Medium',
    desc: "The **count-and-say** sequence is defined recursively:\n\n- `countAndSay(1) = \"1\"`\n- `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`: read off the digits, saying the count of each group of identical digits followed by the digit.\n\nFor example, `\"3322251\"` is read as two 3s, three 2s, one 5, one 1 → `\"23321511\"`. Given `n`, return the `n`-th term.",
    ex: [
      ['n = 1', '"1"', ''],
      ['n = 4', '"1211"', '1 → "11" (one 1) → "21" (two 1s) → "1211" (one 2, one 1).'],
    ],
    cons: ['1 <= n <= 30'],
    fn: { name: 'countAndSay', params: [['int', 'n']], ret: 'String' },
    tests: [
      { in: [1], out: '1' },
      { in: [4], out: '1211' },
      { in: [5], out: '111221' },
      { in: [6], out: '312211' },
      { in: [8], out: '1113213211' },
    ],
    hints: [
      'Start from "1" and build each term from the previous one.',
      'Reading a term means grouping consecutive equal digits.',
      'For each group, append count then digit to a StringBuilder. Repeat n - 1 times.',
    ],
    brute: {
      idea: 'Direct recursion: compute term n - 1 recursively, then encode it.',
      code: J`class Solution {
    public String countAndSay(int n) {
        if (n == 1) return "1";
        String prev = countAndSay(n - 1);
        String result = "";
        int i = 0;
        while (i < prev.length()) {
            int j = i;
            while (j < prev.length() && prev.charAt(j) == prev.charAt(i)) j++;
            result += (j - i) + "" + prev.charAt(i);
            i = j;
        }
        return result;
    }
}`,
      time: 'O(L^2) per term due to String +=', space: 'O(n + L)',
    },
    optimal: {
      idea: 'Iterative build with StringBuilder for efficient appends.',
      code: J`class Solution {
    public String countAndSay(int n) {
        String cur = "1";
        for (int k = 2; k <= n; k++) {
            StringBuilder sb = new StringBuilder();
            int i = 0;
            while (i < cur.length()) {
                char d = cur.charAt(i);
                int j = i;
                while (j < cur.length() && cur.charAt(j) == d) j++;
                sb.append(j - i).append(d);
                i = j;
            }
            cur = sb.toString();
        }
        return cur;
    }
}`,
      time: 'O(total length of all terms)', space: 'O(L) for the current term',
    },
    lines: [
      ['String cur = "1";', 'Term 1.'],
      ['for (int k = 2; k <= n; k++)', 'Build terms 2..n one at a time.'],
      ['while (j < cur.length() && cur.charAt(j) == d) j++;', 'Find the end of the current group of equal digits.'],
      ['sb.append(j - i).append(d);', 'Append count, then digit. append returns the builder, enabling chaining.'],
      ['i = j;', 'Jump to the next group.'],
    ],
    cx: 'Each term is processed in time linear to its length; the terms grow roughly by 30% each step (Conway\'s constant ≈ 1.30). Total work is linear in the sum of term lengths.',
    dry: ['"1" → one 1 → "11"', '"11" → two 1s → "21"', '"21" → one 2, one 1 → "1211"', '"1211" → one 1, one 2, two 1s → "111221"'],
    tips: ['This is really a run-length encoding exercise — say so.'],
    mistakes: ['Using String += in a loop — quadratic copying.'],
    java: ['`StringBuilder.append(int)` appends the decimal representation.', 'Method chaining works because `append` returns `this`.'],
  },
  {
    id: 'add-binary',
    title: 'Add Binary',
    difficulty: 'Easy',
    desc: "Given two binary strings `a` and `b`, return their **sum** as a binary string.",
    ex: [
      ['a = "11", b = "1"', '"100"', ''],
      ['a = "1010", b = "1011"', '"10101"', ''],
    ],
    cons: ['1 <= a.length, b.length <= 10^4', 'a and b consist only of \'0\' or \'1\'', 'No leading zeros except for "0" itself'],
    fn: { name: 'addBinary', params: [['String', 'a'], ['String', 'b']], ret: 'String' },
    tests: [
      { in: ['11', '1'], out: '100' },
      { in: ['1010', '1011'], out: '10101' },
      { in: ['0', '0'], out: '0' },
      { in: ['1111', '1111'], out: '11110' },
      { in: ['1', '111'], out: '1000' },
      { in: ['110010101011010101010101011101011010101010101', '1'], out: '110010101011010101010101011101011010101010110' },
    ],
    hints: [
      'Do it like grade-school addition, but in base 2.',
      'Start from the rightmost digits and keep a carry.',
      'sum = bitA + bitB + carry; append sum % 2; carry = sum / 2. Continue while either string has digits or carry > 0, then reverse.',
    ],
    brute: {
      idea: 'Convert both to BigInteger, add, convert back. (Integer.parseInt would overflow for long strings.)',
      code: J`import java.math.BigInteger;

class Solution {
    public String addBinary(String a, String b) {
        BigInteger x = new BigInteger(a, 2);
        BigInteger y = new BigInteger(b, 2);
        return x.add(y).toString(2);
    }
}`,
      time: 'O(n + m)', space: 'O(n + m)',
    },
    optimal: {
      idea: 'Digit-by-digit addition from the right with a carry.',
      code: J`class Solution {
    public String addBinary(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            sb.append(sum % 2);
            carry = sum / 2;
        }
        return sb.reverse().toString();
    }
}`,
      time: 'O(max(n, m))', space: 'O(max(n, m))',
    },
    lines: [
      ['int i = a.length() - 1, j = b.length() - 1, carry = 0;', 'Pointers to the least significant digits.'],
      ['while (i >= 0 || j >= 0 || carry > 0)', 'Keep going while there are digits or a leftover carry (e.g. 1 + 1 = 10).'],
      ["if (i >= 0) sum += a.charAt(i--) - '0';", 'Add digit from a if any remain.'],
      ['sb.append(sum % 2); carry = sum / 2;', 'sum is 0..3: bit = sum % 2, carry = sum / 2.'],
      ['return sb.reverse().toString();', 'Digits were produced least-significant first.'],
    ],
    cx: 'Each digit processed once → O(max(n, m)); the builder holds max(n, m) + 1 digits.',
    dry: ['a="11", b="1"', '1+1=2 → bit0 carry1', '1+0+1=2 → bit0 carry1', 'carry → bit1', 'reverse "001" → "100"'],
    tips: ['Same template solves Add Strings (base 10) and Add Two Numbers (linked lists).'],
    mistakes: ['Integer.parseInt(a, 2) overflows for strings longer than 31 bits.', 'Forgetting the final carry.'],
    java: ['`BigInteger` handles arbitrary-precision integers: `new BigInteger(str, radix)` and `toString(radix)`.'],
  },
  {
    id: 'multiply-strings',
    title: 'Multiply Strings',
    difficulty: 'Medium',
    desc: "Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.\n\nYou must not use any built-in BigInteger library or convert the inputs to integers directly.",
    ex: [
      ['num1 = "2", num2 = "3"', '"6"', ''],
      ['num1 = "123", num2 = "456"', '"56088"', ''],
    ],
    cons: ['1 <= num1.length, num2.length <= 200', 'Digits only, no leading zeros except "0"'],
    fn: { name: 'multiply', params: [['String', 'num1'], ['String', 'num2']], ret: 'String' },
    tests: [
      { in: ['2', '3'], out: '6' },
      { in: ['123', '456'], out: '56088' },
      { in: ['0', '52'], out: '0' },
      { in: ['999', '999'], out: '998001' },
      { in: ['123456789', '987654321'], out: '121932631112635269' },
    ],
    hints: [
      'Think about long multiplication on paper.',
      'The product of digits at positions i and j (from the left) lands in positions i + j and i + j + 1 of the result.',
      'Use an int[n + m] array. For i, j from the right: mul = d1 * d2 + pos[i+j+1]; pos[i+j+1] = mul % 10; pos[i+j] += mul / 10. Skip leading zeros when building the string.',
    ],
    brute: {
      idea: 'School method: multiply num1 by each digit of num2 (shifted), then add the partial results as strings.',
      code: J`class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";
        String result = "0";
        for (int j = num2.length() - 1, shift = 0; j >= 0; j--, shift++) {
            int d = num2.charAt(j) - '0';
            StringBuilder partial = new StringBuilder();
            for (int k = 0; k < shift; k++) partial.append('0');
            int carry = 0;
            for (int i = num1.length() - 1; i >= 0; i--) {
                int p = (num1.charAt(i) - '0') * d + carry;
                partial.append(p % 10);
                carry = p / 10;
            }
            if (carry > 0) partial.append(carry);
            result = add(result, partial.reverse().toString());
        }
        return result;
    }

    private String add(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int s = carry;
            if (i >= 0) s += a.charAt(i--) - '0';
            if (j >= 0) s += b.charAt(j--) - '0';
            sb.append(s % 10);
            carry = s / 10;
        }
        return sb.reverse().toString();
    }
}`,
      time: 'O(m·(n + m))', space: 'O(n + m)',
    },
    optimal: {
      idea: 'Position array: accumulate each digit product directly into its final place, handling carries as we go.',
      code: J`class Solution {
    public String multiply(String num1, String num2) {
        int n = num1.length(), m = num2.length();
        int[] pos = new int[n + m];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
                int sum = mul + pos[i + j + 1];
                pos[i + j + 1] = sum % 10;
                pos[i + j] += sum / 10;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int p : pos) {
            if (!(sb.length() == 0 && p == 0)) sb.append(p);
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }
}`,
      time: 'O(n·m)', space: 'O(n + m)',
    },
    lines: [
      ['int[] pos = new int[n + m];', 'A product of an n-digit and m-digit number has at most n + m digits.'],
      ['int mul = (num1.charAt(i) - \'0\') * (num2.charAt(j) - \'0\');', 'Multiply single digits (0..81).'],
      ['int sum = mul + pos[i + j + 1];', 'Add what is already accumulated in the lower position.'],
      ['pos[i + j + 1] = sum % 10; pos[i + j] += sum / 10;', 'Keep one digit, push the carry to the next higher position.'],
      ['if (!(sb.length() == 0 && p == 0)) sb.append(p);', 'Skip leading zeros.'],
      ['return sb.length() == 0 ? "0" : sb.toString();', 'If everything was zero, the product is "0".'],
    ],
    cx: 'Every digit pair is multiplied once → O(n·m). The position array has n + m entries.',
    dry: ['"12" × "34"', 'i=1,j=1: 2*4=8 → pos[3]=8', 'i=1,j=0: 2*3=6 → pos[2]=6', 'i=0,j=1: 1*4=4 + pos[2]=6 → 10 → pos[2]=0, pos[1]+=1', 'i=0,j=0: 1*3=3 + pos[1]=1 → 4 → pos[1]=4', 'pos=[0,4,0,8] → "408"'],
    tips: ['Explain the i + j / i + j + 1 index mapping with a small example — it is the crux.', 'Karatsuba is the advanced follow-up (O(n^1.585)).'],
    mistakes: ['Forgetting to strip leading zeros (returning "0408").', 'Converting to long — overflows for 200-digit inputs.'],
    java: ['`pos[i + j] += sum / 10` may temporarily exceed 9; the next iteration normalises it.'],
  },
];
