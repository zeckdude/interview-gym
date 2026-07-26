'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { systemDesignChallenges } from '@/data/system-design';
import type { SystemDesignChallenge } from '@/data/types';
import { cn } from '@/lib/utils';

type DifficultyFilter = 'all' | 'intermediate' | 'advanced';
type SpecialFilter = 'most-asked';

export function SystemDesignList() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [special, setSpecial] = useState<SpecialFilter | null>(null);

  const filtered = useMemo(() => {
    let list: SystemDesignChallenge[] = systemDesignChallenges;

    if (difficulty !== 'all') {
      list = list.filter((c) => c.difficulty === difficulty);
    }

    if (special === 'most-asked') {
      list = list.filter((c) => c.mostAsked);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.scenario.toLowerCase().includes(q)
      );
    }

    return list;
  }, [search, difficulty, special]);

  return (
    <PageWrapper title="Systems Design" fullWidth>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display font-bold text-3xl text-text-primary">
              Systems Design
            </h1>
            <p className="font-body text-base text-text-primary max-w-2xl">
              Structured architecture challenges with spoken answers and AI follow-up — just like
              a real interview.
            </p>
          </div>
          <Link
            href="/systems-design/history"
            className="font-body text-sm text-brand hover:text-brand-dark font-semibold whitespace-nowrap"
          >
            View session history →
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges…"
            className="flex-1 min-w-[200px] bg-bg-surface border border-border-subtle rounded-md px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <div className="flex gap-2 flex-wrap">
            {(['all', 'intermediate', 'advanced'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(
                  'px-3 py-2 rounded-md font-body text-sm font-semibold transition-all',
                  difficulty === d
                    ? 'bg-brand text-white'
                    : 'bg-bg-surface border border-border-subtle text-text-primary hover:border-brand/40'
                )}
              >
                {d === 'all' ? 'All levels' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSpecial(special === 'most-asked' ? null : 'most-asked')}
              className={cn(
                'px-3 py-2 rounded-md font-body text-sm font-semibold transition-all',
                special === 'most-asked'
                  ? 'bg-error text-white'
                  : 'bg-bg-surface border border-border-subtle text-text-primary hover:border-brand/40'
              )}
            >
              🔥 Most Asked
            </button>
          </div>
        </div>

        <p className="font-body text-sm text-text-muted">
          {filtered.length} challenge{filtered.length === 1 ? '' : 's'}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge) => (
            <Link key={challenge.id} href={`/systems-design/${challenge.id}`}>
              <Card className="h-full hover:shadow-raised hover:border-brand/30 transition-all cursor-pointer relative">
                {challenge.mostAsked && (
                  <span
                    className="absolute top-3 right-3 bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full"
                    title={challenge.mostAskedReason}
                  >
                    🔥 Most Asked
                  </span>
                )}
                <div className="space-y-3 pr-16">
                  <div className="flex gap-2 flex-wrap">
                    <Badge type="difficulty" value={challenge.difficulty} />
                  </div>
                  <h2 className="font-display font-semibold text-lg text-text-primary">
                    {challenge.title}
                  </h2>
                  <p className="font-body text-sm text-text-primary line-clamp-3">
                    {challenge.scenario.split('\n')[0]}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    ⏱️ ~{challenge.estimatedMinutes} min · {challenge.sections.length} sections
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
