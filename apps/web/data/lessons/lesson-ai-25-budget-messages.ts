import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi25BudgetMessages: Lesson = {
  id: 'lesson-ai-25-budget-messages',
  title: 'Budget Context Messages',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-25-budget-messages'],
  estimatedMinutes: 10,
  concepts: ["context window"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Budget Context Messages** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** context window
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function budgetContext(messages, maxTokens) {
  let used = 0;
    const kept = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const cost = Math.ceil(String(messages[i]).length / 4);
      if (used + cost > maxTokens) break;
      used += cost;
      kept.unshift(messages[i]);
    }
    return kept;
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
    id: 'mini-ai-25-budget-messages',
    prompt: `Implement \`budgetContext\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function budgetContext(messages, maxTokens) {
  // Implement this function
  
}`,
      typescript: `function budgetContext(messages: string[], maxTokens: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function budgetContext(messages, maxTokens) {
  let used = 0;
    const kept = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const cost = Math.ceil(String(messages[i]).length / 4);
      if (used + cost > maxTokens) break;
      used += cost;
      kept.unshift(messages[i]);
    }
    return kept;
}`,
      typescript: `function budgetContext(messages: string[], maxTokens: number) {
  let used = 0;
    const kept = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const cost = Math.ceil(String(messages[i]).length / 4);
      if (used + cost > maxTokens) break;
      used += cost;
      kept.unshift(messages[i]);
    }
    return kept;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'budgetContext');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('budgetContext', 'return Boolean(JSON.stringify(budgetContext(["aaaa","bbbbbbbb"], 3)) === JSON.stringify(["bbbbbbbb"]))');
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
    { label: 'Budget Context Messages', url: 'https://developer.mozilla.org/' }
  ],
};
