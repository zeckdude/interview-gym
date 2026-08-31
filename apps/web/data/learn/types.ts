/** Step types for Execute Program–style incremental learning. */
import type { MistakeKind } from '@/lib/learn/mistake-kind';

/**
 * Raw runtime value for answer matching (no display quotes).
 * In UI, hints, and reveal copy, show string log output with single quotes via
 * `formatQuotedDisplayOutput()` — see AGENTS.md “Learn modules — string output”.
 */
export type LearnExpectedOutput = string;

export type LearnStepType =
  | 'text'
  | 'code-demo'
  | 'predict-output'
  | 'choice'
  | 'code-challenge'
  | 'review-gate';

export type LearnErrorType = 'TypeError' | 'ReferenceError' | 'SyntaxError';

export type LearnGoalType = 'output' | 'error';

/**
 * When the prompt allows multiple valid outputs, set this so validation and diff UI
 * match the prompt. `expectedOutput` stays the canonical example for reveal/solution.
 */
export type LearnOutputFlex = 'logged-const-name' | 'name-then-2026';

/** Educational wrap-up for optional Challenge Yourself steps (required when `optional: true`). */
export interface LearnChallengeDebrief {
  /** What trick or misconception made this hard. */
  gotcha: string;
  /** How to think about it — ideal reasoning or approach. */
  greatSolution: string;
  /** Practical habits when you see similar code in the wild. */
  watchFor: string;
  /** Optional reference solution code (code-challenge steps). */
  solutionCode?: string;
  /** Step-by-step evaluation for predict-style challenges (shown as a trace, not prose). */
  evaluationSteps?: Array<{ expression: string; yields: string }>;
}

export interface LearnStepBase {
  id: string;
  type: LearnStepType;
  /** Tags for spaced repetition & weight preferences (e.g. `variables`, `typeof`). */
  conceptTags: string[];
  /**
   * Dev step jump menu label (development builds only). Required on every authored step.
   * Describe the topic — never the prompt, code snippet, expected output, or correct answer.
   * See AGENTS.md "Learn modules — dev step labels".
   */
  devTitle?: string;
  /** One-line topic summary for the dev jump menu — same no-spoiler rules as devTitle. */
  devDescription?: string;
  /**
   * When true, the learner may skip without solving. Used for "Challenge Yourself"
   * extras — see AGENTS.md "Learn modules — Challenge Yourself".
   */
  optional?: boolean;
}

export type LearnSectionKind = 'challenge-yourself';

/** Row for scannable type-reference tables on text steps (e.g. primitive types). */
export interface LearnTypeReferenceRow {
  name: string;
  description: string;
  example?: string;
  accent?: 'fe' | 'brand' | 'success' | 'warning' | 'muted';
}

export interface LearnTextStep extends LearnStepBase {
  type: 'text';
  title?: string;
  /** Visual section marker (e.g. optional "Challenge Yourself" block). */
  sectionKind?: LearnSectionKind;
  /** Markdown-ish plain text; inline `code` supported via backticks in renderer. */
  content: string;
  /** Optional scannable type table — rendered between content and footer. */
  typeReference?: LearnTypeReferenceRow[];
  /** Closing paragraph after typeReference (keeps intro in content). */
  footer?: string;
}

export interface LearnCodeDemoStep extends LearnStepBase {
  type: 'code-demo';
  code: string;
  /** Raw stdout for matching; display with `formatQuotedDisplayOutput(step.code, …)`. */
  expectedOutput: LearnExpectedOutput;
  /** When true, expectedOutput is an error message (styled differently in UI). */
  expectsError?: boolean;
  language?: 'javascript';
}

export interface LearnPredictOutputStep extends LearnStepBase {
  type: 'predict-output';
  prompt?: string;
  code: string;
  expectedOutput: LearnExpectedOutput;
  /** When true, expectedOutput is an error message. */
  expectsError?: boolean;
  /** Allow typing `error` instead of the full error name/message. */
  acceptErrorShorthand?: boolean;
  /** Up to 3 progressive hints. */
  hints?: string[];
  /** Phase 2: targeted hints when classifier matches a known mistake. */
  mistakeHints?: Partial<Record<MistakeKind, string[]>>;
  /** @deprecated Use hints array. */
  hint?: string;
  revealExplanation?: string;
  language?: 'javascript';
  /** Required when `optional: true` — educational wrap-up after pass or skip. */
  challengeDebrief?: LearnChallengeDebrief;
}
export interface LearnChoiceStep extends LearnStepBase {
  type: 'choice';
  prompt: string;
  /** Optional code context shown above the choices. */
  code?: string;
  choices: string[];
  correctIndex: number;
  hints?: string[];
  /** Shown after a wrong pick or in the recommended-answer panel. */
  explanation?: string;
  revealExplanation?: string;
}

export interface LearnCodeChallengeStep extends LearnStepBase {
  type: 'code-challenge';
  prompt: string;
  setupCode: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: LearnExpectedOutput;
  /** `error` = user must cause the expected error; `output` = normal console output (default). */
  goalType?: LearnGoalType;
  /** When prompt allows learner-chosen values (e.g. their own name). */
  outputFlex?: LearnOutputFlex;
  hints?: string[];
  mistakeHints?: Partial<Record<MistakeKind, string[]>>;
  hint?: string;
  revealExplanation?: string;
  language?: 'javascript';
  /** Required when `optional: true` — educational wrap-up after pass or skip. */
  challengeDebrief?: LearnChallengeDebrief;
}

/** Mixed recap at end of a level — pulls SRS items + fixed prompts. */
export interface LearnReviewGateStep extends LearnStepBase {
  type: 'review-gate';
  title: string;
  content: string;
  /** Concept tags to pull SRS items from for this review. */
  levelConceptTags: string[];
}

export type LearnStep =
  | LearnTextStep
  | LearnCodeDemoStep
  | LearnPredictOutputStep
  | LearnChoiceStep
  | LearnCodeChallengeStep
  | LearnReviewGateStep;

export type LearnModuleKind = 'lesson' | 'review' | 'extra';

export interface LearnModule {
  id: string;
  title: string;
  description: string;
  level: number;
  levelLabel: string;
  kind: LearnModuleKind;
  /** Estimated minutes when content is available. */
  estimatedMinutes: number;
  /** True only for modules with authored step content. */
  contentAvailable: boolean;
  /** EP parity vs Interview Gym extra (conditionals, loops, …). */
  isExtra?: boolean;
  steps: LearnStep[];
}

export type ModuleProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface ModuleProgressView {
  moduleId: string;
  status: ModuleProgressStatus;
  currentStepIndex: number;
  completedAt: string | null;
}

export type ConceptWeight = -1 | 0 | 1;

export interface ConceptWeightRecord {
  conceptTag: string;
  weight: ConceptWeight;
}

export interface ReviewDueItem {
  id: string;
  conceptTag: string;
  moduleId: string;
  stepId: string;
  reviewType: 'predict_output' | 'code_goal';
  reviewData: {
    prompt?: string;
    code?: string;
    setupCode?: string;
    starterCode?: string;
    solutionCode?: string;
    expectedOutput: LearnExpectedOutput;
    goalType?: LearnGoalType;
    outputFlex?: LearnOutputFlex;
    hint?: string;
  };
  nextReviewAt: string;
}
