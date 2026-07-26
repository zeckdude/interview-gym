import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-29-selector-memo',
  title: 'Selector Memo Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["memoization","selectors","factories"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
