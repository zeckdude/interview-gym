import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';
import { cn } from '@/lib/utils';

interface BadgeProps {
  type: 'difficulty' | 'category';
  value: ChallengeDifficulty | ChallengeCategory | 'be-question' | 'fe-question';
  className?: string;
}

const difficultyStyles: Record<ChallengeDifficulty, { bg: string; text: string; label: string }> = {
  easy: { bg: 'bg-easy-light', text: 'text-easy', label: 'Easy' },
  medium: { bg: 'bg-medium-light', text: 'text-medium', label: 'Medium' },
  hard: { bg: 'bg-hard-light', text: 'text-hard', label: 'Hard' },
};

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  be: { bg: 'bg-cat-be-light', text: 'text-cat-be', label: 'Backend' },
  fe: { bg: 'bg-cat-fe-light', text: 'text-cat-fe', label: 'FE Essential' },
  'fe-advanced': { bg: 'bg-cat-advanced-light', text: 'text-cat-advanced', label: 'FE Advanced' },
  'be-question': { bg: 'bg-cat-be-light', text: 'text-cat-be', label: 'BE Questions' },
  'fe-question': { bg: 'bg-cat-fe-light', text: 'text-cat-fe', label: 'FE Questions' },
};

export function Badge({ type, value, className }: BadgeProps) {
  const styles =
    type === 'difficulty'
      ? difficultyStyles[value as ChallengeDifficulty]
      : categoryStyles[value];

  return (
    <span
      className={cn(
        'text-xs font-body font-semibold px-2.5 py-1 rounded-sm inline-block',
        styles.bg,
        styles.text,
        className
      )}
    >
      {styles.label}
    </span>
  );
}
