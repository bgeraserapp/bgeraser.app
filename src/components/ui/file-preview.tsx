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
    <div className="space-y-4">
      <div
        className={cn(
          multipleMode
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
            : 'flex justify-center'
        )}
      >
        {files.map(({ file, preview, id }) => (
          <div key={id} className={cn('relative group', !multipleMode && 'w-full max-w-sm')}>
            <div
              className={cn(
                'rounded-lg overflow-hidden border',
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
            <p className="text-xs text-muted-foreground mt-1 truncate text-center">{file.name}</p>
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
              Remove Background
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onReset}>
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Processing images... {Math.round(progress)}%
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
