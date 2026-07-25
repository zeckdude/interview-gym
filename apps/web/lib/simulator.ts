import { allChallenges } from '@/data';
import type { Challenge, ChallengeDifficulty } from '@/data/types';
import {
  type ContentFilterCategory,
  simulatorCategoryMatches,
} from '@/lib/categories';

export type SimulatorDifficulty = 'easy' | 'intermediate' | 'advanced' | 'mixed';
export type SimulatorCategory = ContentFilterCategory | 'mixed';

export interface SimulatorConfig {
  difficulty: SimulatorDifficulty;
  category: SimulatorCategory;
  count: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function matchesDifficulty(
  challenge: Challenge,
  difficulty: SimulatorDifficulty
): boolean {
  if (difficulty === 'mixed') return true;
  return challenge.difficulty === difficulty;
}

export function selectSimulatorChallenges(
  config: SimulatorConfig,
  previousSessionChallengeIds: string[] = []
): Challenge[] {
  const recentSet = new Set(previousSessionChallengeIds);

  let pool = allChallenges.filter(
    (c) =>
      !c.comingSoon &&
      matchesDifficulty(c, config.difficulty) &&
      simulatorCategoryMatches(c, config.category) &&
      !recentSet.has(c.id)
  );

  if (pool.length < config.count) {
    pool = allChallenges.filter(
      (c) =>
        !c.comingSoon &&
        matchesDifficulty(c, config.difficulty) &&
        simulatorCategoryMatches(c, config.category)
    );
  }

  const shuffled = shuffle(pool);
  let selected = shuffled.slice(0, config.count);

  if (config.difficulty === 'mixed' && config.count >= 2) {
    const hasEasy = selected.some((c) => c.difficulty === 'easy');
    if (!hasEasy) {
      const easyCandidate = shuffled.find(
        (c) => c.difficulty === 'easy' && !selected.some((s) => s.id === c.id)
      );
      if (easyCandidate && selected.length > 0) {
        selected = [easyCandidate, ...selected.slice(1)];
      }
    }
  }

  return selected;
}

export function getCategoryLabel(category: SimulatorCategory | Challenge['category']): string {
  switch (category) {
    case 'be':
      return 'Backend';
    case 'frontend':
      return 'Frontend';
    case 'react':
    case 'fe':
    case 'fe-advanced':
      return 'React';
    case 'nextjs':
      return 'Next.js';
    case 'mixed':
      return 'Mixed';
    case 'all':
      return 'All';
    default:
      return String(category);
  }
}

export function calculateSessionScore(
  challenges: Array<{ passed: boolean | null; timeSpentMs: number | null }>
): number {
  const total = challenges.length;
  if (total === 0) return 0;

  const passed = challenges.filter((c) => c.passed).length;
  const baseScore = (passed / total) * 100;

  const avgTimeBonus = challenges
    .filter((c) => c.passed && c.timeSpentMs)
    .reduce((acc, c) => {
      const minutes = (c.timeSpentMs ?? 0) / 60000;
      return acc + (minutes < 5 ? 2 : minutes < 10 ? 1 : 0);
    }, 0);

  return Math.min(100, Math.round(baseScore + avgTimeBonus));
}

export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getScoreMessage(score: number): { text: string; colorClass: string } {
  if (score >= 80) {
    return { text: 'Strong performance! 💪', colorClass: 'text-success' };
  }
  if (score >= 60) {
    return { text: 'Solid effort — a few areas to sharpen.', colorClass: 'text-warning' };
  }
  return { text: "Tough session. Every rep counts. Let's review.", colorClass: 'text-error' };
}

export function scoreSimulatorSession(
  results: { passed: boolean; timeSpentMs: number | null }[]
): {
  score: number;
  passedCount: number;
  totalCount: number;
  avgTimeMs: number | null;
} {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const times = results.filter((r) => r.timeSpentMs !== null).map((r) => r.timeSpentMs!);
  const avgTimeMs = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  return { score, passedCount, totalCount, avgTimeMs };
}

export function getDifficultyLabel(difficulty: ChallengeDifficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
  }
}
