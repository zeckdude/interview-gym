'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import { PLAYBOOK_CATEGORIES, type PlaybookCategoryId } from '@/lib/playbook/categories';
import { PlaybookOnboardingModal } from './PlaybookOnboardingModal';
import { PlaybookEntryCard } from './PlaybookEntryCard';
import { ProfileGoalsView } from './ProfileGoalsView';
import { LaunchSimulatedInterviewModal } from './LaunchSimulatedInterviewModal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type PageMode = 'entries' | 'profile';

interface PlaybookData {
  profile: {
    onboardingComplete: boolean;
    linkedInUrl?: string | null;
    linkedInText?: string | null;
    resumeText?: string | null;
    portfolioUrl?: string | null;
    githubUrl?: string | null;
    personalWebsite?: string | null;
    additionalContext?: string | null;
  };
  criteria: Record<string, unknown> | null;
  entries: Array<{
    id: string;
    category: string;
    title: string;
    summary: string | null;
    questionPrompt: string | null;
    isSeeded: boolean;
    subsections: Array<{
      id: string;
      label: string;
      textContent: string | null;
      transcript: string | null;
    }>;
  }>;
  questions: Array<{
    id: string;
    category: string;
    questionText: string;
    mostAsked: boolean;
  }>;
}

export function PlaybookClient() {
  const { openPlaybookChat } = useRightPanel();
  const { data, mutate, isLoading } = useSWR<PlaybookData>('/api/playbook', fetcher);
  const [pageMode, setPageMode] = useState<PageMode>('entries');
  const [activeCategory, setActiveCategory] = useState<PlaybookCategoryId | 'all'>('all');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  useEffect(() => {
    if (data?.profile && !data.profile.onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [data?.profile]);

  const saveProfile = async (profileData: Record<string, unknown>) => {
    await fetch('/api/playbook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    setShowOnboarding(false);
    void mutate();
  };

  const saveCriteria = async (criteriaData: {
    targetRoles: string[];
    targetCompanyStage: string[];
    targetIndustries: string[];
    preferredStack: string[];
    locationPreference: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    mustHaves: string[];
    dealBreakers: string[];
    additionalNotes: string | null;
  }) => {
    await fetch('/api/playbook/criteria', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteriaData),
    });
    void mutate();
  };

  const filteredEntries =
    activeCategory === 'all'
      ? (data?.entries ?? [])
      : (data?.entries ?? []).filter((e) => e.category === activeCategory);

  const categoryDef =
    activeCategory !== 'all' ? PLAYBOOK_CATEGORIES.find((c) => c.id === activeCategory) : null;

  const categoryQuestions = useMemo(() => {
    if (activeCategory === 'all') return [];
    return (data?.questions ?? [])
      .filter((q) => q.category === activeCategory)
      .map((q) => q.questionText);
  }, [data?.questions, activeCategory]);

  const profileSummary = useMemo(() => {
    const c = data?.criteria as {
      targetRoles?: string[];
      locationPreference?: string | null;
    } | null;
    if (!c?.targetRoles?.length && !c?.locationPreference) return null;
    const parts = [];
    if (c.targetRoles?.length) parts.push(c.targetRoles.slice(0, 2).join(', '));
    if (c.locationPreference) parts.push(c.locationPreference);
    return parts.join(' · ');
  }, [data?.criteria]);

  const handleAddEntry = () => {
    if (activeCategory === 'all' || !categoryDef) return;

    openPlaybookChat({
      sessionKey: `new-${activeCategory}`,
      intent: 'add-entry',
      entryId: null,
      entryTitle: 'New Entry',
      category: activeCategory,
      categoryLabel: categoryDef.label,
      questionPrompt: null,
      currentSubsection: null,
      currentSubsectionId: null,
      subsections:
        categoryDef.subsectionTemplate?.map((s) => ({
          id: s.id,
          label: s.label,
          textContent: null,
        })) ?? [],
      suggestedQuestions: categoryQuestions,
      onSaved: () => void mutate(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const profile = data?.profile ?? {
    onboardingComplete: false,
    linkedInUrl: null,
    linkedInText: null,
    resumeText: null,
    portfolioUrl: null,
    githubUrl: null,
    personalWebsite: null,
    additionalContext: null,
  };

  return (
    <div className="space-y-8">
      {showOnboarding && (
        <PlaybookOnboardingModal
          onSave={saveProfile}
          onSkip={() => void saveProfile({ onboardingComplete: false })}
        />
      )}

      {showLaunchModal && data && (
        <LaunchSimulatedInterviewModal
          entries={data.entries}
          onClose={() => setShowLaunchModal(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-display font-bold text-3xl text-text-primary">My Playbook</h1>
          <p className="font-body text-base text-text-primary leading-relaxed max-w-2xl">
            Everything true and compelling about you, organized so you can access any part of it
            instantly.
          </p>
          {profileSummary && pageMode === 'entries' && (
            <p className="font-body text-sm text-text-muted">
              🎯 {profileSummary}
              <button
                type="button"
                onClick={() => setPageMode('profile')}
                className="ml-2 text-brand hover:underline"
              >
                Edit goals →
              </button>
            </p>
          )}
        </div>

        {pageMode === 'entries' && (
          <Button onClick={() => setShowLaunchModal(true)} className="shrink-0">
            🎯 Launch Simulated Interview
          </Button>
        )}
      </div>

      <div className="flex gap-2 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setPageMode('entries')}
          className={`px-4 py-3 font-body text-sm font-semibold border-b-2 transition-colors ${
            pageMode === 'entries'
              ? 'border-brand text-brand'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          📋 My Entries
        </button>
        <button
          type="button"
          onClick={() => setPageMode('profile')}
          className={`px-4 py-3 font-body text-sm font-semibold border-b-2 transition-colors ${
            pageMode === 'profile'
              ? 'border-brand text-brand'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          ⚙️ Profile & Goals
        </button>
      </div>

      {pageMode === 'profile' ? (
        <ProfileGoalsView
          profile={profile}
          criteria={data?.criteria as Parameters<typeof ProfileGoalsView>[0]['criteria']}
          onSaveProfile={saveProfile}
          onSaveCriteria={saveCriteria}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-2 rounded-full font-body text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-brand text-white shadow-brand'
                  : 'bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand'
              }`}
            >
              All Categories
            </button>
            {PLAYBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-full font-body text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand text-white shadow-brand'
                    : 'bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {activeCategory !== 'all' && categoryDef && (
            <div className="bg-info-light border-l-4 border-info rounded-r-md p-4">
              <p className="font-body text-base text-text-primary">
                <span className="font-semibold">
                  {categoryDef.icon} {categoryDef.label}:
                </span>{' '}
                {categoryDef.description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-text-primary">
                {categoryDef ? categoryDef.label : 'All Entries'}
              </h2>
              <div className="flex gap-2">
                {activeCategory !== 'all' && (
                  <>
                    <Link
                      href={`/playbook/print/${activeCategory}`}
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 rounded-lg font-body text-sm font-semibold bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand"
                    >
                      🖨️ Print
                    </Link>
                    <Button onClick={handleAddEntry}>+ Add Entry</Button>
                  </>
                )}
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="bg-bg-surface rounded-xl p-8 text-center border border-border-subtle">
                <p className="font-body text-base text-text-primary mb-4">
                  No entries yet in this category.
                </p>
                {activeCategory !== 'all' && (
                  <Button onClick={handleAddEntry}>+ Add Entry with AI</Button>
                )}
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <PlaybookEntryCard
                  key={entry.id}
                  entry={entry}
                  categoryLabel={categoryDef?.label ?? entry.category}
                  suggestedQuestions={categoryQuestions}
                  onRefresh={() => void mutate()}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
