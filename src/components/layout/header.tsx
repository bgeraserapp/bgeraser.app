import { IconScreenshot } from '@tabler/icons-react';
import Link from 'next/link';

import AppConfig from '@/lib/app-config';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../theme-toggle';
import { UserNav } from '../user-nav';

function DashboardHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
      )}
    >
      <div className="mx-auto max-w-5xl px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link className="flex items-center space-x-2" href="/">
            <IconScreenshot className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">{AppConfig.title}</span>
          </Link>
        </div>
        <div className="flex items-center space-x-1">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
