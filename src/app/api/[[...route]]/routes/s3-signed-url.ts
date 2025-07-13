import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Hono } from 'hono';

import { env } from '@/env';
import { createS3Client } from '@/lib/s3-client';
import { HonoContext } from '@/types/hono';

const app = new Hono<HonoContext>();

app.post('/', async (c) => {
  try {
    const { key, expiresInSeconds = 3600 } = await c.req.json();

    if (!key) {
      return c.json({ error: 'S3 key is required' }, 400);
    }

    // Check if it's already a signed URL or HTTP URL
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return c.json({ url: key });
    }

    const s3Client = createS3Client();
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrlResult = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return c.json({ url: signedUrlResult });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return c.json(
      {
        error: 'Failed to generate signed URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export { app as s3SignedUrlRoute };
