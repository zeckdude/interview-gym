import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs01TypeGuardString: Lesson = {
  id: 'lesson-ts-01-type-guard-string',
  title: 'Type Guard — isString',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-01-type-guard-string'],
  estimatedMinutes: 10,
  concepts: ["type guards","typeof","narrowing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Type Guard** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** type guards, typeof, narrowing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function isString(value) {
  return typeof value === 'string';
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **type guards**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-01-type-guard-string',
    prompt: `Implement a type guard \`isString\` that narrows unknown values to string.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function isString(value) {
  // Implement this function
  
}`,
      typescript: `function isString(value: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function isString(value) {
  return typeof value === 'string';
}`,
      typescript: `function isString(value: unknown) {
  return typeof value === 'string';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isString');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('isString', 'return Boolean(isString("hello") === true)');
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
    { label: 'Type Guard — isString', url: 'https://developer.mozilla.org/' }
  ],
};
