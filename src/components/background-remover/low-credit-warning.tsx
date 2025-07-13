'use client';

import { AlertTriangle, CreditCard, Plus, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth-queries';

interface LowCreditWarningProps {
  threshold?: number;
  className?: string;
  showBuyButton?: boolean;
}

export function LowCreditWarning({
  threshold = 5,
  className = '',
  showBuyButton = true,
}: LowCreditWarningProps) {
  const router = useRouter();

  const { credits } = useAuth();

  // Don't show if credits are above threshold
  if (credits >= threshold) {
    return null;
  }

  const handleBuyCredits = () => {
    router.push('/billing');
  };

  return (
    <Card
      className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 ${className}`}
    >
      <CardContent className="p-2">
        <Alert className="border-none bg-transparent p-0">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200 mb-1 text-sm">
            Low Credit Balance
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 space-y-2">
            <div className="flex">
              <div>
                <p className="font-medium text-sm">
                  You have {credits} credit{credits !== 1 ? 's' : ''} remaining.
                </p>
                <div className="flex items-center gap-1.5 text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                  <Zap className="w-3 h-3" />
                  <span>1 Credit = 1 Removal</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                  <CreditCard className="w-3 h-3" />
                  <span>Never expire</span>
                </div>
              </div>
              <p className="text-xs mt-0.5">
                Consider purchasing more credits to avoid interruption.
              </p>
            </div>

            {showBuyButton && (
              <div className="pt-1">
                <Button
                  onClick={handleBuyCredits}
                  className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-amber-600 h-7 px-3 text-xs"
                  size="sm"
                >
                  <Plus className="w-3 h-3" />
                  Buy Credits
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
