import type { VoiceInterviewQuestion } from '@/data/voice-interviews';
import { getVoiceQuestionById } from '@/data/voice-interviews';
import { prisma } from '@/lib/prisma';

function parseQuestionIds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (raw && typeof raw === 'object' && 'ids' in raw) {
    return (raw as { ids: string[] }).ids ?? [];
  }
  return [];
}

export function playbookQuestionToVoice(
  id: string,
  questionText: string,
  category: string
): VoiceInterviewQuestion {
  return {
    id,
    category: 'behavioral',
    difficulty: 'intermediate',
    mostAsked: false,
    question: questionText,
    context: 'Answer with specific examples, business impact, and your personal ownership.',
    idealAnswerGuidance:
      'Strong: specific story with measurable impact, clear "I" statements, structured answer. Weak: vague generalities, no metrics, too humble.',
    followUpBank: [
      'Can you go deeper on the technical details?',
      'What was the measurable outcome?',
      'What would you do differently?',
    ],
    challengeQuestions: [
      'How do we know you were the one driving this, not just participating?',
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 2.5,
  };
}

export async function resolveSessionQuestions(
  questionIdsRaw: unknown,
  customQuestionTexts: unknown
): Promise<VoiceInterviewQuestion[]> {
  const questionIds = parseQuestionIds(questionIdsRaw);
  const customTexts = Array.isArray(customQuestionTexts)
    ? (customQuestionTexts as string[])
    : [];

  const results: VoiceInterviewQuestion[] = [];

  for (let i = 0; i < questionIds.length; i++) {
    const id = questionIds[i];
    const voiceQ = getVoiceQuestionById(id);
    if (voiceQ) {
      results.push(voiceQ);
      continue;
    }

    if (id.startsWith('playbook-custom-') && customTexts[i]) {
      results.push(playbookQuestionToVoice(id, customTexts[i], 'mixed'));
      continue;
    }

    const playbookQ = await prisma.playbookQuestion.findUnique({ where: { id } });
    if (playbookQ) {
      results.push(
        playbookQuestionToVoice(playbookQ.id, playbookQ.questionText, playbookQ.category)
      );
      continue;
    }

    if (customTexts[i]) {
      results.push(playbookQuestionToVoice(id, customTexts[i], 'mixed'));
    }
  }

  return results;
}

export { parseQuestionIds };
