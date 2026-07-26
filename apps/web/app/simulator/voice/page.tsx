import { Suspense } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { VoiceInterviewSetup } from '@/components/voice-interviews/VoiceInterviewSetup';
import { Spinner } from '@/components/ui/Spinner';

export default function VoiceInterviewPage() {
  return (
    <PageWrapper title="Voice Interview">
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        }
      >
        <VoiceInterviewSetup />
      </Suspense>
    </PageWrapper>
  );
}
