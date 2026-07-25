'use client';

import { useState } from 'react';
import { useStudyPlanOptional } from '@/components/providers/StudyPlanProvider';
import type { StudyPlanItemType, StudyPlanSource } from '@/lib/study-plan';

interface StudyPlanQuickAddProps {
  itemType: StudyPlanItemType;
  itemId: string;
  source: StudyPlanSource;
  className?: string;
}

export function StudyPlanQuickAdd({
  itemType,
  itemId,
  source,
  className,
}: StudyPlanQuickAddProps) {
  const studyPlan = useStudyPlanOptional();
  const [pending, setPending] = useState(false);

  if (!studyPlan) return null;

  const inPlan =
    itemType === 'challenge'
      ? studyPlan.isChallengeTopicInPlan(itemId)
      : itemType === 'lesson'
        ? studyPlan.isLessonTopicInPlan(itemId)
        : studyPlan.isInPlan(itemType, itemId);

  return (
    <button
      type="button"
      disabled={pending || inPlan}
      onClick={async () => {
        setPending(true);
        try {
          await studyPlan.addToPlan(itemType, itemId, source);
        } finally {
          setPending(false);
        }
      }}
      className={className}
    >
      {inPlan ? 'In study plan ✓' : pending ? 'Adding…' : '+ Add to study plan'}
    </button>
  );
}
