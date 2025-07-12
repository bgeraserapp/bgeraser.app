'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

import { env } from '@/env';
import { useAuth } from '@/hooks/use-auth-queries';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../theme-toggle';
import { UserNav } from '../user-nav';

function DashboardHeader() {
  const { credits, isLoading } = useAuth();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
      )}
    >
      <div className="mx-auto max-w-5xl px-3 py-1.5 flex items-center justify-between">
        <Link href={`${env.NEXT_PUBLIC_PORTAL_URL}`} className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Background Remover</h1>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>
              {isLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                `${credits} Credits`
              )}
            </span>
          </div>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
