import { Hono } from 'hono';

import {
  generateRequestId,
  getInternalModelName,
  logBgRemoverUsage,
  updateLogStatus,
} from '@/lib/credit-utils';
import {
  extractImagesFromFormData,
  extractImagesFromJson,
  JsonPayload,
  validateImageInput,
} from '@/lib/image-utils';
import { processMultipleImagesWithReplicate } from '@/lib/replicate-utils';
import { uploadMultipleImagesToS3 } from '@/lib/s3-utils';
import { HonoContext } from '@/types/hono';

import { deductCredits, requireAuth, requireCredits } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

app.post('/', async (c) => {
  const requestId = generateRequestId();
  const startTime = performance.now();

  try {
    const user = c.get('user')!; // User is guaranteed to exist due to middleware

    const contentType = c.req.header('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    const isJson = contentType.includes('application/json');

    let images;

    if (isFormData) {
      const formData = await c.req.formData();
      images = await extractImagesFromFormData(formData);
    } else if (isJson) {
      const jsonData: JsonPayload = await c.req.json();
      images = extractImagesFromJson(jsonData);
    } else {
      return c.json(
        {
          error: 'Unsupported content type. Use multipart/form-data or application/json',
        },
        400
      );
    }

    validateImageInput(images);

    const imageCount = images.length;
    const creditsNeeded = imageCount; // 1 credit per image

    // Apply credit requirement middleware dynamically
    const creditMiddleware = requireCredits(creditsNeeded);
    await creditMiddleware(c, async () => {});

    // Get user data that was set by the credit middleware
    const userData = c.get('userData');
    if (!userData) {
      return c.json({ error: 'Failed to get user data' }, 500);
    }

    // Process images first to get URLs
    const uploadResults = await uploadMultipleImagesToS3(images);

    // Deduct credits atomically before processing
    const deductCreditMiddleware = deductCredits(creditsNeeded);
    await deductCreditMiddleware(c, async () => {});

    const creditsRemaining = c.get('creditsRemaining');
    const creditsUsed = c.get('creditsUsed');

    // Log each image processing attempt with original URLs
    const logIds: string[] = [];
    const internalModelName = getInternalModelName('bg-remover');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const uploadResult = uploadResults[i];
      try {
        const logId = await logBgRemoverUsage({
          userId: user.id,
          modelName: internalModelName,
          creditsUsed: 1,
          requestId: `${requestId}-${i}`,
          originalImageUrl: uploadResult.url,
          imageFormat: image.mimeType,
          imageSize: image.buffer.length,
        });
        logIds.push(logId);
      } catch (logError) {
        console.error('Failed to log image processing:', logError);
      }
    }

    // Process with Replicate
    const processedResults = await processMultipleImagesWithReplicate(uploadResults);

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // Update logs with success status
    for (let i = 0; i < logIds.length; i++) {
      const logId = logIds[i];
      const result = processedResults[i];

      if (logId && result) {
        try {
          await updateLogStatus(logId, 'success', {
            processingTime,
            processedImageUrl: result.processedUrl,
          });
        } catch (logError) {
          console.error('Failed to update log status:', logError);
        }
      }
    }

    return c.json({
      success: true,
      processingTime,
      count: processedResults.length,
      creditsRemaining,
      creditsUsed,
      results: processedResults.length === 1 ? processedResults[0] : processedResults,
    });
  } catch (error) {
    console.error('Background removal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error during background removal';

    // Update any existing logs with error status
    // Note: We don't have access to logIds here if the error occurred before logging
    // This could be improved with better error handling structure

    return c.json({ error: errorMessage }, 500);
  }
});

export { app as bgRemoverRoute };
