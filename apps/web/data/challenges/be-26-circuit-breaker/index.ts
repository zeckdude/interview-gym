import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-26-circuit-breaker',
  title: 'Circuit Breaker Factory',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["resilience","circuit breaker","factories"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
