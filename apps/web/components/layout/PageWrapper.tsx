import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
}

export function PageWrapper({ children, title, fullWidth = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      <Header title={title} />
      <main className="app-main">
        <div className={fullWidth ? 'px-6 py-8' : 'max-w-6xl mx-auto px-6 py-8'}>
          {children}
        </div>
      </main>
      <RightPanel />
    </div>
  );
}
