import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe30StableSortBy: Lesson = {
  id: 'lesson-fe-30-stable-sort-by',
  title: 'Stable Sort By Key',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-30-stable-sort-by'],
  estimatedMinutes: 10,
  concepts: ["sorting","stability","arrays"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Stable Sort By Key** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** sorting, stability, arrays
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function stableSortBy(arr, keyFn) {
  return arr
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = keyFn(a.item) < keyFn(b.item) ? -1 : keyFn(a.item) > keyFn(b.item) ? 1 : 0;
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **sorting**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
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
    { label: 'Stable Sort By Key', url: 'https://developer.mozilla.org/' }
  ],
};
