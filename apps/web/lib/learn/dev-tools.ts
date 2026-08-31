/** Dev-only affordances for speeding through learn modules locally. */

import type { LearnModule, LearnStep } from '@/data/learn/types';

export function isLearnDevToolsEnabled(): boolean {
  return process.env.NODE_ENV === 'development';
}

const DEV_TEXT_MAX = 120;

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max = DEV_TEXT_MAX): string {
  const oneLine = stripMarkdown(text);
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

function conceptSummary(step: LearnStep): string {
  return step.conceptTags.slice(0, 3).join(', ');
}

export interface LearnStepDevSummary {
  stepNumber: number;
  title: string;
  description: string;
}

function inferDevTitle(step: LearnStep): string {
  if (step.devTitle?.trim()) return step.devTitle.trim();

  if (step.type === 'text' || step.type === 'review-gate') {
    return step.title?.trim() || 'Text step';
  }
  if (step.type === 'code-demo') {
    return 'Runnable demo';
  }
  if (step.type === 'predict-output') {
    return step.expectsError ? 'Predict: error step' : 'Predict: output step';
  }
  if (step.type === 'code-challenge') {
    return step.goalType === 'error' ? 'Code challenge: cause error' : 'Code challenge';
  }
  if (step.type === 'choice') {
    return 'Multiple choice';
  }
  return 'Learn step';
}

function inferDevDescription(step: LearnStep): string {
  if (step.devDescription?.trim()) return step.devDescription.trim();

  const tags = conceptSummary(step);

  if (step.type === 'text' || step.type === 'review-gate') {
    return truncate(step.content);
  }
  if (step.type === 'code-demo') {
    return tags ? `Runnable demo — ${tags}` : 'Read-only runnable code example.';
  }
  if (step.type === 'predict-output') {
    return step.expectsError
      ? tags
        ? `Predict what error occurs — ${tags}`
        : 'Predict what error occurs when this code runs.'
      : tags
        ? `Predict console output — ${tags}`
        : 'Predict what console.log would print.';
  }
  if (step.type === 'code-challenge') {
    return step.goalType === 'error'
      ? tags
        ? `Write code that throws the expected error — ${tags}`
        : 'Write code that throws the expected error.'
      : tags
        ? `Write code to meet the goal — ${tags}`
        : 'Write code to meet the step goal.';
  }
  if (step.type === 'choice') {
    return tags
      ? `Multiple choice — ${tags}`
      : `${step.choices.length} options — pick the best answer.`;
  }
  return 'See step content in the module.';
}

/** Title + description for the dev step jump menu. */
export function getLearnStepDevSummary(step: LearnStep, index: number): LearnStepDevSummary {
  return {
    stepNumber: index + 1,
    title: inferDevTitle(step),
    description: inferDevDescription(step),
  };
}

/** @deprecated Use getLearnStepDevSummary — single-line label for tests. */
export function getLearnStepDevLabel(step: LearnStep, index: number): string {
  const { stepNumber, title } = getLearnStepDevSummary(step, index);
  return `${stepNumber}. ${truncate(title, 72)}`;
}

/**
 * Resolve ?step= URL param to a 0-based step index.
 * Accepts 1-based numbers ("7") or step ids ("intro-7").
 */
export function resolveLearnStepParam(
  steps: LearnModule['steps'],
  param: string | null | undefined
): number | null {
  if (!param?.trim()) return null;
  const trimmed = param.trim();

  if (/^\d+$/.test(trimmed)) {
    const oneBased = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(oneBased) || oneBased < 1 || oneBased > steps.length) {
      return null;
    }
    return oneBased - 1;
  }

  const index = steps.findIndex((step) => step.id === trimmed);
  return index >= 0 ? index : null;
}

/** Stable deeplink query value — prefer step id over index. */
export function getLearnStepJumpParam(steps: LearnModule['steps'], stepIndex: number): string {
  const step = steps[stepIndex];
  return step?.id ?? String(stepIndex + 1);
}

export function buildLearnModuleStepUrl(moduleId: string, stepParam: string): string {
  return `/learn/${encodeURIComponent(moduleId)}?step=${encodeURIComponent(stepParam)}`;
}

export function buildLearnModuleStepUrlForIndex(
  moduleId: string,
  steps: LearnModule['steps'],
  stepIndex: number
): string {
  return buildLearnModuleStepUrl(moduleId, getLearnStepJumpParam(steps, stepIndex));
}
