export type PathType = 'fe' | 'be' | 'fullstack';

export type PathItemType = 'challenge' | 'lesson' | 'question';

export type PathItemStatus =
  | 'locked'
  | 'available'
  | 'attempted'
  | 'passed'
  | 'understood';

export type StageStatus = 'locked' | 'in-progress' | 'complete' | 'unlocked';

export interface CuratedPathItem {
  stage: 1 | 2 | 3;
  itemType: PathItemType;
  itemId: string;
  order: number;
  mostAsked: boolean;
}

export interface PathQueueItem {
  itemId: string;
  itemType: PathItemType;
  stage: number;
  order: number;
  mostAsked: boolean;
  status: PathItemStatus;
  attempts: number;
  title: string;
  href: string;
}

export interface ResolvedPathItem extends CuratedPathItem {
  status: PathItemStatus;
  attempts: number;
  markedUnderstood: boolean;
  title: string;
  href: string;
  markAsUnderstoodEligible: boolean;
}

export const PATH_TYPE_LABELS: Record<PathType, string> = {
  fe: 'FE Only',
  be: 'BE Only',
  fullstack: 'Full Stack',
};

export const PATH_TYPE_DESCRIPTIONS: Record<PathType, string> = {
  fe: 'React, Next.js, CSS, browser APIs',
  be: 'Node.js, APIs, databases, servers',
  fullstack: 'Both sides — curated blend',
};
