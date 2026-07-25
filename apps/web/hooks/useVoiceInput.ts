'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SILENCE_RMS_THRESHOLD = 0.018;
const SILENCE_DURATION_MS = 1400;
const MAX_RECORDING_MS = 45000;
const MIN_SPEECH_MS = 500;
const MIN_BLOB_BYTES = 1200;

function measureRms(analyser: AnalyserNode, buffer: Float32Array<ArrayBuffer>): number {
  analyser.getFloatTimeDomainData(buffer);
  let sum = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

interface TranscribeResult {
  transcript: string | null;
  error: string | null;
}

async function transcribeBlob(blob: Blob): Promise<TranscribeResult> {
  if (blob.size < MIN_BLOB_BYTES) {
    return { transcript: null, error: 'Recording too short — try speaking a bit longer.' };
  }

  const contentType = (blob.type || 'audio/webm').split(';')[0];

  const res = await fetch('/api/ai/stt', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  const data = (await res.json().catch(() => ({}))) as {
    transcript?: string;
    error?: string;
  };

  if (!res.ok) {
    return {
      transcript: null,
      error: data.error ?? 'Could not transcribe audio. Try again.',
    };
  }

  return {
    transcript: data.transcript?.trim() ?? null,
    error: data.transcript?.trim() ? null : 'No speech detected — try again.',
  };
}

export function useVoiceInput() {
  const [status, setStatus] = useState<'idle' | 'listening' | 'transcribing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const stopRequestedRef = useRef(false);
  const onTranscriptRef = useRef<((text: string) => void) | null>(null);
  const onFailureRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    chunksRef.current = [];
    stopRequestedRef.current = false;
  }, []);

  const finalizeRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      cleanup();
      setStatus('idle');
      return null;
    }

    return new Promise<string | null>((resolve) => {
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        cleanup();

        if (!blob.size) {
          setStatus('idle');
          onFailureRef.current?.();
          resolve(null);
          return;
        }

        setStatus('transcribing');
        const result = await transcribeBlob(blob);

        if (result.transcript) {
          setStatus('idle');
          setError(null);
          onTranscriptRef.current?.(result.transcript);
          resolve(result.transcript);
          return;
        }

        setStatus('error');
        setError(result.error ?? 'Could not transcribe audio. Try again.');
        onFailureRef.current?.();
        resolve(null);
      };

      recorder.stop();
    });
  }, [cleanup]);

  const stopListening = useCallback(async () => {
    stopRequestedRef.current = true;
    return finalizeRecording();
  }, [finalizeRecording]);

  const startListening = useCallback(
    async (
      onTranscript: (text: string) => void,
      onFailure?: () => void
    ) => {
      if (status === 'listening' || status === 'transcribing') return;

      onTranscriptRef.current = onTranscript;
      onFailureRef.current = onFailure ?? null;
      setError(null);
      stopRequestedRef.current = false;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        chunksRef.current = [];

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.start(250);

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;

        const buffer = new Float32Array(analyser.fftSize);
        const startedAt = Date.now();
        let speechStartedAt: number | null = null;
        let lastSpeechAt = startedAt;

        const monitor = () => {
          if (stopRequestedRef.current || !analyserRef.current) return;

          const rms = measureRms(analyserRef.current, buffer);
          const now = Date.now();

          if (rms >= SILENCE_RMS_THRESHOLD) {
            if (speechStartedAt === null) {
              speechStartedAt = now;
            }
            lastSpeechAt = now;
          }

          const spokeLongEnough =
            speechStartedAt !== null && now - speechStartedAt >= MIN_SPEECH_MS;
          const silentLongEnough = now - lastSpeechAt >= SILENCE_DURATION_MS;

          if (spokeLongEnough && silentLongEnough) {
            void finalizeRecording();
            return;
          }

          if (now - startedAt >= MAX_RECORDING_MS) {
            void finalizeRecording();
            return;
          }

          rafRef.current = requestAnimationFrame(monitor);
        };

        setStatus('listening');
        rafRef.current = requestAnimationFrame(monitor);
      } catch {
        cleanup();
        setStatus('error');
        setError('Microphone access denied or unavailable.');
        onFailureRef.current?.();
      }
    },
    [cleanup, finalizeRecording, status]
  );

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    error,
    isListening: status === 'listening',
    isTranscribing: status === 'transcribing',
    startListening,
    stopListening,
  };
}
