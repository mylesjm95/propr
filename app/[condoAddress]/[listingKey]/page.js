import { getListingById, fetchMediaForListing } from '@/lib/actions/listings';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import ListingDataSection from './ListingDataSection';
import TruncatedDescription from './TruncatedDescription';
import GoogleMapCard from './GoogleMapCard';

export default async function ListingPage({ params }) {
  const { listingKey } = await params;

  try {
    // Fetch listing data and media
    const [listing, media] = await Promise.all([
      getListingById(listingKey),
      fetchMediaForListing(listingKey)
    ]);

    console.log("Listing data:", listing);

    // If no listing found, return early
    if (!listing) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Listing Not Found</h1>
          <p>No listing found for ID: {listingKey}</p>
        </div>
      );
    }

    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US').format(listing.ListPrice);
    
    return (
      <div>
        {/* Hero section with address, price and image gallery - styled to match [condoAddress] page */}
        <section className="pt-32 pb-16 md:py-32 lg:py-40 relative overflow-hidden bg-[#292a2d]">
          {/* Background that extends to the top of the page */}
          <div className="absolute inset-0 bg-[#292a2d] -z-10"></div>
          
          <div className="container mx-auto px-4 max-w-[90%]">
            {/* Address section - only showing the address */}
            <div className="mb-3">
              <h2 className="text-xl md:text-2xl font-normal text-white">
                {listing.UnparsedAddress}
              </h2>
            </div>
            
            {/* Image Gallery - now with more vertical space */}
            <div className="w-full rounded-lg overflow-hidden h-[400px] md:h-[500px]">
              <PropertyImageGallery media={media} />
            </div>
          </div>
        </section>
        
        <div className="bg-[#fbfbf9]">
          <div className="container mx-auto px-4 py-8">
            
            {/* Property details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-8">
              {/* Main details column */}
              <div className="md:col-span-2">
                {/* Key Facts Card */}
                <div className="p-8 md:p-10 rounded-lg shadow-sm" style={{ background: "linear-gradient(28.01deg, #dadae0 16.6%, #ebebe6 82.01%)" }}>
                  <div className="flex flex-col">
                    <div className="inline-block text-gray-700 font-semibold mb-2">Key Facts</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Beds</p>
                        <p className="text-lg font-medium">{listing.BedroomsTotal || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Baths</p>
                        <p className="text-lg font-medium">{listing.BathroomsTotalInteger || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Parking</p>
                        <p className="text-lg font-medium">{listing.ParkingTotal || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Square Feet</p>
                        <p className="text-lg font-medium">{listing.LivingArea ? `${listing.LivingArea} ${listing.LivingAreaUnits || 'sq ft'}` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Possession</p>
                        <p className="text-lg font-medium">{listing.PossessionDate || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Description with Read More button and fade effect using client component */}
                    <div className="mt-auto">
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <TruncatedDescription description={listing.PublicRemarks} />
                    </div>
                  </div>
                </div>
                
                {/* Now removing the separate full description section since it's in the Key Facts card */}
                {/* Client-side component for listing data with search functionality */}
                <ListingDataSection listing={listing} />
                
                {/* Google Map Card */}
                <div className="mt-10 mb-8">
                  <h3 className="text-xl font-semibold mb-5 text-gray-800">Location</h3>
                  <div className="p-8 md:p-10 rounded-lg shadow-sm" style={{ background: "linear-gradient(28.01deg, #dadae0 16.6%, #ebebe6 82.01%)" }}>
                    <div className="h-[350px]">
                      <GoogleMapCard 
                        address={listing.UnparsedAddress} 
                        lat={listing.Latitude} 
                        lng={listing.Longitude}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar with price card and sticky contact card */}
              <div className="relative space-y-4">
                {/* Price card */}
                <div className="p-8 md:p-10 rounded-lg shadow-sm bg-[#e3dfcf] flex flex-col">
                  <div className="inline-block text-gray-700 font-semibold mb-4">Price</div>
                  <div className="text-3xl font-bold text-gray-800">
                    ${formattedPrice}
                  </div>
                  {listing.ListingTerms && (
                    <div className="mt-1 text-sm text-gray-600">
                      {listing.ListingTerms}
                    </div>
                  )}
                </div>
                
                {/* Contact card */}
                <div className="sticky top-24 p-8 md:p-10 rounded-lg shadow-sm bg-[#e3dfcf] flex flex-col">
                  <div className="inline-block text-gray-700 font-semibold mb-4">Contact</div>
                  <div className="space-y-4">
                    {listing.ListAgentName && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Listing Agent</p>
                        <p className="text-lg font-medium">{listing.ListAgentName}</p>
                      </div>
                    )}
                    {listing.ListOfficeName && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Listing Office</p>
                        <p className="text-lg font-medium">{listing.ListOfficeName}</p>
                      </div>
                    )}
                    {listing.ListAgentPhone && (
                      <div className="flex items-center gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-gray-700 flex-shrink-0">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span className="text-sm overflow-hidden text-ellipsis">{listing.ListAgentPhone}</span>
                      </div>
                    )}
                    {listing.ListAgentEmail && (
                      <div className="flex items-center gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-gray-700 flex-shrink-0">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="text-sm overflow-hidden text-ellipsis">{listing.ListAgentEmail}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-6">
                    <button className="w-full bg-gray-800 hover:bg-black text-white py-3 px-6 rounded-md transition-colors font-medium">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ListingPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Error Loading Listing</h1>
        <p>There was a problem loading this listing.</p>
      </div>
    );
  }
}