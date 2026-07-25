import { SimulatorRunner } from '@/components/simulator/SimulatorRunner';

export default function SimulatorSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SimulatorRunner sessionId={params.sessionId} />;
}
