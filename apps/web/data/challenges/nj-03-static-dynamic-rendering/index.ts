import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-03-static-dynamic-rendering',
  title: 'Static vs Dynamic Rendering',
  category: 'nextjs',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['static rendering', 'dynamic rendering', 'ISR', 'dynamic APIs', 'route segment config'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
