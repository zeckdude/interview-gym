import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkUserEmail } from '@/lib/auth';
import { getCategoryById, isPlaybookCategoryId } from '@/lib/playbook/categories';
import { prisma } from '@/lib/prisma';
import './print.css';

export default async function PlaybookPrintPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isPlaybookCategoryId(category)) {
    redirect('/playbook');
  }

  const categoryDef = getCategoryById(category)!;

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) redirect('/sign-in');

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect('/sign-in');

  const entries = await prisma.playbookEntry.findMany({
    where: { userId: user.id, category },
    include: { subsections: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });

  const userName = clerkUser?.fullName ?? clerkUser?.firstName ?? 'My Playbook';

  return (
    <div className="print-body">
      <header className="print-header">
        <h1>My Playbook — {categoryDef.label}</h1>
        <p>{userName}</p>
      </header>

      {entries.map((entry) => (
        <article key={entry.id} className="entry">
          <h2>{entry.title}</h2>
          {entry.questionPrompt && (
            <p className="question-prompt">Q: {entry.questionPrompt}</p>
          )}
          {entry.subsections.map((sub) => (
            <div key={sub.id}>
              <h3 className="subsection-label">{sub.label}</h3>
              <div className="subsection-content">
                {sub.textContent ?? sub.transcript ?? '(empty)'}
              </div>
            </div>
          ))}
        </article>
      ))}

      <footer className="print-footer">
        My Playbook — {categoryDef.label} — {userName}
      </footer>
    </div>
  );
}
