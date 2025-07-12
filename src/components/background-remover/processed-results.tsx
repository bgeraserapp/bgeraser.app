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
    link.target = '_blank';
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
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gradient-success rounded-md flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-success-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">✨ Done!</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {processedImages.length} processed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!multipleMode && processedImages.length === 1 && (
              <div className="flex gap-0.5">
                <Button
                  variant={imageView === 'side-by-side' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('side-by-side')}
                  className={cn(
                    'h-6 px-1.5 text-xs',
                    imageView === 'side-by-side' ? 'bg-primary hover:bg-primary/90' : ''
                  )}
                >
                  <Eye className="w-2.5 h-2.5 mr-0.5" />
                  Split
                </Button>
                <Button
                  variant={imageView === 'overlay' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageView('overlay')}
                  className={cn(
                    'h-6 px-1.5 text-xs',
                    imageView === 'overlay' ? 'bg-primary hover:bg-primary/90' : ''
                  )}
                >
                  <EyeOff className="w-2.5 h-2.5 mr-0.5" />
                  Overlay
                </Button>
              </div>
            )}

            {multipleMode && processedImages.length > 1 && (
              <Button
                variant="outline"
                onClick={downloadAllAsZip}
                disabled={isDownloadingZip}
                size="sm"
                className="bg-card/50 hover:bg-card/80 border-border hover:border-primary transition-all duration-200 h-6 px-1.5 text-xs"
              >
                <Archive className="h-2.5 w-2.5 mr-0.5" />
                {isDownloadingZip ? 'ZIP...' : 'All'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-3 pb-3">
        {processedImages.map((result, index) => (
          <div
            key={index}
            className="space-y-2 animate-in fade-in-0 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {!multipleMode && imageView === 'overlay' ? (
              <div className="relative max-w-xl mx-auto">
                <div
                  className="aspect-[4/3] rounded-md overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={
                      hoveredIndex === index
                        ? result.originalUrl
                        : result.processedUrl || '/placeholder.svg'
                    }
                    alt={hoveredIndex === index ? 'Original' : 'Processed'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm text-foreground px-1.5 py-0.5 rounded-full text-xs font-medium border">
                  <Eye className="w-2.5 h-2.5 inline mr-0.5" />
                  Hover
                </div>
              </div>
            ) : (
              <div className="grid gap-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs h-5 px-1.5">
                    Original
                  </Badge>

                  <div
                    className={cn(
                      'rounded-md overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer',
                      multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                      'border-border'
                    )}
                  >
                    <img
                      src={result.originalUrl || '/placeholder.svg'}
                      alt={`Original ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Badge variant="default" className="text-xs h-5 px-1.5 bg-success">
                    Processed
                  </Badge>

                  <div
                    className={cn(
                      'rounded-md overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer relative',
                      multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                      'border-border'
                    )}
                    style={{
                      backgroundImage: `var(--checkerboard)`,
                      backgroundSize: '15px 15px',
                    }}
                  >
                    <img
                      src={result.processedUrl || '/placeholder.svg'}
                      alt={`Processed ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-primary/5 to-success/5 rounded-md border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {result.processingTime && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{(result.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => downloadImage(result.processedUrl, `bg-removed-${index + 1}.png`)}
                size="sm"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 h-6 px-2 text-xs"
              >
                <Download className="h-2.5 w-2.5 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
