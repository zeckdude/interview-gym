import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs08HasOwnKey: Lesson = {
  id: 'lesson-ts-08-has-own-key',
  title: 'Has Own Property',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-08-has-own-key'],
  estimatedMinutes: 10,
  concepts: ["objects","hasOwnProperty"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Has Own Property** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, hasOwnProperty
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **objects**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-08-has-own-key',
    prompt: `Implement \`hasOwn\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function hasOwn(obj, key) {
  // Implement this function
  
}`,
      typescript: `function hasOwn(obj: object, key: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
      typescript: `function hasOwn(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'hasOwn');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('hasOwn', 'return Boolean(hasOwn({"a":1}, "a") === true)');
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
    { label: 'Has Own Property', url: 'https://developer.mozilla.org/' }
  ],
};
