import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
}));

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
  learnStepState: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('/api/learn/step-state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ userId: 'clerk-1' });
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
  });

  it('GET returns 401 when unauthenticated', async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    const { GET } = await import('@/app/api/learn/step-state/route');
    const res = await GET(new Request('http://localhost/api/learn/step-state?moduleId=js-01-introduction'));
    expect(res.status).toBe(401);
  });

  it('GET returns step states for a module', async () => {
    mockPrisma.learnStepState.findMany.mockResolvedValue([
      { stepId: 'intro-1', state: { predictPassed: true } },
    ]);

    const { GET } = await import('@/app/api/learn/step-state/route');
    const res = await GET(new Request('http://localhost/api/learn/step-state?moduleId=js-01-introduction'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.states).toEqual({ 'intro-1': { predictPassed: true } });
  });

  it('PUT upserts merged step state', async () => {
    mockPrisma.learnStepState.findUnique.mockResolvedValue({
      state: { predictAnswer: 'hello' },
    });
    mockPrisma.learnStepState.upsert.mockResolvedValue({
      state: { predictAnswer: 'hello', predictPassed: true },
    });

    const { PUT } = await import('@/app/api/learn/step-state/route');
    const res = await PUT(
      new Request('http://localhost/api/learn/step-state', {
        method: 'PUT',
        body: JSON.stringify({
          moduleId: 'js-01-introduction',
          stepId: 'intro-1',
          state: { predictPassed: true },
        }),
      })
    );

    expect(res.status).toBe(200);
    expect(mockPrisma.learnStepState.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          state: { predictAnswer: 'hello', predictPassed: true },
        }),
        update: { state: { predictAnswer: 'hello', predictPassed: true } },
      })
    );
  });

  it('DELETE removes one step when stepId provided', async () => {
    const { DELETE } = await import('@/app/api/learn/step-state/route');
    const res = await DELETE(
      new Request(
        'http://localhost/api/learn/step-state?moduleId=js-01-introduction&stepId=intro-1'
      )
    );

    expect(res.status).toBe(200);
    expect(mockPrisma.learnStepState.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', moduleId: 'js-01-introduction', stepId: 'intro-1' },
    });
  });
});
