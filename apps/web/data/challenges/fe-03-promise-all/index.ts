import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fe-03-promise-all',
  title: 'Promise.all Polyfill',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['Promises', 'async', 'polyfill', 'concurrency'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
