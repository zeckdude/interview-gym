import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi04BuildSystemPrompt: Lesson = {
  id: 'lesson-ai-04-build-system-prompt',
  title: 'Build System Prompt',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-04-build-system-prompt'],
  estimatedMinutes: 10,
  concepts: ["prompting"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Build System Prompt** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** prompting
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function buildSystemPrompt(instructions) {
  return 'You are a helpful assistant.\\n' + instructions;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **prompting**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-04-build-system-prompt',
    prompt: `Implement \`buildSystemPrompt\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function buildSystemPrompt(instructions) {
  // Implement this function
  
}`,
      typescript: `function buildSystemPrompt(instructions: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function buildSystemPrompt(instructions) {
  return 'You are a helpful assistant.\\n' + instructions;
}`,
      typescript: `function buildSystemPrompt(instructions: string) {
  return 'You are a helpful assistant.\\n' + instructions;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'buildSystemPrompt');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('buildSystemPrompt', 'return Boolean(buildSystemPrompt("Answer concisely.") === "You are a helpful assistant.\\nAnswer concisely.")');
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
    { label: 'Build System Prompt', url: 'https://developer.mozilla.org/' }
  ],
};
