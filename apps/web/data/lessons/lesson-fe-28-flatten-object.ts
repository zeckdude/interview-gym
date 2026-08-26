import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe28FlattenObject: Lesson = {
  id: 'lesson-fe-28-flatten-object',
  title: 'Flatten Nested Object',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-28-flatten-object'],
  estimatedMinutes: 14,
  concepts: ['objects', 'recursion', 'paths'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Your app receives nested config from the backend: \`{ database: { host: "localhost", port: 5432 } }\`. Your env-var override system expects flat keys: \`{ "database.host": "localhost", "database.port": 5432 }\`.

**Flattening nested objects** into dot-path keys is common in config systems, form libraries, and i18n tools. Interviewers use it to test recursion and \`Object.entries\`.
      `,
    },
    {
      type: 'explanation',
      title: 'How Object Flattening Works',
      content: `
Walk every key-value pair recursively:

- If the value is a **plain object** (not null, not array) → recurse with an updated prefix: \`prefix.key\`
- Otherwise → assign \`result[prefix] = value\`

**Plain object check:** \`value != null && typeof value === 'object' && !Array.isArray(value)\`

Build the path as you go: \`""\` → \`"a"\` → \`"a.b"\` → \`"a.b.c"\`
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function flattenObject(obj) {
  const result = {};
  const walk = (value, prefix) => {
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [key, nested] of Object.entries(value)) {
        walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
      }
    } else {
      result[prefix] = value;
    }
  };
  walk(obj, '');
  return result;
}

flattenObject({ a: { b: 1 }, c: 2 });
// => { "a.b": 1, "c": 2 }`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What about arrays?"
flattenObject({ items: [1, 2, 3] });
// With our plain-object check, arrays become leaf values:
// => { "items": [1, 2, 3] }
// Mention you'd add array indexing (items.0, items.1) if required

// Interviewer: "What about empty nested objects?"
flattenObject({ a: {} });
// => {} — no leaf values to assign
// Or assign "a": undefined depending on requirements`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Treating arrays as objects to recurse into.** \`typeof []\` is \`"object"\` — you must exclude arrays with \`!Array.isArray(value)\` or you'll get numeric keys like \`"0"\`, \`"1"\`.

**Forgetting null.** \`typeof null === 'object'\` in JavaScript — check \`value != null\` before recursing.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Flatten',
      content: `
**Don't flatten for display** — nested JSON is more readable for humans. Flatten only when a flat key space is required (env vars, CSS variables, query params).

**Don't flatten deeply nested config at runtime on every request** — cache the flattened result.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-28-flatten-object',
    prompt: `Implement \`flattenObject(obj)\` — flatten nested plain objects into dot-separated key paths.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function flattenObject(obj) {
  // Implement this function
  
}`,
      typescript: `function flattenObject(obj: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenObject(obj) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}`,
      typescript: `function flattenObject(obj: Record<string, unknown>) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenObject');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenObject', `return Boolean(JSON.stringify(flattenObject({"a":{"b":1},"c":2})) === JSON.stringify({"a.b":1,"c":2}));`);
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
    { label: 'Object.entries — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries' },
    { label: 'Working with objects — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
