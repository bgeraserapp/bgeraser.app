'use client';

import { AlertCircle, CreditCard, Plus } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
      <CardContent className="p-6">
        <Alert className="border-none bg-transparent p-0">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-200 mb-2">
            Insufficient Credits
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300 space-y-3">
            <div>
              <p className="font-medium">
                You need {creditsNeeded} credit{creditsNeeded > 1 ? 's' : ''} but only have{' '}
                {creditsAvailable} available.
              </p>
              <p className="text-sm mt-1">
                You&apos;re {creditsShort} credit{creditsShort > 1 ? 's' : ''} short for this
                operation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                <CreditCard className="w-4 h-4" />
                <span>1 Credit = 1 Background Removal</span>
              </div>
            </div>

            {onBuyCredits && (
              <div className="pt-2">
                <Button
                  onClick={onBuyCredits}
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600"
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
