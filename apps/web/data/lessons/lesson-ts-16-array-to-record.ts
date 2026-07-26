import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs16ArrayToRecord: Lesson = {
  id: 'lesson-ts-16-array-to-record',
  title: 'Array to Record',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-16-array-to-record'],
  estimatedMinutes: 10,
  concepts: ["records","keyBy"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Array to Record** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** records, keyBy
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function arrayToRecord(arr, keyFn) {
  return arr.reduce((acc, item) => {
      acc[String(keyFn(item))] = item;
      return acc;
    }, {});
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **records**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-16-array-to-record',
    prompt: `Implement \`arrayToRecord\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function arrayToRecord(arr, keyFn) {
  // Implement this function
  
}`,
      typescript: `function arrayToRecord(arr: Array<Record<string, unknown>>, keyFn: (item: Record<string, unknown>) => string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function arrayToRecord(arr, keyFn) {
  return arr.reduce((acc, item) => {
      acc[String(keyFn(item))] = item;
      return acc;
    }, {});
}`,
      typescript: `function arrayToRecord(arr: Array<Record<string, unknown>>, keyFn: (item: Record<string, unknown>) => string) {
  return arr.reduce((acc, item) => {
      acc[String(keyFn(item))] = item;
      return acc;
    }, {});
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'arrayToRecord');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('arrayToRecord', 'return Boolean(JSON.stringify(arrayToRecord([{ id: \'a\', v: 1 }, { id: \'b\', v: 2 }], (item) => item.id)) === JSON.stringify({ a: { id: \'a\', v: 1 }, b: { id: \'b\', v: 2 } }))');
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
    { label: 'Array to Record', url: 'https://developer.mozilla.org/' }
  ],
};
