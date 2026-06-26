import type { Challenge, ChallengeDifficulty } from './types';

function createStub(
  id: string,
  title: string,
  difficulty: ChallengeDifficulty
): Challenge {
  return {
    id,
    title,
    category: 'fe',
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

export const feChallenges: Challenge[] = [
  createStub('fe-01-closure-counter', 'Closure Counter', 'easy'),
  createStub('fe-02-event-delegation', 'Event Delegation', 'easy'),
  createStub('fe-03-promise-all', 'Promise.all Polyfill', 'medium'),
  createStub('fe-04-deep-clone', 'Deep Clone Object', 'medium'),
  createStub('fe-05-debounce-ui', 'Debounced Search Input', 'easy'),
  createStub('fe-06-virtual-list', 'Virtual List Renderer', 'hard'),
  createStub('fe-07-form-validation', 'Form Validation', 'medium'),
  createStub('fe-08-local-storage', 'LocalStorage Hook', 'easy'),
  createStub('fe-09-infinite-scroll', 'Infinite Scroll', 'medium'),
  createStub('fe-10-modal-focus', 'Modal Focus Trap', 'medium'),
  createStub('fe-11-observer-pattern', 'Observer Pattern', 'easy'),
  createStub('fe-12-memoize', 'Memoize Function', 'medium'),
  createStub('fe-13-throttle', 'Throttle Function', 'medium'),
  createStub('fe-14-curry', 'Function Currying', 'medium'),
  createStub('fe-15-pipe-compose', 'Pipe and Compose', 'easy'),
  createStub('fe-16-flat-array', 'Flatten Nested Array', 'easy'),
  createStub('fe-17-unique-array', 'Unique Array Values', 'easy'),
  createStub('fe-18-group-by', 'Group By Key', 'medium'),
  createStub('fe-19-sort-objects', 'Sort Array of Objects', 'easy'),
  createStub('fe-20-fetch-retry', 'Fetch with Retry', 'medium'),
];
