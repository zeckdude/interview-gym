import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs03ArraysBasics: Lesson = {
  id: 'lesson-js-03-arrays-basics',
  title: 'Arrays — Create, Index & Mutate',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 7,
  relatedChallengeIds: ['fe-16-flat-array', 'fe-17-unique-array'],
  estimatedMinutes: 13,
  concepts: ['arrays', 'indexing', 'length', 'push', 'pop'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Lists of users, cart items, API results — almost everything in JS apps is an **array**. Interview warm-ups constantly use arrays before asking you to transform them.

You must know indexing, \`.length\`, and basic mutators (\`push\`, \`pop\`, \`shift\`, \`unshift\`) before \`map\` or \`filter\`.
      `,
    },
    {
      type: 'explanation',
      title: 'How Arrays Work',
      content: `
**Create:** \`const nums = [1, 2, 3];\` — zero-indexed, ordered, can hold mixed types.

**Access:** \`nums[0]\` → first element; \`nums[nums.length - 1]\` → last.

**Mutators (change the array):**

- \`push(x)\` — add to end
- \`pop()\` — remove from end
- \`shift()\` — remove from start
- \`unshift(x)\` — add to start

**Non-mutating:** \`slice\`, \`concat\`, \`spread [...arr]\` — return new arrays.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `const items = ['a', 'b', 'c'];

items[0];           // 'a'
items.length;       // 3
items.push('d');    // ['a','b','c','d']
items.slice(1, 3);  // ['b','c'] — original unchanged`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "Remove first item without mutating"
const original = [1, 2, 3];
const withoutFirst = original.slice(1);

// Interviewer: "Is this an array?"
typeof [];              // "object"
Array.isArray([]);        // true — always use this`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**\`arr.slice() vs arr.splice()\`.** \`slice\` is non-mutating; \`splice\` mutates in place. Mixing them up is a common mistake in live coding.

**Sparse arrays:** \`delete arr[1]\` leaves a hole — use \`splice\` to actually shrink length.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Arrays',
      content: `
**Key-value lookups by ID** — use a \`Map\` or object when you need O(1) access by key, not \`.find()\` on every lookup.

**Fixed-size collections** — \`Set\` for unique values is clearer than manual dedup.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-03-arrays-basics',
    prompt: `Implement \`firstAndLast(arr)\` — return \`[first, last]\` or \`[]\` if empty.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function firstAndLast(arr) {
  // Implement this function
  
}`,
      typescript: `function firstAndLast<T>(arr: T[]): T[] {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function firstAndLast(arr) {
  if (arr.length === 0) return [];
  return [arr[0], arr[arr.length - 1]];
}`,
      typescript: `function firstAndLast<T>(arr: T[]): T[] {
  if (arr.length === 0) return [];
  return [arr[0], arr[arr.length - 1]];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(arr: unknown[]) => unknown[]>(userCode, 'firstAndLast');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      return testCases([
        { actual: JSON.stringify(result.value([1, 2, 3])), expected: JSON.stringify([1, 3]) },
        { actual: JSON.stringify(result.value([])), expected: JSON.stringify([]) },
        { actual: JSON.stringify(result.value(['solo'])), expected: JSON.stringify(['solo', 'solo']) },
      ]);
    },
  },
  mdnLinks: [
    { label: 'Array — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
    { label: 'Array.isArray — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
