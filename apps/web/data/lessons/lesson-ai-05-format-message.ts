import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi05FormatMessage: Lesson = {
  id: 'lesson-ai-05-format-message',
  title: 'Format Chat Message',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-05-format-message'],
  estimatedMinutes: 10,
  concepts: ["chat API"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Format Chat Message** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** chat API
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function formatMessage(role, content) {
  return { role, content };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **chat API**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-05-format-message',
    prompt: `Implement \`formatMessage\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function formatMessage(role, content) {
  // Implement this function
  
}`,
      typescript: `function formatMessage(role: 'user' | 'assistant' | 'system', content: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function formatMessage(role, content) {
  return { role, content };
}`,
      typescript: `function formatMessage(role: 'user' | 'assistant' | 'system', content: string) {
  return { role, content };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'formatMessage');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('formatMessage', 'return Boolean(JSON.stringify(formatMessage("user", "Hi")) === JSON.stringify({"role":"user","content":"Hi"}))');
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
    { label: 'Format Chat Message', url: 'https://developer.mozilla.org/' }
  ],
};
