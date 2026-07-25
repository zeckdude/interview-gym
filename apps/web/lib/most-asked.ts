import type { Challenge, ConceptualQuestion } from '@/data/types';
import type { Lesson } from '@/data/lessons/types';
import { getChallengeById } from '@/data';

export type MostAskedItemType = 'challenge' | 'lesson' | 'question';

export interface CuratedMostAsked {
  mostAsked: boolean;
  reason?: string;
}

export interface MostAskedOverrideRecord {
  itemType: MostAskedItemType;
  itemId: string;
  mostAsked: boolean;
}

export function mostAskedOverrideKey(itemType: MostAskedItemType, itemId: string): string {
  return `${itemType}:${itemId}`;
}

export function parseMostAskedOverrideKey(key: string): MostAskedOverrideRecord | null {
  const [itemType, ...rest] = key.split(':');
  const itemId = rest.join(':');
  if (
    (itemType === 'challenge' || itemType === 'lesson' || itemType === 'question') &&
    itemId
  ) {
    return { itemType, itemId, mostAsked: false };
  }
  return null;
}

export function getCuratedMostAskedForChallenge(challenge: Challenge): CuratedMostAsked {
  return {
    mostAsked: challenge.mostAsked,
    reason: challenge.mostAskedReason,
  };
}

export function getCuratedMostAskedForQuestion(question: ConceptualQuestion): CuratedMostAsked {
  return {
    mostAsked: question.mostAsked,
    reason: question.mostAskedReason,
  };
}

/** Lessons inherit from explicit data, else any related challenge marked most asked. */
export function getCuratedMostAskedForLesson(lesson: Lesson): CuratedMostAsked {
  if (lesson.mostAsked !== undefined) {
    return {
      mostAsked: lesson.mostAsked,
      reason: lesson.mostAskedReason,
    };
  }

  for (const challengeId of lesson.relatedChallengeIds) {
    const challenge = getChallengeById(challengeId);
    if (challenge?.mostAsked) {
      return {
        mostAsked: true,
        reason: challenge.mostAskedReason,
      };
    }
  }

  return { mostAsked: false };
}

export function resolveEffectiveMostAsked(
  curated: CuratedMostAsked,
  override: boolean | undefined
): CuratedMostAsked & { isPersonalOverride: boolean } {
  if (override === undefined) {
    return { ...curated, isPersonalOverride: false };
  }

  return {
    mostAsked: override,
    reason: override ? curated.reason : undefined,
    isPersonalOverride: true,
  };
}

export function overridesMapFromRecords(
  records: MostAskedOverrideRecord[]
): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const record of records) {
    map[mostAskedOverrideKey(record.itemType, record.itemId)] = record.mostAsked;
  }
  return map;
}

export function recordsFromOverridesMap(
  map: Record<string, boolean>
): MostAskedOverrideRecord[] {
  return Object.entries(map).flatMap(([key, mostAsked]) => {
    const parsed = parseMostAskedOverrideKey(key);
    return parsed ? [{ ...parsed, mostAsked }] : [];
  });
}
