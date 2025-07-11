/* eslint-disable @next/next/no-img-element */
'use client';

import { Archive, Download, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  processingTime?: number;
  imageId?: string;
}

interface ProcessedResultsProps {
  processedImages: ProcessedImage[];
  multipleMode: boolean;
}

export function ProcessedResults({ processedImages, multipleMode }: ProcessedResultsProps) {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [imageView, setImageView] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const downloadImage = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank'; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAllAsZip = useCallback(async () => {
    if (processedImages.length === 0) return;

    setIsDownloadingZip(true);
    try {
      const urls = processedImages.map((img) => img.processedUrl);

      const response = await fetch('/api/download-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error('Failed to download zip');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'bg-removed-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading zip:', error);
    } finally {
      setIsDownloadingZip(false);
    }
  }, [processedImages]);

  if (processedImages.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-success-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">✨ Magic Complete!</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {processedImages.length} image{processedImages.length > 1 ? 's' : ''} processed
                successfully
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!multipleMode && processedImages.length === 1 && (
              <div className="flex gap-1">
                <Button
                  variant={imageView === 'side-by-side' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('side-by-side')}
                  className={imageView === 'side-by-side' ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Split
                </Button>
                <Button
                  variant={imageView === 'overlay' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('overlay')}
                  className={imageView === 'overlay' ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Overlay
                </Button>
              </div>
            )}

            {multipleMode && processedImages.length > 1 && (
              <Button
                variant="outline"
                onClick={downloadAllAsZip}
                disabled={isDownloadingZip}
                className="bg-card/50 hover:bg-card/80 border-border hover:border-primary transition-all duration-300"
              >
                <Archive className="h-4 w-4 mr-2" />
                {isDownloadingZip ? 'Creating ZIP...' : 'Download All'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {processedImages.map((result, index) => (
          <div
            key={index}
            className="space-y-6 animate-in fade-in-0 duration-700"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {!multipleMode && imageView === 'overlay' ? (
              // Overlay view for single image
              <div className="relative max-w-3xl mx-auto">
                <div
                  className="aspect-[4/3] rounded-2xl overflow-hidden border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={result.originalUrl || '/placeholder.svg'}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 w-full h-full transition-opacity duration-500',
                        hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                      )}
                      style={{
                        backgroundImage: `var(--checkerboard)`,
                        backgroundSize: '20px 20px',
                      }}
                    >
                      <img
                        src={result.processedUrl || '/placeholder.svg'}
                        alt="Processed"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-background/70 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium border">
                  <Eye className="w-4 h-4 inline mr-2" />
                  Hover to see original
                </div>

                <div className="absolute top-4 right-4 bg-success/90 backdrop-blur-sm text-success-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Background Removed
                </div>
              </div>
            ) : (
              // Side by side view
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Original Image */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-muted-foreground"
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Original
                    </h3>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      Before
                    </Badge>
                  </div>

                  <div
                    className={cn(
                      'rounded-2xl overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer',
                      multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                      'border-border'
                    )}
                  >
                    <img
                      src={result.originalUrl || '/placeholder.svg'}
                      alt={`Original ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-success rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-success-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Enhanced
                    </h3>
                    <Badge variant="secondary" className="bg-success-50 text-success">
                      After
                    </Badge>
                  </div>

                  <div
                    className={cn(
                      'rounded-2xl overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer',
                      multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                      'border-success/30'
                    )}
                    style={{
                      backgroundImage: `var(--checkerboard)`,
                      backgroundSize: '20px 20px',
                    }}
                  >
                    <img
                      src={result.processedUrl || '/placeholder.svg'}
                      alt={`Processed ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stats and Download */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 to-success/5 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-6">
                {result.processingTime && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Processed in {(result.processingTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                )}
                {result.imageId && (
                  <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                    ID: {result.imageId}
                  </div>
                )}
              </div>

              <Button
                onClick={() => downloadImage(result.processedUrl, `bg-removed-${index + 1}.png`)}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
