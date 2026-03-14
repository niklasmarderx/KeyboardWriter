/**
 * Algorithm Exercises Data
 * Classic algorithms and data structure implementations for typing practice
 */

import { CodeSnippet } from './programmingExercises';

// Sorting Algorithms
export const SORTING_ALGORITHMS: CodeSnippet[] = [
  {
    id: 'algo-bubble-sort',
    language: 'typescript',
    title: 'Bubble Sort',
    description: 'Einfacher Sortieralgorithmus - O(n²)',
    code: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'algo-quick-sort',
    language: 'typescript',
    title: 'Quick Sort',
    description: 'Schneller Divide-and-Conquer Algorithmus - O(n log n)',
    code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'algo-merge-sort',
    language: 'typescript',
    title: 'Merge Sort',
    description: 'Stabiler Sortieralgorithmus - O(n log n)',
    code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'algo-insertion-sort',
    language: 'typescript',
    title: 'Insertion Sort',
    description: 'Gut für kleine oder fast sortierte Arrays - O(n²)',
    code: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    difficulty: 'beginner',
  },
];

// Search Algorithms
export const SEARCH_ALGORITHMS: CodeSnippet[] = [
  {
    id: 'algo-binary-search',
    language: 'typescript',
    title: 'Binary Search',
    description: 'Effiziente Suche in sortiertem Array - O(log n)',
    code: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'algo-binary-search-recursive',
    language: 'typescript',
    title: 'Binary Search (Rekursiv)',
    description: 'Rekursive Variante der binären Suche',
    code: `function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1
): number {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  
  return binarySearchRecursive(arr, target, left, mid - 1);
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'algo-dfs',
    language: 'typescript',
    title: 'Depth-First Search (DFS)',
    description: 'Tiefensuche in einem Graphen',
    code: `function dfs(
  graph: Map<number, number[]>,
  start: number,
  visited = new Set<number>()
): number[] {
  visited.add(start);
  const result = [start];
  
  for (const neighbor of graph.get(start) || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfs(graph, neighbor, visited));
    }
  }
  
  return result;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'algo-bfs',
    language: 'typescript',
    title: 'Breadth-First Search (BFS)',
    description: 'Breitensuche in einem Graphen',
    code: `function bfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>([start]);
  const queue: number[] = [start];
  const result: number[] = [];
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
    difficulty: 'intermediate',
  },
];

// Data Structures
export const DATA_STRUCTURES: CodeSnippet[] = [
  {
    id: 'ds-stack',
    language: 'typescript',
    title: 'Stack Implementation',
    description: 'LIFO Datenstruktur',
    code: `class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  size(): number {
    return this.items.length;
  }
}`,
    difficulty: 'beginner',
  },
  {
    id: 'ds-queue',
    language: 'typescript',
    title: 'Queue Implementation',
    description: 'FIFO Datenstruktur',
    code: `class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  front(): T | undefined {
    return this.items[0];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  size(): number {
    return this.items.length;
  }
}`,
    difficulty: 'beginner',
  },
  {
    id: 'ds-linked-list',
    language: 'typescript',
    title: 'Linked List',
    description: 'Verkettete Liste',
    code: `class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null
  ) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  
  append(value: T): void {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
  
  prepend(value: T): void {
    this.head = new ListNode(value, this.head);
  }
  
  find(value: T): ListNode<T> | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'ds-binary-tree',
    language: 'typescript',
    title: 'Binary Tree',
    description: 'Binärer Baum mit Traversierung',
    code: `class TreeNode<T> {
  constructor(
    public value: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

function inorderTraversal<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.value,
    ...inorderTraversal(root.right)
  ];
}

function preorderTraversal<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];
  return [
    root.value,
    ...preorderTraversal(root.left),
    ...preorderTraversal(root.right)
  ];
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'ds-hash-map',
    language: 'typescript',
    title: 'Hash Map',
    description: 'Einfache HashMap Implementierung',
    code: `class HashMap<K, V> {
  private buckets: Map<number, [K, V][]> = new Map();
  private size = 0;
  
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 100);
  }
  
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets.get(index) || [];
    const existing = bucket.find(([k]) => k === key);
    
    if (existing) {
      existing[1] = value;
    } else {
      bucket.push([key, value]);
      this.size++;
    }
    this.buckets.set(index, bucket);
  }
  
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets.get(index);
    return bucket?.find(([k]) => k === key)?.[1];
  }
}`,
    difficulty: 'advanced',
  },
];

// Dynamic Programming
export const DYNAMIC_PROGRAMMING: CodeSnippet[] = [
  {
    id: 'dp-fibonacci',
    language: 'typescript',
    title: 'Fibonacci (DP)',
    description: 'Fibonacci mit Memoization',
    code: `function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  
  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Iterative Version
function fibonacciIterative(n: number): number {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'dp-knapsack',
    language: 'typescript',
    title: 'Knapsack Problem',
    description: '0/1 Rucksackproblem',
    code: `function knapsack(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const n = weights.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
    difficulty: 'advanced',
  },
  {
    id: 'dp-longest-common-subsequence',
    language: 'typescript',
    title: 'Longest Common Subsequence',
    description: 'LCS - Längste gemeinsame Teilfolge',
    code: `function lcs(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
    difficulty: 'advanced',
  },
  {
    id: 'dp-coin-change',
    language: 'typescript',
    title: 'Coin Change',
    description: 'Minimale Münzen für Betrag',
    code: `function coinChange(coins: number[], amount: number): number {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    difficulty: 'intermediate',
  },
];

// LeetCode Style Problems
export const LEETCODE_PROBLEMS: CodeSnippet[] = [
  {
    id: 'lc-two-sum',
    language: 'typescript',
    title: 'Two Sum',
    description: 'LeetCode #1 - Finde zwei Zahlen mit gegebener Summe',
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
    difficulty: 'beginner',
  },
  {
    id: 'lc-valid-parentheses',
    language: 'typescript',
    title: 'Valid Parentheses',
    description: 'LeetCode #20 - Prüfe ob Klammern gültig sind',
    code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'lc-merge-intervals',
    language: 'typescript',
    title: 'Merge Intervals',
    description: 'LeetCode #56 - Überlappende Intervalle zusammenführen',
    code: `function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const current = intervals[i];
    
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  
  return result;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'lc-max-subarray',
    language: 'typescript',
    title: 'Maximum Subarray',
    description: "LeetCode #53 - Kadane's Algorithm",
    code: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'lc-reverse-linked-list',
    language: 'typescript',
    title: 'Reverse Linked List',
    description: 'LeetCode #206 - Liste umkehren',
    code: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
    difficulty: 'beginner',
  },
];

// All Algorithm Snippets Combined
export const ALL_ALGORITHM_SNIPPETS: CodeSnippet[] = [
  ...SORTING_ALGORITHMS,
  ...SEARCH_ALGORITHMS,
  ...DATA_STRUCTURES,
  ...DYNAMIC_PROGRAMMING,
  ...LEETCODE_PROBLEMS,
];

// Categories for UI display
export const ALGORITHM_CATEGORIES = [
  { id: 'sorting', name: 'Sortierung', icon: '↕️', snippets: SORTING_ALGORITHMS },
  { id: 'search', name: 'Suche', icon: 'search', snippets: SEARCH_ALGORITHMS },
  { id: 'data-structures', name: 'Datenstrukturen', icon: 'box', snippets: DATA_STRUCTURES },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: 'calc',
    snippets: DYNAMIC_PROGRAMMING,
  },
  { id: 'leetcode', name: 'LeetCode', icon: 'code', snippets: LEETCODE_PROBLEMS },
];
