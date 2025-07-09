# Background Remover API Usage Guide

## Overview

The Background Remover API now supports both single and multiple image processing using modular utility functions.

## Endpoints

- `POST /api/models/bg-remover` - Process single or multiple images

## Input Formats

### 1. FormData (Single Image)

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/api/models/bg-remover', {
  method: 'POST',
  body: formData,
});
```

### 2. FormData (Multiple Images)

```javascript
const formData = new FormData();
for (let i = 0; i < fileInput.files.length; i++) {
  formData.append('images', fileInput.files[i]);
}

fetch('/api/models/bg-remover', {
  method: 'POST',
  body: formData,
});
```

### 3. JSON (Single Image)

```javascript
const payload = {
  image:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77mwAAAABJRU5ErkJggg==',
  filename: 'image.png', // optional
};

fetch('/api/models/bg-remover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### 4. JSON (Multiple Images)

```javascript
const payload = {
  images: [
    {
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77mwAAAABJRU5ErkJggg==',
      filename: 'image1.png',
    },
    {
      image:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AAA==',
      filename: 'image2.jpg',
    },
  ],
};

fetch('/api/models/bg-remover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

## Response Formats

### Single Image Response

```json
{
  "success": true,
  "originalUrl": "https://s3.amazonaws.com/bucket/uploads/uuid-original.png",
  "processedUrl": "https://s3.amazonaws.com/bucket/processed/uuid-processed.png",
  "imageId": "uuid"
}
```

### Multiple Images Response

```json
{
  "success": true,
  "results": [
    {
      "originalUrl": "https://s3.amazonaws.com/bucket/uploads/uuid1-original.png",
      "processedUrl": "https://s3.amazonaws.com/bucket/processed/uuid1-processed.png",
      "imageId": "uuid1"
    },
    {
      "originalUrl": "https://s3.amazonaws.com/bucket/uploads/uuid2-original.jpg",
      "processedUrl": "https://s3.amazonaws.com/bucket/processed/uuid2-processed.png",
      "imageId": "uuid2"
    }
  ],
  "count": 2
}
```

## Error Responses

```json
{
  "error": "Error message here"
}
```

## Limitations

- Maximum 10 images per request
- Supported image formats: PNG, JPEG, GIF, WebP
- Maximum file size: Based on your server configuration
- Base64 images must include proper MIME type: `data:image/png;base64,<data>`

## Modular Architecture

The API uses the following modular utility functions:

- `src/lib/image-utils.ts` - Image processing and validation utilities
- `src/lib/s3-utils.ts` - S3 upload and download utilities
- `src/lib/replicate-utils.ts` - Replicate AI processing utilities
- `src/app/api/models/bg-remover/route.ts` - Main API route handler
