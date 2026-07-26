import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fe-06-virtual-list',
  title: 'Virtual List Renderer',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ['virtualization', 'scroll', 'Math.floor', 'slicing'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  hasLivePreview: false,
};
