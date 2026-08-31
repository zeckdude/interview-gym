/** Dev-only keyboard shortcuts for learn module navigation. */

export type LearnDevJumpDirection = 'prev' | 'next';

export function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  if (target.closest('.monaco-editor')) return true;
  return false;
}

/** ⌘⇧←/→ (Mac) or Ctrl+Shift+←/→ — prev/next dev step jump. */
export function getLearnDevJumpDirection(e: Pick<
  KeyboardEvent,
  'key' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'
>): LearnDevJumpDirection | null {
  const hasPrimary = e.metaKey || e.ctrlKey;
  if (!hasPrimary || !e.shiftKey || e.altKey) return null;
  if (e.key === 'ArrowLeft') return 'prev';
  if (e.key === 'ArrowRight') return 'next';
  return null;
}

export function resolveLearnDevJumpTargetIndex(
  direction: LearnDevJumpDirection,
  activeStepIndex: number,
  totalSteps: number
): number | null {
  if (totalSteps <= 0) return null;
  const next =
    direction === 'prev' ? activeStepIndex - 1 : activeStepIndex + 1;
  if (next < 0 || next >= totalSteps) return null;
  return next;
}
