import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe18GroupBy: Lesson = {
  id: 'lesson-fe-18-group-by',
  title: 'Group By Key',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 17,
  relatedChallengeIds: ['fe-18-group-by'],
  estimatedMinutes: 13,
  concepts: ['reduce', 'objects', 'grouping'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Group orders by status, users by role, or events by date — **groupBy** is lodash's most-used utility and a classic \`reduce\` interview question.
      `,
    },
    {
      type: 'explanation',
      title: 'How groupBy Works',
      content: `
For each item, compute a key with \`keyFn\`. If the key doesn't exist in the result object, create an empty array. Push the item into that array.

Return \`Record<string, T[]>\`.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `const orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'shipped' },
  { id: 3, status: 'pending' },
];
groupBy(orders, (o) => o.status);
// { pending: [...], shipped: [...] }`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Forgetting to initialize the array** — \`groups[key].push(item)\` throws if you skip \`if (!groups[key]) groups[key] = []\`.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use groupBy',
      content: `
**When you only need counts** — use \`reduce\` to increment numbers, not arrays of items.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-18-group-by',
    prompt: `Implement \`groupBy(arr, keyFn)\` — group items into arrays keyed by \`keyFn(item)\`.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function groupBy(arr, keyFn) {
  // Implement this function
  
}`,
      typescript: `function groupBy<T>(arr: T[], keyFn: (item: T) => string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}`,
      typescript: `function groupBy<T>(arr: T[], keyFn: (item: T) => string) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'groupBy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('groupBy', `return Boolean(
          JSON.stringify(groupBy([{r:'a'},{r:'b'},{r:'a'}], x => x.r)) ===
          JSON.stringify({a:[{r:'a'},{r:'a'}], b:[{r:'b'}]})
        )`);
        return testRunner(result.value)
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Array.prototype.reduce — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
