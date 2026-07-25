'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useStudyPlanOptional } from '@/components/providers/StudyPlanProvider';
import { cn } from '@/lib/utils';

interface StudyPlanBadgeProps {
  variant: 'challenge' | 'lesson';
  itemId: string;
  className?: string;
  linkToPlan?: boolean;
}

export function StudyPlanBadge({
  variant,
  itemId,
  className,
  linkToPlan = false,
}: StudyPlanBadgeProps) {
  const { isSignedIn } = useAuth();
  const studyPlan = useStudyPlanOptional();

  if (!isSignedIn || !studyPlan?.loaded) return null;

  const inPlan =
    variant === 'challenge'
      ? studyPlan.isChallengeTopicInPlan(itemId)
      : studyPlan.isLessonTopicInPlan(itemId);

  if (!inPlan) return null;

  const planItemId =
    variant === 'challenge'
      ? studyPlan.getTopicPlanItemIdForChallenge(itemId)
      : studyPlan.getTopicPlanItemIdForLesson(itemId);

  const badge = (
    <span
      className={cn(
        'bg-brand/15 text-brand border border-brand/40 text-xs font-body font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1',
        className
      )}
      title="This topic is on your study plan"
    >
      📋 In study plan
    </span>
  );

  if (linkToPlan && planItemId) {
    return (
      <Link href={`/study-plan/${planItemId}`} className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    );
  }

  return badge;
}
