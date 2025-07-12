'use client';

import { AlertCircle, CreditCard, Plus } from 'lucide-react';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CreditErrorAlertProps {
  creditsNeeded: number;
  creditsAvailable: number;
  onBuyCredits?: () => void;
  className?: string;
}

export function CreditErrorAlert({
  creditsNeeded,
  creditsAvailable,
  onBuyCredits,
  className = '',
}: CreditErrorAlertProps) {
  const creditsShort = creditsNeeded - creditsAvailable;

  return (
    <Card
      className={`border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 ${className}`}
    >
      <CardContent className="p-2">
        <Alert className="border-none bg-transparent p-0">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <AlertTitle className="text-red-800 dark:text-red-200 text-xs font-medium">
                  Need {creditsNeeded}, have {creditsAvailable} ({creditsShort} short)
                </AlertTitle>

                {onBuyCredits && (
                  <Button
                    onClick={onBuyCredits}
                    className="gap-1 bg-red-600 hover:bg-red-700 text-white border-red-600 h-6 px-2 text-xs"
                    size="sm"
                  >
                    <Plus className="w-2 h-2" />
                    Buy
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-red-700 dark:text-red-300">
                <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">
                  <CreditCard className="w-2 h-2" />
                  <span>1 credit = 1 removal</span>
                </div>
              </div>
            </div>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
