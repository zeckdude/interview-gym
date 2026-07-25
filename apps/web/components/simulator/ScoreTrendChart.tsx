'use client';

interface ScoreTrendChartProps {
  data: Array<{ date: string; score: number }>;
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-bg-subtle rounded-lg p-8 text-center">
        <p className="font-body text-base text-text-muted">
          Complete a few sessions to see your score trend.
        </p>
      </div>
    );
  }

  const width = 400;
  const height = 160;
  const padding = { top: 16, right: 16, bottom: 32, left: 36 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padding.top + chartH - (d.score / 100) * chartH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="bg-bg-surface rounded-xl shadow-card p-6">
      <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
        Score Trend — Last {data.length} Sessions
      </h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-lg"
        role="img"
        aria-label="Score trend chart"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + chartH - (val / 100) * chartH;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-border-subtle"
                strokeWidth="1"
                strokeDasharray={val === 0 ? undefined : '4 4'}
              />
              <text
                x={padding.left - 6}
                y={y + 4}
                textAnchor="end"
                className="fill-text-muted text-[10px]"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} className="fill-brand/10" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          className="stroke-brand"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            className="fill-brand stroke-bg-surface"
            strokeWidth="2"
          />
        ))}

        {/* X axis labels */}
        {points.map((p, i) => {
          if (data.length > 6 && i % 2 !== 0 && i !== data.length - 1) return null;
          const dateLabel = new Date(p.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-text-muted text-[10px]"
            >
              {dateLabel}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
