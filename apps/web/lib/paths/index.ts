import { BE_PATH_ITEMS } from '@/lib/paths/be-path';
import { FE_PATH_ITEMS } from '@/lib/paths/fe-path';
import { FULLSTACK_PATH_ITEMS } from '@/lib/paths/fullstack-path';
import type { CuratedPathItem, PathType } from '@/lib/paths/types';

export const CURATED_PATH_ITEMS: Record<PathType, CuratedPathItem[]> = {
  fe: FE_PATH_ITEMS,
  be: BE_PATH_ITEMS,
  fullstack: FULLSTACK_PATH_ITEMS,
};

export function getCuratedItemsForPathType(pathType: PathType): CuratedPathItem[] {
  return CURATED_PATH_ITEMS[pathType];
}

export function isValidPathType(value: string): value is PathType {
  return value === 'fe' || value === 'be' || value === 'fullstack';
}
