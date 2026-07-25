'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useStudyPlan } from '@/components/providers/StudyPlanProvider';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import { getSourceLabel, type ResolvedStudyPlanItem } from '@/lib/study-plan';
import { cn } from '@/lib/utils';

interface StudyPlanDetailClientProps {
  planItemId: string;
}

export function StudyPlanDetailClient({ planItemId }: StudyPlanDetailClientProps) {
  const router = useRouter();
  const { removeFromPlan } = useStudyPlan();
  const { setChallengeCtx, openChat } = useRightPanel();
  const [item, setItem] = useState<ResolvedStudyPlanItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/study-plan/${planItemId}`);
        if (!res.ok) {
          if (!cancelled) setError('Topic not found.');
          return;
        }
        const data = (await res.json()) as { item: ResolvedStudyPlanItem };
        if (!cancelled) setItem(data.item);
      } catch {
        if (!cancelled) setError('Failed to load study plan topic.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [planItemId]);

  const launchAi = () => {
    if (!item) return;

    const chatChallengeId = item.challengeId ?? item.lessonId ?? item.itemId;

    setChallengeCtx({
      challengeId: chatChallengeId,
      title: item.title,
      description: item.description,
      currentCode: '',
      language: 'typescript',
    });

    openChat(
      `I'm studying "${item.title}" as part of my study plan. Key concepts: ${item.concepts.join(', ')}. Help me prepare for interview questions on this topic.`
    );
  };

  if (loading) {
    return (
      <PageWrapper title="Study Plan">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !item) {
    return (
      <PageWrapper title="Study Plan">
        <div className="text-center py-20 space-y-4">
          <p className="font-body text-base text-text-primary">{error ?? 'Topic not found.'}</p>
          <Link href="/study-plan">
            <Button variant="secondary">Back to Study Plan</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={item.title}>
      <div className="max-w-3xl mx-auto space-y-8">
        <ContentBreadcrumbs
          items={[
            { label: 'Study Plan', href: '/study-plan' },
            { label: item.title },
          ]}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'text-xs font-body font-semibold px-2.5 py-1 rounded-sm',
                item.completed ? 'bg-success-light text-success' : 'bg-brand-light text-brand'
              )}
            >
              {item.completed ? 'Completed ✓' : 'In progress'}
            </span>
            <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-bg-subtle text-text-secondary">
              {getSourceLabel(item.source)}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl text-text-primary leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {item.concepts.map((concept) => (
              <span
                key={concept}
                className="font-body text-sm bg-bg-subtle text-text-secondary px-3 py-1 rounded-full"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-brand/30 bg-brand-light p-4 space-y-3">
          <h2 className="font-display font-semibold text-base text-text-primary">
            What to do next
          </h2>
          <div className="flex flex-wrap gap-3">
            {item.lessonHref && (
              <Link
                href={item.lessonHref}
                className="px-4 py-2.5 rounded-md bg-bg-surface border border-border-subtle font-body text-sm font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors"
              >
                {item.lessonCompleted ? '✓ ' : ''}Go to lesson
              </Link>
            )}
            {item.challengeHref && (
              <Link
                href={item.challengeHref}
                className="px-4 py-2.5 rounded-md bg-bg-surface border border-border-subtle font-body text-sm font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors"
              >
                {item.challengePassed ? '✓ ' : ''}Go to challenge
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-surface p-5 space-y-4">
          <h2 className="font-display font-semibold text-lg text-text-primary">Progress</h2>
          <ul className="space-y-2 font-body text-sm text-text-primary">
            {item.lessonHref && (
              <li className="flex items-center gap-2">
                <span>{item.lessonCompleted ? '✅' : '⬜'}</span>
                Lesson {item.lessonCompleted ? 'completed' : 'not completed'}
              </li>
            )}
            {item.challengeHref && (
              <li className="flex items-center gap-2">
                <span>{item.challengePassed ? '✅' : '⬜'}</span>
                Challenge {item.challengePassed ? 'passed' : 'not passed'}
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={launchAi}>💬 Study with AI</Button>
          <button
            type="button"
            onClick={async () => {
              await removeFromPlan(item.id);
              router.push('/study-plan');
            }}
            className="px-4 py-2.5 rounded-md font-body text-sm font-semibold text-text-secondary hover:text-error transition-colors"
          >
            Remove from plan
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
