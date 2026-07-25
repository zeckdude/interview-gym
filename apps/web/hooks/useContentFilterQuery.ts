'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PRESERVED_DETAIL_PARAMS,
  PRESERVED_LIST_FILTER_PARAMS,
  queryStringFromSearchParams,
} from '@/lib/content-filter-url';

export function useContentFilterQuery(): string {
  const searchParams = useSearchParams();

  return useMemo(
    () => queryStringFromSearchParams(searchParams, PRESERVED_LIST_FILTER_PARAMS),
    [searchParams]
  );
}

export function useDetailPreservedQuery(): string {
  const searchParams = useSearchParams();

  return useMemo(
    () => queryStringFromSearchParams(searchParams, PRESERVED_DETAIL_PARAMS),
    [searchParams]
  );
}
