/* eslint-disable @next/next/no-img-element */
'use client';

import { Loader2, RefreshCw, X } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
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
    <div className="space-y-3">
      <div
        className={cn(
          multipleMode
            ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'
            : 'flex justify-center'
        )}
      >
        {files.map(({ file, preview, id }, index) => (
          <div
            key={id}
            className={cn(
              'relative group animate-in fade-in-50 duration-500',
              !multipleMode && 'w-full max-w-md'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={cn(
                'rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200',
                multipleMode ? 'aspect-square' : 'aspect-[4/3]'
              )}
            >
              <img src={preview} alt={file.name} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => removeFile(id)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="mt-1 text-center">
              <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={onProcessImages} disabled={isProcessing} className="flex-1">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Remove Background{multipleMode && files.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Processing... {Math.round(progress)}%
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
