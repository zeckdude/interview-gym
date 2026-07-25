'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ShareSection() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateShareLink() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/share/generate', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to generate link');
      }
      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  }

  return (
    <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="font-display font-bold text-xl text-text-primary">Share Your Progress</h2>
        <p className="font-body text-sm text-text-muted">
          Show recruiters or friends your overall stats — no code or answers included.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          variant="secondary"
          onClick={generateShareLink}
          disabled={loading}
          className="whitespace-nowrap"
        >
          {loading ? 'Generating...' : 'Generate Share Link'}
        </Button>
        {shareUrl && (
          <>
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-bg-subtle border border-border-subtle rounded-md px-3 py-2 font-mono text-sm text-text-primary"
            />
            <Button variant="ghost" onClick={copyLink} className="whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </>
        )}
      </div>

      {error && (
        <p className="font-body text-sm text-text-primary bg-warning-light border border-warning rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <p className="font-body text-xs text-text-muted">
        Your share link shows your overall stats. It does not reveal your code or individual
        answers.
      </p>
    </section>
  );
}
