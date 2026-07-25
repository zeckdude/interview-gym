'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { MiniChallengePanel } from '@/components/lessons/MiniChallengePanel';
import { LessonStepRenderer } from '@/components/lessons/LessonStepRenderer';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { ContentDetailMenu, MostAskedBadge } from '@/components/content/ContentDetailMenu';
import { StudyPlanBadge } from '@/components/study-plan/StudyPlanBadge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useBadgeCelebrationOptional } from '@/components/providers/BadgeCelebrationProvider';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getChallengeById } from '@/data';
import { getLessonById } from '@/data/lessons';
import { useContentFilterQuery } from '@/hooks/useContentFilterQuery';
import { buildChallengePath, buildListPath } from '@/lib/content-filter-url';
import { getCuratedMostAskedForLesson } from '@/lib/most-asked';
import type { LessonProgressRecord } from '@/data/lessons';
import { cn } from '@/lib/utils';

interface LessonRunnerProps {
  lessonId: string;
  initialProgress: LessonProgressRecord | null;
}

export function LessonRunner({ lessonId, initialProgress }: LessonRunnerProps) {
  const lesson = getLessonById(lessonId);
  const filterQuery = useContentFilterQuery();
  const mostAskedCtx = useMostAskedOptional();
  const totalSteps = lesson?.steps.length ?? 0;
  const badgeCelebration = useBadgeCelebrationOptional();

  const [progress, setProgress] = useState(initialProgress);
  const [visibleSteps, setVisibleSteps] = useState(
    initialProgress?.miniChallengePassed ? totalSteps : Math.min(1, totalSteps)
  );

  const handlePassed = useCallback(
    async (timeSpentMs: number) => {
      if (!lesson) return;

      setVisibleSteps(totalSteps + 1);

      try {
        const res = await fetch('/api/lessons/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            miniChallengePassed: true,
            timeSpentMs,
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as {
            progress: LessonProgressRecord;
            newBadges?: Array<{ slug: string; name: string; emoji: string; description: string }>;
          };
          setProgress(data.progress);
          if (data.newBadges?.length) {
            badgeCelebration?.showBadges(data.newBadges);
          }
        }
      } catch {
        setProgress((prev) => ({
          lessonId: lesson.id,
          completed: true,
          miniChallengePassed: true,
          bestTimeMs: prev?.bestTimeMs
            ? Math.min(prev.bestTimeMs, timeSpentMs)
            : timeSpentMs,
          attempts: (prev?.attempts ?? 0) + 1,
          lastAttemptAt: new Date().toISOString(),
        }));
      }
    },
    [lesson, totalSteps]
  );

  if (!lesson) {
    return null;
  }

  const curatedMostAsked = getCuratedMostAskedForLesson(lesson);
  const effectiveMostAsked =
    mostAskedCtx?.getEffective('lesson', lesson.id, curatedMostAsked) ?? {
      ...curatedMostAsked,
      isPersonalOverride: false,
    };

  const progressPercent = Math.round(
    ((Math.min(visibleSteps, totalSteps) + (progress?.miniChallengePassed ? 1 : 0)) /
      (totalSteps + 1)) *
      100
  );

  const relatedChallenges = lesson.relatedChallengeIds
    .map((id) => getChallengeById(id))
    .filter(Boolean);

  return (
    <PageWrapper title={lesson.title}>
      <div className="max-w-3xl mx-auto space-y-8">
        <ContentBreadcrumbs
          items={[
            { label: 'Lessons', href: buildListPath('/lessons', filterQuery) },
            { label: lesson.title },
          ]}
        />

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge type="category" value={lesson.category} />
              <Badge type="difficulty" value={lesson.difficulty} />
              <StudyPlanBadge variant="lesson" itemId={lesson.id} linkToPlan />
              <MostAskedBadge
                mostAsked={effectiveMostAsked.mostAsked}
                isPersonalOverride={effectiveMostAsked.isPersonalOverride}
                reason={effectiveMostAsked.reason}
              />
              <span className="font-body text-sm text-text-muted">
                {lesson.estimatedMinutes} min read
              </span>
            </div>
            <ContentDetailMenu
              mostAsked={{
                itemType: 'lesson',
                itemId: lesson.id,
                curated: curatedMostAsked,
              }}
              studyPlan={{
                itemType: 'lesson',
                itemId: lesson.id,
                source: 'lesson',
              }}
            />
          </div>
          <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] leading-tight">
            {lesson.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {lesson.concepts.map((concept) => (
              <span
                key={concept}
                className="font-body text-sm bg-bg-subtle text-text-secondary px-3 py-1 rounded-full"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between font-body text-sm text-text-muted">
            <span>
              Step {Math.min(visibleSteps, totalSteps)} of {totalSteps}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-10">
          {lesson.steps.slice(0, visibleSteps).map((step, index) => (
            <div key={`${step.type}-${index}`}>
              <LessonStepRenderer step={step} stepNumber={index + 1} />
              {index === visibleSteps - 1 && visibleSteps < totalSteps && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleSteps((v) => v + 1)}
                    className="px-5 py-2.5 bg-brand text-white font-body font-semibold rounded-md shadow-brand hover:opacity-90 transition-opacity"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mini challenge — shown after all steps read OR if already passed */}
        {(visibleSteps >= totalSteps || progress?.miniChallengePassed) && (
          <MiniChallengePanel
            challenge={lesson.miniChallenge}
            relatedChallengeId={lesson.relatedChallengeIds[0]}
            onPassed={handlePassed}
            bestTimeMs={progress?.bestTimeMs ?? null}
          />
        )}

        {/* Related challenges */}
        {relatedChallenges.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              Related Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedChallenges.map((challenge) =>
                challenge ? (
                  <Link key={challenge.id} href={buildChallengePath(challenge.id, filterQuery)}>
                    <Card className="hover:shadow-raised hover:border-brand/30 transition-all cursor-pointer h-full">
                      <Badge type="category" value={challenge.category} />
                      <h3 className="font-display font-bold text-base text-text-primary dark:text-[#F0EDE8] mt-3">
                        {challenge.title}
                      </h3>
                      <p className="font-body text-sm text-brand mt-2">Start challenge →</p>
                    </Card>
                  </Link>
                ) : null
              )}
            </div>
          </section>
        )}

        {/* MDN links */}
        <section className="space-y-4 pb-8">
          <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
            Further Reading
          </h2>
          <div className="flex flex-wrap gap-3">
            {lesson.mdnLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-3 rounded-lg',
                  'bg-bg-subtle border border-border-subtle dark:border-[#2A2A2A]',
                  'font-body text-sm font-semibold text-text-primary dark:text-[#F0EDE8]',
                  'hover:border-brand hover:text-brand transition-colors'
                )}
              >
                {link.label}
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
