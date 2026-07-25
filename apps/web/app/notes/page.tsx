import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { getAllNotesForUser } from '@/lib/notes';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export default async function NotesPage() {
  const { userId } = await auth();

  let notes: Awaited<ReturnType<typeof getAllNotesForUser>> = [];

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (user) {
      notes = await getAllNotesForUser(user.id);
    }
  }

  return (
    <PageWrapper title="My Notes">
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
            My Notes 📝
          </h1>
          <p className="font-body text-base text-text-primary">
            Your accumulated wisdom — review before an interview.
          </p>
        </div>

        {notes.length === 0 ? (
          <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-10 text-center space-y-4">
            <p className="text-4xl">📝</p>
            <p className="font-body text-base text-text-primary max-w-md mx-auto">
              No notes yet. After attempting a challenge, leave yourself a breadcrumb to
              remember key insights.
            </p>
            <Link href="/challenges">
              <Button variant="primary">Browse Challenges</Button>
            </Link>
          </div>
        ) : (
          <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted">
                  <th className="pb-3 pr-4 font-semibold">Challenge</th>
                  <th className="pb-3 pr-4 font-semibold">Category</th>
                  <th className="pb-3 pr-4 font-semibold">Note Preview</th>
                  <th className="pb-3 pr-4 font-semibold">Last Updated</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                {notes.map((note) => (
                  <tr
                    key={note.challengeId}
                    className="border-b border-border-subtle last:border-0"
                  >
                    <td className="py-4 pr-4 font-semibold">{note.challengeTitle}</td>
                    <td className="py-4 pr-4">
                      <span className="font-body text-xs font-semibold px-2 py-0.5 rounded bg-bg-subtle text-text-primary">
                        {note.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-text-secondary max-w-xs">
                      {note.preview}
                    </td>
                    <td className="py-4 pr-4 text-text-secondary">
                      {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4">
                      <Link href={note.href}>
                        <Button variant="secondary" className="px-4 py-2 text-sm">
                          View Challenge
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
