'use client';

import { CreditCard, Star, Zap } from 'lucide-react';

import creditPricingData, { Pricing } from '@/lib/pricing';

import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface CreditPacksProps {
  creditPacks?: Pricing[];
  onPurchase: (packId: string) => Promise<void>;
  isLoading?: boolean;
  selectedPack?: string | null;
}

export function CreditPacks({
  creditPacks = creditPricingData,
  onPurchase,
  isLoading = false,
  selectedPack = null,
}: CreditPacksProps) {
  return (
    <div id="credit-packs">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Purchase Credits</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          No subscriptions, no hidden fees. Pay only for what you use with our credit system.
        </p>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <CreditCard className="w-4 h-4" />1 Credit = 1 Background Removal • Only $0.16-$0.20 per
          credit
        </div>
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        {creditPacks.map((pack) => (
          <Card
            key={pack.id}
            className={`relative transition-all duration-200 hover:shadow-md ${
              pack.popular ? 'ring-2 ring-primary shadow-sm' : ''
            }`}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              </div>
            )}

            <CardHeader className={`text-center ${pack.popular ? 'pt-8' : 'pt-6'} pb-4`}>
              <div className="mx-auto mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    pack.popular ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <Zap
                    className={`w-6 h-6 ${
                      pack.popular ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold">{pack.name}</CardTitle>
              <CardDescription className="text-sm">{pack.description}</CardDescription>
              <div className="mt-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">${pack.price}</span>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  {pack.credits} credits • ${(pack.price / pack.credits).toFixed(2)} per credit
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>{pack.credits} background removals</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>High-quality AI processing</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>All image formats supported</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Credits never expire</span>
                </div>
              </div>

              <Button
                onClick={() => onPurchase(pack.id)}
                disabled={isLoading}
                className="w-full"
                size="sm"
                variant={pack.popular ? 'default' : 'outline'}
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
                  'Purchase Credits'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 rounded-lg p-2 mt-2">
        <p className="text-xs text-center text-muted-foreground">
          Buy credits → Process images • 1 credit per removal • No subscription required
        </p>
      </div>
    </div>
  );
}
