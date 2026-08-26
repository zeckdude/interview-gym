'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PathQueueItem } from '@/lib/paths/types';
import { getPathItemTypeLabel } from '@/lib/paths/item-resolver';

interface DailyQueueProps {
  items: PathQueueItem[];
}

export function DailyQueue({ items }: DailyQueueProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-surface p-6 text-center">
        <p className="font-body text-base text-text-primary font-semibold">
          Stage complete — great work!
        </p>
        <p className="font-body text-sm text-text-secondary mt-2">
          Check the next stage below or review items you marked as understood.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand/30 bg-brand-light overflow-hidden">
      <div className="px-5 py-3 border-b border-brand/20 bg-brand/5">
        <h2 className="font-display font-bold text-lg text-text-primary">
          Today&apos;s Focus
        </h2>
        <p className="font-body text-sm text-text-secondary mt-0.5">
          Highest-priority items for your current stage
        </p>
      </div>
      <ul className="divide-y divide-border-subtle">
        {items.map((item) => (
          <li
            key={item.itemId}
            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              {item.mostAsked && (
                <span className="text-base flex-shrink-0" title="Most Asked">
                  🔥
                </span>
              )}
              <div className="min-w-0">
                <p className="font-body text-xs font-semibold uppercase tracking-wide text-text-muted mb-0.5">
                  {getPathItemTypeLabel(item.itemType)}
                </p>
                <p className="font-body text-base text-text-primary font-semibold truncate">
                  {item.title}
                </p>
                {item.attempts > 0 && item.status === 'attempted' && (
                  <p className="font-body text-sm text-warning mt-0.5">
                    {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <Link
              href={item.href}
              className="flex-shrink-0 px-4 py-2 rounded-md bg-brand text-white font-body text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
