import { describe, expect, it } from 'vitest';
import {
  getPickerCandidates,
  getSourceLabel,
  getTopicPlanItemIdForChallenge,
  getTopicPlanItemIdForLesson,
  isChallengeTopicInPlan,
  isLessonTopicInPlan,
  parseStudyPlanItemKey,
  studyPlanItemKey,
} from '@/lib/study-plan';

describe('study-plan helpers', () => {
  it('builds stable item keys', () => {
    expect(studyPlanItemKey('challenge', 'be-01')).toBe('challenge:be-01');
  });

  it('parses item keys', () => {
    expect(parseStudyPlanItemKey('lesson:lesson-react-hooks')).toEqual({
      itemType: 'lesson',
      itemId: 'lesson-react-hooks',
    });
  });

  it('labels sources for UI', () => {
    expect(getSourceLabel('simulator')).toBe('From simulator');
  });

  it('returns picker candidates', () => {
    const result = getPickerCandidates('');
    expect(result.challenges.length).toBeGreaterThan(0);
    expect(result.lessons.length).toBeGreaterThan(0);
  });

  it('treats challenge and paired lesson as one study topic', () => {
    const planKeys = new Set(['challenge:be-02-read-write-file']);
    const planKeyToId = new Map([['challenge:be-02-read-write-file', 'plan-1']]);

    expect(isChallengeTopicInPlan('be-02-read-write-file', planKeys)).toBe(true);
    expect(isLessonTopicInPlan('lesson-fs-module', planKeys)).toBe(true);
    expect(getTopicPlanItemIdForChallenge('be-02-read-write-file', planKeyToId)).toBe('plan-1');
    expect(getTopicPlanItemIdForLesson('lesson-fs-module', planKeyToId)).toBe('plan-1');
  });

  it('treats lesson plan entry as covering its related challenge', () => {
    const planKeys = new Set(['lesson:lesson-fs-module']);
    const planKeyToId = new Map([['lesson:lesson-fs-module', 'plan-2']]);

    expect(isLessonTopicInPlan('lesson-fs-module', planKeys)).toBe(true);
    expect(isChallengeTopicInPlan('be-02-read-write-file', planKeys)).toBe(true);
    expect(getTopicPlanItemIdForLesson('lesson-fs-module', planKeyToId)).toBe('plan-2');
    expect(getTopicPlanItemIdForChallenge('be-02-read-write-file', planKeyToId)).toBe('plan-2');
  });
});
