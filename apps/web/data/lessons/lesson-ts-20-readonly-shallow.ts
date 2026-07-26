import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs20ReadonlyShallow: Lesson = {
  id: 'lesson-ts-20-readonly-shallow',
  title: 'Shallow Readonly Copy',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-20-readonly-shallow'],
  estimatedMinutes: 10,
  concepts: ["immutability","Object.freeze"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Shallow Readonly Copy** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** immutability, Object.freeze
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function readonlyCopy(obj) {
  return Object.freeze({ ...obj });
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **immutability**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-20-readonly-shallow',
    prompt: `Implement \`readonlyCopy\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function readonlyCopy(obj) {
  // Implement this function
  
}`,
      typescript: `function readonlyCopy(obj: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function readonlyCopy(obj) {
  return Object.freeze({ ...obj });
}`,
      typescript: `function readonlyCopy(obj: Record<string, unknown>) {
  return Object.freeze({ ...obj });
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'readonlyCopy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('readonlyCopy', 'return Boolean(JSON.stringify(readonlyCopy({"a":1})) === JSON.stringify({"a":1}))');
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
    { label: 'Shallow Readonly Copy', url: 'https://developer.mozilla.org/' }
  ],
};
