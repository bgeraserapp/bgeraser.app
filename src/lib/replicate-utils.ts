import { ProcessedImageResult } from '@/lib/image-utils';
import replicateClient, { Models } from '@/lib/replicate';
import { S3UploadResult, uploadProcessedImageToS3 } from '@/lib/s3-utils';

export interface ReplicateProcessingResult {
  success: boolean;
  processedUrl: string;
  processedKey: string;
  imageId: string;
}

export async function processImageWithReplicate(
  imageUrl: string,
  imageId: string
): Promise<ReplicateProcessingResult> {
  try {
    const prediction = await replicateClient.run(Models.BACKGROUND_REMOVER, {
      input: {
        image: imageUrl,
      },
    });

    if (!prediction) {
      throw new Error('Failed to process image with Replicate');
    }

    const processedImageUrl = prediction as unknown as string;
    const processedUpload = await uploadProcessedImageToS3(processedImageUrl, imageId);

    return {
      success: true,
      processedUrl: processedUpload.url,
      processedKey: processedUpload.key,
      imageId,
    };
  } catch (error) {
    console.error('Replicate processing error:', error);
    throw new Error('Failed to process image');
  }
}

export async function processMultipleImagesWithReplicate(
  uploadResults: S3UploadResult[]
): Promise<ProcessedImageResult[]> {
  const processingPromises = uploadResults.map(async (uploadResult) => {
    const replicateResult = await processImageWithReplicate(uploadResult.url, uploadResult.imageId);

    return {
      originalUrl: uploadResult.url,
      originalKey: uploadResult.key,
      processedUrl: replicateResult.processedUrl,
      processedKey: replicateResult.processedKey,
      imageId: uploadResult.imageId,
    };
  });

  return Promise.all(processingPromises);
}

export async function processSingleImageWithReplicate(
  uploadResult: S3UploadResult
): Promise<ProcessedImageResult> {
  const replicateResult = await processImageWithReplicate(uploadResult.url, uploadResult.imageId);

  return {
    originalUrl: uploadResult.url,
    originalKey: uploadResult.key,
    processedUrl: replicateResult.processedUrl,
    processedKey: replicateResult.processedKey,
    imageId: uploadResult.imageId,
  };
}
