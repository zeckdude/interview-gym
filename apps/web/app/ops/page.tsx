import Link from 'next/link';

export default function OpsHubPage() {
  const links = [
    {
      href: '/ops/ui',
      title: 'UI showcase',
      description:
        'Every button, badge, callout, modal, and theme token — interactive, side by side, in light and dark mode.',
    },
    {
      href: '/ops/learn-problems',
      title: 'Learn problem types',
      description:
        'Fully interactive demos for each learn-path problem format — shipped step types and new prototypes.',
    },
    {
      href: '/admin/paused-features',
      title: 'Paused features',
      description:
        'Hidden routes and features paused while the learn path is the main focus.',
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="font-display font-bold text-3xl text-text-primary">Ops hub</h1>
        <p className="font-body text-base text-text-primary">
          Internal tooling for styling review, feature inventory, and other maintenance tasks.
        </p>
      </div>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl border border-border-subtle bg-bg-surface p-6 hover:border-brand/40 hover:shadow-raised transition-all"
            >
              <h2 className="font-display font-bold text-xl text-brand mb-2">{link.title}</h2>
              <p className="font-body text-base text-text-primary">{link.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
