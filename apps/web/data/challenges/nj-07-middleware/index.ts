import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-07-middleware',
  title: 'Middleware for Auth & Redirects',
  category: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['Middleware', 'Edge Runtime', 'redirects', 'route protection', 'cookies'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Auth gating with Middleware is the go-to "design this" question for Next.js system-design rounds.',
  hasLivePreview: false,
};
