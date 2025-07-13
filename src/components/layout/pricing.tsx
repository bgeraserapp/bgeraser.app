import { CreditCard, Star, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/env';
import creditPricingData from '@/lib/pricing';

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Simple Credit-Based
            <span className="text-primary block">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            No subscriptions, no hidden fees. Pay only for what you use with our credit system.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-green-600 font-bold">🎉</span>
            New users get 3 free credits to get started!
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <CreditCard className="w-4 h-4" />1 Credit = 1 Background Removal • Only $0.08-$0.10 per
            credit
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {creditPricingData.map((pack) => (
            <Card
              key={pack.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                pack.popular ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover:scale-[1.02]'
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

                <Link href={`${env.NEXT_PUBLIC_PORTAL_URL}/billing`} className="block">
                  <Button
                    className="w-full"
                    size="lg"
                    variant={pack.popular ? 'default' : 'outline'}
                  >
                    {pack.popular && <Zap className="w-4 h-4 mr-2" />}
                    Get {pack.credits} Credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-background rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-6">
            Why Choose Credit-Based Pricing?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h4 className="font-semibold mb-2">No Subscriptions</h4>
              <p className="text-sm text-muted-foreground">
                Pay only when you need it. No monthly commitments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">∞</span>
              </div>
              <h4 className="font-semibold mb-2">Credits Never Expire</h4>
              <p className="text-sm text-muted-foreground">
                Use your credits whenever you want, no time limits.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">$</span>
              </div>
              <h4 className="font-semibold mb-2">Transparent Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Know exactly what you pay. No hidden fees or surprises.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
