import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'be-30-parse-content-type',
  title: 'Parse Content-Type Header',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["HTTP headers","parsing","MIME"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
