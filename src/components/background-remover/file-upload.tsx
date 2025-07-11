'use client';

import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  multipleMode: boolean;
  onReset: () => void;
}

export function FileUpload({ files, onFilesChange, multipleMode, onReset }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size <= 10 * 1024 * 1024;
        return isImage && isValidSize;
      });

      const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
      }));

      if (multipleMode) {
        // Limit to 10 images total
        const newFiles = [...files, ...uploadedFiles];
        const limitedFiles = newFiles.slice(0, 10);

        // Clean up URLs for files that exceed the limit
        if (newFiles.length > 10) {
          newFiles.slice(10).forEach((f) => URL.revokeObjectURL(f.preview));
        }

        onFilesChange(limitedFiles);
      } else {
        if (files.length > 0) {
          files.forEach((f) => URL.revokeObjectURL(f.preview));
        }
        onFilesChange(uploadedFiles.slice(0, 1));
      }
      onReset();
    },
    [multipleMode, files, onFilesChange, onReset]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
    },
    multiple: multipleMode,
    maxSize: 10 * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="w-4 h-4 text-primary" />
          Upload {multipleMode ? 'Images' : 'Image'}
        </CardTitle>
        <CardDescription className="text-sm">
          {multipleMode
            ? 'Drop multiple images or click to select (max 10MB each)'
            : 'Drop an image or click to select (max 10MB)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div
          {...getRootProps()}
          className={cn(
            'relative border border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30',
            files.length === 0 ? 'min-h-24' : 'min-h-16'
          )}
          onClick={open}
        >
          <input {...getInputProps()} />

          {files.length === 0 ? (
            <div className="space-y-3">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop {multipleMode ? 'images' : 'an image'} here
                </p>
                <p className="text-xs text-muted-foreground">Or click to select from computer</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {files.length} image{files.length > 1 ? 's' : ''} selected
              </p>
              {multipleMode && files.length < 10 && (
                <Button variant="outline" size="sm" onClick={open}>
                  <Upload className="w-3 h-3 mr-1" />
                  Add More
                </Button>
              )}
              {multipleMode && files.length >= 10 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">Maximum 10 images</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
