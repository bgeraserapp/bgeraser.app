'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { env } from '@/env';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BG</span>
              </div>
              <span className="text-xl font-bold">BG Eraser</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href={env.NEXT_PUBLIC_DOCS_URL}
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Docs
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="#features"
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href={env.NEXT_PUBLIC_DOCS_URL}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="pt-4 pb-3 border-t">
                <div className="flex flex-col space-y-2">
                  <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
                    <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
