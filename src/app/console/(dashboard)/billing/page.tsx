import { CreditCardIcon } from 'lucide-react';

import { AddCreditComponent } from '@/components/billings/add-credit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCardIcon className="mr-2 h-5 w-5" />
              Billing Information
            </CardTitle>
            <CardDescription>
              Manage your billing details, payment methods, and subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddCreditComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
