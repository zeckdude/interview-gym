import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea22InputField: Lesson = {
  id: 'lesson-fea-22-input-field',
  title: 'Input Field Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  relatedChallengeIds: ['fea-22-input-field'],
  estimatedMinutes: 10,
  concepts: ["state","factories","forms"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Input Field Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** state, factories, forms
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createInputField(initial = "") {
  let value = initial;
    const listeners = new Set();
    const notify = () => listeners.forEach((fn) => fn(value));
    return {
      getValue() { return value; },
      setValue(next) { value = next; notify(); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **state**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-22-input-field',
    prompt: `Implement \`createInputField(initial?)\` — controlled input state with subscribe/unsubscribe.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createInputField(initial = "") {
  // Implement this function
  
}`,
      typescript: `function createInputField(initial?: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createInputField(initial = "") {
  let value = initial;
    const listeners = new Set();
    const notify = () => listeners.forEach((fn) => fn(value));
    return {
      getValue() { return value; },
      setValue(next) { value = next; notify(); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    };
}`,
      typescript: `function createInputField(initial?: string) {
  let value = initial;
    const listeners = new Set();
    const notify = () => listeners.forEach((fn) => fn(value));
    return {
      getValue() { return value; },
      setValue(next) { value = next; notify(); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createInputField');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createInputField', `return Boolean((function () {
                  const field = createInputField('');
                  let seen = '';
                  field.subscribe((v) => { seen = v; });
                  field.setValue('hello');
                  return field.getValue() === 'hello' && seen === 'hello';
                })());`);
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
    { label: 'Input Field Factory', url: 'https://developer.mozilla.org/' }
  ],
};
