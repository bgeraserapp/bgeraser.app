import { CreditCardIcon, HistoryIcon } from 'lucide-react';
import Link from 'next/link';

import { BillingClient } from '@/components/billings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BillingPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCardIcon />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Billing Information</h1>
              </div>
              <Link href="/billing/history">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4" />
                  View History
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Manage your billing details, payment methods, and subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
