import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fe-25-partition-array',
  title: 'Partition Array by Predicate',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ["arrays","predicates"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
