import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fe-16-flat-array',
  title: 'Flatten Nested Array',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['recursion', 'Array.isArray', 'reduce', 'depth'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
