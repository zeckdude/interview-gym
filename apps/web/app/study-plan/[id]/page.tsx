import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { StudyPlanDetailClient } from '@/components/study-plan/StudyPlanDetailClient';

interface StudyPlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPlanDetailPage({ params }: StudyPlanDetailPageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  return <StudyPlanDetailClient planItemId={id} />;
}
