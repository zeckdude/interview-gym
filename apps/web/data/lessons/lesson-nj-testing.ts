import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjTesting: Lesson = {
  id: 'lesson-nj-testing',
  title: 'Testing Next.js Applications',
  category: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-19-testing-nextjs'],
  estimatedMinutes: 15,
  concepts: ['unit testing', 'React Testing Library', 'e2e testing', 'testing server components'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Testing a Next.js app means matching the **right tool to the right layer** — no single tool covers everything.

- **Unit tests (Vitest/Jest)** — for pure logic: utility functions, data transforms, validation. Also the right tool for **async Server Components**, since they're just async functions — call them directly and \`await\` the result, then assert on the returned JSX/data rather than trying to "render" them in a DOM.

- **React Testing Library (RTL)** — for **Client Components** with hooks and interactivity. RTL renders real React components into a jsdom environment and simulates user events (clicks, typing), which requires the component tree to run synchronously with hooks — something async Server Components fundamentally can't do.

- **End-to-end (Playwright/Cypress)** — for full user flows that cross real routing, middleware, and browser behavior: sign-in, navigation between pages, actual network requests. This is also where you validate things unit/component tests can't reach, like middleware redirects and intercepting-route modal behavior.

**The interview-relevant nuance:** you generally *can't* directly render an async Server Component with RTL, because RTL's \`render()\` expects a synchronous component. The common workarounds are (1) push logic into plain functions and unit test those, or (2) rely on E2E tests for true integration coverage of the rendered output.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// Unit test — a pure function extracted from a Server Component
test('formats price correctly', () => {
  expect(formatPrice(1999)).toBe('$19.99');
});

// Unit test — calling an async Server Component directly
test('BlogPost renders the post title', async () => {
  const jsx = await BlogPost({ params: Promise.resolve({ slug: 'hello' }) });
  expect(jsx.props.children).toContain('Hello World');
});

// RTL — a Client Component with interactivity
test('counter increments on click', async () => {
  render(<Counter initial={0} />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('1')).toBeInTheDocument();
});`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I'll just wrap my async Server Component in RTL's \`render()\`."** RTL's \`render()\` expects a synchronous component function — passing an async component either throws or silently renders a pending Promise instead of your UI. Extract the data-shaping logic into a plain async function you can unit test, and save full-page integration coverage for E2E tests.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-testing',
    prompt: `Implement pickTestStrategy({ isAsync, hasHooks, needsBrowser }) — return 'e2e' for anything needing real browser/routing behavior, 'unit' for async Server Components or pure functions, and 'RTL' for interactive Client Components with hooks.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function pickTestStrategy({ isAsync, hasHooks, needsBrowser }) {
  
}`,
      typescript: `function pickTestStrategy(target: {
  isAsync?: boolean;
  hasHooks?: boolean;
  needsBrowser?: boolean;
}): 'unit' | 'RTL' | 'e2e' {
  
}`,
    },
    solution: {
      javascript: `function pickTestStrategy({ isAsync, hasHooks, needsBrowser }) {
  if (needsBrowser) return 'e2e';
  if (isAsync) return 'unit';
  if (hasHooks) return 'RTL';
  return 'unit';
}`,
      typescript: `function pickTestStrategy(target: {
  isAsync?: boolean;
  hasHooks?: boolean;
  needsBrowser?: boolean;
}): 'unit' | 'RTL' | 'e2e' {
  const { isAsync, hasHooks, needsBrowser } = target;
  if (needsBrowser) return 'e2e';
  if (isAsync) return 'unit';
  if (hasHooks) return 'RTL';
  return 'unit';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pickTestStrategy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'pickTestStrategy',
          `return Boolean(
            pickTestStrategy({ needsBrowser: true }) === 'e2e' &&
            pickTestStrategy({ isAsync: true }) === 'unit' &&
            pickTestStrategy({ hasHooks: true }) === 'RTL' &&
            pickTestStrategy({}) === 'unit'
          )`
        );
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
    { label: 'Testing — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/testing' },
    { label: 'Playwright with Next.js — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/testing/playwright' },
  ],
};
