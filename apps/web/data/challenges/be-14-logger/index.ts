import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-14-logger',
  title: 'Structured Logger',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['structured logging', 'log levels', 'metadata', 'timestamps'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
