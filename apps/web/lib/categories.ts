import type {
  ChallengeCategory,
  ChallengeDifficulty,
  ConceptualQuestion,
  ContentSubcategory,
  ContentTaxonomy,
  LegacyQuestionCategory,
  TopLevelCategory,
  TopLevelFilter,
} from '@/data/types';

/** @deprecated Phase 2 replaces with TopLevelFilter + subcategory toggles. Kept for existing UI. */
export type ContentFilterCategory = 'all' | 'be' | 'frontend' | 'react' | 'nextjs';

/** Stored on challenges/lessons in data files during migration. */
export type StoredChallengeCategory = ChallengeCategory;

export const TOP_LEVEL_FILTER_OPTIONS: { value: TopLevelFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'be', label: 'Backend' },
  { value: 'fe', label: 'Frontend' },
  { value: 'stack', label: 'Stack & Tooling' },
];

export const SUBCATEGORY_OPTIONS: Record<
  Exclude<TopLevelCategory, never>,
  { value: ContentSubcategory; label: string }[]
> = {
  be: [{ value: 'nodejs', label: 'Node.js' }],
  fe: [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'web-apis', label: 'Web APIs' },
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'css', label: 'CSS' },
    { value: 'ai', label: 'AI' },
  ],
  stack: [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'vitest', label: 'Vitest' },
  ],
};

/** Subcategories bundled with framework/platform picks (replaces old null-general behavior). */
export const PLATFORM_GENERAL_SUBCATEGORIES: Partial<
  Record<TopLevelCategory, ContentSubcategory>
> = {
  fe: 'web-apis',
  be: 'nodejs',
};

const FE_FRAMEWORK_SUBCATEGORIES: ContentSubcategory[] = ['react', 'nextjs', 'css', 'ai'];

export function isPlatformGeneralSubcategory(
  topLevel: TopLevelCategory,
  subcategory: ContentSubcategory | null
): boolean {
  if (subcategory === null) return false;
  return PLATFORM_GENERAL_SUBCATEGORIES[topLevel] === subcategory;
}

function shouldIncludePlatformGeneral(
  topLevel: TopLevelCategory,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  if (topLevel === 'fe') {
    return selectedSubcategories.some((sub) => FE_FRAMEWORK_SUBCATEGORIES.includes(sub));
  }
  return false;
}

export const SUBCATEGORY_SECTION_ORDER: Record<TopLevelCategory, ContentSubcategory[]> = {
  be: ['nodejs'],
  fe: ['javascript', 'web-apis', 'react', 'nextjs', 'css', 'ai'],
  stack: ['javascript', 'typescript', 'vitest'],
};
export const CONTENT_LAUNCH_MIN_PER_DIFFICULTY = 10;

export const CONTENT_LAUNCH_DIFFICULTIES: ChallengeDifficulty[] = [
  'easy',
  'intermediate',
  'advanced',
];

/** @deprecated Use TOP_LEVEL_FILTER_OPTIONS in Phase 2+. */
export const CONTENT_CATEGORY_OPTIONS: { value: ContentFilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'be', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
];

export const DIFFICULTY_FILTER_OPTIONS: {
  value: ChallengeDifficulty | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const LEGACY_CHALLENGE_TO_TAXONOMY: Record<StoredChallengeCategory, ContentTaxonomy> = {
  be: { topLevel: 'be', subcategory: 'nodejs' },
  fe: { topLevel: 'stack', subcategory: 'javascript' },
  'fe-advanced': { topLevel: 'fe', subcategory: 'react' },
  nextjs: { topLevel: 'fe', subcategory: 'nextjs' },
  'fe-css': { topLevel: 'fe', subcategory: 'css' },
  'fe-ai': { topLevel: 'fe', subcategory: 'ai' },
  'fe-web-apis': { topLevel: 'fe', subcategory: 'web-apis' },
  'be-nodejs': { topLevel: 'be', subcategory: 'nodejs' },
  'stack-javascript': { topLevel: 'stack', subcategory: 'javascript' },
  'stack-typescript': { topLevel: 'stack', subcategory: 'typescript' },
  'stack-vitest': { topLevel: 'stack', subcategory: 'vitest' },
};

const LEGACY_QUESTION_TO_TAXONOMY: Record<LegacyQuestionCategory, ContentTaxonomy> = {
  'be-question': { topLevel: 'be', subcategory: 'nodejs' },
  'fe-question': { topLevel: 'stack', subcategory: 'javascript' },
  'nextjs-question': { topLevel: 'fe', subcategory: 'nextjs' },
};

/** Legacy filter values still present in old URLs or DB rows. */
const LEGACY_CHALLENGE_FILTERS: Record<string, ContentFilterCategory> = {
  fe: 'frontend',
  'fe-advanced': 'react',
};

const LEGACY_QUESTION_FILTERS: Record<string, ContentFilterCategory> = {
  'be-question': 'be',
  'fe-question': 'frontend',
  'nextjs-question': 'nextjs',
};

const LEGACY_FILTER_TO_TOP_LEVEL: Record<Exclude<ContentFilterCategory, 'all'>, TopLevelCategory> =
  {
    be: 'be',
    frontend: 'fe',
    react: 'fe',
    nextjs: 'fe',
  };

const LEGACY_FILTER_TO_SUBCATEGORIES: Partial<
  Record<Exclude<ContentFilterCategory, 'all'>, ContentSubcategory[]>
> = {
  react: ['react'],
  nextjs: ['nextjs'],
};

export interface TaxonomySource {
  category?: StoredChallengeCategory;
  topLevel?: TopLevelCategory;
  subcategory?: ContentSubcategory | null;
}

export interface QuestionTaxonomySource {
  category: LegacyQuestionCategory;
  topLevel?: TopLevelCategory;
  subcategory?: ContentSubcategory | null;
}

export function resolveTaxonomy(source: TaxonomySource): ContentTaxonomy {
  if (source.topLevel !== undefined) {
    return {
      topLevel: source.topLevel,
      subcategory: source.subcategory ?? null,
    };
  }

  if (source.category) {
    return LEGACY_CHALLENGE_TO_TAXONOMY[source.category];
  }

  return { topLevel: 'be', subcategory: null };
}

export function resolveQuestionTaxonomy(source: QuestionTaxonomySource): ContentTaxonomy {
  if (source.topLevel !== undefined) {
    return {
      topLevel: source.topLevel,
      subcategory: source.subcategory ?? null,
    };
  }

  return LEGACY_QUESTION_TO_TAXONOMY[source.category];
}

export function taxonomyKey(taxonomy: ContentTaxonomy): string {
  return taxonomy.subcategory
    ? `${taxonomy.topLevel}:${taxonomy.subcategory}`
    : taxonomy.topLevel;
}

export function getTopLevelLabel(topLevel: TopLevelCategory): string {
  switch (topLevel) {
    case 'be':
      return 'Backend';
    case 'fe':
      return 'Frontend';
    case 'stack':
      return 'Stack & Tooling';
  }
}

export function getSubcategoryLabel(subcategory: ContentSubcategory): string {
  switch (subcategory) {
    case 'javascript':
      return 'JavaScript';
    case 'web-apis':
      return 'Web APIs';
    case 'nodejs':
      return 'Node.js';
    case 'react':
      return 'React';
    case 'nextjs':
      return 'Next.js';
    case 'css':
      return 'CSS';
    case 'ai':
      return 'AI';
    case 'typescript':
      return 'TypeScript';
    case 'vitest':
      return 'Vitest';
  }
}

export function getTaxonomyDisplayLabel(taxonomy: ContentTaxonomy): string {
  if (taxonomy.subcategory) {
    return getSubcategoryLabel(taxonomy.subcategory);
  }

  return getTopLevelLabel(taxonomy.topLevel);
}

export function subcategoriesForTopLevel(topLevel: TopLevelCategory): ContentSubcategory[] {
  return SUBCATEGORY_OPTIONS[topLevel].map((option) => option.value);
}

export function normalizeTopLevelFilter(raw: string | null | undefined): TopLevelFilter {
  if (!raw || raw === 'all') return 'all';
  if (raw === 'be' || raw === 'fe' || raw === 'stack') return raw;
  if (raw === 'frontend') return 'fe';
  return 'all';
}

export function normalizeSubcategoryFilters(
  raw: string | string[] | null | undefined
): ContentSubcategory[] {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const allowed = new Set<ContentSubcategory>([
    'javascript',
    'web-apis',
    'nodejs',
    'react',
    'nextjs',
    'css',
    'ai',
    'typescript',
    'vitest',
  ]);

  const unique = new Set<ContentSubcategory>();
  for (const value of values) {
    if (allowed.has(value as ContentSubcategory)) {
      unique.add(value as ContentSubcategory);
    }
  }
  return Array.from(unique);
}

export function normalizeContentFilterCategory(
  raw: string | null | undefined
): ContentFilterCategory {
  if (!raw || raw === 'all') return 'all';
  if (raw in LEGACY_CHALLENGE_FILTERS) {
    return LEGACY_CHALLENGE_FILTERS[raw];
  }
  if (raw in LEGACY_QUESTION_FILTERS) {
    return LEGACY_QUESTION_FILTERS[raw];
  }
  if (raw === 'be' || raw === 'frontend' || raw === 'react' || raw === 'nextjs') {
    return raw;
  }
  if (raw === 'fe') return 'frontend';
  if (raw === 'stack') return 'all';
  return 'all';
}

export function legacyFilterToTopLevel(filter: ContentFilterCategory): TopLevelFilter {
  if (filter === 'all') return 'all';
  return LEGACY_FILTER_TO_TOP_LEVEL[filter];
}

export function legacyFilterToSubcategories(
  filter: ContentFilterCategory
): ContentSubcategory[] {
  if (filter === 'all') return [];
  return LEGACY_FILTER_TO_SUBCATEGORIES[filter] ?? [];
}

export function matchesTopLevelFilter(
  taxonomy: ContentTaxonomy,
  topLevelFilter: TopLevelFilter
): boolean {
  if (topLevelFilter === 'all') return true;
  if (taxonomy.topLevel === topLevelFilter) return true;
  if (
    topLevelFilter === 'fe' &&
    taxonomy.topLevel === 'stack' &&
    taxonomy.subcategory === 'javascript'
  ) {
    return true;
  }
  return false;
}

/**
 * Subcategory filter rules:
 * - Top level "all" → subcategory toggles ignored.
 * - No subcategories selected under a top level → show all subcategories for that top level.
 * - One or more subcategories selected → show platform-general (Web APIs / Node.js) + selected only.
 * - JavaScript on Frontend is a virtual alias for stack/javascript content shown under FE filter.
 */
export function matchesSubcategoryFilters(
  taxonomy: ContentTaxonomy,
  topLevelFilter: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  if (topLevelFilter === 'all') return true;

  const effectiveTopLevel =
    topLevelFilter === 'fe' &&
    taxonomy.topLevel === 'stack' &&
    taxonomy.subcategory === 'javascript'
      ? 'fe'
      : taxonomy.topLevel;

  if (effectiveTopLevel !== topLevelFilter) return false;
  if (selectedSubcategories.length === 0) return true;

  const effectiveSubcategory =
    taxonomy.topLevel === 'stack' &&
    taxonomy.subcategory === 'javascript' &&
    topLevelFilter === 'fe'
      ? 'javascript'
      : taxonomy.subcategory;

  if (
    effectiveSubcategory &&
    isPlatformGeneralSubcategory(topLevelFilter as TopLevelCategory, effectiveSubcategory)
  ) {
    return shouldIncludePlatformGeneral(
      topLevelFilter as TopLevelCategory,
      selectedSubcategories
    );
  }

  if (!effectiveSubcategory) return false;

  return selectedSubcategories.includes(effectiveSubcategory);
}

export function matchesContentFilters(
  taxonomy: ContentTaxonomy,
  topLevelFilter: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  return (
    matchesTopLevelFilter(taxonomy, topLevelFilter) &&
    matchesSubcategoryFilters(taxonomy, topLevelFilter, selectedSubcategories)
  );
}

export function challengeMatchesCategoryFilter(
  challenge: TaxonomySource,
  filter: ContentFilterCategory
): boolean {
  const taxonomy = resolveTaxonomy(challenge);
  const topLevel = legacyFilterToTopLevel(filter);
  const subcategories = legacyFilterToSubcategories(filter);
  return matchesContentFilters(taxonomy, topLevel, subcategories);
}

export function questionMatchesCategoryFilter(
  category: ConceptualQuestion['category'],
  filter: ContentFilterCategory
): boolean {
  const taxonomy = resolveQuestionTaxonomy({ category });
  const topLevel = legacyFilterToTopLevel(filter);
  const subcategories = legacyFilterToSubcategories(filter);
  return matchesContentFilters(taxonomy, topLevel, subcategories);
}

export function lessonMatchesCategoryFilter(
  lesson: TaxonomySource,
  filter: ContentFilterCategory
): boolean {
  return challengeMatchesCategoryFilter(lesson, filter);
}

/** Badge / card display group derived from taxonomy. */
export type DisplayCategory =
  | 'be'
  | 'fe'
  | 'stack'
  | 'javascript'
  | 'web-apis'
  | 'nodejs'
  | 'react'
  | 'nextjs'
  | 'css'
  | 'ai'
  | 'typescript'
  | 'vitest';

export function getDisplayCategoryFromTaxonomy(taxonomy: ContentTaxonomy): DisplayCategory {
  if (taxonomy.subcategory) return taxonomy.subcategory;
  return taxonomy.topLevel;
}

export function getDisplayCategory(category: StoredChallengeCategory): DisplayCategory {
  return getDisplayCategoryFromTaxonomy(LEGACY_CHALLENGE_TO_TAXONOMY[category]);
}

export function getDisplayCategoryLabel(category: StoredChallengeCategory): string {
  return getTaxonomyDisplayLabel(LEGACY_CHALLENGE_TO_TAXONOMY[category]);
}

export function getQuestionDisplayLabel(category: ConceptualQuestion['category']): string {
  return getTaxonomyDisplayLabel(LEGACY_QUESTION_TO_TAXONOMY[category]);
}

/** For simulator / API — map UI filter to stored legacy categories. */
export function storedCategoriesForFilter(
  filter: ContentFilterCategory | 'mixed'
): StoredChallengeCategory[] | null {
  if (filter === 'mixed' || filter === 'all') return null;
  if (filter === 'be') return ['be-nodejs', 'stack-javascript'];
  if (filter === 'nextjs') return ['nextjs'];
  if (filter === 'react') return ['fe-advanced'];
  if (filter === 'frontend') {
    return [
      'fe-web-apis',
      'stack-javascript',
      'fe-advanced',
      'nextjs',
      'fe-css',
      'fe-ai',
    ];
  }
  return null;
}

export function simulatorCategoryMatches(
  challenge: TaxonomySource,
  filter: ContentFilterCategory | 'mixed'
): boolean {
  if (filter === 'mixed') return true;
  return challengeMatchesCategoryFilter(challenge, filter);
}

/** Legacy challengeType strings in DB / attempts. */
export function getCategoryLabelForChallengeType(challengeType: string): string {
  switch (challengeType) {
    case 'be':
      return 'Backend';
    case 'fe':
      return 'Frontend';
    case 'fe-advanced':
      return 'React';
    case 'nextjs':
      return 'Next.js';
    case 'fe-css':
      return 'CSS';
    case 'fe-ai':
      return 'AI';
    case 'stack-typescript':
      return 'TypeScript';
    case 'stack-javascript':
      return 'JavaScript';
    case 'stack-vitest':
      return 'Vitest';
    case 'fe-web-apis':
      return 'Web APIs';
    case 'be-nodejs':
      return 'Node.js';
    case 'be-question':
      return 'Backend';
    case 'fe-question':
      return 'Frontend';
    case 'nextjs-question':
      return 'Next.js';
    default:
      return challengeType;
  }
}

export function legacyCategoryFromTaxonomy(taxonomy: ContentTaxonomy): StoredChallengeCategory | null {
  if (taxonomy.topLevel === 'be' && taxonomy.subcategory === 'nodejs') return 'be-nodejs';
  if (taxonomy.topLevel === 'fe' && taxonomy.subcategory === 'web-apis') return 'fe-web-apis';
  if (taxonomy.topLevel === 'stack' && taxonomy.subcategory === 'javascript') {
    return 'stack-javascript';
  }
  if (taxonomy.topLevel === 'fe' && taxonomy.subcategory === 'react') return 'fe-advanced';
  if (taxonomy.topLevel === 'fe' && taxonomy.subcategory === 'nextjs') return 'nextjs';
  if (taxonomy.topLevel === 'fe' && taxonomy.subcategory === 'css') return 'fe-css';
  if (taxonomy.topLevel === 'fe' && taxonomy.subcategory === 'ai') return 'fe-ai';
  if (taxonomy.topLevel === 'stack' && taxonomy.subcategory === 'typescript') {
    return 'stack-typescript';
  }
  if (taxonomy.topLevel === 'stack' && taxonomy.subcategory === 'vitest') {
    return 'stack-vitest';
  }
  return null;
}

export interface ParsedContentFilters {
  topLevel: TopLevelFilter;
  subcategories: ContentSubcategory[];
}

/** Read top-level + subcategory filters from URL params (with legacy category migration). */
export function parseContentFiltersFromSearchParams(
  categoryParam: string | null,
  subParams: string[]
): ParsedContentFilters {
  const legacy = categoryParam ? normalizeContentFilterCategory(categoryParam) : 'all';

  if (legacy !== 'all' && categoryParam && !(categoryParam === 'be' || categoryParam === 'fe' || categoryParam === 'stack')) {
    return {
      topLevel: legacyFilterToTopLevel(legacy),
      subcategories: subParams.length > 0 ? normalizeSubcategoryFilters(subParams) : legacyFilterToSubcategories(legacy),
    };
  }

  const topLevel = normalizeTopLevelFilter(categoryParam);
  const subcategories = normalizeSubcategoryFilters(subParams);

  return { topLevel, subcategories };
}

export function questionMatchesContentFilters(
  question: QuestionTaxonomySource,
  topLevelFilter: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  const taxonomy = resolveQuestionTaxonomy(question);
  return matchesContentFilters(taxonomy, topLevelFilter, selectedSubcategories);
}

export function challengeMatchesContentFilters(
  item: TaxonomySource,
  topLevelFilter: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  const taxonomy = resolveTaxonomy(item);
  return matchesContentFilters(taxonomy, topLevelFilter, selectedSubcategories);
}

export function lessonMatchesContentFilters(
  lesson: TaxonomySource,
  topLevelFilter: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  return challengeMatchesContentFilters(lesson, topLevelFilter, selectedSubcategories);
}

export interface ContentFilterSummaryInput {
  topLevel: TopLevelFilter;
  subcategories: ContentSubcategory[];
  difficulty: ChallengeDifficulty | 'all';
  special: string[];
}

export function formatContentFilterSummary(input: ContentFilterSummaryInput): string {
  const parts: string[] = [];

  if (input.topLevel === 'all') {
    parts.push('All categories');
  } else {
    const topLabel = getTopLevelLabel(input.topLevel);
    if (input.subcategories.length === 0) {
      parts.push(topLabel);
    } else {
      const subLabels = input.subcategories.map(getSubcategoryLabel).join(', ');
      parts.push(`${topLabel} · ${subLabels}`);
    }
  }

  if (input.difficulty === 'all') {
    parts.push('All difficulties');
  } else {
    const difficultyLabel =
      DIFFICULTY_FILTER_OPTIONS.find((option) => option.value === input.difficulty)?.label ??
      input.difficulty;
    parts.push(difficultyLabel);
  }

  if (input.special.includes('most-asked')) parts.push('Most Asked');
  if (input.special.includes('not-passed')) parts.push('Not Passed');
  if (input.special.includes('weak-spots')) parts.push('Weak Spots');

  return parts.join(' · ');
}

export function hasNonDefaultContentFilters(input: ContentFilterSummaryInput): boolean {
  return (
    input.topLevel !== 'all' ||
    input.subcategories.length > 0 ||
    input.difficulty !== 'all' ||
    input.special.length > 0
  );
}

export function subcategoriesValidForTopLevel(
  topLevel: TopLevelFilter,
  subcategories: ContentSubcategory[]
): ContentSubcategory[] {
  if (topLevel === 'all') return [];
  const allowed = new Set(subcategoriesForTopLevel(topLevel));
  return subcategories.filter((subcategory) => allowed.has(subcategory));
}

export interface ContentSection<T> {
  label: string;
  subcategory: ContentSubcategory;
  items: T[];
}

/** Group list items into labeled subcategory sections for a top-level browse view. */
export function groupContentBySubcategorySection<T>(
  items: T[],
  getTaxonomy: (item: T) => ContentTaxonomy,
  topLevel: TopLevelFilter
): ContentSection<T>[] | null {
  if (topLevel === 'all') return null;

  const order = SUBCATEGORY_SECTION_ORDER[topLevel];
  const grouped = new Map<ContentSubcategory, T[]>();

  for (const item of items) {
    const taxonomy = getTaxonomy(item);
    let subcategory = taxonomy.subcategory;
    if (
      topLevel === 'fe' &&
      taxonomy.topLevel === 'stack' &&
      taxonomy.subcategory === 'javascript'
    ) {
      subcategory = 'javascript';
    }
    if (!subcategory || !order.includes(subcategory)) continue;
    const bucket = grouped.get(subcategory) ?? [];
    bucket.push(item);
    grouped.set(subcategory, bucket);
  }

  return order
    .filter((subcategory) => grouped.has(subcategory))
    .map((subcategory) => ({
      subcategory,
      label: getSubcategoryLabel(subcategory),
      items: grouped.get(subcategory)!,
    }));
}

export function shouldGroupContentBySubcategory(
  topLevel: TopLevelFilter,
  selectedSubcategories: ContentSubcategory[]
): boolean {
  return topLevel !== 'all' && selectedSubcategories.length === 0;
}
