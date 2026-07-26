import { PageWrapper } from '@/components/layout/PageWrapper';
import { PlaybookClient } from '@/components/playbook/PlaybookClient';

export default function PlaybookPage() {
  return (
    <PageWrapper title="My Playbook">
      <PlaybookClient />
    </PageWrapper>
  );
}
