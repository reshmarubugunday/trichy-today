import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Trichy Today – Local News, Classifieds & Ads',
    template: '%s | Trichy Today',
  },
  description:
    "Trichy Today is Tiruchirappalli's trusted source for local news, classifieds, jobs, real estate, and business listings.",
  keywords: ['trichy', 'tiruchirappalli', 'news', 'classifieds', 'jobs', 'tamil nadu'],
  openGraph: {
    title: 'Trichy Today',
    description: 'Local news, classifieds, and ads for Tiruchirappalli, Tamil Nadu.',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased bg-background">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
