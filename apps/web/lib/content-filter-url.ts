import type { ReadonlyURLSearchParams } from 'next/navigation';

/** URL params preserved when navigating between list and detail pages. */
export const PRESERVED_LIST_FILTER_PARAMS = ['category', 'sub', 'difficulty', 'special'] as const;

/** Additional params preserved on challenge detail navigation (e.g. review sessions). */
export const PRESERVED_DETAIL_PARAMS = [...PRESERVED_LIST_FILTER_PARAMS, 'review'] as const;

type SearchParamsInput =
  | URLSearchParams
  | ReadonlyURLSearchParams
  | Record<string, string | string[] | undefined>
  | null
  | undefined;

function appendParamValues(
  target: URLSearchParams,
  key: string,
  value: string | string[] | undefined
): void {
  if (value === undefined) return;
  if (Array.isArray(value)) {
    for (const entry of value) {
      target.append(key, entry);
    }
    return;
  }
  target.set(key, value);
}

function isSearchParamsLike(
  source: SearchParamsInput
): source is URLSearchParams | ReadonlyURLSearchParams {
  return (
    source instanceof URLSearchParams ||
    (typeof source === 'object' &&
      source !== null &&
      'get' in source &&
      typeof source.get === 'function')
  );
}

export function queryStringFromSearchParams(
  source: SearchParamsInput,
  keys: readonly string[] = PRESERVED_LIST_FILTER_PARAMS
): string {
  const params = new URLSearchParams();

  if (!source) return '';

  if (isSearchParamsLike(source)) {
    for (const key of keys) {
      const values = source.getAll(key);
      for (const value of values) {
        params.append(key, value);
      }
    }
    return params.toString();
  }

  for (const key of keys) {
    appendParamValues(params, key, source[key]);
  }

  return params.toString();
}

export function mergeQueryStrings(...parts: (string | undefined)[]): string {
  const merged = new URLSearchParams();

  for (const part of parts) {
    if (!part) continue;
    const current = new URLSearchParams(part);
    current.forEach((value, key) => {
      merged.append(key, value);
    });
  }

  return merged.toString();
}

export function buildPathWithQuery(path: string, ...queryParts: (string | undefined)[]): string {
  const query = mergeQueryStrings(...queryParts);
  return query ? `${path}?${query}` : path;
}

export function buildListPath(
  basePath: '/challenges' | '/lessons' | '/questions',
  filterQuery?: string
): string {
  return buildPathWithQuery(basePath, filterQuery);
}

export function buildChallengePath(id: string, ...queryParts: (string | undefined)[]): string {
  return buildPathWithQuery(`/challenges/${id}`, ...queryParts);
}

export function buildLessonPath(id: string, filterQuery?: string): string {
  return buildPathWithQuery(`/lessons/${id}`, filterQuery);
}
