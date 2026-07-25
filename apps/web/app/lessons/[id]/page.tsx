import { notFound } from 'next/navigation';
import { LessonRunner } from '@/components/lessons/LessonRunner';
import { getLessonById } from '@/data/lessons';
import { getLessonProgressMap } from '@/lib/lessons';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const progressMap = await getLessonProgressMap();
  const progress = progressMap.get(lesson.id) ?? null;

  return <LessonRunner lessonId={lesson.id} initialProgress={progress} />;
}
