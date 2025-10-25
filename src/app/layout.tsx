import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from './registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Silver SQL Console',
  description: 'SQL query execution console for Silver SQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}

