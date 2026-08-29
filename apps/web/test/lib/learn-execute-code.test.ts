import { describe, expect, it } from 'vitest';
import {
  formatRunError,
  outputsMatch,
  predictOutputsMatch,
  validateCodeChallenge,
  validatePredictOutput,
  runLearnCode,
} from '@/lib/learn/execute-code';

describe('runLearnCode', () => {
  it('captures console.log output', () => {
    const result = runLearnCode(`console.log('Hello, world!');\nconsole.log(2 + 3);`);
    expect(result.ok).toBe(true);
    expect(result.output).toBe('Hello, world!\n5');
  });

  it('surfaces const reassignment as TypeError', () => {
    const result = runLearnCode(`const x = 1;\nx = 2;\nconsole.log(x);`);
    expect(result.ok).toBe(false);
    expect(result.output).toBe('TypeError');
    expect(result.error).toContain('Assignment to constant variable');
  });

  it('surfaces undefined variable as ReferenceError', () => {
    const result = runLearnCode(`console.log(missing);`);
    expect(result.ok).toBe(false);
    expect(result.output).toBe('ReferenceError');
    expect(result.error).toContain('is not defined');
  });

  it('surfaces TDZ as ReferenceError', () => {
    const result = runLearnCode(`console.log(x);\nconst x = 5;`);
    expect(result.ok).toBe(false);
    expect(result.output).toBe('ReferenceError');
    expect(result.error).toContain('before initialization');
  });

  it('surfaces redeclaration as SyntaxError', () => {
    const result = runLearnCode(`const x = 5;\nconst x = 6;`);
    expect(result.ok).toBe(false);
    expect(result.output).toBe('SyntaxError');
    expect(result.error).toContain('already been declared');
  });
});

describe('formatRunError', () => {
  it('uses error name when available', () => {
    const err = new ReferenceError('x is not defined');
    expect(formatRunError(err).short).toBe('ReferenceError');
    expect(formatRunError(err).full).toBe('ReferenceError: x is not defined');
  });
});

describe('validatePredictOutput', () => {
  it('accepts matching numeric strings', () => {
    expect(validatePredictOutput('6', '6').passed).toBe(true);
  });

  it('accepts error shorthand when enabled', () => {
    const code = `const x = 1;\nx = 2;`;
    expect(
      validatePredictOutput('error', 'TypeError', 'var-10', code, true).passed
    ).toBe(true);
  });

  it('uses executed error as reference for predict steps', () => {
    const code = `console.log(missing);`;
    const result = validatePredictOutput('ReferenceError', 'ReferenceError', undefined, code);
    expect(result.passed).toBe(true);
    expect(result.reference).toContain('ReferenceError');
  });

  it('accepts space-separated multiline answers', () => {
    const expected = 'first\nsecond\nthird';
    expect(predictOutputsMatch('first second third', expected)).toBe(true);
    expect(
      validatePredictOutput(
        'first second third',
        expected,
        'intro-9',
        `console.log('first');
console.log('second');
console.log('third');`
      ).passed
    ).toBe(true);
  });

  it('accepts comma-separated multi-arg console.log guesses', () => {
    expect(predictOutputsMatch('Paris, 2', 'Paris 2')).toBe(true);
    expect(
      validatePredictOutput(
        'Paris, 2',
        'Paris 2',
        'var-6',
        `const city = 'Paris';
let count = 1;
count = 2;
console.log(city, count);`
      ).passed
    ).toBe(true);
  });

  it('accepts flexible intro-10 answers', () => {
    expect(
      validatePredictOutput('Jamie\n2026', 'Alex\n2026', 'intro-10').passed
    ).toBe(true);
  });
});

describe('validateCodeChallenge', () => {
  it('passes when output matches goal', () => {
    const code = `console.log('Interview Gym');`;
    const result = validateCodeChallenge(code, 'Interview Gym');
    expect(result.passed).toBe(true);
    expect(result.actual).toBe('Interview Gym');
  });

  it('captures output when setup comments precede code', () => {
    const code = `// Write your code below:\nconsole.log('Interview Gym');`;
    const result = validateCodeChallenge(code, 'Interview Gym');
    expect(result.passed).toBe(true);
    expect(result.actual).toBe('Interview Gym');
  });

  it('passes error-goal challenges when the expected error is thrown', () => {
    const code = `function f() {
  const x = 1;
  x = 2;
  return x;
}
f();`;
    const result = validateCodeChallenge(
      code,
      'TypeError: Assignment to constant variable.',
      undefined,
      'error'
    );
    expect(result.passed).toBe(true);
    expect(result.actual).toContain('TypeError');
  });

  it('fails error-goal challenges when code runs successfully', () => {
    const code = `function f() {
  let x = 1;
  x = 2;
  return x;
}
console.log(f());`;
    const result = validateCodeChallenge(code, 'TypeError', undefined, 'error');
    expect(result.passed).toBe(false);
  });
});

describe('outputsMatch', () => {
  it('matches TypeError prefix', () => {
    expect(outputsMatch('TypeError: foo', 'TypeError')).toBe(true);
  });

  it('matches ReferenceError prefix', () => {
    expect(outputsMatch('ReferenceError: missing is not defined', 'ReferenceError')).toBe(true);
  });

  it('matches SyntaxError prefix', () => {
    expect(outputsMatch('SyntaxError: Identifier', 'SyntaxError')).toBe(true);
  });
});
