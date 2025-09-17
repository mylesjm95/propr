import { Suspense } from 'react';
import CondoHeroSection from '@/components/condo/CondoHeroSection';
import AvailableListings from '@/components/condo/AvailableListings';
// import UnavailableListingsServer from '@/components/condo/UnavailableListingsServer';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
// import FloatingUpdateButton from '@/components/condo/FloatingUpdateButton';

export default async function CondoPage({ params }) {
  const { condoAddress, agentName } = await params;
  
  return (
    <div>
      {/* Hero Section with Two Columns */}
      <CondoHeroSection condoAddress={condoAddress} />
      
      {/* Floating button for building updates */}
      {/* <FloatingUpdateButton condoAddress={condoAddress} /> */}
      
      {/* Additional Content Section */}
      {/* <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Property Details</h2>
        <p>More information about this property coming soon...</p>
      </section> */}

      {/* Available Listings Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-8">Available Listings at {decodeURIComponent(condoAddress)}</h2>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill().map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        }>
          <AvailableListings condoAddress={condoAddress} agentName={agentName} />
        </Suspense>
      </section>

      {/* Listing History Timeline Section */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-8">Listing History</h2>
        
        <Suspense fallback={
          <div className="space-y-4">
            <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
        }>
          <UnavailableListingsServer condoAddress={condoAddress} />
        </Suspense>
      </section> */}

      {/* Statistics Section */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-8">Key Statistics</h2>
      </section> */}
    </div>
  );
}