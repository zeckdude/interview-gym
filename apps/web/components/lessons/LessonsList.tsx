'use client';

import { useMemo, useState } from 'react';
import { CollapsibleContentFilters } from '@/components/content/CollapsibleContentFilters';
import { ContentListSections } from '@/components/content/ContentListSections';
import { ContentListToolbar } from '@/components/content/ContentListToolbar';
import { ContentProgressSummary } from '@/components/content/ContentProgressSummary';
import { LessonCard } from '@/components/lessons/LessonCard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { allLessons } from '@/data/lessons';
import { useContentFilters } from '@/hooks/useContentFilters';
import { useContentFilterQuery } from '@/hooks/useContentFilterQuery';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { compareJavascriptCurriculum, getCurriculumSortLabel } from '@/lib/curriculum';
import { groupContentBySubcategorySection, lessonMatchesContentFilters, resolveTaxonomy, shouldGroupContentBySubcategory } from '@/lib/categories';
import { getCuratedMostAskedForLesson } from '@/lib/most-asked';
import type { ChallengeDifficulty } from '@/data/types';
import type { LessonProgressRecord } from '@/data/lessons';

type SortOption = 'curriculum' | 'difficulty-asc' | 'difficulty-desc' | 'most-attempted' | 'least-attempted' | 'az';

const DIFFICULTY_ORDER: Record<ChallengeDifficulty, number> = {
  easy: 0,
  intermediate: 1,
  advanced: 2,
};

const BASE_SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'curriculum', label: 'Learning path (recommended)' },
  { value: 'difficulty-asc', label: 'Difficulty (easy first)' },
  { value: 'difficulty-desc', label: 'Difficulty (advanced first)' },
  { value: 'most-attempted', label: 'Most Attempted' },
  { value: 'least-attempted', label: 'Least Attempted' },
  { value: 'az', label: 'A–Z' },
];

interface LessonsListProps {
  progressMap: Record<string, LessonProgressRecord>;
}

export function LessonsList({ progressMap }: LessonsListProps) {
  const { filters, setFilters, toggleSpecial, toggleSubcategory, clearFilters } =
    useContentFilters('/lessons');
  const filterQuery = useContentFilterQuery();
  const mostAsked = useMostAskedOptional();

  const getEffectiveMostAsked = (lesson: (typeof allLessons)[number]) => {
    const curated = getCuratedMostAskedForLesson(lesson);
    return mostAsked?.getEffective('lesson', lesson.id, curated) ?? {
      ...curated,
      isPersonalOverride: false,
    };
  };
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('curriculum');

  const sortOptions = useMemo(
    () =>
      BASE_SORT_OPTIONS.map((option) =>
        option.value === 'curriculum'
          ? { ...option, label: getCurriculumSortLabel(filters.topLevel, filters.subcategories) }
          : option
      ),
    [filters.topLevel, filters.subcategories]
  );

  const completedCount = useMemo(
    () => allLessons.filter((lesson) => progressMap[lesson.id]?.completed).length,
    [progressMap]
  );

  const filtered = useMemo(() => {
    let lessons = allLessons;

    if (filters.topLevel !== 'all' || filters.subcategories.length > 0) {
      lessons = lessons.filter((lesson) =>
        lessonMatchesContentFilters(lesson, filters.topLevel, filters.subcategories)
      );
    }

    if (filters.difficulty !== 'all') {
      lessons = lessons.filter((lesson) => lesson.difficulty === filters.difficulty);
    }

    if (filters.special.includes('most-asked')) {
      lessons = lessons.filter((lesson) => getEffectiveMostAsked(lesson).mostAsked);
    }

    if (filters.special.includes('not-passed')) {
      lessons = lessons.filter((lesson) => !progressMap[lesson.id]?.completed);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      lessons = lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(query) ||
          lesson.concepts.some((concept) => concept.toLowerCase().includes(query))
      );
    }

    const sorted = [...lessons];
    switch (sort) {
      case 'curriculum':
        sorted.sort(compareJavascriptCurriculum);
        break;
      case 'difficulty-asc':
        sorted.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
        break;
      case 'difficulty-desc':
        sorted.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
        break;
      case 'most-attempted':
        sorted.sort(
          (a, b) => (progressMap[b.id]?.attempts ?? 0) - (progressMap[a.id]?.attempts ?? 0)
        );
        break;
      case 'least-attempted':
        sorted.sort(
          (a, b) => (progressMap[a.id]?.attempts ?? 0) - (progressMap[b.id]?.attempts ?? 0)
        );
        break;
      case 'az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sorted;
  }, [filters, search, sort, progressMap, mostAsked]);

  const sections = useMemo(() => {
    if (!shouldGroupContentBySubcategory(filters.topLevel, filters.subcategories)) {
      return null;
    }
    return groupContentBySubcategorySection(filtered, resolveTaxonomy, filters.topLevel);
  }, [filtered, filters.topLevel, filters.subcategories]);

  return (
    <PageWrapper title="Lessons">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
              Lessons
            </h1>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0] max-w-xl">
              Learn the concept, then prove it in a timed mini-challenge. No penalties — just reps
              that build real interview confidence.
            </p>
          </div>
          <ContentProgressSummary
            completed={completedCount}
            total={allLessons.length}
            label="lessons completed"
          />
        </div>

        <div className="rounded-xl border-l-4 border-brand bg-brand/10 p-4 space-y-2">
          <p className="font-display font-bold text-lg text-text-primary">
            Advanced follow-up lessons
          </p>
          <p className="font-body text-base text-text-primary">
            These lessons assume solid JavaScript fundamentals. For the best experience, work
            through the{' '}
            <a href="/" className="text-brand font-semibold hover:underline">
              Modern JavaScript learn path
            </a>{' '}
            first — especially before intermediate and advanced topics here.
          </p>
        </div>

        <CollapsibleContentFilters
          filters={filters}
          setFilters={setFilters}
          toggleSpecial={toggleSpecial}
          toggleSubcategory={toggleSubcategory}
          clearFilters={clearFilters}
          specialFilters={['most-asked', 'not-passed']}
        />

        <ContentListToolbar
          showing={filtered.length}
          total={allLessons.length}
          itemLabel="lessons"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title or concept..."
          sort={sort}
          onSortChange={(value) => setSort(value as SortOption)}
          sortOptions={sortOptions}
        />

        <ContentListSections
          sections={sections}
          items={filtered}
          getItemKey={(lesson) => lesson.id}
          renderItem={(lesson) => {
            const effectiveMostAsked = getEffectiveMostAsked(lesson);
            return (
              <LessonCard
                lesson={lesson}
                progress={progressMap[lesson.id] ?? null}
                filterQuery={filterQuery}
                showMostAsked={effectiveMostAsked.mostAsked}
                mostAskedIsPersonal={effectiveMostAsked.isPersonalOverride}
                mostAskedReason={effectiveMostAsked.reason}
              />
            );
          }}
        />

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              No lessons found
            </p>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0]">
              Try a different filter or search term.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
