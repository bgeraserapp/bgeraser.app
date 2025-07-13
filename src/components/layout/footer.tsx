import { GitFork, Mail, X } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { env } from '@/env';
import AppConfig from '@/lib/app-config';

const footerLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Documentation', href: env.NEXT_PUBLIC_DOCS_URL },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Refund Policy', href: '/refund-policy' },
];

const socialLinks = [
  {
    name: 'Twitter',
    href: AppConfig.social.twitter,
    icon: X,
  },
  {
    name: 'GitHub',
    href: AppConfig.social.github,
    icon: GitFork,
  },
  {
    name: 'Email',
    href: `mailto:${AppConfig.contact.email}`,
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <Link
                href="/"
                className="flex items-center space-x-2 mb-4 justify-center md:justify-start"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">AI</span>
                </div>
                <span className="text-xl font-bold">{AppConfig.name}</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">{AppConfig.descriptions}</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Section */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {AppConfig.company.name}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
