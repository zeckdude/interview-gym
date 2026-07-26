import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt25AssertShape: Lesson = {
  id: 'lesson-vt-25-assert-shape',
  title: 'Assert Object Shape',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-25-assert-shape'],
  estimatedMinutes: 10,
  concepts: ["schema checks"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Assert Object Shape** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** schema checks
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function assertShape(obj, shape) {
  for (const key of Object.keys(shape)) {
      if (typeof obj[key] !== shape[key]) return false;
    }
    return true;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **schema checks**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-25-assert-shape',
    prompt: `Implement \`assertShape\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function assertShape(obj, shape) {
  // Implement this function
  
}`,
      typescript: `function assertShape(obj: Record<string, unknown>, shape: Record<string, string>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function assertShape(obj, shape) {
  for (const key of Object.keys(shape)) {
      if (typeof obj[key] !== shape[key]) return false;
    }
    return true;
}`,
      typescript: `function assertShape(obj: Record<string, unknown>, shape: Record<string, string>) {
  for (const key of Object.keys(shape)) {
      if (typeof obj[key] !== shape[key]) return false;
    }
    return true;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'assertShape');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('assertShape', 'return Boolean(assertShape({"a":1,"b":"x"}, {"a":"number","b":"string"}) === true)');
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
    { label: 'Assert Object Shape', url: 'https://developer.mozilla.org/' }
  ],
};
