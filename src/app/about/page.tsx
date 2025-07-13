import { Sparkles, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            About BG Eraser
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Making Background Removal
            <span className="text-primary block">Simple for Everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe that powerful AI tools should be accessible, affordable, and easy to use.
            That&apos;s why we built BG Eraser - to democratize professional image editing.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To provide the most accurate, fastest, and user-friendly background removal service
                on the internet. We want to empower creators, businesses, and individuals to produce
                professional-quality images without technical expertise or expensive software.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where anyone can create stunning visuals effortlessly. We envision BG Eraser
                as the go-to solution for all background removal needs, from social media posts to
                e-commerce catalogs, making professional image editing accessible to all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-muted-foreground leading-relaxed mb-6">
              BG Eraser was born from a simple frustration: why should removing backgrounds from
              images be so complicated and expensive? Our founders, experienced in both AI
              technology and design, noticed that existing solutions were either too complex for
              everyday users or prohibitively expensive for small businesses.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In 2024, we set out to change that. By leveraging the latest advances in artificial
              intelligence and machine learning, we developed a solution that delivers professional
              results in seconds, not minutes or hours.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, BG Eraser serves thousands of users worldwide, from individual creators to
              large e-commerce businesses. We&apos;re proud to be making professional image editing
              accessible to everyone, regardless of their technical background or budget.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
                <p className="text-muted-foreground">
                  Every decision we make puts our users first. We design for simplicity,
                  reliability, and the best possible user experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of what&apos;s possible with AI, bringing
                  cutting-edge technology to everyday users.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Professional tools shouldn&apos;t be limited to professionals. We make powerful
                  technology accessible to everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience BG Eraser?</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of creators and businesses who trust BG Eraser for their image editing
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Try BG Eraser Free
            </Link>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-foreground bg-background border border-input rounded-md hover:bg-accent transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
