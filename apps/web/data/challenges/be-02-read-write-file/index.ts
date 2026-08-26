import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-02-read-write-file',
  title: 'Read and Write a File',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['fs.readFileSync', 'fs.writeFileSync', 'string methods', 'encoding'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
