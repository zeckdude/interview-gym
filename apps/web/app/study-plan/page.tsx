import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { StudyPlanListClient } from '@/components/study-plan/StudyPlanListClient';

export default async function StudyPlanPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return <StudyPlanListClient />;
}
