import type { VoiceInterviewQuestion } from '@/data/voice-interviews';

export type ExchangeType = 'opening' | 'followup' | 'challenge' | 'wrap';

export interface SessionExchange {
  order: number;
  questionText: string;
  questionType: ExchangeType;
  answerTranscript?: string | null;
  aiContentScore?: number | null;
  recommendedFollowUpType?: 'followup' | 'challenge';
}

export interface InterviewState {
  currentQuestion: VoiceInterviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  exchanges: SessionExchange[];
  includeFollowUps: boolean;
  maxFollowUpsPerQuestion: number;
}

export function getOpeningQuestion(question: VoiceInterviewQuestion): {
  question: string;
  type: ExchangeType;
} {
  return { question: question.question, type: 'opening' };
}

export function getWrapUpQuestion(): { question: string; type: ExchangeType; shouldEnd: boolean } {
  return {
    question:
      "Thanks for that. Is there anything you'd add or clarify from any of your answers?",
    type: 'wrap',
    shouldEnd: true,
  };
}

export function countExchangesForCurrentQuestion(
  state: InterviewState
): number {
  const openingsBefore = state.exchanges.filter((e) => e.questionType === 'opening').length;
  const isLastQuestion = state.questionIndex >= state.totalQuestions - 1;
  if (isLastQuestion && openingsBefore === state.totalQuestions) {
    return state.exchanges.length - state.exchanges.findIndex(
      (e, i) =>
        e.questionType === 'opening' &&
        state.exchanges.slice(0, i + 1).filter((x) => x.questionType === 'opening').length ===
          state.totalQuestions
    );
  }

  const currentOpeningIndex = state.exchanges.findIndex(
    (e, i) =>
      e.questionType === 'opening' &&
      state.exchanges.slice(0, i + 1).filter((x) => x.questionType === 'opening').length ===
        state.questionIndex + 1
  );

  if (currentOpeningIndex === -1) return 0;
  const nextOpening = state.exchanges.findIndex(
    (e, i) => i > currentOpeningIndex && e.questionType === 'opening'
  );
  const end = nextOpening === -1 ? state.exchanges.length : nextOpening;
  return end - currentOpeningIndex;
}

export function shouldAskFollowUp(state: InterviewState): boolean {
  if (!state.includeFollowUps) return false;
  const exchangesForQuestion = countExchangesForCurrentQuestion(state);
  return exchangesForQuestion <= state.maxFollowUpsPerQuestion;
}

export function isQuestionComplete(state: InterviewState): boolean {
  if (!state.includeFollowUps) {
    return state.exchanges.some(
      (e) =>
        e.questionType === 'opening' &&
        e.answerTranscript &&
        state.exchanges.filter((x) => x.questionType === 'opening' && x.answerTranscript).length >
          state.questionIndex
    );
  }

  const lastExchange = state.exchanges[state.exchanges.length - 1];
  if (!lastExchange?.answerTranscript) return false;

  const followUpsForQuestion =
    countExchangesForCurrentQuestion(state) - 1;
  return followUpsForQuestion >= state.maxFollowUpsPerQuestion;
}

export function computeCommunicationScore(exchanges: SessionExchange[]): number {
  const answered = exchanges.filter((e) => e.answerTranscript);
  if (answered.length === 0) return 0;

  let score = 70;
  const avgFillers =
    answered.reduce((sum, e) => sum + ((e as { fillerWordCount?: number }).fillerWordCount ?? 0), 0) /
    answered.length;

  if (avgFillers <= 2) score += 15;
  else if (avgFillers <= 5) score += 5;
  else score -= Math.min(20, avgFillers * 2);

  return Math.max(0, Math.min(100, Math.round(score)));
}
