import {
  Clock,
  Download,
  Image as ImageIcon,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Lightning Fast',
    description: 'Remove backgrounds in under 3 seconds with our optimized AI processing.',
    icon: Zap,
    className: 'lg:col-span-2 lg:row-span-1',
  },
  {
    title: 'High Quality',
    description: 'Precision edge detection ensures professional results every time.',
    icon: Sparkles,
    className: 'lg:col-span-1 lg:row-span-1',
  },
  {
    title: 'Smart Detection',
    description:
      'Advanced AI automatically detects subjects including people, products, animals, and objects with incredible accuracy.',
    icon: ImageIcon,
    className: 'lg:col-span-1 lg:row-span-2',
  },
  {
    title: 'Multiple Formats',
    description:
      'Support for JPG, PNG, WebP, and more. Download in your preferred format with perfect quality.',
    icon: Download,
    className: 'lg:col-span-2 lg:row-span-1',
  },
  {
    title: 'Secure & Private',
    description: 'Your images are processed securely and automatically deleted after 24 hours.',
    icon: Shield,
    className: 'lg:col-span-1 lg:row-span-1',
  },
  {
    title: 'Batch Processing',
    description: 'Process multiple images simultaneously to save time and increase productivity.',
    icon: Layers,
    className: 'lg:col-span-1 lg:row-span-1',
  },
  {
    title: 'Custom Backgrounds',
    description:
      'Replace removed backgrounds with solid colors, gradients, or upload your own custom images.',
    icon: Palette,
    className: 'lg:col-span-2 lg:row-span-1',
  },
  {
    title: 'Real-time Preview',
    description:
      'See results instantly as you upload. No waiting, no surprises, just instant results.',
    icon: Clock,
    className: 'lg:col-span-1 lg:row-span-1',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Powerful Features for
            <span className="text-primary block">Every Use Case</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From e-commerce product shots to social media content, our AI-powered tools handle any
            background removal task with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${feature.className} relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Use Cases Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Perfect for Every Industry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <h4 className="font-semibold mb-2">E-commerce</h4>
              <p className="text-sm text-muted-foreground">Product catalogs and listings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
              </div>
              <h4 className="font-semibold mb-2">Social Media</h4>
              <p className="text-sm text-muted-foreground">Posts and profile pictures</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg transform rotate-45"></div>
              </div>
              <h4 className="font-semibold mb-2">Photography</h4>
              <p className="text-sm text-muted-foreground">Professional portraits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-purple-300"></div>
              </div>
              <h4 className="font-semibold mb-2">Marketing</h4>
              <p className="text-sm text-muted-foreground">Ads and promotional content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
