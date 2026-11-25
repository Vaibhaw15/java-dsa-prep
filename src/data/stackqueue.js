const J = String.raw;

export default [
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    desc: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is **valid**.\n\nA string is valid if open brackets are closed by the same type of brackets, open brackets are closed in the correct order, and every close bracket has a corresponding open bracket.",
    ex: [
      ['s = "()"', 'true', ''],
      ['s = "()[]{}"', 'true', ''],
      ['s = "(]"', 'false', ''],
      ['s = "([])"', 'true', ''],
    ],
    cons: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}'"],
    fn: { name: 'isValid', params: [['String', 's']], ret: 'boolean' },
    tests: [
      { in: ['()'], out: true },
      { in: ['()[]{}'], out: true },
      { in: ['(]'], out: false },
      { in: ['([])'], out: true },
      { in: ['(('], out: false },
      { in: ['){'], out: false },
      { in: ['{[()()]}'], out: true },
    ],
    hints: [
      'The most recently opened bracket must be closed first. Which data structure is "last in, first out"?',
      'Push opening brackets on a stack; for a closing bracket, the top must be its matching opener.',
      'Trick: push the EXPECTED closing bracket instead; then a closing char must equal stack.pop(). At the end the stack must be empty.',
    ],
    brute: {
      idea: 'Repeatedly delete "()", "[]" and "{}" pairs until nothing changes.',
      code: J`class Solution {
    public boolean isValid(String s) {
        String prev;
        do {
            prev = s;
            s = s.replace("()", "").replace("[]", "").replace("{}", "");
        } while (!s.equals(prev));
        return s.isEmpty();
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Stack of expected closing brackets.',
      code: J`import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['Deque<Character> stack = new ArrayDeque<>();', 'ArrayDeque is the recommended stack implementation in modern Java.'],
      ["if (c == '(') stack.push(')');", 'Remember which closer we now expect.'],
      ['else if (stack.isEmpty() || stack.pop() != c) return false;', 'A closer with nothing open, or the wrong type → invalid.'],
      ['return stack.isEmpty();', 'Unclosed openers make the string invalid.'],
    ],
    cx: 'Each character is pushed/popped at most once → O(n). Stack up to n/2 entries → O(n).',
    dry: ['"([])"', '( → push )', '[ → push ]', '] → pop ] ✓', ') → pop ) ✓', 'empty → true'],
    tips: ['Odd length → immediately false (nice early exit).', 'Follow-ups: Minimum Add to Make Parentheses Valid, Longest Valid Parentheses.'],
    mistakes: ['Forgetting the isEmpty() check before pop → NoSuchElementException.', 'Returning true without checking the stack is empty at the end.'],
    java: ['`Stack` extends `Vector` (synchronized, legacy). Prefer `Deque<T> stack = new ArrayDeque<>()` with push/pop/peek.', '`stack.pop() != c` compares a Character with a char — the Character is unboxed, so it is a value comparison.'],
  },
  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    desc: "Design a stack that supports `push`, `pop`, `top`, and retrieving the **minimum element in constant time**.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `void push(int val)` pushes the element onto the stack.\n- `void pop()` removes the element on the top of the stack.\n- `int top()` gets the top element.\n- `int getMin()` retrieves the minimum element in the stack.\n\nEach function must run in **O(1)** time.",
    ex: [
      ['["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', '[null,null,null,null,-3,null,0,-2]', 'After popping -3, the minimum is -2 again.'],
    ],
    cons: ['-2^31 <= val <= 2^31 - 1', 'pop, top and getMin are only called on non-empty stacks', 'At most 3 * 10^4 calls'],
    design: {
      cls: 'MinStack', ctor: [],
      methods: { push: [['int'], 'void', ['val']], pop: [[], 'void'], top: [[], 'int'], getMin: [[], 'int'] },
    },
    tests: [
      { ops: ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], args: [[], [-2], [0], [-3], [], [], [], []], out: [null, null, null, null, -3, null, 0, -2] },
      { ops: ['MinStack', 'push', 'getMin', 'push', 'getMin', 'push', 'getMin', 'pop', 'getMin'], args: [[], [5], [], [5], [], [7], [], [], []], out: [null, null, 5, null, 5, null, 5, null, 5] },
      { ops: ['MinStack', 'push', 'push', 'pop', 'push', 'getMin', 'top'], args: [[], [2147483647], [-2147483648], [], [3], [], []], out: [null, null, null, null, null, 3, 3] },
    ],
    hints: [
      'A single extra "min" variable breaks when the minimum is popped. What do you need to remember?',
      'For every stack state, remember the minimum at that point.',
      'Store pairs [value, minSoFar] (or keep a second stack of minimums). getMin is then just the top pair\'s min.',
    ],
    brute: {
      idea: 'Plain stack; getMin scans every element (O(n)).',
      code: J`import java.util.*;

class MinStack {
    private final List<Integer> data = new ArrayList<>();

    public MinStack() {}

    public void push(int val) { data.add(val); }

    public void pop() { data.remove(data.size() - 1); }

    public int top() { return data.get(data.size() - 1); }

    public int getMin() {
        int min = Integer.MAX_VALUE;
        for (int x : data) min = Math.min(min, x);
        return min;
    }
}`,
      time: 'push/pop/top O(1), getMin O(n)', space: 'O(n)',
    },
    optimal: {
      idea: 'Each stack entry stores the value and the minimum of the stack up to that entry.',
      code: J`import java.util.*;

class MinStack {
    private final Deque<int[]> stack = new ArrayDeque<>();

    public MinStack() {}

    public void push(int val) {
        int min = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, min});
    }

    public void pop() {
        stack.pop();
    }

    public int top() {
        return stack.peek()[0];
    }

    public int getMin() {
        return stack.peek()[1];
    }
}`,
      time: 'O(1) for every operation', space: 'O(n)',
    },
    lines: [
      ['Deque<int[]> stack = new ArrayDeque<>();', 'Each element is a pair {value, minSoFar}.'],
      ['int min = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);', 'New minimum = smaller of the new value and the previous minimum.'],
      ['stack.push(new int[]{val, min});', 'Push the pair.'],
      ['return stack.peek()[1];', 'The minimum of the whole stack is stored on top — O(1).'],
      ['stack.pop();', 'Popping restores the previous minimum automatically.'],
    ],
    cx: 'All operations O(1). Space O(n) — two ints per element. A two-stack variant only pushes to the min-stack when val <= current min, saving space.',
    dry: ['push -2 → [(-2,-2)]', 'push 0 → (0,-2)', 'push -3 → (-3,-3)', 'getMin → -3', 'pop → top (0,-2)', 'top → 0, getMin → -2'],
    tips: ['Explain the space-optimised version (second stack only stores new minimums).', 'Related: Max Stack, Stack with getMiddle.'],
    mistakes: ['Keeping one min variable and failing to restore it on pop.'],
    java: ['Fields marked `final` cannot be reassigned, but the referenced Deque can still be modified.', '`Deque.peek()` returns the head (top of stack) without removing it; returns null when empty.'],
  },
  {
    id: 'implement-queue-using-stacks',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    desc: "Implement a first-in-first-out (FIFO) queue using only **two stacks**. The implemented queue should support all the functions of a normal queue:\n\n- `void push(int x)` pushes element x to the back of the queue.\n- `int pop()` removes the element from the front of the queue and returns it.\n- `int peek()` returns the element at the front of the queue.\n- `boolean empty()` returns true if the queue is empty.\n\nFollow-up: make each operation **amortised O(1)**.",
    ex: [
      ['["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', '[null,null,null,1,1,false]', ''],
    ],
    cons: ['1 <= x <= 9', 'At most 100 calls', 'All calls to pop and peek are valid'],
    design: {
      cls: 'MyQueue', ctor: [],
      methods: { push: [['int'], 'void', ['x']], pop: [[], 'int'], peek: [[], 'int'], empty: [[], 'boolean'] },
    },
    tests: [
      { ops: ['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], args: [[], [1], [2], [], [], []], out: [null, null, null, 1, 1, false] },
      { ops: ['MyQueue', 'push', 'pop', 'empty', 'push', 'push', 'push', 'pop', 'push', 'pop', 'pop', 'pop', 'empty'], args: [[], [5], [], [], [1], [2], [3], [], [4], [], [], [], []], out: [null, null, 5, true, null, null, null, 1, null, 2, 3, 4, true] },
    ],
    hints: [
      'A stack reverses order. What happens if you reverse twice?',
      'Use an "in" stack for push and an "out" stack for pop/peek.',
      'Only when "out" is empty, move ALL elements from "in" to "out". Each element moves at most once → amortised O(1).',
    ],
    brute: {
      idea: 'Keep the queue order in one stack by transferring everything on every push (push is O(n)).',
      code: J`import java.util.*;

class MyQueue {
    private final Deque<Integer> main = new ArrayDeque<>();
    private final Deque<Integer> temp = new ArrayDeque<>();

    public MyQueue() {}

    public void push(int x) {
        while (!main.isEmpty()) temp.push(main.pop());
        main.push(x);
        while (!temp.isEmpty()) main.push(temp.pop());
    }

    public int pop() { return main.pop(); }

    public int peek() { return main.peek(); }

    public boolean empty() { return main.isEmpty(); }
}`,
      time: 'push O(n), others O(1)', space: 'O(n)',
    },
    optimal: {
      idea: 'Two stacks with lazy transfer: amortised O(1) per operation.',
      code: J`import java.util.*;

class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>();
    private final Deque<Integer> out = new ArrayDeque<>();

    public MyQueue() {}

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        peek();
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }
}`,
      time: 'amortised O(1) per operation', space: 'O(n)',
    },
    lines: [
      ['in.push(x);', 'New elements always go on the "in" stack.'],
      ['if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());', 'Reversing "in" puts the oldest element on top of "out".'],
      ['return out.peek();', 'The front of the queue.'],
      ['peek(); return out.pop();', 'Reuse peek to ensure "out" is filled, then pop.'],
      ['return in.isEmpty() && out.isEmpty();', 'Elements can live in either stack.'],
    ],
    cx: 'Every element is pushed to "in" once, moved to "out" once and popped once → O(1) amortised per operation; worst single pop is O(n).',
    dry: ['push 1, push 2 → in=[2,1] (top 2)', 'peek: out empty → move → out=[1,2] (top 1) → 1', 'pop → 1', 'empty → false (2 still in out)'],
    tips: ['Explain amortised analysis clearly — that is the point of this question.', 'Reverse question: Implement Stack using Queues.'],
    mistakes: ['Transferring when "out" is not empty — breaks FIFO order.'],
    java: ['In real code use `ArrayDeque` directly as a queue: `offer`, `poll`, `peek`.'],
  },
  {
    id: 'next-greater-element-i',
    title: 'Next Greater Element I',
    difficulty: 'Easy',
    desc: "The **next greater element** of some element `x` in an array is the first greater element to the right of `x` in the same array.\n\nYou are given two distinct integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`. For each `nums1[i]`, find its position in `nums2` and return the next greater element there, or `-1` if there is none.",
    ex: [
      ['nums1 = [4,1,2], nums2 = [1,3,4,2]', '[-1,3,-1]', '4 has nothing greater to its right; 1 → 3; 2 → none.'],
      ['nums1 = [2,4], nums2 = [1,2,3,4]', '[3,-1]', ''],
    ],
    cons: ['1 <= nums1.length <= nums2.length <= 1000', 'All integers are unique', 'nums1 is a subset of nums2'],
    fn: { name: 'nextGreaterElement', params: [['int[]', 'nums1'], ['int[]', 'nums2']], ret: 'int[]' },
    tests: [
      { in: [[4, 1, 2], [1, 3, 4, 2]], out: [-1, 3, -1] },
      { in: [[2, 4], [1, 2, 3, 4]], out: [3, -1] },
      { in: [[1], [1]], out: [-1] },
      { in: [[5, 3, 8], [6, 5, 4, 3, 2, 1, 7, 8]], out: [7, 7, -1] },
    ],
    hints: [
      'For each element you could scan to the right. Can you do all of nums2 in one pass?',
      'Keep a stack of elements still waiting for their next greater element. The stack stays decreasing.',
      'For each x in nums2: while stack top < x, map[pop] = x. Push x. Then answer nums1 via the map (default -1).',
    ],
    brute: {
      idea: 'For each nums1 value, find it in nums2 and scan right.',
      code: J`class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            res[i] = -1;
            int j = 0;
            while (nums2[j] != nums1[i]) j++;
            for (int k = j + 1; k < nums2.length; k++) {
                if (nums2[k] > nums1[i]) { res[i] = nums2[k]; break; }
            }
        }
        return res;
    }
}`,
      time: 'O(n · m)', space: 'O(1)',
    },
    optimal: {
      idea: 'Monotonic decreasing stack over nums2, storing answers in a HashMap.',
      code: J`import java.util.*;

class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> next = new HashMap<>();
        Deque<Integer> stack = new ArrayDeque<>();
        for (int x : nums2) {
            while (!stack.isEmpty() && stack.peek() < x) {
                next.put(stack.pop(), x);
            }
            stack.push(x);
        }
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            res[i] = next.getOrDefault(nums1[i], -1);
        }
        return res;
    }
}`,
      time: 'O(n + m)', space: 'O(m)',
    },
    lines: [
      ['Deque<Integer> stack', 'Holds elements whose next greater element has not been found yet (decreasing from bottom to top).'],
      ['while (!stack.isEmpty() && stack.peek() < x)', 'x is the first greater element to the right for every smaller element on top of the stack.'],
      ['next.put(stack.pop(), x);', 'Record the answer and remove that element.'],
      ['stack.push(x);', 'x now waits for its own next greater element.'],
      ['next.getOrDefault(nums1[i], -1)', 'Elements left on the stack never found a greater one → -1.'],
    ],
    cx: 'Each element is pushed and popped at most once → O(m). Answer lookup O(n). Map and stack O(m).',
    dry: ['nums2=[1,3,4,2]', '1 → stack [1]', '3 → pop 1 (next 3) → [3]', '4 → pop 3 (next 4) → [4]', '2 → [4,2]', 'nums1 [4,1,2] → [-1,3,-1]'],
    tips: ['The monotonic stack pattern solves Daily Temperatures, Next Greater Element II (circular → iterate 2n), Stock Span, Largest Rectangle.'],
    mistakes: ['Comparing Integer objects with < is fine (unboxing), but == would not be.'],
    java: ['`stack.peek() < x` auto-unboxes the Integer.'],
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    desc: "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the **number of days you have to wait** after the `i`-th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.",
    ex: [
      ['temperatures = [73,74,75,71,69,72,76,73]', '[1,1,4,2,1,1,0,0]', ''],
      ['temperatures = [30,40,50,60]', '[1,1,1,0]', ''],
      ['temperatures = [30,60,90]', '[1,1,0]', ''],
    ],
    cons: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    fn: { name: 'dailyTemperatures', params: [['int[]', 'temperatures']], ret: 'int[]' },
    tests: [
      { in: [[73, 74, 75, 71, 69, 72, 76, 73]], out: [1, 1, 4, 2, 1, 1, 0, 0] },
      { in: [[30, 40, 50, 60]], out: [1, 1, 1, 0] },
      { in: [[30, 60, 90]], out: [1, 1, 0] },
      { in: [[90, 80, 70]], out: [0, 0, 0] },
      { in: [[50, 50, 51]], out: [2, 1, 0] },
    ],
    hints: [
      'This is "next greater element", but you need the distance, not the value.',
      'Store INDICES on the stack instead of values.',
      'For each day i: while temps[stack.top] < temps[i], j = pop, answer[j] = i - j. Push i.',
    ],
    brute: {
      idea: 'For each day scan forward for the first warmer day.',
      code: J`class Solution {
    public int[] dailyTemperatures(int[] t) {
        int n = t.length;
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (t[j] > t[i]) { ans[i] = j - i; break; }
            }
        }
        return ans;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Monotonic stack of indices with decreasing temperatures.',
      code: J`import java.util.*;

class Solution {
    public int[] dailyTemperatures(int[] t) {
        int n = t.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && t[stack.peek()] < t[i]) {
                int j = stack.pop();
                ans[j] = i - j;
            }
            stack.push(i);
        }
        return ans;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['Deque<Integer> stack', 'Indices of days still waiting for a warmer day.'],
      ['while (... t[stack.peek()] < t[i])', 'Day i is warmer than the waiting day on top.'],
      ['ans[j] = i - j;', 'Distance between the days.'],
      ['stack.push(i);', 'Day i now waits.'],
    ],
    cx: 'Each index pushed and popped once → O(n). Stack up to n → O(n).',
    dry: ['[73,74,75,71,69,72,76,73]', '74 resolves 73 → 1', '75 resolves 74 → 1', '71, 69 wait', '72 resolves 69 (1), 71 (2)', '76 resolves 72 (1), 75 (4)'],
    tips: ['Array-based stack (int[] + top pointer) is faster than Deque<Integer> (no boxing).'],
    mistakes: ['Pushing values instead of indices — you lose the distance.'],
    java: ['Boxing in `Deque<Integer>` costs memory; an `int[] stack` with a `top` variable avoids it.'],
  },
  {
    id: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    desc: "You are given an array of strings `tokens` that represents an arithmetic expression in **Reverse Polish Notation** (postfix). Evaluate the expression and return an integer.\n\nOperators are `+`, `-`, `*`, `/`. Division between two integers **truncates toward zero**. There is no division by zero and the input is always valid.",
    ex: [
      ['tokens = ["2","1","+","3","*"]', '9', '((2 + 1) * 3) = 9.'],
      ['tokens = ["4","13","5","/","+"]', '6', '(4 + (13 / 5)) = 6.'],
      ['tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', '22', ''],
    ],
    cons: ['1 <= tokens.length <= 10^4', 'tokens[i] is an operator or an integer in [-200, 200]'],
    fn: { name: 'evalRPN', params: [['String[]', 'tokens']], ret: 'int' },
    tests: [
      { in: [['2', '1', '+', '3', '*']], out: 9 },
      { in: [['4', '13', '5', '/', '+']], out: 6 },
      { in: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], out: 22 },
      { in: [['7', '-3', '/']], out: -2 },
      { in: [['42']], out: 42 },
    ],
    hints: [
      'In postfix, an operator applies to the two most recent operands.',
      'Push numbers on a stack; on an operator pop two operands.',
      'Order matters: b = pop(), a = pop(), push(a op b). Java int division already truncates toward zero.',
    ],
    brute: {
      idea: 'Repeatedly find the first operator, evaluate it with the two preceding numbers, and splice the list.',
      code: J`import java.util.*;

class Solution {
    public int evalRPN(String[] tokens) {
        List<String> list = new ArrayList<>(Arrays.asList(tokens));
        while (list.size() > 1) {
            int i = 0;
            while (!isOp(list.get(i))) i++;
            int a = Integer.parseInt(list.get(i - 2)), b = Integer.parseInt(list.get(i - 1));
            int r = apply(a, b, list.get(i));
            list.set(i - 2, String.valueOf(r));
            list.remove(i);
            list.remove(i - 1);
        }
        return Integer.parseInt(list.get(0));
    }

    private boolean isOp(String s) { return s.equals("+") || s.equals("-") || s.equals("*") || s.equals("/"); }

    private int apply(int a, int b, String op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            default: return a / b;
        }
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Operand stack.',
      code: J`import java.util.*;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+": stack.push(stack.pop() + stack.pop()); break;
                case "*": stack.push(stack.pop() * stack.pop()); break;
                case "-": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a - b);
                    break;
                }
                case "/": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a / b);
                    break;
                }
                default: stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['switch (t) { case "+": ... }', 'Java supports switch on Strings (uses hashCode + equals).'],
      ['stack.push(stack.pop() + stack.pop());', 'Addition and multiplication are commutative, so pop order does not matter.'],
      ['int b = stack.pop(), a = stack.pop(); stack.push(a - b);', 'For - and /, the first popped value is the RIGHT operand.'],
      ['default: stack.push(Integer.parseInt(t));', 'Anything else is a number (including negatives like "-11").'],
    ],
    cx: 'Each token is processed once → O(n). Stack holds up to n/2 + 1 numbers.',
    dry: ['["4","13","5","/","+"]', 'push 4, 13, 5', '/ → 13 / 5 = 2 → [4,2]', '+ → 6'],
    tips: ['Follow-up: Basic Calculator (infix with parentheses) — convert to postfix or use two stacks.'],
    mistakes: ['Popping in the wrong order for - and /.', 'Treating "-11" as an operator because it starts with "-".'],
    java: ['String switch requires Java 7+.', 'Java integer division truncates toward zero: -7 / 3 == -2.'],
  },
  {
    id: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    desc: "Given an array of integers `heights` representing the histogram's bar heights where the width of each bar is `1`, return the **area of the largest rectangle** in the histogram.",
    ex: [
      ['heights = [2,1,5,6,2,3]', '10', 'The rectangle over bars 5 and 6 has area 2 × 5 = 10.'],
      ['heights = [2,4]', '4', ''],
    ],
    cons: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    fn: { name: 'largestRectangleArea', params: [['int[]', 'heights']], ret: 'int' },
    tests: [
      { in: [[2, 1, 5, 6, 2, 3]], out: 10 },
      { in: [[2, 4]], out: 4 },
      { in: [[1]], out: 1 },
      { in: [[2, 2, 2, 2]], out: 8 },
      { in: [[6, 2, 5, 4, 5, 1, 6]], out: 12 },
      { in: [[0, 0]], out: 0 },
    ],
    hints: [
      'For each bar, the best rectangle using it as the SHORTEST bar extends left and right until a smaller bar.',
      'You need, for every bar, the index of the previous smaller and next smaller bar.',
      'Monotonic increasing stack of indices. When a smaller bar arrives, pop: the popped bar\'s right limit is i, its left limit is the new stack top. Area = h × (i - left - 1).',
    ],
    brute: {
      idea: 'For each bar, expand left and right while bars are at least as tall.',
      code: J`class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        for (int i = 0; i < n; i++) {
            int l = i, r = i;
            while (l > 0 && heights[l - 1] >= heights[i]) l--;
            while (r < n - 1 && heights[r + 1] >= heights[i]) r++;
            best = Math.max(best, heights[i] * (r - l + 1));
        }
        return best;
    }
}`,
      time: 'O(n^2)', space: 'O(1)',
    },
    optimal: {
      idea: 'Monotonic increasing stack; each bar\'s rectangle is computed when it is popped.',
      code: J`import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            stack.push(i);
        }
        return best;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['for (int i = 0; i <= n; i++)', 'One extra iteration with height 0 flushes all remaining bars.'],
      ['while (... heights[stack.peek()] > h)', 'Bar on top cannot extend past i; finalize it.'],
      ['int height = heights[stack.pop()];', 'This bar is the shortest in its maximal rectangle.'],
      ['int left = stack.isEmpty() ? -1 : stack.peek();', 'The new top is the previous smaller bar → left boundary.'],
      ['best = Math.max(best, height * (i - left - 1));', 'Width spans strictly between left and i.'],
    ],
    cx: 'Each index pushed/popped once → O(n). Stack O(n).',
    dry: ['[2,1,5,6,2,3]', 'i1 (1): pop 2 → area 2×1=2', 'i4 (2): pop 6 → 6×1=6; pop 5 → 5×2=10', 'i6 (0): pop 3 → 3; pop 2 → 2×4=8; pop 1 → 1×6=6 → best 10'],
    tips: ['Maximal Rectangle (binary matrix) applies this per row on cumulative heights.'],
    mistakes: ['Forgetting the sentinel pass at i == n (bars left on the stack never get measured).'],
    java: ['A ternary for the sentinel height avoids copying the array with an extra 0.'],
  },
  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    desc: "You are given an array of integers `nums`, and a sliding window of size `k` moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the window moves right by one position.\n\nReturn the **max of each window**.",
    ex: [
      ['nums = [1,3,-1,-3,5,3,6,7], k = 3', '[3,3,5,5,6,7]', 'Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7.'],
      ['nums = [1], k = 1', '[1]', ''],
    ],
    cons: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    fn: { name: 'maxSlidingWindow', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int[]' },
    tests: [
      { in: [[1, 3, -1, -3, 5, 3, 6, 7], 3], out: [3, 3, 5, 5, 6, 7] },
      { in: [[1], 1], out: [1] },
      { in: [[9, 8, 7, 6], 2], out: [9, 8, 7] },
      { in: [[1, 2, 3, 4], 4], out: [4] },
      { in: [[4, -2], 2], out: [4] },
    ],
    hints: [
      'Recomputing each window\'s max is O(n·k). Can a heap help? (O(n log n).)',
      'If a newer element is larger than an older one, the older one can never be a window max again.',
      'Monotonic deque of indices with decreasing values: pop back while smaller than the new value; pop front if out of the window; front is the max.',
    ],
    brute: {
      idea: 'Scan each window for its maximum.',
      code: J`class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        for (int i = 0; i + k <= n; i++) {
            int max = nums[i];
            for (int j = i; j < i + k; j++) max = Math.max(max, nums[j]);
            res[i] = max;
        }
        return res;
    }
}`,
      time: 'O(n · k)', space: 'O(1)',
    },
    optimal: {
      idea: 'Monotonic decreasing deque of indices.',
      code: J`import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) {
                dq.pollLast();
            }
            dq.offerLast(i);
            if (i >= k - 1) {
                res[i - k + 1] = nums[dq.peekFirst()];
            }
        }
        return res;
    }
}`,
      time: 'O(n)', space: 'O(k)',
    },
    lines: [
      ['Deque<Integer> dq', 'Indices whose values are in decreasing order; the front is the current window maximum.'],
      ['if (dq.peekFirst() <= i - k) dq.pollFirst();', 'Front index slid out of the window.'],
      ['while (... nums[dq.peekLast()] < nums[i]) dq.pollLast();', 'Smaller elements behind a newer larger one are useless forever.'],
      ['dq.offerLast(i);', 'The new element may become the max later.'],
      ['if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];', 'Once the first full window is formed, record the max every step.'],
    ],
    cx: 'Each index enters and leaves the deque once → O(n). Deque holds at most k indices.',
    dry: ['[1,3,-1,-3,5,3,6,7], k=3', 'i0 [0]', 'i1 3 > 1 → [1]', 'i2 [1,2] → max 3', 'i3 [1,2,3] → 3', 'i4 5 clears all → [4] → 5', '…'],
    tips: ['A max-heap with lazy deletion is the O(n log n) alternative — mention it before the deque.'],
    mistakes: ['Storing values instead of indices (cannot tell when they leave the window).'],
    java: ['`ArrayDeque` supports both ends: offerFirst/offerLast, pollFirst/pollLast, peekFirst/peekLast.'],
  },
  {
    id: 'decode-string',
    title: 'Decode String',
    difficulty: 'Medium',
    desc: "Given an encoded string, return its decoded string. The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is repeated exactly `k` times. `k` is a positive integer.\n\nThe input is always valid; brackets may be nested, and digits appear only as repeat counts.",
    ex: [
      ['s = "3[a]2[bc]"', '"aaabcbc"', ''],
      ['s = "3[a2[c]]"', '"accaccacc"', ''],
      ['s = "2[abc]3[cd]ef"', '"abcabccdcdcdef"', ''],
    ],
    cons: ['1 <= s.length <= 30', 's consists of lowercase letters, digits and square brackets', '1 <= k <= 300'],
    fn: { name: 'decodeString', params: [['String', 's']], ret: 'String' },
    tests: [
      { in: ['3[a]2[bc]'], out: 'aaabcbc' },
      { in: ['3[a2[c]]'], out: 'accaccacc' },
      { in: ['2[abc]3[cd]ef'], out: 'abcabccdcdcdef' },
      { in: ['abc'], out: 'abc' },
      { in: ['10[z]'], out: 'zzzzzzzzzz' },
      { in: ['2[2[2[x]]]'], out: 'xxxxxxxx' },
    ],
    hints: [
      'Nested brackets suggest recursion or a stack.',
      'When you see "[", save the current string and the repeat count; start a new string.',
      'Two stacks: counts and previous strings. On "]": cur = prev + cur.repeat(k). Multi-digit numbers: k = k * 10 + digit.',
    ],
    brute: {
      idea: 'Recursive descent parser: decode(i) reads letters and k[...] groups until a closing bracket.',
      code: J`class Solution {
    private int i = 0;

    public String decodeString(String s) {
        StringBuilder sb = new StringBuilder();
        while (i < s.length() && s.charAt(i) != ']') {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                int k = 0;
                while (Character.isDigit(s.charAt(i))) k = k * 10 + (s.charAt(i++) - '0');
                i++; // skip '['
                String inner = decodeString(s);
                i++; // skip ']'
                for (int t = 0; t < k; t++) sb.append(inner);
            } else {
                sb.append(c);
                i++;
            }
        }
        return sb.toString();
    }
}`,
      time: 'O(output length)', space: 'O(depth + output)',
    },
    optimal: {
      idea: 'Iterative two-stack approach.',
      code: J`import java.util.*;

class Solution {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> strings = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                k = k * 10 + (c - '0');
            } else if (c == '[') {
                counts.push(k);
                strings.push(cur);
                cur = new StringBuilder();
                k = 0;
            } else if (c == ']') {
                int times = counts.pop();
                StringBuilder prev = strings.pop();
                for (int t = 0; t < times; t++) prev.append(cur);
                cur = prev;
            } else {
                cur.append(c);
            }
        }
        return cur.toString();
    }
}`,
      time: 'O(output length)', space: 'O(output length)',
    },
    lines: [
      ["k = k * 10 + (c - '0');", 'Build multi-digit counts like "10".'],
      ["else if (c == '[') { counts.push(k); strings.push(cur); ... }", 'Save context: how many times to repeat, and what came before.'],
      ['cur = new StringBuilder(); k = 0;', 'Start decoding the inner string fresh.'],
      ["else if (c == ']') { ... prev.append(cur) times ... cur = prev; }", 'Expand the inner string and append it to the saved outer string.'],
      ['else cur.append(c);', 'Plain letters.'],
    ],
    cx: 'Work is proportional to the size of the decoded output (each character is appended once per repetition).',
    dry: ['"3[a2[c]]"', '3 → [ push(3,"")', 'a → cur="a"', '2 → [ push(2,"a"), cur=""', 'c → cur="c"', '] → "a" + "cc" = "acc"', '] → "" + "acc"×3 → "accaccacc"'],
    tips: ['Both stack and recursion are accepted; the stack version avoids recursion depth issues.'],
    mistakes: ['Assuming single-digit counts.'],
    java: ['`String.repeat(n)` (Java 11+) is handy: `cur.toString().repeat(times)`.'],
  },
  {
    id: 'asteroid-collision',
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    desc: "We are given an array `asteroids` of integers representing asteroids in a row. The absolute value is its size; the sign is its direction (positive = right, negative = left). Each asteroid moves at the same speed.\n\nWhen two asteroids meet, the smaller one explodes. If both are the same size, both explode. Two asteroids moving in the same direction never meet. Return the state of the asteroids after all collisions.",
    ex: [
      ['asteroids = [5,10,-5]', '[5,10]', '10 and -5 collide → 10 survives.'],
      ['asteroids = [8,-8]', '[]', 'Same size → both explode.'],
      ['asteroids = [10,2,-5]', '[10]', '2 and -5 → -5 survives; then 10 and -5 → 10 survives.'],
    ],
    cons: ['2 <= asteroids.length <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    fn: { name: 'asteroidCollision', params: [['int[]', 'asteroids']], ret: 'int[]' },
    tests: [
      { in: [[5, 10, -5]], out: [5, 10] },
      { in: [[8, -8]], out: [] },
      { in: [[10, 2, -5]], out: [10] },
      { in: [[-2, -1, 1, 2]], out: [-2, -1, 1, 2] },
      { in: [[1, -2, -2, -2]], out: [-2, -2, -2] },
      { in: [[3, 5, -6, 2, -1, 4]], out: [-6, 2, 4] },
    ],
    hints: [
      'Only a right-moving asteroid followed by a left-moving one can collide.',
      'Process left to right with a stack of surviving asteroids.',
      'For a negative asteroid, while the top is positive and smaller, pop it. If equal, pop and destroy both. If the top is larger and positive, the new one dies. Otherwise push.',
    ],
    brute: {
      idea: 'Repeatedly scan for an adjacent (+, -) pair and resolve it until no collisions remain.',
      code: J`import java.util.*;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        List<Integer> list = new ArrayList<>();
        for (int a : asteroids) list.add(a);
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int i = 0; i + 1 < list.size(); i++) {
                int a = list.get(i), b = list.get(i + 1);
                if (a > 0 && b < 0) {
                    if (a > -b) list.remove(i + 1);
                    else if (a < -b) list.remove(i);
                    else { list.remove(i + 1); list.remove(i); }
                    changed = true;
                    break;
                }
            }
        }
        return list.stream().mapToInt(Integer::intValue).toArray();
    }
}`,
      time: 'O(n^2)', space: 'O(n)',
    },
    optimal: {
      idea: 'Stack simulation; each asteroid is pushed and popped at most once.',
      code: J`import java.util.*;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
                int top = stack.peek();
                if (top < -a) {
                    stack.pop();
                } else if (top == -a) {
                    stack.pop();
                    alive = false;
                } else {
                    alive = false;
                }
            }
            if (alive) stack.push(a);
        }
        int[] res = new int[stack.size()];
        for (int i = res.length - 1; i >= 0; i--) res[i] = stack.pop();
        return res;
    }
}`,
      time: 'O(n)', space: 'O(n)',
    },
    lines: [
      ['while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0)', 'Collision only when the new asteroid moves left and the top moves right.'],
      ['if (top < -a) stack.pop();', 'Top is smaller → it explodes; keep checking.'],
      ['else if (top == -a) { stack.pop(); alive = false; }', 'Equal sizes → both explode.'],
      ['else alive = false;', 'Top is larger → new asteroid explodes.'],
      ['for (int i = res.length - 1; i >= 0; i--) res[i] = stack.pop();', 'The stack top is the rightmost asteroid, so fill from the back.'],
    ],
    cx: 'Each asteroid is pushed once and popped at most once → O(n). Stack O(n).',
    dry: ['[10,2,-5]', 'push 10, push 2', '-5: 2 < 5 → pop 2; 10 > 5 → -5 dies', 'result [10]'],
    tips: ['State the collision condition precisely (top > 0 && current < 0) — [-2, 2] never collide.'],
    mistakes: ['Treating (negative, positive) as a collision.'],
    java: ['Popping a Deque used as a stack returns elements in reverse insertion order.'],
  },
];
