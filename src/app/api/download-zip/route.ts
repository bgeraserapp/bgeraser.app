import JSZip from 'jszip';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
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
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bg-removed-images.zip"',
      },
    });
  } catch (error) {
    console.error('Error creating zip:', error);
    return NextResponse.json({ error: 'Failed to create zip file' }, { status: 500 });
  }
}
