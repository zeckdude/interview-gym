import type { MistakeKind } from '@/lib/learn/mistake-kind';
import { FIRST_HINT_INDEX } from '@/lib/learn/mistake-kind';

/** Progressive hints for predict / code steps (3 levels, then reveal). */
export interface LearnStepHints {
  hints?: string[];
  hint?: string;
  revealExplanation?: string;
  /** Phase 2: targeted hint ladders keyed by mistake classifier. */
  mistakeHints?: Partial<Record<MistakeKind, string[]>>;
}

export function getStepHints(step: LearnStepHints): string[] {
  if (step.hints?.length) return step.hints.slice(0, 3);
  if (step.hint) return [step.hint];
  return [];
}

/**
 * Order hints for display — branch overrides first, then reorder default ladder
 * so the most relevant hint for this mistake appears first.
 */
export function getOrderedHints(
  step: LearnStepHints,
  mistakeKind: MistakeKind | null
): string[] {
  const branch =
    mistakeKind && mistakeKind !== 'correct' && mistakeKind !== 'output_mismatch'
      ? step.mistakeHints?.[mistakeKind]
      : undefined;
  if (branch?.length) return branch.slice(0, 3);

  const defaultHints = getStepHints(step);
  if (!defaultHints.length || !mistakeKind || mistakeKind === 'correct') {
    return defaultHints;
  }

  const startIdx = FIRST_HINT_INDEX[mistakeKind] ?? 0;
  if (startIdx <= 0) return defaultHints;

  const reordered: string[] = [];
  for (let i = startIdx; i < defaultHints.length; i++) reordered.push(defaultHints[i]!);
  for (let i = 0; i < startIdx; i++) reordered.push(defaultHints[i]!);
  return reordered;
}
