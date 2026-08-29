import { OpsHeader } from '@/components/ops/OpsHeader';
import { OpsLoginForm } from '@/components/ops/OpsLoginForm';
import { isOpsAuthenticated } from '@/lib/ops-auth';

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const authed = await isOpsAuthenticated();

  if (!authed) {
    return <OpsLoginForm />;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <OpsHeader />
      {children}
    </div>
  );
}
