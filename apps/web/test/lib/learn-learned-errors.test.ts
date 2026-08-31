import { describe, expect, it } from 'vitest';
import { moduleIntroduction } from '@/data/learn/modules/js-01-introduction';
import { moduleVariables } from '@/data/learn/modules/js-02-variables';
import {
  getErrorPickerOptions,
  getIntroducedLearnErrors,
  getChallengeScore,
  getPriorModuleIdsInOrder,
  isCorrectLearnErrorPick,
  LEARN_ERROR_OPTIONS,
  MIN_ERROR_PICKER_OPTIONS,
  findLearnErrorOptionForReference,
} from '@/lib/learn/learned-errors';

describe('getPriorModuleIdsInOrder', () => {
  it('returns introduction before variables', () => {
    expect(getPriorModuleIdsInOrder('js-02-variables')).toEqual(['js-01-introduction']);
  });
});

describe('getIntroducedLearnErrors', () => {
  it('includes ReferenceError after intro-errors-1 on intro predict step', () => {
    const options = getIntroducedLearnErrors(
      'js-01-introduction',
      8,
      [],
      ['js-01-introduction']
    );
    expect(options.map((o) => o.id)).toEqual(['ref-not-defined']);
  });

  it('adds TypeError after var-9 in variables module', () => {
    const var10Index = moduleVariables.steps.findIndex((s) => s.id === 'var-10');
    const options = getIntroducedLearnErrors(
      'js-02-variables',
      var10Index,
      moduleVariables.steps,
      ['js-01-introduction', 'js-02-variables']
    );
    expect(options.map((o) => o.id)).toEqual(['ref-not-defined', 'type-const-assign']);
  });
});

describe('getErrorPickerOptions', () => {
  it('always includes the runtime-matching error even when module is not covered yet', () => {
    const stepIndex = moduleIntroduction.steps.findIndex((s) => s.id === 'intro-errors-2');
    const predictStep = moduleIntroduction.steps[stepIndex] as Extract<
      (typeof moduleIntroduction.steps)[number],
      { type: 'predict-output' }
    >;

    const options = getErrorPickerOptions(
      'js-01-introduction',
      stepIndex,
      moduleIntroduction.steps,
      [],
      predictStep
    );

    const notDefined = options.find((option) => option.id === 'ref-not-defined');
    expect(notDefined).toBeDefined();
    expect(notDefined!.label).toBe('ReferenceError: missing is not defined');
    expect(
      isCorrectLearnErrorPick(
        notDefined!,
        'ReferenceError: missing is not defined',
        predictStep.expectedOutput
      )
    ).toBe(true);
  });

  it('pads early steps to four options with decoys', () => {
    const stepIndex = moduleIntroduction.steps.findIndex((s) => s.id === 'intro-errors-2');
    const predictStep = moduleIntroduction.steps[stepIndex] as Extract<
      (typeof moduleIntroduction.steps)[number],
      { type: 'predict-output' }
    >;

    const options = getErrorPickerOptions(
      'js-01-introduction',
      stepIndex,
      moduleIntroduction.steps,
      ['js-01-introduction'],
      predictStep
    );

    expect(options).toHaveLength(MIN_ERROR_PICKER_OPTIONS);
    expect(options.some((option) => option.id === 'ref-not-defined')).toBe(true);
    expect(
      options.filter((option) => option.id !== 'ref-not-defined').every((option) => !option.isDecoy)
    ).toBe(true);
    expect(options.some((option) => option.id === 'type-const-assign')).toBe(true);
  });

  it('uses only taught errors once four are introduced', () => {
    const tdzIndex = moduleVariables.steps.findIndex((s) => s.id === 'var-tdz-2');
    const predictStep = moduleVariables.steps[tdzIndex] as Extract<
      (typeof moduleVariables.steps)[number],
      { type: 'predict-output' }
    >;

    const options = getErrorPickerOptions(
      'js-02-variables',
      tdzIndex,
      moduleVariables.steps,
      ['js-01-introduction', 'js-02-variables'],
      predictStep
    );

    expect(options).toHaveLength(4);
    expect(options.every((option) => !option.isDecoy)).toBe(true);
    expect(options.map((o) => o.id)).toEqual(
      expect.arrayContaining([
        'ref-not-defined',
        'type-const-assign',
        'syntax-redeclare',
        'ref-tdz',
      ])
    );
  });

  it('prioritizes not-yet-taught course errors as decoys on var-10', () => {
    const var10Index = moduleVariables.steps.findIndex((s) => s.id === 'var-10');
    const predictStep = moduleVariables.steps[var10Index] as Extract<
      (typeof moduleVariables.steps)[number],
      { type: 'predict-output' }
    >;

    const options = getErrorPickerOptions(
      'js-02-variables',
      var10Index,
      moduleVariables.steps,
      ['js-01-introduction', 'js-02-variables'],
      predictStep
    );

    expect(options).toHaveLength(MIN_ERROR_PICKER_OPTIONS);
    expect(options.some((option) => option.id === 'type-const-assign')).toBe(true);
    expect(
      options.some(
        (option) =>
          option.id === 'syntax-redeclare' || option.id === 'ref-tdz'
      )
    ).toBe(true);
  });
});

describe('getChallengeScore', () => {
  it('ranks TDZ highest against not-defined ReferenceError', () => {
    expect(getChallengeScore('ref-not-defined', LEARN_ERROR_OPTIONS[3]!)).toBe(10);
    expect(getChallengeScore('ref-not-defined', LEARN_ERROR_OPTIONS[1]!)).toBe(6);
  });

  it('prefers same-type generic decoys over unrelated ones', () => {
    const referenceErrorDecoy = {
      id: 'decoy-type-not-a-function',
      label: 'TypeError: x is not a function',
      errorType: 'TypeError' as const,
      matchValues: [],
      isDecoy: true,
    };
    const syntaxDecoy = {
      id: 'decoy-syntax-unexpected-token',
      label: "SyntaxError: Unexpected token '}'",
      errorType: 'SyntaxError' as const,
      matchValues: [],
      isDecoy: true,
    };

    expect(getChallengeScore('type-const-assign', referenceErrorDecoy)).toBe(3);
    expect(getChallengeScore('type-const-assign', syntaxDecoy)).toBe(1);
  });
});

describe('isCorrectLearnErrorPick', () => {
  it('matches const reassignment TypeError', () => {
    const option = LEARN_ERROR_OPTIONS.find((o) => o.id === 'type-const-assign')!;
    expect(
      isCorrectLearnErrorPick(
        option,
        'TypeError: Assignment to constant variable.',
        'TypeError'
      )
    ).toBe(true);
  });

  it('rejects decoy picks', () => {
    expect(
      isCorrectLearnErrorPick(
        {
          id: 'decoy-type-not-a-function',
          label: 'TypeError: x is not a function',
          errorType: 'TypeError',
          matchValues: [],
          isDecoy: true,
        },
        'TypeError: Assignment to constant variable.',
        'TypeError'
      )
    ).toBe(false);
  });

  it('rejects wrong ReferenceError variant', () => {
    const tdz = LEARN_ERROR_OPTIONS.find((o) => o.id === 'ref-tdz')!;
    const notDefined = LEARN_ERROR_OPTIONS.find((o) => o.id === 'ref-not-defined')!;
    const reference = "ReferenceError: Cannot access 'x' before initialization";

    expect(isCorrectLearnErrorPick(tdz, reference, 'ReferenceError')).toBe(true);
    expect(isCorrectLearnErrorPick(notDefined, reference, 'ReferenceError')).toBe(false);
  });

  it('finds catalog option from runtime reference', () => {
    const available = LEARN_ERROR_OPTIONS;
    const match = findLearnErrorOptionForReference(
      'ReferenceError: missing is not defined',
      'ReferenceError',
      available
    );
    expect(match?.id).toBe('ref-not-defined');
  });
});
