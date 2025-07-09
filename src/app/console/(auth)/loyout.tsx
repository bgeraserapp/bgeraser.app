import { redirectIfAuthenticated } from '@/lib/auth-server';

export async function AuthLayout({ children }: { children: React.ReactNode }) {
  await redirectIfAuthenticated('/');
  return <>{children}</>;
}
