'use server';

import { createPropertyQuery, createMediaQuery } from '@/lib/odata';

export async function fetchODataListings(formData) {
  const streetNumber = formData.get('streetNumber')?.trim();
  const streetName = formData.get('streetName')?.trim();

  if (!streetNumber || !streetName) throw new Error('Street number and street name are required');

  try {
    // Create and execute the OData query - use a single filter string to ensure proper syntax
    const query = createPropertyQuery();
    
    // Build a filter that is guaranteed to have correct syntax and types
    const filter = `StreetNumber eq '${streetNumber}' and contains(StreetName, '${streetName}') and ContractStatus eq 'Available'`;
    query.filter(filter); // Apply as a single filter instead of chaining multiple filter methods
    
    query.select([
      'UnparsedAddress',
      'ListPrice',
      'MlsStatus',
      'BedroomsTotal',
      'BathroomsTotalInteger',
      'LivingAreaRange',
      'TransactionType',
      'ParkingTotal',
      'DaysOnMarket',
      'ListingKey' // Make sure to include the ListingKey for media queries
    ])
    .orderBy('ListPrice', true) // true for descending order
    .withCount(); // Add $count=true to get total count in response

    console.log('OData filter:', query.buildUrl());
    
    const data = await query.execute();
    return data.value;
  } catch (error) {
    console.error('Error fetching OData listings:', error);
    throw error;
  }
}

export async function fetchMediaForListing(listingKey) {
  if (!listingKey) throw new Error('ListingKey is required');

  try {
    const query = createMediaQuery();
    
    // Build a single filter string with proper quoting
    const filter = `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'`;
    query.filter(filter)
         .select(['MediaURL', 'ImageSizeDescription']);
    
    const data = await query.execute({ cache: 'no-store' });
    return data.value;
  } catch (error) {
    console.error('Media fetch error:', error);
    throw error;
  }
}

export async function fetchSingleMediaForListing(listingKey) {
  if (!listingKey) throw new Error('ListingKey is required');

  try {
    const query = createMediaQuery();
    
    // Build a single filter string with proper quoting
    const filter = `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'`;
    query.filter(filter)
         .select(['MediaURL', 'ImageSizeDescription'])
         .limit(1);  // Using limit method to set $top=1
    
    const data = await query.execute({ cache: 'no-store' });
    
    // Make sure we actually have image data
    if (data.value && data.value.length > 0 && data.value[0].MediaURL) {
      return data.value[0];
    }
    return null;
  } catch (error) {
    console.error('Media fetch error:', error);
    throw error;
  }
}

// Fetch a single listing by ListingKey from TREB API
export async function getListingById(listingKey) {
  if (!listingKey) throw new Error('ListingKey is required');

  try {
    const query = createPropertyQuery();
    
    // Use single filter string with proper quoting
    query.filter(`ListingKey eq '${listingKey}'`)
         .select([
           'ListingKey',
           'UnparsedAddress',
           'ListPrice',
           'MlsStatus',
           'PublicRemarks',
           'PropertyType',
           'BedroomsTotal',
           'BathroomsTotalInteger',
         ]);

    console.log('Listing URL:', query.buildUrl());
    
    const data = await query.execute({
      cache: 'force-cache', 
      revalidate: 3600 // Cache for 1 hour
    });
    
    console.log('API Response:', data);

    // Check if the listing exists
    if (!data.value || data.value.length === 0) {
      console.log(`No listing found for ListingKey: ${listingKey}`);
      return null; // Return null if no listing matches the ID
    }

    // Return the first (and only) result
    return data.value[0];
  } catch (error) {
    console.error(`Error fetching listing details for ${listingKey}:`, error);
    throw error;
  }
}

// Fetch multiple listings by their ListingKeys
export async function fetchListingsByKeys(listingKeys = []) {
  if (!listingKeys || !Array.isArray(listingKeys) || listingKeys.length === 0) {
    return [];
  }

  try {
    const query = createPropertyQuery();
    
    // Create a filter with all listing keys using 'or' conditions
    const conditions = listingKeys.map(key => `ListingKey eq '${key}'`).join(' or ');
    const filter = `(${conditions})`;
    
    query.filter(filter)
         .select([
           'ListingKey',
           'UnparsedAddress',
           'ListPrice',
           'MlsStatus',
           'BedroomsTotal',
           'BathroomsTotalInteger',
           'LivingAreaRange',
           'TransactionType',
           'ParkingTotal',
           'PropertyType'
         ]);
    
    console.log('Fetching multiple listings by keys:', query.buildUrl());
    
    const data = await query.execute({
      cache: 'no-store' // Don't cache these results since we want fresh data
    });
    
    return data.value || [];
  } catch (error) {
    console.error('Error fetching listings by keys:', error);
    return [];
  }
}

export async function fetchUnavailableListings(formData) {
  const streetNumber = formData.get('streetNumber')?.trim();
  const streetName = formData.get('streetName')?.trim();
  const limit = formData.get('limit') ? parseInt(formData.get('limit'), 10) : null;
  const skipCount = formData.get('skip') ? parseInt(formData.get('skip'), 10) : 0;

  if (!streetNumber || !streetName) throw new Error('Street number and street name are required');

  console.log(`Searching for unavailable listings: Number=${streetNumber}, Name=${streetName}, Limit=${limit}, Skip=${skipCount}`);
  try {
    // Create and execute the OData query for unavailable listings
    const query = createPropertyQuery();
    
    // Get current date and date from 2 years ago
    const currentDate = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
    const twoYearsAgoStr = twoYearsAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Only include sold or leased listings from the past two years
    const filter = `StreetNumber eq '${streetNumber}' and contains(StreetName, '${streetName}') and (MlsStatus eq 'Sold' or MlsStatus eq 'Leased')`;
    query.filter(filter);
    
    query.select([
      'UnparsedAddress',
      'ListPrice',
      'MlsStatus',
      'BedroomsTotal',
      'BathroomsTotalInteger',
      'LivingAreaRange',
      'TransactionType',
      'ParkingTotal',
      'ListingKey',
      'CloseDate',        // Date when listing was sold/closed
      'ListingContractDate',     // Date when listing went under contract
      'ModificationTimestamp', // Use modification timestamp instead
      'OriginalListPrice' // Original listing price before any changes
    ])
    .orderBy('ModificationTimestamp', true); // Sort by modification timestamp, true = descending (newest first)
    
    // Always request count to know total available
    query.withCount();
    
    // Apply limit and skip if provided
    if (skipCount > 0) {
      query.offset(skipCount);
    }
    
    if (limit) {
      query.limit(limit);
    }
    
    console.log('OData unavailable listings filter:', query.buildUrl());
    
    const data = await query.execute({
      cache: 'force-cache',
      revalidate: 3600 // Cache for 1 hour (3600 seconds)
    });
    console.log('Unavailable listings data:', data);
    
    // Filter out listings with invalid dates (future dates)
    const now = new Date(); // Use a different variable name to avoid duplicate declaration
    const filteredListings = data.value.filter(listing => {
      // Parse the ModificationTimestamp
      const modDate = listing.ModificationTimestamp ? new Date(listing.ModificationTimestamp) : null;
      
      // If ModificationTimestamp is in the future, it's likely invalid
      if (modDate && modDate > now) {
        console.log(`Filtering out listing with future ModificationTimestamp: ${listing.ListingKey}`);
        return false;
      }
      
      return true;
    });
    
    // Return the original data structure but with filtered values
    return {
      "@odata.count": data["@odata.count"] || filteredListings.length,
      value: filteredListings
    };
  } catch (error) {
    console.error('Error fetching unavailable OData listings:', error);
    throw error;
  }
}