'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { IoBedOutline } from "react-icons/io5";
import { FaBath, FaParking } from "react-icons/fa";
import { TbRulerMeasure } from "react-icons/tb";
// import { toggleFavoriteListing } from '@/lib/actions/favorites';
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
    ? `/${condoAddress}/${listing.listing_key}`
    : `/listings/${listing.listing_key}`;
    
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
      // const result = await toggleFavoriteListing(formData);
      
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
            ${listing.list_price?.toLocaleString()}
          </h3>
          
          {/* Address */}
          <p className="text-sm text-gray-700 mb-2 truncate">
            {listing.unparsed_address}
          </p>
          
          {/* Main specs with icons on a single line */}
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <IoBedOutline className="w-4 h-4 text-gray-600" />
              <span>{listing.bedrooms_total || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="w-3.5 h-3.5 text-gray-600" />
              <span>{listing.bathrooms_total || 0}</span>
            </div>
            {listing.parking_total > 0 && (
              <div className="flex items-center gap-1">
                <FaParking className="w-3.5 h-3.5 text-gray-600" />
                <span>{listing.parking_total}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <TbRulerMeasure className="w-4 h-4 text-gray-600" />
              <span>{listing.living_area || 0}</span>
            </div>
          </div>
          
          {/* Additional info */}
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex flex-wrap gap-2">
              {listing.mls_status && (
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm font-medium">
                  {listing.mls_status}
                </span>
              )}
            </div>
            
            {/* MLS number */}
            <div className="text-xs text-gray-400">
              MLS#: {listing.listing_key}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}