'use client';

import { Check, CreditCard, Star, Zap } from 'lucide-react';

import creditPricingData, { Pricing } from '@/lib/pricing';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface CreditPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditPacks?: Pricing[];
  onPurchase: (packId: string) => Promise<void>;
  isLoading?: boolean;
  selectedPack?: string | null;
}

export function CreditPlansDialog({
  open,
  onOpenChange,
  creditPacks = creditPricingData,
  onPurchase,
  isLoading = false,
  selectedPack = null,
}: CreditPlansDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-2 pb-4">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <CreditCard className="w-5 h-5 text-primary" />
            Purchase Credits
          </DialogTitle>
          <DialogDescription className="text-sm">
            No subscriptions, no hidden fees. Pay only for what you use.
          </DialogDescription>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
            <CreditCard className="w-3 h-3" />1 Credit = 1 Background Removal • $0.08-$0.10 per
            credit
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                pack.popular
                  ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        pack.popular
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{pack.name}</h3>
                      <p className="text-xs text-muted-foreground">{pack.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">${pack.price}</div>
                    <div className="text-xs text-muted-foreground">
                      ${(pack.price / pack.credits).toFixed(2)} per credit
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 mb-4">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{pack.credits} removals</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">High-quality AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">All formats</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">Never expire</span>
                  </div>
                </div>

                <Button
                  onClick={() => onPurchase(pack.id)}
                  disabled={isLoading}
                  size="sm"
                  variant={pack.popular ? 'default' : 'outline'}
                  className={`w-full h-10 font-medium ${pack.popular ? 'shadow-lg' : ''}`}
                >
                  {isLoading && selectedPack === pack.id ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Purchase ${pack.credits} Credits - $${pack.price}`
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Buy credits → Process images • 1 credit per removal • No subscription required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
