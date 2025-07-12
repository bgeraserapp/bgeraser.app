'use client';

import { CreditCard, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface CreditDisplayProps {
  credits: number;
  isLoading?: boolean;
  className?: string;
}

export function CreditDisplay({ credits, isLoading = false, className = '' }: CreditDisplayProps) {
  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge
        variant={credits > 0 ? 'default' : 'destructive'}
        className="gap-1.5 px-3 py-1.5 text-sm font-medium"
      >
        <Zap className="w-4 h-4" />
        {credits} Credit{credits !== 1 ? 's' : ''}
      </Badge>
      {credits === 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CreditCard className="w-3 h-3" />
          <span>Purchase credits to continue</span>
        </div>
      )}
    </div>
  );
}
