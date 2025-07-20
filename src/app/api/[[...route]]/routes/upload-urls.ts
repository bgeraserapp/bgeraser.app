import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/env';
import { createS3Client } from '@/lib/s3-client';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

// Generate presigned URLs for file uploads
app.post('/', async (c) => {
  try {
    const user = c.get('user')!;
    const { files } = await c.req.json();

    if (!Array.isArray(files) || files.length === 0) {
      return c.json({ error: 'Files array is required' }, 400);
    }

    if (files.length > 10) {
      return c.json({ error: 'Maximum 10 files allowed' }, 400);
    }

    const s3Client = createS3Client();
    const uploadUrls: Array<{
      uploadUrl: string;
      downloadUrl: string;
      key: string;
      fileId: string;
    }> = [];

    for (const file of files) {
      const { name, type, size } = file;

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(type)) {
        return c.json(
          { error: `Unsupported file type: ${type}. Allowed types: ${allowedTypes.join(', ')}` },
          400
        );
      }

      // Validate file size (10MB limit)
      if (size > 10 * 1024 * 1024) {
        return c.json({ error: `File ${name} exceeds 10MB limit` }, 400);
      }

      const fileId = uuidv4();
      const fileExtension = name.split('.').pop() || 'jpg';
      const key = `uploads/${user.id}/${fileId}-${Date.now()}.${fileExtension}`;

      // Generate presigned upload URL (expires in 10 minutes)
      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: type,
        ContentLength: size,
      });

      const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 600, // 10 minutes
      });

      // Generate presigned download URL (expires in 1 hour)
      const getObjectCommand = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
      });

      const downloadUrl = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 3600, // 1 hour
      });

      uploadUrls.push({
        uploadUrl,
        downloadUrl,
        key,
        fileId,
      });
    }

    return c.json({
      success: true,
      uploadUrls,
    });
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    return c.json({ error: 'Failed to generate upload URLs' }, 500);
  }
});

export { app as uploadUrlsRoute };
