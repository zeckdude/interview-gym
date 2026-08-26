import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonErrorBoundaries: Lesson = {
  id: 'lesson-error-boundaries',
  title: 'Error Boundaries — Catching React Errors',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-07-error-boundary"],
  estimatedMinutes: 9,
  concepts: ["error boundary","fallback UI"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Error Boundaries** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** error boundary, fallback UI
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function safeRender(renderFn, fallback) {
  try { return renderFn(); } catch (e) { return fallback(e); }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **error boundary**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-error-boundaries',
    prompt: `Implement safeRender(renderFn, fallback) — catches errors.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function safeRender(renderFn, fallback) {
  
}`,
      typescript: `function safeRender<T>(renderFn: () => T, fallback: (e: unknown) => T): T {
  
}`,
    },
    solution: {
      javascript: `function safeRender(renderFn, fallback) {
  try { return renderFn(); } catch (e) { return fallback(e); }
}`,
      typescript: `function safeRender<T>(renderFn: () => T, fallback: (e: unknown) => T): T {
  try { return renderFn(); } catch (e) { return fallback(e); }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'safeRender');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('safeRender', 'return Boolean(safeRender(() => { throw new Error(\'x\'); }, () => \'fallback\') === \'fallback\')');
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
    { label: 'Error Boundaries — React', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' }
  ],
};
