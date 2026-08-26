import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ReviewToday } from '@/components/dashboard/ReviewToday';
import { BadgesPreview } from '@/components/dashboard/BadgesPreview';
import { StreakFreezePrompt } from '@/components/dashboard/StreakFreezePrompt';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { ActivePathBanner } from '@/components/dashboard/ActivePathBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CATEGORY_TOTALS } from '@/data';
import { getDashboardData } from '@/lib/dashboard';
import { getActivePathSummary } from '@/lib/paths/view';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { userId } = await auth();

  let activePath = null;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (user) {
      activePath = await getActivePathSummary(user.id);
    }
  }

  const stats = data ?? {
    totalAttempts: 0,
    challengesPassed: 0,
    passRate: 0,
    cleanPasses: 0,
    currentStreak: 0,
    thisWeekAttempts: 0,
    categoryStats: Object.fromEntries(
      Object.keys(CATEGORY_TOTALS).map((key) => [key, { completed: 0, passRate: 0 }])
    ) as Record<keyof typeof CATEGORY_TOTALS, { completed: number; passRate: number }>,
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

        {activePath && activePath.isActive && (
          <ActivePathBanner
            name={activePath.name}
            type={activePath.type}
            interviewDate={activePath.interviewDate}
            currentStage={activePath.currentStage}
            totalComplete={activePath.totalComplete}
            totalItems={activePath.totalItems}
          />
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
              name="JavaScript"
              category="stack-javascript"
              completed={stats.categoryStats['stack-javascript'].completed}
              total={CATEGORY_TOTALS['stack-javascript']}
              passRate={stats.categoryStats['stack-javascript'].passRate}
              href="/challenges?category=stack&sub=javascript"
            />
            <CategoryCard
              name="Node.js"
              category="be-nodejs"
              completed={stats.categoryStats['be-nodejs'].completed}
              total={CATEGORY_TOTALS['be-nodejs']}
              passRate={stats.categoryStats['be-nodejs'].passRate}
              href="/challenges?category=be"
            />
            <CategoryCard
              name="React"
              category="fe-advanced"
              completed={stats.categoryStats['fe-advanced'].completed}
              total={CATEGORY_TOTALS['fe-advanced']}
              passRate={stats.categoryStats['fe-advanced'].passRate}
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
