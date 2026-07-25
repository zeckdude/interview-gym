'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { UserChallenge } from '@prisma/client';
import { GeneratedChallengePreview } from '@/components/generate/GeneratedChallengePreview';
import { Button } from '@/components/ui/Button';
import { isPushSupported, subscribeToPushNotifications } from '@/lib/push-client';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const PROMPT_STARTERS = [
  'I had an interview at a fintech startup that asked me to...',
  'A FAANG company asked me to implement...',
  'I bombed a question about event delegation at...',
  'They asked me to explain and then implement...',
];

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

export function GenerateChallengeClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [generatedChallenge, setGeneratedChallenge] = useState<UserChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pushPromptDismissed, setPushPromptDismissed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const pollJob = (jobId: string, assistantMsgId: string) => {
    stopPolling();

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate-challenge/${jobId}`);
        if (!res.ok) return;

        const data = (await res.json()) as {
          job: {
            status: string;
            statusMessage: string | null;
            errorMessage: string | null;
          };
          challenge: UserChallenge | null;
        };

        if (data.job.statusMessage) {
          setStatusMessage(data.job.statusMessage);
        }

        if (data.job.status === 'complete' && data.challenge) {
          stopPolling();
          setIsGenerating(false);
          setActiveJobId(null);
          setStatusMessage(null);
          setGeneratedChallenge(data.challenge);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: 'Your challenge is ready! Preview it below.' }
                : m
            )
          );
          scrollToBottom();
        }

        if (data.job.status === 'failed') {
          stopPolling();
          setIsGenerating(false);
          setActiveJobId(null);
          setStatusMessage(null);
          const msg = data.job.errorMessage ?? 'Generation failed. Please try again.';
          setError(msg);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: msg } : m
            )
          );
        }
      } catch {
        /* keep polling */
      }
    }, 2500);
  };

  const handleGenerate = async (description: string) => {
    const trimmed = description.trim();
    if (!trimmed || isGenerating) return;

    setError(null);
    setGeneratedChallenge(null);
    setStatusMessage(null);
    setIsGenerating(true);

    const userMsg: Message = { id: newId(), role: 'user', content: trimmed };
    const assistantMsg: Message = {
      id: newId(),
      role: 'assistant',
      content:
        'Got it! Building your challenge, lesson, and mini-challenge in the background…',
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    scrollToBottom();

    try {
      const res = await fetch('/api/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userDescription: trimmed }),
      });

      const data = (await res.json()) as {
        jobId?: string;
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.jobId) {
        throw new Error(data.error ?? 'Generation failed to start');
      }

      setActiveJobId(data.jobId);
      setStatusMessage('Queued for generation…');
      pollJob(data.jobId, assistantMsg.id);
    } catch (err) {
      setIsGenerating(false);
      const msg =
        err instanceof Error ? err.message : 'Failed to start generation. Please try again.';
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        )
      );
    }
  };

  const handleEnablePush = async () => {
    await subscribeToPushNotifications();
    setPushPromptDismissed(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.length === 0 && (
          <>
            <div className="text-center py-6">
              <p className="text-4xl mb-3">✨</p>
              <p className="font-display font-bold text-xl text-text-primary mb-2">
                Tell me about a real interview challenge
              </p>
              <p className="font-body text-base text-text-secondary max-w-lg mx-auto">
                Describe what you were asked to build or explain. I&apos;ll create a full practice
                challenge, lesson, and mini-challenge from your description.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {PROMPT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setInput(starter)}
                  className="text-left p-3 rounded-lg bg-bg-subtle border border-border-subtle text-sm font-body text-text-secondary hover:border-brand hover:text-text-primary transition-all"
                >
                  &ldquo;{starter}&rdquo;
                </button>
              ))}
            </div>
          </>
        )}

        {isGenerating && activeJobId && (
          <div className="bg-brand-light border border-brand/30 rounded-xl px-5 py-4 space-y-3">
            <p className="font-display font-bold text-base text-text-primary">
              You can navigate away
            </p>
            <p className="font-body text-sm text-text-primary leading-relaxed">
              Generation runs in the background. We&apos;ll notify you in the{' '}
              <span className="font-semibold">🔔 bell icon</span> when your challenge, lesson, and
              mini-challenge are ready.
            </p>
            {statusMessage && (
              <p className="font-body text-sm text-brand animate-pulse">{statusMessage}</p>
            )}
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/"
                className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-bg-surface border border-border-subtle hover:border-brand/30 text-text-primary"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/challenges"
                className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-bg-surface border border-border-subtle hover:border-brand/30 text-text-primary"
              >
                Browse Challenges
              </Link>
            </div>
            {isPushSupported() && !pushPromptDismissed && (
              <div className="pt-2 border-t border-brand/20">
                <p className="font-body text-xs text-text-secondary mb-2">
                  Want a browser push alert too? Enable notifications so you don&apos;t miss it.
                </p>
                <button
                  type="button"
                  onClick={() => void handleEnablePush()}
                  className="font-body text-xs font-semibold px-3 py-1.5 rounded-md bg-brand text-white hover:bg-brand-dark"
                >
                  Enable push notifications
                </button>
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand text-white rounded-br-sm'
                  : 'bg-bg-subtle text-text-primary rounded-bl-sm border border-border-subtle'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {generatedChallenge && (
          <GeneratedChallengePreview challenge={generatedChallenge} />
        )}

        {error && !generatedChallenge && (
          <div className="bg-error-light border border-error/30 rounded-lg px-4 py-3">
            <p className="font-body text-sm text-error">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 border-t border-border-subtle pt-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the interview challenge you encountered…"
            rows={3}
            disabled={isGenerating}
            className="flex-1 resize-none font-body text-base bg-bg-subtle border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors disabled:opacity-50"
          />
          <Button
            onClick={() => handleGenerate(input)}
            disabled={isGenerating || input.trim().length < 10}
            className="flex-shrink-0"
          >
            {isGenerating ? 'Generating…' : 'Send'}
          </Button>
        </div>
        <p className="font-body text-xs text-text-muted mt-2 text-center">
          Be specific — mention the company, what they asked, and any constraints you remember
        </p>
      </div>
    </div>
  );
}
