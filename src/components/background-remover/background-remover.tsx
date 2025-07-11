'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { FilePreview } from '@/components/background-remover/file-preview';
import { FileUpload } from '@/components/background-remover/file-upload';
import { ProcessedResults } from '@/components/background-remover/processed-results';
import { ModeToggle } from '@/components/ui/mode-toggle';

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

// API call function
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

export function BackgroundRemover() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [multipleMode, setMultipleMode] = useState(false);

  // React Query mutation for background removal
  const backgroundRemovalMutation = useMutation({
    mutationFn: removeBackgroundAPI,
    onSuccess: (data) => {
      // Handle both single and multiple results
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
      // Single mode: append as 'image' for single processing
      formData.append('image', files[0].file);
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    // Use React Query mutation
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
    <div className="w-full max-w-5xl mx-auto space-y-4 p-3">
      {/* Compact Header */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
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
          <h1 className="text-2xl font-bold text-foreground">Background Remover</h1>
        </div>
        <p className="text-sm text-muted-foreground">Remove backgrounds instantly using AI</p>
      </div>

      <div className="space-y-3">
        <ModeToggle multipleMode={multipleMode} onToggleMode={toggleMode} />

        <div className="animate-in fade-in-50 duration-300">
          <FileUpload
            files={files}
            onFilesChange={onFilesChange}
            multipleMode={multipleMode}
            onReset={onMutationReset}
          />
        </div>

        <div className="animate-in fade-in-50 duration-500">
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

        <div className="animate-in fade-in-50 duration-700">
          <ProcessedResults processedImages={processedImages} multipleMode={multipleMode} />
        </div>
      </div>
    </div>
  );
}
