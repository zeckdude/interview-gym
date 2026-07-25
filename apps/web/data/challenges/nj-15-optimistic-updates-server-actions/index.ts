import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-15-optimistic-updates-server-actions',
  title: 'Optimistic UI with Server Actions',
  category: 'nextjs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["useOptimistic","Server Actions","optimistic updates","rollback"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: true,
  sandpackTemplate: 'react-ts',
};
