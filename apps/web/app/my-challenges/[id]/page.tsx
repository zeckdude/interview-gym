import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { UserChallengeRunner } from '@/components/user-challenges/UserChallengeRunner';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserChallengePage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect('/sign-in');

  const challenge = await prisma.userChallenge.findFirst({
    where: { id, userId: user.id },
  });

  if (!challenge) notFound();

  return (
    <PageWrapper title={challenge.title} fullWidth>
      <UserChallengeRunner record={challenge} />
    </PageWrapper>
  );
}
