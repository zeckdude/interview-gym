import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-02-custom-hook',
  title: 'Custom useFetch Hook',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['data fetching', 'loading/error states', 'async state', 'custom hooks'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  hasLivePreview: false,
};
