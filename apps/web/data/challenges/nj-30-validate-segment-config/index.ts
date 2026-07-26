import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-30-validate-segment-config',
  title: 'Validate Segment Config',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["route config","validation","App Router"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
