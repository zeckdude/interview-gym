import type { MistakeKind } from '@/lib/learn/mistake-kind';

export type LearnHintEventType = 'wrong_attempt' | 'hint_shown' | 'reveal' | 'success';

export interface LearnHintEventPayload {
  moduleId: string;
  stepId: string;
  stepType: 'predict-output' | 'code-challenge';
  eventType: LearnHintEventType;
  mistakeKind?: MistakeKind | null;
  answerFingerprint?: string;
  hintsShown?: number;
  revealed?: boolean;
  eventuallyCorrect?: boolean;
}

/** Fire-and-forget hint analytics — non-blocking for the learner. */
export async function recordHintEvent(payload: LearnHintEventPayload): Promise<void> {
  try {
    await fetch('/api/learn/hint-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    /* non-blocking */
  }
}
