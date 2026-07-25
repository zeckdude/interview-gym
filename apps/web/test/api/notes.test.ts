import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();
const currentUserMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
  currentUser: () => currentUserMock(),
}));

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/auth', () => ({
  getClerkUserEmail: vi.fn(() => 'test@example.com'),
}));

vi.mock('@/lib/notes', () => ({
  getAllNotesForUser: vi.fn().mockResolvedValue([]),
  upsertChallengeNote: vi.fn().mockResolvedValue({
    id: 'note-1',
    challengeId: 'be-01',
    content: 'hello',
    hintUsed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  getNoteForChallenge: vi.fn().mockResolvedValue(null),
  markNoteHintUsed: vi.fn().mockResolvedValue(undefined),
}));

describe('POST /api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
    currentUserMock.mockResolvedValue({ id: 'clerk-1' });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1' });
  });

  it('returns 401 if not authenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { POST } = await import('@/app/api/notes/route');
    const req = new Request('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ challengeId: 'be-01', content: 'hi' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 if content exceeds 500 characters', async () => {
    const { POST } = await import('@/app/api/notes/route');
    const req = new Request('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'be-01',
        content: 'x'.repeat(501),
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('upserts note correctly', async () => {
    const { POST } = await import('@/app/api/notes/route');
    const { upsertChallengeNote } = await import('@/lib/notes');
    const req = new Request('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ challengeId: 'be-01', content: 'remember this' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(upsertChallengeNote).toHaveBeenCalledWith('user-1', 'be-01', 'remember this');
  });
});

describe('GET /api/notes/[challengeId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
  });

  it('returns 401 if not authenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { GET } = await import('@/app/api/notes/[challengeId]/route');
    const res = await GET(new Request('http://localhost/api/notes/be-01'), {
      params: { challengeId: 'be-01' },
    });
    expect(res.status).toBe(401);
  });

  it('returns null when no note exists for challenge', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    const { getNoteForChallenge } = await import('@/lib/notes');
    vi.mocked(getNoteForChallenge).mockResolvedValueOnce(null);

    const { GET } = await import('@/app/api/notes/[challengeId]/route');
    const res = await GET(new Request('http://localhost/api/notes/be-01'), {
      params: { challengeId: 'be-01' },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.note).toBeNull();
  });

  it('returns note content when note exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    const { getNoteForChallenge } = await import('@/lib/notes');
    vi.mocked(getNoteForChallenge).mockResolvedValueOnce({
      id: 'n1',
      challengeId: 'be-01',
      content: 'my note',
      hintUsed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

    const { GET } = await import('@/app/api/notes/[challengeId]/route');
    const res = await GET(new Request('http://localhost/api/notes/be-01'), {
      params: { challengeId: 'be-01' },
    });
    const data = await res.json();
    expect(data.note.content).toBe('my note');
  });
});
