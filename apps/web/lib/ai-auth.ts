import { auth, currentUser } from '@clerk/nextjs/server';
import { getClerkUserEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function requireAuthUser() {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' as const, status: 401 as const };
  }

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) {
    return { error: 'User email not found' as const, status: 400 as const };
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  return { user };
}
