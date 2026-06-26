import { beChallenges } from './be-challenges';
import { beQuestions } from './be-questions';
import { feAdvancedChallenges } from './fe-advanced';
import { feChallenges } from './fe-challenges';
import { feQuestions } from './fe-questions';
import type { Challenge, FilterCategory } from './types';

export * from './types';

export const allChallenges: Challenge[] = [
  ...beChallenges,
  ...feChallenges,
  ...feAdvancedChallenges,
];

export const CATEGORY_TOTALS = {
  be: beChallenges.length,
  fe: feChallenges.length,
  'fe-advanced': feAdvancedChallenges.length,
  'be-question': beQuestions.length,
  'fe-question': feQuestions.length,
} as const;

export function getChallengeById(id: string): Challenge | undefined {
  return allChallenges.find((c) => c.id === id);
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
  switch (category) {
    case 'be':
      return 'Backend';
    case 'fe':
      return 'FE Essential';
    case 'fe-advanced':
      return 'FE Advanced';
  }
}

export { beChallenges, beQuestions, feAdvancedChallenges, feChallenges, feQuestions };
