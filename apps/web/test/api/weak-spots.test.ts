import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/ai-auth', () => ({
  requireAuthUser: vi.fn(),
}));

vi.mock('@/lib/weak-spots', () => ({
  getWeakSpotMap: vi.fn().mockResolvedValue({ 'be-01': 5 }),
}));

import { requireAuthUser } from '@/lib/ai-auth';

describe('GET /api/weak-spots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuthUser).mockResolvedValue({
      user: { id: 'user-1' } as never,
    });
  });

  it('returns 401 if not authenticated', async () => {
    vi.mocked(requireAuthUser).mockResolvedValueOnce({
      error: 'Unauthorized',
      status: 401,
    });
    const { GET } = await import('@/app/api/weak-spots/route');
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns weak spots for authenticated user', async () => {
    const { GET } = await import('@/app/api/weak-spots/route');
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.weakSpots).toEqual({ 'be-01': 5 });
  });
});
