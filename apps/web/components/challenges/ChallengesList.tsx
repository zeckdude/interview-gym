'use client';

import { useMemo, useState } from 'react';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { CollapsibleContentFilters } from '@/components/content/CollapsibleContentFilters';
import { ContentListToolbar } from '@/components/content/ContentListToolbar';
import { ContentProgressSummary } from '@/components/content/ContentProgressSummary';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { allChallenges } from '@/data';
import { useContentFilters } from '@/hooks/useContentFilters';
import { useContentFilterQuery } from '@/hooks/useContentFilterQuery';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { challengeMatchesContentFilters } from '@/lib/categories';
import { getCuratedMostAskedForChallenge } from '@/lib/most-asked';
import type { Challenge } from '@/data/types';

type SortOption = 'difficulty-asc' | 'difficulty-desc' | 'most-attempted' | 'least-attempted' | 'az';

const DIFFICULTY_ORDER: Record<Challenge['difficulty'], number> = {
  easy: 0,
  intermediate: 1,
  advanced: 2,
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'difficulty-asc', label: 'Difficulty (easy first)' },
  { value: 'difficulty-desc', label: 'Difficulty (advanced first)' },
  { value: 'most-attempted', label: 'Most Attempted' },
  { value: 'least-attempted', label: 'Least Attempted' },
  { value: 'az', label: 'A–Z' },
];

interface ChallengesListProps {
  attemptStats: Record<string, { count: number; passed: boolean }>;
  weakSpots?: Record<string, number>;
}

export function ChallengesList({ attemptStats, weakSpots = {} }: ChallengesListProps) {
  const { filters, setFilters, toggleSpecial, toggleSubcategory, clearFilters } =
    useContentFilters('/challenges');
  const filterQuery = useContentFilterQuery();
  const mostAsked = useMostAskedOptional();

  const getEffectiveMostAsked = (challenge: Challenge) => {
    const curated = getCuratedMostAskedForChallenge(challenge);
    return mostAsked?.getEffective('challenge', challenge.id, curated) ?? {
      ...curated,
      isPersonalOverride: false,
    };
  };
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('difficulty-asc');

  const activeChallenges = useMemo(
    () => allChallenges.filter((challenge) => !challenge.comingSoon),
    []
  );

  const passedCount = useMemo(
    () => activeChallenges.filter((challenge) => attemptStats[challenge.id]?.passed).length,
    [activeChallenges, attemptStats]
  );

  const filtered = useMemo(() => {
    let challenges = allChallenges;

    if (filters.topLevel !== 'all' || filters.subcategories.length > 0) {
      challenges = challenges.filter((challenge) =>
        challengeMatchesContentFilters(challenge, filters.topLevel, filters.subcategories)
      );
    }

    if (filters.difficulty !== 'all') {
      challenges = challenges.filter((challenge) => challenge.difficulty === filters.difficulty);
    }

    if (filters.special.includes('most-asked')) {
      challenges = challenges.filter((challenge) => getEffectiveMostAsked(challenge).mostAsked);
    }

    if (filters.special.includes('not-passed')) {
      challenges = challenges.filter((challenge) => !attemptStats[challenge.id]?.passed);
    }

    if (filters.special.includes('weak-spots')) {
      challenges = challenges.filter((challenge) => (weakSpots[challenge.id] ?? 0) > 0);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      challenges = challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(query) ||
          challenge.concepts.some((concept) => concept.toLowerCase().includes(query))
      );
    }

    const sorted = [...challenges];
    switch (sort) {
      case 'difficulty-asc':
        sorted.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
        break;
      case 'difficulty-desc':
        sorted.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
        break;
      case 'most-attempted':
        sorted.sort(
          (a, b) => (attemptStats[b.id]?.count ?? 0) - (attemptStats[a.id]?.count ?? 0)
        );
        break;
      case 'least-attempted':
        sorted.sort(
          (a, b) => (attemptStats[a.id]?.count ?? 0) - (attemptStats[b.id]?.count ?? 0)
        );
        break;
      case 'az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sorted;
  }, [filters, search, sort, attemptStats, weakSpots, mostAsked]);

  return (
    <PageWrapper title="Challenges">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
              Challenges
            </h1>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0] max-w-xl">
              {activeChallenges.length} challenges ready — pick your workout and get after it.
            </p>
          </div>
          <ContentProgressSummary
            completed={passedCount}
            total={activeChallenges.length}
            label="challenges passed"
          />
        </div>

        <CollapsibleContentFilters
          filters={filters}
          setFilters={setFilters}
          toggleSpecial={toggleSpecial}
          toggleSubcategory={toggleSubcategory}
          clearFilters={clearFilters}
          specialFilters={['most-asked', 'not-passed', 'weak-spots']}
        />

        <ContentListToolbar
          showing={filtered.length}
          total={allChallenges.length}
          itemLabel="challenges"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title or concept..."
          sort={sort}
          onSortChange={(value) => setSort(value as SortOption)}
          sortOptions={SORT_OPTIONS}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge) => {
            const effectiveMostAsked = getEffectiveMostAsked(challenge);
            return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              attemptCount={attemptStats[challenge.id]?.count ?? 0}
              hasPassed={attemptStats[challenge.id]?.passed ?? false}
              isWeakSpot={(weakSpots[challenge.id] ?? 0) > 0}
              filterQuery={filterQuery}
              showMostAsked={effectiveMostAsked.mostAsked}
              mostAskedIsPersonal={effectiveMostAsked.isPersonalOverride}
              mostAskedReason={effectiveMostAsked.reason}
            />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              No challenges found
            </p>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0]">
              Try a different filter or search term.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
