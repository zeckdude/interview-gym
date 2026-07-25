import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { UserLessonRunner } from '@/components/user-challenges/UserLessonRunner';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserChallengeLessonPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect('/sign-in');

  const challenge = await prisma.userChallenge.findFirst({
    where: { id, userId: user.id },
  });

  if (!challenge) notFound();

  return <UserLessonRunner record={challenge} />;
}
