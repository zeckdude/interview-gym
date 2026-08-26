import type Anthropic from '@anthropic-ai/sdk';
import {
  GENERATE_CHALLENGE_SYSTEM_PROMPT,
  type GeneratedChallengePayload,
} from '@/lib/user-challenge';
import {
  parseGeneratedChallenge,
  repairGeneratedChallengeJson,
} from '@/lib/challenge-json';
import { AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { createAppNotification, sendPushNotification } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

async function updateJobStatus(
  jobId: string,
  data: {
    status?: string;
    statusMessage?: string;
    challengeId?: string;
    errorMessage?: string;
    completedAt?: Date;
  }
) {
  await prisma.challengeGenerationJob.update({
    where: { id: jobId },
    data: { ...data, updatedAt: new Date() },
  });
}

async function parseChallengeResponse(
  raw: string,
  anthropic: Anthropic,
  jobId: string
): Promise<GeneratedChallengePayload> {
  try {
    return parseGeneratedChallenge(raw);
  } catch (parseErr) {
    console.warn('[generate-challenge-job] Initial parse failed, attempting repair:', parseErr);

    await updateJobStatus(jobId, {
      statusMessage: 'Fixing response format…',
    });

    try {
      return await repairGeneratedChallengeJson(raw, anthropic, AI_MODEL);
    } catch {
      throw new Error(
        'Could not parse the generated challenge. The AI response was malformed — please try again.'
      );
    }
  }
}

function validatePayload(payload: GeneratedChallengePayload): void {
  const validCategories = ['be', 'fe', 'fe-advanced'];
  const validDifficulties = ['easy', 'intermediate', 'advanced'];

  if (
    !payload.title ||
    !validCategories.includes(payload.category) ||
    !validDifficulties.includes(payload.difficulty) ||
    !payload.description ||
    !payload.starterCodeJs ||
    !payload.starterCodeTs ||
    !payload.solutionJs ||
    !payload.solutionTs ||
    !payload.lessonContent
  ) {
    throw new Error('Generated challenge was incomplete. Please try again.');
  }
}

export async function runGenerationJob(jobId: string): Promise<void> {
  const job = await prisma.challengeGenerationJob.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status === 'complete' || job.status === 'failed') {
    return;
  }

  try {
    requireApiKey();
  } catch {
    await updateJobStatus(jobId, {
      status: 'failed',
      errorMessage: 'ANTHROPIC_API_KEY is not configured',
      completedAt: new Date(),
    });
    await createAppNotification({
      userId: job.userId,
      type: 'challenge_failed',
      title: 'Challenge generation failed',
      body: 'AI is not configured on the server. Please try again later.',
      href: '/generate',
    });
    return;
  }

  await updateJobStatus(jobId, {
    status: 'processing',
    statusMessage: 'Analyzing your interview description…',
  });

  try {
    const { anthropic } = await import('@/lib/anthropic');

    await updateJobStatus(jobId, {
      statusMessage: 'Generating challenge, lesson, and starter code…',
    });

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 8192,
      system: GENERATE_CHALLENGE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `User's interview challenge description:\n\n${job.sourceDescription}`,
        },
      ],
    });

    const accumulated =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    if (!accumulated) {
      throw new Error('Empty response from AI');
    }

    if (response.stop_reason === 'max_tokens') {
      console.warn('[generate-challenge-job] Response hit max_tokens, repair likely needed');
    }

    await updateJobStatus(jobId, {
      statusMessage: 'Parsing and saving your challenge…',
    });

    const payload = await parseChallengeResponse(accumulated, anthropic, jobId);
    validatePayload(payload);

    const challenge = await prisma.userChallenge.create({
      data: {
        userId: job.userId,
        title: payload.title,
        category: payload.category,
        difficulty: payload.difficulty,
        description: payload.description,
        concepts: payload.concepts ?? [],
        starterCodeJs: payload.starterCodeJs,
        starterCodeTs: payload.starterCodeTs,
        solutionJs: payload.solutionJs,
        solutionTs: payload.solutionTs,
        lessonContent: payload.lessonContent,
        miniChallengePrompt: payload.miniChallengePrompt ?? '',
        companyName: job.companyName,
        sourceDescription: job.sourceDescription,
      },
    });

    await updateJobStatus(jobId, {
      status: 'complete',
      statusMessage: 'Challenge ready!',
      challengeId: challenge.id,
      completedAt: new Date(),
    });

    const href = `/my-challenges/${challenge.id}`;

    await createAppNotification({
      userId: job.userId,
      type: 'challenge_ready',
      title: 'Your challenge is ready!',
      body: `"${challenge.title}" is ready to practice.`,
      href,
    });

    await sendPushNotification(job.userId, {
      title: 'Your challenge is ready!',
      body: `"${challenge.title}" is ready to practice.`,
      url: href,
    });

    const { evaluateAndSlotContentAsync } = await import('@/lib/paths/auto-evaluate');
    evaluateAndSlotContentAsync({
      id: challenge.id,
      type: 'challenge',
      title: challenge.title,
      description: challenge.description,
      concepts: challenge.concepts,
      difficulty: challenge.difficulty,
      category: challenge.category,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to generate challenge. Please try again.';

    console.error('[generate-challenge-job] Error:', err);

    await updateJobStatus(jobId, {
      status: 'failed',
      errorMessage: message,
      completedAt: new Date(),
    });

    await createAppNotification({
      userId: job.userId,
      type: 'challenge_failed',
      title: 'Challenge generation failed',
      body: message,
      href: '/generate',
    });

    await sendPushNotification(job.userId, {
      title: 'Challenge generation failed',
      body: message,
      url: '/generate',
    });
  }
}
