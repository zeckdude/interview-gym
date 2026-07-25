import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    challengeNote: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import {
  getNoteForChallenge,
  getNotesForChallenges,
  upsertChallengeNote,
  markNoteHintUsed,
} from '@/lib/notes';

describe('notes DB helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getNoteForChallenge returns null when missing', async () => {
    mockPrisma.challengeNote.findUnique.mockResolvedValue(null);
    expect(await getNoteForChallenge('user-1', 'be-01')).toBeNull();
  });

  it('getNoteForChallenge maps note fields', async () => {
    mockPrisma.challengeNote.findUnique.mockResolvedValue({
      id: 'n1',
      challengeId: 'be-01',
      content: 'hello',
      hintUsed: false,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    });
    const note = await getNoteForChallenge('user-1', 'be-01');
    expect(note).toMatchObject({
      id: 'n1',
      content: 'hello',
      hintUsed: false,
    });
  });

  it('getNotesForChallenges returns empty map for empty ids', async () => {
    const map = await getNotesForChallenges('user-1', []);
    expect(map.size).toBe(0);
    expect(mockPrisma.challengeNote.findMany).not.toHaveBeenCalled();
  });

  it('getNotesForChallenges returns a map', async () => {
    mockPrisma.challengeNote.findMany.mockResolvedValue([
      {
        id: 'n1',
        challengeId: 'be-01',
        content: 'a',
        hintUsed: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      },
    ]);
    const map = await getNotesForChallenges('user-1', ['be-01']);
    expect(map.get('be-01')?.content).toBe('a');
  });

  it('upsertChallengeNote upserts content', async () => {
    mockPrisma.challengeNote.upsert.mockResolvedValue({
      id: 'n1',
      challengeId: 'be-01',
      content: 'note',
      hintUsed: false,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    });
    const note = await upsertChallengeNote('user-1', 'be-01', 'note');
    expect(note.content).toBe('note');
    expect(mockPrisma.challengeNote.upsert).toHaveBeenCalled();
  });

  it('markNoteHintUsed updates hintUsed', async () => {
    mockPrisma.challengeNote.updateMany.mockResolvedValue({ count: 1 });
    await markNoteHintUsed('user-1', 'be-01');
    expect(mockPrisma.challengeNote.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', challengeId: 'be-01' },
      data: { hintUsed: true },
    });
  });
});

