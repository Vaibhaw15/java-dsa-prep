const J = String.raw;

export default [
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    desc: "Given the `head` of a singly linked list, reverse the list, and return the **reversed list**.",
    ex: [
      ['head = [1,2,3,4,5]', '[5,4,3,2,1]', ''],
      ['head = [1,2]', '[2,1]', ''],
      ['head = []', '[]', ''],
    ],
    cons: ['0 <= number of nodes <= 5000', '-5000 <= Node.val <= 5000'],
    fn: { name: 'reverseList', params: [['ListNode', 'head']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 3, 4, 5]], out: [1, 2, 3, 4, 5].reverse() },
      { in: [[1, 2]], out: [2, 1] },
      { in: [[]], out: [] },
      { in: [[7]], out: [7] },
      { in: [[3, 3, 1]], out: [1, 3, 3] },
    ],
    hints: [
      'You need to flip every next pointer. What must you remember before flipping?',
      'Keep three references: prev, curr and next.',
      'Iteratively: next = curr.next; curr.next = prev; prev = curr; curr = next. Return prev.',
    ],
    brute: {
      idea: 'Push all values onto a stack and rebuild a new list by popping (uses O(n) extra memory).',
      code: J`import java.util.*;

class Solution {
    public ListNode reverseList(ListNode head) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (ListNode p = head; p != null; p = p.next) stack.push(p.val);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!stack.isEmpty()) {
            tail.next = new ListNode(stack.pop());
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Iterative in-place pointer reversal.',
      code: J`class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['ListNode prev = null, curr = head;', 'prev is the already-reversed part (initially empty).'],
      ['ListNode next = curr.next;', 'Save the rest of the list before breaking the link.'],
      ['curr.next = prev;', 'Flip the pointer.'],
      ['prev = curr; curr = next;', 'Advance both pointers.'],
      ['return prev;', 'When curr is null, prev is the new head.'],
    ],
    cx: 'Each node visited once → O(n); three pointers → O(1). The recursive version is also O(n) but uses O(n) stack.',
    dry: ['1→2→3', 'curr1: 1→null, prev=1', 'curr2: 2→1, prev=2', 'curr3: 3→2, prev=3 → 3→2→1'],
    tips: ['Be ready to write the recursive version: newHead = reverse(head.next); head.next.next = head; head.next = null.', 'Variants: Reverse Linked List II (sublist), Reverse Nodes in k-Group.'],
    mistakes: ['Losing the rest of the list by not saving next first.', 'Returning curr (null) instead of prev.'],
    java: ['`ArrayDeque` is preferred over the legacy `Stack` class for stack operations (`push`/`pop`).', 'Java has no pointers but object references behave the same way here.'],
  },
  {
    id: 'middle-of-linked-list',
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    desc: "Given the `head` of a singly linked list, return the **middle node** of the linked list. If there are two middle nodes, return the **second** middle node. (The judge prints the list starting from the returned node.)",
    ex: [
      ['head = [1,2,3,4,5]', '[3,4,5]', 'The middle node is 3.'],
      ['head = [1,2,3,4,5,6]', '[4,5,6]', 'Two middles (3 and 4); return the second one.'],
    ],
    cons: ['1 <= number of nodes <= 100', '1 <= Node.val <= 100'],
    fn: { name: 'middleNode', params: [['ListNode', 'head']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 3, 4, 5]], out: [3, 4, 5] },
      { in: [[1, 2, 3, 4, 5, 6]], out: [4, 5, 6] },
      { in: [[1]], out: [1] },
      { in: [[1, 2]], out: [2] },
    ],
    hints: [
      'Counting the length first, then walking n/2 steps, takes two passes.',
      'What if one pointer moves twice as fast as another?',
      'slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle.',
    ],
    brute: {
      idea: 'Two passes: count nodes, then walk count/2 steps.',
      code: J`class Solution {
    public ListNode middleNode(ListNode head) {
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        ListNode cur = head;
        for (int i = 0; i < n / 2; i++) cur = cur.next;
        return cur;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    optimal: {
      idea: 'Slow and fast pointers in one pass.',
      code: J`class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['ListNode slow = head, fast = head;', 'Both start at the head.'],
      ['while (fast != null && fast.next != null)', 'fast can take two steps safely.'],
      ['slow = slow.next; fast = fast.next.next;', 'slow covers half the distance of fast.'],
      ['return slow;', 'For even lengths this lands on the second middle.'],
    ],
    cx: 'n/2 iterations → O(n); O(1) space.',
    dry: ['[1..6]', 's1 f1 → s2 f3 → s3 f5 → s4 f=null → return 4'],
    tips: ['To get the FIRST middle for even length, use while (fast.next != null && fast.next.next != null).', 'This is the first step of Palindrome Linked List, Reorder List and merge sort on lists.'],
    mistakes: ['Checking only fast.next != null → NullPointerException when fast becomes null.'],
    java: ['`&&` short-circuits, so `fast.next` is never read when `fast` is null.'],
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    desc: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one **sorted** list by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    ex: [
      ['list1 = [1,2,4], list2 = [1,3,4]', '[1,1,2,3,4,4]', ''],
      ['list1 = [], list2 = []', '[]', ''],
      ['list1 = [], list2 = [0]', '[0]', ''],
    ],
    cons: ['0 <= number of nodes in each list <= 50', '-100 <= Node.val <= 100', 'Both lists are sorted in non-decreasing order'],
    fn: { name: 'mergeTwoLists', params: [['ListNode', 'list1'], ['ListNode', 'list2']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 4], [1, 3, 4]], out: [1, 1, 2, 3, 4, 4] },
      { in: [[], []], out: [] },
      { in: [[], [0]], out: [0] },
      { in: [[5], [1, 2, 3]], out: [1, 2, 3, 5] },
      { in: [[-3, 0, 9], [-1, 10]], out: [-3, -1, 0, 9, 10] },
    ],
    hints: [
      'Compare the heads; the smaller one goes next in the result.',
      'A dummy (sentinel) node removes the special case for the first node.',
      'tail = dummy; while both non-null: attach the smaller node, advance. Finally attach whichever list remains.',
    ],
    brute: {
      idea: 'Collect all values, sort, and build a new list.',
      code: J`import java.util.*;

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = list1; p != null; p = p.next) vals.add(p.val);
        for (ListNode p = list2; p != null; p = p.next) vals.add(p.val);
        Collections.sort(vals);
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) { t.next = new ListNode(v); t = t.next; }
        return dummy.next;
    }
}`,
      time: 'O((n+m) log(n+m))', space: 'O(n + m)',
    },
    optimal: {
      idea: 'Splice nodes with a dummy head (iterative merge).',
      code: J`class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`,
      time: 'O(n + m)', space: 'O(1)',
    },
    lines: [
      ['ListNode dummy = new ListNode(0);', 'Sentinel so we never special-case an empty result.'],
      ['if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }', 'Attach the smaller node (<= keeps stability).'],
      ['tail = tail.next;', 'Move the tail to the newly attached node.'],
      ['tail.next = (list1 != null) ? list1 : list2;', 'Attach the remainder — already sorted.'],
      ['return dummy.next;', 'Skip the sentinel.'],
    ],
    cx: 'Each node is attached once → O(n + m). Re-uses existing nodes → O(1) extra space.',
    dry: ['[1,2,4] + [1,3,4]', '1(l1) → 1(l2) → 2 → 3 → 4(l1) → l1 empty → attach [4]'],
    tips: ['Recursive version: if l1.val <= l2.val { l1.next = merge(l1.next, l2); return l1; }.', 'This is the merge step for Sort List and Merge k Sorted Lists.'],
    mistakes: ['Forgetting to attach the leftover list.'],
    java: ['The ternary operator `cond ? a : b` keeps the final attachment concise.'],
  },
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    desc: "Given `head`, the head of a linked list, determine if the linked list has a **cycle** in it. A cycle exists if some node can be reached again by continuously following the `next` pointer.\n\nInternally, `pos` denotes the index of the node that the tail's `next` connects to (`-1` means no cycle). `pos` is **not** passed to your function.",
    ex: [
      ['head = [3,2,0,-4], pos = 1', 'true', 'The tail connects to the second node.'],
      ['head = [1,2], pos = 0', 'true', ''],
      ['head = [1], pos = -1', 'false', ''],
    ],
    cons: ['0 <= number of nodes <= 10^4', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index'],
    fn: { name: 'hasCycle', params: [['CycleList', 'head']], ret: 'boolean' },
    tests: [
      { in: [[[3, 2, 0, -4], 1]], out: true },
      { in: [[[1, 2], 0]], out: true },
      { in: [[[1], -1]], out: false },
      { in: [[[], -1]], out: false },
      { in: [[[1, 2, 3, 4, 5], -1]], out: false },
      { in: [[[1], 0]], out: true },
    ],
    hints: [
      'A HashSet of visited nodes detects repeats. Can you avoid the extra memory?',
      'Two runners on a circular track: the faster one eventually laps the slower one.',
      'Floyd: slow moves 1, fast moves 2. If they ever meet, there is a cycle; if fast hits null, there is not.',
    ],
    brute: {
      idea: 'Remember visited nodes (by reference) in a HashSet.',
      code: J`import java.util.*;

class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        for (ListNode p = head; p != null; p = p.next) {
            if (!seen.add(p)) return true;
        }
        return false;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Floyd\'s tortoise and hare.',
      code: J`class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (fast != null && fast.next != null)', 'If fast reaches the end, the list is acyclic.'],
      ['slow = slow.next; fast = fast.next.next;', 'The gap between them grows by one each step inside a cycle, so fast must catch slow.'],
      ['if (slow == fast) return true;', 'Reference equality: the same node object, not equal values.'],
    ],
    cx: 'Without a cycle fast reaches the end in n/2 steps; with a cycle they meet within one loop of the cycle → O(n). O(1) space.',
    dry: ['[3,2,0,-4], tail→2', 's2 f0', 's0 f2', 's-4 f-4 → meet → true'],
    tips: ['Follow-up: Linked List Cycle II — reset one pointer to head and move both one step; they meet at the cycle start.'],
    mistakes: ['Comparing slow.val == fast.val (duplicates give false positives).'],
    java: ['`HashSet<ListNode>` uses identity hashCode/equals unless the class overrides them — which is what we want here.', '`==` on objects compares references.'],
  },
  {
    id: 'remove-nth-node-from-end',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    desc: "Given the `head` of a linked list, remove the `n`-th node **from the end** of the list and return its head.\n\nFollow-up: could you do this in one pass?",
    ex: [
      ['head = [1,2,3,4,5], n = 2', '[1,2,3,5]', ''],
      ['head = [1], n = 1', '[]', ''],
      ['head = [1,2], n = 1', '[1]', ''],
    ],
    cons: ['1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    fn: { name: 'removeNthFromEnd', params: [['ListNode', 'head'], ['int', 'n']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 3, 4, 5], 2], out: [1, 2, 3, 5] },
      { in: [[1], 1], out: [] },
      { in: [[1, 2], 1], out: [1] },
      { in: [[1, 2], 2], out: [2] },
      { in: [[10, 20, 30], 3], out: [20, 30] },
    ],
    hints: [
      'Two passes: compute length L, then remove node L - n + 1 from the start.',
      'For one pass: keep two pointers n nodes apart.',
      'Use a dummy before head. Move fast n + 1 steps, then move both until fast is null; slow.next is the node to delete.',
    ],
    brute: {
      idea: 'Count length, then walk to the node before the target.',
      code: J`class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        int len = 0;
        for (ListNode p = head; p != null; p = p.next) len++;
        ListNode dummy = new ListNode(0, head), prev = dummy;
        for (int i = 0; i < len - n; i++) prev = prev.next;
        prev.next = prev.next.next;
        return dummy.next;
    }
}`,
      time: 'O(L), two passes', space: 'O(1)',
    },
    optimal: {
      idea: 'One pass with a gap of n between two pointers and a dummy node.',
      code: J`class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
      time: 'O(L), one pass', space: 'O(1)',
    },
    lines: [
      ['ListNode dummy = new ListNode(0, head);', 'Handles deleting the head itself without special cases.'],
      ['for (int i = 0; i <= n; i++) fast = fast.next;', 'Create a gap of n + 1 nodes between slow and fast.'],
      ['while (fast != null) { fast = fast.next; slow = slow.next; }', 'When fast falls off the end, slow is just BEFORE the target node.'],
      ['slow.next = slow.next.next;', 'Unlink the n-th node from the end.'],
    ],
    cx: 'Single traversal → O(L). Constant extra pointers.',
    dry: ['[1,2,3,4,5], n=2', 'fast moves 3 → at node 3; slow at dummy', 'move together: fast 4,5,null; slow 1,2,3', 'slow=3 → 3.next = 5 → [1,2,3,5]'],
    tips: ['Always mention the dummy node — it is the key to clean linked list code.'],
    mistakes: ['Gap of n instead of n + 1 → slow ends ON the target, not before it.'],
    java: ['Unreferenced nodes are garbage collected — no manual delete needed in Java.'],
  },
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    desc: "You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each node contains a single digit. Add the two numbers and return the sum as a linked list (also in reverse order).",
    ex: [
      ['l1 = [2,4,3], l2 = [5,6,4]', '[7,0,8]', '342 + 465 = 807.'],
      ['l1 = [0], l2 = [0]', '[0]', ''],
      ['l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', '[8,9,9,9,0,0,0,1]', ''],
    ],
    cons: ['1 <= number of nodes in each list <= 100', '0 <= Node.val <= 9', 'No leading zeros except the number 0 itself'],
    fn: { name: 'addTwoNumbers', params: [['ListNode', 'l1'], ['ListNode', 'l2']], ret: 'ListNode' },
    tests: [
      { in: [[2, 4, 3], [5, 6, 4]], out: [7, 0, 8] },
      { in: [[0], [0]], out: [0] },
      { in: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], out: [8, 9, 9, 9, 0, 0, 0, 1] },
      { in: [[5], [5]], out: [0, 1] },
      { in: [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [5, 6, 4]], out: [6, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
    ],
    hints: [
      'Converting to long overflows for 100 digits.',
      'The lists are least-significant digit first — exactly the order you add on paper.',
      'Walk both lists with a carry. sum = d1 + d2 + carry; new node sum % 10; carry = sum / 10. Continue while either list or carry remains.',
    ],
    brute: {
      idea: 'Convert each list to a BigInteger, add, and convert back.',
      code: J`import java.math.BigInteger;

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        BigInteger sum = toNum(l1).add(toNum(l2));
        String s = sum.toString();
        ListNode dummy = new ListNode(0), t = dummy;
        for (int i = s.length() - 1; i >= 0; i--) {
            t.next = new ListNode(s.charAt(i) - '0');
            t = t.next;
        }
        return dummy.next;
    }

    private BigInteger toNum(ListNode l) {
        StringBuilder sb = new StringBuilder();
        for (ListNode p = l; p != null; p = p.next) sb.append(p.val);
        return new BigInteger(sb.reverse().toString());
    }
}`,
      time: 'O(n + m)', space: 'O(n + m)',
    },
    optimal: {
      idea: 'Elementary addition digit by digit with a carry.',
      code: J`class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }
        return dummy.next;
    }
}`,
      time: 'O(max(n, m))', space: 'O(max(n, m)) for the result',
    },
    lines: [
      ['while (l1 != null || l2 != null || carry != 0)', 'Continue while digits remain in either list or a final carry is pending.'],
      ['if (l1 != null) { sum += l1.val; l1 = l1.next; }', 'Treat a finished list as zeros.'],
      ['tail.next = new ListNode(sum % 10);', 'Current digit.'],
      ['carry = sum / 10;', 'sum ≤ 19, so carry is 0 or 1.'],
    ],
    cx: 'One pass over the longer list → O(max(n, m)). Output list has at most max(n, m) + 1 nodes.',
    dry: ['[2,4,3] + [5,6,4]', '2+5=7', '4+6=10 → 0 carry1', '3+4+1=8 → [7,0,8]'],
    tips: ['Add Two Numbers II stores digits in forward order — use stacks or reverse the lists first.'],
    mistakes: ['Dropping the final carry (5 + 5 should be [0,1]).', 'Converting to int/long — overflows.'],
    java: ['`BigInteger` is immutable; `add` returns a new object.'],
  },
  {
    id: 'palindrome-linked-list',
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    desc: "Given the `head` of a singly linked list, return `true` if it is a **palindrome** or `false` otherwise.\n\nFollow-up: could you do it in O(n) time and O(1) space?",
    ex: [
      ['head = [1,2,2,1]', 'true', ''],
      ['head = [1,2]', 'false', ''],
    ],
    cons: ['1 <= number of nodes <= 10^5', '0 <= Node.val <= 9'],
    fn: { name: 'isPalindrome', params: [['ListNode', 'head']], ret: 'boolean' },
    tests: [
      { in: [[1, 2, 2, 1]], out: true },
      { in: [[1, 2]], out: false },
      { in: [[1]], out: true },
      { in: [[1, 2, 3, 2, 1]], out: true },
      { in: [[1, 2, 3, 1]], out: false },
    ],
    hints: [
      'Copying values to an array makes it easy but costs O(n) space.',
      'Find the middle with slow/fast pointers.',
      'Reverse the second half in place, compare it with the first half node by node, (optionally restore it).',
    ],
    brute: {
      idea: 'Copy values to an ArrayList and use two pointers.',
      code: J`import java.util.*;

class Solution {
    public boolean isPalindrome(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        for (int i = 0, j = vals.size() - 1; i < j; i++, j--) {
            if (!vals.get(i).equals(vals.get(j))) return false;
        }
        return true;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Find middle, reverse second half, compare, restore.',
      code: J`class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverse(slow);
        ListNode p1 = head, p2 = second;
        boolean ok = true;
        while (p2 != null) {
            if (p1.val != p2.val) { ok = false; break; }
            p1 = p1.next;
            p2 = p2.next;
        }
        reverse(second);
        return ok;
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (fast != null && fast.next != null)', 'slow ends at the middle (second middle for even length).'],
      ['ListNode second = reverse(slow);', 'Reverse the second half in place.'],
      ['while (p2 != null)', 'The reversed half is never longer than the first half.'],
      ['if (p1.val != p2.val)', 'Compare primitive ints — != is correct here.'],
      ['reverse(second);', 'Restore the original list — good etiquette (callers may reuse it).'],
    ],
    cx: 'Three linear passes → O(n). Only pointers → O(1).',
    dry: ['[1,2,2,1]: slow at 2nd "2"', 'reverse → second half 1→2', 'compare 1=1, 2=2 → true'],
    tips: ['Mention restoring the list — interviewers notice.'],
    mistakes: ['Comparing Integer objects with != in the ArrayList version (fails above 127).'],
    java: ['`Integer.equals` compares values; `==` on Integers compares references outside the -128..127 cache.'],
  },
  {
    id: 'reorder-list',
    title: 'Reorder List',
    difficulty: 'Medium',
    desc: "You are given the head of a singly linked list `L0 → L1 → … → Ln-1 → Ln`. Reorder it to `L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`.\n\nYou may not modify the values in the nodes; only nodes themselves may be changed. Modify the list in-place.",
    ex: [
      ['head = [1,2,3,4]', '[1,4,2,3]', ''],
      ['head = [1,2,3,4,5]', '[1,5,2,4,3]', ''],
    ],
    cons: ['1 <= number of nodes <= 5 * 10^4', '1 <= Node.val <= 1000'],
    fn: { name: 'reorderList', params: [['ListNode', 'head']], ret: 'void', out: 0 },
    tests: [
      { in: [[1, 2, 3, 4]], out: [1, 4, 2, 3] },
      { in: [[1, 2, 3, 4, 5]], out: [1, 5, 2, 4, 3] },
      { in: [[1]], out: [1] },
      { in: [[1, 2]], out: [1, 2] },
      { in: [[1, 2, 3]], out: [1, 3, 2] },
    ],
    hints: [
      'The result interleaves the first half with the reversed second half.',
      'Three steps you already know: find middle, reverse a list, merge two lists.',
      'Split after the middle (first-middle for even length), reverse the second half, then alternate nodes from each half.',
    ],
    brute: {
      idea: 'Store nodes in an ArrayList, then relink using two indices.',
      code: J`import java.util.*;

class Solution {
    public void reorderList(ListNode head) {
        List<ListNode> nodes = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) nodes.add(p);
        int i = 0, j = nodes.size() - 1;
        while (i < j) {
            nodes.get(i).next = nodes.get(j);
            i++;
            if (i == j) break;
            nodes.get(j).next = nodes.get(i);
            j--;
        }
        nodes.get(i).next = null;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Middle + reverse second half + interleave merge, all in O(1) space.',
      code: J`class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null;
        while (second != null) {
            ListNode next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }
        ListNode first = head;
        second = prev;
        while (second != null) {
            ListNode n1 = first.next, n2 = second.next;
            first.next = second;
            second.next = n1;
            first = n1;
            second = n2;
        }
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (fast.next != null && fast.next.next != null)', 'slow stops at the FIRST middle, so the first half is the longer one.'],
      ['ListNode second = slow.next; slow.next = null;', 'Cut the list into two halves.'],
      ['while (second != null) { ... reverse ... }', 'Reverse the second half: 4→5 becomes 5→4.'],
      ['ListNode n1 = first.next, n2 = second.next;', 'Save the next nodes before relinking.'],
      ['first.next = second; second.next = n1;', 'Insert a node from the reversed half after each node of the first half.'],
    ],
    cx: 'Each phase is linear → O(n); constant pointers → O(1).',
    dry: ['[1,2,3,4,5]', 'middle 3 → halves 1→2→3 and 4→5', 'reverse → 5→4', 'merge → 1→5→2→4→3'],
    tips: ['Say the three sub-problems aloud — it shows decomposition skills.'],
    mistakes: ['Forgetting to cut the first half (creates a cycle).'],
    java: ['No return value needed: we mutate the nodes reachable from head.'],
  },
  {
    id: 'rotate-list',
    title: 'Rotate List',
    difficulty: 'Medium',
    desc: "Given the `head` of a linked list, rotate the list to the **right** by `k` places.",
    ex: [
      ['head = [1,2,3,4,5], k = 2', '[4,5,1,2,3]', ''],
      ['head = [0,1,2], k = 4', '[2,0,1]', 'Rotating by 4 equals rotating by 4 % 3 = 1.'],
    ],
    cons: ['0 <= number of nodes <= 500', '-100 <= Node.val <= 100', '0 <= k <= 2 * 10^9'],
    fn: { name: 'rotateRight', params: [['ListNode', 'head'], ['int', 'k']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 3, 4, 5], 2], out: [4, 5, 1, 2, 3] },
      { in: [[0, 1, 2], 4], out: [2, 0, 1] },
      { in: [[], 3], out: [] },
      { in: [[1], 99], out: [1] },
      { in: [[1, 2], 2000000000], out: [1, 2] },
    ],
    hints: [
      'k can be huge. Rotating by the length gives the same list.',
      'Compute length n and use k % n.',
      'Connect tail to head to form a ring, then break it at node n - k%n (the new tail).',
    ],
    brute: {
      idea: 'Move the last node to the front, k % n times.',
      code: J`class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        k %= n;
        for (int i = 0; i < k; i++) {
            ListNode prev = null, cur = head;
            while (cur.next != null) { prev = cur; cur = cur.next; }
            prev.next = null;
            cur.next = head;
            head = cur;
        }
        return head;
    }
}`,
      time: 'O(n · k)', space: 'O(1)',
    },
    optimal: {
      idea: 'Make the list circular, then cut at the right place.',
      code: J`class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) return head;
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            n++;
        }
        k %= n;
        if (k == 0) return head;
        tail.next = head;
        ListNode newTail = head;
        for (int i = 0; i < n - k - 1; i++) {
            newTail = newTail.next;
        }
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['while (tail.next != null) { tail = tail.next; n++; }', 'Find the tail and the length in one pass.'],
      ['k %= n; if (k == 0) return head;', 'Full rotations do nothing.'],
      ['tail.next = head;', 'Close the ring.'],
      ['for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;', 'The new tail is the (n - k)-th node.'],
      ['newTail.next = null;', 'Break the ring after the new tail.'],
    ],
    cx: 'At most two traversals → O(n), O(1) space.',
    dry: ['[1..5], k=2 → n=5', 'ring 5→1', 'walk 2 steps from 1 → newTail=3', 'newHead=4, cut → [4,5,1,2,3]'],
    tips: ['Compare with Rotate Array — same k % n trick.'],
    mistakes: ['Not reducing k → loops 2·10^9 times.'],
    java: ['`k %= n` keeps k in int range automatically.'],
  },
  {
    id: 'reverse-nodes-k-group',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    desc: "Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return the modified list. If the number of nodes is not a multiple of `k`, the left-out nodes at the end should remain as they are.\n\nYou may not alter the values in the nodes, only the nodes themselves. Can you solve it with O(1) extra memory?",
    ex: [
      ['head = [1,2,3,4,5], k = 2', '[2,1,4,3,5]', ''],
      ['head = [1,2,3,4,5], k = 3', '[3,2,1,4,5]', ''],
    ],
    cons: ['1 <= k <= n <= 5000', '0 <= Node.val <= 1000'],
    fn: { name: 'reverseKGroup', params: [['ListNode', 'head'], ['int', 'k']], ret: 'ListNode' },
    tests: [
      { in: [[1, 2, 3, 4, 5], 2], out: [2, 1, 4, 3, 5] },
      { in: [[1, 2, 3, 4, 5], 3], out: [3, 2, 1, 4, 5] },
      { in: [[1, 2, 3, 4], 4], out: [4, 3, 2, 1] },
      { in: [[1, 2, 3], 1], out: [1, 2, 3] },
      { in: [[1, 2, 3, 4, 5, 6, 7], 3], out: [3, 2, 1, 6, 5, 4, 7] },
    ],
    hints: [
      'Before reversing a group, check that k nodes actually exist.',
      'Reverse exactly k nodes, then connect the previous group\'s tail to the new group head.',
      'Use a dummy node and a pointer groupPrev. For each full group: find kth node, reverse between groupPrev.next and kth, reconnect, move groupPrev to the old group head (now its tail).',
    ],
    brute: {
      idea: 'Copy values into an array, reverse each full block of k, and rebuild the list.',
      code: J`import java.util.*;

class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        for (int s = 0; s + k <= vals.size(); s += k) {
            Collections.reverse(vals.subList(s, s + k));
        }
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) { t.next = new ListNode(v); t = t.next; }
        return dummy.next;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Iterative group reversal with a dummy head and O(1) extra memory.',
      code: J`class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;
            ListNode groupNext = kth.next;
            ListNode prev = groupNext, curr = groupPrev.next;
            while (curr != groupNext) {
                ListNode next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            ListNode oldStart = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = oldStart;
        }
        return dummy.next;
    }
}`,
      time: 'O(n)', space: 'O(1)',
    },
    lines: [
      ['ListNode dummy = new ListNode(0, head); ListNode groupPrev = dummy;', 'groupPrev is the node just before the current group.'],
      ['for (...) kth = kth.next; if (kth == null) break;', 'Find the k-th node of the group; stop if the group is incomplete.'],
      ['ListNode prev = groupNext, curr = groupPrev.next;', 'Reversing with prev starting at groupNext automatically links the reversed group\'s tail to the rest of the list.'],
      ['while (curr != groupNext) { ... }', 'Standard reversal, limited to exactly k nodes.'],
      ['groupPrev.next = kth;', 'kth is now the head of the reversed group.'],
      ['groupPrev = oldStart;', 'The group\'s original first node is now its tail — the "prev" for the next group.'],
    ],
    cx: 'Each node is visited twice (count + reverse) → O(n). O(1) extra space.',
    dry: ['[1,2,3,4,5], k=2', 'group [1,2] → 2→1→3…, groupPrev=1', 'group [3,4] → 4→3→5, groupPrev=3', 'only [5] left → stop → [2,1,4,3,5]'],
    tips: ['Draw the pointers on the whiteboard before coding — this question is about precise pointer manipulation.'],
    mistakes: ['Reversing the incomplete last group.', 'Losing the connection between groups.'],
    java: ['`subList(from, to)` returns a view; `Collections.reverse` on it reverses that part of the original list.'],
  },
];
