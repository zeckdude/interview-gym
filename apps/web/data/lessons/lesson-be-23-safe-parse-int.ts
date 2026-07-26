import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe23SafeParseInt: Lesson = {
  id: 'lesson-be-23-safe-parse-int',
  title: 'Safe Parse Integer',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['be-23-safe-parse-int'],
  estimatedMinutes: 10,
  concepts: ["parsing","numbers","NaN"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Safe Parse Integer** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** parsing, numbers, NaN
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function safeParseInt(value, fallback) {
  const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **parsing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-23-safe-parse-int',
    prompt: `Implement \`safeParseInt(value, fallback)\` — parse base-10 integers without NaN leaks.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function safeParseInt(value, fallback) {
  // Implement this function
  
}`,
      typescript: `function safeParseInt(value: string, fallback: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function safeParseInt(value, fallback) {
  const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}`,
      typescript: `function safeParseInt(value: string, fallback: number) {
  const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'safeParseInt');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('safeParseInt', `return Boolean(safeParseInt("42", 0) === 42);`);
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
    { label: 'Safe Parse Integer', url: 'https://developer.mozilla.org/' }
  ],
};
