import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi18ApplyDelta: Lesson = {
  id: 'lesson-ai-18-apply-delta',
  title: 'Apply Stream Delta',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-18-apply-delta'],
  estimatedMinutes: 10,
  concepts: ["streaming"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Apply Stream Delta** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** streaming
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function applyStreamDelta(previous, delta) {
  return previous + delta;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **streaming**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-18-apply-delta',
    prompt: `Implement \`applyStreamDelta\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function applyStreamDelta(previous, delta) {
  // Implement this function
  
}`,
      typescript: `function applyStreamDelta(previous: string, delta: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function applyStreamDelta(previous, delta) {
  return previous + delta;
}`,
      typescript: `function applyStreamDelta(previous: string, delta: string) {
  return previous + delta;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'applyStreamDelta');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('applyStreamDelta', 'return Boolean(applyStreamDelta("Hello", " world") === "Hello world")');
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
    { label: 'Apply Stream Delta', url: 'https://developer.mozilla.org/' }
  ],
};
