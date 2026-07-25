import { Suspense } from 'react';
import { LessonsList } from '@/components/lessons/LessonsList';
import { getLessonProgressMap } from '@/lib/lessons';

export default async function LessonsPage() {
  const progressMap = await getLessonProgressMap();

  return (
    <Suspense>
      <LessonsList progressMap={Object.fromEntries(progressMap)} />
    </Suspense>
  );
}
