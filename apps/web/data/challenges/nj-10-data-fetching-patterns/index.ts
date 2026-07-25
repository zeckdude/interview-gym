import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-10-data-fetching-patterns',
  title: 'Data Fetching: Waterfall vs Parallel',
  category: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['request waterfalls', 'Promise.all', 'parallel data fetching', 'performance'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Fixing a request waterfall is a favorite live-coding exercise because it reveals real performance instincts.',
  hasLivePreview: false,
};
