import { describe, expect, it } from 'vitest';
import { executeUserCode, getExport } from '@/lib/execute-code';
import { validateUserChallenge } from '@/lib/user-challenge-validator';

describe('executeUserCode', () => {
  it('executes CommonJS module.exports', () => {
    const exports = executeUserCode(
      'function add(a, b) { return a + b; }\nmodule.exports = { add };',
      () => ({})
    );
    expect(typeof exports.add).toBe('function');
    expect((exports.add as (a: number, b: number) => number)(2, 3)).toBe(5);
  });

  it('passes requireFn through', () => {
    const exports = executeUserCode(
      'const fs = require("fs");\nmodule.exports = { fs };',
      (mod) => (mod === 'fs' ? { ok: true } : {})
    );
    expect(exports.fs).toEqual({ ok: true });
  });
});

describe('getExport', () => {
  it('returns named export', () => {
    expect(getExport({ foo: 1 }, 'foo')).toBe(1);
  });

  it('throws when export is missing', () => {
    expect(() => getExport({}, 'missing')).toThrow(/not found/);
  });
});

describe('validateUserChallenge', () => {
  it('passes when user matches solution outputs', async () => {
    const solution = 'function answer() { return 42; }\nmodule.exports = { answer };';
    const user = 'function answer() { return 42; }\nmodule.exports = { answer };';
    const result = await validateUserChallenge(user, solution, 'javascript');
    expect(result.passed).toBe(true);
  });

  it('fails when outputs differ', async () => {
    const solution = 'function answer() { return 42; }\nmodule.exports = { answer };';
    const user = 'function answer() { return 0; }\nmodule.exports = { answer };';
    const result = await validateUserChallenge(user, solution, 'javascript');
    expect(result.passed).toBe(false);
  });

  it('fails gracefully when user code throws', async () => {
    const solution = 'function answer() { return 1; }\nmodule.exports = { answer };';
    const result = await validateUserChallenge(
      'throw new Error("boom");',
      solution,
      'javascript'
    );
    expect(result.passed).toBe(false);
  });
});
