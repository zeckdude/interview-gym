import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-02-server-client-components',
  title: 'Server vs Client Components',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['Server Components', 'Client Components', "'use client'", 'hydration', 'component boundaries'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'The single most common Next.js App Router interview question — "when do you need use client?"',
  hasLivePreview: true,
  sandpackTemplate: 'react-ts',
};
