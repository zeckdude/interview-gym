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

interface VoiceInterviewRecorderProps {
  onTranscriptReady: (
    transcript: string,
    audioBlob: Blob | null,
    analytics: Omit<TranscriptionResult, 'transcript'> | null
  ) => void;
  disabled?: boolean;
}

async function transcribeAudio(blob: Blob): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('audio', blob, blob.type.includes('mp4') ? 'recording.mp4' : 'recording.webm');

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

function formatRecordingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceInterviewRecorder({
  onTranscriptReady,
  disabled,
}: VoiceInterviewRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setRecordingSeconds(0);
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
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
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setError('Microphone access denied or unavailable.');
      cleanup();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const progressPct = Math.min(100, (recordingSeconds / 180) * 100);

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3">
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled || processing}
            className="w-full flex items-center justify-center gap-2 bg-brand text-white px-6 py-4 rounded-xl font-body text-base font-semibold hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            🎙️ {processing ? 'Processing…' : 'Tap to Speak'}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="w-full flex flex-col items-center gap-2 bg-error text-white px-6 py-4 rounded-xl font-body text-base font-semibold"
          >
            <span>⏹ Stop Recording</span>
            <span className="text-sm opacity-90">
              Recording… {formatRecordingTime(recordingSeconds)}
            </span>
            <div className="w-full max-w-xs h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className={cn('h-2 bg-white rounded-full transition-all')}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </button>
        )}
      </div>

      {error && (
        <p className="font-body text-sm text-error bg-error-light border border-error/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
