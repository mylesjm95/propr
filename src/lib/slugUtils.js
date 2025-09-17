/**
 * Utility functions for generating SEO-friendly slugs from listing data
 */

// Street suffix abbreviations (matching condo page logic)
const suffixAbbreviations = {
  'street': 'st',
  'avenue': 'ave', 
  'boulevard': 'blvd',
  'drive': 'dr',
  'lane': 'ln',
  'circle': 'cir',
  'court': 'ct',
  'place': 'pl',
  'terrace': 'ter',
  'road': 'rd'
};

/**
 * Generate a SEO-friendly slug from listing data
 * Format: {streetNumber}-{streetName}-{streetSuffix}/unit-{unitNumber}-{listingKey}
 * Example: "38-iannuzzi-st/unit-540-C12351068"
 */
export function generateListingSlug(listingData) {
  if (!listingData) return null;
  
  const { StreetNumber, StreetName, StreetSuffix, UnitNumber, ListingKey } = listingData;
  
  // Clean and format the components
  const streetNumber = StreetNumber ? StreetNumber.toString().toLowerCase() : '';
  const streetName = StreetName ? StreetName.toLowerCase().replace(/\s+/g, '-') : '';
  
  // Abbreviate street suffix to match condo page format
  let streetSuffix = '';
  if (StreetSuffix) {
    const suffixLower = StreetSuffix.toLowerCase();
    streetSuffix = suffixAbbreviations[suffixLower] || suffixLower;
  }
  
  const unitNumber = UnitNumber ? UnitNumber.toString().toLowerCase() : '';
  const listingKey = ListingKey || '';
  
  // Build the building address part
  const buildingAddress = [streetNumber, streetName, streetSuffix].filter(Boolean).join('-');
  
  // Build the unit part
  const unitPart = unitNumber && listingKey ? `unit-${unitNumber}-${listingKey}` : '';
  
  // Combine building address and unit
  if (buildingAddress && unitPart) {
    return `${buildingAddress}/${unitPart}`;
  } else if (buildingAddress) {
    return buildingAddress;
  } else if (unitPart) {
    return unitPart;
  }
  
  return null;
}

/**
 * Extract MLS number from a slug
 * Handles format: {building-address}/unit-{unitNumber}-{listingKey}
 * Looks for the MLS number after the last dash in the unit part
 */
export function extractMLSFromSlug(slug) {
  if (!slug) return null;
  
  // Split by slash to separate building address from unit part
  const parts = slug.split('/');
  
  if (parts.length === 2) {
    // Format: building-address/unit-unitNumber-listingKey
    const unitPart = parts[1];
    const unitParts = unitPart.split('-');
    
    // Find the last part that starts with a letter (MLS number)
    for (let i = unitParts.length - 1; i >= 0; i--) {
      if (unitParts[i] && /^[A-Z]/.test(unitParts[i])) {
        return unitParts[i];
      }
    }
    
    // Fallback: return the last part if no letter-starting part found
    return unitParts[unitParts.length - 1] || null;
  } else {
    // Fallback to old format handling
    const allParts = slug.split('-');
    
    // Find the last part that starts with a letter (MLS number)
    for (let i = allParts.length - 1; i >= 0; i--) {
      if (allParts[i] && /^[A-Z]/.test(allParts[i])) {
        return allParts[i];
      }
    }
    
    // Fallback: return the last part if no letter-starting part found
    return allParts[allParts.length - 1] || null;
  }
}

/**
 * Generate a human-readable URL from listing data
 * Example: "38 Iannuzzi Street #540 - C12351068"
 */
export function generateListingUrl(listingData) {
  if (!listingData) return null;
  
  const { StreetNumber, StreetName, StreetSuffix, UnitNumber, ListingKey } = listingData;
  
  const address = [StreetNumber, StreetName, StreetSuffix].filter(Boolean).join(' ');
  const unit = UnitNumber ? `#${UnitNumber}` : '';
  const mls = ListingKey || '';
  
  return [address, unit, mls].filter(Boolean).join(' - ');
}
