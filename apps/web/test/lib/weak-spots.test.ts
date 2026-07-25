import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    weakSpot: {
      upsert: vi.fn(),
      updateMany: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import {
  updateWeakSpot,
  getWeakSpotForChallenge,
  getWeakSpotsForUser,
  getWeakSpotMap,
  WEAK_SPOT_THRESHOLD,
} from '@/lib/weak-spots';

describe('Weak Spot Flagging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports threshold of 5', () => {
    expect(WEAK_SPOT_THRESHOLD).toBe(5);
  });

  it('does not flag before 5 failures', async () => {
    mockPrisma.weakSpot.upsert.mockResolvedValue({
      failedAttempts: 4,
      resolved: false,
    });

    await updateWeakSpot('user-1', 'be-01', false);
    expect(mockPrisma.weakSpot.upsert).toHaveBeenCalled();

    mockPrisma.weakSpot.findUnique.mockResolvedValue({
      failedAttempts: 4,
      resolved: false,
    });
    const spot = await getWeakSpotForChallenge('user-1', 'be-01');
    expect(spot).toBeNull();
  });

  it('flags at exactly 5 failures', async () => {
    mockPrisma.weakSpot.findUnique.mockResolvedValue({
      failedAttempts: 5,
      resolved: false,
    });

    const spot = await getWeakSpotForChallenge('user-1', 'be-01');
    expect(spot).toEqual({ failedAttempts: 5 });
  });

  it('resolves weak spot when challenge is passed', async () => {
    mockPrisma.weakSpot.updateMany.mockResolvedValue({ count: 1 });

    await updateWeakSpot('user-1', 'be-01', true);

    expect(mockPrisma.weakSpot.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', challengeId: 'be-01', resolved: false },
      data: expect.objectContaining({ resolved: true }),
    });
    expect(mockPrisma.weakSpot.upsert).not.toHaveBeenCalled();
  });

  it('does not resolve if passed is false', async () => {
    mockPrisma.weakSpot.upsert.mockResolvedValue({ failedAttempts: 2, resolved: false });

    await updateWeakSpot('user-1', 'be-01', false);

    expect(mockPrisma.weakSpot.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.weakSpot.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ resolved: false, resolvedAt: null }),
      })
    );
  });

  it('getWeakSpotsForUser queries at threshold', async () => {
    mockPrisma.weakSpot.findMany.mockResolvedValue([]);
    await getWeakSpotsForUser('user-1');
    expect(mockPrisma.weakSpot.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        resolved: false,
        failedAttempts: { gte: 5 },
      },
    });
  });

  it('getWeakSpotMap returns challengeId -> failedAttempts', async () => {
    mockPrisma.weakSpot.findMany.mockResolvedValue([
      { challengeId: 'be-01', failedAttempts: 6 },
      { challengeId: 'fe-01', failedAttempts: 5 },
    ]);
    const map = await getWeakSpotMap('user-1');
    expect(map).toEqual({ 'be-01': 6, 'fe-01': 5 });
  });
});
