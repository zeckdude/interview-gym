import { PageWrapper } from '@/components/layout/PageWrapper';
import { GenerateChallengeClient } from '@/components/generate/GenerateChallengeClient';

export default function GeneratePage() {
  return (
    <PageWrapper title="Generate Challenge">
      <div className="space-y-4 mb-6">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          ✨ Generate a Challenge
        </h1>
        <p className="font-body text-base text-text-secondary max-w-2xl">
          Tell me about a real interview challenge you encountered. I&apos;ll build a full practice
          challenge, lesson, and mini-challenge from your description.
        </p>
      </div>
      <GenerateChallengeClient />
    </PageWrapper>
  );
}
