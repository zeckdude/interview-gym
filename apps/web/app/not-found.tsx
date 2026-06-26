import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageWrapper title="Not Found">
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🏋️</p>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Challenge not found
        </h1>
        <p className="font-body text-text-secondary mb-6">
          This challenge doesn&apos;t exist or isn&apos;t available yet.
        </p>
        <Link href="/challenges">
          <Button>Back to Challenges</Button>
        </Link>
      </div>
    </PageWrapper>
  );
}
