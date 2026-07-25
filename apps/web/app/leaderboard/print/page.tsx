import { getLeaderboardData } from '@/lib/leaderboard';
import { LeaderboardPrintView } from '@/components/leaderboard/LeaderboardPrintView';
import './print.css';

export default async function LeaderboardPrintPage() {
  const data = await getLeaderboardData();

  return <LeaderboardPrintView data={data} />;
}
