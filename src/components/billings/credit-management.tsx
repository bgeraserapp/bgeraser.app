'use client';

import { ArrowUp, TrendingUp, Zap } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface CreditManagementProps {
  currentCredits?: number;
  usedCredits?: number;
  totalCreditsUsed?: number;
  onUpgradeClick?: () => void;
}

export function CreditManagement({
  currentCredits = 120,
  usedCredits = 80,
  totalCreditsUsed = 280,
  onUpgradeClick,
}: CreditManagementProps) {
  return (
    <div className="mb-4">
      <div className="inline-flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Credit Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Current Credits */}
        <Card className="transition-all duration-200 hover:shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available Credits</p>
                <p className="text-xl font-bold text-primary">{currentCredits}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(10, (currentCredits / (currentCredits + usedCredits)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{usedCredits} used this month</p>
          </CardContent>
        </Card>

        {/* Total Usage */}
        <Card className="transition-all duration-200 hover:shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Images</p>
                <p className="text-xl font-bold text-foreground">{totalCreditsUsed}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All-time processed</p>
          </CardContent>
        </Card>

        {/* Quick Upgrade */}
        <Card className="border-primary/50 transition-all duration-200 hover:shadow-sm hover:border-primary">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                <ArrowUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Need More?</p>
              <p className="text-xs text-muted-foreground mb-2">Get credits instantly</p>
              <Button
                size="sm"
                className="w-full transition-all duration-200 hover:scale-105"
                onClick={onUpgradeClick}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
