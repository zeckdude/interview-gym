import type { LearnModule } from '../types';
import { LEARN_GRAPH_NODES, LEVEL_LABELS } from '../graph';
import { moduleIntroduction } from './js-01-introduction';
import { moduleVariables } from './js-02-variables';

/** Authored modules with full step content. */
const AUTHORED_MODULES: LearnModule[] = [moduleIntroduction, moduleVariables];

const authoredById = new Map(AUTHORED_MODULES.map((m) => [m.id, m]));

/** Resolve a module: authored content or scaffold from graph metadata. */
export function getLearnModule(moduleId: string): LearnModule | undefined {
  const authored = authoredById.get(moduleId);
  if (authored) return authored;

  const node = LEARN_GRAPH_NODES.find((n) => n.id === moduleId);
  if (!node) return undefined;

  return {
    id: node.id,
    title: node.title,
    description: node.description,
    level: node.level,
    levelLabel: LEVEL_LABELS[node.level] ?? `Level ${node.level}`,
    kind: node.kind,
    estimatedMinutes: node.estimatedMinutes,
    contentAvailable: node.contentAvailable,
    isExtra: node.isExtra,
    steps: [],
  };
}

export function getAllLearnModules(): LearnModule[] {
  return LEARN_GRAPH_NODES.map((node) => getLearnModule(node.id)!);
}

export function getAuthoredModuleIds(): string[] {
  return AUTHORED_MODULES.map((m) => m.id);
}

export { moduleIntroduction, moduleVariables };
