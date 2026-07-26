import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'css-28-design-token-resolve',
  title: 'Resolve Design Token',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["design tokens"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
