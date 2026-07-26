import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea24TabsState: Lesson = {
  id: 'lesson-fea-24-tabs-state',
  title: 'Tabs State Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  relatedChallengeIds: ['fea-24-tabs-state'],
  estimatedMinutes: 10,
  concepts: ["state","factories","navigation"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Tabs State Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** state, factories, navigation
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createTabs(tabIds, defaultTab) {
  let active = defaultTab;
    const tabs = [...tabIds];
    return {
      getTabs() { return tabs; },
      getActive() { return active; },
      setActive(id) {
        if (tabs.includes(id)) active = id;
      },
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
    id: 'mini-fea-24-tabs-state',
    prompt: `Implement \`createTabs(tabIds, defaultTab)\` — track which tab is active.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createTabs(tabIds, defaultTab) {
  // Implement this function
  
}`,
      typescript: `function createTabs(tabIds: string[], defaultTab: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createTabs(tabIds, defaultTab) {
  let active = defaultTab;
    const tabs = [...tabIds];
    return {
      getTabs() { return tabs; },
      getActive() { return active; },
      setActive(id) {
        if (tabs.includes(id)) active = id;
      },
    };
}`,
      typescript: `function createTabs(tabIds: string[], defaultTab: string) {
  let active = defaultTab;
    const tabs = [...tabIds];
    return {
      getTabs() { return tabs; },
      getActive() { return active; },
      setActive(id) {
        if (tabs.includes(id)) active = id;
      },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createTabs');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createTabs', `return Boolean((function () {
                  const tabs = createTabs(['home', 'settings'], 'home');
                  tabs.setActive('settings');
                  return tabs.getActive() === 'settings';
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
    { label: 'Tabs State Factory', url: 'https://developer.mozilla.org/' }
  ],
};
