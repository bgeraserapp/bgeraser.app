'use client';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { ArrowUp, CreditCard, Star, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import { env } from '@/env';

import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const creditPacks = [
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
    id: 'enterprise',
    name: 'Enterprise',
    credits: 500,
    price: 79.99,
    popular: false,
    description: 'Teams & agencies',
  },
];

export function AddCreditComponent() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  // Mock credit data - in real app, this would come from API
  const currentCredits = 120;
  const usedCredits = 80;
  const totalCreditsUsed = 280;

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddle) => setPaddle(paddle));
  }, []);

  const handleCheckout = async (packId: string) => {
    if (!paddle) {
      alert('Payment system not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setSelectedPack(packId);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packId }),
      });

      const data = await response.json();

      paddle.Checkout.open({
        transactionId: data.transaction.id,
        settings: {
          theme: 'light',
          successUrl: `${env.NEXT_PUBLIC_PORTAL_URL}/billing?success=true`,
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPack(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
      {/* Credit Management Section */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Credit Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Current Credits */}
          <Card
            className="transition-all duration-200 hover:shadow-md hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '0ms' }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <p className="text-2xl font-bold text-primary">{currentCredits}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(10, (currentCredits / (currentCredits + usedCredits)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{usedCredits} used this month</p>
            </CardContent>
          </Card>

          {/* Total Usage */}
          <Card
            className="transition-all duration-200 hover:shadow-md hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '100ms' }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Images</p>
                  <p className="text-2xl font-bold text-foreground">{totalCreditsUsed}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
              <p className="text-xs text-muted-foreground mt-3">All-time processed</p>
            </CardContent>
          </Card>

          {/* Quick Upgrade */}
          <Card
            className="border-primary/50 transition-all duration-200 hover:shadow-md hover:border-primary hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '200ms' }}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ArrowUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Need More?</p>
                <p className="text-xs text-muted-foreground mb-3">Get credits instantly</p>
                <Button
                  size="sm"
                  className="w-full transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    document.getElementById('credit-packs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Purchase Credits Section */}
      <div id="credit-packs">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Purchase Credits</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose a credit pack • $0.20 per image processing
          </p>
        </div>
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {creditPacks.map((pack) => (
          <Card
            key={pack.id}
            className={`relative transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 ${
              pack.popular ? 'ring-2 ring-primary shadow-md animate-pulse' : ''
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

            <CardHeader className={`text-center ${pack.popular ? 'pt-6' : 'pt-4'} pb-3`}>
              <div className="mx-auto mb-3">
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
              <CardTitle className="text-base font-bold">{pack.name}</CardTitle>
              <CardDescription className="text-xs">{pack.description}</CardDescription>
              <div className="mt-2">
                <div className="text-center">
                  <span className="text-xl font-bold text-foreground">${pack.price}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {pack.credits} credits • ${(pack.price / pack.credits).toFixed(2)}/credit
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <Button
                onClick={() => handleCheckout(pack.id)}
                disabled={isLoading}
                className="w-full transition-all duration-200 hover:scale-105"
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

      {/* Payment Information Card */}
      <div className="mt-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Pricing Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/50 dark:bg-gray-900/20 rounded-lg p-3">
                    <div className="font-medium text-foreground">Per Image</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$0.20</div>
                    <div className="text-xs text-muted-foreground">High-quality AI processing</div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-900/20 rounded-lg p-3">
                    <div className="font-medium text-foreground">Processing Time</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">~2s</div>
                    <div className="text-xs text-muted-foreground">Average completion time</div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-900/20 rounded-lg p-3">
                    <div className="font-medium text-foreground">File Formats</div>
                    <div className="text-sm font-bold text-foreground">JPG, PNG</div>
                    <div className="text-xs text-muted-foreground">Up to 15MB per image</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/30 dark:bg-gray-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium text-foreground">What&apos;s Included</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                    <li>• Enterprise-grade AI background removal</li>
                    <li>• High-resolution output (same as input)</li>
                    <li>• Instant download & cloud storage</li>
                    <li>• No watermarks or limitations</li>
                    <li>• API access for developers</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 rounded-lg p-2 mt-4">
        <p className="text-xs text-center text-muted-foreground">
          Buy credits → Process images • 1 credit per removal • No subscription required
        </p>
      </div>
    </div>
  );
}
