import { OpsHeader } from '@/components/ops/OpsHeader';
import { OpsLoginForm } from '@/components/ops/OpsLoginForm';
import { isOpsAuthenticated } from '@/lib/ops-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isOpsAuthenticated();

  if (!authed) {
    return <OpsLoginForm />;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <OpsHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
