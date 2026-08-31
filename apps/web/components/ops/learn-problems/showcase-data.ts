import type { LearnStep } from '@/data/learn/types';

export type ProblemStatus = 'shipped' | 'prototype';

export interface ProblemTypeMeta {
  id: string;
  anchor: string;
  name: string;
  internalId: string;
  status: ProblemStatus;
  blurb: string;
}

export const PROBLEM_TYPES: ProblemTypeMeta[] = [
  {
    id: 'predict-output',
    anchor: 'predict-output',
    name: 'Predict the output',
    internalId: 'predict-output',
    status: 'shipped',
    blurb: 'Read code and type what prints — or pick that it throws.',
  },
  {
    id: 'choice',
    anchor: 'pick-one',
    name: 'Pick one',
    internalId: 'choice',
    status: 'shipped',
    blurb: 'Multiple choice with optional code context.',
  },
  {
    id: 'code-challenge',
    anchor: 'write-code',
    name: 'Write the code',
    internalId: 'code-challenge',
    status: 'shipped',
    blurb: 'Monaco editor — write code and run it against expected output.',
  },
  {
    id: 'trace',
    anchor: 'step-through',
    name: 'Step through',
    internalId: 'trace',
    status: 'prototype',
    blurb: 'Advance line by line; predict state or output at each step.',
  },
  {
    id: 'spot-bug',
    anchor: 'find-bug',
    name: 'Find the bug',
    internalId: 'spot-bug',
    status: 'prototype',
    blurb: 'Click the line that causes the wrong behavior.',
  },
  {
    id: 'reorder',
    anchor: 'put-in-order',
    name: 'Put in order',
    internalId: 'reorder',
    status: 'prototype',
    blurb: 'Reorder scrambled lines so the program runs correctly.',
  },
  {
    id: 'fill-blank',
    anchor: 'fill-blank',
    name: 'Fill the blank',
    internalId: 'fill-blank',
    status: 'prototype',
    blurb: 'Type the missing token — too precise to guess.',
  },
  {
    id: 'minimal-fix',
    anchor: 'smallest-fix',
    name: 'Smallest fix',
    internalId: 'minimal-fix',
    status: 'prototype',
    blurb: 'Pick the minimal change that fixes broken code.',
  },
  {
    id: 'before-after',
    anchor: 'what-changed',
    name: 'What changed?',
    internalId: 'before-after',
    status: 'prototype',
    blurb: 'See a diff; predict how output or behavior changes.',
  },
  {
    id: 'sandbox',
    anchor: 'try-it',
    name: 'Try it yourself',
    internalId: 'sandbox',
    status: 'prototype',
    blurb: 'Runnable sandbox — change one thing, run, report what you saw.',
  },
  {
    id: 'guided-build',
    anchor: 'watch-tinker',
    name: 'Watch & tinker',
    internalId: 'guided-build',
    status: 'prototype',
    blurb: 'Animated typing walkthrough — pause, edit, run, resume.',
  },
  {
    id: 'pattern',
    anchor: 'whats-next',
    name: "What's next?",
    internalId: 'pattern',
    status: 'prototype',
    blurb: 'Infer the rule from examples; predict the next case.',
  },
  {
    id: 'match-pairs',
    anchor: 'match-up',
    name: 'Match them up',
    internalId: 'match-pairs',
    status: 'prototype',
    blurb: 'Connect related code, output, and concepts.',
  },
];

export const DEMO_PREDICT_STEP: LearnStep = {
  id: 'ops-demo-predict',
  type: 'predict-output',
  devTitle: 'Ops demo',
  conceptTags: ['demo'],
  prompt: 'What will this code print?',
  code: `console.log(10 - 4);`,
  expectedOutput: '6',
  hints: [
    'Read the expression inside `console.log`.',
    '`10 - 4` is subtraction.',
    'The answer is a single number.',
  ],
  revealExplanation: 'JavaScript evaluates `10 - 4` to `6`.',
};

export const DEMO_CHOICE_STEP: LearnStep = {
  id: 'ops-demo-choice',
  type: 'choice',
  devTitle: 'Ops demo',
  conceptTags: ['demo'],
  prompt: 'In JavaScript, can the same `let` variable hold a number and later hold a string?',
  choices: [
    'No — each variable has one fixed type',
    'Yes — the type can change when you reassign',
    'Only if you use `var` instead of `let`',
  ],
  correctIndex: 1,
  explanation:
    'JavaScript is dynamically typed. A `let` binding can point at different types over time.',
};

export const DEMO_CODE_INTRO_STEP: LearnStep = {
  id: 'ops-demo-code-intro',
  type: 'text',
  devTitle: 'Ops demo intro',
  conceptTags: ['demo'],
  title: "Here's a code problem:",
  content: 'Use `console.log` to print the exact text **Interview Gym**.',
};

export const DEMO_CODE_CHALLENGE_STEP: LearnStep = {
  id: 'ops-demo-code-challenge',
  type: 'code-challenge',
  devTitle: 'Ops demo',
  conceptTags: ['demo'],
  prompt: 'Print exactly: Interview Gym',
  setupCode: '// Write your code below:',
  starterCode: `console.log('');`,
  solutionCode: `console.log('Interview Gym');`,
  expectedOutput: 'Interview Gym',
  hints: [
    '`console.log` prints whatever you pass inside the parentheses.',
    'Text values go inside quotes.',
    "Put `'Interview Gym'` inside `console.log(...)`.",
  ],
  revealExplanation: "`console.log('Interview Gym')` prints the exact string.",
};
