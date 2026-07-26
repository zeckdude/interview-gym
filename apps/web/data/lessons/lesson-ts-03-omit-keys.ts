import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs03OmitKeys: Lesson = {
  id: 'lesson-ts-03-omit-keys',
  title: 'Omit Object Keys',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-03-omit-keys'],
  estimatedMinutes: 10,
  concepts: ["objects","immutability"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Omit Object Keys** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, immutability
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function omit(obj, keys) {
  const result = { ...obj };
    for (const key of keys) delete result[key];
    return result;
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
    id: 'mini-ts-03-omit-keys',
    prompt: `Implement \`omit\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function omit(obj, keys) {
  // Implement this function
  
}`,
      typescript: `function omit(obj: Record<string, unknown>, keys: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function omit(obj, keys) {
  const result = { ...obj };
    for (const key of keys) delete result[key];
    return result;
}`,
      typescript: `function omit(obj: Record<string, unknown>, keys: string[]) {
  const result = { ...obj };
    for (const key of keys) delete result[key];
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'omit');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('omit', 'return Boolean(JSON.stringify(omit({"a":1,"b":2,"c":3}, ["b"])) === JSON.stringify({"a":1,"c":3}))');
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
    { label: 'Omit Object Keys', url: 'https://developer.mozilla.org/' }
  ],
};
