import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'css-06-margin-shorthand',
  title: 'Parse Margin Shorthand',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ["box model","shorthand"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
