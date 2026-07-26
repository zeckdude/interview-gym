import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss10TruncateText: Lesson = {
  id: 'lesson-css-10-truncate-text',
  title: 'Truncate With Ellipsis',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-10-truncate-text'],
  estimatedMinutes: 10,
  concepts: ["typography","overflow"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Truncate With Ellipsis** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** typography, overflow
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function truncate(text, max) {
  if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)) + '…';
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **typography**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-10-truncate-text',
    prompt: `Implement \`truncate\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function truncate(text, max) {
  // Implement this function
  
}`,
      typescript: `function truncate(text: string, max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function truncate(text, max) {
  if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)) + '…';
}`,
      typescript: `function truncate(text: string, max: number) {
  if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)) + '…';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'truncate');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('truncate', 'return Boolean(truncate("Hello world", 8) === "Hello w…")');
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
    { label: 'Truncate With Ellipsis', url: 'https://developer.mozilla.org/' }
  ],
};
