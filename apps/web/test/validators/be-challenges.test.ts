import { describe, it, expect } from 'vitest';
import { beChallenges } from '@/data/be-challenges';
import { validatePrepared, validateSolution } from '../helpers';

describe('BE Challenge Validators', () => {
  it('has 30 challenges', () => {
    expect(beChallenges).toHaveLength(30);
  });

  describe.each(beChallenges)('$id ($title)', (challenge) => {
    it('passes with the provided correct solution (JS)', async () => {
      const result = await validateSolution(challenge, 'javascript');
      expect(result.passed).toBe(true);
      expect(result.results.every((r) => r.passed)).toBe(true);
    });

    it('passes with the provided correct solution (TS)', async () => {
      const result = await validateSolution(challenge, 'typescript');
      expect(result.passed).toBe(true);
    });

    it('returns ValidationResult shape', async () => {
      const result = await validateSolution(challenge, 'javascript');
      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      result.results.forEach((r) => {
        expect(r).toHaveProperty('description');
        expect(r).toHaveProperty('expected');
        expect(r).toHaveProperty('actual');
        expect(r).toHaveProperty('passed');
      });
    });

    it('fails with incorrect solution', async () => {
      const wrongCode = `
        module.exports = {
          ${guessExportName(challenge.id)}: function() { return null; }
        };
      `;
      const result = await validatePrepared(challenge, wrongCode, 'javascript');
      expect(result.passed).toBe(false);
    });

    it('does not throw when code throws an error', async () => {
      await expect(
        validatePrepared(
          challenge,
          'function x() { throw new Error("boom"); }\nmodule.exports = { x };',
          'javascript'
        )
      ).resolves.toMatchObject({ passed: false });
    });

    it('fails gracefully when code is empty', async () => {
      const result = await validatePrepared(challenge, '', 'javascript');
      expect(result.passed).toBe(false);
    });
  });
});

/** Best-effort export name from challenge id for wrong-code tests. */
function guessExportName(id: string): string {
  const map: Record<string, string> = {
    'be-01-list-files': 'listFiles',
    'be-02-read-write-file': 'readWriteFile',
    'be-03-async-file-read': 'readFileAsync',
    'be-04-http-server': 'createServer',
    'be-05-env-config': 'loadConfig',
    'be-06-path-join': 'joinPaths',
    'be-07-json-parse': 'safeParse',
    'be-08-event-emitter': 'createEmitter',
    'be-09-rate-limiter': 'createRateLimiter',
    'be-10-middleware-chain': 'compose',
    'be-11-cache-lru': 'createLRUCache',
    'be-12-stream-transform': 'createTransform',
    'be-13-http-router': 'createRouter',
    'be-14-logger': 'createLogger',
    'be-15-retry-logic': 'retry',
    'be-16-queue': 'createQueue',
    'be-17-validation-schema': 'createSchema',
    'be-18-singleton-db': 'getDb',
    'be-19-graceful-shutdown': 'createShutdown',
    'be-20-worker-pool': 'createPool',
  };
  return map[id] ?? 'main';
}
