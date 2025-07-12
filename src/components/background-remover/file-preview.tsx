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
  credits?: number;
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
  credits = 0,
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
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gradient-primary rounded-md flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-primary-foreground"
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
            <span className="text-sm font-semibold">Preview</span>
          </div>
          <Badge variant="secondary" className="bg-primary-50 text-primary text-xs px-1.5 py-0.5">
            {files.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 px-3 pb-3">
        {/* Compact Image Grid */}
        <div
          className={cn(
            'gap-1.5',
            multipleMode
              ? 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
              : 'flex justify-center'
          )}
        >
          {files.map(({ file, preview, id }, index) => (
            <div
              key={id}
              className={cn(
                'relative group animate-in fade-in-0 duration-300 hover:scale-105 transition-all',
                !multipleMode && 'w-full max-w-xs'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'rounded-md overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200',
                  multipleMode ? 'aspect-square' : 'aspect-[4/3]',
                  'border-border'
                )}
              >
                <img
                  src={preview || '/placeholder.svg'}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeFile(id)}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105"
              >
                <X className="h-2.5 w-2.5" />
              </Button>

              {!multipleMode && (
                <div className="mt-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(1)}MB
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compact Action Buttons */}
        <div className="flex gap-1.5">
          <Button
            onClick={onProcessImages}
            disabled={isProcessing || credits < files.length}
            className="flex-1 hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 h-8 disabled:opacity-50 text-xs"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Processing...
              </>
            ) : credits < files.length ? (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                Need {files.length}
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                Remove ({files.length})
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            className="bg-card/50 hover:bg-card/80 border-border hover:border-destructive hover:text-destructive transition-all duration-200 h-8 px-3 text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Compact Progress Bar */}
        {isProcessing && (
          <div className="space-y-1 animate-in fade-in-0 duration-200">
            <div className="relative">
              <Progress value={progress} className="h-1.5" />
              <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Processing...</span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Compact Error Display */}
        {error && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in-0 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-2 h-2 text-destructive-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-destructive text-xs">Error</h4>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
