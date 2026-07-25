'use client';

interface CategoryBreakdownProps {
  challenges: Array<{
    challengeId: string;
    category?: string;
    passed: boolean | null;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  be: 'Backend',
  fe: 'Frontend Essential',
  'fe-advanced': 'FE Advanced',
};

export function CategoryBreakdown({ challenges }: CategoryBreakdownProps) {
  const byCategory: Record<string, { passed: number; total: number }> = {};

  for (const c of challenges) {
    const cat = c.category ?? 'unknown';
    if (!byCategory[cat]) byCategory[cat] = { passed: 0, total: 0 };
    byCategory[cat].total++;
    if (c.passed) byCategory[cat].passed++;
  }

  const entries = Object.entries(byCategory);
  if (entries.length === 0) return null;

  return (
    <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-4">
      <h3 className="font-display font-semibold text-lg text-text-primary">
        Score by Category
      </h3>
      <div className="space-y-4">
        {entries.map(([cat, stats]) => {
          const pct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
          return (
            <div key={cat} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-body text-base text-text-primary font-semibold">
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
                <span className="font-body text-sm text-text-muted">
                  {stats.passed}/{stats.total} passed · {pct}%
                </span>
              </div>
              <div className="h-3 bg-bg-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
