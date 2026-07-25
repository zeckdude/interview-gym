import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
}));

const mockPrisma = {
  user: { findUnique: vi.fn() },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/badges', () => ({
  getUserTimezone: vi.fn().mockResolvedValue('America/Los_Angeles'),
}));

vi.mock('@/lib/streak', () => ({
  checkAndBreakStreak: vi.fn().mockResolvedValue({
    currentStreak: 5,
    longestStreak: 10,
    lastActivityAt: new Date('2024-06-10T12:00:00Z'),
    freezesAvailable: 1,
    needsFreezeDecision: false,
    missedDate: null,
  }),
}));

describe('GET /api/streak', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
  });

  it('returns 401 if not authenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { GET } = await import('@/app/api/streak/route');
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns default streak for unknown user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const { GET } = await import('@/app/api/streak/route');
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.currentStreak).toBe(0);
  });

  it('returns streak data for authenticated user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    const { GET } = await import('@/app/api/streak/route');
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.currentStreak).toBe(5);
    expect(data.longestStreak).toBe(10);
  });
});
