import type { LearnModule } from '../types';

export const moduleIntroduction: LearnModule = {
  id: 'js-01-introduction',
  title: 'Introduction',
  description: 'Run your first JavaScript and read the output.',
  level: 1,
  levelLabel: 'Fundamentals',
  kind: 'lesson',
  estimatedMinutes: 25,
  contentAvailable: true,
  steps: [
    {
      id: 'intro-1',
      type: 'text',
      devTitle: 'Welcome',
      devDescription: 'How this module works — small steps, run code, predict answers, then continue.',
      conceptTags: ['console-log', 'running-code'],
      title: 'Modern JavaScript: Introduction',
      content: `Welcome! You're about to learn JavaScript by **doing** — not by reading walls of text.

Each step is small. Read a bit, run some code, predict an answer, then move on when you're ready.`,
    },
    {
      id: 'intro-2',
      type: 'text',
      devTitle: 'console.log basics',
      devDescription: 'Where JavaScript runs and why console.log is the simplest way to see output.',
      conceptTags: ['console-log'],
      content: `JavaScript runs in many places — browsers, servers, and tools like this one.

The simplest way to see output is \`console.log(...)\`. It prints a value so you can check your work.`,
    },
    {
      id: 'intro-3',
      type: 'code-demo',
      devTitle: 'Demo: strings and math',
      devDescription: 'Runnable example — logging a string and an arithmetic expression.',
      conceptTags: ['console-log', 'expressions'],
      code: `console.log('Hello, world!');
console.log(2 + 3);`,
      expectedOutput: `Hello, world!
5`,
    },
    {
      id: 'intro-4',
      type: 'text',
      devTitle: 'Expressions in console.log',
      devDescription: 'How expressions produce values before JavaScript prints them.',
      conceptTags: ['expressions'],
      content: `Inside \`console.log\`, you can put **expressions** — code that produces a value.

\`2 + 3\` is an expression. JavaScript evaluates it to \`5\`, then logs that result.`,
    },
    {
      id: 'intro-5',
      type: 'predict-output',
      devTitle: 'Predict: arithmetic output',
      devDescription: 'Practice evaluating a simple expression inside console.log.',
      conceptTags: ['console-log', 'expressions'],
      prompt: 'What will this code print?',
      code: `console.log(10 - 4);`,
      expectedOutput: '6',
      hints: [
        'Read the expression inside `console.log` carefully. What arithmetic operation is happening?',
        '`10 - 4` is a subtraction. Work out that result.',
        'The answer is a single number — what is `10 - 4`?',
      ],
      revealExplanation:
        'JavaScript evaluates `10 - 4` to `6`, then `console.log` prints that number.',
    },
    {
      id: 'intro-6',
      type: 'text',
      devTitle: 'Code challenge intro',
      devDescription: 'First coding exercise — use console.log to print a specific phrase.',
      conceptTags: ['code-challenge'],
      title: "Here's a code problem:",
      content: `Use \`console.log\` to print the exact text **Interview Gym** (capital I and G, one space).`,
    },
    {
      id: 'intro-7',
      type: 'code-challenge',
      devTitle: 'Challenge: print a string',
      devDescription: 'Write code that logs an exact phrase using console.log.',
      conceptTags: ['console-log'],
      prompt: 'Print exactly: Interview Gym',
      setupCode: `// Write your code below:`,
      starterCode: `console.log('');`,
      solutionCode: `console.log('Interview Gym');`,
      expectedOutput: 'Interview Gym',
      hints: [
        '`console.log` prints whatever you pass inside the parentheses.',
        'Text values in JavaScript go inside quotes.',
        'Put `\'Interview Gym\'` inside `console.log(...)`.',
      ],
      revealExplanation:
        '`console.log(\'Interview Gym\')` prints the exact string `\'Interview Gym\'`.',
    },
    {
      id: 'intro-errors-1',
      type: 'text',
      devTitle: 'When code throws errors',
      devDescription: 'How error steps work — choose Throws error, then pick the error type.',
      conceptTags: ['reference-error', 'errors'],
      title: 'When code fails',
      content: `Sometimes code **throws an error** instead of printing output. The program stops at the line that failed.

When a step asks what happens and the code will fail, choose **Throws error** — then pick the specific error from the list you've learned so far.

**Errors stop the program.** Lines after the error never run.`,
    },
    {
      id: 'intro-errors-2',
      type: 'predict-output',
      devTitle: 'Predict: undeclared variable',
      devDescription: 'What happens when you log a name that was never declared.',
      conceptTags: ['reference-error', 'errors'],
      prompt: 'What happens when this runs?',
      code: `console.log(missing);`,
      expectedOutput: 'ReferenceError',
      expectsError: true,
      acceptErrorShorthand: true,
      hints: [
        'Is `missing` declared anywhere in this code?',
        'Using a name that was never declared throws an error before anything prints.',
        'Choose **Throws error**, then pick **ReferenceError: missing is not defined** from the list.',
      ],
      revealExplanation:
        '`missing` was never declared. JavaScript throws **ReferenceError: missing is not defined** and nothing is logged.',
    },
    {
      id: 'intro-errors-3',
      type: 'text',
      devTitle: 'Fix undeclared variable',
      devDescription: 'Intro to fixing ReferenceError — declare a variable before logging it.',
      conceptTags: ['reference-error', 'errors'],
      title: "Here's a code problem:",
      content: `The code below tries to log \`name\`, but \`name\` was never declared — that's why it fails.

**Fix it:** declare \`const name = 'Alex'\` (or your own name), then log it.`,
    },
    {
      id: 'intro-errors-4',
      type: 'code-challenge',
      devTitle: 'Challenge: declare then log',
      devDescription: 'Add a const declaration so logging a name succeeds without throwing.',
      conceptTags: ['reference-error', 'const', 'console-log'],
      prompt: 'Fix the code so it logs a name without throwing an error.',
      setupCode: `// Declare name, then log it:`,
      starterCode: `console.log(name);`,
      solutionCode: `const name = 'Alex';
console.log(name);`,
      expectedOutput: 'Alex',
      outputFlex: 'logged-const-name',
      hints: [
        'The error happens because `name` does not exist yet.',
        'Add a `const name = ...` declaration **before** the `console.log` line.',
        'Use any name you like: `const name = \'Alex\';` (or your own name), then `console.log(name);`.',
      ],
      revealExplanation:
        'Declare the variable first — e.g. `const name = \'Alex\';` (any name works) — then `console.log(name)` prints it with no error.',
    },
    {
      id: 'intro-8',
      type: 'text',
      devTitle: 'Top-to-bottom execution',
      devDescription: 'JavaScript runs lines in order — one statement at a time.',
      conceptTags: ['order-of-execution'],
      content: `JavaScript runs **top to bottom**, one line at a time.

When you have multiple \`console.log\` calls, the first line runs first.`,
    },
    {
      id: 'intro-9',
      type: 'predict-output',
      devTitle: 'Predict: multiple log lines',
      devDescription: 'Trace several console.log calls running in sequence.',
      conceptTags: ['order-of-execution', 'console-log'],
      prompt: 'What order do these lines print? Type each line of output separately.',
      code: `console.log('first');
console.log('second');
console.log('third');`,
      expectedOutput: `first
second
third`,
      hints: [
        'JavaScript runs top to bottom. Which `console.log` runs first?',
        'Each `console.log` prints on its own line, in order.',
        'Type three lines: `\'first\'`, then `\'second\'`, then `\'third\'` — one per line or separated by spaces.',
      ],
      revealExplanation:
        'The three `console.log` calls run in order, printing `\'first\'`, `\'second\'`, and `\'third\'` on separate lines.',
    },
    {
      id: 'intro-10',
      type: 'code-challenge',
      devTitle: 'Challenge: two log lines',
      devDescription: 'Print two separate lines — a name string and a number.',
      conceptTags: ['console-log', 'order-of-execution'],
      prompt: 'Print two lines: your name on line 1, then the number 2026 on line 2.',
      setupCode: `// Replace the examples with your name:`,
      starterCode: `console.log('Alex');
console.log(0);`,
      solutionCode: `console.log('Alex');
console.log(2026);`,
      expectedOutput: `Alex
2026`,
      outputFlex: 'name-then-2026',
      hints: [
        'You need two separate `console.log` statements — one per line of output.',
        'Put your name in quotes on the first line. Numbers like `2026` do not need quotes.',
        'First log your name, then log `2026` as a number on the next line.',
      ],
      revealExplanation:
        'Two `console.log` calls print on separate lines: your name (as a quoted string, e.g. `\'Alex\'`) first, then `2026`.',
    },
  ],
};
