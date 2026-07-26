import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea29SelectorMemo: Lesson = {
  id: 'lesson-fea-29-selector-memo',
  title: 'Selector Memo Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-29-selector-memo'],
  estimatedMinutes: 10,
  concepts: ["memoization","selectors","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Selector Memo Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** memoization, selectors, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createSelectorMemo(selector) {
  let lastArgs = null;
    let lastResult;
    return (...args) => {
      const same = lastArgs && args.length === lastArgs.length && args.every((v, i) => v === lastArgs[i]);
      if (same) return lastResult;
      lastArgs = args;
      lastResult = selector(...args);
      return lastResult;
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **memoization**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-29-selector-memo',
    prompt: `Implement \`createSelectorMemo(selector)\` — return a memoized wrapper that caches by shallow arg equality.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createSelectorMemo(selector) {
  // Implement this function
  
}`,
      typescript: `function createSelectorMemo(selector: (...args: number[]) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createSelectorMemo(selector) {
  let lastArgs = null;
    let lastResult;
    return (...args) => {
      const same = lastArgs && args.length === lastArgs.length && args.every((v, i) => v === lastArgs[i]);
      if (same) return lastResult;
      lastArgs = args;
      lastResult = selector(...args);
      return lastResult;
    };
}`,
      typescript: `function createSelectorMemo(selector: (...args: number[]) => number) {
  let lastArgs = null;
    let lastResult;
    return (...args) => {
      const same = lastArgs && args.length === lastArgs.length && args.every((v, i) => v === lastArgs[i]);
      if (same) return lastResult;
      lastArgs = args;
      lastResult = selector(...args);
      return lastResult;
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createSelectorMemo');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createSelectorMemo', `return Boolean((function () {
                  let calls = 0;
                  const sum = createSelectorMemo((a, b) => { calls += 1; return a + b; });
                  sum(1, 2);
                  sum(1, 2);
                  return calls === 1 && sum(1, 2) === 3;
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
    { label: 'Selector Memo Factory', url: 'https://developer.mozilla.org/' }
  ],
};
