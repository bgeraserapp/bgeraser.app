import LoadingWrapper from '@/components/layout/loading';
import { requireAuth } from '@/lib/auth-server';

export const metadata = {
  title: 'Console Page',
  description: 'This is the console page for the application.',
};

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  await requireAuth('/sign-in');
  return <LoadingWrapper>{children}</LoadingWrapper>;
}
