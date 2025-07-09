'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '@/hooks/use-auth';

export default function ConsolePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Console Page</h1>
      <p className="text-lg">This is the console page.</p>
      {user && (
        <div className="flex items-center gap-4 flex-col">
          <div>Welcome, {user.name || user.email}</div>
          <Button onClick={() => signOut.mutate()}>Sign Out</Button>
          <ThemeToggle />
          <UserNav />
        </div>
      )}
    </div>
  );
}
