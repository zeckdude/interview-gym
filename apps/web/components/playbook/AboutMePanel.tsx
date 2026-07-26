'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AboutMePanelProps {
  profile: {
    linkedInUrl?: string | null;
    linkedInText?: string | null;
    resumeText?: string | null;
    portfolioUrl?: string | null;
    githubUrl?: string | null;
    personalWebsite?: string | null;
    additionalContext?: string | null;
  };
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  embedded?: boolean;
}

export function AboutMePanel({ profile, onSave, onClose, embedded }: AboutMePanelProps) {
  const [linkedInUrl, setLinkedInUrl] = useState(profile.linkedInUrl ?? '');
  const [linkedInText, setLinkedInText] = useState(profile.linkedInText ?? '');
  const [resumeText, setResumeText] = useState(profile.resumeText ?? '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl ?? '');
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl ?? '');
  const [personalWebsite, setPersonalWebsite] = useState(profile.personalWebsite ?? '');
  const [additionalContext, setAdditionalContext] = useState(profile.additionalContext ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        linkedInUrl: linkedInUrl || null,
        linkedInText: linkedInText || null,
        resumeText: resumeText || null,
        portfolioUrl: portfolioUrl || null,
        githubUrl: githubUrl || null,
        personalWebsite: personalWebsite || null,
        additionalContext: additionalContext || null,
        onboardingComplete: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-bg-surface rounded-xl shadow-card p-6 space-y-4 border border-border-subtle ${embedded ? '' : ''}`}>
      {!embedded && (
        <>
          <h2 className="font-display font-bold text-xl text-text-primary">👤 About Me</h2>
          <p className="font-body text-base text-text-primary">
            This context feeds the AI across Playbook coaching, company research, and interviewer rapport analysis.
          </p>
        </>
      )}

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">LinkedIn URL</span>
        <input
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">LinkedIn profile text</span>
        <textarea
          value={linkedInText}
          onChange={(e) => setLinkedInText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Resume</span>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block space-y-2">
          <span className="font-body text-sm font-semibold text-text-primary">Portfolio</span>
          <input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary" />
        </label>
        <label className="block space-y-2">
          <span className="font-body text-sm font-semibold text-text-primary">GitHub</span>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary" />
        </label>
        <label className="block space-y-2">
          <span className="font-body text-sm font-semibold text-text-primary">Personal site</span>
          <input value={personalWebsite} onChange={(e) => setPersonalWebsite(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary" />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Additional context</span>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <div className="flex gap-3">
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        {!embedded && (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
