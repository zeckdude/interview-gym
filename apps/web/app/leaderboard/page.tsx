import { PageWrapper } from '@/components/layout/PageWrapper';
import { LeaderboardClient } from '@/components/leaderboard/LeaderboardClient';
import { getLeaderboardData } from '@/lib/leaderboard';

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  return (
    <PageWrapper title="My Bests">
      <LeaderboardClient data={data} />
    </PageWrapper>
  );
}
