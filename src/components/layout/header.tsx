'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

import { env } from '@/env';
import { useAuth } from '@/hooks/use-auth-queries';
import AppConfig from '@/lib/app-config';
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
            <span className="text-primary-foreground font-bold text-lg">BG</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{AppConfig.name}</h1>
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
