/**
 * Utility functions for handling image URLs
 */

/**
 * Formats an image URL to ensure it can be properly displayed
 * - Handles both server-uploaded images and external URLs
 * - Provides fallback for missing or broken images
 * 
 * @param url The original image URL
 * @param fallbackImage Optional fallback image path (defaults to '/totebag.png')
 * @returns Properly formatted image URL
 */
export const getImageUrl = (url: string | undefined, fallbackImage: string = '/totebag.png'): string => {
  if (!url) return fallbackImage;
  
  // If it's already an absolute URL (external), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a server upload path (starts with /uploads/), ensure it's properly formatted
  // These images are now available in the public directory
  if (url.startsWith('/uploads/')) {
    // Try to access the file directly from the public directory first
    const filename = url.split('/').pop();
    if (filename) {
      // Use the local copy in the public directory
      return `/uploads/${filename}`;
    }
    return url;
  }
  
  // If it's a relative path to a local asset, ensure it starts with /
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  
  return url;
};

/**
 * Creates an image URL with error handling
 * Use this in img tags with onError to handle fallbacks
 * 
 * @example
 * <img 
 *   src={getImageUrl(imageUrl)} 
 *   onError={(e) => handleImageError(e, '/fallback.png')}
 * />
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = '/totebag.png'
) => {
  const img = event.currentTarget;
  const originalSrc = img.src;
  
  // Log the error for debugging
  console.error(`Error loading image: ${originalSrc}`);
  
  // If the image is from the server uploads directory, try the public directory
  if (originalSrc.includes('/uploads/')) {
    const filename = originalSrc.split('/').pop();
    if (filename) {
      console.log(`Attempting to load from public directory: /uploads/${filename}`);
      img.onerror = null; // Prevent infinite loop
      img.src = `/uploads/${filename}`;
      return;
    }
  }
  
  // If we get here, use the fallback image
  img.onerror = null; // Prevent infinite loop
  img.src = fallbackSrc;
};
