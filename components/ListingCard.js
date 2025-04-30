'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { toggleFavoriteListing } from '@/lib/actions/favorites';
import { useRouter } from 'next/navigation';

export default function ListingCard({ listing, condoAddress, agentName, initialIsFavorite = false, favoriteListings = null }) {
  // State for favorite status
  const [isFavorite, setIsFavorite] = useState(() => {
    if (!favoriteListings) return initialIsFavorite;
    // Check if listing key exists in the favoriteListings object
    return Object.prototype.hasOwnProperty.call(favoriteListings, listing.ListingKey);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // The listing details URL preserves the current URL structure
  const listingUrl = condoAddress
    ? `/${condoAddress}/${listing.ListingKey}`
    : `/listings/${listing.ListingKey}`;
    
  // Calculate days on market if ListDate is available
  const daysOnMarket = listing.ListDate ? 
    Math.floor((new Date() - new Date(listing.ListDate)) / (1000 * 60 * 60 * 24)) : null;
  
  // Handle favorite toggle
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('listing_key', listing.ListingKey);
    formData.append('listing_address', listing.UnparsedAddress);
    
    try {
      const result = await toggleFavoriteListing(formData);
      
      if (result.success) {
        setIsFavorite(!isFavorite);
        router.refresh(); // Refresh the page to update any other components
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col transition-all duration-200 overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md">
      {/* Image section with overlay information */}
      <div className="w-full relative">
        <Link href={listingUrl} className="block">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-t-md">
            {listing.featuredImage ? (
              <img
                src={`/image-proxy?url=${encodeURIComponent(listing.featuredImage.MediaURL)}`}
                alt={`Photo of ${listing.UnparsedAddress}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
        </Link>
        
        {/* Days on market - now separate from removed price tag overlay */}
        {daysOnMarket !== null && (
          <div className="absolute top-0 right-0 p-2 m-2 bg-black/60 text-white text-sm font-medium rounded-md">
            {daysOnMarket} days
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isSubmitting}
          className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'bg-red-50 text-red-600' 
              : 'bg-white/90 hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart 
            className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} 
          />
        </button>
      </div>
      
      {/* Content */}
      <Link href={listingUrl} className="block flex-grow">
        <div className="p-4">
          {/* Price */}
          <h3 className="font-semibold text-base mb-1">
            ${listing.ListPrice?.toLocaleString()}
          </h3>
          
          {/* Address */}
          <p className="text-sm text-gray-700 mb-2 truncate">
            {listing.UnparsedAddress}
          </p>
          
          {/* Main specs without icons */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div>
              {listing.BedroomsTotal || 0}{listing.BedroomsTotal === 1 ? ' BD' : ' BDs'}
            </div>
            <div>
              {listing.BathroomsTotalInteger || 0}{listing.BathroomsTotalInteger === 1 ? ' BA' : ' BAs'}
            </div>
            <div>
              {listing.LivingAreaRange || 0} sqft
            </div>
          </div>
          
          {/* Additional info */}
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex flex-wrap gap-2">
              {listing.ParkingTotal > 0 && (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                    <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                    <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                  </svg>
                  {listing.ParkingTotal} Parking
                </span>
              )}
              {listing.MlsStatus && (
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm font-medium">
                  {listing.MlsStatus}
                </span>
              )}
            </div>
            
            {/* MLS number */}
            <div className="text-xs text-gray-400">
              MLS#: {listing.ListingKey}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}