import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SystemDesignRunner } from '@/components/systems-design/SystemDesignRunner';
import { getSystemDesignChallengeById } from '@/data/system-design';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SystemDesignChallengePage({ params }: PageProps) {
  const { id } = await params;
  const challenge = getSystemDesignChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return (
    <PageWrapper title={challenge.title} fullWidth>
      <SystemDesignRunner challenge={challenge} />
    </PageWrapper>
  );
}
