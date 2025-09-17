import { fetchODataListings, fetchSingleMediaForListing } from '@/lib/actions/listingActions';
import { getFavoriteListings } from '@/lib/actions/favorites';
import ListingCard from '@/components/ListingCard';
import ListingSection from '@/components/condo/ListingSection';

export default async function AvailableListings({ condoAddress, agentName }) {
  
  // Handle empty or invalid condoAddress
  if (!condoAddress) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No address provided.</p>
      </div>
    );
  }

  // Parse address using the same logic as the old implementation
  const parts = condoAddress.split('-');
  const streetNumber = parts[0];
  let streetNameParts = parts.slice(1);
  
  // Handle case where address is empty or has no parts
  if (!streetNumber || streetNameParts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Invalid address format.</p>
      </div>
    );
  }
  
  // Common street suffixes to remove (lowercase)
  const suffixes = ['rd', 'st', 'ave', 'blvd', 'dr', 'ln', 'cir', 'ct', 'pl', 'ter', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'circle', 'court', 'place', 'terrace'];
  
  // Check if the last part is a suffix and remove it
  const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
  if (suffixes.includes(lastPart)) {
    streetNameParts = streetNameParts.slice(0, -1); // Exclude suffix
  }
  
  const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

  const formData = new FormData();
  formData.append('streetNumber', streetNumber);
  formData.append('streetName', streetName);

  console.log(`Searching for: Number=${streetNumber}, Name=${streetName}`);

  let listings = null;
  let error = null;
  let favoriteListings = {};

  try {
    // Fetch favorite listings
    const { data: favoritesData } = await getFavoriteListings();
    favoriteListings = favoritesData || {};

    // Fetch property listings
    const propertyData = await fetchODataListings(formData);
    listings = await Promise.all(
      propertyData.map(async (listing) => {
        const featuredImage = await fetchSingleMediaForListing(listing.ListingKey);
        return { ...listing, featuredImage };
      })
    );
  } catch (err) {
    error = err.message;
  }

  // Split listings into sales and leases
  let saleListings = [];
  let leaseListings = [];
  
  if (listings && listings.length > 0) {
    saleListings = listings.filter(listing =>
      listing.transaction_type && listing.transaction_type.toLowerCase().includes('sale')
    );
    leaseListings = listings.filter(listing =>
      listing.transaction_type && listing.transaction_type.toLowerCase().includes('lease')
    );
  }

  return (
    <div>
      {listings && listings.length > 0 ? (
        <div>
          {saleListings.length > 0 && (
            <ListingSection 
              listings={saleListings} 
              title="Properties For Sale" 
              condoAddress={condoAddress} 
              agentName={agentName}
              favoriteListings={favoriteListings}
            />
          )}
          
          {leaseListings.length > 0 && (
            <ListingSection
              listings={leaseListings} 
              title="Properties For Lease" 
              condoAddress={condoAddress} 
              agentName={agentName}
              favoriteListings={favoriteListings}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No listings available for this property at the moment.</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}
