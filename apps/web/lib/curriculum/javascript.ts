import type { Lesson } from '@/data/lessons/types';
import type { ContentSubcategory, TopLevelCategory } from '@/data/types';

/**
 * Curated JavaScript lesson progression: fundamentals → patterns → advanced.
 * Keys are lesson IDs; values are order within the full JS track (1 = start here).
 */
export const JAVASCRIPT_LESSON_SEQUENCE: Record<string, number> = {
  // Easy — language fundamentals
  'lesson-js-01-variables-types': 1,
  'lesson-js-02-functions-basics': 2,
  'lesson-be-23-safe-parse-int': 3,
  'lesson-be-21-trim-string': 4,
  'lesson-be-22-pad-string': 5,
  'lesson-be-25-capitalize-word': 6,
  'lesson-js-03-arrays-basics': 7,
  'lesson-fe-16-flat-array': 8,
  'lesson-fe-17-unique-array': 9,
  'lesson-fe-22-chunk-array': 10,
  'lesson-fe-23-flatten-to-depth': 11,
  'lesson-js-04-objects-basics': 12,
  'lesson-be-24-shallow-merge': 13,
  'lesson-fe-21-clamp-number': 14,
  'lesson-fe-24-format-bytes': 15,

  // Intermediate — patterns & async
  'lesson-js-05-array-methods': 16,
  'lesson-fe-18-group-by': 17,
  'lesson-fe-25-partition-array': 18,
  'lesson-fe-01-closure-counter': 19,
  'lesson-closures-hof': 20,
  'lesson-fe-14-curry': 21,
  'lesson-fe-15-pipe-compose': 22,
  'lesson-memoization': 23,
  'lesson-fe-03-promise-all': 24,
  'lesson-async-promises': 25,
  'lesson-event-emitter': 26,

  // Advanced — deep JS & system design patterns
  'lesson-js-06-classes-prototypes': 27,
  'lesson-fe-26-deep-equal': 28,
  'lesson-fe-28-flatten-object': 29,
  'lesson-fe-29-invert-object': 30,
  'lesson-fe-27-run-with-concurrency': 31,
  'lesson-fe-30-stable-sort-by': 32,
  'lesson-be-26-circuit-breaker': 33,
  'lesson-be-27-token-bucket': 34,
  'lesson-be-28-once-per-key': 35,
  'lesson-be-29-backoff-jitter': 36,
  'lesson-be-30-parse-content-type': 37,
};

export function isJavascriptCurriculumLesson(lesson: Pick<Lesson, 'topLevel' | 'subcategory'>): boolean {
  return lesson.topLevel === 'stack' && lesson.subcategory === 'javascript';
}

export function getJavascriptCurriculumOrder(lessonId: string): number {
  return JAVASCRIPT_LESSON_SEQUENCE[lessonId] ?? 9999;
}

export function compareJavascriptCurriculum(
  a: Pick<Lesson, 'id' | 'difficulty' | 'topLevel' | 'subcategory'>,
  b: Pick<Lesson, 'id' | 'difficulty' | 'topLevel' | 'subcategory'>
): number {
  const orderA = JAVASCRIPT_LESSON_SEQUENCE[a.id];
  const orderB = JAVASCRIPT_LESSON_SEQUENCE[b.id];
  const inCurriculumA = orderA !== undefined;
  const inCurriculumB = orderB !== undefined;

  if (inCurriculumA && inCurriculumB) {
    return orderA - orderB;
  }

  const difficultyOrder = { easy: 0, intermediate: 1, advanced: 2 } as const;
  const diffA = difficultyOrder[a.difficulty];
  const diffB = difficultyOrder[b.difficulty];
  if (diffA !== diffB) return diffA - diffB;

  if (inCurriculumA) return -1;
  if (inCurriculumB) return 1;

  return a.id.localeCompare(b.id);
}

export function getCurriculumSortLabel(
  _topLevel: TopLevelCategory | 'all',
  _subcategories: ContentSubcategory[]
): string {
  return 'Learning path (recommended)';
}
