import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe21TrimString: Lesson = {
  id: 'lesson-be-21-trim-string',
  title: 'Trim Whitespace',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['be-21-trim-string'],
  estimatedMinutes: 10,
  concepts: ["strings","trim"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Trim Whitespace** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** strings, trim
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function trimString(str) {
  return str.trim();
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
    id: 'mini-be-21-trim-string',
    prompt: `Implement \`trimString(str)\` — remove leading and trailing whitespace.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function trimString(str) {
  // Implement this function
  
}`,
      typescript: `function trimString(str: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function trimString(str) {
  return str.trim();
}`,
      typescript: `function trimString(str: string) {
  return str.trim();
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'trimString');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('trimString', `return Boolean(trimString("  hello  ") === "hello");`);
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
    { label: 'Trim Whitespace', url: 'https://developer.mozilla.org/' }
  ],
};
