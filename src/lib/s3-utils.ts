import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/env';
import { ImageData } from '@/lib/image-utils';
import { createS3Client } from '@/lib/s3-client';

export interface S3UploadResult {
  key: string;
  url: string;
  imageId: string;
}

export async function uploadImageToS3(
  imageData: ImageData,
  folder: 'uploads' | 'processed' = 'uploads'
): Promise<S3UploadResult> {
  const s3Client = createS3Client();
  const imageId = uuidv4();
  const key = `${folder}/${imageId}-${folder === 'uploads' ? 'original' : 'processed'}.${imageData.extension}`;

  const uploadCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    Body: imageData.buffer,
    ContentType: imageData.mimeType,
  });

  await s3Client.send(uploadCommand);

  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );

  return {
    key,
    url: presignedUrl,
    imageId,
  };
}

export async function uploadMultipleImagesToS3(
  images: ImageData[],
  folder: 'uploads' | 'processed' = 'uploads'
): Promise<S3UploadResult[]> {
  const uploadPromises = images.map((image) => uploadImageToS3(image, folder));
  return Promise.all(uploadPromises);
}

export async function uploadProcessedImageToS3(
  processedImageUrl: string,
  imageId: string
): Promise<S3UploadResult> {
  const s3Client = createS3Client();
  const processedKey = `processed/${imageId}-processed.png`;

  const processedImageResponse = await fetch(processedImageUrl);
  if (!processedImageResponse.ok) {
    throw new Error('Failed to download processed image');
  }

  const processedImageBuffer = await processedImageResponse.arrayBuffer();
  const processedUploadCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: processedKey,
    Body: new Uint8Array(processedImageBuffer),
    ContentType: 'image/png',
  });

  await s3Client.send(processedUploadCommand);

  const processedPresignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: processedKey,
    }),
    { expiresIn: 3600 }
  );

  return {
    key: processedKey,
    url: processedPresignedUrl,
    imageId,
  };
}

export async function downloadImageFromS3(s3Key: string): Promise<ImageData> {
  const s3Client = createS3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: s3Key,
  });

  const response = await s3Client.send(getObjectCommand);

  if (!response.Body) {
    throw new Error(`Failed to download image from S3: ${s3Key}`);
  }

  const buffer = await response.Body.transformToByteArray();
  const contentType = response.ContentType || 'image/jpeg';

  if (!contentType.startsWith('image/')) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  const extension = contentType.split('/')[1] || 'jpg';
  const filename = s3Key.split('/').pop() || `image.${extension}`;

  return {
    buffer,
    mimeType: contentType,
    extension,
    filename,
  };
}

export async function downloadMultipleImagesFromS3(s3Keys: string[]): Promise<ImageData[]> {
  const downloadPromises = s3Keys.map((key) => downloadImageFromS3(key));
  return Promise.all(downloadPromises);
}
