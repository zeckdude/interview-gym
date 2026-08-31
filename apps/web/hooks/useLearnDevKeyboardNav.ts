'use client';

import { useEffect } from 'react';
import {
  getLearnDevJumpDirection,
  isEditableKeyboardTarget,
  resolveLearnDevJumpTargetIndex,
} from '@/lib/learn/dev-keyboard-nav';

interface UseLearnDevKeyboardNavOptions {
  enabled: boolean;
  activeStepIndex: number;
  totalSteps: number;
  onJump: (stepIndex: number) => void;
  disabled?: boolean;
  jumpMenuOpen?: boolean;
}

export function useLearnDevKeyboardNav({
  enabled,
  activeStepIndex,
  totalSteps,
  onJump,
  disabled = false,
  jumpMenuOpen = false,
}: UseLearnDevKeyboardNavOptions) {
  useEffect(() => {
    if (!enabled || disabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (jumpMenuOpen) return;
      if (isEditableKeyboardTarget(e.target)) return;

      const direction = getLearnDevJumpDirection(e);
      if (!direction) return;

      const targetIndex = resolveLearnDevJumpTargetIndex(
        direction,
        activeStepIndex,
        totalSteps
      );
      if (targetIndex == null) return;

      e.preventDefault();
      onJump(targetIndex);
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [
    activeStepIndex,
    disabled,
    enabled,
    jumpMenuOpen,
    onJump,
    totalSteps,
  ]);
}
