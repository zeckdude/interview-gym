import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'markdown-raw',
      transform(code, id) {
        if (id.endsWith('.md')) {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null,
          };
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts'],
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['data/**/*.ts', 'lib/**/*.ts'],
      exclude: [
        'data/types.ts',
        'lib/prisma.ts',
        'lib/anthropic.ts',
        'lib/clerk-appearance.ts',
        'lib/ai-prompts.ts',
        'lib/push-client.ts',
        'lib/email.ts',
        'lib/notifications.ts',
        'lib/generate-challenge-job.ts',
        'lib/dashboard.ts',
        'lib/leaderboard.ts',
        'lib/lessons.ts',
        'lib/time-pressure-analytics.ts',
        'lib/ai-auth.ts',
        'lib/lesson-for-challenge.ts',
        'lib/user-challenge.ts',
        'data/lessons/**',
        'data/badges.ts',
        'data/be-questions.ts',
        'data/fe-questions.ts',
        // Orphan / unused challenge folders not in the published arrays
        'data/challenges/fea-12-hoc-pattern/**',
        'data/challenges/fea-13-virtual-dom-diff/**',
        'data/challenges/fea-14-state-machine/**',
        // Per-challenge assembly files (markdown wiring) — validators covered separately
        'data/challenges/**/code.ts',
        'data/challenges/**/index.ts',
        'data/be-challenges.ts',
        'data/fe-challenges.ts',
        'data/fe-advanced.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
