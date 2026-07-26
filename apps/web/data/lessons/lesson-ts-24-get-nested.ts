import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs24GetNested: Lesson = {
  id: 'lesson-ts-24-get-nested',
  title: 'Get Nested Path',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-24-get-nested'],
  estimatedMinutes: 10,
  concepts: ["path access","optional chaining"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Get Nested Path** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** path access, optional chaining
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **path access**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-24-get-nested',
    prompt: `Implement \`getNested\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function getNested(obj, path) {
  // Implement this function
  
}`,
      typescript: `function getNested(obj: Record<string, unknown>, path: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}`,
      typescript: `function getNested(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'getNested');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('getNested', 'return Boolean(getNested({"a":{"b":3}}, "a.b") === 3)');
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
    { label: 'Get Nested Path', url: 'https://developer.mozilla.org/' }
  ],
};
