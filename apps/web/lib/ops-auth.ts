import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const OPS_COOKIE_NAME = 'ops-auth';

export function getOpsSessionToken(): string | null {
  const password = process.env.OPS_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(`ops:${password}`).digest('hex');
}

export function verifyOpsPassword(password: string): boolean {
  const expected = process.env.OPS_PASSWORD;
  if (!expected || !password) return false;
  if (expected.length !== password.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(password));
  } catch {
    return false;
  }
}

export async function isOpsAuthenticated(): Promise<boolean> {
  const token = getOpsSessionToken();
  if (!token) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(OPS_COOKIE_NAME)?.value;
  if (!session) return false;

  if (session.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(session), Buffer.from(token));
  } catch {
    return false;
  }
}
