import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea23CheckboxGroup: Lesson = {
  id: 'lesson-fea-23-checkbox-group',
  title: 'Checkbox Group Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  relatedChallengeIds: ['fea-23-checkbox-group'],
  estimatedMinutes: 10,
  concepts: ["state","factories","selection"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Checkbox Group Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** state, factories, selection
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createCheckboxGroup(initial = []) {
  const selected = new Set(initial);
    return {
      isChecked(id) { return selected.has(id); },
      toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      },
      getSelected() { return [...selected]; },
      clear() { selected.clear(); },
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
    id: 'mini-fea-23-checkbox-group',
    prompt: `Implement \`createCheckboxGroup(initial?)\` — manage a set of selected checkbox ids.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createCheckboxGroup(initial = []) {
  // Implement this function
  
}`,
      typescript: `function createCheckboxGroup(initial?: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createCheckboxGroup(initial = []) {
  const selected = new Set(initial);
    return {
      isChecked(id) { return selected.has(id); },
      toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      },
      getSelected() { return [...selected]; },
      clear() { selected.clear(); },
    };
}`,
      typescript: `function createCheckboxGroup(initial?: string[]) {
  const selected = new Set(initial);
    return {
      isChecked(id) { return selected.has(id); },
      toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      },
      getSelected() { return [...selected]; },
      clear() { selected.clear(); },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createCheckboxGroup');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createCheckboxGroup', `return Boolean((function () {
                  const group = createCheckboxGroup(['a']);
                  group.toggle('b');
                  group.toggle('a');
                  const ids = group.getSelected().sort().join(',');
                  return ids === 'b';
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
    { label: 'Checkbox Group Factory', url: 'https://developer.mozilla.org/' }
  ],
};
