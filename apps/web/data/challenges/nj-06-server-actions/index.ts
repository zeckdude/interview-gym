import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'nj-06-server-actions',
  title: 'Server Actions for Form Handling',
  category: 'nextjs',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ["Server Actions", "'use server'", 'form validation', 'progressive enhancement'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  mostAskedReason: 'Server Actions replaced the classic "build a form + API route" question — expect it in nearly every Next.js round.',
  hasLivePreview: true,
  sandpackTemplate: 'react-ts',
};
