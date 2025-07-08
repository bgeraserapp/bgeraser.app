import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/env';
import replicateClient, { Models } from '@/lib/replicate';
import { createS3Client } from '@/lib/s3-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const s3Client = createS3Client();
    const imageId = uuidv4();
    const originalKey = `uploads/${imageId}-original.${file.name.split('.').pop()}`;
    const processedKey = `processed/${imageId}-processed.png`;

    const fileBuffer = await file.arrayBuffer();
    const uploadCommand = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: originalKey,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    const presignedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: originalKey,
      }),
      { expiresIn: 3600 }
    );

    const prediction = await replicateClient.run(Models.BACKGROUND_REMOVER, {
      input: {
        image: presignedUrl,
      },
    });

    if (!prediction) {
      return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }

    const processedImageUrl = prediction as unknown as string;
    const processedImageResponse = await fetch(processedImageUrl);

    if (!processedImageResponse.ok) {
      return NextResponse.json({ error: 'Failed to download processed image' }, { status: 500 });
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

    return NextResponse.json({
      success: true,
      originalUrl: presignedUrl,
      processedUrl: processedPresignedUrl,
      imageId,
    });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error during background removal' },
      { status: 500 }
    );
  }
}
