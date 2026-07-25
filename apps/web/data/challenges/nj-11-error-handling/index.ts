import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-11-error-handling',
  title: 'Error and Loading UI',
  category: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['error.tsx', 'loading.tsx', 'Suspense', 'reset()', 'error boundaries'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: true,
  sandpackTemplate: 'react-ts',
};
