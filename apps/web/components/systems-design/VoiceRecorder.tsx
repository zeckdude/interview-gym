'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TranscriptionResult {
  transcript: string;
  fillerWordCount: number;
  wordsPerMinute: number;
  confidenceScore: number;
  durationSeconds: number;
}

interface VoiceRecorderProps {
  sectionId: string;
  spokenPrompt: string;
  onTranscriptReady: (
    transcript: string,
    audioBlob: Blob,
    analytics: Omit<TranscriptionResult, 'transcript'>
  ) => void;
}

async function transcribeAudio(blob: Blob): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');

  const res = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as TranscriptionResult & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? 'Could not transcribe audio');
  }

  return data;
}

export function VoiceRecorder({ spokenPrompt, onTranscriptReady }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setProcessing(true);
        try {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          });
          const result = await transcribeAudio(blob);
          setTranscript(result.transcript);
          onTranscriptReady(result.transcript, blob, {
            fillerWordCount: result.fillerWordCount,
            wordsPerMinute: result.wordsPerMinute,
            confidenceScore: result.confidenceScore,
            durationSeconds: result.durationSeconds,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Transcription failed');
        } finally {
          setProcessing(false);
          cleanup();
        }
      };

      recorder.start();
      setRecording(true);
    } catch {
      setError('Microphone access denied or unavailable.');
      cleanup();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="border border-border-subtle rounded-md p-4 bg-bg-subtle space-y-3">
      <div className="bg-bg-surface border-l-4 border-brand rounded-r-md px-4 py-3">
        <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
          Say this out loud
        </p>
        <p className="font-body text-sm text-text-primary italic">&ldquo;{spokenPrompt}&rdquo;</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={processing}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-md font-body text-sm font-semibold hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            <span className={cn('w-2 h-2 rounded-full bg-white', !processing && 'animate-pulse')} />
            Start Speaking
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 bg-error text-white px-4 py-2 rounded-md font-body text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            Stop Recording
          </button>
        )}
        {processing && (
          <span className="font-body text-sm text-text-primary">Transcribing…</span>
        )}
      </div>

      {error && (
        <p className="font-body text-sm text-error bg-error-light border border-error/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {transcript && (
        <div className="p-4 bg-bg-surface rounded-md border border-border-subtle space-y-1">
          <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wide">
            Transcript
          </p>
          <p className="font-body text-base text-text-primary leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
