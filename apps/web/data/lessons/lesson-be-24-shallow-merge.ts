import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe24ShallowMerge: Lesson = {
  id: 'lesson-be-24-shallow-merge',
  title: 'Shallow Merge Objects',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['be-24-shallow-merge'],
  estimatedMinutes: 10,
  concepts: ["objects","spread","immutability"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Shallow Merge Objects** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, spread, immutability
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function shallowMerge(a, b) {
  return { ...a, ...b };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **objects**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-24-shallow-merge',
    prompt: `Implement \`shallowMerge(a, b)\` — return a new object with properties from both.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function shallowMerge(a, b) {
  // Implement this function
  
}`,
      typescript: `function shallowMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function shallowMerge(a, b) {
  return { ...a, ...b };
}`,
      typescript: `function shallowMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'shallowMerge');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('shallowMerge', `return Boolean(JSON.stringify(shallowMerge({"a":1,"b":2}, {"b":9,"c":3})) === JSON.stringify({"a":1,"b":9,"c":3}));`);
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
    { label: 'Shallow Merge Objects', url: 'https://developer.mozilla.org/' }
  ],
};
