'use client';

import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { useListenButtonsPreference } from '@/hooks/useListenButtonsPreference';
import { TTS_SPEED_OPTIONS, TTS_VOICES, type TtsVoiceId } from '@/lib/audio-preferences';

export function AudioSettings() {
  const {
    loaded,
    showListenButtons,
    setShowListenButtons,
    highlightWhileReading,
    setHighlightWhileReading,
    ttsVoice,
    setTtsVoice,
    ttsSpeed,
    setTtsSpeed,
    voiceChatSendMode,
    setVoiceChatSendMode,
    voiceChatKeyword,
    setVoiceChatKeyword,
  } = useListenButtonsPreference();

  if (!loaded) {
    return (
      <Card className="p-6">
        <p className="font-body text-sm text-text-muted">Loading audio settings…</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl text-text-primary mb-1">
          Audio &amp; listen
        </h2>
        <p className="font-body text-sm text-text-secondary">
          Listen buttons, read-along highlighting, voice, speed, and voice chat behavior.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-body text-base font-semibold text-text-primary">
              Show listen buttons
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              Small speaker icons on section headers. Hidden on desktop until you hover the section.
            </p>
          </div>
          <Toggle checked={showListenButtons} onChange={setShowListenButtons} />
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="space-y-1">
            <p className="font-body text-base font-semibold text-text-primary">
              Highlight text while reading
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              While audio plays, highlight the current sentence. Click any sentence to jump there.
            </p>
          </div>
          <Toggle checked={highlightWhileReading} onChange={setHighlightWhileReading} />
        </div>

        <div className="border-t border-border-subtle pt-5 space-y-3">
          <div className="space-y-1">
            <p className="font-body text-base font-semibold text-text-primary">Voice</p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              Deepgram Aura-2 narrator for listen buttons, walkthroughs, and AI read-aloud.
            </p>
          </div>
          <select
            value={ttsVoice}
            onChange={(e) => setTtsVoice(e.target.value as TtsVoiceId)}
            className="w-full font-body text-sm bg-bg-subtle border border-border-subtle rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-brand"
          >
            {TTS_VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-border-subtle pt-5 space-y-3">
          <div className="space-y-1">
            <p className="font-body text-base font-semibold text-text-primary">Speaking speed</p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              Playback pace for all text-to-speech (0.7×–1.5× supported by Deepgram).
            </p>
          </div>
          <select
            value={ttsSpeed}
            onChange={(e) => setTtsSpeed(Number.parseFloat(e.target.value))}
            className="w-full font-body text-sm bg-bg-subtle border border-border-subtle rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-brand"
          >
            {TTS_SPEED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-border-subtle pt-5 space-y-4">
          <div className="space-y-1">
            <p className="font-body text-base font-semibold text-text-primary">
              Voice chat — when to send
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              In the AI sidebar, choose how spoken messages are submitted.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 rounded-lg border border-border-subtle p-3 cursor-pointer hover:border-brand/30">
              <input
                type="radio"
                name="voice-chat-send-mode"
                checked={voiceChatSendMode === 'pause'}
                onChange={() => setVoiceChatSendMode('pause')}
                className="mt-1 accent-brand"
              />
              <span>
                <span className="font-body text-sm font-semibold text-text-primary block">
                  Pause to send
                </span>
                <span className="font-body text-sm text-text-secondary">
                  Deepgram detects when you finish speaking (recommended).
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-lg border border-border-subtle p-3 cursor-pointer hover:border-brand/30">
              <input
                type="radio"
                name="voice-chat-send-mode"
                checked={voiceChatSendMode === 'keyword'}
                onChange={() => setVoiceChatSendMode('keyword')}
                className="mt-1 accent-brand"
              />
              <span>
                <span className="font-body text-sm font-semibold text-text-primary block">
                  Say a keyword to send
                </span>
                <span className="font-body text-sm text-text-secondary">
                  Keep talking until you say the keyword — only then is the message sent.
                </span>
              </span>
            </label>
          </div>

          {voiceChatSendMode === 'keyword' && (
            <div className="space-y-2">
              <label
                htmlFor="voice-chat-keyword"
                className="font-body text-sm font-semibold text-text-primary"
              >
                Send keyword
              </label>
              <input
                id="voice-chat-keyword"
                type="text"
                value={voiceChatKeyword}
                onChange={(e) => setVoiceChatKeyword(e.target.value)}
                placeholder="send message"
                className="w-full font-body text-sm bg-bg-subtle border border-border-subtle rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
              />
              <p className="font-body text-xs text-text-muted">
                Example: &quot;What is a closure send message&quot; sends &quot;What is a closure&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
