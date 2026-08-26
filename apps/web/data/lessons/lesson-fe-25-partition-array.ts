import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe25PartitionArray: Lesson = {
  id: 'lesson-fe-25-partition-array',
  title: 'Partition Array by Predicate',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['fe-25-partition-array'],
  estimatedMinutes: 13,
  concepts: ['arrays', 'predicates', 'higher-order functions'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You're building an admin dashboard. Users need to be split into "active" and "inactive" lists from a single API response — without iterating the array twice.

**Partition** is \`filter\` done in one pass, returning both the matches and the non-matches. Interviewers use it to test higher-order functions and single-pass algorithms.
      `,
    },
    {
      type: 'explanation',
      title: 'How Partition Works',
      content: `
A **predicate** is a function that returns \`true\` or \`false\` for each item.

Partition walks the array once:

- If \`predicate(item)\` is true → push to \`pass\`
- Otherwise → push to \`fail\`

Return \`[pass, fail]\` — a tuple of two arrays.

**Order is preserved** within each group. The relative order of pass vs fail items matches the original array's order within their respective groups.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function partition(arr, predicate) {
  const pass = [];
  const fail = [];
  for (const item of arr) {
    if (predicate(item)) pass.push(item);
    else fail.push(item);
  }
  return [pass, fail];
}

partition([1, 2, 3, 4], (n) => n % 2 === 0);
// => [[2, 4], [1, 3]]`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "Can you do it with reduce?"
function partition(arr, predicate) {
  return arr.reduce(
    ([pass, fail], item) => {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
      return [pass, fail];
    },
    [[], []]
  );
}

// Interviewer: "Partition objects by a property"
const users = [{ name: 'Ada', active: true }, { name: 'Bob', active: false }];
const [active, inactive] = partition(users, (u) => u.active);`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Calling \`filter\` twice** — \`[arr.filter(p), arr.filter(x => !p(x))]\` works but iterates twice. Mention the single-pass \`for...of\` approach for efficiency.

**Predicate called twice per item** if you naively filter both ways. Partition guarantees exactly one call per element.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Partition',
      content: `
**When you only need one side**, use \`filter\` — don't build the \`fail\` array you'll throw away.

**When grouping into more than two buckets**, use \`groupBy\` instead of partition.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-25-partition-array',
    prompt: `Implement \`partition(arr, predicate)\` — return \`[pass, fail]\` tuples split by a predicate.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function partition(arr, predicate) {
  // Implement this function
  
}`,
      typescript: `function partition(arr: number[], predicate: (n: number) => boolean) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function partition(arr, predicate) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}`,
      typescript: `function partition(arr: number[], predicate: (n: number) => boolean) {
  const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) pass.push(item);
      else fail.push(item);
    }
    return [pass, fail];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'partition');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('partition', `return Boolean(JSON.stringify(partition([1, 2, 3, 4], (n) => n % 2 === 0)) === JSON.stringify([[2, 4], [1, 3]]));`);
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
    { label: 'Array.prototype.filter — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter' },
    { label: 'Array.prototype.reduce — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
