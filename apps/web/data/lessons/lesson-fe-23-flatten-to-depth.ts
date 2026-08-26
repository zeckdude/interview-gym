import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe23FlattenToDepth: Lesson = {
  id: 'lesson-fe-23-flatten-to-depth',
  title: 'Flatten Array to Depth',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['fe-23-flatten-to-depth'],
  estimatedMinutes: 13,
  concepts: ['arrays', 'recursion'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
A form builder returns nested field groups: \`[[{ id: 1 }], [{ id: 2 }, { id: 3 }]]\`. Your validation engine expects a flat list of fields.

**Flattening to a specific depth** is a classic recursion question. It tests whether you understand when to recurse, when to stop, and how \`Array.isArray\` differs from \`typeof\`.
      `,
    },
    {
      type: 'explanation',
      title: 'How Depth-Limited Flatten Works',
      content: `
**Depth** controls how many levels of nesting you unwrap:

- \`depth = 0\` → return the array unchanged
- \`depth = 1\` → unwrap one level: \`[[1,2],[3]]\` → \`[1,2,3]\`
- \`depth = 2\` → unwrap two levels

The recursive pattern:

1. Walk each item in the array
2. If the item is an array **and** \`depth > 0\`, recurse with \`depth - 1\` and spread the result
3. Otherwise, push the item as-is

Built-in alternative: \`arr.flat(depth)\` — mention you know it, but implement manually for the interview.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function flattenToDepth(arr, depth) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flattenToDepth(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

flattenToDepth([[1, 2], [3]], 1);
// => [1, 2, 3]`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// depth = 0: no flattening
flattenToDepth([[1, [2]]], 0);
// => [[1, [2]]]

// depth = 1: only outer arrays unwrapped
flattenToDepth([[1, [2]]], 1);
// => [1, [2]]  — inner [2] stays nested

// depth = Infinity equivalent: keep recursing until no arrays left
function flattenAll(arr) {
  return flattenToDepth(arr, Infinity);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Using \`typeof item === 'object'\` instead of \`Array.isArray(item)\`.** In JavaScript, arrays are objects — but so are \`null\`, dates, and plain objects. Always use \`Array.isArray\` to detect arrays specifically.

**Forgetting that \`depth = 0\` means "don't flatten at all"** — the base case is \`depth > 0\`, not \`depth >= 0\`.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Flatten',
      content: `
**Don't flatten tree structures that need hierarchy.** A file system tree, React component tree, or nested menu should stay nested.

**Don't flatten when \`arr.flat(depth)\` or a library like lodash** is already available in production — but implement manually in interviews to show you understand recursion.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-23-flatten-to-depth',
    prompt: `Implement \`flattenToDepth(arr, depth)\` — flatten nested arrays up to a given depth.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function flattenToDepth(arr, depth) {
  // Implement this function
  
}`,
      typescript: `function flattenToDepth(arr: unknown[], depth: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenToDepth(arr, depth) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}`,
      typescript: `function flattenToDepth(arr: unknown[], depth: number) {
  return arr.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...flattenToDepth(item, depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenToDepth');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenToDepth', `return Boolean(JSON.stringify(flattenToDepth([[1,2],[3]], 1)) === JSON.stringify([1,2,3]));`);
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
    { label: 'Array.prototype.flat — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat' },
    { label: 'Array.isArray — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
