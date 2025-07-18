import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { getLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/sonner';
import AppConfig from '@/lib/app-config';
import RootProvider from '@/providers/root-provider';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: AppConfig.name,
  description: AppConfig.descriptions,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProvider>
          {process.env.NODE_ENV === 'development' && (
            <Script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
          )}
          <NextTopLoader color="hsl(var(--primary))" />
          {children}
          <Toaster richColors />
        </RootProvider>
      </body>
    </html>
  );
}
