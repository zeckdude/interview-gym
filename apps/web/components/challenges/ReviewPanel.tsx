'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AiConfirmationModal } from '@/components/challenges/AiConfirmationModal';
import { ReadOnlyCodeEditor } from '@/components/editor/ReadOnlyCodeEditor';
import type { ChallengeLanguage } from '@/data/types';

interface ReviewPanelProps {
  open: boolean;
  onClose: () => void;
  challengeId: string;
  challengeDescription: string;
  userCode: string;
  language: ChallengeLanguage;
  onReviewUsed: () => void;
}

type ReviewStep = 'confirm' | 'loading' | 'issues' | 'confirm-fix' | 'fix';

function extractCodeBlock(content: string, language: ChallengeLanguage): string | null {
  const fence = new RegExp(`\`\`\`(?:${language}|javascript|typescript)?\\n([\\s\\S]*?)\`\`\``);
  const match = content.match(fence);
  return match?.[1]?.trim() ?? null;
}

export function ReviewPanel({
  open,
  onClose,
  challengeId,
  challengeDescription,
  userCode,
  language,
  onReviewUsed,
}: ReviewPanelProps) {
  const [step, setStep] = useState<ReviewStep>('confirm');
  const [issuesContent, setIssuesContent] = useState('');
  const [fixContent, setFixContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep('confirm');
      setIssuesContent('');
      setFixContent('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setStep('confirm');
    setIssuesContent('');
    setFixContent('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const fetchReview = async (showFix: boolean) => {
    setError(null);
    setStep('loading');

    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          challengeDescription,
          userCode,
          language,
          showFix,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to get review');
      }

      const data = await res.json() as { content: string };

      if (showFix) {
        setFixContent(data.content);
        setStep('fix');
      } else {
        setIssuesContent(data.content);
        setStep('issues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep(showFix ? 'issues' : 'confirm');
    }
  };

  const handleConfirmReview = () => {
    onReviewUsed();
    fetchReview(false);
  };

  const handleConfirmFix = () => {
    fetchReview(true);
  };

  const fixCode = extractCodeBlock(fixContent, language);

  return (
    <>
      <AiConfirmationModal
        open={step === 'confirm'}
        title="Are you sure?"
        message={`This will show you exactly what's wrong with your code.\n\nUsing this counts as a hint and will be noted on your attempt.`}
        confirmLabel="Yes, show me"
        onConfirm={handleConfirmReview}
        onCancel={() => {
          setStep('confirm');
          onClose();
        }}
      />

      <AiConfirmationModal
        open={step === 'confirm-fix'}
        title="Show me the fix?"
        message={`Once you see the fix, you can't unsee it. Still want to?`}
        confirmLabel="Show me"
        onConfirm={handleConfirmFix}
        onCancel={() => setStep('issues')}
      />

      <div className="mt-4 bg-bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-error-light/20">
          <div>
            <h3 className="font-display font-semibold text-base text-text-primary">
              🔍 Code Review
            </h3>
            <p className="font-body text-sm text-text-secondary mt-0.5">
              Specific issues — no fixes until you ask.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close review panel"
            className="text-text-muted hover:text-text-primary text-lg leading-none px-2"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {step === 'confirm' && !issuesContent && (
            <div className="bg-bg-subtle rounded-lg p-4 border border-border-subtle">
              <p className="font-body text-base text-text-primary">
                Confirm above to see what&apos;s wrong with your code.
              </p>
            </div>
          )}

          {step === 'loading' && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="font-body text-base text-text-secondary">Reviewing your code…</p>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-error-light border border-error text-error font-body text-sm">
              {error}
            </div>
          )}

          {(step === 'issues' || step === 'confirm-fix' || step === 'fix') && issuesContent && (
            <div className="bg-bg-subtle rounded-lg p-5 border-l-4 border-error">
              <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wide mb-3">
                Issues Found
              </h4>
              <div className="font-body text-base text-text-primary prose prose-sm max-w-none">
                <ReactMarkdown>{issuesContent}</ReactMarkdown>
              </div>
            </div>
          )}

          {step === 'issues' && (
            <button
              type="button"
              onClick={() => setStep('confirm-fix')}
              className="font-body font-semibold px-5 py-2.5 rounded-md bg-bg-subtle hover:bg-bg-muted text-text-primary border border-border-subtle transition-colors"
            >
              Show me the fix
            </button>
          )}

          {step === 'fix' && fixContent && (
            <div className="space-y-4">
              <div className="bg-success-light/30 rounded-lg p-4 border-l-4 border-success">
                <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wide mb-3">
                  Corrected Code
                </h4>
                {fixCode ? (
                  <ReadOnlyCodeEditor language={language} value={fixCode} height="320px" />
                ) : (
                  <div className="font-body text-base text-text-primary prose prose-sm max-w-none">
                    <ReactMarkdown>{fixContent}</ReactMarkdown>
                  </div>
                )}
              </div>
              {fixCode && (
                <div className="font-body text-base text-text-primary prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {fixContent.replace(/```[\s\S]*?```/g, '').trim()}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
