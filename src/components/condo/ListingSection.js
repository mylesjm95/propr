'use client';

import { useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';

export default function ListingSection({ 
  listings,
  title,
  condoAddress,
  agentName,
  initialDisplayCount = 8,
  favoriteListings = []
}) {
  const [showAll, setShowAll] = useState(false);
  
  // Determine if we need to show the "Show More" button
  const hasMoreListings = listings.length > initialDisplayCount;
  
  // Determine which listings to show based on current state
  const displayedListings = showAll ? listings : listings.slice(0, initialDisplayCount);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedListings.map((listing, index) => (
          <ListingCard
            key={listing.ListingKey || index} 
            listing={listing} 
            condoAddress={condoAddress}
            // agentName={agentName}
            // favoriteListings={favoriteListings}
          />
        ))}
      </div>
      
      {hasMoreListings && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="lg"
          >
            {showAll ? 'Show Less' : `Show ${listings.length - initialDisplayCount} More`}
          </Button>
        </div>
      )}
    </div>
  );
}
