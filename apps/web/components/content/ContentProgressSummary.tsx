import { ProgressRing } from '@/components/lessons/ProgressRing';

interface ContentProgressSummaryProps {
  completed: number;
  total: number;
  label: string;
}

export function ContentProgressSummary({
  completed,
  total,
  label,
}: ContentProgressSummaryProps) {
  return <ProgressRing completed={completed} total={total} label={label} />;
}
