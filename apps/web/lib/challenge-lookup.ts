import { getChallengeById, allQuestions } from '@/data';
import type { ChallengeDifficulty } from '@/data/types';
import { getVoiceQuestionById } from '@/data/voice-interviews';
import { getCategoryLabelForChallengeType } from '@/lib/categories';

export function getChallengeDifficulty(
  challengeId: string,
  challengeType: string
): ChallengeDifficulty {
  const challenge = getChallengeById(challengeId);
  if (challenge) return challenge.difficulty;

  const question = allQuestions.find((q) => q.id === challengeId);
  if (question) return question.difficulty;

  const voiceQ = getVoiceQuestionById(challengeId);
  if (voiceQ) return voiceQ.difficulty;

  return 'intermediate';
}

export function getChallengeTitle(challengeId: string): string {
  const challenge = getChallengeById(challengeId);
  if (challenge) return challenge.title;

  const question = allQuestions.find((q) => q.id === challengeId);
  if (question) return question.question.slice(0, 80) + (question.question.length > 80 ? '…' : '');

  const voiceQ = getVoiceQuestionById(challengeId);
  if (voiceQ) {
    return voiceQ.question.slice(0, 80) + (voiceQ.question.length > 80 ? '…' : '');
  }

  return challengeId;
}

export function getChallengeHref(challengeId: string, challengeType: string): string {
  if (challengeType === 'voice-interview') {
    return `/simulator/voice?questionId=${encodeURIComponent(challengeId)}&review=1`;
  }
  if (
    challengeType === 'be-question' ||
    challengeType === 'fe-question' ||
    challengeType === 'nextjs-question'
  ) {
    return `/questions/${challengeId}`;
  }
  return `/challenges/${challengeId}`;
}

export function getCategoryLabel(challengeType: string): string {
  if (challengeType === 'voice-interview') return 'Voice Interview';
  return getCategoryLabelForChallengeType(challengeType);
}
