import { IconScreenshot } from '@tabler/icons-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { SignInForm } from '@/components/auth/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/env';
import AppConfig from '@/lib/app-config';
import { redirectIfAuthenticated } from '@/lib/auth-server';

export default async function SignInPage() {
  // Redirect if already authenticated
  await redirectIfAuthenticated('/');

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back to Home Link */}
        <div className="flex items-center justify-center mb-4">
          <Link
            href={env.NEXT_PUBLIC_HOME_URL}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>

        {/* Main Sign In Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            {/* Logo/Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <IconScreenshot className="h-6 w-6 text-primary" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-foreground">
                Welcome to {AppConfig.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Sign in to remove backgrounds with AI
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <SignInForm />
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="text-center mt-4 text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{' '}
            <Link href="#" className="text-primary hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
