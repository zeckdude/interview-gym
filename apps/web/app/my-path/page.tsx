import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { MyPathClient } from '@/components/my-path/MyPathClient';

export default async function MyPathPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return <MyPathClient />;
}
