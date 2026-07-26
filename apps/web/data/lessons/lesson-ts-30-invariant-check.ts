import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs30InvariantCheck: Lesson = {
  id: 'lesson-ts-30-invariant-check',
  title: 'Invariant Guard',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-30-invariant-check'],
  estimatedMinutes: 10,
  concepts: ["assertions","errors"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Invariant Guard** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** assertions, errors
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function invariant(condition, message) {
  if (!condition) throw new Error(message);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **assertions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-30-invariant-check',
    prompt: `Implement \`invariant\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function invariant(condition, message) {
  // Implement this function
  
}`,
      typescript: `function invariant(condition: boolean, message: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function invariant(condition, message) {
  if (!condition) throw new Error(message);
}`,
      typescript: `function invariant(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'invariant');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('invariant', 'return Boolean((() => { try { invariant(false, "nope"); return false; } catch { return true; } })())');
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
    { label: 'Invariant Guard', url: 'https://developer.mozilla.org/' }
  ],
};
