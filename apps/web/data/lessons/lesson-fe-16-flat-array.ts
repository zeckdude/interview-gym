import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe16FlatArray: Lesson = {
  id: 'lesson-fe-16-flat-array',
  title: 'Flatten Nested Array',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 8,
  relatedChallengeIds: ['fe-16-flat-array'],
  estimatedMinutes: 12,
  concepts: ['arrays', 'recursion', 'Array.isArray'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Nested data from APIs often needs flattening before display or processing. \`flat()\` exists in modern JS, but interviews want you to **implement it** with recursion.
      `,
    },
    {
      type: 'explanation',
      title: 'How Flatten Works',
      content: `
Walk each element: if it's an array and depth remains, recurse; otherwise push the value. Default depth is \`Infinity\` (flatten completely).

Use \`reduce\` + spread or a \`for\` loop — both are acceptable.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `flatten([1, [2, [3]]], 1);  // [1, 2, [3]]
flatten([1, [2, [3]]]);         // [1, 2, 3]`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Only checking \`typeof item === 'object'\`** — arrays are objects; always use \`Array.isArray\`.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Flatten',
      content: `
**Tree structures** (DOM, file systems) should stay nested — flattening loses hierarchy.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-16-flat-array',
    prompt: `Implement \`flatten(arr, depth?)\` — flatten nested arrays (default: full depth).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function flatten(arr, depth = Infinity) {
  // Implement this function
  
}`,
      typescript: `function flatten(arr: unknown[], depth?: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}`,
      typescript: `function flatten(arr: unknown[], depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item as unknown[], depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flatten');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flatten', `return Boolean(
          JSON.stringify(flatten([1, [2, [3, [4]]])) === '[1,2,3,4]' &&
          JSON.stringify(flatten([1, [2, [3, [4]]]], 1)) === '[1,2,[3,[4]]]'
        )`);
        return testRunner(result.value)
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check depth handling and recursion.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Array.prototype.flat — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
