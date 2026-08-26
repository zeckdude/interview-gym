import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonDragDrop: Lesson = {
  id: 'lesson-drag-drop',
  title: 'HTML5 Drag and Drop API',
  category: 'fe-web-apis',
  topLevel: 'fe',
  subcategory: 'web-apis',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-04-deep-clone"],
  estimatedMinutes: 10,
  concepts: ["dragstart","drop"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**HTML5 Drag and Drop API** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** dragstart, drop
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function reorder(list, fromIndex, toIndex) {
  const result = [...list];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **dragstart**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-drag-drop',
    prompt: `Implement reorder(list, fromIndex, toIndex).`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function reorder(list, fromIndex, toIndex) {
  
}`,
      typescript: `function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  
}`,
    },
    solution: {
      javascript: `function reorder(list, fromIndex, toIndex) {
  const result = [...list];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
}`,
      typescript: `function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'reorder');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('reorder', 'return Boolean(JSON.stringify(reorder([\'a\',\'b\',\'c\'], 0, 2)) === JSON.stringify([\'b\',\'c\',\'a\']))');
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
    { label: 'Drag and Drop — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API' }
  ],
};
