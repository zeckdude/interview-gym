import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt07AssertDeepEqual: Lesson = {
  id: 'lesson-vt-07-assert-deep-equal',
  title: 'Assert Deep Equal (JSON)',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-07-assert-deep-equal'],
  estimatedMinutes: 10,
  concepts: ["deep equality"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Deep Equal (JSON)** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** deep equality
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertDeepEqual(a, b) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Not deep equal');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **deep equality**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-07-assert-deep-equal',
    prompt: `Implement \`assertDeepEqual\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertDeepEqual(a, b) {
  // Implement this function
  
}`,
      typescript: `function assertDeepEqual(a: unknown, b: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertDeepEqual(a, b) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Not deep equal');
}`,
      typescript: `function assertDeepEqual(a: unknown, b: unknown) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Not deep equal');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertDeepEqual');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertDeepEqual', 'return Boolean(assertDeepEqual({"a":1}, {"a":1}) === "ok")');
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
    { label: 'Assert Deep Equal (JSON)', url: 'https://developer.mozilla.org/' }
  ],
};
