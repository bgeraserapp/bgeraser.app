import { CreditCardIcon } from 'lucide-react';

import { BillingClient } from '@/components/billings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getUserCredits() {
  // In a real app, this would fetch from your database/API
  // For now, returning mock data
  return {
    currentCredits: 120,
    usedCredits: 80,
    totalCreditsUsed: 280,
  };
}

export default async function BillingPage() {
  const creditData = await getUserCredits();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCardIcon />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Billing Information</h1>
              </div>
            </CardTitle>
            <CardDescription>
              Manage your billing details, payment methods, and subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingClient
              currentCredits={creditData.currentCredits}
              usedCredits={creditData.usedCredits}
              totalCreditsUsed={creditData.totalCreditsUsed}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
