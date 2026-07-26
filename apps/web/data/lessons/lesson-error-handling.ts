import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonErrorHandling: Lesson = {
  id: 'lesson-error-handling',
  title: 'Error Handling in Node.js and Express',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ["be-07-json-parse","be-15-retry-logic"],
  estimatedMinutes: 10,
  concepts: ["try/catch","async errors"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Error Handling in Node.js and Express** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** try/catch, async errors
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function safeParse(json) {
  try { return { ok: true, data: JSON.parse(json) }; }
  catch (e) { return { ok: false, error: e.message }; }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **try/catch**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-error-handling',
    prompt: `Implement safeParse(json) — returns { ok: true, data } or { ok: false, error }.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function safeParse(json) {
  
}`,
      typescript: `function safeParse(json: string): { ok: true; data: unknown } | { ok: false; error: string } {
  
}`,
    },
    solution: {
      javascript: `function safeParse(json) {
  try { return { ok: true, data: JSON.parse(json) }; }
  catch (e) { return { ok: false, error: e.message }; }
}`,
      typescript: `function safeParse(json: string): { ok: true; data: unknown } | { ok: false; error: string } {
  try { return { ok: true, data: JSON.parse(json) }; }
  catch (e) { return { ok: false, error: (e as Error).message }; }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'safeParse');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('safeParse', 'return Boolean(safeParse(\'{"a":1}\').ok === true && safeParse(\'bad\').ok === false)');
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
    { label: 'Error handling — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling' }
  ],
};
