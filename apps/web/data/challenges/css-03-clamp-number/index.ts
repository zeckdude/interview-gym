import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'css-03-clamp-number',
  title: 'CSS clamp Helper',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ["min","max","clamp"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
