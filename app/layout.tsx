import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strategic Messaging Tool',
  description: 'Audience-ready strategic rewrite support for complex health messaging.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
