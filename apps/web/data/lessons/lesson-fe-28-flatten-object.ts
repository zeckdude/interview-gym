import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe28FlattenObject: Lesson = {
  id: 'lesson-fe-28-flatten-object',
  title: 'Flatten Nested Object',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-28-flatten-object'],
  estimatedMinutes: 10,
  concepts: ["objects","recursion","paths"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Flatten Nested Object** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** objects, recursion, paths
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flattenObject(obj) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
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
    id: 'mini-fe-28-flatten-object',
    prompt: `Implement \`flattenObject(obj)\` — flatten nested plain objects into dot-separated key paths.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function flattenObject(obj) {
  // Implement this function
  
}`,
      typescript: `function flattenObject(obj: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flattenObject(obj) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}`,
      typescript: `function flattenObject(obj: Record<string, unknown>) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flattenObject');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flattenObject', `return Boolean(JSON.stringify(flattenObject({"a":{"b":1},"c":2})) === JSON.stringify({"a.b":1,"c":2}));`);
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
    { label: 'Flatten Nested Object', url: 'https://developer.mozilla.org/' }
  ],
};
