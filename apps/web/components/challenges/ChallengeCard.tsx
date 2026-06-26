import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Challenge } from '@/data/types';

interface ChallengeCardProps {
  challenge: Challenge;
  attemptCount: number;
  hasPassed: boolean;
}

export function ChallengeCard({
  challenge,
  attemptCount,
  hasPassed,
}: ChallengeCardProps) {
  const statusLabel = challenge.comingSoon
    ? 'Coming Soon'
    : hasPassed
      ? '✓ Passed'
      : attemptCount > 0
        ? `${attemptCount} Attempt${attemptCount === 1 ? '' : 's'}`
        : 'Not Attempted';

  const content = (
    <Card
      className={`h-full transition-all duration-150 ${
        challenge.comingSoon
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-raised hover:border-brand/30 cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge type="category" value={challenge.category} />
          <Badge type="difficulty" value={challenge.difficulty} />
        </div>
        {challenge.comingSoon && <span className="text-lg">🔒</span>}
      </div>

      <h3 className="font-display font-bold text-lg text-text-primary dark:text-[#F0EDE8] mb-2">
        {challenge.title}
      </h3>

      <p className="font-body text-sm text-text-muted dark:text-[#8A8580]">{statusLabel}</p>
    </Card>
  );

  if (challenge.comingSoon) {
    return content;
  }

  return <Link href={`/challenges/${challenge.id}`}>{content}</Link>;
}
