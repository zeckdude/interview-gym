import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs01VariablesTypes: Lesson = {
  id: 'lesson-js-01-variables-types',
  title: 'Variables, Types & typeof',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 1,
  relatedChallengeIds: ['be-23-safe-parse-int'],
  estimatedMinutes: 12,
  concepts: ['let', 'const', 'typeof', 'primitives'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Every interview starts with JavaScript fundamentals. Before arrays or async, you need to explain **what a value is** and **how to name it**.

Interviewers ask: "What's the difference between \`let\` and \`const\`?" and "What does \`typeof null\` return?" — wrong answers here signal weak foundations.
      `,
    },
    {
      type: 'explanation',
      title: 'How Variables & Types Work',
      content: `
**Declarations:**

- \`const\` — bind once; for values you won't reassign (default choice)
- \`let\` — reassignable; use in loops and counters
- Avoid \`var\` in modern JS (function-scoped, hoisting bugs)

**Primitive types:** \`string\`, \`number\`, \`boolean\`, \`undefined\`, \`null\`, \`symbol\`, \`bigint\`

**typeof** returns a string label: \`typeof "hi"\` → \`"string"\`, \`typeof 42\` → \`"number"\`

**Famous gotcha:** \`typeof null === "object"\` — a long-standing JS bug.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `const name = 'Ada';
let score = 0;
score += 10;

typeof name;   // "string"
typeof score;  // "number"
typeof null;   // "object" (historical bug)`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `function describeValue(value) {
  const t = typeof value;
  if (t === 'string') return \`text: \${value}\`;
  if (t === 'number') return \`number: \${value}\`;
  if (value === null) return 'null';
  return t;
}

describeValue('hello'); // "text: hello"
describeValue(null);  // "null" — not "object"`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"const means immutable."** \`const\` prevents **reassignment**, not mutation. \`const arr = []; arr.push(1)\` is fine — you can't do \`arr = []\`.

**Confusing \`undefined\` and \`null\`.** \`undefined\` = never set; \`null\` = intentionally empty.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use typeof',
      content: `
**For arrays, use \`Array.isArray(x)\`** — \`typeof []\` is \`"object"\`.

**For null checks, use \`x === null\`** — don't rely on typeof alone.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-01-variables-types',
    prompt: `Implement \`typeLabel(value)\` — return \`'string'\`, \`'number'\`, \`'boolean'\`, \`'null'\`, or \`'other'\`.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function typeLabel(value) {
  // Implement this function
  
}`,
      typescript: `function typeLabel(value: unknown): string {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function typeLabel(value) {
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}`,
      typescript: `function typeLabel(value: unknown): string {
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(v: unknown) => string>(userCode, 'typeLabel');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      return testCases([
        { actual: result.value('hi'), expected: 'string' },
        { actual: result.value(42), expected: 'number' },
        { actual: result.value(true), expected: 'boolean' },
        { actual: result.value(null), expected: 'null' },
        { actual: result.value([]), expected: 'other' },
      ]);
    },
  },
  mdnLinks: [
    { label: 'JavaScript data types — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations' },
    { label: 'typeof — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
