import { notFound } from 'next/navigation';
import { ChallengeRunner } from '@/components/challenges/ChallengeRunner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { getChallengeById } from '@/data';

interface ChallengePageProps {
  params: { id: string };
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const challenge = getChallengeById(params.id);

  if (!challenge || challenge.comingSoon) {
    notFound();
  }

  return (
    <PageWrapper title={challenge.title} fullWidth>
      <ChallengeRunner challengeId={challenge.id} />
    </PageWrapper>
  );
}
