// Next.js optimized image handling for Vercel deployment

// Configuration for different environments
const isVercel = process.env.VERCEL === '1';
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache configuration
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Generate optimized image URL for Next.js Image component
export function getOptimizedImageUrl(originalUrl, listingKey) {
  if (!originalUrl) return null;
  
  // For development, use original URL with Next.js optimization
  if (isDevelopment) {
    return originalUrl;
  }
  
  // For production, we'll use Next.js Image component with proper optimization
  // The Image component will handle caching and optimization automatically
  return originalUrl;
}

// Process media for a listing with Next.js optimization
export async function processListingMedia(listing, mediaDataArray) {
  if (!mediaDataArray || mediaDataArray.length === 0) {
    return {
      ...listing,
      media: null,
      Media: []
    };
  }
  
  // Process all media items
  const processedMedia = mediaDataArray.map((media, index) => ({
    MediaURL: media.MediaURL,
    MediaDescription: media.MediaDescription || `Property image ${index + 1}`,
    Order: media.Order || index,
    MediaKey: media.MediaKey,
    MediaType: media.MediaType || 'Photo'
  }));
  
  return {
    ...listing,
    media: {
      url: processedMedia[0]?.MediaURL, // First image for backward compatibility
      description: processedMedia[0]?.MediaDescription || 'Property image',
      listingKey: listing.ListingKey,
      optimized: true
    },
    Media: processedMedia // All images array
  };
}

// Batch process multiple listings
export async function processListingsWithMedia(listings) {
  const processedListings = [];
  
  for (const listing of listings) {
    // Fetch media for this listing
    const mediaData = await fetchMediaForListing(listing.ListingKey);
    const processedListing = await processListingMedia(listing, mediaData);
    processedListings.push(processedListing);
  }
  
  return processedListings;
}

// Import the media fetching function
async function fetchMediaForListing(listingKey) {
  // Fetch all images for the listing, not just the first one
  const mediaFilter = `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Medium'`;
  const mediaUrl = `https://query.ampre.ca/odata/Media?$filter=${encodeURIComponent(mediaFilter)}&$orderby=Order`;

  try {
    const response = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${process.env.AMPRE_TOKEN}` },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error(`Error fetching media for listing ${listingKey}:`, error);
    return [];
  }
}

// Utility function to get image info (for debugging)
export function getImageInfo() {
  return {
    environment: isVercel ? 'Vercel' : 'Local',
    optimization: 'Next.js Image Component',
    caching: 'Vercel Edge Network',
    storage: 'No local storage required'
  };
} 