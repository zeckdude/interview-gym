import { PageWrapper } from '@/components/layout/PageWrapper';
import { BadgesGrid } from '@/components/badges/BadgesGrid';

export default function BadgesPage() {
  return (
    <PageWrapper title="Badges">
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
            Your Collection 🏅
          </h1>
          <p className="font-body text-text-primary text-base">
            Milestones you&apos;ve unlocked on your interview prep journey.
          </p>
        </div>
        <BadgesGrid />
      </div>
    </PageWrapper>
  );
}
