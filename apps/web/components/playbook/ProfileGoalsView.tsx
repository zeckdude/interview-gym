'use client';

import { useState } from 'react';
import { AboutMePanel } from './AboutMePanel';
import { JobSearchCriteriaPanel } from './JobSearchCriteriaPanel';

type ProfileTab = 'about' | 'goals';

interface ProfileGoalsViewProps {
  profile: {
    linkedInUrl?: string | null;
    linkedInText?: string | null;
    resumeText?: string | null;
    portfolioUrl?: string | null;
    githubUrl?: string | null;
    personalWebsite?: string | null;
    additionalContext?: string | null;
  };
  criteria: Parameters<typeof JobSearchCriteriaPanel>[0]['criteria'];
  onSaveProfile: (data: Record<string, unknown>) => Promise<void>;
  onSaveCriteria: Parameters<typeof JobSearchCriteriaPanel>[0]['onSave'];
}

export function ProfileGoalsView({
  profile,
  criteria,
  onSaveProfile,
  onSaveCriteria,
}: ProfileGoalsViewProps) {
  const [tab, setTab] = useState<ProfileTab>('about');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl text-text-primary">Profile & Goals</h2>
        <p className="font-body text-base text-text-primary max-w-2xl">
          Background info and job search criteria feed the AI across Playbook coaching, company
          research, and interview feedback.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border-subtle pb-0">
        <button
          type="button"
          onClick={() => setTab('about')}
          className={`px-4 py-3 font-body text-sm font-semibold border-b-2 transition-colors ${
            tab === 'about'
              ? 'border-brand text-brand'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          👤 About Me
        </button>
        <button
          type="button"
          onClick={() => setTab('goals')}
          className={`px-4 py-3 font-body text-sm font-semibold border-b-2 transition-colors ${
            tab === 'goals'
              ? 'border-brand text-brand'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          🎯 What I&apos;m Looking For
        </button>
      </div>

      {tab === 'about' ? (
        <AboutMePanel
          profile={profile}
          onSave={onSaveProfile}
          onClose={() => {}}
          embedded
        />
      ) : (
        <JobSearchCriteriaPanel
          criteria={criteria}
          onSave={async (data) => {
            await onSaveCriteria(data);
          }}
          onClose={() => {}}
          embedded
        />
      )}
    </div>
  );
}
