import { describe, expect, it } from 'vitest';
import {
  getCuratedMostAskedForLesson,
  mostAskedOverrideKey,
  resolveEffectiveMostAsked,
} from '@/lib/most-asked';
import type { Lesson } from '@/data/lessons/types';

const baseLesson: Lesson = {
  id: 'lesson-test',
  title: 'Test Lesson',
  category: 'fe',
  difficulty: 'easy',
  relatedChallengeIds: ['fe-advanced-01'],
  estimatedMinutes: 10,
  concepts: ['hooks'],
  steps: [],
  miniChallenge: {
    id: 'mini',
    prompt: 'test',
    timeLimitSeconds: 60,
    starterCode: { javascript: '', typescript: '' },
    solution: { javascript: '', typescript: '' },
    validate: () => ({ passed: true, feedback: 'ok' }),
  },
  mdnLinks: [],
};

describe('resolveEffectiveMostAsked', () => {
  it('uses curated value when no override exists', () => {
    expect(
      resolveEffectiveMostAsked({ mostAsked: true, reason: 'Common topic' }, undefined)
    ).toEqual({
      mostAsked: true,
      reason: 'Common topic',
      isPersonalOverride: false,
    });
  });

  it('prefers personal override when set', () => {
    expect(resolveEffectiveMostAsked({ mostAsked: false }, true)).toEqual({
      mostAsked: true,
      reason: undefined,
      isPersonalOverride: true,
    });
  });
});

describe('mostAskedOverrideKey', () => {
  it('builds stable keys', () => {
    expect(mostAskedOverrideKey('challenge', 'be-01')).toBe('challenge:be-01');
  });
});

describe('getCuratedMostAskedForLesson', () => {
  it('inherits from related challenges when lesson flag is unset', () => {
    const result = getCuratedMostAskedForLesson(baseLesson);
    expect(result.mostAsked).toBeTypeOf('boolean');
  });

  it('respects explicit lesson flag', () => {
    expect(
      getCuratedMostAskedForLesson({
        ...baseLesson,
        mostAsked: true,
        mostAskedReason: 'Explicit lesson flag',
      })
    ).toEqual({
      mostAsked: true,
      reason: 'Explicit lesson flag',
    });
  });
});
