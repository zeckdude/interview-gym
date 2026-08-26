import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonClosuresHof: Lesson = {
  id: 'lesson-closures-hof',
  title: 'Closures and Higher-Order Functions',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-04-debounce","be-17-validation-schema"],
  estimatedMinutes: 12,
  concepts: ["closure","lexical scope","HOF"],
  steps: [
    {
      type: 'explanation',
      title: 'What is a Closure?',
      content: `
A **closure** is a function that remembers variables from the scope where it was created — even after that outer scope has finished executing.

Think of it like a backpack. When a function is created, it packs up any variables it references. It carries that backpack wherever it goes.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Closure Example',
      language: 'javascript',
      content: `
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
      `,
    },
    {
      type: 'gotcha',
      title: '⚠️ The Loop Closure Gotcha',
      content: `
Use **let** in loops — **var** shares one binding across all iterations, causing classic closure bugs in async callbacks.
      `,
    },
    {
      type: 'explanation',
      title: 'Higher-Order Functions',
      content: `
A **higher-order function** takes or returns another function. debounce, map, and filter are all HOFs powered by closures.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-closures-hof',
    prompt: `Implement makeAdder(x) that returns a function adding x to its argument.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function makeAdder(x) {
  
}`,
      typescript: `function makeAdder(x: number): (y: number) => number {
  
}`,
    },
    solution: {
      javascript: `function makeAdder(x) {
  return function(y) { return x + y; };
}`,
      typescript: `function makeAdder(x: number): (y: number) => number {
  return function(y: number): number { return x + y; };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'makeAdder');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('makeAdder', 'return Boolean(makeAdder(5)(3) === 8 && makeAdder(100)(1) === 101)');
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
    { label: 'Closures — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' }
  ],
};
