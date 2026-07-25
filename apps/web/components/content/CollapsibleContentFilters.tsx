'use client';

import { useState } from 'react';
import { FilterGroup, FilterPill } from '@/components/challenges/FilterPills';
import type { ContentFilters, SpecialFilter } from '@/hooks/useContentFilters';
import {
  DIFFICULTY_FILTER_OPTIONS,
  SUBCATEGORY_OPTIONS,
  TOP_LEVEL_FILTER_OPTIONS,
  formatContentFilterSummary,
  hasNonDefaultContentFilters,
} from '@/lib/categories';
import type { ContentSubcategory, TopLevelFilter } from '@/data/types';
import { cn } from '@/lib/utils';

interface CollapsibleContentFiltersProps {
  filters: ContentFilters;
  setFilters: (next: Partial<ContentFilters>) => void;
  toggleSpecial: (value: SpecialFilter) => void;
  toggleSubcategory: (value: ContentSubcategory) => void;
  clearFilters: () => void;
  specialFilters?: SpecialFilter[];
}

const DEFAULT_SPECIAL_FILTERS: SpecialFilter[] = ['most-asked', 'not-passed', 'weak-spots'];

export function CollapsibleContentFilters({
  filters,
  setFilters,
  toggleSpecial,
  toggleSubcategory,
  clearFilters,
  specialFilters = DEFAULT_SPECIAL_FILTERS,
}: CollapsibleContentFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const summary = formatContentFilterSummary(filters);
  const hasActive = hasNonDefaultContentFilters(filters);

  const subcategoryOptions =
    filters.topLevel === 'all' || filters.topLevel === 'be'
      ? []
      : SUBCATEGORY_OPTIONS[filters.topLevel];

  return (
    <div className="rounded-lg border border-border-subtle dark:border-[#2A2A2A] bg-bg-surface dark:bg-[#141414] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-text-muted">
            Active filters
          </p>
          <p className="font-body text-sm text-text-primary dark:text-[#F0EDE8] truncate">
            {summary}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 rounded-md text-sm font-body font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-body font-semibold border transition-all duration-150',
              expanded
                ? 'bg-brand text-white border-brand shadow-brand'
                : 'bg-bg-subtle text-text-primary border-border-subtle hover:border-brand'
            )}
          >
            {expanded ? 'Hide filters' : 'Edit filters'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border-subtle dark:border-[#2A2A2A] p-4 space-y-5 bg-bg-subtle/40 dark:bg-[#101010]">
          <FilterGroup label="Category">
            {TOP_LEVEL_FILTER_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={filters.topLevel === option.value}
                onClick={() =>
                  setFilters({
                    topLevel: option.value as TopLevelFilter,
                    subcategories: [],
                  })
                }
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterGroup>

          {subcategoryOptions.length > 0 && (
            <FilterGroup label="Subcategory">
              {subcategoryOptions.map((option) => (
                <FilterPill
                  key={option.value}
                  active={filters.subcategories.includes(option.value)}
                  onClick={() => toggleSubcategory(option.value)}
                >
                  {option.label}
                </FilterPill>
              ))}
            </FilterGroup>
          )}

          <FilterGroup label="Difficulty">
            {DIFFICULTY_FILTER_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={filters.difficulty === option.value}
                onClick={() => setFilters({ difficulty: option.value })}
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterGroup>

          {specialFilters.length > 0 && (
            <FilterGroup label="Show">
              {specialFilters.includes('most-asked') && (
                <FilterPill
                  active={filters.special.includes('most-asked')}
                  onClick={() => toggleSpecial('most-asked')}
                  icon="🔥"
                  variant="most-asked"
                >
                  Most Asked Only
                </FilterPill>
              )}
              {specialFilters.includes('not-passed') && (
                <FilterPill
                  active={filters.special.includes('not-passed')}
                  onClick={() => toggleSpecial('not-passed')}
                >
                  Not Passed
                </FilterPill>
              )}
              {specialFilters.includes('weak-spots') && (
                <FilterPill
                  active={filters.special.includes('weak-spots')}
                  onClick={() => toggleSpecial('weak-spots')}
                >
                  My Weak Spots
                </FilterPill>
              )}
            </FilterGroup>
          )}
        </div>
      )}
    </div>
  );
}
