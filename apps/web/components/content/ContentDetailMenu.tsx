'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MostAskedBadge } from '@/components/content/MostAskedMenu';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { useStudyPlanOptional } from '@/components/providers/StudyPlanProvider';
import type { CuratedMostAsked, MostAskedItemType } from '@/lib/most-asked';
import type { StudyPlanItemType, StudyPlanSource } from '@/lib/study-plan';
import { cn } from '@/lib/utils';

interface ContentDetailMenuProps {
  className?: string;
  mostAsked?: {
    itemType: MostAskedItemType;
    itemId: string;
    curated: CuratedMostAsked;
  };
  studyPlan?: {
    itemType: StudyPlanItemType;
    itemId: string;
    source: StudyPlanSource;
  };
}

export function ContentDetailMenu({ className, mostAsked, studyPlan }: ContentDetailMenuProps) {
  const { isSignedIn } = useAuth();
  const mostAskedCtx = useMostAskedOptional();
  const studyPlanCtx = useStudyPlanOptional();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!isSignedIn || (!mostAsked && !studyPlan)) return null;
  if (mostAsked && !mostAskedCtx && studyPlan && !studyPlanCtx) return null;

  const effectiveMostAsked = mostAsked
    ? mostAskedCtx?.getEffective(mostAsked.itemType, mostAsked.itemId, mostAsked.curated) ?? {
        ...mostAsked.curated,
        isPersonalOverride: false,
      }
    : null;

  const inPlan = studyPlan
    ? studyPlan.itemType === 'challenge'
      ? (studyPlanCtx?.isChallengeTopicInPlan(studyPlan.itemId) ?? false)
      : studyPlan.itemType === 'lesson'
        ? (studyPlanCtx?.isLessonTopicInPlan(studyPlan.itemId) ?? false)
        : (studyPlanCtx?.isInPlan(studyPlan.itemType, studyPlan.itemId) ?? false)
    : false;

  const planItemId = studyPlan
    ? studyPlan.itemType === 'challenge'
      ? (studyPlanCtx?.getTopicPlanItemIdForChallenge(studyPlan.itemId) ?? null)
      : studyPlan.itemType === 'lesson'
        ? (studyPlanCtx?.getTopicPlanItemIdForLesson(studyPlan.itemId) ?? null)
        : (studyPlanCtx?.getPlanItemId(studyPlan.itemType, studyPlan.itemId) ?? null)
    : null;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-8 h-8 rounded-md border border-border-subtle bg-bg-subtle text-text-secondary hover:text-text-primary hover:border-brand/40 transition-colors font-body text-lg leading-none"
      >
        ⋯
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 min-w-[240px] rounded-lg border border-border-subtle bg-bg-surface shadow-modal p-2 space-y-1"
        >
          {mostAsked && mostAskedCtx && effectiveMostAsked && (
            <>
              {mostAsked.curated.reason &&
                effectiveMostAsked.mostAsked &&
                !effectiveMostAsked.isPersonalOverride && (
                  <p className="font-body text-xs text-text-secondary px-3 py-2 border-b border-border-subtle mb-1 leading-relaxed">
                    {mostAsked.curated.reason}
                  </p>
                )}

              {!effectiveMostAsked.mostAsked ? (
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle"
                  onClick={async () => {
                    await mostAskedCtx.setMostAsked(mostAsked.itemType, mostAsked.itemId, true);
                    setOpen(false);
                  }}
                >
                  Mark as Most Asked
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle"
                  onClick={async () => {
                    await mostAskedCtx.setMostAsked(mostAsked.itemType, mostAsked.itemId, false);
                    setOpen(false);
                  }}
                >
                  Remove Most Asked
                </button>
              )}

              {mostAskedCtx.hasOverride(mostAsked.itemType, mostAsked.itemId) && (
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-secondary hover:bg-bg-subtle"
                  onClick={async () => {
                    await mostAskedCtx.resetMostAsked(mostAsked.itemType, mostAsked.itemId);
                    setOpen(false);
                  }}
                >
                  Reset Most Asked to default
                </button>
              )}
            </>
          )}

          {mostAsked && studyPlan && studyPlanCtx && (
            <div className="border-t border-border-subtle my-1" />
          )}

          {studyPlan && studyPlanCtx && (
            <>
              {!inPlan ? (
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle"
                  onClick={async () => {
                    await studyPlanCtx.addToPlan(
                      studyPlan.itemType,
                      studyPlan.itemId,
                      studyPlan.source
                    );
                    setOpen(false);
                  }}
                >
                  Add to study plan
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle"
                  onClick={async () => {
                    if (planItemId) await studyPlanCtx.removeFromPlan(planItemId);
                    setOpen(false);
                  }}
                >
                  Remove from study plan
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export { MostAskedBadge };
