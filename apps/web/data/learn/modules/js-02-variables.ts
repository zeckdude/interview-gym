import type { LearnModule } from '../types';
import { CHALLENGE_YOURSELF_SECTION_TITLE } from '../challenge-yourself';

export const moduleVariables: LearnModule = {
  id: 'js-02-variables',
  title: 'Variables',
  description: 'Name values with const and let.',
  level: 1,
  levelLabel: 'Fundamentals',
  kind: 'lesson',
  estimatedMinutes: 30,
  contentAvailable: true,
  steps: [
    {
      id: 'var-1',
      type: 'text',
      devTitle: 'Variables overview',
      devDescription: 'Why programs need names for values — const and let.',
      conceptTags: ['variables'],
      title: 'Variables',
      content: `Programs need to **remember values**. A **variable** gives a name to a value so you can use it later.

In modern JavaScript, you create variables with \`const\` or \`let\`.`,
    },
    {
      id: 'var-2',
      type: 'text',
      devTitle: 'const basics',
      devDescription: 'const binds a name to a value that will not be reassigned.',
      conceptTags: ['const'],
      content: `\`const\` means "this name always points to this value."

Use \`const\` by default — for settings, user names, and anything you won't reassign.`,
    },
    {
      id: 'var-3',
      type: 'code-demo',
      devTitle: 'Demo: const and logging',
      devDescription: 'Runnable example — declare a const and log it.',
      conceptTags: ['const'],
      code: `const greeting = 'Hello';
console.log(greeting);`,
      expectedOutput: 'Hello',
    },
    {
      id: 'var-4',
      type: 'text',
      devTitle: 'let basics',
      devDescription: 'let is for values that change — reassignment with =.',
      conceptTags: ['let'],
      content: `\`let\` is for values that **change** — counters, loop indices, toggles.

You can assign a \`let\` variable again with \`=\`.`,
    },
    {
      id: 'var-5',
      type: 'code-demo',
      devTitle: 'Demo: let reassignment',
      devDescription: 'Runnable example — increment a score with let.',
      conceptTags: ['let'],
      code: `let score = 0;
score = score + 10;
console.log(score);`,
      expectedOutput: '10',
    },
    {
      id: 'var-6',
      type: 'predict-output',
      devTitle: 'Predict: const + let together',
      devDescription: 'Trace const and let bindings before a multi-argument console.log.',
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
        '`console.log` with multiple arguments prints them separated by a **space** — not a comma. Wrap string values in quotes, e.g. `\'Paris\' 2`.',
      ],
      revealExplanation:
        'After line 3, `city` is still `"Paris"` and `count` is `2`. `console.log(city, count)` prints: `\'Paris\' 2` (space-separated, no comma).',
    },
    {
      id: 'var-7',
      type: 'text',
      devTitle: 'Code challenge intro',
      devDescription: 'Declare a const for a language name, then log it.',
      conceptTags: ['const'],
      title: "Here's a code problem:",
      content: `Create a \`const\` named \`language\` with value \`'JavaScript'\`, then log it.`,
    },
    {
      id: 'var-8',
      type: 'code-challenge',
      devTitle: 'Challenge: log a const string',
      devDescription: 'Write const language and console.log it.',
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
        'Declare `const language = \'JavaScript\'`, then `console.log(language)` prints `\'JavaScript\'`.',
    },
    {
      id: 'var-9',
      type: 'text',
      devTitle: 'const reassignment rules',
      devDescription: 'Why reassigning const throws TypeError — how error steps work.',
      conceptTags: ['const-reassignment', 'type-error'],
      content: `Sometimes we want to ensure a variable is **never reassigned**. That's what \`const\` is for.

If you try to reassign a \`const\`, JavaScript throws:

**TypeError: Assignment to constant variable**

When a step asks what happens and the code will fail, choose **Throws error** — then pick the specific error from the list you've learned so far.`,
    },
    {
      id: 'var-9-demo',
      type: 'code-demo',
      devTitle: 'Demo: const inside a function',
      devDescription: 'Runnable example — const used safely inside a function.',
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
      devTitle: 'Predict: const reassignment error',
      devDescription: 'What happens when a function tries to reassign a const.',
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
        'Choose **Throws error**, then pick **TypeError: Assignment to constant variable.** from the list.',
      ],
      revealExplanation:
        '`const x = 1` creates a constant binding. `x = 2` throws **TypeError: Assignment to constant variable**.',
    },
    {
      id: 'var-10-challenge',
      type: 'code-challenge',
      devTitle: 'Challenge: trigger TypeError',
      devDescription: 'Change let to const so reassignment throws an error.',
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
      devTitle: 'Duplicate declarations',
      devDescription: 'Declaring the same const/let name twice in one scope causes SyntaxError.',
      conceptTags: ['syntax-error', 'const-redeclaration'],
      content: `You also **cannot declare the same name twice** with \`const\` or \`let\` in the same scope.

That fails immediately with a **SyntaxError** — JavaScript won't even start running the code.`,
    },
    {
      id: 'var-syntax-2',
      type: 'predict-output',
      devTitle: 'Predict: duplicate const',
      devDescription: 'What happens when const x is declared twice in the same scope.',
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
        'Choose **Throws error**, then pick **SyntaxError: Identifier \'x\' has already been declared** from the list.',
      ],
      revealExplanation:
        '**SyntaxError: Identifier \'x\' has already been declared** — JavaScript rejects duplicate `const` names before running any lines.',
    },
    {
      id: 'var-tdz-1',
      type: 'text',
      devTitle: 'Temporal dead zone',
      devDescription: 'Using const/let before its declaration line throws ReferenceError (TDZ).',
      conceptTags: ['reference-error', 'tdz'],
      content: `You **cannot use a \`const\` or \`let\` variable before its declaration line**.

That throws **ReferenceError: Cannot access 'x' before initialization** — called the *temporal dead zone* (TDZ).`,
    },
    {
      id: 'var-tdz-2',
      type: 'predict-output',
      devTitle: 'Predict: TDZ error',
      devDescription: 'What happens when you log a variable before it is declared.',
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
        'Choose **Throws error**, then pick **ReferenceError: Cannot access \'x\' before initialization** from the list.',
      ],
      revealExplanation:
        '**ReferenceError: Cannot access \'x\' before initialization** — `const`/`let` bindings exist but cannot be read until their declaration line runs.',
    },
    {
      id: 'var-cy-1-intro',
      type: 'text',
      devTitle: 'Challenge Yourself',
      devDescription: 'Optional stretch — block scope with let. Skip anytime.',
      conceptTags: ['let'],
      title: CHALLENGE_YOURSELF_SECTION_TITLE,
      sectionKind: 'challenge-yourself',
      content: `Optional stretch problem — block scope with \`let\`. No hints.

Skip if you want; it won't block progress.`,
    },
    {
      id: 'var-cy-1',
      type: 'predict-output',
      devTitle: 'CY: block scope shadowing',
      devDescription: 'Optional predict — inner and outer let bindings with the same name.',
      conceptTags: ['let'],
      optional: true,
      prompt: 'What gets logged?',
      code: `let x = 1;
{
  let x = 2;
  console.log(x);
}
console.log(x);`,
      expectedOutput: `2
1`,
      challengeDebrief: {
        gotcha:
          'The `{ }` block creates a **new scope** — inner `let x` is a **different variable** that shadows the outer one.',
        evaluationSteps: [
          { expression: 'inside block, log x', yields: '2' },
          { expression: 'after block, log x', yields: '1' },
        ],
        greatSolution:
          'The inner binding disappears when the block ends. The outer `x` was never changed — it is still `1`.',
        watchFor:
          'See `{` after a `let`/`const`? Ask whether a **new binding** shares the same name.',
      },
    },
    {
      id: 'var-mutation-1',
      type: 'text',
      devTitle: 'const vs mutation',
      devDescription: 'const blocks reassignment, not mutating objects and arrays.',
      conceptTags: ['const-mutation'],
      content: `\`const\` stops **reassignment** — pointing the name at a new value.

It does **not** freeze objects and arrays. You can still change what's **inside** them.`,
    },
    {
      id: 'var-mutation-2',
      type: 'code-demo',
      devTitle: 'Demo: mutating an array',
      devDescription: 'Runnable example — push to a const array binding.',
      conceptTags: ['const-mutation'],
      code: `const names = ['Ada'];
names.push('Grace');
console.log(names);`,
      expectedOutput: '["Ada","Grace"]',
    },
    {
      id: 'var-mutation-3',
      type: 'predict-output',
      devTitle: 'Predict: reassigning const object',
      devDescription: 'What happens when you replace a const object binding entirely.',
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
        'Choose **Throws error**, then pick **TypeError: Assignment to constant variable.** from the list.',
      ],
      revealExplanation:
        '`user = { name: \'Bob\' }` tries to reassign the `const` binding. That throws **TypeError: Assignment to constant variable.**',
    },
    {
      id: 'var-cy-2-intro',
      type: 'text',
      devTitle: 'Challenge Yourself',
      devDescription: 'Optional gotcha — shared references with const. Skip anytime.',
      conceptTags: ['const-mutation'],
      title: CHALLENGE_YOURSELF_SECTION_TITLE,
      sectionKind: 'challenge-yourself',
      content: `Another optional gotcha — shared references with \`const\`. No hints.`,
    },
    {
      id: 'var-cy-2',
      type: 'predict-output',
      devTitle: 'CY: shared array reference',
      devDescription: 'Optional predict — two consts pointing at the same array.',
      conceptTags: ['const-mutation'],
      optional: true,
      prompt: 'What gets logged?',
      code: `const a = [];
const b = a;
b.push(1);
console.log(a.length, b.length);`,
      expectedOutput: '1 1',
      challengeDebrief: {
        gotcha:
          '`const b = a` copies the **reference**, not the array — both names aim at the **same object in memory**.',
        evaluationSteps: [
          { expression: 'b.push(1)', yields: 'mutates shared array' },
          { expression: 'a.length', yields: '1' },
          { expression: 'b.length', yields: '1' },
        ],
        greatSolution: 'One array, two variables pointing at it — both lengths match.',
        watchFor:
          'Assigning an array or object to another variable? Ask: **shared reference or fresh copy?**',
      },
    },
    {
      id: 'var-11',
      type: 'text',
      devTitle: 'Module wrap-up',
      devDescription: 'Preview of Types module — typeof, dynamic typing, and TypeScript.',
      conceptTags: ['types'],
      content: `Values have **types** — string, number, boolean, and more.

The next module covers **typeof**, dynamic typing, and why many teams use **TypeScript** for extra safety.`,
    },
  ],
};
