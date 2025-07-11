import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import ReactQueryProvider from './_react-query-provider';
import { ThemeProvider } from './_theme-provider';
import { AuthProvider } from './auth-provider';
interface RootProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: RootProviderProps) {
  const messages = await getMessages();
  const headerList = await headers();
  const domain = headerList.get('x-current-domain');
  return (
    <NextIntlClientProvider messages={messages}>
      <ReactQueryProvider>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {!['console', 'docs'].includes(domain || '') ? (
              <>{children}</>
            ) : (
              <AuthProvider>{children}</AuthProvider>
            )}
          </ThemeProvider>
        </NuqsAdapter>
      </ReactQueryProvider>
    </NextIntlClientProvider>
  );
}
