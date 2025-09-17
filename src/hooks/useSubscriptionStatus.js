'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { checkUserSubscription } from '@/actions/savedSearchActions';

// Global cache to store subscription statuses
const subscriptionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function useSubscriptionStatus(userId, buildingSlug) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const lastCheckRef = useRef(0);

  // Create cache key
  const cacheKey = userId && buildingSlug ? `${userId}-${buildingSlug}` : null;

  // Check if cached data is still valid
  const isCacheValid = useCallback((cachedData) => {
    if (!cachedData) return false;
    return Date.now() - cachedData.timestamp < CACHE_DURATION;
  }, []);

  // Get data from cache
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    const cached = subscriptionCache.get(cacheKey);
    return isCacheValid(cached) ? cached : null;
  }, [cacheKey, isCacheValid]);

  // Set data in cache
  const setCachedData = useCallback((data) => {
    if (!cacheKey) return;
    subscriptionCache.set(cacheKey, {
      ...data,
      timestamp: Date.now()
    });
  }, [cacheKey]);

  // Check subscription status
  const checkSubscription = useCallback(async (forceRefresh = false) => {
    if (!userId || !buildingSlug || !mountedRef.current) return;

    // Check if we have valid cached data and don't need to force refresh
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        setIsSubscribed(cached.isSubscribed);
        setError(null);
        return;
      }
    }

    // Prevent multiple simultaneous checks
    const now = Date.now();
    if (now - lastCheckRef.current < 1000) { // 1 second cooldown
      return;
    }
    lastCheckRef.current = now;

    setIsChecking(true);
    setError(null);

    try {
      const { isSubscribed: result, error: checkError } = await checkUserSubscription(userId, buildingSlug);
      
      if (mountedRef.current) {
        if (checkError) {
          setError(checkError);
        } else {
          setIsSubscribed(result);
          setCachedData({ isSubscribed: result });
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error('Error checking subscription status:', err);
        setError(err.message || 'Failed to check subscription status');
      }
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  }, [userId, buildingSlug, getCachedData, setCachedData]);

  // Debounced version of checkSubscription
  const debouncedCheckSubscription = useCallback(
    debounce(checkSubscription, 300),
    [checkSubscription]
  );

  // Effect to check subscription when dependencies change
  useEffect(() => {
    if (userId && buildingSlug) {
      // First try to get from cache
      const cached = getCachedData();
      if (cached) {
        setIsSubscribed(cached.isSubscribed);
        setError(null);
      } else {
        // If no cache, check with debouncing
        debouncedCheckSubscription();
      }
    } else {
      // Reset state if no user or building
      setIsSubscribed(false);
      setError(null);
    }
  }, [userId, buildingSlug, getCachedData, debouncedCheckSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manual refresh function
  const refreshSubscription = useCallback(() => {
    checkSubscription(true);
  }, [checkSubscription]);

  // Update subscription status (for when user subscribes/unsubscribes)
  const updateSubscriptionStatus = useCallback((newStatus) => {
    setIsSubscribed(newStatus);
    if (cacheKey) {
      setCachedData({ isSubscribed: newStatus });
    }
  }, [cacheKey, setCachedData]);

  return {
    isSubscribed,
    isChecking,
    error,
    refreshSubscription,
    updateSubscriptionStatus
  };
}

// Utility function to clear cache (useful for logout)
export function clearSubscriptionCache() {
  subscriptionCache.clear();
}

// Utility function to get cache size (for debugging)
export function getSubscriptionCacheSize() {
  return subscriptionCache.size;
}
