import { NextRequest, NextResponse } from 'next/server';

import {
  extractImagesFromFormData,
  extractImagesFromJson,
  JsonPayload,
  validateImageInput,
} from '@/lib/image-utils';
import { processMultipleImagesWithReplicate } from '@/lib/replicate-utils';
import { uploadMultipleImagesToS3 } from '@/lib/s3-utils';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    const isJson = contentType.includes('application/json');

    let images;

    if (isFormData) {
      const formData = await request.formData();
      images = await extractImagesFromFormData(formData);
    } else if (isJson) {
      const jsonData: JsonPayload = await request.json();
      images = extractImagesFromJson(jsonData);
    } else {
      return NextResponse.json(
        {
          error: 'Unsupported content type. Use multipart/form-data or application/json',
        },
        { status: 400 }
      );
    }

    validateImageInput(images);

    const uploadResults = await uploadMultipleImagesToS3(images);
    const processedResults = await processMultipleImagesWithReplicate(uploadResults);

    if (processedResults.length === 1) {
      return NextResponse.json({
        success: true,
        ...processedResults[0],
      });
    }

    return NextResponse.json({
      success: true,
      results: processedResults,
      count: processedResults.length,
    });
  } catch (error) {
    console.error('Background removal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error during background removal';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
