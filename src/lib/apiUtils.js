const suffixes = ['rd', 'st', 'ave', 'blvd', 'dr', 'ln', 'cir', 'ct', 'pl', 'ter', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'circle', 'court', 'place', 'terrace']; // Common suffixes (lower case)

export async function fetchFromAmpre(filter, orderby = 'ModificationTimestamp desc', top = 50) {
  // Check if AMPRE_TOKEN is available
  if (!process.env.AMPRE_TOKEN) {
    console.warn('AMPRE_TOKEN not found in environment variables');
    return [];
  }

  const url = `https://query.ampre.ca/odata/Property?$filter=${encodeURIComponent(filter)}&$orderby=${orderby}&$top=${top}`;

  // console.log('Full AMPRE URL:', url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AMPRE_TOKEN}` },
    });
    const responseText = await response.text();
    // console.log('AMPRE Response Status:', response.status);
    // console.log('AMPRE Raw Response:', responseText);

    if (!response.ok) {
      throw new Error(`AMPRE API error: ${response.status} - ${responseText}`);
    }
    const data = JSON.parse(responseText);
    return data.value || [];
  } catch (error) {
    console.error('Error fetching from AMPRE:', error);
    return [];
  }
}

async function fetchMediaForListing(listingKey) {
  const mediaFilter = `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large' and Order eq 0`;
  const mediaUrl = `https://query.ampre.ca/odata/Media?$filter=${encodeURIComponent(mediaFilter)}`;

  console.log('Media URL:', mediaUrl);
  console.log('Listing Key:', listingKey);

  try {
    const response = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${process.env.AMPRE_TOKEN}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Media API error: ${response.status}`);
      console.error('Error response:', errorText);
      console.error('Request URL:', mediaUrl);
      console.error('Request filter:', mediaFilter);
      return null;
    }

    const data = await response.json();
    const media = data.value && data.value.length > 0 ? data.value[0] : null;
    
    if (media) {
      console.log(`Found media for listing ${listingKey}:`, media.MediaURL);
    } else {
      console.log(`No media found for listing ${listingKey}`);
    }
    
    return media;
  } catch (error) {
    console.error(`Error fetching media for listing ${listingKey}:`, error);
    return null;
  }
}



export async function fetchListingsWithMedia(filter, orderby = 'ModificationTimestamp desc', top = 50) {
  const listings = await fetchFromAmpre(filter, orderby, top);
  
  // Import the image processing function
  const { processListingsWithMedia } = await import('./imageUtils.js');
  
  // Process listings with media using the new caching system
  return await processListingsWithMedia(listings);
}

export async function getActiveListings(slug) {
  const parts = slug.split('-');
  const streetNumber = parts[0];
  let streetNameParts = parts.slice(1);
  const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
  if (suffixes.includes(lastPart)) {
    streetNameParts = streetNameParts.slice(0, -1); // Exclude suffix
  }
  const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

  const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and StandardStatus eq 'Active'`;

  // console.log('Active Filter:', filter);

  return fetchListingsWithMedia(filter);
}

export async function getRecentlySoldListings(slug, daysAgo = 90) {
  const parts = slug.split('-');
  const streetNumber = parts[0];
  let streetNameParts = parts.slice(1);
  const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
  if (suffixes.includes(lastPart)) {
    streetNameParts = streetNameParts.slice(0, -1); // Exclude suffix
  }
  const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

  const now = new Date();
  const sinceDate = new Date(now.getTime() - daysAgo * 86400000).toISOString().split('T')[0]; // YYYY-MM-DD for Edm.Date

  const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and StandardStatus eq 'Closed' and CloseDate ge ${sinceDate} and not (TransactionType eq 'For Lease')`;

  // console.log('Sold Filter:', filter);

  return fetchListingsWithMedia(filter, 'CloseDate desc');
}

// Utility function to fetch media for a single listing
export async function getListingMedia(listingKey) {
  const media = await fetchMediaForListing(listingKey);
  return media ? {
    url: media.MediaURL,
    description: media.MediaDescription
  } : null;
}