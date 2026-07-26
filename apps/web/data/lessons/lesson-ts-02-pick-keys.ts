import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs02PickKeys: Lesson = {
  id: 'lesson-ts-02-pick-keys',
  title: 'Pick Object Keys',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-02-pick-keys'],
  estimatedMinutes: 10,
  concepts: ["generics","objects","utility types"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pick Object Keys** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** generics, objects, utility types
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function pick(obj, keys) {
  const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **generics**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-02-pick-keys',
    prompt: `Implement \`pick(obj, keys)\` — return a new object with only the listed keys.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function pick(obj, keys) {
  // Implement this function
  
}`,
      typescript: `function pick(obj: Record<string, unknown>, keys: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pick(obj, keys) {
  const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
}`,
      typescript: `function pick(obj: Record<string, unknown>, keys: string[]) {
  const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pick');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pick', 'return Boolean(JSON.stringify(pick({"a":1,"b":2,"c":3}, ["a","c"])) === JSON.stringify({"a":1,"c":3}))');
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
    { label: 'Pick Object Keys', url: 'https://developer.mozilla.org/' }
  ],
};
