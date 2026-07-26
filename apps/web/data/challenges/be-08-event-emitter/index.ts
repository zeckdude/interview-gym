import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-08-event-emitter',
  title: 'Event Emitter',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['event-driven', 'Map', 'observer pattern', 'closures'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  hasLivePreview: false,
};
