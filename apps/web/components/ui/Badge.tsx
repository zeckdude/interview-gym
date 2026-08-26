import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';
import { cn } from '@/lib/utils';
import {
  getDisplayCategory,
  getDisplayCategoryLabel,
  getSubcategoryLabel,
  getTopLevelLabel,
  type DisplayCategory,
} from '@/lib/categories';

interface BadgeProps {
  type: 'difficulty' | 'category';
  value: ChallengeDifficulty | ChallengeCategory | 'be-question' | 'fe-question' | 'nextjs-question';
  className?: string;
}

const difficultyStyles: Record<ChallengeDifficulty, { bg: string; text: string; label: string }> = {
  easy: { bg: 'bg-easy-light', text: 'text-easy', label: 'Easy' },
  intermediate: { bg: 'bg-medium-light', text: 'text-medium', label: 'Intermediate' },
  advanced: { bg: 'bg-hard-light', text: 'text-hard', label: 'Advanced' },
};

const LEGACY_DIFFICULTY_MAP: Record<string, ChallengeDifficulty> = {
  medium: 'intermediate',
  hard: 'advanced',
};

const displayCategoryStyles: Record<DisplayCategory, { bg: string; text: string }> = {
  be: { bg: 'bg-cat-be-light', text: 'text-cat-be' },
  fe: { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  stack: { bg: 'bg-bg-subtle', text: 'text-text-secondary' },
  javascript: { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  'web-apis': { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  nodejs: { bg: 'bg-cat-be-light', text: 'text-cat-be' },
  react: { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  nextjs: { bg: 'bg-cat-nextjs-light', text: 'text-cat-nextjs' },
  css: { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  ai: { bg: 'bg-cat-fe-light', text: 'text-cat-fe' },
  typescript: { bg: 'bg-bg-subtle', text: 'text-text-secondary' },
  vitest: { bg: 'bg-bg-subtle', text: 'text-text-secondary' },
};

function getDisplayCategoryLabelFromKey(display: DisplayCategory): string {
  if (display === 'be' || display === 'fe' || display === 'stack') {
    return getTopLevelLabel(display);
  }
  return getSubcategoryLabel(display);
}

const questionCategoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  'be-question': { bg: 'bg-cat-be-light', text: 'text-cat-be', label: 'Node.js' },
  'fe-question': { bg: 'bg-cat-fe-light', text: 'text-cat-fe', label: 'JavaScript' },
  'nextjs-question': { bg: 'bg-cat-nextjs-light', text: 'text-cat-nextjs', label: 'Next.js' },
};

function normalizeDifficulty(value: string): ChallengeDifficulty {
  if (value in difficultyStyles) return value as ChallengeDifficulty;
  return LEGACY_DIFFICULTY_MAP[value] ?? 'intermediate';
}

function getDifficultyStyles(value: string) {
  return difficultyStyles[normalizeDifficulty(value)];
}

function getCategoryStyles(value: string) {
  if (value in questionCategoryStyles) {
    return questionCategoryStyles[value];
  }
  if (
    value === 'be' ||
    value === 'fe' ||
    value === 'fe-advanced' ||
    value === 'nextjs' ||
    value === 'fe-css' ||
    value === 'fe-ai' ||
    value === 'fe-web-apis' ||
    value === 'be-nodejs' ||
    value === 'stack-javascript' ||
    value === 'stack-typescript' ||
    value === 'stack-vitest'
  ) {
    const display = getDisplayCategory(value as ChallengeCategory);
    const colors = displayCategoryStyles[display];
    return {
      ...colors,
      label: getDisplayCategoryLabel(value as ChallengeCategory),
    };
  }
  return { bg: 'bg-bg-subtle', text: 'text-text-secondary', label: value };
}

export function Badge({ type, value, className }: BadgeProps) {
  const styles =
    type === 'difficulty'
      ? getDifficultyStyles(value)
      : getCategoryStyles(value);

  return (
    <span
      className={cn(
        'text-xs font-body font-semibold px-2.5 py-1 rounded-sm inline-block',
        styles.bg,
        styles.text,
        className
      )}
    >
      {type === 'difficulty' ? getDifficultyStyles(value).label : styles.label}
    </span>
  );
}
