import { Hono } from 'hono';
import JSZip from 'jszip';

import { HonoContext } from '@/types/hono';

const app = new Hono<HonoContext>();

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return c.json({ error: 'No URLs provided' }, 400);
    }

    const zip = new JSZip();

    // Download each image and add to zip
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch image ${i + 1}: ${response.statusText}`);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const filename = `bg-removed-${i + 1}.png`;

        zip.file(filename, arrayBuffer);
      } catch (error) {
        console.error(`Error downloading image ${i + 1}:`, error);
        continue;
      }
    }

    // Generate zip file
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

    // Return zip file as response
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bg-removed-images.zip"',
      },
    });
  } catch (error) {
    console.error('Error creating zip:', error);
    return c.json({ error: 'Failed to create zip file' }, 500);
  }
});

export { app as downloadZipRoute };
