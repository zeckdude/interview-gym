import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe30StableSortBy: Lesson = {
  id: 'lesson-fe-30-stable-sort-by',
  title: 'Stable Sort By Key',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-30-stable-sort-by'],
  estimatedMinutes: 14,
  concepts: ['sorting', 'stability', 'arrays'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You're sorting a leaderboard where many users have the same score. When scores tie, **original registration order** must be preserved — the user who signed up first stays first.

**Stable sorting** means equal elements keep their relative order. JavaScript's \`Array.sort\` has been stable since ES2019, but interviewers still ask you to implement \`sortBy\` with explicit stability guarantees.
      `,
    },
    {
      type: 'explanation',
      title: 'How Stable Sort By Works',
      content: `
**Stability:** if \`keyFn(a) === keyFn(b)\`, then \`a\` must appear before \`b\` in the output iff \`a\` was before \`b\` in the input.

The classic trick — **decorate, sort, undecorate**:

1. Map each item to \`{ item, index }\` (capture original position)
2. Sort by \`keyFn(item)\`, breaking ties with \`index\`
3. Map back to just the items

**Why index as tiebreaker?** Lower index = appeared earlier in input = should stay first when keys are equal.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function stableSortBy(arr, keyFn) {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const keyA = keyFn(a.item);
      const keyB = keyFn(b.item);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return a.index - b.index; // tiebreaker: original order
    })
    .map(({ item }) => item);
}

const items = [
  { name: 'a', score: 1 },
  { name: 'b', score: 1 },
  { name: 'c', score: 0 },
];
stableSortBy(items, (x) => x.score);
// => [{ name: 'c', score: 0 }, { name: 'a', score: 1 }, { name: 'b', score: 1 }]`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "Can you sort descending?"
function stableSortBy(arr, keyFn, descending = false) {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const keyA = keyFn(a.item);
      const keyB = keyFn(b.item);
      let cmp = keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
      if (descending) cmp = -cmp;
      return cmp !== 0 ? cmp : a.index - b.index;
    })
    .map(({ item }) => item);
}

// Interviewer: "Is JS sort stable?"
// Yes, since ES2019 (V8 70+). But implement explicitly to show you understand WHY.`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Sorting without a tiebreaker** — \`arr.sort((a, b) => keyFn(a) - keyFn(b))\` may reorder equal elements in older JS engines or when the comparator returns 0 inconsistently.

**Mutating the original array** — \`.sort()\` sorts in place. Use \`[...arr]\` or the decorate-sort-undecorate pattern on a copy if immutability matters.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Stable Sort',
      content: `
**When order among equals truly doesn't matter**, a plain \`sort\` is simpler and slightly faster.

**When sorting large datasets**, consider whether you need a full sort or just a top-K heap — O(n log n) vs O(n log k).
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-30-stable-sort-by',
    prompt: `Implement \`stableSortBy(arr, keyFn)\` — sort by a key function without reordering equal elements.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function stableSortBy(arr, keyFn) {
  // Implement this function
  
}`,
      typescript: `function stableSortBy(arr: { name: string; score: number }[], keyFn: (item: { name: string; score: number }) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function stableSortBy(arr, keyFn) {
  return arr
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = keyFn(a.item) < keyFn(b.item) ? -1 : keyFn(a.item) > keyFn(b.item) ? 1 : 0;
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);
}`,
      typescript: `function stableSortBy(arr: { name: string; score: number }[], keyFn: (item: { name: string; score: number }) => number) {
  return arr
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = keyFn(a.item) < keyFn(b.item) ? -1 : keyFn(a.item) > keyFn(b.item) ? 1 : 0;
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'stableSortBy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('stableSortBy', `return Boolean((function () {
                  const items = [{ name: 'a', score: 1 }, { name: 'b', score: 1 }, { name: 'c', score: 0 }];
                  const sorted = stableSortBy(items, (x) => x.score);
                  return sorted.map((x) => x.name).join(',') === 'c,a,b';
                })());`);
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Array.prototype.sort — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort' },
    { label: 'Stable sort — MDN Glossary', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
