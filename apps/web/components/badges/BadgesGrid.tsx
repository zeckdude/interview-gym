'use client';

import { BADGE_DEFINITIONS } from '@/data/badges';
import useSWR from 'swr';

interface BadgeData {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedAt: string | null;
}

interface BadgesResponse {
  badges: BadgeData[];
  total: number;
  earnedCount: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatEarnedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BadgesGrid() {
  const { data, isLoading } = useSWR<BadgesResponse>('/api/badges', fetcher);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {BADGE_DEFINITIONS.map((b) => (
          <div
            key={b.slug}
            className="bg-bg-surface rounded-xl border border-border-subtle p-5 animate-pulse h-36"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-subtle rounded-lg p-4 border border-border-subtle">
        <p className="font-display font-bold text-xl text-text-primary">
          {data.earnedCount} / {data.total} earned
        </p>
        <p className="font-body text-sm text-text-primary mt-1">
          Keep practicing to unlock them all!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.badges.map((badge) => (
          <div
            key={badge.slug}
            className={`rounded-xl border p-5 text-center transition-all ${
              badge.earned
                ? 'bg-bg-surface border-brand/30 shadow-card'
                : 'bg-bg-subtle/50 border-border-subtle opacity-60'
            }`}
          >
            <span className={`text-4xl block mb-2 ${badge.earned ? '' : 'grayscale'}`}>
              {badge.earned ? badge.emoji : '🔒'}
            </span>
            <p className="font-display font-bold text-text-primary text-sm">{badge.name}</p>
            <p className="font-body text-xs text-text-primary mt-1">{badge.description}</p>
            {badge.earned && badge.earnedAt && (
              <p className="font-body text-xs text-text-muted mt-2">
                Earned {formatEarnedDate(badge.earnedAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
