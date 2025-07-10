import { HistoryIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HistoryIcon className="mr-2 h-5 w-5" />
              History
            </CardTitle>
            <CardDescription>
              View your past activity, including billing history and usage reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section is under construction. Please check back later for updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
