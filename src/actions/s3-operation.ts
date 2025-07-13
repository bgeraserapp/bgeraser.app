'use server';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { env } from '@/env';
import { createS3Client } from '@/lib/s3-client';

export async function signedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  try {
    // Check if it's already a signed URL or HTTP URL
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }

    const s3Client = createS3Client();
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}
