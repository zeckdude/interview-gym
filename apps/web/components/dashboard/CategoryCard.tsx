import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';

interface CategoryCardProps {
  name: string;
  category: 'be' | 'fe' | 'fe-advanced' | 'nextjs' | 'be-question' | 'fe-question' | 'nextjs-question';
  completed: number;
  total: number;
  passRate: number;
  href: string;
}

export function CategoryCard({
  name,
  category,
  completed,
  total,
  passRate,
  href,
}: CategoryCardProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Badge type="category" value={category} />
          <h3 className="font-display font-bold text-lg text-text-primary dark:text-[#F0EDE8] mt-2">
            {name}
          </h3>
        </div>
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={progress} />
          <span className="absolute font-display font-bold text-xs text-text-primary dark:text-[#F0EDE8]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <p className="font-body text-sm text-text-secondary dark:text-[#AAA5A0] mb-1">
        {completed}/{total} completed
      </p>
      <p className="font-body text-xs text-text-muted dark:text-[#8A8580] mb-4">
        {passRate}% pass rate
      </p>

      <Link href={href} className="mt-auto">
        <Button variant="secondary" className="w-full text-sm py-2.5">
          Start Practicing
        </Button>
      </Link>
    </Card>
  );
}
