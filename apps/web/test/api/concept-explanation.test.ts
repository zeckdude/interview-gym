import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('POST /api/ai/concept-explanation', () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('returns 400 if concept is missing', async () => {
    const { POST } = await import('@/app/api/ai/concept-explanation/route');
    const req = new Request('http://localhost/api/ai/concept-explanation', {
      method: 'POST',
      body: JSON.stringify({ challengeContext: 'List Files' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on invalid JSON', async () => {
    const { POST } = await import('@/app/api/ai/concept-explanation/route');
    const req = new Request('http://localhost/api/ai/concept-explanation', {
      method: 'POST',
      body: 'nope',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns placeholder explanation data when API key is missing', async () => {
    const { POST } = await import('@/app/api/ai/concept-explanation/route');
    const req = new Request('http://localhost/api/ai/concept-explanation', {
      method: 'POST',
      body: JSON.stringify({
        concept: 'readdirSync',
        challengeContext: 'List Files',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.explanation).toContain('readdirSync');
    expect(data._placeholder).toBe(true);
  });
});
