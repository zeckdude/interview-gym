import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getShareProgressData } from '@/lib/leaderboard';

interface SharePageProps {
  params: { token: string };
}

export default async function SharePage({ params }: SharePageProps) {
  const data = await getShareProgressData(params.token);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-bg-surface border border-border-subtle rounded-xl shadow-card p-8 space-y-6">
        <header className="text-center space-y-2">
          <p className="text-4xl">🏋️</p>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            {data.displayName}&apos;s Interview Gym Progress
          </h1>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-light border border-brand/20 rounded-lg p-4 text-center space-y-1">
            <p className="font-body text-sm text-text-muted">Pass Rate</p>
            <p className="font-display font-bold text-3xl text-text-primary">{data.passRate}%</p>
          </div>
          <div className="bg-bg-subtle border border-border-subtle rounded-lg p-4 text-center space-y-1">
            <p className="font-body text-sm text-text-muted">Challenges Passed</p>
            <p className="font-display font-bold text-3xl text-text-primary">
              {data.totalPassed}/{data.totalChallenges}
            </p>
          </div>
          <div className="bg-bg-subtle border border-border-subtle rounded-lg p-4 text-center space-y-1">
            <p className="font-body text-sm text-text-muted">Current Streak</p>
            <p className="font-display font-bold text-3xl text-text-primary">
              {data.currentStreak} 🔥
            </p>
          </div>
          <div className="bg-bg-subtle border border-border-subtle rounded-lg p-4 text-center space-y-1">
            <p className="font-body text-sm text-text-muted">Best Simulator Score</p>
            <p className="font-display font-bold text-3xl text-text-primary">
              {data.bestSimulatorScore != null ? `${Math.round(data.bestSimulatorScore)}%` : '—'}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-text-primary">By Category</h2>
          <div className="space-y-2">
            {data.categoryBreakdown.map((row) => (
              <div
                key={row.type}
                className="flex items-center justify-between bg-bg-subtle rounded-md px-4 py-3"
              >
                <span className="font-body text-sm text-text-primary font-semibold">
                  {row.label}
                </span>
                <span className="font-body text-sm text-text-primary">
                  {row.passed}/{row.total} · {row.passRate}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {data.badges.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-text-primary">Badges Earned</h2>
            <div className="flex flex-wrap gap-2">
              {data.badges.map((badge) => (
                <span
                  key={badge.name}
                  className="inline-flex items-center gap-1.5 bg-brand-light border border-brand/20 rounded-full px-3 py-1.5 font-body text-sm text-text-primary"
                >
                  {badge.emoji} {badge.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="text-center pt-2">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-body font-semibold px-6 py-3 rounded-md shadow-brand transition-all duration-150"
          >
            Start Your Own →
          </Link>
        </div>
      </div>
    </div>
  );
}
