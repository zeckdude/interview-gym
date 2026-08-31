/**
 * Learn step state — localStorage cache with Postgres as source of truth.
 * See AGENTS.md "Learn modules — cross-device continuity".
 */

import {
  deleteStepStateOnServer,
  isLearnStepMilestone,
  migrateLocalOnlyStepStates,
  queueStepStateSync,
} from '@/lib/learn/step-sync';

export interface LearnStepStoredState {
  predictAnswer?: string;
  predictReference?: string;
  predictPassed?: boolean | null;
  /** User chose "It throws an error" instead of typing output. */
  predictsError?: boolean;
  /** Catalog id when user picks a taught error variant. */
  selectedErrorId?: string | null;
  choiceIndex?: number | null;
  choicePassed?: boolean | null;
  code?: string;
  codeActual?: string;
  codePassed?: boolean | null;
  codeMessage?: string;
  showRecommended?: boolean;
  answerRevealed?: boolean;
  hintLevel?: number;
  revealed?: boolean;
  /** Optional "Challenge Yourself" step skipped without solving. */
  skipped?: boolean;
  /** Learner read the Challenge Yourself debrief and continued. */
  debriefAcknowledged?: boolean;
  /** Collapsible challenge breakdown expanded after first read. */
  showDebriefExpanded?: boolean;
}

function storageKey(moduleId: string, stepId: string): string {
  return `interview-gym-learn-step-${moduleId}-${stepId}`;
}

function modulePrefix(moduleId: string): string {
  return `interview-gym-learn-step-${moduleId}-`;
}

function readLocalRaw(
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

function writeLocalRaw(
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

export function loadLearnStepState(
  moduleId: string,
  stepId: string
): LearnStepStoredState | null {
  return readLocalRaw(moduleId, stepId);
}

/** Write local cache only — used during server hydration. */
export function saveLearnStepStateLocal(
  moduleId: string,
  stepId: string,
  state: LearnStepStoredState
): void {
  writeLocalRaw(moduleId, stepId, state);
}

export function saveLearnStepState(
  moduleId: string,
  stepId: string,
  state: LearnStepStoredState
): void {
  writeLocalRaw(moduleId, stepId, state);
  queueStepStateSync(moduleId, stepId, state, isLearnStepMilestone(state));
}

/**
 * Hydrate local cache from server on module load.
 * Server wins for known steps; uploads any local-only steps missing on server.
 */
export function hydrateLearnModuleStepStates(
  moduleId: string,
  serverStates: Record<string, LearnStepStoredState>
): void {
  if (typeof window === 'undefined') return;

  for (const [stepId, state] of Object.entries(serverStates)) {
    saveLearnStepStateLocal(moduleId, stepId, state);
  }

  void migrateLocalOnlyStepStates(moduleId, serverStates, (stepId) =>
    readLocalRaw(moduleId, stepId)
  );
}

/** Clear local cache only — used for fast dev bulk jumps. */
export function clearLearnStepStorageLocal(moduleId: string, stepId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey(moduleId, stepId));
  } catch {
    /* ignore */
  }
}

export function clearLearnStepStorage(moduleId: string, stepId: string): void {
  clearLearnStepStorageLocal(moduleId, stepId);
  void deleteStepStateOnServer(moduleId, stepId);
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

/** List step ids with local cache entries for a module (test helper). */
export function listLocalLearnStepIds(moduleId: string): string[] {
  if (typeof window === 'undefined') return [];
  const prefix = modulePrefix(moduleId);
  const ids: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) ids.push(key.slice(prefix.length));
    }
  } catch {
    /* ignore */
  }
  return ids;
}
