import { prisma } from '@/lib/prisma';

export async function resetLearnModuleProgress(
  userId: string,
  moduleId: string
): Promise<void> {
  await prisma.$transaction([
    prisma.learnModuleProgress.deleteMany({ where: { userId, moduleId } }),
    prisma.learnConceptReview.deleteMany({ where: { userId, moduleId } }),
    prisma.learnHintEvent.deleteMany({ where: { userId, moduleId } }),
  ]);
}

export async function resetAllLearnProgress(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.learnModuleProgress.deleteMany({ where: { userId } }),
    prisma.learnConceptReview.deleteMany({ where: { userId } }),
    prisma.learnHintEvent.deleteMany({ where: { userId } }),
  ]);
}
