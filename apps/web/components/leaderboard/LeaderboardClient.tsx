'use client';

import { useMemo, useState } from 'react';
import type { ChallengeBestRow, CategoryBreakdownRow, LeaderboardData } from '@/lib/leaderboard';
import { formatDuration, formatTimeCompact } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { WeaknessAnalysisPanel } from './WeaknessAnalysisPanel';
import { ShareSection } from './ShareSection';

type SortKey = 'title' | 'difficulty' | 'bestTime' | 'attempts' | 'status';

const DIFFICULTY_ORDER = { easy: 0, intermediate: 1, advanced: 2 };

interface LeaderboardClientProps {
  data: LeaderboardData;
}

function OverallStatsCard({ data }: { data: LeaderboardData['overall'] }) {
  const stats = [
    {
      label: 'Challenges Passed',
      value: `${data.totalPassed}/${data.totalChallenges}`,
    },
    { label: 'Clean Passes ⭐', value: String(data.cleanPasses) },
    { label: 'Overall Pass Rate', value: `${data.passRate}%` },
    { label: 'Best Streak Ever', value: `${data.longestStreak} days` },
    { label: 'Total Time Spent', value: formatDuration(data.totalTimeSpentMs) },
    {
      label: 'Simulator Sessions',
      value: String(data.simulatorSessionsCompleted),
    },
    {
      label: 'Best Simulator Score',
      value: data.bestSimulatorScore != null ? `${Math.round(data.bestSimulatorScore)}%` : '—',
    },
  ];

  return (
    <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 space-y-4">
      <h2 className="font-display font-bold text-xl text-text-primary">Overall Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-subtle border border-border-subtle rounded-lg p-4 space-y-1"
          >
            <p className="font-body text-sm text-text-muted">{stat.label}</p>
            <p className="font-display font-bold text-2xl text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryBreakdownTable({ rows }: { rows: CategoryBreakdownRow[] }) {
  return (
    <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 space-y-4 overflow-x-auto">
      <h2 className="font-display font-bold text-xl text-text-primary">Category Breakdown</h2>
      <table className="w-full text-left font-body text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-text-muted">
            <th className="pb-3 pr-4 font-semibold">Category</th>
            <th className="pb-3 pr-4 font-semibold">Passed</th>
            <th className="pb-3 pr-4 font-semibold">Total</th>
            <th className="pb-3 pr-4 font-semibold">Pass Rate</th>
            <th className="pb-3 pr-4 font-semibold">Avg Time (passing)</th>
            <th className="pb-3 font-semibold">Best Time</th>
          </tr>
        </thead>
        <tbody className="text-text-primary">
          {rows.map((row) => (
            <tr key={row.type} className="border-b border-border-subtle last:border-0">
              <td className="py-3 pr-4 font-semibold">{row.label}</td>
              <td className="py-3 pr-4">{row.passed}</td>
              <td className="py-3 pr-4">{row.total}</td>
              <td className="py-3 pr-4">{row.passRate}%</td>
              <td className="py-3 pr-4">
                {row.avgTimeMs != null ? formatDuration(row.avgTimeMs) : '—'}
              </td>
              <td className="py-3">
                {row.bestTimeMs != null ? formatDuration(row.bestTimeMs) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PersonalBestsTable({ rows }: { rows: ChallengeBestRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          cmp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
          break;
        case 'bestTime':
          cmp = (a.bestTimeMs ?? Infinity) - (b.bestTimeMs ?? Infinity);
          break;
        case 'attempts':
          cmp = a.attempts - b.attempts;
          break;
        case 'status':
          cmp = Number(b.passed) - Number(a.passed);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sortLabel = (key: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => handleSort(key)}
      className="font-semibold text-text-muted hover:text-text-primary transition-colors"
    >
      {label}
      {sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''}
    </button>
  );

  return (
    <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 space-y-4 overflow-x-auto">
      <h2 className="font-display font-bold text-xl text-text-primary">
        Per-Challenge Personal Bests
      </h2>
      <table className="w-full text-left font-body text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="pb-3 pr-4">{sortLabel('title', 'Challenge')}</th>
            <th className="pb-3 pr-4">{sortLabel('difficulty', 'Difficulty')}</th>
            <th className="pb-3 pr-4">{sortLabel('status', 'Status')}</th>
            <th className="pb-3 pr-4">{sortLabel('attempts', 'Attempts')}</th>
            <th className="pb-3 pr-4">{sortLabel('bestTime', 'Best Time')}</th>
            <th className="pb-3">First Passed</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.challengeId}
              className={`border-b border-border-subtle last:border-0 ${
                row.isWeakSpot ? 'bg-warning-light' : ''
              }`}
            >
              <td className="py-3 pr-4 text-text-primary font-semibold">
                {row.isWeakSpot && <span className="mr-1">🚨</span>}
                {row.title}
              </td>
              <td className="py-3 pr-4 text-text-primary capitalize">{row.difficulty}</td>
              <td className="py-3 pr-4 text-text-primary">
                {row.passed ? (
                  <>
                    ✓ Passed{row.cleanPass ? ' ⭐' : ''}
                  </>
                ) : (
                  '✗ Failed'
                )}
              </td>
              <td className="py-3 pr-4 text-text-primary">{row.attempts}</td>
              <td className="py-3 pr-4 text-text-primary">
                {formatTimeCompact(row.bestTimeMs)}
              </td>
              <td className="py-3 text-text-primary">
                {row.firstPassedAt
                  ? new Date(row.firstPassedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function LeaderboardClient({ data }: LeaderboardClientProps) {
  function handleExport() {
    window.open('/leaderboard/print', '_blank');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-text-primary">
            Your Personal Bests 🏆
          </h1>
          <p className="font-body text-base text-text-primary">
            Compete against your best self.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={handleExport} className="whitespace-nowrap">
            Export as PDF
          </Button>
          <p className="font-body text-xs text-text-muted max-w-xs">
            Click &apos;Export as PDF&apos;, then use your browser&apos;s Print dialog → Save as
            PDF.
          </p>
        </div>
      </div>

      <OverallStatsCard data={data.overall} />
      <CategoryBreakdownTable rows={data.categoryBreakdown} />
      <PersonalBestsTable rows={data.challengeBests} />
      <WeaknessAnalysisPanel />
      <ShareSection />
    </div>
  );
}

export { OverallStatsCard, CategoryBreakdownTable, PersonalBestsTable };
