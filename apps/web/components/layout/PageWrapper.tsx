import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
}

export function PageWrapper({ children, title, fullWidth = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-bg-base dark:bg-[#0F0F0F]">
      <Sidebar />
      <Header title={title} />
      <main className="ml-64 pt-16">
        <div
          className={
            fullWidth ? 'px-6 py-8' : 'max-w-6xl mx-auto px-6 py-8'
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
}
