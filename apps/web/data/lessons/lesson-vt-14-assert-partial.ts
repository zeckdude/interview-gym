import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt14AssertPartial: Lesson = {
  id: 'lesson-vt-14-assert-partial',
  title: 'Assert Partial Match',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-14-assert-partial'],
  estimatedMinutes: 10,
  concepts: ["partial matching"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Partial Match** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** partial matching
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertPartial(actual, expected) {
  for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) throw new Error('Mismatch at ' + key);
    }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **partial matching**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-14-assert-partial',
    prompt: `Implement \`assertPartial\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function assertPartial(actual, expected) {
  // Implement this function
  
}`,
      typescript: `function assertPartial(actual: Record<string, unknown>, expected: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertPartial(actual, expected) {
  for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) throw new Error('Mismatch at ' + key);
    }
}`,
      typescript: `function assertPartial(actual: Record<string, unknown>, expected: Record<string, unknown>) {
  for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) throw new Error('Mismatch at ' + key);
    }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertPartial');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertPartial', 'return Boolean(assertPartial({"a":1,"b":2}, {"a":1}) === "ok")');
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
    { label: 'Assert Partial Match', url: 'https://developer.mozilla.org/' }
  ],
};
