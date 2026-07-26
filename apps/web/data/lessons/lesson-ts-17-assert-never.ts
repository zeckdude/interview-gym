import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs17AssertNever: Lesson = {
  id: 'lesson-ts-17-assert-never',
  title: 'Exhaustiveness — assertNever',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-17-assert-never'],
  estimatedMinutes: 10,
  concepts: ["exhaustive checks","never type"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Exhaustiveness** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** exhaustive checks, never type
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertNever(value) {
  throw new Error('Unexpected value: ' + String(value));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **exhaustive checks**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-17-assert-never',
    prompt: `Implement \`assertNever\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertNever(value) {
  // Implement this function
  
}`,
      typescript: `function assertNever(value: never) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertNever(value) {
  throw new Error('Unexpected value: ' + String(value));
}`,
      typescript: `function assertNever(value: never) {
  throw new Error('Unexpected value: ' + String(value));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertNever');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertNever', 'return Boolean((() => { try { assertNever("bad"); return false; } catch { return true; } })())');
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
    { label: 'Exhaustiveness — assertNever', url: 'https://developer.mozilla.org/' }
  ],
};
