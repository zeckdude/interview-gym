import { describe, expect, it } from 'vitest';
import { getClerkUserEmail } from '@/lib/auth';
import type { User } from '@clerk/nextjs/server';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    primaryEmailAddressId: 'e1',
    emailAddresses: [
      {
        id: 'e1',
        emailAddress: 'primary@example.com',
        verification: { status: 'verified' },
      },
    ],
    ...overrides,
  } as unknown as User;
}

describe('getClerkUserEmail', () => {
  it('returns null for null user', () => {
    expect(getClerkUserEmail(null)).toBeNull();
  });

  it('returns primary email when available', () => {
    expect(getClerkUserEmail(makeUser())).toBe('primary@example.com');
  });

  it('falls back to first verified email', () => {
    const user = makeUser({
      primaryEmailAddressId: 'missing',
      emailAddresses: [
        {
          id: 'e2',
          emailAddress: 'verified@example.com',
          verification: { status: 'verified' },
        },
      ] as never,
    });
    expect(getClerkUserEmail(user)).toBe('verified@example.com');
  });

  it('falls back to first email address', () => {
    const user = makeUser({
      primaryEmailAddressId: null,
      emailAddresses: [
        {
          id: 'e3',
          emailAddress: 'only@example.com',
          verification: { status: 'unverified' },
        },
      ] as never,
    });
    expect(getClerkUserEmail(user)).toBe('only@example.com');
  });
});
