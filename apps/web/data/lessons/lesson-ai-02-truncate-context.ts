import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi02TruncateContext: Lesson = {
  id: 'lesson-ai-02-truncate-context',
  title: 'Truncate To Token Budget',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-02-truncate-context'],
  estimatedMinutes: 10,
  concepts: ["context window"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Truncate To Token Budget** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** context window
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function truncateToTokens(text, maxTokens) {
  const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
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
    id: 'mini-ai-02-truncate-context',
    prompt: `Implement \`truncateToTokens\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function truncateToTokens(text, maxTokens) {
  // Implement this function
  
}`,
      typescript: `function truncateToTokens(text: string, maxTokens: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function truncateToTokens(text, maxTokens) {
  const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}`,
      typescript: `function truncateToTokens(text: string, maxTokens: number) {
  const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'truncateToTokens');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('truncateToTokens', 'return Boolean(truncateToTokens("abcdefgh", 1) === "abcd")');
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
    { label: 'Truncate To Token Budget', url: 'https://developer.mozilla.org/' }
  ],
};
