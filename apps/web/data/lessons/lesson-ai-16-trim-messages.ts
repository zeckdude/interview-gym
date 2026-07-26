import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi16TrimMessages: Lesson = {
  id: 'lesson-ai-16-trim-messages',
  title: 'Trim Message History',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-16-trim-messages'],
  estimatedMinutes: 10,
  concepts: ["context window"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Trim Message History** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** context window
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function trimMessages(messages, max) {
  return messages.slice(-max);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **context window**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-16-trim-messages',
    prompt: `Implement \`trimMessages\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function trimMessages(messages, max) {
  // Implement this function
  
}`,
      typescript: `function trimMessages(messages: unknown[], max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function trimMessages(messages, max) {
  return messages.slice(-max);
}`,
      typescript: `function trimMessages(messages: unknown[], max: number) {
  return messages.slice(-max);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'trimMessages');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('trimMessages', 'return Boolean(JSON.stringify(trimMessages([1,2,3,4], 2)) === JSON.stringify([3,4]))');
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
    { label: 'Trim Message History', url: 'https://developer.mozilla.org/' }
  ],
};
