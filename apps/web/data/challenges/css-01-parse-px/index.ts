import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'css-01-parse-px',
  title: 'Parse Pixel Length',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ["CSS units","parsing"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
