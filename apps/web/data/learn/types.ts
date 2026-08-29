/** Step types for Execute Program–style incremental learning. */
import type { MistakeKind } from '@/lib/learn/mistake-kind';

export type LearnStepType =
  | 'text'
  | 'code-demo'
  | 'predict-output'
  | 'choice'
  | 'code-challenge'
  | 'review-gate';

export type LearnErrorType = 'TypeError' | 'ReferenceError' | 'SyntaxError';

export type LearnGoalType = 'output' | 'error';

export interface LearnStepBase {
  id: string;
  type: LearnStepType;
  /** Tags for spaced repetition & weight preferences (e.g. `variables`, `typeof`). */
  conceptTags: string[];
}

export interface LearnTextStep extends LearnStepBase {
  type: 'text';
  title?: string;
  /** Markdown-ish plain text; inline `code` supported via backticks in renderer. */
  content: string;
}

export interface LearnCodeDemoStep extends LearnStepBase {
  type: 'code-demo';
  code: string;
  /** Expected stdout / expression result shown after demo runs. */
  expectedOutput: string;
  /** When true, expectedOutput is an error message (styled differently in UI). */
  expectsError?: boolean;
  language?: 'javascript';
}

export interface LearnPredictOutputStep extends LearnStepBase {
  type: 'predict-output';
  prompt?: string;
  code: string;
  expectedOutput: string;
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
}

/** Multiple-choice checkpoint — user must pick the correct option to proceed. */
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
  expectedOutput: string;
  /** `error` = user must cause the expected error; `output` = normal console output (default). */
  goalType?: LearnGoalType;
  hints?: string[];
  mistakeHints?: Partial<Record<MistakeKind, string[]>>;
  hint?: string;
  revealExplanation?: string;
  language?: 'javascript';
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
    expectedOutput: string;
    goalType?: LearnGoalType;
    hint?: string;
  };
  nextReviewAt: string;
}
