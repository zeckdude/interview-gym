import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs11DeepCloneJson: Lesson = {
  id: 'lesson-ts-11-deep-clone-json',
  title: 'Deep Clone JSON Values',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-11-deep-clone-json'],
  estimatedMinutes: 10,
  concepts: ["structuredClone","JSON"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Deep Clone JSON Values** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** structuredClone, JSON
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **structuredClone**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-11-deep-clone-json',
    prompt: `Implement \`deepClone\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function deepClone(value) {
  // Implement this function
  
}`,
      typescript: `function deepClone(value: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}`,
      typescript: `function deepClone(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'deepClone');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('deepClone', 'return Boolean(JSON.stringify(deepClone({"a":{"b":[1]}})) === JSON.stringify({"a":{"b":[1]}}))');
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
    { label: 'Deep Clone JSON Values', url: 'https://developer.mozilla.org/' }
  ],
};
