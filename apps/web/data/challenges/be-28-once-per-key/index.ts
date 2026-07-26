import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-28-once-per-key',
  title: 'Idempotent oncePerKey',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["idempotency","deduplication","closures"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
