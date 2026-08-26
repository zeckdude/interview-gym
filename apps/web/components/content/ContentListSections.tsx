'use client';

import type { ReactNode } from 'react';
import type { ContentSection } from '@/lib/categories';

interface ContentListSectionsProps<T> {
  sections: ContentSection<T>[] | null;
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string;
  gridClassName?: string;
}

export function ContentListSections<T>({
  sections,
  items,
  renderItem,
  getItemKey,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
}: ContentListSectionsProps<T>) {
  if (!sections) {
    return (
      <div className={gridClassName}>
        {items.map((item) => (
          <div key={getItemKey(item)}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.subcategory} className="space-y-4">
          <div className="flex items-baseline gap-3 border-l-4 border-brand pl-4">
            <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              {section.label}
            </h2>
            <span className="font-body text-sm text-text-muted">{section.items.length}</span>
          </div>
          <div className={gridClassName}>
            {section.items.map((item) => (
              <div key={getItemKey(item)}>{renderItem(item)}</div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
