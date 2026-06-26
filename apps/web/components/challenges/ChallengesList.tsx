'use client';

import { useMemo, useState } from 'react';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { FilterTabs } from '@/components/challenges/FilterTabs';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { allChallenges } from '@/data';
import type { FilterCategory } from '@/data/types';

interface ChallengesListProps {
  attemptStats: Record<string, { count: number; passed: boolean }>;
}

export function ChallengesList({ attemptStats }: ChallengesListProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let challenges = allChallenges;

    if (filter !== 'all') {
      challenges = challenges.filter((c) => c.category === filter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      challenges = challenges.filter((c) =>
        c.title.toLowerCase().includes(query)
      );
    }

    return challenges;
  }, [filter, search]);

  const activeCount = allChallenges.filter((c) => !c.comingSoon).length;
  const lockedCount = allChallenges.filter((c) => c.comingSoon).length;

  return (
    <PageWrapper title="Challenges">
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
            Challenges
          </h1>
          <p className="font-body text-text-secondary dark:text-[#AAA5A0]">
            {activeCount} ready to tackle · {lockedCount} coming in Phase 2
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <FilterTabs active={filter} onChange={setFilter} />
          <input
            type="search"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-bg-surface dark:bg-[#1A1A1A] border border-border-subtle dark:border-[#2A2A2A] rounded-md px-4 py-2.5 text-text-primary dark:text-[#F0EDE8] font-body text-sm placeholder:text-text-muted dark:placeholder:text-[#8A8580] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((challenge) => {
            const stats = attemptStats[challenge.id];
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                attemptCount={stats?.count ?? 0}
                hasPassed={stats?.passed ?? false}
              />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="font-body text-text-secondary dark:text-[#AAA5A0] text-center py-12">
            No challenges match your search. Try a different term!
          </p>
        )}
      </div>
    </PageWrapper>
  );
}
