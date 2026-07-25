import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonReactComponentPatterns: Lesson = {
  id: 'lesson-react-component-patterns',
  title: 'React Component Patterns — Compound Components & Render Props',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  relatedChallengeIds: ['fea-10-compound-component', 'fea-11-render-props'],
  estimatedMinutes: 14,
  concepts: ['compound components', 'render props', 'composition', 'API design'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Senior React interviews love **composition patterns** — not just hooks syntax.

**Compound components** share implicit state through context (Tabs + TabList + TabPanel). **Render props** invert control by passing a function child that receives state from the parent.

Both solve the same problem: flexible APIs without prop drilling.`,
    },
    {
      type: 'code-example',
      title: 'Render Props Pattern',
      language: 'javascript',
      content: `function MouseTracker({ render }) {
  const pos = { x: 10, y: 20 };
  return render(pos);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Don't say compound components and render props are interchangeable — they optimize for different ergonomics. Compound components excel at declarative JSX structure; render props excel when the consumer needs full control over rendering.`,
    },
  ],
  miniChallenge: {
    id: 'mini-react-component-patterns',
    prompt: 'Implement renderMousePosition(render) — call render with { x: 42, y: 24 }.',
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function renderMousePosition(render) {
  // Return the result of calling render with the position object
}`,
      typescript: `function renderMousePosition(render: (pos: { x: number; y: number }) => unknown): unknown {
  // Return the result of calling render with the position object
}`,
    },
    solution: {
      javascript: `function renderMousePosition(render) {
  return render({ x: 42, y: 24 });
}`,
      typescript: `function renderMousePosition(render: (pos: { x: number; y: number }) => unknown): unknown {
  return render({ x: 42, y: 24 });
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'renderMousePosition');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'renderMousePosition',
          'return Boolean((() => { const out = renderMousePosition((pos) => pos.x + pos.y); return out === 66; })())'
        );
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — call render with { x: 42, y: 24 }.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'React — Passing Data Deeply with Context', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
  ],
};
