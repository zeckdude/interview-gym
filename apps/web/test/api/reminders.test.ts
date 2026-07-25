import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    userPreferences: { findMany: vi.fn().mockResolvedValue([]) },
    attempt: { count: vi.fn() },
    spacedRepetitionItem: { count: vi.fn() },
  },
}));

vi.mock('@/lib/email', () => ({
  isEmailConfigured: vi.fn(() => true),
  sendReminderEmail: vi.fn(),
}));

vi.mock('@/lib/reminders', () => ({
  shouldSendReminder: vi.fn(() => false),
}));

describe('POST /api/reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('returns 401 without CRON_SECRET', async () => {
    const { POST } = await import('@/app/api/reminders/route');
    const req = new Request('http://localhost/api/reminders', {
      method: 'POST',
      headers: { 'x-cron-secret': 'wrong-secret' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 401 when secret header is missing', async () => {
    const { POST } = await import('@/app/api/reminders/route');
    const req = new Request('http://localhost/api/reminders', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 200 with correct CRON_SECRET', async () => {
    const { POST } = await import('@/app/api/reminders/route');
    const req = new Request('http://localhost/api/reminders', {
      method: 'POST',
      headers: { 'x-cron-secret': 'test-secret' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('returns 503 when email is not configured', async () => {
    const { isEmailConfigured } = await import('@/lib/email');
    vi.mocked(isEmailConfigured).mockReturnValueOnce(false);

    const { POST } = await import('@/app/api/reminders/route');
    const req = new Request('http://localhost/api/reminders', {
      method: 'POST',
      headers: { 'x-cron-secret': 'test-secret' },
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });
});
