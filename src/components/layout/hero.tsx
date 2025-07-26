'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { env } from '@/env';

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden border bg-accent">
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
            Transform your images in under 30 seconds with our powerful AI. Perfect for e-commerce,
            social media, and professional photography. No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={env.NEXT_PUBLIC_PORTAL_URL}>
              <Button size="lg" className="text-lg px-8 py-3">
                Start Removing Backgrounds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              View Demo
            </Button> */}
          </div>
        </div>

        {/* Demo Images Section */}
        <div
          className="max-w-5xl mx-auto"
          style={{
            display: 'none',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portrait Demo */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-center mb-6">Portrait Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Before</p>
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 flex items-center justify-center border">
                      <div className="w-12 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative shadow-sm">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-200 rounded-full"></div>
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-red-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">After</p>
                    <div className="aspect-[3/4] bg-white dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center relative">
                      <div className="w-12 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative shadow-lg">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-200 rounded-full"></div>
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-red-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Demo */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-center mb-6">Product Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Before</p>
                    <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-4 flex items-center justify-center border">
                      <div className="w-10 h-14 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg relative shadow-sm">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black rounded-sm"></div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-6 bg-blue-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">After</p>
                    <div className="aspect-[3/4] bg-white dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center relative">
                      <div className="w-10 h-14 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg relative shadow-lg">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black rounded-sm"></div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-6 bg-blue-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Object Demo */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-center mb-6">Any Object</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Before</p>
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-4 flex items-center justify-center border">
                      <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative shadow-sm">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-5 bg-orange-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">After</p>
                    <div className="aspect-[3/4] bg-white dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center relative">
                      <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative shadow-lg">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-5 bg-orange-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
