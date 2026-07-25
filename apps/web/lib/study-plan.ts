import { allChallenges, getChallengeById } from '@/data';
import { allLessons, getLessonById } from '@/data/lessons';
import { getLessonForChallenge } from '@/lib/lesson-for-challenge';
import { prisma } from '@/lib/prisma';

export type StudyPlanItemType = 'challenge' | 'lesson' | 'user-challenge';
export type StudyPlanSource = 'challenge' | 'lesson' | 'generated' | 'simulator' | 'picker';

export interface StudyPlanItemRecord {
  id: string;
  itemType: StudyPlanItemType;
  itemId: string;
  source: StudyPlanSource;
  sortOrder: number;
  createdAt: string;
}

export interface ResolvedStudyPlanItem extends StudyPlanItemRecord {
  title: string;
  description: string;
  concepts: string[];
  difficulty: string | null;
  challengeId: string | null;
  challengeHref: string | null;
  challengeTitle: string | null;
  lessonId: string | null;
  lessonHref: string | null;
  lessonTitle: string | null;
  challengePassed: boolean;
  lessonCompleted: boolean;
  completed: boolean;
}

export function studyPlanItemKey(itemType: StudyPlanItemType, itemId: string): string {
  return `${itemType}:${itemId}`;
}

/** True when the challenge itself or its paired lesson is on the study plan. */
export function isChallengeTopicInPlan(
  challengeId: string,
  planKeys: ReadonlySet<string>
): boolean {
  if (planKeys.has(studyPlanItemKey('challenge', challengeId))) return true;
  const lesson = getLessonForChallenge(challengeId);
  return lesson ? planKeys.has(studyPlanItemKey('lesson', lesson.id)) : false;
}

/** True when the lesson itself or any related challenge is on the study plan. */
export function isLessonTopicInPlan(lessonId: string, planKeys: ReadonlySet<string>): boolean {
  if (planKeys.has(studyPlanItemKey('lesson', lessonId))) return true;
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  return lesson.relatedChallengeIds.some((challengeId) =>
    planKeys.has(studyPlanItemKey('challenge', challengeId))
  );
}

export function getTopicPlanItemIdForChallenge(
  challengeId: string,
  planKeyToId: ReadonlyMap<string, string>
): string | null {
  const direct = planKeyToId.get(studyPlanItemKey('challenge', challengeId));
  if (direct) return direct;
  const lesson = getLessonForChallenge(challengeId);
  if (!lesson) return null;
  return planKeyToId.get(studyPlanItemKey('lesson', lesson.id)) ?? null;
}

export function getTopicPlanItemIdForLesson(
  lessonId: string,
  planKeyToId: ReadonlyMap<string, string>
): string | null {
  const direct = planKeyToId.get(studyPlanItemKey('lesson', lessonId));
  if (direct) return direct;
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;
  for (const challengeId of lesson.relatedChallengeIds) {
    const id = planKeyToId.get(studyPlanItemKey('challenge', challengeId));
    if (id) return id;
  }
  return null;
}

export function parseStudyPlanItemKey(
  key: string
): { itemType: StudyPlanItemType; itemId: string } | null {
  const [itemType, ...rest] = key.split(':');
  const itemId = rest.join(':');
  if (
    (itemType === 'challenge' || itemType === 'lesson' || itemType === 'user-challenge') &&
    itemId
  ) {
    return { itemType, itemId };
  }
  return null;
}

export function getSourceLabel(source: StudyPlanSource): string {
  switch (source) {
    case 'challenge':
      return 'From challenge';
    case 'lesson':
      return 'From lesson';
    case 'generated':
      return 'Generated challenge';
    case 'simulator':
      return 'From simulator';
    case 'picker':
      return 'Added manually';
  }
}

interface ProgressContext {
  passedChallengeIds: Set<string>;
  completedLessonIds: Set<string>;
  passedUserChallengeIds: Set<string>;
}

export async function resolveStudyPlanItem(
  item: StudyPlanItemRecord,
  progress: ProgressContext
): Promise<ResolvedStudyPlanItem | null> {
  if (item.itemType === 'challenge') {
    const challenge = getChallengeById(item.itemId);
    if (!challenge) return null;

    const lesson = getLessonForChallenge(challenge.id);
    const challengePassed = progress.passedChallengeIds.has(challenge.id);

    return {
      ...item,
      title: challenge.title,
      description: challenge.description,
      concepts: challenge.concepts,
      difficulty: challenge.difficulty,
      challengeId: challenge.id,
      challengeHref: `/challenges/${challenge.id}`,
      challengeTitle: challenge.title,
      lessonId: lesson?.id ?? null,
      lessonHref: lesson ? `/lessons/${lesson.id}` : null,
      lessonTitle: lesson?.title ?? null,
      challengePassed,
      lessonCompleted: lesson ? progress.completedLessonIds.has(lesson.id) : false,
      completed: challengePassed,
    };
  }

  if (item.itemType === 'lesson') {
    const lesson = getLessonById(item.itemId);
    if (!lesson) return null;

    const primaryChallengeId = lesson.relatedChallengeIds[0] ?? null;
    const primaryChallenge = primaryChallengeId ? getChallengeById(primaryChallengeId) : undefined;
    const lessonCompleted = progress.completedLessonIds.has(lesson.id);
    const challengePassed = primaryChallengeId
      ? progress.passedChallengeIds.has(primaryChallengeId)
      : false;

    return {
      ...item,
      title: lesson.title,
      description: lesson.steps[0]?.content?.trim() ?? lesson.title,
      concepts: lesson.concepts,
      difficulty: lesson.difficulty,
      challengeId: primaryChallenge?.id ?? null,
      challengeHref: primaryChallenge ? `/challenges/${primaryChallenge.id}` : null,
      challengeTitle: primaryChallenge?.title ?? null,
      lessonId: lesson.id,
      lessonHref: `/lessons/${lesson.id}`,
      lessonTitle: lesson.title,
      challengePassed,
      lessonCompleted,
      completed: lessonCompleted && (primaryChallenge ? challengePassed : true),
    };
  }

  const userChallenge = await prisma.userChallenge.findUnique({
    where: { id: item.itemId },
    select: {
      id: true,
      title: true,
      description: true,
      concepts: true,
      difficulty: true,
    },
  });

  if (!userChallenge) return null;

  const passed = progress.passedUserChallengeIds.has(userChallenge.id);

  return {
    ...item,
    title: userChallenge.title,
    description: userChallenge.description,
    concepts: userChallenge.concepts,
    difficulty: userChallenge.difficulty,
    challengeId: userChallenge.id,
    challengeHref: `/my-challenges/${userChallenge.id}`,
    challengeTitle: userChallenge.title,
    lessonId: userChallenge.id,
    lessonHref: `/my-challenges/${userChallenge.id}/lesson`,
    lessonTitle: `${userChallenge.title} — Lesson`,
    challengePassed: passed,
    lessonCompleted: passed,
    completed: passed,
  };
}

export async function buildProgressContext(userId: string): Promise<ProgressContext> {
  const [attempts, lessonProgress, userAttempts] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId, passed: true },
      select: { challengeId: true },
    }),
    prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    }),
    prisma.userChallengeAttempt.findMany({
      where: { userId, passed: true },
      select: { challengeId: true },
    }),
  ]);

  return {
    passedChallengeIds: new Set(attempts.map((row) => row.challengeId)),
    completedLessonIds: new Set(lessonProgress.map((row) => row.lessonId)),
    passedUserChallengeIds: new Set(userAttempts.map((row) => row.challengeId)),
  };
}

export function getPickerCandidates(search: string) {
  const query = search.trim().toLowerCase();

  const challenges = allChallenges
    .filter((challenge) => !challenge.comingSoon)
    .filter(
      (challenge) =>
        !query ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.concepts.some((concept) => concept.toLowerCase().includes(query))
    )
    .slice(0, 20)
    .map((challenge) => ({
      itemType: 'challenge' as const,
      itemId: challenge.id,
      title: challenge.title,
      subtitle: challenge.difficulty,
    }));

  const lessons = allLessons
    .filter(
      (lesson) =>
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.concepts.some((concept) => concept.toLowerCase().includes(query))
    )
    .slice(0, 20)
    .map((lesson) => ({
      itemType: 'lesson' as const,
      itemId: lesson.id,
      title: lesson.title,
      subtitle: lesson.difficulty,
    }));

  return { challenges, lessons };
}
