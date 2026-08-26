import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fe-02-event-delegation',
  title: 'Event Delegation',
  category: 'fe-web-apis',
  topLevel: 'fe',
  subcategory: 'web-apis',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['event delegation', 'event bubbling', 'closest()', 'performance'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
