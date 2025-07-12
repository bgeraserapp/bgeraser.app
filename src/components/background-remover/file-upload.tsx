'use client';

import { Sparkles, Upload, Zap } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        const newFiles = [...files, ...uploadedFiles];
        const limitedFiles = newFiles.slice(0, 10);

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
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border shadow-lg">
      <CardContent className="p-4">
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group',
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : files.length === 0
                ? 'border-border hover:border-primary hover:bg-primary/5'
                : 'border-success bg-success/5',
            'min-h-[120px] flex flex-col items-center justify-center'
          )}
          onClick={open}
        >
          <input {...getInputProps()} />

          {files.length === 0 ? (
            <div className="space-y-3">
              <div className="relative">
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-warning animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Drop {multipleMode ? 'images' : 'an image'} here
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Or click to select files</p>

                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  <Badge variant="secondary" className="bg-primary-50 text-primary text-xs">
                    <Zap className="w-2 h-2 mr-1" />
                    AI
                  </Badge>
                  <Badge variant="secondary" className="bg-success-50 text-success text-xs">
                    10MB Max
                  </Badge>
                  <Badge variant="secondary" className="bg-info-50 text-info text-xs">
                    PNG, JPG
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto bg-success rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-success-foreground"
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
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {files.length} image{files.length > 1 ? 's' : ''} ready
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {multipleMode && files.length < 10
                    ? 'Add more or process current selection'
                    : 'Ready to process'}
                </p>
              </div>

              {multipleMode && files.length < 10 && (
                <Button
                  variant="outline"
                  onClick={open}
                  size="sm"
                  className="mt-2 bg-card/50 hover:bg-card/80 border-border hover:border-primary transition-all duration-300"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Add More
                </Button>
              )}

              {multipleMode && files.length >= 10 && (
                <Badge
                  variant="outline"
                  className="border-warning text-warning bg-warning-50 text-xs"
                >
                  Max 10 images reached
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
