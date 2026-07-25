'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChallengeLanguage } from '@/data/types';

interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachPanelProps {
  open: boolean;
  onClose: () => void;
  challengeId: string;
  challengeDescription: string;
  concepts: string[];
  userCode: string;
  onCoachUsed: () => void;
}

export function CoachPanel({
  open,
  onClose,
  challengeId,
  challengeDescription,
  concepts,
  userCode,
  onCoachUsed,
}: CoachPanelProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const coachUsedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!open) return null;

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isStreaming) return;

    if (!coachUsedRef.current) {
      coachUsedRef.current = true;
      onCoachUsed();
    }

    const userMessage: CoachMessage = { role: 'user', content: trimmed };
    const historyForApi = messages;
    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          challengeDescription,
          concepts,
          userCode,
          conversationHistory: historyForApi,
          userMessage: trimmed,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to get coach response');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: accumulated };
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="mt-4 bg-bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-brand-light/30">
        <div>
          <h3 className="font-display font-semibold text-base text-text-primary">
            💡 Socratic Coach
          </h3>
          <p className="font-body text-sm text-text-secondary mt-0.5">
            I&apos;ll ask questions — not give answers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="font-body text-sm text-text-secondary hover:text-brand transition-colors"
            >
              Clear conversation
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close coach panel"
            className="text-text-muted hover:text-text-primary text-lg leading-none px-2"
          >
            ×
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="bg-bg-subtle rounded-lg p-4 border border-border-subtle">
            <p className="font-body text-base text-text-primary">
              Stuck? Tell me where you&apos;re at — I&apos;ll ask a question to nudge you forward.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand text-white'
                  : 'bg-bg-subtle border border-border-subtle text-text-primary'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="font-body text-base prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content || (isStreaming && i === messages.length - 1 ? '…' : '')}</ReactMarkdown>
                </div>
              ) : (
                <p className="font-body text-base">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mx-5 mb-3 px-4 py-3 rounded-lg bg-error-light border border-error text-error font-body text-sm">
          {error}
        </div>
      )}

      <div className="px-5 py-4 border-t border-border-subtle flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Where are you stuck?"
          disabled={isStreaming}
          className="flex-1 font-body text-base px-4 py-2.5 rounded-md bg-bg-subtle border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || isStreaming}
          className="font-body font-semibold px-5 py-2.5 rounded-md bg-brand hover:bg-brand-dark text-white transition-colors disabled:opacity-50"
        >
          {isStreaming ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
