import Link from 'next/link';
import { PATH_TYPE_LABELS, type PathType } from '@/lib/paths/types';

interface ActivePathBannerProps {
  name: string;
  type: string;
  interviewDate: string | null;
  currentStage: number;
  totalComplete: number;
  totalItems: number;
}

function daysUntil(dateIso: string): number {
  const target = new Date(dateIso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function ActivePathBanner({
  name,
  type,
  interviewDate,
  currentStage,
  totalComplete,
  totalItems,
}: ActivePathBannerProps) {
  const pathLabel = PATH_TYPE_LABELS[type as PathType] ?? type;

  return (
    <div className="bg-brand-light border border-brand rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <p className="font-display font-bold text-text-primary text-base">
          {interviewDate
            ? `${daysUntil(interviewDate)} days until your interview`
            : `Active path: ${name}`}
        </p>
        <p className="font-body text-sm text-text-secondary mt-0.5">
          {pathLabel} · Stage {currentStage} · {totalComplete}/{totalItems} complete
        </p>
      </div>
      <Link
        href="/my-path"
        className="inline-flex justify-center bg-brand text-white font-body font-semibold text-sm px-4 py-2 rounded-md hover:opacity-90 transition-all"
      >
        See Today&apos;s Focus →
      </Link>
    </div>
  );
}
