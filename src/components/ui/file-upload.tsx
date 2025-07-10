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
        onFilesChange([...files, ...uploadedFiles]);
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
    <Card>
      <CardHeader>
        <CardTitle>Upload {multipleMode ? 'Images' : 'Image'}</CardTitle>
        <CardDescription>
          {multipleMode
            ? 'Drag and drop multiple images here or click to select files. Maximum 10MB per image.'
            : 'Drag and drop an image here or click to select a file. Maximum 10MB.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            files.length === 0 ? 'min-h-32' : 'min-h-20'
          )}
          onClick={open}
        >
          <input {...getInputProps()} />

          {files.length === 0 ? (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  Drop {multipleMode ? 'images' : 'an image'} here
                </p>
                <p className="text-sm text-muted-foreground">
                  Or click to select {multipleMode ? 'files' : 'a file'} from your computer
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {files.length} image{files.length > 1 ? 's' : ''} selected
              </p>
              {multipleMode && (
                <Button variant="outline" size="sm" onClick={open}>
                  Add More Images
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
