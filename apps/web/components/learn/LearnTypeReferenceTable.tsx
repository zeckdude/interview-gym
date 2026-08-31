import { cn } from '@/lib/utils';

export interface LearnTypeReferenceRow {
  name: string;
  description: string;
  example?: string;
  /** Accent for the type name badge — theme-aware where possible. */
  accent?: 'fe' | 'brand' | 'success' | 'warning' | 'muted';
}

const ACCENT_CLASS: Record<NonNullable<LearnTypeReferenceRow['accent']>, string> = {
  fe: 'bg-cat-fe/10 text-cat-fe border-cat-fe/30',
  brand: 'bg-brand-light text-brand border-brand/30',
  success: 'bg-success-light text-success border-success/30',
  warning: 'bg-warning-light text-warning border-warning/30',
  muted: 'bg-bg-subtle text-text-primary border-border-strong',
};

interface LearnTypeReferenceTableProps {
  rows: LearnTypeReferenceRow[];
  className?: string;
}

/**
 * Scannable type reference — badge + description per row, examples on their own line with room to breathe.
 */
export function LearnTypeReferenceTable({ rows, className }: LearnTypeReferenceTableProps) {
  return (
    <ul className={cn('space-y-4 list-none m-0 p-0', className)}>
      {rows.map((row) => {
        const accent = row.accent ?? 'muted';
        return (
          <li
            key={row.name}
            className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] gap-4 sm:gap-6 rounded-xl border border-border-subtle bg-bg-surface p-5"
          >
            <div className="flex sm:flex-col sm:items-start items-center gap-2">
              <span className="font-body text-sm font-bold uppercase tracking-wide text-text-muted sm:hidden">
                Type
              </span>
              <span
                className={cn(
                  'inline-block font-mono text-base font-semibold px-3 py-1.5 rounded-lg border shrink-0',
                  ACCENT_CLASS[accent]
                )}
              >
                {row.name}
              </span>
            </div>

            <div className="space-y-3 min-w-0">
              <div className="space-y-1">
                <span className="font-body text-sm font-bold uppercase tracking-wide text-text-muted sm:hidden">
                  What it means
                </span>
                <p className="font-body text-base text-text-primary leading-relaxed m-0">
                  {row.description}
                </p>
              </div>

              {row.example ? (
                <div className="space-y-2">
                  <span className="font-body text-sm font-bold uppercase tracking-wide text-text-primary">
                    Example
                  </span>
                  <pre className="m-0 overflow-x-auto rounded-lg border border-border-subtle bg-bg-subtle px-4 py-3">
                    <code className="font-mono text-base text-text-primary whitespace-pre">
                      {row.example}
                    </code>
                  </pre>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
