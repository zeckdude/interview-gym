import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-05-route-handlers',
  title: 'Route Handlers with Auth',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['Route Handlers', 'GET/POST exports', 'authorization', 'Request/Response'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'API design questions almost always show up, and Route Handlers are how Next.js does APIs now.',
  hasLivePreview: false,
};
