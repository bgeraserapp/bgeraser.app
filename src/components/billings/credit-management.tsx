'use client';

import { Plus, Wallet, Zap } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface CreditManagementProps {
  currentCredits?: number;
  onBuyCreditClick?: () => void;
}

export function CreditManagement({ onBuyCreditClick }: CreditManagementProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Credits & Billing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Credits Display */}
        <Card className="border border-border hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{user?.credits}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready to use for background removal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Credits Action */}
        <Card className="border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Need More Credits?</p>
                <p className="text-xs text-muted-foreground">
                  Purchase additional credits instantly
                </p>
              </div>
              <Button onClick={onBuyCreditClick} size="sm" className="gap-2 ml-4">
                <Plus className="w-4 h-4" />
                Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
