import { auth } from '@clerk/nextjs/server';
import { ChallengesList } from '@/components/challenges/ChallengesList';
import { getChallengeAttemptStats } from '@/lib/dashboard';
import { prisma } from '@/lib/prisma';
import { getWeakSpotMap } from '@/lib/weak-spots';

export default async function ChallengesPage() {
  const statsMap = await getChallengeAttemptStats();
  const attemptStats = Object.fromEntries(statsMap);

  let weakSpots: Record<string, number> = {};
  const { userId } = await auth();
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) {
      weakSpots = await getWeakSpotMap(user.id);
    }
  }

  return <ChallengesList attemptStats={attemptStats} weakSpots={weakSpots} />;
}
