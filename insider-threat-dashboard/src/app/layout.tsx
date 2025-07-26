import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Insider Threat Monitoring Dashboard',
  description: 'Your monitoring Tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ 
        background: '#0f2027',
        backgroundSize: '400% 400%',
        animation: 'sparkle 10s ease infinite',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}>
        {children}
      </body>
    </html>
  );
}