import { redirect, RedirectType } from 'next/navigation';

import { authSession } from '@/actions/session';

export async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await authSession();
  if (session) {
    return redirect('/', RedirectType.replace);
  }
  return <>{children}</>;
}
