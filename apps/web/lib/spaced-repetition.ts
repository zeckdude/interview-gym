export interface SRResult {
  nextReviewAt: Date;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

export const DIFFICULTY_MAX_INTERVAL: Record<string, number> = {
  advanced: 2,
  intermediate: 4,
  easy: 7,
};

/** quality: 0-5 (0=blackout, 3=passed with effort, 5=perfect) */
export function calculateNextReview(
  quality: number,
  repetitions: number,
  intervalDays: number,
  easeFactor: number
): SRResult {
  let newRepetitions = repetitions;
  let newInterval = intervalDays;
  let newEaseFactor = easeFactor;

  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions += 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 2;
    } else {
      newInterval = Math.round(intervalDays * easeFactor);
    }
    newEaseFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return {
    nextReviewAt,
    intervalDays: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
  };
}

export function applyDifficultyCap(intervalDays: number, difficulty: string): number {
  const max = DIFFICULTY_MAX_INTERVAL[difficulty] ?? 7;
  return Math.min(intervalDays, max);
}

export function qualityFromAttempt(passed: boolean): number {
  return passed ? 4 : 1;
}
