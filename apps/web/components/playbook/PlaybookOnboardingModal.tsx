'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface PlaybookOnboardingModalProps {
  onSave: (data: {
    linkedInUrl?: string;
    linkedInText?: string;
    resumeText?: string;
    portfolioUrl?: string;
    githubUrl?: string;
    personalWebsite?: string;
    additionalContext?: string;
    onboardingComplete: boolean;
  }) => Promise<void>;
  onSkip: () => void;
}

export function PlaybookOnboardingModal({ onSave, onSkip }: PlaybookOnboardingModalProps) {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [linkedInText, setLinkedInText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        linkedInUrl: linkedInUrl || undefined,
        linkedInText: linkedInText || undefined,
        resumeText: resumeText || undefined,
        portfolioUrl: portfolioUrl || undefined,
        githubUrl: githubUrl || undefined,
        personalWebsite: personalWebsite || undefined,
        additionalContext: additionalContext || undefined,
        onboardingComplete: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-surface rounded-xl shadow-modal max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            Welcome to My Playbook 🏋️
          </h2>
          <p className="font-body text-base text-text-primary leading-relaxed">
            Before we build your Playbook, tell us about yourself. This helps the AI give you
            more relevant coaching, tailored feedback, and sharper connections when researching
            companies and interviewers.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="font-body text-sm font-semibold text-text-primary">LinkedIn URL (optional)</span>
            <input
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-body text-sm font-semibold text-text-primary">
              Paste your LinkedIn profile text (optional)
            </span>
            <p className="font-body text-sm text-text-muted">
              Copy your full LinkedIn page (Cmd+A, Copy) and paste it here. Messy is fine — AI handles it.
            </p>
            <textarea
              value={linkedInText}
              onChange={(e) => setLinkedInText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-body text-sm font-semibold text-text-primary">Resume (optional)</span>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block space-y-2">
              <span className="font-body text-sm font-semibold text-text-primary">Portfolio</span>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-body text-sm font-semibold text-text-primary">GitHub</span>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-body text-sm font-semibold text-text-primary">Personal site</span>
              <input
                type="url"
                value={personalWebsite}
                onChange={(e) => setPersonalWebsite(e.target.value)}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="font-body text-sm font-semibold text-text-primary">
              Anything else you want the AI to know about you?
            </span>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="secondary" onClick={onSkip} disabled={saving}>
            Skip for now
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving…' : 'Save & Start Building My Playbook →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
