'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { useAuth } from '@/hooks/use-auth-queries';

import { FilePreview } from './file-preview';
import { FileUpload } from './file-upload';
import { ModeToggle } from './mode-toggle';
import { ProcessedResults } from './processed-results';

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  processingTime?: number;
  imageId?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface BackgroundRemovalResponse {
  success: boolean;
  processingTime: number;
  count: number;
  results: ProcessedImage | ProcessedImage[];
  error?: string;
}

async function removeBackgroundAPI(formData: FormData): Promise<BackgroundRemovalResponse> {
  const response = await fetch('/api/models/bg-remover', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process images');
  }

  return response.json();
}

export default function BackgroundRemover() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [multipleMode, setMultipleMode] = useState(false);
  const { clearAuthCache } = useAuth();

  const backgroundRemovalMutation = useMutation({
    mutationFn: removeBackgroundAPI,
    onSuccess: (data) => {
      const results = Array.isArray(data.results) ? data.results : [data.results];
      setProcessedImages(
        results.map((r: ProcessedImage) => ({
          originalUrl: r.originalUrl,
          processedUrl: r.processedUrl,
          processingTime: data.processingTime,
          imageId: r.imageId,
        }))
      );
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    },
    onSettled: () => {
      clearAuthCache();
    },
    onError: (error: Error) => {
      console.error('Background removal error:', error);
    },
  });

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  const onFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  }, []);

  const onMutationReset = useCallback(() => {
    backgroundRemovalMutation.reset();
  }, [backgroundRemovalMutation]);

  const processImages = useCallback(async () => {
    if (files.length === 0) return;

    setProgress(0);
    const formData = new FormData();

    if (multipleMode) {
      files.forEach(({ file }) => {
        formData.append('images', file);
      });
    } else {
      formData.append('image', files[0].file);
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    backgroundRemovalMutation.mutate(formData, {
      onSettled: () => {
        clearInterval(progressInterval);
      },
    });
  }, [files, multipleMode, backgroundRemovalMutation]);

  const reset = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setProcessedImages([]);
    backgroundRemovalMutation.reset();
    setProgress(0);
  }, [files, backgroundRemovalMutation]);

  const toggleMode = useCallback(() => {
    setMultipleMode((prev) => !prev);
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-gradient-page dark:bg-gradient-page-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-in fade-in-0 duration-1000">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              AI Background Remover
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Remove backgrounds from your images instantly with AI-powered precision. Perfect for
              e-commerce, social media, and professional photography.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center animate-in fade-in-0 duration-1000 delay-200">
            <ModeToggle multipleMode={multipleMode} onToggleMode={toggleMode} />
          </div>

          {/* Main Content */}
          <div className="grid gap-8">
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
              <FileUpload
                files={files}
                onFilesChange={onFilesChange}
                multipleMode={multipleMode}
                onReset={onMutationReset}
              />
            </div>

            {files.length > 0 && (
              <div className="animate-in slide-in-from-bottom-4 duration-700 delay-500">
                <FilePreview
                  files={files}
                  onRemoveFile={removeFile}
                  onProcessImages={processImages}
                  onReset={reset}
                  multipleMode={multipleMode}
                  isProcessing={backgroundRemovalMutation.isPending}
                  progress={progress}
                  error={backgroundRemovalMutation.error?.message}
                />
              </div>
            )}

            {processedImages.length > 0 && (
              <div className="animate-in slide-in-from-bottom-4 duration-700 delay-700">
                <ProcessedResults processedImages={processedImages} multipleMode={multipleMode} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
