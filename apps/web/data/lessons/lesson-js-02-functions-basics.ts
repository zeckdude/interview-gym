import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs02FunctionsBasics: Lesson = {
  id: 'lesson-js-02-functions-basics',
  title: 'Functions — Parameters, Return & Scope',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  sequenceOrder: 2,
  relatedChallengeIds: ['be-25-capitalize-word'],
  estimatedMinutes: 12,
  concepts: ['functions', 'parameters', 'return', 'scope'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Functions are how you **reuse logic**. Every utility in this course — \`clamp\`, \`chunk\`, \`trim\` — is a function.

Interviewers start with: "Write a function that…" You need parameters, return values, and default args down cold before closures or HOFs.
      `,
    },
    {
      type: 'explanation',
      title: 'How Functions Work',
      content: `
**Declaration:** \`function greet(name) { return 'Hello ' + name; }\`

**Arrow:** \`const greet = (name) => 'Hello ' + name;\`

**Default parameters:** \`function greet(name = 'Guest') { … }\`

**Return** exits immediately and sends a value back. No \`return\` → \`undefined\`.

**Scope:** variables inside a function are local — invisible outside.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;

function greet(name = 'Guest') {
  return \`Hello, \${name}!\`;
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What if you pass too few arguments?"
function sum(a, b, c) {
  return a + b + (c ?? 0); // missing args are undefined
}

sum(1, 2);     // 3
sum(1, 2, 3);  // 6

// Interviewer: "Function vs arrow — when does 'this' differ?"
// Mention: arrow functions don't have their own 'this'`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Forgetting to return.** \`function double(n) { n * 2; }\` returns \`undefined\`. Always include \`return\` when the function should produce a value.

**Shadowing parameters** — reassigning a parameter name inside the function confuses readers; use a new variable instead.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Extract a Function',
      content: `
**One-liners used once** don't need a named function — inline is clearer.

**Functions with 5+ parameters** — consider an options object instead: \`createUser({ name, email, role })\`.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-02-functions-basics',
    prompt: `Implement \`greet(name?)\` — return \`"Hello, {name}!"\`. Default name is \`"Guest"\`.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function greet(name) {
  // Implement this function
  
}`,
      typescript: `function greet(name?: string): string {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function greet(name = 'Guest') {
  return \`Hello, \${name}!\`;
}`,
      typescript: `function greet(name = 'Guest'): string {
  return \`Hello, \${name}!\`;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(n?: string) => string>(userCode, 'greet');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      return testCases([
        { actual: result.value('Ada'), expected: 'Hello, Ada!' },
        { actual: result.value(), expected: 'Hello, Guest!' },
      ]);
    },
  },
  mdnLinks: [
    { label: 'Functions — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' },
    { label: 'Arrow functions — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
