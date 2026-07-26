import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe29InvertObject: Lesson = {
  id: 'lesson-fe-29-invert-object',
  title: 'Invert Object Keys and Values',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-29-invert-object'],
  estimatedMinutes: 10,
  concepts: ["objects","maps"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Invert Object Keys and Values** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, maps
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function invertObject(obj) {
  const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[String(value)] = key;
    }
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **objects**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-29-invert-object',
    prompt: `Implement \`invertObject(obj)\` — swap keys and values (values must be stringifiable).`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function invertObject(obj) {
  // Implement this function
  
}`,
      typescript: `function invertObject(obj: Record<string, string | number>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function invertObject(obj) {
  const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[String(value)] = key;
    }
    return result;
}`,
      typescript: `function invertObject(obj: Record<string, string | number>) {
  const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[String(value)] = key;
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'invertObject');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('invertObject', `return Boolean(JSON.stringify(invertObject({"a":"1","b":"2"})) === JSON.stringify({"1":"a","2":"b"}));`);
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
    { label: 'Invert Object Keys and Values', url: 'https://developer.mozilla.org/' }
  ],
};
