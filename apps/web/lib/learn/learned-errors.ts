import { getLearnModule } from '@/data/learn/modules';
import { getGraphNode } from '@/data/learn/graph';
import type { LearnErrorType, LearnStep } from '@/data/learn/types';
import {
  getPredictRuntimeReference,
  normalizeOutput,
  predictOutputsMatch,
} from '@/lib/learn/execute-code';

/** Minimum options shown in the error picker — padded with decoys until enough are taught. */
export const MIN_ERROR_PICKER_OPTIONS = 4;

/** A specific error message variant taught in the learn path. */
export interface LearnErrorOption {
  id: string;
  label: string;
  errorType: LearnErrorType;
  /** Values used when comparing a user's pick to expected/runtime output. */
  matchValues: string[];
  introducedAt?: { moduleId: string; stepId: string };
  /** Plausible distractor before the error is taught in the course. */
  isDecoy?: boolean;
}

export const LEARN_ERROR_OPTIONS: LearnErrorOption[] = [
  {
    id: 'ref-not-defined',
    label: 'ReferenceError: <name> is not defined',
    errorType: 'ReferenceError',
    matchValues: [
      'ReferenceError',
      'ReferenceError: missing is not defined',
      'ReferenceError: variable is not defined',
    ],
    introducedAt: { moduleId: 'js-01-introduction', stepId: 'intro-errors-1' },
  },
  {
    id: 'type-const-assign',
    label: 'TypeError: Assignment to constant variable.',
    errorType: 'TypeError',
    matchValues: ['TypeError', 'TypeError: Assignment to constant variable.'],
    introducedAt: { moduleId: 'js-02-variables', stepId: 'var-9' },
  },
  {
    id: 'syntax-redeclare',
    label: "SyntaxError: Identifier 'x' has already been declared",
    errorType: 'SyntaxError',
    matchValues: [
      'SyntaxError',
      "SyntaxError: Identifier 'x' has already been declared",
    ],
    introducedAt: { moduleId: 'js-02-variables', stepId: 'var-syntax-1' },
  },
  {
    id: 'ref-tdz',
    label: "ReferenceError: Cannot access 'x' before initialization",
    errorType: 'ReferenceError',
    matchValues: [
      'ReferenceError',
      "ReferenceError: Cannot access 'x' before initialization",
    ],
    introducedAt: { moduleId: 'js-02-variables', stepId: 'var-tdz-1' },
  },
];

/** Common JavaScript errors used as early-course distractors. */
export const GENERIC_ERROR_DECOYS: LearnErrorOption[] = [
  {
    id: 'decoy-type-not-a-function',
    label: 'TypeError: x is not a function',
    errorType: 'TypeError',
    matchValues: ['TypeError: x is not a function'],
    isDecoy: true,
  },
  {
    id: 'decoy-type-read-undefined',
    label: "TypeError: Cannot read properties of undefined (reading 'length')",
    errorType: 'TypeError',
    matchValues: ["TypeError: Cannot read properties of undefined (reading 'length')"],
    isDecoy: true,
  },
  {
    id: 'decoy-syntax-unexpected-token',
    label: "SyntaxError: Unexpected token '}'",
    errorType: 'SyntaxError',
    matchValues: ["SyntaxError: Unexpected token '}'"],
    isDecoy: true,
  },
  {
    id: 'decoy-syntax-invalid-token',
    label: 'SyntaxError: Invalid or unexpected token',
    errorType: 'SyntaxError',
    matchValues: ['SyntaxError: Invalid or unexpected token'],
    isDecoy: true,
  },
  {
    id: 'decoy-type-not-iterable',
    label: 'TypeError: x is not iterable',
    errorType: 'TypeError',
    matchValues: ['TypeError: x is not iterable'],
    isDecoy: true,
  },
];

const ALL_ERROR_OPTIONS: LearnErrorOption[] = [
  ...LEARN_ERROR_OPTIONS,
  ...GENERIC_ERROR_DECOYS,
];

function stepKey(moduleId: string, stepId: string): string {
  return `${moduleId}:${stepId}`;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  const rng = mulberry32(hashSeed(seed));
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickOptions(options: LearnErrorOption[], count: number, seed: string): LearnErrorOption[] {
  return shuffleWithSeed(options, seed).slice(0, count);
}

/** Prerequisite modules in course order (transitive, deduped). */
export function getPriorModuleIdsInOrder(moduleId: string): string[] {
  const node = getGraphNode(moduleId);
  if (!node) return [];

  const result: string[] = [];
  const seen = new Set<string>();

  function walk(prereqId: string) {
    if (seen.has(prereqId)) return;
    const prereqNode = getGraphNode(prereqId);
    if (!prereqNode) return;
    for (const nested of prereqNode.prerequisites) {
      walk(nested);
    }
    seen.add(prereqId);
    result.push(prereqId);
  }

  for (const prereq of node.prerequisites) {
    walk(prereq);
  }

  return result;
}

function buildSeenSteps(
  currentModuleId: string,
  currentStepIndex: number,
  coveredModuleIds: string[]
): Set<string> {
  const seen = new Set<string>();
  const covered = new Set(coveredModuleIds);

  for (const priorModuleId of getPriorModuleIdsInOrder(currentModuleId)) {
    if (!covered.has(priorModuleId)) continue;
    const mod = getLearnModule(priorModuleId);
    if (!mod) continue;
    for (const step of mod.steps) {
      seen.add(stepKey(priorModuleId, step.id));
    }
  }

  if (covered.has(currentModuleId)) {
    const currentMod = getLearnModule(currentModuleId);
    if (currentMod) {
      for (let i = 0; i < currentStepIndex; i++) {
        const step = currentMod.steps[i];
        if (step) seen.add(stepKey(currentModuleId, step.id));
      }
    }
  }

  return seen;
}

/** Errors the learner has been taught before the current step. */
export function getIntroducedLearnErrors(
  currentModuleId: string,
  currentStepIndex: number,
  _currentModuleSteps: LearnStep[],
  coveredModuleIds: string[]
): LearnErrorOption[] {
  const seen = buildSeenSteps(currentModuleId, currentStepIndex, coveredModuleIds);
  return LEARN_ERROR_OPTIONS.filter((option) =>
    seen.has(stepKey(option.introducedAt!.moduleId, option.introducedAt!.stepId))
  );
}

function getPredictStepReference(
  step: Extract<LearnStep, { type: 'predict-output' }>
): string {
  return getPredictRuntimeReference(step.code, step.expectedOutput);
}

/** How easily a wrong pick is confused with the correct error for this step. */
const ERROR_CONFUSION_SCORES: Record<string, Record<string, number>> = {
  'ref-not-defined': {
    'ref-tdz': 10,
    'type-const-assign': 6,
    'syntax-redeclare': 5,
  },
  'ref-tdz': {
    'ref-not-defined': 10,
    'type-const-assign': 5,
    'syntax-redeclare': 4,
  },
  'type-const-assign': {
    'syntax-redeclare': 7,
    'ref-not-defined': 6,
    'ref-tdz': 5,
  },
  'syntax-redeclare': {
    'type-const-assign': 7,
    'ref-not-defined': 5,
    'ref-tdz': 4,
  },
};

function tieBreakScore(seed: string, optionId: string): number {
  return hashSeed(`${seed}:${optionId}`) / 4294967296;
}

export function getChallengeScore(
  correctOptionId: string | undefined,
  option: LearnErrorOption
): number {
  if (!correctOptionId || option.id === correctOptionId) return -1;

  const mapped = ERROR_CONFUSION_SCORES[correctOptionId]?.[option.id];
  if (mapped !== undefined) return mapped;

  const correct = LEARN_ERROR_OPTIONS.find((entry) => entry.id === correctOptionId);
  if (option.isDecoy) {
    return option.errorType === correct?.errorType ? 3 : 1;
  }

  return 2;
}

function rankByChallenge(
  correctOption: LearnErrorOption | undefined,
  options: LearnErrorOption[],
  seed: string
): LearnErrorOption[] {
  return [...options].sort((a, b) => {
    const scoreDiff =
      getChallengeScore(correctOption?.id, b) - getChallengeScore(correctOption?.id, a);
    if (scoreDiff !== 0) return scoreDiff;
    return tieBreakScore(seed, a.id) - tieBreakScore(seed, b.id);
  });
}

function findCorrectOptionForStep(
  introduced: LearnErrorOption[],
  reference: string,
  expectedOutput: string
): LearnErrorOption | undefined {
  return (
    findLearnErrorOptionForReference(reference, expectedOutput, introduced) ??
    findLearnErrorOptionForReference(reference, expectedOutput, LEARN_ERROR_OPTIONS)
  );
}

function isPlausibleDecoy(
  option: LearnErrorOption,
  introducedIds: Set<string>,
  reference: string,
  expectedOutput: string
): boolean {
  if (introducedIds.has(option.id)) return false;
  if (option.isDecoy) return true;
  if (!reference.trim()) return true;
  return !isCorrectLearnErrorPick(option, reference, expectedOutput);
}

/**
 * Options shown in the error picker.
 * Before four course errors are taught, pad with plausible decoys.
 * After that, use only taught errors for a harder differentiation quiz.
 */
export function getErrorPickerOptions(
  currentModuleId: string,
  currentStepIndex: number,
  currentModuleSteps: LearnStep[],
  coveredModuleIds: string[],
  predictStep?: Extract<LearnStep, { type: 'predict-output' }>
): LearnErrorOption[] {
  const introduced = getIntroducedLearnErrors(
    currentModuleId,
    currentStepIndex,
    currentModuleSteps,
    coveredModuleIds
  );

  const seed = predictStep
    ? `${currentModuleId}:${predictStep.id}`
    : `${currentModuleId}:${currentStepIndex}`;

  const reference = predictStep ? getPredictStepReference(predictStep) : '';
  const expectedOutput = predictStep?.expectedOutput ?? '';
  const correctOption = reference
    ? findCorrectOptionForStep(introduced, reference, expectedOutput)
    : undefined;

  if (introduced.length >= MIN_ERROR_PICKER_OPTIONS) {
    const wrongOptions = introduced.filter((option) => option.id !== correctOption?.id);
    const rankedWrong = rankByChallenge(correctOption, wrongOptions, `${seed}:wrong`);
    const pickerOptions = correctOption
      ? [correctOption, ...rankedWrong]
      : shuffleWithSeed(introduced, seed);
    return finalizePickerOptions(
    shuffleWithSeed(pickerOptions, `${seed}:picker`),
    correctOption,
    reference,
    expectedOutput
  );
  }

  const pickerBase: LearnErrorOption[] = [...introduced];
  if (correctOption && !pickerBase.some((option) => option.id === correctOption.id)) {
    pickerBase.unshift(correctOption);
  }

  const introducedIds = new Set(pickerBase.map((option) => option.id));

  const courseDecoys = LEARN_ERROR_OPTIONS.filter((option) =>
    isPlausibleDecoy(option, introducedIds, reference, expectedOutput)
  );
  const genericDecoys = GENERIC_ERROR_DECOYS.filter((option) =>
    isPlausibleDecoy(option, introducedIds, reference, expectedOutput)
  );

  const needed = MIN_ERROR_PICKER_OPTIONS - pickerBase.length;
  const decoys: LearnErrorOption[] = [];
  const usedIds = new Set(introducedIds);
  const rankedDecoys = rankByChallenge(
    correctOption,
    [...courseDecoys, ...genericDecoys],
    `${seed}:decoys`
  );

  for (const option of rankedDecoys) {
    if (decoys.length >= needed) break;
    if (usedIds.has(option.id)) continue;
    decoys.push(option);
    usedIds.add(option.id);
  }

  return finalizePickerOptions(
    shuffleWithSeed([...pickerBase, ...decoys], `${seed}:picker`),
    correctOption,
    reference,
    expectedOutput
  );
}

/** Picker labels for the correct answer use the step's runtime error text. */
export function applyRuntimeLabelsToPickerOptions(
  options: LearnErrorOption[],
  reference: string,
  expectedOutput: string
): LearnErrorOption[] {
  if (!reference.trim()) return options;
  const displayReference = normalizeOutput(reference);
  return options.map((option) => {
    if (isCorrectLearnErrorPick(option, reference, expectedOutput)) {
      return { ...option, label: displayReference };
    }
    return option;
  });
}

function finalizePickerOptions(
  options: LearnErrorOption[],
  correctOption: LearnErrorOption | undefined,
  reference: string,
  expectedOutput: string
): LearnErrorOption[] {
  const withCorrect = ensureCorrectOptionInPicker(options, correctOption);
  return applyRuntimeLabelsToPickerOptions(withCorrect, reference, expectedOutput);
}

/** The runtime-matching option must always appear in the picker when we know it. */
function ensureCorrectOptionInPicker(
  options: LearnErrorOption[],
  correctOption: LearnErrorOption | undefined
): LearnErrorOption[] {
  if (!correctOption) return options;
  if (options.some((option) => option.id === correctOption.id)) return options;
  return [correctOption, ...options];
}

/** @deprecated Use getErrorPickerOptions for UI and getIntroducedLearnErrors for taught-only lists. */
export function getAvailableLearnErrors(
  currentModuleId: string,
  currentStepIndex: number,
  currentModuleSteps: LearnStep[],
  coveredModuleIds: string[]
): LearnErrorOption[] {
  return getIntroducedLearnErrors(
    currentModuleId,
    currentStepIndex,
    currentModuleSteps,
    coveredModuleIds
  );
}

export function findLearnErrorOption(id: string | null | undefined): LearnErrorOption | undefined {
  if (!id) return undefined;
  return ALL_ERROR_OPTIONS.find((option) => option.id === id);
}

/** Prefer the step-scoped option (runtime label) over the catalog entry. */
export function findLearnErrorOptionInList(
  id: string | null | undefined,
  options: LearnErrorOption[]
): LearnErrorOption | undefined {
  if (!id) return undefined;
  return options.find((option) => option.id === id) ?? findLearnErrorOption(id);
}

function referenceMatchesOption(option: LearnErrorOption, reference: string): boolean {
  if (option.isDecoy) return false;

  const ref = normalizeOutput(reference).toLowerCase();

  switch (option.id) {
    case 'ref-not-defined':
      return ref.includes('is not defined') && !ref.includes('before initialization');
    case 'ref-tdz':
      return ref.includes('before initialization');
    case 'type-const-assign':
      return ref.includes('assignment to constant variable');
    case 'syntax-redeclare':
      return ref.includes('already been declared');
    default:
      return option.matchValues.some((matchValue) =>
        predictOutputsMatch(matchValue, reference)
      );
  }
}

/** Whether a picked error matches what this step expects at runtime. */
export function isCorrectLearnErrorPick(
  option: LearnErrorOption,
  reference: string,
  expectedOutput: string
): boolean {
  if (option.isDecoy) return false;

  if (reference.trim()) {
    return referenceMatchesOption(option, reference);
  }

  return option.matchValues.some((matchValue) =>
    predictOutputsMatch(matchValue, expectedOutput)
  );
}

/** Best matching taught option for a runtime error string. */
export function findLearnErrorOptionForReference(
  reference: string,
  expectedOutput: string,
  available: LearnErrorOption[]
): LearnErrorOption | undefined {
  return available.find(
    (option) =>
      !option.isDecoy &&
      isCorrectLearnErrorPick(option, reference, expectedOutput)
  );
}
