import { describe, expect, it } from 'vitest';
import {
  groupContentBySubcategorySection,
  legacyCategoryFromTaxonomy,
  matchesContentFilters,
  parseContentFiltersFromSearchParams,
  formatContentFilterSummary,
  resolveTaxonomy,
  resolveQuestionTaxonomy,
  shouldGroupContentBySubcategory,
} from '@/lib/categories';

describe('resolveTaxonomy', () => {
  it('maps legacy challenge categories', () => {
    expect(resolveTaxonomy({ category: 'be-nodejs' })).toEqual({
      topLevel: 'be',
      subcategory: 'nodejs',
    });
    expect(resolveTaxonomy({ category: 'stack-javascript' })).toEqual({
      topLevel: 'stack',
      subcategory: 'javascript',
    });
    expect(resolveTaxonomy({ category: 'fe-advanced' })).toEqual({
      topLevel: 'fe',
      subcategory: 'react',
    });
    expect(resolveTaxonomy({ category: 'nextjs' })).toEqual({
      topLevel: 'fe',
      subcategory: 'nextjs',
    });
    expect(resolveTaxonomy({ category: 'fe-web-apis' })).toEqual({
      topLevel: 'fe',
      subcategory: 'web-apis',
    });
  });

  it('prefers explicit taxonomy over legacy category', () => {
    expect(
      resolveTaxonomy({
        category: 'fe',
        topLevel: 'fe',
        subcategory: 'css',
      })
    ).toEqual({ topLevel: 'fe', subcategory: 'css' });
  });
});

describe('matchesContentFilters', () => {
  const reactLesson = resolveTaxonomy({ category: 'fe-advanced' });
  const javascriptLesson = resolveTaxonomy({ category: 'stack-javascript' });
  const webApis = resolveTaxonomy({ category: 'fe-web-apis' });
  const nextjs = resolveTaxonomy({ category: 'nextjs' });

  it('shows all frontend when no subcategories selected', () => {
    expect(matchesContentFilters(reactLesson, 'fe', [])).toBe(true);
    expect(matchesContentFilters(javascriptLesson, 'fe', [])).toBe(true);
    expect(matchesContentFilters(webApis, 'fe', [])).toBe(true);
    expect(matchesContentFilters(nextjs, 'fe', [])).toBe(true);
  });

  it('shows platform general + selected subcategories only', () => {
    expect(matchesContentFilters(reactLesson, 'fe', ['react'])).toBe(true);
    expect(matchesContentFilters(webApis, 'fe', ['react'])).toBe(true);
    expect(matchesContentFilters(javascriptLesson, 'fe', ['react'])).toBe(false);
    expect(matchesContentFilters(nextjs, 'fe', ['react'])).toBe(false);
  });

  it('filters javascript only when javascript subcategory selected on frontend', () => {
    expect(matchesContentFilters(javascriptLesson, 'fe', ['javascript'])).toBe(true);
    expect(matchesContentFilters(webApis, 'fe', ['javascript'])).toBe(false);
    expect(matchesContentFilters(reactLesson, 'fe', ['javascript'])).toBe(false);
  });

  it('filters by top level', () => {
    expect(matchesContentFilters(reactLesson, 'be', [])).toBe(false);
    expect(matchesContentFilters(resolveTaxonomy({ category: 'be-nodejs' }), 'be', [])).toBe(true);
  });
});

describe('resolveQuestionTaxonomy', () => {
  it('maps legacy question categories', () => {
    expect(resolveQuestionTaxonomy({ category: 'fe-question' })).toEqual({
      topLevel: 'stack',
      subcategory: 'javascript',
    });
    expect(resolveQuestionTaxonomy({ category: 'be-question' })).toEqual({
      topLevel: 'be',
      subcategory: 'nodejs',
    });
    expect(resolveQuestionTaxonomy({ category: 'nextjs-question' })).toEqual({
      topLevel: 'fe',
      subcategory: 'nextjs',
    });
  });
});

describe('legacyCategoryFromTaxonomy', () => {
  it('round-trips known legacy buckets', () => {
    expect(legacyCategoryFromTaxonomy({ topLevel: 'be', subcategory: 'nodejs' })).toBe('be-nodejs');
    expect(legacyCategoryFromTaxonomy({ topLevel: 'stack', subcategory: 'javascript' })).toBe(
      'stack-javascript'
    );
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: 'web-apis' })).toBe(
      'fe-web-apis'
    );
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: 'react' })).toBe(
      'fe-advanced'
    );
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: 'nextjs' })).toBe('nextjs');
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: 'css' })).toBe('fe-css');
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: 'ai' })).toBe('fe-ai');
    expect(legacyCategoryFromTaxonomy({ topLevel: 'stack', subcategory: 'typescript' })).toBe(
      'stack-typescript'
    );
    expect(legacyCategoryFromTaxonomy({ topLevel: 'stack', subcategory: 'vitest' })).toBe(
      'stack-vitest'
    );
  });
});

describe('parseContentFiltersFromSearchParams', () => {
  it('migrates legacy react URLs', () => {
    expect(parseContentFiltersFromSearchParams('react', [])).toEqual({
      topLevel: 'fe',
      subcategories: ['react'],
    });
  });

  it('reads new top-level and sub params', () => {
    expect(parseContentFiltersFromSearchParams('fe', ['react', 'nextjs'])).toEqual({
      topLevel: 'fe',
      subcategories: ['react', 'nextjs'],
    });
  });
});

describe('formatContentFilterSummary', () => {
  it('summarizes active filters', () => {
    expect(
      formatContentFilterSummary({
        topLevel: 'fe',
        subcategories: ['react'],
        difficulty: 'intermediate',
        special: ['most-asked'],
      })
    ).toBe('Frontend · React · Intermediate · Most Asked');
  });
});

describe('groupContentBySubcategorySection', () => {
  it('groups frontend browse view by subcategory', () => {
    const items = [
      { id: 'js', category: 'stack-javascript' as const },
      { id: 'web', category: 'fe-web-apis' as const },
      { id: 'react', category: 'fe-advanced' as const },
    ];
    const sections = groupContentBySubcategorySection(items, resolveTaxonomy, 'fe');
    expect(sections?.map((section) => section.subcategory)).toEqual([
      'javascript',
      'web-apis',
      'react',
    ]);
  });
});

describe('shouldGroupContentBySubcategory', () => {
  it('groups only when top level selected with no subcategory filters', () => {
    expect(shouldGroupContentBySubcategory('fe', [])).toBe(true);
    expect(shouldGroupContentBySubcategory('fe', ['react'])).toBe(false);
    expect(shouldGroupContentBySubcategory('all', [])).toBe(false);
  });
});
