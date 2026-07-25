import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    personalBest: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import {
  updatePersonalBest,
  getPersonalBest,
  getPersonalBestsForChallenges,
} from '@/lib/personal-bests';

describe('Personal Best Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not update personal best on failed attempt', async () => {
    await updatePersonalBest('user-1', 'be-01', 5000, false);
    expect(mockPrisma.personalBest.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.personalBest.create).not.toHaveBeenCalled();
    expect(mockPrisma.personalBest.update).not.toHaveBeenCalled();
  });

  it('creates personal best on first passing attempt', async () => {
    mockPrisma.personalBest.findUnique.mockResolvedValue(null);
    mockPrisma.personalBest.create.mockResolvedValue({});

    await updatePersonalBest('user-1', 'be-01', 5000, true);

    expect(mockPrisma.personalBest.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', challengeId: 'be-01', bestTimeMs: 5000 },
    });
  });

  it('updates personal best when faster', async () => {
    mockPrisma.personalBest.findUnique.mockResolvedValue({ bestTimeMs: 10000 });
    mockPrisma.personalBest.update.mockResolvedValue({});

    await updatePersonalBest('user-1', 'be-01', 5000, true);

    expect(mockPrisma.personalBest.update).toHaveBeenCalled();
  });

  it('does not update when slower than existing best', async () => {
    mockPrisma.personalBest.findUnique.mockResolvedValue({ bestTimeMs: 3000 });

    await updatePersonalBest('user-1', 'be-01', 5000, true);

    expect(mockPrisma.personalBest.update).not.toHaveBeenCalled();
  });

  it('getPersonalBest returns null when missing', async () => {
    mockPrisma.personalBest.findUnique.mockResolvedValue(null);
    expect(await getPersonalBest('user-1', 'be-01')).toBeNull();
  });

  it('getPersonalBest returns bestTimeMs', async () => {
    mockPrisma.personalBest.findUnique.mockResolvedValue({ bestTimeMs: 4200 });
    expect(await getPersonalBest('user-1', 'be-01')).toBe(4200);
  });

  it('getPersonalBestsForChallenges returns a map', async () => {
    mockPrisma.personalBest.findMany.mockResolvedValue([
      { challengeId: 'be-01', bestTimeMs: 1000 },
      { challengeId: 'fe-01', bestTimeMs: 2000 },
    ]);
    const map = await getPersonalBestsForChallenges('user-1', ['be-01', 'fe-01']);
    expect(map).toEqual({ 'be-01': 1000, 'fe-01': 2000 });
  });
});
