import { Hono } from 'hono';

import {
  extractImagesFromFormData,
  extractImagesFromJson,
  JsonPayload,
  validateImageInput,
} from '@/lib/image-utils';
import { processMultipleImagesWithReplicate } from '@/lib/replicate-utils';
import { uploadMultipleImagesToS3 } from '@/lib/s3-utils';

const app = new Hono();

app.post('/', async (c) => {
  try {
    const contentType = c.req.header('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    const isJson = contentType.includes('application/json');

    let images;
    const startTime = performance.now();

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

    const uploadResults = await uploadMultipleImagesToS3(images);
    const processedResults = await processMultipleImagesWithReplicate(uploadResults);

    const endTime = performance.now();
    const processingTime = endTime - startTime;
    const count = processedResults.length;

    return c.json({
      success: true,
      processingTime,
      count,
      results: processedResults.length === 1 ? processedResults[0] : processedResults,
    });
  } catch (error) {
    console.error('Background removal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error during background removal';
    return c.json({ error: errorMessage }, 500);
  }
});

export { app as bgRemoverRoute };
