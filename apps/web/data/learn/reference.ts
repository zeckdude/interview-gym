/**
 * JavaScript reference cards — EP-style cheat sheet.
 * Only entries for authored modules; filtered by user progress at runtime.
 */

import { LEARN_GRAPH_NODES } from './graph';

export interface LearnReferenceEntry {
  id: string;
  title: string;
  moduleId: string;
  mdnUrl: string;
  description: string;
  code: string;
  result: string;
}

export function isLearnModuleAvailable(moduleId: string): boolean {
  const node = LEARN_GRAPH_NODES.find((n) => n.id === moduleId);
  return node?.contentAvailable ?? false;
}

export function getLearnModuleTitle(moduleId: string): string | undefined {
  return LEARN_GRAPH_NODES.find((n) => n.id === moduleId)?.title;
}

export function getReferencesForCoveredModules(
  coveredModuleIds: string[]
): LearnReferenceEntry[] {
  const covered = new Set(coveredModuleIds);
  return LEARN_REFERENCES.filter((entry) => covered.has(entry.moduleId));
}

/** Reference entries for authored modules only (Introduction + Variables). */
export const LEARN_REFERENCES: LearnReferenceEntry[] = [
  {
    id: 'ref-console-log',
    title: 'console.log',
    moduleId: 'js-01-introduction',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/console/log',
    description:
      'The simplest way to see output. Pass any expression — strings, numbers, or variables — and JavaScript prints the result.',
    code: `console.log('Hello, world!');
console.log(2 + 3);`,
    result: `Hello, world!
5`,
  },
  {
    id: 'ref-expressions',
    title: 'Expressions',
    moduleId: 'js-01-introduction',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators',
    description:
      'An **expression** produces a value. Inside `console.log(...)`, JavaScript evaluates the expression first, then prints it.',
    code: `console.log(10 - 4);`,
    result: '6',
  },
  {
    id: 'ref-order-of-execution',
    title: 'Order of execution',
    moduleId: 'js-01-introduction',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements',
    description:
      'JavaScript runs **top to bottom**, one line at a time. Multiple `console.log` calls print in the order they appear.',
    code: `console.log('first');
console.log('second');`,
    result: `first
second`,
  },
  {
    id: 'ref-reference-error',
    title: 'ReferenceError',
    moduleId: 'js-01-introduction',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError',
    description:
      'Thrown when you use a name that **does not exist** (or is not initialized yet). The program stops — read the message to find the bad line.',
    code: `console.log(missing);`,
    result: 'ReferenceError: missing is not defined',
  },
  {
    id: 'ref-const',
    title: 'const',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
    description:
      'Declares a **constant binding** — the name always points to the same value. Use `const` by default.',
    code: `const greeting = 'Hello';
console.log(greeting);`,
    result: 'Hello',
  },
  {
    id: 'ref-let',
    title: 'let',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
    description:
      'Declares a variable you **can reassign**. Use for counters, loop indices, and values that change.',
    code: `let score = 0;
score = score + 10;
console.log(score);`,
    result: '10',
  },
  {
    id: 'ref-const-reassignment',
    title: 'Reassigning const',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment',
    description:
      'Trying to reassign a `const` throws **TypeError: Assignment to constant variable**. The program stops before later lines run.',
    code: `const x = 1;
x = 2;`,
    result: 'TypeError: Assignment to constant variable.',
  },
  {
    id: 'ref-syntax-redeclaration',
    title: 'Redeclaring const',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Identifier_has_already_been_declared',
    description:
      'Declaring the same name twice with `const` or `let` in one scope is a **SyntaxError** — the code never runs.',
    code: `const x = 5;
const x = 6;`,
    result: 'SyntaxError: Identifier \'x\' has already been declared',
  },
  {
    id: 'ref-tdz',
    title: 'Temporal dead zone',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz',
    description:
      'Using `const`/`let` **before** the declaration line throws **ReferenceError: Cannot access before initialization**.',
    code: `console.log(x);
const x = 5;`,
    result: 'ReferenceError: Cannot access \'x\' before initialization',
  },
  {
    id: 'ref-const-mutation',
    title: 'const mutation',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
    description:
      '`const` blocks **reassignment** but you can still **mutate** arrays and objects — push, pop, change properties.',
    code: `const names = ['Ada'];
names.push('Grace');
console.log(names);`,
    result: '["Ada","Grace"]',
  },
  {
    id: 'ref-typeof',
    title: 'typeof',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof',
    description:
      'Returns a **string** naming the type of a value — `"string"`, `"number"`, `"boolean"`, and so on.',
    code: `console.log(typeof true);
console.log(typeof 'Ada');`,
    result: `boolean
string`,
  },
  {
    id: 'ref-typeof-null',
    title: 'typeof null',
    moduleId: 'js-02-variables',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null',
    description:
      'A famous quirk: `typeof null` returns `"object"`. In practice, treat `null` as its own empty value.',
    code: `console.log(typeof null);`,
    result: 'object',
  },
];
