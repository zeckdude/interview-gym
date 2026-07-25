import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StudyPlanBadge } from '@/components/study-plan/StudyPlanBadge';
import { buildChallengePath } from '@/lib/content-filter-url';
import type { Challenge } from '@/data/types';

interface ChallengeCardProps {
  challenge: Challenge;
  attemptCount: number;
  hasPassed: boolean;
  isWeakSpot?: boolean;
  filterQuery?: string;
  showMostAsked?: boolean;
  mostAskedIsPersonal?: boolean;
  mostAskedReason?: string;
}

export function ChallengeCard({
  challenge,
  attemptCount,
  hasPassed,
  isWeakSpot = false,
  filterQuery = '',
  showMostAsked = challenge.mostAsked,
  mostAskedIsPersonal = false,
  mostAskedReason,
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
      className={`relative h-full transition-all duration-150 ${
        challenge.comingSoon
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-raised hover:border-brand/30 cursor-pointer'
      }`}
    >
      {showMostAsked && (
        <span
          className="absolute top-3 right-3 bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
          title={
            mostAskedIsPersonal
              ? 'Marked as Most Asked by you'
              : mostAskedReason ?? 'Commonly asked in senior interviews'
          }
        >
          🔥 Most Asked
          {mostAskedIsPersonal && <span className="opacity-70">· You</span>}
        </span>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap pr-24">
          <Badge type="category" value={challenge.category} />
          <Badge type="difficulty" value={challenge.difficulty} />
          <StudyPlanBadge variant="challenge" itemId={challenge.id} />
        </div>
        <div className="flex items-center gap-1">
          {isWeakSpot && <span className="text-lg" title="Weak spot">🚨</span>}
          {challenge.comingSoon && <span className="text-lg">🔒</span>}
        </div>
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

  return <Link href={buildChallengePath(challenge.id, filterQuery)}>{content}</Link>;
}
