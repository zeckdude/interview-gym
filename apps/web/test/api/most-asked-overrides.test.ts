import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();
const currentUserMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
  currentUser: () => currentUserMock(),
}));

const mockPrisma = {
  user: {
    upsert: vi.fn(),
  },
  mostAskedOverride: {
    findMany: vi.fn(),
    upsert: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/auth', () => ({
  getClerkUserEmail: vi.fn(() => 'test@example.com'),
}));

describe('/api/most-asked/overrides', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
    currentUserMock.mockResolvedValue({ id: 'clerk-1' });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1' });
  });

  it('returns 401 when unauthenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { GET } = await import('@/app/api/most-asked/overrides/route');
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns overrides for authenticated user', async () => {
    mockPrisma.mostAskedOverride.findMany.mockResolvedValue([
      { itemType: 'challenge', itemId: 'be-01', mostAsked: true },
    ]);

    const { GET } = await import('@/app/api/most-asked/overrides/route');
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.overrides).toEqual([
      { itemType: 'challenge', itemId: 'be-01', mostAsked: true },
    ]);
  });

  it('upserts an override', async () => {
    mockPrisma.mostAskedOverride.upsert.mockResolvedValue({
      itemType: 'lesson',
      itemId: 'lesson-react-hooks',
      mostAsked: true,
    });

    const { PUT } = await import('@/app/api/most-asked/overrides/route');
    const res = await PUT(
      new Request('http://localhost/api/most-asked/overrides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'lesson',
          itemId: 'lesson-react-hooks',
          mostAsked: true,
        }),
      })
    );

    expect(res.status).toBe(200);
    expect(mockPrisma.mostAskedOverride.upsert).toHaveBeenCalled();
  });
});
