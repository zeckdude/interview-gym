import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs04ObjectsBasics: Lesson = {
  id: 'lesson-js-04-objects-basics',
  title: 'Objects — Keys, Values & Access',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 12,
  relatedChallengeIds: ['be-24-shallow-merge'],
  estimatedMinutes: 13,
  concepts: ['objects', 'properties', 'Object.keys', 'destructuring'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
API responses, user profiles, config objects — JavaScript represents structured data as **objects**. Before deep equal or flatten, you need property access, iteration, and copying down pat.

Interviewers ask: "How do you copy an object?" and "How do you iterate keys?" constantly.
      `,
    },
    {
      type: 'explanation',
      title: 'How Objects Work',
      content: `
**Literal:** \`const user = { name: 'Ada', age: 30 };\`

**Access:** dot (\`user.name\`) or bracket (\`user['name']\`) — brackets required for dynamic keys.

**Iteration:**

- \`Object.keys(obj)\` — array of keys
- \`Object.values(obj)\` — array of values
- \`Object.entries(obj)\` — \`[key, value]\` pairs

**Shallow copy:** \`{ ...obj }\` or \`Object.assign({}, obj)\`
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `const config = { host: 'localhost', port: 3000 };

config.host;                    // 'localhost'
config['port'];                 // 3000
Object.keys(config);            // ['host', 'port']

const copy = { ...config, port: 8080 };`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Destructuring — very common in React interviews
const { name, age } = user;

// Dynamic key
const field = 'email';
const profile = { ...user, [field]: 'ada@example.com' };

// Safe access
const theme = config?.ui?.theme ?? 'light';`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Shallow vs deep copy.** \`{ ...obj }\` copies top-level only — nested objects are still shared references. Mention this before implementing deep equal.

**Adding properties to arrays** — \`arr.foo = 1\` works but is not an array element; use objects for key-value data.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Plain Objects',
      content: `
**Frequent key lookups with non-string keys** — use \`Map\`.

**Ordered collections with many items** — arrays + \`.find()\` may be wrong tool; consider Map keyed by id.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-04-objects-basics',
    prompt: `Implement \`getProp(obj, key)\` — return \`obj[key]\` or \`undefined\` if missing.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function getProp(obj, key) {
  // Implement this function
  
}`,
      typescript: `function getProp(obj: Record<string, unknown>, key: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function getProp(obj, key) {
  return obj[key];
}`,
      typescript: `function getProp(obj: Record<string, unknown>, key: string) {
  return obj[key];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(o: Record<string, unknown>, k: string) => unknown>(userCode, 'getProp');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      return testCases([
        { actual: result.value({ a: 1 }, 'a'), expected: 1 },
        { actual: result.value({ a: 1 }, 'b'), expected: undefined },
      ]);
    },
  },
  mdnLinks: [
    { label: 'Working with objects — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects' },
    { label: 'Object.keys — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
