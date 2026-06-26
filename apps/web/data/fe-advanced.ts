import type { Challenge, ChallengeDifficulty } from './types';

function createStub(
  id: string,
  title: string,
  difficulty: ChallengeDifficulty
): Challenge {
  return {
    id,
    title,
    category: 'fe-advanced',
    difficulty,
    comingSoon: true,
    description:
      '## Coming Soon\n\nThis challenge will be available in Phase 2. Keep building momentum with the challenges that are live!',
    concepts: [],
    hints: [],
    starterCode: { javascript: '', typescript: '' },
    solution: { javascript: '', typescript: '' },
    validate: () => ({
      passed: false,
      results: [
        {
          description: 'Challenge not yet available',
          expected: 'N/A',
          actual: 'Coming soon',
          passed: false,
        },
      ],
    }),
  };
}

export const feAdvancedChallenges: Challenge[] = [
  createStub('fea-01-react-todo', 'React Todo List', 'medium'),
  createStub('fea-02-custom-hook', 'Custom useFetch Hook', 'medium'),
  createStub('fea-03-context-api', 'Context API Theme', 'easy'),
  createStub('fea-04-use-reducer', 'useReducer Counter', 'medium'),
  createStub('fea-05-memo-optimization', 'React.memo Optimization', 'hard'),
  createStub('fea-06-suspense-boundary', 'Suspense Boundary', 'hard'),
  createStub('fea-07-error-boundary', 'Error Boundary', 'medium'),
  createStub('fea-08-portal-modal', 'Portal Modal', 'medium'),
  createStub('fea-09-forward-ref', 'forwardRef Input', 'medium'),
  createStub('fea-10-compound-component', 'Compound Component', 'hard'),
  createStub('fea-11-render-props', 'Render Props Pattern', 'medium'),
  createStub('fea-12-hoc-pattern', 'Higher-Order Component', 'medium'),
  createStub('fea-13-virtual-dom-diff', 'Virtual DOM Diff', 'hard'),
  createStub('fea-14-state-machine', 'State Machine', 'hard'),
  createStub('fea-15-websocket-chat', 'WebSocket Chat', 'hard'),
  createStub('fea-16-ssr-hydration', 'SSR Hydration', 'hard'),
  createStub('fea-17-code-splitting', 'Code Splitting', 'medium'),
  createStub('fea-18-accessibility', 'Accessible Dropdown', 'medium'),
  createStub('fea-19-animation', 'CSS Animation Hook', 'medium'),
  createStub('fea-20-performance', 'Performance Profiler', 'hard'),
];
