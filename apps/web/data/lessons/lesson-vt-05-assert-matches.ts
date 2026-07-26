import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt05AssertMatches: Lesson = {
  id: 'lesson-vt-05-assert-matches',
  title: 'Assert Regex Match',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-05-assert-matches'],
  estimatedMinutes: 10,
  concepts: ["regex"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Regex Match** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** regex
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertMatches(value, pattern) {
  if (!pattern.test(value)) throw new Error('No match for ' + value);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **regex**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-05-assert-matches',
    prompt: `Implement \`assertMatches\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertMatches(value, pattern) {
  // Implement this function
  
}`,
      typescript: `function assertMatches(value: string, pattern: RegExp) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertMatches(value, pattern) {
  if (!pattern.test(value)) throw new Error('No match for ' + value);
}`,
      typescript: `function assertMatches(value: string, pattern: RegExp) {
  if (!pattern.test(value)) throw new Error('No match for ' + value);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertMatches');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertMatches', 'return Boolean((() => { try { assertMatches(\'hello@test.com\', /^[^@]+@[^@]+$/); return true; } catch { return false; } })())');
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
    { label: 'Assert Regex Match', url: 'https://developer.mozilla.org/' }
  ],
};
