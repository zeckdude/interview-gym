import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe29InvertObject: Lesson = {
  id: 'lesson-fe-29-invert-object',
  title: 'Invert Object Keys and Values',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['fe-29-invert-object'],
  estimatedMinutes: 13,
  concepts: ['objects', 'maps'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You have a status code map: \`{ active: "1", inactive: "2" }\`. The API returns \`"1"\` and you need to look up \`"active"\`. Inverting the map gives \`{ "1": "active", "2": "inactive" }\`.

**Object inversion** tests whether you understand that object keys are always strings, values can collide, and \`Object.entries\` is the right iteration tool.
      `,
    },
    {
      type: 'explanation',
      title: 'How Object Inversion Works',
      content: `
**Invert** means: for each \`[key, value]\` pair, store \`result[String(value)] = key\`.

Why \`String(value)\`? Object keys in JavaScript are always strings (or symbols). A numeric value \`1\` becomes \`"1"\` as a key.

Walk with \`Object.entries(obj)\`:

\`\`\`
{ a: "1", b: "2" }  →  { "1": "a", "2": "b" }
\`\`\`

**Collision risk:** if two keys share the same value, the later one wins. Mention this in interviews.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function invertObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[String(value)] = key;
  }
  return result;
}

invertObject({ a: '1', b: '2' });
// => { "1": "a", "2": "b" }`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer: "What if two keys have the same value?"
invertObject({ a: '1', b: '1' });
// => { "1": "b" }  — "a" is overwritten
// Say: "I'd return an array of keys or throw on collision"

// Interviewer: "What if values aren't stringifiable?"
invertObject({ a: { nested: true } });
// => { "[object Object]": "a" }  — useless!
// Say: "I'd restrict to string/number values or use JSON.stringify"

// Using reduce (alternative style):
function invertObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[String(value)] = key;
    return acc;
  }, {});
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Assuming values are unique.** \`{ x: 1, y: 1 }\` silently loses data. Always mention collision handling — return an array, throw, or use a \`Map\` with array values.

**Using values as keys without \`String()\`.** Numbers work (JS coerces), but being explicit shows you understand key coercion rules.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Invert',
      content: `
**Use a \`Map\` when you need non-string keys** or guaranteed insertion order with any key type.

**Don't invert large lookup tables at runtime** — precompute the reverse map or use bidirectional data structures.
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
    { label: 'Object.entries — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries' },
    { label: 'Map — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
