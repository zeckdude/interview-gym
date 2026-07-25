'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getAudioPreferences } from '@/lib/audio-preferences';
import { float32ToLinear16, measureAudioLevel } from '@/lib/pcm-audio';

const FLUX_SAMPLE_RATE = 16000;
const FLUX_EOT_THRESHOLD = 0.7;
const FLUX_EOT_TIMEOUT_MS = 5000;
const MIN_TRANSCRIPT_CHARS = 3;

interface FluxTurnInfo {
  type: string;
  event?: string;
  transcript?: string;
}

function buildFluxUrl(): string {
  const url = new URL('wss://api.deepgram.com/v2/listen');
  url.searchParams.set('model', 'flux-general-en');
  url.searchParams.set('encoding', 'linear16');
  url.searchParams.set('sample_rate', String(FLUX_SAMPLE_RATE));
  url.searchParams.set('eot_threshold', String(FLUX_EOT_THRESHOLD));
  url.searchParams.set('eot_timeout_ms', String(FLUX_EOT_TIMEOUT_MS));
  return url.toString();
}

function openFluxWebSocket(accessToken: string): WebSocket {
  return new WebSocket(buildFluxUrl(), ['bearer', accessToken]);
}

function extractMessageForKeywordMode(transcript: string, keyword: string): string | null {
  const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  const match = pattern.exec(transcript);
  if (!match) return null;

  const before = transcript.slice(0, match.index).trim();
  const after = transcript.slice(match.index + match[0].length).trim();
  const message = [before, after].filter(Boolean).join(' ').trim();
  return message || null;
}

async function fetchDeepgramAccessToken(): Promise<string> {
  const res = await fetch('/api/ai/stt/token', { method: 'POST' });
  const data = (await res.json().catch(() => ({}))) as {
    accessToken?: string;
    error?: string;
  };

  if (!res.ok || !data.accessToken) {
    throw new Error(data.error ?? 'Could not start voice recognition');
  }

  return data.accessToken;
}

export function useFluxVoiceInput() {
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'listening' | 'processing' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micActive, setMicActive] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const levelFrameRef = useRef<number | null>(null);
  const onTranscriptRef = useRef<((text: string) => void) | null>(null);
  const onFailureRef = useRef<(() => void) | null>(null);
  const activeRef = useRef(false);
  const connectingRef = useRef(false);
  const statusRef = useRef(status);
  const failureNotifiedRef = useRef(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopLevelMonitor = useCallback(() => {
    if (levelFrameRef.current !== null) {
      cancelAnimationFrame(levelFrameRef.current);
      levelFrameRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startLevelMonitor = useCallback(() => {
    stopLevelMonitor();
    const levelBuffer = new Float32Array(analyserRef.current?.fftSize ?? 2048);

    const monitorLevel = () => {
      if (!streamRef.current || !analyserRef.current) {
        levelFrameRef.current = null;
        return;
      }
      const level = measureAudioLevel(analyserRef.current, levelBuffer);
      setAudioLevel(Math.min(1, level * 10));
      levelFrameRef.current = requestAnimationFrame(monitorLevel);
    };

    levelFrameRef.current = requestAnimationFrame(monitorLevel);
  }, [stopLevelMonitor]);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    connectingRef.current = false;
    stopLevelMonitor();
    setMicActive(false);

    processorRef.current?.disconnect();
    processorRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void audioContextRef.current?.close();
    audioContextRef.current = null;

    const ws = wsRef.current;
    wsRef.current = null;
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: 'CloseStream' }));
        } catch {
          /* ignore */
        }
      }
      ws.close();
    }
  }, [stopLevelMonitor]);

  const notifyFailureOnce = useCallback(() => {
    if (failureNotifiedRef.current) return;
    failureNotifiedRef.current = true;
    onFailureRef.current?.();
  }, []);

  const stopListening = useCallback(async () => {
    failureNotifiedRef.current = false;
    cleanup();
    setStatus('idle');
    setLiveTranscript('');
    setError(null);
  }, [cleanup]);

  /** Mic stays hot — ready for the next EndOfTurn after AI finishes. */
  const finishProcessing = useCallback((): boolean => {
    if (!activeRef.current) {
      setStatus('idle');
      return false;
    }
    setStatus('listening');
    setLiveTranscript('');
    setError(null);
    return true;
  }, []);

  const handleTurnComplete = useCallback((transcript: string) => {
    if (!activeRef.current) return;

    const trimmed = transcript.trim();
    if (!trimmed || trimmed.length < MIN_TRANSCRIPT_CHARS) {
      setStatus('listening');
      return;
    }

    const prefs = getAudioPreferences();

    if (prefs.voiceChatSendMode === 'keyword') {
      const message = extractMessageForKeywordMode(trimmed, prefs.voiceChatKeyword);
      if (!message || message.length < MIN_TRANSCRIPT_CHARS) {
        setLiveTranscript(trimmed);
        setStatus('listening');
        return;
      }
      setStatus('processing');
      setLiveTranscript('');
      setError(null);
      onTranscriptRef.current?.(message);
      return;
    }

    setStatus('processing');
    setLiveTranscript('');
    setError(null);
    onTranscriptRef.current?.(trimmed);
  }, []);

  const startListening = useCallback(
    async (onTranscript: (text: string) => void, onFailure?: () => void) => {
      if (activeRef.current || connectingRef.current) {
        return;
      }

      connectingRef.current = true;
      failureNotifiedRef.current = false;
      onTranscriptRef.current = onTranscript;
      onFailureRef.current = onFailure ?? null;
      setError(null);
      setLiveTranscript('');
      setStatus('connecting');

      try {
        const accessToken = await fetchDeepgramAccessToken();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            channelCount: 1,
          },
        });

        if (!connectingRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const ws = openFluxWebSocket(accessToken);
        wsRef.current = ws;
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => {
          if (!connectingRef.current && !activeRef.current) return;
          activeRef.current = true;
          connectingRef.current = false;
          failureNotifiedRef.current = false;
          setStatus('listening');
          setMicActive(true);
          setError(null);
          startLevelMonitor();
        };

        ws.onmessage = (event) => {
          if (!activeRef.current) return;

          try {
            const message = JSON.parse(event.data as string) as FluxTurnInfo;
            if (message.type !== 'TurnInfo') return;

            if (message.transcript) {
              setLiveTranscript(message.transcript);
            }

            if (message.event === 'EndOfTurn') {
              handleTurnComplete(message.transcript ?? '');
            }
          } catch {
            /* ignore non-json frames */
          }
        };

        ws.onerror = () => {
          if (!activeRef.current && !connectingRef.current) return;
          cleanup();
          setStatus('error');
          setError('Voice connection to Deepgram failed. Check your API key can mint tokens.');
          notifyFailureOnce();
        };

        ws.onclose = (event) => {
          if (!activeRef.current && !connectingRef.current) return;
          const wasActive = activeRef.current || connectingRef.current;
          cleanup();
          if (statusRef.current === 'processing') {
            setStatus('idle');
            notifyFailureOnce();
            return;
          }
          if (wasActive) {
            setStatus('error');
            const detail =
              event.code === 1006
                ? 'Could not reach Deepgram.'
                : event.reason || `Connection closed (${event.code}).`;
            setError(`Voice connection lost: ${detail}`);
            notifyFailureOnce();
          } else {
            setStatus('idle');
          }
        };

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        await audioContext.resume();

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (event) => {
          const socket = wsRef.current;
          if (!activeRef.current || !socket || socket.readyState !== WebSocket.OPEN) return;

          const channel = event.inputBuffer.getChannelData(0);
          const pcm = float32ToLinear16(channel, audioContext.sampleRate);
          socket.send(pcm);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        startLevelMonitor();
      } catch (err) {
        connectingRef.current = false;
        cleanup();
        setStatus('error');
        setError(
          err instanceof Error ? err.message : 'Microphone access denied or unavailable.'
        );
        notifyFailureOnce();
      }
    },
    [cleanup, handleTurnComplete, notifyFailureOnce, startLevelMonitor]
  );

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    error,
    audioLevel,
    liveTranscript,
    micActive,
    isListening: status === 'listening',
    isProcessing: status === 'processing',
    isMicLive: micActive,
    startListening,
    stopListening,
    finishProcessing,
  };
}
