import type { PathItemType } from '@/lib/paths/types';

export function inferPathItemType(itemId: string): PathItemType {
  if (itemId.startsWith('lesson-')) return 'lesson';
  if (
    itemId.startsWith('feq-') ||
    itemId.startsWith('beq-') ||
    itemId.startsWith('njq-')
  ) {
    return 'question';
  }
  return 'challenge';
}
