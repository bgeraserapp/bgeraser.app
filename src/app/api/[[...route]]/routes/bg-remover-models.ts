import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Hono } from 'hono';

import { connectDB } from '@/db';
import { BgRemoverLog } from '@/db/models';
import { env } from '@/env';
import {
  generateRequestId,
  getInternalModelName,
  logBgRemoverUsage,
  updateLogStatus,
} from '@/lib/credit-utils';
import {
  extractImagesFromFormData,
  extractImagesFromJson,
  extractS3KeysFromJson,
  JsonPayload,
  validateImageInput,
  validateS3Keys,
} from '@/lib/image-utils';
import { processMultipleImagesWithReplicate } from '@/lib/replicate-utils';
import { createS3Client } from '@/lib/s3-client';
import { uploadMultipleImagesToS3 } from '@/lib/s3-utils';
import { HonoContext } from '@/types/hono';

import { deductCredits, requireAuth, requireCredits } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

// Background Remover Processing Endpoint
app.post('/', async (c) => {
  const requestId = generateRequestId();
  const startTime = performance.now();

  try {
    const user = c.get('user')!;
    await connectDB();

    const contentType = c.req.header('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    const isJson = contentType.includes('application/json');

    let images;
    let s3Keys: string[] | null = null;
    let imageCount: number;

    if (isJson) {
      const jsonData: JsonPayload = await c.req.json();

      // Primary flow: S3 keys (no need to download images, just validate keys)
      if (jsonData.s3Keys) {
        s3Keys = extractS3KeysFromJson(jsonData);
        validateS3Keys(s3Keys);
        imageCount = s3Keys.length;
        // Don't download images - we'll process directly from S3 keys
        images = null;
      } else {
        // Fallback: base64 images
        images = extractImagesFromJson(jsonData);
        validateImageInput(images);
        imageCount = images.length;
      }
    } else if (isFormData) {
      // Fallback: form data
      const formData = await c.req.formData();
      images = await extractImagesFromFormData(formData);
      validateImageInput(images);
      imageCount = images.length;
    } else {
      return c.json(
        {
          error: 'Unsupported content type. Use application/json with s3Keys',
        },
        400
      );
    }
    const creditsNeeded = imageCount;

    // Apply credit requirement middleware dynamically
    const creditMiddleware = requireCredits(creditsNeeded);
    try {
      await creditMiddleware(c, async () => {});
    } catch (error) {
      // If credit middleware fails, enhance the error response
      if (error instanceof Response && error.status === 402) {
        const errorData = await error.json();
        return c.json(
          {
            error: 'Insufficient credits to process request',
            code: 'INSUFFICIENT_CREDITS',
            creditsRequired: creditsNeeded,
            creditsAvailable: errorData.creditsAvailable || 0,
            message: `You need ${creditsNeeded} credit${creditsNeeded > 1 ? 's' : ''} but only have ${errorData.creditsAvailable || 0} available. Please purchase more credits to continue.`,
          },
          402
        );
      }
      throw error;
    }

    const userData = c.get('userData');
    if (!userData) {
      return c.json({ error: 'Failed to get user data' }, 500);
    }

    // Process to get URLs - either use existing S3 keys or upload new images
    let uploadResults;

    if (s3Keys) {
      // Generate presigned URLs for existing S3 keys
      const s3Client = createS3Client();

      uploadResults = await Promise.all(
        s3Keys.map(async (key, index) => {
          const getObjectCommand = new GetObjectCommand({
            Bucket: env.AWS_BUCKET_NAME,
            Key: key,
          });

          const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: 3600, // 1 hour
          });

          return {
            key,
            url: presignedUrl,
            imageId: key.split('/').pop()?.split('-')[0] || `img-${index}`,
          };
        })
      );
    } else {
      uploadResults = await uploadMultipleImagesToS3(images!);
    }

    // Deduct credits atomically before processing
    const deductCreditMiddleware = deductCredits(creditsNeeded);
    await deductCreditMiddleware(c, async () => {});

    const creditsRemaining = c.get('creditsRemaining');
    const creditsUsed = c.get('creditsUsed');

    // Log each image processing attempt with original URLs
    const logIds: string[] = [];
    const internalModelName = getInternalModelName('bg-remover');

    for (let i = 0; i < imageCount; i++) {
      const uploadResult = uploadResults[i];
      try {
        // For S3 keys, we don't have image data, so use defaults
        const imageFormat = s3Keys ? 'image/jpeg' : images![i].mimeType;
        const imageSize = s3Keys ? 0 : images![i].buffer.length;

        const logId = await logBgRemoverUsage({
          userId: user.id,
          modelName: internalModelName,
          creditsUsed: 1,
          requestId: `${requestId}-${i}`,
          originalImageUrl: uploadResult.key,
          imageFormat,
          imageSize,
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
            processedImageUrl: result.processedKey,
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

    return c.json({ error: errorMessage }, 500);
  }
});

// Get user's bg remover logs with pagination
app.get('/logs', async (c) => {
  try {
    const user = c.get('user')!;

    // Get query parameters
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status');
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query for pagination
    const query: Record<string, unknown> = { userId: user.id };
    if (status && ['success', 'error', 'processing', 'deleted'].includes(status)) {
      query.status = status;
    }

    // Build query for overall statistics
    const statsQuery: Record<string, unknown> = { userId: user.id };

    // Get logs with pagination and overall statistics
    const [logs, totalCount, allUserLogs] = await Promise.all([
      BgRemoverLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BgRemoverLog.countDocuments(query),
      BgRemoverLog.find(statsQuery).lean(),
    ]);

    // Calculate statistics from all user logs
    const totalCreditsUsed = allUserLogs.reduce((sum, item) => sum + item.creditsUsed, 0);
    const completedProcesses = allUserLogs.filter((item) => item.status === 'success');
    const averageProcessingTime =
      completedProcesses.length > 0
        ? completedProcesses
            .filter((item) => item.processingTime)
            .reduce((sum, item) => sum + (item.processingTime || 0), 0) / completedProcesses.length
        : 0;

    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        statistics: {
          totalCreditsUsed,
          totalProcesses: allUserLogs.length,
          completedProcesses: completedProcesses.length,
          errorProcesses: allUserLogs.filter((item) => item.status === 'error').length,
          processingProcesses: allUserLogs.filter((item) => item.status === 'processing').length,
          averageProcessingTime,
          successRate:
            allUserLogs.length > 0 ? (completedProcesses.length / allUserLogs.length) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching bg remover logs:', error);
    return c.json({ error: 'Failed to fetch logs' }, 500);
  }
});

// Get a specific log by ID
app.get('/logs/:id', async (c) => {
  try {
    const user = c.get('user')!;
    const logId = c.req.param('id');

    await connectDB();

    const log = await BgRemoverLog.findOne({
      _id: logId,
      userId: user.id,
    }).lean();

    if (!log) {
      return c.json({ error: 'Log not found' }, 404);
    }

    return c.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Error fetching bg remover log:', error);
    return c.json({ error: 'Failed to fetch log' }, 500);
  }
});

export { app as bgRemoverModelsRoute };
