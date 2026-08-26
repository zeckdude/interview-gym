import { getChallengeById, allQuestions } from '@/data';
import { getLessonById } from '@/data/lessons';
import { resolvePathItemId } from '@/lib/paths/id-remap';
import type { PathItemType } from '@/lib/paths/types';

export function getPathItemTitle(itemId: string, itemType: PathItemType): string {
  const resolvedId = resolvePathItemId(itemId);

  if (itemType === 'lesson') {
    const lesson = getLessonById(resolvedId);
    return lesson?.title ?? itemId;
  }

  if (itemType === 'challenge') {
    const challenge = getChallengeById(resolvedId);
    return challenge?.title ?? itemId;
  }

  const question = allQuestions.find((q) => q.id === resolvedId);
  if (question) {
    return (
      question.question.slice(0, 80) + (question.question.length > 80 ? '…' : '')
    );
  }

  return itemId;
}

export function getPathItemHref(itemId: string, itemType: PathItemType): string {
  const resolvedId = resolvePathItemId(itemId);
  if (itemType === 'lesson') return `/lessons/${resolvedId}`;
  if (itemType === 'question') return `/questions/${resolvedId}`;
  return `/challenges/${resolvedId}`;
}

export function getPathItemTypeLabel(itemType: PathItemType): string {
  switch (itemType) {
    case 'lesson':
      return 'Lesson';
    case 'challenge':
      return 'Challenge';
    case 'question':
      return 'Question';
  }
}
