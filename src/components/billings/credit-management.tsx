'use client';

import { Plus, Wallet, Zap } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface CreditManagementProps {
  onBuyCreditClick?: () => void;
}

export function CreditManagement({ onBuyCreditClick }: CreditManagementProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Credits & Billing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Credits Display */}
        <Card className="border border-border hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-foreground">{user?.credits || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Ready to use for background removal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Credits Action */}
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between h-full">
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">Need More Credits?</p>
                <p className="text-sm text-muted-foreground">
                  Purchase additional credits instantly
                </p>
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>No subscription required</span>
                </div>
              </div>
              <Button onClick={onBuyCreditClick} size="lg" className="gap-2 ml-4 shadow-md">
                <Plus className="w-5 h-5" />
                Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
