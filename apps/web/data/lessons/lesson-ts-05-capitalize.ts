import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs05Capitalize: Lesson = {
  id: 'lesson-ts-05-capitalize',
  title: 'Capitalize First Letter',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-05-capitalize'],
  estimatedMinutes: 10,
  concepts: ["strings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Capitalize First Letter** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** strings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function capitalize(str) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **strings**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-05-capitalize',
    prompt: `Implement \`capitalize\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function capitalize(str) {
  // Implement this function
  
}`,
      typescript: `function capitalize(str: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function capitalize(str) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
      typescript: `function capitalize(str: string) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'capitalize');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('capitalize', 'return Boolean(capitalize("hello") === "Hello")');
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
    { label: 'Capitalize First Letter', url: 'https://developer.mozilla.org/' }
  ],
};
