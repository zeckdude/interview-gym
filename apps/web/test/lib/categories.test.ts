import { describe, expect, it } from 'vitest';
import {
  legacyCategoryFromTaxonomy,
  matchesContentFilters,
  parseContentFiltersFromSearchParams,
  formatContentFilterSummary,
  resolveTaxonomy,
  resolveQuestionTaxonomy,
} from '@/lib/categories';

describe('resolveTaxonomy', () => {
  it('maps legacy challenge categories', () => {
    expect(resolveTaxonomy({ category: 'be' })).toEqual({
      topLevel: 'be',
      subcategory: null,
    });
    expect(resolveTaxonomy({ category: 'fe' })).toEqual({
      topLevel: 'fe',
      subcategory: null,
    });
    expect(resolveTaxonomy({ category: 'fe-advanced' })).toEqual({
      topLevel: 'fe',
      subcategory: 'react',
    });
    expect(resolveTaxonomy({ category: 'nextjs' })).toEqual({
      topLevel: 'fe',
      subcategory: 'nextjs',
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
  const generalFe = resolveTaxonomy({ category: 'fe' });
  const nextjs = resolveTaxonomy({ category: 'nextjs' });

  it('shows all frontend when no subcategories selected', () => {
    expect(matchesContentFilters(reactLesson, 'fe', [])).toBe(true);
    expect(matchesContentFilters(generalFe, 'fe', [])).toBe(true);
    expect(matchesContentFilters(nextjs, 'fe', [])).toBe(true);
  });

  it('shows general + selected subcategories only', () => {
    expect(matchesContentFilters(reactLesson, 'fe', ['react'])).toBe(true);
    expect(matchesContentFilters(generalFe, 'fe', ['react'])).toBe(true);
    expect(matchesContentFilters(nextjs, 'fe', ['react'])).toBe(false);
  });

  it('filters by top level', () => {
    expect(matchesContentFilters(reactLesson, 'be', [])).toBe(false);
    expect(matchesContentFilters(resolveTaxonomy({ category: 'be' }), 'be', [])).toBe(true);
  });
});

describe('resolveQuestionTaxonomy', () => {
  it('maps legacy question categories', () => {
    expect(resolveQuestionTaxonomy({ category: 'fe-question' })).toEqual({
      topLevel: 'fe',
      subcategory: null,
    });
    expect(resolveQuestionTaxonomy({ category: 'nextjs-question' })).toEqual({
      topLevel: 'fe',
      subcategory: 'nextjs',
    });
  });
});

describe('legacyCategoryFromTaxonomy', () => {
  it('round-trips known legacy buckets', () => {
    expect(legacyCategoryFromTaxonomy({ topLevel: 'be', subcategory: null })).toBe('be');
    expect(legacyCategoryFromTaxonomy({ topLevel: 'fe', subcategory: null })).toBe('fe');
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
