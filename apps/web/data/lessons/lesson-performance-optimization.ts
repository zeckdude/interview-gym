import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonPerformanceOptimization: Lesson = {
  id: 'lesson-performance-optimization',
  title: 'React Performance — memo, useMemo, useCallback',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-12-memoize","fea-05-memo-optimization"],
  estimatedMinutes: 12,
  concepts: ["React.memo","useMemo"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**React Performance** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** React.memo, useMemo
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function shallowEqual(a, b) {
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((k) => a[k] === b[k]);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **React.memo**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-performance-optimization',
    prompt: `Implement shallow object equality.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function shallowEqual(a, b) {
  
}`,
      typescript: `function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  
}`,
    },
    solution: {
      javascript: `function shallowEqual(a, b) {
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((k) => a[k] === b[k]);
}`,
      typescript: `function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((k) => a[k] === b[k]);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'shallowEqual');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('shallowEqual', 'return Boolean(shallowEqual({a:1,b:2}, {a:1,b:2}) && !shallowEqual({a:1}, {a:2}))');
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
    { label: 'memo — React', url: 'https://react.dev/reference/react/memo' }
  ],
};
