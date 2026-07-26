import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe25CapitalizeWord: Lesson = {
  id: 'lesson-be-25-capitalize-word',
  title: 'Capitalize First Letter',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['be-25-capitalize-word'],
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
      content: `function capitalizeWord(str) {
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
    id: 'mini-be-25-capitalize-word',
    prompt: `Implement \`capitalizeWord(str)\` — uppercase the first character only.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function capitalizeWord(str) {
  // Implement this function
  
}`,
      typescript: `function capitalizeWord(str: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function capitalizeWord(str) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
      typescript: `function capitalizeWord(str: string) {
  if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'capitalizeWord');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('capitalizeWord', `return Boolean(capitalizeWord("hello") === "Hello");`);
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
