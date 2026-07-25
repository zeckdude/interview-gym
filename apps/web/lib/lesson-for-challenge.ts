import { allLessons } from '@/data/lessons/registry';

export function getLessonForChallenge(challengeId: string) {
  return allLessons.find((l) => l.relatedChallengeIds.includes(challengeId));
}
