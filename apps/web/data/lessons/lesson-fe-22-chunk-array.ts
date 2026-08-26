import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe22ChunkArray: Lesson = {
  id: 'lesson-fe-22-chunk-array',
  title: 'Chunk Array',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['fe-22-chunk-array'],
  estimatedMinutes: 12,
  concepts: ['arrays', 'slicing'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You have 1,000 user IDs to delete via an API that accepts batches of 50. You need to split the array into fixed-size groups before sending each request.

**Pagination, batch processing, and rate-limited API calls** all use chunking. Interviewers ask this to see if you understand array iteration and non-mutating methods like \`slice\`.
      `,
    },
    {
      type: 'explanation',
      title: 'How Array Slicing Works',
      content: `
\`arr.slice(start, end)\` returns a **new array** with elements from \`start\` up to (but not including) \`end\`. It does **not** mutate the original.

Key differences interviewers probe:

- **\`slice\`** — non-mutating, returns a shallow copy of a portion
- **\`splice\`** — mutates the original array in place

For chunking, use \`slice\` inside a loop that jumps by \`size\` each iteration: \`i = 0, size, 2*size, …\`

The **last chunk** is often smaller than \`size\` — \`slice\` handles this automatically.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What about empty input or size <= 0?"
function chunk(arr, size) {
  if (size <= 0) return [];  // or throw — state your choice
  if (arr.length === 0) return [];

  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Alternative one-liner style (mention you know it exists):
// Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
//   arr.slice(i * size, i * size + size)
// );`,
    },
    {
      type: 'gotcha',
      title: '⚠️ The size=0 Trap',
      content: `
If \`size\` is 0, a loop like \`i += size\` **never advances** — infinite loop. Always handle \`size <= 0\` explicitly: return \`[]\`, throw an error, or ask the interviewer what the expected behavior is.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Chunk',
      content: `
**Don't materialize chunks when you can stream.** Processing a 10 GB log file? Iterate lazily — don't load it all into memory and chunk it.

**Don't chunk when \`Array.prototype.reduce\` or a generator** gives you the same result with less memory overhead for large datasets.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-22-chunk-array',
    prompt: `Implement \`chunk(arr, size)\` — split an array into sub-arrays of at most \`size\` items.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function chunk(arr, size) {
  // Implement this function
  
}`,
      typescript: `function chunk(arr: unknown[], size: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function chunk(arr, size) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}`,
      typescript: `function chunk(arr: unknown[], size: number) {
  const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'chunk');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('chunk', `return Boolean(JSON.stringify(chunk([1,2,3,4,5], 2)) === JSON.stringify([[1,2],[3,4],[5]]));`);
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
    { label: 'Array.prototype.slice — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice' },
    { label: 'Array — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
