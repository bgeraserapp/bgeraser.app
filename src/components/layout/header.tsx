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
        'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="mx-auto max-w-7xl px-2 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link className="flex items-center space-x-2" href="/">
            <IconScreenshot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">{AppConfig.title}</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
