import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi11FewShotPrompt: Lesson = {
  id: 'lesson-ai-11-few-shot-prompt',
  title: 'Build Few-Shot Prompt',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-11-few-shot-prompt'],
  estimatedMinutes: 10,
  concepts: ["few-shot"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Build Few-Shot Prompt** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** few-shot
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function buildFewShot(examples) {
  return examples.map((ex) => 'Q: ' + ex.q + '\\nA: ' + ex.a).join('\\n\\n');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **few-shot**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-11-few-shot-prompt',
    prompt: `Implement \`buildFewShot\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function buildFewShot(examples) {
  // Implement this function
  
}`,
      typescript: `function buildFewShot(examples: Array<{ q: string; a: string }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function buildFewShot(examples) {
  return examples.map((ex) => 'Q: ' + ex.q + '\\nA: ' + ex.a).join('\\n\\n');
}`,
      typescript: `function buildFewShot(examples: Array<{ q: string; a: string }>) {
  return examples.map((ex) => 'Q: ' + ex.q + '\\nA: ' + ex.a).join('\\n\\n');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'buildFewShot');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('buildFewShot', 'return Boolean(buildFewShot([{"q":"2+2","a":"4"}]) === "Q: 2+2\\nA: 4")');
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
    { label: 'Build Few-Shot Prompt', url: 'https://developer.mozilla.org/' }
  ],
};
