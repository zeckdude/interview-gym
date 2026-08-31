import type { LearnStepStoredState } from '@/lib/learn/step-storage';

const SYNC_DEBOUNCE_MS = 600;

const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

function syncKey(moduleId: string, stepId: string): string {
  return `${moduleId}:${stepId}`;
}

/** Whether this patch should sync immediately instead of debouncing. */
export function isLearnStepMilestone(patch: LearnStepStoredState): boolean {
  return (
    patch.predictPassed === true ||
    patch.codePassed === true ||
    patch.choicePassed === true ||
    patch.answerRevealed === true ||
    patch.revealed === true
  );
}

async function putStepState(
  moduleId: string,
  stepId: string,
  state: LearnStepStoredState
): Promise<void> {
  await fetch('/api/learn/step-state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId, stepId, state }),
  });
}

/** Debounced or immediate remote sync — fire-and-forget. */
export function queueStepStateSync(
  moduleId: string,
  stepId: string,
  state: LearnStepStoredState,
  immediate = false
): void {
  if (typeof window === 'undefined') return;

  const key = syncKey(moduleId, stepId);
  const existing = pendingTimers.get(key);
  if (existing) clearTimeout(existing);

  const run = () => {
    pendingTimers.delete(key);
    void putStepState(moduleId, stepId, state).catch(() => {
      /* non-blocking — local cache remains */
    });
  };

  if (immediate) {
    run();
    return;
  }

  pendingTimers.set(key, setTimeout(run, SYNC_DEBOUNCE_MS));
}

/** Flush any pending debounced sync for a step before delete. */
export function flushStepStateSync(moduleId: string, stepId: string): void {
  const key = syncKey(moduleId, stepId);
  const existing = pendingTimers.get(key);
  if (existing) {
    clearTimeout(existing);
    pendingTimers.delete(key);
  }
}

/** Remove one step's remote state (e.g. step back). */
export async function deleteStepStateOnServer(
  moduleId: string,
  stepId: string
): Promise<void> {
  flushStepStateSync(moduleId, stepId);
  try {
    await fetch(
      `/api/learn/step-state?moduleId=${encodeURIComponent(moduleId)}&stepId=${encodeURIComponent(stepId)}`,
      { method: 'DELETE' }
    );
  } catch {
    /* non-blocking */
  }
}

/** Upload local-only step states that are missing on the server. */
export async function migrateLocalOnlyStepStates(
  moduleId: string,
  serverStates: Record<string, LearnStepStoredState>,
  readLocalState: (stepId: string) => LearnStepStoredState | null
): Promise<void> {
  if (typeof window === 'undefined') return;

  const prefix = `interview-gym-learn-step-${moduleId}-`;
  const localStepIds: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;
      localStepIds.push(key.slice(prefix.length));
    }
  } catch {
    return;
  }

  await Promise.all(
    localStepIds
      .filter((stepId) => !serverStates[stepId])
      .map(async (stepId) => {
        const state = readLocalState(stepId);
        if (!state) return;
        try {
          await putStepState(moduleId, stepId, state);
        } catch {
          /* best-effort */
        }
      })
  );
}
