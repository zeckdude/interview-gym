import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi08TokenCost: Lesson = {
  id: 'lesson-ai-08-token-cost',
  title: 'Calculate Token Cost',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-08-token-cost'],
  estimatedMinutes: 10,
  concepts: ["pricing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Calculate Token Cost** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** pricing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function tokenCost(tokens, pricePer1k) {
  return (tokens / 1000) * pricePer1k;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **pricing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-08-token-cost',
    prompt: `Implement \`tokenCost\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function tokenCost(tokens, pricePer1k) {
  // Implement this function
  
}`,
      typescript: `function tokenCost(tokens: number, pricePer1k: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function tokenCost(tokens, pricePer1k) {
  return (tokens / 1000) * pricePer1k;
}`,
      typescript: `function tokenCost(tokens: number, pricePer1k: number) {
  return (tokens / 1000) * pricePer1k;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'tokenCost');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('tokenCost', 'return Boolean(tokenCost(2000, 0.5) === 1)');
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
    { label: 'Calculate Token Cost', url: 'https://developer.mozilla.org/' }
  ],
};
