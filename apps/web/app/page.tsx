import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ReviewToday } from '@/components/dashboard/ReviewToday';
import { BadgesPreview } from '@/components/dashboard/BadgesPreview';
import { StreakFreezePrompt } from '@/components/dashboard/StreakFreezePrompt';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CATEGORY_TOTALS } from '@/data';
import { getDashboardData } from '@/lib/dashboard';

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = data ?? {
    totalAttempts: 0,
    challengesPassed: 0,
    passRate: 0,
    cleanPasses: 0,
    currentStreak: 0,
    thisWeekAttempts: 0,
    categoryStats: {
      be: { completed: 0, passRate: 0 },
      fe: { completed: 0, passRate: 0 },
      'fe-advanced': { completed: 0, passRate: 0 },
      nextjs: { completed: 0, passRate: 0 },
      'be-question': { completed: 0, passRate: 0 },
      'fe-question': { completed: 0, passRate: 0 },
      'nextjs-question': { completed: 0, passRate: 0 },
    },
    recentAttempts: [],
    recentBadges: [],
    reviewItems: [],
    needsFreezeDecision: false,
    freezesAvailable: 1,
  };

  return (
    <PageWrapper title="Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary dark:text-[#F0EDE8] mb-2">
            Welcome back! 👋
          </h1>
          <p className="font-body text-text-secondary dark:text-[#AAA5A0]">
            Every rep counts. Let&apos;s get sharper today.
          </p>
        </div>

        {stats.needsFreezeDecision && (
          <StreakFreezePrompt freezesAvailable={stats.freezesAvailable ?? 1} />
        )}

        <StatsBar
          totalAttempts={stats.totalAttempts}
          challengesPassed={stats.challengesPassed}
          passRate={stats.passRate}
          currentStreak={stats.currentStreak}
          thisWeekAttempts={stats.thisWeekAttempts}
          cleanPasses={stats.cleanPasses}
        />

        <section>
          <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8] mb-4">
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard
              name="Backend Coding"
              category="be"
              completed={stats.categoryStats.be.completed}
              total={CATEGORY_TOTALS.be}
              passRate={stats.categoryStats.be.passRate}
              href="/challenges?category=be"
            />
            <CategoryCard
              name="React"
              category="fe"
              completed={stats.categoryStats.fe.completed + stats.categoryStats['fe-advanced'].completed}
              total={CATEGORY_TOTALS.fe + CATEGORY_TOTALS['fe-advanced']}
              passRate={Math.round(
                (stats.categoryStats.fe.passRate + stats.categoryStats['fe-advanced'].passRate) / 2
              )}
              href="/challenges?category=react"
            />
            <CategoryCard
              name="Next.js"
              category="nextjs"
              completed={stats.categoryStats.nextjs?.completed ?? 0}
              total={CATEGORY_TOTALS.nextjs}
              passRate={stats.categoryStats.nextjs?.passRate ?? 0}
              href="/challenges?category=nextjs"
            />
            <CategoryCard
              name="Backend Questions"
              category="be-question"
              completed={stats.categoryStats['be-question'].completed}
              total={CATEGORY_TOTALS['be-question']}
              passRate={stats.categoryStats['be-question'].passRate}
              href="/questions?category=be"
            />
            <CategoryCard
              name="React Questions"
              category="fe-question"
              completed={stats.categoryStats['fe-question'].completed}
              total={CATEGORY_TOTALS['fe-question']}
              passRate={stats.categoryStats['fe-question'].passRate}
              href="/questions?category=react"
            />
            <CategoryCard
              name="Next.js Questions"
              category="nextjs-question"
              completed={stats.categoryStats['nextjs-question']?.completed ?? 0}
              total={CATEGORY_TOTALS['nextjs-question']}
              passRate={stats.categoryStats['nextjs-question']?.passRate ?? 0}
              href="/questions?category=nextjs"
            />
          </div>
        </section>

        <ReviewToday items={stats.reviewItems ?? []} />

        <BadgesPreview badges={stats.recentBadges ?? []} />

        <RecentActivity attempts={stats.recentAttempts} />
      </div>
    </PageWrapper>
  );
}
