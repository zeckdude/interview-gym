'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CollapsibleContentFilters } from '@/components/content/CollapsibleContentFilters';
import { ContentListSections } from '@/components/content/ContentListSections';
import { ContentListToolbar } from '@/components/content/ContentListToolbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { allQuestions } from '@/data';
import { useContentFilters } from '@/hooks/useContentFilters';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import {
  getQuestionDisplayLabel,
  groupContentBySubcategorySection,
  questionMatchesContentFilters,
  resolveQuestionTaxonomy,
  shouldGroupContentBySubcategory,
} from '@/lib/categories';
import { getCuratedMostAskedForQuestion } from '@/lib/most-asked';
import type { ConceptualQuestion } from '@/data/types';

interface QuestionsListProps {
  attemptStats: Record<string, { count: number; passed: boolean }>;
}

function CategoryBadge({ category }: { category: ConceptualQuestion['category'] }) {
  const styles = {
    'be-question': 'bg-cat-be-light text-cat-be',
    'fe-question': 'bg-cat-fe-light text-cat-fe',
    'nextjs-question': 'bg-cat-nextjs-light text-cat-nextjs',
  } as const;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-body font-semibold ${styles[category]}`}
    >
      {getQuestionDisplayLabel(category)}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: ConceptualQuestion['difficulty'] }) {
  const classes = {
    easy: 'bg-easy-light text-easy',
    intermediate: 'bg-medium-light text-medium',
    advanced: 'bg-hard-light text-hard',
  };
  const labels = {
    easy: 'Easy',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-body font-semibold ${classes[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  );
}

function StatusBadge({ stats }: { stats: { count: number; passed: boolean } | undefined }) {
  if (!stats || stats.count === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-body text-text-muted">
        <span className="w-2 h-2 rounded-full bg-border-subtle inline-block" />
        Not attempted
      </span>
    );
  }
  if (stats.passed) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-body text-success font-semibold">
        <span className="w-2 h-2 rounded-full bg-success inline-block" />
        Passed ✓
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-body text-medium font-semibold">
      <span className="w-2 h-2 rounded-full bg-medium inline-block" />
      Attempted
    </span>
  );
}

export function QuestionsList({ attemptStats }: QuestionsListProps) {
  const { filters, setFilters, toggleSpecial, toggleSubcategory, clearFilters } =
    useContentFilters('/questions');
  const [search, setSearch] = useState('');
  const mostAsked = useMostAskedOptional();

  const getEffectiveMostAsked = (question: ConceptualQuestion) => {
    const curated = getCuratedMostAskedForQuestion(question);
    return mostAsked?.getEffective('question', question.id, curated) ?? {
      ...curated,
      isPersonalOverride: false,
    };
  };

  const passedCount = useMemo(
    () => allQuestions.filter((question) => attemptStats[question.id]?.passed).length,
    [attemptStats]
  );

  const filtered = useMemo(() => {
    let questions = allQuestions;

    if (filters.topLevel !== 'all' || filters.subcategories.length > 0) {
      questions = questions.filter((question) =>
        questionMatchesContentFilters(question, filters.topLevel, filters.subcategories)
      );
    }

    if (filters.difficulty !== 'all') {
      questions = questions.filter((question) => question.difficulty === filters.difficulty);
    }

    if (filters.special.includes('most-asked')) {
      questions = questions.filter((question) => getEffectiveMostAsked(question).mostAsked);
    }

    if (filters.special.includes('not-passed')) {
      questions = questions.filter((question) => !attemptStats[question.id]?.passed);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      questions = questions.filter(
        (question) =>
          question.question.toLowerCase().includes(query) ||
          question.concepts.some((concept) => concept.toLowerCase().includes(query))
      );
    }

    return questions;
  }, [filters, search, attemptStats, mostAsked]);

  const sections = useMemo(() => {
    if (!shouldGroupContentBySubcategory(filters.topLevel, filters.subcategories)) {
      return null;
    }
    return groupContentBySubcategorySection(filtered, resolveQuestionTaxonomy, filters.topLevel);
  }, [filtered, filters.topLevel, filters.subcategories]);

  const renderQuestion = (question: ConceptualQuestion) => {
    const stats = attemptStats[question.id];
    const preview =
      question.question.length > 120
        ? question.question.slice(0, 120) + '…'
        : question.question;

    const effectiveMostAsked = getEffectiveMostAsked(question);

    return (
      <Link
        href={`/questions/${question.id}`}
        className="relative block bg-bg-surface dark:bg-[#141414] border border-border-subtle dark:border-[#2A2A2A] rounded-lg p-5 hover:border-brand hover:shadow-card transition-all duration-150 group"
      >
        {effectiveMostAsked.mostAsked && (
          <span
            className="absolute top-3 right-3 bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            title={
              effectiveMostAsked.isPersonalOverride
                ? 'Marked as Most Asked by you'
                : effectiveMostAsked.reason ?? 'Commonly asked in senior interviews'
            }
          >
            🔥 Most Asked
            {effectiveMostAsked.isPersonalOverride && (
              <span className="opacity-70">· You</span>
            )}
          </span>
        )}
        <div className="flex flex-col gap-3 pr-24">
          <div className="flex items-start justify-between gap-4">
            <p className="font-body text-text-primary dark:text-[#F0EDE8] text-base leading-relaxed group-hover:text-brand transition-colors duration-150 flex-1">
              {preview}
            </p>
            <svg
              className="w-4 h-4 text-text-muted group-hover:text-brand shrink-0 mt-1 transition-colors duration-150"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={question.category} />
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="text-border-subtle dark:text-[#2A2A2A]">·</span>
            <StatusBadge stats={stats} />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <PageWrapper title="Conceptual Questions">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
              Conceptual Questions
            </h1>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0] max-w-xl">
              {allQuestions.length} questions that come up in real interviews. Write your answer,
              get instant feedback.
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle dark:border-[#2A2A2A] bg-bg-surface dark:bg-[#141414] px-5 py-4">
            <p className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              {passedCount} / {allQuestions.length}
            </p>
            <p className="font-body text-sm text-text-muted">questions passed</p>
          </div>
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
          total={allQuestions.length}
          itemLabel="questions"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search questions..."
          sort=""
          onSortChange={() => undefined}
          sortOptions={[]}
        />

        <ContentListSections
          sections={sections}
          items={filtered}
          getItemKey={(question) => question.id}
          gridClassName="space-y-3"
          renderItem={renderQuestion}
        />

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              No questions found
            </p>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0]">
              Try a different search term or filter.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
