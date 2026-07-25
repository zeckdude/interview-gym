import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ChallengeRunner } from '@/components/challenges/ChallengeRunner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { getChallengeById } from '@/data';
import { getNoteForChallenge } from '@/lib/notes';
import { prisma } from '@/lib/prisma';
import { getWeakSpotForChallenge } from '@/lib/weak-spots';

interface ChallengePageProps {
  params: { id: string };
  searchParams: { review?: string };
}

export default async function ChallengePage({ params, searchParams }: ChallengePageProps) {
  const challenge = getChallengeById(params.id);

  if (!challenge || challenge.comingSoon) {
    notFound();
  }

  let weakSpot: { failedAttempts: number } | null = null;
  let initialNote: { content: string; updatedAt: string } | null = null;
  const isReviewSession = searchParams.review === '1';

  const { userId } = await auth();

  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) {
      weakSpot = await getWeakSpotForChallenge(user.id, challenge.id);
      const note = await getNoteForChallenge(user.id, challenge.id);
      if (note) {
        initialNote = { content: note.content, updatedAt: note.updatedAt };
      }
    }
  }

  return (
    <PageWrapper title={challenge.title} fullWidth>
      <ChallengeRunner
        challengeId={challenge.id}
        weakSpot={weakSpot}
        isReviewSession={isReviewSession}
        initialNote={initialNote}
      />
    </PageWrapper>
  );
}
