import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs05ArrayMethods: Lesson = {
  id: 'lesson-js-05-array-methods',
  title: 'Array Methods — map, filter & reduce',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 16,
  relatedChallengeIds: ['fe-18-group-by', 'fe-25-partition-array'],
  estimatedMinutes: 14,
  concepts: ['map', 'filter', 'reduce', 'higher-order functions'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Real interview tasks rarely use raw \`for\` loops — they expect **map**, **filter**, and **reduce**. Transform API data, filter active users, sum cart totals: all three methods appear in almost every frontend loop question.
      `,
    },
    {
      type: 'explanation',
      title: 'How Array Methods Work',
      content: `
All three take a **callback** and return a **new value** (map/filter return arrays; reduce returns anything).

- **map(fn)** — transform each item → new array of same length
- **filter(fn)** — keep items where fn returns truthy
- **reduce(fn, init)** — accumulate to a single value

**They don't mutate** the original array.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `const nums = [1, 2, 3, 4];

nums.map((n) => n * 2);           // [2, 4, 6, 8]
nums.filter((n) => n % 2 === 0);  // [2, 4]
nums.reduce((sum, n) => sum + n, 0); // 10`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Build groupBy with reduce (common follow-up)
const users = [
  { name: 'Ada', role: 'admin' },
  { name: 'Bob', role: 'user' },
];

users.reduce((groups, user) => {
  const key = user.role;
  if (!groups[key]) groups[key] = [];
  groups[key].push(user);
  return groups;
}, {});`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Chaining map + filter inefficiently** — filter first if fewer items pass, then map. Or use one \`reduce\` when building complex structures.

**Forgetting reduce's initial value** — without it, the first element becomes the accumulator (dangerous with empty arrays).
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use reduce',
      content: `
**When map or filter alone is clearer** — don't force everything into reduce for cleverness. Readability wins in interviews.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-05-array-methods',
    prompt: `Implement \`doubleAll(arr)\` — return a new array with each number doubled (use \`.map\`).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function doubleAll(arr) {
  // Implement this function
  
}`,
      typescript: `function doubleAll(arr: number[]): number[] {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function doubleAll(arr) {
  return arr.map((n) => n * 2);
}`,
      typescript: `function doubleAll(arr: number[]): number[] {
  return arr.map((n) => n * 2);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(arr: number[]) => number[]>(userCode, 'doubleAll');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      return testCases([
        { actual: JSON.stringify(result.value([1, 2, 3])), expected: JSON.stringify([2, 4, 6]) },
        { actual: JSON.stringify(result.value([])), expected: JSON.stringify([]) },
      ]);
    },
  },
  mdnLinks: [
    { label: 'Array.prototype.map — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map' },
    { label: 'Array.prototype.reduce — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
