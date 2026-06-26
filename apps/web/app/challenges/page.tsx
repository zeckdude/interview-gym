import { ChallengesList } from '@/components/challenges/ChallengesList';
import { getChallengeAttemptStats } from '@/lib/dashboard';

export default async function ChallengesPage() {
  const statsMap = await getChallengeAttemptStats();
  const attemptStats = Object.fromEntries(statsMap);

  return <ChallengesList attemptStats={attemptStats} />;
}
