import type { ConceptWeight } from '@/data/learn/types';

/** SM-2–inspired interval update after a review attempt. */
export function updateSrsAfterReview(params: {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  weight: ConceptWeight;
}): {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: Date;
} {
  let { repetitions, easeFactor, intervalDays } = params;
  const q = params.quality;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor);

    repetitions += 1;
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    );
  }

  const weightMultiplier =
    params.weight === 1 ? 0.7 : params.weight === -1 ? 1.4 : 1;
  intervalDays = Math.max(1, Math.round(intervalDays * weightMultiplier));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return { repetitions, easeFactor, intervalDays, nextReviewAt };
}

export function qualityFromCorrect(correct: boolean, hintUsed: boolean): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!correct) return hintUsed ? 1 : 0;
  return hintUsed ? 3 : 5;
}

export function weightPriorityBoost(weight: ConceptWeight): number {
  if (weight === 1) return 3;
  if (weight === -1) return 0.3;
  return 1;
}
