import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    streak: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import {
  getOrCreateStreak,
  checkAndBreakStreak,
  updateStreak,
  useStreakFreeze,
} from '@/lib/streak';

const TZ = 'UTC';

function streakRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'streak-1',
    userId: 'user-1',
    currentStreak: 3,
    longestStreak: 5,
    lastActivityAt: new Date('2024-06-09T12:00:00Z'),
    freezesAvailable: 1,
    freezesUsed: 0,
    freezeAppliedFor: null,
    // Same week as frozen "today" (Mon 2024-06-10) so weekly reset is a no-op
    lastFreezeResetAt: new Date('2024-06-10T00:00:00Z'),
    ...overrides,
  };
}

describe('Streak async flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z')); // Monday
    mockPrisma.streak.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
      streakRow(data)
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getOrCreateStreak creates when missing', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(null);
    mockPrisma.streak.create.mockResolvedValue(
      streakRow({ currentStreak: 0, lastActivityAt: null })
    );

    const streak = await getOrCreateStreak('user-1');
    expect(mockPrisma.streak.create).toHaveBeenCalled();
    expect(streak).toBeTruthy();
  });

  it('checkAndBreakStreak does nothing when last activity is yesterday', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({ lastActivityAt: new Date('2024-06-09T12:00:00Z') })
    );

    const result = await checkAndBreakStreak('user-1', TZ);
    expect(result.currentStreak).toBe(3);
    expect(result.needsFreezeDecision).toBe(false);
  });

  it('checkAndBreakStreak offers freeze when gap is exactly 2 days', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-08T12:00:00Z'),
        freezesAvailable: 1,
      })
    );

    const result = await checkAndBreakStreak('user-1', TZ);
    expect(result.needsFreezeDecision).toBe(true);
    expect(result.missedDate).toBe('2024-06-09');
  });

  it('checkAndBreakStreak resets streak when gap is too large', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-05T12:00:00Z'),
        currentStreak: 5,
      })
    );

    const result = await checkAndBreakStreak('user-1', TZ);
    expect(result.currentStreak).toBe(0);
    expect(mockPrisma.streak.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ currentStreak: 0 }),
      })
    );
  });

  it('updateStreak increments when last activity was yesterday', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-09T12:00:00Z'),
        currentStreak: 3,
        longestStreak: 3,
      })
    );

    const result = await updateStreak('user-1', TZ);
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it('updateStreak does not double-increment on same day', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-10T08:00:00Z'),
        currentStreak: 3,
      })
    );

    const result = await updateStreak('user-1', TZ);
    expect(result.currentStreak).toBe(3);
  });

  it('updateStreak starts at 1 when no prior activity', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({ lastActivityAt: null, currentStreak: 0, longestStreak: 0 })
    );

    const result = await updateStreak('user-1', TZ);
    expect(result.currentStreak).toBe(1);
  });

  it('useStreakFreeze consumes a freeze for a 2-day gap', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-08T12:00:00Z'),
        freezesAvailable: 1,
      })
    );

    const result = await useStreakFreeze('user-1', TZ);
    expect(result).not.toBeNull();
    expect(mockPrisma.streak.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          freezesAvailable: 0,
          freezeAppliedFor: '2024-06-09',
        }),
      })
    );
  });

  it('useStreakFreeze returns null when no freezes left', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(
      streakRow({
        lastActivityAt: new Date('2024-06-08T12:00:00Z'),
        freezesAvailable: 0,
      })
    );

    expect(await useStreakFreeze('user-1', TZ)).toBeNull();
  });
});
