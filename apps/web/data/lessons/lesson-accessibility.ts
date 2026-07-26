import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAccessibility: Lesson = {
  id: 'lesson-accessibility',
  title: 'Accessibility — Building Inclusive UIs',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-10-modal-focus","fea-18-accessible-dropdown"],
  estimatedMinutes: 11,
  concepts: ["ARIA","keyboard navigation"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Accessibility** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** ARIA, keyboard navigation
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function getAriaLabel(isOpen) {
  return isOpen ? 'Close menu' : 'Open menu';
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **ARIA**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-accessibility',
    prompt: `Return Open menu or Close menu based on isOpen.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function getAriaLabel(isOpen) {
  
}`,
      typescript: `function getAriaLabel(isOpen: boolean): string {
  
}`,
    },
    solution: {
      javascript: `function getAriaLabel(isOpen) {
  return isOpen ? 'Close menu' : 'Open menu';
}`,
      typescript: `function getAriaLabel(isOpen: boolean): string {
  return isOpen ? 'Close menu' : 'Open menu';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'getAriaLabel');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('getAriaLabel', 'return Boolean(getAriaLabel(false) === \'Open menu\' && getAriaLabel(true) === \'Close menu\')');
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
    { label: 'Accessibility — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' }
  ],
};
