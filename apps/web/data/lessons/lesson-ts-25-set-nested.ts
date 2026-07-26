import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs25SetNested: Lesson = {
  id: 'lesson-ts-25-set-nested',
  title: 'Set Nested Path',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-25-set-nested'],
  estimatedMinutes: 10,
  concepts: ["immutability","paths"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Set Nested Path** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** immutability, paths
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function setNested(obj, path, value) {
  const keys = path.split('.');
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      cursor[key] = { ...(cursor[key] ?? {}) };
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **immutability**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-25-set-nested',
    prompt: `Implement \`setNested\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function setNested(obj, path, value) {
  // Implement this function
  
}`,
      typescript: `function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function setNested(obj, path, value) {
  const keys = path.split('.');
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      cursor[key] = { ...(cursor[key] ?? {}) };
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}`,
      typescript: `function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      cursor[key] = { ...(cursor[key] ?? {}) };
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'setNested');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('setNested', 'return Boolean(JSON.stringify(setNested({"a":{"b":1}}, "a.b", 9)) === JSON.stringify({"a":{"b":9}}))');
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
    { label: 'Set Nested Path', url: 'https://developer.mozilla.org/' }
  ],
};
