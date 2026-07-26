import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe26DeepEqual: Lesson = {
  id: 'lesson-fe-26-deep-equal',
  title: 'Deep Equal Comparison',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-26-deep-equal'],
  estimatedMinutes: 10,
  concepts: ["objects","recursion","equality"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Deep Equal Comparison** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, recursion, equality
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function deepEqual(a, b) {
  if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
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
    id: 'mini-fe-26-deep-equal',
    prompt: `Implement \`deepEqual(a, b)\` — recursive equality for plain objects and primitives.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function deepEqual(a, b) {
  // Implement this function
  
}`,
      typescript: `function deepEqual(a: unknown, b: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function deepEqual(a, b) {
  if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
}`,
      typescript: `function deepEqual(a: unknown, b: unknown) {
  if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'deepEqual');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('deepEqual', `return Boolean(deepEqual({"a":{"b":1}}, {"a":{"b":1}}) === true);`);
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
    { label: 'Deep Equal Comparison', url: 'https://developer.mozilla.org/' }
  ],
};
