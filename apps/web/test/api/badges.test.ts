import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
}));

const mockPrisma = {
  user: { findUnique: vi.fn() },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('GET /api/badges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
  });

  it('returns 401 if not authenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { GET } = await import('@/app/api/badges/route');
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns empty earned list for new user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const { GET } = await import('@/app/api/badges/route');
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.earned).toEqual([]);
    expect(data.earnedCount).toBe(0);
    expect(data.total).toBeGreaterThan(0);
  });
});
