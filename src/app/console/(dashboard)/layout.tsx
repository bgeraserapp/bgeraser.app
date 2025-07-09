import { redirect, RedirectType } from 'next/navigation';

import { authSession } from '@/actions/session';
import { AuthProvider } from '@/context/auth-context';

export const metadata = {
  title: 'Console Page',
  description: 'This is the console page for the application.',
};

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await authSession();
  if (!session) {
    redirect('/sign-in', RedirectType.replace);
    return null; // Ensure the function returns null after redirecting
  }
  return <AuthProvider>{children}</AuthProvider>;
}
