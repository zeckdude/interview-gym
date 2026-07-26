import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-11-render-props',
  title: 'Render Props Pattern',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'intermediate',
  comingSoon: false,
  description,
  concepts: ['render props', 'inversion of control', 'data providers', 'component patterns'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: true,
  sandpackTemplate: 'react-ts',
};
