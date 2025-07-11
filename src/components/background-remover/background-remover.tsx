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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <ModeToggle multipleMode={multipleMode} onToggleMode={toggleMode} />

      <FileUpload
        files={files}
        onFilesChange={onFilesChange}
        multipleMode={multipleMode}
        onReset={onMutationReset}
      />

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

      <ProcessedResults processedImages={processedImages} multipleMode={multipleMode} />
    </div>
  );
}
