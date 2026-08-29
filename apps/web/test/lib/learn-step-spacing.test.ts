import { describe, expect, it } from 'vitest';
import type { LearnStep } from '@/data/learn/types';
import {
  CODE_PROBLEM_INTRO_TITLE,
  getLearnStepSpacing,
  getLearnStepWrapperMargin,
  isTeachingIntroText,
} from '@/lib/learn/step-spacing';

const textIntro: LearnStep = {
  id: 't1',
  type: 'text',
  conceptTags: ['const'],
  content: '`const` means always the same value.',
};

const textSection: LearnStep = {
  id: 't2',
  type: 'text',
  conceptTags: ['variables'],
  title: 'Variables',
  content: 'Intro paragraph.',
};

const codeProblemIntro: LearnStep = {
  id: 't3',
  type: 'text',
  conceptTags: ['const'],
  title: CODE_PROBLEM_INTRO_TITLE,
  content: 'Create a const and log it.',
};

const codeDemo: LearnStep = {
  id: 'c1',
  type: 'code-demo',
  conceptTags: ['const'],
  code: "const x = 1;\nconsole.log(x);",
  expectedOutput: '1',
};

const predict: LearnStep = {
  id: 'p1',
  type: 'predict-output',
  conceptTags: ['const'],
  prompt: 'What prints?',
  code: 'console.log(1);',
  expectedOutput: '1',
};

describe('getLearnStepSpacing', () => {
  it('groups untitled text with the following interactive step', () => {
    expect(getLearnStepSpacing(textIntro, undefined, codeDemo)).toBe('group-start');
    expect(getLearnStepSpacing(codeDemo, textIntro, undefined)).toBe('group-end');
  });

  it('groups code-problem intro text with code-challenge', () => {
    const challenge: LearnStep = {
      id: 'ch1',
      type: 'code-challenge',
      conceptTags: ['const'],
      prompt: 'Log JavaScript',
      setupCode: '',
      starterCode: '',
      solutionCode: '',
      expectedOutput: 'JavaScript',
    };

    expect(getLearnStepSpacing(codeProblemIntro, undefined, challenge)).toBe(
      'group-start'
    );
    expect(getLearnStepSpacing(challenge, codeProblemIntro, undefined)).toBe(
      'group-end'
    );
  });

  it('keeps titled section intros standalone', () => {
    expect(getLearnStepSpacing(textSection, undefined, codeDemo)).toBe('standalone');
    expect(getLearnStepSpacing(codeDemo, textSection, undefined)).toBe('standalone');
  });

  it('groups untitled text with predict-output', () => {
    expect(getLearnStepSpacing(textIntro, undefined, predict)).toBe('group-start');
    expect(getLearnStepSpacing(predict, textIntro, undefined)).toBe('group-end');
  });
});

describe('getLearnStepWrapperMargin', () => {
  it('adds breathing room between grouped intro text and the interactive step', () => {
    expect(getLearnStepWrapperMargin('group-end', 'group-start')).toBe('mt-8');
  });

  it('adds margin after a completed standalone or group-end step', () => {
    expect(getLearnStepWrapperMargin('standalone', 'standalone')).toBe('mt-8');
    expect(getLearnStepWrapperMargin('group-start', 'group-end')).toBe('mt-8');
  });
});

describe('isTeachingIntroText', () => {
  it('matches untitled text only', () => {
    expect(isTeachingIntroText(textIntro)).toBe(true);
    expect(isTeachingIntroText(textSection)).toBe(false);
    expect(isTeachingIntroText(codeProblemIntro)).toBe(false);
  });
});
