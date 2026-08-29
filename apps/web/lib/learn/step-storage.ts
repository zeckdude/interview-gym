/** Persist learn step drafts and submitted answers in localStorage. */

export interface LearnStepStoredState {
  predictAnswer?: string;
  predictReference?: string;
  predictPassed?: boolean | null;
  /** User chose "It throws an error" instead of typing output. */
  predictsError?: boolean;
  choiceIndex?: number | null;
  choicePassed?: boolean | null;
  code?: string;
  codeActual?: string;
  codePassed?: boolean | null;
  codeMessage?: string;
  showRecommended?: boolean;
  answerRevealed?: boolean;
}

function storageKey(moduleId: string, stepId: string): string {
  return `interview-gym-learn-step-${moduleId}-${stepId}`;
}

function modulePrefix(moduleId: string): string {
  return `interview-gym-learn-step-${moduleId}-`;
}

export function loadLearnStepState(
  moduleId: string,
  stepId: string
): LearnStepStoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(moduleId, stepId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LearnStepStoredState;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLearnStepState(
  moduleId: string,
  stepId: string,
  state: LearnStepStoredState
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(moduleId, stepId), JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearLearnModuleStepStorage(moduleId: string): void {
  if (typeof window === 'undefined') return;
  const prefix = modulePrefix(moduleId);
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) keysToRemove.push(key);
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}
