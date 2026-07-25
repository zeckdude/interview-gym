'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LanguageToggle } from '@/components/editor/LanguageToggle';
import type { MiniChallenge } from '@/data/lessons';
import { cn } from '@/lib/utils';

const promptComponents: Components = {
  p({ children }) {
    return (
      <p className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed mb-3 last:mb-0">
        {children}
      </p>
    );
  },
  pre({ children }) {
    return (
      <pre className="bg-bg-inverse dark:bg-black text-text-inverse font-mono text-sm rounded-lg p-4 overflow-x-auto my-3">
        {children}
      </pre>
    );
  },
  code({ children, className }) {
    const isBlock = className?.includes('language-');
    if (isBlock) return <code className={className}>{children}</code>;
    return (
      <code className="font-mono text-sm bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    );
  },
};

interface MiniChallengePanelProps {
  challenge: MiniChallenge;
  relatedChallengeId: string;
  onPassed: (timeSpentMs: number) => void;
  bestTimeMs: number | null;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MiniChallengePanel({
  challenge,
  relatedChallengeId,
  onPassed,
  bestTimeMs,
}: MiniChallengePanelProps) {
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('typescript');
  const [code, setCode] = useState(challenge.starterCode.typescript);
  const [secondsLeft, setSecondsLeft] = useState(challenge.timeLimitSeconds);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<{ passed: boolean; feedback: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    setSecondsLeft(challenge.timeLimitSeconds);
    setElapsedMs(0);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedMs(elapsed);
      const remaining = Math.max(0, challenge.timeLimitSeconds - Math.floor(elapsed / 1000));
      setSecondsLeft(remaining);
    }, 250);
  }, [challenge.timeLimitSeconds]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleLanguageChange = (lang: 'javascript' | 'typescript') => {
    setLanguage(lang);
    setCode(challenge.starterCode[lang]);
  };

  const handleSubmit = () => {
    const validation = challenge.validate(code);
    setResult(validation);
    setSubmitted(true);
    if (validation.passed) {
      if (timerRef.current) clearInterval(timerRef.current);
      onPassed(elapsedMs);
    }
  };

  const handleRetry = () => {
    setCode(challenge.starterCode[language]);
    setResult(null);
    setSubmitted(false);
    resetTimer();
  };

  const isUrgent = secondsLeft <= 30;

  return (
    <section className="rounded-xl border border-border-subtle dark:border-[#2A2A2A] overflow-hidden shadow-card">
      <div className="bg-brand-light dark:bg-brand/15 px-6 py-5 border-b border-border-subtle dark:border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-body text-sm font-semibold text-brand uppercase tracking-wide mb-1">
              Mini-Challenge
            </p>
            <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              Prove it under pressure
            </h2>
          </div>
          <div className="text-center">
            <p className="font-body text-sm text-text-muted mb-1">Time remaining</p>
            <p
              className={cn(
                'font-display font-bold text-4xl tabular-nums',
                isUrgent ? 'text-error' : 'text-text-primary dark:text-[#F0EDE8]'
              )}
              aria-live="polite"
            >
              {formatTime(secondsLeft)}
            </p>
            {bestTimeMs !== null && (
              <p className="font-body text-sm text-text-muted mt-1">
                Best: {formatTime(Math.ceil(bestTimeMs / 1000))}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-bg-surface dark:bg-[#1A1A1A]">
        <div className="rounded-lg bg-bg-subtle dark:bg-[#252525] border border-border-subtle dark:border-[#2A2A2A] p-5">
          <ReactMarkdown components={promptComponents}>{challenge.prompt.trim()}</ReactMarkdown>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <LanguageToggle language={language} onChange={handleLanguageChange} />
          <p className="font-body text-sm text-text-muted">
            Timer is motivational — you can submit anytime
          </p>
        </div>

        <CodeEditor language={language} value={code} onChange={setCode} />

        {result && (
          <div
            className={cn(
              'rounded-lg p-5 border-l-4',
              result.passed
                ? 'bg-success-light border-success dark:bg-success/15'
                : 'bg-error-light border-error dark:bg-error/15'
            )}
          >
            <p className="font-body text-base text-text-primary dark:text-[#F0EDE8]">
              {result.feedback}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {!result?.passed && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-brand text-white font-body font-semibold rounded-md shadow-brand hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          )}
          {submitted && !result?.passed && (
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-3 bg-bg-subtle text-text-primary font-body font-semibold rounded-md border border-border-subtle hover:bg-bg-base transition-colors"
            >
              Try Again
            </button>
          )}
          {result?.passed && (
            <Link
              href={`/challenges/${relatedChallengeId}`}
              className="px-6 py-3 bg-success text-white font-body font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Continue to Challenge →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
