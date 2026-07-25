'use client';

import type { ContentFilterCategory } from '@/lib/categories';
import { cn } from '@/lib/utils';

const tabs: { id: ContentFilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'be', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'react', label: 'React' },
  { id: 'nextjs', label: 'Next.js' },
];

interface FilterTabsProps {
  active: ContentFilterCategory;
  onChange: (category: ContentFilterCategory) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-150',
            active === tab.id
              ? 'bg-brand text-white shadow-brand'
              : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
