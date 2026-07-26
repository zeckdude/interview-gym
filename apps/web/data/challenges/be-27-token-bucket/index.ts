import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-27-token-bucket',
  title: 'Token Bucket Rate Limiter',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["rate limiting","token bucket","factories"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
