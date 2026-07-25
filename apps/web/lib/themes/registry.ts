import { Look } from './types';
import { theZen } from './the-zen';
import { theGrind } from './the-grind';

export const LOOKS: Look[] = [
  theZen,
  theGrind,
  // Future themes drop in here — no other file changes needed
];

export const DEFAULT_LOOK_ID = 'the-zen';

export function getLookById(id: string): Look {
  return LOOKS.find((l) => l.id === id) ?? theZen;
}
