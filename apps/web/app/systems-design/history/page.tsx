import { PageWrapper } from '@/components/layout/PageWrapper';
import { SystemDesignHistory } from '@/components/systems-design/SystemDesignHistory';

export default function SystemDesignHistoryPage() {
  return (
    <PageWrapper title="Systems Design History" fullWidth>
      <SystemDesignHistory />
    </PageWrapper>
  );
}
