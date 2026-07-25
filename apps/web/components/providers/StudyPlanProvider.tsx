'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import type { ResolvedStudyPlanItem } from '@/lib/study-plan';
import {
  getTopicPlanItemIdForChallenge,
  getTopicPlanItemIdForLesson,
  isChallengeTopicInPlan,
  isLessonTopicInPlan,
  studyPlanItemKey,
  type StudyPlanItemType,
  type StudyPlanSource,
} from '@/lib/study-plan';

interface StudyPlanContextValue {
  loaded: boolean;
  items: ResolvedStudyPlanItem[];
  isInPlan: (itemType: StudyPlanItemType, itemId: string) => boolean;
  isChallengeTopicInPlan: (challengeId: string) => boolean;
  isLessonTopicInPlan: (lessonId: string) => boolean;
  getPlanItemId: (itemType: StudyPlanItemType, itemId: string) => string | null;
  getTopicPlanItemIdForChallenge: (challengeId: string) => string | null;
  getTopicPlanItemIdForLesson: (lessonId: string) => string | null;
  addToPlan: (
    itemType: StudyPlanItemType,
    itemId: string,
    source: StudyPlanSource
  ) => Promise<boolean>;
  removeFromPlan: (planItemId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const StudyPlanContext = createContext<StudyPlanContextValue | null>(null);

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<ResolvedStudyPlanItem[]>([]);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setItems([]);
      setLoaded(true);
      return;
    }

    try {
      const res = await fetch('/api/study-plan');
      if (!res.ok) {
        setLoaded(true);
        return;
      }
      const data = (await res.json()) as { items: ResolvedStudyPlanItem[] };
      setItems(data.items ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, [isSignedIn]);

  useEffect(() => {
    setLoaded(false);
    refresh();
  }, [refresh]);

  const planKeys = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) {
      map.set(studyPlanItemKey(item.itemType, item.itemId), item.id);
    }
    return map;
  }, [items]);

  const planKeySet = useMemo(() => new Set(planKeys.keys()), [planKeys]);

  const isInPlan = useCallback(
    (itemType: StudyPlanItemType, itemId: string) => {
      return planKeys.has(studyPlanItemKey(itemType, itemId));
    },
    [planKeys]
  );

  const isChallengeTopicInPlanFn = useCallback(
    (challengeId: string) => isChallengeTopicInPlan(challengeId, planKeySet),
    [planKeySet]
  );

  const isLessonTopicInPlanFn = useCallback(
    (lessonId: string) => isLessonTopicInPlan(lessonId, planKeySet),
    [planKeySet]
  );

  const getPlanItemId = useCallback(
    (itemType: StudyPlanItemType, itemId: string) => {
      return planKeys.get(studyPlanItemKey(itemType, itemId)) ?? null;
    },
    [planKeys]
  );

  const getTopicPlanItemIdForChallengeFn = useCallback(
    (challengeId: string) => getTopicPlanItemIdForChallenge(challengeId, planKeys),
    [planKeys]
  );

  const getTopicPlanItemIdForLessonFn = useCallback(
    (lessonId: string) => getTopicPlanItemIdForLesson(lessonId, planKeys),
    [planKeys]
  );

  const addToPlan = useCallback(
    async (itemType: StudyPlanItemType, itemId: string, source: StudyPlanSource) => {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemId, source }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { item?: ResolvedStudyPlanItem };
      if (data.item) {
        setItems((current) => {
          const without = current.filter((item) => item.id !== data.item!.id);
          return [...without, data.item!].sort((a, b) => a.sortOrder - b.sortOrder);
        });
      } else {
        await refresh();
      }
      return true;
    },
    [refresh]
  );

  const removeFromPlan = useCallback(async (planItemId: string) => {
    setItems((current) => current.filter((item) => item.id !== planItemId));
    const res = await fetch('/api/study-plan', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: planItemId }),
    });
    if (!res.ok) {
      await refresh();
      return false;
    }
    return true;
  }, [refresh]);

  const value = useMemo(
    () => ({
      loaded,
      items,
      isInPlan,
      isChallengeTopicInPlan: isChallengeTopicInPlanFn,
      isLessonTopicInPlan: isLessonTopicInPlanFn,
      getPlanItemId,
      getTopicPlanItemIdForChallenge: getTopicPlanItemIdForChallengeFn,
      getTopicPlanItemIdForLesson: getTopicPlanItemIdForLessonFn,
      addToPlan,
      removeFromPlan,
      refresh,
    }),
    [
      loaded,
      items,
      isInPlan,
      isChallengeTopicInPlanFn,
      isLessonTopicInPlanFn,
      getPlanItemId,
      getTopicPlanItemIdForChallengeFn,
      getTopicPlanItemIdForLessonFn,
      addToPlan,
      removeFromPlan,
      refresh,
    ]
  );

  return <StudyPlanContext.Provider value={value}>{children}</StudyPlanContext.Provider>;
}

export function useStudyPlan() {
  const context = useContext(StudyPlanContext);
  if (!context) {
    throw new Error('useStudyPlan must be used within StudyPlanProvider');
  }
  return context;
}

export function useStudyPlanOptional() {
  return useContext(StudyPlanContext);
}
