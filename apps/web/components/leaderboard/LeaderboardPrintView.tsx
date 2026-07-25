'use client';

import { useEffect } from 'react';
import type { LeaderboardData } from '@/lib/leaderboard';
import {
  CategoryBreakdownTable,
  OverallStatsCard,
} from '@/components/leaderboard/LeaderboardClient';
import { formatDuration, formatTimeCompact } from '@/lib/utils';

interface LeaderboardPrintViewProps {
  data: LeaderboardData;
}

export function LeaderboardPrintView({ data }: LeaderboardPrintViewProps) {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  const attempted = data.challengeBests.filter((c) => c.attempts > 0);

  return (
    <div className="print-page bg-white text-black p-8 max-w-4xl mx-auto space-y-8">
      <header className="border-b-2 border-black pb-4 space-y-1">
        <h1 className="text-3xl font-bold">🏋️ Interview Gym — Personal Bests</h1>
        <p className="text-base">Progress report generated {new Date().toLocaleDateString()}</p>
      </header>

      <OverallStatsCard data={data.overall} />
      <CategoryBreakdownTable rows={data.categoryBreakdown} />

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Challenges Attempted</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-2 pr-3">Challenge</th>
              <th className="text-left py-2 pr-3">Status</th>
              <th className="text-left py-2 pr-3">Attempts</th>
              <th className="text-left py-2 pr-3">Best Time</th>
            </tr>
          </thead>
          <tbody>
            {attempted.map((row) => (
              <tr key={row.challengeId} className="border-b border-gray-200">
                <td className="py-2 pr-3">
                  {row.isWeakSpot && '🚨 '}
                  {row.title}
                </td>
                <td className="py-2 pr-3">
                  {row.passed ? (row.cleanPass ? 'Passed ⭐' : 'Passed') : 'Failed'}
                </td>
                <td className="py-2 pr-3">{row.attempts}</td>
                <td className="py-2 pr-3">{formatTimeCompact(row.bestTimeMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="text-sm text-gray-600 pt-4 border-t border-gray-300">
        Total time spent: {formatDuration(data.overall.totalTimeSpentMs)} · Pass rate:{' '}
        {data.overall.passRate}%
      </footer>
    </div>
  );
}
