import { ClerkProvider } from '@clerk/nextjs';
import { Inter, JetBrains_Mono, Nunito, DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { BadgeCelebrationProvider } from '@/components/providers/BadgeCelebrationProvider';
import { MostAskedProvider } from '@/components/providers/MostAskedProvider';
import { StudyPlanProvider } from '@/components/providers/StudyPlanProvider';
import { NotificationProvider } from '@/components/providers/NotificationProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RightPanelProvider } from '@/components/providers/RightPanelProvider';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Interview Gym',
  description: 'Your personal coding challenge platform for crushing technical interviews.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={`${nunito.variable} ${inter.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
      >
        <body>
          <ThemeProvider>
            <BadgeCelebrationProvider>
              <MostAskedProvider>
                <StudyPlanProvider>
                  <NotificationProvider>
                    <RightPanelProvider>{children}</RightPanelProvider>
                  </NotificationProvider>
                </StudyPlanProvider>
              </MostAskedProvider>
            </BadgeCelebrationProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
