import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-27-merge-metadata',
  title: 'Merge Metadata Objects',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ["metadata","objects","Next.js"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
