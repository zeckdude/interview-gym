import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface RecentBadge {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: string;
}

interface BadgesPreviewProps {
  badges: RecentBadge[];
}

export function BadgesPreview({ badges }: BadgesPreviewProps) {
  if (badges.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-text-primary">Badges</h2>
          <Link
            href="/badges"
            className="font-body text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            View All Badges →
          </Link>
        </div>
        <Card className="text-center py-8">
          <p className="text-3xl mb-3">🏅</p>
          <p className="font-body text-base text-text-primary">
            Complete challenges to earn your first badge!
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-text-primary">Recent Badges</h2>
        <Link
          href="/badges"
          className="font-body text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          View All Badges →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <Card key={badge.slug} className="p-4 text-center">
            <span className="text-4xl block mb-2">{badge.emoji}</span>
            <p className="font-display font-bold text-text-primary text-base">{badge.name}</p>
            <p className="font-body text-sm text-text-primary mt-1">{badge.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
