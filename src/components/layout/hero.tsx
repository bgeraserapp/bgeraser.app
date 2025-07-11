'use client';

import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { env } from '@/env';

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Background Removal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Remove Backgrounds
            <span className="text-primary block">Instantly with AI</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your images in seconds with our powerful AI. Perfect for e-commerce, social
            media, and professional photography. No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
              <Button size="lg" className="text-lg px-8 py-3">
                Start Removing Backgrounds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Demo Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Before/After Demo 1 */}
          <Card className="p-6 bg-card border-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Portrait</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Before</p>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-20 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-200 rounded-full"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-red-400 rounded-lg"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">After</p>
                  <div className="aspect-square bg-transparent border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <div className="w-16 h-20 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-200 rounded-full"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-red-400 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Before/After Demo 2 */}
          <Card className="p-6 bg-card border-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Product</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Before</p>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black rounded-sm"></div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">After</p>
                  <div className="aspect-square bg-transparent border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <div className="w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black rounded-sm"></div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Before/After Demo 3 */}
          <Card className="p-6 bg-card border-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Object</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Before</p>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center">
                    <div className="w-14 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-orange-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">After</p>
                  <div className="aspect-square bg-transparent border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <div className="w-14 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-orange-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Images Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">&lt;3s</div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
