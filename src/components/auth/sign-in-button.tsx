'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from '@/lib/auth-client';

export function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {session.user.name || session.user.email}</span>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => signIn.social({ provider: 'google' })}>Sign in with Google</Button>
      <Button
        variant="outline"
        onClick={() => signIn.email({ email: 'test@example.com', password: 'password' })}
      >
        Sign in with Email
      </Button>
    </div>
  );
}
