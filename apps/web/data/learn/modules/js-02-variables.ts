import type { LearnModule } from '../types';

export const moduleVariables: LearnModule = {
  id: 'js-02-variables',
  title: 'Variables',
  description: 'Name values with const and let.',
  level: 1,
  levelLabel: 'Fundamentals',
  kind: 'lesson',
  estimatedMinutes: 35,
  contentAvailable: true,
  steps: [
    {
      id: 'var-1',
      type: 'text',
      conceptTags: ['variables'],
      title: 'Variables',
      content: `Programs need to **remember values**. A **variable** gives a name to a value so you can use it later.

In modern JavaScript, you create variables with \`const\` or \`let\`.`,
    },
    {
      id: 'var-2',
      type: 'text',
      conceptTags: ['const'],
      content: `\`const\` means "this name always points to this value."

Use \`const\` by default — for settings, user names, and anything you won't reassign.`,
    },
    {
      id: 'var-3',
      type: 'code-demo',
      conceptTags: ['const'],
      code: `const greeting = 'Hello';
console.log(greeting);`,
      expectedOutput: 'Hello',
    },
    {
      id: 'var-4',
      type: 'text',
      conceptTags: ['let'],
      content: `\`let\` is for values that **change** — counters, loop indices, toggles.

You can assign a \`let\` variable again with \`=\`.`,
    },
    {
      id: 'var-5',
      type: 'code-demo',
      conceptTags: ['let'],
      code: `let score = 0;
score = score + 10;
console.log(score);`,
      expectedOutput: '10',
    },
    {
      id: 'var-6',
      type: 'predict-output',
      conceptTags: ['const', 'let'],
      prompt: 'What gets logged?',
      code: `const city = 'Paris';
let count = 1;
count = 2;
console.log(city, count);`,
      expectedOutput: 'Paris 2',
      hints: [
        'Trace each line from top to bottom. What values do `city` and `count` hold right before `console.log` runs?',
        '`count` starts at `1` but gets reassigned to `2` on line 3. `city` never changes.',
        '`console.log` with multiple arguments prints them separated by a **space** — not a comma.',
      ],
      revealExplanation:
        'After line 3, `city` is still `"Paris"` and `count` is `2`. `console.log(city, count)` prints: `Paris 2` (space-separated, no comma).',
    },
    {
      id: 'var-7',
      type: 'text',
      conceptTags: ['const'],
      title: "Here's a code problem:",
      content: `Create a \`const\` named \`language\` with value \`'JavaScript'\`, then log it.`,
    },
    {
      id: 'var-8',
      type: 'code-challenge',
      conceptTags: ['const', 'console-log'],
      prompt: 'Log the string JavaScript using a const variable.',
      setupCode: `// Declare language, then log it:`,
      starterCode: `const language = '';
console.log(language);`,
      solutionCode: `const language = 'JavaScript';
console.log(language);`,
      expectedOutput: 'JavaScript',
      hints: [
        'You need a `const` variable that holds the text you want to print.',
        'String values go inside single or double quotes.',
        'Assign `\'JavaScript\'` to `language`, then pass `language` to `console.log`.',
      ],
      revealExplanation:
        'Declare `const language = \'JavaScript\'`, then `console.log(language)` prints `JavaScript`.',
    },
    {
      id: 'var-9',
      type: 'text',
      conceptTags: ['const-reassignment', 'type-error'],
      content: `Sometimes we want to ensure a variable is **never reassigned**. That's what \`const\` is for.

If you try to reassign a \`const\`, JavaScript throws:

**TypeError: Assignment to constant variable**

When a step asks what happens and the code will fail, choose **Throws error** at the top of the answer box — or type the error name if you know it.`,
    },
    {
      id: 'var-9-demo',
      type: 'code-demo',
      conceptTags: ['const'],
      code: `function f() {
  const x = 1;
  return x + 1;
}
console.log(f());`,
      expectedOutput: '2',
    },
    {
      id: 'var-10',
      type: 'predict-output',
      conceptTags: ['const-reassignment', 'type-error'],
      prompt: 'What happens when this runs?',
      code: `function f() {
  const x = 1;
  x = 2;
  return x + 1;
}
f();`,
      expectedOutput: 'TypeError',
      expectsError: true,
      acceptErrorShorthand: true,
      hints: [
        'Look at line 3. Can you assign a new value to a `const` variable?',
        'Reassigning a `const` throws an error — the function never returns.',
        'Choose **Throws error**, or type **TypeError** if you know the name.',
      ],
      revealExplanation:
        '`const x = 1` creates a constant binding. `x = 2` throws **TypeError: Assignment to constant variable**.',
    },
    {
      id: 'var-10-full',
      type: 'choice',
      conceptTags: ['const-reassignment', 'type-error'],
      prompt: 'Same code — which error message does JavaScript show?',
      code: `const x = 1;
x = 2;
console.log(x);`,
      choices: [
        'TypeError: Assignment to constant variable.',
        'ReferenceError: Cannot access \'x\' before initialization',
        'SyntaxError: Identifier \'x\' has already been declared',
        'TypeError: x is not defined',
      ],
      correctIndex: 0,
      hints: [
        'You already know this is a TypeError from the previous step.',
        'The message mentions assigning to a **constant** variable.',
        'Pick the option about **Assignment to constant variable**.',
      ],
      explanation:
        'Reassigning a `const` binding throws **TypeError: Assignment to constant variable.** The program stops before `console.log` runs.',
    },
    {
      id: 'var-10-challenge',
      type: 'code-challenge',
      conceptTags: ['const-reassignment', 'type-error', 'let'],
      prompt:
        'Change `let` to `const` so this code throws TypeError: Assignment to constant variable.',
      setupCode: `// Change let to const:`,
      starterCode: `function f() {
  let x = 1;
  x = 2;
  return x;
}

f();`,
      solutionCode: `function f() {
  const x = 1;
  x = 2;
  return x;
}

f();`,
      expectedOutput: 'TypeError: Assignment to constant variable.',
      goalType: 'error',
      hints: [
        'Only one keyword needs to change — the declaration on line 2.',
        'Replace `let` with `const`. The reassignment on line 3 will then be illegal.',
        'Change `let x = 1` to `const x = 1`, then run. The goal is the TypeError, not a return value.',
      ],
      revealExplanation:
        'With `const x = 1`, the line `x = 2` throws **TypeError: Assignment to constant variable.** before `return x` runs.',
    },
    {
      id: 'var-syntax-1',
      type: 'text',
      conceptTags: ['syntax-error', 'const-redeclaration'],
      content: `You also **cannot declare the same name twice** with \`const\` or \`let\` in the same scope.

That fails immediately with a **SyntaxError** — JavaScript won't even start running the code.`,
    },
    {
      id: 'var-syntax-2',
      type: 'predict-output',
      conceptTags: ['syntax-error', 'const-redeclaration'],
      prompt: 'What happens when this runs?',
      code: `const x = 5;
const x = 6;
console.log(x);`,
      expectedOutput: 'SyntaxError',
      expectsError: true,
      acceptErrorShorthand: true,
      hints: [
        'Count how many times `x` is declared with `const`.',
        'Two `const x` declarations in the same scope is illegal.',
        'Choose **Throws error**, or type **SyntaxError** if you know the name. The message mentions the identifier was already declared.',
      ],
      revealExplanation:
        '**SyntaxError: Identifier \'x\' has already been declared** — JavaScript rejects duplicate `const` names before running any lines.',
    },
    {
      id: 'var-tdz-1',
      type: 'text',
      conceptTags: ['reference-error', 'tdz'],
      content: `You **cannot use a \`const\` or \`let\` variable before its declaration line**.

That throws **ReferenceError: Cannot access 'x' before initialization** — called the *temporal dead zone* (TDZ).`,
    },
    {
      id: 'var-tdz-2',
      type: 'predict-output',
      conceptTags: ['reference-error', 'tdz'],
      prompt: 'What happens when this runs?',
      code: `console.log(x);
const x = 5;`,
      expectedOutput: 'ReferenceError',
      expectsError: true,
      acceptErrorShorthand: true,
      hints: [
        'Which line runs first — the `console.log` or the `const`?',
        '`x` exists but is not initialized yet when line 1 runs.',
        'Choose **Throws error**, or type **ReferenceError** if you know the name. This is different from a variable that was never declared at all.',
      ],
      revealExplanation:
        '**ReferenceError: Cannot access \'x\' before initialization** — `const`/`let` bindings exist but cannot be read until their declaration line runs.',
    },
    {
      id: 'var-mutation-1',
      type: 'text',
      conceptTags: ['const-mutation'],
      content: `\`const\` stops **reassignment** — pointing the name at a new value.

It does **not** freeze objects and arrays. You can still change what's **inside** them.`,
    },
    {
      id: 'var-mutation-2',
      type: 'code-demo',
      conceptTags: ['const-mutation'],
      code: `const names = ['Ada'];
names.push('Grace');
console.log(names);`,
      expectedOutput: '["Ada","Grace"]',
    },
    {
      id: 'var-mutation-3',
      type: 'predict-output',
      conceptTags: ['const-reassignment', 'type-error', 'const-mutation'],
      prompt: 'What happens when this runs?',
      code: `const user = { name: 'Ada' };
user = { name: 'Bob' };
console.log(user);`,
      expectedOutput: 'TypeError',
      expectsError: true,
      acceptErrorShorthand: true,
      hints: [
        'Line 2 tries to point `user` at a completely new object. Is that reassignment?',
        'Mutating properties is allowed; replacing the whole binding is not.',
        'Choose **Throws error**, or type **TypeError** if you know the name — same message as reassigning a primitive `const`.',
      ],
      revealExplanation:
        '`user = { name: \'Bob\' }` tries to reassign the `const` binding. That throws **TypeError: Assignment to constant variable.**',
    },
    {
      id: 'var-11',
      type: 'text',
      conceptTags: ['typeof'],
      content: `\`typeof\` tells you what kind of value a variable holds. It returns a **string** label like \`"string"\` or \`"number"\`.`,
    },
    {
      id: 'var-12',
      type: 'code-demo',
      conceptTags: ['typeof'],
      code: `const name = 'Ada';
const age = 30;
console.log(typeof name);
console.log(typeof age);`,
      expectedOutput: `string
number`,
    },
    {
      id: 'var-13',
      type: 'predict-output',
      conceptTags: ['typeof'],
      prompt: 'What does typeof return for true?',
      code: `console.log(typeof true);`,
      expectedOutput: 'boolean',
      hints: [
        'What JavaScript type is the value `true`?',
        '`typeof` returns a string name for the type.',
        '`typeof true` returns the string `"boolean"` — type just: `boolean`',
      ],
      revealExplanation:
        '`true` is a boolean value. `typeof true` returns the string `"boolean"`. Type: `boolean`',
    },
    {
      id: 'var-14',
      type: 'text',
      conceptTags: ['typeof-null'],
      content: `One famous quirk: \`typeof null\` returns \`"object"\` — a long-standing JavaScript bug.

Interviewers love this. Remember: \`null\` is its own type in practice, even if \`typeof\` lies.`,
    },
    {
      id: 'var-15',
      type: 'predict-output',
      conceptTags: ['typeof-null'],
      prompt: 'What does typeof null return?',
      code: `console.log(typeof null);`,
      expectedOutput: 'object',
      hints: [
        '`null` is a special value in JavaScript. What does `typeof` usually return for types?',
        'There is a famous historical bug with `typeof` and `null`.',
        '`typeof null` returns `"object"` — not `"null"`. Type: `object`',
      ],
      revealExplanation:
        'This is a well-known JavaScript quirk: `typeof null` returns `"object"` even though `null` is not an object.',
    },
    {
      id: 'var-16',
      type: 'code-challenge',
      conceptTags: ['const', 'let', 'typeof'],
      prompt: 'Create const item = "book", let qty = 3, then log typeof item and typeof qty on separate lines.',
      setupCode: `// Fill in item, qty, and two console.log lines:`,
      starterCode: `const item = '';
let qty = 0;
console.log(typeof item);
console.log(typeof qty);`,
      solutionCode: `const item = 'book';
let qty = 3;
console.log(typeof item);
console.log(typeof qty);`,
      expectedOutput: `string
number`,
      hints: [
        '`item` should be a string and `qty` should be a number.',
        'Use `typeof` before each variable inside `console.log`.',
        'Two separate `console.log` calls — one for `typeof item`, one for `typeof qty`.',
      ],
      revealExplanation:
        '`item` is the string `"book"` (`typeof` → `string`), `qty` is `3` (`typeof` → `number`). Each `typeof` prints on its own line.',
    },
  ],
};
