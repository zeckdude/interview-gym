import { PageWrapper } from '@/components/layout/PageWrapper';
import { VoiceInterviewRunner } from '@/components/voice-interviews/VoiceInterviewRunner';

export default async function VoiceInterviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <PageWrapper title="Voice Interview">
      <VoiceInterviewRunner sessionId={sessionId} />
    </PageWrapper>
  );
}
