interface ProgressRingProps {
  completed: number;
  total: number;
  label?: string;
}

export function ProgressRing({ completed, total, label = 'lessons completed' }: ProgressRingProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-bg-subtle"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-brand transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-lg text-text-primary dark:text-[#F0EDE8]">
            {percent}%
          </span>
        </div>
      </div>
      <div>
        <p className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
          {completed} / {total}
        </p>
        <p className="font-body text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}
