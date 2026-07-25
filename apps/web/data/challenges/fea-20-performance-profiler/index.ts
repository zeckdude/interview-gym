import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-20-performance-profiler',
  title: 'Performance Profiler',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['performance', 'profiling', 'React Profiler', 'Performance API', 'measurement'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
