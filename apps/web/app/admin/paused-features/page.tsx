import Link from 'next/link';

/** Secret page — not linked from nav. Lists paused features for later restore/delete. */
export default function PausedFeaturesPage() {
  const paused = [
    { name: 'My Path', href: '/my-path', note: 'Curated FE/BE/fullstack paths — replaced by fixed JS track' },
    { name: 'Code Interview Simulator', href: '/simulator', note: 'Timed mock interviews' },
    { name: 'Voice Interview', href: '/simulator/voice', note: 'Voice mock interviews' },
    { name: 'Questions', href: '/questions', note: 'Technical Q&A bank' },
    { name: 'Systems Design', href: '/systems-design', note: 'System design sessions' },
    { name: 'Generate Challenge', href: '/generate', note: 'AI challenge generation' },
    { name: 'My Challenges', href: '/my-challenges', note: 'User-created challenges' },
    { name: 'My Bests / Leaderboard', href: '/leaderboard', note: 'Personal bests' },
    { name: 'My Notes', href: '/notes', note: 'Challenge notes' },
    { name: 'Badges', href: '/badges', note: 'Achievement badges' },
    { name: 'Dashboard (legacy)', href: '/dashboard-legacy', note: 'Old stats dashboard — home is now path map' },
  ];

  const removed = [
    { name: 'My Playbook', note: 'Removed — not paused' },
    { name: 'Study Plan', note: 'Removed — not paused' },
  ];

  return (
    <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
            Paused features
          </h1>
          <p className="font-body text-base text-text-primary">
            Hidden from navigation while the learn path is the main focus. Routes still work if
            you know the URL. Decide later: unpause or delete.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-text-primary">Paused</h2>
          <ul className="space-y-3">
            {paused.map((item) => (
              <li
                key={item.href}
                className="rounded-lg border border-border-subtle bg-bg-surface p-4"
              >
                <Link href={item.href} className="font-body font-semibold text-brand hover:underline">
                  {item.name}
                </Link>
                <p className="font-body text-sm text-text-primary mt-1">{item.note}</p>
                <p className="font-mono text-xs text-text-muted mt-1">{item.href}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-text-primary">Removed</h2>
          <ul className="space-y-2">
            {removed.map((item) => (
              <li key={item.name} className="font-body text-base text-text-primary">
                <strong>{item.name}</strong> — {item.note}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-brand/10 border border-brand/30 p-4">
          <h2 className="font-display font-bold text-lg text-text-primary mb-2">Active</h2>
          <ul className="font-body text-base text-text-primary space-y-1 list-disc pl-5">
            <li>Learn path (home) — Modern JavaScript</li>
            <li>Review — spaced repetition + manual</li>
            <li>Lessons — advanced (soft gate)</li>
            <li>Challenges — with lesson links</li>
            <li>Settings</li>
          </ul>
        </section>
    </div>
  );
}
