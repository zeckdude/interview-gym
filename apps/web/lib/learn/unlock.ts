import type { ModuleProgressStatus, ModuleProgressView } from '@/data/learn/types';
import { LEARN_GRAPH_NODES, getGraphNode } from '@/data/learn/graph';

export interface ProgressRecord {
  moduleId: string;
  status: string;
  currentStepIndex: number;
  completedAt: Date | null;
}

export function isModuleCompleted(
  moduleId: string,
  progressMap: Map<string, ProgressRecord>
): boolean {
  const p = progressMap.get(moduleId);
  return p?.status === 'completed';
}

export function computeModuleStatus(
  moduleId: string,
  progressMap: Map<string, ProgressRecord>
): ModuleProgressStatus {
  const node = getGraphNode(moduleId);
  if (!node) return 'locked';

  const progress = progressMap.get(moduleId);
  if (progress?.status === 'completed') return 'completed';
  if (progress?.status === 'in_progress') return 'in_progress';

  const prereqsMet = node.prerequisites.every((id) => isModuleCompleted(id, progressMap));
  if (!prereqsMet) return 'locked';

  if (!node.contentAvailable) return 'locked';

  return 'available';
}

export function buildModuleProgressViews(
  progressRecords: ProgressRecord[]
): ModuleProgressView[] {
  const progressMap = new Map(progressRecords.map((p) => [p.moduleId, p]));

  return LEARN_GRAPH_NODES.map((node) => {
    const status = computeModuleStatus(node.id, progressMap);
    const record = progressMap.get(node.id);
    return {
      moduleId: node.id,
      status,
      currentStepIndex: record?.currentStepIndex ?? 0,
      completedAt: record?.completedAt?.toISOString() ?? null,
    };
  });
}

export function countCompletedModules(progressRecords: ProgressRecord[]): number {
  return progressRecords.filter((p) => p.status === 'completed').length;
}

export function countContentAvailableModules(): number {
  return LEARN_GRAPH_NODES.filter((n) => n.contentAvailable).length;
}

export function getNodesByLevel(): Map<number, typeof LEARN_GRAPH_NODES> {
  const map = new Map<number, typeof LEARN_GRAPH_NODES>();
  for (const node of LEARN_GRAPH_NODES) {
    const list = map.get(node.level) ?? [];
    list.push(node);
    map.set(node.level, list);
  }
  return map;
}
