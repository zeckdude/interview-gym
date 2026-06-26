import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-04-debounce',
  title: 'Debounce Function from Scratch',
  category: 'be',
  difficulty: 'medium',
  comingSoon: false,
  description,
  concepts: ['debounce', 'setTimeout', 'clearTimeout', 'closures', 'higher-order functions'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
};
