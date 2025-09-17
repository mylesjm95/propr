'use server';

import { getActiveListings, getRecentlySoldListings, fetchFromAmpre } from '@/lib/apiUtils';
import { getCachedData, setCachedData } from '@/lib/cache';
import prisma from '@/lib/prisma';

// Fetch condo units for a specific building
export async function getCondoUnits(slug) {
  const active = await getActiveListings(slug);
  const sold = await getRecentlySoldListings(slug, 90); // Last 90 days, adjustable

  return {
    availableUnits: active,
    recentlySold: sold,
  };
}

// Fetch a single listing by ListingKey with caching
export async function getListingByKey(listingKey) {
  try {
    if (!listingKey) {
      throw new Error('ListingKey is required');
    }

    // Check cache first
    const cacheKey = `listing_${listingKey}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for listing: ${listingKey}`);
      return cachedData;
    }

    console.log(`Cache miss for listing: ${listingKey}, fetching from API`);
    
    // Use fetchFromAmpre directly with ListingKey filter
    const filter = `ListingKey eq '${listingKey}'`;
    const listings = await fetchFromAmpre(filter);
    
    if (!listings || listings.length === 0) {
      throw new Error('Listing not found');
    }

    const listingData = listings[0];
    
    // Process the listing with media data
    const { processListingsWithMedia } = await import('@/lib/imageUtils.js');
    const processedListings = await processListingsWithMedia([listingData]);
    const processedListing = processedListings[0] || listingData;
    
    // Cache the result
    setCachedData(cacheKey, processedListing);
    
    return processedListing;
  } catch (error) {
    console.error('Error fetching listing by key:', error);
    throw error;
  }
}

// Fetch building data by slug
export async function getBuildingBySlug(slug) {
  try {
    const building = await prisma.building.findUnique({
      where: { slug },
      include: {
        buildingAgents: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true, isActive: true }
            }
          }
        }
      }
    });

    return building;
  } catch (error) {
    console.error('Error fetching building:', error);
    return null;
  }
}

// Fetch listings by street number and street name (for AvailableListings component)
export async function fetchODataListings(formData) {
  const streetNumber = formData.get('streetNumber')?.trim();
  const streetName = formData.get('streetName')?.trim();
  
  if (!streetNumber || !streetName) {
    throw new Error('Street number and street name are required');
  }

  try {
    // Create filter for active condo listings
    const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and StandardStatus eq 'Active'`;
    
    // Fetch listings with media
    const { fetchListingsWithMedia } = await import('@/lib/apiUtils');
    const listings = await fetchListingsWithMedia(filter);
    
    // Map the data to match what ListingCard expects
    return listings.map(listing => ({
      listing_key: listing.ListingKey,
      list_price: listing.ListPrice,
      unparsed_address: listing.UnparsedAddress,
      bedrooms_total: listing.BedroomsTotal,
      bathrooms_total: listing.BathroomsTotal,
      living_area: listing.LivingArea,
      parking_total: listing.ParkingTotal,
      mls_status: listing.StandardStatus,
      transaction_type: listing.TransactionType,
      days_on_market: listing.DaysOnMarket,
      ListDate: listing.ListDate,
      ListingKey: listing.ListingKey,
      UnparsedAddress: listing.UnparsedAddress,
      ListPrice: listing.ListPrice,
      BedroomsTotal: listing.BedroomsTotal,
      BathroomsTotal: listing.BathroomsTotal,
      LivingArea: listing.LivingArea,
      ParkingTotal: listing.ParkingTotal,
      StandardStatus: listing.StandardStatus,
      TransactionType: listing.TransactionType,
      DaysOnMarket: listing.DaysOnMarket,
      featuredImage: listing.featuredImage
    }));
  } catch (error) {
    console.error('Error fetching OData listings:', error);
    throw error;
  }
}

// Fetch single media for a listing
export async function fetchSingleMediaForListing(listingKey) {
  if (!listingKey) return null;
  
  try {
    const { getListingMedia } = await import('@/lib/apiUtils');
    const media = await getListingMedia(listingKey);
    
    return media ? {
      MediaURL: media.url,
      MediaDescription: media.description
    } : null;
  } catch (error) {
    console.error('Error fetching single media for listing:', error);
    return null;
  }
}

// Fetch media for a specific listing (multiple images)
export async function fetchMediaForListing(listingKey) {
  if (!listingKey) return [];
  
  try {
    // This would fetch all media for a listing, not just the first one
    // For now, we'll just return the single media
    const singleMedia = await fetchSingleMediaForListing(listingKey);
    return singleMedia ? [singleMedia] : [];
  } catch (error) {
    console.error('Error fetching media for listing:', error);
    return [];
  }
}

// Fetch a single listing by ID (for individual listing pages)
export async function getListingById(listingKey) {
  try {
    if (!listingKey) {
      throw new Error('ListingKey is required');
    }

    // Use the existing getListingByKey function
    const listing = await getListingByKey(listingKey);
    
    // Map the data to match what the listing page expects
    return {
      ...listing,
      listing_key: listing.ListingKey,
      list_price: listing.ListPrice,
      unparsed_address: listing.UnparsedAddress,
      bedrooms_total: listing.BedroomsTotal,
      bathrooms_total: listing.BathroomsTotal,
      living_area: listing.LivingArea,
      parking_total: listing.ParkingTotal,
      mls_status: listing.StandardStatus,
      transaction_type: listing.TransactionType,
      days_on_market: listing.DaysOnMarket,
      ListDate: listing.ListDate,
      ListingKey: listing.ListingKey,
      UnparsedAddress: listing.UnparsedAddress,
      ListPrice: listing.ListPrice,
      BedroomsTotal: listing.BedroomsTotal,
      BathroomsTotal: listing.BathroomsTotal,
      LivingArea: listing.LivingArea,
      ParkingTotal: listing.ParkingTotal,
      StandardStatus: listing.StandardStatus,
      TransactionType: listing.TransactionType,
      DaysOnMarket: listing.DaysOnMarket,
      featuredImage: listing.featuredImage
    };
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    throw error;
  }
}

// Fetch multiple listings by their keys
export async function fetchListingsByKeys(listingKeys = []) {
  if (!listingKeys || !Array.isArray(listingKeys) || listingKeys.length === 0) {
    return [];
  }
  
  try {
    const listings = await Promise.all(
      listingKeys.map(key => getListingById(key))
    );
    
    return listings.filter(listing => listing !== null);
  } catch (error) {
    console.error('Error fetching listings by keys:', error);
    return [];
  }
}