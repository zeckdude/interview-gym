import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/ai-auth', () => ({
  requireAuthUser: vi.fn(),
}));

const mockPrisma = {
  simulatorSession: {
    findMany: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({
      id: 'session-1',
      challenges: [{ challengeId: 'be-01-list-files' }],
    }),
  },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import { requireAuthUser } from '@/lib/ai-auth';

describe('POST /api/simulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuthUser).mockResolvedValue({
      user: { id: 'user-1' } as never,
    });
    mockPrisma.simulatorSession.findMany.mockResolvedValue([]);
    mockPrisma.simulatorSession.create.mockResolvedValue({
      id: 'session-1',
      challenges: [],
    });
  });

  it('returns 401 if not authenticated', async () => {
    vi.mocked(requireAuthUser).mockResolvedValueOnce({
      error: 'Unauthorized',
      status: 401,
    });
    const { POST } = await import('@/app/api/simulator/route');
    const req = new Request('http://localhost/api/simulator', {
      method: 'POST',
      body: JSON.stringify({
        difficulty: 'mixed',
        category: 'mixed',
        durationMinutes: 45,
        challengeCount: 3,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid payload', async () => {
    const { POST } = await import('@/app/api/simulator/route');
    const req = new Request('http://localhost/api/simulator', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 'mixed' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('creates a session with valid payload', async () => {
    const { POST } = await import('@/app/api/simulator/route');
    const req = new Request('http://localhost/api/simulator', {
      method: 'POST',
      body: JSON.stringify({
        difficulty: 'mixed',
        category: 'mixed',
        durationMinutes: 45,
        challengeCount: 3,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockPrisma.simulatorSession.create).toHaveBeenCalled();
  });
});
