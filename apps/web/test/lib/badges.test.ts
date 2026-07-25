import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    badge: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    attempt: {
      findMany: vi.fn(),
    },
    streak: {
      findUnique: vi.fn(),
    },
    lessonProgress: {
      findMany: vi.fn(),
    },
    spacedRepetitionItem: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    userPreferences: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/challenge-lookup', () => ({
  getChallengeDifficulty: vi.fn(() => 'advanced'),
}));

import { checkAndAwardBadges, updateSpacedRepetition, getUserTimezone } from '@/lib/badges';

describe('Badge Awarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.badge.findMany.mockResolvedValue([]);
    mockPrisma.attempt.findMany.mockResolvedValue([]);
    mockPrisma.streak.findUnique.mockResolvedValue(null);
    mockPrisma.lessonProgress.findMany.mockResolvedValue([]);
    mockPrisma.badge.create.mockImplementation(
      async ({ data }: { data: { slug: string; name: string; emoji: string; description: string } }) => data
    );
  });

  it('awards first-pass badge after first passed attempt', async () => {
    mockPrisma.attempt.findMany.mockResolvedValue([
      { challengeId: 'be-01', challengeType: 'be', passed: true, timeSpentMs: 10000 },
    ]);

    const awarded = await checkAndAwardBadges('user-1');
    expect(awarded.some((b) => b.slug === 'first-pass')).toBe(true);
    expect(mockPrisma.badge.create).toHaveBeenCalled();
  });

  it('does not re-award already earned badge', async () => {
    mockPrisma.badge.findMany.mockResolvedValue([{ slug: 'first-pass' }]);
    mockPrisma.attempt.findMany.mockResolvedValue([
      { challengeId: 'be-01', challengeType: 'be', passed: true, timeSpentMs: 10000 },
    ]);

    const awarded = await checkAndAwardBadges('user-1');
    expect(awarded.some((b) => b.slug === 'first-pass')).toBe(false);
  });

  it('awards streak-5 at exactly 5 day streak', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue({
      currentStreak: 5,
      freezesUsed: 0,
    });

    const awarded = await checkAndAwardBadges('user-1');
    expect(awarded.some((b) => b.slug === 'streak-5')).toBe(true);
  });

  it('awards freeze-used when freezesUsed >= 1', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue({
      currentStreak: 1,
      freezesUsed: 1,
    });

    const awarded = await checkAndAwardBadges('user-1');
    expect(awarded.some((b) => b.slug === 'freeze-used')).toBe(true);
  });

  it('awards speed-demon for hard challenge under 3 minutes', async () => {
    mockPrisma.attempt.findMany.mockResolvedValue([
      {
        challengeId: 'be-09-rate-limiter',
        challengeType: 'be',
        passed: true,
        timeSpentMs: 120000,
      },
    ]);

    const awarded = await checkAndAwardBadges('user-1');
    expect(awarded.some((b) => b.slug === 'speed-demon')).toBe(true);
  });
});

describe('updateSpacedRepetition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.spacedRepetitionItem.findUnique.mockResolvedValue(null);
    mockPrisma.spacedRepetitionItem.upsert.mockResolvedValue({});
  });

  it('upserts a new SR item with capped interval', async () => {
    await updateSpacedRepetition('user-1', 'be-01', 'be', 'advanced', true);
    expect(mockPrisma.spacedRepetitionItem.upsert).toHaveBeenCalled();
    const call = mockPrisma.spacedRepetitionItem.upsert.mock.calls[0][0];
    expect(call.create.intervalDays).toBeLessThanOrEqual(2);
    expect(call.create.repetitions).toBe(1);
  });

  it('resets repetitions on failed attempt', async () => {
    mockPrisma.spacedRepetitionItem.findUnique.mockResolvedValue({
      repetitions: 5,
      intervalDays: 2,
      easeFactor: 2.5,
    });

    await updateSpacedRepetition('user-1', 'be-01', 'be', 'easy', false);
    const call = mockPrisma.spacedRepetitionItem.upsert.mock.calls[0][0];
    expect(call.update.repetitions).toBe(0);
    expect(call.update.intervalDays).toBe(1);
  });
});

describe('getUserTimezone', () => {
  it('returns stored timezone', async () => {
    mockPrisma.userPreferences.findUnique.mockResolvedValue({
      timezone: 'America/New_York',
    });
    expect(await getUserTimezone('user-1')).toBe('America/New_York');
  });

  it('defaults to America/Los_Angeles', async () => {
    mockPrisma.userPreferences.findUnique.mockResolvedValue(null);
    expect(await getUserTimezone('user-1')).toBe('America/Los_Angeles');
  });
});
