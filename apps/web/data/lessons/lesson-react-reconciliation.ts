import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonReactReconciliation: Lesson = {
  id: 'lesson-react-reconciliation',
  title: 'React Reconciliation & the Virtual DOM',
  category: 'fe-advanced',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-14-virtual-dom', 'fea-13-state-machine'],
  estimatedMinutes: 16,
  concepts: ['virtual DOM', 'reconciliation', 'diffing', 'keys', 'fiber'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Reconciliation** is how React updates the DOM efficiently. React builds a virtual tree, diffs it against the previous tree, and applies the minimal set of DOM mutations.

Interviewers ask about **keys**, why index keys break with reordering, and how React batches updates.`,
    },
    {
      type: 'code-example',
      title: 'Stable Keys',
      language: 'javascript',
      content: `function listDiff(oldIds, newIds) {
  const added = newIds.filter((id) => !oldIds.includes(id));
  const removed = oldIds.filter((id) => !newIds.includes(id));
  return { added, removed };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Using array index as \`key\` when the list can reorder causes React to reuse the wrong component instance — state "jumps" between rows. Always use stable unique IDs from your data.`,
    },
  ],
  miniChallenge: {
    id: 'mini-react-reconciliation',
    prompt: 'Implement listDiff(oldIds, newIds) returning { added, removed } string arrays.',
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function listDiff(oldIds, newIds) {
  return { added: [], removed: [] };
}`,
      typescript: `function listDiff(oldIds: string[], newIds: string[]): { added: string[]; removed: string[] } {
  return { added: [], removed: [] };
}`,
    },
    solution: {
      javascript: `function listDiff(oldIds, newIds) {
  return {
    added: newIds.filter((id) => !oldIds.includes(id)),
    removed: oldIds.filter((id) => !newIds.includes(id)),
  };
}`,
      typescript: `function listDiff(oldIds: string[], newIds: string[]): { added: string[]; removed: string[] } {
  return {
    added: newIds.filter((id) => !oldIds.includes(id)),
    removed: oldIds.filter((id) => !newIds.includes(id)),
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'listDiff');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'listDiff',
          'return Boolean((() => { const r = listDiff(["a","b"], ["b","c"]); return r.added.join(",") === "c" && r.removed.join(",") === "a"; })())'
        );
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check added vs removed logic.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'React — Preserving and Resetting State', url: 'https://react.dev/learn/preserving-and-resetting-state' },
  ],
};
