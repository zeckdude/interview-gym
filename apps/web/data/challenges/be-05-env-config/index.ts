import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-05-env-config',
  title: 'Environment Variable Config Module',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['config patterns', 'validation', 'error throwing', 'type coercion'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
