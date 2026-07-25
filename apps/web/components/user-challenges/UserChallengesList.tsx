'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { UserChallengeCard, type UserChallengeListItem } from '@/components/user-challenges/UserChallengeCard';
import { Button } from '@/components/ui/Button';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function UserChallengesList() {
  const { data, error, isLoading } = useSWR<{ challenges: UserChallengeListItem[] }>(
    '/api/user-challenges',
    fetcher
  );

  const challenges = data?.challenges ?? [];

  return (
    <PageWrapper title="My Challenges">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              My Generated Challenges
            </h1>
            <p className="font-body text-base text-text-secondary">
              Practice challenges you created from real interview experiences.
            </p>
          </div>
          <Link href="/generate">
            <Button>✨ Generate New Challenge</Button>
          </Link>
        </div>

        {isLoading && (
          <p className="font-body text-base text-text-muted animate-pulse">Loading your challenges…</p>
        )}

        {error && (
          <div className="bg-error-light border border-error/30 rounded-lg px-4 py-3">
            <p className="font-body text-sm text-error">Failed to load challenges.</p>
          </div>
        )}

        {!isLoading && !error && challenges.length === 0 && (
          <div className="text-center py-16 bg-bg-surface rounded-xl border border-border-subtle">
            <p className="text-4xl mb-4">✨</p>
            <h2 className="font-display font-bold text-xl text-text-primary mb-2">
              No challenges yet
            </h2>
            <p className="font-body text-base text-text-secondary mb-6 max-w-md mx-auto">
              Describe a real interview challenge and I&apos;ll build a full practice module for you.
            </p>
            <Link href="/generate">
              <Button>Generate Your First Challenge</Button>
            </Link>
          </div>
        )}

        {challenges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <UserChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
