import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-19-graceful-shutdown',
  title: 'Graceful Shutdown',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ['graceful shutdown', 'async sequential execution', 'idempotency', 'Promises'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
