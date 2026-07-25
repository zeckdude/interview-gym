import { PageWrapper } from '@/components/layout/PageWrapper';
import { SimulatorResults } from '@/components/simulator/SimulatorResults';

export default function SimulatorResultsPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <PageWrapper title="Session Results" fullWidth>
      <SimulatorResults sessionId={params.sessionId} />
    </PageWrapper>
  );
}
