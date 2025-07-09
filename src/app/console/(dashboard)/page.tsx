'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function ConsolePage() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Console Page</h1>
      <p className="text-lg">This is the console page.</p>
      {isLoading && <p>Loading...</p>}
      {user && (
        <div className="flex items-center gap-4 flex-col">
          <div>Welcome, {user.name || user.email}</div>
          <Button onClick={() => logout()}>Sign Out</Button>
        </div>
      )}
    </div>
  );
}
