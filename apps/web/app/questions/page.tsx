import { Suspense } from 'react';
import { getChallengeAttemptStats } from '@/lib/dashboard';
import { QuestionsList } from '@/components/questions/QuestionsList';

export default async function QuestionsPage() {
  const statsMap = await getChallengeAttemptStats();
  const attemptStats = Object.fromEntries(statsMap);

  return (
    <Suspense>
      <QuestionsList attemptStats={attemptStats} />
    </Suspense>
  );
}
