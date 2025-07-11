/* eslint-disable @next/next/no-img-element */
'use client';

import { Archive, Download, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  const downloadImage = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
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
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Processed {multipleMode ? 'Images' : 'Image'}
            </CardTitle>
            <CardDescription className="text-sm">
              {multipleMode ? 'Images' : 'Image'} with background removed
            </CardDescription>
          </div>
          {!multipleMode && processedImages.length === 1 && (
            <div className="flex gap-1">
              <Button
                variant={imageView === 'side-by-side' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageView('side-by-side')}
              >
                Split
              </Button>
              <Button
                variant={imageView === 'overlay' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageView('overlay')}
              >
                Overlay
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {multipleMode && processedImages.length > 1 && (
          <div className="mb-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAllAsZip}
              disabled={isDownloadingZip}
            >
              <Archive className="h-3 w-3 mr-1" />
              {isDownloadingZip ? 'Creating...' : 'Download ZIP'}
            </Button>
          </div>
        )}

        <div className={cn(multipleMode ? 'space-y-4' : 'space-y-3')}>
          {processedImages.map((result, index) => (
            <div
              key={index}
              className="space-y-4 animate-in fade-in-50 duration-500"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {!multipleMode && imageView === 'overlay' ? (
                // Overlay view for single image
                <div className="relative max-w-2xl mx-auto">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 shadow-lg">
                    <div className="relative w-full h-full">
                      <img
                        src={result.originalUrl}
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 w-full h-full transition-opacity duration-300 hover:opacity-0"
                        style={{
                          backgroundImage: `conic-gradient(from 0deg, #e5e7eb 0deg, #e5e7eb 90deg, #f3f4f6 90deg, #f3f4f6 180deg, #e5e7eb 180deg, #e5e7eb 270deg, #f3f4f6 270deg, #f3f4f6 360deg)`,
                          backgroundSize: '20px 20px',
                        }}
                      >
                        <img
                          src={result.processedUrl}
                          alt="Processed"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Hover to see original
                  </div>
                </div>
              ) : (
                // Side by side view
                <div
                  className={cn(
                    'gap-6',
                    multipleMode ? 'grid md:grid-cols-2' : 'grid grid-cols-1 lg:grid-cols-2'
                  )}
                >
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <div className="p-1.5 bg-gray-500 rounded-lg">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                      Original
                    </h3>
                    <div
                      className={cn(
                        'rounded-xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300',
                        multipleMode ? 'aspect-square' : 'aspect-[4/3]'
                      )}
                    >
                      <img
                        src={result.originalUrl}
                        alt={`Original ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <div className="p-1.5 bg-green-500 rounded-lg">
                        <RefreshCw className="h-4 w-4 text-white" />
                      </div>
                      Background Removed
                    </h3>
                    <div
                      className={cn(
                        'rounded-xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300',
                        multipleMode ? 'aspect-square' : 'aspect-[4/3]'
                      )}
                      style={{
                        backgroundImage: `conic-gradient(from 0deg, #e5e7eb 0deg, #e5e7eb 90deg, #f3f4f6 90deg, #f3f4f6 180deg, #e5e7eb 180deg, #e5e7eb 270deg, #f3f4f6 270deg, #f3f4f6 360deg)`,
                        backgroundSize: '20px 20px',
                      }}
                    >
                      <img
                        src={result.processedUrl}
                        alt={`Processed ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {result.processingTime &&
                      `Processed in ${(result.processingTime / 1000).toFixed(1)}s`}
                  </div>
                  {result.imageId && (
                    <div className="text-xs text-muted-foreground font-mono">
                      ID: {result.imageId}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadImage(result.processedUrl, `bg-removed-${index + 1}.png`)}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
