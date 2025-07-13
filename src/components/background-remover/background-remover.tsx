'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { CreditErrorAlert } from '@/components/background-remover/credit-error-alert';
import { LowCreditWarning } from '@/components/background-remover/low-credit-warning';
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

interface CreditError extends Error {
  status: number;
  code?: string;
  creditsRequired?: number;
  creditsAvailable?: number;
}

async function removeBackgroundAPI(formData: FormData): Promise<BackgroundRemovalResponse> {
  const response = await fetch('/api/models/bg-remover', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    if (response.status === 402) {
      // Payment Required - Insufficient Credits
      const creditError = new Error(
        errorData.message || errorData.error || 'Insufficient credits'
      ) as CreditError;
      creditError.status = 402;
      creditError.code = errorData.code;
      creditError.creditsRequired = errorData.creditsRequired;
      creditError.creditsAvailable = errorData.creditsAvailable;
      throw creditError;
    }

    throw new Error(errorData.error || 'Failed to process images');
  }

  return response.json();
}

export default function BackgroundRemover() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [multipleMode, setMultipleMode] = useState(false);
  const [showCreditError, setShowCreditError] = useState(false);
  const { clearAuthCache, user, credits, invalidateCredits } = useAuth();

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
      invalidateCredits();
    },
    onError: (error: Error) => {
      console.error('Background removal error:', error);

      // Handle credit errors specifically
      const creditError = error as CreditError;
      if (creditError.status === 402) {
        setShowCreditError(true);
        // Update credits from server response if available
        if (typeof creditError.creditsAvailable === 'number') {
          invalidateCredits();
        }
      }
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

    const creditsNeeded = files.length;

    // Check if user has sufficient credits before processing
    if (credits < creditsNeeded) {
      setShowCreditError(true);
      return;
    }

    setShowCreditError(false);

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
  }, [files, multipleMode, backgroundRemovalMutation, credits]);

  const reset = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setProcessedImages([]);
    backgroundRemovalMutation.reset();
    setProgress(0);
    setShowCreditError(false);
  }, [files, backgroundRemovalMutation]);

  const toggleMode = useCallback(() => {
    setMultipleMode((prev) => !prev);
    reset();
  }, [reset]);

  const router = useRouter();
  const handleBuyCredits = useCallback(() => {
    router.push('/billing');
  }, [router]);

  return (
    <div className="w-full bg-gradient-page dark:bg-gradient-page-dark">
      <div className="container mx-auto px-2 py-2">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Compact Header with Mode Toggle */}
          <div className="text-center space-y-2 animate-in fade-in-0 duration-700">
            <div className="flex items-center justify-center flex-col gap-3">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center my-5">
                <span className="text-primary-foreground font-bold text-4xl">BG</span>
              </div>
              <ModeToggle multipleMode={multipleMode} onToggleMode={toggleMode} />
            </div>
          </div>

          {/* Compact Alerts */}
          {user && credits < 5 && !showCreditError && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <LowCreditWarning />
            </div>
          )}

          {showCreditError && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <CreditErrorAlert
                creditsNeeded={files.length}
                creditsAvailable={credits}
                onBuyCredits={handleBuyCredits}
              />
            </div>
          )}

          {/* Compact Main Content */}
          <div className="space-y-2">
            <div className="animate-in slide-in-from-bottom-2 duration-500">
              <FileUpload
                files={files}
                onFilesChange={onFilesChange}
                multipleMode={multipleMode}
                onReset={onMutationReset}
              />
            </div>

            {files.length > 0 && (
              <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
                <FilePreview
                  files={files}
                  onRemoveFile={removeFile}
                  onProcessImages={processImages}
                  onReset={reset}
                  multipleMode={multipleMode}
                  isProcessing={backgroundRemovalMutation.isPending}
                  progress={progress}
                  error={backgroundRemovalMutation.error?.message}
                  credits={credits}
                />
              </div>
            )}

            {processedImages.length > 0 && (
              <div className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
                <ProcessedResults processedImages={processedImages} multipleMode={multipleMode} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
