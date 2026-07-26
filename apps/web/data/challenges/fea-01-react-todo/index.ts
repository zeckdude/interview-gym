import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-01-react-todo',
  title: 'React Todo List',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'easy',
  comingSoon: false,
  description,
  concepts: ['state management', 'immutable updates', 'unique IDs', 'filter/map'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: true,
  hasLivePreview: false,
};
