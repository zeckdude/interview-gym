import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'css-19-fluid-font-size',
  title: 'Fluid Font Size',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ["clamp","typography"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
