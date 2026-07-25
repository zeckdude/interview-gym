'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ChallengeDifficulty, ContentSubcategory, TopLevelFilter } from '@/data/types';
import {
  parseContentFiltersFromSearchParams,
  subcategoriesValidForTopLevel,
} from '@/lib/categories';

export type SpecialFilter = 'most-asked' | 'not-passed' | 'weak-spots';

export interface ContentFilters {
  topLevel: TopLevelFilter;
  subcategories: ContentSubcategory[];
  difficulty: ChallengeDifficulty | 'all';
  special: SpecialFilter[];
}

type FilterBasePath = '/challenges' | '/questions' | '/lessons';

function writeFiltersToParams(
  params: URLSearchParams,
  filters: ContentFilters
): void {
  if (filters.topLevel === 'all') params.delete('category');
  else params.set('category', filters.topLevel);

  params.delete('sub');
  for (const subcategory of filters.subcategories) {
    params.append('sub', subcategory);
  }

  if (filters.difficulty === 'all') params.delete('difficulty');
  else params.set('difficulty', filters.difficulty);

  params.delete('special');
  for (const value of filters.special) {
    params.append('special', value);
  }
}

export function useContentFilters(basePath: FilterBasePath) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ContentFilters>(() => {
    const { topLevel, subcategories } = parseContentFiltersFromSearchParams(
      searchParams.get('category'),
      searchParams.getAll('sub')
    );
    const difficulty = (searchParams.get('difficulty') ?? 'all') as ContentFilters['difficulty'];
    const special = searchParams.getAll('special') as SpecialFilter[];

    return {
      topLevel,
      subcategories: subcategoriesValidForTopLevel(topLevel, subcategories),
      difficulty,
      special,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<ContentFilters>) => {
      const merged: ContentFilters = {
        topLevel: next.topLevel ?? filters.topLevel,
        subcategories: next.subcategories ?? filters.subcategories,
        difficulty: next.difficulty ?? filters.difficulty,
        special: next.special ?? filters.special,
      };

      if (next.topLevel !== undefined && next.subcategories === undefined) {
        merged.subcategories = subcategoriesValidForTopLevel(
          merged.topLevel,
          merged.subcategories
        );
      }

      const params = new URLSearchParams(searchParams.toString());
      writeFiltersToParams(params, merged);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router, searchParams]
  );

  const toggleSpecial = useCallback(
    (value: SpecialFilter) => {
      const exists = filters.special.includes(value);
      const special = exists
        ? filters.special.filter((item) => item !== value)
        : [...filters.special, value];
      setFilters({ special });
    },
    [filters.special, setFilters]
  );

  const toggleSubcategory = useCallback(
    (value: ContentSubcategory) => {
      const exists = filters.subcategories.includes(value);
      const subcategories = exists
        ? filters.subcategories.filter((item) => item !== value)
        : [...filters.subcategories, value];
      setFilters({ subcategories });
    },
    [filters.subcategories, setFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      topLevel: 'all',
      subcategories: [],
      difficulty: 'all',
      special: [],
    });
  }, [setFilters]);

  return {
    filters,
    setFilters,
    toggleSpecial,
    toggleSubcategory,
    clearFilters,
    basePath,
  };
}
