// Simple in-memory cache for listing data
const cache = new Map();

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function getCachedData(key) {
  const cached = cache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache has expired
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export function clearCache() {
  cache.clear();
}

export function getCacheStats() {
  const now = Date.now();
  const stats = {
    totalEntries: cache.size,
    expiredEntries: 0,
    validEntries: 0
  };
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      stats.expiredEntries++;
    } else {
      stats.validEntries++;
    }
  }
  
  return stats;
} 