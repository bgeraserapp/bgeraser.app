'use client';

import { AlertTriangle, CreditCard, Plus, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LowCreditWarningProps {
  credits: number;
  threshold?: number;
  className?: string;
  showBuyButton?: boolean;
}

export function LowCreditWarning({
  credits,
  threshold = 5,
  className = '',
  showBuyButton = true,
}: LowCreditWarningProps) {
  const router = useRouter();

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
      <CardContent className="p-4">
        <Alert className="border-none bg-transparent p-0">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200 mb-2">
            Low Credit Balance
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 space-y-3">
            <div>
              <p className="font-medium">
                You have {credits} credit{credits !== 1 ? 's' : ''} remaining.
              </p>
              <p className="text-sm mt-1">
                Consider purchasing more credits to avoid interruption to your workflow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4" />
                <span>1 Credit = 1 Background Removal</span>
              </div>

              <div className="flex items-center gap-2 text-sm bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                <CreditCard className="w-4 h-4" />
                <span>Credits never expire</span>
              </div>
            </div>

            {showBuyButton && (
              <div className="pt-2">
                <Button
                  onClick={handleBuyCredits}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Buy More Credits
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
