import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi07SanitizeInput: Lesson = {
  id: 'lesson-ai-07-sanitize-input',
  title: 'Sanitize User Prompt',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-07-sanitize-input'],
  estimatedMinutes: 10,
  concepts: ["safety"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Sanitize User Prompt** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** safety
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function sanitizePrompt(input) {
  return input.replace(/\\s+/g, ' ').trim().slice(0, 4000);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **safety**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-07-sanitize-input',
    prompt: `Implement \`sanitizePrompt\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function sanitizePrompt(input) {
  // Implement this function
  
}`,
      typescript: `function sanitizePrompt(input: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function sanitizePrompt(input) {
  return input.replace(/\\s+/g, ' ').trim().slice(0, 4000);
}`,
      typescript: `function sanitizePrompt(input: string) {
  return input.replace(/\\s+/g, ' ').trim().slice(0, 4000);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'sanitizePrompt');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('sanitizePrompt', 'return Boolean(sanitizePrompt("  hello   world  ") === "hello world")');
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
    { label: 'Sanitize User Prompt', url: 'https://developer.mozilla.org/' }
  ],
};
