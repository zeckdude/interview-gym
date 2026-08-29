import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReviewClient } from '@/components/learn/ReviewClient';

export default async function ReviewPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return <ReviewClient />;
}
