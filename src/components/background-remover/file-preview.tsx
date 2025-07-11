/* eslint-disable @next/next/no-img-element */
'use client';

import { Loader2, Trash2, Wand2, X } from 'lucide-react';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface FilePreviewProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
  onProcessImages: () => void;
  onReset: () => void;
  multipleMode: boolean;
  isProcessing: boolean;
  progress: number;
  error?: string;
}

export function FilePreview({
  files,
  onRemoveFile,
  onProcessImages,
  onReset,
  multipleMode,
  isProcessing,
  progress,
  error,
}: FilePreviewProps) {
  const removeFile = useCallback(
    (id: string) => {
      onRemoveFile(id);
    },
    [onRemoveFile]
  );

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary-foreground"
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
            <span className="text-xl font-semibold">Preview & Process</span>
          </div>
          <Badge variant="secondary" className="bg-primary-50 text-primary">
            {files.length} image{files.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image Grid */}
        <div
          className={cn(
            'gap-4',
            multipleMode
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'flex justify-center'
          )}
        >
          {files.map(({ file, preview, id }, index) => (
            <div
              key={id}
              className={cn(
                'relative group animate-in fade-in-0 duration-500 hover:scale-105 transition-all',
                !multipleMode && 'w-full max-w-sm'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  'rounded-xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300',
                  multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                  'border-border'
                )}
              >
                <img
                  src={preview || '/placeholder.svg'}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeFile(id)}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onProcessImages}
            disabled={isProcessing}
            className="flex-1 hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing Magic...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Remove Background{multipleMode && files.length > 1 ? 's' : ''}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            className="bg-card/50 hover:bg-card/80 border-border hover:border-destructive hover:text-destructive transition-all duration-300 h-12 px-6"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-3 animate-in fade-in-0 duration-300">
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">AI is working its magic...</span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in-0 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-destructive-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-destructive">Processing Error</h4>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
