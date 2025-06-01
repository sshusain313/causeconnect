/**
 * Utility functions for handling image URLs
 */
import config from '@/config';

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
  
  // Log the original URL for debugging
  console.log('Processing image URL:', url);
  
  // If it's already an absolute URL (external), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Special case: if it's from our domain but has the full URL, extract just the path
    if (url.includes('changebag.org/uploads/') || url.includes('localhost:5000/uploads/')) {
      // Handle server-side URLs
      if (url.startsWith('/uploads/')) {
        // Get the base domain without /api
        // For image uploads, we need to use the main domain, not the API subdomain
        const baseDomain = config.isProduction ? 'https://changebag.org' : config.apiUrl.split('/api')[0];
        return `${baseDomain}${url}`;
      } else {
        return url;
      }
    }
    return url;
  }
  
  // If it's a server upload path (starts with /uploads/), ensure it's properly formatted
  if (url.startsWith('/uploads/')) {
    console.log('Server upload path detected');
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
