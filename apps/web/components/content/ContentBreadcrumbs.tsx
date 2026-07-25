'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContentBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function ContentBreadcrumbs({ items, className }: ContentBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2 min-w-0">
              {index > 0 && (
                <span className="text-text-muted shrink-0" aria-hidden>
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-brand font-semibold transition-colors shrink-0"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-text-primary font-semibold truncate max-w-[min(100%,20rem)] sm:max-w-md"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
