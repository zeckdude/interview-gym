import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-01-page-routing',
  title: 'App Router: Pages and Layouts',
  category: 'nextjs',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['App Router', 'file-based routing', 'dynamic segments', 'route groups', 'catch-all routes'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Every Next.js interview starts by checking whether you understand file-based routing conventions.',
  hasLivePreview: false,
};
