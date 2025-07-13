import { CreditCard, Star, Zap } from 'lucide-react';
import Link from 'next/link';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/env';
import creditPricingData from '@/lib/pricing';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Pricing Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Simple Credit-Based
              <span className="text-primary block">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              No subscriptions, no hidden fees. Pay only for what you use with our credit system.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="text-green-600 font-bold">🎉</span>
              New users get 3 free credits to get started!
            </div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <CreditCard className="w-4 h-4" />1 Credit = 1 Background Removal • Only $0.08-$0.10
              per credit
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

          {/* Try for Free Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Try BG Eraser for Free</h3>
              <p className="text-muted-foreground mb-6">
                Get 3 free credits when you sign up. No payment required to get started.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
                  <Button size="lg" className="w-full sm:w-auto">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
                <Link href={`${env.NEXT_PUBLIC_PORTAL_URL}/billing`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">How do credits work?</h4>
                <p className="text-sm text-muted-foreground">
                  Each background removal uses 1 credit. Credits are deducted from your account when
                  you process an image.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do credits expire?</h4>
                <p className="text-sm text-muted-foreground">
                  No! Your credits never expire. Use them whenever you need them.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What image formats are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  We support PNG, JPEG, GIF, and WebP formats. Maximum file size is 10MB.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                <p className="text-sm text-muted-foreground">
                  All sales are final. We encourage you to try our 3 free credits before purchasing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a bulk discount?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! The more credits you buy, the lower the per-credit cost becomes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How fast is the processing?</h4>
                <p className="text-sm text-muted-foreground">
                  Most images are processed within 5-30 seconds depending on size and complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
