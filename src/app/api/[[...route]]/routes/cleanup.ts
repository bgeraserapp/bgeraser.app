import { DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Hono } from 'hono';

import { connectDB } from '@/db';
import { BgRemoverLog } from '@/db/models/bg-remover-log';
import { env } from '@/env';
import { createS3Client } from '@/lib/s3-client';
import { HonoContext } from '@/types/hono';

const app = new Hono<HonoContext>();

// Cleanup old images (>=24 hours)
app.get('/', async (c) => {
  const cronSecret = c.req.header('Authorization');
  if (cronSecret !== env.CRON_SECRET) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    // Calculate 24 hours ago
    await connectDB();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find logs older than 24 hours with images that haven't been deleted
    const oldLogs = await BgRemoverLog.find({
      createdAt: { $lte: twentyFourHoursAgo },
      status: { $ne: 'deleted' },
      $or: [
        { originalImageUrl: { $exists: true, $ne: null } },
        { processedImageUrl: { $exists: true, $ne: null } },
      ],
    });

    if (oldLogs.length === 0) {
      return c.json({
        message: 'No old images found to cleanup',
        count: 0,
      });
    }

    const s3Client = createS3Client();
    let deletedCount = 0;
    let notFoundCount = 0;
    const errors: string[] = [];

    // Process each log
    for (const log of oldLogs) {
      try {
        let hasDeletedSomething = false;
        const deleteResults = {
          originalDeleted: false,
          processedDeleted: false,
          originalNotFound: false,
          processedNotFound: false,
        };

        // Check and delete original image
        if (log.originalImageUrl) {
          // originalImageUrl now contains the S3 key directly
          const originalKey = log.originalImageUrl;
          const originalExists = await checkS3ObjectExists(s3Client, originalKey);
          if (originalExists) {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key: originalKey,
              })
            );
            deleteResults.originalDeleted = true;
            hasDeletedSomething = true;
          } else {
            deleteResults.originalNotFound = true;
          }
        }

        // Check and delete processed image
        if (log.processedImageUrl) {
          // processedImageUrl now contains the S3 key directly
          const processedKey = log.processedImageUrl;
          const processedExists = await checkS3ObjectExists(s3Client, processedKey);
          if (processedExists) {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key: processedKey,
              })
            );
            deleteResults.processedDeleted = true;
            hasDeletedSomething = true;
          } else {
            deleteResults.processedNotFound = true;
          }
        }

        // Update log status to deleted regardless of whether files existed
        await BgRemoverLog.findByIdAndUpdate(log._id, {
          status: 'deleted',
          originalImageUrl: null,
          processedImageUrl: null,
          updatedAt: new Date(),
        });

        if (hasDeletedSomething) {
          deletedCount++;
        } else {
          notFoundCount++;
        }

        console.log(`Processed log ${log._id}:`, deleteResults);
      } catch (error) {
        console.error(`Failed to cleanup log ${log._id}:`, error);
        errors.push(
          `Failed to cleanup log ${log._id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return c.json({
      message: `Cleanup completed. Files deleted: ${deletedCount}, Files not found: ${notFoundCount}`,
      totalFound: oldLogs.length,
      filesDeleted: deletedCount,
      filesNotFound: notFoundCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Cleanup operation failed:', error);
    return c.json(
      {
        error: 'Cleanup operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// Helper function to check if S3 object exists
async function checkS3ObjectExists(
  s3Client: ReturnType<typeof createS3Client>,
  key: string
): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === 'NotFound' ||
        (error as Error & { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode ===
          404)
    ) {
      return false;
    }
    // Re-throw other errors
    throw error;
  }
}

export { app as cleanupRoute };
