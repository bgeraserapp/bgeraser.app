'use server';

import { revalidatePath } from 'next/cache';

import {
  extractImagesFromFormData,
  ProcessedImageResult,
  validateImageInput,
} from '@/lib/image-utils';
import {
  processMultipleImagesWithReplicate,
  processSingleImageWithReplicate,
} from '@/lib/replicate-utils';
import { uploadMultipleImagesToS3 } from '@/lib/s3-utils';

export interface BackgroundRemovalResult {
  success: boolean;
  processingTime: number;
  count: number;
  results: ProcessedImageResult | ProcessedImageResult[];
  error?: string;
}

export async function removeBackgroundAction(formData: FormData): Promise<BackgroundRemovalResult> {
  try {
    const startTime = performance.now();

    // Extract images from form data
    const images = await extractImagesFromFormData(formData);

    // Validate input
    validateImageInput(images);

    // Upload images to S3
    const uploadResults = await uploadMultipleImagesToS3(images);

    // Process images with Replicate
    let processedResults: ProcessedImageResult[];

    if (uploadResults.length === 1) {
      // Single image processing
      const singleResult = await processSingleImageWithReplicate(uploadResults[0]);
      processedResults = [singleResult];
    } else {
      // Multiple images processing
      processedResults = await processMultipleImagesWithReplicate(uploadResults);
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // Revalidate the console page to reflect any changes
    revalidatePath('/console');

    return {
      success: true,
      processingTime,
      count: processedResults.length,
      results: processedResults.length === 1 ? processedResults[0] : processedResults,
    };
  } catch (error) {
    console.error('Background removal server action error:', error);

    return {
      success: false,
      processingTime: 0,
      count: 0,
      results: [],
      error:
        error instanceof Error ? error.message : 'Internal server error during background removal',
    };
  }
}

export async function removeBackgroundSingleAction(
  formData: FormData
): Promise<BackgroundRemovalResult> {
  try {
    const startTime = performance.now();

    // Extract single image from form data
    const images = await extractImagesFromFormData(formData);

    if (images.length === 0) {
      throw new Error('No image provided');
    }

    if (images.length > 1) {
      throw new Error('Only one image allowed for single processing');
    }

    // Upload single image to S3
    const uploadResults = await uploadMultipleImagesToS3([images[0]]);

    // Process single image with Replicate
    const processedResult = await processSingleImageWithReplicate(uploadResults[0]);

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // Revalidate the console page to reflect any changes
    revalidatePath('/console');

    return {
      success: true,
      processingTime,
      count: 1,
      results: processedResult,
    };
  } catch (error) {
    console.error('Background removal single action error:', error);

    return {
      success: false,
      processingTime: 0,
      count: 0,
      results: [],
      error:
        error instanceof Error ? error.message : 'Internal server error during background removal',
    };
  }
}
