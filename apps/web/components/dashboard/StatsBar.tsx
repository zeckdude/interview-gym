interface StatsBarProps {
  totalAttempts: number;
  challengesPassed: number;
  passRate: number;
  currentStreak: number;
  thisWeekAttempts: number;
}

export function StatsBar({
  totalAttempts,
  challengesPassed,
  passRate,
  currentStreak,
  thisWeekAttempts,
}: StatsBarProps) {
  const stats = [
    { label: 'Total Attempts', value: totalAttempts, suffix: '' },
    { label: 'Challenges Passed', value: challengesPassed, suffix: `${passRate}% pass rate` },
    { label: 'Current Streak', value: currentStreak, suffix: 'days 🔥' },
    { label: 'This Week', value: thisWeekAttempts, suffix: 'attempts' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-bg-surface dark:bg-[#1A1A1A] rounded-lg shadow-card border border-border-subtle dark:border-[#2A2A2A] p-5"
        >
          <p className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8]">
            {stat.value}
          </p>
          <p className="font-body text-sm font-semibold text-text-primary dark:text-[#F0EDE8] mt-1">
            {stat.label}
          </p>
          {stat.suffix && (
            <p className="font-body text-xs text-text-muted dark:text-[#8A8580] mt-0.5">{stat.suffix}</p>
          )}
        </div>
      ))}
    </div>
  );
}
