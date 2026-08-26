import { getItemProgress, getPathProgress, reconcileStageUnlocks } from '@/lib/paths/db';
import type { StageStatus } from '@/lib/paths/types';

export const MARK_UNDERSTOOD_THRESHOLD = 3;

function isCompleteStatus(status: string): boolean {
  return status === 'passed' || status === 'understood';
}

export async function getStageStatus(
  userId: string,
  pathId: string,
  stage: number
): Promise<StageStatus> {
  const progress = await getPathProgress(userId, pathId);
  const stageProgress = progress.filter((p) => p.stage === stage);

  if (stage > 1) {
    const prevStageProgress = progress.filter((p) => p.stage === stage - 1);
    if (prevStageProgress.length === 0) return 'locked';

    const prevComplete = prevStageProgress.every((p) => isCompleteStatus(p.status));
    if (!prevComplete) return 'locked';
  }

  if (stageProgress.length === 0) {
    return stage === 1 ? 'unlocked' : 'locked';
  }

  if (stageProgress.every((p) => isCompleteStatus(p.status))) return 'complete';

  if (stageProgress.some((p) => p.status !== 'locked')) return 'in-progress';

  return 'unlocked';
}

export async function checkMarkAsUnderstood(
  userId: string,
  pathId: string,
  itemId: string
): Promise<{ eligible: boolean; attempts: number }> {
  const progress = await getItemProgress(userId, pathId, itemId);
  if (!progress) {
    return { eligible: false, attempts: 0 };
  }

  return {
    eligible:
      progress.attempts >= MARK_UNDERSTOOD_THRESHOLD &&
      progress.status !== 'passed' &&
      progress.status !== 'understood',
    attempts: progress.attempts,
  };
}

export async function getCurrentStage(
  userId: string,
  pathId: string
): Promise<number> {
  for (const stage of [1, 2, 3] as const) {
    const status = await getStageStatus(userId, pathId, stage);
    if (status === 'complete' && stage < 3) continue;
    if (status === 'locked') return Math.max(1, stage - 1);
    return stage;
  }
  return 3;
}

export async function getStageSummary(
  userId: string,
  pathId: string,
  stage: number
) {
  const progress = await getPathProgress(userId, pathId);
  const stageProgress = progress.filter((p) => p.stage === stage);
  const complete = stageProgress.filter((p) => isCompleteStatus(p.status)).length;
  const status = await getStageStatus(userId, pathId, stage);

  return {
    stage,
    status,
    total: stageProgress.length,
    complete,
    remaining: stageProgress.length - complete,
  };
}

export async function enforceStageGating(
  userId: string,
  pathId: string
): Promise<{ unlockedStage?: number }> {
  return reconcileStageUnlocks(userId, pathId);
}
