import type { ValidationResult } from '../types';

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
