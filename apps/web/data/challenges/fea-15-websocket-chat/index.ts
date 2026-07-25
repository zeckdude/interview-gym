import description from './description.md';
import hintsRaw from './hints.md';
import { starterTs, starterJs, solutionTs, solutionJs } from './code';
import { validate } from './validate';
import { parseHints } from '../_utils';
import type { Challenge } from '../../types';

export const challenge: Challenge = {
  id: 'fea-15-websocket-chat',
  title: 'WebSocket Chat',
  category: 'fe-advanced',
  difficulty: 'advanced',
  comingSoon: false,
  description,
  concepts: ['WebSocket', 'real-time', 'state machine', 'message queuing'],
  hints: parseHints(hintsRaw),
  starterCode: { typescript: starterTs, javascript: starterJs },
  solution: { typescript: solutionTs, javascript: solutionJs },
  validate,
  mostAsked: false,
  hasLivePreview: false,
};
