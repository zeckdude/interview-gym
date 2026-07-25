import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-14-auth-patterns',
  title: 'Full Auth Flow with Middleware',
  category: 'nextjs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["middleware auth","RBAC","session cookies","protected routes","redirect loops"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Auth architecture is asked in virtually every senior full-stack Next.js interview.',
  hasLivePreview: false,
};
