import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe17UniqueArray: Lesson = {
  id: 'lesson-fe-17-unique-array',
  title: 'Remove Duplicates from Array',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 9,
  relatedChallengeIds: ['fe-17-unique-array'],
  estimatedMinutes: 12,
  concepts: ['arrays', 'Set', 'filter'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Deduplicating tags, user IDs, or event logs is a daily task. Interviewers use it to test **Set**, \`filter\`, and whether you know time/space trade-offs.
      `,
    },
    {
      type: 'explanation',
      title: 'How Deduplication Works',
      content: `
**Set approach:** \`Array.from(new Set(arr))\` — O(n), preserves first occurrence order.

**Filter + Set:** track seen keys for \`uniqueBy(arr, keyFn)\` when deduping objects by a property.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function unique(arr) {
  return Array.from(new Set(arr));
}

unique([1, 2, 2, 3, 1]); // [1, 2, 3]`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**\`[...new Set(arr)]\` vs manual filter** — both work; mention Set is O(n) and preserves first-seen order in modern engines.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Set',
      content: `
**When you need to keep the last occurrence** — Set keeps first. Use a reverse pass or Map for last-wins semantics.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-17-unique-array',
    prompt: `Implement \`unique(arr)\` — return array with duplicates removed, first occurrence wins.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function unique(arr) {
  // Implement this function
  
}`,
      typescript: `function unique<T>(arr: T[]): T[] {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function unique(arr) {
  return Array.from(new Set(arr));
}`,
      typescript: `function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'unique');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('unique', `return Boolean(
          JSON.stringify(unique([1, 2, 2, 3, 1])) === JSON.stringify([1, 2, 3])
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
    { label: 'Set — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
