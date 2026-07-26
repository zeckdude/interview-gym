import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe21ClampNumber: Lesson = {
  id: 'lesson-fe-21-clamp-number',
  title: 'Clamp Number to Range',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  relatedChallengeIds: ['fe-21-clamp-number'],
  estimatedMinutes: 10,
  concepts: ["numbers","min/max"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Clamp Number to Range** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** numbers, min/max
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **numbers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-21-clamp-number',
    prompt: `Implement \`clamp(value, min, max)\` — constrain a number to an inclusive range.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function clamp(value, min, max) {
  // Implement this function
  
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'clamp');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('clamp', `return Boolean(clamp(15, 0, 10) === 10);`);
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
    { label: 'Clamp Number to Range', url: 'https://developer.mozilla.org/' }
  ],
};
