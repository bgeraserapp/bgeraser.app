'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { CreditDisplay } from '@/components/ui/credit-display';
import { CreditErrorAlert } from '@/components/ui/credit-error-alert';
import { LowCreditWarning } from '@/components/ui/low-credit-warning';
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
    <div className="min-h-screen w-full bg-gradient-page dark:bg-gradient-page-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-in fade-in-0 duration-1000">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              AI Background Remover
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Remove backgrounds from your images instantly with AI-powered precision. Perfect for
              e-commerce, social media, and professional photography.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>High-Quality AI Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>All Image Formats Supported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Instant Results</span>
              </div>
            </div>

            {/* Credit Display */}
            <div className="flex justify-center">
              <CreditDisplay credits={credits} isLoading={!user} />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center animate-in fade-in-0 duration-1000 delay-200">
            <ModeToggle multipleMode={multipleMode} onToggleMode={toggleMode} />
          </div>

          {/* Low Credit Warning */}
          {user && credits < 5 && !showCreditError && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <LowCreditWarning credits={credits} />
            </div>
          )}

          {/* Credit Error Alert */}
          {showCreditError && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <CreditErrorAlert
                creditsNeeded={files.length}
                creditsAvailable={credits}
                onBuyCredits={handleBuyCredits}
              />
            </div>
          )}

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
                  credits={credits}
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
