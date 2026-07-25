import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StudyPlanBadge } from '@/components/study-plan/StudyPlanBadge';
import { buildLessonPath } from '@/lib/content-filter-url';
import type { Lesson, LessonProgressRecord } from '@/data/lessons';

interface LessonCardProps {
  lesson: Lesson;
  progress: LessonProgressRecord | null;
  filterQuery?: string;
  showMostAsked?: boolean;
  mostAskedIsPersonal?: boolean;
  mostAskedReason?: string;
}

function getStatusLabel(progress: LessonProgressRecord | null) {
  if (progress?.completed) return 'Completed ✓';
  if (progress && progress.attempts > 0) return 'In Progress';
  return 'Not Started';
}

export function LessonCard({
  lesson,
  progress,
  filterQuery = '',
  showMostAsked = false,
  mostAskedIsPersonal = false,
  mostAskedReason,
}: LessonCardProps) {
  const status = getStatusLabel(progress);

  return (
    <Link href={buildLessonPath(lesson.id, filterQuery)}>
      <Card className="relative h-full hover:shadow-raised hover:border-brand/30 transition-all cursor-pointer">
        {showMostAsked && (
          <span
            className="absolute top-3 right-3 bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            title={
              mostAskedIsPersonal
                ? 'Marked as Most Asked by you'
                : mostAskedReason ?? 'Commonly asked in senior interviews'
            }
          >
            🔥 Most Asked
            {mostAskedIsPersonal && <span className="opacity-70">· You</span>}
          </span>
        )}

        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex gap-2 flex-wrap pr-24">
            <Badge type="category" value={lesson.category} />
            <Badge type="difficulty" value={lesson.difficulty} />
            <StudyPlanBadge variant="lesson" itemId={lesson.id} />
          </div>
          <span className="font-body text-sm text-text-muted whitespace-nowrap">
            {lesson.estimatedMinutes} min
          </span>
        </div>

        <h3 className="font-display font-bold text-lg text-text-primary dark:text-[#F0EDE8] mb-3 leading-snug">
          {lesson.title}
        </h3>

        <p
          className={`font-body text-sm ${
            progress?.completed
              ? 'text-success font-semibold'
              : progress && progress.attempts > 0
                ? 'text-brand font-semibold'
                : 'text-text-muted'
          }`}
        >
          {status}
        </p>

        {progress?.bestTimeMs !== null && progress?.bestTimeMs !== undefined && (
          <p className="font-body text-xs text-text-muted mt-2">
            Best time: {Math.ceil(progress.bestTimeMs / 1000)}s
          </p>
        )}
      </Card>
    </Link>
  );
}
