import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi01EstimateTokens: Lesson = {
  id: 'lesson-ai-01-estimate-tokens',
  title: 'Estimate Token Count',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-01-estimate-tokens'],
  estimatedMinutes: 10,
  concepts: ["tokens","LLM costs"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Estimate Token Count** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** tokens, LLM costs
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **tokens**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-01-estimate-tokens',
    prompt: `Implement \`estimateTokens\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function estimateTokens(text) {
  // Implement this function
  
}`,
      typescript: `function estimateTokens(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}`,
      typescript: `function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'estimateTokens');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('estimateTokens', 'return Boolean(estimateTokens("hello world") === 3)');
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
    { label: 'Estimate Token Count', url: 'https://developer.mozilla.org/' }
  ],
};
