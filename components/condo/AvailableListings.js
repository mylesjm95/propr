import { fetchODataListings, fetchSingleMediaForListing } from '@/lib/actions/listings';
import { getFavoriteListings } from '@/lib/actions/favorites';
import ListingCard from '@/components/ListingCard';
import ListingSection from '@/components/condo/ListingSection';

export default async function AvailableListings({ condoAddress, agentName }) {
  
  const address = decodeURIComponent(condoAddress)
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Parse address into street number and street name (without suffix)
  const addressParts = address.trim().split(' ');
  const streetNumber = addressParts[0]; // First part is typically the street number
  
  // Common street suffixes to remove
  const suffixes = ['Road', 'Rd', 'Street', 'St', 'Avenue', 'Ave', 'Drive', 'Dr', 'Court', 'Ct', 
                    'Boulevard', 'Blvd', 'Lane', 'Ln', 'Way', 'Place', 'Pl', 'Terrace', 'Circle', 'Cir'];
  
  // Get all parts except the first (number) and potentially the last (suffix)
  let streetNameParts = addressParts.slice(1);
  const lastPart = streetNameParts[streetNameParts.length - 1];
  
  // Check if the last part is a suffix
  if (suffixes.some(suffix => suffix.toLowerCase() === lastPart.toLowerCase())) {
    // Remove suffix
    streetNameParts = streetNameParts.slice(0, -1);
  }
  
  const streetName = streetNameParts.join(' ');

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
      listing.TransactionType && listing.TransactionType.toLowerCase().includes('sale')
    );
    leaseListings = listings.filter(listing =>
      listing.TransactionType && listing.TransactionType.toLowerCase().includes('lease')
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
