import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-13-streaming-suspense',
  title: 'Streaming SSR with Suspense Boundaries',
  category: 'nextjs',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["streaming SSR","Suspense boundaries","loading skeletons","TTFB","progressive rendering"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Streaming architecture is a senior-level Next.js interview topic.',
  hasLivePreview: false,
};
