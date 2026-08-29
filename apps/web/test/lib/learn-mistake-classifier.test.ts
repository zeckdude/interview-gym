import { describe, expect, it } from 'vitest';
import { getOrderedHints } from '@/data/learn/hints';
import {
  classifyCodeChallengeMistake,
  classifyPredictMistake,
} from '@/lib/learn/mistake-classifier';

describe('classifyPredictMistake', () => {
  it('detects comma separator mistakes', () => {
    expect(
      classifyPredictMistake('Paris, London', 'Paris 2', 'Paris 2')
    ).toBe('comma_separator');
  });

  it('detects stale numeric values', () => {
    expect(
      classifyPredictMistake('Paris 1', 'Paris 2', 'Paris 2')
    ).toBe('wrong_numeric_value');
  });

  it('detects error vs output confusion', () => {
    expect(
      classifyPredictMistake('TypeError', '6', '6', { expectsError: false })
    ).toBe('type_error_expected');
    expect(
      classifyPredictMistake('6', 'TypeError', 'TypeError', { expectsError: true })
    ).toBe('error_when_output');
  });

  it('detects missing multiline output', () => {
    expect(
      classifyPredictMistake('first', 'first\nsecond\nthird', 'first\nsecond\nthird')
    ).toBe('missing_line');
  });

  it('returns correct for matching answers', () => {
    expect(classifyPredictMistake('Paris 2', 'Paris 2', 'Paris 2')).toBe('correct');
  });
});

describe('classifyCodeChallengeMistake', () => {
  it('detects empty output', () => {
    expect(
      classifyCodeChallengeMistake(
        `console.log('');`,
        '',
        'Interview Gym',
        'output',
        false
      )
    ).toBe('empty_output');
  });

  it('detects syntax errors from thrown code', () => {
    expect(
      classifyCodeChallengeMistake(
        `const x = 1;\nx = 2;\nconsole.log(x);`,
        'TypeError',
        'JavaScript',
        'output',
        false
      )
    ).toBe('syntax_error');
  });

  it('detects output when error expected', () => {
    expect(
      classifyCodeChallengeMistake(
        `console.log('ok');`,
        'ok',
        'TypeError',
        'error',
        false
      )
    ).toBe('output_when_error');
  });
});

describe('getOrderedHints', () => {
  const step = {
    hints: ['hint-a', 'hint-b', 'hint-c'],
  };

  it('reorders hints for comma separator mistakes', () => {
    expect(getOrderedHints(step, 'comma_separator')).toEqual([
      'hint-c',
      'hint-a',
      'hint-b',
    ]);
  });

  it('uses mistakeHints branch when provided', () => {
    const withBranch = {
      ...step,
      mistakeHints: {
        comma_separator: ['branch-1', 'branch-2'],
      },
    };
    expect(getOrderedHints(withBranch, 'comma_separator')).toEqual([
      'branch-1',
      'branch-2',
    ]);
  });
});
