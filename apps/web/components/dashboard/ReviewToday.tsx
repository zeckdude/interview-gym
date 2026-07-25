'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ChallengeDifficulty } from '@/data/types';

export interface ReviewItem {
  challengeId: string;
  challengeTitle: string;
  category: string;
  difficulty: string;
  overdueDays: number;
  href: string;
  hasNote?: boolean;
}

interface ReviewTodayProps {
  items: ReviewItem[];
}

const MAX_VISIBLE = 5;

export function ReviewToday({ items }: ReviewTodayProps) {
  const visible = items.slice(0, MAX_VISIBLE);
  const hasMore = items.length > MAX_VISIBLE;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-text-primary">Review Today</h2>
        {hasMore && (
          <Link
            href="/challenges"
            className="font-body text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            See All ({items.length}) →
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-4xl mb-4">💪</p>
          <p className="font-body text-base text-text-primary max-w-md mx-auto">
            You&apos;re all caught up! Come back tomorrow. 💪
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <Card
              key={item.challengeId}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <p className="font-body font-semibold text-text-primary truncate">
                  {item.challengeTitle}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body text-xs font-semibold px-2 py-0.5 rounded bg-bg-subtle text-text-primary">
                    {item.category}
                  </span>
                  <Badge
                    type="difficulty"
                    value={item.difficulty as ChallengeDifficulty}
                  />
                  {item.overdueDays > 0 && (
                    <span className="font-body text-xs font-semibold text-brand">
                      {item.overdueDays} day{item.overdueDays !== 1 ? 's' : ''} overdue
                    </span>
                  )}
                  {item.hasNote && (
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <span>📝</span> You have a note for this
                    </span>
                  )}
                </div>
              </div>
              <Link href={`${item.href}${item.href.includes('?') ? '&' : '?'}review=1`}>
                <Button variant="primary" className="px-4 py-2 text-sm">
                  Review
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
