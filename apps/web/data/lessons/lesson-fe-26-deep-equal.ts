import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe26DeepEqual: Lesson = {
  id: 'lesson-fe-26-deep-equal',
  title: 'Deep Equal Comparison',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-26-deep-equal'],
  estimatedMinutes: 14,
  concepts: ['objects', 'recursion', 'equality'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
React's \`useEffect\` dependency array uses shallow comparison — \`{ a: 1 }\` !== \`{ a: 1 }\` even when the contents match. Testing libraries need to know if two state snapshots are truly equal.

**Deep equality** is a staple senior-level question. It tests recursion, type checking, and knowing why \`===\` fails for nested structures.
      `,
    },
    {
      type: 'explanation',
      title: 'How Deep Equality Works',
      content: `
**Shallow equality** (\`===\`) compares references for objects — two \`{ a: 1 }\` literals are never equal.

**Deep equality** recursively compares:

1. Primitives → use \`===\`
2. \`null\` / non-objects → \`false\` if types differ
3. Objects → same keys, recursively equal values

The recursive pattern:

- Base case: \`a === b\` → \`true\`
- Guard: if either is null or not an object → \`false\`
- Compare key counts and each key's value recursively
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

deepEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
deepEqual({ a: 1 }, { a: 2 });               // false`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What about arrays?"
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (typeof a !== 'object' || typeof b !== 'object') return false;
  // ... object comparison as above
}

// Interviewer: "What about Date objects, Maps, Sets?"
// Mention you'd add type-specific branches or use a library like lodash.isEqual`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Using \`JSON.stringify(a) === JSON.stringify(b)\`.** Key order isn't guaranteed, \`undefined\` values are dropped, and circular references throw. Always mention why this shortcut fails.

**Not handling arrays separately from plain objects.** Arrays are objects in JS — \`Object.keys([1,2])\` returns \`["0","1"]\`, which works but \`Array.isArray\` checks are clearer.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Deep Equal',
      content: `
**Don't deep-equal on every render** — it's O(n) and expensive. Use shallow compare, memoization, or immutable data structures with reference equality.

**Don't implement from scratch in production** — use \`lodash.isEqual\`, Node's \`util.isDeepStrictEqual\`, or a tested utility.
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
    { label: 'Equality comparisons — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness' },
    { label: 'Object.keys — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
