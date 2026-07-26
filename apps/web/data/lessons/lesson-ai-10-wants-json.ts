import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi10WantsJson: Lesson = {
  id: 'lesson-ai-10-wants-json',
  title: 'Detect JSON Output Request',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-10-wants-json'],
  estimatedMinutes: 10,
  concepts: ["structured output"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Detect JSON Output Request** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** structured output
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function wantsJsonOutput(prompt) {
  return /json|schema|structured/i.test(prompt);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **structured output**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-10-wants-json',
    prompt: `Implement \`wantsJsonOutput\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function wantsJsonOutput(prompt) {
  // Implement this function
  
}`,
      typescript: `function wantsJsonOutput(prompt: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function wantsJsonOutput(prompt) {
  return /json|schema|structured/i.test(prompt);
}`,
      typescript: `function wantsJsonOutput(prompt: string) {
  return /json|schema|structured/i.test(prompt);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'wantsJsonOutput');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('wantsJsonOutput', 'return Boolean(wantsJsonOutput("Return JSON with name field") === true)');
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
    { label: 'Detect JSON Output Request', url: 'https://developer.mozilla.org/' }
  ],
};
