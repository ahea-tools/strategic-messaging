import './globals.css';
import type { Metadata } from 'next';
import { Marcellus, PT_Serif } from 'next/font/google';

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
});

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-serif',
});

export const metadata: Metadata = {
  title: 'Strategic Messaging Tool',
  description: 'Audience-ready strategic rewrite support for complex health messaging.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${marcellus.variable} ${ptSerif.variable}`}>{children}</body>
    </html>
  );
}
