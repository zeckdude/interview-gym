import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-12-use-callback',
  title: 'useCallback & useMemo',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['useMemo', 'useCallback', 'memoization', 'deps array', 'shallow equality'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
