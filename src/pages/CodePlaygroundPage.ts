/**
 * Code Playground Page
 * Type code and see it execute in real-time
 */

import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus } from '../core';
import { ConfettiService, PythonService, SoundService } from '../services';

/* eslint-disable @typescript-eslint/no-implied-eval */

type Language = 'javascript' | 'python' | 'java' | 'typescript';

// Track Pyodide loading state
let pyodideLoadingPromise: Promise<void> | null = null;

interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  language: Language;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

const CODE_CHALLENGES: CodeChallenge[] = [
  // ==========================================
  // JAVASCRIPT CHALLENGES
  // ==========================================
  {
    id: 'js-hello',
    title: 'Hello World',
    description: 'Write a function that returns "Hello World".',
    language: 'javascript',
    starterCode:
      'function hello() {\n  // Your code here\n  // Tip: Use "return" to return a value\n}',
    solution: 'function hello() {\n  return "Hello World";\n}',
    expectedOutput: 'Hello World',
    hints: [
      'Use the "return" statement to return a value',
      'The string must be exactly "Hello World" (with capital H and W)',
      'Strings are written in quotes: "Hello World"',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'js-sum',
    title: 'Sum of Two Numbers',
    description: 'Write a function that adds two numbers. Test: sum(2, 3) should return 5.',
    language: 'javascript',
    starterCode: 'function sum(a, b) {\n  // Add parameters a and b\n  // and return the result\n}',
    solution: 'function sum(a, b) {\n  return a + b;\n}',
    expectedOutput: '5',
    hints: [
      'Parameters are the values in parentheses: function sum(a, b)',
      'Use the + operator to add: a + b',
      'Do not forget return! Without return the function returns undefined',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-multiply',
    title: 'Multiplication',
    description: 'Multiply two numbers. Test: multiply(4, 5) should return 20.',
    language: 'javascript',
    starterCode: 'function multiply(a, b) {\n  // Multiply a with b\n}',
    solution: 'function multiply(a, b) {\n  return a * b;\n}',
    expectedOutput: '20',
    hints: [
      'The multiplication operator in JavaScript is *',
      'Example: 3 * 4 equals 12',
      'return a * b; returns the result',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'js-max',
    title: 'Find Maximum',
    description: 'Find the larger of two numbers. Test: max(7, 3) should return 7.',
    language: 'javascript',
    starterCode: 'function max(a, b) {\n  // Return the larger number\n}',
    solution: 'function max(a, b) {\n  return a > b ? a : b;\n}',
    expectedOutput: '7',
    hints: [
      'You can use if/else or the ternary operator',
      'Ternary operator: condition ? valueIfTrue : valueIfFalse',
      'Or: Math.max(a, b) is a built-in function',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-even',
    title: 'Is Even?',
    description: 'Check if a number is even. Test: isEven(4) should return true.',
    language: 'javascript',
    starterCode:
      'function isEven(n) {\n  // Return true if n is even\n  // Return false if n is odd\n}',
    solution: 'function isEven(n) {\n  return n % 2 === 0;\n}',
    expectedOutput: 'true',
    hints: [
      'The modulo operator % returns the remainder of a division',
      'Example: 4 % 2 = 0 (no remainder = even)',
      'Example: 5 % 2 = 1 (remainder 1 = odd)',
      'Compare with === 0 to check if remainder is 0',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-factorial',
    title: 'Factorial',
    description: 'Calculate the factorial of a number (n!). Test: factorial(5) should return 120.',
    language: 'javascript',
    starterCode:
      'function factorial(n) {\n  // Factorial: n! = n * (n-1) * (n-2) * ... * 1\n  // Example: 5! = 5 * 4 * 3 * 2 * 1 = 120\n}',
    solution: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
    expectedOutput: '120',
    hints: [
      'Base case: 0! = 1 and 1! = 1',
      'Recursion: n! = n * (n-1)!',
      'Or with loop: let result = 1; for (let i = 2; i <= n; i++) result *= i;',
      '5! = 5 * 4 * 3 * 2 * 1 = 120',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-fizzbuzz',
    title: 'FizzBuzz',
    description: 'Classic interview problem! Test: fizzBuzz(15) should return "FizzBuzz".',
    language: 'javascript',
    starterCode:
      'function fizzBuzz(n) {\n  // "Fizz" if divisible by 3\n  // "Buzz" if divisible by 5\n  // "FizzBuzz" if divisible by both\n  // Otherwise the number as string\n}',
    solution:
      'function fizzBuzz(n) {\n  if (n % 15 === 0) return "FizzBuzz";\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  return n.toString();\n}',
    expectedOutput: 'FizzBuzz',
    hints: [
      'Check divisibility by 15 first (3*5)!',
      '% is the modulo operator: n % 3 === 0 checks divisibility by 3',
      'The order matters: first 15, then 3, then 5',
      'n.toString() converts a number to a string',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'js-reverse',
    title: 'Reverse String',
    description: 'Reverse a string. Test: reverse("hello") should return "olleh".',
    language: 'javascript',
    starterCode: 'function reverse(str) {\n  // Reverse the string\n  // "hello" -> "olleh"\n}',
    solution: 'function reverse(str) {\n  return str.split("").reverse().join("");\n}',
    expectedOutput: 'olleh',
    hints: [
      'str.split("") converts "hello" to ["h","e","l","l","o"]',
      '.reverse() reverses the array: ["o","l","l","e","h"]',
      '.join("") joins it back together: "olleh"',
      'All together: str.split("").reverse().join("")',
    ],
    difficulty: 'medium',
    xp: 20,
  },
  {
    id: 'js-palindrome',
    title: 'Palindrome Check',
    description:
      'Check if a string is a palindrome (forward = backward). Test: isPalindrome("Anna") should return true.',
    language: 'javascript',
    starterCode:
      'function isPalindrome(str) {\n  // A palindrome reads the same forwards and backwards\n  // Ignore case\n}',
    solution:
      'function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
    expectedOutput: 'true',
    hints: [
      'First convert to lowercase: str.toLowerCase()',
      'Optional: Remove special characters with .replace(/[^a-z]/g, "")',
      'Then compare with the reversed version',
      '"anna" === "anna".split("").reverse().join("") -> true',
    ],
    difficulty: 'hard',
    xp: 40,
  },
  {
    id: 'js-fibonacci',
    title: 'Fibonacci',
    description: 'Calculate the n-th Fibonacci number. Test: fibonacci(6) should return 8.',
    language: 'javascript',
    starterCode:
      'function fibonacci(n) {\n  // Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13...\n  // Each number is the sum of the two previous\n  // fibonacci(0) = 0, fibonacci(1) = 1\n}',
    solution:
      'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
    expectedOutput: '8',
    hints: [
      'Base cases: fib(0) = 0, fib(1) = 1',
      'Recursion: fib(n) = fib(n-1) + fib(n-2)',
      'Sequence: 0, 1, 1, 2, 3, 5, 8... so fib(6) = 8',
      'Or solve iteratively with a loop',
    ],
    difficulty: 'hard',
    xp: 35,
  },
  {
    id: 'js-vowels',
    title: 'Count Vowels',
    description: 'Count the vowels in a string. Test: countVowels("Hello World") should return 3.',
    language: 'javascript',
    starterCode: 'function countVowels(str) {\n  // Count a, e, i, o, u (case insensitive)\n}',
    solution: 'function countVowels(str) {\n  return (str.match(/[aeiou]/gi) || []).length;\n}',
    expectedOutput: '3',
    hints: [
      'Vowels are: a, e, i, o, u',
      'With regex: str.match(/[aeiou]/gi) finds all vowels',
      'The "gi" means: global (find all) + case insensitive',
      'Or loop through each character',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-array-sum',
    title: 'Array Sum',
    description:
      'Calculate the sum of all numbers in an array. Test: arraySum([1,2,3,4,5]) should return 15.',
    language: 'javascript',
    starterCode: 'function arraySum(arr) {\n  // Add all numbers in the array\n}',
    solution: 'function arraySum(arr) {\n  return arr.reduce((sum, n) => sum + n, 0);\n}',
    expectedOutput: '15',
    hints: [
      'With reduce: arr.reduce((sum, n) => sum + n, 0)',
      'Or with loop: let sum = 0; for (let n of arr) sum += n;',
      'reduce starts with 0 and adds each number',
    ],
    difficulty: 'medium',
    xp: 20,
  },
  {
    id: 'js-prime',
    title: 'Prime Check',
    description: 'Check if a number is prime. Test: isPrime(17) should return true.',
    language: 'javascript',
    starterCode: 'function isPrime(n) {\n  // A prime number is only divisible by 1 and itself\n}',
    solution:
      'function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}',
    expectedOutput: 'true',
    hints: [
      'Prime numbers are only divisible by 1 and themselves',
      'You only need to check up to the square root of n: Math.sqrt(n)',
      'Numbers < 2 are not prime',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'js-flatten',
    title: 'Flatten Array',
    description:
      'Flatten a nested array. Test: flatten([[1,2],[3,[4,5]]]) should return [1,2,3,4,5].',
    language: 'javascript',
    starterCode: 'function flatten(arr) {\n  // Flatten the array (all levels)\n}',
    solution: 'function flatten(arr) {\n  return arr.flat(Infinity);\n}',
    expectedOutput: '1,2,3,4,5',
    hints: [
      'arr.flat() flattens an array one level',
      'arr.flat(Infinity) flattens all levels',
      'Or recursively with reduce and concat',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-unique',
    title: 'Unique Values',
    description:
      'Remove duplicates from an array. Test: unique([1,2,2,3,3,3]) should return [1,2,3].',
    language: 'javascript',
    starterCode: 'function unique(arr) {\n  // Remove all duplicates\n}',
    solution: 'function unique(arr) {\n  return [...new Set(arr)];\n}',
    expectedOutput: '1,2,3',
    hints: [
      'Set only stores unique values',
      'new Set(arr) removes duplicates',
      '[...new Set(arr)] converts it back to array',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-chunk',
    title: 'Chunk Array',
    description:
      'Split an array into groups. Test: chunk([1,2,3,4,5], 2) should return [[1,2],[3,4],[5]].',
    language: 'javascript',
    starterCode: 'function chunk(arr, size) {\n  // Split arr into groups of size\n}',
    solution:
      'function chunk(arr, size) {\n  const result = [];\n  for (let i = 0; i < arr.length; i += size) {\n    result.push(arr.slice(i, i + size));\n  }\n  return result;\n}',
    expectedOutput: '1,2|3,4|5',
    hints: [
      'Use slice(start, end) to extract parts',
      'Iterate in steps of size',
      'arr.slice(0, 2) returns [1, 2]',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-debounce',
    title: 'Debounce',
    description: 'Implement a debounce function. Test: debounce(() => 42, 100)() should return 42.',
    language: 'javascript',
    starterCode:
      'function debounce(fn, delay) {\n  // Execute fn only when delay ms have passed\n}',
    solution:
      'function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n    return fn(...args);\n  };\n}',
    expectedOutput: '42',
    hints: [
      'Debounce delays execution',
      'Use setTimeout and clearTimeout',
      'Store the timer in a closure',
    ],
    difficulty: 'hard',
    xp: 40,
  },
  {
    id: 'js-curry',
    title: 'Currying',
    description:
      'Implement a curry function for 2 arguments. Test: curry((a,b) => a+b)(2)(3) should return 5.',
    language: 'javascript',
    starterCode: 'function curry(fn) {\n  // Convert fn(a,b) to fn(a)(b)\n}',
    solution:
      'function curry(fn) {\n  return function(a) {\n    return function(b) {\n      return fn(a, b);\n    };\n  };\n}',
    expectedOutput: '5',
    hints: [
      'Currying converts f(a,b) to f(a)(b)',
      'Return nested functions',
      'Each function takes one argument',
    ],
    difficulty: 'hard',
    xp: 45,
  },
  {
    id: 'js-deep-clone',
    title: 'Deep Clone',
    description: 'Create a deep copy of an object. Test: deepClone({a:{b:1}}).a.b should return 1.',
    language: 'javascript',
    starterCode: 'function deepClone(obj) {\n  // Create a deep copy\n}',
    solution: 'function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}',
    expectedOutput: '1',
    hints: [
      'Simplest solution: JSON.parse(JSON.stringify(obj))',
      'Or recursively iterate through all properties',
      'Note: JSON method does not work with functions',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'js-memoize',
    title: 'Memoization',
    description: 'Implement memoization. Test: memoize(x => x*2)(5) should return 10.',
    language: 'javascript',
    starterCode: 'function memoize(fn) {\n  // Cache results for same inputs\n}',
    solution:
      'function memoize(fn) {\n  const cache = {};\n  return function(x) {\n    if (cache[x] === undefined) cache[x] = fn(x);\n    return cache[x];\n  };\n}',
    expectedOutput: '10',
    hints: [
      'Memoization stores computed results',
      'Use an object as cache',
      'Check if value is already in cache',
    ],
    difficulty: 'hard',
    xp: 40,
  },
  {
    id: 'js-compose',
    title: 'Function Compose',
    description:
      'Compose functions. Test: compose(x=>x+1, x=>x*2)(3) should return 7 (first *2, then +1).',
    language: 'javascript',
    starterCode: 'function compose(f, g) {\n  // compose(f, g)(x) = f(g(x))\n}',
    solution: 'function compose(f, g) {\n  return function(x) {\n    return f(g(x));\n  };\n}',
    expectedOutput: '7',
    hints: [
      'compose(f, g)(x) means f(g(x))',
      'g is executed first, then f',
      '3 * 2 = 6, then 6 + 1 = 7',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'js-binary-search',
    title: 'Binary Search',
    description:
      'Implement binary search. Test: binarySearch([1,3,5,7,9], 5) should return 2 (index).',
    language: 'javascript',
    starterCode:
      'function binarySearch(arr, target) {\n  // Find the index of target in sorted arr\n}',
    solution:
      'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    expectedOutput: '2',
    hints: [
      'Binary search halves the search range each time',
      'Compare the middle element with target',
      'O(log n) instead of O(n) with linear search',
    ],
    difficulty: 'hard',
    xp: 45,
  },
  {
    id: 'js-anagram',
    title: 'Anagram Check',
    description:
      'Check if two strings are anagrams. Test: isAnagram("listen", "silent") should return true.',
    language: 'javascript',
    starterCode: 'function isAnagram(s1, s2) {\n  // Anagrams have the same letters\n}',
    solution:
      'function isAnagram(s1, s2) {\n  return s1.split("").sort().join("") === s2.split("").sort().join("");\n}',
    expectedOutput: 'true',
    hints: [
      'Anagrams have the same letters in different order',
      'Sort both strings and compare',
      'split("").sort().join("")',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-gcd',
    title: 'Greatest Common Divisor',
    description: 'Calculate the GCD. Test: gcd(48, 18) should return 6.',
    language: 'javascript',
    starterCode: 'function gcd(a, b) {\n  // Greatest common divisor (Euclid)\n}',
    solution: 'function gcd(a, b) {\n  return b === 0 ? a : gcd(b, a % b);\n}',
    expectedOutput: '6',
    hints: [
      'Euclidean algorithm: gcd(a, b) = gcd(b, a mod b)',
      'Base case: gcd(a, 0) = a',
      'Recursion or loop possible',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-power',
    title: 'Power',
    description: 'Calculate the power. Test: power(2, 10) should return 1024.',
    language: 'javascript',
    starterCode: 'function power(base, exp) {\n  // Calculate base^exp without Math.pow\n}',
    solution:
      'function power(base, exp) {\n  if (exp === 0) return 1;\n  if (exp < 0) return 1 / power(base, -exp);\n  return base * power(base, exp - 1);\n}',
    expectedOutput: '1024',
    hints: [
      'Recursion: power(2, 3) = 2 * power(2, 2)',
      'Base case: power(x, 0) = 1',
      '2^10 = 1024',
    ],
    difficulty: 'easy',
    xp: 20,
  },
  {
    id: 'js-merge-sorted',
    title: 'Merge Sorted Arrays',
    description:
      'Merge two sorted arrays. Test: mergeSorted([1,3,5], [2,4,6]) should return [1,2,3,4,5,6].',
    language: 'javascript',
    starterCode: 'function mergeSorted(a, b) {\n  // Merge two sorted arrays\n}',
    solution:
      'function mergeSorted(a, b) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] < b[j]) result.push(a[i++]);\n    else result.push(b[j++]);\n  }\n  return result.concat(a.slice(i)).concat(b.slice(j));\n}',
    expectedOutput: '1,2,3,4,5,6',
    hints: [
      'Compare the first elements of both arrays',
      'Add the smaller one and move forward',
      'At the end: concat for remaining elements',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'js-rotate-array',
    title: 'Rotate Array',
    description:
      'Rotate an array by k positions. Test: rotate([1,2,3,4,5], 2) should return [4,5,1,2,3].',
    language: 'javascript',
    starterCode: 'function rotate(arr, k) {\n  // Rotate arr by k positions to the right\n}',
    solution:
      'function rotate(arr, k) {\n  k = k % arr.length;\n  return arr.slice(-k).concat(arr.slice(0, -k));\n}',
    expectedOutput: '4,5,1,2,3',
    hints: [
      'slice(-k) gives the last k elements',
      'slice(0, -k) gives all except the last k',
      'k % arr.length for k > arr.length',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'js-intersection',
    title: 'Array Intersection',
    description: 'Find common elements. Test: intersection([1,2,3], [2,3,4]) should return [2,3].',
    language: 'javascript',
    starterCode: 'function intersection(a, b) {\n  // Find elements that are in both arrays\n}',
    solution: 'function intersection(a, b) {\n  return a.filter(x => b.includes(x));\n}',
    expectedOutput: '2,3',
    hints: [
      'filter() filters elements by condition',
      'includes() checks if an element is contained',
      'a.filter(x => b.includes(x))',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-title-case',
    title: 'Title Case',
    description:
      'Convert string to Title Case. Test: titleCase("hello world") should return "Hello World".',
    language: 'javascript',
    starterCode: 'function titleCase(str) {\n  // Capitalize first letter of each word\n}',
    solution:
      'function titleCase(str) {\n  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");\n}',
    expectedOutput: 'Hello World',
    hints: [
      'split(" ") splits by spaces',
      'charAt(0).toUpperCase() capitalizes first letter',
      'slice(1) gives the rest of the string',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'js-camel-case',
    title: 'Camel Case',
    description:
      'Convert string to camelCase. Test: toCamelCase("hello_world") should return "helloWorld".',
    language: 'javascript',
    starterCode: 'function toCamelCase(str) {\n  // Convert snake_case to camelCase\n}',
    solution:
      'function toCamelCase(str) {\n  return str.split("_").map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join("");\n}',
    expectedOutput: 'helloWorld',
    hints: [
      'split("_") splits by underscores',
      'First word stays lowercase (index 0)',
      'Other words: first letter uppercase',
    ],
    difficulty: 'medium',
    xp: 20,
  },
  // ==========================================
  // PYTHON CHALLENGES
  // ==========================================
  {
    id: 'py-hello',
    title: 'Hello Python',
    description: 'Write a function that returns "Hello Python".',
    language: 'python',
    starterCode:
      'def hello():\n    # Your code here\n    # Use "return" to return a value\n    pass  # Remove this line',
    solution: 'def hello():\n    return "Hello Python"',
    expectedOutput: 'Hello Python',
    hints: [
      '"pass" is a placeholder in Python - remove it!',
      'Use "return" to return a value',
      'Example: return "Hello Python"',
      'Watch the indentation (4 spaces)',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'py-add',
    title: 'Addition',
    description: 'Add two numbers. Test: add(3, 4) should return 7.',
    language: 'python',
    starterCode: 'def add(a, b):\n    # Add a and b\n    pass',
    solution: 'def add(a, b):\n    return a + b',
    expectedOutput: '7',
    hints: [
      'The + operator works like in JavaScript',
      'return a + b returns the sum',
      'Remove "pass" and write your code',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'py-list-sum',
    title: 'List Sum',
    description:
      'Calculate the sum of all elements in a list. Test: list_sum([1,2,3,4,5]) should return 15.',
    language: 'python',
    starterCode: 'def list_sum(numbers):\n    # Sum all numbers in the list\n    pass',
    solution: 'def list_sum(numbers):\n    return sum(numbers)',
    expectedOutput: '15',
    hints: [
      'Python has a built-in sum() function!',
      'sum([1, 2, 3]) returns 6',
      'Or with loop: total = 0; for n in numbers: total += n',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-max',
    title: 'Find Maximum',
    description:
      'Find the largest element in a list. Test: find_max([3, 7, 2, 9, 1]) should return 9.',
    language: 'python',
    starterCode: 'def find_max(numbers):\n    # Find the largest number\n    pass',
    solution: 'def find_max(numbers):\n    return max(numbers)',
    expectedOutput: '9',
    hints: [
      'Python has a built-in max() function!',
      'max([1, 5, 3]) returns 5',
      'Or manually compare with a loop',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-even',
    title: 'Is Even?',
    description: 'Check if a number is even. Test: is_even(8) should return True.',
    language: 'python',
    starterCode: 'def is_even(n):\n    # Return True if n is even\n    pass',
    solution: 'def is_even(n):\n    return n % 2 == 0',
    expectedOutput: 'True',
    hints: [
      '% is the modulo operator (remainder of division)',
      'n % 2 == 0 is True if n is even',
      'In Python: True/False instead of true/false (capitalized!)',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-reverse',
    title: 'Reverse String',
    description: 'Reverse a string. Test: reverse_string("python") should return "nohtyp".',
    language: 'python',
    starterCode: 'def reverse_string(s):\n    # Reverse the string\n    pass',
    solution: 'def reverse_string(s):\n    return s[::-1]',
    expectedOutput: 'nohtyp',
    hints: [
      'Python has an elegant solution: s[::-1]',
      '[::-1] is slicing with step -1 (backwards)',
      'Or: "".join(reversed(s))',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-factorial',
    title: 'Factorial',
    description: 'Calculate the factorial. Test: factorial(5) should return 120.',
    language: 'python',
    starterCode: 'def factorial(n):\n    # n! = n * (n-1) * ... * 1\n    # 5! = 120\n    pass',
    solution:
      'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)',
    expectedOutput: '120',
    hints: [
      'Base case: 0! = 1! = 1',
      'Recursion: n! = n * (n-1)!',
      'Or: import math; math.factorial(n)',
      'Or with loop: result = 1; for i in range(2, n+1): result *= i',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-fizzbuzz',
    title: 'FizzBuzz',
    description: 'The famous interview problem! Test: fizz_buzz(15) should return "FizzBuzz".',
    language: 'python',
    starterCode:
      'def fizz_buzz(n):\n    # "Fizz" if divisible by 3\n    # "Buzz" if divisible by 5\n    # "FizzBuzz" if divisible by both\n    # Otherwise the number as string\n    pass',
    solution:
      'def fizz_buzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    if n % 3 == 0:\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    return str(n)',
    expectedOutput: 'FizzBuzz',
    hints: [
      'Check divisibility by 15 first (= by 3 and 5)!',
      'n % 15 == 0 checks divisibility by 15',
      'str(n) converts a number to string',
      'The order of if-statements matters!',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'py-palindrome',
    title: 'Palindrome',
    description:
      'Check if a string is a palindrome. Test: is_palindrome("Anna") should return True.',
    language: 'python',
    starterCode: 'def is_palindrome(s):\n    # Forward = Backward?\n    # Ignore case\n    pass',
    solution: 'def is_palindrome(s):\n    clean = s.lower()\n    return clean == clean[::-1]',
    expectedOutput: 'True',
    hints: [
      's.lower() makes everything lowercase',
      's[::-1] reverses the string',
      '"anna" == "anna"[::-1] -> True',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-fibonacci',
    title: 'Fibonacci',
    description: 'Calculate the n-th Fibonacci number. Test: fibonacci(7) should return 13.',
    language: 'python',
    starterCode:
      'def fibonacci(n):\n    # 0, 1, 1, 2, 3, 5, 8, 13...\n    # fib(0)=0, fib(1)=1\n    pass',
    solution:
      'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)',
    expectedOutput: '13',
    hints: [
      'Base cases: fib(0) = 0, fib(1) = 1',
      'Recursion: fib(n) = fib(n-1) + fib(n-2)',
      'Sequence: 0, 1, 1, 2, 3, 5, 8, 13... so fib(7) = 13',
    ],
    difficulty: 'hard',
    xp: 35,
  },
  {
    id: 'py-count-vowels',
    title: 'Count Vowels',
    description: 'Count the vowels in a string. Test: count_vowels("Hello World") should return 3.',
    language: 'python',
    starterCode: 'def count_vowels(s):\n    # Count a, e, i, o, u\n    pass',
    solution: 'def count_vowels(s):\n    return sum(1 for c in s.lower() if c in "aeiou")',
    expectedOutput: '3',
    hints: [
      'Vowels: a, e, i, o, u',
      'With loop: count = 0; for c in s.lower(): if c in "aeiou": count += 1',
      'Or elegant: sum(1 for c in s.lower() if c in "aeiou")',
    ],
    difficulty: 'medium',
    xp: 20,
  },
  {
    id: 'py-prime',
    title: 'Prime Check',
    description: 'Check if a number is prime. Test: is_prime(17) should return True.',
    language: 'python',
    starterCode:
      'def is_prime(n):\n    # A prime number is only divisible by 1 and itself\n    pass',
    solution:
      'def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
    expectedOutput: 'True',
    hints: [
      'Only check up to the square root of n',
      'n**0.5 is the square root',
      'range(2, int(n**0.5) + 1)',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'py-flatten',
    title: 'Flatten List',
    description: 'Flatten a nested list. Test: flatten([[1,2],[3,4]]) should return [1,2,3,4].',
    language: 'python',
    starterCode: 'def flatten(lst):\n    # Flatten the list (one level)\n    pass',
    solution: 'def flatten(lst):\n    return [item for sublist in lst for item in sublist]',
    expectedOutput: '[1, 2, 3, 4]',
    hints: [
      'List comprehension with two for loops',
      '[item for sublist in lst for item in sublist]',
      'Or: sum(lst, []) as a trick',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-unique',
    title: 'Unique Values',
    description: 'Remove duplicates. Test: unique([1,2,2,3,3,3]) should return [1,2,3].',
    language: 'python',
    starterCode: 'def unique(lst):\n    # Remove all duplicates\n    pass',
    solution: 'def unique(lst):\n    return list(set(lst))',
    expectedOutput: '[1, 2, 3]',
    hints: [
      'set() only stores unique values',
      'list(set(lst)) converts back to list',
      'Note: Order may change',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-anagram',
    title: 'Anagram Check',
    description:
      'Check if two strings are anagrams. Test: is_anagram("listen", "silent") should return True.',
    language: 'python',
    starterCode: 'def is_anagram(s1, s2):\n    # Anagrams have the same letters\n    pass',
    solution: 'def is_anagram(s1, s2):\n    return sorted(s1) == sorted(s2)',
    expectedOutput: 'True',
    hints: [
      'sorted() sorts a string as a list',
      'Compare the sorted versions',
      'sorted("abc") == ["a", "b", "c"]',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-gcd',
    title: 'Greatest Common Divisor',
    description: 'Calculate the GCD. Test: gcd(48, 18) should return 6.',
    language: 'python',
    starterCode: 'def gcd(a, b):\n    # Greatest common divisor\n    pass',
    solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a',
    expectedOutput: '6',
    hints: ['Euclidean algorithm', 'while b: a, b = b, a % b', 'Or: import math; math.gcd(a, b)'],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-binary-search',
    title: 'Binary Search',
    description: 'Implement binary search. Test: binary_search([1,3,5,7,9], 5) should return 2.',
    language: 'python',
    starterCode: 'def binary_search(arr, target):\n    # Find the index of target\n    pass',
    solution:
      'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
    expectedOutput: '2',
    hints: ['Halve the search range each time', 'mid = (left + right) // 2', 'O(log n) complexity'],
    difficulty: 'hard',
    xp: 45,
  },
  {
    id: 'py-merge-sorted',
    title: 'Merge Sorted Lists',
    description:
      'Merge two sorted lists. Test: merge_sorted([1,3,5], [2,4,6]) should return [1,2,3,4,5,6].',
    language: 'python',
    starterCode: 'def merge_sorted(a, b):\n    # Merge two sorted lists\n    pass',
    solution: 'def merge_sorted(a, b):\n    return sorted(a + b)',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    hints: [
      'Simplest solution: sorted(a + b)',
      'Or: heapq.merge(a, b)',
      'Manual: use two pointers',
    ],
    difficulty: 'easy',
    xp: 20,
  },
  {
    id: 'py-power',
    title: 'Power',
    description: 'Calculate power recursively. Test: power(2, 10) should return 1024.',
    language: 'python',
    starterCode: 'def power(base, exp):\n    # Calculate base^exp recursively\n    pass',
    solution:
      'def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)',
    expectedOutput: '1024',
    hints: ['Base case: x^0 = 1', 'Recursion: x^n = x * x^(n-1)', '2^10 = 2 * 2^9 = ...'],
    difficulty: 'easy',
    xp: 20,
  },
  {
    id: 'py-intersection',
    title: 'List Intersection',
    description: 'Find common elements. Test: intersection([1,2,3], [2,3,4]) should return [2,3].',
    language: 'python',
    starterCode: 'def intersection(a, b):\n    # Find elements that are in both lists\n    pass',
    solution: 'def intersection(a, b):\n    return list(set(a) & set(b))',
    expectedOutput: '[2, 3]',
    hints: [
      'set(a) & set(b) is the intersection',
      'list() converts back to list',
      'Or: [x for x in a if x in b]',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-rotate',
    title: 'Rotate List',
    description:
      'Rotate a list by k positions. Test: rotate([1,2,3,4,5], 2) should return [4,5,1,2,3].',
    language: 'python',
    starterCode: 'def rotate(lst, k):\n    # Rotate by k positions to the right\n    pass',
    solution: 'def rotate(lst, k):\n    k = k % len(lst)\n    return lst[-k:] + lst[:-k]',
    expectedOutput: '[4, 5, 1, 2, 3]',
    hints: [
      'lst[-k:] are the last k elements',
      'lst[:-k] are all except the last k',
      'k % len(lst) for k > len(lst)',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-title-case',
    title: 'Title Case',
    description:
      'Convert string to Title Case. Test: title_case("hello world") should return "Hello World".',
    language: 'python',
    starterCode: 'def title_case(s):\n    # Capitalize first letter of each word\n    pass',
    solution: 'def title_case(s):\n    return s.title()',
    expectedOutput: 'Hello World',
    hints: [
      'Python has a built-in title() method',
      's.title() capitalizes each word',
      'Or: " ".join(w.capitalize() for w in s.split())',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'py-zip-dict',
    title: 'Lists to Dict',
    description:
      'Create a dict from two lists. Test: lists_to_dict(["a","b"], [1,2]) should return {"a":1,"b":2}.',
    language: 'python',
    starterCode: 'def lists_to_dict(keys, values):\n    # Create a dictionary\n    pass',
    solution: 'def lists_to_dict(keys, values):\n    return dict(zip(keys, values))',
    expectedOutput: "{'a': 1, 'b': 2}",
    hints: [
      'zip() combines two lists pairwise',
      'dict(zip(keys, values)) creates the dict',
      'zip(["a","b"], [1,2]) = [("a",1), ("b",2)]',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'py-word-freq',
    title: 'Word Frequency',
    description: 'Count word frequencies. Test: word_freq("a b a") should return {"a":2,"b":1}.',
    language: 'python',
    starterCode: 'def word_freq(s):\n    # Count how often each word appears\n    pass',
    solution:
      'def word_freq(s):\n    freq = {}\n    for word in s.split():\n        freq[word] = freq.get(word, 0) + 1\n    return freq',
    expectedOutput: "{'a': 2, 'b': 1}",
    hints: [
      'split() splits by spaces',
      'dict.get(key, 0) returns 0 if key does not exist',
      'Or: from collections import Counter',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'py-matrix-transpose',
    title: 'Transpose Matrix',
    description: 'Transpose a matrix. Test: transpose([[1,2],[3,4]]) should return [[1,3],[2,4]].',
    language: 'python',
    starterCode: 'def transpose(matrix):\n    # Rows become columns\n    pass',
    solution: 'def transpose(matrix):\n    return [list(row) for row in zip(*matrix)]',
    expectedOutput: '[[1, 3], [2, 4]]',
    hints: [
      'zip(*matrix) unpacks and zips the rows',
      '*matrix is the unpack operator',
      'zip([1,2], [3,4]) = [(1,3), (2,4)]',
    ],
    difficulty: 'hard',
    xp: 35,
  },
  {
    id: 'py-chunk',
    title: 'Chunk List',
    description:
      'Split a list into groups. Test: chunk([1,2,3,4,5], 2) should return [[1,2],[3,4],[5]].',
    language: 'python',
    starterCode: 'def chunk(lst, size):\n    # Split lst into groups of size\n    pass',
    solution: 'def chunk(lst, size):\n    return [lst[i:i+size] for i in range(0, len(lst), size)]',
    expectedOutput: '[[1, 2], [3, 4], [5]]',
    hints: [
      'Use slicing: lst[i:i+size]',
      'range(0, len(lst), size) iterates in steps',
      'List comprehension for compact solution',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  // ==========================================
  // JAVA CHALLENGES (Type-only verification)
  // ==========================================
  {
    id: 'java-hello',
    title: 'Hello Java',
    description: 'Write a method that returns "Hello Java". Type the solution exactly.',
    language: 'java',
    starterCode: 'public String hello() {\n    // Your code here\n}',
    solution: 'public String hello() {\n    return "Hello Java";\n}',
    expectedOutput: 'Hello Java',
    hints: [
      'Use the "return" statement to return a value',
      'Strings in Java use double quotes',
      'The method signature is already provided',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'java-sum',
    title: 'Sum of Two Numbers',
    description: 'Add two integers and return the result.',
    language: 'java',
    starterCode: 'public int sum(int a, int b) {\n    // Add a and b\n}',
    solution: 'public int sum(int a, int b) {\n    return a + b;\n}',
    expectedOutput: '5',
    hints: [
      'Java is strongly typed - int + int = int',
      'Use return a + b; to return the sum',
      'Note the return type: int',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'java-max',
    title: 'Find Maximum',
    description: 'Return the larger of two numbers.',
    language: 'java',
    starterCode: 'public int max(int a, int b) {\n    // Return the larger number\n}',
    solution: 'public int max(int a, int b) {\n    return a > b ? a : b;\n}',
    expectedOutput: '7',
    hints: [
      'Use the ternary operator: condition ? ifTrue : ifFalse',
      'Or use Math.max(a, b)',
      'Or use if-else statements',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'java-even',
    title: 'Is Even?',
    description: 'Check if a number is even. Return true if even, false if odd.',
    language: 'java',
    starterCode: 'public boolean isEven(int n) {\n    // Return true if n is even\n}',
    solution: 'public boolean isEven(int n) {\n    return n % 2 == 0;\n}',
    expectedOutput: 'true',
    hints: [
      'Use the modulo operator %',
      'n % 2 == 0 means n is divisible by 2',
      'Return type is boolean (true/false)',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'java-factorial',
    title: 'Factorial',
    description: 'Calculate factorial recursively. factorial(5) = 120.',
    language: 'java',
    starterCode: 'public int factorial(int n) {\n    // n! = n * (n-1) * ... * 1\n}',
    solution:
      'public int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}',
    expectedOutput: '120',
    hints: [
      'Base case: if n <= 1, return 1',
      'Recursive case: n * factorial(n - 1)',
      'Be careful with int overflow for large n',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'java-fizzbuzz',
    title: 'FizzBuzz',
    description: 'Return "FizzBuzz" if divisible by 15, "Fizz" if by 3, "Buzz" if by 5.',
    language: 'java',
    starterCode: 'public String fizzBuzz(int n) {\n    // Classic interview problem\n}',
    solution:
      'public String fizzBuzz(int n) {\n    if (n % 15 == 0) return "FizzBuzz";\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    return String.valueOf(n);\n}',
    expectedOutput: 'FizzBuzz',
    hints: [
      'Check divisibility by 15 first',
      'Use String.valueOf(n) to convert int to String',
      'Order of conditions matters!',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'java-reverse',
    title: 'Reverse String',
    description: 'Reverse a string. "hello" becomes "olleh".',
    language: 'java',
    starterCode: 'public String reverse(String s) {\n    // Reverse the string\n}',
    solution:
      'public String reverse(String s) {\n    return new StringBuilder(s).reverse().toString();\n}',
    expectedOutput: 'olleh',
    hints: [
      'Use StringBuilder for efficient string operations',
      'StringBuilder has a reverse() method',
      'Convert back to String with toString()',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'java-palindrome',
    title: 'Palindrome Check',
    description: 'Check if a string is a palindrome (case insensitive).',
    language: 'java',
    starterCode:
      'public boolean isPalindrome(String s) {\n    // Check if s reads same forwards and backwards\n}',
    solution:
      'public boolean isPalindrome(String s) {\n    String clean = s.toLowerCase();\n    String reversed = new StringBuilder(clean).reverse().toString();\n    return clean.equals(reversed);\n}',
    expectedOutput: 'true',
    hints: [
      'Convert to lowercase with toLowerCase()',
      'Reverse with StringBuilder',
      'Compare with equals(), not ==',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'java-fibonacci',
    title: 'Fibonacci',
    description: 'Calculate the n-th Fibonacci number. fibonacci(6) = 8.',
    language: 'java',
    starterCode: 'public int fibonacci(int n) {\n    // 0, 1, 1, 2, 3, 5, 8...\n}',
    solution:
      'public int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}',
    expectedOutput: '8',
    hints: [
      'Base cases: fib(0) = 0, fib(1) = 1',
      'Recursive: fib(n) = fib(n-1) + fib(n-2)',
      'Consider iterative approach for efficiency',
    ],
    difficulty: 'hard',
    xp: 35,
  },
  {
    id: 'java-prime',
    title: 'Prime Check',
    description: 'Check if a number is prime. isPrime(17) = true.',
    language: 'java',
    starterCode:
      'public boolean isPrime(int n) {\n    // Prime numbers are only divisible by 1 and themselves\n}',
    solution:
      'public boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i <= Math.sqrt(n); i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}',
    expectedOutput: 'true',
    hints: [
      'Numbers less than 2 are not prime',
      'Only check up to sqrt(n)',
      'Use Math.sqrt() for square root',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'java-binary-search',
    title: 'Binary Search',
    description: 'Find index of target in sorted array. Return -1 if not found.',
    language: 'java',
    starterCode:
      'public int binarySearch(int[] arr, int target) {\n    // Find target in sorted array\n}',
    solution:
      'public int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}',
    expectedOutput: '2',
    hints: [
      'Use two pointers: left and right',
      'Calculate mid = (left + right) / 2',
      'Narrow search space based on comparison',
    ],
    difficulty: 'hard',
    xp: 45,
  },
  {
    id: 'java-gcd',
    title: 'Greatest Common Divisor',
    description: 'Calculate GCD using Euclidean algorithm.',
    language: 'java',
    starterCode: 'public int gcd(int a, int b) {\n    // Euclidean algorithm\n}',
    solution: 'public int gcd(int a, int b) {\n    return b == 0 ? a : gcd(b, a % b);\n}',
    expectedOutput: '6',
    hints: [
      'Base case: gcd(a, 0) = a',
      'Recursive: gcd(a, b) = gcd(b, a % b)',
      'Can also use iterative approach',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  // ==========================================
  // TYPESCRIPT CHALLENGES (Type-only verification)
  // ==========================================
  {
    id: 'ts-hello',
    title: 'Hello TypeScript',
    description: 'Write a typed function that returns "Hello TypeScript".',
    language: 'typescript',
    starterCode: 'function hello(): string {\n  // Your code here\n}',
    solution: 'function hello(): string {\n  return "Hello TypeScript";\n}',
    expectedOutput: 'Hello TypeScript',
    hints: [
      'The return type is specified after the parentheses: (): string',
      'Use return to return a value',
      'TypeScript is JavaScript with types',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'ts-sum',
    title: 'Typed Sum',
    description: 'Add two numbers with proper type annotations.',
    language: 'typescript',
    starterCode: 'function sum(a: number, b: number): number {\n  // Add a and b\n}',
    solution: 'function sum(a: number, b: number): number {\n  return a + b;\n}',
    expectedOutput: '5',
    hints: [
      'Parameter types come after the colon: a: number',
      'Return type comes after parentheses: ): number',
      'TypeScript ensures type safety at compile time',
    ],
    difficulty: 'easy',
    xp: 10,
  },
  {
    id: 'ts-interface',
    title: 'User Interface',
    description: 'Define an interface and use it to type a function parameter.',
    language: 'typescript',
    starterCode:
      'interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  // Return "Hello, {name}!"\n}',
    solution:
      'interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return `Hello, ${user.name}!`;\n}',
    expectedOutput: 'Hello, Alice!',
    hints: [
      'Interfaces define the shape of objects',
      'Use template literals: `Hello, ${user.name}!`',
      'Access properties with dot notation',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'ts-generic',
    title: 'Generic Function',
    description: 'Write a generic function that returns the first element of an array.',
    language: 'typescript',
    starterCode: 'function first<T>(arr: T[]): T | undefined {\n  // Return first element\n}',
    solution: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}',
    expectedOutput: '1',
    hints: [
      'T is a type parameter (generic)',
      'T[] means an array of type T',
      'T | undefined handles empty arrays',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'ts-union',
    title: 'Union Types',
    description: 'Write a function that handles both string and number inputs.',
    language: 'typescript',
    starterCode:
      'function format(value: string | number): string {\n  // Return value as formatted string\n}',
    solution:
      'function format(value: string | number): string {\n  return typeof value === "string" ? value.toUpperCase() : value.toFixed(2);\n}',
    expectedOutput: 'HELLO',
    hints: [
      'Union type: string | number accepts both',
      'Use typeof to check the type at runtime',
      'toFixed(2) formats number with 2 decimals',
    ],
    difficulty: 'medium',
    xp: 25,
  },
  {
    id: 'ts-optional',
    title: 'Optional Parameters',
    description: 'Write a function with an optional parameter.',
    language: 'typescript',
    starterCode:
      'function greetUser(name: string, greeting?: string): string {\n  // Use "Hello" as default greeting\n}',
    solution:
      'function greetUser(name: string, greeting?: string): string {\n  return `${greeting ?? "Hello"}, ${name}!`;\n}',
    expectedOutput: 'Hello, World!',
    hints: [
      '? makes a parameter optional',
      'Use ?? (nullish coalescing) for default value',
      'Optional params must come after required ones',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'ts-type-guard',
    title: 'Type Guard',
    description: 'Write a type guard function to check if value is a string.',
    language: 'typescript',
    starterCode:
      'function isString(value: unknown): value is string {\n  // Check if value is a string\n}',
    solution:
      'function isString(value: unknown): value is string {\n  return typeof value === "string";\n}',
    expectedOutput: 'true',
    hints: [
      '"value is string" is a type predicate',
      'Type guards help TypeScript narrow types',
      'Use typeof for primitive checks',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'ts-readonly',
    title: 'Readonly Array',
    description: 'Use readonly to prevent array modification.',
    language: 'typescript',
    starterCode:
      'function sum(numbers: readonly number[]): number {\n  // Sum all numbers without modifying array\n}',
    solution:
      'function sum(numbers: readonly number[]): number {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}',
    expectedOutput: '15',
    hints: [
      'readonly prevents push, pop, etc.',
      'reduce() does not modify the array',
      'Good for function parameters',
    ],
    difficulty: 'easy',
    xp: 15,
  },
  {
    id: 'ts-enum',
    title: 'Enum Usage',
    description: 'Use an enum to represent directions.',
    language: 'typescript',
    starterCode:
      'enum Direction {\n  Up,\n  Down,\n  Left,\n  Right\n}\n\nfunction move(dir: Direction): string {\n  // Return direction name\n}',
    solution:
      'enum Direction {\n  Up,\n  Down,\n  Left,\n  Right\n}\n\nfunction move(dir: Direction): string {\n  return Direction[dir];\n}',
    expectedOutput: 'Up',
    hints: [
      'Enums map names to numbers by default',
      'Direction[0] gives "Up"',
      'Reverse lookup: Direction[dir]',
    ],
    difficulty: 'medium',
    xp: 20,
  },
  {
    id: 'ts-mapped-type',
    title: 'Partial Type',
    description: 'Use Partial to make all properties optional.',
    language: 'typescript',
    starterCode:
      'interface Config {\n  host: string;\n  port: number;\n}\n\nfunction mergeConfig(base: Config, overrides: Partial<Config>): Config {\n  // Merge configs\n}',
    solution:
      'interface Config {\n  host: string;\n  port: number;\n}\n\nfunction mergeConfig(base: Config, overrides: Partial<Config>): Config {\n  return { ...base, ...overrides };\n}',
    expectedOutput: 'localhost:8080',
    hints: [
      'Partial<T> makes all properties optional',
      'Use spread operator to merge objects',
      'Later properties override earlier ones',
    ],
    difficulty: 'medium',
    xp: 30,
  },
  {
    id: 'ts-keyof',
    title: 'KeyOf Operator',
    description: 'Use keyof to safely access object properties.',
    language: 'typescript',
    starterCode:
      'function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  // Return property value\n}',
    solution:
      'function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}',
    expectedOutput: 'Alice',
    hints: [
      'keyof T gives union of property names',
      'K extends keyof T limits K to valid keys',
      'T[K] is the type of that property',
    ],
    difficulty: 'hard',
    xp: 40,
  },
  {
    id: 'ts-class',
    title: 'TypeScript Class',
    description: 'Create a class with typed properties and methods.',
    language: 'typescript',
    starterCode:
      'class Counter {\n  private count: number = 0;\n\n  increment(): void {\n    // Increase count by 1\n  }\n\n  getCount(): number {\n    // Return current count\n  }\n}',
    solution:
      'class Counter {\n  private count: number = 0;\n\n  increment(): void {\n    this.count++;\n  }\n\n  getCount(): number {\n    return this.count;\n  }\n}',
    expectedOutput: '1',
    hints: [
      'private makes property inaccessible outside class',
      'void means function returns nothing',
      'Use this.count to access instance property',
    ],
    difficulty: 'medium',
    xp: 25,
  },
];

export class CodePlaygroundPage {
  private keyboard: VirtualKeyboard | null = null;
  private currentChallenge: CodeChallenge | null = null;
  private userCode: string = '';
  private output: string = '';
  private isRunning: boolean = false;
  private showHints: boolean = false;
  private currentHintIndex: number = 0;
  private completedChallenges: Set<string> = new Set();

  constructor() {
    this.loadCompletedChallenges();
  }

  /**
   * Load completed challenges from localStorage
   */
  private loadCompletedChallenges(): void {
    try {
      const stored = localStorage.getItem('keyboardwriter_completed_challenges');
      if (stored) {
        this.completedChallenges = new Set(JSON.parse(stored) as string[]);
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Save completed challenges
   */
  private saveCompletedChallenges(): void {
    try {
      localStorage.setItem(
        'keyboardwriter_completed_challenges',
        JSON.stringify([...this.completedChallenges])
      );
    } catch {
      // Ignore errors
    }
  }

  /**
   * Render the page
   */
  render(): string {
    return `
      <div class="code-playground-container">
        ${this.renderHeader()}
        <div class="playground-content">
          ${this.renderChallengeList()}
          ${this.renderCodeEditor()}
        </div>
        ${this.renderKeyboard()}
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    const completed = this.completedChallenges.size;
    const total = CODE_CHALLENGES.length;
    const progress = Math.round((completed / total) * 100);

    return `
      <div class="playground-header">
        <div class="header-left">
          <h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            Code Playground
          </h1>
          <p>Type code and see it execute in real-time</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">${completed}/${total}</span>
            <span class="stat-label">Challenges</span>
          </div>
          <div class="stat">
            <div class="progress-ring" style="--progress: ${progress}%">
              <span>${progress}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render challenge list
   */
  private renderChallengeList(): string {
    const jsChallenges = CODE_CHALLENGES.filter(c => c.language === 'javascript');
    const pyChallenges = CODE_CHALLENGES.filter(c => c.language === 'python');
    const javaChallenges = CODE_CHALLENGES.filter(c => c.language === 'java');
    const tsChallenges = CODE_CHALLENGES.filter(c => c.language === 'typescript');

    return `
      <div class="challenge-list">
        <h3>JavaScript</h3>
        <div class="challenge-items">
          ${jsChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">Python</h3>
        <div class="challenge-items">
          ${pyChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">Java</h3>
        <div class="challenge-items">
          ${javaChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">TypeScript</h3>
        <div class="challenge-items">
          ${tsChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render single challenge item
   */
  private renderChallengeItem(challenge: CodeChallenge): string {
    const isCompleted = this.completedChallenges.has(challenge.id);
    const isActive = this.currentChallenge?.id === challenge.id;
    const difficultyColors = {
      easy: 'var(--accent-success)',
      medium: 'var(--accent-warning)',
      hard: 'var(--accent-error)',
    };

    return `
      <button class="challenge-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-challenge="${challenge.id}">
        <div class="challenge-status">
          ${
            isCompleted
              ? `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-success)" stroke="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `
              : `
            <span class="difficulty-dot" style="background: ${difficultyColors[challenge.difficulty]}"></span>
          `
          }
        </div>
        <div class="challenge-info">
          <span class="challenge-title">${challenge.title}</span>
          <span class="challenge-xp">+${challenge.xp} XP</span>
        </div>
      </button>
    `;
  }

  /**
   * Render code editor
   */
  private renderCodeEditor(): string {
    if (!this.currentChallenge) {
      return `
        <div class="code-editor-panel empty">
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            <h3>Select a Challenge</h3>
            <p>Click on a challenge on the left to start</p>
          </div>
        </div>
      `;
    }

    const challenge = this.currentChallenge;
    const languageIcons: Record<Language, string> = {
      javascript: 'JS',
      python: 'PY',
      java: 'JAVA',
      typescript: 'TS',
    };

    // Determine if this is a type-only challenge (Java/TypeScript)
    const isTypeOnly = challenge.language === 'java' || challenge.language === 'typescript';

    return `
      <div class="code-editor-panel">
        <div class="challenge-header">
          <div class="challenge-title-row">
            <span class="language-badge ${challenge.language}">${languageIcons[challenge.language]}</span>
            <h2>${challenge.title}</h2>
          </div>
          <p class="challenge-description">${challenge.description}</p>
          <div class="challenge-meta">
            <span class="difficulty ${challenge.difficulty}">${challenge.difficulty}</span>
            <span class="xp-badge">+${challenge.xp} XP</span>
            ${isTypeOnly ? '<span class="type-only-badge">Type to verify</span>' : ''}
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-header">
            <span>Code Editor</span>
            <div class="editor-actions">
              <button class="btn-icon" id="btn-reset-code" title="Reset code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1,4 1,10 7,10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
              <button class="btn-icon" id="btn-show-solution" title="Show solution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="code-input-area" id="code-input-area">
            <textarea 
              id="code-textarea" 
              class="code-textarea"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
            >${this.userCode || challenge.starterCode}</textarea>
          </div>
        </div>

        <div class="output-container">
          <div class="output-header">
            <span>Output</span>
            <button class="btn btn-primary btn-sm" id="btn-run-code" ${this.isRunning ? 'disabled' : ''}>
              ${this.isRunning ? 'Running...' : isTypeOnly ? 'Verify Code' : 'Run Code'}
            </button>
          </div>
          <div class="output-area" id="output-area">
            ${this.output ? `<pre>${this.escapeHtml(this.output)}</pre>` : `<span class="placeholder">Click "${isTypeOnly ? 'Verify Code' : 'Run Code'}" to see the output</span>`}
          </div>
        </div>

        ${
          this.showHints
            ? this.renderHints()
            : `
          <button class="btn btn-ghost btn-sm" id="btn-show-hints" style="margin-top: var(--space-2);">
             Show hint
          </button>
        `
        }
      </div>
    `;
  }

  /**
   * Render hints
   */
  private renderHints(): string {
    if (!this.currentChallenge) {
      return '';
    }
    const hints = this.currentChallenge.hints;

    return `
      <div class="hints-container">
        <h4>Hints</h4>
        ${hints
          .slice(0, this.currentHintIndex + 1)
          .map(
            (hint, i) => `
          <div class="hint-item">
            <span class="hint-number">${i + 1}</span>
            <span>${hint}</span>
          </div>
        `
          )
          .join('')}
        ${
          this.currentHintIndex < hints.length - 1
            ? `
          <button class="btn btn-ghost btn-sm" id="btn-next-hint">
            Next hint (${this.currentHintIndex + 2}/${hints.length})
          </button>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Render keyboard
   */
  private renderKeyboard(): string {
    return `
      <div class="keyboard-section" style="margin-top: var(--space-4);">
        <div id="playground-keyboard"></div>
      </div>
    `;
  }

  /**
   * Render styles
   */
  private renderStyles(): string {
    return `
      <style>
        .code-playground-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .playground-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-2xl);
        }

        .playground-header p {
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .header-stats {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }

        .header-stats .stat {
          text-align: center;
        }

        .header-stats .stat-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .header-stats .stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .progress-ring {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: conic-gradient(
            var(--accent-primary) var(--progress),
            var(--bg-tertiary) var(--progress)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-sm);
          font-weight: bold;
        }

        .progress-ring::before {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-primary);
        }

        .progress-ring span {
          position: relative;
          z-index: 1;
        }

        .playground-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-4);
        }

        .challenge-list {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          max-height: 600px;
          overflow-y: auto;
        }

        .challenge-list h3 {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .challenge-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .challenge-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
          color: var(--text-primary);
        }

        .challenge-item:hover {
          background: var(--bg-tertiary);
        }

        .challenge-item.active {
          background: var(--accent-primary);
          color: white;
        }

        .challenge-item.completed .challenge-title {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .challenge-status {
          width: 20px;
          display: flex;
          justify-content: center;
        }

        .difficulty-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .challenge-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .challenge-title {
          font-size: var(--font-size-sm);
        }

        .challenge-xp {
          font-size: var(--font-size-xs);
          color: var(--accent-warning);
        }

        .challenge-item.active .challenge-xp {
          color: rgba(255,255,255,0.8);
        }

        .code-editor-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .code-editor-panel.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
        }

        .empty-state h3 {
          margin-top: var(--space-4);
          color: var(--text-secondary);
        }

        .challenge-header {
          margin-bottom: var(--space-4);
        }

        .challenge-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .language-badge {
          padding: var(--space-1) var(--space-2);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: bold;
          font-family: var(--font-mono);
        }

        .language-badge.java { background: #007396; }
        .language-badge.typescript { background: #3178c6; }
        .language-badge.python { background: #3776ab; }

        .challenge-description {
          color: var(--text-secondary);
          margin-top: var(--space-2);
        }

        .challenge-meta {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }

        .difficulty {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          text-transform: capitalize;
        }

        .difficulty.easy { background: rgba(34, 197, 94, 0.2); color: var(--accent-success); }
        .difficulty.medium { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); }
        .difficulty.hard { background: rgba(239, 68, 68, 0.2); color: var(--accent-error); }

        .xp-badge {
          padding: var(--space-1) var(--space-2);
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-warning);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
        }

        .type-only-badge {
          padding: var(--space-1) var(--space-2);
          background: rgba(99, 102, 241, 0.2);
          color: var(--accent-primary);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
        }

        .editor-container {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-3);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .editor-actions {
          display: flex;
          gap: var(--space-1);
        }

        .btn-icon {
          padding: var(--space-1);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .code-textarea {
          width: 100%;
          min-height: 200px;
          padding: var(--space-3);
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          line-height: 1.6;
          resize: vertical;
          outline: none;
        }

        .output-container {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .btn-sm {
          padding: var(--space-1) var(--space-3);
          font-size: var(--font-size-sm);
        }

        .output-area {
          padding: var(--space-3);
          min-height: 60px;
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
        }

        .output-area pre {
          margin: 0;
          white-space: pre-wrap;
        }

        .output-area .placeholder {
          color: var(--text-muted);
        }

        .output-area.success {
          background: rgba(34, 197, 94, 0.1);
          border-left: 3px solid var(--accent-success);
        }

        .output-area.error {
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid var(--accent-error);
        }

        .hints-container {
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: rgba(59, 130, 246, 0.1);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--accent-primary);
        }

        .hints-container h4 {
          margin-bottom: var(--space-2);
        }

        .hint-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .hint-number {
          width: 20px;
          height: 20px;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .playground-content {
            grid-template-columns: 1fr;
          }

          .challenge-list {
            max-height: 200px;
            overflow-y: auto;
          }
        }
      </style>
    `;
  }

  /**
   * Initialize the page
   */
  init(): void {
    // Initialize keyboard
    const keyboardContainer = document.getElementById('playground-keyboard');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('playground-keyboard');
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Challenge selection
    document.querySelectorAll('.challenge-item').forEach(item => {
      item.addEventListener('click', () => {
        const challengeId = (item as HTMLElement).dataset.challenge;
        if (challengeId) {
          this.selectChallenge(challengeId);
        }
      });
    });

    // Run code button
    const runBtn = document.getElementById('btn-run-code');
    runBtn?.addEventListener('click', () => this.runCode());

    // Reset code button
    const resetBtn = document.getElementById('btn-reset-code');
    resetBtn?.addEventListener('click', () => this.resetCode());

    // Show solution button
    const solutionBtn = document.getElementById('btn-show-solution');
    solutionBtn?.addEventListener('click', () => this.showSolution());

    // Show hints button
    const hintsBtn = document.getElementById('btn-show-hints');
    hintsBtn?.addEventListener('click', () => {
      this.showHints = true;
      this.updateEditor();
    });

    // Next hint button
    const nextHintBtn = document.getElementById('btn-next-hint');
    nextHintBtn?.addEventListener('click', () => {
      this.currentHintIndex++;
      this.updateEditor();
    });

    // Code textarea
    const textarea = document.getElementById('code-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.userCode = textarea.value;
      });

      // Tab support - insert 3 spaces
      textarea.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value =
            textarea.value.substring(0, start) + '   ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 3;
          this.userCode = textarea.value;
        }
      });
    }
  }

  /**
   * Select a challenge
   */
  private selectChallenge(challengeId: string): void {
    const challenge = CODE_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) {
      return;
    }

    this.currentChallenge = challenge;
    this.userCode = challenge.starterCode;
    this.output = '';
    this.showHints = false;
    this.currentHintIndex = 0;

    this.updateEditor();
    EventBus.emit('nav:change', { page: 'playground' });
  }

  /**
   * Update editor content
   */
  private updateEditor(): void {
    const panel = document.querySelector('.code-editor-panel');
    if (panel) {
      panel.outerHTML = this.renderCodeEditor();
      this.setupEventListeners();
    }
  }

  /**
   * Run the code
   */
  private runCode(): void {
    if (!this.currentChallenge || this.isRunning) {
      return;
    }

    const textarea = document.getElementById('code-textarea') as HTMLTextAreaElement;
    if (textarea) {
      this.userCode = textarea.value;
    }

    this.isRunning = true;
    this.output = '';
    this.updateEditor();

    // Execute code (async for Python, sync for JS, type-check for Java/TS)
    const executeAndHandle = async () => {
      try {
        let result: { output: string; isCorrect: boolean };

        if (this.currentChallenge!.language === 'python') {
          result = await this.executePythonAsync(this.userCode, this.currentChallenge!);
        } else if (
          this.currentChallenge!.language === 'java' ||
          this.currentChallenge!.language === 'typescript'
        ) {
          result = this.verifyTypeOnlyCode(this.userCode, this.currentChallenge!);
        } else {
          result = this.executeCode(this.userCode, this.currentChallenge!);
        }

        this.output = result.output;
        this.isRunning = false;

        // Check if correct
        if (result.isCorrect && !this.completedChallenges.has(this.currentChallenge!.id)) {
          this.completedChallenges.add(this.currentChallenge!.id);
          this.saveCompletedChallenges();

          // Celebrate!
          ConfettiService.celebrate('medium');
          SoundService.playSuccess();

          EventBus.emit('ui:toast', {
            message: `Challenge solved! +${this.currentChallenge!.xp} XP`,
            type: 'success',
          });
        }

        this.updateEditor();

        // Add success/error styling
        const outputArea = document.getElementById('output-area');
        if (outputArea) {
          outputArea.classList.remove('success', 'error');
          outputArea.classList.add(result.isCorrect ? 'success' : 'error');
        }
      } catch (error) {
        this.output = `Error: ${String(error)}`;
        this.isRunning = false;
        this.updateEditor();
      }
    };

    // Small delay for UI update, then execute
    setTimeout(() => {
      void executeAndHandle();
    }, 100);
  }

  /**
   * Verify type-only code (Java/TypeScript) by comparing with solution
   */
  private verifyTypeOnlyCode(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    // Normalize whitespace for comparison
    const normalizeCode = (s: string): string => {
      return s
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '  ')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trim();
    };

    const userNormalized = normalizeCode(code);
    const solutionNormalized = normalizeCode(challenge.solution);

    const isCorrect = userNormalized === solutionNormalized;

    if (isCorrect) {
      return {
        output: `Code verified successfully!\n\nExpected output: ${challenge.expectedOutput}\n\nCorrect!`,
        isCorrect: true,
      };
    } else {
      // Show difference hint
      const userLines = userNormalized.split('\n');
      const solutionLines = solutionNormalized.split('\n');
      let diffLine = -1;

      for (let i = 0; i < Math.max(userLines.length, solutionLines.length); i++) {
        if (userLines[i] !== solutionLines[i]) {
          diffLine = i + 1;
          break;
        }
      }

      return {
        output: `Code does not match expected solution.\n\n${diffLine > 0 ? `Difference found at line ${diffLine}.` : 'Check your code carefully.'}\n\nExpected output: ${challenge.expectedOutput}`,
        isCorrect: false,
      };
    }
  }

  /**
   * Execute code (sandboxed) - for JavaScript only
   */
  private executeCode(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    if (challenge.language === 'javascript') {
      return this.executeJavaScript(code, challenge);
    }
    // Python is handled by executePythonAsync
    return { output: 'Unsupported language', isCorrect: false };
  }

  /**
   * Execute JavaScript code
   */
  private executeJavaScript(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    try {
      // Create a sandboxed function
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function(`
        ${code}
        
        // Test cases based on challenge
        const testCases = {
          'js-hello': () => hello(),
          'js-sum': () => sum(2, 3),
          'js-multiply': () => multiply(4, 5),
          'js-max': () => max(7, 3),
          'js-even': () => isEven(4),
          'js-factorial': () => factorial(5),
          'js-fizzbuzz': () => fizzBuzz(15),
          'js-reverse': () => reverse("hello"),
          'js-palindrome': () => isPalindrome("Anna"),
          'js-fibonacci': () => fibonacci(6),
          'js-vowels': () => countVowels("Hello World"),
          'js-array-sum': () => arraySum([1,2,3,4,5]),
          'js-prime': () => isPrime(17),
          'js-flatten': () => flatten([[1,2],[3,[4,5]]]),
          'js-unique': () => unique([1,2,2,3,3,3]),
          'js-chunk': () => chunk([1,2,3,4,5], 2).map(c => c.join(',')).join('|'),
          'js-debounce': () => debounce(() => 42, 100)(),
          'js-curry': () => curry((a,b) => a+b)(2)(3),
          'js-deep-clone': () => deepClone({a:{b:1}}).a.b,
          'js-memoize': () => memoize(x => x*2)(5),
          'js-compose': () => compose(x=>x+1, x=>x*2)(3),
          'js-binary-search': () => binarySearch([1,3,5,7,9], 5),
          'js-anagram': () => isAnagram("listen", "silent"),
          'js-gcd': () => gcd(48, 18),
          'js-power': () => power(2, 10),
          'js-merge-sorted': () => mergeSorted([1,3,5], [2,4,6]),
          'js-rotate-array': () => rotate([1,2,3,4,5], 2),
          'js-intersection': () => intersection([1,2,3], [2,3,4]),
          'js-title-case': () => titleCase("hello world"),
          'js-camel-case': () => toCamelCase("hello_world"),
        };
        
        return testCases['${challenge.id}']();
      `);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result: unknown = fn();

      // Handle undefined result (function doesn't return anything)
      if (result === undefined) {
        return {
          output:
            'undefined\n\nTip: Your function does not return anything.\nUse "return" to return a value!\n\nExpected: ' +
            challenge.expectedOutput,
          isCorrect: false,
        };
      }

      const output = String(result);
      const isCorrect = output === challenge.expectedOutput;

      // Add helpful message if wrong
      if (!isCorrect) {
        return {
          output: output + '\n\nNot quite right.\nExpected: ' + challenge.expectedOutput,
          isCorrect: false,
        };
      }

      return { output: output + '\n\nCorrect!', isCorrect };
    } catch (error) {
      return { output: `Error: ${(error as Error).message}`, isCorrect: false };
    }
  }

  /**
   * Execute Python code using Pyodide (real execution)
   */
  private async executePythonAsync(
    code: string,
    challenge: CodeChallenge
  ): Promise<{ output: string; isCorrect: boolean }> {
    try {
      // Load Pyodide if not already loaded
      if (!PythonService.isLoaded()) {
        if (!pyodideLoadingPromise) {
          this.output =
            'Loading Python environment (~11 MB)...\nThis may take a moment the first time.';
          this.updateEditor();
          pyodideLoadingPromise = PythonService.load();
        }
        await pyodideLoadingPromise;
      }

      // Build test code based on challenge - all Python challenges
      const testCases: Record<string, { functionName: string; args: unknown[] }> = {
        'py-hello': { functionName: 'hello', args: [] },
        'py-add': { functionName: 'add', args: [3, 4] },
        'py-list-sum': { functionName: 'list_sum', args: [[1, 2, 3, 4, 5]] },
        'py-max': { functionName: 'find_max', args: [[3, 7, 2, 9, 1]] },
        'py-even': { functionName: 'is_even', args: [8] },
        'py-reverse': { functionName: 'reverse_string', args: ['python'] },
        'py-factorial': { functionName: 'factorial', args: [5] },
        'py-fizzbuzz': { functionName: 'fizz_buzz', args: [15] },
        'py-palindrome': { functionName: 'is_palindrome', args: ['Anna'] },
        'py-fibonacci': { functionName: 'fibonacci', args: [7] },
        'py-count-vowels': { functionName: 'count_vowels', args: ['Hello World'] },
        'py-prime': { functionName: 'is_prime', args: [17] },
        'py-flatten': {
          functionName: 'flatten',
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
        },
        'py-unique': { functionName: 'unique', args: [[1, 2, 2, 3, 3, 3]] },
        'py-anagram': { functionName: 'is_anagram', args: ['listen', 'silent'] },
        'py-gcd': { functionName: 'gcd', args: [48, 18] },
        'py-binary-search': { functionName: 'binary_search', args: [[1, 3, 5, 7, 9], 5] },
        'py-merge-sorted': {
          functionName: 'merge_sorted',
          args: [
            [1, 3, 5],
            [2, 4, 6],
          ],
        },
        'py-power': { functionName: 'power', args: [2, 10] },
        'py-intersection': {
          functionName: 'intersection',
          args: [
            [1, 2, 3],
            [2, 3, 4],
          ],
        },
        'py-rotate': { functionName: 'rotate', args: [[1, 2, 3, 4, 5], 2] },
        'py-title-case': { functionName: 'title_case', args: ['hello world'] },
        'py-zip-dict': {
          functionName: 'lists_to_dict',
          args: [
            ['a', 'b'],
            [1, 2],
          ],
        },
        'py-word-freq': { functionName: 'word_freq', args: ['a b a'] },
        'py-matrix-transpose': {
          functionName: 'transpose',
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
        },
        'py-chunk': { functionName: 'chunk', args: [[1, 2, 3, 4, 5], 2] },
      };

      const testCase = testCases[challenge.id];
      if (!testCase) {
        return { output: `Unknown challenge: ${challenge.id}`, isCorrect: false };
      }

      // Execute the code and get result
      const result = await PythonService.executeWithReturn(
        code,
        testCase.functionName,
        testCase.args
      );

      if (result.error) {
        return { output: `Python Error: ${result.error}`, isCorrect: false };
      }

      // Handle None/null result (function doesn't return anything)
      if (result.result === null || result.result === undefined) {
        return {
          output:
            'None\n\nTip: Your function does not return anything.\nRemove "pass" and use "return" to return a value!\n\nExpected: ' +
            challenge.expectedOutput,
          isCorrect: false,
        };
      }

      const output = String(result.result);
      const isCorrect = output === challenge.expectedOutput;

      // Add helpful feedback
      if (!isCorrect) {
        return {
          output: output + '\n\nNot quite right.\nExpected: ' + challenge.expectedOutput,
          isCorrect: false,
        };
      }

      return { output: output + '\n\nCorrect!', isCorrect };
    } catch (error) {
      return { output: `Error: ${(error as Error).message}`, isCorrect: false };
    }
  }

  /**
   * Reset code to starter
   */
  private resetCode(): void {
    if (this.currentChallenge) {
      this.userCode = this.currentChallenge.starterCode;
      this.output = '';
      this.updateEditor();
    }
  }

  /**
   * Show solution
   */
  private showSolution(): void {
    if (this.currentChallenge) {
      this.userCode = this.currentChallenge.solution;
      this.updateEditor();
    }
  }

  /**
   * Escape HTML
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
    }
  }
}
