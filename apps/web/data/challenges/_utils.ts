import type { ValidationResult } from '../types';

/**
 * Returns a requireFn that maps all Node fs module variants to the same mock.
 *
 * Handles: 'fs', 'node:fs', 'fs/promises', 'node:fs/promises'
 * When the user requires 'fs/promises' they get mock.promises directly,
 * mirroring real Node behavior.
 */
export function makeFsRequire(
  mock: Record<string, unknown>
): (mod: string) => unknown {
  return (mod: string) => {
    if (mod === 'fs' || mod === 'node:fs') return mock;
    if (mod === 'fs/promises' || mod === 'node:fs/promises') {
      return (mock.promises as Record<string, unknown>) ?? {};
    }
    return {};
  };
}

export function errorResult(error: unknown): ValidationResult {
  return {
    passed: false,
    results: [
      {
        description: 'Code threw an error',
        expected: 'No error',
        actual: String(error),
        passed: false,
      },
    ],
  };
}

/** Parse a numbered markdown list into a string array. */
export function parseHints(raw: string): string[] {
  return raw
    .trim()
    .split('\n')
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
}
