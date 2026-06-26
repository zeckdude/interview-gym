import type { User } from '@clerk/nextjs/server';

/**
 * Resolves the best email for a Clerk user across auth methods
 * (email/password, Google OAuth, etc.).
 */
export function getClerkUserEmail(user: User | null): string | null {
  if (!user) return null;

  if (user.primaryEmailAddressId) {
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    );
    if (primary?.emailAddress) return primary.emailAddress;
  }

  const verified = user.emailAddresses.find(
    (e) => e.verification?.status === 'verified'
  );
  if (verified?.emailAddress) return verified.emailAddress;

  return user.emailAddresses[0]?.emailAddress ?? null;
}
