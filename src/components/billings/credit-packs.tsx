'use client';

import { CreditCard, Star, Zap } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  description: string;
}

interface CreditPacksProps {
  creditPacks?: CreditPack[];
  onPurchase: (packId: string) => Promise<void>;
  isLoading?: boolean;
  selectedPack?: string | null;
}

const defaultCreditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 9.99,
    popular: false,
    description: 'Personal use',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 24.99,
    popular: true,
    description: 'Most popular',
  },
  {
    id: 'proplus',
    name: 'Pro Plus',
    credits: 500,
    price: 79.99,
    popular: false,
    description: 'For professionals',
  },
];

export function CreditPacks({
  creditPacks = defaultCreditPacks,
  onPurchase,
  isLoading = false,
  selectedPack = null,
}: CreditPacksProps) {
  return (
    <div id="credit-packs">
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Purchase Credits</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a credit pack • $0.20 per image processing
        </p>
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
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-b-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </div>
              </div>
            )}

            <CardHeader className={`text-center ${pack.popular ? 'pt-5' : 'pt-3'} pb-2`}>
              <div className="mx-auto mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    pack.popular ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <Zap
                    className={`w-5 h-5 ${
                      pack.popular ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                </div>
              </div>
              <CardTitle className="text-sm font-bold">{pack.name}</CardTitle>
              <CardDescription className="text-xs">{pack.description}</CardDescription>
              <div className="mt-1">
                <div className="text-center">
                  <span className="text-lg font-bold text-foreground">${pack.price}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {pack.credits} credits • ${(pack.price / pack.credits).toFixed(2)}/credit
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-3 pt-0">
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
