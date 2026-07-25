import { prisma } from '@/lib/prisma';
import { getCategoryLabel, getChallengeHref, getChallengeTitle } from '@/lib/challenge-lookup';

export interface ChallengeNoteData {
  id: string;
  challengeId: string;
  content: string;
  hintUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteListItem {
  challengeId: string;
  challengeTitle: string;
  category: string;
  content: string;
  preview: string;
  updatedAt: string;
  href: string;
}

export async function getNoteForChallenge(
  userId: string,
  challengeId: string
): Promise<ChallengeNoteData | null> {
  const note = await prisma.challengeNote.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  if (!note) return null;

  return {
    id: note.id,
    challengeId: note.challengeId,
    content: note.content,
    hintUsed: note.hintUsed,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export async function getNotesForChallenges(
  userId: string,
  challengeIds: string[]
): Promise<Map<string, ChallengeNoteData>> {
  if (challengeIds.length === 0) return new Map();

  const notes = await prisma.challengeNote.findMany({
    where: {
      userId,
      challengeId: { in: challengeIds },
    },
  });

  return new Map(
    notes.map((note) => [
      note.challengeId,
      {
        id: note.id,
        challengeId: note.challengeId,
        content: note.content,
        hintUsed: note.hintUsed,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      },
    ])
  );
}

export async function upsertChallengeNote(
  userId: string,
  challengeId: string,
  content: string
): Promise<ChallengeNoteData> {
  const note = await prisma.challengeNote.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: { content },
    create: { userId, challengeId, content },
  });

  return {
    id: note.id,
    challengeId: note.challengeId,
    content: note.content,
    hintUsed: note.hintUsed,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export async function markNoteHintUsed(
  userId: string,
  challengeId: string
): Promise<void> {
  await prisma.challengeNote.updateMany({
    where: { userId, challengeId },
    data: { hintUsed: true },
  });
}

export async function getAllNotesForUser(userId: string): Promise<NoteListItem[]> {
  const notes = await prisma.challengeNote.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  const { allChallenges, allQuestions } = await import('@/data');

  const challengeMap = new Map(
    [
      ...allChallenges.filter((c) => !c.comingSoon),
      ...allQuestions,
    ].map((c) => [c.id, c])
  );

  return notes.map((note) => {
    const challenge = challengeMap.get(note.challengeId);
    const category = challenge?.category ?? 'be';
    const title = challenge
      ? 'title' in challenge
        ? challenge.title
        : getChallengeTitle(note.challengeId)
      : getChallengeTitle(note.challengeId);

    return {
      challengeId: note.challengeId,
      challengeTitle: title,
      category: getCategoryLabel(category),
      content: note.content,
      preview: note.content.slice(0, 80) + (note.content.length > 80 ? '…' : ''),
      updatedAt: note.updatedAt.toISOString(),
      href: getChallengeHref(note.challengeId, category),
    };
  });
}

export function isCleanPass(
  attempts: { challengeId: string; passed: boolean; hintUsed: boolean }[],
  challengeId: string
): boolean {
  return attempts.some((a) => a.challengeId === challengeId && a.passed && !a.hintUsed);
}
