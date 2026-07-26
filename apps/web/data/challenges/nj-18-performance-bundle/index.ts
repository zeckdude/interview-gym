import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-18-performance-bundle',
  title: 'Bundle Analysis and Code Splitting',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["dynamic import","next/dynamic","next/script","code splitting"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Performance optimization is a core senior engineer interview topic.',
  hasLivePreview: false,
};
