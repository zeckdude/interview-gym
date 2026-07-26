import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'ts-23-curry-fn',
  title: 'Curry a Function',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ["currying","closures"],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
