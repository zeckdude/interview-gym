import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();
const currentUserMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
  currentUser: () => currentUserMock(),
}));

const mockPrisma = {
  user: { upsert: vi.fn() },
  attempt: { create: vi.fn() },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/auth', () => ({
  getClerkUserEmail: vi.fn(() => 'test@example.com'),
}));

vi.mock('@/lib/badges', () => ({
  checkAndAwardBadges: vi.fn().mockResolvedValue([]),
  getUserTimezone: vi.fn().mockResolvedValue('America/Los_Angeles'),
  updateSpacedRepetition: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/challenge-lookup', () => ({
  getChallengeDifficulty: vi.fn().mockReturnValue('easy'),
}));

vi.mock('@/lib/personal-bests', () => ({
  updatePersonalBest: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/streak', () => ({
  updateStreak: vi.fn().mockResolvedValue({ currentStreak: 1, longestStreak: 1 }),
}));

vi.mock('@/lib/weak-spots', () => ({
  updateWeakSpot: vi.fn().mockResolvedValue(undefined),
}));

describe('POST /api/attempts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
    currentUserMock.mockResolvedValue({ id: 'clerk-1' });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1' });
    mockPrisma.attempt.create.mockResolvedValue({ id: 'attempt-1' });
  });

  it('returns 401 if not authenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { POST } = await import('@/app/api/attempts/route');
    const req = new Request('http://localhost/api/attempts', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'be-01-list-files',
        challengeType: 'be',
        passed: true,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 on missing required fields', async () => {
    const { POST } = await import('@/app/api/attempts/route');
    const req = new Request('http://localhost/api/attempts', {
      method: 'POST',
      body: JSON.stringify({ challengeId: 'be-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on invalid JSON', async () => {
    const { POST } = await import('@/app/api/attempts/route');
    const req = new Request('http://localhost/api/attempts', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 with valid payload', async () => {
    const { POST } = await import('@/app/api/attempts/route');
    const req = new Request('http://localhost/api/attempts', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'be-01-list-files',
        challengeType: 'be',
        language: 'javascript',
        passed: true,
        code: 'function listFiles() { return []; }',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.attemptId).toBe('attempt-1');
  });
});
