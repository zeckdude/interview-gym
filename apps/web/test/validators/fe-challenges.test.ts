import { describe, it, expect } from 'vitest';
import { feChallenges } from '@/data/fe-challenges';
import { validatePrepared, validateSolution } from '../helpers';

describe('FE Challenge Validators', () => {
  it('has 30 challenges', () => {
    expect(feChallenges).toHaveLength(30);
  });

  describe.each(feChallenges)('$id ($title)', (challenge) => {
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
      expect(Array.isArray(result.results)).toBe(true);
      result.results.forEach((r) => {
        expect(r).toHaveProperty('description');
        expect(r).toHaveProperty('expected');
        expect(r).toHaveProperty('actual');
        expect(r).toHaveProperty('passed');
      });
    });

    it('fails with incorrect / empty solution', async () => {
      const result = await validatePrepared(challenge, 'module.exports = {};', 'javascript');
      expect(result.passed).toBe(false);
    });

    it('does not throw when code throws an error', async () => {
      await expect(
        validatePrepared(
          challenge,
          'throw new Error("boom");',
          'javascript'
        )
      ).resolves.toMatchObject({ passed: false });
    });
  });
});
