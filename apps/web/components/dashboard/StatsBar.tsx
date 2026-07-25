interface StatsBarProps {
  totalAttempts: number;
  challengesPassed: number;
  passRate: number;
  currentStreak: number;
  thisWeekAttempts: number;
  cleanPasses?: number;
}

export function StatsBar({
  totalAttempts,
  challengesPassed,
  passRate,
  currentStreak,
  thisWeekAttempts,
  cleanPasses,
}: StatsBarProps) {
  const stats = [
    { label: 'Total Attempts', value: totalAttempts, suffix: '', highlight: false },
    {
      label: 'Challenges Passed',
      value: `${challengesPassed} (${passRate}%)`,
      suffix: '',
      highlight: false,
    },
    ...(cleanPasses != null
      ? [
          {
            label: 'Clean Passes',
            value: `${cleanPasses} ⭐`,
            suffix: 'no hints used',
            highlight: cleanPasses > 0,
          },
        ]
      : []),
    {
      label: 'Current Streak',
      value: `${currentStreak} days 🔥`,
      suffix: '',
      highlight: currentStreak >= 3,
    },
    { label: 'This Week', value: thisWeekAttempts, suffix: 'attempts', highlight: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-lg shadow-card border p-5 ${
            stat.highlight
              ? 'bg-brand-light border-brand/40'
              : 'bg-bg-surface dark:bg-[#1A1A1A] border-border-subtle dark:border-[#2A2A2A]'
          }`}
        >
          <p
            className={`font-display font-bold text-3xl ${
              stat.highlight ? 'text-brand' : 'text-text-primary dark:text-[#F0EDE8]'
            }`}
          >
            {stat.value}
          </p>
          <p className="font-body text-sm font-semibold text-text-primary dark:text-[#F0EDE8] mt-1">
            {stat.label}
          </p>
          {stat.suffix && (
            <p className="font-body text-xs text-text-muted dark:text-[#8A8580] mt-0.5">
              {stat.suffix}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
