'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentProgressSummary } from '@/components/content/ContentProgressSummary';
import { StudyPlanPicker } from '@/components/study-plan/StudyPlanPicker';
import { useStudyPlan } from '@/components/providers/StudyPlanProvider';
import { getSourceLabel } from '@/lib/study-plan';
import { cn } from '@/lib/utils';

export function StudyPlanListClient() {
  const { items, loaded, removeFromPlan } = useStudyPlan();
  const [pickerOpen, setPickerOpen] = useState(false);

  const completedCount = useMemo(
    () => items.filter((item) => item.completed).length,
    [items]
  );

  return (
    <PageWrapper title="Study Plan">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
              Study Plan
            </h1>
            <p className="font-body text-text-secondary dark:text-[#AAA5A0] max-w-xl">
              Topics you want to focus on — with clear links to the lesson and challenge for each.
            </p>
          </div>
          <ContentProgressSummary
            completed={completedCount}
            total={items.length}
            label="topics completed"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="font-body text-sm text-text-secondary">
            {loaded ? (
              <>
                Showing <span className="font-semibold text-text-primary">{items.length}</span>{' '}
                {items.length === 1 ? 'topic' : 'topics'}
              </>
            ) : (
              'Loading your plan…'
            )}
          </p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-4 py-2 rounded-md bg-brand text-white font-body text-sm font-semibold shadow-brand hover:opacity-90 transition-opacity"
          >
            + Add topic
          </button>
        </div>

        {items.length === 0 && loaded ? (
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-8 text-center space-y-4">
            <p className="font-display font-bold text-xl text-text-primary">
              Your study plan is empty
            </p>
            <p className="font-body text-sm text-text-secondary max-w-md mx-auto">
              Add topics from any challenge or lesson page using the ⋯ menu, or pick from existing
              content here.
            </p>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-5 py-2.5 rounded-md bg-brand text-white font-body font-semibold"
            >
              Add your first topic
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border-subtle bg-bg-surface p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'text-xs font-body font-semibold px-2.5 py-1 rounded-sm',
                          item.completed
                            ? 'bg-success-light text-success'
                            : 'bg-bg-subtle text-text-secondary'
                        )}
                      >
                        {item.completed ? 'Completed ✓' : 'In progress'}
                      </span>
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-bg-subtle text-text-secondary">
                        {getSourceLabel(item.source)}
                      </span>
                      {item.difficulty && (
                        <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-bg-subtle text-text-secondary capitalize">
                          {item.difficulty}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/study-plan/${item.id}`}
                      className="block font-display font-bold text-lg text-text-primary hover:text-brand transition-colors leading-snug"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromPlan(item.id)}
                    className="font-body text-xs font-semibold text-text-muted hover:text-error transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {item.lessonHref && (
                    <Link
                      href={item.lessonHref}
                      className={cn(
                        'px-4 py-2 rounded-md font-body text-sm font-semibold border transition-colors',
                        item.lessonCompleted
                          ? 'border-success/30 bg-success-light text-success'
                          : 'border-border-subtle bg-bg-subtle text-text-primary hover:border-brand hover:text-brand'
                      )}
                    >
                      {item.lessonCompleted ? '✓ ' : ''}Lesson
                    </Link>
                  )}
                  {item.challengeHref && (
                    <Link
                      href={item.challengeHref}
                      className={cn(
                        'px-4 py-2 rounded-md font-body text-sm font-semibold border transition-colors',
                        item.challengePassed
                          ? 'border-success/30 bg-success-light text-success'
                          : 'border-border-subtle bg-bg-subtle text-text-primary hover:border-brand hover:text-brand'
                      )}
                    >
                      {item.challengePassed ? '✓ ' : ''}Challenge
                    </Link>
                  )}
                  <Link
                    href={`/study-plan/${item.id}`}
                    className="px-4 py-2 rounded-md font-body text-sm font-semibold text-brand hover:bg-brand-light transition-colors"
                  >
                    Study with AI →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <StudyPlanPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </PageWrapper>
  );
}
