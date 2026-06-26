import type { Challenge, ChallengeLanguage } from './types';
import { challenge as be01 } from './challenges/be-01-list-files';
import { challenge as be02 } from './challenges/be-02-read-write-file';
import { challenge as be03 } from './challenges/be-03-async-file-read';
import { challenge as be04 } from './challenges/be-04-debounce';
import { challenge as be05 } from './challenges/be-05-env-config';

const stubChallenge = (
  id: string,
  title: string,
  difficulty: Challenge['difficulty']
): Challenge => ({
  id,
  title,
  category: 'be',
  difficulty,
  comingSoon: true,
  description:
    '## Coming Soon\n\nThis challenge will be available in Phase 2. Keep building momentum with the challenges that are live!',
  concepts: [],
  hints: [],
  starterCode: { javascript: '', typescript: '' },
  solution: { javascript: '', typescript: '' },
  validate: (_userCode: string, _language: ChallengeLanguage) => ({
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
});

export const beChallenges: Challenge[] = [
  be01,
  be02,
  be03,
  be04,
  be05,
  stubChallenge('be-06-path-join', 'Path Join Utility', 'easy'),
  stubChallenge('be-07-json-parse', 'Safe JSON Parse', 'easy'),
  stubChallenge('be-08-event-emitter', 'Event Emitter', 'medium'),
  stubChallenge('be-09-rate-limiter', 'Rate Limiter', 'medium'),
  stubChallenge('be-10-middleware-chain', 'Middleware Chain', 'medium'),
  stubChallenge('be-11-cache-lru', 'LRU Cache', 'hard'),
  stubChallenge('be-12-stream-transform', 'Stream Transform', 'hard'),
  stubChallenge('be-13-http-router', 'HTTP Router', 'medium'),
  stubChallenge('be-14-logger', 'Structured Logger', 'easy'),
  stubChallenge('be-15-retry-logic', 'Retry with Backoff', 'medium'),
  stubChallenge('be-16-queue', 'Job Queue', 'hard'),
  stubChallenge('be-17-validation-schema', 'Validation Schema', 'medium'),
  stubChallenge('be-18-singleton-db', 'Database Singleton', 'easy'),
  stubChallenge('be-19-graceful-shutdown', 'Graceful Shutdown', 'hard'),
  stubChallenge('be-20-api-client', 'API Client Wrapper', 'medium'),
];
