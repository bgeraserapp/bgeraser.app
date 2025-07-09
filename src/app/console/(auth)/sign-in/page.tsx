'use client';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Console Page</h1>
      <p className="text-lg">This is the console page.</p>
      <Button onClick={() => signIn.social({ provider: 'google' })}>Sign in with Google</Button>
    </div>
  );
}
