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
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['process.env', 'config patterns', 'validation', 'error throwing'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
};
