'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageListenButton } from '@/components/audio/MessageListenButton';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import { useFluxVoiceInput } from '@/hooks/useFluxVoiceInput';
import { useVoiceChatController } from '@/hooks/useVoiceChatController';
import { VoiceLevelBars } from '@/components/audio/VoiceLevelBars';
import { useListenButtonsPreference } from '@/hooks/useListenButtonsPreference';
import { prepareTextForSpeech, splitPreparedSentences } from '@/lib/markdown-to-speech';
import {
  cancelActiveTtsPlayback,
  getActivePlaybackGeneration,
  prefetchTtsFirstSentence,
  prefetchTtsPrepared,
  speakPreparedText,
} from '@/lib/tts-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

export function AiChat() {
  const { challengeCtx, pendingMessage, clearPendingMessage } = useRightPanel();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const challengeCtxRef = useRef(challengeCtx);
  const lastChallengeId = useRef<string | null>(null);
  const voiceModeRef = useRef(false);
  const messagesRef = useRef(messages);
  const isBusyRef = useRef(false);
  const chatAbortRef = useRef<AbortController | null>(null);
  const voiceInput = useFluxVoiceInput();
  const voiceChat = useVoiceChatController(voiceInput);
  const { voiceChatSendMode, voiceChatKeyword } = useListenButtonsPreference();

  useEffect(() => {
    isBusyRef.current = isStreaming || isSpeaking;
    voiceChat.setBusy(isStreaming || isSpeaking);
  }, [isStreaming, isSpeaking, voiceChat]);

  useEffect(() => {
    challengeCtxRef.current = challengeCtx;
  }, [challengeCtx]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
    voiceChat.setVoiceModeActive(voiceMode);
  }, [voiceMode, voiceChat]);

  const resumeListening = voiceChat.resumeListening;

  const releaseVoiceTurn = useCallback(() => {
    if (!voiceModeRef.current) return;
    if (!voiceInput.finishProcessing()) {
      resumeListening();
    }
  }, [resumeListening, voiceInput]);

  useEffect(() => {
    if (!voiceMode || isStreaming || isSpeaking) return;
    if (voiceInput.isMicLive) return;
    const timer = setTimeout(() => resumeListening(), 150);
    return () => clearTimeout(timer);
  }, [voiceMode, isStreaming, isSpeaking, voiceInput.isMicLive, resumeListening]);

  useEffect(() => {
    if (!challengeCtx?.challengeId) return;
    if (challengeCtx.challengeId === lastChallengeId.current) return;

    lastChallengeId.current = challengeCtx.challengeId;

    setIsLoadingHistory(true);
    fetch(`/api/ai/chat?challengeId=${encodeURIComponent(challengeCtx.challengeId)}`)
      .then((r) => r.json())
      .then((data: { messages: { id: string; role: string; content: string }[] }) => {
        setMessages(
          (data.messages ?? []).map((m) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))
        );
      })
      .catch(() => setMessages([]))
      .finally(() => setIsLoadingHistory(false));
  }, [challengeCtx?.challengeId]);

  const speakReply = useCallback(
    async (content: string) => {
      const prepared = prepareTextForSpeech(content);
      if (!prepared) {
        releaseVoiceTurn();
        return;
      }

      const sentences = splitPreparedSentences(prepared);
      for (const sentence of sentences) {
        prefetchTtsPrepared(sentence);
      }

      const generation = getActivePlaybackGeneration();
      setIsSpeaking(true);
      try {
        await speakPreparedText(prepared, { generation, highlightSentences: true });
      } finally {
        setIsSpeaking(false);
        releaseVoiceTurn();
      }
    },
    [releaseVoiceTurn]
  );

  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => {});

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const inVoiceMode = voiceModeRef.current;
      const bargeIn = inVoiceMode && (isStreaming || isSpeaking || voiceInput.isProcessing);

      if (isStreaming && !bargeIn) return;

      if (bargeIn) {
        chatAbortRef.current?.abort();
        cancelActiveTtsPlayback(true);
        setIsSpeaking(false);
        setIsStreaming(false);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.isStreaming) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      }

      if (!inVoiceMode && (voiceInput.isListening || voiceInput.isProcessing)) {
        await voiceInput.stopListening();
      }

      const ctx = challengeCtxRef.current;
      const userMsg: Message = { id: newId(), role: 'user', content: trimmed };
      const assistantMsg: Message = { id: newId(), role: 'assistant', content: '', isStreaming: true };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setIsStreaming(true);

      const abortController = new AbortController();
      chatAbortRef.current = abortController;

      try {
        const history = [...messagesRef.current, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
          body: JSON.stringify({
            challengeId: ctx?.challengeId ?? 'unknown',
            messages: history,
            challengeTitle: ctx?.title ?? 'Unknown challenge',
            challengeDescription: ctx?.description ?? '',
            currentCode: ctx?.currentCode ?? '',
            language: ctx?.language ?? 'javascript',
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error('Stream failed');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let ttsPrefetchStarted = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: snapshot } : m
            )
          );

          if (inVoiceMode && !ttsPrefetchStarted && snapshot.length >= 48) {
            ttsPrefetchStarted = true;
            prefetchTtsFirstSentence(snapshot);
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, isStreaming: false } : m
          )
        );

        if (abortController.signal.aborted) return;

        if (voiceModeRef.current && accumulated.trim()) {
          await speakReply(accumulated);
        } else if (voiceModeRef.current) {
          releaseVoiceTurn();
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  content: 'Sorry, something went wrong. Please try again.',
                  isStreaming: false,
                }
              : m
          )
        );
        releaseVoiceTurn();
      } finally {
        if (chatAbortRef.current === abortController) {
          chatAbortRef.current = null;
        }
        if (!abortController.signal.aborted) {
          setIsStreaming(false);
        }
        if (!voiceModeRef.current) {
          inputRef.current?.focus();
        }
      }
    },
    [isStreaming, isSpeaking, releaseVoiceTurn, speakReply, voiceInput]
  );

  sendMessageRef.current = sendMessage;

  useEffect(() => {
    voiceChat.bindTranscriptHandler((text) => sendMessageRef.current(text));
  }, [voiceChat]);

  useEffect(() => {
    if (pendingMessage) {
      clearPendingMessage();
      void sendMessage(pendingMessage);
    }
  }, [pendingMessage, clearPendingMessage, sendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleVoiceMode = useCallback(() => {
    setVoiceMode((current) => {
      const next = !current;
      voiceModeRef.current = next;

      if (next) {
        voiceChat.setVoiceModeActive(true);
        void cancelActiveTtsPlayback(true);
        setIsSpeaking(false);
        resumeListening();
      } else {
        voiceChat.setVoiceModeActive(false);
        voiceChat.clearRetryTimer();
        void voiceInput.stopListening();
        void cancelActiveTtsPlayback(true);
        setIsSpeaking(false);
      }

      return next;
    });
  }, [resumeListening, voiceChat, voiceInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const voiceStatusLabel = voiceInput.isProcessing
    ? isStreaming
      ? 'Thinking… speak to interrupt'
      : isSpeaking
        ? 'Speaking… speak to interrupt'
        : 'Processing…'
    : voiceInput.isListening
      ? voiceChatSendMode === 'keyword'
        ? `Listening — say “${voiceChatKeyword}” to send`
        : 'Listening — pause to send'
      : isSpeaking
        ? 'Speaking… speak to interrupt'
        : isStreaming
          ? 'Thinking… speak to interrupt'
          : voiceMode
            ? 'Connecting microphone…'
            : null;

  const handleInterruptPlayback = useCallback(() => {
    cancelActiveTtsPlayback(true);
    setIsSpeaking(false);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory && (
          <div className="flex justify-center py-8">
            <p className="font-body text-sm text-text-muted animate-pulse">Loading conversation…</p>
          </div>
        )}

        {!isLoadingHistory && messages.length === 0 && !voiceMode && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <p className="text-4xl mb-3">🤖</p>
            <p className="font-display font-bold text-text-primary text-base mb-1">
              Ask me anything
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              Type a question or start voice chat for a hands-free back-and-forth.
            </p>
            <button
              type="button"
              onClick={toggleVoiceMode}
              className="mt-5 px-4 py-2.5 rounded-lg bg-brand text-white font-body text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start voice chat
            </button>
            <div className="mt-4 space-y-2 w-full">
              {[
                { label: '💡 Give me a hint', msg: 'Give me a hint without giving away the answer.' },
                { label: "🔍 What's wrong with my code?", msg: "What's wrong with my current code? Point out the issue but let me fix it." },
                { label: '✨ How could I improve this?', msg: 'How could I improve my current code? Look at what I have and suggest improvements.' },
                { label: '📖 Explain the approach', msg: 'Explain the general approach I should take to solve this challenge.' },
              ].map(({ label, msg }) => (
                <button
                  key={label}
                  onClick={() => void sendMessage(msg)}
                  className="w-full text-left text-xs font-body text-text-secondary bg-bg-subtle hover:bg-brand-light hover:text-brand border border-border-subtle hover:border-brand/30 rounded-lg px-3 py-2 transition-all duration-150"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand text-white rounded-br-sm'
                  : 'bg-bg-subtle text-text-primary rounded-bl-sm border border-border-subtle'
              }`}
            >
              {msg.role === 'assistant' && msg.content && !msg.isStreaming && (
                <div className="flex justify-end -mt-1 -mr-1 mb-1">
                  <MessageListenButton
                    text={msg.content}
                    onBeforePlay={voiceMode ? handleInterruptPlayback : undefined}
                  />
                </div>
              )}
              {!msg.content ? (
                <span className="flex gap-1 items-center text-text-muted">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
                </span>
              ) : msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');
                      return isBlock ? (
                        <code className="block bg-bg-inverse text-text-inverse font-mono text-xs rounded-lg p-3 my-2 overflow-x-auto whitespace-pre">
                          {children}
                        </code>
                      ) : (
                        <code className="font-mono text-xs bg-border-subtle px-1 py-0.5 rounded">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => <>{children}</>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 border-t border-border-subtle p-3 bg-bg-surface space-y-2">
        {voiceMode && voiceStatusLabel && (
          <div className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <VoiceLevelBars
                level={voiceInput.audioLevel}
                active={voiceInput.isMicLive}
              />
              <p className="font-body text-sm font-semibold text-brand truncate">
                {voiceStatusLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleVoiceMode}
              className="font-body text-xs font-semibold text-text-secondary hover:text-text-primary shrink-0"
            >
              Exit voice chat
            </button>
          </div>
        )}

        {voiceMode && voiceInput.liveTranscript && (
          <p className="font-body text-xs text-text-secondary px-1 truncate">
            Heard: {voiceInput.liveTranscript}
          </p>
        )}

        <div className="flex gap-2 items-end">
          {!voiceMode ? (
            <button
              type="button"
              onClick={toggleVoiceMode}
              disabled={isStreaming}
              aria-label="Start voice chat"
              title="Start voice chat"
              className="flex-shrink-0 w-10 h-10 rounded-xl border border-border-subtle bg-bg-subtle text-text-secondary hover:text-brand hover:border-brand/40 flex items-center justify-center transition-all duration-150 disabled:opacity-40"
            >
              <span className="text-sm leading-none">🎙️</span>
            </button>
          ) : (
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl border border-brand/40 bg-brand/10 flex items-center justify-center"
              aria-label="Microphone active"
            >
              <VoiceLevelBars level={voiceInput.audioLevel} active={voiceInput.isMicLive} />
            </div>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={voiceMode ? 'Voice chat active — or type here…' : 'Ask anything…'}
            rows={3}
            disabled={isStreaming}
            className="flex-1 resize-none font-body text-sm bg-bg-subtle border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors disabled:opacity-50 max-h-40 overflow-y-auto"
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={isStreaming || !input.trim()}
            className="flex-shrink-0 w-10 h-10 bg-brand hover:bg-brand-dark text-white rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-brand"
            aria-label="Send message"
          >
            {isStreaming ? (
              <span className="text-xs animate-spin">⟳</span>
            ) : (
              <span className="text-sm">↑</span>
            )}
          </button>
        </div>

        {voiceInput.error && (
          <p className="font-body text-xs text-error text-center">{voiceInput.error}</p>
        )}

        <p className="font-body text-xs text-text-muted text-center">
          {voiceMode
            ? voiceChatSendMode === 'keyword'
              ? `Say your question, then “${voiceChatKeyword}” to submit · speak anytime to interrupt`
              : 'Pause to send · speak while AI talks to interrupt · tap 🔊 to replay a reply'
            : 'Tap 🎙️ for hands-free voice chat · AI sees your current code'}
        </p>
      </div>
    </div>
  );
}
