'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface S3ImageProps {
  src: string | null; // S3 object key, full URL, or null
  expiresInSeconds?: number; // Optional expiration time for the signed URL
  alt: string; // Alt text for the image
  width?: number; // Width of the image
  height?: number; // Height of the image
  fill?: boolean; // Optional fill mode for the image
  className?: string; // Optional className for styling
  priority?: boolean; // Optional priority loading
}

const S3Image = ({
  src,
  expiresInSeconds = 3600, // Default to 1 hour if not provided
  alt,
  width,
  height,
  fill = false, // Default to false if not provided
  className,
  priority = false,
}: S3ImageProps) => {
  // Check if the src is already a full HTTP URL
  const containsHttp = src ? src.startsWith('http://') || src.startsWith('https://') : false;

  const {
    data: signedUrlData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['s3Image', src, expiresInSeconds],
    queryFn: async () => {
      const response = await fetch('/api/s3/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: src,
          expiresInSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const data = await response.json();
      return data.url;
    },
    enabled: !containsHttp && !!src, // Only fetch if src is not a direct HTTP URL and src exists
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    staleTime: (expiresInSeconds - 300) * 1000, // Consider stale 5 minutes before expiry
  });

  // If src is null or empty, show dummy image
  if (!src || src.trim() === '') {
    return (
      <div
        className={`flex items-center justify-center bg-gray-900 dark:bg-gray-800 ${className || ''}`}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // If it's already a full URL, use it directly
  if (containsHttp) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        className={className}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className || ''}`}
      >
        <span className="text-sm">Error loading image</span>
      </div>
    );
  }

  // No data state
  if (!signedUrlData) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className || ''}`}
      >
        <span className="text-sm">No image found</span>
      </div>
    );
  }

  return (
    <Image
      src={signedUrlData}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      className={className}
    />
  );
};

export default S3Image;
