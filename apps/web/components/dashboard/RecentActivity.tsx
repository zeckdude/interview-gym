import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDuration, formatRelativeTime } from '@/lib/utils';
import { getChallengeById } from '@/data';

interface ActivityItem {
  id: string;
  challengeId: string;
  challengeType: string;
  passed: boolean;
  timeSpentMs: number | null;
  createdAt: Date;
}

interface RecentActivityProps {
  attempts: ActivityItem[];
}

export function RecentActivity({ attempts }: RecentActivityProps) {
  return (
    <section>
      <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8] mb-4">
        Recent Activity
      </h2>

      {attempts.length === 0 ? (
        <Card className="text-center py-10">
          <p className="font-body text-text-secondary mb-4">
            No activity yet — jump into your first challenge below!
          </p>
          <Link href="/challenges">
            <Button>Browse Challenges</Button>
          </Link>
        </Card>
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle dark:border-[#2A2A2A]">
                  <th className="text-left font-body text-xs font-semibold text-text-muted dark:text-[#8A8580] uppercase tracking-wide px-4 py-3">
                    Challenge
                  </th>
                  <th className="text-left font-body text-xs font-semibold text-text-muted dark:text-[#8A8580] uppercase tracking-wide px-4 py-3">
                    Category
                  </th>
                  <th className="text-left font-body text-xs font-semibold text-text-muted dark:text-[#8A8580] uppercase tracking-wide px-4 py-3">
                    Result
                  </th>
                  <th className="text-left font-body text-xs font-semibold text-text-muted dark:text-[#8A8580] uppercase tracking-wide px-4 py-3">
                    Time
                  </th>
                  <th className="text-left font-body text-xs font-semibold text-text-muted dark:text-[#8A8580] uppercase tracking-wide px-4 py-3">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const challenge = getChallengeById(attempt.challengeId);
                  const category = challenge?.category ?? 'be';

                  return (
                    <tr
                      key={attempt.id}
                      className="border-b border-border-subtle dark:border-[#2A2A2A] last:border-0 hover:bg-bg-subtle/50 dark:hover:bg-[#252525]/50"
                    >
                      <td className="px-4 py-3 font-body text-sm text-text-primary dark:text-[#F0EDE8]">
                        {challenge?.title ?? attempt.challengeId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge type="category" value={category} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            attempt.passed ? 'text-success' : 'text-error'
                          }
                        >
                          {attempt.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-text-secondary dark:text-[#AAA5A0]">
                        {formatDuration(attempt.timeSpentMs)}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-text-muted dark:text-[#8A8580]">
                        {formatRelativeTime(attempt.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}
