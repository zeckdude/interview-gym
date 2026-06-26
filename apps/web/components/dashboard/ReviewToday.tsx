import { Card } from '@/components/ui/Card';

export function ReviewToday() {
  return (
    <section>
      <h2 className="font-display font-bold text-xl text-text-primary mb-4">
        Review Today
      </h2>
      <Card className="text-center py-10">
        <p className="text-4xl mb-4">💪</p>
        <p className="font-body text-text-secondary max-w-md mx-auto">
          Your personalized review queue will appear here once you&apos;ve
          completed a few challenges. Keep going!
        </p>
      </Card>
    </section>
  );
}
