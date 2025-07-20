export interface ImageData {
  buffer: Uint8Array;
  mimeType: string;
  extension: string;
  filename?: string;
}

export interface ProcessedImageResult {
  originalUrl: string;
  originalKey: string;
  processedUrl: string;
  processedKey: string;
  imageId: string;
}

export interface JsonImagePayload {
  image: string;
  filename?: string;
}

export interface JsonPayload {
  image?: string;
  images?: JsonImagePayload[];
  filename?: string;
  s3Keys?: string[];
}

export function base64ToBuffer(base64: string): Omit<ImageData, 'filename'> {
  const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  if (!mimeType.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const extension = mimeType.split('/')[1] || 'png';

  return {
    buffer: new Uint8Array(buffer),
    mimeType,
    extension,
  };
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || 'png';
}

export async function extractImagesFromFormData(formData: FormData): Promise<ImageData[]> {
  const images: ImageData[] = [];

  // Handle single image
  const singleFile = formData.get('image') as File;
  if (singleFile) {
    if (!singleFile.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const arrayBuffer = await singleFile.arrayBuffer();
    images.push({
      buffer: new Uint8Array(arrayBuffer),
      mimeType: singleFile.type,
      extension: getFileExtension(singleFile.name),
      filename: singleFile.name,
    });
  }

  // Handle multiple images
  const multipleFiles = formData.getAll('images') as File[];
  for (const file of multipleFiles) {
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} must be an image`);
    }

    const arrayBuffer = await file.arrayBuffer();
    images.push({
      buffer: new Uint8Array(arrayBuffer),
      mimeType: file.type,
      extension: getFileExtension(file.name),
      filename: file.name,
    });
  }

  return images;
}

export function extractImagesFromJson(jsonData: JsonPayload): ImageData[] {
  const images: ImageData[] = [];

  // Handle single image
  if (jsonData.image) {
    const result = base64ToBuffer(jsonData.image);
    images.push({
      ...result,
      filename: jsonData.filename,
    });
  }

  // Handle multiple images
  if (jsonData.images && Array.isArray(jsonData.images)) {
    for (const imageData of jsonData.images) {
      const result = base64ToBuffer(imageData.image);
      images.push({
        ...result,
        filename: imageData.filename,
      });
    }
  }

  return images;
}

export function extractS3KeysFromJson(jsonData: JsonPayload): string[] {
  if (!jsonData.s3Keys || !Array.isArray(jsonData.s3Keys)) {
    throw new Error('s3Keys array is required');
  }

  if (jsonData.s3Keys.length === 0) {
    throw new Error('At least one S3 key is required');
  }

  if (jsonData.s3Keys.length > 10) {
    throw new Error('Maximum 10 images allowed per request');
  }

  return jsonData.s3Keys;
}

export function validateImageInput(images: ImageData[]): void {
  if (images.length === 0) {
    throw new Error('No image data provided');
  }

  if (images.length > 10) {
    throw new Error('Maximum 10 images allowed per request');
  }
}

export function validateS3Keys(s3Keys: string[]): void {
  if (s3Keys.length === 0) {
    throw new Error('No S3 keys provided');
  }

  if (s3Keys.length > 10) {
    throw new Error('Maximum 10 images allowed per request');
  }
}
