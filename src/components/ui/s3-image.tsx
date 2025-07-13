'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { signedUrl } from '@/actions/s3-operation';

interface S3ImageProps {
  src: string; // S3 object key or full URL
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
  const containsHttp = src.startsWith('http://') || src.startsWith('https://');

  const {
    data: signedUrlData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['s3Image', src, expiresInSeconds],
    queryFn: async () => {
      return await signedUrl(src, expiresInSeconds);
    },
    enabled: !containsHttp && !!src, // Only fetch if src is not a direct HTTP URL and src exists
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    staleTime: (expiresInSeconds - 300) * 1000, // Consider stale 5 minutes before expiry
  });

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
