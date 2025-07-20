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
  s3Key?: string;
  uploadUrl?: string;
  downloadUrl?: string;
  uploading?: boolean;
  uploadError?: string;
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

async function getUploadUrls(files: File[]): Promise<{
  uploadUrls: Array<{
    uploadUrl: string;
    downloadUrl: string;
    key: string;
    fileId: string;
  }>;
}> {
  const response = await fetch('/api/upload-urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get upload URLs');
  }

  return response.json();
}

async function uploadFileToS3(file: File, uploadUrl: string): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
}

async function removeBackgroundAPI(s3Keys: string[]): Promise<BackgroundRemovalResponse> {
  const response = await fetch('/api/models/bg-remover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      s3Keys,
    }),
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

  const uploadUrlMutation = useMutation({
    mutationFn: (files: File[]) => getUploadUrls(files),
    onError: (error: Error) => {
      console.error('Upload URL generation error:', error);
      setProgress(0);
    },
  });

  const fileUploadMutation = useMutation({
    mutationFn: async ({ file, uploadUrl }: { file: File; uploadUrl: string }) => {
      await uploadFileToS3(file, uploadUrl);
    },
    onError: (error: Error) => {
      console.error('File upload error:', error);
      setProgress(0);
    },
  });

  const backgroundRemovalMutation = useMutation({
    mutationFn: (s3Keys: string[]) => removeBackgroundAPI(s3Keys),
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

    try {
      // Step 1: Get upload URLs using mutation
      setProgress(10);
      const { uploadUrls } = await uploadUrlMutation.mutateAsync(files.map((f) => f.file));

      // Step 2: Update files with upload URLs and mark as uploading
      setFiles((prev) =>
        prev.map((file, index) => ({
          ...file,
          uploadUrl: uploadUrls[index]?.uploadUrl,
          downloadUrl: uploadUrls[index]?.downloadUrl,
          s3Key: uploadUrls[index]?.key,
          uploading: true,
          uploadError: undefined,
        }))
      );

      setProgress(20);

      // Step 3: Upload files to S3 in parallel using mutations
      const uploadPromises = files.map(async (file, index) => {
        const uploadUrl = uploadUrls[index]?.uploadUrl;
        if (!uploadUrl) throw new Error(`No upload URL for file ${index}`);

        try {
          await fileUploadMutation.mutateAsync({ file: file.file, uploadUrl });
          // Update file as uploaded
          setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, uploading: false } : f)));
          return uploadUrls[index].key;
        } catch (error) {
          // Update file with error
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? {
                    ...f,
                    uploading: false,
                    uploadError: error instanceof Error ? error.message : 'Upload failed',
                  }
                : f
            )
          );
          throw error;
        }
      });

      const s3Keys = await Promise.all(uploadPromises);
      setProgress(50);

      // Step 4: Process images using S3 keys
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      backgroundRemovalMutation.mutate(s3Keys, {
        onSettled: () => {
          clearInterval(progressInterval);
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      setProgress(0);
      // Handle upload errors here if needed
    }
  }, [files, backgroundRemovalMutation, uploadUrlMutation, fileUploadMutation, credits]);

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
                  isUploadingUrls={uploadUrlMutation.isPending}
                  isUploadingFiles={fileUploadMutation.isPending}
                  progress={progress}
                  error={
                    backgroundRemovalMutation.error?.message ||
                    uploadUrlMutation.error?.message ||
                    fileUploadMutation.error?.message
                  }
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
