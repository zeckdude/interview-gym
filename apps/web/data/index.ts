import { beChallenges } from './be-challenges';
import { beQuestions } from './be-questions';
import { feAdvancedChallenges } from './fe-advanced';
import { feChallenges } from './fe-challenges';
import { feQuestions } from './fe-questions';
import { javascriptChallenges } from './javascript-challenges';
import { nextjsChallenges } from './nextjs-challenges';
import { aiChallenges } from './ai-challenges';
import { vitestChallenges } from './vitest-challenges';
import { cssChallenges } from './css-challenges';
import { typescriptChallenges } from './typescript-challenges';
import { nextjsQuestions } from './nextjs-questions';
import type { Challenge, FilterCategory } from './types';
import { getDisplayCategoryLabel } from '@/lib/categories';

export * from './types';

export const allChallenges: Challenge[] = [
  ...beChallenges,
  ...feChallenges,
  ...javascriptChallenges,
  ...feAdvancedChallenges,
  ...nextjsChallenges,
  ...aiChallenges,
  ...vitestChallenges,
  ...cssChallenges,
  ...typescriptChallenges,
];

export const allQuestions = [...beQuestions, ...feQuestions, ...nextjsQuestions];

export const CATEGORY_TOTALS = {
  'be-nodejs': beChallenges.length,
  'fe-web-apis': feChallenges.length,
  'stack-javascript': javascriptChallenges.length,
  'fe-advanced': feAdvancedChallenges.length,
  nextjs: nextjsChallenges.length,
  'fe-ai': aiChallenges.length,
  'stack-vitest': vitestChallenges.length,
  'fe-css': cssChallenges.length,
  'stack-typescript': typescriptChallenges.length,
  'be-question': beQuestions.length,
  'fe-question': feQuestions.length,
  'nextjs-question': nextjsQuestions.length,
} as const;

export function getChallengeById(id: string): Challenge | undefined {
  return allChallenges.find((c) => c.id === id);
}

/** Returns the previous or next non-stub challenge, or null if none. */
export function getAdjacentChallenge(
  id: string,
  direction: 'prev' | 'next'
): Challenge | null {
  const live = allChallenges.filter((c) => !c.comingSoon);
  const idx = live.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  return direction === 'prev' ? (live[idx - 1] ?? null) : (live[idx + 1] ?? null);
}

export function filterChallenges(
  category: FilterCategory,
  search: string
): Challenge[] {
  let filtered = allChallenges;

  if (category !== 'all') {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter((c) => c.title.toLowerCase().includes(query));
  }

  return filtered;
}

export function getCategoryLabel(category: Challenge['category']): string {
  return getDisplayCategoryLabel(category);
}

export {
  beChallenges,
  beQuestions,
  feAdvancedChallenges,
  feChallenges,
  feQuestions,
  nextjsChallenges,
  aiChallenges,
  vitestChallenges,
  cssChallenges,
  typescriptChallenges,
  nextjsQuestions,
};
