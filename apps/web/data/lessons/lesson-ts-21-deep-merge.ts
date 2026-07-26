import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs21DeepMerge: Lesson = {
  id: 'lesson-ts-21-deep-merge',
  title: 'Deep Merge Objects',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-21-deep-merge'],
  estimatedMinutes: 10,
  concepts: ["recursion","objects"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Deep Merge Objects** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** recursion, objects
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function deepMerge(a, b) {
  const result = { ...a };
    for (const key of Object.keys(b)) {
      const av = a[key];
      const bv = b[key];
      if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
        result[key] = deepMerge(av, bv);
      } else {
        result[key] = bv;
      }
    }
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **recursion**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-21-deep-merge',
    prompt: `Implement \`deepMerge\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function deepMerge(a, b) {
  // Implement this function
  
}`,
      typescript: `function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function deepMerge(a, b) {
  const result = { ...a };
    for (const key of Object.keys(b)) {
      const av = a[key];
      const bv = b[key];
      if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
        result[key] = deepMerge(av, bv);
      } else {
        result[key] = bv;
      }
    }
    return result;
}`,
      typescript: `function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  const result = { ...a };
    for (const key of Object.keys(b)) {
      const av = a[key];
      const bv = b[key];
      if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
        result[key] = deepMerge(av, bv);
      } else {
        result[key] = bv;
      }
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'deepMerge');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('deepMerge', 'return Boolean(JSON.stringify(deepMerge({"a":{"x":1},"b":2}, {"a":{"y":2},"c":3})) === JSON.stringify({"a":{"x":1,"y":2},"b":2,"c":3}))');
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
    { label: 'Deep Merge Objects', url: 'https://developer.mozilla.org/' }
  ],
};
