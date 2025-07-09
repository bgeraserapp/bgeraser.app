import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return <div className={`h-[calc(100vh-4rem)] ${className}`}>{children}</div>;
}
