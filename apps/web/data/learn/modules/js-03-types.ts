import type { LearnModule } from '../types';
import { CHALLENGE_YOURSELF_SECTION_TITLE } from '../challenge-yourself';

export const moduleTypes: LearnModule = {
  id: 'js-03-types',
  title: 'Types',
  description: 'Dynamic typing, typeof, and why TypeScript exists.',
  level: 1,
  levelLabel: 'Fundamentals',
  kind: 'lesson',
  estimatedMinutes: 35,
  contentAvailable: true,
  steps: [
    {
      id: 'types-1',
      type: 'text',
      devTitle: 'Types overview',
      devDescription: 'Every value has a type — string, number, boolean, and more.',
      conceptTags: ['types'],
      title: 'Types in JavaScript',
      content: `Every value in JavaScript has a **type** — string, number, boolean, and others.

Types describe **what kind of data** you are working with, not just the variable name holding it.`,
    },
    {
      id: 'types-2',
      type: 'code-demo',
      devTitle: 'Demo: three primitive logs',
      devDescription: 'Runnable example — logging string, number, and boolean values.',
      conceptTags: ['types'],
      code: `console.log('hello');
console.log(42);
console.log(true);`,
      expectedOutput: `hello
42
true`,
    },
    {
      id: 'types-3',
      type: 'text',
      devTitle: 'Primitive types',
      devDescription: 'Common primitives — string, number, boolean, undefined, null.',
      conceptTags: ['types', 'primitives'],
      content: `Every value in JavaScript is one of a few **primitive** types. These five show up constantly:`,
      typeReference: [
        {
          name: 'string',
          description: 'Text — always wrapped in quotes',
          example: "'hello'",
          accent: 'fe',
        },
        {
          name: 'number',
          description: 'Integers and decimals',
          example: '42',
          accent: 'brand',
        },
        {
          name: 'boolean',
          description: 'Either true or false',
          example: 'true',
          accent: 'success',
        },
        {
          name: 'undefined',
          description: 'A variable declared but not yet assigned',
          example: 'undefined',
          accent: 'warning',
        },
        {
          name: 'null',
          description: 'Intentionally empty — “no value here”',
          example: 'null',
          accent: 'muted',
        },
      ],
      footer: `You'll dive deeper into strings, booleans, and null in later modules. For now, focus on **how JavaScript handles types overall**.`,
    },
    {
      id: 'types-4',
      type: 'text',
      devTitle: 'typeof operator',
      devDescription: 'typeof returns a string label describing a value\'s type.',
      conceptTags: ['typeof'],
      content: `\`typeof\` tells you what kind of value something is. It always returns a **string** label like \`"string"\` or \`"number"\`.`,
    },
    {
      id: 'types-5',
      type: 'code-demo',
      devTitle: 'Demo: typeof on variables',
      devDescription: 'Runnable example — typeof on a string and a number.',
      conceptTags: ['typeof'],
      code: `const name = 'Ada';
const age = 30;
console.log(typeof name);
console.log(typeof age);`,
      expectedOutput: `string
number`,
    },
    {
      id: 'types-6',
      type: 'predict-output',
      devTitle: 'Predict: typeof boolean',
      devDescription: 'What typeof returns for a boolean literal.',
      conceptTags: ['typeof'],
      prompt: 'What does typeof return for true?',
      code: `console.log(typeof true);`,
      expectedOutput: 'boolean',
      hints: [
        'What JavaScript type is the value `true`?',
        '`typeof` returns a string name for the type.',
        '`typeof true` returns the string `\'boolean\'` — type just: `boolean`',
      ],
      revealExplanation:
        '`true` is a boolean value. `typeof true` returns the string `\'boolean\'`. Type: `boolean`',
    },
    {
      id: 'types-6b',
      type: 'text',
      devTitle: 'Objects, arrays, functions',
      devDescription: 'Non-primitive values — brief intro before typeof on them.',
      conceptTags: ['types', 'objects', 'arrays'],
      title: 'Beyond primitives',
      content: `Values aren't **only** primitives. JavaScript also has **objects**, **arrays**, and **functions**.

You will study these in depth in later modules. For now, recognize them when you see them — and know that \`typeof\` labels them differently than primitives.`,
      typeReference: [
        {
          name: 'array',
          description: 'An ordered list of values',
          example: "['a', 'b']",
          accent: 'fe',
        },
        {
          name: 'object',
          description: 'A collection of named properties',
          example: "{ name: 'Ada' }",
          accent: 'brand',
        },
        {
          name: 'function',
          description: 'Reusable code you can call',
          example: 'function greet() {}',
          accent: 'success',
        },
      ],
      footer: `Next you'll use \`typeof\` on these — starting with **functions** and **arrays**.`,
    },
    {
      id: 'types-6c',
      type: 'code-demo',
      devTitle: 'Demo: array and object',
      devDescription: 'Runnable example — logging an array and an object property.',
      conceptTags: ['types', 'arrays', 'objects'],
      code: `const colors = ['red', 'blue'];
const user = { name: 'Ada' };
console.log(colors);
console.log(user.name);`,
      expectedOutput: `["red","blue"]
Ada`,
    },
    {
      id: 'types-7',
      type: 'code-demo',
      devTitle: 'Demo: typeof edge cases',
      devDescription: 'Runnable example — typeof on undefined and functions.',
      conceptTags: ['typeof'],
      code: `let x;
function greet() {}
console.log(typeof x);
console.log(typeof greet);`,
      expectedOutput: `undefined
function`,
    },
    {
      id: 'types-7b',
      type: 'text',
      devTitle: 'Arrays and typeof',
      devDescription: 'Arrays are objects — typeof returns "object", not "array".',
      conceptTags: ['typeof', 'arrays'],
      content: `**Arrays are objects** under the hood.

So \`typeof\` on an array returns \`"object"\` — **not** \`"array"\`.

That surprises people. When you need to check specifically for an array, use \`Array.isArray(value)\` instead of relying on \`typeof\` alone.`,
    },
    {
      id: 'types-8',
      type: 'predict-output',
      devTitle: 'Predict: typeof array',
      devDescription: 'What typeof returns for an empty array.',
      conceptTags: ['typeof'],
      prompt: 'What does typeof return for an array?',
      code: `console.log(typeof []);`,
      expectedOutput: 'object',
      hints: [
        'Arrays are a special kind of object in JavaScript.',
        '`typeof` does not return `"array"`.',
        '`typeof []` returns `\'object\'` — type just: `object`',
      ],
      revealExplanation:
        'Arrays are objects under the hood. `typeof []` returns `\'object\'`, not `"array"`. Use `Array.isArray()` when you need to tell arrays apart.',
    },
    {
      id: 'types-9',
      type: 'text',
      devTitle: 'typeof null quirk',
      devDescription: 'Famous bug — typeof null returns "object".',
      conceptTags: ['typeof-null'],
      content: `One famous quirk: \`typeof null\` returns \`"object"\` — a long-standing JavaScript bug.

Interviewers love this. Remember: \`null\` is its own empty value in practice, even if \`typeof\` lies.`,
    },
    {
      id: 'types-10',
      type: 'predict-output',
      devTitle: 'Predict: typeof null',
      devDescription: 'What typeof returns for null.',
      conceptTags: ['typeof-null'],
      prompt: 'What does typeof null return?',
      code: `console.log(typeof null);`,
      expectedOutput: 'object',
      hints: [
        '`null` is a special value in JavaScript. What does `typeof` usually return for types?',
        'There is a famous historical bug with `typeof` and `null`.',
        '`typeof null` returns `\'object\'` — not `"null"`. Type: `object`',
      ],
      revealExplanation:
        'This is a well-known JavaScript quirk: `typeof null` returns `\'object\'` even though `null` is not an object.',
    },
    {
      id: 'types-cy-1-intro',
      type: 'text',
      devTitle: 'Challenge Yourself',
      devDescription: 'Optional typeof brain-teasers. Skip anytime.',
      conceptTags: ['typeof'],
      title: CHALLENGE_YOURSELF_SECTION_TITLE,
      sectionKind: 'challenge-yourself',
      content: `Extra-hard **typeof** brain-teasers. No hints — solve it or skip.

These won't block your progress.`,
    },
    {
      id: 'types-cy-1',
      type: 'predict-output',
      devTitle: 'CY: typeof typeof',
      devDescription: 'Optional predict — nested typeof on a number.',
      conceptTags: ['typeof'],
      optional: true,
      prompt: 'What gets logged?',
      code: `console.log(typeof typeof 1);`,
      expectedOutput: 'string',
      challengeDebrief: {
        gotcha:
          '`typeof` always returns a **string** — even when wrapped around another `typeof`.',
        evaluationSteps: [
          { expression: 'typeof 1', yields: '"number"' },
          { expression: 'typeof "number"', yields: '"string"' },
        ],
        greatSolution: 'Work **inside out**. The console prints the string `\'string\'`.',
        watchFor:
          'Nested `typeof`? Evaluate **one layer at a time** — each result is a string label.',
      },
    },
    {
      id: 'types-11',
      type: 'text',
      devTitle: 'Dynamic typing',
      devDescription: 'In JS, type belongs to the value, not permanently to the variable name.',
      conceptTags: ['dynamic-typing'],
      content: `JavaScript is **dynamically typed**.

The **type belongs to the value**, not permanently to the variable name. A \`let\` variable can point at a number now and a string later.`,
    },
    {
      id: 'types-12',
      type: 'code-demo',
      devTitle: 'Demo: reassignment changes type',
      devDescription: 'Runnable example — typeof before and after reassigning a let.',
      conceptTags: ['dynamic-typing', 'let', 'typeof'],
      code: `let value = 42;
console.log(typeof value);
value = 'hello';
console.log(typeof value);`,
      expectedOutput: `number
string`,
    },
    {
      id: 'types-13',
      type: 'predict-output',
      devTitle: 'Predict: typeof after reassignment',
      devDescription: 'What typeof returns after let is reassigned to a string.',
      conceptTags: ['dynamic-typing', 'let', 'typeof'],
      prompt: 'What gets logged?',
      code: `let x = 5;
x = 'hi';
console.log(typeof x);`,
      expectedOutput: 'string',
      hints: [
        'Trace what `x` holds right before `typeof x` runs.',
        '`x` was reassigned from a number to a string.',
        'After reassignment, `typeof x` is `\'string\'`. Type: `string`',
      ],
      revealExplanation:
        '`x` ends up as the string `"hi"`. `typeof x` returns `\'string\'`.',
    },
    {
      id: 'types-14',
      type: 'text',
      devTitle: 'Static vs dynamic typing',
      devDescription: 'How fixed-type languages differ from JavaScript.',
      conceptTags: ['static-typing'],
      content: `In many other languages — Java, C#, Go, Rust — variables have a **fixed type**.

\`\`\`
int age = 30;
age = "thirty";  // compile error in those languages
\`\`\`

JavaScript **allows** that reassignment. The flexibility is powerful, but it also means type mistakes may only show up **at runtime**.`,
    },
    {
      id: 'types-15',
      type: 'choice',
      devTitle: 'Choice: dynamic typing',
      devDescription: 'Can the same let variable hold a number and later a string?',
      conceptTags: ['dynamic-typing', 'static-typing'],
      prompt: 'In JavaScript, can the same `let` variable hold a number and later hold a string?',
      choices: [
        'No — each variable has one fixed type',
        'Yes — the type can change when you reassign',
        'Only if you use `var` instead of `let`',
      ],
      correctIndex: 1,
      explanation:
        'JavaScript is dynamically typed. A `let` binding can point at different types over time — the type is a property of each value, not a permanent label on the name.',
    },
    {
      id: 'types-16',
      type: 'text',
      devTitle: 'Type mistakes in practice',
      devDescription: 'Why wrong-type assumptions cause runtime bugs.',
      conceptTags: ['types'],
      content: `Why care about types? Many bugs come from **assuming** the wrong type:

\`\`\`javascript
const input = '5';
console.log(input + 1);  // '51' — string concat, not math!
\`\`\`

Knowing what type a value is — and checking with \`typeof\` when unsure — prevents surprises.`,
    },
    {
      id: 'types-17',
      type: 'predict-output',
      devTitle: 'Predict: typeof NaN',
      devDescription: 'What typeof returns for NaN.',
      conceptTags: ['typeof'],
      prompt: 'What does typeof NaN return?',
      code: `console.log(typeof NaN);`,
      expectedOutput: 'number',
      hints: [
        '`NaN` means "Not a Number" — but what type is it in JavaScript?',
        'There is a famous gotcha here.',
        '`typeof NaN` returns `\'number\'`. Type: `number`',
      ],
      revealExplanation:
        'Despite the name, `NaN` is still classified as a number. `typeof NaN` returns `\'number\'`.',
    },
    {
      id: 'types-18',
      type: 'text',
      devTitle: 'Code challenge intro',
      devDescription: 'Implement typeLabel(value) and log five test cases.',
      conceptTags: ['typescript'],
      title: "Here's a code problem:",
      content: `Implement \`typeLabel(value)\` that returns a string:

- \`'string'\`, \`'number'\`, or \`'boolean'\` for those primitives
- \`'null'\` when the value is \`null\` (don't rely on \`typeof\` alone!)
- \`'other'\` for everything else

Then log these five results on **separate lines**:

\`typeLabel('hi')\`, \`typeLabel(42)\`, \`typeLabel(true)\`, \`typeLabel(null)\`, \`typeLabel([])\``,
    },
    {
      id: 'types-19',
      type: 'code-challenge',
      devTitle: 'Challenge: typeLabel function',
      devDescription: 'Write typeLabel with null handling and log five results.',
      conceptTags: ['typeof', 'typescript'],
      prompt: 'Implement typeLabel and log the five test results on separate lines.',
      setupCode: '',
      starterCode: `function typeLabel(value) {
  // your code
}

// log five results below:`,
      solutionCode: `function typeLabel(value) {
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}

console.log(typeLabel('hi'));
console.log(typeLabel(42));
console.log(typeLabel(true));
console.log(typeLabel(null));
console.log(typeLabel([]));`,
      expectedOutput: `string
number
boolean
null
other`,
      hints: [
        'Handle `null` first with `value === null` — `typeof null` is `"object"`.',
        'Use `typeof value` for string, number, and boolean.',
        'Return `\'other\'` for arrays and objects. Log each test call with its own `console.log`.',
      ],
      revealExplanation:
        'Check `null` with `===`, use `typeof` for primitives, return `\'other\'` for arrays. Five separate `console.log` calls print one label per line.',
    },
    {
      id: 'types-20',
      type: 'text',
      devTitle: 'TypeScript overview',
      devDescription: 'Optional type annotations checked at compile time before runtime.',
      conceptTags: ['typescript'],
      title: 'TypeScript',
      content: `**TypeScript** is JavaScript plus **optional type annotations**.

You write types in your editor; a compiler (**tsc**) checks them **before** the code runs, then strips the types and outputs plain JavaScript.

\`\`\`typescript
let age: number = 30;
age = 'thirty'; // TypeScript error — caught before runtime
\`\`\`

The same code as JavaScript would run until something broke later. TypeScript helps teams catch mistakes early.`,
    },
    {
      id: 'types-21',
      type: 'choice',
      devTitle: 'Choice: TypeScript',
      devDescription: 'What TypeScript adds beyond plain JavaScript.',
      conceptTags: ['typescript'],
      prompt: 'What does TypeScript add that plain JavaScript does not?',
      choices: [
        'A completely different runtime engine',
        'Optional compile-time type checking on top of JavaScript',
        'A requirement to declare every variable with `const`',
      ],
      correctIndex: 1,
      explanation:
        'TypeScript is a superset of JavaScript. It adds static type checking at compile time, then compiles down to regular JavaScript that runs the same way.',
    },
    {
      id: 'types-22',
      type: 'text',
      devTitle: 'TypeScript in Interview Gym',
      devDescription: 'TS vs JS on challenges — optional compile-time safety.',
      conceptTags: ['typescript'],
      content: `Interview Gym's coding challenges often let you choose **TypeScript** or **JavaScript** — same logic, extra safety when you want it.

You don't need to master TypeScript yet. The key idea: **types help you reason about data**, and TypeScript enforces those reasons before you ship code.`,
    },
    {
      id: 'types-cy-2-intro',
      type: 'text',
      devTitle: 'Challenge Yourself',
      devDescription: 'Optional stretch — strictTypeLabel from a blank editor. Skip anytime.',
      conceptTags: ['typeof'],
      title: CHALLENGE_YOURSELF_SECTION_TITLE,
      sectionKind: 'challenge-yourself',
      content: `One more optional stretch problem — from a blank editor, no hints.

Implement \`strictTypeLabel(value)\` that returns:

- \`'null'\` for \`null\`
- \`'array'\` for arrays (use \`Array.isArray\`)
- \`'string'\`, \`'number'\`, or \`'boolean'\` for those primitives
- \`'other'\` for everything else

Log results for \`null\`, \`[]\`, \`'x'\`, \`0\`, \`false\`, and \`{}\` — one per line.`,
    },
    {
      id: 'types-cy-2',
      type: 'code-challenge',
      devTitle: 'CY: strictTypeLabel',
      devDescription: 'Optional code challenge — arrays, null, and typeof quirks.',
      conceptTags: ['typeof'],
      optional: true,
      prompt:
        'From scratch: implement strictTypeLabel(value) and log results for null, [], \'x\', 0, false, and {} — one label per line.',
      setupCode: '',
      starterCode: '',
      solutionCode: `function strictTypeLabel(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}

console.log(strictTypeLabel(null));
console.log(strictTypeLabel([]));
console.log(strictTypeLabel('x'));
console.log(strictTypeLabel(0));
console.log(strictTypeLabel(false));
console.log(strictTypeLabel({}));`,
      expectedOutput: `null
array
string
number
boolean
other`,
      challengeDebrief: {
        gotcha:
          '`typeof null` and `typeof []` both return `"object"` — `typeof` alone cannot tell them apart.',
        evaluationSteps: [
          { expression: 'value === null', yields: "'null'" },
          { expression: 'Array.isArray(value)', yields: "'array'" },
          { expression: 'typeof primitive', yields: 'string | number | boolean' },
        ],
        greatSolution:
          'Check special cases **in that order** before falling through to `\'other\'`.',
        watchFor:
          'Production type guards combine `=== null`, `Array.isArray()`, and `typeof` — never `typeof` alone.',
        solutionCode: `function strictTypeLabel(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}

console.log(strictTypeLabel(null));
console.log(strictTypeLabel([]));
console.log(strictTypeLabel('x'));
console.log(strictTypeLabel(0));
console.log(strictTypeLabel(false));
console.log(strictTypeLabel({}));`,
      },
    },
    {
      id: 'types-23',
      type: 'text',
      devTitle: 'Module wrap-up',
      devDescription: 'Preview of Strings module — text, length, and string methods.',
      conceptTags: ['types'],
      content: `Next up: **Strings** — working with text, length, and common string methods.

You now know how to inspect types with \`typeof\`, why JavaScript typing is flexible, and how TypeScript adds optional safety on top.`,
    },
  ],
};
