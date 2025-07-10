/* eslint-disable @next/next/no-img-element */
'use client';

import { Download, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useCallback } from 'react';

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
  const downloadImage = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (processedImages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processed {multipleMode ? 'Images' : 'Image'}</CardTitle>
        <CardDescription>
          Your {multipleMode ? 'images' : 'image'} with background{multipleMode ? 's' : ''} removed.
          Click download to save {multipleMode ? 'them' : 'it'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(multipleMode ? 'space-y-6' : 'space-y-4')}>
          {processedImages.map((result, index) => (
            <div key={index} className="space-y-4">
              <div
                className={cn(
                  'gap-4',
                  multipleMode ? 'grid md:grid-cols-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                )}
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Original
                  </h3>
                  <div
                    className={cn(
                      'rounded-lg overflow-hidden border bg-muted',
                      multipleMode ? 'aspect-square' : 'aspect-[4/3]'
                    )}
                  >
                    <img
                      src={result.originalUrl}
                      alt={`Original ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Background Removed
                  </h3>
                  <div
                    className={cn(
                      'rounded-lg overflow-hidden border bg-transparent',
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {result.processingTime &&
                    `Processed in ${(result.processingTime / 1000).toFixed(1)}s`}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadImage(result.processedUrl, `bg-removed-${index + 1}.png`)}
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
