import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-12-caching-strategies',
  title: 'Next.js Caching Deep Dive',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['fetch caching', 'revalidate', 'no-store', 'force-cache', 'ISR'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Caching is famously confusing in Next.js — expect at least one question probing whether you actually understand it.',
  hasLivePreview: false,
};
